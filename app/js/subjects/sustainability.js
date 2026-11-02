/* Subject: sustainability
 *
 * Sustainability & green skills for mainstream online learners - measure impact, make better
 * choices, verify claims and act. Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["sustainability"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const SUS_COMPETENCIES = [
  {
    id: "SUS1", name: "Measure your impact - footprint and lifecycle",
    canDo: "Work out your own or your household's footprint, and read lifecycle impacts instead of single numbers.",
    resources: [
      { title: "Carbon Footprint Calculator - EPA", url: "https://www.epa.gov/carbon-footprint-calculator", type: "tool", description: "Household-level footprint estimation." },
      { title: "UN Environment - Life Cycle Assessment", url: "https://www.unep.org/", type: "reference", description: "Lifecycle thinking frameworks for products and services." },
      { title: "Project Drawdown - research", url: "https://drawdown.org/", type: "reference", description: "Research-backed climate solutions and impact estimates." },
    ],
    selfCheck: [
      "Have I measured my own footprint, even roughly?",
      "Do I read lifecycle impacts rather than single numbers?",
      "Have I checked the data sources behind a footprint claim?",
      "Do I know the difference between reduction and offsetting?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A household switched to green cleaning products and felt absolved, without ever measuring whether the swap moved the footprint at all. The feeling was real; the impact was likely small and untracked.", point: "Measure before and after - feelings are not evidence." },
      explain: { paras: ["Footprint work starts with honest measurement, not good intentions.", "Lifecycle thinking looks at whole-system impact rather than one stage.", "Reduction beats offsetting, and offsetting is not a substitute for reduction.", "Claims need checking: numbers in marketing are often estimates, not audited facts."], keyIdea: "Measure, reduce, verify - in that order." },
      demonstrate: { task: "Measure a household's travel and energy footprint.", steps: [{ move: "List activities", think: "Travel, home energy, food, goods.", result: "footprint inputs." }, { move: "Estimate each", think: "Use a calculator or defensible proxies.", result: "rough footprint." }, { move: "Rank the big levers", think: "What moves the number most.", result: "levers named." }, { move: "Check the sources", think: "Who measured, how.", result: "confidence." }], full: "Travel + energy measured -> levers ranked -> sources checked. The big levers accounted for most of the footprint." },
      deconstruct: ["Measurement before action keeps the effort honest.", "Lifecycle scope prevents hidden hotspots.", "Reduction is the only real offset for a personal footprint.", "Verification separates credible claims from marketing."],
      guided: { intro: "Your turn. Measure a footprint you care about.", task: "Measure your own or your household's footprint, then name the top reduction lever.", fields: [{ key: "measured", label: "What you measured", hint: "Scope and method.", minWords: 8 }, { key: "levers", label: "The levers", hint: "Ranked, with rough impact.", minWords: 8 }, { key: "verify", label: "What you checked", hint: "Sources, claims.", minWords: 8 }], model: { measured: "Travel and home energy via calculator.", levers: "Fly less, shift to efficient transport, switch to renewable energy.", verify: "Checked the calculator methodology." } },
    },
    challenges: [
      fieldsChallenge("SUS1.1", "Reproduce", "Measure a real footprint", "Measure your own or a household's footprint and rank the top levers.", "Strong answer: method stated, measurements made, levers ranked.", [{ key: "measured", label: "What you measured", hint: "Scope and method.", minWords: 8 }, { key: "levers", label: "The levers", hint: "Ranked, with rough impact.", minWords: 8 }, { key: "verify", label: "What you checked", hint: "Sources, claims.", minWords: 8 }], [{ label: "A real measurement" }, { label: "Levers ranked" }, { label: "Sources checked" }], "independent"),
      scenarioChallenge("SUS1.2", "Adapt", "A carbon footprint claim looks too good", "A product or service advertises a near-zero footprint. You are not sure it is real.", "What do you do?", [{ id: "a", label: "Take the claim at face value", ok: false, why: "Single-number claims usually ignore lifecycle scope." }, { id: "b", label: "Ask what scope and system the number covers", ok: true, why: "The number's meaning depends on what was included." }, { id: "c", label: "Assume it is false and stop there", ok: false, why: "The claim may be partial but still meaningful; verify rather than dismiss." }, { id: "d", label: "Treat it as settled and move on", ok: false, why: "An unverified claim treated as settled is exactly the gap verification closes." }], "transferable"),
    ],
  },
  {
    id: "SUS2", name: "Make better choices - energy, transport, consumption, waste",
    canDo: "Choose lower-impact options across everyday decisions, with AI used to research and compare.",
    resources: [
      { title: "Project Drawdown - solutions", url: "https://drawdown.org/", type: "reference", description: "Research-backed solutions with impact estimates." },
      { title: "EPA - green power and efficiency", url: "https://www.epa.gov/green-power", type: "reference", description: "Green power procurement and efficiency info." },
      { title: "UNEP - consumer guidance", url: "https://www.unep.org/", type: "reference", description: "Consumer-facing sustainability guidance." },
    ],
    selfCheck: [
      "Did I prefer reduction over offsetting?",
      "Did I use AI to research options before choosing?",
      "Did I verify claims before acting?",
      "Did I make the choice specific enough to act on?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A learner switched to a carbon-neutral airline product and stopped there, while the bigger levers in home energy went untouched. The choice felt like action; it was mostly a label.", point: "One labelled swap is not a strategy. Build real choices." },
      explain: { paras: ["Make choices that reduce, not ones that offset or label.", "Use AI to research and compare options before deciding.", "Verify claims before committing to a choice.", "Make choices specific enough to act on."], keyIdea: "Research, choose, verify - choices that reduce." },
      demonstrate: { task: "Compare three real options for one household decision.", steps: [{ move: "Frame the decision", think: "What is actually changing.", result: "decision framed." }, { move: "Research with AI + sources", think: "Options, trade-offs, data.", result: "options compared." }, { move: "Choose and verify", think: "Claim check, reduction priority.", result: "choice made." }], full: "Options compared -> claim verified -> reduction chosen. The decision was made on evidence, not vibes." },
      deconstruct: ["Research before choice keeps the decision honest.", "Reduction beats offset or label.", "Verification before action prevents greenwashing complicity.", "Specificity keeps the choice actionable."],
      guided: { intro: "Your turn. Choose one real area and work it.", task: "Pick one real area (energy, transport, food, consumption, waste) and make a lower-impact choice.", fields: [{ key: "area", label: "The area", hint: "What you chose.", minWords: 6 }, { key: "options", label: "The options considered", hint: "With evidence.", minWords: 8 }, { key: "choice", label: "The choice", hint: "And why.", minWords: 8 }], model: { area: "Home energy.", options: "Solar + efficiency vs grid mix.", choice: "Efficiency first, then green supply." } },
    },
    challenges: [
      fieldsChallenge("SUS2.1", "Reproduce", "Make a real lower-impact choice", "Choose one real lower-impact option and log the research and the choice.", "Strong answer: options researched, verified, reduction chosen.", [{ key: "area", label: "The area", hint: "What you chose.", minWords: 6 }, { key: "options", label: "The options", hint: "With evidence.", minWords: 8 }, { key: "choice", label: "The choice", hint: "And why.", minWords: 8 }], [{ label: "Options researched" }, { label: "Verified" }, { label: "Reduction chosen" }], "independent"),
      scenarioChallenge("SUS2.2", "Adapt", "The low-impact option is not obviously better", "Two options both reduce impact; you must choose without perfect data.", "What do you do?", [{ id: "a", label: "Pick arbitrarily to feel good", ok: false, why: "Arbitrary choice without evidence is just preference dressed as virtue." }, { id: "b", label: "Score them on measured impact and pick the better", ok: true, why: "Comparison on evidence is the point." }, { id: "c", label: "Do nothing and keep both", ok: false, why: "Doing nothing is also a choice, and usually the worst one." }, { id: "d", label: "Flip a coin between them", ok: false, why: "A coin flip is preference without the evidence comparison that was the point." }], "transferable"),
    ],
  },
  {
    id: "SUS3", name: "Verify claims and act - greenwashing, offsets, advocacy",
    canDo: "Check green claims for credibility, understand offsets, and act on verified information.",
    resources: [
      { title: "Greenwashing claims - FTC / advertising standards", url: "https://www.ftc.gov/", type: "reference", description: "Guidance on environmental marketing claims." },
      { title: "Offset standards - Verra / Gold Standard", url: "https://verra.org/", type: "reference", description: "Standards for carbon offsets." },
      { title: "Climate Action - IPCC", url: "https://www.ipcc.ch/", type: "reference", description: "Authoritative climate assessment reports." },
    ],
    selfCheck: [
      "Can I spot a vague or unverifiable green claim?",
      "Do I know what credible offsets require?",
      "Do I act on verified information rather than vibes?",
      "Do I know when to advocate vs when to audit?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A brand launched an eco line on vague language. The audience could not tell marketing from measurement, and the brand sold the confusion.", point: "Verification is the difference between credibility and greenwashing." },
      explain: { paras: ["Vague claims are claims; verify them against evidence.", "Offsets are not a substitute for reduction; check the standard.", "Act on verified information, not enthusiasm.", "Advocacy should be evidence-led."], keyIdea: "Verify, then act - credibility before marketing." },
      demonstrate: { task: "Audit a real green claim.", steps: [{ move: "Read the claim", think: "What exactly is asserted.", result: "claim scoped." }, { move: "Check evidence", think: "Sources, methodology, standards.", result: "evidence state." }, { move: "Decide action", think: "Correct, tweak, or call out.", result: "action." }], full: "Claim scoped -> evidence checked -> action taken. The claim was corrected or confirmed." },
      deconstruct: ["Scoping the claim is the first verification act.", "Evidence state determines the response.", "Action should follow verification, not replace it.", "Advocacy without evidence is just noise."],
      guided: { intro: "Your turn. Audit or assess a real green claim.", task: "Audit a real green claim: what is asserted, what evidence supports it, what action follows.", fields: [{ key: "claim", label: "The claim", hint: "What exactly is said.", minWords: 6 }, { key: "evidence", label: "The evidence state", hint: "Supported / partial / unsupported.", minWords: 8 }, { key: "action", label: "The action", hint: "Correct, tweak or call out.", minWords: 8 }], model: { claim: "One product, one footprint number.", evidence: "Partial: single metric, no lifecycle scope.", action: "Ask for scope; do not treat as settled." } },
    },
    challenges: [
      fieldsChallenge("SUS3.1", "Reproduce", "Verify a real green claim", "Audit a real green claim: assertion, evidence, action.", "Strong answer: the claim scoped, evidence assessed, action decided.", [{ key: "claim", label: "The claim", hint: "What exactly is said.", minWords: 6 }, { key: "evidence", label: "The evidence state", hint: "Supported / partial / unsupported.", minWords: 8 }, { key: "action", label: "The action", hint: "Correct, tweak or call out.", minWords: 8 }], [{ label: "Claim scoped" }, { label: "Evidence assessed" }, { label: "Action decided" }], "independent"),
      scenarioChallenge("SUS3.2", "Adapt", "The offset claim is vague", "An org sells carbon offsets with vague language and no standard named.", "What do you do?", [{ id: "a", label: "Buy offsets anyway and stop asking", ok: false, why: "Unverified offsets are not reduction and may be worse than none." }, { id: "b", label: "Demand the standard and the evidence before buying", ok: true, why: "Credible offsets need a named standard and proof of additionality." }, { id: "c", label: "Assume all offsets are fake", ok: false, why: "Some are legitimate; the standard is what matters." }, { id: "d", label: "Buy the cheapest offset available", ok: false, why: "Cheapest is not credible; standards and evidence are what make an offset real." }], "transferable"),
    ],
  },
  ];
  return { competencies: SUS_COMPETENCIES, capstoneId: "SUSCAP" };
};
