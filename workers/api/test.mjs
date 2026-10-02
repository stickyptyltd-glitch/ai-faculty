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
  const payments = [];
  const facultyCalls = [];
  const submissions = [];
  const activityRows = [];
  const facultyReviews = [];
  const founderPasswords = [];
  const passwordFailures = [];
  const usersRows = users.map(u => ({ plan: "free", plan_status: "none", stripe_customer_id: null, ...u }));

  async function first(sql, args) {
    const flat = sql.replace(/\s+/g, " ");
    if (flat.includes("FROM sessions WHERE token_hash")) {
      return sessions.find(s => s.token_hash === args[0]) || null;
    }
    if (flat.includes("FROM users WHERE id")) {
      return usersRows.find(u => u.id === args[0]) || null;
    }
    if (flat.includes("FROM users WHERE email")) {
      const email = String(args[0] || "").toLowerCase();
      return usersRows.find(u => u.email === email) || null;
    }
    if (flat.includes("FROM users WHERE stripe_customer_id")) {
      return usersRows.find(u => u.stripe_customer_id === args[0]) || null;
    }
    if (flat.includes("FROM users") && flat.includes("role != 'learner'")) {
      return { n: usersRows.filter(u => (u.role || "learner") !== "learner").length };
    }
    if (flat.includes("FROM founder_passwords WHERE user_id")) {
      return founderPasswords.find(p => p.user_id === args[0]) || null;
    }
    if (flat.includes("FROM password_failures WHERE user_id")) {
      return passwordFailures.find(p => p.user_id === args[0]) || null;
    }
    if (flat.includes("SELECT id FROM faculty_calls WHERE id")) {
      return facultyCalls.find(c => c.id === args[0]) || null;
    }
    if (flat.includes("FROM faculty_calls WHERE user_id = ? AND cp_id")) {
      const ls = facultyCalls
        .filter(c => c.user_id === args[0] && c.cp_id === args[1] && c.verdict !== "ready")
        .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
      return ls[0] || null;
    }
    if (flat.includes("COUNT(*") && flat.includes("LEFT JOIN faculty_reviews")) {
      return { n: facultyCalls.filter(c => c.verdict !== "ready" && !facultyReviews.some(r => r.call_id === c.id)).length };
    }
    if (flat.includes("COUNT(*") && flat.includes("FROM faculty_calls WHERE verdict")) {
      return { n: facultyCalls.filter(c => c.verdict !== "ready").length };
    }
    if (flat.includes("COUNT(*") && flat.includes("FROM faculty_reviews")) {
      return { n: facultyReviews.length };
    }
    if (flat.includes("COUNT(*") && flat.includes("FROM d1_migrations")) {
      return { n: 0 };
    }
    if (flat.includes("COUNT(*") && flat.includes("FROM faculty_calls")) {
      return { n: facultyCalls.length };
    }
    return null;
  }
  async function run(sql, args) {
    if (sql.startsWith("INSERT INTO submissions")) {
      const [id, user_id, kind, pathway_id, cap_id, challenge_id, checkpoint_id, band, confidence,
             fields_json, started_at, completed_at, duration_ms] = args;
      submissions.push({ id, user_id, kind, pathway_id, cap_id, challenge_id, checkpoint_id, band,
        confidence, fields_json, started_at, completed_at, duration_ms });
    } else if (sql.startsWith("INSERT INTO activity_log")) {
      const [id, user_id, ts, kind, detail] = args;
      activityRows.push({ id, user_id, ts, kind, detail });
    } else if (sql.startsWith("INSERT INTO feedback")) {
      const [id, user_id, text, page_context, rating, created_at] = args;
      feedback.push({ id, user_id, text, page_context, rating, created_at });
    } else if (sql.startsWith("INSERT INTO users")) {
      const [id, email, display_name, created_at] = args;
      usersRows.push({ id, email, display_name, created_at, role: "learner", plan: "free", plan_status: "none", stripe_customer_id: null });
    } else if (sql.includes("WHERE stripe_customer_id = ?")) {
      const [plan, status, cust] = args; // subscription sync: (plan, status, stripe_customer_id)
      const u = usersRows.find(u => u.stripe_customer_id === cust);
      // Honour the AND plan != 'founding' guard the real SQL carries, otherwise this fake would
      // happily apply an update production rejects and the test would prove nothing.
      const skipsFounding = sql.includes("plan != 'founding'");
      if (u && !(skipsFounding && u.plan === "founding")) { u.plan = plan; u.plan_status = status; }
    } else if (sql.startsWith("UPDATE users SET role")) {
      const [role, id] = args;
      const u = usersRows.find(u => u.id === id);
      if (u) u.role = role;
    } else if (sql.startsWith("UPDATE users SET plan")) {
      const [plan, planStatus, stripeId, userId] = args; // applyGrant order
      const u = usersRows.find(u => u.id === userId);
      if (u) { u.plan = plan; u.plan_status = planStatus; if (stripeId) u.stripe_customer_id = stripeId; }
    } else if (sql.startsWith("INSERT OR IGNORE INTO payments")) {
      const [id, user_id, stripe_event_id, event_type, plan, amount, currency, status, created_at] = args;
      if (!payments.some(p => p.stripe_event_id === stripe_event_id)) {
        payments.push({ id, user_id, stripe_event_id, event_type, plan, amount_cents: amount, currency, status, created_at });
      }
    } else if (sql.startsWith("INSERT INTO sessions")) {
      const [token_hash, user_id, created_at, expires_at] = args;
      sessions.push({ token_hash, user_id, created_at, expires_at });
    } else if (sql.startsWith("INSERT INTO founder_passwords")) {
      const [user_id, salt, hash, iterations, created_at, updated_at] = args;
      founderPasswords.push({ user_id, salt, hash, iterations, created_at, updated_at });
    } else if (sql.startsWith("UPDATE founder_passwords")) {
      const [salt, hash, iterations, updated_at, user_id] = args;
      const p = founderPasswords.find(p => p.user_id === user_id);
      if (p) Object.assign(p, { salt, hash, iterations, updated_at });
    } else if (sql.startsWith("INSERT INTO password_failures")) {
      const [user_id, fails, locked_until, updated_at] = args;
      passwordFailures.push({ user_id, fails, locked_until, updated_at });
    } else if (sql.startsWith("UPDATE password_failures")) {
      const [fails, locked_until, updated_at, user_id] = args;
      const p = passwordFailures.find(p => p.user_id === user_id);
      if (p) Object.assign(p, { fails, locked_until, updated_at });
    } else if (sql.startsWith("DELETE FROM password_failures")) {
      const i = passwordFailures.findIndex(p => p.user_id === args[0]);
      if (i >= 0) passwordFailures.splice(i, 1);
    } else if (sql.includes("DELETE FROM sessions WHERE user_id")) {
      const keep = args[1];
      for (let i = sessions.length - 1; i >= 0; i--) {
        if (sessions[i].user_id === args[0] && sessions[i].token_hash !== keep) sessions.splice(i, 1);
      }
    } else if (sql.startsWith("INSERT INTO faculty_calls")) {
      const [id, kind, user_id, cp_id, rubric_dims, submission_json, policy_id, adapter, model,
        bands_json, verdict, confidence, degraded, status, latency_ms, created_at] = args;
      facultyCalls.push({ id, kind, user_id, cp_id, rubric_dims, submission_json, policy_id, adapter,
        model, bands_json, verdict, confidence, degraded, status, latency_ms, created_at });
    } else if (sql.startsWith("INSERT INTO faculty_reviews")) {
      const [id, call_id, reviewer_user_id, decision, note, created_at] = args;
      const existing = facultyReviews.find(r => r.call_id === call_id);
      if (existing) { Object.assign(existing, { reviewer_user_id, decision, note, created_at }); }
      else facultyReviews.push({ id, call_id, reviewer_user_id, decision, note, created_at });
    }
    return { success: true };
  }
  async function all(sql, args = []) {
    if (sql.includes("FROM feedback JOIN users")) {
      const rows = feedback.slice()
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map(f => ({
          id: f.id, text: f.text, page_context: f.page_context, rating: f.rating,
          created_at: f.created_at,
          email: (usersRows.find(u => u.id === f.user_id) || {}).email,
        }));
      return { results: rows };
    }
    if (sql.includes("FROM users GROUP BY role")) {
      const m = {};
      for (const u of usersRows) m[u.role || "learner"] = (m[u.role || "learner"] || 0) + 1;
      return { results: Object.entries(m).map(([role, n]) => ({ role, n })) };
    }
    if (sql.includes("FROM users") && sql.includes("GROUP BY plan")) {
      const m = {};
      for (const u of usersRows) {
        if ((u.role || "learner") !== "learner") continue;
        m[u.plan] = (m[u.plan] || 0) + 1;
      }
      return { results: Object.entries(m).map(([plan, n]) => ({ plan, n })) };
    }
    if (sql.includes("FROM payments WHERE status")) {
      const paid = payments.filter(p => p.status === "succeeded");
      return { results: [{ total: paid.reduce((s, p) => s + p.amount_cents, 0), n: paid.length }] };
    }
    if (sql.includes("FROM submissions s JOIN users")) {
      const u = new Map(usersRows.map(x => [x.id, x]));
      return { results: submissions.filter(s2 => ((u.get(s2.user_id) || {}).role || "learner") === "learner") };
    }
    if (sql.includes("FROM activity_log") && !sql.includes("WHERE user_id = ?")) {
      // unfiltered: serves every row, so dropping the role filter is observable in tests
      if (sql.includes("JOIN users")) {
        const u = new Map(usersRows.map(x => [x.id, x]));
        return { results: activityRows.filter(a => ((u.get(a.user_id) || {}).role || "learner") === "learner") };
      }
      return { results: activityRows };
    }
    if (sql.includes("FROM activity_log a JOIN users")) {
      const u = new Map(usersRows.map(x => [x.id, x]));
      return { results: activityRows.filter(a => ((u.get(a.user_id) || {}).role || "learner") === "learner") };
    }
    if (sql.includes("FROM submissions")) {
      if (sql.includes("WHERE user_id = ?")) {
        const uid = args[0];
        return { results: submissions.filter(s => s.user_id === uid)
          .sort((a, b) => String(b.completed_at || "").localeCompare(String(a.completed_at || ""))) };
      }
      return { results: submissions };
    }
    if (sql.includes("FROM faculty_reviews") && !sql.includes("JOIN")) {
      return { results: facultyReviews.map(r => ({ ...r })) };
    }
    if (sql.includes("FROM faculty_calls") && !sql.includes("LEFT JOIN") && !sql.includes("WHERE")) {
      return { results: facultyCalls.slice().sort((a, b) =>
        String(b.created_at || "").localeCompare(String(a.created_at || ""))) };
    }
    if (sql.includes("FROM users") && sql.includes("role = 'learner'") && !sql.includes("GROUP BY") && !sql.includes("COUNT")) {
      return { results: usersRows.filter((u) => (u.role || "learner") === "learner").map((u) => ({ id: u.id, email: u.email, created_at: u.created_at })) };
    }
    if (sql.includes("FROM users") && !sql.includes("LEFT JOIN")) return { results: usersRows };
    if (sql.includes("LEFT JOIN faculty_reviews") && sql.includes("reviewer.email")) {
      const rows = facultyCalls
        .filter(c => c.verdict !== "ready")
        .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
        .map(c => {
          const r = facultyReviews.find(r2 => r2.call_id === c.id) || null;
          return {
            call_id: c.id, cp_id: c.cp_id, adapter: c.adapter, model: c.model, verdict: c.verdict,
            call_at: c.created_at,
            learner_email: (usersRows.find(u => u.id === c.user_id) || {}).email,
            review_id: r ? r.id : null, decision: r ? r.decision : null, note: r ? r.note : null,
            reviewed_at: r ? r.created_at : null,
            reviewer_email: r ? (usersRows.find(u => u.id === r.reviewer_user_id) || {}).email : null,
          };
        });
      return { results: rows };
    }
    if (sql.includes("LEFT JOIN faculty_reviews") && sql.includes("user_id = ?")) {
      const rows = facultyCalls
        .filter(c => c.user_id === args[0] && c.verdict !== "ready")
        .map(c => {
          const r = facultyReviews.find(r2 => r2.call_id === c.id) || null;
          return {
            call_id: c.id, cp_id: c.cp_id, verdict: c.verdict, call_at: c.created_at,
            review_id: r ? r.id : null, decision: r ? r.decision : null, note: r ? r.note : null,
            reviewed_at: r ? r.created_at : null,
          };
        });
      return { results: rows };
    }
    if (sql.includes("FROM faculty_calls LEFT JOIN users")) {
      const rows = facultyCalls.slice()
        .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
        .map(fc => ({
          id: fc.id, kind: fc.kind, user_id: fc.user_id, cp_id: fc.cp_id, policy_id: fc.policy_id,
          adapter: fc.adapter, model: fc.model, verdict: fc.verdict, confidence: fc.confidence,
          degraded: fc.degraded, latency_ms: fc.latency_ms, created_at: fc.created_at, status: fc.status,
          email: (usersRows.find(u => u.id === fc.user_id) || {}).email,
        }));
      // Honour the projection. This fake used to return every column regardless of what the
      // SELECT asked for, which made it impossible to fail a test by dropping a column from the
      // query: the fake supplied it anyway and the assertion passed. Real D1 does not do that, so
      // a test could pass here and fail in production on exactly the field it claimed to check.
      const sel = sql.slice(sql.indexOf("SELECT") + 6, sql.indexOf("FROM faculty_calls"));
      const cols = sel.split(",").map(c => c.trim()).filter(Boolean)
        .map(c => { const t = c.split(/\s+/).pop(); return t.split(".").pop(); });
      return { results: rows.map(r => {
        const out = {};
        for (const c of cols) if (c in r) out[c] = r[c];
        return out;
      }) };
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
  return { prepare, _feedback: feedback, _submissions: submissions, _payments: payments, _users: usersRows, _faculty: facultyCalls, _reviews: facultyReviews, _activity: activityRows, _passwords: founderPasswords, _fails: passwordFailures, _sessions: sessions };
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
    // Mirrors workers/api/wrangler.toml. Tests that want the model path call modelEnv() to
    // override this; leaving it unset meant the suite never exercised the adapter setting
    // that production actually ships with.
    FACULTY_ADAPTER: "dry-run",
    FACULTY_MODEL_BASE_URL: "", FACULTY_MODEL_NAME: "", FACULTY_MODEL_KEY: "",
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

// ---- monetization (Phase 1.6) ------------------------------------------------

function makeStripeEnv() {
  const keyBytes = new Uint8Array(32).fill(7);
  const keyB64 = Buffer.from(keyBytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const password = {
    STRIPE_SECRET_KEY: "sk_test_abcdef",
    STRIPE_WEBHOOK_SECRET: "whsec_" + keyB64,
    STRIPE_PRICE_PRO_MONTHLY: "price_pro_monthly",
    STRIPE_PRICE_PRO_ANNUAL: "price_pro_annual",
    STRIPE_PRICE_FOUNDING: "price_founding",
  };
  return password;
}
function stripeSecretFor(env) { return env.STRIPE_WEBHOOK_SECRET; }

async function signStripe(secret, rawBody) {
  const keyB64 = secret.slice("whsec_".length);
  const keyBuf = Uint8Array.from(atob(keyB64), c => c.charCodeAt(0)).buffer;
  const key = await crypto.subtle.importKey("raw", keyBuf, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const t = Math.floor(Date.now() / 1000);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${rawBody}`));
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, "0")).join("");
  return `t=${t},v1=${hex}`;
}

// Swap in a Stripe API mock for the duration of fn; original fetch restored afterwards.
async function withStripe(handler) {
  const orig = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, opts) => {
    const u = String(url);
    if (!u.startsWith("https://api.stripe.com")) return orig(url, opts);
    const body = new URLSearchParams(opts.body);
    calls.push({ url: u, body });
    if (u.endsWith("/customers")) return new Response(JSON.stringify({ id: "cus_test" }), { status: 200 });
    if (u.endsWith("/checkout/sessions")) return new Response(JSON.stringify({ id: "cs_test", url: "https://checkout.stripe.com/c/pay/test" }), { status: 200 });
    if (u.endsWith("/billing_portal/sessions")) return new Response(JSON.stringify({ id: "bps_test", url: "https://billing.stripe.com/s/portal" }), { status: 200 });
    return new Response(JSON.stringify({ error: { message: "unexpected" } }), { status: 500 });
  };
  try { const out = await handler(calls); return out; }
  finally { globalThis.fetch = orig; }
}

// 12. GET /api/payments/plans is public and lists the catalogue, disabled until Stripe is set
{
  const { env } = await makeEnv();
  const r = await worker.fetch(await req("/api/payments/plans"), env);
  const body = await r.json();
  check("200 payments/plans public", r.status === 200 && body.ok === true);
  check("stripe disabled by default", body.stripeEnabled === false);
  check("plans include pro + founding", !!body.plans.pro && !!body.plans.founding);
}

// 13. POST /api/payments/checkout -> 501 until Stripe is configured
{
  const { env } = await makeEnv();
  const r = await worker.fetch(await req("/api/payments/checkout", { method: "POST", body: { plan: "founding" } }), env);
  check("501 checkout when not configured", r.status === 501 && (await r.json()).error === "payments_not_configured");
}

// 14. checkout (signed out, with email) creates a Stripe session and returns the URL
{
  const { env } = await makeEnv();
  const password = makeStripeEnv();
  Object.assign(env, password);
  const result = await withStripe(async (calls) => {
    const r = await worker.fetch(await req("/api/payments/checkout", { method: "POST", body: { plan: "founding", email: "buyer@example.com" } }), env);
    return { body: await r.json(), calls };
  });
  check("200 checkout founding signed-out", result.body.ok === true && result.body.url === "https://checkout.stripe.com/c/pay/test");
  const sessionCall = result.calls.find(c => c.url.endsWith("/checkout/sessions"));
  check("stripe session created with payment mode", sessionCall && sessionCall.body.get("mode") === "payment");
  check("founding price id used", sessionCall && sessionCall.body.get("line_items[0][price]") === "price_founding");
  check("card + paypal payment methods enabled", sessionCall && sessionCall.body.get("payment_method_types[0]") === "card" && sessionCall.body.get("payment_method_types[1]") === "paypal");
  check("plan in metadata", sessionCall && sessionCall.body.get("metadata[plan]") === "founding");
}

// 15. webhook with a missing/bad signature -> 400
{
  const { env } = await makeEnv();
  const password = makeStripeEnv();
  Object.assign(env, password);
  const payload = JSON.stringify({ type: "checkout.session.completed", data: { object: {} } });
  const r = await worker.fetch(new Request("https://aifaculty.org/api/payments/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Stripe-Signature": "t=1,v1=deadbeef" },
    body: payload,
  }), env);
  check("400 webhook bad signature", r.status === 400 && (await r.json()).error === "invalid_signature");
}

// 16. webhook checkout.session.completed grants a founding plan + records revenue (creates user by email)
{
  const { env } = await makeEnv();
  const password = makeStripeEnv();
  Object.assign(env, password);
  const payload = JSON.stringify({
    id: "evt_founding",
    type: "checkout.session.completed",
    data: { object: {
      id: "cs_f", payment_status: "paid", amount_total: 15000, currency: "usd",
      customer: "cus_founding", customer_email: "buyer@example.com",
      customer_details: { email: "buyer@example.com" },
      metadata: { plan: "founding", userId: "" },
    } },
  });
  const sig = await signStripe(password.STRIPE_WEBHOOK_SECRET, payload);
  const r = await worker.fetch(new Request("https://aifaculty.org/api/payments/webhook", {
    method: "POST", headers: { "Content-Type": "application/json", "Stripe-Signature": sig }, body: payload,
  }), env);
  const body = await r.json();
  check("200 webhook valid", r.status === 200 && body.ok === true);
  const buyer = env.DB._users.find(u => u.email === "buyer@example.com");
  check("payer created by email", !!buyer);
  check("payer got founding plan", buyer && buyer.plan === "founding" && buyer.plan_status === "active");
  check("revenue recorded once", env.DB._payments.length === 1 && env.DB._payments[0].amount_cents === 15000);
}

// 17. webhook subscription.updated syncs plan for the paying stripe customer
{
  const { env } = await makeEnv();
  const password = makeStripeEnv();
  Object.assign(env, password);
  env.DB._users[0].stripe_customer_id = "cus_pro";
  const payload = JSON.stringify({
    id: "evt_sub", type: "customer.subscription.updated",
    data: { object: {
      id: "sub_1", customer: "cus_pro", status: "active",
      items: { data: [{ price: { id: "price_pro_monthly" } }] },
    } },
  });
  const sig = await signStripe(password.STRIPE_WEBHOOK_SECRET, payload);
  const r = await worker.fetch(new Request("https://aifaculty.org/api/payments/webhook", {
    method: "POST", headers: { "Content-Type": "application/json", "Stripe-Signature": sig }, body: payload,
  }), env);
  check("200 webhook subscription", r.status === 200);
  check("user now pro/active", env.DB._users[0].plan === "pro" && env.DB._users[0].plan_status === "active");
}

// 18. admin overview reports revenue + plan counts (founder only)
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  env.DB._payments.push({
    id: "p1", user_id: "u1", stripe_event_id: "evt_founding", event_type: "checkout",
    plan: "founding", amount_cents: 15000, currency: "usd", status: "succeeded", created_at: "2026-09-24T00:00:00.000Z",
  });
  const r = await worker.fetch(await req("/api/admin/overview", { token: rawToken }), env);
  const body = await r.json();
  check("200 overview as founder", r.status === 200 && body.ok === true);
  // The only account here is the founder. Reporting it as a learner is the bug v0.64 fixed.
  check("founder is not counted as a learner", body.totals.learners === 0);
  check("staff counted separately", body.totals.staff === 1);
  check("revenue total", body.revenue.lifetimeCents === 15000 && body.revenue.payments === 1);
  check("plan count excludes staff", body.planCounts.free === undefined);
}

// 18b. the v0.64 defect: staff must not appear as learner engagement. On a system with a
// founder and a reviewer and no learners, every headline number used to be a staff account.
{
  const tokenHash = await sha256Hex("tok-founder");
  const tokenHash2 = await sha256Hex("tok-reviewer");
  const founder = { id: "uf", email: "f@example.com", created_at: "2026-01-01T00:00:00.000Z", role: "founder" };
  const reviewer = { id: "ur", email: "r@example.com", created_at: "2026-01-01T00:00:00.000Z", role: "reviewer" };
  const learner = { id: "ul", email: "l@example.com", created_at: "2026-01-01T00:00:00.000Z", role: "learner" };
  const env = {
    DB: makeFakeDB({ users: [founder, reviewer, learner], sessions: [
      { token_hash: tokenHash, user_id: "uf", created_at: "2026-01-01T00:00:00.000Z", expires_at: "2099-01-01T00:00:00.000Z" },
      { token_hash: tokenHash2, user_id: "ur", created_at: "2026-01-01T00:00:00.000Z", expires_at: "2099-01-01T00:00:00.000Z" },
    ] }),
    SIGNUPS: makeKV(), RESEND_API_KEY: "", DEV_LINKS: "true", APP_ORIGIN: "https://aifaculty.org",
    rate_limit: { window_seconds: 3600, max_per_ip: 3 },
  };
  const now = Date.now();
  const iso = new Date(now - 60 * 60 * 1000).toISOString();
  // founder and reviewer browsed; the learner did not
  env.DB._activity.push({ id: "a1", user_id: "uf", ts: iso, kind: "view", detail: null });
  env.DB._activity.push({ id: "a2", user_id: "ur", ts: iso, kind: "view", detail: null });
  // the one real learner also browsed, an hour ago
  env.DB._activity.push({ id: "a3", user_id: "ul", ts: iso, kind: "view", detail: null });
  // and a learner who has not been seen for a month
  env.DB._activity.push({ id: "a4", user_id: "ul", ts: new Date(now - 40 * 864e5).toISOString(), kind: "view", detail: null });
  // ...and the learner has the only submission
  env.DB._submissions.push({ id: "s1", user_id: "ul", kind: "challenge", pathway_id: "p1", cap_id: "C1",
    challenge_id: "C1.1", checkpoint_id: null, band: "Meets", confidence: "medium",
    fields_json: "{}", started_at: iso, completed_at: iso, duration_ms: 1000 });
  // the founder ran their own QA pass on C5, which must not appear as a learner struggle point
  env.DB._submissions.push({ id: "s2", user_id: "uf", kind: "challenge", pathway_id: "p1", cap_id: "C5",
    challenge_id: "C5.1", checkpoint_id: null, band: "Not yet", confidence: "low",
    fields_json: "{}", started_at: iso, completed_at: iso, duration_ms: 1000 });

  const r = await worker.fetch(new Request("https://aifaculty.org/api/admin/overview", {
    headers: { "Cookie": "af_session=tok-founder" },
  }), env);
  const b = await r.json();
  check("counts only real learners", b.totals.learners === 1);
  check("staff reported separately", b.totals.staff === 2 && b.totals.staffByRole.founder === 1);
  check("active today counts the learner, not staff", b.totals.activeToday === 1,
    `expected 1 active learner, got ${b.totals.activeToday}`);
  check("active week counts the learner, not staff", b.totals.activeWeek === 1,
    `expected 1 active learner this week, got ${b.totals.activeWeek}`);
  check("analytics scoped to learners", b.analyticsFromLearnersOnly === true);
  check("struggle only from learner submissions", b.struggle.length === 1 && b.struggle[0].capId === "C1",
    `expected only C1 from the learner, got ${JSON.stringify(b.struggle.map(x => x.capId))}`);
  check("submissions count excludes staff", b.totals.submissions === 1);
  check("no learner has paying revenue implied", b.planCounts.pro === undefined);
}

// 19. Control Plane — assess requires auth
const cpRubric = { cpId: "CP1", rubricDims: ["Clarity", "Structure", "Reasoning", "Safety"] };
function cpFields() {
  return [
    { key: "goal", label: "Goal", minWords: 15 },
    { key: "steps", label: "Steps", minWords: 15 },
    { key: "verify", label: "Verification", minWords: 15 },
    { key: "safe", label: "Safety", minWords: 15 },
  ];
}
function strongSubmission() {
  const s = {};
  cpFields().forEach(f => { s[f.key] = "because the goal is a repeatable workflow, for example the weekly 4-step planning loop every Monday morning, with two specific deliverables, instead of a vague statement".repeat(3); });
  return s;
}
{
  const { env } = await makeEnv(); // no token sent
  const r = await worker.fetch(await req("/api/faculty/assess", { method: "POST", body: { ...cpRubric, fields: cpFields(), submission: strongSubmission() } }), env);
  check("401 assess without auth", r.status === 401);
}

// 20. Control Plane — with no model configured, nothing is assessed. This used to assert
// "strict verdict ready on strong answer" off a word count, which is the fabrication the whole
// rebuild is removing: a strong answer scored ready before any model read it, and a learner was
// told a competent faculty had judged them.
{
  const { env, rawToken } = await makeEnv();
  const r = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken,
    body: { ...cpRubric, fields: cpFields(), submission: strongSubmission() },
  }), env);
  const body = await r.json();
  check("409 not configured, not 200", r.status === 409 && body.ok === false);
  check("no model configured returns no verdict", body.verdict === undefined);
  check("no model configured returns no bands", body.bands === undefined);
  check("explicitly marked unassessed", body.assessed === false && body.error === "not_configured");
  check("says a word-count scorer is not an assessor", /not an assessor/.test(body.reason || ""));
  check("names the remedy", /FACULTY_MODEL_KEY/.test(body.remedy || ""));
  check("lineage id still returned", typeof body.lineageId === "string" && body.lineageId.length > 0);
  check("gap is audited rather than hidden", env.DB._faculty.length === 1
    && env.DB._faculty[0].verdict === null && env.DB._faculty[0].degraded === 0
    && env.DB._faculty[0].status === "not_configured" && env.DB._faculty[0].adapter === "none");
  check("submission snapshot still kept", env.DB._faculty[0].submission_json.length > 10);
}

// 21. Control Plane — answer length must not change what comes back when no model is configured.
// The old scorer banded this thin answer "revise" and a padded one "ready". Both are now the
// same honest answer, because neither has been read by anything that knows the subject.
{
  const { env, rawToken } = await makeEnv();
  const thin = {};
  cpFields().forEach(f => { thin[f.key] = "I would check my work because it matters and fix errors and detail repeat"; });
  const rThin = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken, body: { ...cpRubric, fields: cpFields(), submission: thin },
  }), env);
  const rFat = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken, body: { ...cpRubric, fields: cpFields(), submission: strongSubmission() },
  }), env);
  const bThin = await rThin.json(), bFat = await rFat.json();
  check("both unconfigured reads are 409", rThin.status === 409 && rFat.status === 409);
  check("padding earns nothing", bThin.verdict === undefined && bFat.verdict === undefined);
  check("neither is banded", !bThin.bands && !bFat.bands);
}

// 22. Control Plane — bad rubric payload rejected
{
  const { env, rawToken } = await makeEnv();
  const r = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken,
    body: { cpId: "CP1", rubricDims: ["Clarity"], fields: [{ key: "x", label: "X", minWords: "not-a-number" }], submission: { x: "y" } },
  }), env);
  check("400 invalid fields", r.status === 400);
}

const RUBRIC = ["Clarity", "Specificity"];
const FIELDS = [{ key: "a", label: "A", minWords: 10 }, { key: "b", label: "B", minWords: 10 }];
const SUBMISSION = {
  a: "We split intake into three steps because triage was slow; specifically the reviewer queue grew by 40 each Monday.",
  b: "We measure it as median handoff time, which was 6 hours on the Tuesday of week two because nobody owned the queue.",
};
function withFetch(handler, fn) {
  const real = globalThis.fetch;
  globalThis.fetch = handler;
  return Promise.resolve()
    .then(fn)
    .finally(() => { globalThis.fetch = real; });
}
function modelEnv(env, over = {}) {
  env.FACULTY_MODEL_KEY = "sk-test";
  env.FACULTY_MODEL_BASE_URL = "https://model.test/v1";
  env.FACULTY_MODEL_NAME = "assessor-1";
  env.FACULTY_ADAPTER = "openai-compatible";
  Object.assign(env, over);
  return env;
}
function modelReply(content) {
  return async (url, init) => {
    modelReply.last = { url, init };
    return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
  };
}
function bandsReply(bands, extra = {}) {
  return modelReply(JSON.stringify({
    bands, verdict: "ready", note: "model note", confidence: "high", ...extra,
  }));
}
async function assess(env, rawToken, body = {}) {
  const res = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken,
    body: { cpId: "CP1", rubricDims: RUBRIC, fields: FIELDS, submission: SUBMISSION, ...body },
  }), env);
  return { res, body: await res.json() };
}
const GOOD = { Clarity: "Meets", Specificity: "Exceeds" };
// A model reply that bands the checkpoint rubric as needing work, so review cases have a real
// disagreement to dispute.
const THIN_BANDS = { Clarity: "Developing", Structure: "Developing", Reasoning: "Not yet", Safety: "Meets" };

// 23. Control Plane — a rubric dimension the model was not sent a field for is still banded,
// and the model may band a dimension independently of the fields it was given.
{
  const { env, rawToken } = await makeEnv();
  const bands = { Clarity: "Meets", Structure: "Meets", Reasoning: "Meets", Safety: "Meets", Evidence: "Developing" };
  const { res, body } = await withFetch(bandsReply(bands),
    () => assess(modelEnv(env), rawToken, {
      rubricDims: ["Clarity", "Structure", "Reasoning", "Safety", "Evidence"],
      fields: cpFields(), submission: strongSubmission(),
    }));
  check("every requested dimension comes back banded", res.status === 200
    && ["Clarity", "Structure", "Reasoning", "Safety", "Evidence"].every(d => body.bands && body.bands[d]));
  check("the extra dimension keeps the model's band", body.bands.Evidence === "Developing");
  check("a weak dimension drags the verdict off ready", body.verdict !== "ready");
}

// 24. Control Plane — admin lineage log is founder-only and lists calls
{
  const { env, rawToken } = await makeEnv(); // role: learner
  const rLearner = await worker.fetch(await req("/api/faculty/log", { token: rawToken }), env);
  check("403 log as learner", rLearner.status === 403);

  const envF = await makeEnv({ role: "founder" });
  const founderToken = (envF.rawToken);
  const { res, body } = await withFetch(bandsReply(GOOD),
    () => assess(modelEnv(envF.env), founderToken, {
      cpId: "CP1", rubricDims: RUBRIC, fields: FIELDS, submission: SUBMISSION }));
  const log = await worker.fetch(await req("/api/faculty/log", { token: founderToken }), envF.env);
  const logBody = await log.json();
  check("200 log as founder", log.status === 200 && logBody.ok === true && Array.isArray(logBody.calls));
  check("log carries the audited call with email", logBody.calls.length === 1
    && logBody.calls[0].id === body.lineageId && logBody.calls[0].email === "learner@example.com"
    && logBody.calls[0].adapter === "openai-compatible" && logBody.calls[0].model === "assessor-1");

  // An unconfigured read must also show up in the founder's log, marked as the gap it is.
  const { env: envU, rawToken: tokU } = await makeEnv({ role: "founder" });
  const un = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: tokU, body: { ...cpRubric, fields: cpFields(), submission: strongSubmission() },
  }), envU);
  const log2 = await (await worker.fetch(await req("/api/faculty/log", { token: tokU }), envU)).json();
  check("the unconfigured gap is visible in the log, not hidden", un.status === 409
    && log2.calls.length === 1 && log2.calls[0].status === "not_configured"
    && log2.calls[0].verdict === null && log2.calls[0].adapter === "none");
  // A row with a null verdict must be distinguishable from a row the model genuinely judged.
  check("the log never presents an unassessed row as assessed",
    log2.calls[0].status !== "ok" && logBody.calls[0].status === "ok"
    && logBody.calls[0].verdict === "ready");
}

// 25. founder may not be downgraded by anyone except themselves; role endpoint is founder-only
{
  const { env, rawToken } = await makeEnv(); // learner
  const r = await worker.fetch(await req("/api/admin/role", {
    method: "POST", token: rawToken, body: { email: "learner@example.com", role: "reviewer" },
  }), env);
  check("403 role change as learner", r.status === 403);

  const envF = await makeEnv({ role: "founder" });
  const founderToken = envF.rawToken;
  envF.env.DB._users.push({ id: "u2", email: "peer@example.com", display_name: null,
    created_at: "2026-01-02T00:00:00.000Z", role: "learner", plan: "free", plan_status: "none",
    stripe_customer_id: null });
  const bad = await worker.fetch(await req("/api/admin/role", {
    method: "POST", token: founderToken, body: { email: "peer@example.com", role: "superuser" },
  }), envF.env);
  check("400 invalid role", bad.status === 400);
  const ok = await worker.fetch(await req("/api/admin/role", {
    method: "POST", token: founderToken, body: { email: "peer@example.com", role: "reviewer" },
  }), envF.env);
  check("200 grant reviewer", ok.status === 200 && envF.env.DB._users.find(u => u.id === "u2").role === "reviewer");
  const missing = await worker.fetch(await req("/api/admin/role", {
    method: "POST", token: founderToken, body: { email: "nobody@example.com", role: "reviewer" },
  }), envF.env);
  check("404 no such user", missing.status === 404);
}

// 26. reviewer sees disputed calls but not founder log; learner's own escalation is honest
{
  // learner with a disputed (revise) call on the plane
  const learnerE = await makeEnv(); // u1 learner
  // A review row needs a real verdict to dispute. The thin answer is now banded by a model, so
  // the disagreement being reviewed is a genuine one rather than the word-count scorer's.
  modelEnv(learnerE.env);
  const { res: call, body: callBody } = await withFetch(bandsReply(THIN_BANDS), () =>
    assess(learnerE.env, learnerE.rawToken, {
      cpId: "CP1", rubricDims: cpRubric.rubricDims, fields: cpFields(),
      submission: (() => {
        const thin = {}; cpFields().forEach(f => { thin[f.key] = "I would check my work because it matters and fix errors and detail repeat"; });
        return thin;
      })(),
    }));
  check("disputed call produced", call.status === 200 && callBody.verdict !== "ready" && typeof callBody.lineageId === "string");

  // reviewer (role granted by the founder — the grant endpoint itself is covered in block 25)
  learnerE.env.DB._users[0].role = "reviewer";
  const list = await worker.fetch(await req("/api/faculty/reviews", { token: learnerE.rawToken }), learnerE.env);
  const listBody = await list.json();
  check("reviewer lists disputed call", list.status === 200 && listBody.ok === true
    && listBody.reviews.length === 1 && listBody.reviews[0].call_id === callBody.lineageId
    && listBody.reviews[0].learner_email === "learner@example.com" && listBody.reviews[0].decision === null);

  const decide = await worker.fetch(await req("/api/faculty/reviews", {
    method: "POST", token: learnerE.rawToken,
    body: { callId: callBody.lineageId, decision: "override", note: "Trail is thin; rework the verification step with named checks." },
  }), learnerE.env);
  check("reviewer records decision", decide.status === 200 && (await decide.json()).ok === true);
  check("decision persisted", learnerE.env.DB._reviews.length === 1 && learnerE.env.DB._reviews[0].decision === "override");

  const again = await worker.fetch(await req("/api/faculty/reviews", {
    method: "POST", token: learnerE.rawToken,
    body: { callId: callBody.lineageId, decision: "dismiss", note: "Second look: not enough here at all." },
  }), learnerE.env);
  check("re-decision overrides single row", again.status === 200 && learnerE.env.DB._reviews.length === 1
    && learnerE.env.DB._reviews[0].decision === "dismiss");

  // reviewer list now reflects the decision (one row, updated)
  const list2 = await worker.fetch(await req("/api/faculty/reviews", { token: learnerE.rawToken }), learnerE.env);
  const list2Body = await list2.json();
  check("list shows reviewer decision", list2Body.reviews[0].decision === "dismiss" && list2Body.reviews[0].reviewer_email === "learner@example.com");

  // the learner (original escalation flow) sees the decision on their own record
  const mine = await worker.fetch(await req("/api/faculty/reviews/me", { token: learnerE.rawToken }), learnerE.env);
  const mineBody = await mine.json();
  check("learner sees own resolution", mine.status === 200 && mineBody.ok === true
    && mineBody.reviews.length === 1 && mineBody.reviews[0].decision === "dismiss"
    && mineBody.reviews[0].cp_id === "CP1");

  // reviewer cannot read the founder-only audit log
  const log403 = await worker.fetch(await req("/api/faculty/log", { token: learnerE.rawToken }), learnerE.env);
  check("403 lineage log as reviewer", log403.status === 403);

  // a learner-disputed entry where the second assessment never hit the server stays local-only
  const fresh = await makeEnv();
  const esc = await worker.fetch(await req("/api/faculty/reviews/escalate", {
    method: "POST", token: fresh.rawToken, body: { cpId: "CP1" },
  }), fresh.env);
  const escBody = await esc.json();
  check("escalate with no server call is local_only", esc.status === 200 && escBody.ok === false && escBody.local_only === true);
  const esc2 = await worker.fetch(await req("/api/faculty/reviews/escalate", {
    method: "POST", token: learnerE.rawToken, body: { cpId: "CP1" },
  }), learnerE.env);
  const esc2Body = await esc2.json();
  check("escalate with a disputed call opens it", esc2.status === 200 && esc2Body.ok === true && esc2Body.status === "open" && typeof esc2Body.callId === "string");
}

// 27. founder readiness snapshot; the admin panel turns it into a launch checklist
{
  const founderE = await makeEnv({ role: "founder" });
  const ready = await worker.fetch(await req("/api/admin/readiness", { token: founderE.rawToken }), founderE.env);
  const readyBody = await ready.json();
  check("founder reads readiness", ready.status === 200 && readyBody.ok === true && readyBody.isFounder === true);
  check("controls surfaced", readyBody.controls.stripe.configured === false
    && readyBody.controls.faculty.adapter === "dry-run" && readyBody.controls.faculty.modelConfigured === false
    && readyBody.controls.email.devMode === true && readyBody.controls.email.resendConfigured === false);
  check("empty loop counts", readyBody.loop.disputedCalls === 0 && readyBody.loop.openReviews === 0
    && readyBody.loop.decidedReviews === 0 && readyBody.loop.facultyCalls === 0 && readyBody.loop.migrationsApplied === 0);

  // a disputed call + a decided review move the numbers the panel shows; the founder is
  // reviewer-capable, so the decision can be recorded from the same env
  modelEnv(founderE.env);
  const { res: call, body: callBody } = await withFetch(bandsReply(THIN_BANDS), () =>
    assess(founderE.env, founderE.rawToken, {
      cpId: "CP1", rubricDims: cpRubric.rubricDims, fields: cpFields(),
      submission: (() => {
        const thin = {}; cpFields().forEach(f => { thin[f.key] = "I would check my work because it matters and fix errors and detail repeat"; });
        return thin;
      })(),
    }));
  check("founder disputed call produced", call.status === 200 && callBody.verdict !== "ready");
  const decide = await worker.fetch(await req("/api/faculty/reviews", {
    method: "POST", token: founderE.rawToken,
    body: { callId: callBody.lineageId, decision: "dismiss", note: "Empty check marks; see the trail." },
  }), founderE.env);
  check("founder (reviewer-capable) records decision", decide.status === 200);

  const ready2 = await worker.fetch(await req("/api/admin/readiness", { token: founderE.rawToken }), founderE.env);
  const ready2Body = await ready2.json();
  check("readiness counts move", ready2Body.loop.disputedCalls === 1 && ready2Body.loop.decidedReviews === 1
    && ready2Body.loop.openReviews === 0 && ready2Body.loop.facultyCalls === 1);

  const learnerE = await makeEnv();
  const forbidden = await worker.fetch(await req("/api/admin/readiness", { token: learnerE.rawToken }), learnerE.env);
  check("403 readiness as learner", forbidden.status === 403);
}

// 28. founder password: set, sign in, refuse wrong guesses
{
  const PW = "correct horse battery staple";
  const founderE = await makeEnv({ role: "founder" });
  const env = founderE.env;
  env.rate_limit = { window_seconds: 3600, max_per_ip: 100 };
  const ft = founderE.rawToken;
  const IP = "9.9.9.9";
  const post = async (path, body, o = {}) => worker.fetch(
    await req(path, { method: "POST", body, ip: IP, ...o }), env);

  let r = await worker.fetch(await req("/api/auth/password", { token: ft }), env);
  check("founder has no password initially", r.status === 200 && (await r.json()).passwordSet === false);

  r = await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("401 login before a password is set", r.status === 401);

  r = await post("/api/auth/password", { password: "short" }, { token: ft });
  check("400 weak password", r.status === 400);

  r = await post("/api/auth/password", { password: PW }, { token: ft });
  check("200 founder sets password", r.status === 200);
  r = await worker.fetch(await req("/api/auth/password", { token: ft }), env);
  check("passwordSet true after set", (await r.json()).passwordSet === true);

  const stored = env.DB._passwords[0];
  check("stores salt+hash only, never plaintext",
    stored && stored.salt.length === 32 && stored.hash.length === 64
    && stored.hash !== PW && stored.iterations === 10000);

  r = await post("/api/auth/login", { email: "learner@example.com", password: "not the password" });
  check("401 wrong password", r.status === 401);
  check("failure counted", env.DB._fails.length === 1 && env.DB._fails[0].fails === 1);

  r = await post("/api/auth/login", { email: "learner@example.com", password: PW });
  const cookie = r.headers.get("Set-Cookie") || "";
  check("200 password login", r.status === 200);
  check("sets hardened session cookie",
    cookie.startsWith("af_session=") && cookie.includes("HttpOnly") && cookie.includes("Secure") && cookie.includes("SameSite=Lax"));
  const newTok = cookie.split(";")[0].slice("af_session=".length);
  const me = await worker.fetch(await req("/api/auth/me", { token: newTok }), env);
  check("password session authenticates as founder", me.status === 200 && (await me.json()).user.role === "founder");
  check("failures cleared on success", env.DB._fails.length === 0);

  r = await post("/api/auth/login", { email: "nobody@example.com", password: PW });
  check("401 unknown email refused same as wrong password", r.status === 401);
  r = await post("/api/auth/login", { email: "learner@example.com", password: "" });
  check("400 empty password", r.status === 400);

  const learnerE = await makeEnv();
  learnerE.env.rate_limit = { window_seconds: 3600, max_per_ip: 100 };
  r = await worker.fetch(await req("/api/auth/password", { method: "POST", token: learnerE.rawToken, body: { password: PW } }), learnerE.env);
  check("403 set password as learner", r.status === 403);
  r = await worker.fetch(await req("/api/auth/password", { token: learnerE.rawToken }), learnerE.env);
  check("403 password status as learner", r.status === 403);
  r = await worker.fetch(await req("/api/auth/password", { method: "POST", body: { password: PW } }), learnerE.env);
  check("401 set password signed out", r.status === 401);
}

// 29. account lockout, password change, session invalidation
{
  const PW = "correct horse battery staple";
  const NEW_PW = "a different long password";
  const founderE = await makeEnv({ role: "founder" });
  const env = founderE.env;
  env.rate_limit = { window_seconds: 3600, max_per_ip: 100 };
  const ft = founderE.rawToken;
  const post = async (path, body, ip = "8.8.8.8") => worker.fetch(
    await req(path, { method: "POST", body, ip }), env);

  await worker.fetch(await req("/api/auth/password", { method: "POST", token: ft, body: { password: PW } }), env);

  for (let i = 0; i < 5; i++) await post("/api/auth/login", { email: "learner@example.com", password: "guess-" + i });
  check("locked after 5 failures", env.DB._fails[0].fails === 5 && !!env.DB._fails[0].locked_until);

  let r = await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("429 correct password refused while locked", r.status === 429);
  const lockBody = await r.json();
  const lockRetry = Number(lockBody.retryAfter);
  check("lockout says how long is left", lockBody.reason === "account_locked" && lockRetry > 0 && lockRetry <= 900);
  check("lockout sends Retry-After", Number(r.headers.get("Retry-After")) === lockRetry);
  r = await post("/api/auth/login", { email: "learner@example.com", password: PW }, "7.7.7.7");
  check("lock is per-account, not per-IP", r.status === 429);

  r = await worker.fetch(await req("/api/auth/password", { method: "POST", token: ft, body: { password: NEW_PW } }), env);
  check("403 change without current password", r.status === 403);
  r = await worker.fetch(await req("/api/auth/password", { method: "POST", token: ft, body: { currentPassword: "wrong current", password: NEW_PW } }), env);
  check("403 change with wrong current password", r.status === 403);
  check("failed change left the credential intact", env.DB._passwords[0].hash !== NEW_PW);

  const secondHash = await sha256Hex("a-second-session-token");
  env.DB._sessions.push({ token_hash: secondHash, user_id: "u1", created_at: "2026-01-01T00:00:00.000Z", expires_at: "2099-01-01T00:00:00.000Z" });

  r = await worker.fetch(await req("/api/auth/password", { method: "POST", token: ft, body: { currentPassword: PW, password: NEW_PW } }), env);
  check("200 change with current password", r.status === 200);
  check("change cleared the lockout", env.DB._fails.length === 0);
  check("other sessions dropped, changer kept",
    env.DB._sessions.length === 1 && env.DB._sessions[0].token_hash === await sha256Hex(ft));
  const stillMe = await worker.fetch(await req("/api/auth/me", { token: ft }), env);
  check("changer still signed in after change", stillMe.status === 200);
  const otherMe = await worker.fetch(await req("/api/auth/me", { token: "a-second-session-token" }), env);
  check("other session no longer authenticates", otherMe.status === 401);

  r = await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("old password no longer works", r.status === 401);
  r = await post("/api/auth/login", { email: "learner@example.com", password: NEW_PW });
  check("new password works", r.status === 200);
}

// 30. password login is rate limited per IP
{
  const PW = "correct horse battery staple";
  const founderE = await makeEnv({ role: "founder" });
  const env = founderE.env;
  await worker.fetch(await req("/api/auth/password", { method: "POST", token: founderE.rawToken, body: { password: PW } }), env);
  const body = { email: "learner@example.com", password: "wrong" };
  let last = 0;
  for (let i = 0; i < 4; i++) {
    last = await worker.fetch(await req("/api/auth/login", { method: "POST", body, ip: "6.6.6.6" }), env);
  }
  check("429 once the per-IP login cap is hit", last.status === 429);
  const ipBody = await last.json();
  const ipRetry = Number(ipBody.retryAfter);
  check("per-IP cap is distinct from an account lockout", ipBody.reason === "ip_rate" && ipRetry > 0);
  check("per-IP cap sends Retry-After", Number(last.headers.get("Retry-After")) === ipRetry);
  const other = await worker.fetch(await req("/api/auth/login", { method: "POST", body, ip: "6.6.6.7" }), env);
  check("per-IP bucket is per address", other.status === 401);
}

// 31. work factor is env-driven, clamped, and credentials self-upgrade on sign-in
{
  const PW = "correct horse battery staple";
  const founderE = await makeEnv({ role: "founder" });
  const env = founderE.env;
  env.rate_limit = { window_seconds: 3600, max_per_ip: 100 };
  const ft = founderE.rawToken;
  const post = async (path, body) => worker.fetch(
    await req(path, { method: "POST", body, ip: "5.5.5.5" }), env);

  env.PASSWORD_ITERATIONS = "0";
  await worker.fetch(await req("/api/auth/password", { method: "POST", token: ft, body: { password: PW } }), env);
  check("absent/zero setting falls back to the default", env.DB._passwords[0].iterations === 10000);

  env.PASSWORD_ITERATIONS = "not-a-number";
  await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("garbage setting falls back to the default", env.DB._passwords[0].iterations === 10000);

  env.PASSWORD_ITERATIONS = "25000";
  let r2 = await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("login still succeeds at the new work factor", r2.status === 200);
  check("credential self-upgraded to the new count", env.DB._passwords[0].iterations === 25000);

  env.PASSWORD_ITERATIONS = "999999999";
  r2 = await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("clamped to the maximum", r2.status === 200 && env.DB._passwords[0].iterations === 600000);

  env.PASSWORD_ITERATIONS = "1";
  await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("clamped to the minimum, never weakened", env.DB._passwords[0].iterations === 10000);

  const before = env.DB._passwords[0].hash;
  env.PASSWORD_ITERATIONS = "30000";
  await post("/api/auth/login", { email: "learner@example.com", password: PW });
  check("re-hash uses a fresh salt each upgrade", env.DB._passwords[0].hash !== before);
}

// 32. dev sign-in links are founder-only. Regression cover for the hole where DEV_LINKS=true
// handed a working link to anyone who typed any address, including the founder's — which was a
// complete takeover of the /api/admin/* surface, and had no test at all until now.
{
  const f = await makeEnv({ role: "founder" });
  const env = f.env;
  const ask = async (body, token, ip = "9.9.9.9") =>
    worker.fetch(await req("/api/auth/request-link", { method: "POST", body, token, ip }), env);

  let r = await ask({ email: "stickyptyltd@gmail.com" });
  const anon = await r.json();
  check("anonymous visitor gets no link", r.status === 503);
  check("anonymous response contains no token", anon.error === "signin_unavailable" && !anon.dev_link);

  r = await ask({ email: "stickyptyltd@gmail.com" }, f.rawToken);
  const owner = await r.json();
  check("founder session still gets a dev link", r.status === 200 && !!owner.dev_link);

  for (const role of ["learner", "reviewer"]) {
    const e = await makeEnv({ role });
    r = await worker.fetch(await req("/api/auth/request-link",
      { method: "POST", body: { email: "someone@example.com" }, token: e.rawToken }), e.env);
    check(`a signed-in ${role} cannot mint a link`, r.status === 503);
  }

  env.DEV_LINKS = "false";
  r = await ask({ email: "x@example.com" }, f.rawToken);
  check("DEV_LINKS=false refuses even the founder", r.status === 503);

  // With a real sender configured the founder gate must not apply — learners cannot hold a
  // founder session, so gating the email path too would permanently break self-serve sign-in.
  const orig = globalThis.fetch;
  let sent = 0;
  globalThis.fetch = async (url, opts) => {
    if (String(url).startsWith("https://api.resend.com")) {
      sent++;
      const parsed = JSON.parse(opts.body);
      check("resend gets the recipient and a real subject", parsed.to[0] === "newcomer@example.com" && !!parsed.subject);
      return new Response(JSON.stringify({ id: "re_1" }), { status: 200 });
    }
    return orig(url, opts);
  };
  try {
    const m = await makeEnv({ role: "learner" });
    m.env.RESEND_API_KEY = "re_test";
    m.env.DEV_LINKS = "true";
    r = await worker.fetch(await req("/api/auth/request-link",
      { method: "POST", body: { email: "newcomer@example.com" } }), m.env);
    const mailed = await r.json();
    check("a real sender emails any visitor without a session", r.status === 200 && mailed.sent === true && !mailed.dev_link);
    check("the email really was sent", sent === 1);
  } finally {
    globalThis.fetch = orig;
  }
}

// 33. Cloudflare Email Service is the preferred sender, and a failed send never leaks the link
{
  const sent = [];
  const binding = (behaviour) => ({ send: async (msg) => { if (behaviour === "throw") throw new Error("smtp down"); sent.push(msg); return { messageId: "msg_1" }; } });

  const f = await makeEnv({ role: "founder" });
  f.env.EMAIL = binding();
  f.env.MAIL_FROM = "accounts@aifaculty.org";
  let r = await worker.fetch(await req("/api/auth/request-link",
    { method: "POST", body: { email: "newcomer@example.com" } }), f.env);
  let b = await r.json();
  check("EMAIL binding sends without any session", r.status === 200 && b.sent === true && !b.dev_link);
  check("the message went to the requested address", sent[0].to === "newcomer@example.com");
  check("sender is the onboarded domain", sent[0].from === "accounts@aifaculty.org");
  check("subject is set", sent[0].subject === "Your AI Faculty sign-in link");
  check("both text and html bodies are present", !!sent[0].text && sent[0].html.includes("expires in 15 minutes"));
  check("the link is in the html body", /href="https:\/\/aifaculty\.org\/api\/auth\/verify\?token=/.test(sent[0].html));

  // It must win over Resend, which is only a fallback.
  const both = await makeEnv({ role: "founder" });
  both.env.EMAIL = binding();
  both.env.RESEND_API_KEY = "re_test";
  const before = sent.length;
  const origFetch = globalThis.fetch;
  let resendCalls = 0;
  globalThis.fetch = async (url) => { if (String(url).startsWith("https://api.resend.com")) resendCalls++; return origFetch(url); };
  try {
    r = await worker.fetch(await req("/api/auth/request-link",
      { method: "POST", body: { email: "second@example.com" } }), both.env);
    check("EMAIL binding takes precedence over Resend", r.status === 200 && sent.length === before + 1 && resendCalls === 0);
  } finally {
    globalThis.fetch = origFetch;
  }

  // A send that throws must not degrade into handing the caller the link.
  const broken = await makeEnv({ role: "founder" });
  broken.env.EMAIL = binding("throw");
  r = await worker.fetch(await req("/api/auth/request-link",
    { method: "POST", body: { email: "third@example.com" } }), broken.env);
  const failBody = await r.json();
  check("a failed send returns 502", r.status === 502);
  check("a failed send leaks no link", failBody.error === "email_send_failed" && !failBody.dev_link);
}

// 34. Founding Member is lifetime: subscription events must never revoke it
{
  const f = await makeEnv({ role: "founder" });
  const env = f.env;
  env.STRIPE_SECRET_KEY = "sk_test";
  env.STRIPE_WEBHOOK_SECRET = "whsec_" + Buffer.from("testsecret").toString("base64url");
  env.STRIPE_PRICE_FOUNDING = "price_founding";
  env.STRIPE_PRICE_PRO_MONTHLY = "price_pro_m";

  const stripeEvent = async (type, object, id = "evt_" + Math.random().toString(36).slice(2)) => {
    const raw = JSON.stringify({ id, type, data: { object } });
    const t = Math.floor(Date.now() / 1000);
    const mac = await crypto.subtle.importKey("raw", new TextEncoder().encode("testsecret"),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = [...new Uint8Array(await crypto.subtle.sign("HMAC", mac, new TextEncoder().encode(`${t}.${raw}`)))]
      .map(b => b.toString(16).padStart(2, "0")).join("");
    return worker.fetch(new Request("https://aifaculty.org/api/payments/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Stripe-Signature": `t=${t},v1=${sig}` },
      body: raw,
    }), env);
  };

  // A pro subscriber who then buys founding, keeping the same Stripe customer.
  const user = env.DB._users[0];
  user.stripe_customer_id = "cus_lifetime";
  user.plan = "founding";
  user.plan_status = "active";

  let r = await stripeEvent("customer.subscription.deleted",
    { customer: "cus_lifetime", status: "canceled", items: { data: [{ price: { id: "price_pro_m" } }] } });
  check("subscription cancellation accepted", r.status === 200);
  check("founding survives a subscription cancellation", user.plan === "founding" && user.plan_status === "active");

  await stripeEvent("customer.subscription.updated",
    { customer: "cus_lifetime", status: "past_due", items: { data: [{ price: { id: "price_pro_m" } }] } }, "evt_2");
  check("founding survives a past_due subscription", user.plan === "founding" && user.plan_status === "active");

  // A genuine pro subscriber must still be downgraded normally.
  const g = await makeEnv({ role: "founder" });
  g.env.STRIPE_SECRET_KEY = "sk_test";
  g.env.STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  const pro = g.env.DB._users[0];
  pro.stripe_customer_id = "cus_pro_only";
  pro.plan = "pro";
  const t = Math.floor(Date.now() / 1000);
  const raw = JSON.stringify({ id: "evt_3", type: "customer.subscription.deleted",
    data: { object: { customer: "cus_pro_only", status: "canceled", items: { data: [{ price: { id: "price_pro_m" } }] } } } });
  const mac = await crypto.subtle.importKey("raw", new TextEncoder().encode("testsecret"),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = [...new Uint8Array(await crypto.subtle.sign("HMAC", mac, new TextEncoder().encode(`${t}.${raw}`)))]
    .map(b => b.toString(16).padStart(2, "0")).join("");
  await worker.fetch(new Request("https://aifaculty.org/api/payments/webhook", {
    method: "POST", headers: { "Content-Type": "application/json", "Stripe-Signature": `t=${t},v1=${sig}` }, body: raw,
  }), g.env);
  check("a real pro subscriber is still downgraded on cancellation", pro.plan === "free" && pro.plan_status === "canceled");

  check("webhook refuses a bad signature", (await worker.fetch(new Request("https://aifaculty.org/api/payments/webhook", {
    method: "POST", headers: { "Stripe-Signature": "t=1,v1=deadbeef" }, body: "{}",
  }), env)).status === 400);
}

// 35. GET /api/admin/curriculum — auth gate matches every other admin view
{
  const { env, rawToken } = await makeEnv({ role: "learner" });
  check("403 admin/curriculum as learner", (await worker.fetch(await req("/api/admin/curriculum", { token: rawToken }), env)).status === 403);
  const { env: env2 } = await makeEnv();
  check("401 admin/curriculum signed out", (await worker.fetch(await req("/api/admin/curriculum"), env2)).status === 401);
}

// 36. GET /api/admin/curriculum — band distribution per competency, and hardest-first ordering
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  env.DB._users.push({ id: "u2", email: "second@example.com", role: "learner" });
  env.DB._users.push({ id: "u3", email: "third@example.com", role: "learner" });
  // C1: 2 learners, one Meets, one below. C2: 1 learner, Exceeds. So C1 must sort first
  // (100% below Meets) and C2 second (0%). u1 is the founder and also submits, to prove
  // that staff QA runs do not reach the curriculum tables.
  const sub = (o) => ({ id: "s" + Math.random(), user_id: "u2", cap_id: "C1", challenge_id: null,
    checkpoint_id: null, band: "Meets", confidence: "high", duration_ms: 1000,
    completed_at: "2026-02-01T00:00:00.000Z", ...o });
  env.DB._submissions.push(
    sub({}), sub({ user_id: "u3", band: "Not yet" }),
    sub({ cap_id: "C2", band: "Exceeds" }),
    sub({ user_id: "u1", band: "Exceeds" }),
    sub({ user_id: "u1", cap_id: "C2", band: "Exceeds" }),
    sub({ user_id: "u1", cap_id: "C5", band: "Not yet" }),
  );
  const r = await worker.fetch(await req("/api/admin/curriculum", { token: rawToken }), env);
  const b = await r.json();
  check("200 admin/curriculum as founder", r.status === 200 && b.ok === true);
  check("learner total excludes the founder", b.totals.learners === 2 && b.totals.staff === 1);
  check("hardest competency sorts first", b.competencies[0].capId === "C1" && b.competencies[1].capId === "C2");
  const c1 = b.competencies[0];
  check("below-Meets is a share of attempts, not a learner count", c1.belowMeetsPct === 50);
  check("band counts are kept separately", c1.bands["Meets"] === 1 && c1.bands["Not yet"] === 1);
  check("reach counts distinct learners, not attempts", c1.learnersReached === 2 && c1.reachPct === 100);
  check("curriculum excludes staff submissions", b.totals.submissions === 3 && !b.competencies.some((c) => c.capId === "C5"),
    `expected 3 learner submissions and no C5, got ${b.totals.submissions} / ${JSON.stringify(b.competencies.map((c) => c.capId))}`);
  check("M1 funnel is learner-scoped", b.funnel.every((f) => f.reachPct === 100 || f.reachPct === 50),
    JSON.stringify(b.funnel));
}

// 37. GET /api/admin/curriculum — empty cohort must not divide by zero
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  const b = await (await worker.fetch(await req("/api/admin/curriculum", { token: rawToken }), env)).json();
  check("empty curriculum returns zeroed, not NaN", b.totals.submissions === 0
    && b.competencies.length === 0 && b.funnel.length === 0 && b.checkpoints.length === 0);
}

// 38. GET /api/admin/curriculum — checkpoint pass rate counts learners, and is 0-safe
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  const base = { user_id: "u2", cap_id: "C1", challenge_id: null, band: "Meets", confidence: "high",
    duration_ms: 1000, completed_at: "2026-02-01T00:00:00.000Z" };
  // Two attempts at CP1, one per learner: one passed, one did not -> 50%. u1 is the founder
  // and also attempts CP1, which must not enter the pass rate.
  env.DB._submissions.push(
    { ...base, id: "p1", checkpoint_id: "CP1" },
    { ...base, id: "p2", checkpoint_id: "CP1", user_id: "u3", band: "Not yet" },
    { ...base, id: "p3", checkpoint_id: "CP1", user_id: "u1", band: "Exceeds" },
  );
  env.DB._users.push({ id: "u2", email: "second@example.com", role: "learner" });
  env.DB._users.push({ id: "u3", email: "third@example.com", role: "learner" });
  const b = await (await worker.fetch(await req("/api/admin/curriculum", { token: rawToken }), env)).json();
  const cp1 = b.checkpoints.find((c) => c.checkpointId === "CP1");
  check("checkpoint pass rate is per learner", cp1 && cp1.learners === 2 && cp1.attempts === 2 && cp1.passRatePct === 50,
    JSON.stringify(cp1));
  check("checkpoint pass rate ignores staff attempts", cp1 && cp1.attempts === 2, JSON.stringify(cp1));
}

// 39. GET /api/admin/institution — auth gate
{
  const { env, rawToken } = await makeEnv({ role: "learner" });
  check("403 admin/institution as learner", (await worker.fetch(await req("/api/admin/institution", { token: rawToken }), env)).status === 403);
  const { env: env2 } = await makeEnv();
  check("401 admin/institution signed out", (await worker.fetch(await req("/api/admin/institution"), env2)).status === 401);
}

// 40. GET /api/admin/institution — an unreviewed escalation is counted, and reviewing it clears the count.
// This is the M6 "zero unreviewed escalations" gate read through the API.
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  const call = (id, verdict, degraded, latency, created) => env.DB.prepare(
    "INSERT INTO faculty_calls (id, kind, user_id, cp_id, rubric_dims, submission_json, policy_id, adapter, model, bands_json, verdict, confidence, degraded, status, latency_ms, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id, "checkpoint", "u1", "CP1", "[]", "{}", "pol-1", "dry-run", "none", "[]", verdict,
      "high", degraded, "ok", latency, created).run();
  call("fc1", "ready", 0, 120, "2026-02-01T00:00:00.000Z");
  call("fc2", "escalate", 1, 900, "2026-02-02T00:00:00.000Z");

  let b = await (await worker.fetch(await req("/api/admin/institution", { token: rawToken }), env)).json();
  check("200 admin/institution as founder", b.ok === true);
  check("only the non-'ready' call counts as disputed", b.totals.calls === 2 && b.totals.disputed === 1);
  check("unreviewed escalation is visible (M6 gate input)", b.totals.unreviewed === 1);
  check("degraded calls are counted", b.totals.degraded === 1);
  check("dry-run adapter means no live model call", b.totals.liveModelCalls === 0);
  check("verdict tally separates ready from escalate", b.byVerdict.find((v) => v.value === "ready").n === 1);
  check("latency averages across calls", b.avgLatencyMs === 510);
  check("lineage carries the learner email", b.lineage[0].email === "learner@example.com");
  check("lineage is newest first", b.lineage[0].id === "fc2" && b.lineage[1].id === "fc1");

  // A human reviews the escalation -> the open count must drop to zero.
  env.DB.prepare("INSERT INTO faculty_reviews (id, call_id, reviewer_user_id, decision, note, created_at) VALUES (?,?,?,?,?,?)")
    .bind("fr1", "fc2", "u1", "uphold", "agreed with the escalation", "2026-02-03T00:00:00.000Z").run();
  b = await (await worker.fetch(await req("/api/admin/institution", { token: rawToken }), env)).json();
  check("reviewing the escalation clears the unreviewed count", b.totals.unreviewed === 0);
  check("review is attached to the right call in lineage", b.lineage[0].reviewed === true
    && b.lineage[0].reviewDecision === "uphold" && b.lineage[1].reviewed === false);
  check("review decision is tallied", b.reviewDecisions.find((d) => d.value === "uphold").n === 1);
}

// 41. GET /api/admin/institution — no calls at all must not divide by zero
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  const b = await (await worker.fetch(await req("/api/admin/institution", { token: rawToken }), env)).json();
  check("empty institution returns zeroed, not NaN", b.totals.calls === 0
    && b.totals.unreviewed === 0 && b.avgLatencyMs === null && b.lineage.length === 0);
}

// 43. unconfigured -> dry-run, and the model is never contacted
{
  const { env, rawToken } = await makeEnv();
  let called = false;
  const { res, body } = await withFetch(async () => { called = true; throw new Error("must not be called"); },
    () => assess(env, rawToken));
  check("assess is not 200 when no model can read it", res.status === 409);
  check("no key -> 409 not_configured", res.status === 409 && body.error === "not_configured");
  check("unconfigured adapter never calls the model", called === false);
  check("nothing is assessed and nothing is banded", body.assessed === false
    && body.verdict === undefined && body.bands === undefined && body.degraded === undefined);
  check("lineage records the gap, not a verdict", env.DB._faculty[0].adapter === "none"
    && env.DB._faculty[0].verdict === null && env.DB._faculty[0].status === "not_configured");
}

// 44. configured -> the model decides, and the lineage says so
{
  const { env, rawToken } = await makeEnv();
  modelEnv(env);
  const { res, body } = await withFetch(bandsReply(GOOD), () => assess(env, rawToken));
  check("200 assess with a model configured", res.status === 200);
  check("adapter reports openai-compatible and the model name", body.adapter === "openai-compatible" && body.model === "assessor-1");
  check("bands come from the model", body.bands.Clarity === "Meets" && body.bands.Specificity === "Exceeds");
  check("a live call is not degraded", body.degraded === false);
  check("verdict recomputed from model bands reaches ready", body.verdict === "ready");
  const call = env.DB._faculty[0];
  check("lineage records the live adapter and model", call.adapter === "openai-compatible" && call.model === "assessor-1");
  check("lineage records the model bands verbatim", JSON.parse(call.bands_json).Clarity === "Meets");
  const sent = modelReply.last;
  check("request goes to base URL + /chat/completions", sent.url === "https://model.test/v1/chat/completions");
  check("key is sent as a bearer token, not in the body", sent.init.headers.Authorization === "Bearer sk-test"
    && !JSON.stringify(JSON.parse(sent.init.body)).includes("sk-test"));
  check("configured model name is sent, temperature pinned to 0",
    JSON.parse(sent.init.body).model === "assessor-1" && JSON.parse(sent.init.body).temperature === 0);
}

// 45. integrity: the model's own "ready" claim is ignored — the verdict is recomputed
{
  const { env, rawToken } = await makeEnv();
  modelEnv(env);
  const { body } = await withFetch(
    bandsReply({ Clarity: "Not yet", Specificity: "Not yet" }), () => assess(env, rawToken));
  check("a model claiming ready on below-Meets bands does not get ready", body.verdict === "more");
  check("weak dimensions are derived from the model bands", body.weakDims.length === 2);
  check("confidence follows the recomputed verdict", body.confidence === "low");
}

// 46. A malformed model reply must produce NO verdict.
//
// These five cases used to assert "falls back and flags degraded ... 200" — the endpoint caught a
// bad reply and substituted the word-count scorer, so a learner was shown "Meets" and "Exceeds"
// attributed to a faculty member, on an answer the model had failed to grade. The degraded flag
// was honest about the plumbing and dishonest about the content: the bands were still fiction.
// A model that cannot answer has not assessed anything, so the response says exactly that.
const badModel = [
  ["a band outside the scale", bandsReply({ Clarity: "Brilliant", Specificity: "Meets" })],
  ["a dimension missing from the reply", bandsReply({ Clarity: "Meets" })],
  ["prose with no JSON at all", modelReply("I think this is quite good overall, well done.")],
  ["malformed JSON", modelReply("{bands: {Clarity: 'Meets',")],
  ["an empty content block", modelReply("")],
];
for (const [label, handler] of badModel) {
  const { env, rawToken } = await makeEnv();
  modelEnv(env);
  const { res, body } = await withFetch(handler, () => assess(env, rawToken));
  const call = env.DB._faculty[0];
  check(`no verdict on ${label}`, res.status === 502 && body.ok === false
    && body.error === "model_unavailable" && body.assessed === false);
  check(`no bands reach the learner on ${label}`, body.bands === undefined && body.verdict === undefined);
  check(`the heuristic scorer is not substituted on ${label}`, body.adapter === undefined);
  check(`lineage records the failure on ${label}`, call.degraded === 1 && call.status === "error"
    && call.verdict === null && call.adapter === "openai-compatible");
  check(`the learner is told no verdict was given on ${label}`, /No verdict is produced/.test(body.reason || ""));
}

// 47. a transport failure is reported, not substituted. A dead provider costs the learner their
// verdict — which is the point. Silently degrading would hand them someone else's.
{
  const { env, rawToken } = await makeEnv();
  modelEnv(env);
  const boom = async () => { throw new Error("ECONNREFUSED"); };
  const { res, body } = await withFetch(boom, () => assess(env, rawToken));
  check("network throw reports 502 rather than 500ing", res.status === 502 && body.degraded === true);
  check("network throw yields no verdict", body.verdict === undefined && body.bands === undefined);
  check("network throw detail is carried for debugging", /ECONNREFUSED/.test(body.detail || ""));
  check("network throw offers a way forward", /rubric yourself/.test(body.remedy || ""));

  const { env: env2, rawToken: t2 } = await makeEnv();
  modelEnv(env2);
  const http500 = async () => new Response("upstream boom", { status: 500 });
  const b2 = await withFetch(http500, () => assess(env2, t2));
  check("http 500 reports 502 with no verdict", b2.res.status === 502 && b2.body.verdict === undefined);
}

// 48. the config flag, not just the key, turns the model on
{
  const { env, rawToken } = await makeEnv();
  modelEnv(env, { FACULTY_ADAPTER: "dry-run" });
  let called = false;
  const { body } = await withFetch(async () => { called = true; return new Response("{}", { status: 200 }); },
    () => assess(env, rawToken));
  check("adapter pinned to dry-run ignores a configured model", body.adapter === "dry-run" && called === false);
}
{
  const { env, rawToken } = await makeEnv();
  modelEnv(env, { FACULTY_MODEL_NAME: "" });
  let called = false;
  const { body } = await withFetch(async () => { called = true; return new Response("{}", { status: 200 }); },
    () => assess(env, rawToken));
  // A half-configured model is still no model. It must not be half-used, and the scorer must not
  // be quietly promoted into its place.
  check("a partial config (no model name) is not_configured, not dry-run",
    body.error === "not_configured" && body.adapter === "openai-compatible" && called === false);
  check("a partial config produces no verdict", body.verdict === undefined && body.bands === undefined);
}

// 49. fenced JSON is a normal model failure mode and is handled, not treated as garbage
{
  const { env, rawToken } = await makeEnv();
  modelEnv(env);
  const fenced = modelReply("Sure!\n```json\n" + JSON.stringify({ bands: GOOD, note: "ok" }) + "\n```");
  const { body } = await withFetch(fenced, () => assess(env, rawToken));
  check("fenced JSON parses and is not degraded",
    body.degraded === false && body.adapter === "openai-compatible" && body.bands.Clarity === "Meets");
}


// 50. Readiness must report the adapter and the key separately, so a set key with a dry-run
// adapter can never be mistaken for a live faculty plane.
{
  const { env, rawToken } = await makeEnv({ role: "founder" });
  const off = await (await worker.fetch(await req("/api/admin/readiness", { token: rawToken }), env)).json();
  check("readiness: unconfigured reports dry-run and not configured",
    off.controls.faculty.adapter === "dry-run" && off.controls.faculty.modelConfigured === false);

  modelEnv(env, { FACULTY_ADAPTER: "dry-run" });
  const pinned = await (await worker.fetch(await req("/api/admin/readiness", { token: rawToken }), env)).json();
  check("readiness: key set but adapter dry-run is still reported as dry-run",
    pinned.controls.faculty.adapter === "dry-run" && pinned.controls.faculty.modelConfigured === true);

  modelEnv(env, { FACULTY_ADAPTER: "openai-compatible" });
  const live = await (await worker.fetch(await req("/api/admin/readiness", { token: rawToken }), env)).json();
  check("readiness: only a non-dry-run adapter reports live",
    live.controls.faculty.adapter === "openai-compatible" && live.controls.faculty.modelConfigured === true);
}

// 43. GET /api/admin/learners — the cohort table must not list staff accounts.
// The founder's own QA session used to appear as a learner, complete with time on platform,
// competencies done and an average band.
{
  const tokenHash = await sha256Hex("tk-f");
  const env = {
    DB: makeFakeDB({ users: [
      { id: "uf", email: "founder@example.com", created_at: "2026-01-01T00:00:00.000Z", role: "founder" },
      { id: "ur", email: "reviewer@example.com", created_at: "2026-01-01T00:00:00.000Z", role: "reviewer" },
      { id: "ul", email: "learner@example.com", created_at: "2026-01-02T00:00:00.000Z", role: "learner" },
    ], sessions: [
      { token_hash: tokenHash, user_id: "uf", created_at: "2026-01-01T00:00:00.000Z", expires_at: "2099-01-01T00:00:00.000Z" },
    ] }),
    SIGNUPS: makeKV(), RESEND_API_KEY: "", DEV_LINKS: "true", APP_ORIGIN: "https://aifaculty.org",
    rate_limit: { window_seconds: 3600, max_per_ip: 3 },
  };
  // The founder has the richer history, so a leak is obvious: 3 submissions and a 5 minute
  // session, against the learner's 1 submission and a 1 second session.
  const t0 = Date.now() - 600000;
  const at = (off) => new Date(t0 + off).toISOString();
  env.DB._activity.push({ id: "x1", user_id: "uf", ts: at(0), kind: "view", detail: null });
  env.DB._activity.push({ id: "x2", user_id: "uf", ts: at(300000), kind: "view", detail: null });
  env.DB._submissions.push({ id: "x3", user_id: "uf", kind: "challenge", cap_id: "C5", challenge_id: "C5.1",
    checkpoint_id: null, band: "Exceeds", confidence: "high", fields_json: "{}", duration_ms: 90000,
    started_at: at(0), completed_at: at(300000) });
  env.DB._submissions.push({ id: "x3b", user_id: "uf", kind: "challenge", cap_id: "C6", challenge_id: "C6.1",
    checkpoint_id: null, band: "Exceeds", confidence: "high", fields_json: "{}", duration_ms: 90000,
    started_at: at(0), completed_at: at(300000) });
  env.DB._submissions.push({ id: "x3c", user_id: "uf", kind: "challenge", cap_id: "C7", challenge_id: "C7.1",
    checkpoint_id: null, band: "Exceeds", confidence: "high", fields_json: "{}", duration_ms: 90000,
    started_at: at(0), completed_at: at(300000) });
  env.DB._activity.push({ id: "x5", user_id: "ul", ts: at(0), kind: "view", detail: null });
  env.DB._submissions.push({ id: "x4", user_id: "ul", kind: "challenge", cap_id: "C1", challenge_id: "C1.1",
    checkpoint_id: null, band: "Meets", confidence: "medium", fields_json: "{}", duration_ms: 1000,
    started_at: at(0), completed_at: at(1000) });

  const r = await worker.fetch(await req("/api/admin/learners", { token: "tk-f" }), env);
  const b = await r.json();
  check("200 admin/learners as founder", r.status === 200 && b.ok === true);
  check("cohort table lists only learners",
    b.learners.length === 1 && b.learners[0].email === "learner@example.com",
    JSON.stringify(b.learners.map((l) => l.email)));
  check("staff reported separately, not listed", b.staff === 2, `staff=${b.staff}`);
  // sumActiveMs sums the gaps between events, so a 1s session is 1000 and the founder's is 300000.
  check("staff activity does not reach the cohort row",
    b.learners[0].timeOnPlatformMs === 1000 && b.learners[0].competenciesDone === 1,
    `time=${b.learners[0].timeOnPlatformMs} done=${b.learners[0].competenciesDone}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
