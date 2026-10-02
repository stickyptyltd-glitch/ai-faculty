/* Subject: hr
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["hr"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const HR_COMPETENCIES = [
  {
    id: "HR1", name: "Job specs and screening criteria",
    canDo: "Use AI to draft job descriptions and screening rubrics — then check them for bias, inflation and irrelevant filters.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI-drafted job spec asked for a \"digital native\" with \"boundless energy\" who could \"hit the ground running\" — and listed a degree as required for a role that didn't need one. The applicant pool skewed young, and two strong career-changers self-selected out.",
        point: "AI drafts job specs from the average of all job specs — including the biased language and the credential inflation baked into the training data.",
      },
      explain: {
        paras: [
          "AI is useful for a first-draft spec and a screening rubric from the real requirements. Then check it.",
          "**Biased or coded language** ('digital native', 'young and dynamic', 'cultural fit', gendered terms) — out. **Credential inflation** — is the degree / years-of-experience actually needed, or copied from similar posts? **Irrelevant filters** — requirements that screen out capable people for no job-related reason.",
          "**The rubric measures the job** — each criterion maps to something the person will actually do. Write the criteria as observable and job-related, then AI can help apply them consistently.",
        ],
        keyIdea: "AI drafts the spec and rubric; you strip coded language, challenge every credential and years-of-experience requirement, remove non-job-related filters, and make each criterion map to real work.",
      },
      demonstrate: {
        task: "Drafting the spec and screening rubric for a customer success role.",
        steps: [
          { move: "Draft", think: "From the responsibilities.", result: "AI produces a spec from the responsibilities you give it." },
          { move: "De-bias", think: "Coded language out.", result: "Cut 'rockstar', 'work hard play hard', '5+ years' (the job needs the skill, not the tenure); replace 'native English speaker' with 'clear written communication'." },
          { move: "Test the filters", think: "Job-related?", result: "'Degree required' — does this job need one? No. Change to 'or equivalent experience'." },
          { move: "The rubric", think: "Each criterion → a task.", result: "'Can de-escalate a frustrated customer' → assessed by a role-play, not a keyword." },
        ],
        full: "The AI draft is a starting point. Coded language and inflated credentials are removed, non-job-related filters are dropped, and every rubric criterion is rewritten to map to something the person will actually do.",
      },
      deconstruct: [
        "'5+ years' screens for tenure, not skill — often not what the job needs.",
        "'Native English speaker' is both discriminatory and imprecise.",
        "A rubric criterion that isn't tied to a task is measuring the wrong thing.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're using AI to write the spec and screening criteria for a junior data analyst role.",
        fields: [
          { key: "draft", label: "What AI drafts", hint: "From what you give it.", minWords: 4 },
          { key: "bias", label: "The language you'd check for and cut", hint: "Coded terms.", minWords: 5 },
          { key: "credentials", label: "How you'd challenge the requirements", hint: "Degree, years.", minWords: 5 },
          { key: "rubric", label: "How you'd make the criteria job-related", hint: "Each → a task.", minWords: 5 },
        ],
        model: {
          draft: "The responsibilities, the must-have and nice-to-have skills, the team context — AI drafts it from what I give it.",
          bias: "'Digital native', 'fast-paced', 'ninja / rockstar / guru', 'culture fit', anything gendered, 'recent graduate' (age proxy). Replace with plain descriptions of the work and the skills.",
          credentials: "Does a junior data analyst need a specific degree? Probably not — 'demonstrated ability to work with data (any route)'. '2 years experience' for a junior role is contradictory — cut it.",
          rubric: "'Can write a SQL query to answer a defined question' (short exercise). 'Can explain a finding to a non-technical person' (interview). Each one is something they'll do on day one.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HR1.1", "Reproduce", "Draft and de-bias a real job spec + rubric",
        "Take a role you'd hire for. Draft the spec and rubric with AI, then de-bias them.",
        "Strong answer: coded / biased language is identified and removed; every credential and years-of-experience requirement is challenged against the actual job; non-job-related filters are dropped; and each rubric criterion maps to observable work.",
        [
          { key: "role", label: "The role", hint: "One line.", minWords: 3 },
          { key: "draft", label: "What AI drafts", hint: "From your inputs.", minWords: 4 },
          { key: "debias", label: "The language cut + why", hint: "Coded terms.", minWords: 5 },
          { key: "rubric", label: "Criteria mapped to real tasks", hint: "Each → work.", minWords: 5 },
        ],
        [
          { label: "Coded / biased language is identified and removed" },
          { label: "Every credential and years requirement is challenged against the job" },
          { label: "Each rubric criterion maps to observable work" },
        ],
        "independent"),
      critiqueChallenge("HR1.2", "Adapt", "Fix an AI-drafted spec",
        "Here is an AI-drafted job spec. Find every problem.",
        "\"We're looking for a young, energetic marketing rockstar to join our fast-paced team. The ideal candidate is a digital native with 7+ years of experience, a marketing degree from a top university, and the drive to work whatever hours it takes. Must be a great culture fit.\"",
        [
          { label: "'young', 'energetic', 'rockstar', 'digital native' — age-coded and vague", signals: ["young", "energetic", "rockstar", "digital native", "age-coded", "age coded", "ageist", "age discrimination", "coded language"] },
          { label: "'7+ years' with 'young' is contradictory and likely inflated", signals: ["7+ years", "contradictory", "inflated", "years of experience", "tenure", "does the job need"] },
          { label: "'degree from a top university' — credential inflation and an access filter with no job relevance", signals: ["top university", "credential", "inflation", "access", "class", "not job-related", "degree"] },
          { label: "'work whatever hours it takes' can deter carers and disabled applicants", signals: ["whatever hours", "boundaries", "carers", "disabled", "deter", "hours it takes", "burnout"] },
          { label: "'culture fit' is a bias vector — should be values alignment or specific behaviours", signals: ["culture fit", "bias", "values", "specific behaviours", "vague", "in-group"] },
        ],
        "transferable", { text: `"We’re looking for a marketing manager to join our team. You’ll need proven experience running multi-channel campaigns — we’re flexible on how many years that took — and the ability to manage shifting priorities. We offer flexible hours and support remote/hybrid work. We value people who collaborate well and communicate clearly; tell us about a campaign you’re proud of."`, changes: ["Age-coded language (“young,” “energetic,” “rockstar,” “digital native”) removed", "A specific, flexible experience requirement replaces “7+ years”", "“Top university degree” dropped for a demonstrable, job-relevant ask", "“Culture fit” replaced with named, observable behaviours"] }),
    ],
  },

  {
    id: "HR2", name: "CV screening and shortlisting",
    canDo: "Use AI to screen applications consistently — against job-related criteria, with human review of rejections and bias checks.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI screening tool ranked 400 applicants. HR interviewed the top 20. Later analysis showed the model had down-ranked anyone with an employment gap and anyone whose name suggested they were from a particular region — patterns it learned from the company's past \"successful hire\" data.",
        point: "An AI trained on who you hired before will reproduce who you hired before — including the parts you'd rather not repeat.",
      },
      explain: {
        paras: [
          "If AI helps screen: it scores against **explicit job-related criteria** (the rubric from HR1), not a learned 'good candidate' pattern.",
          "**A human reviews the decisions** — at minimum every rejection near the line, and a sample of clear rejects. **Bias is checked** — does the pass rate differ by gender, age proxy, ethnicity proxy, employment gap, non-traditional background? If so, investigate the criterion causing it.",
          "**Candidates can get the basis** for a decision. In many places, **fully automated rejection is legally restricted** — know your rules. The AI makes screening consistent and faster; it does not get to decide who's out.",
        ],
        keyIdea: "AI scores against explicit job-related criteria (not a learned pattern); a human reviews rejections; bias is measured across groups and investigated; candidates can get the basis; automated-only rejection may be restricted. AI doesn't decide who's out.",
      },
      demonstrate: {
        task: "Screening 300 applications for a project manager role.",
        steps: [
          { move: "Criteria", think: "The rubric, with evidence.", result: "AI scores each CV against the 5 rubric criteria, quoting the evidence it found." },
          { move: "Human review", think: "Read the actual CV.", result: "A recruiter reviews everyone scored borderline, plus a 10% sample of low scores." },
          { move: "Bias check", think: "Across groups.", result: "Compare shortlist rate by gender and by employment gap — a gap-penalty shows up; 'continuous recent experience' is removed as not job-related." },
          { move: "Basis", think: "Recorded.", result: "Each rejected candidate's record notes which criteria weren't met and the CV lines cited." },
        ],
        full: "AI applied the rubric consistently and fast, quoting its evidence. A human read every borderline case and a sample of rejects. A bias check found and removed an employment-gap penalty. Every decision has a recorded, job-related basis.",
      },
      deconstruct: [
        "Scoring against the explicit rubric (not 'good candidate') is what keeps it job-related.",
        "The bias check on employment gaps caught a pattern the model learned.",
        "Reading the actual CV for borderline cases is the human judgement that matters.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want to use AI to help shortlist for a high-volume entry-level role (500+ applicants).",
        fields: [
          { key: "criteria", label: "What the AI scores against", hint: "Explicit, job-related.", minWords: 5 },
          { key: "humanrole", label: "Where a human reviews, given the volume", hint: "Borderline + sample + requests.", minWords: 5 },
          { key: "biascheck", label: "What you'd measure", hint: "Pass rate by group.", minWords: 5 },
          { key: "legal", label: "What you'd check about automated decisions", hint: "The rules where the candidates are.", minWords: 4 },
        ],
        model: {
          criteria: "The explicit, job-related must-haves — 'available for shift work', 'evidence of reliability in a previous role', 'basic numeracy' — each scored with the supporting text quoted. Not a holistic 'fit' score.",
          humanrole: "A human reviews everyone within a band of the cut line; a random 10–15% sample of clear rejects; and anyone who requests a review.",
          biascheck: "Shortlist rate by gender, by age band (from graduation year if present), by postcode cluster as a proxy, by employment-gap presence. Any gap over a threshold → investigate the driving criterion.",
          legal: "Many jurisdictions (UK/EU data-protection law is one well-known example) give people rights around solely-automated decisions with significant effects — build in the human review and the ability to explain and contest regardless. Check the specific rules for where the candidates actually are; don't assume your jurisdiction's rule is the only one or the strictest one.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HR2.1", "Reproduce", "Design AI-assisted screening for a real role",
        "Take a role you'd screen for. Design the AI-assisted screening.",
        "Strong answer: the AI scores against explicit job-related criteria, not a learned 'good hire' pattern; a human reviews rejections (borderline + a sample); bias is measured across groups with an action threshold; and the legal position on automated rejection is considered.",
        [
          { key: "role", label: "The role", hint: "One line.", minWords: 3 },
          { key: "scoring", label: "Against what", hint: "Explicit criteria.", minWords: 4 },
          { key: "humanreview", label: "Where, given volume", hint: "Borderline + sample.", minWords: 4 },
          { key: "bias", label: "What's measured + threshold", hint: "Pass rate by group.", minWords: 4 },
        ],
        [
          { label: "AI scores against explicit job-related criteria, not a learned pattern" },
          { label: "A human reviews rejections (borderline + a sample)" },
          { label: "Bias measured across groups with a threshold; automated-rejection law considered" },
        ],
        "independent"),
      scenarioChallenge("HR2.2", "Create", "The screener learned your past bias",
        "Analysis shows your AI screener down-ranks applicants with career breaks and certain name origins — patterns from your historical hiring data.",
        "What do you do?",
        [
          { id: "a", label: "Add a rule telling the AI to ignore names and career breaks", ok: false, why: "A model trained on biased outcomes routes the bias through correlated proxies; telling it to ignore obvious features doesn't remove it." },
          { id: "b", label: "Stop scoring against a learned 'good candidate' model; score only against explicit job-related criteria, add human review of rejections, and keep measuring pass rates by group", ok: true, why: "Remove the learned pattern entirely; make the criteria explicit and checkable." },
          { id: "c", label: "Retrain the model on more recent hiring data", ok: false, why: "Recent data likely carries the same bias." },
        ],
        "transferable"),
    ],
  },

  {
    id: "HR3", name: "Writing about and to people",
    canDo: "Use AI to draft HR communications — offers, feedback, reviews, difficult messages — accurately, fairly, and without leaking things.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The manager used AI to \"polish\" a performance review. It added specific incidents that never happened, inflated a rating to sound more positive, and included a phrase the employee later cited as evidence of a promise. The review went in the file.",
        point: "AI 'improving' a document about a person invents specifics and shifts meaning — and HR documents are the ones that end up in disputes.",
      },
      explain: {
        paras: [
          "AI can help draft: offer letters, rejection messages, feedback, review narratives, policy comms, meeting summaries.",
          "The checks: **every specific about the person is true** — incidents, dates, ratings, quotes (AI invents these to add colour); **the meaning matches your intent** — a rating, a warning, a commitment shouldn't drift; **no promise is created** ('opportunities for growth' can be read as a commitment); **tone is fair** — not harsher or softer than warranted; **nothing confidential leaks** — other people's information, unshared decisions, legal advice.",
          "For anything with legal weight (warnings, dismissals, settlements), AI drafts and a qualified person owns it.",
        ],
        keyIdea: "AI drafts HR comms; you verify every specific about the person, check the meaning didn't drift, cut any implied promise, check the tone is fair, and stop confidential leaks. Legal-weight documents are owned by a qualified person.",
      },
      demonstrate: {
        task: "Drafting a written warning with AI help.",
        steps: [
          { move: "Supply the facts", think: "AI doesn't source these.", result: "You give the AI the actual incidents, dates, prior conversations." },
          { move: "Draft", think: "Structure and tone.", result: "AI writes it up in the right structure and tone." },
          { move: "Check specifics", think: "Anything invented?", result: "AI added 'and on several other occasions' — there's no record of others. Cut it." },
          { move: "Check for promises", think: "Implied commitments.", result: "AI wrote 'we're confident you can turn this around' — reads as a commitment not to dismiss. Change to a factual statement of the improvement required." },
        ],
        full: "The facts come from you; AI structures the warning. An invented 'several other occasions' is cut, an implied commitment is removed, and the HR lead owns the final document — because a warning has legal weight.",
      },
      deconstruct: [
        "'Several other occasions' is exactly the kind of specific AI adds and a tribunal would scrutinise.",
        "'Confident you can turn this around' can undermine a later dismissal.",
        "A warning is not something AI or an untrained manager finalises alone.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're using AI to help write end-of-year performance review narratives for your team.",
        fields: [
          { key: "facts", label: "What you supply vs what AI generates", hint: "Examples come from you.", minWords: 5 },
          { key: "specifics", label: "How you check the specifics", hint: "Against your notes.", minWords: 4 },
          { key: "meaning", label: "How you keep ratings / messages from drifting", hint: "You set the rating.", minWords: 4 },
          { key: "leaks", label: "What confidential content you watch for", hint: "Others' data.", minWords: 4 },
        ],
        model: {
          facts: "I supply the examples, the metrics, the feedback from others (anonymised as appropriate). AI turns my notes into a clear narrative — it does not add examples or evidence.",
          specifics: "Every incident, project, number and quote in the draft is checked against my notes and the record. Anything AI added that I didn't provide is removed.",
          meaning: "The narrative matches the rating I've decided. AI shouldn't nudge a 'meets expectations' narrative to sound like 'exceeds' or vice versa. I set the rating; AI writes to it.",
          leaks: "No comparison to named colleagues; no mention of others' ratings, salaries or performance; no unshared org decisions; no repeating something told to me in confidence.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HR3.1", "Reproduce", "Draft a real HR communication with AI, checked",
        "Take an HR communication you'd write. Plan how AI drafts it and how you check it.",
        "Strong answer: the person-specific facts are supplied by the human, not generated; every specific in the draft is verified; meaning / rating is set by the human and not drifted by AI; implied promises are cut; confidential leaks are checked; and legal-weight docs are owned by a qualified person.",
        [
          { key: "comm", label: "What it is", hint: "One line.", minWords: 3 },
          { key: "supplied", label: "Facts you provide", hint: "AI doesn't source these.", minWords: 4 },
          { key: "checks", label: "Specifics, meaning, promises, leaks", hint: "The four checks.", minWords: 6 },
          { key: "ownership", label: "Who owns it if it has legal weight", hint: "Qualified person.", minWords: 3 },
        ],
        [
          { label: "Person-specific facts are supplied by the human, not generated; every specific verified" },
          { label: "Meaning / rating set by the human; implied promises cut; leaks checked" },
          { label: "Legal-weight documents owned by a qualified person" },
        ],
        "independent"),
      critiqueChallenge("HR3.2", "Adapt", "Find the problems in an AI-polished review",
        "Here is a manager's note and the AI-polished review. Find every problem.",
        "Manager's note: 'Sam did ok this year. Missed a couple of deadlines. Good with the team.'\n\nAI-polished review: 'Sam has been an exceptional team player and a cornerstone of the department's success this year. While there were isolated instances of timeline slippage on the Q2 and Q3 initiatives, Sam consistently demonstrated leadership and is clearly on track for advancement. We look forward to Sam taking on greater responsibilities.'",
        [
          { label: "'exceptional', 'cornerstone', 'consistently demonstrated leadership' — massive inflation from 'did ok'", signals: ["inflation", "exceptional", "cornerstone", "did ok", "overstate", "exaggerat", "leadership", "not what the manager said"] },
          { label: "'Q2 and Q3 initiatives' — specific incidents the manager didn't mention, likely invented", signals: ["q2 and q3", "specific", "invented", "didn't mention", "made up", "initiatives", "fabricat"] },
          { label: "'clearly on track for advancement' / 'greater responsibilities' — an implied promotion promise", signals: ["promotion", "advancement", "promise", "greater responsibilities", "implied", "commitment", "on track"] },
          { label: "The meaning has drifted from 'ok, some issues' to 'star performer'", signals: ["meaning", "drifted", "star performer", "shifted", "ok some issues", "changed the message", "different rating"] },
          { label: "A document this inflated undermines any future performance management of Sam", signals: ["undermine", "future performance management", "can't later", "record", "dispute", "contradicts"] },
        ],
        "transferable", { text: `"Sam had a solid year overall. There were a couple of missed deadlines, which we should talk through so they don’t recur, but Sam works well with the team and that’s a real strength. I’d like to see more consistent delivery before we discuss taking on more responsibility."`, changes: ["“exceptional,” “cornerstone,” “consistently demonstrated leadership” removed", "The invented Q2/Q3 incident details are dropped rather than fabricated", "No implied promotion promise — tied to seeing consistent delivery first", "Reads as “ok, some issues” again, not “star performer”"] }),
    ],
  },

  {
    id: "HR4", name: "Employee data and privacy",
    canDo: "Decide what employee information can go into an AI tool, and keep people's data from leaking through prompts, logs or outputs.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "An HR analyst pasted a spreadsheet of the whole team's salaries, performance ratings and personal notes into an AI tool to \"find patterns\". The data was now in a third-party system. One row included a disclosed health condition. This was a reportable data breach.",
        point: "Employee data is some of the most sensitive data an organisation holds. A prompt is a place it can leak.",
      },
      explain: {
        paras: [
          "**Is the tool approved for this?** — a DPA, no training on inputs, appropriate security and residency; consumer tools are not.",
          "**Do you have a lawful basis and is this use compatible with what employees were told?** — using HR data for AI analysis they weren't informed of can breach data-protection law.",
          "**Minimise** — do you need names? salaries? the free-text notes? Aggregate or pseudonymise; special-category data (health, ethnicity, union membership) has extra rules and usually stays out.",
          "**Outputs and logs** — AI outputs about individuals are also personal data. **Enforce** — approved tools only, and don't let 'quick analysis' bypass the process.",
        ],
        keyIdea: "Before employee data goes in: approved tool (DPA, no training), a lawful and compatible basis, data minimised / pseudonymised (special-category data stays out), outputs and logs treated as personal data, and enforcement so 'quick analysis' can't bypass it.",
      },
      demonstrate: {
        task: "An HR team wants AI help analysing engagement-survey results.",
        steps: [
          { move: "Tool", think: "Approved for this.", result: "Use the enterprise tool with a DPA and no training on inputs — not a consumer chatbot." },
          { move: "Basis + notice", think: "Compatible use?", result: "The survey privacy notice said results would be analysed to improve the workplace — AI-assisted analysis is compatible; confirm with the DPO." },
          { move: "Minimise", think: "How little is enough?", result: "Feed aggregated results and anonymised free-text comments — not response-level data with team sizes small enough to identify people." },
          { move: "Outputs", think: "Still personal data.", result: "The AI's summary is treated as an HR document — access-controlled, retained per the HR retention schedule." },
        ],
        full: "The analysis goes ahead on the approved tool, on aggregated and anonymised data, within the basis employees were told about, with the DPO consulted and the output handled as the personal data it is.",
      },
      deconstruct: [
        "'Small teams' is where anonymised comments stop being anonymous.",
        "The privacy notice sets the boundary of compatible use.",
        "The AI's output about people is personal data too — it doesn't stop being sensitive because a model wrote it.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A manager wants to use AI to draft individual development plans for their team, feeding in each person's review history, 1:1 notes and skills assessments.",
        fields: [
          { key: "tool", label: "What tool and why", hint: "Approved for employee data.", minWords: 4 },
          { key: "basis", label: "The data-protection questions", hint: "Lawful + compatible.", minWords: 5 },
          { key: "minimise", label: "What you'd reduce or remove", hint: "Names, raw notes, special-category.", minWords: 5 },
          { key: "outputs", label: "How the plans and any logs are handled", hint: "As HR records.", minWords: 4 },
        ],
        model: {
          tool: "The organisation's approved AI tool with a data-processing agreement, no training on inputs, and access limited to the manager. Not a personal AI account.",
          basis: "Is 'AI-assisted development planning' within what employees were told their review / 1:1 data would be used for? If not, it needs a basis and probably informing them. Special-category data (e.g. a disclosed disability affecting a development need) needs specific care or exclusion.",
          minimise: "Feed the skills assessment and agreed development goals. Be cautious with raw 1:1 notes — they often contain offhand personal detail. Pseudonymise if the tool doesn't need names.",
          outputs: "The draft plans are HR records — stored in the HR system, access-controlled, shared with the employee, retained per policy. The AI tool's chat logs are cleared or covered by the retention rules.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HR4.1", "Reproduce", "Employee-data plan for an AI HR task",
        "Take an AI-assisted HR task. Write the employee-data plan.",
        "Strong answer: the tool is approved for employee data (DPA, no training); there's a lawful basis and the use is compatible with what employees were told; data is minimised and special-category data is handled specifically or excluded; and outputs and logs are treated as personal data.",
        [
          { key: "task", label: "The task", hint: "One line.", minWords: 3 },
          { key: "tool", label: "Approved, why", hint: "DPA, no training.", minWords: 4 },
          { key: "basis", label: "Lawful + compatible use", hint: "What employees were told.", minWords: 4 },
          { key: "minimisation", label: "What's removed / aggregated", hint: "Names, special-category.", minWords: 4 },
          { key: "outputs", label: "How outputs and logs are handled", hint: "As personal data.", minWords: 4 },
        ],
        [
          { label: "The tool is approved for employee data (DPA, no training)" },
          { label: "A lawful basis; the use is compatible with what employees were told" },
          { label: "Data minimised, special-category handled specifically; outputs treated as personal data" },
        ],
        "independent"),
      scenarioChallenge("HR4.2", "Create", "A whole-team spreadsheet went into a chatbot",
        "An analyst pasted the team's salaries, ratings and personal notes — including one disclosed health condition — into a consumer AI tool to find patterns.",
        "What's the situation and what do you do?",
        [
          { id: "a", label: "Delete the conversation and note it as a near-miss", ok: false, why: "Special-category data disclosed to a third party is likely a reportable breach, not a near-miss." },
          { id: "b", label: "Treat it as a personal-data breach: contain it, assess severity (special-category data involved), follow the breach-notification process and timelines, inform affected employees as required, and put an approved tool + training + technical controls in place", ok: true, why: "Handle it as the incident it is, and fix the process." },
          { id: "c", label: "Check whether the tool actually stored it before deciding it's a breach", ok: false, why: "The disclosure occurred on paste; you act on that." },
        ],
        "transferable"),
    ],
  },

  {
    id: "HR5", name: "People decisions stay human",
    canDo: "Keep AI out of the decision on hiring, promotion, pay, discipline and dismissal — as an input, never the decision-maker.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The performance-management system used an AI \"flight risk\" and \"performance trajectory\" score. A manager, trusting it, put someone on a performance plan. The score turned out to be driven mostly by the person having taken parental leave. The grievance was upheld.",
        point: "AI scores about people carry the biases of their training data and a false air of objectivity — and a decision 'the system flagged it' is one nobody actually made.",
      },
      explain: {
        paras: [
          "Decisions about people — to hire, promote, pay, discipline, dismiss, manage out — stay with accountable humans.",
          "AI **can**: organise information, apply an explicit rubric consistently, surface things to look at, draft the write-up. AI **must not**: produce the score that determines the outcome, rank people for redundancy, predict 'flight risk' or 'potential' as a basis for treatment, or be the reason given for a decision.",
          "For each people-decision, a named person can explain the reasoning in job-related terms, the employee can contest it, and 'the AI recommended it' is never the explanation. Consequential + about a person + hard to reverse = human decides, with the AI's role logged and limited.",
        ],
        keyIdea: "People decisions (hire, promote, pay, discipline, dismiss) stay with accountable humans. AI organises, applies an explicit rubric, surfaces, drafts — it doesn't score-to-decide, rank for redundancy, or predict potential / flight-risk as a basis for treatment. A named person explains every decision in job-related terms.",
      },
      demonstrate: {
        task: "Running a promotion round with AI assistance.",
        steps: [
          { move: "What AI does", think: "Compile, draft.", result: "Compiles each candidate's evidence against the promotion criteria, quoting sources; drafts the panel's summary." },
          { move: "What AI doesn't do", think: "No score, no rank.", result: "No 'promotion readiness score'; no ranking. The panel reads the evidence and decides." },
          { move: "The check", think: "Reasoning in criteria terms.", result: "The panel's reasoning for each decision is written in terms of the criteria and the evidence — not 'the tool said'." },
          { move: "The trail", think: "Who decided.", result: "The record shows AI compiled the evidence pack, the panel made the decision, and the reasoning." },
        ],
        full: "AI made the evidence-gathering consistent and fast. The panel of humans read it and made every call, with reasoning tied to the criteria. No AI score decided anything, and every outcome is explainable and contestable.",
      },
      deconstruct: [
        "Compiling evidence against criteria is a good AI use; a 'readiness score' would quietly become the decision.",
        "'The panel decided, here's why' is the accountability that 'the tool flagged it' destroys.",
        "The employee being able to contest depends on the reasoning being job-related and legible.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Leadership wants to use an AI tool that scores employees on 'performance trajectory' and 'retention risk' to help with talent and comp decisions.",
        fields: [
          { key: "concern", label: "What's wrong with using these scores for decisions", hint: "Opacity, proxies, deference.", minWords: 6 },
          { key: "aiok", label: "What AI could legitimately do in talent / comp processes", hint: "Organise, surface, draft.", minWords: 5 },
          { key: "humanline", label: "What stays a human decision and how it's explained", hint: "Job-related reasoning.", minWords: 5 },
          { key: "safeguards", label: "What you'd require if any AI scoring is used at all", hint: "Transparency, audit, review.", minWords: 5 },
        ],
        model: {
          concern: "'Trajectory' and 'retention risk' scores are opaque, likely encode protected characteristics via proxies (leave, caring patterns, age), and give managers a number that feels objective and makes the decision for them. Using them for pay or performance action is high-risk and possibly unlawful.",
          aiok: "Compile someone's actual results against explicit criteria; surface that a high performer hasn't had a raise in two years; draft calibration notes from manager input; check a comp proposal for internal consistency.",
          humanline: "Whether to promote, what to pay, whether to act on performance — decided by managers / panels who can explain it in terms of the person's work, and which the employee can question.",
          safeguards: "Transparency to the employee, a bias audit across groups, human review of every score-influenced decision, no score as the stated reason, and a documented job-related rationale for each outcome.",
        },
      },
      // AI-role ladder — from `demonstrate`'s promotion-panel walkthrough.
      roleMap: [
        { label: "Compiling each candidate's evidence + drafting the panel summary", role: "do-it" },
        { label: "The panel's reasoning must cite criteria/evidence, never 'the tool said'", role: "check" },
        { label: "Producing a readiness score or ranking", role: "stay-out" },
        { label: "The promotion decision itself", role: "stay-out" },
      ],
    },
    challenges: [
      fieldsChallenge("HR5.1", "Reproduce", "Draw the line for a real people process",
        "Take a people process (hiring, promotion, pay, discipline, redundancy). Draw the line between AI's role and the human decision.",
        "Strong answer: AI is limited to organising, applying an explicit rubric, surfacing, drafting; no AI score determines an outcome and no ranking-for-treatment; a named human decides and can explain in job-related terms; the employee can contest; and the AI's role is logged.",
        [
          { key: "process", label: "The process", hint: "Pick one.", minWords: 3 },
          { key: "aiok", label: "What AI legitimately does", hint: "Organise, surface, draft.", minWords: 5 },
          { key: "humandecision", label: "What stays human + how it's explained", hint: "Job-related reasoning.", minWords: 5 },
          { key: "trail", label: "How the AI's role is logged and limited", hint: "The record.", minWords: 4 },
        ],
        [
          { label: "AI limited to organising, applying an explicit rubric, surfacing, drafting" },
          { label: "No AI score determines an outcome; no ranking-for-treatment" },
          { label: "A named human decides and can explain in job-related terms; employee can contest" },
        ],
        "independent"),
      scenarioChallenge("HR5.2", "Create", "The 'flight risk' score drove a performance plan",
        "A manager put an employee on a performance plan largely because an AI 'performance trajectory' score was low. The score was mostly driven by the employee's recent parental leave. A grievance was upheld.",
        "What's the fix?",
        [
          { id: "a", label: "Adjust the model to exclude leave from the score", ok: false, why: "Excluding one feature doesn't fix an opaque score standing in for a human judgement, and other proxies remain." },
          { id: "b", label: "Stop using trajectory / risk scores as a basis for performance action; performance decisions are made by a manager on documented, job-related evidence the employee can see and contest", ok: true, why: "Remove the score from the decision; put a legible human judgement in its place." },
          { id: "c", label: "Require two managers to agree before acting on the score", ok: false, why: "Two people deferring to the same biased score isn't a fix." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: HR_COMPETENCIES, capstoneId: "HRCAP" };
};
