# AI Faculty — Monetization

**Version:** v0.1 (2026-09-24)
**Status:** working draft + first implementation (payments plumbing, pre-pay Founding Members, plan gate)

---

## 1. Principles (from the Constitution, non-negotiable)

1. **Learner first** — payment must never buy a passing grade, a faster path, or different
   assessment treatment. Education quality is identical for free and paying learners.
2. **Payment buys access, not advantage.** Plans gate *curriculum breadth* (how many pathways are
   open), never evidence, mastery decisions, or assessment fairness.
3. **Qualified work is compensated; grades are not.** Compensation framework rules in
   [06-faculty-growth-and-compensation.md](06-faculty-growth-and-compensation.md) apply
   unchanged; nothing here overrides the "payment must never buy a passing grade" hard rule.
4. **The founder approves pricing and every structural change** (decision class — pricing is a
   founder decision; see `05-governance-decision-rights.md`).
5. **Honest, no dark patterns** — clear prices, easy cancellation, prorated or lifetime access as
   advertised, money-back policy stated up front.

## 2. Revenue model

```
Free ─────────────── Pro (subscription) ─────── Founding Member (pre-launch, one-time)
  Foundation module   All current + future        Lifetime Pro, discounted,
  + first pathway      pathways, forever           founding-member recognition,
  (Software & Product                             pre-launch price
  Development)
```

| Plan | What you get | Price | Cadence |
|---|---|---|---|
| **Free** | Foundation module (AI-Assisted Workflow Designer, C1–C7) + the first built pathway (Software & Product Development). Full assessment, evidence portfolio, mastery rubric. | $0 | — |
| **Pro** | Every pathway (23 built and growing: work + build tracks), all capstones, all future content. | $15/mo or $120/yr | Subscription |
| **Founding Member** | Lifetime Pro, founding-member recognition (certificate + badge + name in the founding ledger), earliest access to new academies. | **$150 one-time** | One-time, original price while we build |

**Future ladder** (documented here, built when evidence justifies):
- **Industry Academies** — grouped pathways + cohort features for a profession or company.
- **Teams & Schools** — seat-based licensing for organisations (self-serve pending).
- **Credentials** — verified, evidence-linked completion certificates (paid where cost recovery
  is real; the underlying capability claims are never paywalled).
- **Contributor compensation** — skill-worker payments per
  `06-faculty-growth-and-compensation.md` (separate from learner plans; governed by the audit rules).

## 3. Commercial guardrails for the launch offer

- **Early-access promise stands.** Everyone already on the signup list keeps the existing
  "free access when we launch" promise (first cohort). Founding Member is an *additional, opt-in*
  offer for people who choose to back the institution early — it never replaces or subtracts from
  what a waitlisted subscriber was promised.
- The Free plan exists permanently so "education for everyone" stays true; Pro must keep
  justifying its price with real breadth, not by degrading Free.
- Prices are founder-approved and published here; no A/B pricing deception, no surge pricing.

## 4. How payments work (implementation)

- **Processor:** Stripe (Checkout + webhooks). Configured via Worker secrets
  (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) and price IDs
  (`STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL`, `STRIPE_PRICE_FOUNDING`) in
  `workers/api/wrangler.toml` `[vars]`. Until a Stripe account is connected, every payments
  endpoint returns `501 payments_not_configured` and the UI degrades to a waitlist CTA — the
  platform never breaks because payments are off.
- **Endpoints** (all on the existing API Worker, `workers/api/index.js`):
  - `GET  /api/payments/plans` — public plan catalogue for landing/app.
  - `POST /api/payments/checkout` — `{ plan }` → Stripe Checkout URL. Needs no account: the
    webhook matches the email Stripe collects, creates a user if needed, and grants the plan.
    Checkout accepts **card and PayPal** (`payment_method_types`), handled entirely by Stripe —
    no separate PayPal merchant needed; enable the wallet in the Stripe Dashboard.
  - `POST /api/payments/billing` — logged-in users → Stripe Customer Portal (cancel/change).
  - `POST /api/payments/webhook` — signature-verified; grants plans on `checkout.session.completed`,
    keeps `plan_status` in sync on subscription events, and records every charge in `payments`.
- **Storage:** D1 migration `0005_billing.sql` adds to `users`:
  `plan` (`free`|`pro`|`founding`), `plan_status` (`none`|`active`|`past_due`|`canceled`),
  `stripe_customer_id`; plus a `payments` ledger table (event, plan, amount, status, timestamps)
  used by the admin revenue view — this is the money trail, and it is only ever appended.
- **Provisioning flow:** visitor buys → Stripe collects email → webhook finds-or-creates the user
  row and sets `plan` → the learner later signs in with the same email (magic link) and their
  account already carries the entitlement. No account created *before* payment by anyone, ever.
- **Entitlement mapping:** the app reads `plan`/`plan_status` from `/api/auth/me`; the client
  paywall (see below) uses it. The paid value is server-derived from Stripe events; the client
  only displays and soft-gates.

## 5. The client paywall (Phase 4 scope, honest constraints)

- Free learners see all 23 pathways in the catalogue (so Pro has visible breadth), with paid ones
  marked **Pro**; opening a paid pathway shows an upgrade card instead of the curriculum.
- The gate is **client-side by design** at this stage: curriculum content ships in the browser's
  `localStorage` (offline-first architecture, `app/js/store.js`), so a determined bypass is
  always possible in the prototype. The constitution treats the current build as an evidence
  lab — the *commercial structure and plumbing* is the deliverable now; a server-enforced
  content gate becomes meaningful only when content moves behind the API (Phase 4 multi-learner
  data model / Control Plane). Do not present the current gate as a security boundary.
- Founder role overrides the gate for testing.

## 6. What revenue pays for first (order of priorities)

1. Real costs: domain, Workers Paid, Email Service, Stripe fees.
2. Authoring capacity (more pathways — the thing that justifies Pro).
3. Verification/assessment infrastructure (the thing that justifies credentials).
4. Contributor compensation (per the compensation framework, not before).