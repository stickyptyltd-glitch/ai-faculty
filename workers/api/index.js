// AI Faculty — accounts API (Phase 1: passwordless magic-link auth).
// Progress/curriculum stays 100% in the browser's localStorage (see app/js/store.js) —
// this Worker only ever touches identity/session data. See docs/09... no: see the plan at
// commit time (docs/continuity-log.md v0.18) for the phased rollout this belongs to.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ORIGIN_RE = /^https:\/\/([a-z0-9-]+\.)*aifaculty\.(org|pages\.dev)$/;
const SESSION_COOKIE = "af_session";
const LINK_TTL_MS = 15 * 60 * 1000;        // 15 minutes
const SESSION_TTL_S = 30 * 24 * 3600;      // 30 days

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allow = ALLOWED_ORIGIN_RE.test(origin) ? origin : "https://aifaculty.org";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(status, data, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
  });
}

function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

// Scoped to /api — the only place that reads it — so it isn't sent to the landing page,
// /app/, or the signup Worker as more paths get added under aifaculty.org.
function sessionCookie(token, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${maxAgeSeconds}`;
}
function clearCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0`;
}

function ipKey(request) {
  const cf = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for");
  return cf ? cf.split(",")[0].trim() : "unknown";
}

function readRate(env) {
  const w = env.rate_limit ? Number(env.rate_limit.window_seconds) : 3600;
  const m = env.rate_limit ? Number(env.rate_limit.max_per_ip) : 8;
  return { window: isNaN(w) || w <= 0 ? 3600 : w, max: isNaN(m) || m <= 0 ? 8 : m };
}

async function rateLimited(request, env, bucketPrefix) {
  const KV = env.SIGNUPS;
  if (!KV) return false;
  const { window, max } = readRate(env);
  const ip = ipKey(request);
  const now = Date.now();
  const bucket = `${bucketPrefix}:${ip}`;
  const raw = await KV.get(bucket, "text");
  let rl = raw ? JSON.parse(raw) : null;
  // Fresh bucket, or the window has rolled over — start counting again rather than
  // incrementing forever (the old version kept sliding expirationTtl forward on every hit,
  // so a sustained stream of requests never actually got blocked once the window "expired").
  if (!rl || now >= rl.reset) rl = { count: 0, reset: now + window * 1000 };
  if (rl.count >= max) return true;
  rl.count += 1;
  await KV.put(bucket, JSON.stringify(rl), { expirationTtl: Math.ceil(window) });
  return false;
}

// ---- handlers -------------------------------------------------------

async function handleRequestLink(request, env, headers) {
  if (await rateLimited(request, env, "authrl")) {
    return json(429, { ok: false, error: "rate_limited" }, headers);
  }
  let body;
  try { body = await request.json(); } catch { return json(400, { ok: false, error: "invalid_json" }, headers); }
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return json(400, { ok: false, error: "invalid_email" }, headers);

  const now = new Date();
  // Bound both tables here rather than only ever checking expiry — this endpoint is the one
  // an attacker would hammer, so it's also the cheapest place to sweep what that would pile up.
  await env.DB.prepare("DELETE FROM magic_links WHERE expires_at < ?").bind(now.toISOString()).run();
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now.toISOString()).run();

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expires = new Date(now.getTime() + LINK_TTL_MS);
  await env.DB.prepare(
    "INSERT INTO magic_links (token_hash, email, created_at, expires_at) VALUES (?, ?, ?, ?)"
  ).bind(tokenHash, email, now.toISOString(), expires.toISOString()).run();

  const verifyUrl = `${env.APP_ORIGIN}/api/auth/verify?token=${token}`;
  const apiKey = env.RESEND_API_KEY || "";
  if (apiKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: [email],
        subject: "Your AI Faculty sign-in link",
        text: `Click to sign in (expires in 15 minutes):\n\n${verifyUrl}\n\nIf you didn't request this, ignore this email.`,
      }),
    });
    return json(200, { ok: true, sent: true }, headers);
  }
  // Dev mode requires BOTH no Resend key AND an explicit DEV_LINKS=true — setting the Resend
  // key alone isn't what closes this, so it can't be closed by accident. With neither set,
  // sign-in is simply unavailable rather than handing out a working link for any email typed in.
  if (env.DEV_LINKS === "true") {
    return json(200, { ok: true, sent: false, dev_link: verifyUrl }, headers);
  }
  return json(503, { ok: false, error: "signin_unavailable" }, headers);
}

