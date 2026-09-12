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
  const user = await env.DB.prepare("SELECT id, email, display_name, created_at, role FROM users WHERE id = ?")
    .bind(session.user_id).first();
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

  const [{ results: users }, { results: subs }, { results: acts }] = await Promise.all([
    env.DB.prepare("SELECT id, email, created_at FROM users").all(),
    env.DB.prepare("SELECT user_id, pathway_id, cap_id, band, duration_ms, completed_at FROM submissions").all(),
    env.DB.prepare("SELECT user_id, ts FROM activity_log").all(),
  ]);

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
    if (request.method === "GET" && url.pathname === "/api/admin/overview") {
      return handleAdminOverview(request, env, headers);
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
