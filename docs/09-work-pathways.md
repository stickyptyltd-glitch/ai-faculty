# AI Faculty — Work Pathways

**Version:** v0.1
**Purpose:** after the shared foundation, take each learner into **their actual job** — the real
tasks, constraints, risks and examples of their profession — instead of staying generic.

---

## 1. The shape

```
                 FOUNDATION MODULE
          AI-Assisted Workflow Designer (C1–C7 + capstone)
                 everyone does this (or tests out)
                          │
        ┌─────────────┬───┴────┬─────────────┬───────────── …
        ▼             ▼        ▼             ▼
   Software &    Content &   Operations   Customer     Research &   Education &
   Product      Marketing   & Admin       Support      Analysis     Training
        │             │        │             │             │            │
   each = 4–6 profession-specific capabilities, taught with the same
   lesson → challenge → checkpoint engine, ending in a WORK CAPSTONE:
   a real AI workflow built, verified, tested and responsibly shipped
   for an actual task in that job.
```

- The **foundation** is the transferable core (define a goal, structure a workflow, design
  verification, test, improve, apply responsibly). It doesn't change per profession.
- A **Work Pathway** specialises that core: same skills, but on *specs and code review* for a
  developer, on *briefs and brand voice* for a marketer, on *triage and escalation* for support.
- Pathways sit in the **AI Capability Graph** (see [03-competency-framework.md](03-competency-framework.md)).
  They share the foundation as a prerequisite and can share intermediate capabilities
  (e.g. "control AI tone and voice" feeds both Marketing and Support).

## 2. How a learner gets one

- The diagnostic already asks about professional goals (question B). On finishing the foundation,
  the system **recommends** a pathway from that answer — the learner **chooses**.
- A learner can take **more than one** pathway. Evidence and Applied Projects carry across.
- Someone who already works this way can attempt the **pathway capstone directly** to test out of it.

## 3. Anatomy of a pathway

| Part | What it is |
|---|---|
| **Tagline + who it's for** | One line, and the roles it fits (so people self-select) |
| **4–6 capabilities** | Each: a 5-step lesson (story → idea → worked example → the moves → guided) + 2–3 practical challenges on the learner's own work + a quick-check |
| **Rubric emphasis** | Which mastery dimensions weigh most here (Software leans on Verification + Safety; Marketing on Reasoning + Responsible use) |
| **Work Capstone** | Build, verify, test and responsibly ship one real AI workflow for a genuine task in that job |
| **Applied Project link** | The capstone should be a real project the learner registers and can keep using |

## 4. Initial catalogue

Each is an **academy** that starts small and grows (more capabilities, role-specific sub-tracks,
industry variants).

| Pathway | For | Signature capabilities |
|---|---|---|
| **Software & Product Development** | engineers, PMs, technical founders, designers-who-build | vague ask → testable spec · driving AI to write code you can trust · reviewing AI-generated code · generating & trusting tests · shipping responsibly |
| **Content, Marketing & Comms** | writers, marketers, founders doing their own marketing | brief → controlled draft · brand voice & consistency at scale · claim & fact checking · repurposing one asset into many · disclosure & compliance |
| **Operations & Admin** | ops, EAs, office managers, small-business owners | mapping a process before automating it · document & data workflows · inbox / scheduling with guardrails · turning an SOP into a checked workflow · audit trails |
| **Customer Support** | support agents, success, founders doing support | triage & routing · drafted replies with tone control · grounding answers in the knowledge base · escalation rules · handling angry and edge cases |
| **Research & Analysis** | analysts, researchers, journalists, students | framing the question · multi-source synthesis · source verification (R0–R5) · faithful summarisation · never shipping a fabricated citation |
| **Education & Training** | teachers, trainers, L&D, course creators | designing a learning outcome · material generation with accuracy checks · feedback & assessment support · adapting to the learner · academic-integrity boundaries |

## 5. How a pathway is built and approved

- Content-only: it reuses the foundation's teaching/challenge/assessment engine. Building a pathway
  is authoring profession-specific `lesson` + `challenges` + a capstone, plus the rubric emphasis.
- Enters via the **curriculum decision class** (see [05-governance-decision-rights.md](05-governance-decision-rights.md)):
  Learning Architect + Research Faculty propose; founder approves entry to *core*; a new pathway can
  run as an **experimental academy** at lower research confidence while it's proven with real learners.
- Real-world examples in a pathway are **verified** (Research Faculty, R2+) — they must reflect how
  the job is actually done, not a caricature of it.

## 6. Prototype status

| Now (app) | Next |
|---|---|
| Foundation module fully playable | — |
| Pathway catalogue + selection | Recommendation from diagnostic answer B |
| **Software & Product Development** built (S1–S4 + capstone) | Fill S5; build Content and Operations |
| Other 5 pathways listed as "planned" | Author them; add role sub-tracks |
| Founder can skip the foundation to work on pathways | Test-out-by-capstone for real learners |
