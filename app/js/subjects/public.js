/* Subject: public
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["public"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const PS_COMPETENCIES = [
  {
    id: "PS1", name: "Drafting public-facing guidance with AI",
    canDo: "Use AI to draft public-facing guidance and citizen communications — accurate to the actual policy, in plain language, without inventing rules.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted a guidance page answering \"who qualifies for the grant\" and invented a plausible-sounding eligibility rule that wasn't in the actual scheme. It read authoritative. A citizen relied on it and was later told they didn't qualify.",
        point: "AI pattern-matches to how these schemes usually work. What this scheme actually says has to come from the real document, every time.",
      },
      explain: {
        paras: [
          "AI drafts fluent, accessible-sounding text fast. Every rule, eligibility criterion or number it states must be traced to the actual policy document — not paraphrased confidently from how similar schemes usually work.",
          "Plain language is a genuine, separate skill worth having AI help with. Simplifying wording is fine; inventing content to fill a gap in the source is not — an unanswered question in the policy stays unanswered in the guidance, flagged for a real answer.",
        ],
        keyIdea: "Feed AI the real policy text, check every stated rule and number against it, and flag genuine gaps in the source instead of guessing at an answer.",
      },
      demonstrate: {
        task: "Drafting a plain-language guidance page for a small-business grant scheme.",
        steps: [
          { move: "Feed the actual policy text", think: "Not a summary of similar schemes.", result: "Give AI the real eligibility rules and figures from the scheme document." },
          { move: "AI drafts plain language", think: "Readable version.", result: "Produces a clear, accessible draft." },
          { move: "Check every claim against the source", think: "Does each stated rule exist in the real document?", result: "AI added \"fewer than 10 employees\" — the real cap was 15; corrected." },
          { move: "Check for gaps papered over", think: "What wasn't actually in the source?", result: "The draft implied sole traders qualify; the scheme document doesn't say either way — flagged for a real policy answer, not guessed." },
        ],
        full: "The guidance was drafted in plain language from the real policy text, one incorrect figure was caught and corrected against the source, and a genuine gap in the policy was flagged rather than silently resolved.",
      },
      deconstruct: [
        "An invented eligibility rule reads exactly as authoritative as a real one — checking every stated rule against the source document is non-negotiable.",
        "A wrong cap (10 vs 15 employees) could genuinely exclude someone who qualifies — the stakes of an unchecked figure here are real.",
        "A genuine gap in the policy stays a gap in the guidance, flagged for a real answer — not smoothed over by AI guessing at what's probably meant.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Draft plain-language guidance from a real (or realistic) policy extract about a council parking permit scheme.",
        fields: [
          { key: "source", label: "The real source you'd feed AI", hint: "The actual policy text, not a summary.", minWords: 6 },
          { key: "checked", label: "What you'd verify against the source", hint: "Every rule and number.", minWords: 6 },
          { key: "gaps", label: "A gap you'd flag rather than guess", hint: "Something the policy doesn't actually say.", minWords: 5 },
        ],
        model: {
          source: "The council's actual permit policy document, including the real fee, the eligibility radius, and the renewal process.",
          checked: "Every fee, distance and deadline in the draft is checked word-for-word against the policy document, not assumed to match similar schemes.",
          gaps: "The policy doesn't say what happens if someone moves address mid-permit — flag that for the policy team rather than inventing an answer.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PS1.1", "Reproduce", "Draft checked guidance from a real policy",
        "Take a real (or realistic) policy document from your own work. Draft plain-language guidance and verify every claim against it.",
        "Strong answer: every rule/number in the draft is traced to the real document; any gap in the source is flagged, not guessed at.",
        [
          { key: "policy", label: "The policy", hint: "One line, what it covers.", minWords: 5 },
          { key: "draft", label: "The plain-language draft", hint: "Or a summary of it.", minWords: 10 },
          { key: "verified", label: "What you checked against the source", hint: "And what you found.", minWords: 8 },
        ],
        [
          { label: "Rules and numbers traced to the real document" },
          { label: "Plain language, not just simplified vocabulary" },
          { label: "A genuine gap is flagged, not guessed at" },
        ],
        "independent"),
      critiqueChallenge("PS1.2", "Adapt", "Fix guidance with an invented rule",
        "Here's a draft guidance page. Find every problem.",
        "\"To qualify for the home insulation grant, you must own your home, have lived there for at least 2 years, and have a combined household income under £40,000.\" (The actual scheme document says nothing about a minimum residency period.)",
        [
          { label: "The 2-year residency requirement doesn't exist in the actual scheme — it's invented", signals: ["invented", "doesn't exist", "not in the scheme", "fabricated", "no such rule"] },
          { label: "No citation to the source policy for any of the stated figures", signals: ["no citation", "no source", "not traced", "unverified", "where does this come from"] },
          { label: "An invented eligibility rule could wrongly exclude a real applicant", signals: ["wrongly exclude", "real applicant", "turns someone away", "excludes people who qualify"] },
          { label: "No route to check or challenge an eligibility decision is mentioned", signals: ["no route to challenge", "no appeal", "how do i query", "no contact"] },
        ],
        "transferable",
        { text: "\"To qualify for the home insulation grant: you must own your home, and your combined household income must be under £40,000 (see scheme document section 3). If you're unsure whether you qualify, contact [team] before applying.\"",
          changes: ["Removes the invented 2-year residency requirement", "Cites the source section for the income figure", "Adds a route to check eligibility before applying"] }),
    ],
  },
  {
    id: "PS2", name: "Summarising public consultation responses fairly",
    canDo: "Use AI to summarise public consultation submissions — representing the real range of views, including minority positions, without smoothing them away.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI summarised 200 consultation responses as \"overwhelming support for the proposal.\" The real breakdown was 55% support, 30% opposed with a specific accessibility concern, 15% mixed. The opposition's concern — a real, fixable issue — was dropped from the summary for being a minority view.",
        point: "A consultation exists partly to surface exactly the concerns a majority-support headline erases.",
      },
      explain: {
        paras: [
          "Summarising many submissions needs real proportions stated with numbers — \"most\" or \"overwhelming\" without a figure hides how close or lopsided it actually was.",
          "Minority and dissenting views get represented on their substance, not dropped for being few. And a question many people skipped is a gap in what was asked, not evidence of agreement.",
        ],
        keyIdea: "State real proportions with numbers, represent minority concerns on their substance, and treat unanswered questions as gaps, not agreement.",
      },
      demonstrate: {
        task: "Summarising 200 responses to a proposed bus-route change.",
        steps: [
          { move: "State real proportions", think: "Numbers, not vibe words.", result: "55% support, 30% opposed, 15% mixed — stated as figures, not \"most people.\"" },
          { move: "Pull out substantive minority concerns", think: "Even if few.", result: "The 30% opposed raised a specific accessibility issue — the new route removes a stop near a care home." },
          { move: "Check no theme was dropped for being small", think: "Small isn't irrelevant.", result: "A 5% mention of cost impact almost got cut for being minor — kept, since it's a real, distinct concern." },
          { move: "Distinguish silence from agreement", think: "Unanswered isn't agreement.", result: "40% didn't comment on the proposed timing — noted as unanswered, not counted as support." },
        ],
        full: "The summary stated real proportions, kept the substantive accessibility concern from the opposing minority visible and specific, and treated an unanswered question as a gap rather than folding it into apparent support.",
      },
      deconstruct: [
        "\"Overwhelming support\" from 55% erases how substantial the 30% opposition actually was.",
        "The accessibility concern was real and fixable — dropping it for being a minority view would have missed the point of consulting at all.",
        "40% not commenting on timing is a gap in the data, not a silent 40% in favour.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Summarise 50 responses to a proposed change in library opening hours.",
        fields: [
          { key: "proportions", label: "Real proportions", hint: "Numbers, not vibe words.", minWords: 6 },
          { key: "minority", label: "A minority concern kept on its substance", hint: "Not dropped for being few.", minWords: 6 },
          { key: "silence", label: "Something people didn't comment on", hint: "Treated as a gap, not agreement.", minWords: 5 },
        ],
        model: {
          proportions: "30 of 50 supported the change, 12 opposed, 8 gave mixed or conditional views.",
          minority: "Several of the 12 opposed specifically raised that evening closure would affect students who use the library after school — a distinct, actionable concern.",
          silence: "Almost nobody commented on weekend hours specifically, which is a gap in the consultation, not evidence people are happy with the current weekend hours.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PS2.1", "Reproduce", "Summarise real consultation responses fairly",
        "Take real (or realistic) consultation responses from your own work. State real proportions and represent a minority concern on its substance.",
        "Strong answer: proportions are real numbers; a minority concern is represented specifically, not dropped; silence is distinguished from agreement.",
        [
          { key: "consultation", label: "The consultation", hint: "One line, what it's about.", minWords: 5 },
          { key: "proportions", label: "Real proportions", hint: "Numbers.", minWords: 6 },
          { key: "minority", label: "A minority concern, kept specific", hint: "Not smoothed away.", minWords: 6 },
        ],
        [
          { label: "Proportions stated as real numbers" },
          { label: "A minority concern is represented on its substance" },
          { label: "Silence is distinguished from agreement" },
        ],
        "independent"),
      scenarioChallenge("PS2.2", "Create", "The summary dropped the dissenting view",
        "An AI-drafted consultation summary says \"the proposal was well received\" and doesn't mention that 30% of respondents raised a specific accessibility concern.",
        "What's wrong, and what do you do?",
        [
          { id: "a", label: "Leave it — 30% is still a minority, and the majority is what matters for the decision", ok: false, why: "The decision may still go ahead, but the consultation's job is to surface the concern, not erase it from the record." },
          { id: "b", label: "Rewrite the summary to state the real proportions and represent the accessibility concern specifically, regardless of the eventual decision", ok: true, why: "A consultation summary's job is accurate representation, not making the outcome look cleaner than it was." },
          { id: "c", label: "Mention that \"some concerns were raised\" without specifics", ok: false, why: "Vague acknowledgement without the actual concern is nearly as bad as omitting it — a reader can't act on \"some concerns.\"" },
        ],
        "transferable"),
    ],
  },
  {
    id: "PS3", name: "Case processing support — the decision stays human",
    canDo: "Use AI to help process applications and cases faster — while the actual decision, and its reasoning, stays with an accountable person.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "An automated pre-screen for a benefits application quietly rejected applications from a specific postcode area at a much higher rate. It was only discovered after a complaint — a feature correlated with the postcode had been acting as a proxy nobody had checked for.",
        point: "A pre-screen that quietly decides, rather than flags for a person, can encode and scale a pattern nobody intended and nobody is checking.",
      },
      explain: {
        paras: [
          "AI can check application completeness, compile facts against explicit published criteria, and draft the decision letter. It must not be the decision-maker — especially where there's an appeal right.",
          "The reasoning behind every decision has to be stated in terms of the actual published criteria, checkable by the applicant, with a named accountable person who can explain it — not \"the system flagged it.\"",
        ],
        keyIdea: "AI compiles and checks completeness against explicit criteria; a person decides, explains the reasoning in terms of those criteria, and is accountable — every time, not just on appeal.",
      },
      demonstrate: {
        task: "Processing applications for a hardship fund.",
        steps: [
          { move: "AI checks completeness", think: "Mechanical.", result: "Flags any application missing a required document before it reaches a caseworker." },
          { move: "AI compiles against criteria", think: "Not a recommendation.", result: "Lays out how each application matches the published eligibility criteria, with the source document quoted." },
          { move: "A person decides", think: "Not automatic.", result: "The caseworker reads the compiled evidence and makes the actual eligibility call." },
          { move: "The reasoning is recorded", think: "Checkable.", result: "The decision letter states which criteria were and weren't met, in plain terms the applicant can contest." },
        ],
        full: "AI sped up completeness checking and evidence compilation. Every decision was still made and owned by a named caseworker, with reasoning recorded in terms an applicant could actually contest.",
      },
      deconstruct: [
        "A completeness check and a compiled evidence pack are not the same as a decision — the difference is where the actual judgement happens.",
        "A proxy for a protected characteristic can hide inside an innocent-looking feature — that's exactly why the decision needs a human check, every time, not just on complaint.",
        "\"The system flagged it\" is not an explanation an applicant can contest; the published criteria are.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Design AI support for processing planning-permission applications.",
        fields: [
          { key: "aidoes", label: "What AI legitimately does", hint: "Completeness, compiling against criteria.", minWords: 6 },
          { key: "humandoes", label: "What stays with a person, and how it's explained", hint: "The actual decision.", minWords: 6 },
          { key: "check", label: "How you'd check for a hidden proxy pattern", hint: "Not just on complaint.", minWords: 5 },
        ],
        model: {
          aidoes: "Checks the application has all required documents and plans, and compiles it against the published planning criteria with citations.",
          humandoes: "A planning officer makes the actual decision and states it in terms of the specific criteria met or not met, so it can be appealed on those grounds.",
          check: "Periodically compare approval rates across different applicant areas or types against the stated criteria to catch a pattern nobody intended.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PS3.1", "Reproduce", "Design AI support for a real case process",
        "Take a real (or realistic) application or case process. Split what AI legitimately does from what stays with an accountable person.",
        "Strong answer: AI's role is completeness/compiling only; a named person decides and can explain the reasoning in terms of the criteria.",
        [
          { key: "process", label: "The process", hint: "One line.", minWords: 5 },
          { key: "aidoes", label: "What AI does", hint: "Completeness, compiling.", minWords: 6 },
          { key: "humandoes", label: "What stays human, and how it's explained", hint: "The decision + reasoning.", minWords: 8 },
        ],
        [
          { label: "AI's role is limited to completeness/compiling against criteria" },
          { label: "A named person makes and owns the decision" },
          { label: "The reasoning is stated in terms an applicant can contest" },
        ],
        "independent"),
      scenarioChallenge("PS3.2", "Create", "The pre-screen learned a postcode pattern",
        "Analysis shows an AI pre-screen has been down-ranking applications from a specific postcode area at a much higher rate than others, for reasons nobody set out to create.",
        "What do you do?",
        [
          { id: "a", label: "Add a rule telling the system to ignore postcode", ok: false, why: "If the pattern is learned from correlated features, telling it to ignore the obvious one doesn't remove the underlying bias." },
          { id: "b", label: "Stop letting the pre-screen produce a ranking that drives outcomes; score only against the explicit published criteria, with a person reviewing every decision and rates monitored by area", ok: true, why: "Remove the learned pattern from having any decision-making power, and keep checking for it going forward." },
          { id: "c", label: "Only review the postcode area's applications more closely from now on", ok: false, why: "That singles out the affected group again rather than fixing the process that produced the bias for everyone." },
        ],
        "transferable"),
    ],
  },
  {
    id: "PS4", name: "Records and information requests support",
    canDo: "Use AI to help process records and information requests — with every disclosure checked against exemptions by a person before release.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted a response to an information request and redacted what it judged to be personal data — but missed a commercially sensitive figure buried in an attached spreadsheet. It went out unredacted before anyone caught it.",
        point: "A disclosure is one-way. AI's redaction pass is a first draft, not the check.",
      },
      explain: {
        paras: [
          "AI can help search and compile the documents that are actually responsive to a request, and draft the covering response fast.",
          "The exemption and redaction decision — what can and can't be released — must be checked by a person against the real, complete document, including attachments, before release. Once sent, it can't be unsent.",
        ],
        keyIdea: "AI compiles and proposes redactions; a person checks every proposed redaction and hunts for anything AI missed, especially in attachments, before anything irreversible goes out.",
      },
      demonstrate: {
        task: "Responding to an information request that includes an email thread with an attachment.",
        steps: [
          { move: "Compile responsive documents", think: "Everything in scope.", result: "AI gathers the email thread and its spreadsheet attachment." },
          { move: "AI proposes redactions", think: "A first pass.", result: "Flags a named individual's email address for redaction in the thread." },
          { move: "A person checks every proposal, and hunts for what was missed", think: "Including attachments.", result: "The reviewer finds an unredacted commercially sensitive figure in the spreadsheet AI hadn't flagged." },
          { move: "Sign-off and log", think: "Before release.", result: "The corrected response is approved by a named officer, with what was withheld and why logged for any appeal." },
        ],
        full: "AI compiled the documents and proposed a first-pass redaction, but a person's own check of the full document, attachments included, caught a sensitive figure AI had missed, before anything was released.",
      },
      deconstruct: [
        "AI's redaction proposal was a reasonable first pass and still missed something real in an attachment — exactly why it can't be the final check.",
        "Attachments are where a redaction pass is most likely to miss something, precisely because they're easy to skim past.",
        "Logging what was withheld and why is what makes an eventual appeal possible to handle fairly.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Design the AI-assisted process for a records request that includes a long email thread.",
        fields: [
          { key: "compile", label: "What AI compiles", hint: "Search and gather.", minWords: 5 },
          { key: "check", label: "What a person checks before release", hint: "Every proposal, plus attachments.", minWords: 6 },
          { key: "log", label: "What's logged for appeal", hint: "What was withheld and why.", minWords: 5 },
        ],
        model: {
          compile: "AI searches the mailbox and gathers every email and attachment that's actually responsive to the request.",
          check: "A named officer reviews every AI-proposed redaction against the source, and separately checks attachments for anything AI didn't flag.",
          log: "Each withheld item is logged with the specific exemption it falls under, so a later appeal can be assessed against the actual reasoning.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PS4.1", "Reproduce", "Design a checked records-request process",
        "Take a real (or realistic) records/information request process. Design the AI-assisted compile step and the human check before release.",
        "Strong answer: AI's role is compiling and a first redaction pass; a person checks every proposal plus attachments; withheld items are logged with their reason.",
        [
          { key: "request", label: "The request type", hint: "One line.", minWords: 5 },
          { key: "compile", label: "What AI compiles/proposes", hint: "Search, first-pass redaction.", minWords: 6 },
          { key: "check", label: "The human check before release", hint: "Including attachments.", minWords: 8 },
        ],
        [
          { label: "AI's redaction proposal is treated as a first pass" },
          { label: "A person checks attachments specifically, not just the main document" },
          { label: "Withheld items are logged with the specific reason" },
        ],
        "independent"),
      critiqueChallenge("PS4.2", "Adapt", "Find the gap in a records-request workflow",
        "Here's how records requests are handled. Find every problem.",
        "\"AI searches the mailbox, redacts anything that looks like personal data, and the response is sent out the same day to keep our response times fast.\"",
        [
          { label: "No human check of AI's proposed redactions before release", signals: ["no human check", "no review", "not checked", "unreviewed", "no second pair of eyes"] },
          { label: "\"Anything that looks like personal data\" will miss non-personal but sensitive information, like commercial figures", signals: ["commercially sensitive", "not just personal data", "other exemptions", "misses other sensitive"] },
          { label: "Same-day send with no review step prioritises speed over an irreversible check", signals: ["same day", "irreversible", "too fast", "no time to check", "speed over accuracy"] },
          { label: "No log of what was withheld or why, for a later appeal", signals: ["no log", "no record of what was withheld", "no reason recorded", "can't appeal"] },
        ],
        "transferable",
        { text: "\"AI searches the mailbox and proposes redactions for personal data and other exempt information. A named officer reviews every proposed redaction against the source documents, including attachments, before release. What's withheld and the specific exemption is logged for any appeal.\"",
          changes: ["Adds the missing human review step before release", "Widens the redaction check beyond personal data to other exemption categories", "Removes the same-day-regardless-of-review framing", "Adds a logged reason for every withheld item"] }),
    ],
  },
  {
    id: "PS5", name: "Procurement and vendor evaluation support",
    canDo: "Use AI to help summarise and score vendor bids — while the scoring criteria, conflicts of interest, and the final award decision stay explicit and human.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI's bid summary favoured a vendor because their proposal was better written — not because it scored higher against the actual published criteria. A stronger bid on paper, less polished in prose, ranked lower in the AI's summary for reasons that had nothing to do with what was being procured.",
        point: "AI is genuinely good at summarising prose quality. Prose quality is not a procurement criterion.",
      },
      explain: {
        paras: [
          "AI can extract each bid's claims and lay them out against the published scoring criteria, fast, across many bids.",
          "Scoring must be against those explicit criteria, not writing quality or confidence of tone. Conflicts of interest and the final award decision are a human panel's job, with the reasoning recorded so the decision can be challenged or audited.",
        ],
        keyIdea: "Extract each bid's claims against the published criteria only; a human panel scores, checks conflicts of interest, and makes the award decision, with reasoning recorded.",
      },
      demonstrate: {
        task: "Evaluating 5 bids for an IT support contract.",
        steps: [
          { move: "Extract claims per criterion", think: "Not overall impression.", result: "AI lays out what each bid claims against each of the 6 published scoring criteria." },
          { move: "Check the extraction, not the prose", think: "Substance over style.", result: "One well-written bid's claims against \"response time\" turn out vaguer than a plainer bid's specific SLA commitment." },
          { move: "Check conflicts of interest", think: "Before scoring is finalised.", result: "A panel member flags a prior working relationship with one bidder and recuses themselves from scoring that bid." },
          { move: "The panel decides and records why", think: "Auditable.", result: "The award decision states the scores per criterion and the reasoning, available if challenged." },
        ],
        full: "AI extracted each bid's claims against the actual criteria, which surfaced that a plainer bid had a more specific, stronger commitment than a better-written one. A conflict of interest was caught and handled, and the panel's reasoning was recorded.",
      },
      deconstruct: [
        "A better-written proposal and a better bid against the actual criteria are not the same thing — AI's extraction made that visible instead of hidden behind prose quality.",
        "Catching a conflict of interest before scoring is finalised protects the integrity of the whole process, not just that one bid.",
        "Recording the reasoning per criterion is what makes an award decision defensible if challenged.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Design AI support for evaluating bids for a building-maintenance contract.",
        fields: [
          { key: "extract", label: "What AI extracts", hint: "Per published criterion.", minWords: 6 },
          { key: "coi", label: "How conflicts of interest are checked", hint: "Before scoring is final.", minWords: 5 },
          { key: "decide", label: "How the panel decides and records why", hint: "Auditable reasoning.", minWords: 6 },
        ],
        model: {
          extract: "AI lays out each bid's stated price, response-time commitment, and relevant experience against the published scoring criteria, quoting the bid text.",
          coi: "Every panel member declares any prior relationship with a bidder before scoring begins, and recuses from scoring that specific bid if there's a conflict.",
          decide: "The panel scores each bid per criterion independently, then discusses and records the final award reasoning against those scores.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PS5.1", "Reproduce", "Score real bids against explicit criteria",
        "Take a real (or realistic) procurement decision. Extract bid claims against the published criteria, and check for conflicts of interest.",
        "Strong answer: extraction is per explicit criterion, not overall impression; conflicts of interest are checked before scoring is final; reasoning is recorded.",
        [
          { key: "procurement", label: "The procurement", hint: "One line.", minWords: 5 },
          { key: "extract", label: "Claims extracted per criterion", hint: "Not overall impression.", minWords: 8 },
          { key: "coi", label: "Conflicts of interest checked", hint: "Before scoring is final.", minWords: 5 },
        ],
        [
          { label: "Extraction is against explicit criteria, not writing quality" },
          { label: "Conflicts of interest are checked before scoring is final" },
          { label: "The award reasoning is recorded" },
        ],
        "independent"),
      scenarioChallenge("PS5.2", "Create", "The AI summary favoured the best-written bid",
        "AI's bid comparison ranks Bid A highest, citing it as \"the strongest overall proposal\" — but on the specific published criteria, Bid B commits to a faster response time and a lower price.",
        "What's the issue, and what do you do?",
        [
          { id: "a", label: "Go with the AI's overall ranking — it read all the bids in full", ok: false, why: "Reading all the bids doesn't mean the ranking is based on the published criteria rather than how persuasively each was written." },
          { id: "b", label: "Re-score both bids explicitly against each published criterion, not an overall impression, and use that to decide", ok: true, why: "Procurement scoring has to be against the stated criteria specifically, not a holistic 'strongest overall' read." },
          { id: "c", label: "Ask AI to re-rank them, emphasising it should be objective this time", ok: false, why: "Telling it to be more objective doesn't fix the underlying issue — the extraction needs to be structured against explicit criteria, not another holistic pass." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: PS_COMPETENCIES, capstoneId: "PSCAP" };
};
