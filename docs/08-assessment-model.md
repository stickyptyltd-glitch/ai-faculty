# AI Faculty — Practical Assessment & Applications Model

**Version:** v0.1
**Principle:** assess what the learner can *do*, on *real work*, against a *rubric*, with *evidence* —
never a quiz score. Every course runs practical challenges throughout, not just at the end.

---

## 1. The three things a learner produces

| Artefact | What it is | Evidence strength |
|---|---|---|
| **Challenge attempt** | A short practical task targeting one competency at one point on the difficulty ladder | Medium |
| **Checkpoint** | A combined practical assessment spanning several competencies, scored on the mastery rubric | High |
| **Applied Project** | A real task the learner actually runs in their own life/work, with the whole capability applied to it end to end | Highest (direct evidence) |

## 2. Challenges — throughout the course, not just at the end

Every competency carries **2–4 challenges** that climb the difficulty ladder:

`Recognise → Explain → Reproduce → Adapt → Create → Transfer → Optimise`

Challenge **types** (mix per competency):

- **Do-it (fields)** — perform the skill on a real task of the learner's, in structured fields.
- **Critique** — here is a flawed workflow / goal / verification; find every problem and fix it.
  Scored on how many of the known problems the learner identifies.
- **Scenario + justify** — choose the right call in a realistic situation and defend it. Tests
  judgement, not recall. A right answer with no reasoning is only a partial pass.
- **Transfer** — do it again in a materially different context.
- **Optimise** (later) — improve an already-working approach and show the before/after.

Each challenge:
- is **gated** (challenge _n_ opens when _n−1_ is done),
- produces an **evidence record**,
- **raises the capability state** (`emerging → guided → independent → transferable → advanced`),
- only records when the **rubric is met** — otherwise it returns specific, actionable feedback.

## 3. Rubric scoring — banded, not binary

Each rubric dimension is scored in four bands:

| Band | Meaning |
|---|---|
| **Not yet** | Absent, placeholder, or wrong |
| **Developing** | Present but too thin/vague to build or verify against |
| **Meets** | Concrete and usable — a real answer |
| **Exceeds** | Specific, well-reasoned, with names / numbers / dates / trade-offs made explicit |

Verdict:
- **Ready** — every dimension at Meets or above → records as evidence.
- **Revise** — majority at Developing or above → targeted feedback, resubmit.
- **More** — otherwise → back to the teaching.

Mastery-rubric dimensions (used at checkpoints): **Clarity · Structure · Verification · Reasoning ·
Evidence · Transfer · Safety.**

## 4. Checkpoints

| ID | Spans | Stage | Assessed on |
|---|---|---|---|
| **CP1** | C1–C3 | Workflow design | Clarity, Structure, Reasoning, Safety |
| **CP2** | C1–C7 | Demonstration | All seven mastery dimensions |

A checkpoint is the **only** way to move the covered competencies to `transferable` / `advanced`.
CP2 is the demonstration of the master capability.

## 5. Assessment Resolution Protocol (how a checkpoint is actually judged)

A single "ready" is a first opinion, not a mastery decision. For checkpoints:

1. **Assessor 1** scores the evidence blind against the rubric.
2. On "ready", the learner can request an **independent second assessment** — a stricter pass bar
   (every dimension must be *specific*, not merely present; no Developing bands).
3. **Agreement** → the checkpoint passes and records.
4. **Disagreement** → the learner sees *what the second assessor wanted* (reasoned review) and revises.
   Changing the submission after review is normal, not failure.
5. Unresolved or high-stakes cases escalate to a specialist / authorised Faculty holder.

This is a teaching device as much as a gate: the learner experiences why real assessment is
deliberative. In the multi-learner system this becomes the blind multi-assessor pool from
[05-governance-decision-rights.md](05-governance-decision-rights.md) §5.

## 6. Applied Projects — the "applications"

The learner registers **real projects** ("Plan my week", "Client proposal workflow", …). Each has a
context (personal / professional) and a goal.

- Challenges and checkpoints are done **against a chosen project**, so evidence accumulates into a
  **coherent portfolio per project** instead of scattered one-offs.
- A project is **Demonstrated** when it has confirmed evidence across the whole capability
  (C1–C7 or a passed CP2) — i.e. the learner has actually built, verified, tested and responsibly
  applied a real AI-assisted workflow that matters to them.
- Applied Projects are the strongest evidence the institution holds: the learner didn't answer a
  prompt, they changed how a real task gets done.

## 7. Evidence standards

Every evidence record links: learner · competency/checkpoint · project · submission · rubric bands ·
assessor verdict · faculty note · model/version · timestamp. Confidence is recorded (not all evidence
is equal). Nothing is deleted — superseded attempts are versioned.

## 8. What the prototype implements today vs. later

| Now (v0.2 app) | Later |
|---|---|
| Challenges (fields / critique / scenario), gated, per competency | Optimise-tier challenges; adaptive difficulty |
| Banded rubric scoring, transparent feedback | Model-scored rubric behind the Control Plane |
| CP1 + CP2 checkpoints | Full blind multi-assessor pool + specialist escalation |
| Second-assessment pass on checkpoints | Real independent assessors (human + AI) |
| Applied Projects: register, attach evidence, portfolio, "Demonstrated" | Project templates per industry; peer review of projects |