async function handleVerify(request, env) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const fail = () => new Response(null, {
    status: 302,
    headers: { Location: `${env.APP_ORIGIN}/app/#/login?error=invalid_or_expired` },
  });
  if (!token) return fail();

  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare("SELECT * FROM magic_links WHERE token_hash = ?").bind(tokenHash).first();
  const now = new Date();
  if (!row || row.used_at || new Date(row.expires_at) < now) return fail();

  await env.DB.prepare("UPDATE magic_links SET used_at = ? WHERE token_hash = ?")
    .bind(now.toISOString(), tokenHash).run();

  let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(row.email).first();
  if (!user) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, email, display_name, created_at) VALUES (?, ?, NULL, ?)")
      .bind(id, row.email, now.toISOString()).run();
    user = { id, email: row.email };
  }

  const sessionToken = randomToken();
  const sessionHash = await sha256Hex(sessionToken);
  const sessionExpires = new Date(now.getTime() + SESSION_TTL_S * 1000);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(sessionHash, user.id, now.toISOString(), sessionExpires.toISOString()).run();

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${env.APP_ORIGIN}/app/#/account`,
      "Set-Cookie": sessionCookie(sessionToken, SESSION_TTL_S),
    },
  });
}

async function currentUser(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const session = await env.DB.prepare("SELECT * FROM sessions WHERE token_hash = ?").bind(tokenHash).first();
  if (!session || new Date(session.expires_at) < new Date()) return null;
  const user = await env.DB.prepare(
    "SELECT id, email, display_name, created_at, role, plan, plan_status, stripe_customer_id FROM users WHERE id = ?"
  ).bind(session.user_id).first();
  return user || null;
}

// Small reusable guards — every route below uses one of these instead of inlining its own
// currentUser() check, unlike the original single handleMe check.
async function requireAuth(request, env, headers) {
  const user = await currentUser(request, env);
  return user ? { user } : { error: json(401, { ok: false, error: "not_signed_in" }, headers) };
}
async function requireFounder(request, env, headers) {
  const r = await requireAuth(request, env, headers);
  if (r.error) return r;
  if (r.user.role !== "founder") return { error: json(403, { ok: false, error: "forbidden" }, headers) };
  return r;
}

async function handleMe(request, env, headers) {
  const user = await currentUser(request, env);
  if (!user) return json(401, { ok: false, error: "not_signed_in" }, headers);
  return json(200, { ok: true, user }, headers);
}

async function handleLogout(request, env, headers) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await sha256Hex(token);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  return json(200, { ok: true }, { ...headers, "Set-Cookie": clearCookie() });
}

// ---- progress sync (Phase A: additive telemetry, never blocks the local-first save) -----

