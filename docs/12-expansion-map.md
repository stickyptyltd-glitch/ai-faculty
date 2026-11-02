# AI Faculty — Expansion Map: All of Computer Engineering, Then Everything

**Version:** v0.1 (proposal)
**Status:** proposal
**Amends:** extends [03-competency-framework.md](03-competency-framework.md), [09-work-pathways.md](09-work-pathways.md), [01-architecture.md](01-architecture.md), [roadmap.md](roadmap.md)

---

## 1. Vision

AI Faculty is an educational operating system, not an online course platform. Its core engine — diagnostic → capability → deliberate practice → evidence → mastery checkpoint → next pathway — is domain-agnostic. This document maps how the same engine expands from AI education into:

1. **All of computer engineering** — hardware and software, end to end.
2. **The most-signed-up education on the internet** — then every major subject area people actually pay to learn: cooking, therapy/counselling, sports/fitness, business/entrepreneurship, health & wellness, trades, creative arts, languages, finance, law, and more.

The governing principle from [00-constitution.md](00-constitution.md) §10 holds at every step: growth can be fast, but untested assumptions cannot. Every new subject passes through a quality gate before it scales.

---

## 2. Design rule for expansion

Every new subject is added as a **separate academy** inside the same system, sharing:

| Shared system | What it means per subject |
|---|---|
| Diagnostic | Routes the learner into Personal / Professional / Mixed for that subject |
| Competency graph | Subject-specific capabilities versioned C1…Cn, levels 0–5 |
| Learning engine | Activate → explain → demonstrate → deconstruct → quickcheck → guided lessons |
| Assessment | Challenge types (fields / critique / scenario) + capstone + multi-assessor review |
| Evidence lineage | Every capability claim links to produced evidence, model/version, assessor, date |
| Control plane | Model routing, policy engine, identity, audit — one instance for all subjects |
| Faculty registry | Subject-specific AI teaching/coaching/assessment roles under human oversight |
| Monetization | Free / Pro / Founding gates per subject or bundle |

**Non-negotiable:** adding a subject is content + rubric authoring only. It never touches auth, accounts, payments, scoring (`faculty.js`), or user-data code. One subject per expansion run. Each run is validated, deployed, logged in `docs/continuity-log.md`, and gated before the next subject starts.

---

## 3. Phase structure

```
Phase A — Computer engineering (software + hardware)
  A.1 Software engineering discipline tree
  A.2 Hardware engineering discipline tree
  A.3 Embedded / systems at the hardware-software boundary
  A.4 Quality gate: 10 learners complete one hardware + one software pathway

Phase B — The most-signed-up education on the internet
  B.1 Cooking & food
  B.2 Therapy, counselling & mental-health support
  B.3 Sports, fitness & athletic performance
  B.4 Business, entrepreneurship & management
  B.5 Health, wellness & nutrition
  B.6 Personal finance & investing
  B.7 Languages & communication
  B.8 Creative arts & design
  B.9 Skilled trades & DIY
  B.10 Music & performing arts
  B.11 Academic subjects (K–12 / exam prep / university)
  B.12 Care, teaching & early-years education
  B.13 Law, compliance & governance for non-lawyers
  B.14 Real estate & property
  B.15 Sales & customer success
  B.16 Sustainability, climate & green skills
  B.17 Gaming, esports & game development
  B.18 Writing, publishing & media
  B.19 Parenting, relationships & family life
  B.20 Spirituality, philosophy & life skills
  B.21+ Long tail: every subject with measurable demand

Phase C — Cross-subject capability graph
  Shared capabilities that transfer across domains (goal definition, verification,
  deliberate practice, evidence, responsible application, feedback loops)

Gate at every phase: the new subject produces real mastery evidence for real learners
before the next subject is authored.
```

---

## 4. Phase A — All of computer engineering

### 4.1 Rationale

Computer engineering is the natural first expansion because it shares the existing foundation's diagnostic, evidence, and control-plane infrastructure. It also splits cleanly into **software** (code, systems, AI, product) and **hardware** (circuits, PCB, silicon, embedded, robotics, IoT), giving the system its first genuinely non-AI subject tree and proving the engine works outside AI.

