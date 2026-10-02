/* Subject: research
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["research"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const RESEARCH_COMPETENCIES = [
  {
    id: "R1", name: "Frame the question",
    canDo: "Turn a broad topic into a specific, answerable question with a defined scope — before you gather anything.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Your manager asked \"what's going on with AI regulation?\" Two days later you had 40 pages of AI-gathered notes spanning five countries and a decade — and still couldn't answer the thing they needed: \"can we launch the feature in the EU in Q3?\"",
        point: "An unframed question has no finish line. You gather forever and still can't answer what someone needs to decide.",
      },
      explain: {
        paras: [
          "This is Goal Definition (C1) aimed at research. A researchable question names four things: the **decision or need** it serves; the **scope** — what's in and out on time, place, population, definition; the **type of answer** expected (a number? a yes/no? a shortlist with trade-offs?); and **what would make the answer change**.",
          "A broad topic (\"AI regulation\") is a starting point, not a question. Narrow it until you can picture the *shape* of the answer before you have it.",
          "If you can't say what a complete answer looks like, you can't tell when you're done — and you can't tell when AI has handed you a partial answer dressed up as a full one.",
        ],
        keyIdea: "A researchable question names the decision it serves, its scope (in/out), the kind of answer expected, and what would change that answer. If you can't picture the answer's shape, keep narrowing.",
      },
      demonstrate: {
        task: "Broad topic handed over: \"what's going on with AI regulation?\"",
        steps: [
          { move: "Find the real decision", think: "Why is anyone asking? There's a choice behind it.", result: "Decision: whether we can ship the feature in the EU in Q3 without a compliance blocker." },
          { move: "Set the scope", think: "In and out, on time and place and topic.", result: "In: EU only; laws in force or firmly dated within 12 months; rules touching automated decision-making. Out: US/UK; proposals with no timeline; copyright." },
          { move: "Name the answer type", think: "What form does a useful answer take?", result: "A yes/no on 'blocker exists', plus a short dated list of specific obligations." },
          { move: "Name what would change it", think: "What new fact flips the conclusion?", result: "A delegated act setting an earlier date; our feature being classed as high-risk under the AI Act." },
        ],
        full: "Decision: can we ship in the EU in Q3? Scope: EU only, laws in force or dated within 12 months, automated-decision rules; excludes US/UK and untimed proposals. Answer: a yes/no on a blocker plus a dated list of obligations. Would change it: an earlier delegated act, or a high-risk classification of our feature.",
      },
      deconstruct: [
        "The broad topic didn't change — the scope drawn around it did all the work.",
        "Naming the answer type ('yes/no + dated list') means you'll notice if AI returns an essay instead.",
        "'What would change it' is where you'll aim your verification later.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Someone asks you: \"can you look into whether we should switch our database?\"",
        fields: [
          { key: "decision", label: "The decision behind the question", hint: "What choice does this research serve?", minWords: 6 },
          { key: "scope", label: "Scope — what's in and what's out", hint: "Systems, time, criteria.", minWords: 8 },
          { key: "answer", label: "What kind of answer is expected", hint: "A recommendation? A comparison? A number?", minWords: 5 },
          { key: "change", label: "What would change the answer", hint: "The facts the conclusion hangs on.", minWords: 5 },
        ],
        model: {
          decision: "Whether to migrate our primary production database off the current engine within two quarters, or stay and revisit in a year.",
          scope: "In: our actual workload (read/write mix, data size, growth rate), migration cost and risk, the 2–3 engines the team would realistically operate. Out: exotic options nobody can run, and pricing negotiations.",
          answer: "A recommendation — stay / switch / spike-then-decide — with the two or three reasons that drove it and the main risk of being wrong.",
          change: "A benchmark on our real query patterns; the true migration-effort estimate; whether the current engine's scaling ceiling is closer than assumed.",
        },
      },
    },
    challenges: [
      fieldsChallenge("R1.1", "Reproduce", "Frame a real question",
        "Take a research request you've had (or would get) at work or in study. Turn the broad topic into a framed question.",
        "Strong answer: the decision behind it is explicit; scope has clear in/out lines; the answer type is named; and 'what would change it' points at something checkable.",
        [
          { key: "decision", label: "The decision it serves", hint: "The choice behind the request.", minWords: 6 },
          { key: "scope", label: "Scope — in and out", hint: "Time, place, population, definition.", minWords: 8 },
          { key: "answertype", label: "The kind of answer expected", hint: "Number / yes-no / shortlist / recommendation.", minWords: 4 },
          { key: "wouldchange", label: "What would change the answer", hint: "Something checkable.", minWords: 5 },
        ],
        [
          { label: "The decision behind the question is explicit" },
          { label: "Scope has clear in/out lines" },
          { label: "Answer type named; 'what would change it' is checkable" },
        ],
        "independent"),
      critiqueChallenge("R1.2", "Adapt", "Fix an unframed question",
        "A colleague is about to spend a week on this. Use the four-part test from the lesson to find every problem, then rewrite it into something answerable.",
        "\"Research the market for our product and tell us what you find.\"",
        [
          { label: "No decision named — 'what you find' serves no choice", signals: ["decision", "what choice", "why are they asking", "what's it for", "purpose", "serves no", "no decision"] },
          { label: "No scope — 'the market' is unbounded on geography, segment and time", signals: ["scope", "which market", "geography", "segment", "timeframe", "time period", "time horizon", "unbounded", "how broad", "boundaries", "which customers"] },
          { label: "No answer type — 'what you find' could be anything", signals: ["answer type", "what form", "what kind of answer", "deliverable", "a number", "a list", "recommendation", "shape of the answer"] },
          { label: "Nothing said about what would change the conclusion", signals: ["would change", "what would flip", "hinges on", "depends on", "key assumption", "sensitive to"] },
        ],
        "transferable", { text: `"We’re deciding whether to enter the UK mid-market segment (50–250 employees) this quarter. Research that segment for our product category over the last 12 months: market size, top 3 competitors’ pricing, and any regulatory barriers. Deliverable: a 1-page brief with a recommendation. The finding that would most change my mind: evidence a competitor already dominates this segment."`, changes: ["Names the actual decision the research serves", "Scopes the market by geography, segment size and time window", "States the deliverable shape (a 1-page brief with a recommendation)", "Names what would change the conclusion"] }),
    ],
  },

  {
    id: "R2", name: "Multi-source synthesis",
    canDo: "Combine many sources into one picture — where they agree, disagree, and go silent — with a confidence level on each claim, instead of taking the first fluent answer.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You asked five AI tools the same question and all five gave roughly the same answer, so you reported it as well-established. It traced back to a single blog post none of them named. The 'consensus' was one unverified claim, echoed five times.",
        point: "Five sources repeating a claim isn't five pieces of evidence. It might be one claim with an echo.",
      },
      explain: {
        paras: [
          "Synthesis is not 'average the answers'. It's building a picture that shows **what's actually supported**, **where sources disagree and why**, and **what nobody has answered**.",
          "Tag each claim with a confidence level — the **R0–R5** scale from the research protocol: **R0** unverified, **R1** a single source or model suggestion, **R2** multiple independent sources, **R3** strong evidence or expert corroboration, and up. Independence matters — outlets reprinting one wire story are one source.",
          "Disagreement is information, not noise. When two good sources conflict, the useful output is *why* — different data, definitions, or dates — not a coin flip or a midpoint.",
          "Name the gaps. \"No source addressed X\" is a finding your reader needs.",
        ],
        keyIdea: "Synthesis = supported claims (each with an R0–R5 level) + mapped disagreements with their cause + named gaps. Independent sources only; an echo is not corroboration.",
      },
      demonstrate: {
        task: "Question: is our industry's average customer-acquisition cost (CAC) rising?",
        steps: [
          { move: "Gather and tag each claim", think: "Source and independence.", result: "Vendor report: +30% YoY (R1 — one source with a commercial interest). Two trade surveys: +10–15% (R2). One academic dataset: flat (R2)." },
          { move: "Check independence", think: "Are these really separate?", result: "The two trade surveys draw on the same underlying panel — treat as one source. Now: vendor +30%, panel +10–15%, academic flat." },
          { move: "Explain the disagreement", think: "Why do they differ?", result: "Vendor measures paid channels only; the academic set includes organic; the panel is mid-market SaaS. Different denominators, not a contradiction." },
          { move: "State it with confidence + gap", think: "Honest summary.", result: "Paid-channel CAC is likely up ~10–15% for mid-market SaaS (R2). Blended CAC may be flat (R2, one dataset). No source covers enterprise. The vendor's +30% is an outlier with an interest (R1)." },
        ],
        full: "Tag each claim with a source and an R-level. Collapse the two surveys that share a panel into one. The spread is explained by different denominators (paid vs blended) and segments, not a real contradiction. Report: paid CAC up ~10–15% mid-market (R2); blended possibly flat (R2, thin); enterprise unknown; discount the conflicted +30%.",
      },
      deconstruct: [
        "Collapsing the two surveys that shared a panel is the whole game — it stopped a fake 'two-to-one'.",
        "The disagreement dissolved once the definitions were lined up; the answer names the definition it uses.",
        "'No source covers enterprise' is stated, not quietly dropped.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're researching whether remote work hurts team productivity. You have: two company-authored studies (one says yes, one says no), one meta-analysis (mixed — depends on task type), and several AI summaries that confidently say 'yes'.",
        fields: [
          { key: "confidence", label: "How would you rate the confidence of each source?", hint: "R0–R5, with independence in mind.", minWords: 8 },
          { key: "disagreement", label: "How do you handle the disagreement?", hint: "Why might they differ?", minWords: 6 },
          { key: "report", label: "What do you actually report?", hint: "Supported claim + confidence + gaps.", minWords: 8 },
        ],
        model: {
          confidence: "The meta-analysis is strongest — R3, it aggregates many studies. The two company studies are R1 each — single source, possible interest, opposite conclusions. The AI summaries are R0/R1 and likely echo each other and the more quotable company study; not independent evidence.",
          disagreement: "The meta-analysis explains it: the effect depends on task interdependence and role. The two company studies probably measured different work types with different productivity proxies. Not a genuine contradiction once you condition on task type.",
          report: "Best evidence (R3): the effect of remote work on productivity depends on the task — roughly neutral-to-positive for independent work, negative for highly interdependent collaboration without adjustment. Single-company studies point both ways and aren't decisive. The AI 'consensus' for 'yes' isn't independent support. Gap: little specifically on hybrid schedules.",
        },
      },
    },
    challenges: [
      fieldsChallenge("R2.1", "Reproduce", "Synthesise a real question",
        "Take a question with more than one source available. Build the synthesis: claims with confidence levels, the disagreements and their causes, and the gaps.",
        "Strong answer: each key claim carries an R0–R5 level; independence is actually checked (echoes collapsed); disagreements are explained by cause, not averaged; and gaps are named explicitly.",
        [
          { key: "question", label: "The question", hint: "One line.", minWords: 4 },
          { key: "levels", label: "Key claims, each with a source and an R0–R5 level", hint: "And note where sources aren't independent.", minWords: 12 },
          { key: "disagreements", label: "The disagreements and their causes", hint: "Definitions, data, dates.", minWords: 8 },
          { key: "gaps", label: "The gaps", hint: "What no source answered.", minWords: 5 },
        ],
        [
          { label: "Each key claim carries an R0–R5 level" },
          { label: "Independence checked — echoes collapsed to one source" },
          { label: "Disagreements explained by cause; gaps named" },
        ],
        "independent"),
      scenarioChallenge("R2.2", "Create", "Every source says the same thing",
        "Six sources — three news articles, two AI tools, one industry blog — all state the same figure, in near-identical wording, and none cites a primary source.",
        "How much confidence does that give you?",
        [
          { id: "a", label: "High — six sources agreeing is strong corroboration", ok: false, why: "They're not independent. Identical wording and no primary source is the signature of one claim being copied." },
          { id: "b", label: "Low — this looks like one unsourced claim propagating; trace it to a primary source or mark it R0/R1", ok: true, why: "Agreement without independence isn't evidence. Find the origin or flag it as unverified." },
          { id: "c", label: "Medium — news articles are usually fact-checked", ok: false, why: "Not when they're all repeating one unsourced figure; a real fact-check would need the primary source too." },
        ],
        "transferable"),
    ],
  },

  {
    id: "R3", name: "Source verification",
    canDo: "Check that every source exists, says what it's cited as saying, and is credible for the claim — and catch citations the AI made up.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Your report cited three papers for a key point. In review, someone tried to open them. One DOI went nowhere. One was a real paper that concluded the opposite. The third author had never written on the topic. The AI had produced all three, formatted perfectly.",
        point: "A citation that looks right — real-sounding author, plausible journal, clean format — is the easiest thing for AI to fabricate and the easiest for you to wave through.",
      },
      explain: {
        paras: [
          "Three checks, every source: **it exists** — you found it, not just a title that sounds real; **it says what you're citing it for** — you read the relevant part, not the abstract or the AI's paraphrase; **it's credible for this claim** — right field, sound method, not retracted, not the author grading their own work.",
          "AI fabricates citations *confidently and in the correct format*. A real DOI, a real journal name and a real-looking author can all be assembled around a paper that doesn't exist. Format is not evidence of existence.",
          "The dangerous case isn't the missing paper — you'll catch that. It's the real paper cited for something it doesn't say, or says the opposite of.",
        ],
        keyIdea: "Every source: it exists (found, not just plausible), it supports the specific claim (you read the part), and it's credible for this claim. AI fabricates in perfect format — so verify existence and content, never trust the formatting.",
      },
      demonstrate: {
        task: "AI gave you: \"Studies show onboarding emails lift 90-day retention by 25% (Chen & Alvarez, 2021, Journal of Marketing Analytics).\"",
        steps: [
          { move: "Does it exist?", think: "Search the title and authors directly.", result: "No Chen & Alvarez paper in that journal in 2021. There is a Chen 2019 in a different journal on email marketing." },
          { move: "Does the real one say it?", think: "Read the actual finding.", result: "Chen 2019 reports a 6–9% lift in trial-to-paid conversion — not 90-day retention, and not 25%." },
          { move: "Is it credible for the claim?", think: "Scope and method.", result: "Small single-company sample; the author notes it may not generalise. Fine as illustrative, not as 'studies show'." },
          { move: "Rewrite the claim", think: "Match it to what's real.", result: "\"One single-company study found onboarding emails lifted trial-to-paid conversion by 6–9% (Chen, 2019); we have no good evidence on 90-day retention specifically.\"" },
        ],
        full: "The cited paper doesn't exist. The nearest real paper is a different year, journal and metric, with a smaller effect and a generalisability caveat. The honest claim is much weaker than the fabricated one — and it names the gap on retention.",
      },
      deconstruct: [
        "The fabricated citation was more useful-sounding than the real evidence — that's exactly why it's dangerous.",
        "Reading the actual finding caught the metric swap (conversion, not retention) that a title check alone would miss.",
        "The rewrite is weaker and vaguer — because the evidence is.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A draft you're reviewing contains: \"Remote workers are 13% more productive (Bloom et al., Stanford, 2015).\" You vaguely recognise the study.",
        fields: [
          { key: "exists", label: "How do you check it exists and is being cited right?", hint: "What would you actually do?", minWords: 6 },
          { key: "trap", label: "What's the likely trap here?", hint: "It's a real study — so what could still be wrong?", minWords: 6 },
          { key: "fix", label: "How should the claim read?", hint: "Match it to the real finding and its scope.", minWords: 6 },
        ],
        model: {
          exists: "Find the actual paper — Bloom, Liang, Roberts & Ying, the Ctrip call-centre experiment, published 2015 in the Quarterly Journal of Economics. Read the abstract and results, not a summary of them.",
          trap: "It's a real, well-known study, so it gets waved through — but it's one firm, one job (call-centre staff), a specific setup (volunteers, home vs office), and the 13% includes working more hours and taking fewer breaks, not just per-hour output. As a general 'remote workers are 13% more productive' it's badly overstated.",
          fix: "\"In one randomised experiment at a Chinese travel agency's call centre, home-working staff were ~13% more productive, mostly from working more hours and taking fewer breaks (Bloom et al., 2015). It's one role at one firm and may not generalise.\"",
        },
      },
    },
    challenges: [
      critiqueChallenge("R3.1", "Reproduce", "Verify a set of citations",
        "Here is an AI-generated paragraph with three citations. Work through each one: what you'd check, what's likely wrong, and how you'd confirm. Assume you have normal internet access.",
        "\"Four-day weeks raise output per hour by up to 40% (Henley Business School, 2019). Employees report 71% lower burnout (Kim & Roberts, 2020, Journal of Occupational Health). A meta-analysis of 47 trials found no drop in total output (Persson, 2022).\"",
        [
          { label: "Each citation must be checked for existence, not just plausibility", signals: ["exist", "does it exist", "find the", "search for", "real paper", "confirm it's real", "look it up", "locate"] },
          { label: "The precise figures (40%, 71%, 47 trials) must be traced to the source, not the paraphrase", signals: ["figure", "number", "40%", "71%", "47 trials", "check the number", "read the finding", "match the claim", "says what", "actual finding"] },
          { label: "'A meta-analysis of 47 trials' is a classic fabrication shape — oddly specific, hard to check", signals: ["meta-analysis", "47 trials", "fabricat", "made up", "too specific", "suspicious", "does persson", "invented", "oddly specific"] },
          { label: "Source credibility and interest — is Henley's own study on its own recommended practice", signals: ["credible", "interest", "conflict", "who funded", "henley's own", "bias", "marking their own", "independent"] },
        ],
        "transferable", { text: `"Before using any of these: (1) confirm the Henley Business School 2019 study exists and actually reports ‘up to 40%’ — check the original, not a summary; (2) trace the 71% figure to the named journal article and confirm the finding and sample size; (3) verify the 47-trial meta-analysis by Persson (2022) actually exists — an oddly precise, hard-to-check number is a classic fabrication shape; (4) note Henley is a business school evaluating a practice it also promotes, and read the finding accordingly."`, changes: ["Treats “exists” as a separate check from “sounds plausible,” for every citation", "Requires tracing each precise figure to the original source, not the paraphrase", "Flags the oddly-specific “47 trials” as a classic fabrication shape", "Adds source-interest as its own check"] }),
      scenarioChallenge("R3.2", "Create", "A perfectly formatted citation you can't find",
        "You've searched the title, the authors and the DOI. Nothing. The formatting is flawless and the journal is real.",
        "What do you conclude?",
        [
          { id: "a", label: "It probably exists — search engines miss things; cite it and move on", ok: false, why: "A citation you cannot locate is not one you can stand behind. Flawless formatting is exactly what fabrication looks like." },
          { id: "b", label: "Treat it as fabricated until proven otherwise — remove it, or find a real source for the claim", ok: true, why: "The burden is on the citation to be verifiable. If it isn't, the claim it supports is unsupported." },
          { id: "c", label: "Ask the AI to confirm whether it's real", ok: false, why: "The AI that produced it will often 'confirm' it just as confidently. That isn't verification." },
        ],
        "transferable"),
    ],
  },

  {
    id: "R4", name: "Faithful summarisation",
    canDo: "Compress a source without dropping its caveats, flattening its uncertainty, or adding confidence that wasn't there.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The source said: \"In this small pilot, the tool may have contributed to a modest reduction in errors, though other changes happened at the same time.\" Your AI summary said: \"The tool reduces errors.\" The hedges, the sample size and the confound all vanished — and a decision got made on the confident version.",
        point: "Summarising isn't just making it shorter. Every caveat you drop makes the finding sound stronger than it is.",
      },
      explain: {
        paras: [
          "A faithful summary keeps four things the original had: its **hedges** (\"may\", \"in this context\", \"preliminary\"), its **scope** (who, what, when it applies to), its **uncertainty** (sample size, confounds, disagreement), and its **direction and magnitude** — not just \"an effect\" but which way and how big.",
          "AI summarisation tends to **round up**: hedged becomes definite, \"some\" becomes \"most\", a correlation becomes a cause. It's not lying — it's compressing toward the fluent, confident version.",
          "The test: could someone act on your summary and be surprised by what the original actually said? If yes, the summary distorted.",
        ],
        keyIdea: "Faithful = keeps the hedges, the scope, the uncertainty, and the direction/magnitude. AI rounds up — so check your summary back against the source for confidence it added.",
      },
      demonstrate: {
        task: "Summarise for a decision brief: \"Across three observational studies, teams using the framework reported higher satisfaction (self-reported; response rates 40–55%). Effect sizes were small and one study found no difference. No causal claim can be made from this design.\"",
        steps: [
          { move: "First-pass AI summary", think: "What it tends to produce.", result: "\"Teams using the framework are more satisfied.\"" },
          { move: "Restore the design limit", think: "Observational, self-reported.", result: "\"...reported higher satisfaction (self-reported; observational, so not causal)\"" },
          { move: "Restore the uncertainty", think: "Mixed results, low response.", result: "\"...small effects; one of three studies found no difference; response rates 40–55%\"" },
          { move: "Final faithful summary", think: "Short but honest.", result: "\"Weak, non-causal evidence: in three observational studies, teams using the framework self-reported slightly higher satisfaction, though effects were small and one study found none.\"" },
        ],
        full: "The rounded-up version ('are more satisfied') would drive a decision the evidence can't support. The faithful version is still one sentence — it just keeps 'non-causal', 'self-reported', 'small' and 'one found none', which is exactly what a decision-maker needs to weight it.",
      },
      deconstruct: [
        "The faithful summary is barely longer — fidelity costs words, not paragraphs.",
        "'Non-causal' and 'self-reported' are the two words that change how much a reader should lean on this.",
        "'One study found none' survived — dropping the disconfirming result is the most common distortion.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Summarise for a one-line Slack update: \"A/B test over two weeks (n≈1,200 per arm): the new checkout flow increased completed purchases by 3.1% (95% CI: -0.4% to +6.6%). Result did not reach statistical significance. Mobile users drove most of the gain.\"",
        fields: [
          { key: "summary", label: "Your faithful one-line summary", hint: "Short, but nothing added or dropped that matters.", minWords: 10 },
          { key: "dropped", label: "What would a careless summary drop?", hint: "The parts that change the meaning.", minWords: 6 },
        ],
        model: {
          summary: "\"New checkout flow showed a +3.1% purchase lift in a 2-week test, but it wasn't statistically significant (CI crosses zero) — suggestive, not proven; the gain was mostly mobile.\"",
          dropped: "A careless version says 'new flow increased purchases 3.1%' — dropping that the confidence interval includes zero and negative values, that it wasn't significant, and that desktop barely moved. That turns 'test it longer' into 'ship it'.",
        },
      },
    },
    challenges: [
      critiqueChallenge("R4.1", "Reproduce", "Catch the distortions in a summary",
        "Here is an original passage and an AI-written summary of it. Find every place the summary added confidence, dropped a caveat, or changed the scope — and give the fix.",
        "ORIGINAL: \"A non-randomised pilot at two hospitals suggested the checklist might reduce complications, but staffing also increased during the period, and the authors caution against over-interpreting the 8% figure.\"\n\nSUMMARY: \"A hospital study found the checklist reduces complications by 8%.\"",
        [
          { label: "'suggested ... might' became 'found ... reduces' — the hedge was dropped", signals: ["hedge", "suggested", "might", "found", "reduces", "definite", "certainty", "stronger", "overstat"] },
          { label: "The staffing confound is gone entirely", signals: ["confound", "staffing", "other changes", "attribution", "caused by", "also increased", "alternative explanation"] },
          { label: "'non-randomised pilot' became 'study' — the design limitation is hidden", signals: ["non-randomised", "pilot", "design", "observational", "study", "not a trial", "two hospitals", "small"] },
          { label: "The authors' own caution against over-interpreting the 8% is dropped", signals: ["caution", "over-interpret", "authors warn", "8%", "the figure", "don't rely", "authors themselves"] },
        ],
        "transferable", { text: `"A non-randomised pilot at two hospitals suggested the checklist might reduce complications by around 8%, though staffing also increased during the study period and the authors caution against over-interpreting that figure."`, changes: ["“found…reduces” reverts to the original’s hedge (“suggested…might”)", "The staffing confound is restated, not dropped", "“study” becomes “non-randomised pilot at two hospitals” again", "The authors’ own caution about the 8% is kept in"] }),
      fieldsChallenge("R4.2", "Transfer", "Summarise a real source faithfully",
        "Take a real report, paper or article relevant to your work. Write a short summary, then audit your own summary against the source.",
        "Strong answer: the summary keeps the source's hedges, scope, uncertainty and direction/magnitude; the self-audit names at least one thing that was tempting to round up; and a reader acting on the summary would not be surprised by the original.",
        [
          { key: "source", label: "The source", hint: "What it is, and its main finding in the original's own terms.", minWords: 8 },
          { key: "summary", label: "Your short summary", hint: "Compressed, but faithful.", minWords: 10 },
          { key: "selfaudit", label: "Self-audit against the source", hint: "What was tempting to round up? Did anything slip?", minWords: 8 },
        ],
        [
          { label: "Summary keeps hedges, scope, uncertainty, direction/magnitude" },
          { label: "Self-audit names something that was tempting to round up" },
          { label: "A reader acting on it wouldn't be surprised by the original" },
        ],
        "advanced"),
    ],
  },

  {
    id: "R5", name: "Communicate honestly",
    canDo: "Present findings with their real confidence, the gaps, and what would change the conclusion — so the reader can weight them correctly.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Your findings were solid but mixed. The exec summary said \"the data clearly shows we should expand.\" Leadership committed budget. When two of the softer findings didn't hold up, the question wasn't 'what changed?' — it was 'why did you say clearly?'",
        point: "How confident your writing sounds is a claim in itself. If it outruns the evidence, that's on you, not the evidence.",
      },
      explain: {
        paras: [
          "An honest findings write-up carries: the **headline answer**; its **confidence** and why; the **key uncertainties and gaps**; and **what would change the conclusion**. Confidence isn't a disclaimer at the end — it's part of the finding.",
          "Match language to evidence. \"Shows\" and \"proves\" are for strong, replicated, causal evidence. \"Suggests\", \"is consistent with\", \"points toward\" are for the rest. \"We don't know\" is a legitimate and useful finding.",
          "Separate what you found from what you recommend. A reader may weight the risks differently than you — give them the basis, not just the conclusion.",
          "Put the load-bearing uncertainty where the decision-maker will see it, not in a footnote.",
        ],
        keyIdea: "Honest reporting = headline + calibrated confidence + the gaps + what would change it, with language matched to the evidence and findings kept separate from recommendations.",
      },
      demonstrate: {
        task: "Turn mixed research into an honest one-paragraph brief. Findings: strong evidence the overall market is growing (R3); weak evidence our segment specifically is growing (R1, one source); no data on competitor pricing plans.",
        steps: [
          { move: "Overconfident version", think: "What not to send.", result: "\"The market is growing and our segment is well-positioned — we should expand now.\"" },
          { move: "State each finding at its level", think: "Calibrate.", result: "\"The overall market is growing (strong evidence). Whether our specific segment is growing is unclear — one source suggests yes, nothing corroborates it.\"" },
          { move: "Name the gap that matters", think: "What's missing that bears on the decision.", result: "\"We have no read on competitor pricing, which would directly affect an expansion's payback.\"" },
          { move: "Separate finding from recommendation", think: "Give the basis.", result: "\"Recommendation: a small, reversible expansion now, with a segment-growth check in 90 days before committing further — because the segment evidence is the weak link.\"" },
        ],
        full: "Headline: overall market up (R3); our segment unclear (R1); competitor pricing unknown. Language matched to each. The recommendation is stated separately and is explicitly shaped by the weakest finding — a reversible step plus a checkpoint, not 'expand now'.",
      },
      deconstruct: [
        "Each finding is stated at its own confidence level, not blended into one 'the data shows'.",
        "The gap (competitor pricing) is in the paragraph, not an appendix, because it bears on the decision.",
        "The recommendation names which finding it's most sensitive to — so if that finding moves, the reader knows to revisit.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You researched whether to adopt a new tool. Findings: it's faster in benchmarks (R2, two independent tests); teams that switched report mixed satisfaction (R1, anecdotal); migration cost is genuinely unknown; your current tool's contract renews in 4 months.",
        fields: [
          { key: "headline", label: "The headline + confidence for each finding", hint: "Calibrated language.", minWords: 8 },
          { key: "gaps", label: "The gaps and what would change the conclusion", hint: "What's missing that matters.", minWords: 6 },
          { key: "recommend", label: "Your recommendation, kept separate from the findings", hint: "And what it hinges on.", minWords: 6 },
        ],
        model: {
          headline: "\"The new tool is faster in benchmarks (reasonably solid — two independent tests). Whether that speed matters in our actual workflow is untested. Satisfaction reports from switchers are mixed and only anecdotal.\"",
          gaps: "Migration cost is unknown and could easily outweigh the speed gain — that's the finding most likely to flip the decision. No data on how the vendor handles support at our scale.",
          recommend: "Run a two-week paid trial on our real workload before the contract decision in 4 months, then estimate migration cost properly. Don't commit now — the case rests on an untested speed benefit and an unknown switching cost.",
        },
      },
    },
    challenges: [
      critiqueChallenge("R5.1", "Reproduce", "Fix an overconfident write-up",
        "Here is a findings summary written to sound decisive. The underlying evidence is in brackets. Rewrite it so the language matches the evidence, the gaps are visible, and the recommendation is separate from the findings.",
        "\"Our research clearly shows that customers want a mobile app [one survey, 32% response rate] and that building it will increase retention [no direct evidence; inferred from a competitor's blog post]. We should start development immediately. [Migration of existing accounts not investigated.]\"",
        [
          { label: "'clearly shows' overstates a single low-response survey", signals: ["clearly shows", "overstate", "one survey", "32%", "response rate", "language", "suggests instead", "weak", "calibrate"] },
          { label: "The retention claim has no direct evidence — inferred from a blog post — yet is stated as fact", signals: ["retention", "no direct evidence", "inferred", "blog post", "stated as fact", "unsupported", "r0", "r1", "not evidence"] },
          { label: "'start development immediately' — recommendation not separated from findings, and outruns them", signals: ["recommendation", "separate", "immediately", "outruns", "not the finding", "conflates", "premature", "jump"] },
          { label: "The uninvestigated account migration is a material gap and should be visible", signals: ["migration", "not investigated", "material gap", "surface it", "surface the", "make it visible", "flag the unknown", "footnote"] },
        ],
        "transferable", { text: `"One survey (32% response rate) suggests some customer interest in a mobile app; we don’t yet have direct evidence on retention — a competitor’s blog post is the only signal there. Recommendation (separate from the findings above): given the low cost, we suggest a small pilot before full build. Open gap: account migration for existing users hasn’t been investigated and needs scoping before any go/no-go."`, changes: ["“clearly shows” downgraded to “suggests,” response rate stays visible", "The retention claim is labelled unsupported, not stated as fact", "The recommendation is separated from the findings, “immediately” removed", "The uninvestigated migration gap is surfaced, not hidden"] }),
      fieldsChallenge("R5.2", "Transfer", "Report a real piece of research honestly",
        "Take research you've actually done — or build on your R2.1 / R1.1 work from this pathway. Write the honest findings brief.",
        "Strong answer: language is matched to each finding's evidence level; the load-bearing uncertainty is prominent, not buried; findings and recommendation are clearly separated; and 'what would change the conclusion' is specific.",
        [
          { key: "headline", label: "Headline + calibrated confidence per finding", hint: "Matched language.", minWords: 10 },
          { key: "gaps", label: "Gaps + what would change the conclusion", hint: "The load-bearing uncertainty, up front.", minWords: 6 },
          { key: "recommendation", label: "Recommendation, kept separate", hint: "And what it's most sensitive to.", minWords: 6 },
        ],
        [
          { label: "Language matched to each finding's evidence level" },
          { label: "Load-bearing uncertainty is prominent, not buried" },
          { label: "Findings and recommendation separated; 'what would change it' is specific" },
        ],
        "advanced"),
    ],
  },
  ];
  return { competencies: RESEARCH_COMPETENCIES, capstoneId: "RESCAP" };
};
