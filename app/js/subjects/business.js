/* Subject: business
 *
 * Business, entrepreneurship & management for mainstream online learners.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["business"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const BIZ_COMPETENCIES = [
  {
    id: "BIZ1", name: "Validate the problem before building",
    canDo: "Talk to real potential customers, confirm the problem is real and painful, and define the value proposition before building anything.",
    resources: [
      { title: "The Mom Test (Rob Fitzpatrick)", url: "https://momtestbook.com/", type: "book", description: "How to talk to customers and learn if your business is a good idea — without lying to yourself." },
      { title: "Lean Startup (Eric Ries)", url: "https://theleanstartup.com/", type: "book", description: "Build-measure-learn: validate before you scale." },
    ],
    selfCheck: [
      "Have I spoken to at least 5 potential customers?",
      "Can I state the problem in their words, not mine?",
      "Do I know what they currently do to solve it?",
      "Can I describe the value proposition in one sentence?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A founder spent six months building an app nobody wanted. They asked friends 'would you use this?' and got polite yeses. Real customers never paid.", point: "'Would you use this?' is a useless question. You need to know if they'd pay, and what they do now." },
      explain: { paras: ["Talk to potential customers about their life, not your idea — ask about past behaviour, not future intent.", "Ask 'what did you do last time this happened?' — past behaviour predicts future behaviour.", "Ask 'how much did that cost you?' — pain has a price.", "Don't pitch your solution until you've confirmed the problem is real and painful."], keyIdea: "Validate the problem by talking about past behaviour and cost — never ask 'would you use this?'" },
      demonstrate: { task: "Interview 3 potential customers about a problem.", steps: [{ move: "Ask about the last time it happened", think: "Past behaviour, not future intent.", result: "they describe a real, recent instance." }, { move: "Ask what they did about it", think: "Current solutions reveal competition.", result: "they used a workaround or paid for something." }, { move: "Ask what it cost", think: "Time, money, frustration.", result: "a concrete cost." }, { move: "Don't pitch yet", think: "Confirm the problem first.", result: "you now know if the problem is real." }], full: "Three interviews: each described a recent instance, their current workaround, and what it cost them — problem confirmed before any solution was pitched." },
      deconstruct: ["Past behaviour predicts; future intent lies.", "Current workarounds reveal what you're competing against.", "Cost of the problem = willingness to pay for the solution.", "Pitching too early biases the answers."],
      guided: { intro: "Your turn. Interview 3 people, then compare.", task: "Interview 3 potential customers about a problem you want to solve. Write what you learned.", fields: [{ key: "problem", label: "The problem you investigated", hint: "In their words.", minWords: 6 }, { key: "learned", label: "What you learned", hint: "Past behaviour, workarounds, cost.", minWords: 10 }, { key: "value", label: "Your value proposition (one sentence)", hint: "Only after confirming the problem.", minWords: 8 }], model: { problem: "Small business owners waste 3 hours/week chasing late invoices.", learned: "All three chase manually; two use spreadsheets; one pays for software that doesn't fit. Cost: 3 hours + stress.", value: "Automated invoice chasing that fits how small businesses actually work." } },
    },
    challenges: [
      fieldsChallenge("BIZ1.1", "Reproduce", "Interview 5 real potential customers", "Interview 5 people about a real problem. Log what they said, their workarounds, and the cost. Don't pitch your solution.", "Strong answer: 5 real interviews, past behaviour logged, workarounds and cost documented, no pitching.", [{ key: "interviews", label: "The 5 interviews", hint: "Who, what they said.", minWords: 15 }, { key: "workarounds", label: "Current workarounds", hint: "What they do now.", minWords: 8 }, { key: "cost", label: "What the problem costs them", hint: "Time, money, frustration.", minWords: 8 }], [{ label: "5 real interviews logged" }, { label: "Workarounds documented" }, { label: "Cost quantified" }], "independent"),
      scenarioChallenge("BIZ1.2", "Adapt", "A friend says 'I'd definitely use that'", "You described your idea to a friend and they said 'I'd definitely use that!' and 'you should build it.'", "What do you do?", [{ id: "a", label: "Start building — you have validation", ok: false, why: "'I'd use that' is not validation; it's politeness." }, { id: "b", label: "Ask about the last time they had this problem and what they did", ok: true, why: "Past behaviour is the real signal; future intent is noise." }, { id: "c", label: "Ask them to pre-pay or sign up for a waitlist", ok: false, why: "A waitlist with no skin in the game is still cheap talk." }], "transferable"),
    ],
  },
  {
    id: "BIZ2", name: "Unit economics — does it make money?",
    canDo: "Calculate customer acquisition cost, lifetime value, and gross margin for a business idea, and judge whether it's viable.",
    resources: [
      { title: "Unit economics (a16z)", url: "https://a16z.com/", type: "guide", description: "Andreessen Horowitz — startup economics and metrics." },
    ],
    selfCheck: [
      "Can I calculate my customer acquisition cost (CAC)?",
      "Can I estimate lifetime value (LTV)?",
      "Is LTV > 3× CAC?",
      "Do I know my gross margin per unit?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A founder grew revenue 10× in a year. They were proud until an investor asked about unit economics: they were spending £50 to acquire a customer worth £30. Growth was just burning money faster.", point: "Revenue growth without unit economics is just burning money faster. The math has to work per customer." },
      explain: { paras: ["CAC = total sales & marketing spend ÷ new customers acquired.", "LTV = (average revenue per customer per month) × (gross margin) × (average months retained).", "Rule of thumb: LTV should be at least 3× CAC for a viable business.", "Gross margin = (price − cost of goods) ÷ price. Low margin means you need volume."], keyIdea: "LTV > 3× CAC and positive gross margin. If the math doesn't work per customer, scale makes it worse." },
      demonstrate: { task: "Calculate unit economics for a subscription box.", steps: [{ move: "CAC", think: "£500 spent on ads → 10 customers.", result: "CAC = £50." }, { move: "LTV", think: "£20/month × 60% margin × 12 months.", result: "LTV = £144." }, { move: "Check ratio", think: "LTV/CAC = 144/50 = 2.88.", result: "below 3× — needs work." }, { move: "Fix", think: "Raise price, cut CAC, or improve retention.", result: "viable path identified." }], full: "CAC £50, LTV £144, ratio 2.88 (below 3×) — need to raise price, cut CAC, or improve retention." },
      deconstruct: ["CAC includes all sales & marketing, not just ads.", "LTV uses gross margin, not revenue — costs matter.", "The 3× rule is a rule of thumb, not a law — but below 2× is dangerous.", "Scale amplifies bad unit economics — fix before growing."],
      guided: { intro: "Your turn. Calculate for your idea, then compare.", task: "Calculate CAC, LTV, and gross margin for your business idea.", fields: [{ key: "cac", label: "Customer acquisition cost", hint: "Total spend ÷ new customers.", minWords: 4 }, { key: "ltv", label: "Lifetime value", hint: "Revenue × margin × months retained.", minWords: 6 }, { key: "margin", label: "Gross margin", hint: "(Price − cost) ÷ price.", minWords: 4 }], model: { cac: "£200 spent ÷ 4 customers = £50 CAC.", ltv: "£30/month × 70% × 18 months = £378 LTV.", margin: "(£30 − £9) ÷ £30 = 70% gross margin." } },
    },
    challenges: [
      fieldsChallenge("BIZ2.1", "Reproduce", "Calculate unit economics for a real idea", "Pick a real or plausible business idea and calculate CAC, LTV, gross margin, and the LTV/CAC ratio. State whether it's viable.", "Strong answer: all four numbers calculated, ratio compared to 3×, viability stated with reasoning.", [{ key: "idea", label: "The business idea", hint: "What it sells.", minWords: 5 }, { key: "numbers", label: "CAC, LTV, margin, ratio", hint: "All four.", minWords: 12 }, { key: "viable", label: "Viable or not, and why", hint: "Compare to 3×.", minWords: 6 }], [{ label: "All four numbers calculated" }, { label: "Ratio compared to 3×" }, { label: "Viability stated with reasoning" }], "independent"),
      scenarioChallenge("BIZ2.2", "Adapt", "Revenue is growing but you're losing money", "Revenue doubled in six months but the bank account is emptier than ever.", "What do you check first?", [{ id: "a", label: "Raise prices immediately", ok: false, why: "Pricing may be the issue, but check the math first." }, { id: "b", label: "Calculate CAC and LTV — growth may be unprofitable per customer", ok: true, why: "Growth that loses money per customer is just faster burning." }, { id: "c", label: "Cut all marketing spend", ok: false, why: "That stops growth but doesn't fix the underlying economics." }], "transferable"),
    ],
  },
  ];
  return { competencies: BIZ_COMPETENCIES, capstoneId: "BIZCAP" };
};