### 4.2 A.1 — Computer engineering: software

**Academy:** Software Engineering  
**For:** developers, engineers, technical founders, students moving into software  
**Prerequisite:** AI-Assisted Workflow Designer foundation (or test-out by capstone)

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Software foundations | Read/write code · debug · version control · testing · tooling | SWF-1…SWF-6 |
| Web engineering | HTML/CSS/JS · frontend frameworks · APIs · deployment | WEB-1…WEB-6 |
| Backend engineering | Databases · servers · auth · APIs · scaling | BE-1…BE-6 |
| Mobile engineering | iOS/Android · cross-platform · app store lifecycle | MOB-1…MOB-6 |
| DevOps & platform engineering | CI/CD · infra-as-code · containers · observability | DEVOPS-1…DEVOPS-6 |
| Data engineering | Pipelines · warehouses · ETL · data quality | DE-1…DE-6 |
| Security engineering | Threat modelling · appsec · incident response · secure SDLC | SEC-1…SEC-6 |
| AI engineering | Prompting as engineering · RAG · evals · production AI | AIE-1…AIE-6 |
| Systems programming | C/Rust · memory · concurrency · OS internals | SYS-1…SYS-6 |
| Software architecture | Design patterns · trade-offs · system design · docs | ARCH-1…ARCH-6 |

**Capstone:** Ship a real, tested, observed software system for a genuine user need — reviewed by an authorised assessor.

### 4.3 A.2 — Computer engineering: hardware

**Academy:** Hardware Engineering  
**For:** hardware engineers, electronics hobbyists, embedded engineers, product teams building physical devices  
**Prerequisite:** AI-Assisted Workflow Designer foundation (or test-out by capstone)  
**Safety note:** hardware work carries physical risk (electricity, heat, sharp tools, fumes). Safety faculty owns override authority; no learner proceeds to build without a signed safety checkpoint.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Circuits & electronics | Schematic capture · components · signal analysis · power | CE-1…CE-6 |
| PCB design | Layout · design rules · manufacturing files · assembly | PCB-1…PCB-6 |
| Embedded systems | Microcontrollers · firmware · interrupts · drivers | EMB-1…EMB-6 |
| Digital design | FPGA · Verilog/VHDL · timing · synthesis | DD-1…DD-6 |
| Silicon / ASIC | RTL · verification · tape-out flow · yield | ASIC-1…ASIC-6 |
| IoT & sensors | Sensor selection · connectivity · power budget · edge | IOT-1…IOT-6 |
| Robotics | Actuators · kinematics · SLAM · control loops | ROB-1…ROB-6 |
| Test & measurement | Oscilloscopes · logic analysers · compliance · reliability | TM-1…TM-6 |
| Supply chain & manufacturing | BOM · sourcing · contract manufacturing · quality | SCM-1…SCM-6 |
| Hardware security | Side-channel · tamper evidence · secure boot · provenance | HWSEC-1…HWSEC-6 |

**Capstone:** Design, build, test, and document a working hardware product — from schematic to assembled unit — with safety and compliance review.

### 4.4 A.3 — Hardware-software boundary (embedded / systems)

Bridges the two trees: real-time OS, drivers, board bring-up, power management, OTA updates, hardware-in-the-loop testing. This is where most product engineers actually live.

| Capability | Example | Assessment |
|---|---|---|
| Bring up a custom board | Power-on → boot → first peripheral | Scenario challenge + evidence log |
| Write a device driver | Register map → kernel/userspace driver | Fields challenge + code review |
| OTA update with rollback | Signed image → A/B partitions → rollback on failure | Critique challenge + rollback drill |
| Power budget & thermal | Measure → model → redesign | Evidence portfolio |

---

## 5. Phase B — The most-signed-up education on the internet

### 5.1 Demand-signal method

Before authoring any non-tech subject, research the most-signed-up online education for that subject:

