// Minimal unit tests for workers/api, in the same spirit as workers/signup/test.mjs (no
// dependencies, loads the real worker source, fakes D1 + KV). Covers the feedback endpoints
// (Phase C) end to end against a fake DB — the rest of the Worker (auth/progress/admin
// overview/learners) has no tests yet; this is a starting point, not full coverage.

import fs from "node:fs";

const src = fs.readFileSync(new URL("./index.js", import.meta.url), "utf8");
const mod = await import("data:text/javascript," + encodeURIComponent(src));
const worker = mod.default;

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// A tiny fake D1 — matches statements by substring rather than exact text, so it tolerates
// whitespace/formatting changes to the SQL in index.js without going out of sync silently.
function makeFakeDB({ users = [], sessions = [] } = {}) {
  const feedback = [];

  async function first(sql, args) {
    if (sql.includes("FROM sessions WHERE token_hash")) {
      return sessions.find(s => s.token_hash === args[0]) || null;
    }
    if (sql.includes("FROM users WHERE id")) {
      return users.find(u => u.id === args[0]) || null;
    }
    return null;
  }
  async function run(sql, args) {
    if (sql.startsWith("INSERT INTO feedback")) {
      const [id, user_id, text, page_context, rating, created_at] = args;
      feedback.push({ id, user_id, text, page_context, rating, created_at });
    }
    return { success: true };
  }
  async function all(sql) {
    if (sql.includes("FROM feedback JOIN users")) {
      const rows = feedback.slice()
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map(f => ({
          id: f.id, text: f.text, page_context: f.page_context, rating: f.rating,
          created_at: f.created_at,
          email: (users.find(u => u.id === f.user_id) || {}).email,
        }));
      return { results: rows };
    }
    return { results: [] };
  }

  // D1's real prepare() exposes .first/.run/.all directly (no bind() needed when a query has
  // no placeholders) AND after .bind(...args) — mirror both shapes here.
  function prepare(sql) {
    const stmt = {
      bind: (...args) => ({
        first: () => first(sql, args),
        run: () => run(sql, args),
        all: () => all(sql, args),
      }),
      first: () => first(sql, []),
      run: () => run(sql, []),
      all: () => all(sql, []),
    };
    return stmt;
  }
  return { prepare, _feedback: feedback };
}

function makeKV() {
  const store = new Map();
  return {
    get: async (k) => store.get(k) ?? null,
    put: async (k, v) => store.set(k, v),
  };
}

async function makeEnv({ role = "learner" } = {}) {
  const rawToken = "test-session-token";
  const tokenHash = await sha256Hex(rawToken);
  const user = { id: "u1", email: "learner@example.com", display_name: null, created_at: "2026-01-01T00:00:00.000Z", role };
  const session = { token_hash: tokenHash, user_id: user.id, created_at: "2026-01-01T00:00:00.000Z", expires_at: "2099-01-01T00:00:00.000Z" };
  const env = {
    DB: makeFakeDB({ users: [user], sessions: [session] }),
    SIGNUPS: makeKV(),
    RESEND_API_KEY: "", DEV_LINKS: "true", APP_ORIGIN: "https://aifaculty.org",
    rate_limit: { window_seconds: 3600, max_per_ip: 3 },
  };
  return { env, rawToken, user };
}