async function handleProgressSync(request, env, headers) {
  const auth = await requireAuth(request, env, headers);
  if (auth.error) return auth.error;
  let body;
  try { body = await request.json(); } catch { return json(400, { ok: false, error: "invalid_json" }, headers); }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  if (body.type === "submission") {
    const band = ["Not yet", "Developing", "Meets", "Exceeds"].includes(body.band) ? body.band : "Meets";
    const kind = body.kind === "checkpoint" ? "checkpoint" : "challenge";
    await env.DB.prepare(
      `INSERT INTO submissions
       (id, user_id, kind, pathway_id, cap_id, challenge_id, checkpoint_id, band, confidence,
        fields_json, started_at, completed_at, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, auth.user.id, kind, body.pathwayId || null, String(body.capId || ""),
      body.challengeId || null, body.checkpointId || null, band, body.confidence || null,
      JSON.stringify(body.fields || {}), body.startedAt || null, now,
      Number.isFinite(body.durationMs) ? Math.round(body.durationMs) : null
    ).run();
    return json(200, { ok: true, id }, headers);
  }

  if (body.type === "activity") {
    await env.DB.prepare("INSERT INTO activity_log (id, user_id, ts, kind, detail) VALUES (?, ?, ?, ?, ?)")
      .bind(id, auth.user.id, now, String(body.kind || "unknown"), body.detail != null ? String(body.detail) : null)
      .run();
    return json(200, { ok: true, id }, headers);
  }

  return json(400, { ok: false, error: "unknown_type" }, headers);
}

// ---- feedback (Phase C: a small persistent channel, any signed-in learner) --------------

const FEEDBACK_MAX_CHARS = 4000;

async function handleFeedbackSubmit(request, env, headers) {
  const auth = await requireAuth(request, env, headers);
  if (auth.error) return auth.error;
  // Keyed by IP like the auth rate limit — this endpoint is authenticated, but a compromised
  // or scripted session shouldn't be able to flood the table any more than a logged-out one
  // could flood magic-link requests.
  if (await rateLimited(request, env, "feedbackrl")) {
    return json(429, { ok: false, error: "rate_limited" }, headers);
  }
  let body;
  try { body = await request.json(); } catch { return json(400, { ok: false, error: "invalid_json" }, headers); }

  const text = String(body.text || "").trim();
  if (!text) return json(400, { ok: false, error: "empty_text" }, headers);
  if (text.length > FEEDBACK_MAX_CHARS) return json(400, { ok: false, error: "too_long" }, headers);

  let rating = null;
  if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
    const r = Number(body.rating);
    if (Number.isInteger(r) && r >= 1 && r <= 5) rating = r;
  }
  const pageContext = body.pageContext ? String(body.pageContext).slice(0, 200) : null;

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await env.DB.prepare(
    "INSERT INTO feedback (id, user_id, text, page_context, rating, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(id, auth.user.id, text, pageContext, rating, now).run();

  return json(200, { ok: true, id }, headers);
}

async function handleAdminFeedback(request, env, headers) {
  const auth = await requireFounder(request, env, headers);
  if (auth.error) return auth.error;
  const { results } = await env.DB.prepare(
    `SELECT feedback.id, feedback.text, feedback.page_context, feedback.rating, feedback.created_at,
            users.email
     FROM feedback JOIN users ON users.id = feedback.user_id
     ORDER BY feedback.created_at DESC LIMIT 200`
  ).all();
  return json(200, { ok: true, feedback: results }, headers);
}

// ---- founder admin panel -------------------------------------------------------------

const SESSION_GAP_MS = 20 * 60 * 1000; // consecutive events under this gap count as one continuous session

// Reconstruct "time on platform" per user from raw timestamps (no live heartbeat tracking —
// see the plan this shipped under: cheaper, adequate for founder-level reporting, and it
// doesn't require every open tab to ping the server).
function sumActiveMs(timestampsMs) {
  if (timestampsMs.length < 2) return 0;
  const sorted = [...timestampsMs].sort((a, b) => a - b);
  let total = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i] - sorted[i - 1];
    if (gap > 0 && gap <= SESSION_GAP_MS) total += gap;
  }
  return total;
}

async function handleAdminOverview(request, env, headers) {
  const auth = await requireFounder(request, env, headers);
  if (auth.error) return auth.error;

  const [{ results: users }, { results: subs }, { results: acts }, { results: planRows }, { results: payRows }] = await Promise.all([
    env.DB.prepare("SELECT id, email, created_at, plan FROM users").all(),
    env.DB.prepare("SELECT user_id, pathway_id, cap_id, band, duration_ms, completed_at FROM submissions").all(),
    env.DB.prepare("SELECT user_id, ts FROM activity_log").all(),
    env.DB.prepare("SELECT plan, COUNT(*) AS n FROM users GROUP BY plan").all(),
    env.DB.prepare("SELECT COALESCE(SUM(amount_cents), 0) AS total, COUNT(*) AS n FROM payments WHERE status = 'succeeded'").all(),
  ]);

  const planCounts = {};
  for (const r of planRows) planCounts[r.plan || "free"] = r.n;
  const revenue = {
    lifetimeCents: Number(payRows[0]?.total || 0),
    payments: Number(payRows[0]?.n || 0),
    payingLearners: Object.entries(planCounts).reduce((s, [plan, n]) => s + (plan === "free" ? 0 : n), 0),
  };

  const now = Date.now();
  const day = 24 * 3600 * 1000;
  const byUserActs = {};
  for (const a of acts) (byUserActs[a.user_id] ||= []).push(new Date(a.ts).getTime());
  let activeToday = 0, activeWeek = 0;
  for (const uid of Object.keys(byUserActs)) {
    const last = Math.max(...byUserActs[uid]);
    if (now - last <= day) activeToday++;
    if (now - last <= 7 * day) activeWeek++;
  }

  const pathwayCounts = {};
  const capStats = {}; // cap_id -> { attempts, belowMeets, totalDuration, durationCount }
  for (const s of subs) {
    if (s.pathway_id) pathwayCounts[s.pathway_id] = (pathwayCounts[s.pathway_id] || 0) + 1;
    const cs = (capStats[s.cap_id] ||= { attempts: 0, belowMeets: 0, totalDuration: 0, durationCount: 0 });
    cs.attempts++;
    if (s.band === "Not yet" || s.band === "Developing") cs.belowMeets++;
    if (Number.isFinite(s.duration_ms)) { cs.totalDuration += s.duration_ms; cs.durationCount++; }
  }
  const popularPathways = Object.entries(pathwayCounts).sort((a, b) => b[1] - a[1])
    .map(([pathwayId, submissions]) => ({ pathwayId, submissions }));
  const struggle = Object.entries(capStats).map(([capId, s]) => ({
    capId, attempts: s.attempts,
    belowMeetsPct: s.attempts ? Math.round((s.belowMeets / s.attempts) * 100) : 0,
    avgDurationMs: s.durationCount ? Math.round(s.totalDuration / s.durationCount) : null,
  })).sort((a, b) => b.belowMeetsPct - a.belowMeetsPct);

  return json(200, {
    ok: true,
    totals: { learners: users.length, activeToday, activeWeek, submissions: subs.length },
    planCounts,
    revenue,
    popularPathways,
    struggle,
  }, headers);
}

async function handleAdminLearners(request, env, headers) {
  const auth = await requireFounder(request, env, headers);
  if (auth.error) return auth.error;

  const [{ results: users }, { results: subs }, { results: acts }] = await Promise.all([
    env.DB.prepare("SELECT id, email, created_at FROM users").all(),
    env.DB.prepare("SELECT user_id, band, duration_ms, completed_at FROM submissions").all(),
    env.DB.prepare("SELECT user_id, ts FROM activity_log").all(),
  ]);

  const bandScore = { "Not yet": 0, "Developing": 1, "Meets": 2, "Exceeds": 3 };
  const byUserSubs = {}, byUserActs = {};
  for (const s of subs) (byUserSubs[s.user_id] ||= []).push(s);
  for (const a of acts) (byUserActs[a.user_id] ||= []).push(new Date(a.ts).getTime());

  const learners = users.map(u => {
    const mySubs = byUserSubs[u.id] || [];
    const myTimes = (byUserActs[u.id] || []).concat(
      mySubs.map(s => new Date(s.completed_at).getTime())
    );
    const avgBandScore = mySubs.length
      ? mySubs.reduce((sum, s) => sum + (bandScore[s.band] ?? 2), 0) / mySubs.length : null;
    const lastActive = myTimes.length ? new Date(Math.max(...myTimes)).toISOString() : null;
    return {
      id: u.id, email: u.email, createdAt: u.created_at,
      competenciesDone: mySubs.length,
      avgBandScore: avgBandScore != null ? Math.round(avgBandScore * 100) / 100 : null,
      timeOnPlatformMs: sumActiveMs(myTimes),
      lastActive,
    };
  }).sort((a, b) => (b.lastActive || "").localeCompare(a.lastActive || ""));

  return json(200, { ok: true, learners }, headers);
}

async function handleAdminLearnerDetail(request, env, headers, userId) {
  const auth = await requireFounder(request, env, headers);
  if (auth.error) return auth.error;

  const user = await env.DB.prepare("SELECT id, email, created_at, role FROM users WHERE id = ?").bind(userId).first();
  if (!user) return json(404, { ok: false, error: "not_found" }, headers);

  const [{ results: submissions }, { results: activity }] = await Promise.all([
    env.DB.prepare("SELECT * FROM submissions WHERE user_id = ? ORDER BY completed_at DESC").bind(userId).all(),
    env.DB.prepare("SELECT * FROM activity_log WHERE user_id = ? ORDER BY ts DESC LIMIT 200").bind(userId).all(),
  ]);
  const times = activity.map(a => new Date(a.ts).getTime())
    .concat(submissions.map(s => new Date(s.completed_at).getTime()));

  return json(200, {
    ok: true,
    user,
    timeOnPlatformMs: sumActiveMs(times),
    submissions,
    activity,
  }, headers);
}

// ---- monetization (Phase 1.6: Stripe Checkout + webhooks + plan ledger) ---------------
// Design: docs/11-monetization.md. Payments are opt-in — until STRIPE_SECRET_KEY is set every
// payments endpoint returns 501 and the UI degrades to "join the waitlist". No account is ever
// created before a payment; the webhook matches the payer by email, creates a users row if
// needed, and grants the plan. The payments ledger is append-only and feeds the founder revenue
// view (payment must never buy a grade — this is access + a money trail, nothing more).

const PAYMENT_PLANS = {
  free:    { id: "free",    name: "Free",          priceCents: 0,  cadence: "once",  human: "Free forever" },
  pro:     { id: "pro",     name: "Pro",           priceCents: 1500, cadence: "monthly", human: "$15/mo · or $120/yr" },
  annual:  { id: "annual",  name: "Pro (annual)",  priceCents: 12000, cadence: "yearly", human: "$120/yr" },
  founding: { id: "founding", name: "Founding Member", priceCents: 15000, cadence: "once", human: "$150 one-time · lifetime" },
};

function stripeConfigured(env) {
  return !!env.STRIPE_SECRET_KEY;
}

// Plain fetch to Stripe's REST API (form-encoded) — no SDK dependency in the Worker.
async function stripeFetch(env, path, params = {}) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      v.forEach((item, idx) => {
        if (item !== null && typeof item === "object") {
          for (const [ik, iv] of Object.entries(item)) body.append(`${k}[${idx}][${ik}]`, iv);
        }
        else if (item !== undefined && item !== null) body.append(`${k}[${idx}]`, item);
      });
    }
    else if (v !== null && typeof v === "object") {
      for (const [ik, iv] of Object.entries(v)) if (iv !== undefined && iv !== null) body.append(`${k}[${ik}]`, iv);
    }
    else if (v !== undefined && v !== null) body.append(k, v);
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  const data = await res.json().catch(() => null);
  return data && typeof data.error === "object" ? { error: data.error, status: res.status } : { data, status: res.status };
}

// Stripe webhook signature: HMAC-SHA256 over "<timestamp>.<raw body>", hex, compared to the
// v1= value in the Stripe-Signature header. The secret after "whsec_" is base64url.
function toHex(bytes) { return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join(""); }
function b64urlToBytes(b64) {
  return Uint8Array.from(atob(b64.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
}
async function stripeSignatureOk(env, rawBody, sigHeader) {
  if (!sigHeader) return false;
  const parts = {};
  for (const p of sigHeader.split(",")) {
    const [k, v] = p.split("=");
    if (k) parts[k.trim()] = (v || "").trim();
  }
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  // Reject signatures older than 5 minutes — replay protection.
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const secret = String(env.STRIPE_WEBHOOK_SECRET || "").replace(/^whsec_/, "");
  const key = await crypto.subtle.importKey(
    "raw", b64urlToBytes(secret).buffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${rawBody}`));
  const expect = toHex(mac);
  if (expect.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < expect.length; i++) diff |= expect.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

async function upsertUserByEmail(env, email, now) {
  const lower = String(email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(lower)) return null;
  let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(lower).first();
  if (!user) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, email, display_name, created_at) VALUES (?, ?, NULL, ?)")
      .bind(id, lower, now.toISOString()).run();
    user = { id, email: lower };
  }
  return user;
}