- **Enrolment volume** on major platforms (Coursera, Udemy, edX, Skillshare, MasterClass, LinkedIn Learning, Khan Academy, YouTube education)
- **Search demand** (Google Trends, keyword volume for "learn X", "X course", "X certification")
- **Credential / licence demand** (professional bodies requiring continuing education)
- **Completion & willingness to pay** (course completion rates, average price points)

Each subject gets a demand score: `high / medium / low`. Only `high` subjects enter the core catalogue. `medium` subjects run as experimental academies (per [09-work-pathways.md] §5). `low` subjects are deferred.

### 5.2 B.1 — Cooking & food

**Demand signal:** consistently among the top-enrolled lifelong-learning categories globally (cooking classes, baking, nutrition, meal prep).

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Cooking fundamentals | Knife skills · heat control · seasoning · mise en place | COOK-1…COOK-6 |
| Baking & pastry | Doughs · leavening · temperature · decorating | BAK-1…BAK-6 |
| Cuisine-specific | Regional techniques & ingredients | CUS-1…CUS-6 |
| Meal planning & nutrition | Balanced meals · dietary restrictions · budgeting | NUT-1…NUT-6 |
| Food safety & hygiene | Storage · cross-contamination · HACCP basics | SAFE-1…SAFE-6 |
| Professional kitchen | Station management · plating · expediting | PRO-1…PRO-6 |

**Capstone:** Plan, prep, cook, plate, and serve a multi-course meal for real guests, with food-safety and timing review.

**Safety / regulated:** food-handling rules vary by jurisdiction — flag local verification, never state a specific regulation as settled fact.

### 5.3 B.2 — Therapy, counselling & mental-health support

**Demand signal:** mental-health first aid, counselling skills, psychology, and wellbeing courses are among the fastest-growing enrolments post-2020.

**Regulated warning:** clinical diagnosis and treatment are reserved to licensed professionals. AI Faculty teaches *support skills, psychoeducation, and signposting* — never diagnosis, treatment, or crisis intervention as a substitute for a professional.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Active listening & rapport | Empathic listening · open questions · silence | LISTEN-1…LISTEN-6 |
| Psychoeducation | Explaining stress/anxiety/depression accurately | PSYCHO-1…PSYCHO-6 |
| Crisis recognition & signposting | Suicide risk flags → professional referral | CRISIS-1…CRISIS-6 |
| Boundaries & ethics | Dual relationships · confidentiality · scope | BOUND-1…BOUND-6 |
| Wellbeing tools | Sleep, movement, breathing, social connection | WELL-1…WELL-6 |
| Peer support facilitation | Group norms · conflict · referral pathways | PEER-1…PEER-6 |

**Capstone:** Run a supervised peer-support conversation or workshop with documented boundaries, signposting, and a safety plan.

**Quality gate:** Quality & Safety Faculty must sign off every therapy-adjacent pathway before public release. No AI holds authority over mental-health decisions.

### 5.4 B.3 — Sports, fitness & athletic performance

**Demand signal:** personal training, strength & conditioning, yoga, running, and sports coaching are top enrolments across fitness platforms.

**Regulated warning:** medical clearance for exercise, injury diagnosis, and prescription-level programming are reserved to licensed professionals.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Exercise science basics | Anatomy · physiology · energy systems | EXSCI-1…EXSCI-6 |
| Strength & conditioning | Programming · periodisation · load management | S&C-1…S&C-6 |
| Endurance training | Running · cycling · swimming · pacing | END-1…END-6 |
| Mobility & flexibility | Stretching · joint health · recovery | MOB-1…MOB-6 |
| Sports-specific skills | Technique for a given sport | SPORT-1…SPORT-6 |
| Nutrition for performance | Fueling · hydration · supplementation | SPORTNUT-1…SPORTNUT-6 |
| Injury prevention & rehab support | Screening · referral · return-to-play stages | INJ-1…INJ-6 |
| Coaching & behaviour change | Motivation · goal setting · adherence | COACH-1…COACH-6 |

**Capstone:** Design and deliver an 8-week training block for a real client, with screening, progression, monitoring, and referral boundaries.

### 5.5 B.4 — Business, entrepreneurship & management

