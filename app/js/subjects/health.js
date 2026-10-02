/* Subject: health
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["health"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const HEALTH_COMPETENCIES = [
  {
    id: "HC1", name: "What AI can and can't touch in a clinical setting",
    canDo: "Map clinical tasks to where AI is safe (admin, drafting, summarising with checks) and where it must not go (diagnosis, treatment, triage) — and know the regulatory line.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A clinic used a general AI chatbot to answer patients' symptom questions via the website. It told a patient with chest-pain-and-arm-numbness that it was \"likely muscular strain, try rest and ibuprofen.\" The patient delayed calling emergency services.",
        point: "A general AI tool giving clinical advice is not a productivity feature — it's an unregulated medical device making decisions it isn't safe or lawful to make.",
      },
      explain: {
        paras: [
          "**AI can help with** (with checks): appointment scheduling and reminders, drafting letters and documentation from clinician-supplied facts, summarising a record for a clinician to verify, clinician-approved patient-education material, coding and billing support, transcribing dictation.",
          "**AI must not**: diagnose, recommend or change treatment, triage acuity, interpret results as the decision, or give patients clinical advice directly.",
          "**The regulatory line**: software that informs clinical decisions is often a regulated medical device — a general-purpose AI tool used that way is almost certainly non-compliant and uninsured. Anything patient-facing or decision-informing goes through clinical governance, not a quick pilot.",
        ],
        keyIdea: "AI in healthcare: admin, drafting from supplied facts, summarising-for-verification, approved patient education, coding. Not AI: diagnosis, treatment decisions, triage, results interpretation as the decision, direct patient clinical advice. Decision-informing software is a regulated device — route it through clinical governance.",
      },
      demonstrate: {
        task: "A GP practice wants to use AI to reduce admin load.",
        steps: [
          { move: "Safe uses", think: "Admin, drafting.", result: "AI drafts referral letters from the GP's notes; summarises incoming hospital letters for the GP to check; drafts recall messages for screening." },
          { move: "Unsafe uses ruled out", think: "Decision-informing.", result: "No AI symptom-checker on the website; no AI 'pre-triage' of appointment requests by urgency; no AI interpreting blood results." },
          { move: "The check on the safe ones", think: "Clinician sign-off.", result: "Every AI-drafted letter is read and signed by the GP; every summary is verified against the source before it's acted on." },
          { move: "Governance", think: "Who approves.", result: "The practice's clinical governance lead approves the admin uses; anything touching clinical decisions needs a formal review and likely a regulated product." },
        ],
        full: "The admin uses go ahead with clinician sign-off on every output. The decision-touching uses are ruled out — not because AI couldn't attempt them, but because doing so safely and lawfully needs a regulated device and formal governance, not a practice pilot.",
      },
      deconstruct: [
        "The split is by 'does this inform a clinical decision', not by 'how helpful would it be'.",
        "Clinician sign-off on every draft is the safe-use control.",
        "'It's just a pilot' is how unregulated clinical AI gets deployed.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A hospital ward wants to use AI to help with nursing documentation and handover.",
        fields: [
          { key: "safe", label: "The tasks AI can help with, and the check on each", hint: "Admin, drafting from notes.", minWords: 6 },
          { key: "unsafe", label: "The tasks AI must not do here", hint: "Acuity, escalation, interpretation.", minWords: 5 },
          { key: "governance", label: "Who needs to approve what", hint: "Clinical governance, IG.", minWords: 4 },
          { key: "regulatory", label: "The regulatory question to ask", hint: "Is it a device?", minWords: 4 },
        ],
        model: {
          safe: "Drafting handover summaries from the nurse's notes (nurse verifies before handover); drafting discharge paperwork from clinician-entered data; summarising a long record for a clinician to check; templated family-update letters (clinician-approved).",
          unsafe: "Prioritising patients by acuity; suggesting whether to escalate a deteriorating patient; interpreting observations or scores as the decision; drafting anything clinical that isn't checked by the responsible clinician.",
          governance: "The ward's clinical governance and the trust's digital / IG teams approve the documentation uses. Any use that could influence clinical decisions goes to a formal clinical safety assessment.",
          regulatory: "'Is this software intended to inform a clinical decision?' If yes, it's likely a medical device and a general AI tool used this way is non-compliant.",
        },
      },
      // AI-role ladder — from `demonstrate`'s GP-practice walkthrough.
      roleMap: [
        { label: "Drafting referral letters, hospital-letter summaries, recall messages", role: "do-it" },
        { label: "Every AI-drafted letter is read and signed by the GP", role: "check" },
        { label: "Symptom-checking, pre-triage by urgency, interpreting blood results", role: "stay-out" },
      ],
    },
    challenges: [
      fieldsChallenge("HC1.1", "Reproduce", "Map AI use for a real clinical setting",
        "Take a clinical setting you know. Map where AI can and can't be used.",
        "Strong answer: safe uses are admin / drafting / summarising-for-verification with a clinician check on every output; decision-informing, triage, diagnosis and direct patient advice are ruled out; clinical governance approval is required; and the 'is this a regulated device' question is asked.",
        [
          { key: "setting", label: "The setting", hint: "One line.", minWords: 3 },
          { key: "safe", label: "Tasks + the check on each", hint: "Clinician verification.", minWords: 6 },
          { key: "unsafe", label: "Tasks ruled out + why", hint: "Decision-informing.", minWords: 5 },
          { key: "governance", label: "Approval + the regulatory question", hint: "Governance + device question.", minWords: 4 },
        ],
        [
          { label: "Safe uses have a clinician check on every output" },
          { label: "Decision-informing, triage, diagnosis and direct patient advice are ruled out" },
          { label: "Clinical governance approval required; the 'regulated device' question asked" },
        ],
        "independent"),
      scenarioChallenge("HC1.2", "Create", "The website chatbot gave clinical advice",
        "A clinic added a general AI chatbot to its website that answers patients' health questions. It advised someone with cardiac symptoms to rest and take ibuprofen.",
        "What's wrong here beyond the one bad answer?",
        [
          { id: "a", label: "The chatbot needs better medical training data", ok: false, why: "A better-informed general chatbot giving clinical advice is still an unregulated medical device making unsafe decisions." },
          { id: "b", label: "A general AI tool giving patients clinical advice is an unregulated medical device operating outside clinical governance — it should be removed, and any patient-facing clinical information must be clinician-authored and governed", ok: true, why: "The category of use is the problem, not the quality of one answer." },
          { id: "c", label: "Add a disclaimer that it's not medical advice", ok: false, why: "A disclaimer doesn't make it safe or lawful when patients act on it." },
        ],
        "transferable"),
    ],
  },

  {
    id: "HC2", name: "Clinical documentation and scribing",
    canDo: "Use AI scribes and documentation tools with the checks that keep the record accurate and the clinician accountable.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI scribe generated a consultation note that read well and included a \"patient denies chest pain\" line — the clinician had never asked, and the patient hadn't said it. It went into the record unchecked. Months later it mattered.",
        point: "AI scribes produce fluent, complete-looking notes that contain things that were never said — and the note is a legal record the clinician signs.",
      },
      explain: {
        paras: [
          "AI scribes (ambient or dictation) are genuinely useful, with discipline.",
          "**The clinician reviews and edits every note before signing** — reading for invented content ('denies X', normal findings not actually examined), missing content, and wrong specifics (doses, laterality, dates).",
          "**Negatives and normals are the danger** — AI adds 'no red flags', 'systems review unremarkable' as boilerplate; only keep what was actually done. **Patient consent** to AI scribing where required. **The audio and transcript** are patient data. **The clinician is accountable for the note** regardless of what the AI produced.",
        ],
        keyIdea: "AI scribe drafts; the clinician reads and edits every note before signing — hunting invented negatives / normals, missing content, wrong specifics. Consent where required; audio / transcript is patient data; the clinician is accountable regardless.",
      },
      demonstrate: {
        task: "A clinician using an ambient AI scribe in outpatient clinics.",
        steps: [
          { move: "Consent", think: "Patient can decline.", result: "The patient is told an AI scribe is being used and can decline." },
          { move: "The draft", think: "Structured note.", result: "The scribe produces a structured note after the consultation." },
          { move: "The review", think: "Edit before signing.", result: "The clinician cuts 'cardiovascular exam normal' (not performed today), fixes 'left knee' (was the right), adds the safety-netting advice given but not captured." },
          { move: "Sign", think: "Accountable.", result: "The clinician signs the corrected note and is accountable for it." },
        ],
        full: "The scribe saved the typing. The clinician removed an examination that didn't happen, corrected the laterality, added missing safety-netting, and signed — accountable for the final record, not the AI's draft.",
      },
      deconstruct: [
        "'Cardiovascular exam normal' not performed is a fabricated finding in a legal record.",
        "Laterality errors (left / right) are exactly what AI transcription gets wrong and what causes harm.",
        "The clinician signs, so the clinician owns every line.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Your department is rolling out an AI dictation / scribe tool for clinic letters and notes.",
        fields: [
          { key: "review", label: "What the clinician checks in every note before signing", hint: "The whole note.", minWords: 6 },
          { key: "dangers", label: "The specific error types to hunt", hint: "Negatives, normals, specifics.", minWords: 5 },
          { key: "consent", label: "The consent / privacy handling", hint: "Opt-out; data retention.", minWords: 4 },
          { key: "accountability", label: "Who owns the note", hint: "The signing clinician.", minWords: 3 },
        ],
        model: {
          review: "Read the whole note against memory of the consultation. Check the history, the examination findings, the plan, the medications (name, dose, route), the follow-up and safety-netting. Edit anything wrong or missing.",
          dangers: "Invented negatives ('denies...', 'no...') and normals ('unremarkable', 'within normal limits') that weren't actually assessed; wrong laterality; wrong drug doses or frequencies; a plan that's slightly off; a symptom attributed to the wrong body system.",
          consent: "Patients informed AI scribing is in use and able to opt out; audio and transcripts stored per the trust's retention and security policy; covered in the privacy notice.",
          accountability: "The signing clinician is fully accountable for the note. 'The AI scribe generated it' is not a defence for an inaccurate record.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HC2.1", "Reproduce", "Safe use of an AI scribe for real documentation",
        "Take a documentation use for an AI scribe. Plan the safe-use checks.",
        "Strong answer: the clinician reviews and edits every note before signing; the check specifically hunts invented negatives / normals, wrong specifics (dose, laterality, dates), and missing content; consent and data retention are addressed; and the clinician's accountability for the record is explicit.",
        [
          { key: "use", label: "The use", hint: "One line.", minWords: 3 },
          { key: "review", label: "The pre-sign check", hint: "The whole note.", minWords: 5 },
          { key: "errorhunt", label: "The specific error types", hint: "Negatives, specifics, gaps.", minWords: 5 },
          { key: "consentprivacy", label: "Consent + data handling", hint: "Opt-out, retention.", minWords: 4 },
        ],
        [
          { label: "The clinician reviews and edits every note before signing" },
          { label: "The check hunts invented negatives / normals, wrong specifics, missing content" },
          { label: "Consent and data retention addressed; clinician accountability explicit" },
        ],
        "independent"),
      critiqueChallenge("HC2.2", "Adapt", "Find the risks in a scribe rollout",
        "Here is how the scribe is being used. Find every risk.",
        "\"The AI scribe has been great — notes are done by the time the patient leaves. Clinicians give them a quick glance and sign. It auto-fills a full systems review and normal examination findings for every encounter, which saves loads of time. Audio is kept in the app indefinitely for quality purposes.\"",
        [
          { label: "'a quick glance and sign' — not a review; a legal record needs to be read properly", signals: ["quick glance", "not a review", "read properly", "legal record", "rubber stamp", "sign without reading"] },
          { label: "Auto-filled systems review and normal exam findings for every encounter = fabricated clinical findings", signals: ["auto-fill", "systems review", "normal findings", "fabricated", "didn't happen", "not examined", "every encounter"] },
          { label: "Documenting exams that didn't happen is a serious integrity and safety issue", signals: ["didn't happen", "integrity", "safety", "not performed", "false record", "clinical governance"] },
          { label: "Audio kept 'indefinitely' — patient data with no retention limit, likely non-compliant", signals: ["indefinitely", "retention", "no limit", "patient data", "non-compliant", "how long"] },
          { label: "No mention of patient consent to AI scribing", signals: ["consent", "patient consent", "opt out", "informed", "not mentioned"] },
        ],
        "transferable", { text: `"The AI scribe drafts notes during the visit; the clinician reads and edits each note before signing — not a quick glance. It suggests a systems-review and exam template based on what was discussed, but the clinician fills in only what was actually examined. Patients are told about and asked to consent to AI scribing at the start of the visit. Audio is deleted after a fixed retention period once the note is finalised."`, changes: ["“quick glance and sign” becomes an actual read-and-edit before signing", "Auto-filled normal findings removed — only what was actually examined is documented", "Patient consent to AI scribing is added", "Indefinite audio retention becomes a fixed, defined period"] }),
    ],
  },

  {
    id: "HC3", name: "Summarising records and correspondence",
    canDo: "Use AI to summarise clinical records and letters — with the summary verified against the source before anyone acts on it.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI summary of a new patient's 200-page record said \"no known drug allergies.\" The record actually documented a penicillin anaphylaxis on page 140. A prescription was written based on the summary.",
        point: "An AI summary of a clinical record is a starting index, not a substitute for the record — and it will miss or misstate the one thing that matters.",
      },
      explain: {
        paras: [
          "AI can make a long record navigable — a timeline, a problem list, a medication history, key results.",
          "But: **safety-critical items are checked against the source, always** — allergies, current medications, key diagnoses, resuscitation status, safeguarding flags. Never act on these from a summary.",
          "**The summary points to the source** — every item links to where it came from. **Absence in the summary ≠ absence in the record** — 'no allergies mentioned' means the AI didn't surface one, not that there isn't one. **The clinician using it is responsible** for what they act on.",
        ],
        keyIdea: "AI summarises the record for navigation; safety-critical items (allergies, meds, key diagnoses, resus status, safeguarding) are always verified against the source; the summary links to sources; absence in the summary is not absence in the record; the clinician owns what they act on.",
      },
      demonstrate: {
        task: "A clinician using an AI summary of a transferred patient's records.",
        steps: [
          { move: "Use the summary", think: "Fast orientation.", result: "Get the timeline, the problem list, the recent results." },
          { move: "Verify the safety-critical", think: "Against the source.", result: "Open the source for allergies, current meds, and the main diagnoses — confirm each against the actual documents." },
          { move: "The allergy check", think: "The highest-risk item.", result: "Summary says 'NKDA'; searching the record finds a penicillin allergy in an old discharge summary — the summary was wrong." },
          { move: "Act on the source", think: "Not the summary.", result: "The prescribing decision uses the verified allergy status from the record." },
        ],
        full: "The summary oriented the clinician fast. Every safety-critical item was checked against the source — which caught a missed penicillin allergy. Nothing that could harm the patient was acted on from the summary alone.",
      },
      deconstruct: [
        "'NKDA' in a summary is the highest-risk possible error — it has to be verified every time.",
        "The summary linking to page 140 is what makes the check take seconds instead of an hour.",
        "The clinician acts on the record, using the summary only to find things faster.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Your team wants AI to summarise incoming specialist letters into the GP record.",
        fields: [
          { key: "use", label: "What the summary is for", hint: "Triage the inbox faster.", minWords: 4 },
          { key: "safetycritical", label: "What's always checked against the letter", hint: "Meds, diagnoses, actions.", minWords: 5 },
          { key: "linking", label: "How the summary connects to the source", hint: "Quote or link.", minWords: 4 },
          { key: "responsibility", label: "Who's accountable for acting on it", hint: "The actioning GP.", minWords: 3 },
        ],
        model: {
          use: "A short summary of each letter — the specialist's assessment, any diagnosis, medication changes, actions for the GP, and follow-up — so the GP can process the inbox faster.",
          safetycritical: "Any medication started / stopped / changed, any new diagnosis, any 'GP to arrange / monitor X', any red-flag safety-netting — the GP reads that part of the actual letter, not just the summary.",
          linking: "The summary quotes or links the exact sentence in the letter for each action item, so verifying is a glance.",
          responsibility: "The GP who actions the letter is responsible for what they do. The summary is a triage aid; the letter is the record.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HC3.1", "Reproduce", "Safe record-summarisation for a real use",
        "Take a record-summarisation use. Plan the safe-use approach.",
        "Strong answer: safety-critical items (allergies, meds, key diagnoses, resus, safeguarding) are always verified against the source, never acted on from the summary; the summary links to its sources; the risk that absence-in-summary ≠ absence-in-record is stated; and the acting clinician is accountable.",
        [
          { key: "use", label: "The use", hint: "One line.", minWords: 3 },
          { key: "alwaysverify", label: "The safety-critical items checked against source", hint: "Allergies, meds, diagnoses.", minWords: 5 },
          { key: "linking", label: "How the summary points to the source", hint: "Quote or link.", minWords: 4 },
          { key: "accountability", label: "Who owns acting on it", hint: "The clinician.", minWords: 3 },
        ],
        [
          { label: "Safety-critical items always verified against source, never acted on from the summary" },
          { label: "The summary links to its sources; absence-in-summary ≠ absence-in-record is stated" },
          { label: "The acting clinician is accountable" },
        ],
        "independent"),
      scenarioChallenge("HC3.2", "Create", "The summary missed a critical allergy",
        "A prescription was written based on an AI record summary that said 'no known drug allergies.' The record documented a penicillin anaphylaxis. The patient was harmed.",
        "What has to change?",
        [
          { id: "a", label: "Use a more capable AI model for summarisation", ok: false, why: "No model is reliable enough that a safety-critical negative can be trusted without checking the source." },
          { id: "b", label: "Safety-critical items (allergies, meds, key diagnoses) are always verified against the source record and never acted on from a summary; summaries link to sources to make that fast", ok: true, why: "Build the source-verification into how the summary is used." },
          { id: "c", label: "Add 'verify independently' to the summary's footer", ok: false, why: "A footer note isn't a process; the verification has to be built into how the summary is used." },
        ],
        "transferable"),
    ],
  },

  {
    id: "HC4", name: "Patient-facing information and communication",
    canDo: "Use AI to help produce patient information and correspondence — clinician-approved, accurate, accessible, and never a substitute for clinical advice.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI-generated patient leaflet about a medication listed a dose range that was wrong for the local formulary, omitted a key interaction warning, and was written at a reading level most patients couldn't follow. It was printed and handed out for a month.",
        point: "AI writes patient information that reads professionally and contains dosing errors, missing warnings, and language patients can't use.",
      },
      explain: {
        paras: [
          "AI can help draft: appointment and results letters (from clinician-supplied facts), patient-education material, pre / post-procedure instructions, translated versions, plain-language rewrites.",
          "The rules: **a clinician approves every piece of clinical patient information** against the local formulary / guidelines; **dosing, interactions, warnings and red-flag advice are checked line by line**; **accessibility** — check the reading level (aim ~age 11), and that translations are clinically accurate not just fluent.",
          "**It never replaces the consultation** — 'here's a leaflet' is not 'here's advice for your situation'. **Safety-netting** — 'if X happens, do Y' advice is explicit and correct.",
        ],
        keyIdea: "AI drafts patient information; a clinician approves every clinical piece against local guidelines; dosing / interactions / warnings / safety-netting are checked line by line; reading level and translation accuracy are checked; it never replaces the consultation.",
      },
      demonstrate: {
        task: "Producing a post-operative instruction sheet with AI.",
        steps: [
          { move: "Draft", think: "From the protocol.", result: "AI drafts the sheet from the surgical team's standard post-op protocol." },
          { move: "Clinical check", think: "Against the protocol.", result: "The AI's 'resume normal activity after 3 days' contradicts the protocol's '2 weeks'. Corrected." },
          { move: "Safety-netting", think: "Complete and correct.", result: "Confirm the 'call us / go to A&E if...' section lists the right warning signs, completely." },
          { move: "Accessibility", think: "Can patients use it?", result: "Check the reading level and that key actions are clear; produce the checked translations." },
        ],
        full: "AI drafted the structure. A surgeon corrected an instruction that contradicted the protocol, the safety-netting was verified as complete and correct, and the reading level and translations were checked before a single sheet was handed out.",
      },
      deconstruct: [
        "'Resume activity after 3 days' vs '2 weeks' is the kind of confident, plausible, harmful error AI makes.",
        "The safety-netting section is the highest-stakes part — it has to be complete.",
        "A fluent translation that's clinically inaccurate is worse than none.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want to use AI to create plain-language versions of your clinic's existing patient leaflets.",
        fields: [
          { key: "aidoes", label: "What AI does", hint: "From the approved source.", minWords: 4 },
          { key: "clinicalcheck", label: "What a clinician verifies", hint: "Nothing lost in simplification.", minWords: 5 },
          { key: "accessibility", label: "What you check about readability and translation", hint: "Reading age, clinical accuracy.", minWords: 4 },
          { key: "boundary", label: "How you keep it from replacing advice", hint: "General info + contact us.", minWords: 4 },
        ],
        model: {
          aidoes: "Rewrites the existing clinician-approved leaflets into plain language at a lower reading level, and drafts translations. It works from the approved source, not from scratch.",
          clinicalcheck: "A clinician confirms the plain-language version still says the same clinically — no dose, warning, timeframe or safety-netting instruction has been lost, softened or changed. Same for each translation.",
          accessibility: "Reading age around 11; short sentences; key actions as a clear list; important warnings not buried. Test with a patient representative if possible.",
          boundary: "Every leaflet says it's general information and to contact the clinic / GP about their specific situation. It supports the consultation; it doesn't stand in for it.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HC4.1", "Reproduce", "Produce checked patient information with AI",
        "Take a piece of patient information you'd produce. Plan how AI drafts it and how it's checked.",
        "Strong answer: a clinician approves every clinical piece against local guidelines; dosing, interactions, warnings and safety-netting are checked line by line; reading level and translation clinical-accuracy are checked; and the information doesn't substitute for the consultation.",
        [
          { key: "piece", label: "The piece", hint: "One line.", minWords: 3 },
          { key: "aidraft", label: "What AI drafts, from what source", hint: "The approved source.", minWords: 4 },
          { key: "clinicalcheck", label: "Line-by-line checks", hint: "Dosing, warnings, safety-netting.", minWords: 5 },
          { key: "accessibility", label: "Readability + translation checks", hint: "Reading age, accuracy.", minWords: 4 },
        ],
        [
          { label: "A clinician approves every clinical piece against local guidelines" },
          { label: "Dosing, interactions, warnings and safety-netting checked line by line" },
          { label: "Reading level and translation accuracy checked; doesn't substitute for the consultation" },
        ],
        "independent"),
      critiqueChallenge("HC4.2", "Adapt", "Find the problems in an AI patient leaflet process",
        "Here is how patient leaflets are produced. Find every problem.",
        "\"We use AI to generate patient leaflets on demand — a receptionist types the topic, the AI writes the leaflet, and it prints. It covers medications, conditions, and aftercare. Patients love how quick it is. We spot-check a few each week.\"",
        [
          { label: "No clinician approval before the leaflet reaches the patient — most go out unchecked", signals: ["no clinician approval", "unchecked", "spot-check a few", "before the patient", "clinical oversight", "sign-off"] },
          { label: "A receptionist typing a topic and printing means no clinical oversight of medication content", signals: ["receptionist", "no clinical oversight", "medication", "types the topic", "not a clinician", "who writes it"] },
          { label: "On-demand generation of clinical content is effectively an unregulated advice tool", signals: ["on demand", "unregulated", "advice tool", "generated fresh", "medical device", "each time"] },
          { label: "Dosing and interaction information generated fresh each time will contain errors", signals: ["dosing", "interaction", "generated fresh", "errors", "each time", "inconsistent", "wrong dose"] },
          { label: "No source — the AI writes from its training, not the local formulary / guidelines", signals: ["no source", "training", "formulary", "guidelines", "not from the approved", "makes it up"] },
        ],
        "transferable", { text: `"A receptionist can request a leaflet topic, but a clinician (or pharmacist for medication leaflets) reviews and approves the AI-drafted content against the local formulary/guidelines before it reaches a patient — every leaflet, not a sample. Medication and dosing information is checked against the formulary, not generated fresh from the AI’s general knowledge each time."`, changes: ["Every leaflet gets clinical approval before reaching a patient, not a weekly spot-check", "A clinician or pharmacist, not a receptionist alone, is the approval point", "Medication/dosing content is checked against the actual formulary", "Removes the on-demand, unregulated framing — approval happens every time"] }),
    ],
  },

  {
    id: "HC5", name: "Governance, safety and the incident path",
    canDo: "Put the governance around clinical AI use: risk assessment, clinician accountability, an incident process, and knowing when to stop.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI documentation tool started producing subtly garbled medication lists after a vendor update. Three clinicians noticed something \"felt off\" but there was no way to report it, no owner, and no process. It took six weeks and a near-miss before anyone connected the reports.",
        point: "Clinical AI without governance isn't a tool, it's an exposure — nobody owns it, problems don't get reported, and there's no way to turn it off.",
      },
      explain: {
        paras: [
          "For any AI used in a clinical setting: **a clinical safety case** — what could go wrong, who could be harmed, how likely, what mitigations; **a named clinical owner** accountable for the tool's safe use; **clinician accountability preserved** — the clinician using the output is responsible for it, always.",
          "**An incident / near-miss route** — how a clinician reports 'this output was wrong', where it goes, who acts; **monitoring** — especially after vendor updates, which can change behaviour silently; **a kill switch** — the ability to stop and fall back to the manual process; **information governance** — patient data handling, DPIA, contracts.",
          "The question for every clinical AI use: if it produced a harmful output tomorrow, would we catch it, could we stop it, and does someone own it?",
        ],
        keyIdea: "Clinical AI needs a safety case, a named clinical owner, preserved clinician accountability, an incident / near-miss route, monitoring (especially post-update), a kill switch to the manual process, and IG / DPIA. Test: if it harmed someone tomorrow, would we catch it, stop it, and does someone own it?",
      },
      demonstrate: {
        task: "Governing an AI scribe rollout across a department.",
        steps: [
          { move: "Safety case", think: "Name the harms.", result: "Document the risks — fabricated content, missed content, wrong specifics — and the mitigations (mandatory clinician review before signing, error-reporting route)." },
          { move: "Owner", think: "Named accountability.", result: "A consultant is the named clinical safety owner for the scribe." },
          { move: "Incident route", think: "How a bad note is reported.", result: "A one-click 'report a bad note' that goes to the owner and the clinical governance log; reviewed weekly, escalated if a pattern." },
          { move: "Monitoring + kill switch", think: "Catch and stop.", result: "Check note quality after every vendor update; if error rate rises or a serious near-miss occurs, revert to manual documentation with one instruction." },
        ],
        full: "The scribe runs inside a safety case, with a named consultant owner, a working error-reporting route, post-update monitoring, and a tested fallback to manual documentation. If it goes wrong, it's caught, owned and stoppable.",
      },
      deconstruct: [
        "The safety case forces you to name what could go wrong before it does.",
        "The incident route is what connects the 'felt off' reports before a near-miss.",
        "Monitoring after vendor updates catches silent behaviour changes.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Your organisation is about to deploy an AI tool that summarises patient records for clinicians across several departments.",
        fields: [
          { key: "safetycase", label: "What the risk assessment covers", hint: "Harms, who's affected, mitigations.", minWords: 6 },
          { key: "owner", label: "Who's accountable and for what", hint: "Named safety officer + local owners.", minWords: 5 },
          { key: "incident", label: "The near-miss / incident process", hint: "Route, timing, themes.", minWords: 5 },
          { key: "stopmonitor", label: "Monitoring and the kill switch", hint: "Post-update; revert to manual.", minWords: 5 },
        ],
        model: {
          safetycase: "Risks: missed safety-critical item (allergy, med, diagnosis), misstated item, over-trust leading to acting on the summary without checking source. Mitigations: mandatory source-verification for safety-critical items, summary-to-source linking, clinician training, audit of use. Formal clinical safety assessment.",
          owner: "A named clinical safety officer accountable for the tool; departmental clinical leads as local owners; the clinician using any summary remains accountable for what they act on.",
          incident: "A route for clinicians to flag a wrong or misleading summary — to the safety officer and the risk system — reviewed within an agreed time, with themes reported to clinical governance. Near-misses count.",
          stopmonitor: "Ongoing audit of summary accuracy against source (sampled); mandatory re-check after any vendor model update; a defined trigger and one-step process to disable the tool and revert to clinicians reading full records.",
        },
      },
    },
    challenges: [
      fieldsChallenge("HC5.1", "Reproduce", "Governance for a real clinical AI use",
        "Take a real or planned clinical AI use. Design its governance.",
        "Strong answer: a clinical safety case names the harms, who's affected and the mitigations; a named clinical owner is accountable and clinician accountability for outputs is preserved; there's a working incident / near-miss route; monitoring covers post-vendor-update behaviour change; and a kill switch to the manual process exists.",
        [
          { key: "use", label: "The use", hint: "One line.", minWords: 3 },
          { key: "safetycase", label: "Risks + mitigations", hint: "The harms, named.", minWords: 5 },
          { key: "owner", label: "Named accountability", hint: "Clinical owner.", minWords: 4 },
          { key: "incident", label: "The reporting route", hint: "Where a bad output goes.", minWords: 4 },
          { key: "stopmonitor", label: "Monitoring + kill switch", hint: "Post-update; manual fallback.", minWords: 4 },
        ],
        [
          { label: "A safety case names the harms, who's affected and the mitigations" },
          { label: "A named clinical owner; clinician accountability for outputs preserved" },
          { label: "A working incident route; post-update monitoring; a kill switch to manual" },
        ],
        "independent"),
      scenarioChallenge("HC5.2", "Create", "The tool degraded silently for six weeks",
        "An AI documentation tool started garbling medication lists after a vendor update. Clinicians noticed but there was no reporting route, no owner, and no process. A near-miss finally triggered investigation six weeks later.",
        "What governance was missing?",
        [
          { id: "a", label: "The vendor should have tested the update better", ok: false, why: "True, but the organisation had no owner, no incident route, and no post-update monitoring — those are the fixable gaps that let a noticed problem run for six weeks." },
          { id: "b", label: "A named clinical owner, an incident / near-miss route clinicians know about, monitoring after vendor updates, and a kill switch — so a noticed problem is connected, owned and stopped in days", ok: true, why: "Build the governance that turns three 'felt off' reports into an action." },
          { id: "c", label: "Clinicians should have raised it through normal channels", ok: false, why: "'Normal channels' clearly didn't exist for this; the system has to provide the route." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: HEALTH_COMPETENCIES, capstoneId: "HEALTHCAP" };
};
