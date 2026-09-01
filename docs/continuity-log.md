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

## Open threads
- **Author the 5 outlined pathways** — the "Using AI at work" set (Ops, Support, Research,
  Education) + ML Practitioner.
- **Short video clips** — real filmed/animated clips per lesson are a future production asset.
- **Diagnostic → pathway recommendation** from answer B.
- **Enforce pathway prerequisites** for real (non-founder) learners — currently advisory only.

- Mission 006 answers are drafts — founder to review and ratify → promotes `05` to a firmer version.
- Faculty role full specs (mission/scope/boundaries/…) still to be written.
- Authored content for C2–C7 still to be written.
- LLM/Control-Plane integration for live faculty responses not yet built.
