/* Subject: realestate
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["realestate"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const RE_COMPETENCIES = [
  {
    id: "RE1", name: "Listing descriptions that don't overclaim",
    canDo: "Draft listing copy whose claims are checked against real, verified facts about the specific property — not a plausible-sounding, appealing generalisation.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted a listing calling the home's school assignment \"top-rated\" and the kitchen \"recently renovated.\" Neither was checked: the school-district boundary had actually shifted the year before, assigning the address to a different school, and the \"renovation\" was a repaint five years earlier. A buyer's agent caught both discrepancies, and the listing had to be corrected mid-marketing.",
        point: "AI will happily generate appealing, plausible-sounding claims — checking them against this specific property's real facts is a separate step it won't do for you.",
      },
      explain: {
        paras: [
          "Check every **factual claim** (school assignment, renovation dates, square footage, amenities) against a **real, current source** for this specific address — not a generalisation.",
          "Be alert to **fair-housing-sensitive language** — steering phrases about neighbourhood character or who a property is \"ideal for\" carry real legal risk and vary by jurisdiction.",
          "Specific fair-housing and disclosure rules vary by jurisdiction — check with a broker/compliance officer for what actually applies here rather than assume a rule from elsewhere.",
          "A listing is a factual claim buyers rely on to make a major financial decision — treat every specific detail as something that needs a real source.",
        ],
        keyIdea: "Every specific claim in a listing needs a real, current source for this exact property — an appealing generalisation is not a verified fact.",
      },
      demonstrate: {
        task: "Reviewing an AI-drafted listing before publishing.",
        steps: [
          { move: "Check the school claim", think: "Current boundary for this address?", result: "boundary shifted last year — now assigned to a different school" },
          { move: "Check the renovation claim", think: "What actually happened, when?", result: "a repaint 5 years ago, not a renovation" },
          { move: "Correct both", think: "Match the real facts.", result: "school claim removed pending confirmation; \"recently renovated\" replaced with \"freshly painted\"" },
          { move: "Scan for steering language", think: "Fair-housing check.", result: "one phrase about the neighbourhood's \"family feel\" flagged and removed" },
        ],
        full: "Both the school and renovation claims were checked against real, current facts and corrected; a fair-housing-sensitive phrase was also caught and removed before publishing.",
      },
      deconstruct: [
        "Checking a claim against a real, current source for this specific address is what catches an appealing-but-wrong generalisation.",
        "Fair-housing-sensitive language needs its own explicit check — it can slip in through what reads as ordinary, positive description.",
        "A listing's claims are a factual promise to the buyer, not marketing flourish.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted: \"Perfect starter home in a quiet, family-friendly neighbourhood, with a fully updated kitchen.\"",
        fields: [
          { key: "checks", label: "What you'd verify before publishing this", hint: "Name each claim.", minWords: 8 },
          { key: "flag", label: "Any fair-housing-sensitive language here", hint: "Be specific.", minWords: 5 },
          { key: "fix", label: "The corrected listing language", hint: "Match verified facts.", minWords: 8 },
        ],
        model: {
          checks: "What \"fully updated kitchen\" actually means (dates, what was replaced) and confirming it against renovation records or the seller directly, rather than the vendor's or AI's assumed phrasing.",
          flag: "\"Family-friendly\" describes who the property is supposedly ideal for, which can function as steering language depending on context and jurisdiction.",
          fix: "\"Starter home with a kitchen updated in 2024 (new counters and appliances) in a quiet neighbourhood\" — specific, verified claims, steering language removed.",
        },
      },
    },
    challenges: [
      fieldsChallenge("RE1.1", "Reproduce", "Verify a real listing's claims",
        "Take a real (or plausible) property listing draft. Check its factual claims against real sources and scan for fair-housing-sensitive language.",
        "Strong answer: at least one specific claim is checked against a real source, not assumed; any fair-housing-sensitive language is identified; the rewrite matches verified facts.",
        [
          { key: "draft", label: "The original listing draft", hint: "Quote key claims.", minWords: 6 },
          { key: "checked", label: "What you checked, and what you found", hint: "Be specific.", minWords: 8 },
          { key: "fix", label: "The corrected listing", hint: "Matches verified facts.", minWords: 6 },
        ],
        [
          { label: "A specific claim checked against a real source, not assumed" },
          { label: "Fair-housing-sensitive language identified" },
          { label: "Rewrite matches verified facts" },
        ],
        "independent"),
      critiqueChallenge("RE1.2", "Adapt", "A listing with unverified claims and steering language",
        "Here's a drafted listing. Find what's wrong with it.",
        "\"Charming home in a safe, established neighbourhood, ideal for young families, with a newly renovated bathroom and top-rated schools nearby.\"",
        [
          { label: "'Newly renovated bathroom' and 'top-rated schools' aren't checked against any real source for this address", signals: ["not verified", "no source given", "unchecked claim", "not confirmed", "assumed, not checked", "no real source"] },
          { label: "'Safe' and 'established neighbourhood' are the kind of vague, steering-adjacent characterisations that need care", signals: ["steering language", "characterizes the neighbourhood", "vague and risky", "fair housing concern", "describes who it's for", "coded language"] },
          { label: "'Ideal for young families' explicitly describes who the property suits, which is a fair-housing red flag", signals: ["ideal for young families", "describes a type of buyer", "who it's for", "explicit steering", "targets a demographic", "fair housing issue"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "RE2", name: "Comparative market analysis grounded in real comps",
    canDo: "Build a CMA from comps that genuinely represent the market — not comps selected to justify a target price.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "An AI-assisted CMA selected 3 comps, all unusually high-priced relative to the rest of the neighbourhood, to support a seller's preferred asking price. The listing sat unsold for months at that price before a real market-based reassessment brought it down to what comparable, representative sales actually supported.",
        point: "A CMA built from cherry-picked comps doesn't reflect the real market — it just produces a number that looks justified.",
      },
      explain: {
        paras: [
          "Check that selected comps are **genuinely representative** of the local market, not selected because they support a target price.",
          "Adjust for **recency** — a sale from 18 months ago needs a time adjustment or lower weighting if market conditions have shifted, not equal treatment with a recent sale.",
          "Adjust for **real differences** (condition, size, lot) rather than treating \"similar enough\" comps as directly comparable without any adjustment.",
          "A CMA's value comes from reflecting the actual market — a number that looks favourable but doesn't hold up against real comps will surface at listing or negotiation anyway.",
        ],
        keyIdea: "A CMA is only useful if its comps genuinely represent the market — recency and condition need real adjustment, not comps chosen to fit a target price.",
      },
      demonstrate: {
        task: "Reviewing an AI-assisted CMA for a listing.",
        steps: [
          { move: "Check comp selection", think: "Representative, or cherry-picked?", result: "all 3 comps priced well above the neighbourhood median — a pattern worth checking" },
          { move: "Pull the full comp set", think: "What's actually out there?", result: "a wider, representative set shows a lower, more typical median" },
          { move: "Check recency", think: "Same time period?", result: "one comp was 18 months old — market had cooled since; adjusted down" },
          { move: "Revise the CMA", think: "Use the representative set.", result: "recommended price range corrected to reflect real, adjusted comps" },
        ],
        full: "The original CMA's cherry-picked, high-priced comps were replaced with a representative set, one comp was time-adjusted for a cooled market, and the recommended price range was corrected accordingly.",
      },
      deconstruct: [
        "Checking whether comps are representative — not just individually plausible — is what catches a CMA built to fit a target price.",
        "A recency mismatch is one of the most common ways a comp overstates or understates current value.",
        "The CMA's job is to reflect the real market, even when that's an uncomfortable number for the client to hear.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "An AI-assisted CMA uses 4 comps, 3 of which sold over a year ago in a market that's since cooled 8%.",
        fields: [
          { key: "check", label: "What you'd check about these comps", hint: "Representativeness, recency.", minWords: 6 },
          { key: "adjust", label: "How you'd adjust for the older sales", hint: "Concrete method.", minWords: 6 },
          { key: "redflag", label: "A red flag that would make you rebuild the comp set", hint: "Be specific.", minWords: 5 },
        ],
        model: {
          check: "Whether these 4 comps represent the broader set of comparable recent sales, or whether a different, more current set would tell a different story.",
          adjust: "Apply a downward time adjustment to the older comps reflecting the known 8% cooling, or weight them less heavily than the one recent comp.",
          redflag: "If most of the comp set is meaningfully older than the most recent comparable sales available, or if the selected comps all happen to support the same target number.",
        },
      },
    },
    challenges: [
      fieldsChallenge("RE2.1", "Reproduce", "Build a CMA from real, representative comps",
        "Take a real (or plausible) property. Build a CMA from comps you check for representativeness and adjust for recency/condition.",
        "Strong answer: comps are checked for representativeness, not selected to fit a target price; recency is adjusted for explicitly; condition differences are named and adjusted.",
        [
          { key: "property", label: "The property", hint: "One line.", minWords: 4 },
          { key: "comps", label: "The comps and how you checked they're representative", hint: "Be specific.", minWords: 10 },
          { key: "adjust", label: "The recency/condition adjustments made", hint: "Concrete.", minWords: 8 },
        ],
        [
          { label: "Comps checked for representativeness, not fitted to a target price" },
          { label: "Recency adjusted for explicitly" },
          { label: "Condition differences named and adjusted" },
        ],
        "independent"),
      scenarioChallenge("RE2.2", "Create", "The seller wants a higher number",
        "A seller pushes back on your CMA, wanting a higher asking price, and asks you to \"find comps that support it.\"",
        "What do you do?",
        [
          { id: "a", label: "Search for comps that specifically support the higher number", ok: false, why: "Selecting comps to fit a desired price defeats the purpose of a CMA and risks a listing that sits unsold at an unsupported price." },
          { id: "b", label: "Explain what the representative comp set actually shows, and discuss pricing strategy honestly from there", ok: true, why: "The CMA's value is in reflecting the real market — the conversation with the seller should be honest about what that market actually supports." },
          { id: "c", label: "Quietly adjust the CMA's numbers to land closer to what the seller wants", ok: false, why: "Adjusting the analysis to please the client rather than reflect the market undermines the whole point of doing a CMA." },
        ],
        "transferable"),
    ],
  },

  {
    id: "RE3", name: "Client communication that stays honest about property condition",
    canDo: "Communicate a property's condition and known issues to clients honestly — matching the actual evidence, not a more reassuring tone.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A buyer directly asked about a prior water leak mentioned in disclosure paperwork. AI drafted a reassuring reply calling it \"a minor, fully resolved issue\" — the actual disclosure only stated a leak had occurred and been repaired, with no assessment of whether it was \"minor\" or fully resolved. The buyer relied on the reassurance and skipped a deeper inspection.",
        point: "A confident, reassuring tone that goes beyond what the actual disclosure says is a real misrepresentation, not just optimistic phrasing.",
      },
      explain: {
        paras: [
          "When a client asks about a known issue, **disclose what's actually documented** — don't let AI's drafted tone add reassurance the evidence doesn't support.",
          "Check any AI-drafted response about condition **against the actual inspection/disclosure document**, not a general impression of the property.",
          "**Match the tone to the evidence** — if the disclosure is uncertain or incomplete, the communication should say so, not resolve the uncertainty for the client.",
          "Disclosure obligations are often a real, jurisdiction-specific legal requirement, not just good practice — treat a known, disclosable issue as something that must be communicated accurately.",
        ],
        keyIdea: "Communication about a property's condition should match exactly what the real documentation says — never a more reassuring version of it.",
      },
      demonstrate: {
        task: "Responding to a buyer's question about a disclosed water leak.",
        steps: [
          { move: "Check the actual disclosure text", think: "What does it really say?", result: "leak occurred and was repaired; no statement on whether the underlying cause was fixed" },
          { move: "Check the AI draft", think: "Does it match?", result: "drafted reply added \"fully resolved\" — not actually stated in the disclosure" },
          { move: "Correct it", think: "Match the real document.", result: "\"the disclosure states a leak occurred and was repaired; we don't have further detail on the underlying cause — worth asking the seller directly or having an inspector check\"" },
        ],
        full: "The AI-added reassurance ('fully resolved') that wasn't actually in the disclosure was removed, replaced with an accurate statement of what's known and a suggestion for how to get more certainty.",
      },
      deconstruct: [
        "Checking the drafted response against the actual document is what catches AI adding reassurance the evidence doesn't support.",
        "Matching tone to the real level of certainty (rather than resolving it for the client) is what keeps the communication honest.",
        "Disclosure obligations mean this isn't just about good client service — it can be a real legal requirement.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted a reply to a buyer's inspection question: \"The roof is in great shape, no concerns.\" The actual inspection report notes the roof is \"functional but nearing the end of its typical lifespan, no active leaks found at time of inspection.\"",
        fields: [
          { key: "gap", label: "What's mismatched between the draft and the real report?", hint: "Be specific.", minWords: 6 },
          { key: "fix", label: "The corrected reply", hint: "Match the actual report.", minWords: 8 },
          { key: "why", label: "Why this matters even though no active leak was found", hint: "Be specific.", minWords: 6 },
        ],
        model: {
          gap: "\"Great shape, no concerns\" omits that the roof is nearing the end of its typical lifespan — a material fact for a buyer's future budgeting.",
          fix: "\"The inspection found the roof functional with no active leaks, but noted it's nearing the end of its typical lifespan — worth factoring into your planning.\"",
          why: "A buyer relying on 'no concerns' might not budget for a near-term roof replacement, which is exactly the kind of gap that damages trust when it's discovered later.",
        },
      },
    },
    challenges: [
      fieldsChallenge("RE3.1", "Reproduce", "Match a real communication to the actual documentation",
        "Take a real (or plausible) AI-drafted response about a property's condition. Check it against the actual disclosure/inspection document and correct any mismatch.",
        "Strong answer: at least one claim is checked against the real document, not a general impression; the rewrite matches the document's actual level of certainty, not a more reassuring tone.",
        [
          { key: "original", label: "The original AI-drafted response", hint: "Quote it.", minWords: 5 },
          { key: "gap", label: "The gap versus the real document", hint: "Be specific.", minWords: 6 },
          { key: "fix", label: "The corrected response", hint: "Matches the real document.", minWords: 8 },
        ],
        [
          { label: "Claim checked against the real document, not a general impression" },
          { label: "Rewrite matches the document's actual level of certainty" },
          { label: "No added reassurance beyond what's actually documented" },
        ],
        "independent"),
      scenarioChallenge("RE3.2", "Create", "The seller doesn't want an issue mentioned",
        "A seller asks you not to bring up a documented, disclosed issue unless the buyer specifically asks.",
        "A buyer then asks a general question about the property's condition. What do you do?",
        [
          { id: "a", label: "Answer generally and avoid the specific documented issue since they didn't ask about it by name", ok: false, why: "A general condition question reasonably calls for disclosing a known, documented issue — avoiding it because they didn't guess the exact name isn't honest disclosure." },
          { id: "b", label: "Disclose the known, documented issue as part of answering the condition question honestly", ok: true, why: "A known, disclosable issue should be communicated when a client asks about condition, regardless of the seller's preference." },
          { id: "c", label: "Tell the buyer to check the disclosure paperwork themselves without mentioning anything specific", ok: false, why: "Deflecting a direct question to paperwork instead of answering honestly is evasive, even if the information is technically available elsewhere." },
        ],
        "transferable"),
    ],
  },

  {
    id: "RE4", name: "Contract and offer paperwork gets a real human review",
    canDo: "Treat AI-drafted contract/offer terms as a draft needing a real, qualified review against this transaction's actual facts before submission — never send-ready as-is.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted contingency language for an offer, including a financing contingency deadline. Nobody checked it against what the buyer had actually agreed to verbally — the drafted deadline was a week earlier than intended. The offer was submitted and accepted before the mismatch was caught, leaving the buyer bound to a tighter timeline than they'd planned for.",
        point: "Once submitted and accepted, contract language is what the client is legally bound to — not what they meant to agree to.",
      },
      explain: {
        paras: [
          "Every **specific term** (dates, figures, contingencies) in AI-drafted offer paperwork needs to be **checked against this transaction's actual facts**, not just read for whether it looks correct.",
          "A **licensed agent/attorney review** (as required in your jurisdiction) is needed before submission — this is a legally binding document, not an internal draft.",
          "Check that the paperwork matches **what the client actually agreed to**, not just what a previous draft or template said.",
          "The cost of catching a mismatch before submission is a short delay; the cost of catching it after acceptance is a binding, hard-to-reverse problem.",
        ],
        keyIdea: "Offer paperwork is a binding legal document — every specific term needs a real, qualified review against this transaction's actual facts before submission.",
      },
      demonstrate: {
        task: "Reviewing AI-drafted contingency language before submitting an offer.",
        steps: [
          { move: "Check the financing contingency deadline", think: "Match to what was agreed?", result: "drafted deadline is a week earlier than the buyer actually agreed to" },
          { move: "Check remaining terms", think: "Same discipline.", result: "inspection contingency period matches what was discussed — no issue found" },
          { move: "Correct the mismatch", think: "Before submission.", result: "financing deadline corrected to match the buyer's actual agreement" },
          { move: "Route for required review", think: "Per jurisdiction.", result: "sent for the required agent/attorney review before submission" },
        ],
        full: "A mismatched financing deadline was caught and corrected before submission by checking it against what the buyer had actually agreed to, and the paperwork was routed through the required professional review before going out.",
      },
      deconstruct: [
        "Checking each specific term against what was actually agreed is what catches a drafting error before it becomes binding.",
        "The required professional review exists precisely because this document is enforceable, not just informational.",
        "Catching a mismatch before submission is cheap; catching it after acceptance is a real, hard-to-reverse problem.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted an offer's inspection contingency as \"10 days,\" but your notes from the client call say they wanted \"14 days.\"",
        fields: [
          { key: "check", label: "What you'd verify before this is submitted", hint: "Be specific.", minWords: 6 },
          { key: "fix", label: "What you'd do about the mismatch", hint: "Concrete action.", minWords: 5 },
          { key: "why", label: "Why this needs catching before submission, not after", hint: "Be specific.", minWords: 6 },
        ],
        model: {
          check: "Cross-check every specific figure in the draft (days, dollar amounts, dates) against your actual notes or the client's direct confirmation, not just against the previous draft.",
          fix: "Correct the contingency period to 14 days and confirm with the client before it's submitted, then route through the required professional review.",
          why: "Once an offer is submitted and accepted, the client is bound to whatever the document actually says — a 10-day period they didn't agree to would already be enforceable, and much harder to fix after the fact.",
        },
      },
    },
    challenges: [
      fieldsChallenge("RE4.1", "Reproduce", "Review real offer paperwork against the actual agreement",
        "Take a real (or plausible) AI-drafted offer/contract term. Check it against what the client actually agreed to, and note the required professional review step.",
        "Strong answer: at least one specific term is checked against the client's actual agreement, not just read for plausibility; a mismatch (if any) is caught and corrected; the required professional review step is named.",
        [
          { key: "term", label: "The drafted term", hint: "Quote it.", minWords: 4 },
          { key: "checked", label: "What you checked it against, and what you found", hint: "Be specific.", minWords: 8 },
          { key: "review", label: "The required professional review step for this jurisdiction", hint: "Name it.", minWords: 5 },
        ],
        [
          { label: "Specific term checked against the client's actual agreement" },
          { label: "Any mismatch caught and corrected before submission" },
          { label: "Required professional review step named" },
        ],
        "independent"),
      scenarioChallenge("RE4.2", "Create", "The client wants to submit immediately",
        "A client is eager to submit an AI-drafted offer immediately, before the usual review step, to beat a competing bid.",
        "What do you do?",
        [
          { id: "a", label: "Submit immediately to help them win the competing situation", ok: false, why: "Skipping the review on a binding legal document to save time risks submitting terms the client didn't actually agree to, which is far costlier to fix after acceptance." },
          { id: "b", label: "Do a fast but real check of the key terms against the client's actual agreement, and get the required review completed quickly rather than skipped", ok: true, why: "Urgency is a reason to move efficiently, not a reason to skip the check on a document that becomes binding once accepted." },
          { id: "c", label: "Submit now and fix any errors afterward if they come up", ok: false, why: "Errors in an accepted offer are often no longer simply fixable — the document is already binding." },
        ],
        "transferable"),
    ],
  },

  {
    id: "RE5", name: "Defer jurisdiction-specific legal questions to a real check",
    canDo: "Verify a specific fair-housing or disclosure-law question against the actual rule for this jurisdiction, via a qualified source — never state it as settled fact from general knowledge.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted client-facing language stating a specific disclosure requirement as settled fact, phrased confidently and generally. The actual requirement in that state was different from the general rule AI had described — the client received advice that didn't match their actual jurisdiction's law, discovered only when a dispute arose later.",
        point: "A confidently-phrased legal claim is not the same as a verified one for this specific jurisdiction.",
      },
      explain: {
        paras: [
          "Treat any **AI-drafted statement of a specific legal rule** (fair housing, disclosure, licensing) as needing verification against the **actual rule for this jurisdiction**, not general knowledge.",
          "When a client asks a specific legal question you're not certain about, **say you'll verify with a broker/attorney** rather than answer from a general impression.",
          "These rules **change over time and vary by jurisdiction** — a rule that was true elsewhere, or was true a year ago, isn't automatically true here, now.",
          "The cost of a short verification delay is far lower than the cost of advice that turns out to be wrong for this specific jurisdiction.",
        ],
        keyIdea: "A specific legal claim (fair housing, disclosure, licensing) needs verification against the actual rule for this jurisdiction — general confidence isn't a substitute for a real check.",
      },
      demonstrate: {
        task: "Reviewing AI-drafted language stating a disclosure requirement.",
        steps: [
          { move: "Check the claim's specificity", think: "Is this stated as settled fact?", result: "yes — phrased as a general, confident rule" },
          { move: "Verify against this jurisdiction's actual rule", think: "Check a real, current source.", result: "the actual requirement here differs from the general rule stated" },
          { move: "Correct the language", think: "Match the verified rule.", result: "corrected to the actual requirement, with a note to confirm with the broker for anything client-facing" },
        ],
        full: "The confidently-stated general rule was checked against this jurisdiction's actual, current requirement and found to differ — corrected before it reached the client, with a broker-confirmation note added.",
      },
      deconstruct: [
        "Checking whether a legal claim is stated as settled fact is what flags it as needing verification.",
        "The actual rule for this specific jurisdiction, checked now, is what matters — not a general rule or an outdated one.",
        "A short verification step protects the client from advice that turns out to be wrong for their specific situation.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted: \"Sellers in this state are required to disclose any known lead paint issues for homes built after 1978.\" You're not sure this is accurate for this state.",
        fields: [
          { key: "check", label: "What you'd verify before using this language", hint: "Be specific.", minWords: 6 },
          { key: "action", label: "What you'd do if you can't verify it quickly", hint: "Concrete next step.", minWords: 5 },
          { key: "why", label: "Why the exact wording matters here", hint: "Be specific.", minWords: 5 },
        ],
        model: {
          check: "Whether the actual disclosure rule in this state matches the stated year/condition, and whether it's current — lead-paint disclosure rules are often tied to homes built *before* a certain year, not after, so the direction itself needs checking.",
          action: "Hold the language and confirm with a broker or the state's real estate commission guidance before it's used with a client.",
          why: "Getting the specific threshold or direction wrong could mean advising a client incorrectly about a real legal disclosure obligation.",
        },
      },
    },
    challenges: [
      fieldsChallenge("RE5.1", "Reproduce", "Verify a real jurisdiction-specific legal claim",
        "Take a real (or plausible) AI-drafted statement of a specific fair-housing/disclosure/licensing rule. Verify it against the actual rule for a named jurisdiction before using it.",
        "Strong answer: the claim is checked against a real, current, jurisdiction-specific source, not general knowledge; if unverifiable quickly, it's held rather than used; the correction (if needed) is specific.",
        [
          { key: "claim", label: "The drafted legal claim", hint: "Quote it.", minWords: 5 },
          { key: "checked", label: "How you verified it for this jurisdiction", hint: "Real source.", minWords: 6 },
          { key: "outcome", label: "The corrected claim, or why it was held", hint: "Be specific.", minWords: 6 },
        ],
        [
          { label: "Claim checked against a real, jurisdiction-specific source" },
          { label: "Held rather than used if not verifiable quickly" },
          { label: "Correction (if needed) is specific, not generic" },
        ],
        "independent"),
      scenarioChallenge("RE5.2", "Create", "A client wants a quick, definite legal answer",
        "A client asks a pointed fair-housing question and wants a quick, definite answer right now.",
        "What do you do?",
        [
          { id: "a", label: "Give a confident, general answer based on typical rules to avoid seeming unhelpful", ok: false, why: "A confident general answer risks being wrong for this specific jurisdiction, on a topic with real legal consequences." },
          { id: "b", label: "Give an honest, brief answer about what you'll verify, and commit to a specific, fast follow-up", ok: true, why: "This protects the client from a wrong answer while still being responsive and concrete about when they'll have a real one." },
          { id: "c", label: "Avoid answering and change the subject", ok: false, why: "Deflecting the question entirely is less helpful and less honest than committing to verify and follow up." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: RE_COMPETENCIES, capstoneId: "RECAP" };
};