async function req(path, { method = "GET", body, token, ip = "1.2.3.4" } = {}) {
  const headers = { "CF-Connecting-IP": ip };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Cookie"] = `af_session=${token}`;
  return new Request("https://aifaculty.org" + path, {
    method, headers, body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("  ok  " + name); }
  else { fail++; console.log("  FAIL " + name); }
}

// 1. unknown route -> 404
{
  const { env } = await makeEnv();
  const r = await worker.fetch(await req("/nope"), env);
  check("404 on unknown path", r.status === 404);
}

// 2. OPTIONS preflight -> 204
{
  const { env } = await makeEnv();
  const r = await worker.fetch(await req("/api/feedback", { method: "OPTIONS" }), env);
  check("204 on OPTIONS", r.status === 204);
}

// 3. POST /api/feedback with no session -> 401
{
  const { env } = await makeEnv();
  const r = await worker.fetch(await req("/api/feedback", { method: "POST", body: { text: "hi" } }), env);
  check("401 feedback without session", r.status === 401);
}

// 4. POST /api/feedback signed in, empty text -> 400
{
  const { env, rawToken } = await makeEnv();
  const r = await worker.fetch(await req("/api/feedback", { method: "POST", body: { text: "   " }, token: rawToken }), env);
  check("400 empty feedback text", r.status === 400 && (await r.json()).error === "empty_text");
}

// 5. POST /api/feedback signed in, too long -> 400
{
  const { env, rawToken } = await makeEnv();
  const r = await worker.fetch(await req("/api/feedback", { method: "POST", body: { text: "x".repeat(4001) }, token: rawToken }), env);
  check("400 feedback too long", r.status === 400 && (await r.json()).error === "too_long");
}

// 6. POST /api/feedback signed in, valid -> 200, row stored with the right user + rating clamp
{
  const { env, rawToken, user } = await makeEnv();
  const r = await worker.fetch(await req("/api/feedback", {
    method: "POST", body: { text: "Loved the F1 lesson.", rating: 5, pageContext: "#/learn/F1/2" }, token: rawToken,
  }), env);
  const body = await r.json();
  check("200 valid feedback", r.status === 200 && body.ok === true);
  check("row stored for the right user", env.DB._feedback.length === 1 && env.DB._feedback[0].user_id === user.id);
  check("rating stored", env.DB._feedback[0].rating === 5);
}

// 7. POST /api/feedback with an out-of-range rating -> stored as null, not rejected
{
  const { env, rawToken } = await makeEnv();
  const r = await worker.fetch(await req("/api/feedback", {
    method: "POST", body: { text: "Rating out of range", rating: 9 }, token: rawToken,
  }), env);
  check("200 with bad rating (ignored, not rejected)", r.status === 200);
  check("bad rating not stored", env.DB._feedback[0].rating === null);
}

// 8. rate limit -> 429 after the configured threshold (max_per_ip: 3 in makeEnv)
{
  const { env, rawToken } = await makeEnv();
  for (let i = 0; i < 3; i++) {
    await worker.fetch(await req("/api/feedback", { method: "POST", body: { text: `msg ${i}` }, token: rawToken }), env);
  }
  const r = await worker.fetch(await req("/api/feedback", { method: "POST", body: { text: "one too many" }, token: rawToken }), env);
  check("429 rate limited after threshold", r.status === 429 && (await r.json()).error === "rate_limited");
}

// 9. GET /api/admin/feedback as a plain learner -> 403
{
  const { env, rawToken } = await makeEnv({ role: "learner" });
  const r = await worker.fetch(await req("/api/admin/feedback", { token: rawToken }), env);
  check("403 admin/feedback as learner", r.status === 403);
}

// 10. GET /api/admin/feedback with no session -> 401 (before the role check even applies)
{
  const { env } = await makeEnv();
  const r = await worker.fetch(await req("/api/admin/feedback"), env);
  check("401 admin/feedback signed out", r.status === 401);
}

// 11. GET /api/admin/feedback as founder -> 200 with the submitted row, newest first
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  await worker.fetch(await req("/api/feedback", {
    method: "POST", body: { text: "First", pageContext: "#/" }, token: rawToken,
  }), env);
  // force a distinct, later timestamp than the mock's created_at by inserting a second row directly
  env.DB._feedback.push({
    id: "manual-2", user_id: "u1", text: "Second (newer)", page_context: "#/pathways",
    rating: null, created_at: "2099-01-01T00:00:00.000Z",
  });
  const r = await worker.fetch(await req("/api/admin/feedback", { token: rawToken }), env);
  const body = await r.json();
  check("200 admin/feedback as founder", r.status === 200 && body.ok === true);
  check("2 rows returned", body.feedback.length === 2);
  check("newest first", body.feedback[0].text === "Second (newer)");
  check("email joined from users", body.feedback[0].email === "learner@example.com");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
