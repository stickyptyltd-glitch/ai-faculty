# AI Faculty — Project Brief

**Source:** shared ChatGPT thread "Rebuild AI Education Platform"
(https://chatgpt.com/share/6a89e5db-c4bc-8324-afc1-74c01b198acd), absorbed 2026-09-01.
**Founder:** referred to as "Dianne" in the thread.
**Status:** design-stage only. No code yet. Building on an iPhone → mobile-first, documentation-led.
This repo is deliberately separate from the MindMend project.

---

## 1. Vision

An ever-expanding, industry-specific **AI education institution** structured like a university
**"AI Faculty"** — many specialised AI teaching roles rather than one generic tutor — with **human
oversight that begins with just the founder** and a deliberate architecture for expertise,
responsibility and eventually institutional authority to **grow beyond the founder**.

- Scales `1 founder → 1 learner → 10 → 100 → 1,000 → 100,000+` without diluting educational quality.
- Curriculum scales `1 subject → dozens of AI disciplines → industry academies → fields that don't exist yet`.
- Learning should be unusually **efficient, high-quality, engaging, enjoyable, measurable and
  visually navigable**. Aim to be a benchmark for AI education.
- Design the **educational operating system first**; courses, faculty, UX, dashboards and the
  underlying technology fit into that system afterwards.

## 2. Constitution / core principles

1. **Learner first** — optimise for capability gained, not time spent / content consumed / messages / badges.
2. **Human authority** — AI may teach, coach, analyse, generate, recommend; humans retain responsibility
   for institutional direction, quality standards, consequential decisions, safety, unresolved disputes,
   and changes to the constitution.
3. **Truth before fluency** — prefer qualified uncertainty or a request for verification over a confident
   unsupported answer; important claims need evidence and currency.
4. **Mastery before progression** — completion ≠ mastery.
5. **Enjoyment is part of quality.**
6. **AI literacy, including limitations.**
7. **Continuous evolution** — curriculum/faculty/platform improve as AI itself changes.
8. **Accessibility & respect.**
9. **Non-negotiable quality gate.**

**Operating rule:** *"Growth can be extremely fast. Untested assumptions cannot."* Every phase has a
quality gate. Cycle = **Plan → Build → Test → Measure → Improve → Document → Scale → Repeat.**
**Never overwrite — version forward.** Maintain a Continuity Log.

## 3. Master Control Architecture — 7 control layers (v0.2)

| Layer | Controls |
|---|---|
| 1. Mission | Purpose, principles, quality bar, non-negotiables, long-term direction |
| 2. Governance | Human authority, safety, escalation, ethics, privacy, accountability |
| 3. Faculty | AI teaching, coaching, assessment, research, industry, support roles |
| 4. Learning | Competencies, pathways, pedagogy, practice, mastery, credentials |
| 5. Knowledge | Research, evidence, updates, provenance, versioning, retirement |
| 6. Platform | Learner experience, data, automation, analytics, integrations, infra |
| 7. Growth | Learners, cohorts, industries, partners, economics, community, global expansion |

Every sector tracked through: `Unstarted → Designing → Building → Testing → Proven → Improving → Blocked → Retired`.

## 4. AI Faculty roles

Dean/Founder · Learning Architect · Diagnostic Faculty · Teaching Faculty · Socratic Coach ·
Practice Coach · Assessment Faculty · Research Faculty · Student Success Faculty · Quality & Safety Faculty.

Each role specified with: mission, scope, boundaries, inputs, methods, outputs, handoffs, escalation,
evaluation, version, retirement. Quality & Safety Faculty has override authority.

Flow: `Learner → Diagnostic → Learning Architect → Subject Faculty → Practice Coach → Assessment Faculty → Progress Engine → Next Pathway`.

## 5. First capability outcome

**AI-Assisted Workflow Designer** — a learner who can reliably design, test, verify and improve
AI-assisted workflows for real personal or professional tasks.

- Context tracks: **Personal / Professional / Mixed** (route via diagnostic; evidence never deleted on switch).
- Seven competencies:
  - **C1** Goal Definition — define the real outcome a workflow needs to achieve
  - **C2** Workflow Structuring — break the outcome into logical steps
  - **C3** AI Role Design — decide where/how AI should be used
  - **C4** Verification Design — identify what must be checked and how
  - **C5** Workflow Testing — test against realistic cases
  - **C6** Workflow Improvement — use evidence to improve performance
  - **C7** Responsible Application — recognise limitations, risks, appropriate human oversight
- Competency levels: `0 Unfamiliar → 1 Understand → 2 Guided → 3 Independent → 4 Transfer → 5 Design`.

First learning pathway (10 stages): Diagnose → Mental models → Working with AI → Verification →
Workflow design → Iteration → Application → Demonstration → Reflection → Advance.

Mastery rubric dimensions: Clarity, Structure, Verification, Reasoning, Evidence, Transfer, Safety.

## 6. Phase 2 — the Learning Engine

Loop: `Learner → Diagnose → Capability Map → Pathway → Teach → Practice → Feedback → Application →
Assessment → Evidence → Mastery → Next Capability → Repeat`, with an outer
`Learner → Learning Engine → Evidence → Mastery → Improvement →` (back to engine) loop —
the engine also **learns from learner evidence**.

Engines: Competency · Learner Intelligence · Pathway · Teaching · Practice · Assessment · Mastery ·
Progress · Faculty · Research.

- **Learner Intelligence Model** — a *living capability model*, not a static profile. 7 layers:
  1 Intent (distinguish "what they say they want" vs "what behaviour suggests they need"; learner keeps
  authority over goals), 2 Capability State (`Unknown→Emerging→Guided→Independent→Transferable→Advanced`,
  requires evidence — cannot infer mastery from chat history), 3 Evidence (direct / artefact / assessment /
  transfer / reflection, each with an evidence-confidence rating), 4 Learning State (Ready / Learning /
  Practising / Struggling / …), plus further layers. "Unknown ≠ weak" — just insufficient evidence.
- **Pathway Engine** — output is the *next best learning action* (learn / practise / revisit / test /
  apply / demonstrate / transfer / skip / branch / escalate), not necessarily "the next lesson".
  The pathway is allowed to change: accelerate on evidence of existing capability, branch back on gaps,
  raise challenge on unexpected strength.
- **Teaching Engine** — 9-step ladder: Activate → Explain → Demonstrate → Deconstruct → Guide →
  Challenge → Transfer → Reflect → Evidence. Choose the *minimum effective intervention*.
- **Practice Engine** — practice = a deliberately designed opportunity to strengthen a specific
  capability through performance + feedback. Difficulty ladder:
  `Recognise → Explain → Reproduce → Adapt → Create → Transfer → Optimise`.

## 7. Technology direction

Reject a single monolithic **"AI Core"** brain. Use an **Institutional AI Control Plane**:
model routing & adapters (swap LLMs without changing tools), policy engine (safety/oversight/
governance), identity & access control (RBAC, least privilege), logging + lineage + audit for every
AI interaction (`who → generated → what → when → using which model/version`). Hub-and-spoke:
the control plane coordinates specialised services without becoming the whole institution.

Data zones: learner profiles (PII) in a restricted data zone, separate from capability data.
Cloud-native, modular, governed. Governance is architectural, not decorative (aligns with NIST AI
RMF Govern/Map/Measure/Manage as continuous lifecycle functions).

## 8. Institutional growth model (from the founder pilot)

- **Human oversight scales by workload → speciality**, not permanently centralised on the founder.
  Escalation ladder: `AI Faculty → automated check → (low risk = continue | uncertain = human review)
  → general / specialist / senior authority → final decision`.
- **Faculty Growth Ladder:** Learner → Capable Learner → Mastered Learner → Peer Mentor → Peer Reviewer
  → Specialist Reviewer → Junior Faculty → Specialist Faculty → Senior Faculty → Research / Innovation Lead.
  Advancement = verified capability + reliability + judgement + behaviour + demonstrated performance
  (**not time served**). Higher responsibility ⇒ higher accountability, monitoring, audit.
  **Authority follows demonstrated expertise + institutional role, not organisational seniority.**
- **Formative peer assessment** (low risk) is distinguished from **official mastery decisions**
  (require authorised Faculty oversight, at least initially). Teaching someone else = evidence of the
  mentor's own mastery.
- **Faculty Deliberation Engine — Evidence-Based Assessment Resolution Protocol v0.1:**
  1. Blind independent assessment (no score-anchoring)
  2. Divergence detection (score variance, rubric disagreement, conflicting reasoning, missing
     evidence, safety concerns, confidence differences)
  3. Reasoned review — assessors see *reasoning and evidence*, not "everyone else gave 90"; respond
     Agree / Disagree-because…
  4. Reassessment — changing a score is not failure; it can be evidence of good reasoning
  5. Specialist escalation if meaningful disagreement remains or the case exceeds assessors' authority
  6. Authorised Faculty makes the final mastery decision
  Rounds kept partially blind to avoid groupthink. **Disagreement is an investigation signal.**
  The assessment process doubles as a learning engine for the assessors.
- **Compensation framework (future):** learners may earn recognition/credits then a small percentage
  wage for approved specialist-assessment / faculty / research work as they become trusted
  (`Learn → Contribute → Earn → Lead → Research → Create`). **Hard rule: payment must never buy a
  passing grade;** compensation is for qualified work performed, assessment stays evidence-governed.
- **Multi-source research protocol:** no important institutional decision rests on one AI's opinion.
  Synthesise primary sources + academic literature + industry evidence + standards/governance +
  multiple AI systems + human experts + contradictory evidence → synthesis → confidence → decision.
  Five models echoing one unsupported claim ≠ five pieces of evidence. Epistemic hierarchy:
  Evidence → Interpretation → Model synthesis → Institutional conclusion.
- **Research Confidence Levels:** `R0` unverified claim · `R1` AI/model suggestion · `R2` multiple-source
  support · `R3` strong evidence / expert corroboration · `R4` institutionally validated ·
  `R5` repeatedly validated / research-grade. R5 = strongest current evidence, not eternal truth —
  the institution must be able to change its mind.
- **Talent & Leadership Engine:** the institution is also a talent-discovery engine — identify learners
  who can become tomorrow's AI researchers, engineers, educators and leaders (strengths: technical
  reasoning, research, teaching, assessment, systems thinking, creativity, leadership, safety judgement,
  scientific thinking, software engineering, communication) and route them to opportunities.
