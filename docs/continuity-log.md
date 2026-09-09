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

## Open threads
- **Author the 4 outlined pathways** — the "Using AI at work" set (Ops, Support, Education) +
  ML Practitioner.
- **Short video clips** — real filmed/animated clips per lesson are a future production asset.
- **Diagnostic → pathway recommendation** from answer B.
- **Enforce pathway prerequisites** for real (non-founder) learners — currently advisory only.

- Mission 006 answers are drafts — founder to review and ratify → promotes `05` to a firmer version.
- Faculty role full specs (mission/scope/boundaries/…) still to be written.
- Authored content for C2–C7 still to be written.
- LLM/Control-Plane integration for live faculty responses not yet built.
