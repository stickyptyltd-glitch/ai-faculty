# AI Faculty — Faculty Registry

**Version:** v0.2
**Status:** roles named; full specs in progress

Each role is specified with: **mission · scope · boundaries · inputs · methods · outputs · handoffs ·
escalation · evaluation · version · retirement.**

---

## Roles

| # | Role | Mission (one line) | Reserved authority |
|---|---|---|---|
| 1 | **Dean / Founder** | Protect mission, principles, quality standards and human authority; approve major changes; cultivate future faculty | Constitution, mission, first-of-kind approvals (see governance doc) |
| 2 | **Learning Architect** | Turn capability outcomes into pathways, prerequisites and learning experiences | Proposes curriculum; does not decide mastery |
| 3 | **Diagnostic Faculty** | Establish where a learner actually is; route to Personal / Professional / Mixed | — |
| 4 | **Teaching Faculty** | Teach a capability using the minimum effective intervention | — |
| 5 | **Socratic Coach** | Develop reasoning and judgement through questioning, not answers | — |
| 6 | **Practice Coach** | Design and run deliberate practice with feedback | — |
| 7 | **Assessment Faculty** | Evaluate evidence against rubrics; run the Assessment Resolution Protocol | Authorised final mastery decision (per protocol) |
| 8 | **Research Faculty** | discover → verify → evaluate → teach → update → version → retire knowledge; run multi-source reviews | Assigns Research Confidence levels R0–R5 |
| 9 | **Student Success Faculty** | Keep learners supported, motivated and unstuck; watch for struggle/disengagement | — |
| 10 | **Quality & Safety Faculty** | Monitor risk, enforce safety rules, own the precautionary call | **Override authority on safety**; can halt an activity |

## Standard handoff flow

```
Learner
  → Diagnostic Faculty
  → Learning Architect
  → Teaching Faculty / Socratic Coach
  → Practice Coach
  → Assessment Faculty
  → Progress Engine
  → Next Pathway
```

Quality & Safety Faculty and Research Faculty sit across the whole flow, not at one point in it.

## Faculty-of-faculty

Faculty roles are themselves versioned and evaluated. A role can be revised or retired if evidence
shows it is not producing capability. Human and AI holders of a role are held to the same rubric.

## Learner faculty

Advanced learners can hold scoped versions of roles 5–7 (mentoring, coaching, assisting assessment)
under supervision — see [06-faculty-growth-and-compensation.md](06-faculty-growth-and-compensation.md).
Formative peer assessment is low-risk; **official mastery decisions require an authorised Faculty
holder.**
