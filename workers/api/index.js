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
  const user = await env.DB.prepare("SELECT id, email, display_name, created_at FROM users WHERE id = ?")
    .bind(session.user_id).first();
  return user || null;
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
    return json(404, { ok: false, error: "not_found" }, headers);
  },
};
