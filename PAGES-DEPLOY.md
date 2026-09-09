# Deploying AI Faculty to the web

Everything runs on **Cloudflare** (free tier): domain, DNS, static hosting (Pages), and the
signup backend (Workers). Site layout: **landing page at `/`, the working prototype at `/app/`**
on `aifaculty.org`.

**Launch target:** Dec 1, 2026 · **Early subscribers get free access.**

Current state (2026-09-09): domain registered, Pages project live at `aifaculty.pages.dev`,
Worker deployed + routed. **One manual step left** — the apex DNS record (§3).

## 1. Register the domain  ·  ✅ done

`aifaculty.org` registered via Cloudflare Registrar (2026-09-09, expires 2027-09-09). Zone
`53034bfea4de24f2a0fdd6b6f7327fa1`, active, on Cloudflare nameservers.

## 2. Build + deploy to Cloudflare Pages  ·  ✅ done

Project **`aifaculty`**, production branch `master`, **direct upload** (not git-connected).

`build.sh` assembles the publish dir with no toolchain:

| URL | Source |
|---|---|
| `/` | `landing/` (countdown + email signup) |
| `/app/` | `app/` (the hash-routed static prototype) |

It also writes a combined `dist/_headers` — the site-wide strict CSP from `landing/_headers`,
then an `/app/*` block that `!`-unsets and replaces the CSP with `style-src 'self'
'unsafe-inline'` (the app injects inline `style=` attributes) and adds `X-Robots-Tag: noindex` —
plus a `robots.txt` disallowing `/app/`.

```bash
./build.sh
npx wrangler pages deploy dist --project-name aifaculty --branch master
```

Live: **https://aifaculty.pages.dev** (`/` landing, `/app/` prototype).

`dist/` and `.wrangler/` are gitignored — rebuild from source each deploy.

## 3. Point the domain at Pages  ·  ⬜ TODO (founder — the one manual step)

The custom domain `aifaculty.org` is already attached to the Pages project (via API, status
`pending`), but it needs an apex DNS record and the wrangler OAuth token can't write DNS.

In the Cloudflare dashboard → **`aifaculty.org`** → **DNS** → **Records** → **Add record**:

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `@` |
| Target | `aifaculty.pages.dev` |
| Proxy status | **Proxied** (orange cloud) |
| TTL | Auto |

Save. Pages validates the domain and issues the TLS cert automatically within a few minutes.
(Optional: add `CNAME  www  ->  aifaculty.pages.dev` proxied for `www.aifaculty.org`.)

## 4. Signup Worker  ·  ✅ done

- Worker **`aifaculty-signup`** → `https://aifaculty-signup.lecheyne24.workers.dev/signup`
- KV namespace **`SIGNUPS`** = `1764d7ac08d14438aa1179e4a748cbce`
- Route **`aifaculty.org/signup` → `aifaculty-signup`** added to `workers/signup/wrangler.toml`
  and deployed (confirmed on the zone). Starts receiving traffic once §3 is done.
- `landing/app.js` posts to same-origin `/signup` on `*.aifaculty.org`, and cross-origin to the
  `workers.dev` URL everywhere else (e.g. the `pages.dev` preview) — the Worker sends
  `Access-Control-Allow-Origin: *` and the landing CSP allows that origin.

Redeploy the Worker after an `index.js` change: `cd workers/signup && npx wrangler deploy`.

Optional: `npx wrangler secret put RESEND_API_KEY` (free Resend account) to email a confirmation
on signup — unset means signups are just stored in KV.

## 5. Verify (after §3)

- `https://aifaculty.org` — countdown + signup form.
- `https://aifaculty.org/app/` — the prototype loads (progress view → "Start the diagnostic").
- Submit the signup form → "You're on the list!", then:
  ```bash
  npx wrangler kv key list --namespace-id 1764d7ac08d14438aa1179e4a748cbce
  ```

## Optional hardening

- Cloudflare **Rate Limiting** + **WAF** managed rules on the zone.
- **Always Use HTTPS** under SSL/TLS (default with Cloudflare DNS).
- **Email Routing** (free) for `you@aifaculty.org`.
- **Cloudflare Access** on `/app/*` if you later want the prototype gated (email one-time PIN,
  free up to 50 users).
