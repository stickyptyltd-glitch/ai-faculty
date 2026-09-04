# AI Faculty — signup Worker

Receives POSTs from the landing page `/signup` form, validates the email, stores it in
Workers KV, and optionally emails the subscriber via Resend.

## Deploy (Cloudflare Workers)

Everything below is inside Cloudflare, which already hosts your domain and Pages site.

### 1. Create the KV namespace

```bash
npx wrangler kv:namespace create SIGNUPS
```

It prints an `id`. Paste it into `wrangler.toml` → `kv_namespaces[0].id`.

### 2. (Optional) Resend notifications

Create a free [Resend](https://resend.com) account and an API key. Then set it as a secret:

```bash
npx wrangler secret put RESEND_API_KEY
```

Leave `RESEND_API_KEY` empty in `wrangler.toml` if you don't want emails — KV storage alone
is enough to capture the subscriber list.

### 3. Deploy

```bash
npm install
npx wrangler deploy
```

Note the worker's public URL, e.g. `https://aifaculty-signup.<sub>.workers.dev`.

### 4. Route `/signup` on your domain

Add a route in Cloudflare so POSTs to `/signup` on `aifaculty.org` hit the Worker:

```bash
npx wrangler routes add aifaculty.org/signup --worker aifaculty-signup
```

Now the landing page's `/signup` form posts straight to the Worker — no CORS headaches,
since it's the same origin.

## API

`POST /signup` with JSON body `{ "email": "you@example.com" }`

| Status | Meaning |
|---|---|
| `201` | New subscriber stored |
| `200` | Email already registered (idempotent) |
| `400` | Invalid JSON / invalid email |
| `429` | Rate-limited for this IP (default 5/hour) |

## Reading the subscriber list

KV keys are `email:<address>`. List them with:

```bash
npx wrangler kv:key list --namespace-id <SIGNUPS_ID>
```

## Rate limiting

Tuned via `[vars.rate_limit]` in `wrangler.toml` (`window_seconds`, `max_per_ip`). Applies
per connecting IP via Cloudflare's `CF-Connecting-IP` header.

## Local dev

```bash
npx wrangler dev
```

It serves on `http://localhost:8787`. To test the full page → worker flow, point the landing
page at it (set the form action or run `wrangler dev` behind the static server). For the
simplest local test, temporarily POST directly to the dev worker:

```bash
curl -i -X POST http://localhost:8787/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```
