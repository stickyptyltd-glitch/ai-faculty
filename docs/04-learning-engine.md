# AI Faculty — Learning Engine (Phase 2)

**Version:** v0.1
**Purpose:** the machinery that reliably turns a learner's starting point into demonstrated capability.

---

## The core loop

```
Learner → Diagnose → Capability Map → Pathway → Teach → Practice → Feedback
→ Application → Assessment → Evidence → Mastery → Next Capability → Repeat
```

Outer loop: `Learner → Learning Engine → Evidence → Mastery → Improvement →` (back into the engine).
The engine does not merely teach — **it learns from the learner's evidence.**

## Engines

### Competency Engine
Defines what a learner must be able to *do* (see [03-competency-framework.md](03-competency-framework.md)).

### Learner Intelligence Model
A **living capability model**, not a static profile. Layers:

1. **Intent** — desired outcomes, goals, context, motivation, constraints, time, pace. Distinguish
   *what the learner says they want* from *what their behaviour suggests they need*. The learner
   always retains authority over their goals.
2. **Capability State** — per competency: `Unknown → Emerging → Guided → Independent → Transferable
   → Advanced`. Mastery is **never inferred from conversation history** — it requires evidence.
   *Unknown ≠ weak* — it means "not yet enough evidence to claim."
3. **Evidence** — direct / artefact / assessment / transfer / reflection, each with an
   **evidence-confidence** rating.
4. **Learning State** — Ready / Learning / Practising / Struggling / Misunderstanding / …
5–7. Preferences, progression history, current mission.

### Pathway Engine
Output = the **next best learning action**, not necessarily the next lesson:
`learn · practise · revisit · test · apply · demonstrate · transfer · skip · branch · escalate to human review`.
The pathway is allowed to change — accelerate on evidence of existing capability, branch back on
gaps, raise challenge on unexpected strength, adapt on a Personal↔Professional switch without
deleting evidence.

**Deliberate deferral (v0.38):** blind "accelerate/skip" of graded challenges is not implemented.
Every challenge is assessed evidence under the rubric, and skipping it would sign a capability claim
without evidence — the checkpoint is the raised challenge. Acceleration through prior evidence stays
a governance decision ([05](05-governance-decision-rights.md)) for when real independent assessors
exist. What *is* live: **branch back** — when a checkpoint attempt is not met (either assessor), the
engine returns a `branch` action to the weakest covered capability (with the specific rubric
dimension names the attempt wanted), instead of cold re-suggesting a failed checkpoint. Attempts are
tracked in `learner.checkpointAttempts`; escalation of disputed checkpoints is a pending review on
the learner record (ARP, §5.5), surfaced on the Evidence view.

### Teaching Engine
Nine-step ladder — choose the **minimum effective intervention**:
Activate → Explain → Demonstrate → Deconstruct → Guide → Challenge → Transfer → Reflect → Evidence.

### Practice Engine
Practice = *a deliberately designed opportunity to strengthen a specific capability through
performance and feedback* (not repetition). Each task: target capability, difficulty, context,
constraints, expected behaviour, optional scaffolding, feedback mechanism, evidence produced,
progression condition.
Difficulty ladder: `Recognise → Explain → Reproduce → Adapt → Create → Transfer → Optimise`.

### Assessment & Mastery Engines
Run the Assessment Resolution Protocol (see
[05-governance-decision-rights.md](05-governance-decision-rights.md) §5 and the assessment protocol
section). Separate *activity* from *capability*.

### Progress Engine
Drives the visual learner view. Instead of "63% complete", it answers, at a glance:
**Where am I? Why am I here? What have I proved? What do I do next?**
Panels: Goal · Current level · Pathway · Next milestone · Active mission · Evidence · Mastery ·
Next branch. Progress states: Not started · Exploring · Practising · Demonstrated · Mastered · Revisiting.

### Faculty Engine
Reusable teaching/assessment patterns; evaluates faculty performance.

### Research Engine
`discover → verify → evaluate → teach → test → update → version → retire`. Feeds curriculum change.
See [07-research-protocol.md](07-research-protocol.md).