**Demand signal:** business, entrepreneurship, leadership, and management courses are perennially among the most-enrolled on Coursera, Udemy, LinkedIn Learning.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Business fundamentals | Value proposition · business model · market | BIZ-1…BIZ-6 |
| Entrepreneurship | Idea validation · MVP · launch · fundraising | ENT-1…ENT-6 |
| Management & leadership | Delegation · feedback · team culture | MGMT-1…MGMT-6 |
| Operations & finance basics | P&L · cash flow · operations | OPSFIN-1…OPSFIN-6 |
| Marketing & sales | Positioning · channels · conversion | MKT-1…MKT-6 |
| Strategy | Competitive analysis · roadmap · trade-offs | STRAT-1…STRAT-6 |
| HR & people basics | Hiring · performance · compliance basics | HR-1…HR-6 |
| Project management | Scoping · scheduling · risk · delivery | PM-1…PM-6 |

**Capstone:** Launch a real micro-business or deliver a real project for a real organisation, with unit economics and a post-mortem.

### 5.6 B.5 — Health, wellness & nutrition

**Demand signal:** nutrition, wellness coaching, lifestyle medicine, and behaviour-change courses draw high enrolment.

**Regulated warning:** medical diagnosis, prescription, and treatment of disease are reserved to licensed clinicians. AI Faculty teaches evidence-based lifestyle support and signposting.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Nutrition fundamentals | Macronutrients · micronutrients · dietary patterns | NUT-1…NUT-6 |
| Behaviour change | Habit formation · motivation · relapse prevention | BEHAVE-1…BEHAVE-6 |
| Sleep science | Sleep hygiene · circadian rhythm · disorders screen | SLEEP-1…SLEEP-6 |
| Stress & recovery | Stress physiology · recovery protocols | RECOV-1…RECOV-6 |
| Lifestyle medicine evidence | What lifestyle interventions change outcomes | LM-1…LM-6 |
| Wellness coaching | Goal setting · accountability · referral | WELLCOACH-1…WELLCOACH-6 |

**Capstone:** Deliver a 12-week lifestyle behaviour-change program for a real client with measured outcomes and clear referral triggers.

### 5.7 B.6 — Personal finance & investing

**Demand signal:** personal finance, investing, budgeting, and FIRE courses are among the most-watched education categories.

**Regulated warning:** regulated investment advice and financial planning are reserved to licensed advisers in most jurisdictions. AI Faculty teaches financial literacy and frameworks, not advice.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Budgeting & cash flow | Tracking · categories · emergency fund | BUDGET-1…BUDGET-6 |
| Debt management | Interest · repayment strategies · credit | DEBT-1…DEBT-6 |
| Investing basics | Asset classes · risk · diversification · fees | INV-1…INV-6 |
| Retirement planning | Pensions · accounts · withdrawal strategies | RET-1…RET-6 |
| Tax basics | Filing · deductions · jurisdiction flags | TAX-1…TAX-6 |
| Insurance | Risk transfer · cover types · gaps | INS-1…INS-6 |
| Behavioural finance | Biases · emotional decisions · systems | BEHFI-1…BEHFI-6 |

**Capstone:** Build a personal financial plan with budget, debt paydown, investment allocation, and review cadence — flagged as not-regulated-advice.

### 5.8 B.7 — Languages & communication

**Demand signal:** language learning is one of the largest online education markets globally.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Language acquisition | Vocabulary · grammar · pronunciation · immersion | LANG-1…LANG-6 |
| Business communication | Email · meetings · presentations · negotiation | BIZCOMM-1…BIZCOMM-6 |
| Public speaking | Structure · delivery · Q&A · nervousness | SPEAK-1…SPEAK-6 |
| Writing & editing | Clarity · structure · voice · proofreading | WRITE-1…WRITE-6 |
| Cross-cultural communication | Norms · etiquette · misunderstanding repair | CULTURE-1…CULTURE-6 |

**Capstone:** Deliver a real presentation or publish real writing in the target language/communication domain, with peer and assessor feedback.

### 5.9 B.8 — Creative arts & design

