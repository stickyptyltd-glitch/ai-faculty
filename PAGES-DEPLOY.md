# Deploying AI Faculty to the web

Everything runs on **Cloudflare** (free tier): domain, DNS, static hosting (Pages), and the
signup backend (Workers). This doc walks the full launch flow for `aifaculty.org`.

**Launch target:** Dec 1, 2026 · **Early subscribers get free access.**

## 1. Register the domain

1. Go to https://dash.cloudflare.com → **Register Domain** → search `aifaculty.org`.
2. Add to cart, configure DNS (defaults are fine), pay (~$12/yr). DNS will point to
   Cloudflare automatically.

## 2. Deploy the landing page (Cloudflare Pages)

The public site is just the `landing/` folder — the prototype (`app/`) stays private.

1. In Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect to GitHub.
2. Connect the `ai-faculty` repo, branch `master`.
3. Build settings:
   - **Build command:** *(none / leave blank)*
   - **Build output directory:** `landing`
4. **Save and Deploy.** You get a `*.pages.dev` URL.

> The `_headers` file inside `landing/` ships security headers (CSP, HSTS, frame denial).

## 3. Attach the domain to Pages

In the Pages project → **Custom domains** → add `aifaculty.org`. Cloudflare sets up the route
automatically.

## 4. Deploy the signup Worker  ·  ✅ done (2026-09-07)

Deployed on `lecheyne24@gmail.com`:

- Worker: **`aifaculty-signup`** → `https://aifaculty-signup.lecheyne24.workers.dev/signup`
- KV namespace: **`SIGNUPS`** = `1764d7ac08d14438aa1179e4a748cbce` (id is in `workers/signup/wrangler.toml`)
- Verified: valid signup → `201`, duplicate → `200 {already:true}`, bad email → `400`, other routes → `404`.

Until `aifaculty.org` exists, `landing/app.js` posts **cross-origin** to the `workers.dev` URL
(the Worker sends `Access-Control-Allow-Origin: *` and the landing `_headers` CSP allows that
origin in `connect-src`). Once the domain is attached, add the same-origin route so the form
posts to `/signup`:

```bash
cd workers/signup
npx wrangler deploy            # re-deploy if index.js changes
npx wrangler triggers deploy   # or add a route: aifaculty.org/signup -> aifaculty-signup
```

`app.js` already switches to the relative `/signup` path automatically when the host is
`aifaculty.org`.

Optional: `npx wrangler secret put RESEND_API_KEY` (free Resend account) to email a
confirmation on signup — leave unset and signups are just stored in KV.

## 5. Verify

- Open `https://aifaculty.org` — countdown + form should render.
- Submit the form → message "You're on the list!".
- Check KV for the subscriber:
  ```bash
  npx wrangler kv:key list --namespace-id <SIGNUPS_ID>
  ```

## Optional hardening

- Add Cloudflare **Rate Limiting** rules (dashboard) and a **WAF** managed rule for the domain.
- Turn on **Always Use HTTPS** under SSL/TLS (default with Cloudflare DNS).
- Set up email forwarding (`you@aifaculty.org`) via Cloudflare **Email Routing** (free).
