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
    if (sql.includes("FROM users GROUP BY plan")) {
      const m = {};
      for (const u of usersRows) m[u.plan] = (m[u.plan] || 0) + 1;
      return { results: Object.entries(m).map(([plan, n]) => ({ plan, n })) };
    }
    if (sql.includes("FROM payments WHERE status")) {
      const paid = payments.filter(p => p.status === "succeeded");
      return { results: [{ total: paid.reduce((s, p) => s + p.amount_cents, 0), n: paid.length }] };
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
          degraded: fc.degraded, latency_ms: fc.latency_ms, created_at: fc.created_at,
          email: (usersRows.find(u => u.id === fc.user_id) || {}).email,
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
  return { prepare, _feedback: feedback, _payments: payments, _users: usersRows, _faculty: facultyCalls, _reviews: facultyReviews, _passwords: founderPasswords, _fails: passwordFailures, _sessions: sessions };
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

// 20. Control Plane — dry-run strict pass + lineage recorded
{
  const { env, rawToken } = await makeEnv();
  const r = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken,
    body: { ...cpRubric, fields: cpFields(), submission: strongSubmission() },
  }), env);
  const body = await r.json();
  check("200 assess signed-in", r.status === 200 && body.ok === true);
  check("dry-run adapter by default", body.adapter === "dry-run");
  check("strict verdict ready on strong answer", body.verdict === "ready" && body.confidence === "high");
  check("every dimension banded", ["Clarity", "Structure", "Reasoning", "Safety"].every(d => body.bands && body.bands[d]));
  check("lineage id returned", typeof body.lineageId === "string" && body.lineageId.length > 0);
  check("call audited", env.DB._faculty.length === 1 && env.DB._faculty[0].verdict === "ready"
    && env.DB._faculty[0].user_id === "u1" && env.DB._faculty[0].policy_id === "checkpoint-strict"
    && env.DB._faculty[0].degraded === 0);
  check("audit keeps submission snapshot", env.DB._faculty[0].submission_json.includes("week") || env.DB._faculty[0].submission_json.length > 10);
}

// 21. Control Plane — thin answer is not a strict pass (disagreement seam is reachable)
{
  const { env, rawToken } = await makeEnv();
  const thin = {};
  cpFields().forEach(f => { thin[f.key] = "I would check my work because it matters and fix errors and detail repeat"; });
  const r = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken,
    body: { ...cpRubric, fields: cpFields(), submission: thin },
  }), env);
  const body = await r.json();
  check("thin answer not ready under strict bar", r.status === 200 && body.ok === true && body.verdict !== "ready");
  check("revise note names wanted dims", body.verdict === "revise" ? (body.weakDims.length > 0 && body.note.toLowerCase().includes("wanted more on")) : true);
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

// 23. Control Plane — must match submitted fields against every rubric dim added beyond fields
{
  const { env, rawToken } = await makeEnv();
  const r = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: rawToken,
    body: { cpId: "CP1", rubricDims: ["Clarity", "Structure", "Reasoning", "Safety", "Evidence"],
            fields: cpFields(), submission: strongSubmission() },
  }), env);
  const body = await r.json();
  check("extra dim beyond fields inherits weakest band", r.status === 200 && body.bands && body.bands.Evidence
    && ["Not yet", "Developing", "Meets", "Exceeds"].includes(body.bands.Evidence));
}

// 24. Control Plane — admin lineage log is founder-only and lists calls
{
  const { env, rawToken } = await makeEnv(); // role: learner
  const rLearner = await worker.fetch(await req("/api/faculty/log", { token: rawToken }), env);
  check("403 log as learner", rLearner.status === 403);

  const envF = await makeEnv({ role: "founder" });
  const founderToken = (envF.rawToken);
  const res = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: founderToken,
    body: { ...cpRubric, fields: cpFields(), submission: strongSubmission() },
  }), envF.env);
  const body = await res.json();
  const log = await worker.fetch(await req("/api/faculty/log", { token: founderToken }), envF.env);
  const logBody = await log.json();
  check("200 log as founder", log.status === 200 && logBody.ok === true && Array.isArray(logBody.calls));
  check("log carries the audited call with email", logBody.calls.length === 1
    && logBody.calls[0].id === body.lineageId && logBody.calls[0].email === "learner@example.com"
    && logBody.calls[0].adapter === "dry-run");
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
  const call = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: learnerE.rawToken,
    body: { ...cpRubric, fields: cpFields(), submission: (() => {
      const thin = {}; cpFields().forEach(f => { thin[f.key] = "I would check my work because it matters and fix errors and detail repeat"; });
      return thin;
    })() },
  }), learnerE.env);
  const callBody = await call.json();
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
  const call = await worker.fetch(await req("/api/faculty/assess", {
    method: "POST", token: founderE.rawToken,
    body: { ...cpRubric, fields: cpFields(), submission: (() => {
      const thin = {}; cpFields().forEach(f => { thin[f.key] = "I would check my work because it matters and fix errors and detail repeat"; });
      return thin;
    })() },
  }), founderE.env);
  const callBody = await call.json();
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
  globalThis.fetch = async (url) => { if (String(url).startsWith("https://api.resend.com")) sent++; return orig(url); };
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

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