**Demand signal:** graphic design, illustration, photography, video editing, and creative software courses are top Skillshare/Udemy enrolments.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Graphic design | Layout · typography · colour · brand | GD-1…GD-6 |
| Illustration & drawing | Line · form · perspective · medium | ILLUS-1…ILLUS-6 |
| Photography | Exposure · composition · lighting · editing | PHOTO-1…PHOTO-6 |
| Video editing | Cutting · sound · colour · export | VIDEO-1…VIDEO-6 |
| UI/UX design | Research · wireframing · prototyping · testing | UX-1…UX-6 |
| 3D & motion | Modelling · animation · rendering | MOTION-1…MOTION-6 |

**Capstone:** Produce a real creative brief for a real client, from concept to delivered assets, with critique and revision cycles.

### 5.10 B.9 — Skilled trades & DIY

**Demand signal:** home repair, carpentry, plumbing, electrical basics, and automotive courses draw strong enrolment among adult learners.

**Regulated warning:** licensed trades (electrical, plumbing, gas) require certified professionals for regulated work. AI Faculty teaches theory, planning, and when to call a professional.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Carpentry & woodworking | Joinery · tools · finishing · project planning | CARP-1…CARP-6 |
| Home electrical basics | Circuits · safety · when to call an electrician | ELEC-1…ELEC-6 |
| Plumbing basics | Pipes · fixtures · leaks · when to call a plumber | PLUMB-1…PLUMB-6 |
| Automotive maintenance | Oil · brakes · batteries · diagnostics | AUTO-1…AUTO-6 |
| Home renovation | Permits · budgeting · contractors · sequencing | RENO-1…RENO-6 |
| Gardening & landscaping | Soil · plants · irrigation · maintenance | GARDEN-1…GARDEN-6 |

**Capstone:** Complete a real home-improvement or repair project, with safety checks and professional sign-off where regulated work is involved.

### 5.11 B.10 — Music & performing arts

**Demand signal:** instrument lessons, music theory, production, and performing-arts courses are high-enrolment creative categories.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Instrument fundamentals | Technique · reading · ear training · repertoire | INSTR-1…INSTR-6 |
| Music theory | Harmony · rhythm · form · analysis | THEORY-1…THEORY-6 |
| Music production | DAW · recording · mixing · mastering | PROD-1…PROD-6 |
| Songwriting | Structure · lyrics · melody · arrangement | SONG-1…SONG-6 |
| Acting & performance | Voice · movement · text · audition | ACT-1…ACT-6 |
| Dance & movement | Technique · choreography · conditioning | DANCE-1…DANCE-6 |

**Capstone:** Perform or produce a real piece for a real audience, with documented rehearsal and feedback cycles.

### 5.12 B.11 — Academic subjects (K–12 / exam prep / university)

**Demand signal:** tutoring, exam prep (SAT, GCSE, A-level, university entrance), and subject catch-up are massive online markets.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Mathematics | Numeracy → algebra → calculus → statistics | MATH-1…MATH-6 |
| Sciences | Biology · chemistry · physics · scientific method | SCI-1…SCI-6 |
| English & literacy | Reading · writing · analysis · composition | ENG-1…ENG-6 |
| History & humanities | Sources · argument · context · writing | HUM-1…HUM-6 |
| Exam technique | Revision · past papers · time management | EXAM-1…EXAM-6 |
| Study skills | Note-taking · focus · retention · planning | STUDY-1…STUDY-6 |

**Capstone:** Sit a real practice exam or deliver a real academic project under timed conditions, with marked feedback.

### 5.13 B.12 — Care, teaching & early-years education

**Demand signal:** teaching qualifications, early-years education, special-needs support, and caregiving courses draw high enrolment among professionals and parents.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Early-years development | Milestones · play · attachment · safeguarding | EY-1…EY-6 |
| Teaching fundamentals | Lesson planning · differentiation · assessment | TEACH-1…TEACH-6 |
| Special educational needs | Identification · adaptations · collaboration | SEN-1…SEN-6 |
| Classroom management | Behaviour · routines · relationships | MGMT-1…MGMT-6 |
| Caregiving & support | Personal care · dignity · safety · boundaries | CARE-1…CARE-6 |
| Education policy & governance | Curriculum · inspection · compliance | POLICY-1…POLICY-6 |

