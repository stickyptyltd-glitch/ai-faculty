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

## Open threads
- **Phases 2–5** of the platform roadmap (monetization, learning plans, qualifications,
  leaderboard) — plan approved, not yet built. See `/home/dayle/.claude/plans/smooth-scribbling-heron.md`.
- **More domains** — professional-services variants, public sector, sales-engineering, product
  management, design/UX, journalism, and industry-specific academies. Now automatable via
  `docs/expansion-prompt.md`.
- **Short video clips** — real filmed/animated clips per lesson are a future production asset.
- **Diagnostic → pathway recommendation** from answer B.
- **Enforce pathway prerequisites** for real (non-founder) learners — currently advisory only.
- **Regulated-domain pathways** (Legal/Finance/HR/Healthcare) — decide experimental-academy
  status vs R2+ verification of regulatory specifics before non-founder learners (see v0.17).

- Mission 006 answers are drafts — founder to review and ratify → promotes `05` to a firmer version.
- Faculty role full specs (mission/scope/boundaries/…) still to be written.
- Authored content for C2–C7 still to be written.
- LLM/Control-Plane integration for live faculty responses not yet built.
