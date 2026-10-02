/* Subject: edleadership
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["edleadership"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const EDL_COMPETENCIES = [
  {
    id: "EDL1", name: "Evaluate AI/ed-tech vendor claims before adopting",
    canDo: "Check a vendor's AI claims — pedagogical benefit, data handling — against real evidence before committing a school or district to adoption, not the vendor's own marketing.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A vendor's sales deck claimed \"95% improvement in reading scores\" from its AI tutoring tool. AI helped draft the district's adoption memo, repeating the figure as-is. Nobody checked the study behind it — it turned out to be a vendor-funded pilot with 12 students and no control group. The district signed a 3-year contract substantially on the strength of that one number.",
        point: "A vendor's own numbers are marketing until someone checks the actual study behind them.",
      },
      explain: {
        paras: [
          "Ask for the **actual study or evidence** behind any headline claim — sample size, whether there was a control group, and who funded it.",
          "Check the **data-handling and privacy claims against the real data-processing agreement**, not the marketing deck — the enforceable terms live in the contract.",
          "Distinguish **\"improved scores in a small vendor pilot\"** from **\"will improve scores here\"** — population, context, and implementation fidelity all matter.",
          "Specific data-privacy obligations (what can be collected, retained, shared) vary by jurisdiction — check with legal/compliance for what actually applies here, rather than assuming a rule from elsewhere.",
        ],
        keyIdea: "A vendor's own numbers are marketing until checked against the actual study or contract — a small vendor-funded pilot doesn't predict district-wide outcomes.",
      },
      demonstrate: {
        task: "Evaluating an AI reading-tutor vendor's \"95% improvement\" claim.",
        steps: [
          { move: "Ask for the study behind the number", think: "Not just the headline.", result: "a 12-student pilot, vendor-funded, no control group" },
          { move: "Check the data-processing agreement", think: "Not the marketing deck.", result: "broad data-sharing rights to unnamed third parties" },
          { move: "Compare to district context", think: "Would this generalize?", result: "the pilot population and this district's student population differ significantly" },
          { move: "Flag both before recommending", think: "Evidence and data terms.", result: "adoption memo revised to name both issues before any recommendation" },
        ],
        full: "The 95% figure was traced to a 12-student, vendor-funded pilot with no control group, and the data agreement was found to grant broad third-party sharing rights — both flagged in the adoption memo before any recommendation was made.",
      },
      deconstruct: [
        "Tracing a headline number back to its actual study is what catches a vendor-pilot result being sold as a general outcome.",
        "The contract, not the marketing deck, is what actually governs student data — that's where the real check belongs.",
        "A small, vendor-funded pilot needs to be weighed against how different this district's population and context are before it means anything locally.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A vendor claims their AI grading tool \"reduces teacher workload by 10 hours per week,\" citing an internal case study.",
        fields: [
          { key: "check", label: "What you'd check before trusting this figure", hint: "Study details.", minWords: 8 },
          { key: "showwork", label: "What you'd ask the vendor to provide", hint: "To make it checkable.", minWords: 5 },
          { key: "redflag", label: "A red flag that would make you discount the claim", hint: "Be specific.", minWords: 6 },
        ],
        model: {
          check: "Whether the case study had an independent evaluator or was vendor-produced, what subject/grade level it covered, how workload was actually measured, and how many teachers were involved.",
          showwork: "The raw study or evaluation report, the sample size and methodology, and the actual data-processing agreement covering what student data the tool touches.",
          redflag: "If the study was conducted and published solely by the vendor with no independent verification, or if the sample size is too small to generalize to a whole district.",
        },
      },
    },
    challenges: [
      fieldsChallenge("EDL1.1", "Reproduce", "Evaluate a real vendor claim",
        "Take a real (or plausible) AI/ed-tech vendor's claim. Check the evidence behind it and the actual data-handling terms before recommending adoption.",
        "Strong answer: the evidence behind the claim is checked (sample size, control group, who funded it), not taken at face value; the actual data-processing terms are checked, not just the marketing language.",
        [
          { key: "claim", label: "The vendor's claim", hint: "Quote it.", minWords: 5 },
          { key: "evidence", label: "What you checked about the evidence behind it", hint: "Be specific.", minWords: 8 },
          { key: "data", label: "What you checked in the actual data-handling terms", hint: "Not the marketing copy.", minWords: 8 },
        ],
        [
          { label: "Evidence behind the claim actually checked, not taken at face value" },
          { label: "Actual data-processing terms checked, not just marketing language" },
          { label: "Vendor claim compared honestly to this context" },
        ],
        "independent"),
      critiqueChallenge("EDL1.2", "Adapt", "An adoption memo built on unverified vendor claims",
        "Here's a drafted adoption memo. Find what's wrong with how it uses the vendor's claims.",
        "\"Recommendation: adopt the AI tutoring platform district-wide. The vendor reports a 95% improvement in reading scores, and their privacy policy states student data is handled responsibly.\"",
        [
          { label: "The 95% figure isn't traced to any real study — sample size, control group, or funding source", signals: ["no study cited", "sample size unknown", "not traced", "unverified figure", "no control group", "who funded it"] },
          { label: "'Handled responsibly' is vague marketing language, not a check of the actual data agreement", signals: ["vague language", "not the contract", "actual agreement", "marketing language", "not a real check", "what the contract says"] },
          { label: "No comparison between the vendor's pilot context and this district's actual population", signals: ["different population", "different context", "won't generalize", "not comparable", "this district", "does it apply here"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "EDL2", name: "Draft AI-use policy grounded in named, real risks",
    canDo: "Draft a school/district AI-use policy that names the actual tools, data flows, and open questions in use — not a generic template copied from elsewhere.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted a generic \"responsible AI use\" policy, largely copied in spirit from templates found online. It said nothing about the district's actual open question — students using AI on take-home essays with no clear guidance — and nothing about which student data the classroom AI tools already in use were sending to third parties.",
        point: "A generic values statement doesn't answer the specific questions staff and parents are actually asking.",
      },
      explain: {
        paras: [
          "Ground the policy in **this school's actual tools already in use**, and the **actual incidents or questions** that prompted the need for a policy — not a generic template.",
          "Name **concrete risks**: which student data leaves district control and to whom, unequal access to AI tools across students, and academic integrity for AI-assisted work.",
          "State **what's allowed, what isn't, and what happens when a question arises** — specific enough to actually guide a decision, not \"in the spirit of academic integrity.\"",
          "Specific data-privacy obligations vary by jurisdiction — check with legal/compliance for what actually applies here before asserting a specific rule in the policy.",
        ],
        keyIdea: "A real policy names this school's actual tools, actual data flows, and actual open questions — not generic responsible-AI language copied from elsewhere.",
      },
      demonstrate: {
        task: "Drafting an AI-use policy after a take-home-essay incident.",
        steps: [
          { move: "Identify the actual open question", think: "What prompted this?", result: "students used AI on take-home essays with no existing guidance" },
          { move: "Check the district's actual AI tools", think: "What data do they already send out?", result: "one classroom tool sends student writing samples to a third-party API" },
          { move: "Name the concrete risks", think: "Not generic principles.", result: "data leaving district control, unequal device/AI access, unclear AI-assisted-work rules" },
          { move: "Write specific rules", think: "Actionable, not vague.", result: "named which tools are approved, what AI-assistance disclosure is required on essays, and who to ask when unsure" },
        ],
        full: "The policy was grounded in the actual incident (ungoverned AI use on essays) and the district's actual tool (sending writing samples to a third party), with specific, named rules replacing generic \"responsible use\" language.",
      },
      deconstruct: [
        "Starting from the actual incident and actual tools in use is what makes a policy address the real, current risk instead of a hypothetical one.",
        "Naming concrete risks (data, access, integrity) gives staff and parents something specific to act on.",
        "Specific rules with a named point of contact are what make a policy usable in an actual moment of uncertainty.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Your school just adopted an AI writing-feedback tool. There's no current policy on student AI use.",
        fields: [
          { key: "risks", label: "The concrete risks specific to this tool/situation", hint: "Data, access, integrity.", minWords: 8 },
          { key: "rules", label: "Specific, actionable rules you'd write", hint: "Not generic principles.", minWords: 8 },
          { key: "contact", label: "Who staff/students should ask when unsure", hint: "A real point of contact.", minWords: 4 },
        ],
        model: {
          risks: "What student writing data the tool sends to its provider and how long it's retained; whether all students have equal access to the tool outside class; and whether AI-assisted feedback counts as help or as the work itself for grading purposes.",
          rules: "Name the approved tool and prohibit others without approval; require students to disclose AI-assistance used on graded work above a stated threshold; specify the tool is feedback-only, not a substitute for the student's own draft.",
          contact: "A named staff member (e.g. the academic-technology lead) as the point of contact for any question not covered by the policy.",
        },
      },
    },
    challenges: [
      fieldsChallenge("EDL2.1", "Reproduce", "Draft a real, grounded AI-use policy section",
        "Take a real (or plausible) school/district AI situation. Draft a policy section grounded in the actual tool, actual data flow, and actual open question — not generic principles.",
        "Strong answer: the policy names the actual tool/situation prompting it; concrete risks (data, access, integrity) are named specifically; rules are actionable, not vague, and a real point of contact is given.",
        [
          { key: "situation", label: "The actual tool/incident prompting this policy", hint: "Specific.", minWords: 6 },
          { key: "risks", label: "The concrete, named risks", hint: "Not generic.", minWords: 8 },
          { key: "rules", label: "The specific, actionable rules", hint: "With a point of contact.", minWords: 10 },
        ],
        [
          { label: "Names the actual tool/situation prompting the policy" },
          { label: "Concrete risks named specifically, not generically" },
          { label: "Rules are actionable, with a real point of contact" },
        ],
        "independent"),
      critiqueChallenge("EDL2.2", "Adapt", "A generic, templated AI-use policy",
        "Here's a drafted policy excerpt. Find what's wrong with it.",
        "\"Our school is committed to the responsible and ethical use of artificial intelligence in education, in the spirit of academic integrity and student wellbeing.\"",
        [
          { label: "No mention of which actual tools are in use or approved", signals: ["which tools", "no specific tool", "doesn't name", "actual tools used", "not specified which"] },
          { label: "No concrete data-handling rule — what's collected, retained, or shared", signals: ["no data rule", "what data", "doesn't say what's collected", "data handling not specified", "no mention of sharing"] },
          { label: "\"In the spirit of\" gives no actionable rule for an actual situation", signals: ["not actionable", "too vague", "no actual rule", "gives no guidance", "doesn't say what to do", "vague language"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "EDL3", name: "Communicate AI decisions honestly to parents and staff",
    canDo: "Communicate an AI-adoption or policy decision without overstating the benefit or understating the risk, and disclose data practices plainly.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A letter to parents said a new AI tutoring tool would \"personalize learning for every student,\" without mentioning it was still in a pilot phase or what student data it collected. A parent later discovered writing samples were being shared with a third-party AI provider and felt misled — the letter had never mentioned it.",
        point: "Presenting a pilot as a proven rollout, and omitting data practices, is exactly what erodes trust when parents find out on their own.",
      },
      explain: {
        paras: [
          "State clearly **what's proven versus what's a pilot or early-stage rollout** — don't let AI-drafted language upgrade \"we're trying this\" into \"this works.\"",
          "Name **what data is collected and shared, in plain language**, in the main communication — not buried in an opt-out form nobody reads closely.",
          "Give parents and staff a **real channel to ask questions**, not just a one-way announcement.",
          "The same discipline as any client-facing deliverable: separate \"what we know\" from \"what we're recommending/trying,\" and don't let confident tone smooth over genuine uncertainty.",
        ],
        keyIdea: "Communication should distinguish what's confirmed from what's pilot-stage, and disclose data practices plainly — the same honesty discipline as any client-facing deliverable.",
      },
      demonstrate: {
        task: "Reviewing a parent letter about a new AI tutoring pilot.",
        steps: [
          { move: "Check the claim against reality", think: "Proven or pilot?", result: "\"personalizes learning for every student\" — it's a 6-week pilot with 2 classrooms, not proven district-wide" },
          { move: "Check for data disclosure", think: "Is it mentioned plainly?", result: "no mention at all of what data is collected or shared" },
          { move: "Rewrite", think: "Honest and specific.", result: "\"we're piloting this tool in 2 classrooms for 6 weeks; it collects student writing samples, shared with [vendor] under [terms]\"" },
          { move: "Add a real channel", think: "Not just an announcement.", result: "named contact and a parent Q&A session added" },
        ],
        full: "The overstated 'personalizes learning' claim was corrected to accurately describe the pilot's scope and duration, the omitted data-sharing detail was added plainly, and a real question channel was included rather than a one-way notice.",
      },
      deconstruct: [
        "Matching the claim to the actual pilot status is what prevents parents discovering the real scope later, on their own.",
        "Stating data practices plainly in the main text — not the fine print — is what makes disclosure real rather than technical.",
        "A real channel for questions is what turns an announcement into honest communication.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted this staff memo: \"Our new AI tool will significantly reduce grading time for all teachers.\" It's an opt-in pilot for 5 volunteer teachers, results not yet measured.",
        fields: [
          { key: "gap", label: "What's mismatched between the claim and reality?", hint: "Be specific.", minWords: 6 },
          { key: "rewrite", label: "The corrected memo language", hint: "Match reality.", minWords: 8 },
          { key: "channel", label: "How staff could ask questions or raise concerns", hint: "A real channel.", minWords: 5 },
        ],
        model: {
          gap: "\"Will significantly reduce grading time for all teachers\" states an unmeasured, opt-in pilot's hoped-for outcome as a settled fact applying to everyone.",
          rewrite: "\"We're piloting an AI grading-assistance tool with 5 volunteer teachers this term. We don't have results yet — we'll share what we learn before considering wider rollout.\"",
          channel: "A named contact for pilot questions, and an offer to discuss with any teacher considering opting in.",
        },
      },
    },
    challenges: [
      fieldsChallenge("EDL3.1", "Reproduce", "Rewrite a real communication to match reality",
        "Take a real (or plausible) AI-related communication to parents/staff. Check its claims against the actual rollout status and data practices, and rewrite anything overstated.",
        "Strong answer: at least one overstated claim is checked against actual status (pilot vs. proven); data practices are disclosed plainly in the main text; a real question channel is included.",
        [
          { key: "original", label: "The original communication", hint: "Quote it.", minWords: 5 },
          { key: "gap", label: "The gap between the claim and reality", hint: "Be specific.", minWords: 6 },
          { key: "rewrite", label: "The corrected communication", hint: "Honest, with data disclosed and a real channel.", minWords: 10 },
        ],
        [
          { label: "Overstated claim checked against actual pilot/proven status" },
          { label: "Data practices disclosed plainly in the main text" },
          { label: "Real question channel included, not just a one-way notice" },
        ],
        "independent"),
      scenarioChallenge("EDL3.2", "Create", "Leadership wants the announcement to sound more confident",
        "A school leader asks you to make the AI-tool announcement \"sound more confident\" before it goes out, since it currently mentions it's just a pilot.",
        "What do you do?",
        [
          { id: "a", label: "Remove the pilot language and describe it as the new standard tool", ok: false, why: "Overstating an unproven pilot as a settled rollout sets up exactly the kind of trust breach that happens when parents later learn the real scope." },
          { id: "b", label: "Keep the pilot status accurate, but make the confident parts — why it's worth trying — clearer and better explained", ok: true, why: "Confidence in the reasoning behind a pilot is compatible with honesty about its actual, limited status." },
          { id: "c", label: "Send both versions and let the leader pick which one to use", ok: false, why: "That doesn't resolve the accuracy problem — it just defers the decision about whether to overstate it." },
        ],
        "transferable"),
    ],
  },

  {
    id: "EDL4", name: "Staff AI-training rollout matched to real skill levels",
    canDo: "Design a staff AI-training rollout that matches the actual, differing skill/comfort levels in the room — not a single generic session.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A single 1-hour \"AI for teachers\" session was rolled out to the entire staff. Teachers already using AI daily were bored and disengaged. Teachers who'd never touched it left more confused than when they arrived. Adoption stalled on both ends, and the training was written off as a failure.",
        point: "One session, pitched at one level, can't serve a room with a genuinely wide range of starting skill.",
      },
      explain: {
        paras: [
          "**Assess the actual current skill/comfort level** before designing training — a quick survey, not an assumption about where staff \"probably\" are.",
          "**Differentiate**: separate tracks or tiered content for different starting points, rather than one session for everyone.",
          "Plan for **follow-up support, not a single session** — skill with a new tool develops through practice, and most of a one-off session's content doesn't survive without it.",
          "Measure what actually changed in practice afterward, not just attendance or satisfaction with the session itself.",
        ],
        keyIdea: "Training design should be grounded in the staff's actual starting skill level, differentiated for that range, and followed up — not a single generic session.",
      },
      demonstrate: {
        task: "Redesigning a stalled AI-training rollout.",
        steps: [
          { move: "Survey actual skill levels", think: "Not assumed.", result: "roughly a third already daily users, a third occasional, a third never used it" },
          { move: "Design tiered tracks", think: "Match the range.", result: "a beginner track (basics + guardrails), an intermediate track (workflow integration), an advanced track (peer-led sharing)" },
          { move: "Plan follow-up", think: "Not one-off.", result: "a monthly 20-minute check-in per track for the term" },
          { move: "Define what to measure", think: "Beyond attendance.", result: "a short follow-up survey on actual classroom use, 6 weeks later" },
        ],
        full: "The stalled single-session rollout was redesigned into three skill-matched tracks with monthly follow-up check-ins, and success was defined as measured classroom use 6 weeks later, not just session attendance.",
      },
      deconstruct: [
        "Surveying actual skill level before designing training is what prevents pitching content at the wrong group.",
        "Tiered tracks let each group get content that's actually useful to their starting point.",
        "Follow-up is what converts a single exposure into an actual change in classroom practice.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're planning AI training for a 40-person staff with no prior data on their skill levels.",
        fields: [
          { key: "assess", label: "How you'd assess actual skill levels first", hint: "Concrete method.", minWords: 6 },
          { key: "design", label: "How you'd differentiate the training", hint: "At least 2 tracks.", minWords: 8 },
          { key: "followup", label: "The follow-up plan", hint: "Not a single session.", minWords: 6 },
        ],
        model: {
          assess: "A short, anonymous pre-survey asking how often staff currently use AI tools and for what, so tracks can be built from real data rather than guesses.",
          design: "A beginner track covering basics and safe use; an intermediate/advanced track on integrating AI into existing lesson planning and grading workflows, run in parallel sessions.",
          followup: "A brief check-in session a month later per track, plus an open channel for staff to ask questions as they actually try things in their classrooms.",
        },
      },
    },
    challenges: [
      fieldsChallenge("EDL4.1", "Reproduce", "Design a real, skill-matched training rollout",
        "Take a real (or plausible) staff AI-training situation. Assess actual skill levels, design differentiated content, and plan real follow-up.",
        "Strong answer: skill levels are assessed with a real method, not assumed; the training is differentiated for at least two distinct starting points; a concrete follow-up plan is included, not just a single session.",
        [
          { key: "assess", label: "How you assessed actual skill levels", hint: "Concrete method.", minWords: 6 },
          { key: "design", label: "The differentiated training design", hint: "At least 2 tracks/tiers.", minWords: 10 },
          { key: "followup", label: "The follow-up plan", hint: "Not one-off.", minWords: 6 },
        ],
        [
          { label: "Skill levels assessed with a real method, not assumed" },
          { label: "Training differentiated for at least two distinct starting points" },
          { label: "Concrete follow-up plan, not a single session" },
        ],
        "independent"),
      scenarioChallenge("EDL4.2", "Create", "There's only budget/time for one session",
        "You're told there's only time and budget for a single 1-hour training session for all staff.",
        "What do you do?",
        [
          { id: "a", label: "Run one generic session pitched at the middle of the skill range", ok: false, why: "A middle-pitched session still leaves both the most experienced and least experienced staff underserved." },
          { id: "b", label: "Use the hour to split into 2 shorter, level-matched groups (e.g. 30 minutes each) rather than one session for everyone", ok: true, why: "Splitting the same time budget by skill level serves both groups better than one undifferentiated session." },
          { id: "c", label: "Cancel the training until more time is available", ok: false, why: "Some differentiated training within the constraint is better than none, and the constraint doesn't require an all-or-nothing choice." },
        ],
        "transferable"),
    ],
  },

  {
    id: "EDL5", name: "Handle an AI-related incident with a human decision",
    canDo: "Treat an AI-detection flag or AI-related incident as the start of an investigation, not the verdict — a human conversation and real check decide before any punitive or irreversible action.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "An AI-detection tool flagged a student's essay as \"98% AI-generated.\" A teacher used that score alone to fail the student and file an academic-integrity report, without a conversation with the student. It later turned out the essay was the student's own work — the detector's false-positive pattern is known to trigger on plain, low-perplexity prose typical of non-native English writers.",
        point: "An AI-detection score is probabilistic and known to be wrong in specific, documented ways — it is not a verdict.",
      },
      explain: {
        paras: [
          "Treat an AI-detection flag as a **reason to investigate, not a finding of fact** — detection tools have known false-positive patterns.",
          "Any **punitive or irreversible decision needs a human conversation** with the student (and a look at drafts/history where possible) before it's finalized — the same \"stays human\" discipline used for other consequential, hard-to-reverse decisions.",
          "**Document the process** — what was checked, who talked to whom — so the decision is auditable and appealable.",
          "The same discipline applies to any AI-flagged incident (a privacy flag, a content-moderation flag) — the tool opens the question, a person closes it.",
        ],
        keyIdea: "An AI flag opens an investigation, it doesn't close one — the decision stays with a human conversation and a real check, not the tool's score.",
      },
      demonstrate: {
        task: "Responding to a 98% AI-detection flag on a student essay.",
        steps: [
          { move: "Treat the flag as a starting point", think: "Not a verdict.", result: "paused any grading/disciplinary action pending investigation" },
          { move: "Have a conversation with the student", think: "Human check.", result: "student walked through their drafting process and could explain specific choices in the essay" },
          { move: "Check available history", think: "Corroborate.", result: "earlier drafts in the school's document history matched the final essay's structure and voice" },
          { move: "Decide and document", think: "Human decision, recorded.", result: "no integrity violation found; the process and reasoning were documented in case of appeal" },
        ],
        full: "The 98% flag triggered an investigation rather than an automatic penalty — a conversation with the student and a check of draft history found no violation, and the whole process was documented.",
      },
      deconstruct: [
        "Pausing action on the flag alone is what prevents an irreversible, wrong decision based on a known-unreliable score.",
        "A real conversation and history check are what a human decision actually looks like, versus rubber-stamping the tool's output.",
        "Documenting the process protects both the student (appealable) and the school (defensible) if the decision is ever questioned.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A content-moderation AI flags a student's forum post as \"harassment\" with high confidence. The consequence on file for a harassment finding is suspension.",
        fields: [
          { key: "pause", label: "What you'd pause before any consequence is applied", hint: "Be specific.", minWords: 5 },
          { key: "investigate", label: "The human check you'd do before deciding", hint: "Concrete steps.", minWords: 8 },
          { key: "document", label: "What you'd document regardless of outcome", hint: "For accountability.", minWords: 6 },
        ],
        model: {
          pause: "Any suspension or disciplinary action, until the flag has actually been reviewed by a person.",
          investigate: "Read the actual post in context, talk to the student about intent and any prior exchange it responds to, and check whether the flagged language matches the school's actual policy definition of harassment.",
          document: "What was flagged, who reviewed it, what was found in context, and the reasoning for the final decision — whether or not action was taken.",
        },
      },
    },
    challenges: [
      fieldsChallenge("EDL5.1", "Reproduce", "Handle a real AI-flagged incident with a human decision",
        "Take a real (or plausible) AI-detection or AI-flagged incident. Show the human investigation and documentation before any consequence is applied.",
        "Strong answer: the flag is treated as a starting point, not a verdict; a real human check (conversation, history, context) is described; the process and reasoning are documented regardless of outcome.",
        [
          { key: "flag", label: "The AI flag/incident", hint: "One line.", minWords: 5 },
          { key: "investigate", label: "The human investigation before any decision", hint: "Concrete steps.", minWords: 10 },
          { key: "document", label: "What was documented", hint: "For accountability/appeal.", minWords: 6 },
        ],
        [
          { label: "Flag treated as a starting point, not a verdict" },
          { label: "Real human check described (conversation, history, context)" },
          { label: "Process and reasoning documented regardless of outcome" },
        ],
        "independent"),
      scenarioChallenge("EDL5.2", "Create", "The AI tool's confidence score is very high",
        "An AI-detection tool reports 99% confidence on a serious flag. A staff member argues that's high enough to act on immediately.",
        "What do you do?",
        [
          { id: "a", label: "Act immediately — a 99% score is about as certain as these tools get", ok: false, why: "A high confidence score from a tool with known, documented false-positive patterns still isn't a substitute for a human check on this specific case." },
          { id: "b", label: "Still investigate with a human conversation and available evidence before any consequence, regardless of the score", ok: true, why: "The score's number doesn't change the discipline — a flag opens an investigation, a person closes it, every time." },
          { id: "c", label: "Act immediately but note the score for the record in case it's wrong", ok: false, why: "Recording the score doesn't undo an irreversible consequence acted on before the human check happened." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: EDL_COMPETENCIES, capstoneId: "EDLCAP" };
};