**Capstone:** Deliver a real teaching or care session with documented planning, delivery, and reflection.

### 5.14 B.13 — Law, compliance & governance for non-lawyers

**Demand signal:** compliance, contracts, GDPR, and business-law basics courses are high-enrolment among founders and operators.

**Regulated warning:** legal advice and representation are reserved to qualified lawyers. AI Faculty teaches legal literacy, spotting issues, and when to instruct counsel.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Contract literacy | Reading · spotting issues · redlines | CONTRACT-1…CONTRACT-6 |
| Compliance basics | Regulations · policies · audits | COMPLY-1…COMPLY-6 |
| Data protection & privacy | GDPR/CCPA concepts · rights · breaches | PRIV-1…PRIV-6 |
| Employment law basics | Hiring · contracts · dismissal · discrimination | EMP-1…EMP-6 |
| Risk & governance | Boards · duties · escalation · reporting | GOV-1…GOV-6 |
| Dispute resolution | Negotiation · mediation · litigation basics | DISPUTE-1…DISPUTE-6 |

**Capstone:** Review a real contract or compliance situation for a real organisation, with issue-spotting and counsel-referral plan.

### 5.15 B.14 — Real estate & property

**Demand signal:** real-estate licensing, investing, and property-management courses draw strong enrolment.

**Regulated warning:** real-estate agency, conveyancing, and property law are regulated in most jurisdictions. AI Faculty teaches literacy and when to involve licensed agents/solicitors.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Property valuation | Comps · market analysis · appraisal | VAL-1…VAL-6 |
| Real-estate finance | Mortgages · yield · leverage · cycles | FIN-1…FIN-6 |
| Property management | Tenants · leases · maintenance · law | PM-1…PM-6 |
| Real-estate law basics | Contracts · titles · disclosures · jurisdiction | LAW-1…LAW-6 |
| Investment strategy | Buy-and-hold · flip · development · REITs | INV-1…INV-6 |
| Negotiation & closing | Offers · contingencies · closing | NEG-1…NEG-6 |

**Capstone:** Analyse a real property deal end-to-end, with valuation, finance, and legal-review checkpoints.

### 5.16 B.15 — Sales & customer success

**Demand signal:** sales training, SDR, account management, and customer-success courses are high-enrolment business categories.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Prospecting & qualification | Research · outreach · discovery | PROSPECT-1…PROSPECT-6 |
| Sales process & pipeline | Stages · forecasting · CRM | PIPELINE-1…PIPELINE-6 |
| Objection handling & closing | Responses · negotiation · commitment | CLOSE-1…CLOSE-6 |
| Customer success & retention | Onboarding · health · expansion · churn | CS-1…CS-6 |
| Account management | Relationships · renewals · expansion | AM-1…AM-6 |
| Sales leadership | Coaching · pipeline reviews · strategy | SALESLEAD-1…SALESLEAD-6 |

**Capstone:** Run a real sales cycle or manage a real book of customers, with pipeline data and outcomes.

### 5.17 B.16 — Sustainability, climate & green skills

**Demand signal:** ESG, carbon accounting, renewable energy, and sustainability courses are growing fast among professionals.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Carbon accounting | Scope 1/2/3 · measurement · reporting | CARBON-1…CARBON-6 |
| Renewable energy | Solar · wind · storage · grid | RENEW-1…RENEW-6 |
| Circular economy | Design · waste · reverse logistics | CIRC-1…CIRC-6 |
| ESG & sustainability reporting | Frameworks · disclosure · assurance | ESG-1…ESG-6 |
| Sustainable supply chain | Sourcing · audits · decarbonisation | SUPPLY-1…SUPPLY-6 |
| Climate risk & adaptation | Risk · resilience · transition | RISK-1…RISK-6 |

**Capstone:** Produce a real sustainability report or carbon-reduction plan for a real organisation.

