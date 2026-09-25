# AI Faculty — Continuity Log

Rule: **never overwrite — version forward.** Every meaningful change is recorded here.

---

## v0.1 — 2026-09-01 — Repo established, project absorbed

- Created standalone repo at `/home/dayle/projects/ai-faculty` (separate from MindMend).
- Absorbed the full architecture from the shared ChatGPT thread → `docs/PROJECT-BRIEF.md`.
- Seeded core design docs:
  - `00-constitution.md` v0.1
  - `01-architecture.md` v0.2 (7 control layers + Institutional AI Control Plane)
  - `02-faculty-roles.md` v0.2 (10 roles named)
  - `03-competency-framework.md` v0.1 (AI-Assisted Workflow Designer, C1–C7)
  - `04-learning-engine.md` v0.1 (Phase 2 engines)
  - `05-governance-decision-rights.md` v0.1 (8 decision classes, Assessment Resolution Protocol)
  - `06-faculty-growth-and-compensation.md` v0.1
  - `07-research-protocol.md` v0.1 (R0–R5)
  - `missions/mission-006-founder-response.md` (draft A–E)

## v0.2 — 2026-09-01 — First working software slice

- Added `app/` — a no-build, mobile-first web app (HTML/CSS/vanilla JS, `localStorage` persistence).
- Implements the first vertical slice of the Learning Engine:
  diagnostic intake → Learner Intelligence Model (C1–C7 capability state) → Pathway Engine
  (next best action) → a teach → practice → evidence → mastery loop for competency **C1 (Goal
  Definition)** → the 8-panel Progress view.
- Faculty responses are authored content for now, behind a `faculty.js` seam that a model/Control
  Plane can replace later.

## v0.3 — 2026-09-01 — Practical assessment model + Applied Projects

- `docs/08-assessment-model.md` — practical assessment & applications model.
- App: **banded rubric scoring** (Not yet / Developing / Meets / Exceeds) replacing binary pass/fail.
- App: **Assessment Resolution Protocol** surfaced — checkpoints offer an independent second
  assessment at a stricter bar; evidence records whether assessors 1 + 2 agreed.
- App: **Applied Projects** — learners register real projects, attach challenge/checkpoint evidence
  to them, and a project becomes "Demonstrated" once evidence spans all seven competencies. New
  Projects view; evidence portfolio grouped by project; Applications panel on the progress view.

## v0.4 — 2026-09-01 — Real lessons, clearer tasks, visual play-through

- Founder feedback: "be clearer about what to do; it must actually teach, not just set
  unclear tasks; the point is rapid learning via a great curriculum and real-world examples;
  short visual clips would help."