async function applyGrant(env, user, plan, planStatus, customerId, amountCents, currency, stripeEventId, eventType) {
  await env.DB.prepare(
    "UPDATE users SET plan = ?, plan_status = ?, stripe_customer_id = ? WHERE id = ?"
  ).bind(plan, planStatus, customerId || null, user.id).run();
  // Ledger: dedupe on stripe_event_id so a replayed webhook never double-counts revenue.
  await env.DB.prepare(
    "INSERT OR IGNORE INTO payments (id, user_id, stripe_event_id, event_type, plan, amount_cents, currency, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), user.id, stripeEventId, eventType, plan, amountCents, (currency || "usd").toLowerCase(), "succeeded", new Date().toISOString()).run();
}

function priceToPlan(env, priceId) {
  if (priceId && priceId === env.STRIPE_PRICE_FOUNDING) return "founding";
  return "pro";
}

async function handlePaymentsPlans(request, env, headers) {
  return json(200, { ok: true, stripeEnabled: stripeConfigured(env), plans: PAYMENT_PLANS }, headers);
}

async function handlePaymentsCheckout(request, env, headers) {
  if (!stripeConfigured(env)) return json(501, { ok: false, error: "payments_not_configured" }, headers);
  let body;
  try { body = await request.json(); } catch { return json(400, { ok: false, error: "invalid_json" }, headers); }

  const plan = String(body.plan || "");
  const cadence = String(body.cadence || "monthly");
  if (plan === "free") return json(400, { ok: false, error: "invalid_plan" }, headers);
  if (plan !== "founding" && plan !== "pro") return json(400, { ok: false, error: "invalid_plan" }, headers);

  const auth = await requireAuth(request, env, headers);
  const user = auth.error ? null : auth.user;
  const email = user ? user.email : (String(body.email || "").trim().toLowerCase() || undefined);
  if (!user && email && !EMAIL_RE.test(email)) return json(400, { ok: false, error: "invalid_email" }, headers);

  // Reuse the payer's Stripe customer when we already know it; otherwise Stripe's Checkout
  // collects (or keeps) the email and the webhook matches it below.
  let customerId = user && user.stripe_customer_id ? user.stripe_customer_id : null;
  if (!customerId && email) {
    const r = await stripeFetch(env, "/customers", { email });
    if (r.error) return json(502, { ok: false, error: "stripe_error", detail: r.error.message }, headers);
    customerId = r.data.id;
  }

  const isPro = plan === "pro";
  const price = isPro
    ? (cadence === "annual" ? env.STRIPE_PRICE_PRO_ANNUAL : env.STRIPE_PRICE_PRO_MONTHLY)
    : env.STRIPE_PRICE_FOUNDING;
  const mode = isPro ? "subscription" : "payment";

  const r = await stripeFetch(env, "/checkout/sessions", {
    mode,
    success_url: `${env.APP_ORIGIN}/app/#/account?plan=${plan}`,
    payment_method_types: ["card", "paypal"],
    cancel_url: `${env.APP_ORIGIN}/#pricing`,
    customer: customerId,
    customer_email: email && !customerId ? email : undefined,
    client_reference_id: user ? user.id : undefined,
    allow_promotion_codes: "true",
    line_items: [{ price, quantity: "1" }],
    metadata: { plan, userId: user ? user.id : "" },
  });
  if (r.error) return json(502, { ok: false, error: "stripe_error", detail: r.error.message }, headers);
  return json(200, { ok: true, url: r.data.url }, headers);
}

async function handlePaymentsBilling(request, env, headers) {
  if (!stripeConfigured(env)) return json(501, { ok: false, error: "payments_not_configured" }, headers);
  const auth = await requireAuth(request, env, headers);
  if (auth.error) return auth.error;
  if (!auth.user.stripe_customer_id) return json(400, { ok: false, error: "no_subscription" }, headers);
  const r = await stripeFetch(env, "/billing_portal/sessions", {
    customer: auth.user.stripe_customer_id,
    return_url: `${env.APP_ORIGIN}/app/#/account`,
  });
  if (r.error) return json(502, { ok: false, error: "stripe_error", detail: r.error.message }, headers);
  return json(200, { ok: true, url: r.data.url }, headers);
}

async function handlePaymentsWebhook(request, env, headers) {
  if (!stripeConfigured(env) || !env.STRIPE_WEBHOOK_SECRET) {
    return json(501, { ok: false, error: "payments_not_configured" }, headers);
  }
  const rawBody = await request.text();
  const ok = await stripeSignatureOk(env, rawBody, request.headers.get("Stripe-Signature") || "");
  if (!ok) return json(400, { ok: false, error: "invalid_signature" }, headers);

  let event;
  try { event = JSON.parse(rawBody); } catch { return json(400, { ok: false, error: "invalid_json" }, headers); }
  const type = event.type || "";
  const obj = event.data && event.data.object;

  if (type === "checkout.session.completed" && obj && obj.payment_status === "paid") {
    const now = new Date();
    const sessionEmail = (obj.customer_details && obj.customer_details.email) || obj.customer_email;
    const user = await upsertUserByEmail(env, sessionEmail, now);
    if (user) {
      const plan = (obj.metadata && obj.metadata.plan) || priceToPlan(env, obj.line_items && obj.line_items.data && obj.line_items.data[0] && obj.line_items.data[0].price && obj.line_items.data[0].price.id);
      await applyGrant(env, user, plan, plan === "pro" ? "active" : "active", obj.customer || null, obj.amount_total || 0, obj.currency || "usd", event.id, "checkout");
    }
    return json(200, { ok: true }, headers);
  }

  if (type.startsWith("customer.subscription.") && obj) {
    const plan = priceToPlan(env, obj.items && obj.items.data && obj.items.data[0] && obj.items.data[0].price && obj.items.data[0].price.id);
    const status = type === "customer.subscription.deleted" ? "canceled" : (obj.status || "active");
    const planField = status === "canceled" || status === "past_due" && plan === "pro" ? "free" : plan;
    await env.DB.prepare(
      "UPDATE users SET plan = ?, plan_status = ? WHERE stripe_customer_id = ?"
    ).bind(planField, status, obj.customer).run();
    return json(200, { ok: true }, headers);
  }

  if (type === "invoice.paid" && obj) {
    const now = new Date();
    const amount = obj.amount_paid || 0;
    const currency = obj.currency || "usd";
    const price = obj.lines && obj.lines.data && obj.lines.data[0] && obj.lines.data[0].price;
    const plan = priceToPlan(env, price && price.id);
    const user = await env.DB.prepare("SELECT * FROM users WHERE stripe_customer_id = ?").bind(obj.customer).first();
    if (user && amount > 0) {
      await applyGrant(env, user, plan, "active", obj.customer, amount, currency, event.id, "invoice");
    }
    return json(200, { ok: true }, headers);
  }

  return json(200, { ok: true, ignored: type }, headers);
}

// ---- Institutional AI Control Plane (Phase 3) --------------------------------------------------
// docs/01-architecture.md §3: model routing + adapters, policy engine, logging/lineage. v1 ships
// the full shape with a deterministic "dry-run" adapter (a server-side mirror of the client's strict
// second-assessment bar, so the independent opinion is genuinely computed off-device) and a swappable
// openai-compatible adapter behind a secret. Every call is audited to faculty_calls — who asked, with
// which model/version, under which policy, with what result — before it is answered to the page.

const FACULTY_BANDS = ["Not yet", "Developing", "Meets", "Exceeds"];

// Institutional policy text injected into every faculty call. Drawn from 00-constitution.md and
// 08-assessment-model.md §3/§5: assess the work not the person, band by rubric, stricter independent
// bar for second assessments, never assert a jurisdiction's law as settled fact, evidence before claim.
const FACULTY_POLICIES = {
  "checkpoint-strict": [
    "You are Assessment Faculty assessing one practical checkpoint submission for a learner building AI-assisted workflows.",
    "Assess the WORK, never the person. Band every rubric dimension with exactly one of these bands: Not yet (absent, placeholder or wrong), Developing (present but too thin or unspecific to verify or build on), Meets (concrete and usable — a real answer), Exceeds (specific — names, numbers, dates or explicit trade-offs).",
    "This is the independent, STRICTER second assessment: a mastery pass requires every dimension at Meets or above, none below Meets, and at least one dimension at Exceeds.",
    "Never state any jurisdiction's law, regulation or professional standard as settled fact — defer to the learner's own jurisdiction, policy or a qualified professional.",
    "Reply with nothing but strict JSON: {\"bands\":{\"<dimension>\":\"Meets\"},\"verdict\":\"ready|revise|more\",\"note\":\"one short paragraph naming what is strong or the specific detail wanted\",\"confidence\":\"high|low\"}.",
  ],
};

function facultyPolicy(kind) {
  return (FACULTY_POLICIES[kind] || FACULTY_POLICIES["checkpoint-strict"]).join("\n");
}
function facultyConfigured(env) {
  return !!(env.FACULTY_MODEL_KEY && env.FACULTY_MODEL_BASE_URL && env.FACULTY_MODEL_NAME);
}

// ---- dry-run scoring: mirrors app/js/faculty.js strict checkpoint banding (fieldBand(..., true)).
// Kept as the regression oracle + offline fallback; the model adapter replaces it when configured.
const fwc = s => (s || "").trim().split(/\s+/).filter(Boolean).length;
const fPlaceholderish = v => /^(n\/?a|none|-|\.|idk|nothing)$/i.test((v || "").trim()) || (v || "").trim().length < 3;
function fSpecific(val) {
  return /\d/.test(val) ||
    /\b(because|so|since|given that|due to|as a result|which means|means that|so that|trade-?off|instead of|whereas|rather than|in order to|for example|for instance|such as|specifically|in practice|as opposed to|in particular)\b/i.test(val) ||
    /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand)\b/i.test(val) ||
    /["“][^"”]{3,}["”]/.test(val) ||
    /\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/.test(val) ||
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(val);
}
function fStrictBand(f, val) {
  if (!val || !val.trim() || fPlaceholderish(val)) return "Not yet";
  const n = fwc(val);
  const min = Math.ceil(f.minWords * 1.4);
  if (n < min) return "Developing";
  const specific = fSpecific(val);
  if (n >= min * 2 && specific) return "Exceeds";
  if (!specific && n < min * 2) return "Developing";
  return "Meets";
}
function verdictFromStrictBands(idx) {
  if (idx.every(i => i >= 2) && idx.some(i => i >= 3)) return "ready";
  if (idx.filter(i => i >= 1).length >= Math.ceil(idx.length * 0.6)) return "revise";
  return "more";
}
function dryRunAssess({ fields, rubricDims, submission }) {
  const reports = fields.map(f => ({ label: f.label || f.key, band: fStrictBand(f, submission[f.key] || "") }));
  const idx = reports.map(r => FACULTY_BANDS.indexOf(r.band));
  const minBand = FACULTY_BANDS[Math.min(...idx)];
  const bands = {};
  rubricDims.forEach((dim, i) => { bands[dim] = reports[i] ? reports[i].band : minBand; });
  const dimIdx = rubricDims.map(d => FACULTY_BANDS.indexOf(bands[d]));
  const verdict = verdictFromStrictBands(dimIdx);
  const weak = rubricDims.filter(d => FACULTY_BANDS.indexOf(bands[d]) < 2);
  return {
    adapter: "dry-run", model: null,
    verdict,
    confidence: verdict === "ready" ? "high" : "low",
    note: verdict === "ready"
      ? "Second assessment agrees: this meets the mastery rubric on every dimension, specifically. Confirm to record it."
      : (verdict === "revise"
          ? `The second assessor wants more here — present but not specific enough for a mastery pass. Wanted more on: ${(weak.join(", ") || "the specifics").toLowerCase()}.`
          : "Not enough here yet — go back to the teaching, then resubmit on a real task."),
    bands, weakDims: weak,
  };
}

// OpenAI-compatible chat-completions adapter. Throws on failure; the dispatcher falls back to the
// dry-run result and flags `degraded` so the lineage is honest about what actually happened.
async function modelAssess(env, { kind, rubricDims, submission }) {
  const spike = await fetch(`${env.FACULTY_MODEL_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.FACULTY_MODEL_KEY}` },
    body: JSON.stringify({
      model: env.FACULTY_MODEL_NAME,
      temperature: 0,
      messages: [
        { role: "system", content: facultyPolicy(kind) },
        { role: "user", content: JSON.stringify({
            assessmentKind: kind,
            rubricDimensions: rubricDims,
            submission,
            instruction: "Band each dimension against the policy and return only the strict JSON the policy describes.",
          }) },
      ],
    }),
  });
  if (!spike.ok) throw new Error(`model http ${spike.status}`);
  const data = await spike.json();
  const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
  const block = text.replace(/```(json)?/gi, "").trim();
  const start = block.indexOf("{");
  if (start === -1) throw new Error("no json in model output");
  const parsed = JSON.parse(block.slice(start, block.lastIndexOf("}") + 1));
  if (!parsed.bands || typeof parsed.bands !== "object") throw new Error("no bands from model");
  if (!rubricDims.every(d => FACULTY_BANDS.includes(parsed.bands[d]))) throw new Error("invalid bands from model");
  const idx = rubricDims.map(d => FACULTY_BANDS.indexOf(parsed.bands[d]));
  const verdict = verdictFromStrictBands(idx);
  const weak = rubricDims.filter(d => FACULTY_BANDS.indexOf(parsed.bands[d]) < 2);
  return {
    adapter: "openai-compatible", model: env.FACULTY_MODEL_NAME,
    verdict,
    confidence: verdict === "ready" ? "high" : "low",
    note: String(parsed.note || "").slice(0, 1200),
    bands: parsed.bands, weakDims: weak,
  };
}

async function facultyAssess(env, body) {
  let out = dryRunAssess(body);
  let degraded = false;
  if (facultyConfigured(env) && env.FACULTY_ADAPTER !== "dry-run") {
    try { out = await modelAssess(env, body); }
    catch (e) { degraded = true; } // honest fallback: keep the dry-run result, mark the degradation
  }
  return { ...out, degraded };
}

async function handleFacultyAssess(request, env, headers) {
  const auth = await requireAuth(request, env, headers);
  if (auth.error) return auth.error;
  if (await rateLimited(request, env, "facultyrl")) {
    return json(429, { ok: false, error: "rate_limited" }, headers);
  }
  let body;
  try { body = await request.json(); } catch { return json(400, { ok: false, error: "invalid_json" }, headers); }

  const cpId = String(body.cpId || "").slice(0, 40);
  const rubricDims = Array.isArray(body.rubricDims)
    ? body.rubricDims.map(d => String(d).slice(0, 64)).filter(Boolean) : null;
  const fields = Array.isArray(body.fields)
    ? body.fields.map(f => ({
        key: String(f.key || "").slice(0, 40),
        label: String(f.label || f.key || "").slice(0, 80),
        minWords: Number(f.minWords),
      })) : null;
  const submission = body.submission && typeof body.submission === "object" ? body.submission : null;
  if (!rubricDims || !rubricDims.length || !fields || !fields.length || !submission) {
    return json(400, { ok: false, error: "invalid_rubric" }, headers);
  }
  if (!fields.every(f => f.key && Number.isFinite(f.minWords) && f.minWords >= 1)) {
    return json(400, { ok: false, error: "invalid_fields" }, headers);
  }

  const kind = body.kind === "challenge" ? "challenge-strict" : "checkpoint-strict";
  const started = Date.now();
  const out = await facultyAssess(env, { kind, fields, rubricDims, submission });
  const lineageId = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO faculty_calls
       (id, kind, user_id, cp_id, rubric_dims, submission_json, policy_id, adapter, model,
        bands_json, verdict, confidence, degraded, status, latency_ms, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    lineageId, kind, auth.user.id, cpId, JSON.stringify(rubricDims), JSON.stringify(submission),
    "checkpoint-strict", out.adapter, out.model, JSON.stringify(out.bands), out.verdict,
    out.confidence, out.degraded ? 1 : 0, "ok", Date.now() - started, new Date().toISOString()
  ).run();

  return json(200, {
    ok: true, lineageId, adapter: out.adapter, model: out.model,
    verdict: out.verdict, confidence: out.confidence, note: out.note,
    bands: out.bands, weakDims: out.weakDims, degraded: out.degraded,
  }, headers);
}

async function handleFacultyLog(request, env, headers) {
  const auth = await requireFounder(request, env, headers);
  if (auth.error) return auth.error;
  const { results } = await env.DB.prepare(
    `SELECT faculty_calls.id, faculty_calls.kind, faculty_calls.user_id, faculty_calls.cp_id,
            faculty_calls.policy_id, faculty_calls.adapter, faculty_calls.model, faculty_calls.verdict,
            faculty_calls.confidence, faculty_calls.degraded, faculty_calls.latency_ms, faculty_calls.created_at,
            users.email
     FROM faculty_calls LEFT JOIN users ON users.id = faculty_calls.user_id
     ORDER BY faculty_calls.created_at DESC LIMIT 200`
  ).all();
  return json(200, { ok: true, calls: results }, headers);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method === "POST" && url.pathname === "/api/auth/request-link") {
      return handleRequestLink(request, env, headers);
    }
    if (request.method === "GET" && url.pathname === "/api/auth/verify") {
      return handleVerify(request, env);
    }
    if (request.method === "GET" && url.pathname === "/api/auth/me") {
      return handleMe(request, env, headers);
    }
    if (request.method === "POST" && url.pathname === "/api/auth/logout") {
      return handleLogout(request, env, headers);
    }
    if (request.method === "POST" && url.pathname === "/api/progress/sync") {
      return handleProgressSync(request, env, headers);
    }
    if (request.method === "POST" && url.pathname === "/api/feedback") {
      return handleFeedbackSubmit(request, env, headers);
    }
    if (request.method === "GET" && url.pathname === "/api/payments/plans") {
      return handlePaymentsPlans(request, env, headers);
    }
    if (request.method === "POST" && url.pathname === "/api/payments/checkout") {
      return handlePaymentsCheckout(request, env, headers);
    }
    if (request.method === "POST" && url.pathname === "/api/payments/billing") {
      return handlePaymentsBilling(request, env, headers);
    }
    if (request.method === "POST" && url.pathname === "/api/payments/webhook") {
      return handlePaymentsWebhook(request, env, headers);
    }
    if (request.method === "POST" && url.pathname === "/api/faculty/assess") {
      return handleFacultyAssess(request, env, headers);
    }
    if (request.method === "GET" && url.pathname === "/api/faculty/log") {
      return handleFacultyLog(request, env, headers);
    }
    if (request.method === "GET" && url.pathname === "/api/admin/overview") {
      return handleAdminOverview(request, env, headers);
    }
    if (request.method === "GET" && url.pathname === "/api/admin/feedback") {
      return handleAdminFeedback(request, env, headers);
    }
    if (request.method === "GET" && url.pathname === "/api/admin/learners") {
      return handleAdminLearners(request, env, headers);
    }
    if (request.method === "GET" && url.pathname.startsWith("/api/admin/learners/")) {
      const userId = url.pathname.slice("/api/admin/learners/".length);
      return handleAdminLearnerDetail(request, env, headers, userId);
    }
    return json(404, { ok: false, error: "not_found" }, headers);
  },
};
