const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_TO_JSON = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
};
const RESEND_FROM = "AI Faculty <earlyaccess@aifaculty.org>";

function json(status, data, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...EMAIL_TO_JSON, ...extra },
  });
}

async function ipKey(request) {
  const cf = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for");
  return cf ? cf.split(",")[0].trim() : "unknown";
}

function readRate(vars) {
  const w = vars && vars.rate_limit ? Number(vars.rate_limit.window_seconds) : 3600;
  const m = vars && vars.rate_limit ? Number(vars.rate_limit.max_per_ip) : 5;
  return { window: isNaN(w) || w <= 0 ? 3600 : w, max: isNaN(m) || m <= 0 ? 5 : m };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const KV = env.SIGNUPS || { get: async () => null, put: async () => {} };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: EMAIL_TO_JSON });
    }

    if (request.method !== "POST" || url.pathname !== "/signup") {
      return json(404, { ok: false, error: "not found" });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { ok: false, error: "invalid_json" });
    }

    const email = String(body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return json(400, { ok: false, error: "invalid_email" });
    }

    // --- Rate limit per IP ---
    const { window, max } = readRate(env);
    const ip = await ipKey(request);
    const now = Date.now();
    const bucket = `rl:${ip}`;
    const rlRaw = await KV.get(bucket, "text");
    if (rlRaw) {
      const rl = JSON.parse(rlRaw);
      if (rl.count >= max && now < rl.reset) {
        return json(429, {
          ok: false,
          error: "rate_limited",
          retry_after: Math.ceil((rl.reset - now) / 1000),
        });
      }
    }
    const next = rlRaw
      ? (() => { const r = JSON.parse(rlRaw); r.count += 1; return r; })()
      : { count: 1, reset: now + window * 1000 };
    await KV.put(bucket, JSON.stringify(next), { expirationTtl: Math.ceil(window) });

    // --- Dedupe ---
    const existing = await KV.get(`email:${email}`);
    if (existing) {
      return json(200, { ok: true, already: true, status: "registered" });
    }

    await KV.put(`email:${email}`, JSON.stringify({ email, ip, at: new Date().toISOString() }));

    // --- Optional Resend notification ---
    const apiKey = env.RESEND_API_KEY || "";
    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [email],
          subject: "You're on the AI Faculty early-access list",
          text:
            "Thanks for reserving your early spot.\n\nYou'll be first in line for free access when AI Faculty launches on Dec 1, 2026. We'll email you when the doors open.\n\n— AI Faculty",
        }),
      });
    }

    return json(201, { ok: true, already: false, status: "registered" });
  },
};