- Every competency (C1–C7) rebuilt as a **5-step lesson**: Why it matters (a real story of the
  skill failing) → The idea (model + boxed key idea) → **Watch it done** (a worked real-world
  example with the thinking shown) → The moves → **Your turn, guided** (supported attempt on a
  provided task, model answer shown next to the learner's, field by field). Challenges only open
  after the lesson.
- Every challenge/checkpoint now leads with a **"what a strong answer looks like"** panel and the
  worked example one click away. Field hints rewritten with concrete "e.g." examples.
- **Visual learning aid:** "Watch it done" has a ▶ play-through that reveals the worked example
  step by step on a timer with a progress bar (a lightweight stand-in for real short video clips,
  which are a later production asset).

## v0.5 — 2026-09-01 — Work Pathways + quick-check MCQs + jazz

- Founder feedback: "jazz it up, more visual aids, more multiple-choice questions — and I want to
  skip to the end of the foundation and start on specific work pathways."
- `docs/09-work-pathways.md` — the Work Pathways model: foundation → profession-specific tracks,
  catalogue of 6, how they're built and approved.
- App: **Work Pathways** — catalogue at `#/pathways`, per-pathway overview, "choose", and a
  **founder skip** for the foundation module. Progress view now shows Foundation module + Work
  Pathway sections. Model + Pathway Engine are module-aware.
- App: **Software & Product Development** pathway built — S1 Ask→Spec, S2 driving trustworthy code,
  S3 reviewing AI code, S4 tests you can trust — each a full lesson + 2 challenges + quick-check,
  plus the SWCAP work capstone. The other 5 pathways are listed as "planned".
- App: **Quick-check** lesson step — 2 MCQs per competency, instant why-feedback, not gated.
  Lesson step chips now have icons. Play-through visual retained.

## v0.6 — 2026-09-01 — Software S5 + Content pathway built

- **Software** pathway completed: added **S5 — Shipping responsibly** (human gates, flags,
  tested rollback, what AI must not decide). SWCAP capstone now spans S1–S5.
- **Content, Marketing & Comms** pathway built and marked available: M1 brief→controlled draft,
  M2 brand voice at scale, M3 claim & fact checking, M4 one asset into many responsibly — each a
  full 6-step lesson + 2 challenges + quick-check, plus the CONTCAP capstone.
- 4 pathways still "planned": Operations, Support, Research, Education.

## v0.7 — 2026-09-01 — Technical track: more pathways + AI Engineering built

- Founder wants more technical AI knowledge in the programs, and more pathways.
- Catalogue is now grouped: **Using AI at work** and **Building AI** (technical track).
  Planned pathways display their **curriculum outline** so the depth is visible before authoring.
- **AI Engineering — Building with LLMs** built (available): E1 prompting as engineering
  (output contracts), E2 retrieval/RAG, E3 tools & function calling, E4 evaluation,
  E5 production concerns (cost, latency, prompt injection, observability) — full 6-step lessons
  + challenges + quick-checks, plus the ENGCAP capstone.
- Four new technical pathways outlined: How AI Works (Technical Foundations), Machine Learning
  Practitioner, Agentic Systems, AI Safety/Evals/Red-teaming.
- Total catalogue: 11 pathways — 3 built (Software, Content, AI Engineering), 8 outlined.

## v0.8 — 2026-09-01 — Technical Foundations pathway built

- **How AI Works — Technical Foundations** built (available): F1 what a language model is
  (tokens, next-token prediction, context window, no memory), F2 embeddings & vectors,
  F3 training vs fine-tuning vs inference (and when NOT to fine-tune), F4 why models hallucinate,
  F5 capabilities & limits (maths/recency/recall/lost-in-the-middle → tools & structure) —
  full 6-step lessons + challenges + quick-checks, plus the FNDCAP capstone.
- 4 pathways now built (Software, Content, AI Engineering, Technical Foundations); 7 outlined.

## v0.9 — 2026-09-01 — Agentic Systems pathway built

- **Agentic Systems** built (available, best after AI Engineering): AG1 agent vs workflow
  (default to a workflow), AG2 the plan→act→observe control loop + hard stopping conditions,
  AG3 context management (pinned goal + scratchpad, extract-then-drop), AG4 failure modes &
  recovery (loops, drift, compounding, hallucinated tool results → stop and escalate), AG5
  human-in-the-loop & authority limits (enforce in code, not the prompt) — full 6-step lessons +
  challenges + quick-checks, plus the AGCAP capstone.
- Pathway overview now shows a "best taken after X" note when a pathway's prereq is another pathway.
- 5 pathways built (Software, Content, AI Engineering, Technical Foundations, Agentic Systems);
  6 outlined.

## v0.10 — 2026-09-01 — AI Safety pathway built; technical track ~complete

- **AI Safety, Evals & Red-teaming** built (available, best after AI Engineering): SF1 risk
  assessment (incl. non-users, residual risk), SF2 writing safety evals (risk → test, blocks
  the release), SF3 red-teaming (multi-turn, injection, reframing; repro + severity×ease → into
  evals), SF4 guardrails & mitigations (layered; strongest are structural), SF5 governance &
  incident response (owner, disclosure, reconstructable logging, kill switch / human fallback) —
  full 6-step lessons + challenges + quick-checks, plus the SAFECAP capstone. Ties into
  docs/05 (governance) and docs/07 (research protocol / R0–R5).
- 6 pathways built; the Building-AI track is complete except ML Practitioner.
- 5 outlined: Operations, Support, Research, Education, ML Practitioner.

## v0.11 — 2026-09-07 — Research & Analysis pathway built

- **Research & Analysis** built (available, prereq foundation): R1 frame the question (decision +
  scope + answer type + what would change it), R2 multi-source synthesis (R0–R5 confidence per
  claim, collapse echoes, explain disagreement by cause, name gaps), R3 source verification
  (exists / says it / credible — catch AI-fabricated citations, format is not evidence), R4
  faithful summarisation (keep hedges, scope, uncertainty, direction/magnitude; AI rounds up),
  R5 communicate honestly (headline + calibrated confidence + gaps + what would change it;
  findings separate from recommendation) — full 6-step lessons + challenges + quick-checks, plus
  the RESCAP capstone. Ties into docs/07 (research protocol / R0–R5) and C1 (Goal Definition).
- 7 pathways built (Software, Content, AI Engineering, Technical Foundations, Agentic Systems,
  AI Safety, Research & Analysis); 4 outlined (Operations, Support, Education, ML Practitioner).

## v0.12 — 2026-09-07 — Signup Worker deployed (launch infra)

- **`aifaculty-signup` Worker deployed** on Cloudflare (`lecheyne24@gmail.com`, account
  `b0bcef4fb406db6e7be003337571b42a`). KV namespace `SIGNUPS` =
  `1764d7ac08d14438aa1179e4a748cbce` (written into `workers/signup/wrangler.toml`).
  Live: `https://aifaculty-signup.lecheyne24.workers.dev/signup`.
- Verified end-to-end: valid → 201, duplicate → 200 `{already:true}`, invalid email → 400,
  other routes → 404; KV write confirmed then test key removed.
- `landing/app.js` now targets the `workers.dev` URL cross-origin everywhere except
  `*.aifaculty.org`, where it uses the same-origin `/signup`. `landing/_headers` CSP
  `connect-src` updated to allow the Worker origin.
- **Still on the founder:** register `aifaculty.org` (~$12/yr), create the Cloudflare Pages
  project (repo `ai-faculty`, output dir `landing`), then attach the custom domain and route
  the Worker at `aifaculty.org/signup`.

## v0.13 — 2026-09-09 — Deployed to Cloudflare Pages; app served at /app/

- `aifaculty.org` registered via Cloudflare Registrar (2026-09-09, zone
  `53034bfea4de24f2a0fdd6b6f7327fa1`, active).
- **Decision:** serve the landing page at `/` and the working prototype at `/app/` on the same
  domain, open (no auth), `/app/` marked `noindex` + disallowed in `robots.txt`. This
  supersedes the earlier "keep `app/` private" note — the founder wants to run and test the
  real app on the domain.
- Added `build.sh` — no-toolchain assembly of `dist/`: `landing/*` at root, `app/` copied to
  `dist/app/`, a combined `_headers` (site-wide strict CSP, then an `/app/*` block that
  `!`-unsets and replaces CSP with `style-src 'self' 'unsafe-inline'` because the app injects
  ~79 inline `style=` attributes), and a `robots.txt`. `dist/` and `.wrangler/` gitignored.
- Cloudflare **Pages project `aifaculty`** created (production branch `master`, **direct
  upload**, not git-connected). Deployed `dist/`. Live at `https://aifaculty.pages.dev` —
  landing at `/`, app at `/app/`. Verified both render correctly via headless Chrome
  (progress view, diagnostic CTA, pathways route, countdown + signup form).
- Signup **Worker route** `aifaculty.org/signup` → `aifaculty-signup` added to
  `workers/signup/wrangler.toml` and deployed; confirmed on the zone.
- Custom domain `aifaculty.org` added to the Pages project via API (status `pending`).
- **Blocked on the founder (one step):** the wrangler OAuth token can't write DNS. Add in the
  Cloudflare dash → `aifaculty.org` → DNS: `CNAME @ -> aifaculty.pages.dev`, Proxied. Pages
  then validates + issues the cert automatically. After that: verify `aifaculty.org`,
  `aifaculty.org/app/`, and a real signup end-to-end.
- Redeploy the site anytime: `./build.sh && npx wrangler pages deploy dist --project-name aifaculty --branch master`

## v0.14 — 2026-09-09 — aifaculty.org LIVE

- Founder added the apex DNS record (`CNAME @ -> aifaculty.pages.dev`, proxied). Cloudflare
  validated the custom domain and issued the cert.
- **Live and verified end-to-end:**
  - `https://aifaculty.org/` → landing page (200, countdown + signup form)
  - `https://aifaculty.org/app/` → the prototype (200, renders; `X-Robots-Tag: noindex`,
    CSP with `style-src 'unsafe-inline'`)
  - `https://aifaculty.org/signup` → Worker route (POST 201, writes to KV; OPTIONS 204)
- Commit `e665493` pushed to `origin/master`. GitHub auth on this machine had to fall back to
  a token (`gh` device flow kept timing out on api.github.com).

## Resume here — state + next steps

**Deployed and working.** The site is `aifaculty.org` (landing `/`, prototype `/app/`, signup
`/signup`). Deploy is **direct upload** (not git-connected) — after any change to `landing/` or
`app/`, run `./build.sh && npx wrangler pages deploy dist --project-name aifaculty --branch master`.
Worker: `cd workers/signup && npx wrangler deploy`.

Key IDs: Cloudflare account `b0bcef4fb406db6e7be003337571b42a` (`lecheyne24@gmail.com`, shared
with the unrelated `onlyus2` project — be careful with account-wide ops). Zone
`53034bfea4de24f2a0fdd6b6f7327fa1`. KV `SIGNUPS` = `1764d7ac08d14438aa1179e4a748cbce`.
Pages project `aifaculty`.

**Housekeeping / optional infra (not blocking):**
- A GitHub token was pasted in the assistant chat during setup — **revoke it** (GitHub →
  Settings → Applications → GitHub CLI, or the token list) and re-`gh auth login` when needed.
- Optional: `www.aifaculty.org` CNAME + redirect to apex.
- Optional: connect the Pages project to the GitHub repo for auto-deploy on push (currently
  manual). Build command `bash build.sh`, output dir `dist`.
- Optional: `npx wrangler secret put RESEND_API_KEY` + Cloudflare Email Routing for
  `earlyaccess@aifaculty.org` → signup confirmation emails (currently KV-only).
- Optional: Cloudflare Rate Limiting / WAF on the zone.

**Product backlog (the real work — see Open threads below):** author the 4 remaining pathways
(Ops, Support, Education, ML Practitioner); diagnostic → pathway recommendation; C2–C7 authored
content; prereq enforcement for non-founder learners; LLM/Control-Plane integration; review
landing copy before any public announcement; act on findings from founder testing of `/app/`.

## v0.15 — 2026-09-09 — The 4 outlined pathways built; initial catalogue complete

- Built **Operations & Admin** (O1 map before you automate · O2 document & data workflows ·
  O3 inbox & scheduling with guardrails · O4 SOP → checked workflow · O5 audit trails),
  **Customer Support** (SU1 triage & routing · SU2 grounded replies · SU3 tone control ·
  SU4 escalation rules · SU5 quality review), **Education & Training** (ED1 design a learning
  outcome · ED2 material generation with accuracy checks · ED3 feedback & assessment support ·
  ED4 adapting to the learner · ED5 academic-integrity boundaries), and **Machine Learning
  Practitioner** (ML1 frame the problem · ML2 data · ML3 training & model selection · ML4
  evaluation & the overfitting trap · ML5 deployment & monitoring) — each: full 6-step lessons +
  2 challenges + quick-checks per competency, plus a capstone (OPSCAP / SUPCAP / EDUCAP / MLCAP).
- **All 11 pathways of the initial catalogue are now `available`.** 61 competencies total
  (7 foundation + 54 pathway), 11 pathway capstones. `docs/09` prototype table and the app's
  About text updated.
- Validated (node syntax + vm load + structural checks + headless render of overviews and
  lessons) and deployed to `aifaculty.org/app/`.
- Next: **broader-scope pathways** — new domains beyond the initial catalogue (professional
  services, healthcare & sciences, commercial roles, and further).

## v0.16 — 2026-09-09 — Broader-scope pathways: Legal, Sales, Finance, HR, Healthcare

- Built 5 new-domain pathways, each: full 6-step lessons + 2 challenges + quick-checks per
  competency, plus a capstone.
  - **Legal & Contracts** (L1–L5, LEGCAP): scope the review · ground every AI claim in the
    document · redlines with a human editor · privilege & confidentiality · AI is a first pass,
    not the opinion. Ties into R3 (source verification).
  - **Sales** (SL1–SL5, SALESCAP): account research with traceable facts · outreach that isn't
    spam · call prep & live assist · follow-ups & CRM hygiene · honesty, disclosure & pressure.
  - **Finance & Accounting** (FN1–FN5, FINCAP): AI does not do arithmetic · reconciliation &
    categorisation · models & spreadsheets · reporting & commentary · controls, close & the
    audit trail.
  - **HR & People** (HR1–HR5, HRCAP): de-biased job specs & criteria · CV screening &
    shortlisting · writing about and to people · employee data & privacy · people decisions
    stay human.
  - **Healthcare & Clinical Support** (HC1–HC5, HEALTHCAP): what AI can/can't touch clinically ·
    clinical documentation & scribing · summarising records · patient-facing information ·
    governance, safety & the incident path. Scope is deliberately admin / documentation /
    info-support with heavy guardrails — not clinical decision-making.
- **16 pathways now built** (11 "using AI at work" + 5 "building AI"), 86 competencies,
  16 capstones. All `status: "available"`. `docs/09` catalogue + prototype table + About text
  updated. Validated (syntax + vm load + full structural sweep + headless render) and deployed
  to `aifaculty.org/app/`.
- New `_COMPETENCIES` consts live just before `const PATHWAYS`; a `// BROADER-SCOPE PATHWAYS`
  banner marks the section.

## v0.17 — 2026-09-09 — Assessment-heuristic hardening + draft-content labelling

- **Critique-challenge signal fixes** (`content.js`): removed bare high-frequency English words
  from `expected[].signals` arrays that made a rubric line auto-pass on any 30-word submission —
  `"and"` (ED1.2), `"age"` (HR1.2), `"log"` (O1.2), `"time"` (R1.2, ML2.2), `"gap"` (R5.1,
  ML4.2), `"may"` (R4.1), `"who"` (M1.2), `"bar"` (ED1.2). Replaced with specific multi-word
  signals. Rule reinforced: signals must be lowercase **and** specific — never a common word or
  a substring of one (`faculty.js` matches with `text.includes(sig)`).
- **`rubric.length > fields.length` fix** (`content.js`): `faculty.js` pairs rubric↔fields by
  index, so a rubric item past the field count rendered as an unassessed pass. Merged S2.1
  (4→3), S3.2 (3→2), F1.1 (3→2) rubrics to match their field counts. Sweep now also checks this
  direction.
- **Draft-content labelling** (`main.js`): the four regulated-domain pathways (Legal, Finance,
  HR, Healthcare) now show a "Draft content — not yet expert-verified" notice on their overview
  page; About page carries the general version. Honest framing per Constitution + `docs/09` §5
  (real-world examples need Research Faculty R2+). **Governance item for the founder:** decide
  whether these run as a formal *experimental academy* (a `status: "experimental"` value +
  banner) or get their regulatory specifics verified to R2+ before non-founder learners.
- Redeployed to `aifaculty.org/app/` (deployment `6402e9f6`); verified live (content diff,
  notice text, single CSP header, headless render of the Legal overview).

## v0.18 — 2026-09-12 — Platform roadmap approved; Phase 1 (accounts) shipped

Founder asked for individual accounts, monetization with a free tier, multi-pathway learning
plans, a qualification/achievement system, and a scored leaderboard with rewards — plus a
standing prompt to keep expanding pathway content. Two deliverables:

- **`docs/expansion-prompt.md`** — a self-contained, reusable prompt for `/loop`/a scheduled
  agent that adds one new pathway per run, carrying forward this session's hard-learned rules
  (lowercase+specific critique signals, `rubric.length <= fields.length`, draft-content
  labelling) and explicit guardrails to stay out of the accounts/payments/leaderboard code.
- **Five-phase plan** (`/home/dayle/.claude/plans/smooth-scribbling-heron.md`, approved):
  1. accounts (magic-link) 2. monetization/free tier 3. learning plans 4. qualifications 5.
  leaderboard+rewards. Two corrections to the original framing, both logged as founder decisions:
  **certificates are free on every tier** (payment funds breadth — concurrent pathways/plans/
  early access — never the credential itself) and **leaderboard entry is free for everyone**
  (a paid-only prize pool is a pay-to-enter structure; free entry avoids that risk entirely).
  Rewards = store credit/discount codes (not cash, per founder decision). Existing `STORE`
  (localStorage) progress is explicitly untouched through all five phases — only new identity/
  entitlement/plan/qualification/leaderboard data moves to a server.

**Phase 1 shipped and verified live:**
- New Cloudflare D1 database `aifaculty` (id `3e1266d0-4cf9-4d99-a3fd-fc8bd328cfa7`),
  `users`/`magic_links`/`sessions` tables (`workers/api/migrations/0001_accounts.sql`).
- New Worker `aifaculty-api` (`workers/api/`, route `aifaculty.org/api/*`) — passwordless
  magic-link auth: `POST /api/auth/request-link`, `GET /api/auth/verify`, `GET /api/auth/me`,
  `POST /api/auth/logout`. Sessions are httpOnly/Secure/SameSite=Lax cookies, hashed at rest.
  Reuses the signup Worker's `SIGNUPS` KV for rate limiting and its Resend integration pattern
  — `RESEND_API_KEY` is empty for now, so `request-link` runs in **dev mode**: it hands the
  sign-in link straight back in the JSON response instead of emailing it (stops automatically
  the moment a real key is set — no code change needed).
- App: `app/js/auth.js` (a small `window.AUTH` fetch client), `#/login` + `#/account` routes and
  a signed-in-state nav slot in `main.js`, CSP `connect-src` extended for the API's workers.dev
  origin (`build.sh`). Signing in does **not** touch existing localStorage progress.
- Verified live end-to-end: curl round-trip (request-link → verify → cookie → `/me` → logout →
  reused-token correctly rejected) and a headless-Chrome two-navigation run confirming the
  signed-in nav and `#/account` page render correctly. Test accounts/sessions purged from D1
  before committing.
- **Needs from founder before Phase 2 (money)**: a Resend API key (or stay in dev-link mode
  longer), and which Stripe account to connect (via the Stripe MCP connector already available
  in-session).
- **Hardening pass same day**, post-review: fixed a rate-limit bug where the per-IP counter kept
  sliding its KV TTL forward on every hit instead of resetting when the window rolled over,
  silently disabling the limit under sustained load; added a sweep of expired `magic_links`/
  `sessions` rows (+ `0002_expiry_indexes.sql`) so both tables stay bounded instead of growing
  forever; split the dev-mode bypass into two explicit switches — empty `RESEND_API_KEY` **and**
  `DEV_LINKS = "true"` are both required, so setting the Resend key isn't the only thing that
  closes "hand out a session for any email typed in" (with neither set, sign-in now 503s rather
  than issuing a link); scoped the session cookie to `Path=/api` instead of the whole apex
  domain. Re-verified live (round trip, rate-limit now actually triggers).
- **Known limitation, not a bug**: progress lives in the browser (`localStorage`), not the
  account — two people signed into the same browser share one learner record, and the same
  person signed in on a second device starts with an empty app there. Expected from the
  deliberate scope cut (see Context in the platform plan); progress sync is a later, separate
  phase if it's ever needed.

## v0.19 — 2026-09-12 — Close the taught-vs-tested gap in the lesson/challenge scaffolding

Founder feedback: challenge/practice content asked for things the demonstrations hadn't
actually taught, and the system wasn't graphical/practical/smart enough to be "the best
training platform available." Investigated concretely rather than guessing: the **guided**
step (labelled "Your turn — *with support*") had zero reference to the lesson's worked example
or its "moves" while attempting a deliberately-different practice scenario (near-transfer by
design — same pattern, new surface task) — the model answer only appeared *after* submitting.
Challenges already had a worked-example reference, but collapsed by default even on the first,
most-supported one; checkpoints (capstones) had no reference back to the competencies they draw
on at all. This is a systemic rendering gap, not a per-competency content problem, so the fix
applies to all 93 competencies (7 foundation + 86 pathway) and both checkpoint types at once:
- **`viewLearn` guided step** (`main.js`): added an open-by-default "Reference — how the lesson
  did it" panel (the demonstrate step's worked example) and an open "The moves, again" checklist
  (the deconstruct bullets), both right above the practice form.
- **`viewChallenge`**: the existing worked-example `<details>` now opens by default on a
  competency's *first* challenge (still close support) and stays collapsed on later ones
  (meant to test more independent recall) — using the existing ladder position, no new content.
- **`viewCheckpoint`**: added a collapsed "Reference — the capabilities this draws on" panel
  listing each prerequisite competency's name/canDo with a direct link back to its lesson,
  built from the checkpoint's existing `after` array (works for CHECKPOINTS and
  PATHWAY_CHECKPOINTS alike, zero new authored content).
