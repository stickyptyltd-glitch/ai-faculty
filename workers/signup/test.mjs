import fs from "node:fs";

const src = fs.readFileSync(new URL("./index.js", import.meta.url), "utf8");
const mod = await import("data:text/javascript," + encodeURIComponent(src));
const worker = mod.default;

const store = new Map();
const kv = {
  get: async (k) => store.get(k) ?? null,
  put: async (k, v) => store.set(k, v),
};
const env = { SIGNUPS: kv, RESEND_API_KEY: "" };

async function post(path, body, headers = {}) {
  const host = "https://aifaculty.org";
  return worker.fetch(new Request(host + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": "1.2.3.4", ...headers },
    body: JSON.stringify(body),
  }), env);
}

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("  ok  " + name); }
  else { fail++; console.log("  FAIL " + name); }
}

// 1. wrong path -> 404
let r = await worker.fetch(new Request("https://aifaculty.org/other", { method: "POST" }), env);
check("404 on wrong path", r.status === 404);

// 2. invalid email -> 400
r = await post("/signup", { email: "not-an-email" });
check("400 invalid email", r.status === 400);

// 3. valid email -> 201
r = await post("/signup", { email: "Test@Example.com" });
check("201 new signup", r.status === 201);
const body = await r.json();
check("lowercased stored", body.ok === true && store.has("email:test@example.com"));

// 4. duplicate -> 200 already
r = await post("/signup", { email: "test@example.com" });
check("200 already registered", r.status === 200 && (await r.json()).already === true);

// 5. rate limit -> 429 after threshold
for (let i = 0; i < 5; i++) await post("/signup", { email: `user${i}@example.com` });
r = await post("/signup", { email: "over@example.com" });
check("429 rate limited", r.status === 429 && (await r.json()).error === "rate_limited");

// 6. OPTIONS preflight -> 204
r = await worker.fetch(new Request("https://aifaculty.org/signup", { method: "OPTIONS" }), env);
check("204 on OPTIONS", r.status === 204);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
