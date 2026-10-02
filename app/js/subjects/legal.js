/* Subject: legal
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["legal"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const LEGAL_COMPETENCIES = [
  {
    id: "L1", name: "Scope what you're actually checking",
    canDo: "Turn \"review this contract\" into a specific checklist of what matters for this deal — before AI reads a word.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You asked AI to \"review this NDA\". It returned 15 \"issues\" — mostly stylistic nitpicks and one hallucinated clause reference. The actual problem — a 5-year non-compete buried in the definitions — it didn't flag, because you never told it non-competes were the thing you cared about.",
        point: "\"Review this\" with no checklist gets you a pile of noise and misses the one clause that matters for your situation.",
      },
      explain: {
        paras: [
          "A contract review has a purpose: you're signing, you're negotiating, you're checking compliance, you're assessing deal risk. Name it, then build the checklist.",
          "The checklist has four parts: the **deal-specific risks** (for this counterparty, this money, this dependency); the **standard clauses you always check** (liability caps, indemnities, termination, IP, governing law, auto-renewal); the **must-haves and deal-breakers**; and **what's out of scope**.",
          "AI checks the contract against your checklist. It doesn't decide what the checklist is.",
        ],
        keyIdea: "Name the review's purpose, then a checklist: deal-specific risks + your standard clauses + must-haves / deal-breakers + out-of-scope. AI checks against it; it doesn't set it.",
      },
      demonstrate: {
        task: "Reviewing a SaaS vendor agreement you're about to sign.",
        steps: [
          { move: "Name the purpose", think: "Why are we reading this?", result: "We're signing; the risk is our data and vendor lock-in." },
          { move: "Deal-specific risks", think: "This counterparty, this dependency.", result: "They'll hold our customer data — check data processing, breach notification, deletion on exit, sub-processors." },
          { move: "Standard clauses", think: "The ones you always check.", result: "Liability cap vs our exposure; auto-renewal + notice period; termination for convenience; price-increase terms." },
          { move: "Deal-breakers", think: "Decided by you, up front.", result: "No liability cap below 12 months' fees; no data return on termination; unilateral price increases." },
        ],
        full: "The checklist is four data clauses (deal-specific), four standard clauses, and three explicit deal-breakers. AI reads the contract against exactly that — not \"find all issues\".",
      },
      deconstruct: [
        "Naming the purpose narrowed 40 pages to the ~11 clauses that matter.",
        "The deal-breakers are decided by you, not discovered by the AI.",
        "\"Out of scope\" (their indemnity wording, say) stops the review ballooning into a full rewrite.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're reviewing an employment contract for a senior hire your company is making.",
        fields: [
          { key: "purpose", label: "The review's purpose", hint: "Which side, what for.", minWords: 4 },
          { key: "dealspecific", label: "Risks specific to this hire", hint: "IP, restrictive covenants, the offer terms.", minWords: 6 },
          { key: "standard", label: "Clauses you always check for employment", hint: "Your standard list.", minWords: 5 },
          { key: "breakers", label: "Deal-breakers", hint: "What you won't accept.", minWords: 4 },
        ],
        model: {
          purpose: "We're the employer, making the offer; the risk is future disputes and IP ownership.",
          dealspecific: "IP assignment covers the work with a prior-inventions carve-out; restrictive covenants are enforceable in our jurisdiction and proportionate; notice period; bonus / equity terms match the offer letter.",
          standard: "Governing law, confidentiality, garden leave, termination grounds, what survives termination.",
          breakers: "IP assignment with no clear scope; a non-compete our lawyers say is unenforceable (worse than none); equity terms that don't match what was agreed.",
        },
      },
    },
    challenges: [
      fieldsChallenge("L1.1", "Reproduce", "Scope a real contract review",
        "Take a contract you'd review (or a realistic one). Scope the review before any AI.",
        "Strong answer: the review's purpose is named; the checklist separates deal-specific risks from standard clauses; must-haves / deal-breakers are explicit and decided by the reviewer; and a scope boundary is stated.",
        [
          { key: "contract", label: "The contract + your side", hint: "One line.", minWords: 4 },
          { key: "purpose", label: "The review's purpose", hint: "Sign / negotiate / comply / assess.", minWords: 3 },
          { key: "checklist", label: "The checklist — deal-specific + standard clauses", hint: "Both.", minWords: 8 },
          { key: "breakers", label: "Must-haves / deal-breakers", hint: "Your line.", minWords: 4 },
        ],
        [
          { label: "The review's purpose is named" },
          { label: "Checklist separates deal-specific risks from standard clauses" },
          { label: "Deal-breakers are explicit and set by the reviewer; scope boundary stated" },
        ],
        "independent"),
      critiqueChallenge("L1.2", "Adapt", "Fix a scopeless review request",
        "Here is how the review was handed over. Find every problem before AI touches it.",
        "\"Here's the master services agreement — can you get AI to check it over and tell me if there's anything bad in it?\"",
        [
          { label: "No purpose — signing? negotiating? which side are we on?", signals: ["purpose", "which side", "signing", "negotiating", "what for", "why are we reviewing", "our side"] },
          { label: "\"Anything bad\" is not a checklist — every contract has clauses you could improve", signals: ["not a checklist", "anything bad", "too vague", "every contract", "what counts as bad", "no criteria", "define"] },
          { label: "No deal-specifics — the money, the dependency, the counterparty risk", signals: ["deal-specific", "the money", "dependency", "counterparty", "what's at stake", "this deal", "context"] },
          { label: "No deal-breakers named", signals: ["deal-breaker", "must-have", "won't accept", "red line", "non-negotiable"] },
          { label: "Risk that AI returns stylistic noise and misses the clause that matters", signals: ["noise", "nitpick", "stylistic", "misses", "the one clause", "false issues", "signal"] },
        ],
        "transferable", { text: `"We’re the buy-side, about to sign this MSA with a new supplier worth £400k/year over 3 years. Please check: termination rights, liability caps, IP ownership of anything they build for us, and data-protection terms. Flag anything that would block signing this week — don’t flag routine boilerplate. Every flagged issue must cite the specific clause."`, changes: ["States the purpose and side (buy-side, about to sign) instead of “check it over”", "Replaces “anything bad” with a checklist scoped to this deal", "Adds the deal specifics that set the stakes (value, term)", "Names what would actually block signing, and requires a clause citation per issue"] }),
    ],
  },

  {
    id: "L2", name: "Ground every AI claim in the document",
    canDo: "Make AI cite the exact clause for every statement it makes about the contract, and check each citation.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI summary said \"the agreement includes a mutual limitation of liability at 12 months' fees.\" The contract had no liability cap at all. The AI had pattern-matched to what these contracts usually say. The deal nearly closed on that summary.",
        point: "AI describes contracts from the average of every contract it's seen. What it says is in *this* one has to be checked against *this* one.",
      },
      explain: {
        paras: [
          "Every AI statement about the contract must **quote the clause** — section number and the actual text — so you can verify it.",
          "Then check: does the quoted text say what the AI claims? does it exist? is the paraphrase accurate, or has it softened or strengthened the clause?",
          "For anything the AI says is *absent* (\"there's no indemnity clause\"), that's a claim to verify by searching yourself. Absence is exactly what AI gets wrong. An uncited AI claim about the contract is unverified.",
        ],
        keyIdea: "Every AI claim about the contract quotes the clause (section + text). Check the quote exists, says what's claimed, and isn't a softened paraphrase. Claims of absence get verified by hand.",
      },
      demonstrate: {
        task: "AI says: \"Clause 9.2 caps liability at the total fees paid in the prior 12 months.\"",
        steps: [
          { move: "Find 9.2", think: "Does it exist?", result: "Open the contract to 9.2 — it exists." },
          { move: "Read it", think: "Word for word.", result: "It says 'the fees paid in the 12 months preceding the claim' — different from 'prior 12 months', and it's one-directional, not mutual." },
          { move: "Check the paraphrase", think: "Complete?", result: "9.2 also excludes indirect losses — two mechanisms; the AI mentioned one." },
          { move: "Check the absence claim", think: "Search yourself.", result: "AI said 'no super-cap carve-outs'. Search for 'notwithstanding' / 'unlimited' near clause 9 → 9.4 makes data-breach liability uncapped." },
        ],
        full: "The cited clause existed but the AI's paraphrase was loose (timing, mutuality) and incomplete (missed the exclusion), and its claim of 'no carve-outs' was wrong — 9.4 uncaps data-breach liability. All caught by reading the actual text.",
      },
      deconstruct: [
        "The AI's paraphrase drifted toward the *standard* version of the clause.",
        "\"No carve-outs\" is an absence claim — the highest-risk kind.",
        "Reading 9.4 yourself is the check that mattered most.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI has summarised a partnership agreement with three claims: \"Either party may terminate on 60 days notice (cl. 14).\" \"IP created jointly is jointly owned (cl. 8.3).\" \"There is no non-solicitation clause.\"",
        fields: [
          { key: "cite", label: "How you'd verify claim 1", hint: "Open clause 14.", minWords: 5 },
          { key: "paraphrase", label: "What you'd check about claim 2", hint: "'Jointly owned' can mean many things.", minWords: 5 },
          { key: "absence", label: "How you'd check claim 3", hint: "It's an absence claim.", minWords: 5 },
          { key: "rule", label: "Your rule for uncited claims", hint: "One line.", minWords: 4 },
        ],
        model: {
          cite: "Go to clause 14. Confirm it exists, says 60 days (not 30, not 90), 'either party' (not just one), and check whether 'terminate' there means the whole agreement or just a schedule.",
          paraphrase: "Read 8.3. Can each party use the IP freely? license it? Does 8.3 actually say joint ownership, or something like 'the commissioning party owns it'? Check the AI didn't simplify.",
          absence: "Search the whole document for 'solicit', 'poach', 'hire', 'employees of', and read the clauses near confidentiality and restrictive covenants. Absence claims are where AI is least reliable.",
          rule: "Any statement about the contract without a clause citation I can open and read is unverified and doesn't go in my advice.",
        },
      },
    },
    challenges: [
      fieldsChallenge("L2.1", "Reproduce", "Verify an AI contract summary",
        "Take an AI summary of a real contract (or a provided one). Verify it against the document.",
        "Strong answer: each claim is checked against the actual clause text; paraphrase accuracy is assessed (softened / strengthened / incomplete); absence claims are verified by independent search; and uncited claims are flagged as unverified.",
        [
          { key: "claims", label: "3+ AI claims about the contract", hint: "Quote them.", minWords: 6 },
          { key: "verification", label: "How you checked each", hint: "Quote found, paraphrase accurate, absence searched.", minWords: 10 },
          { key: "findings", label: "What was off", hint: "The discrepancies.", minWords: 5 },
        ],
        [
          { label: "Each claim checked against the actual clause text" },
          { label: "Paraphrase accuracy assessed; absence claims independently searched" },
          { label: "Uncited claims flagged as unverified" },
        ],
        "independent"),
      scenarioChallenge("L2.2", "Create", "The AI described a clause that isn't there",
        "An AI review of a supply contract confidently describes a force majeure clause with specific carve-outs. You can't find any force majeure clause in the document.",
        "What do you conclude and do?",
        [
          { id: "a", label: "It must be there — search again more carefully, the AI read the whole thing", ok: false, why: "A confident AI description of a non-existent clause is a known failure. Your search is the ground truth." },
          { id: "b", label: "Treat it as a hallucination — the contract likely has no force majeure clause, which is itself a finding (a risk) to raise", ok: true, why: "The absence is real and worth flagging; the AI's description of the missing clause is noise." },
          { id: "c", label: "Ask the AI to point to the clause number", ok: false, why: "It will often invent one just as confidently." },
        ],
        "transferable"),
    ],
  },

  {
    id: "L3", name: "Redlines and drafting with a human editor",
    canDo: "Use AI to draft clauses and redlines fast, then edit every one as if a junior wrote it.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI-drafted indemnity clause looked professional and was used in three contracts before someone noticed it indemnified the wrong party — the indemnifier and indemnitee were reversed. Standard-looking language, backwards meaning.",
        point: "AI drafts legal language that reads right and can mean the opposite of what you need. Fluent ≠ correct.",
      },
      explain: {
        paras: [
          "AI is fast at: first-draft clauses from a plain-English intent, redline suggestions against a position, reformatting, and alternative phrasings to negotiate with.",
          "It is unreliable at: the *direction* of obligations, cross-references (clause 9.2 becomes 9.3 after an edit and the reference doesn't update), defined terms used consistently, and jurisdiction-specific enforceability.",
          "Workflow: give AI the intent and your position; get a draft; **read it as the meaning, not the words** — who owes what to whom, when, capped at what; check every cross-reference and defined term; and a qualified person signs off on anything that creates a legal obligation.",
        ],
        keyIdea: "AI drafts from intent fast; you check the *meaning* (direction of obligations, caps, timing), every cross-reference and defined term, and jurisdiction fit. A qualified human signs off on anything creating an obligation.",
      },
      demonstrate: {
        task: "Drafting a confidentiality clause with AI.",
        steps: [
          { move: "Intent to AI", think: "Plain English + position.", result: "'Mutual confidentiality, survives 3 years post-termination, standard carve-outs (public domain, independently developed, required by law).'" },
          { move: "Read the meaning", think: "Who is bound?", result: "Check it's actually mutual (not just binding the other side); the 3 years runs from the right date; the carve-outs are the ones asked for." },
          { move: "Check cross-refs", think: "Do they resolve?", result: "It references 'the Purpose defined in clause 2' — confirm clause 2 defines a Purpose and it's the right scope." },
          { move: "Sign-off", think: "Anything binding.", result: "A lawyer reviews before it goes in a contract that will be signed." },
        ],
        full: "The AI produced a usable first draft in seconds. The review checked mutuality, the survival period's start date, the carve-outs, and the cross-reference to the defined Purpose — then a qualified person approved it.",
      },
      deconstruct: [
        "Reading \"who is bound\" caught whether the clause is actually mutual.",
        "Cross-references silently break when clauses get renumbered.",
        "The sign-off is non-negotiable for anything that will be signed.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You need AI to suggest a redline to a client's proposed payment terms — they want 90 days, you want 30.",
        fields: [
          { key: "brief", label: "What you give the AI", hint: "The clause + your position + a fallback.", minWords: 6 },
          { key: "meaning", label: "What you check in the meaning of its redline", hint: "Did it actually change the period?", minWords: 5 },
          { key: "refs", label: "Cross-reference / defined-term checks", hint: "Fees definition, schedules, numbers.", minWords: 4 },
          { key: "signoff", label: "Who approves and when", hint: "For a redline going to the client.", minWords: 4 },
        ],
        model: {
          brief: "'Here's clause 5 (payment terms). Our position: net 30, late-payment interest at [X]%, right to suspend services after 45 days overdue. Suggest a redline and a fallback to net 45.'",
          meaning: "Does the redline actually change the payment period to 30 (not just add words)? Does 'suspend' mean what we want, or did it write 'terminate'? Is the interest rate a placeholder we must fill, or did it invent one?",
          refs: "If it references a 'Fees' definition or a schedule, confirm those exist and match. Check clause numbers if it moved anything.",
          signoff: "Whoever owns the negotiation reviews it; a lawyer if the clause affects our liability or termination rights.",
        },
      },
    },
    challenges: [
      fieldsChallenge("L3.1", "Reproduce", "Draft-and-check a real clause",
        "Take a clause you need. Draft it with AI and check it.",
        "Strong answer: the brief gives intent and position, not just \"write a clause\"; the check is on meaning — direction of obligations, caps, timing — not wording; cross-references and defined terms are checked; and a qualified sign-off is named for anything binding.",
        [
          { key: "clause", label: "The clause + your intent / position", hint: "One or two lines.", minWords: 5 },
          { key: "aidraft", label: "The brief you'd give the AI", hint: "Intent + position.", minWords: 5 },
          { key: "meaningcheck", label: "What you verify in the meaning", hint: "Direction, caps, timing.", minWords: 6 },
          { key: "signoff", label: "The approval for anything binding", hint: "Who, when.", minWords: 3 },
        ],
        [
          { label: "The brief gives intent and position, not just \"write a clause\"" },
          { label: "The check is on meaning — obligations, caps, timing — not wording" },
          { label: "Cross-references and defined terms checked; qualified sign-off for anything binding" },
        ],
        "independent"),
      critiqueChallenge("L3.2", "Adapt", "Review an AI-drafted clause",
        "Here is an AI-drafted clause for a services agreement. Find every problem.",
        "\"The Supplier shall indemnify and hold harmless the Client against any and all losses, damages, and costs, including legal fees, arising from the Client's breach of this Agreement or the Client's negligence.\"",
        [
          { label: "The direction is backwards — the Supplier is indemnifying the Client against the *Client's own* breach and negligence", signals: ["backwards", "direction", "wrong party", "client's own", "reversed", "should be the supplier's", "nonsensical", "indemnifier"] },
          { label: "\"any and all losses ... including\" with no cap is an unlimited indemnity", signals: ["unlimited", "no cap", "uncapped", "any and all", "should be capped", "exposure", "no limit"] },
          { label: "No carve-out for the Client's contributory negligence", signals: ["contributory", "carve-out", "to the extent", "except where the client", "own negligence", "proportion"] },
          { label: "\"arising from\" is broad — \"to the extent caused by\" is tighter", signals: ["arising from", "to the extent caused by", "broad", "causation", "tighter", "scope"] },
          { label: "A lawyer must review before this is used", signals: ["lawyer", "qualified", "review", "sign-off", "not use as-is", "legal review"] },
        ],
        "transferable", { text: `"The Client shall indemnify and hold harmless the Supplier against losses, damages and reasonable legal fees, up to a cap of 12 months’ fees, to the extent caused by the Client’s breach of this Agreement, excluding any portion caused by the Supplier’s own negligence. [Reviewed by qualified counsel before use.]"`, changes: ["Direction corrected — the Client indemnifies the Supplier, not the reverse", "A cap replaces the unlimited “any and all losses” language", "A carve-out for the other party’s own negligence is added", "“arising from” tightened to “to the extent caused by,” flagged for counsel review"] }),
    ],
  },

  {
    id: "L4", name: "Privilege, confidentiality and what you put in the prompt",
    canDo: "Decide what contract and client information can go into an AI tool, and set that up so mistakes can't happen.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A lawyer pasted a full M&A contract into a consumer AI chatbot for a summary. The counterparty's name, the price, and the deal terms — all now in a third party's systems, potentially used for training, on a deal under strict NDA. The client was not pleased.",
        point: "Pasting a confidential document into an AI tool is a disclosure. Whether it's a *permitted* one depends entirely on the tool and the terms.",
      },
      explain: {
        paras: [
          "Before any client or contract text goes into an AI tool: **What's the tool's data policy?** Does it train on inputs? Retain them? Where? A consumer chatbot and an enterprise tool with a data-processing agreement are completely different.",
          "**Does putting this here breach confidentiality, privilege, or the NDA on this matter?** Privileged material and matters under NDA have the tightest limits.",
          "**Can you redact?** Names, figures, identifying details out; structure and clause text in — often enough for a review task.",
          "**Enforce it**: an approved tool with the right contract in place, and a rule (ideally technical) against pasting into anything else. Disclosure isn't reversible.",
        ],
        keyIdea: "Before client/contract text goes in: check the tool's data policy (train? retain?), whether it breaches confidentiality / privilege / NDA, whether you can redact identifiers, and enforce an approved-tool-only rule. Disclosure isn't reversible.",
      },
      demonstrate: {
        task: "A paralegal wants to use AI to summarise a set of leases for a property deal.",
        steps: [
          { move: "Tool check", think: "Data policy.", result: "The firm's enterprise AI tool has a DPA, no training on inputs, EU data residency — approved for client data." },
          { move: "Matter check", think: "Extra restrictions?", result: "The deal isn't under a special NDA beyond normal client confidentiality — the enterprise tool is within policy." },
          { move: "Redaction", think: "Cheap insurance.", result: "Redact the tenant names and exact rents; the clause structure is what the summary needs." },
          { move: "Enforce", think: "Make it real.", result: "The work is done only in the approved tool; the consumer chatbot is blocked on work devices." },
        ],
        full: "The task goes ahead — but only because the tool was checked (DPA, no training, data residency), the matter had no extra restrictions, identifiers were redacted anyway, and the approved-tool-only rule was enforced technically.",
      },
      deconstruct: [
        "\"No training on inputs\" plus a DPA is the line between an approved tool and a disclosure.",
        "Redacting identifiers is cheap insurance even on an approved tool.",
        "The technical block on consumer tools is what makes the policy real.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're a solo founder who wants to use AI to review contracts for your startup. No legal team, no enterprise AI subscription.",
        fields: [
          { key: "toolpolicy", label: "What to check before using a tool", hint: "Training, retention.", minWords: 5 },
          { key: "whatnot", label: "What you should never paste, even into a paid tool", hint: "The hard limits.", minWords: 5 },
          { key: "redact", label: "What you'd redact for a review task", hint: "Identifiers.", minWords: 4 },
          { key: "setup", label: "How you'd set this up safely", hint: "The practical rule.", minWords: 5 },
        ],
        model: {
          toolpolicy: "Read the specific plan's terms: does it train on your inputs? (Many consumer tiers do; many paid/business tiers don't — check, don't assume.) Retention period? A business tier with a 'no training, zero retention' option is the minimum.",
          whatnot: "Anything under a specific NDA that names the AI-tool risk; anything where the counterparty could object; live deal terms for an unannounced deal if leakage would matter.",
          redact: "Counterparty name, figures, individuals' names, anything that identifies the deal. Keep the clause text and structure — that's what a review needs.",
          setup: "One paid business-tier tool with training off. A personal rule: redact identifiers, never paste into a free tool, and for anything high-stakes get a real lawyer — AI is a first pass, not the review.",
        },
      },
    },
    challenges: [
      fieldsChallenge("L4.1", "Reproduce", "Confidentiality plan for AI contract work",
        "For your situation, write the plan for keeping client / contract information safe when using AI.",
        "Strong answer: the tool's training and retention policy is checked, not assumed; privilege / NDA / confidentiality limits are identified; a redaction approach is described; and enforcement is technical or procedural, not just intent.",
        [
          { key: "context", label: "Your situation", hint: "Solo / firm / in-house.", minWords: 3 },
          { key: "toolcheck", label: "What you verify about the tool", hint: "Training, retention, residency.", minWords: 5 },
          { key: "limits", label: "What never goes in", hint: "Privilege, NDA.", minWords: 4 },
          { key: "enforcement", label: "How the rule is made real", hint: "Technical or procedural.", minWords: 4 },
        ],
        [
          { label: "The tool's training and retention policy is checked, not assumed" },
          { label: "Privilege / NDA / confidentiality limits identified; a redaction approach described" },
          { label: "Enforcement is technical or procedural, not just intent" },
        ],
        "independent"),
      scenarioChallenge("L4.2", "Create", "A colleague pasted a client contract into a free chatbot",
        "You discover a colleague has been pasting client contracts into a free consumer AI tool for months. The tool's terms say inputs may be used to improve the service.",
        "What's the situation and what do you do?",
        [
          { id: "a", label: "Delete the chat history and move on — the damage is contained", ok: false, why: "Deleting your view of the history doesn't remove data already ingested or used, and there may be a duty to disclose to clients." },
          { id: "b", label: "Treat it as a confidentiality incident: stop the practice now, assess which clients / matters were exposed, take advice on disclosure obligations, and put an approved tool + technical block in place", ok: true, why: "It's an incident — handle it like one, and fix the process so it can't recur." },
          { id: "c", label: "It's probably fine since no one has complained", ok: false, why: "The breach exists whether or not anyone noticed." },
        ],
        "transferable"),
    ],
  },

  {
    id: "L5", name: "AI is a first pass, not the legal opinion",
    canDo: "Know exactly where AI's contract help stops and a qualified human's judgement has to take over.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A founder used an AI tool to \"check\" a term sheet, it said \"looks standard\", and they signed. The liquidation preference was 3x participating — highly non-standard and very expensive. The AI had seen enough term sheets to recognise the format, not enough to know that number was a problem for the founder.",
        point: "AI can tell you what a contract *says* and how it compares to typical language. It can't tell you whether it's *right for you* — that's judgement about your situation, your risk, your leverage.",
      },
      explain: {
        paras: [
          "**AI can**: extract and summarise clauses (verified), flag deviations from a standard or your playbook, draft first-pass language, speed up version comparison, surface questions to ask.",
          "**AI cannot be the final word on**: whether a risk is acceptable *for you*, negotiation strategy, enforceability in a jurisdiction, whether to sign, anything where being confidently wrong is expensive and hard to reverse — and it cannot carry the professional responsibility.",
          "For anything consequential (signing, advising a client, litigation), AI's output is an input to a qualified person's opinion, logged as such. If you're not qualified and the stakes are real, that person is a lawyer.",
        ],
        keyIdea: "AI: extract / summarise (verified), flag deviations, draft, compare, surface questions. Not AI's call: is this risk acceptable for me, strategy, enforceability, whether to sign. Consequential = a qualified human owns the opinion; AI is a logged input.",
      },
      demonstrate: {
        task: "Using AI on a commercial lease before signing.",
        steps: [
          { move: "What AI did", think: "The mechanical first pass.", result: "Summarised the key terms (verified against the lease), flagged that the repair obligation and break clause differ from a standard lease, listed 6 questions to raise." },
          { move: "Where it stopped", think: "The judgement calls.", result: "Whether a full-repairing lease is acceptable given the building's age; whether the rent review is market (needs a surveyor); whether to sign." },
          { move: "The handoff", think: "To a qualified person.", result: "The AI's summary and flags go to a property solicitor, who advises on the repair and break-clause risk." },
          { move: "Logged", think: "Reviewable.", result: "The file records that AI was used for the first pass and a solicitor gave the opinion." },
        ],
        full: "AI did the mechanical first pass and surfaced the right questions. The judgement calls — acceptable risk, market terms, whether to sign — went to a qualified person, with the AI's role logged as an input.",
      },
      deconstruct: [
        "\"Differs from standard\" is an AI-findable fact; \"is that difference acceptable for you\" is not.",
        "The questions the AI surfaced are useful even though the answers aren't the AI's.",
        "Logging the AI's role protects everyone if the deal goes wrong.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're informally advising a friend who's about to sign a franchise agreement. You've run it through an AI tool.",
        fields: [
          { key: "aican", label: "What the AI output is genuinely useful for here", hint: "The map.", minWords: 5 },
          { key: "ainot", label: "The judgement calls that are not the AI's — or yours", hint: "Be honest about your own limits.", minWords: 5 },
          { key: "handoff", label: "Who the real advice should come from", hint: "The qualified person.", minWords: 4 },
          { key: "honest", label: "What you'd honestly tell your friend about the AI's 'review'", hint: "Prep, not advice.", minWords: 6 },
        ],
        model: {
          aican: "A clear summary of the key obligations, the fees and their triggers, the term and renewal, the territory, and the exit terms — plus a list of the clauses that look unusual or one-sided.",
          ainot: "Whether the franchise economics actually work; whether the restrictions are enforceable; whether the initial fee is reasonable; whether to sign. And it's not my call either — I'm not qualified.",
          handoff: "A solicitor who does franchise agreements, and ideally an accountant on the numbers. Before signing anything.",
          honest: "'The AI gave us a good map of what's in it and what to ask about — but it can't tell you if this is a good deal or a fair contract. For something you'll be locked into for 10 years, get a franchise solicitor to look at it. Treat the AI summary as prep, not advice.'",
        },
      },
      // AI-role ladder — from `demonstrate`'s lease-review walkthrough.
      roleMap: [
        { label: "Summarising the key contract terms", role: "do-it" },
        { label: "Listing questions to raise", role: "do-it" },
        { label: "Flagging clauses that differ from a standard lease", role: "check" },
        { label: "Judging whether the lease is acceptable, and whether to sign", role: "stay-out" },
      ],
    },
    challenges: [
      fieldsChallenge("L5.1", "Reproduce", "Draw the line for a real contract situation",
        "Take a contract situation. Draw the line between AI's help and the qualified-human judgement.",
        "Strong answer: AI's useful role is specific (extract, flag, draft, compare, question); the non-AI judgement calls are named (acceptable risk, strategy, enforceability, whether to sign); a qualified opinion-owner is identified for consequential matters; and the AI's role is logged as an input.",
        [
          { key: "situation", label: "The contract + your role", hint: "One line.", minWords: 4 },
          { key: "aican", label: "What AI genuinely helps with", hint: "Specific.", minWords: 5 },
          { key: "ainot", label: "The judgement calls outside AI — and whether outside you too", hint: "Risk, strategy, enforceability, sign?", minWords: 5 },
          { key: "handoff", label: "Who owns the opinion; how the AI role is logged", hint: "Qualified person + record.", minWords: 4 },
        ],
        [
          { label: "AI's useful role is specific (extract, flag, draft, compare, question)" },
          { label: "The non-AI judgement calls are named" },
          { label: "A qualified opinion-owner is identified; the AI's role is logged" },
        ],
        "independent"),
      scenarioChallenge("L5.2", "Create", "\"The AI said it was standard\"",
        "Someone on your team advised a client that a contract was 'fine to sign — we ran it through the AI and it flagged nothing unusual.' The client signed. A clause the AI didn't flag turns out to be a serious problem.",
        "What went wrong in how the AI was used?",
        [
          { id: "a", label: "The AI model wasn't good enough — use a better one", ok: false, why: "A better model still can't own a professional opinion or judge acceptable risk for the client." },
          { id: "b", label: "\"The AI flagged nothing\" was treated as \"a qualified review found nothing\" — the AI's output should have been an input to a person's opinion, not the opinion itself", ok: true, why: "The AI missing something is expected; a person still owns the judgement on anything consequential." },
          { id: "c", label: "The client should have read it themselves", ok: false, why: "The failure is on the advice given, not the client." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: LEGAL_COMPETENCIES, capstoneId: "LEGCAP" };
};