### 5.18 B.17 — Gaming, esports & game development

**Demand signal:** game design, Unity/Unreal, esports coaching, and game-production courses draw strong enrolment.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Game design | Mechanics · loops · balance · documentation | DESIGN-1…DESIGN-6 |
| Game programming | Engine · scripting · physics · AI | CODE-1…CODE-6 |
| Game art & animation | 2D/3D · rigging · animation · VFX | ART-1…ART-6 |
| Game production | Scheduling · QA · publishing · live ops | PROD-1…PROD-6 |
| Esports & competitive play | Strategy · analysis · coaching · teams | ESPORT-1…ESPORT-6 |
| Game community & moderation | Community · safety · events · moderation | COMM-1…COMM-6 |

**Capstone:** Ship a real game or run a real esports event, with playtest data and outcomes.

### 5.19 B.18 — Writing, publishing & media

**Demand signal:** creative writing, copywriting, journalism, and self-publishing courses draw strong enrolment.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Creative writing | Fiction · poetry · narrative · voice | FICTION-1…FICTION-6 |
| Copywriting & content | Persuasion · SEO · briefs · channels | COPY-1…COPY-6 |
| Journalism | Reporting · verification · ethics · editing | JOURN-1…JOURN-6 |
| Self-publishing | Editing · design · distribution · marketing | PUBLISH-1…PUBLISH-6 |
| Editorial & commissioning | Briefs · editing workflow · rights | EDIT-1…EDIT-6 |

**Capstone:** Publish a real piece of writing for a real audience, with editing and reception data.

### 5.20 B.19 — Parenting, relationships & family life

**Demand signal:** parenting, relationships, and family-life courses draw strong enrolment among adults.

**Regulated warning:** family therapy, custody, and child-protection decisions are reserved to licensed professionals. AI Faculty teaches skills and signposting.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Parenting fundamentals | Development · discipline · attachment · safety | PARENT-1…PARENT-6 |
| Relationship skills | Communication · conflict · intimacy | RELATION-1…RELATION-6 |
| Family finance & logistics | Budgeting · scheduling · coordination | FAMFIN-1…FAMFIN-6 |
| Child safety & first aid | CPR · hazards · emergency response | SAFETY-1…SAFETY-6 |
| Special-needs parenting | Advocacy · services · support | SNE-1…SNE-6 |

**Capstone:** Deliver a real family-life intervention (e.g., a new routine, a difficult conversation, a safety plan) with documented outcomes.

### 5.21 B.20 — Spirituality, philosophy & life skills

**Demand signal:** philosophy, mindfulness, religion, and life-skills courses draw steady enrolment.

| Track | Signature capabilities | Example competency IDs |
|---|---|---|
| Philosophical reasoning | Arguments · ethics · logic · worldviews | PHIL-1…PHIL-6 |
| Mindfulness & contemplation | Attention · emotion regulation · practice | MINDFUL-1…MINDFUL-6 |
| Life skills | Decision-making · resilience · meaning | LIFE-1…LIFE-6 |
| Religious literacy | Traditions · texts · practice · dialogue | REL-1…REL-6 |

**Capstone:** Complete a real life-skills project (e.g., a values clarification, a meditation practice, a community-service project) with reflection.

### 5.22 B.21+ — Long tail

For every additional subject with measurable demand: apply the same template — demand research → academy proposal → competencies → pathway → capstone → quality gate → deploy. Subjects include: agriculture, aviation, maritime, event planning, hospitality, funeral services, pet care, animal training, fashion, beauty, interior design, event management, and more.

---

## 6. Cross-subject capability graph (Phase C)

Shared capabilities transfer across all domains. The graph from [03-competency-framework.md] §7 extends beyond AI:

```
goal definition → verification → deliberate practice → evidence →
responsible application → feedback loops → teaching others →
domain-specific mastery (any subject above)
```

A learner who masters "goal definition" in cooking can transfer it to software; a learner who masters "verification" in hardware applies it to finance. The institution tracks cross-domain transfer explicitly.

---

## 7. Faculty roles per new subject

