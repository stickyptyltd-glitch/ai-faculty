/* Subject: consulting
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["consulting"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const CONS_COMPETENCIES = [
  {
    id: "CONS1", name: "Scope the real question before analysing",
    canDo: "Turn a vague client ask into a specific, answerable question — naming the decision it feeds — before any analysis starts.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A client said \"help us understand why churn is up.\" AI immediately built a full cohort analysis and a persuasive narrative about pricing sensitivity. Two days in, someone finally asked: logo churn or revenue churn? Which segment? It turned out the client actually meant a specific enterprise account they'd just lost to a competitor's discount — a completely different, much smaller question. Two days of confident, wrong-question analysis.",
        point: "AI will happily and confidently answer whatever question you type — it won't check whether that's the question the client actually needs answered.",
      },
      explain: {
        paras: [
          "Before analysis starts, write the question as **one testable sentence**: what decision will this answer, for whom, by when.",
          "Separate **what the client said** from **what they actually need decided** — ask directly when the two might differ.",
          "Name the **evidence that would answer the question**, and check it actually exists and is obtainable, before promising an answer.",
          "Reject scope creep from AI's own initiative — an interesting tangent it starts analysing isn't automatically in scope.",
        ],
        keyIdea: "A scoped question names the decision it feeds, a precise definition of the terms, and the evidence that would answer it — before any analysis starts.",
      },
      demonstrate: {
        task: "Client asks: \"why is churn up?\"",
        steps: [
          { move: "Ask what decision this feeds", think: "Diagnostic curiosity, or about to justify a specific action?", result: "the client wants to decide whether to launch a retention discount next quarter" },
          { move: "Define the term precisely", think: "Logo or revenue churn? Which segment, which period?", result: "revenue churn, enterprise segment, last 2 quarters vs. the prior year" },
          { move: "Name what evidence would answer it", think: "What data would actually settle this?", result: "account-level churn data, pricing history, and competitor-discount intel — checked all three exist" },
          { move: "Reject scope creep", think: "AI also wants to analyse product usage — is that needed?", result: "parked as a genuine follow-on question, not folded into this answer" },
        ],
        full: "The vague \"why is churn up\" became: revenue churn, enterprise segment, last 2 quarters, to decide on a Q-next retention discount, using account data + pricing history + competitor intel — all checked to exist before analysis began.",
      },
      deconstruct: [
        "Naming the decision the analysis feeds stops an interesting-but-unusable report.",
        "A precise definition of the term prevents two people arguing past each other on the same word.",
        "Naming needed evidence before starting catches a missing-data problem in minutes, not after two days of AI-generated analysis you can't defend.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Client says: \"Our sales team isn't performing well, can you look into it with AI?\"",
        fields: [
          { key: "decision", label: "What decision this analysis should feed", hint: "Be specific.", minWords: 8 },
          { key: "scope", label: "How you'd narrow 'not performing well' into something testable", hint: "Name a precise metric.", minWords: 8 },
          { key: "evidence", label: "What evidence would actually answer the narrowed question", hint: "Concrete data sources.", minWords: 6 },
        ],
        model: {
          decision: "Whether to change the sales comp structure, replace part of the team, or invest in more training — each needs a different analysis, so which one this is for changes everything.",
          scope: "Narrow to a specific, measurable gap — e.g. win rate on qualified opportunities dropped from 28% to 19% over the last two quarters for the enterprise segment specifically.",
          evidence: "CRM pipeline data (stage-by-stage conversion), comp plan changes over the period, and rep tenure/turnover — checked that all three are actually exportable before promising an answer.",
        },
      },
    },
    challenges: [
      fieldsChallenge("CONS1.1", "Reproduce", "Scope a real vague client ask",
        "Take a real (or plausible) vague client ask. Name the decision it should feed, the precise definitions needed, and the evidence that would actually answer it.",
        "Strong answer: names a specific decision the analysis feeds; narrows the vague ask to a precise, testable definition; and names concrete evidence, checked to actually exist.",
        [
          { key: "ask", label: "The original vague ask", hint: "Quote it.", minWords: 5 },
          { key: "decision", label: "The decision it should feed", hint: "Specific.", minWords: 8 },
          { key: "evidence", label: "The evidence that would answer it, and that it exists", hint: "Concrete sources.", minWords: 8 },
        ],
        [
          { label: "Names a specific decision the analysis feeds" },
          { label: "Narrows the ask to a precise, testable definition" },
          { label: "Names concrete evidence, checked to exist" },
        ],
        "independent"),
      critiqueChallenge("CONS1.2", "Adapt", "An unscoped answer that guessed the question",
        "Here's how an engagement kicked off. Find what's wrong with jumping straight to analysis.",
        "Client: \"Can you use AI to figure out why our project delivery is slow?\" Consultant: \"On it — I'll have AI pull together a full timeline analysis across all projects from the last year and identify the bottlenecks.\"",
        [
          { label: "No decision named — unclear what this analysis is actually for", signals: ["what decision", "no decision", "what this feeds", "unclear purpose", "what action", "decide what"] },
          { label: "'Slow' is never defined — compared to what baseline, which projects, which stage", signals: ["not defined", "isn't defined", "which projects", "compared to what", "no baseline", "what counts as slow"] },
          { label: "No check that the needed timeline/stage data actually exists before promising the analysis", signals: ["data exists", "check the data", "is the data available", "does this data", "data is obtainable", "before promising"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "CONS2", name: "Synthesise stakeholder input without inventing facts",
    canDo: "Turn client interviews and documents into findings that trace to a real source — never filled in with a plausible-sounding but invented specific.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI summarised 5 stakeholder interviews for an ops-efficiency engagement and wrote: \"73% of stakeholders reported process delays.\" Nobody had counted anything that way — the interviews were qualitative, and the number was simply invented to sound precise. It went into the client deck before anyone checked.",
        point: "AI will convert a vague, qualitative impression into a false-precision percentage if you let it — that number doesn't trace to anything real.",
      },
      explain: {
        paras: [
          "Every stat or claim in a synthesis must **trace to a specific document, quote, or dataset row** — if you can't point to where it came from, it doesn't go in the deck.",
          "When the source material is **qualitative and small**, say so plainly (\"3 of 5 stakeholders raised this\") rather than let it be converted into a false-precision statistic.",
          "**Flag genuine disagreement** across sources rather than silently picking the version that best supports the emerging story.",
          "Ask AI to show which document/quote each claim came from — a claim with no traceable source gets cut, however plausible it sounds.",
        ],
        keyIdea: "A finding is only as strong as its traceability — every number or claim needs a named source you could show the client if asked.",
      },
      demonstrate: {
        task: "Synthesising 6 stakeholder interviews + a process-time data extract.",
        steps: [
          { move: "Check the 'delays' finding", think: "Where did that number come from?", result: "no such tally exists in the notes — invented" },
          { move: "Correct it", think: "State what's actually there.", result: "\"4 of 6 stakeholders raised process delays unprompted\" — traceable, honestly qualitative" },
          { move: "Check a data-backed claim", think: "Is this one traceable?", result: "the extract genuinely shows a 3-day average handoff delay — real, keep it, with the source named" },
          { move: "Check for disagreement", think: "Any conflicting accounts?", result: "two stakeholders blame different root causes — both reported, flagged as unresolved" },
        ],
        full: "The invented 73% figure was replaced with an honest, traceable count (4 of 6, unprompted). The genuinely data-backed 3-day handoff delay was kept, sourced. Conflicting root-cause accounts were reported as a disagreement, not resolved by picking a side.",
      },
      deconstruct: [
        "Traceability is what lets someone challenge or verify a finding later instead of just trusting it.",
        "Qualitative counts (4 of 6) are more honest than a manufactured percentage — precision that isn't earned is worse than a plain count.",
        "Reporting disagreement instead of resolving it silently keeps the synthesis honest about what the evidence actually shows.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI summarised 4 client interviews and wrote: \"An overwhelming majority (85%) want the new process rolled out immediately.\"",
        fields: [
          { key: "check", label: "What you'd check before trusting this", hint: "Is the number traceable?", minWords: 8 },
          { key: "showwork", label: "What you'd ask the AI to show", hint: "To make it checkable.", minWords: 5 },
          { key: "redflag", label: "A red flag that would demote this from 'finding' to 'noted'", hint: "Be specific.", minWords: 6 },
        ],
        model: {
          check: "Whether any of the 4 interviews actually produced a number like 85%, or whether it's a plausible-sounding figure invented from a general impression of enthusiasm.",
          showwork: "Which specific interview(s) said what, in their own words, and how many of the 4 actually favoured immediate rollout vs. a phased one.",
          redflag: "A precise percentage (85%) from a sample of 4 is a mathematical impossibility for most fractions — that mismatch alone is the tell that it wasn't really counted.",
        },
      },
    },
    challenges: [
      fieldsChallenge("CONS2.1", "Reproduce", "Synthesise real stakeholder input",
        "Take real (or plausible) stakeholder interviews or documents. Produce findings with honest counts and traceable sources — no invented statistics.",
        "Strong answer: counts are honest and traceable to specific sources; no manufactured percentages from a small qualitative sample; and genuine disagreement is reported, not resolved by picking a side.",
        [
          { key: "source", label: "The input (interviews/documents, how many)", hint: "One line.", minWords: 6 },
          { key: "findings", label: "The findings, with honest counts and sources", hint: "Traceable, not invented.", minWords: 12 },
          { key: "conflict", label: "Any disagreement across sources, and how you reported it", hint: "Or note there was none.", minWords: 6 },
        ],
        [
          { label: "Counts are honest and traceable to specific sources" },
          { label: "No manufactured percentages from a small sample" },
          { label: "Genuine disagreement reported, not silently resolved" },
        ],
        "independent"),
      critiqueChallenge("CONS2.2", "Adapt", "A synthesis with an invented statistic",
        "Here's an AI-generated stakeholder synthesis from 5 interviews. Find what's wrong with it.",
        "\"Key finding: 73% of stakeholders reported significant process delays as the primary bottleneck, indicating a clear organisational consensus.\"",
        [
          { label: "73% from 5 interviews doesn't correspond to any real count — it's invented", signals: ["is invented", "is fabricated", "made up", "impossible from 5", "no such percentage", "not a real count"] },
          { label: "No traceable source given for the figure", signals: ["no source", "not traceable", "which interviews", "can't verify", "where did this come from", "is unsourced"] },
          { label: "'Clear organisational consensus' overstates what a handful of interviews can show", signals: ["is overstated", "not a consensus", "too strong", "small sample", "overclaims what", "not enough evidence"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "CONS3", name: "Build a defensible analysis",
    canDo: "Verify that an AI-built analysis or model is mathematically and logically sound before it reaches a client — not just that the narrative sounds right.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI built a market-sizing slide with a compelling growth story. Nobody checked the arithmetic. It turned out the model multiplied a monthly figure by an annual growth rate, understating the true market size by roughly 12x — the story was persuasive enough that no one questioned the numbers underneath it.",
        point: "A fluent, confident narrative and a correct calculation are completely independent things.",
      },
      explain: {
        paras: [
          "**Recompute or spot-check** the load-bearing calculation by hand or a second tool before trusting it in a client deliverable.",
          "Check that **units, time periods, and population definitions match** across every number being combined — this is where most silent errors hide.",
          "Ask AI to **show its formula and working**, not just the conclusion, so the calculation is actually checkable.",
          "Treat a compelling story as a reason to check the math *more* carefully, not less — persuasive framing is exactly what lets an error slip through unquestioned.",
        ],
        keyIdea: "Trust the arithmetic only after you've re-derived or spot-checked the load-bearing number yourself — a fluent narrative is not evidence the math is right.",
      },
      demonstrate: {
        task: "Market-sizing slide for a new product line.",
        steps: [
          { move: "Ask AI to show its formula", think: "Not just the number.", result: "monthly active users × annual ARPU, both from different time bases" },
          { move: "Check the units", think: "Do they actually match?", result: "monthly figure combined with an annual rate — a mismatch" },
          { move: "Recompute correctly", think: "Same time basis throughout.", result: "true market size roughly 12x smaller than the original slide" },
          { move: "Revise the conclusion", think: "The story has to follow the corrected number.", result: "the growth narrative was rebuilt around the real figure, not the inflated one" },
        ],
        full: "The formula, once shown, revealed a monthly/annual unit mismatch that inflated the market size ~12x. Recomputed with matching units, and the slide's conclusion was rebuilt around the corrected figure before it reached the client.",
      },
      deconstruct: [
        "Showing the working turns an opaque conclusion into something checkable.",
        "Unit and time-period mismatches are the single most common way a combined calculation goes silently wrong.",
        "The fix isn't distrust of AI — it's treating verification as a required step, exactly like checking a colleague's spreadsheet before it ships.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI built a cost-benefit model recommending a $200k investment, showing an 18-month payback period.",
        fields: [
          { key: "check", label: "What you'd verify before trusting the payback figure", hint: "Be specific.", minWords: 8 },
          { key: "showwork", label: "What you'd ask AI to show", hint: "The formula, not just the answer.", minWords: 5 },
          { key: "redflag", label: "A red flag that would make you recompute by hand", hint: "Concrete.", minWords: 6 },
        ],
        model: {
          check: "Whether the cost side includes one-time and recurring costs on the same time basis as the savings side, and whether the savings estimate itself traces to a real, checkable assumption rather than a round guess.",
          showwork: "The exact formula used (total cost / monthly net savings) and every input value that feeds it, so each one can be checked independently.",
          redflag: "If the savings figure and the cost figure were sourced from different time periods (e.g. one annual, one monthly) without being converted to match — that's exactly the kind of mismatch that silently distorts the payback number.",
        },
      },
    },
    challenges: [
      fieldsChallenge("CONS3.1", "Reproduce", "Verify a real AI-built analysis",
        "Take a real (or plausible) AI-built calculation or framework application. Show its formula, check units/periods match, and recompute or spot-check the key number.",
        "Strong answer: the formula/working is shown, not just the conclusion; units and time periods are checked to match across every combined number; and the load-bearing figure is actually recomputed or spot-checked.",
        [
          { key: "analysis", label: "The analysis and its headline number", hint: "One line.", minWords: 6 },
          { key: "formula", label: "The formula/working, shown explicitly", hint: "Not just the result.", minWords: 10 },
          { key: "check", label: "What you checked (units/periods) and what you found", hint: "Concrete.", minWords: 8 },
        ],
        [
          { label: "Formula/working shown, not just the conclusion" },
          { label: "Units and time periods checked to match" },
          { label: "Load-bearing figure actually recomputed or spot-checked" },
        ],
        "independent"),
      scenarioChallenge("CONS3.2", "Create", "The narrative is compelling and the client is happy",
        "AI produced a persuasive cost-savings analysis. The client loves the story and wants to move forward immediately.",
        "What do you do before signing off on the numbers?",
        [
          { id: "a", label: "Sign off — the client is satisfied and the story holds together", ok: false, why: "A satisfied client and a persuasive story tell you nothing about whether the underlying arithmetic is correct." },
          { id: "b", label: "Ask AI to show its formula, check units/periods match, and recompute the headline figure before signing off", ok: true, why: "This is exactly the verification step that catches silent errors a good narrative can hide." },
          { id: "c", label: "Sign off, but mention to the client that AI helped build it", ok: false, why: "Disclosure of the tool used doesn't substitute for actually verifying the calculation." },
        ],
        "transferable"),
    ],
  },

  {
    id: "CONS4", name: "Draft deliverables where every claim traces to the analysis",
    canDo: "Turn an analysis into a client-ready slide or memo where every headline claim traces to a specific piece of the underlying analysis — never smoothed into a more confident story than the evidence supports.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted a recommendation slide stating a project \"will reduce costs by 30%.\" The underlying model actually showed a range of 12–30% depending on an untested assumption. The deck presented the top of the range as the expected outcome — and the client held the advisor to 30% in the follow-up meeting.",
        point: "AI tends to collapse a range into its most impressive single number when drafting a confident-sounding recommendation.",
      },
      explain: {
        paras: [
          "Every headline claim in a client deliverable needs a **specific number or analysis behind it** that you could pull up on request.",
          "If the underlying analysis produced a **range or an assumption-dependent result**, the deliverable should show that range — not collapse it to the best-looking point.",
          "Distinguish **\"the analysis shows\"** (the evidence) from **\"we recommend\"** (a judgement call layered on top) — the client should be able to tell which is which.",
          "Treat any collapsed range or dropped assumption as a defensibility risk: it's the exact gap a client's follow-up question will find.",
        ],
        keyIdea: "If the analysis says a range, the deliverable says a range — collapsing to the best-looking number is where a great-sounding deck becomes a number you can't defend in the room.",
      },
      demonstrate: {
        task: "Recommendation slide claiming a 30% cost reduction.",
        steps: [
          { move: "Trace the claim", think: "Where does 30% come from?", result: "the top of a 12–30% range, dependent on an untested vendor-negotiation assumption" },
          { move: "Check how it's presented", think: "Range or point estimate?", result: "presented as the expected outcome, no range shown" },
          { move: "Rewrite the claim", think: "Match the evidence.", result: "\"projected to reduce costs 12–30%, with 30% dependent on securing a renegotiated vendor rate\"" },
          { move: "Separate evidence from recommendation", think: "Two different things.", result: "\"the analysis shows a 12–30% range; we recommend proceeding and targeting the vendor renegotiation to capture the upper end\"" },
        ],
        full: "The collapsed 30% claim was traced back to a range dependent on an untested assumption, then rewritten to show the range and name the dependency — with the evidence and the recommendation kept visibly separate.",
      },
      deconstruct: [
        "Tracing a headline claim back to its source is what catches a collapsed range before the client does.",
        "Showing the range (with its dependency named) is more defensible than a single impressive-looking number.",
        "Separating \"the analysis shows\" from \"we recommend\" keeps the client able to weigh the evidence and the judgement call independently.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "The underlying analysis found a 15–25% revenue uplift, dependent on a marketing-spend increase the client hasn't approved. AI drafted: \"This initiative will drive a 25% revenue uplift.\"",
        fields: [
          { key: "claim", label: "What's wrong with the drafted claim?", hint: "Trace it to the analysis.", minWords: 6 },
          { key: "fix", label: "The corrected claim", hint: "Show the range and the dependency.", minWords: 8 },
          { key: "separate", label: "How you'd separate 'the analysis shows' from 'we recommend' here", hint: "Two distinct sentences.", minWords: 8 },
        ],
        model: {
          claim: "It states the top of a 15–25% range as a flat outcome, and drops the fact that it depends on an increased marketing spend the client hasn't approved yet.",
          fix: "\"The analysis projects a 15–25% revenue uplift, with 25% achievable only if marketing spend increases as modelled.\"",
          separate: "\"The analysis shows a 15–25% uplift range under the modelled spend scenario. We recommend approving the increased spend to target the upper end of that range.\"",
        },
      },
    },
    challenges: [
      fieldsChallenge("CONS4.1", "Reproduce", "Draft a deliverable claim that traces to the analysis",
        "Take a real (or plausible) analysis result. Draft the client-facing claim so it traces exactly to the evidence — range shown if the analysis has one, evidence separated from recommendation.",
        "Strong answer: the claim matches the analysis exactly, including any range or dependency; the range isn't collapsed to its best-looking point; and 'the analysis shows' is kept distinct from 'we recommend'.",
        [
          { key: "analysis", label: "The analysis result (including any range/assumption)", hint: "Be precise.", minWords: 8 },
          { key: "claim", label: "The client-facing claim, traced to that result", hint: "No collapsed range.", minWords: 10 },
          { key: "separate", label: "How evidence is kept distinct from recommendation", hint: "Two clear parts.", minWords: 8 },
        ],
        [
          { label: "Claim matches the analysis exactly, including range/dependency" },
          { label: "Range not collapsed to its best-looking point" },
          { label: "'The analysis shows' kept distinct from 'we recommend'" },
        ],
        "independent"),
      critiqueChallenge("CONS4.2", "Adapt", "A collapsed-range recommendation slide",
        "Here's a drafted recommendation slide. The underlying model actually shows a 10–40% efficiency gain, dependent on full team adoption within 3 months. Find what's wrong.",
        "\"Recommendation: implement the new workflow. This will deliver a 40% efficiency gain for the team.\"",
        [
          { label: "40% is the top of a 10–40% range, presented as the certain outcome", signals: ["top of the range", "range is collapsed", "not the whole range", "best case", "range, not a point", "only the upper end"] },
          { label: "The 3-month full-adoption dependency is dropped entirely", signals: ["full adoption", "dependent on", "assumption dropped", "no mention of", "condition missing", "depends on"] },
          { label: "No distinction between the analysis's finding and the advisor's recommendation", signals: ["evidence and recommendation", "shows vs recommend", "not distinguished", "are conflated", "blurs the line", "mixed together"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "CONS5", name: "Communicate uncertainty and risk honestly",
    canDo: "Keep a client deliverable's tone matched to the real confidence and caveats in the analysis — instead of letting AI's default confident register smooth over genuine risk.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted client-facing language that read far more confidently than the underlying analysis supported — a key assumption behind the recommendation was genuinely uncertain, but the draft's confident tone buried it. The client later asked a probing question the deck had no good answer to, and the advisor's credibility took the hit.",
        point: "AI's default writing register is confident. That register needs to be dialled to match the analysis's real certainty, not the other way around.",
      },
      explain: {
        paras: [
          "Rewrite AI-drafted client language so its **tone matches the analysis's actual confidence level** — hedge where the analysis hedges.",
          "A caveat that affects the recommendation belongs **next to the recommendation itself**, not buried in an appendix nobody reads before the decision.",
          "Name genuine risks and uncertain assumptions **plainly**, as real risks to the conclusion — not softened into a footnote.",
          "Don't wait to be asked about a known risk — surfacing it proactively is part of the deliverable, not an optional extra.",
        ],
        keyIdea: "The deliverable's tone should track the analysis's real certainty — a confident register on top of a genuinely uncertain assumption is where credibility breaks in the room.",
      },
      demonstrate: {
        task: "Reviewing a client-facing recommendation memo.",
        steps: [
          { move: "Check the tone against the analysis", think: "Does the confidence match?", result: "the memo reads as certain; the analysis flags one assumption as genuinely uncertain" },
          { move: "Locate the caveat", think: "Where does it currently sit?", result: "buried in an appendix footnote, three pages after the recommendation" },
          { move: "Move it", think: "Next to the decision it affects.", result: "moved directly under the recommendation, stated plainly as a real risk to the conclusion" },
          { move: "Rewrite the tone", think: "Hedge where the analysis hedges.", result: "\"we recommend proceeding, with the caveat that this depends on an assumption we could not fully verify\"" },
        ],
        full: "The confident-sounding memo was rewritten so its tone matched the analysis's real uncertainty, and the buried caveat was moved next to the recommendation it actually affects, stated plainly rather than softened.",
      },
      deconstruct: [
        "Tone should be derived from the analysis's actual confidence, not from AI's default register.",
        "A caveat's location matters as much as its wording — buried is functionally the same as omitted.",
        "Proactively naming a known risk protects credibility far more than a client discovering it themselves.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted: \"We are confident this restructuring will deliver the projected savings.\" The analysis actually depends on headcount reductions that haven't been approved by leadership yet.",
        fields: [
          { key: "mismatch", label: "What's mismatched between the tone and the analysis?", hint: "Be specific.", minWords: 6 },
          { key: "where", label: "Where the caveat about approval should sit", hint: "Not buried.", minWords: 5 },
          { key: "rewrite", label: "The corrected sentence", hint: "Matched tone + visible caveat.", minWords: 8 },
        ],
        model: {
          mismatch: "\"Confident\" overstates certainty when the projected savings depend entirely on a headcount reduction that leadership hasn't actually approved yet — that's a real, unresolved risk to the whole projection.",
          where: "Directly next to the savings projection and the recommendation itself, not in a footnote or appendix.",
          rewrite: "\"This restructuring is projected to deliver the stated savings, contingent on leadership approving the proposed headcount reduction — a decision that hasn't been made yet.\"",
        },
      },
    },
    challenges: [
      fieldsChallenge("CONS5.1", "Reproduce", "Match a deliverable's tone to real uncertainty",
        "Take a real (or plausible) AI-drafted client deliverable. Check its tone against the analysis's actual confidence, and rewrite anything overstated with the real caveat placed next to the recommendation.",
        "Strong answer: at least one overstated claim is identified against the real analysis; the caveat is placed next to the recommendation it affects, not buried; and the rewrite's tone matches the actual confidence level.",
        [
          { key: "original", label: "The original AI-drafted language", hint: "Quote it.", minWords: 5 },
          { key: "gap", label: "The gap between its tone and the real analysis", hint: "Be specific.", minWords: 8 },
          { key: "fix", label: "The corrected language, caveat placed prominently", hint: "Matches real confidence.", minWords: 8 },
        ],
        [
          { label: "Overstated claim identified against the real analysis" },
          { label: "Caveat placed next to the recommendation, not buried" },
          { label: "Rewrite's tone matches the actual confidence level" },
        ],
        "independent"),
      scenarioChallenge("CONS5.2", "Create", "The client wants a confident answer, not caveats",
        "A client pushes back: \"I just want a clear yes or no, not a list of caveats.\"",
        "What do you do?",
        [
          { id: "a", label: "Drop the caveats and give the confident yes/no they're asking for", ok: false, why: "Removing a real, load-bearing caveat to satisfy the request for confidence is exactly how credibility breaks later when the risk materialises." },
          { id: "b", label: "Give a clear recommendation, but keep the caveat that materially affects it visible and plainly stated", ok: true, why: "A clear recommendation and an honest, visible caveat aren't mutually exclusive — dropping the caveat doesn't make the risk go away." },
          { id: "c", label: "Move all caveats to a separate document they probably won't read", ok: false, why: "That's functionally the same as omitting them — the caveat needs to be visible where the decision is made." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: CONS_COMPETENCIES, capstoneId: "CONSCAP" };
};
