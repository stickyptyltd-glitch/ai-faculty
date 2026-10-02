/* Subject: finance
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["finance"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const FINANCE_COMPETENCIES = [
  {
    id: "FN1", name: "AI does not do arithmetic",
    canDo: "Know where AI is reliable in finance (structure, categorisation, explanation) and where it isn't (calculation), and check accordingly.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI \"analysis\" of the quarterly numbers stated revenue was up 12% and margin was down 3 points. Revenue was up 12%. Margin was flat. Someone presented the wrong margin story to the board before anyone re-ran the numbers.",
        point: "AI language models predict text, not compute. They'll produce a number that looks right and is wrong — especially in multi-step calculations.",
      },
      explain: {
        paras: [
          "**Good for**: categorising transactions, drafting variance commentary, explaining a concept or a standard, restructuring a messy spreadsheet's logic, spotting a pattern to investigate, drafting a report's narrative.",
          "**Not reliable for**: arithmetic — sums, percentages, growth rates, multi-step models. Do those in a spreadsheet or with a tool the AI calls, then have AI *describe* the results.",
          "Rule: **every number in an AI output either came from your calculation, or gets re-derived by you before it's used.** Treat an AI-stated figure like a figure from an intern who's bad at maths but good at writing.",
        ],
        keyIdea: "AI: categorise, comment, explain, restructure, pattern-spot, narrate. Not AI: arithmetic. Every number in an AI output is re-derived by you or came from your own calculation before it's used.",
      },
      demonstrate: {
        task: "Using AI to help with the monthly management accounts commentary.",
        steps: [
          { move: "The calc", think: "Not the AI.", result: "The actuals-vs-budget variances are computed in the spreadsheet." },
          { move: "AI's job", think: "The story.", result: "AI drafts the commentary — 'marketing overspent due to the campaign brought forward from next quarter'." },
          { move: "Check the numbers it repeats", think: "Against the sheet.", result: "AI's draft says 'a £40k overspend' — the sheet says £38k. Fix it." },
          { move: "The narrative", think: "Hypothesis, not fact.", result: "AI's explanation of *why* is confirmed with the budget owner before it goes in." },
        ],
        full: "The spreadsheet does every calculation. AI drafts the story around the numbers. Every figure AI restates is checked against the sheet, and every causal claim is confirmed with the person who'd know.",
      },
      deconstruct: [
        "The variance maths lives in the spreadsheet where it's auditable.",
        "AI restated £40k for £38k — small, but it's the pattern that matters.",
        "\"Why did marketing overspend\" is a claim to verify, not accept.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want AI to help analyse why gross margin moved between two periods.",
        fields: [
          { key: "calc", label: "What you compute yourself", hint: "The maths.", minWords: 5 },
          { key: "aijob", label: "What you use AI for", hint: "Not arithmetic.", minWords: 5 },
          { key: "numbercheck", label: "How you check numbers AI states", hint: "Trace to a cell.", minWords: 4 },
          { key: "causal", label: "How you handle AI's explanations of 'why'", hint: "Hypothesis.", minWords: 4 },
        ],
        model: {
          calc: "The margin bridge itself — price, volume, mix, cost effects — built in the spreadsheet with the components adding to the total change. AI does not compute the bridge.",
          aijob: "Draft the commentary explaining the bridge in plain language; suggest which effect is worth digging into; check my component logic reads sensibly.",
          numbercheck: "Every number in AI's draft traces back to a cell in my bridge. A figure that isn't in my model is wrong or invented — remove it.",
          causal: "AI's 'margin fell because input costs rose' is a hypothesis. Confirm against the actual cost data and with procurement before stating it as the reason.",
        },
      },
      // AI-role ladder — from `demonstrate`'s variance-commentary walkthrough.
      roleMap: [
        { label: "Drafting the variance commentary", role: "do-it" },
        { label: "Explaining *why* a variance happened, before it's confirmed with the budget owner", role: "assist" },
        { label: "Any figure AI repeats or cites (check it against the sheet)", role: "check" },
        { label: "Performing the actual calculation", role: "stay-out" },
      ],
    },
    challenges: [
      fieldsChallenge("FN1.1", "Reproduce", "Split the work for a real finance analysis",
        "Take a finance analysis you'd do. Split it: what you calculate, what AI does, how numbers are checked.",
        "Strong answer: all arithmetic is done in a spreadsheet / tool, not by AI; AI is used for categorisation, commentary, explanation, restructuring; every number AI states is re-derived or traced to the source; and causal claims are marked as hypotheses to confirm.",
        [
          { key: "analysis", label: "The analysis", hint: "One line.", minWords: 3 },
          { key: "computed", label: "What you calculate yourself", hint: "The maths.", minWords: 4 },
          { key: "aiassist", label: "What AI does", hint: "Not arithmetic.", minWords: 4 },
          { key: "verification", label: "How every number in the output is checked", hint: "Re-derive or trace.", minWords: 5 },
        ],
        [
          { label: "All arithmetic is done in a spreadsheet / tool, not by AI" },
          { label: "AI is used for categorisation, commentary, explanation, restructuring" },
          { label: "Every number AI states is re-derived or traced; causal claims flagged" },
        ],
        "independent"),
      critiqueChallenge("FN1.2", "Adapt", "Find the trust errors",
        "Here is how the analysis was done. Find every place AI was trusted where it shouldn't be.",
        "\"I gave the AI our P&L and asked it to calculate the year-on-year growth for each line, work out the compound annual growth rate over 3 years, and tell me which cost lines grew faster than revenue. It gave me a clean table and a summary. I've put it straight into the board pack.\"",
        [
          { label: "Multi-step arithmetic (YoY per line, CAGR, comparisons) done entirely by the AI", signals: ["arithmetic", "calculation", "ai did the maths", "multi-step", "yoy", "cagr", "growth", "compute", "not reliable"] },
          { label: "'A clean table' looking right is not the same as being right", signals: ["looks right", "clean table", "not the same", "looks correct", "presentation", "no check"] },
          { label: "'Straight into the board pack' — no re-derivation before a high-stakes use", signals: ["board pack", "high-stakes", "no re-derivation", "didn't check", "straight in", "unverified"] },
          { label: "CAGR is a compounding calculation AI frequently gets wrong", signals: ["cagr", "compound", "compounding", "gets wrong", "unreliable", "3 years", "growth rate"] },
          { label: "No source spreadsheet where the maths can be audited", signals: ["no spreadsheet", "no source", "can't audit", "no workpaper", "where's the maths", "not auditable"] },
        ],
        "transferable", { text: `"I gave the AI our P&L to draft the YoY growth, CAGR and cost-vs-revenue comparison as a first pass. Before anything went into the board pack, I recalculated the CAGR and two YoY figures myself and checked they matched. One CAGR figure was off — the AI had used the wrong number of periods — so I corrected it, with the source spreadsheet linked."`, changes: ["The AI’s numbers are treated as a draft, not a final answer", "Key figures are re-derived by a person before high-stakes use", "A specific error was actually caught by that re-check", "The source spreadsheet is linked so the maths can be audited"] }),
    ],
  },

  {
    id: "FN2", name: "Reconciliation and transaction categorisation",
    canDo: "Use AI to speed up matching and categorising — with a confidence threshold, a review queue, and a sample check.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI bookkeeping assistant auto-categorised 6 months of transactions. At year-end the accountant found it had been putting all payments to one supplier under \"office supplies\" — the supplier was actually a contractor, and the misclassification changed the tax treatment. 400 transactions to fix.",
        point: "AI categorisation is fast and mostly right — and \"mostly\" compounds into a big cleanup when nobody's checking.",
      },
      explain: {
        paras: [
          "The pattern: AI proposes a category or a match; it applies **only above a confidence threshold**; **below the threshold or on anything unusual (new payee, round number, unusual amount) → a review queue**, not a guess; **new rules a human confirms once**; and a **weekly sample** checked against source documents.",
          "For reconciliation: AI can suggest matches, but a match involving a write-off, a partial payment, or a currency difference goes to a human.",
          "Never let AI create or post a journal entry unreviewed.",
        ],
        keyIdea: "AI proposes categories / matches above a confidence threshold; unusual or low-confidence → review queue, not a guess; new rules confirmed once by a human; weekly sample vs source docs. No unreviewed journal entries.",
      },
      demonstrate: {
        task: "Setting up AI-assisted bank reconciliation.",
        steps: [
          { move: "Auto-match", think: "Only the clean ones.", result: "AI matches transactions to invoices where amount, date and reference align and confidence is high." },
          { move: "Queue", think: "Judgement → human.", result: "Partial payments, write-offs, FX differences, and anything unmatched → a human queue." },
          { move: "New payees", think: "Human sets the rule.", result: "A payee not seen before → flagged; a human sets the category, and AI remembers the rule." },
          { move: "Sample", think: "Against source docs.", result: "Each week, pull 20 auto-categorised transactions and check them against the actual receipts / invoices." },
        ],
        full: "AI clears the clean matches. Everything with judgement in it — write-offs, partials, FX, new payees — goes to a person. A weekly sample against source documents catches any systematic error early.",
      },
      deconstruct: [
        "The confidence threshold is what stops a wrong category being applied silently.",
        "\"New payee → human sets the rule\" prevents the compounding misclassification from the story.",
        "The weekly sample against receipts would have caught the error at week 1, not year-end.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're using AI to categorise expenses for a small business's bookkeeping.",
        fields: [
          { key: "threshold", label: "What AI auto-applies vs queues", hint: "The confidence line.", minWords: 5 },
          { key: "unusual", label: "What always goes to a human regardless of confidence", hint: "Judgement items.", minWords: 5 },
          { key: "rules", label: "How new categorisation rules get set", hint: "Human-confirmed.", minWords: 4 },
          { key: "sample", label: "The check you run and how often", hint: "Against source docs.", minWords: 4 },
        ],
        model: {
          threshold: "Auto-apply where the payee is known and previously categorised the same way, and the amount is in the normal range. Anything else proposed but not applied.",
          unusual: "New payee; amount over £[X]; round-number amounts; anything that could be capital vs expense; personal-looking spend; anything near a period end.",
          rules: "When a human categorises a new payee, that becomes a rule ('Payee = X → Category = Y') the human confirmed — AI applies it going forward but a human set it.",
          sample: "Weekly: 15–20 auto-categorised items checked against the actual receipt or invoice. Track the error rate; if it rises, tighten the threshold.",
        },
      },
    },
    challenges: [
      fieldsChallenge("FN2.1", "Reproduce", "Design AI-assisted categorisation for real books",
        "Take a set of books you know. Design AI-assisted categorisation with a review layer.",
        "Strong answer: a confidence threshold governs what's auto-applied; unusual items (new payee, capital-vs-expense, period-end, large / round) always go to a human; new rules are human-confirmed; and a regular sample against source documents is defined.",
        [
          { key: "scope", label: "What's being categorised", hint: "One line.", minWords: 3 },
          { key: "threshold", label: "Auto vs queue", hint: "The confidence line.", minWords: 4 },
          { key: "alwayshuman", label: "What bypasses auto regardless", hint: "Judgement items.", minWords: 4 },
          { key: "sample", label: "The source-document check", hint: "How much, how often.", minWords: 4 },
        ],
        [
          { label: "A confidence threshold governs what's auto-applied" },
          { label: "Unusual items always go to a human; new rules are human-confirmed" },
          { label: "A regular sample against source documents is defined" },
        ],
        "independent"),
      scenarioChallenge("FN2.2", "Create", "Six months of miscategorised transactions",
        "At year-end you find the AI has miscategorised every payment to one supplier for six months, changing the tax treatment. There was no review process.",
        "What's the fix going forward?",
        [
          { id: "a", label: "Correct the entries and add a note to check that supplier", ok: false, why: "One note doesn't prevent the next systematic error." },
          { id: "b", label: "Correct the entries, then add: a confidence threshold with a review queue for new / unusual payees, human-confirmed rules, and a weekly sample against source documents", ok: true, why: "Build the review layer that would have caught it in week 1." },
          { id: "c", label: "Stop using AI for categorisation", ok: false, why: "The fix is the review layer, not abandoning the speed-up." },
        ],
        "transferable"),
    ],
  },

  {
    id: "FN3", name: "Models and spreadsheets",
    canDo: "Use AI to build and debug financial models — then check the logic, the links and the assumptions yourself.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI-built cash-flow model looked polished and showed 14 months of runway. A hardcoded number had been dropped into what should have been a formula cell, so it never updated when the assumptions changed. Real runway was 9 months. The board found out the hard way.",
        point: "AI produces spreadsheet formulas that look right and contain the classic errors — hardcodes in formula cells, off-by-one ranges, sign errors, broken links.",
      },
      explain: {
        paras: [
          "AI helps: draft a model structure, write a complex formula from a description, explain an inherited formula, find why two numbers don't tie, suggest sensitivity cases.",
          "The checks you still do: **trace the logic** (does each output derive from the inputs?); **hunt for hardcodes** in formula cells; **check ranges** (does the SUM include the right rows, exclude the total?); **check signs**; **test with known inputs** (put in numbers where you know the answer); **stress the assumptions** (do extreme inputs break it?).",
          "A model drives decisions; its errors are expensive and quiet.",
        ],
        keyIdea: "AI drafts structure, formulas, explanations, tie-outs. You trace the logic input-to-output, hunt hardcodes in formula cells, check ranges and signs, test with known inputs, and stress the assumptions.",
      },
      demonstrate: {
        task: "Using AI to build a revenue model for a subscription business.",
        steps: [
          { move: "Structure", think: "Match reality.", result: "AI drafts the model — new customers, churn, expansion, by month; check it matches how the business actually works." },
          { move: "Formulas", think: "Trace one by hand.", result: "AI writes the MRR roll-forward; trace one month manually to confirm it does what it says." },
          { move: "Hardcode hunt", think: "Numbers where links belong.", result: "Found a '0.95' typed into the retention calc instead of linking to the assumption cell." },
          { move: "Known-input test", think: "Where you know the answer.", result: "Churn = 0, new = 100/month → does month 12 show 1,200 customers? Yes. Churn = 100% → goes to zero? Yes." },
        ],
        full: "AI built the structure and formulas fast. Tracing one month by hand, hunting hardcodes (found one), and testing with inputs where the answer is known confirmed the model actually computes what it claims.",
      },
      deconstruct: [
        "The hardcoded 0.95 is the exact error from the story — a number where a link should be.",
        "Tracing one month by hand is the highest-value check.",
        "Known-input tests (churn = 0, churn = 100%) expose structural errors fast.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You've asked AI to build a three-statement model (P&L, balance sheet, cash flow) for a scenario analysis.",
        fields: [
          { key: "logic", label: "How you'd check the logic ties together", hint: "Statements link, balance sheet balances.", minWords: 5 },
          { key: "hardcodes", label: "How you'd hunt for hardcodes", hint: "Your method.", minWords: 4 },
          { key: "tests", label: "The known-input tests you'd run", hint: "Where you know the answer.", minWords: 5 },
          { key: "assumptions", label: "How you'd check the assumptions", hint: "Visible and sensible.", minWords: 4 },
        ],
        model: {
          logic: "Confirm the three statements link — net income flows to retained earnings and to the cash flow; the balance sheet balances in *every* period, not just period 1. If it doesn't balance, something's wrong regardless of how good it looks.",
          hardcodes: "Show formulas, scan for constants inside formula cells (especially in the projection columns). Every projected number should trace to an assumption or a prior calculation.",
          tests: "Set revenue growth to 0 — do the statements stay static and consistent? Double every assumption — does anything break or go negative that shouldn't? Set a cost to zero — does it flow through correctly?",
          assumptions: "All assumptions in one clearly labelled block, not scattered. Each sense-checked against reality. Anything AI assumed silently gets surfaced and confirmed.",
        },
      },
    },
    challenges: [
      fieldsChallenge("FN3.1", "Reproduce", "Check an AI-built model",
        "Take a model you'd build with AI. Plan how you check it.",
        "Strong answer: the logic is traced from inputs to outputs (and statements tie if it's a three-statement model); a concrete method for finding hardcodes in formula cells is described; known-input tests are specified; and assumptions are surfaced, consolidated and sense-checked.",
        [
          { key: "model", label: "The model", hint: "One line.", minWords: 3 },
          { key: "logictrace", label: "How you trace input to output", hint: "The path.", minWords: 4 },
          { key: "hardcodehunt", label: "Your method for finding hardcodes", hint: "In formula cells.", minWords: 4 },
          { key: "knowninput", label: "The known-input tests", hint: "Where you know the answer.", minWords: 4 },
          { key: "assumptioncheck", label: "How assumptions are verified", hint: "Surfaced, sense-checked.", minWords: 4 },
        ],
        [
          { label: "Logic traced from inputs to outputs (statements tie if applicable)" },
          { label: "A concrete method for finding hardcodes in formula cells" },
          { label: "Known-input tests specified; assumptions surfaced and sense-checked" },
        ],
        "independent"),
      critiqueChallenge("FN3.2", "Adapt", "Spot the model risks",
        "Here is how the model was built and checked. Find every risk.",
        "\"The AI built our fundraising model in about an hour. It has a clean dashboard, a scenario toggle, and it shows 18 months of runway in the base case. The formulas are complex but it explained each one and they made sense when it described them. We're sending it to investors tomorrow.\"",
        [
          { label: "'made sense when it described them' — the AI's description of a formula is not a check of the formula", signals: ["description", "explained", "made sense", "not a check", "isn't verification", "still trace", "hearing it"] },
          { label: "No independent trace of the logic", signals: ["no trace", "didn't trace", "independent check", "logic trace", "by hand", "verify the logic"] },
          { label: "No hardcode hunt mentioned", signals: ["hardcode", "no hardcode hunt", "constants", "formula cells", "stray numbers"] },
          { label: "No known-input testing", signals: ["known input", "no testing", "test with", "sanity test", "extreme inputs", "stress"] },
          { label: "'complex formulas' + 'built in an hour' + investors is exactly when errors hide", signals: ["complex", "an hour", "investors", "high stakes", "errors hide", "fast build", "rushed"] },
        ],
        "transferable", { text: `"The AI built a first draft of the fundraising model. Before sending it to investors, I traced the runway formula and two other key formulas cell-by-cell against what it claimed they did, ran three known-input test cases to confirm the model reacts sensibly, and grepped for hardcoded numbers that should be formulas. Two hardcoded values turned up in the revenue tab and were fixed. Sending to investors once that’s clean, not before."`, changes: ["The AI’s own description of a formula is no longer treated as proof it’s correct", "Key formulas are traced independently, cell by cell", "Known-input test cases check the model reacts sensibly", "A hardcode hunt runs — and catches something — before investors see it"] }),
    ],
  },

  {
    id: "FN4", name: "Reporting and commentary",
    canDo: "Use AI to draft financial narrative — accurate to the numbers, appropriately cautious, and free of invented explanations.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI-drafted investor update said \"the dip in Q2 was driven by a one-off legal settlement and underlying growth remained strong.\" There was no legal settlement. The AI had generated a plausible-sounding reason for a number it was asked to explain. An investor asked for the settlement details.",
        point: "Asked to explain a number, AI will invent a cause that fits — a confident, specific, wrong explanation.",
      },
      explain: {
        paras: [
          "AI drafts well: variance commentary, board narrative, investor updates, the notes around a set of accounts, an executive summary.",
          "Rules: **numbers in the narrative match the numbers in the statements** (check every one); **explanations of 'why' are yours, not the AI's** — AI can draft the wording once you've supplied the reason, but it must not generate the reason; **caution matches certainty** (\"revenue declined 4%\" not \"a temporary softening\"); **nothing forward-looking is stated as fact**.",
          "If you can't source the explanation for a movement, the narrative says \"under investigation\", not a guess.",
        ],
        keyIdea: "AI drafts the narrative; numbers must match the statements; the *reasons* for movements are supplied by you, not generated by AI; caution matches certainty; an unexplained movement is \"under investigation\", not a plausible guess.",
      },
      demonstrate: {
        task: "Drafting the board commentary for a month where costs spiked.",
        steps: [
          { move: "Supply the reason", think: "You know it.", result: "The cost spike is an annual software renewal that lands this month — I tell the AI that." },
          { move: "AI drafts", think: "Using your reason.", result: "AI writes the commentary using the reason I gave." },
          { move: "Check the numbers", think: "Against the accounts.", result: "Every figure in the draft matched to the management accounts." },
          { move: "Check for invention", think: "Plausible filler.", result: "AI added 'partially offset by efficiency savings elsewhere' — there were none. Cut it." },
        ],
        full: "The reason for the spike came from me; AI wrote it up. Every number is checked against the accounts, and an invented 'offsetting saving' the AI added for narrative balance is removed.",
      },
      deconstruct: [
        "Supplying the reason first stops the AI generating one.",
        "\"Efficiency savings elsewhere\" is the kind of plausible filler AI adds — and it's a false statement.",
        "Checking every number against the source is non-negotiable in a financial report.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're using AI to draft the quarterly business review narrative for the leadership team.",
        fields: [
          { key: "numbers", label: "How you ensure narrative numbers match the statements", hint: "The cross-check.", minWords: 5 },
          { key: "reasons", label: "How you handle explanations of movements", hint: "Human-supplied.", minWords: 5 },
          { key: "caution", label: "How you keep the language calibrated", hint: "Precision matches the numbers.", minWords: 4 },
          { key: "forward", label: "How you handle any forward-looking statements", hint: "Labelled, with assumptions.", minWords: 4 },
        ],
        model: {
          numbers: "Every figure in the narrative is cross-checked against the finalised QBR pack. A number in the words that doesn't match a number in the tables is a defect.",
          reasons: "For each material movement, I provide the cause (confirmed with the relevant owner). AI writes it up. AI is explicitly instructed not to speculate — an unexplained movement is flagged 'reason being confirmed'.",
          caution: "'Declined 6%' not 'saw some softening'. 'Below budget by £Xk' not 'tracking slightly behind'. The narrative states what happened at the precision the numbers support.",
          forward: "Projections are labelled as projections with the key assumptions stated. No 'we expect to recover next quarter' unless that's a real, owned forecast — and even then it's 'the forecast assumes X'.",
        },
      },
    },
    challenges: [
      fieldsChallenge("FN4.1", "Reproduce", "Draft checked commentary for a real report",
        "Take a financial report you'd write. Plan how AI drafts it and how you check it.",
        "Strong answer: every number in the narrative is checked against the statements; explanations of movements are supplied by a human, not generated by AI; unexplained movements are flagged, not guessed; language precision matches what the numbers support; and forward-looking statements are labelled with assumptions.",
        [
          { key: "report", label: "The report", hint: "One line.", minWords: 3 },
          { key: "numbercheck", label: "How narrative numbers are verified", hint: "Against the statements.", minWords: 4 },
          { key: "reasonsource", label: "How movement explanations are sourced", hint: "Human-supplied.", minWords: 4 },
          { key: "languagecheck", label: "How caution is calibrated", hint: "Precision matches numbers.", minWords: 4 },
        ],
        [
          { label: "Every number in the narrative is checked against the statements" },
          { label: "Explanations are human-supplied; unexplained movements flagged not guessed" },
          { label: "Language precision matches the numbers; forward statements labelled" },
        ],
        "independent"),
      scenarioChallenge("FN4.2", "Create", "The AI invented a reason",
        "Your AI-drafted investor update explains a revenue dip as being 'due to a one-off customer offboarding' — but you never told the AI that, and you're not aware of any such event.",
        "What happened, and what's your rule now?",
        [
          { id: "a", label: "It's probably right — the AI may have inferred it from the data", ok: false, why: "The AI cannot know your customer events; it generated a plausible cause." },
          { id: "b", label: "The AI fabricated a cause to explain the number; the rule is that AI never generates reasons — I supply every explanation or the update says 'under investigation'", ok: true, why: "Reasons come from people who know; AI writes them up." },
          { id: "c", label: "Leave it in but soften it to 'possibly due to'", ok: false, why: "A fabricated cause hedged is still fabricated." },
        ],
        "transferable"),
    ],
  },

  {
    id: "FN5", name: "Controls, close and the audit trail",
    canDo: "Fit AI into the financial close and controls so the process stays segregated, reviewed and auditable.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "During the audit, the auditors asked how the accruals were calculated. The answer was \"the AI worked them out from last year's pattern.\" There was no workpaper, no method, no review — just an AI output that had been posted. The audit finding wrote itself.",
        point: "Finance runs on controls — segregation of duties, review, evidence. An AI step that skips those doesn't speed up the close; it creates an audit finding.",
      },
      explain: {
        paras: [
          "When AI enters a finance process: **segregation of duties still applies** — the person who uses AI to prepare something can't also review and approve it.",
          "**Every AI-assisted figure needs a workpaper** — the inputs, the method, the AI's role, and the reviewer. **AI does not post** — journal entries, payments and filings are prepared-then-approved by people.",
          "**The close checklist** gains a review step for anything AI touched. The **audit trail** records where AI was used, what it produced, who checked it, and against what.",
          "The goal: an auditor can see exactly how every number was arrived at and that a competent person owned it.",
        ],
        keyIdea: "AI-in-finance keeps segregation of duties, a workpaper per AI-assisted figure (inputs, method, reviewer), no AI posting, a close-checklist review step for AI-touched items, and an audit trail of where AI was used and who checked it.",
      },
      demonstrate: {
        task: "Using AI to help prepare the month-end accruals.",
        steps: [
          { move: "Prepare", think: "With a workpaper.", result: "AI drafts the accruals estimate from the pattern of prior months and known commitments; I document the method and inputs in a workpaper." },
          { move: "Segregate", think: "Preparer ≠ approver.", result: "I prepared it (with AI); my manager reviews and approves — not me." },
          { move: "No posting", think: "The approver posts.", result: "The journal is prepared as a draft; the approver posts it." },
          { move: "Trail", think: "Reviewable.", result: "The workpaper notes: AI used to draft the estimate, inputs [X], method [Y], reviewed and approved by [manager] on [date]." },
        ],
        full: "AI speeds up the estimate. A workpaper captures the method and inputs. A different person reviews and approves. The journal is posted by the approver, not the preparer. The audit trail shows exactly how the accrual was built and who owned it.",
      },
      deconstruct: [
        "Segregation of duties doesn't bend for AI — preparer ≠ approver still holds.",
        "The workpaper is what turns an AI output into auditable work.",
        "\"The approver posts\" keeps AI out of the posting step.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Your team wants to use AI to speed up the quarterly close — specifically the flux analysis and the supporting schedules.",
        fields: [
          { key: "segregation", label: "How duties stay separated with AI in the mix", hint: "Preparer, reviewer.", minWords: 5 },
          { key: "workpapers", label: "What each AI-assisted item needs documented", hint: "Method, inputs, reviewer.", minWords: 5 },
          { key: "posting", label: "What AI is not allowed to do", hint: "The boundary.", minWords: 4 },
          { key: "audittrail", label: "What the trail records about AI use", hint: "For the auditors.", minWords: 4 },
        ],
        model: {
          segregation: "The preparer may use AI. The reviewer / approver is a different person and reviews the substance — not just that a review happened. AI is not a reviewer.",
          workpapers: "For each AI-assisted schedule: the source data, the method (what AI was asked to do), what AI produced, what the preparer changed, and the reviewer's sign-off. Enough for someone else to reproduce it.",
          posting: "AI does not post journals, approve payments, or submit filings. It prepares drafts; people approve and post.",
          audittrail: "A close log noting which tasks used AI, what it produced, who reviewed each against what source, and the date. Available to the auditors without a scramble.",
        },
      },
    },
    challenges: [
      fieldsChallenge("FN5.1", "Reproduce", "Fit AI into a real close / controls process",
        "Take a close or controls process you know. Fit AI into it without breaking the controls.",
        "Strong answer: segregation of duties is preserved — preparer ≠ approver, AI is not a reviewer; every AI-assisted figure has a workpaper with method, inputs and reviewer; AI does not post / approve / file; and the audit trail records AI use, output, reviewer and source.",
        [
          { key: "process", label: "The process", hint: "One line.", minWords: 3 },
          { key: "segregation", label: "How it's kept", hint: "Preparer, reviewer.", minWords: 4 },
          { key: "workpaper", label: "What AI-assisted items document", hint: "Method, inputs, reviewer.", minWords: 4 },
          { key: "trail", label: "What's recorded", hint: "AI use, output, reviewer, source.", minWords: 4 },
        ],
        [
          { label: "Segregation preserved — preparer ≠ approver, AI is not a reviewer" },
          { label: "Every AI-assisted figure has a workpaper (method, inputs, reviewer)" },
          { label: "AI does not post / approve / file; audit trail records AI use" },
        ],
        "independent"),
      critiqueChallenge("FN5.2", "Adapt", "Find the control failures",
        "Here is a proposed AI-in-the-close setup. Find every control failure.",
        "\"To speed up our close: the junior uses AI to prepare the accruals, the prepayments schedule, and the flux commentary, and posts them once the AI output looks reasonable. We've cut two days off the close. The AI's method is in the chat history if anyone needs it.\"",
        [
          { label: "The junior both prepares and posts — no segregation of duties, no independent review", signals: ["prepares and posts", "segregation", "same person", "no review", "no approver", "independent"] },
          { label: "'once the AI output looks reasonable' is not a review of substance", signals: ["looks reasonable", "not a review", "substance", "no real check", "rubber stamp", "eyeballed"] },
          { label: "AI output is being posted, not prepared-then-approved by a person", signals: ["ai output posted", "no approval step", "prepared-then-approved", "posts them", "no human posts"] },
          { label: "'method is in the chat history' is not a workpaper — not structured, retained, or reproducible", signals: ["chat history", "not a workpaper", "not retained", "not reproducible", "not structured", "no documentation"] },
          { label: "An auditor would have no trail of who checked what against what", signals: ["auditor", "no trail", "audit trail", "who checked", "against what", "no evidence"] },
        ],
        "transferable", { text: `"The junior uses AI to prepare the accruals, prepayments schedule and flux commentary. A senior accountant reviews each one against source documents and signs off before anything posts — the junior no longer posts their own work. The AI’s method and the reviewer’s sign-off are saved as a structured workpaper, not left in chat history."`, changes: ["Preparer and poster are now different people — segregation of duties restored", "“looks reasonable” replaced with review against source documents by someone else", "AI output is reviewed and approved before posting, not posted directly", "Method and sign-off are saved as a retained workpaper, not chat history"] }),
    ],
  },
  ];
  return { competencies: FINANCE_COMPETENCIES, capstoneId: "FINCAP" };
};
