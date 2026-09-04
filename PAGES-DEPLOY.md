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

## 4. Deploy the signup Worker

See [`workers/signup/README.md`](workers/signup/README.md) for the full steps. TL;DR:

```bash
cd workers/signup
npm install
npx wrangler kv:namespace create SIGNUPS   # paste id into wrangler.toml
npx wrangler secret put RESEND_API_KEY      # optional, free Resend account
npx wrangler deploy
npx wrangler routes add aifaculty.org/signup --worker aifaculty-signup
```

After step 4, the landing form's `POST /signup` hits the Worker and stores emails in KV.

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
