/* Subject: support
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["support"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const SUPPORT_COMPETENCIES = [
  {
    id: "SU1", name: "Triage & routing",
    canDo: "Classify and route incoming messages accurately, with a priority signal and a defined 'unsure → human' path.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Your AI triage bot routed a \"my account was charged twice and I need this fixed today, I'm furious\" message to the general FAQ queue as \"billing question\". It sat for two days. The customer went to social media.",
        point: "Triage that's confident when it should be unsure sends the urgent, the angry and the unusual to the wrong place — quietly.",
      },
      explain: {
        paras: [
          "Triage is three things: **classify** into categories that map to real queues (not vague buckets); compute a **priority signal** — urgency, anger, churn risk, legal/safety words — **separately from category**; and provide an explicit **low-confidence path**.",
          "When the AI isn't sure, or the message spans categories, or it hits a red-flag phrase, it goes to a human with its best guess attached — not a confident wrong route.",
          "Measure it: sample routed messages weekly and check where they actually went.",
        ],
        keyIdea: "Triage = category (mapped to a real queue) + priority (urgency / anger / risk words, computed separately) + an explicit low-confidence → human path. A confident wrong route is worse than \"I'm not sure\".",
      },
      demonstrate: {
        task: "Setting up triage for a support inbox.",
        steps: [
          { move: "Categories → queues", think: "Real teams, not buckets.", result: "billing / technical / account-access / cancellation / complaint / other — each maps to a specific team." },
          { move: "Priority signal", think: "Separate axis.", result: "Flag urgent if: 'today' / 'deadline' / 'production down', anger markers, 'cancel' / 'refund', or legal / safety words." },
          { move: "Low-confidence path", think: "Don't guess on the hard ones.", result: "Confidence below threshold, or two categories fit, or a red-flag phrase → a senior human, with the AI's guess attached." },
          { move: "Measure", think: "Check it's routing right.", result: "Sample 30 routed tickets a week; log the miss rate per category; fix the prompt on the misses." },
        ],
        full: "Six categories mapped to real teams, a priority flag computed independently, and anything ambiguous or high-stakes sent straight to a person. Weekly sampling keeps the routing honest.",
      },
      deconstruct: [
        "Priority separate from category means an angry billing question and a routine one don't land in the same place.",
        "The red-flag phrase list ('legal', 'lawyer', 'unsafe', 'injury') routes past the AI entirely.",
        "\"Sample 30 a week\" is how you find out it's been misrouting a category before the customer tells you.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're setting up AI triage for a SaaS product's support email.",
        fields: [
          { key: "categories", label: "Categories, each mapped to a queue", hint: "Real teams.", minWords: 6 },
          { key: "priority", label: "How you compute priority, separately from category", hint: "The signals.", minWords: 6 },
          { key: "unsure", label: "The low-confidence / red-flag path", hint: "What happens when it's not sure.", minWords: 5 },
        ],
        model: {
          categories: "Bug report → engineering triage. How-do-I → support. Billing / invoice → finance-support. Downgrade / cancel → retention. Data / privacy request → the privacy owner. Feedback → product. Anything else → a human sorts it.",
          priority: "High if: mentions a deadline or 'production down'; strong negative sentiment; an enterprise account; or the words 'cancel', 'refund', 'legal', 'GDPR', 'breach'. Computed on every message regardless of category.",
          unsure: "If classifier confidence is below 0.8, two categories score close, or a red-flag word is present → send to a senior agent with the AI's best guess attached, flagged 'needs human routing'.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SU1.1", "Reproduce", "Design triage for a real inbox",
        "Take a support channel you know. Design its triage.",
        "Strong answer: categories map to real queues; priority is computed separately from category; there's an explicit low-confidence → human path; and there's a plan to measure where messages actually get routed.",
        [
          { key: "categories", label: "Categories → queues", hint: "Real teams.", minWords: 6 },
          { key: "priority", label: "How priority is computed, separately", hint: "The signals.", minWords: 6 },
          { key: "unsure", label: "The path when it's not confident", hint: "Not a guess.", minWords: 5 },
          { key: "measure", label: "How you'll check it routes right", hint: "Sampling.", minWords: 5 },
        ],
        [
          { label: "Categories map to real queues" },
          { label: "Priority computed separately from category" },
          { label: "Explicit low-confidence → human path; a measurement plan" },
        ],
        "independent"),
      scenarioChallenge("SU1.2", "Create", "The bot keeps sending angry customers to the FAQ",
        "Your triage AI classifies by topic only. Angry, urgent billing messages get the same 'billing → self-serve FAQ' treatment as calm ones, and complaints are escalating.",
        "What's the fix?",
        [
          { id: "a", label: "Add an 'angry billing' category", ok: false, why: "Categories multiply forever. Anger is a priority axis, not a topic." },
          { id: "b", label: "Compute a priority / sentiment signal separately from topic, and route high-priority messages to a human regardless of category", ok: true, why: "Priority and category are different questions; the routing has to use both." },
          { id: "c", label: "Have the FAQ bot apologise more", ok: false, why: "The routing is wrong, not the tone." },
        ],
        "transferable"),
    ],
  },

  {
    id: "SU2", name: "Grounded replies",
    canDo: "Draft answers only from the knowledge base, with citations, and say \"I don't know\" when it isn't covered.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A customer asked if the plan included SSO. The AI confidently said yes, with setup steps. It doesn't. The customer signed up, couldn't find it, and filed a complaint quoting the AI's message back.",
        point: "An ungrounded support bot doesn't say \"I don't know\" — it invents a plausible answer, and support answers become promises.",
      },
      explain: {
        paras: [
          "A grounded reply is built **only from retrieved knowledge-base content**, **cites which article** it came from, and returns **\"this isn't covered — here's how to reach a human\"** when retrieval finds nothing relevant.",
          "The failure mode is the confident answer to a question the KB doesn't address. Guardrail: retrieve first, answer only from what came back, include the source link, never let the model fill a gap from its general training.",
          "Test it with questions you know aren't in the KB — it should decline every one.",
        ],
        keyIdea: "Retrieve → answer only from what came back → cite the article → \"not covered, here's a human\" when nothing relevant is found. The model must not fill KB gaps from general knowledge.",
      },
      demonstrate: {
        task: "A \"does the product do X\" question.",
        steps: [
          { move: "Retrieve", think: "Search first.", result: "Search the KB for the question; get the top 3 articles with relevance scores." },
          { move: "Check relevance", think: "Is there a real source?", result: "Top score below threshold → the KB doesn't cover this → 'I don't have a documented answer; connecting you to an agent.'" },
          { move: "Answer from source", think: "Only from what came back.", result: "Score is good → answer using only that article's content, quoting the relevant part." },
          { move: "Cite", think: "Checkable.", result: "'Per our [Plans & Features] article: ...' with the link." },
        ],
        full: "The bot answers 'yes, on Business and above, see [link]' when the KB says so, and 'I don't have that documented — here's an agent' when it doesn't. It never constructs an answer from outside the retrieved articles.",
      },
      deconstruct: [
        "The relevance-score threshold is what converts 'no good source' into 'I don't know' instead of a guess.",
        "Citing the article lets the customer (and you) check the answer against the source.",
        "Testing with known-absent questions is the only way to confirm it actually declines.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're building a support bot on your help centre. A customer asks: \"Can I export my data as CSV?\"",
        fields: [
          { key: "grounded", label: "How you ensure the answer comes only from the KB", hint: "The retrieve-then-answer setup.", minWords: 6 },
          { key: "nothere", label: "What happens when the KB doesn't cover it", hint: "The decline behaviour.", minWords: 5 },
          { key: "cite", label: "What the citation looks like", hint: "Format.", minWords: 4 },
          { key: "test", label: "How you'd test it declines properly", hint: "Known-absent questions.", minWords: 5 },
        ],
        model: {
          grounded: "Retrieve the top KB articles for the query. Pass only those to the model with an instruction to answer strictly from them. If the answer isn't in the retrieved text, it isn't given.",
          nothere: "If no article scores above the relevance threshold: 'I don't have documentation on CSV export — connecting you with someone who can confirm.' Route to a human with the question attached.",
          cite: "'Yes — you can export to CSV from Settings → Data. (Source: Exporting your data)' with a link to that article.",
          test: "Ask it 10 questions you know aren't documented (obscure edge cases, features that don't exist). It should decline all 10. Any confident answer is a failure.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SU2.1", "Reproduce", "Ground a support bot",
        "Design the grounded-reply setup for a support bot on your (or a familiar) help centre.",
        "Strong answer: answers are built only from retrieved KB content; there's an explicit decline-and-route when nothing relevant is found; every answer cites its source; and a test with known-absent questions is described.",
        [
          { key: "bot", label: "What it answers", hint: "One line.", minWords: 3 },
          { key: "grounding", label: "How answers stay inside the KB", hint: "Retrieve-then-answer.", minWords: 6 },
          { key: "decline", label: "The 'not covered' behaviour", hint: "Decline + route.", minWords: 5 },
          { key: "citation", label: "The citation format", hint: "What the source link looks like.", minWords: 3 },
        ],
        [
          { label: "Answers built only from retrieved KB content" },
          { label: "Explicit decline-and-route when nothing relevant" },
          { label: "Every answer cites its source; a known-absent test described" },
        ],
        "independent"),
      critiqueChallenge("SU2.2", "Adapt", "Review a bot reply",
        "Here is a bot reply and a note about the knowledge base. Find every problem.",
        "Customer: \"Is there a limit on API calls?\"\nBot: \"Yes, the standard limit is 10,000 requests per hour, which resets on the hour. Enterprise plans can request higher limits by contacting sales.\"\n\n(The knowledge base has no article on API rate limits.)",
        [
          { label: "The bot answered a question the KB doesn't cover — the numbers are invented", signals: ["not in the kb", "no article", "invented", "made up", "fabricat", "not documented", "no source for", "hallucinat"] },
          { label: "No citation / source is given", signals: ["no citation", "no source", "doesn't cite", "unsourced", "no link", "where did"] },
          { label: "Specific figures (10,000/hour, resets on the hour) will be quoted back as a promise", signals: ["quoted back", "promise", "commitment", "held to", "specific number", "10,000", "10000", "the figure"] },
          { label: "It should have declined and routed to a human", signals: ["should decline", "should have said", "i don't know", "route to a human", "escalate", "connect", "not covered"] },
        ],
        "transferable", { text: `"I don’t have a confirmed number for that in our documentation, so I don’t want to guess and risk giving you the wrong limit. I’ve flagged this to our team — someone will follow up with the exact figure within one business day. Anything else I can help with in the meantime?"`, changes: ["No longer invents a figure the knowledge base doesn’t contain", "Declines and routes to a human instead of answering from thin air", "No specific numbers stated that could later be held against the company", "Sets an honest, concrete expectation instead of a false-confident answer"] }),
    ],
  },

  {
    id: "SU3", name: "Tone control",
    canDo: "Match the reply's tone to the customer's state — especially frustrated, anxious or angry — without sounding scripted or dismissive.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A customer wrote three paragraphs about how a bug had cost them a client. The AI reply opened with \"Thanks for reaching out! 😊 We appreciate your feedback.\" They escalated to the CEO.",
        point: "A cheerful, templated tone in front of a real problem reads as \"we're not taking this seriously\".",
      },
      explain: {
        paras: [
          "Tone is a deliberate choice per reply, driven by the customer's state. **Frustrated / angry** → acknowledge the specific problem and its impact first, drop the exclamation marks and emoji, be concrete about the fix. **Anxious** (data loss, billing, security) → lead with reassurance and a clear next step. **Neutral** → efficient and friendly is fine.",
          "Never: minimise (\"just\", \"simply\"), over-apologise without action, or use a canned opener on a serious message.",
          "The content can be identical to a neutral reply; the framing is what changes.",
        ],
        keyIdea: "Pick the tone from the customer's state — acknowledge impact first for the angry, reassure first for the anxious, stay efficient for the neutral. Cut \"just\" / \"simply\", canned openers, and emoji on serious messages.",
      },
      demonstrate: {
        task: "Replying to the \"bug cost me a client\" message.",
        steps: [
          { move: "Read the state", think: "Angry, with a concrete cost.", result: "This is not a 'thanks for the feedback' situation." },
          { move: "Open with acknowledgement", think: "Name the impact.", result: "'Losing a client over this is a serious outcome and I'm sorry it happened.' — not a generic apology." },
          { move: "Be concrete", think: "Not reassurance theatre.", result: "'Here's what went wrong, what we've already done, and what I can offer.'" },
          { move: "Check the framing", think: "Strip the tells.", result: "No 'just', no 'simply', no emoji, no 'we appreciate your patience'." },
        ],
        full: "Same facts a neutral reply would carry, but it opens by naming the real impact, stays concrete about the fix, and strips every phrase that would read as dismissive.",
      },
      deconstruct: [
        "Naming the specific impact ('losing a client') does more than three generic apologies.",
        "'Simply restart the app' to someone who's furious reads as 'this is your fault and it's easy'.",
        "The canned opener is the single biggest tell that a reply wasn't really read.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A customer messages: \"I've been charged £240 and I have no idea why. I need this sorted now.\" (You can see it was an accidental double-charge on an annual plan.)",
        fields: [
          { key: "state", label: "Read their state", hint: "What are they feeling, and what do they need?", minWords: 5 },
          { key: "open", label: "How you'd open the reply", hint: "The first sentence.", minWords: 6 },
          { key: "avoid", label: "Phrases to avoid here", hint: "The tells.", minWords: 4 },
          { key: "body", label: "What the reply needs to contain", hint: "The substance.", minWords: 6 },
        ],
        model: {
          state: "Anxious and angry — unexpected money gone, and 'now' signals they feel out of control. Reassurance and speed matter more than politeness.",
          open: "'I can see exactly what happened and I can fix it today. You were charged twice for your annual plan by mistake — the second £240 is being refunded now.' Lead with the answer and the action.",
          avoid: "'Thanks for reaching out', 'I understand your frustration' (generic), 'just', 'please note', anything that delays getting to 'you're getting your money back'.",
          body: "What happened (double charge), what's done (refund initiated), when they'll see it (3–5 days), and a direct contact if it's not there by then.",
        },
      },
    },
    challenges: [
      critiqueChallenge("SU3.1", "Reproduce", "Fix a tone-deaf reply",
        "Here is a customer message and a draft reply. Find everything wrong with the tone and framing, and say how you'd fix each.",
        "Customer: \"This is the third time this week the app has logged me out mid-call with a customer. It's embarrassing and it's making me look unprofessional.\"\n\nDraft reply: \"Hi there! Thanks so much for letting us know! 😊 Have you tried clearing your cache and cookies? That usually does the trick! Let us know if you have any other questions!\"",
        [
          { label: "Cheerful opener and emoji on a message about professional embarrassment", signals: ["cheerful", "emoji", "opener", "thanks so much", "😊", "upbeat", "tone-deaf", "not read"] },
          { label: "'That usually does the trick' minimises a recurring problem", signals: ["minimis", "minimiz", "usually does the trick", "dismissive", "downplay", "recurring", "third time"] },
          { label: "No acknowledgement of the impact — looking unprofessional in front of customers", signals: ["impact", "acknowledge", "embarrass", "unprofessional", "in front of", "consequence", "no empathy"] },
          { label: "'Have you tried' puts the work back on the customer for the third time", signals: ["have you tried", "puts the work", "customer's job", "already tried", "third time", "onus"] },
          { label: "No ownership, no escalation, no 'we'll find out why this keeps happening'", signals: ["ownership", "escalat", "investigate", "why it keeps", "root cause", "own it", "no follow-up"] },
        ],
        "transferable", { text: `"Hi [Name], I’m sorry — being logged out mid-call in front of a customer three times this week is genuinely disruptive, and I understand why it’s frustrating. I’ve escalated this to engineering as a priority bug, not a one-off; I’ll update you within 24 hours with what we’ve found. Does it tend to happen at a particular time of day, so we can narrow down the cause?"`, changes: ["Drops the cheerful opener and emoji for a message about professional embarrassment", "Acknowledges the actual impact instead of minimising it", "Escalates and takes ownership instead of “have you tried” on the third occurrence", "Commits to a concrete follow-up time, not an open-ended “let us know”"] }),
      fieldsChallenge("SU3.2", "Transfer", "Tone guide for your hardest cases",
        "For the customer situations you (or a team you know) find hardest, write the tone rules.",
        "Strong answer: tone rules are keyed to the customer's state, not the topic; each says what to lead with; and the avoid-list catches minimising and canned language.",
        [
          { key: "cases", label: "2–3 of the hardest customer states you handle", hint: "The states, not the topics.", minWords: 6 },
          { key: "tone", label: "The tone rule for each", hint: "What to lead with.", minWords: 8 },
          { key: "phrases", label: "Phrases to always avoid", hint: "Minimising, canned.", minWords: 4 },
        ],
        [
          { label: "Tone rules keyed to the customer's state, not the topic" },
          { label: "Each says what to lead with" },
          { label: "Avoid-list catches minimising and canned language" },
        ],
        "transferable"),
    ],
  },

  {
    id: "SU4", name: "Escalation rules",
    canDo: "Define what the AI must never resolve alone, and make the handoff to a human clean.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI support agent \"resolved\" a GDPR data-deletion request by replying with instructions and closing the ticket. The request had legal deadlines and required identity verification. Nobody human ever saw it.",
        point: "Some requests aren't support questions — they're legal, financial or safety events. The AI closing them is the failure.",
      },
      explain: {
        paras: [
          "Write an explicit **never-resolve-alone list**: refunds and credits above a threshold, cancellations, complaints, anything legal (GDPR / CCPA, disputes, \"lawyer\"), safety or harm, security incidents, accessibility complaints, press.",
          "For each, the AI's job is **recognise → hand off with context → confirm a human has it** — not attempt a resolution. The handoff carries the full conversation, the detected category, and any deadline.",
          "The AI can still send the customer a receipt (\"passed to the right team, they'll contact you within X\"). It just can't be the one who closes it.",
        ],
        keyIdea: "An explicit never-resolve-alone list (refunds over X, cancellations, complaints, legal, safety, security, press). For those: recognise → hand off with full context → confirm human ownership. The AI never closes them.",
      },
      demonstrate: {
        task: "The AI hits: \"I want to delete all my data and I'm considering legal action about how it was used.\"",
        steps: [
          { move: "Recognise", think: "Which triggers.", result: "Two — a data-deletion request AND legal-action language. Both on the never-resolve list." },
          { move: "Don't attempt", think: "No resolution.", result: "No instructions, no 'here's how', no closing the ticket." },
          { move: "Hand off with context", think: "The right owners + the clock.", result: "Route to the privacy owner and a senior manager; attach the full thread; flag 'GDPR + potential legal'; note the timestamp." },
          { move: "Acknowledge to the customer", think: "Receipt, not answer.", result: "'I've passed this to the team who handles data requests — they'll contact you within [X].'" },
        ],
        full: "The AI recognises both triggers, makes no attempt to resolve, routes to the two right owners with the deadline noted, and sends the customer a receipt — not an answer.",
      },
      deconstruct: [
        "Recognising the trigger is the whole skill — the AI doesn't need to handle it, just to know it can't.",
        "Attaching the timestamp matters because legal and regulatory requests have clocks.",
        "A receipt to the customer is fine; a resolution is not.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Write the escalation rules for an AI agent on an e-commerce support line.",
        fields: [
          { key: "never", label: "The never-resolve-alone list for this context", hint: "What the AI must not close.", minWords: 8 },
          { key: "recognise", label: "How the AI detects each", hint: "Keywords, intent, sentiment.", minWords: 6 },
          { key: "handoff", label: "What the handoff includes", hint: "Context + deadline.", minWords: 5 },
          { key: "customer", label: "What the AI says to the customer meanwhile", hint: "A receipt.", minWords: 4 },
        ],
        model: {
          never: "Refunds over £50; any chargeback or payment dispute; 'cancel my account'; complaints about staff or service; anything mentioning injury, illness, or a dangerous fault; legal or regulator mentions; requests to delete personal data.",
          recognise: "Keyword and intent detection — 'refund', 'cancel', 'lawyer', 'unsafe', 'injured', 'ombudsman', 'delete my data' — plus a severity check for complaints that don't use obvious words.",
          handoff: "Full conversation, the trigger(s) detected, the order / account, the customer's stated urgency, and a timestamp. Routed to the specific owner (returns / safety / legal / privacy).",
          customer: "'I've escalated this to the right team — they'll be in touch within [timeframe]. Your reference is [X].' No attempt to resolve, no instructions.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SU4.1", "Reproduce", "Escalation rules for your support context",
        "Take a support context you know. Write its escalation rules.",
        "Strong answer: the list covers money over a threshold, cancellations, complaints, legal, safety and privacy; detection is concrete; the handoff carries full context plus any deadline; and the AI acknowledges receipt but does not resolve.",
        [
          { key: "never", label: "The never-resolve-alone list", hint: "What the AI must not close.", minWords: 8 },
          { key: "detect", label: "How each is recognised", hint: "Concrete signals.", minWords: 6 },
          { key: "handoff", label: "What the handoff carries", hint: "Context + deadline + owner.", minWords: 5 },
          { key: "ack", label: "What the customer is told", hint: "Receipt only.", minWords: 4 },
        ],
        [
          { label: "List covers money-over-threshold, cancellation, complaint, legal, safety, privacy" },
          { label: "Detection is concrete; handoff carries full context + any deadline" },
          { label: "AI acknowledges receipt but does not resolve" },
        ],
        "independent"),
      scenarioChallenge("SU4.2", "Create", "The AI closed a ticket it shouldn't have",
        "Your AI agent replied to \"your product gave my daughter a rash\" with skincare tips and marked the ticket resolved.",
        "What should have happened?",
        [
          { id: "a", label: "The AI should have given a medical disclaimer with the tips", ok: false, why: "A possible-harm report is not something the AI resolves at all — disclaimer or not." },
          { id: "b", label: "Recognise 'product caused harm' as a safety trigger, make no attempt to advise, hand off to the safety / product team with the full message and a receipt to the customer", ok: true, why: "The AI's only job here is to recognise it can't handle this and route it, fast." },
          { id: "c", label: "The AI should have asked for photos first", ok: false, why: "Still the AI handling a harm report. It should hand off immediately." },
        ],
        "transferable"),
    ],
  },

  {
    id: "SU5", name: "Quality review",
    canDo: "Sample and score AI-assisted replies against a rubric, and feed the misses back into the prompt and the knowledge base.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI support tool's dashboard showed 94% \"resolved\". A manual review of 50 tickets found a third had subtly wrong answers the customer hadn't bothered to challenge. \"Resolved\" meant \"customer stopped replying\", not \"answered correctly\".",
        point: "Deflection metrics measure whether the customer gave up, not whether the answer was right. Only a human sample tells you that.",
      },
      explain: {
        paras: [
          "Run a weekly **quality review**: pull a **random** sample of AI-handled tickets (not just the flagged ones), score each against a short rubric — **correct?** (matches the KB / reality), **grounded?** (cited, no invention), **appropriate tone?**, **right escalation call?** — and log the failure type.",
          "Then close the loop: wrong answers from a KB gap → **fix the KB**; from misretrieval → **fix retrieval**; tone misses → **fix the prompt**; missed escalations → **fix the trigger list**.",
          "Track the miss rate over time. Vanity metrics ('deflection rate', 'CSAT') are context, not the quality measure.",
        ],
        keyIdea: "Weekly: score a random sample against correct / grounded / tone / escalation, log the failure type, and route each failure to its fix (KB, retrieval, prompt, triggers). Deflection ≠ correct.",
      },
      demonstrate: {
        task: "Setting up the review loop.",
        steps: [
          { move: "Sample", think: "Random, not complaints.", result: "20 random AI-handled tickets a week, drawn from all categories — not the ones customers complained about." },
          { move: "Score", think: "Four dimensions.", result: "Each against: correct / grounded / tone / escalation — pass or fail per dimension, with a note." },
          { move: "Categorise the misses", think: "By cause.", result: "KB gap / wrong article retrieved / prompt-or-tone / missed escalation trigger." },
          { move: "Route the fix", think: "To the specific thing.", result: "KB gaps → content team; retrieval misses → tune search; tone → prompt update; escalation → add the trigger. Re-check next week." },
        ],
        full: "20 tickets scored on 4 dimensions weekly, each failure tagged by cause and sent to the specific thing that fixes it. The miss rate is tracked as the real quality number, not deflection.",
      },
      deconstruct: [
        "Sampling randomly (not the complaints) is what surfaces the wrong answers customers accepted.",
        "Tagging the failure cause is what makes the fix targeted instead of 'improve the bot'.",
        "Tracking the miss rate over weeks tells you if the loop is actually working.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Design the quality-review process for an AI support bot that's been live for a month.",
        fields: [
          { key: "sample", label: "What you sample and how much", hint: "Random, across categories.", minWords: 6 },
          { key: "rubric", label: "The dimensions you score", hint: "Correctness, grounding, tone, escalation.", minWords: 6 },
          { key: "loop", label: "How each failure type gets fixed", hint: "Failure → the thing that fixes it.", minWords: 8 },
          { key: "metric", label: "The number you track instead of deflection", hint: "The real quality measure.", minWords: 4 },
        ],
        model: {
          sample: "25 randomly selected AI-resolved conversations per week, stratified across categories so none is under-checked. Include ones marked 'resolved' — those are the risky ones.",
          rubric: "Per conversation: Correct (matches KB / reality) · Grounded (cited, nothing invented) · Tone (matched the customer's state) · Escalation (right call on human handoff) — pass / fail each, with a one-line reason on any fail.",
          loop: "Correct-fail from a KB gap → write the article. From wrong retrieval → adjust search / tags. Grounded-fail → tighten the 'answer only from sources' instruction. Tone-fail → update tone guidance. Escalation-fail → add or fix the trigger. Log the change; re-sample that category next week.",
          metric: "Weekly answer-accuracy rate from the sample (correct + grounded, both passing). Track the trend. Deflection and CSAT are context, not the quality measure.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SU5.1", "Reproduce", "Design a quality-review loop",
        "For an AI support bot (yours or a familiar one), design the quality-review loop.",
        "Strong answer: the sample is random across categories, not just complaints; the rubric covers correctness, grounding, tone and escalation; each failure type routes to a specific fix; and the tracked metric is answer quality, not deflection.",
        [
          { key: "sample", label: "What you sample, how much, how selected", hint: "Random, stratified.", minWords: 6 },
          { key: "rubric", label: "The scoring dimensions", hint: "Four of them.", minWords: 5 },
          { key: "fixes", label: "Failure type → where it gets fixed", hint: "KB / retrieval / prompt / triggers.", minWords: 8 },
          { key: "metric", label: "The real quality number", hint: "Not deflection.", minWords: 4 },
        ],
        [
          { label: "Sample is random across categories, not just complaints" },
          { label: "Rubric covers correctness, grounding, tone, escalation" },
          { label: "Each failure routes to a specific fix; metric is answer quality" },
        ],
        "independent"),
      scenarioChallenge("SU5.2", "Create", "The dashboard says 94% resolved",
        "Leadership is happy: the AI support bot has a 94% resolution rate. A colleague suspects the answers aren't actually good.",
        "How do you find out?",
        [
          { id: "a", label: "Check the CSAT score alongside resolution rate", ok: false, why: "CSAT is also gameable and sparse; neither number measures correctness." },
          { id: "b", label: "Pull a random sample of 'resolved' tickets and score the answers against the KB and reality", ok: true, why: "Resolution rate only means the customer stopped replying. A human sample is the only way to see correctness." },
          { id: "c", label: "Ask the bot to rate its own confidence on each answer", ok: false, why: "Self-rated confidence isn't accuracy." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: SUPPORT_COMPETENCIES, capstoneId: "SUPCAP" };
};
