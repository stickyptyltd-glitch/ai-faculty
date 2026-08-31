# Mission 006 — Founder Response (draft for review)

**Prompt:** give a governing philosophy for five institutional scenarios. These become the first
draft of the **AI Faculty Governance & Decision Rights Model v0.1**
([../05-governance-decision-rights.md](../05-governance-decision-rights.md)).

**Status:** draft written on the founder's behalf — edit freely, this is your philosophy to set.

---

## A — A dramatically better new model appears. Replace the current one immediately?

**No automatic replacement. A model change is a governed architectural change, not an upgrade.**

The Control Plane's model-adapter design exists precisely so we *can* switch without a rebuild — but
switching is gated by evidence, never by a vendor's release schedule.

Process:
1. **Parallel evaluation** — run the new model in shadow against our own capability rubrics, safety
   behaviours, calibration ("does it know when it doesn't know?"), escalation behaviour, and
   regression on a fixed set of past learner tasks.
2. **Quality & Safety Faculty sign-off** — required before any learner-facing use.
3. **Staged rollout** — Research Faculty → assessors → teaching → learners, with rollback ready.
4. **Pin the prior model** — keep it callable so past assessments remain reproducible (evidence
   lineage).

Speed is allowed on *evaluation*. It is not allowed on *trust*.

## B — Research Faculty finds a fast-developing untaught AI field. Add it to the curriculum immediately?

**No immediate addition to the taught curriculum — but immediate action of a different kind.**

Research Faculty opens a tracked entry and takes it through `discover → verify → evaluate`. It enters
at low Research Confidence (R1–R2). It becomes *core curriculum* only when:
- it is stable enough that what we teach won't be obsolete in weeks,
- we can define a real capability outcome and rubric,
- it connects to the capability graph with sensible prerequisites,
- we have, or can build, faculty competence to teach and assess it.

Interim: offer it as a clearly-labelled **experimental elective / research track** for mastered
learners. The institution should be *aware* of everything quickly and *teach* things only when
teaching them is sound.

## C — An exceptional learner after 6 months. Approve them as a junior specialist assessor?

**Approve a scoped, supervised version — not the full role.**

Prior mastery qualifies someone to *assist* with assessment; it does not make them an authorised
final assessor. So:
- Yes to formative assessment, and to contributing scores in the blind multi-assessor pool, for
  subjects where they have demonstrated mastery **plus** reflection, judgement and appropriate
  behaviour.
- Their assessments are shadowed by an authorised assessor for a probation period.
- They **cannot** make the final mastery decision.
- Their calibration is tracked — do their scores hold up after reasoned review?

This captures the talent and the "teaching is evidence of mastery" benefit while capping the blast
radius of an error, and avoids creating seniority-by-exception. Being an assessor is accountability,
not status.

## D — AI says low risk, a human specialist says serious risk, evidence inconclusive. Who wins?

**The precautionary position wins while the evidence is inconclusive.**

The Constitution gives humans authority over safety, and "truth before fluency" means an AI's
low-risk claim is not treated as settled. Concretely:
- The activity is paused, or run only under mitigations/containment.
- **Quality & Safety Faculty owns the call** — not the AI, not general faculty.
- Research Faculty is tasked to resolve the uncertainty (multi-source) and move it off R0/R1.
- One credible specialist raising a *specified* serious-harm concern (what harm, to whom, by what
  mechanism) is enough to trigger this — but it must be specified, so it can be investigated rather
  than becoming an indefinite veto.
- If investigation shows low risk, resume.

Asymmetry: the cost of over-caution here is delay; the cost of under-caution is the harm the
Constitution exists to prevent.

## E — Senior specialist Faculty say the Founder is wrong on a technical decision.

**This is the case the whole architecture was built for. The system should not protect the Founder
from being wrong.**

1. Treat it as a **formal, logged dissent**, not insubordination — "authority follows demonstrated
   expertise and role, not seniority."
2. Route it through the standard evidence process: specialists state the claim, the reasoning and
   the evidence; Research Faculty runs an independent multi-source review.
3. The Founder must **engage with the evidence** and either be persuaded or give a reasoned,
   recorded response. "Because I'm the Founder" is not a valid response.
4. For a **technical** decision, if the evidence review supports the specialists and the Founder
   cannot rebut it on the merits, **the institution follows the evidence.** The Founder's job is to
   protect mission, principles, quality standards and human authority — not to be the final word on
   technical facts.
5. **Constitutional / mission changes and consequential-safety calls remain reserved** to the
   Founder (and, in future, a human governance body).
6. If the Founder repeatedly overrides evidence without reasoning, that pattern is itself visible to
   the governance layer.

The healthy outcome: the Founder is sometimes overruled on technical matters, and this is recorded
as the system working — not failing.
