# AI Faculty — Roadmap

Cycle for every item: **Plan → Build → Test → Measure → Improve → Document → Scale → Repeat.**
A quality gate sits at the end of every phase.

---

## Phase 0 — Foundation  ·  ✅ done

Constitution, architecture, faculty registry, competency framework, governance model, research
protocol — all v0.1 drafts in `docs/`.

## Phase 1 — First working loop  ·  🟡 in progress

**Goal:** one learner can complete `diagnostic → learn → practise → evidence → mastery` for one
competency, in real software, and *see* their progress.

- [x] App shell (mobile-first, no build, offline)
- [x] Diagnostic intake (A–E) → route to Personal / Professional / Mixed
- [x] Learner Intelligence Model — capability state for C1–C7 + evidence log
- [x] Pathway Engine — computes the next best action
- [x] C1 (Goal Definition): teach → practice task → self/rubric evidence → mastery check
- [x] Progress view — 8 panels + progress states
- [x] Pedagogy review done → built its no-backend fixes (v0.36): guided attempt required,
      spaced "revisit" quick-checks in the Pathway Engine, "more"-verdict deep-links
- [ ] **Gate:** founder runs the full C1 loop end-to-end and it produces a real evidence record

## Phase 2 — Complete the first pathway

- [x] Authored content + practice tasks for C2–C7 (foundation = C1–C7 + software pathway S1–S5,
      authored since v0.4–v0.7 and walked end-to-end in v0.23; checkbox kept stale — corrected here)
- [x] Assessment Resolution Protocol implemented (multi-assessor, blind, reasoned review)
      — v0.38: independent second assessment with the stricter bar; visible **disagreement** state,
      reasoned review (what assessor 2 specifically wanted), revise-is-normal framing, escalation to a
      specialist recorded as a pending review on the Evidence view; every attempt is tracked
      (`checkpointAttempts`) and rubric bands are now persisted on evidence records (docs/08 §7).
      Honest limit: the second opinion is the same local rubric at a stricter bar; a genuinely
      independent human/AI pool is the Control-Plane thread (docs/08 §5, docs/05 §5).
- [x] Mastery rubric scoring UI — v0.38: banded verdict + per-dimension tally on every checkpoint
      result; best-recorded band per mastery dimension with coverage count on each pathway overview.
- [x] Pathway branching (accelerate / branch back / raise challenge) — v0.38: the engine now
      **branches back** to the weakest covered capability (with the specific rubric dims wanted) after
      an unmet checkpoint instead of cold re-running it. Deliberate deferral, documented in
      docs/04-learning-engine.md: no blind "accelerate/skip" of graded challenges (assessment
      integrity — the checkpoint *is* the raised challenge); acceleration through prior evidence
      stays a governance decision for when real independent assessors exist.
- [x] Export an evidence portfolio (v0.37: Markdown + JSON download from the Evidence view)
- [ ] **Gate:** one learner reaches mastery of "AI-Assisted Workflow Designer" with an evidence trail

## Phase 3 — Faculty intelligence

- [ ] Institutional AI Control Plane: model adapter + policy engine + logging/lineage
- [ ] Live faculty responses via a model, replacing authored stubs
- [ ] Calibration + faculty evaluation
- [ ] **Gate:** live faculty measurably at least as good as authored content, with full audit trail

## Phase 4 — Scale-ready

- [x] Multi-learner data model + accounts
- [x] Monetization foundation (see docs/11-monetization.md): Free/Pro/Founding plans, Stripe
      Checkout + webhooks, payments ledger, plan gate, admin revenue view — built v0.35; live once
      the founder connects the Stripe account
- [ ] Second capability added to the graph
- [ ] Learner-faculty (mentor / reviewer) scoped roles
- [ ] Dashboards (learner / curriculum / faculty / institution)
- [ ] **Gate:** 10 learners, quality metrics hold

## Later

Compensation framework activation · industry academies · research track · human governance body.