- Verified live via headless-Chrome screenshots of a guided step (C1) and a first challenge
  (C1.1) — both now show the reference material inline, open, above the form.
- **Not done in this pass** (flagged, not silently dropped): richer graphical content —
  diagrams/illustrations per lesson, an interactive task type beyond free-text fields — would
  need per-competency authoring across all 93 competencies and is a larger, separate effort.
- Post-fix checks: verified every checkpoint's `after[]` ids resolve via `C.competency()` (18/18
  clean — the reference panel can't silently render empty), and screenshotted a pathway guided
  step (Sales SL1, not just foundation C1, since founders can skip straight to pathways) — the
  reference panel renders there too, though as prose rather than C1's scannable four-part
  template. That's a **content-quality variance to track**, not a broken mechanism: some
  competencies' worked examples and field hints are more concrete/templated than others across
  the 93. Worth a consistency pass at some point, separate from this scaffolding fix.

## v0.20 — 2026-09-12 — First two diagrams from the design exploration ship

Founder feedback ("let's explore better graphics") led to a design-exploration artifact
(published separately, not in-repo) proposing four diagram types drawn from real lesson content
— process flow, before/after, decision ladder, competency map — plus a live proof that a small
generator could draw them from data `content.js` already has, not new per-competency authoring.
Founder picked two to build first: **flow diagrams** and the **competency map**.

