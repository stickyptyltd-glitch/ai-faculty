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
  const usersRows = users.map(u => ({ plan: "free", plan_status: "none", stripe_customer_id: null, ...u }));

  async function first(sql, args) {
    if (sql.includes("FROM sessions WHERE token_hash")) {
      return sessions.find(s => s.token_hash === args[0]) || null;
    }
    if (sql.includes("FROM users WHERE id")) {
      return usersRows.find(u => u.id === args[0]) || null;
    }
    if (sql.includes("FROM users WHERE email")) {
      const email = String(args[0] || "").toLowerCase();
      return usersRows.find(u => u.email === email) || null;
    }
    if (sql.includes("FROM users WHERE stripe_customer_id")) {
      return usersRows.find(u => u.stripe_customer_id === args[0]) || null;
    }
    return null;
  }
  async function run(sql, args) {
    if (sql.startsWith("INSERT INTO feedback")) {
      const [id, user_id, text, page_context, rating, created_at] = args;
      feedback.push({ id, user_id, text, page_context, rating, created_at });
    } else if (sql.startsWith("INSERT INTO users")) {
      const [id, email, display_name, created_at] = args;
      usersRows.push({ id, email, display_name, created_at, role: "learner", plan: "free", plan_status: "none", stripe_customer_id: null });
    } else if (sql.includes("WHERE stripe_customer_id = ?")) {
      const [plan, status, cust] = args; // subscription sync: (plan, status, stripe_customer_id)
      const u = usersRows.find(u => u.stripe_customer_id === cust);
      if (u) { u.plan = plan; u.plan_status = status; }
    } else if (sql.startsWith("UPDATE users SET plan")) {
      const [plan, planStatus, stripeId, userId] = args; // applyGrant order
      const u = usersRows.find(u => u.id === userId);
      if (u) { u.plan = plan; u.plan_status = planStatus; if (stripeId) u.stripe_customer_id = stripeId; }
    } else if (sql.startsWith("INSERT OR IGNORE INTO payments")) {
      const [id, user_id, stripe_event_id, event_type, plan, amount, currency, status, created_at] = args;
      if (!payments.some(p => p.stripe_event_id === stripe_event_id)) {
        payments.push({ id, user_id, stripe_event_id, event_type, plan, amount_cents: amount, currency, status, created_at });
      }
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
          email: (usersRows.find(u => u.id === f.user_id) || {}).email,
        }));
      return { results: rows };
    }
    if (sql.includes("FROM users GROUP BY plan")) {
      const m = {};
      for (const u of usersRows) m[u.plan] = (m[u.plan] || 0) + 1;
      return { results: Object.entries(m).map(([plan, n]) => ({ plan, n })) };
    }
    if (sql.includes("FROM payments WHERE status")) {
      const paid = payments.filter(p => p.status === "succeeded");
      return { results: [{ total: paid.reduce((s, p) => s + p.amount_cents, 0), n: paid.length }] };
    }
    if (sql.includes("FROM users")) return { results: usersRows };
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
  return { prepare, _feedback: feedback, _payments: payments, _users: usersRows };
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
  check("learners counted", body.totals.learners === 1);
  check("revenue total", body.revenue.lifetimeCents === 15000 && body.revenue.payments === 1);
  check("free plan count", body.planCounts.free === 1);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
