# AI Faculty — Master Architecture

**Version:** v0.2 (Master Control Architecture)
**Status:** working draft

---

## 1. What we are building

An **educational operating system**, not an online course platform. Courses, AI faculty, learner
experience, dashboards and the underlying technology all fit *inside* this system and are built
after it.

## 2. The seven control layers

| Layer | Controls |
|---|---|
| 1. Mission | Purpose, principles, quality bar, non-negotiables, long-term direction |
| 2. Governance | Human authority, safety, escalation, ethics, privacy, accountability |
| 3. Faculty | AI teaching, coaching, assessment, research, industry, support roles |
| 4. Learning | Competencies, pathways, pedagogy, practice, mastery, credentials |
| 5. Knowledge | Research, evidence, updates, provenance, versioning, retirement |
| 6. Platform | Learner experience, data, automation, analytics, integrations, infra |
| 7. Growth | Learners, cohorts, industries, partners, economics, community, expansion |

Every sector moves through: `Unstarted → Designing → Building → Testing → Proven → Improving → Blocked → Retired`.

## 3. The Institutional AI Control Plane

We explicitly **reject a single monolithic "AI Core" brain**. Instead, a thin **control plane**
coordinates specialised services (hub-and-spoke) without becoming the whole institution.

The control plane owns:

- **Model routing & adapters** — swap or add LLMs without changing tools or curriculum. Prior
  models stay pinned and callable for reproducing past assessments.
- **Policy engine** — safety, oversight and governance rules applied consistently across every
  educational function.
- **Identity & access control** — role-based, least privilege.
- **Logging, lineage & audit** — every AI interaction records `who → generated → what → when →
  using which model/version`.

Specialised services (behind the control plane): Learner Profile Service, Competency/Curriculum
Engine, and the Phase 2 Learning Engine components (see
[04-learning-engine.md](04-learning-engine.md)).

## 4. Data zones

- **Restricted zone** — learner profiles and PII (goals, evidence artefacts, safety flags,
  escalation history).
- **Capability zone** — capability frameworks, rubrics, mastery thresholds, anonymised evidence.

Kept separate by design.

## 5. Evidence lineage

Every capability claim links to evidence; every piece of evidence records how it was produced
(learner, task, model/version, assessor, date, confidence). This is a first-class concern, not an
add-on — it is what lets the institution scale without losing trust.

## 6. Scaling posture

`1 founder → 1 learner → 10 → 100 → 1,000 → 100,000+` and
`1 subject → dozens of AI disciplines → industry academies → new fields`,
with a quality gate at every step. Interfaces and data contracts are designed for scale now;
infrastructure is built only when demand and evidence justify it (**scaling-ready ≠ scaling-built**).