For each new academy, instantiate the subject-specific variants of the [faculty registry](02-faculty-roles.md):

| Role (subject-specific) | Mission |
|---|---|
| Dean (subject) | Protect quality and mission for that subject |
| Learning Architect (subject) | Turn subject capabilities into pathways |
| Diagnostic Faculty (subject) | Place the learner in the subject |
| Teaching Faculty (subject) | Teach a subject capability |
| Socratic Coach (subject) | Develop subject reasoning through questioning |
| Practice Coach (subject) | Design subject deliberate practice |
| Assessment Faculty (subject) | Judge subject evidence against rubric |
| Research Faculty (subject) | Verify subject knowledge (R0–R5) |
| Student Success (subject) | Keep subject learners unstuck |
| Quality & Safety (subject) | Safety override for that subject |

Human authority: the founder reserves first-of-kind approval for each new subject; regulated subjects (therapy, law, finance, healthcare, regulated trades) additionally require Quality & Safety Faculty sign-off before public release.

---

## 8. Architecture implications

From [01-architecture.md]:

- **Control plane:** one instance serves all subjects. Model routing, policy engine, identity, and audit scale by subject count, not by learner count.
- **Data zones:** Restricted (PII) and Capability (rubrics, anonymised evidence) stay separate per subject.
- **Evidence lineage:** every new subject adds evidence records; lineage must record subject + domain so assessors can be matched by expertise.
- **Scaling posture:** `1 subject → dozens of AI disciplines → industry academies → new fields`, with a quality gate at every step. Scaling-ready ≠ scaling-built: build infra only when demand and evidence justify it.

---

## 9. Monetization implications

From [11-monetization.md] and [launch-status.json]:

- Free tier: foundation + first pathway (any subject).
- Pro ($15/mo or $120/yr): opens every pathway across all subjects.
- Founding Members: $150 one-time lifetime Pro pre-launch.
- New subjects can be bundled into Pro or sold as subject-specific academies; the payments ledger and plan gate already support per-subject gating.

---

## 10. Roadmap for expansion

| Phase | Milestone | Gate |
|---|---|---|
| A.1 | Author first software track (SWF + WEB + BE) | 10 learners complete |
| A.2 | Author first hardware track (CE + PCB + EMB) with safety checkpoints | 10 learners complete hardware build |
| A.3 | Hardware-software boundary track | End-to-end board bring-up evidence |
| B.1–B.21 | Author subjects in demand order, one per run | Each subject passes quality gate before next |
| C | Cross-subject capability graph live | Transfer measured across ≥2 domains |
| Later | Industry academies, human governance body, compensation framework | Per [roadmap.md] "Later" |

**Cadence:** roughly one subject per week is sustainable to review (matching [expansion-prompt.md]); no faster than the founder can read the diff.

---

## 11. Quality gates (non-negotiable)

Per [00-constitution.md] §10 and [expansion-prompt.md]:

1. **Content correctness:** every subject's knowledge claims verified by Research Faculty at R2+; real-world examples reflect how the work is actually done.
2. **Safety:** regulated subjects (therapy, healthcare, law, finance, regulated trades, food safety) carry Quality & Safety Faculty sign-off and "not professional advice" notices; no specific regulation stated as settled fact.
3. **Evidence:** every capability claim links to produced evidence; assessments use fields/critique/scenario challenges with the structural rules from [expansion-prompt.md] (§non-negotiable rules).
4. **Validation:** `node --check` on all JS, `node workers/api/test.mjs` (200 tests pass), vm-load structural sweep, founder review of the live pathway overview before announcement.
5. **Logging:** addition recorded in `docs/continuity-log.md` and [09-work-pathways.md] catalogue table updated.

---

## 12. Immediate next step

Pick the highest-demand computer-engineering track (recommendation: **software foundations + web engineering**) and run one expansion pass following [expansion-prompt.md], then evaluate the demand data for the top non-tech subjects (cooking, therapy, sports, business) to sequence Phase B.

---

*This document is versioned; superseded text is retained in history, not deleted ([00-constitution.md] §8). Amendments are recorded in `docs/continuity-log.md`.*