- Founder's evolving job: **"build the system that finds, develops, verifies and coordinates
  expertise"** — not to personally master every subject. Someone who enters as a beginner may one day
  teach the founder something new about AI — treated as a feature, not a threat.

## 9. Version history from the thread

`v0.1 Master Blueprint` → `v0.2 Master Control Architecture` → `v0.3 Phase 1 Core Pack`
(Constitution + Faculty Registry + first pathway) → Copilot **Phase 1 Continuity Package v1.0**
handoff (continuity log at v3.6, next v3.7) → **Phase 2** build (Competency Architecture v0.1,
Learner Intelligence Model v0.1, Pathway/Teaching/Practice Engines v0.1) → **Mission**-based founder
pilot (founder is the first learner; the build of the institution is itself the first learning lab).

Pilot missions completed: 001/001A AI-directed architecture generation + auditing an AI-generated
architecture · 002 human-oversight scalability · 003 distributed learner expertise · 004 assessment
disagreement resolution · 005 AI + human constitutional authority (in progress).

## 10. Open thread — where the ChatGPT conversation stopped

**Mission 006** asks the founder for a governing philosophy on five scenarios, to be turned into the
**AI Faculty Governance & Decision Rights Model v0.1**:

- **A** A dramatically better new model appears — replace the current one immediately?
- **B** Research Faculty finds a fast-developing untaught AI field — add it to the curriculum immediately?
- **C** A learner shows extraordinary capability after 6 months — approve them as a junior specialist assessor?
- **D** AI Faculty says low risk, a human specialist says serious risk, evidence inconclusive — who wins?
- **E** Senior specialist Faculty tell the founder "we believe you're wrong about this technical decision" — what should the system do?

Then: run the first complete `learner → teaching → practice → assessment → evidence → mastery` loop.