- **New `app/js/diagrams.js`** — `DIAGRAMS.competencyChain(nodes, capstoneLabel)`: a vertical
  inline-SVG prerequisite chain ending in a capstone node, with real word-wrap (checked against
  the longest actual competency name, 57 chars, and the longest `after[]` array, CP2's 7) so it
  never clips or needs new authored content.
- **Checkpoint "Reference" panel** (`main.js` `viewCheckpoint`) now renders that chain instead of
  a bullet list, plus a compact row of `#/learn/<id>/0` quick-links below it (kept from the
  previous version). Verified against the live-deployed files directly (LEGCAP, CP2) — correct
  wrapping, connectors, and capstone styling.
- **"Watch it done" step deliberately did NOT become one hand-authored SVG** like the design
  exploration's mockup — checked first: the longest real `demonstrate.steps[].result` string is
  213 characters (SF5). Hand-wrapped SVG text would clip or need a tall guess at that length;
  plain HTML cards reflow correctly at any length for free. Instead, the existing step cards
  (untouched internals) gained a `.demo__rail` — a connecting line through numbered dots, ending
  at a 🏁 marker on the finished-result card — so the stack now reads as one connected flow
  without touching the part that has to handle arbitrary real text.
- Both are zero-new-authoring, applying instantly to all 93 competencies / 18 checkpoints since
  they're driven entirely by structured data (`demonstrate.steps`, `checkpoint.after[]`) that
  already existed. Deployed and verified live via headless-Chrome screenshots (O1's demonstrate
  step, LEGCAP's reference panel using the live-served `diagrams.js`).
- **Not done yet** (the other two diagram types from the exploration, by founder's own
  sequencing): before/after panels on critique challenges, and the AI-role decision ladder —
  both need a small amount of new per-use data (a corrected-version field; a role classification)
  rather than being free, so they're queued separately.

## v0.21 — 2026-09-12 — The other two diagrams: before/after and the AI-role ladder

Founder said "continue" — shipped the two remaining diagram types from the exploration.

- **Before/after on critique challenges.** `critiqueChallenge()` takes an optional 8th arg,
  `fixed: { text, changes: [] }` — a corrected version of `material` plus a short list of what
  changed. Authored it for **all 28 critique challenges across the platform** (every pathway
  that has one), not a sample — applied via a small Node script that locates each call by id and
  inserts the literal with proper string-escaping, rather than 28 hand-edits. Rendered in
  `renderResult` (`main.js`) as a two-panel comparison, but **only once the learner's own
  submission reaches "ready"** — revealing a near-complete answer on a "revise" verdict would
  let a resubmission just copy it instead of earning the pass. This is new authored content,
  unlike the previous two diagrams, but full-coverage rather than partial.
- **AI-role decision ladder.** `DIAGRAMS.roleLadder(items)` draws the do-it/assist/check/
  stay-out bands from Fig. 3 of the exploration, but **only the bands a lesson's real content
  actually supports** — no fabricated "assist" example where a lesson never described one.
  Authored `lesson.roleMap` for 5 competencies chosen because their content is genuinely about
  AI-role boundaries, one per named pathway: **O1** (Ops), **L5** (Legal), **FN1** (Finance),
  **HR5** (HR), **HC1** (Healthcare) — each sourced from that competency's own `demonstrate`
  walkthrough, not invented. Deliberately did not force this onto Safety (SF3/SF4's real content
  — a red-team probe sequence, a guardrail-layers list — doesn't actually fit the ladder shape;
  forcing it would misrepresent the lesson). Rendered on the **deconstruct** ("The moves") step,
  when `roleMap` is present.
- Verified: a real thorough ED1.2 critique confirmed to reach `verdict: "ready"` against the
  live `faculty.js` (5/5 rubric items caught), the before/after component screenshotted with
  real content.js data and the actual app CSS, and all 5 `roleMap` competencies' ladders
  screenshotted together (correct wrapping, correct band omission, correct colours) plus one
  (FN1) verified live on the deployed deconstruct page.
- All four diagram types from the design exploration are now shipped. Two (flow, competency
  map) are universal; two (before/after, role ladder) are authored where genuinely warranted —
  28/28 critique challenges, 5/~15 role-relevant competencies. Extending the role ladder further
  is additive (add `roleMap` to more competencies) whenever there's a genuine fit.

## v0.22 — 2026-09-12 — Regulated-pathway content audit: better than feared

Ran the verification pass flagged since v0.16/v0.17: read every lesson, challenge and guided
model across all 20 competencies in Legal, Finance, HR and Healthcare in full (not sampled),
specifically hunting for the failure mode the governance note warned about — a specific
regulation, statute, retention period or legal threshold asserted as settled fact instead of
deferred to the learner's actual jurisdiction/policy/qualified professional.

**Finding: the content held up.** No fabricated standard citations, no specific numeric legal/
regulatory thresholds stated as universal fact. The consistent pattern already in place across
all 20 competencies: "check your jurisdiction," "a qualified person," "per policy," "per the
trust's retention and security policy," "often," "likely," "almost certainly" — genuine
epistemic hedging, not overconfident specifics. Numeric examples (£400k contract value, £40k vs
£38k variance, 12 months' fees) are illustrative scenario data for teaching exercises, clearly
framed as such, not assertions of law. Only one line was tightened: HR2's guided model stated
"In the UK / EU a candidate has rights around solely-automated decisions" — true and stable, but
phrased in a way that could read as exhaustive; reworded to "many jurisdictions... UK/EU is one
well-known example... don't assume your jurisdiction's rule is the only one."
- Updated the draft-content notice on all 4 pathway overview pages, and the About page's general
  version, to reflect the actual finding — from a blanket "not yet expert-verified" (implying
  the content itself was suspect) to "reviewed for unverified specifics [date], not yet signed
  off by a licensed professional" (accurate: the specific-claims risk was checked and is low;
  formal professional sign-off — a real lawyer/accountant/HR specialist/clinician — still hasn't
  happened, and that distinction is what the banner now says).
- Verified live: the updated HR pathway banner screenshotted on the deployed site.

## v0.23 — 2026-09-12 — First real end-to-end learner walkthrough (automated, not skipped)

Founder said "go do the walkthrough now." Every prior quality gate on this platform had been
me (structural sweeps, screenshots, my own reading) — nobody had gone through diagnostic →
foundation → a work pathway → capstone as an actual learner. Puppeteer-core (installed fresh,
driving the already-installed system Chrome via CDP — no puppeteer browser download) ran the
**real, unskipped path** against the live site: diagnostic → an Applied Project → the full
foundation module (C1–C7, both challenges/competency, CP1 + CP2) → chose **Operations & Admin**
→ all 5 competencies + their challenges → the **OPSCAP capstone**, including requesting the
independent second assessment. Answers were genuine and specific (not generic padding) —
hand-written per field around one consistent fictional scenario (a two-person agency's client
onboarding), critique challenges answered with real, specific critiques of the actual material.
No shortcuts: founder-skip was deliberately not used, since real learners can't use it either.

**Three real bugs found and fixed, each verified against the live site before and after:**
1. **Adding an Applied Project silently did nothing on screen** (`main.js`, `kind === "project"`
   handler) — the data saved correctly (confirmed via `STORE.projects`), but the page never
   re-rendered: the handler set `location.hash` to the value it was already on (the form only
   ever renders on `#/projects`), so `hashchange` never fired and `router()` never re-ran. A
   real learner clicking "Add project" would see nothing happen and reasonably assume it broke.
   Fixed: call `router()` directly when the hash is unchanged.
2 & 3. **The independent second assessment's "specific" heuristic was too narrow, twice** —
   two different genuinely detailed capstone answers (CP2, then OPSCAP) scored "Developing"
   instead of "Meets"/"Exceeds" on the strict pass purely for not containing one of a short
   fixed list of phrases (spelling out "three" instead of "3", writing "since"/"so there is"
   instead of the exact phrase "instead of"/"so that"). First fix broadened the phrase list
   (`app/js/faculty.js` `fieldBand`) — caught by walkthrough attempt 1, then **failed again on
   different wording** on attempt 2. Second, structural fix: a strict-mode answer already well
   past double its word floor (the padding-screen minWords gate already ran) is itself evidence
   of real engagement and no longer gets capped at "Developing" just for missing a phrase — the
   phrase list now only decides Meets vs. Exceeds, never blocks a substantive answer outright.
   Both fixes deployed and re-verified against the exact same answers that had failed.

**One design gap noted, not fixed (needs a product decision, not a bug fix):** all 29 evidence
records from the walkthrough ended up "Not attached to a project" — the `project` dropdown on
every challenge/checkpoint form defaults to unselected and is easy to miss. A diligent learner
doing every real task could finish an entire pathway with an empty portfolio unless they
remember to pick their project on every single submission. Worth a founder decision: default to
the learner's most recent project, or prompt for it, rather than silently defaulting to none.

**What held up well:** all 10 Ops & Admin challenges plus the capstone passed on the *first*
genuine attempt with real, specific (non-copied) answers — real signal that the pathway's
scaffolding (reference panels, worked examples, the connector rail — v0.19/v0.20 work) actually
prepares a good-faith learner for what it then tests. The 3 foundation critique challenges
correctly rejected generic non-specific padding and correctly passed once given a real,
specific critique — the assessor isn't trivially gameable by word-count alone.

Confirmed end-state: `foundationDone = true`, all 3 checkpoints (CP1, CP2, OPSCAP) passed and
confirmed, 29 evidence records, Ops & Admin pathway 100% (5/5) with capstone passed.

## v0.24 — 2026-09-12 — Repo relocated; two new pathways (Product Management, Public Sector)

**Repo moved.** Mid-session, the founder asked for a company-wide file consolidation pass
(matching the earlier MindMend/TrueKindred cleanup). AI Faculty is a Sticky Pty Ltd platform but
not a health-and-therapy sub-brand, so it moved as a sibling top-level folder: from
`/home/dayle/projects/ai-faculty` to
`<9800224a drive>/sticky/sticky.pty.ltd/ai-faculty/` (a real `mv`, not a copy — git history,
remote and the one uncommitted change all carried over intact). Confirmed via a full-machine
search that this was the **only** copy anywhere — nothing to dedup, nothing archived under
`_legacy_`. A pre-move snapshot (paths/sizes/mtimes, git status/log) is at
`/home/dayle/Desktop/ai-faculty_snapshots/pre-move-20260912-171245.txt`. The company's
`COMPANY_MAP.md` now has a full "Platform 2: AI Faculty" section. **Everything else —
`aifaculty.org`, the GitHub remote, Cloudflare account/project, build/deploy commands — is
unchanged**; only the local path on disk moved.

**Two new pathways**, following the standing pattern (`docs/expansion-prompt.md`) after the
founder said to continue building breadth:
- **Product Management** (PM1–PM5, PMCAP) — spec a vague ask, prioritise against named criteria
  (not an AI-invented proxy), synthesise user research without inventing prevalence, draft PRDs
  with facts checked against real inputs, and stakeholder comms that don't upgrade a hedge to a
  promise.
- **Public Sector & Government Services** (PS1–PS5, PSCAP) — drafting public guidance grounded
  in the real policy document, summarising consultations without smoothing away minority views,
  case-processing support where the decision stays human (same "stays human" pattern as HR5),
  records/FOI requests with a human check before an irreversible disclosure, and procurement
  scoring against explicit criteria rather than writing quality. Added to the regulated-domain
  banner list (`main.js`) alongside Legal/Finance/HR/Health, for the same reason — FOI/procurement/
  decision-fairness concepts vary by jurisdiction, and the lessons were written to defer to real
  policy/jurisdiction throughout, same discipline as the v0.22 audit.
- 18 pathways now, 89 pathway-competencies (79 + 10). Validated with an upgraded structural
  sweep (now also checks checkpoint `after[]` resolution and QUICK_CHECKS completeness — both
  clean) and the lowercase/weak-signal check on the new critique challenges (clean). Deployed and
  verified live (screenshots of both pathway overview pages, including the Public Sector banner).

## v0.25 — 2026-09-12 — Founder admin panel (progress sync + roles + analytics)

The founder asked for an admin/human-management panel to oversee learners, then described a much
bigger ask in the same breath: time-on-platform and per-class duration, scores, pathway
popularity, struggle points, a feedback channel, a peer-review system that routes "exceeded" work
back to other learners for random re-scoring (for credit, and as a refresher for the reviewer),
a Trust-Pilot-style student rating system, and recognition (honor roll, class president).

A codebase audit before building found the load-bearing fact shaping everything here: **every bit
of learner progress lived only in browser localStorage** — the server (`workers/api`) had exactly
3 tables (`users`, `magic_links`, `sessions`) and 4 routes, all pure login/session. It had never
seen a single completion, score, or timestamp, and there was no role/admin concept anywhere.
None of the founder's asks could be built directly — they all sit on a progress-sync pipeline
that didn't exist. Full plan at `/home/dayle/.claude/plans/humble-purring-hopper.md`.

**Built and shipped (Phase A + B of that plan):**
- `workers/api/migrations/0003_progress.sql` — `users.role` (default `'learner'`, founder's own
  row set to `'founder'` by hand), `submissions` (band/confidence/raw answer text/duration per
  challenge or checkpoint), `activity_log` (mirrors the client's `STORE.log` event kinds).
- `workers/api/index.js` — `requireAuth`/`requireFounder` guards (first reusable auth middleware
  in this Worker — `handleMe` used to be the only inline check); `POST /api/progress/sync`;
  `GET /api/admin/overview` (learner/active/submission totals, pathway popularity, per-competency
  struggle points sorted worst-first); `GET /api/admin/learners` and `/api/admin/learners/:id`.
  "Time on platform" is derived from activity/submission timestamps with a 20-minute session-gap
  cutoff rather than a live heartbeat — cheaper, adequate for founder-level reporting, no
  background ping from every open tab.
- `app/js/auth.js` — generic `apiGet`/`apiPost` helpers, reused by the sync hooks and the panel.
- `app/js/store.js` — `STORE.log()` now best-effort mirrors every activity event to the server
  when signed in; never blocks or affects the local save, silently no-ops when signed out.
- `app/js/main.js` — the challenge/checkpoint `confirm` handler now also syncs the submission
  (band derived from `fieldReports`, duration measured from view-entered to confirm); new
  `#/admin` (Overview) and `#/admin/learners` (+ per-learner detail) views, gated on
  `user.role === 'founder'` client-side (the real enforcement is server-side 403).
- Verified end-to-end against the live site with a real session cookie: `/me` returns
  `role:"founder"`, `/admin/overview`/`/admin/learners`/`/admin/learners/:id` all return real
  data after a synced submission and 401 without a session; smoke-test rows deleted afterward so
  the panel starts from a genuinely empty state.

**Deliberately not built yet — designed in the plan file, sequenced as follow-on phases because
they depend on real `submissions` data existing first:**
- **Phase C — feedback channel.** A `feedback` table + a small in-app form, surfaced as an admin
  tab.
- **Phase D — peer review.** Route a learner's `Exceeds` submission to another learner who has
  already passed that same competency, for random re-scoring — earns the reviewer credit and
  doubles as spaced repetition. Flagged an open privacy decision: this is the one place a
  learner's own written answer becomes visible to a peer. Designed anonymized-by-default
  ("a peer's answer," no name shown) — not yet confirmed with the founder, needs sign-off before
  building.
- **Phase E — student rating / "Trust Pilot" system.** Derived from Phase D's review outcomes
  into a per-skill reputation score. Designed as private (learner's own account + admin view
  only) rather than a public directory, pending an explicit ask for that.
- **Phase F — recognition (honor roll, class president).** A monthly cron snapshot into a
  `recognition_awards` table, so an award is a fixed historical fact rather than a live-changing
  rank. This is the same feature named "leaderboard" in the approved 5-phase platform roadmap —
  reached from this direction rather than a separate system.

**New open item this pass surfaced:** dev-mode sign-in (`DEV_LINKS=true`, no `RESEND_API_KEY`)
is still live — anyone can mint a session for any email today, including the founder's own. The
admin panel being gated on `role === 'founder'` is only as strong as that gate, so closing
dev-mode (or requiring both a real founder role AND a real email key before the admin route does
anything) should happen before this panel is treated as actually access-controlled, not just
functionally gated. See the standing "Cloudflare Email Service" open thread below — the two are
now the same blocker.

## v0.26 — 2026-09-15 — Founder admin panel Phase C: feedback channel

New session, on a freshly-mounted checkout (`git fetch` confirmed local `master` already matched
`origin/master` — nothing pending from elsewhere). Caught up from `docs/continuity-log.md` +
memory, then picked the safest unblocked item: **Phase C** from the admin-panel plan
(`/home/dayle/.claude/plans/humble-purring-hopper.md`) — deliberately not Phase D (peer review),
which that same plan flags as needing an explicit founder decision on anonymized-by-default
before it's built.

- **`workers/api/migrations/0004_feedback.sql`** — `feedback` table (`user_id, text,
  page_context, rating, created_at`), per the plan's exact shape.
- **`workers/api/index.js`** — `POST /api/feedback` (`requireAuth`; text required ≤4000 chars,
  optional 1-5 integer rating silently ignored if out of range rather than rejecting the whole
  submission, IP-keyed rate limit reusing the existing `rateLimited` helper) and
  `GET /api/admin/feedback` (`requireFounder`; joins `users` for the email, newest first,
  capped at 200 rows).
- **`workers/api/test.mjs`** — new; the API Worker had zero tests before this (only
  `workers/signup` did). Hand-rolled fake D1 (matches real `prepare()`'s shape: `.first/.run/.all`
  work both directly and after `.bind()`, matched by SQL substring rather than table-driven, so it
  tolerates reformatting) + fake KV, same style as `workers/signup/test.mjs`. 17 checks: auth
  gating, validation, rating clamping, rate limiting, founder-only admin access, newest-first
  ordering. All pass.
- **App**: a persistent "Feedback" link in the footer (`index.html`) → `#/feedback` (sign-in
  gated, textarea + optional 1-5 rating, posts via the existing `AUTH.apiPost` helper) →
  `#/admin/feedback` tab added to the admin nav. Small router addition along the way:
  `lastPath` (set at the end of every `router()` call, holding the *previous* page) so the
  feedback submission can record which page it was sent from without a query-string round-trip.
- **Deployed and verified live** against production (not just the local D1 shadow): migration
  applied via `--remote`, Worker + Pages redeployed, then curl end-to-end using the existing
  dev-mode sign-in path (no real email needed — `DEV_LINKS=true` still, see the open Cloudflare
  Email Service item) — 401 signed-out → dev-link sign-in → 200 feedback POST → 403 on
  `/admin/feedback` for that same non-founder account → 400 on empty text. The one test
  user/feedback row this created was deleted from production immediately after (same hygiene as
  the v0.25 admin-panel verification: confirmed by `SELECT count(*)` back to 0 before finishing),
  so production starts from a genuinely empty `feedback` table.
- **Not done, and deliberately left for the founder**: Phase D (peer review) still needs the
  anonymized-by-default privacy call confirmed before it's built; Phases E/F depend on D.

## v0.27 — 2026-09-15 — Fix: Applied Projects no longer default to unattached

Picked up the other unblocked item from the v0.23 walkthrough's open list (the founder-decision
one, peer review, is still deliberately untouched — see v0.26). `projectSelect()` (the `<select>`
on every single challenge/checkpoint form, `app/js/main.js`) now defaults to the learner's **most
recently created** project instead of "— not attached to a project —", with an explanatory hint
("Defaulted to your most recent project — change it if this one belongs elsewhere") and "not
attached" still present as the first, explicitly selectable option — nothing is hidden or forced,
just a better default. Falls back to the original unattached-default behaviour exactly as before
when the learner has zero projects. One shared function, so the fix applies everywhere it's used
without touching the two call sites. Verified the rendered HTML for both the zero-projects and
multi-projects cases (`selected` lands on the right `<option>`, hint text switches correctly)
since no browser tool was available this session; no D1/Worker change needed, so only
`build.sh && wrangler pages deploy` was required to ship it.

## v0.28 — 2026-09-15 — Diagnostic → pathway recommendation; pathway prerequisites enforced

Two of the three items the founder named together this session (the third, more pathway
domains, follows in the next entry).

**Diagnostic → pathway recommendation.** Every one of the 18 pathways now carries a
`recommend: [...]` array of specific, lowercase phrases (same discipline as `critiqueChallenge`
signals — multi-word and on-topic, never a bare common word, to avoid false positives).
`CONTENT.recommendPathway(text)` scores a free-text answer against every pathway's list and
returns the best match, or `null` on a genuine miss — it never forces a pick on thin signal.
Wired into two places: the Pathway Engine's "choose a work pathway" reason (`pathway.js`) now
names the recommended pathway when there's a hit, and the Pathways catalogue page shows a
"Recommended for you" callout (with the pathway's own tagline) above the full list, which stays
fully browsable either way. Deliberately kept as transparent keyword scoring, not a model call —
consistent with how the rest of the Faculty is authored (`faculty.js`'s rubric heuristics), and
it's server-free so it works with zero added latency or cost.

**Pathway prerequisites, enforced.** Previously `agents` and `safety` (both `prereq:
"engineering"`) showed only an advisory "best taken after" note and let you choose them
immediately regardless. New `prereqMet(learner, p)` in `main.js` checks the prerequisite
pathway's actual completion via the already-existing `MODEL.moduleComplete()` (competencies +
capstone all done) — not just "started" or "chosen". Unmet prerequisites now show a real
"Locked" state (badge on the catalogue card, a warn-coloured notice on the overview page) and
the primary "Choose" button is replaced by an explicit, deliberately de-emphasised "Choose
anyway — I already have that background" ghost button — following the same never-fully-lock
precedent as the existing founder "Skip foundation" button, rather than a hard wall with no way
through. `software`/`content`/etc. (`prereq: "foundation"`) are unaffected — foundation
completion is still handled separately via `foundationDone`/the skip flag.

Verified: extracted and unit-tested `recommendPathway` (hits, near-misses, and empty/no-signal
text all behave as designed) and `prereqMet` (true for foundation-only prereqs; false→true for
`agents`/`safety` traced through a simulated full completion of `engineering` via the same
`MODEL` calls the app itself uses) in a throwaway Node harness — no browser tool was available
this session, same constraint as v0.27. `node -c` clean on all three touched files.

## v0.29 — 2026-09-16 — Add Design & UX pathway (19th)

Resumed session (previous one had been invoked from a different directory and left one
uncommitted change sitting in the working tree: a fully-authored **Design & UX** pathway in
`app/js/content.js`, matching the standing pathway recipe — content itself was already good,
just never committed/validated/shipped). Caught up via memory + continuity-log tail, then
verified and shipped the pending work rather than re-deriving it.

**UX1–UX5 + UXCAP**: synthesising research without inventing findings (theme = unprompted
pattern across multiple sources with counts + traceable quotes, not one loud opinion or a
leading-question artifact); generating and evaluating design options against real constraints
instead of picking the prettiest one; accessibility as a real check (AI pass *and* a genuine
keyboard/screen-reader test, not just the AI pass alone); interface copy checked against actual
current behaviour rather than the roadmap; and critique specific enough to act on (element + user
impact + testable fix). `recommend: [...]` phrases added for the diagnostic recommender
(`"ux design", "user research", "product designer", ...`). Not a regulated domain, so
deliberately left out of the Legal/Finance/HR/Health/Public regulated-pathway banner list in
`main.js`.

Validated with a throwaway Node harness (loaded `content.js` directly, no DOM needed): rubric/
field-count pairing, critique `signals` all lowercase and specific (no bare common words),
exactly one scenario `ok:true` per scenario challenge, guided `fields`/`model` key sets match,
`UXCAP.after[]` resolves to real competency ids, `recommend` phrases lowercase, and no duplicate
pathway id (19 total now, `design` distinct from the existing `content` pathway). `node -c`
clean. No D1/Worker change needed — pure content — so this only needs `build.sh` +
`wrangler pages deploy`.

**Deployed later the same session** once the user was present to approve the harness's
production-deploy classifier prompt — verified live via `curl` on `aifaculty.org`.

## v0.30 — 2026-09-16 — Add Consulting & Advisory Services pathway (20th)

Same session as v0.29, continuing "up to you" on what's next. Followed
`docs/expansion-prompt.md`'s exact recipe to pick and build the next highest-value uncovered
domain: **Consulting & Advisory Services** (management/strategy consultants, independent
advisors, engagement analysts) — genuinely distinct from the existing Research, PM and Design
pathways (client-engagement dynamics: scoping a billable engagement, defending an analysis to a
client, honest uncertainty in a deliverable — not just "verify your sources" restated).

**CONS1–CONS5 + CONSCAP**: scoping the real question before analysing (name the decision it
feeds and the precise definitions, before AI confidently answers whatever question you typed);
synthesising stakeholder input without inventing statistics (a false-precision percentage from 5
qualitative interviews is fabricated, not just optimistic rounding); building a defensible
analysis (recompute/spot-check the load-bearing calculation, check units and time periods match
— a persuasive narrative is not evidence the arithmetic is right); drafting deliverables whose
claims trace exactly to the analysis (a 12–30% range doesn't become a flat "30%" in the client
slide, and "the analysis shows" stays visibly separate from "we recommend"); and communicating
uncertainty honestly (a caveat that affects the recommendation sits next to it, not buried in an
appendix, and the deliverable's tone tracks the analysis's real confidence rather than AI's
default confident register). `recommend: [...]` phrases added. Not treated as a regulated
domain — no special-standards banner needed, same bucket as Design/PM/Sales.

Validated with the same throwaway Node harness pattern as v0.29, extended to check lesson-step
completeness and QUICK_CHECKS presence per competency too: all clean on the first pass except
several critique `signals` that were single words ("invented", "collapsed", "adoption") —
technically specific enough not to false-positive in practice, but tightened to multi-word
phrases anyway to hold the line on the house rule rather than rely on judgement calls about which
single words are "safe". Re-ran clean: 20 pathways total, no duplicate ids, `CONSCAP.after[]`
resolves, guided field/model keys match, exactly one scenario `ok:true` throughout. `node -c`
clean on `content.js` and `main.js`. Updated `docs/09-work-pathways.md`'s catalogue tables and
prototype-status line for both this pathway and the previously-unlogged-there Design & UX one
(18→20 pathways, 96→106 competencies).

Deployed same session (`build.sh` + `wrangler pages deploy`, both needed the user present to
clear the harness's production-deploy classifier prompt) and verified live via `curl` on
`aifaculty.org` (`CONSCAP` present in the served `content.js`).

## v0.31 — 2026-09-16 — Add Sales Engineering & Technical Pre-Sales pathway (21st)

Same session, user said "do another pathway domain." Picked the next highest-value gap named in
the open threads: **Sales Engineering & Technical Pre-Sales** — genuinely distinct from the
existing Sales pathway (SL1–5, which is account research/outreach/CRM-hygiene) because this one
is about the technical pre-sales motion: scoping a prospect's real requirement, keeping demos
honest about current vs. roadmapped capability, and the specific liability shape of an RFP
response or a client-facing technical proposal.

**SE1–SE5 + SECAP**: technical discovery that scopes the real requirement (the "where's the
data, who consumes it, what decision it feeds" pattern, so a demo doesn't answer a guessed
version of the ask); grounded demos that show only current, real capability (a roadmap item
gets named as roadmap, never staged as live); RFP/RFI responses using precise full/partial/
roadmapped/not-supported categories instead of a blanket "yes" that becomes a checkable
contractual claim; solution-proposal technical claims (scalability numbers, integrations) traced
to a real source rather than an AI-plausible figure; and honest objection-handling under deal
pressure — a specific, timely follow-up instead of a confident guess when a sales lead wants
momentum. `recommend: [...]` phrases added. Not a regulated domain.

Validated with the same Node harness pattern as v0.29/v0.30 (extended this time to also check
QUICK_CHECKS entries have exactly one `ok:true` per question, since those hadn't been checked
before): caught two more single-word critique signals ("contractually", "liability" in SE3.2),
tightened to multi-word phrases, re-ran clean — 21 pathways total, no duplicate ids, `SECAP.
after[]` resolves, guided field/model keys match. `node -c` clean on `content.js` and `main.js`.
Updated `docs/09-work-pathways.md` (21 pathways, 111 competencies).

Deployed same session — `build.sh` succeeded standalone, but the harness's production-deploy
classifier blocked `wrangler pages deploy` until the user said "go" to approve it (third time
this has happened this session; treat it as routine, not a sign of a problem). Verified live via
`curl` on `aifaculty.org` (`SECAP` present in the served `content.js`).

## v0.32 — 2026-09-21 — Add Education Leadership pathway (22nd); randomise MC answer position

New day, session resumed from where a prior one had paused mid-edit (an EDL pathway draft sitting
unregistered in `content.js` — same "pick up pending work rather than re-derive it" pattern as
v0.29). Finished wiring it, then the user asked for two more things in one message: deploy, and
fix multiple-choice answers being guessable by position.

**Education Leadership & Ed-Tech Governance (EDL1–EDL5 + EDLCAP)** — for principals,
superintendents, district administrators; distinct from the existing Education & Training
pathway (which is for classroom teachers/L&D authoring material, not adoption/governance
decisions). Evaluating an AI/ed-tech vendor's claims against the real study behind them and the
actual data-processing agreement, not the marketing deck; drafting AI-use policy grounded in this
school's actual tools/data-flows/open questions instead of a generic template; communicating
adoption decisions to parents/staff honestly (pilot vs. proven, data practices disclosed plainly,
not buried); staff AI training matched to real, differentiated skill levels with follow-up, not
one generic session; and treating an AI-detection flag (academic integrity, content moderation)
as the start of a human-decided investigation, never the verdict — same "stays human" pattern as
HR5/PS3/EDL5's own sibling competencies. Added to the regulated-domain notice in `main.js`
(`legal/finance/hr/health/public/edleadership`) since student-data-privacy obligations vary by
jurisdiction — and while there, **generalised that notice's wording** to drop a hardcoded
"checked (2026-09-12)" audit-date claim that, on inspection, never actually covered every
pathway it was attached to (Public Sector was added 3 days after that date and inherited the
claim anyway back in v0.24) — fixed now rather than compounding it a third time. Validated with
the same Node structural-sweep pattern as the last three pathways, clean on the first pass.
Updated `docs/09-work-pathways.md` (22 pathways, 116 competencies). Deployed same session,
needed the user's "go" to clear the production-deploy classifier prompt as usual; verified live.

**Randomised multiple-choice option order (quick checks + scenario challenges).** The user
noticed the correct answer was almost always authored in the same position (typically the middle
of 3) — a learner could pattern-match position instead of actually reasoning, which undermines
the whole "rubric-assessed with real evidence, not quizzes" premise of the platform. Root cause:
every pathway across the whole codebase (not just newly-authored ones) had this bias, since
content was always authored with the correct option in a natural narrative order rather than a
randomised one. Fixed at the **render layer** in `main.js`, not by rewriting ~22 pathways of
content: a `shuffled()` Fisher-Yates helper is applied at render time to both the quick-check
options list and the scenario-challenge options list. This fixes every pathway retroactively, old
and new, with a one-file change. Scoring is unaffected — verified rather than assumed:
scenario challenges are graded by each option's stable `id` (`faculty.js` matches
`submission.choice` against `ch.options` by `id`, not position), and the quick-check click
handler reads correctness straight off the rendered button's own `data-ok` attribute; the one
place an original array index still mattered (fetching the clicked option's `.why` feedback
text) now carries the option's original index through the shuffle as an `[option,
originalIndex]` pair, so it still resolves correctly regardless of display order. Verified with a
throwaway Node simulation: 30,000-trial shuffle distribution came back uniform across all
positions, and every shuffled `oi` resolved back to its correct original option. `node -c` clean.
Deployed same session — this one didn't trigger the production-deploy classifier prompt at all,
unlike every other deploy this week; the trigger condition for that prompt still isn't fully
understood, don't assume either behaviour going in.

## v0.33 — 2026-09-22 — Add Real Estate pathway (23rd)

New day, user said "continue" with no further specifics — read as continuing the session's
dominant, well-precedented rhythm (another pathway domain) rather than the open, unresolved
"what did you mean by improve learning methods more broadly" question from the end of the prior
session, since that one still needs the user's own answer.

**Real Estate (RE1–RE5 + RECAP)** — for agents, brokers, property managers, listing
coordinators; a genuinely new professional-services variant, not overlapping the existing
pathways. Listing descriptions checked against real, current facts for the specific address
(school assignment, renovation dates) rather than appealing generalisations, with an explicit
fair-housing-language screen (steering phrases, "ideal for" a type of buyer); CMAs built from
comps checked for being genuinely representative of the market rather than selected to fit a
seller's target price, with real recency/condition adjustment; client communication about
property condition that matches the actual inspection/disclosure document exactly, never a more
reassuring AI-drafted tone; contract/offer paperwork treated as a binding legal document needing
a real, qualified review against what the client actually agreed to before submission (a cheap
catch before submission vs. an expensive, binding problem after acceptance); and jurisdiction-
specific fair-housing/disclosure questions verified against the actual local rule via a
broker/attorney, never answered from general real-estate knowledge. Added to the regulated-domain
notice in `main.js` (`...,"edleadership","realestate"`) for the same reason as Public
Sector/Education Leadership — real-estate law varies by jurisdiction.

Validated with the same Node structural-sweep pattern as the last four pathways — clean on the
first pass this time (no signal-strength fixes needed, unlike CONS/SE). 23 pathways total, no
duplicate ids, `RECAP.after[]` resolves, guided field/model keys match. `node -c` clean on
`content.js` and `main.js`. Updated `docs/09-work-pathways.md` (23 pathways, 121 competencies).
Deployed same session with no production-deploy classifier prompt this time either — two in a
row now without the prompt firing, still no clear read on what actually triggers it.

## v0.34 — 2026-09-22 — Pedagogy review: assess teaching/assessment method, don't build

Founder asked for an assessment of the teaching method's practicality/viability and suggestions
to make learning faster/better — explicitly an assess-and-suggest request, not an implementation
one, so nothing in `app/js/` changed this entry. Wrote
[docs/10-pedagogy-review.md](10-pedagogy-review.md) after reading `faculty.js`, `model.js`,
`pathway.js`, `progress.js` end to end (not skimmed) and cross-checking the actual implementation
against the platform's own design docs (04, 08).

**Headline finding:** the assessment engine (`faculty.js` `fieldBand()`) grades free-text answers
by word count plus a regex for "specificity" (any digit, connector word, or quoted phrase clears
the top band) — so a padded answer with "because" and a number can score *Exceeds* while a short,
correct answer scores *Developing*. The "independent second assessment" (`strict:true`) is the
same regex with a higher word floor, not a different check. Framed this as *not* a newly-
discovered bug but the exact, already-scoped gap in
[08-assessment-model.md](08-assessment-model.md) §8, which lists "model-scored rubric behind the
Control Plane" as a **Later** item — the design was right on paper, the shipped app just never
moved past the v0.2 "Now" column while the platform grew to 23 pathways on top of it. Every
downstream artefact (evidence portfolio, free-tier certs, the still-unbuilt Phase D/E/F
peer-review/rating/recognition features) inherits this ceiling, and closing it needs the
Control-Plane/LLM seam already in Open Threads, not a bigger regex.

**Also found**, cross-checked against [04-learning-engine.md](04-learning-engine.md)'s own spec
(which already names a `revisit` pathway action and a `Revisiting` progress state that were never
implemented): no spaced retrieval at all (`PATHWAY.next()` walks forward only — a finished
competency never resurfaces, though `taughtAt`/`completedAt` timestamps already exist and are
unused for this); the guided-practice step is fully skippable (its textareas aren't `required`,
unlike every challenge form) so the one real retrieval-practice step in the whole lesson has zero
enforcement; blocked practice throughout with no interleaving (named as a real trade-off against
the pathway's coherent-course identity, not a strict recommendation); and failure feedback
("go back to the teaching") doesn't deep-link to the specific lesson step, even though the app
already has the step keys to do so.

**Recommendations were ranked by buildability**, not just impact — three items need no backend
(require the guided attempt before reveal; add a spaced revisit action using data already on the
learner record; deep-link "more"-verdict feedback to the specific step), one is a trade-off
needing an explicit founder decision (interleaving), and the assessment-engine fix explicitly
needs the Control Plane and isn't a quick patch.

Also flagged, but deliberately **not fixed this pass** (out of scope for what was asked): the
`/about` page (`main.js` ~line 1037) still names only 4 of the now-7 regulated-notice pathways and
repeats a stale "reviewed (2026-09-12)" claim the overview banner itself already dropped in v0.32.

## v0.35 — 2026-09-24 — Monetization: plans, Stripe payments, plan gate

Founder: "make money of the ai faculty learning platform." Built the first monetization slice —
strategy + payment plumbing + a client plan gate — per [docs/11-monetization.md](11-monetization.md).
Payments are **opt-in and off by default**: without Stripe secrets every `/api/payments/*` route
returns `501 payments_not_configured` and the UI degrades to a waitlist CTA, so nothing ships
broken before a Stripe account is connected.

- **Design doc** `docs/11-monetization.md` — Free (foundation + first pathway, forever) /
  Pro ($15/mo or $120/yr, all pathways) / Founding Member ($150 one-time lifetime Pro, pre-launch).
  Hard rules: payment buys access breadth only, never a grade; compensation rules unchanged; prices
  founder-approved.
- **D1 migration** `workers/api/migrations/0005_billing.sql` — `users.plan` (`free|pro|founding`),
  `users.plan_status`, `users.stripe_customer_id`, plus an append-only `payments` ledger
  (deduped on `stripe_event_id`) that feeds the admin revenue view.
- **API Worker** (`workers/api/index.js`):
  - `GET  /api/payments/plans` — public catalogue + `stripeEnabled`.
  - `POST /api/payments/checkout` — Stripe Checkout session (subscription for Pro, one-time for
    Founding); works signed-out (webhook matches by email, auto-creates the user) or signed-in
    (reuses the Stripe customer). Nothing creates an account before a payment. Checkout accepts
    **card + PayPal** (`payment_method_types` handled entirely by Stripe — no separate PayPal
    merchant; enable the wallet in the Stripe Dashboard). Note: `stripeFetch` originally encoded
    string arrays as objects (`payment_method_types[0][0]=c`) — fixed to index plain values
    (`payment_method_types[0]=card`), caught by the test suite.
  - `POST /api/payments/billing` — authenticated → Customer Portal (manage/cancel).
  - `POST /api/payments/webhook` — HMAC-SHA256 signature-verified (base64url `whsec_` decoding,
    5-min replay window); `checkout.session.completed` grants plans, `customer.subscription.*`
    syncs `plan`/`plan_status`, `invoice.paid` records recurring revenue. Plain fetch to Stripe,
    no SDK.
  - `currentUser`/`/api/auth/me` now return `plan`, `plan_status`, `stripe_customer_id`.
  - Admin overview now reports `planCounts` + `revenue` (lifetime cents, payment count,
    paying-learners).
- **Landing page** — new `#pricing` section (Free / Pro / Founding Member), buy buttons wired to
  checkout with graceful "opening at launch" fallback; signup copy updated to "keep free access to
  the Free plan"; CSP `connect-src` extended to the API worker for previews.
- **App** — new `js/plans.js` tier helper; pathways catalogue shows a **Pro** pill + upgrade banner
  on paid pathways for signed-in free learners; pathway overview shows an upgrade card instead of
  the choose form; Account view shows the plan with Upgrade-to-Pro / Manage-billing actions.
  Deliberately **soft/client-side** at this stage (content ships in `localStorage`; signed-out
  demo stays fully open; founder bypasses) — documented as such in `11-monetization.md` §5.
- **Tests** — `workers/api/test.mjs` now 37 checks (was 17): plans endpoint, 501 fallback, checkout
  session creation + price/mode/metadata + card/PayPal payment methods, bad-signature 400, founding
  grant via webhook (user auto-created + revenue recorded once), subscription plan sync, admin revenue
  overview. 37/37 pass.
- **Wrangler** — `[vars]` docs for the three Stripe price IDs + `wrangler secret put` instructions.

**Open pieces** (founder to do, can't be done from the repo): create the Stripe account + products,
set the two secrets, fill the price IDs, run migration `0005_billing.sql` on D1, deploy, and set a
founder `plan` row by hand (or founder role already bypasses). Landing/app checkout buttons stay
hidden/graceful until then.

## v0.36 — 2026-09-24 — Build the pedagogy review's no-backend fixes

Implements the three buildable-now recommendations from `docs/10-pedagogy-review.md` §4,
plus the small §5 accuracy find. No API/backend or assessment-regex changes — every fix is
client-side and ships to every existing pathway at once.

- **Guided attempt is now a real forcing function** (`main.js`, `store.js`). The model answer
  on the `guided` step stays hidden until the learner writes at least one field (was: reveal
  anytime, with "Not yet" feedback doing nothing). The "I'm ready — do it on my own task"
  button is also gated on that attempt (was: available with zero friction). Attempts recorded
  in `learner.guided[capId]` (new, forward-defaulted in `store.js`). Fixes review §4.1.
- **Spaced "revisit" action in the Pathway Engine** (`pathway.js`, `store.js`). A fully
  completed competency resurfaces its ungraded quick-check once it's gone
  `REVISIT_AFTER_DAYS` (3) since last exposure, interleaved at competency boundaries — the
  `revisit` action the design docs always named and nothing implemented. Non-blocking: forward
  learning/challenges for in-progress work always take precedence, and a *finished* module
  never nags (the `moduleComplete` guard). Doing the quick-check resets the timer via
  `learner.revisits[capId]`. `actionVerb` gained "Quick check — revisit". Fixes review §4.2.
- **"more" verdict deep-links to the teaching** (`main.js`). A `more` verdict on a challenge
  now renders a targeted "Go back to the teaching" card linking straight to that lesson's
  **moves** (`#/learn/{cap}/3`) and **worked example** (`#/learn/{cap}/2`) instead of a vague
  "go back to the teaching". Fixes review §4.3.
- **Stale /about copy** (`main.js`) — the regulated-domain list no longer names only
  "Legal, Finance, HR, Healthcare" or repeats the "specifically reviewed (2026-09-12)" claim;
  it now mirrors the generalized, date-free notice each regulated pathway's overview banner
  already carried since v0.32. Fixes review §5.
- **Verification** — no app test harness exists, so wrote an ad-hoc node harness
  (`/tmp`-only, not committed) that loads the real `content.js`/`model.js`/`pathway.js` with a
  stubbed `window`: 7/7 checks (C1 done 4d ago → revisit fires; after revisit → forward
  resumes; freshly-done → no revisit; fully-done module → no nag; undiagnosed → diagnose).
  `node --check` on all edited files, `./build.sh` assembles cleanly.

Spaced retrieval and the forced guided attempt work from *today's* data (they read
`completedAt`/`taughtAt`, which every learner record already carries); only `guided`/`revisits`
become visible to new saves — and they're forward-defaulted so nothing resets.

## v0.37 — 2026-09-24 — Evidence portfolio export (Phase 2 milestone)

Phase 2's "export an evidence portfolio" item, plus a roadmap correction.

- **Roadmap correction:** the "authored content + practice tasks for C2–C7" checkbox was stale —
  the foundation module (C1–C7) and the *software* pathway (S1–S5) have been fully authored since
  v0.4–v0.7 and were walked end-to-end in v0.23 (every competency has activate/explain/
  demonstrate/deconstruct, 2 quick-checks, a full guided task, and 2–3 rubric'd challenges).
  Marked done with a note. The working branch of work-paths (Content, Operations, Design, etc.)
  is authored too; only pathway *variants* still expand via `docs/expansion-prompt.md`.
- **Export an evidence portfolio** — new `app/js/export.js` (`window.EXPORT`), wired into the
  Evidence view (`#/evidence`) with two buttons: **Export as Markdown** (human-readable portfolio:
  generated date, assessed capability states, evidence grouped by Applied Project with
  **Demonstrated** badges, per-record fields + faculty note) and **Export as JSON** (machine-readable
  backup: format tag + version, capabilities, projects, challenges, checkpoints, evidence).
  Downloads via a plain Blob+objectURL — fully local, no backend call, works signed-out, and
  deliberately excludes the activity log (noise). Uses the same `projectDemonstrated` logic as the
  in-app view (`activeModuleOf` mirrors main.js).
- **Verification** — `/tmp` harness loads real `content.js`/`model.js`/`export.js` with a stubbed
  `window`: 12/12 checks (title, capability summary, project grouping, field/feedback rendering,
  no false "Demonstrated" badge, deterministic Markdown, parseable JSON with format tag + data,
  graceful empty-portfolio output). `node --check` on both edited files; `./build.sh` clean.
- **Tests** — `workers/api/test.mjs` unaffected (client-only change).

## v0.38 — 2026-09-24 — ARP, branching, and mastery rubric UI (Phase 2 finish)

The three remaining Phase 2 items, hardest → easiest. All client-side, no backend changes.

- **Assessment Resolution Protocol (docs/08 §5)** — the checkpoint flow now runs the full protocol
  shape: assessor 1 → optional independent second assessment (stricter bar, no Developing bands,
  one dimension must Exceed) → **agreement** records evidence with `assessors: "1 + 2 (independent)
  agree"`; **disagreement** (assessor 1 passed, stricter assessor 2 did not) renders a *reasoned
  review* panel — exactly which mastery dimensions the second assessor wanted, with the
  revise-is-normal framing from §5.4 — plus an **escalate** action (§5.5). Escalation appends a
  `pendingReviews` entry (id, cpId, note, submission snapshot, status) logged as `arp-escalation`,
  and the Evidence view now shows pending reviews with a link back to the checkpoint. Honest limit:
  there is no human specialist in this single-learner prototype, so escalation is recorded as a
  marker for the founder and for the future multi-learner pool — the copy says exactly that.
- **Pathway branching** — `pathway.js` now **branches back**: every checkpoint attempt (pass or
  fail, either assessor) is recorded in `learner.checkpointAttempts` (verdict, assessor,
  disagreement flag, weak dimensions). When a module's checkpoint is ready-but-unmet, the engine
  returns action `branch` → the weakest covered capability's teaching (`#/learn/{cap}/3`) with the
  specific dims it wanted, instead of cold re-suggesting the failed checkpoint. Deliberate deferral
  recorded in docs/04: no blind accelerate/skip of graded challenges — assessment integrity; the
  checkpoint is the raised challenge, and acceleration-by-prior-evidence is a governance call for
  when real independent assessors exist.
- **Mastery rubric scoring UI** — `faculty.js` adds `masterySummary` (per-band counts, weak
  dimensions, banded verdict per §3, shared with ARP). Every checkpoint result now shows a
  **Mastery rubric — scoring** card (X of Y at Meets+, banded verdict, what a pass raises the
  covered capabilities to). Rubric bands are now **persisted on evidence records** (docs/08 §7 —
  previously only the free-text note was kept), displayed on the Evidence view, and each pathway
  overview gains a mastery panel: best-recorded band per dimension + coverage count.
- **Verification** — `/tmp` harness loads real `content.js`/`model.js`/`faculty.js`/`pathway.js`:
  17/17 checks including masterySummary math on real CP1 dimensions, strict-bar pass, a genuinely
  reachable disagreement seam (1st `ready` → 2nd `revise`), branch-back targeting the weakest cap,
  correct href + weak dims + "disagreed" reasoning, assessor-1 failures branching too, and a
  passing re-attempt returning to the normal checkpoint action. `node --check` clean, `./build.sh`
  clean. `workers/api/test.mjs` unaffected (37/37).

## v0.39 — 2026-09-24 — Institutional AI Control Plane v1 + reviewer role (Phase 3 start, Phase 4 slot)

Phase 3 kickoff with the first real piece of the Control Plane, plus the Phase 4 learner‑faculty
role that closes the ARP loop end-to-end. Also fixed remote D1 migration bookkeeping that had
silently stopped being authoritative.

- **Control Plane v1 (server)** — `workers/api` gains an Institutional AI policy engine
  (`FACULTY_POLICIES`, docs/01 §3 + docs/08 §3/§5) and two adapters: a deterministic **dry-run**
  (exact server-side mirror of the client's strict second-assessment bar — the independent opinion
  is genuinely computed off-device) and a swappable **openai-compatible** adapter behind a secret.
  Every faculty call is **audited to `faculty_calls` before the page is answered** — who asked, with
  which model/version (or dry-run), under which policy, with what bands/verdict/confidence —
  and a `degraded` flag keeps lineage honest when a model call is intended but falls back.
  Routes: `POST /api/faculty/assess` (signed-in, rate limited), `GET /api/faculty/log`
  (founder-only lineage log). Config lives in `wrangler.toml` (`FACULTY_ADAPTER`, base URL/name) +
  secret `FACULTY_MODEL_KEY`; switching the model on is a founder action, no code change.
- **App routing through the plane** — the independent second assessment now posts to the Control
  Plane when signed in (never blocking; any failure falls back to the local strict heuristic), and
  the evidence record carries `lineage` (the audited call id) + `model` (adapter/model tag).
- **Reviewer scoped role (Phase 4 roll-in)** — ARP resolution becomes real: a founder grants the
  `reviewer` role (`POST /api/admin/role`); reviewers see disputed calls (`GET /api/faculty/reviews`),
  decide them (`uphold | override | dismiss` + a reasoned note, one decision per call, upserted), and
  learners pull their own resolutions (`GET /api/faculty/reviews/me`). Escalation now confirms the
  dispute sits on the server's open-review list (`POST /api/faculty/reviews/escalate` → `callId`)
  when the second assessment reached the plane; disputes that never left the device stay honestly
  **local-only** (no server review implied). Evidence view pulls resolutions live after render and
  reconciles matching `pendingReviews` to `resolved`, showing the decision + note.
- **Remote D1 migration repair** — remote bookkeeping recorded only 0001–0002 while 0003–0005
  objects already existed, so `migrations apply --remote` was wedged (0006/0007 had never landed).
  Added `0008_faculty_catchup.sql` (idempotent mirror of 0006+0007 DDL), applied it remotely,
  and backfilled `d1_migrations` to 0001–0008. `migrations apply --remote` → clean.
- **Verification** — `workers/api/test.mjs` extended to 66/66: role guard (learner 403, invalid
  role 400, grant 200, no-such-user 404), reviewer list/decide/re-decision on the disputed seam,
  reviewer blocked from the founder lineage log, learner's own resolution, escalate
  local-only vs open, plus the existing 52 Control Plane/auth/billing/admin checks. Client JS
  syntax-checked; `./build.sh` clean; ARP/branching harness still 17/17. Live smoke: all six new
  endpoints gate 401 unauthenticated on `aifaculty.org/api/*` (worker deploy `6acb3641`).

## v0.40 — 2026-09-24 — Launch readiness in the admin panel + Journalism & Media pathway

Two follow-on halves from the v0.39 ship: founder-facing ops hardening, and a full new pathway
(Journalism & Media) grown to the expansion-prompt pattern.

- **Launch readiness (admin/ops hardening)** — new founder-only `GET /api/admin/readiness`
  aggregate (workers/api) reports the founder-owned switches in one checklist: Stripe connected
  (Plans gate live vs waitlist), email delivery (dev-links vs real Resend key), and the Faculty
  plane (dry-run live vs model behind `FACULTY_MODEL_KEY`) — alongside the live loop status:
  disputed calls, open vs decided reviews, faculty calls audited, migrations applied. The admin
  Overview renders it as a ✓/✗ card with an amber line when open reviews await a decision.
  `test.mjs` extended to 73/73 (shape, controls, counts moving after a disputed call + decision,
  learner 403). Deployed `bb3a302c`; verified live with a real founder session on
  `aifaculty.org/api/admin/readiness` (then cleaned up the smoke account) — `migrationsApplied: 8`
  confirms the v0.39 repair end-to-end.
- **Journalism & Media pathway (content expansion)** — new work pathway id `journalism`,
  competencies J1–J5 built to the exact legal-pathway depth (full lessons, 14 fields/critique +
  scenario challenges, quick checks, `JOURNCAP` work capstone): J1 what AI can and can't do in the
  newsroom; J2 grounded claims (every fact traces to a source, absence claims checked by hand);
  J3 sourcing, attribution & provenance; J4 corrections, disclosure & integrity under pressure;
  J5 the produce → verify → decide workflow. Regulated/professional-standards notice extended to
  this pathway in the overview. Validation: `node --check`, plus a full-file structural sweep (all
  24 pathways: checkpoints present, guided field/model keys match, scenario exactly one `ok:true`,
  critique ≥3 with lowercase+specific signals, fields rubric ≤ fields) — clean.
- **Docs** — `docs/09-work-pathways.md` catalogue gains the Journalism row + prototype-status
  line (24 built, 126 competencies). `docs/roadmap.md` ticks Phase 3 (Control Plane v1) and the
  Phase 4 learner-faculty scoped role; `docs/08-assessment-model.md` §8 "now vs later" is updated
  to the v0.39/v0.40 reality.
- **Catalogue drift note** — the expansion-prompt said "16 pathways as of 2026-09"; ground truth
  was 23 (content.js `PATHWAYS`). Now 24. The prompt's example gap names (journalism, K-12) were
  still the honest highest-value picks to check first.

## v0.41 - 2026-09-25 - Faculty reviewer worklist (client half of the ARP loop)

The v0.39 ship built the server half of the Assessment Resolution Protocol (ARP) and the v0.40 ship
hardened ops around it, but nothing on the client ever called it: the `/faculty` route pointed at
`viewFacultyWorklist` / `loadFacultyWorklist`, which did not exist. The reviewer loop was therefore
unreachable - a dispute could be escalated and would appear on the open-review list, but no
specialist could ever see it or record a decision.

- **Worklist** - `/faculty` now renders the Control Plane review list: every disputed call with its
  checkpoint, adapter, model, verdict, learner and call time, split into the open list and the
  decided history. Gated by `requireFacultyView` to `founder` / `reviewer`; the server enforces the
  same rule on `GET /api/faculty/reviews`, the client gate is UX only.
- **Decisions** - each open row carries an uphold / override / dismiss form plus an optional note for
  the learner. The new `faculty-decide` branch in `handleForm` (a byte-sibling of the existing
  `escalate` branch) POSTs `{ callId, decision, note }` to `/api/faculty/reviews`, logs the action,
  and reloads the worklist. Vocabulary is the same `decisionText` copy the learner already reads on
  the Evidence view, so both sides of the loop say the same thing about the same decision.
- **Navigation** - `renderAuthNav` gained a Faculty link for `founder` / `reviewer`, alongside the
  founder-only Admin link.
- **Cleanup** - the panel had been pasted twice by an earlier interrupted edit; the dead first copy
  (68 lines, the `facultyBox` variant) is excised. Each of `requireFacultyView`,
  `viewFacultyWorklist`, `loadFacultyWorklist` is now declared exactly once. JavaScript hoisting
  meant the last copy was the one that ran, so this was dead weight rather than a live bug - but it
  hid the fact that the second copy disagreed with the dispatch about which container to write to.
- **Validation** - `node --check`, `node workers/api/test.mjs` 73/73 (worker untouched this ship),
  and a structural sweep confirming the dispatch branch, both decide forms, and the nav link are each
  present exactly once.

Scope note, stated plainly: this is the **faculty** slice of the Phase 4 "Dashboards (learner /
curriculum / faculty / institution)" line, not the whole of it. The learner, curriculum and
institution dashboards are still open, so that roadmap checkbox stays unticked. The founder-locked
items are unchanged and not claimed here: Stripe Connect onboarding, Workers Paid + Cloudflare Email
billing, `FACULTY_MODEL_KEY`, Mission-006 ratification, and the human mastery run + 10-learner
quality gate.

## v0.42 — 2026-09-25 — Founder handover + founder password sign-in

Two things, both requested directly: the super-admin account moved, and a password was added as a
second way to sign in as the founder.

**Role handover** — `stickyptyltd@gmail.com` promoted to `founder`; `lecheyne24@gmail.com` demoted
to `reviewer` (one atomic `UPDATE ... CASE` over D1, so it is idempotent and can't half-apply).
Verified live across six expectations: the new founder passes `/api/admin/overview` and the
founder-only `/api/faculty/log`; the demoted account is refused both with 403 but still gets 200 on
`/api/faculty/reviews`, so the step-down cost decide rights and nothing else. This mirrors the
`reviewer` step-down the role endpoint already models, and it was done in the database rather than
through `POST /api/admin/role` because that endpoint needs an existing founder session and the point
of the exercise was to change who holds it.

**Password sign-in** — the app was passwordless by design (magic link only), so this is new surface,
not a config change. Migration `0009_founder_passwords.sql` adds `founder_passwords` and
`password_failures`.

- `POST /api/auth/login` — email + password to a session cookie, same cookie the magic link issues.
  Throttled twice: the existing per-IP KV bucket under its own `pwrl` prefix, **and** a per-account
  counter in D1 that locks the account for 15 minutes after 5 failures. The per-account half is the
  one that matters — a per-IP limit alone cannot stop a distributed guess at one known address, and
  that test asserts a different IP is refused too.
- `POST /api/auth/password` — founder-only set/change. Setting the *first* password needs only a
  founder session; **changing** an existing one requires the current password, so a stolen session
  cannot lock the founder out. A successful change drops every other session for the account.
- `GET /api/auth/password` — `{ passwordSet: boolean }`, drives the account card.

Deliberate properties: the founder types their password into the browser, so the plaintext never
passes through me, a shell, a migration, or this repo. Only the PBKDF2 output is stored, in a table
separate from `users` so a password can never be written against a learner row. Comparison is
constant-time, and every "no such account" / "no password set" path still runs a dummy hash so those
cases aren't distinguishable by response time.

**The work factor is a real compromise, and the constraint is the Workers Free plan.** PBKDF2 at the
OWASP-recommended 600,000 iterations *exceeds the 10ms CPU limit* — the Worker throws and every
password call 500s. That shipped broken on the first deploy and was caught only by exercising the
live endpoint; the unit tests all passed, because Node has no such limit. `PASSWORD_ITERATIONS`
(default `10000`, clamped to 10k–600k) makes the cost configurable instead of hardcoded, so moving to
Workers Paid is a one-line var change: the iteration count is stored per row and a successful login
re-hashes at the current setting when it differs, so existing credentials upgrade themselves with no
migration and no reset. Until that move, 10k is well under what a real password store would use, and
that is the honest cost of staying on the free tier.

Tests: 73 → 112, covering hash storage, session issuance, wrong password, unknown email, per-account
lockout, lockout not bypassable by changing IP, current-password required to change, session
invalidation, per-IP cap, and the clamp/auto-upgrade behaviour. A mock gap surfaced along the way —
`INSERT INTO sessions` was never handled, meaning magic-link verify had no test coverage at all.

Live: migration applied, Worker + Pages deployed, and a full set → login → wrong-password cycle
exercised against `aifaculty.org`. The throwaway credential used for that was deleted afterwards;
`founder_passwords` and `password_failures` are both empty, so the founder's first real password is
still theirs to set.

Founder-locked items unchanged and not claimed: Stripe Connect, Workers Paid + Cloudflare Email
billing, `FACULTY_MODEL_KEY`, Mission-006 ratification, human mastery + 10-learner gate.

## v0.43 — 2026-09-25 — Landing page taken out of pre-launch framing

Removing the countdown (v0.42's follow-up) left the landing page still describing a product that
hadn't launched, and — the part that actually mattered — with **no link to `/app` anywhere on the
page**. Every call to action either captured an email or went to checkout, so a visitor arriving at
`aifaculty.org` had no way into the product at all. The timer had been the least of it.

- **The product is now reachable**: a `Start learning free` hero CTA in the space the countdown left
  (paired with a `See pricing` ghost button), the nav's "Early access" link now points at `/app`,
  and the Free plan's "Start free" button goes to `/app` rather than to the waitlist. Three paths in.
- **Launch-date framing removed**: the `Dec 1, 2026` claim is gone from the meta description, the
  hero and the footer; the `<title>` is no longer "Early Access".
- **The signup card was the awkward one.** Its whole pitch was "first subscribers keep free access
  *when AI Faculty goes live*", which stops making sense the moment it does. Reframed as a plain
  mailing list — new pathways, launch updates, occasional discount — with the button reading "Keep
  me posted" instead of "Reserve my spot".

Left alone deliberately: the Founding Member copy still says "Original price while we build; ends at
launch." That is a commercial commitment, not stale chrome, and shortening or dropping the price
claim is the founder's call rather than a copy fix.

One thing this does **not** resolve: `build.sh` still labels `/app` "the working prototype" and
ships `X-Robots-Tag: noindex, nofollow` on `/app/*` plus a `robots.txt` disallow. The app is now
linked from the landing page, which is what noindex was for — keeping the prototype out of search
results — but a public release and a deliberately unindexed prototype are two different intentions,
and only the founder can say which one this is now.

## v0.44 — 2026-09-25 — /app un-hidden from search (release)

`/app/*` carried `X-Robots-Tag: noindex, nofollow` and a `robots.txt` disallow, and `build.sh`
still described it as "the working prototype". That was right while nothing linked to it and the
intent was to keep it out of search results — but the founder has moved the landing page to a
public release, and the landing page now links into `/app` three times, so the two intents no longer
agree.

Both are removed: the `X-Robots-Tag` header is off `/app/*`, and `robots.txt` no longer disallows
`/app`. Verified live — the header is absent and the file parses.

`robots.txt` is still emitted (`User-agent: * / Allow: /`). Removing the file outright was a brief
mistake worth recording: with no `robots.txt` in the publish directory, Pages falls back to serving
`index.html` for `/robots.txt`, so the URL returned the landing page's HTML with a 200 — not a valid
robots file. Keeping a real file that permits everything is the correct end state.

## v0.45 — 2026-09-25 — Fix: the "Record decision" button was never wired

Reported as "I assessed it and nothing changed, it just stayed on the same page". The dispute's
`decision` was still `null` server-side afterwards, so the click never reached the API.

**Cause.** `loadFacultyWorklist()` is async: `wire()` runs during `router()` and attaches submit
handlers to whatever is in `app` at that moment, but the worklist cards don't exist yet — they are
injected later by the `GET /api/faculty/reviews` fetch resolving. The loader set `box.innerHTML` and
returned without attaching handlers, so the injected `<form data-form="faculty-decide">` had no
submit listener at all. Clicking "Record decision" fell through to a native form GET, which
re-rendered the same page and looked like a no-op. Fixed by wiring the injected forms after the
`innerHTML` assignment, the same pattern `loadPasswordStatus` and `renderResult` already used.

This shipped in v0.41 and the 112-test suite did not catch it, because the suite is server-side only
and has no DOM. A whole class of this bug is invisible to it: any code path that injects a
`form[data-form]` *after* `wire()` has run. Audited every function that injects such a form —
`loadFacultyWorklist` was the only genuinely async injector lacking wiring. The synchronous
`view*` route functions look identical in a grep but are not affected, because `router()` sets
`app.innerHTML` and then immediately calls `wire()` over the result. Worth remembering before
adding another async loader.

Also removed a stray `**` and a duplicated verdict from the pending-card body copy.

**Not fixed here:** whether the learner-side Evidence view renders the decision correctly is still
unverified end to end, because the decision has never actually been recorded through the UI.

## v0.46 — 2026-09-25 — ARP loop verified end to end in a real browser (first time)

The reviewer loop had never actually been exercised through the UI. Every prior check was a `curl`
against the API, which cannot see whether a button is wired to anything — the exact failure mode v0.45
was. Chrome + chromedriver + selenium are available in this environment, so the loop has now been
driven the way a person drives it.

What was run, and what came back:

1. **Founder signs in with the password** at `#/login` (opening the collapsed "Sign in with a
   password instead" details first) — landed on `#/account` as `stickyptyltd@gmail.com / founder`.
2. **`#/faculty`** loaded the open dispute, `CP1 · dry-run`, verdict `revise`, learner
   `smoke-arp-v041@example.com`, callId `0050cd30-…`.
3. **Clicked "Record decision"** — chose `override`, added a note, submitted. Before v0.45 this was
   a no-op that looked like a page reload. It now posts and the worklist refreshes.
4. **Server confirmed** `decision=override`, note intact, `reviewer_email=stickyptyltd@gmail.com`.
5. **Learner signed in by magic link** and opened `#/evidence`, which rendered:

       SPECIALIST RESOLUTION · CP1
       override · 9/25/2026, 8:37:37 PM
       Specialist overrode the second assessment — your point was real and is recorded.
       Note: Browser-verified end to end.

That closes the Assessment Resolution Protocol end to end for the first time: disputed assessment →
learner escalation → reviewer decision → reasoned resolution back to the learner. Console was clean
apart from Cloudflare's analytics beacon being correctly blocked by CSP and the expected 401 before
sign-in.

**The lesson worth keeping:** the 112-test suite is server-side only and had no way to catch v0.45,
and `curl` had no way to catch it either. Both said everything was fine while the feature was
completely non-functional. Anything with a submit button in this app needs a browser to verify it.
That is now possible here, and should be done before calling a client-side change done.

Smoke-test data removed afterwards (user `smoke-arp-v041@example.com` and its call/review/session
rows), so the first real learner's dispute will be the first thing on the review list. The review
list is now empty and `faculty_calls` is back to 0.

## v0.47 — 2026-09-25 — Password is now the primary sign-in; rate limits say how long to wait

Password was buried inside a collapsed "Sign in with a password instead" disclosure, under copy
that said "No password to remember or leak" — both wrong now that passwords exist and are the
normal way in. The login page leads with email + password, and the magic link moved into an
"Email me a sign-in link instead" disclosure, so it stays one click away for anyone who needs it
and nobody trips over it.

**A second thing fell out of testing this.** With password as the main path, the rate limiter stops
being an edge case, and the message it produced was wrong. Both caps return the same bare
`rate_limited`, and the client hardcoded "this account is locked for 15 minutes" for all of them —
so being throttled for the 8-per-hour per-IP cap told you to wait for a 15-minute account lockout
that did not exist. Meanwhile the server sent no `Retry-After` at all.

- `rateLimited()` now returns seconds-to-wait (0 when clear) instead of a boolean. Every existing
  `if (await rateLimited(...))` guard keeps working untouched, because `0` is falsy — the change is
  purely additive at the call sites that want the number.
- 429s carry `Retry-After` plus a `reason` of `ip_rate` or `account_locked` and a `retryAfter` in
  the body, computed from the real bucket reset or `locked_until` rather than a guess.
- The client formats the actual wait: "Too many sign-in attempts from this connection. Try again in
  17 minutes." versus "This account is locked for 15 minutes."

Verified in a browser against the live site while the per-IP cap was genuinely exhausted (this
machine had spent its 8/hour through testing — the 429 was real, not simulated): the page returned
`retry-after: 1019` and rendered "Try again in 17 minutes", matching to the minute.

Tests 112 → 116, covering the reason codes, the seconds-remaining bounds, and the `Retry-After`
header on both the lockout and per-IP paths.

**Closed after the window rolled over.** Once the cap cleared, the full sign-in was re-run in Chrome
against the live site: password fields present and visible with no clicking, correct password lands
on `#/account` as `stickyptyltd@gmail.com / founder`, `#/faculty` and `#/account` both load
afterwards, and the console is clean — zero SEVERE entries. The primary sign-in path is now verified
end to end in a real browser rather than by inference.

## v0.48 — 2026-09-25 — The sign-in takeover hole is closed

Production sign-in was handing out a working session for **any email address typed by anyone**,
including the founder's. `handleRequestLink` accepted the address, minted a magic-link token and
returned it in the response body — and `handleVerify` creates the user row if it doesn't exist, so
this was not merely reading as someone, it was a complete takeover of the `/api/admin/*` surface.
Anyone who could reach `aifaculty.org` could become the founder.

It survived 116 passing tests because **there was no test for it at all**. `test.mjs` set
`DEV_LINKS: "true"` in the fake environment and nothing ever asserted what that flag did. Two
independent checks had missed it: the API test suite, and every `curl` probe, because both of them
were exercising the endpoint the way a legitimate founder would.

The fix gates dev links on a credential rather than on configuration. The original two conditions
(`RESEND_API_KEY` empty **and** `DEV_LINKS="true"`) were both just switches in a public config
file; adding a third — *the caller must already hold a founder session* — makes the condition
something an attacker cannot satisfy. The founder signs in by password (v0.47), so their own
credential is what authorises minting a link. Learners and reviewers, signed in or not, get 503.

Two supporting changes:

- Delivery mode is now decided **before** a token is minted, so a refused request no longer leaves
  a live-but-undeliverable row in `magic_links`. Confirmed: zero rows for the founder's address
  after the refused attack.
- The client had no message for `signin_unavailable` and showed "Something went wrong — try again".
  It now says "Signing in by email link isn't switched on yet. Use your password above." The
  rate-limit path here was also still on the old vague copy and now uses the same real-wait
  formatter as password sign-in.

The email path is deliberately **not** founder-gated. Learners can't hold a founder session, so
gating it would permanently break self-serve sign-in the moment a real sender is configured. There
is a test pinning that: with `RESEND_API_KEY` set, an anonymous visitor is emailed normally.

Verified against production, not just in tests:

- anonymous `POST /api/auth/request-link {"email":"stickyptyltd@gmail.com"}` → **503**, no token in
  the body, no row written to `magic_links`
- same request carrying a founder session → `dev_link` issued (the dev workflow still works)
- same request carrying a learner or reviewer session → 503
- browser: anonymous visitor reads "Signing in by email link isn't switched on yet. Use your
  password above."

Tests 116 → 124.

**What this costs us until the email sender is live:** nobody but the founder can sign in by link.
There are no real learner accounts yet, so this costs nothing today — but it is the reason task #2
(now a two-minute config change, with the code already written) should not sit much longer.

## Open threads
- **Cloudflare Email Service for real magic-link email** — founder chose this over Resend
  (2026-09-12). Needs the account upgraded to Workers Paid ($5/mo) first — I can't do that part,
  it's a billing/payment-method action. Once upgraded: onboard `aifaculty.org` to Email Service,
  add the `send_email` binding to `workers/api/wrangler.toml`, update `handleRequestLink` to
  send for real instead of dev-mode, deploy, verify a real email arrives.
- **Monetization readiness** (v0.35 built the plumbing; founder must do the account-side): create
  the Stripe account + products/prices, `wrangler secret put` the two keys, fill the three price IDs,
  apply migration `0005_billing.sql`, deploy, enable the **PayPal** wallet in the Stripe Dashboard,
  and decide Public-Sector-style next steps (industry
  academies, teams licensing, verified certificates — see `docs/11-monetization.md` §2).
- **Phases 2–5** of the platform roadmap (learning plans, qualifications, leaderboard — monetization
  now started) — remainder approved, not yet built. See `/home/dayle/.claude/plans/smooth-scribbling-heron.md`.
- **More domains** — professional-services variants, public sector, sales-engineering, product
  management, design/UX, journalism, and industry-specific academies. Now automatable via
  `docs/expansion-prompt.md`.
- **Short video clips** — real filmed/animated clips per lesson are a future production asset.
- **Regulated-domain pathways** (Legal/Finance/HR/Healthcare) — decide experimental-academy
  status vs R2+ verification of regulatory specifics before non-founder learners (see v0.17).

- Mission 006 answers are drafts — founder to review and ratify → promotes `05` to a firmer version.
- Faculty role full specs (mission/scope/boundaries/…) still to be written.
- Authored content for C2–C7 still to be written.
- Control Plane v1 ships the dry-run adapter live; the real model lives behind `FACULTY_MODEL_KEY`
  (founder sets `wrangler secret put` + `FACULTY_ADAPTER`/base URL/name in `wrangler.toml`).
