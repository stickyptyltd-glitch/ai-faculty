/* Subject: design
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["design"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const UX_COMPETENCIES = [
  {
    id: "UX1", name: "Synthesise research without inventing findings",
    canDo: "Turn raw user research into themes and insights without AI amplifying a minority opinion into a headline finding.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI summarised 8 user interviews into \"users overwhelmingly want a dashboard view.\" Only 2 of the 8 said anything like that — one strongly, unprompted by a leading question from the moderator. It shaped the whole roadmap.",
        point: "AI is very good at sounding confident about a pattern that's really one loud opinion.",
      },
      explain: {
        paras: [
          "Ask for themes tied to **counts and quotes** — \"4 of 8 participants said...\", not vibes.",
          "Distinguish a real **pattern** (multiple independent participants, unprompted) from a **loud opinion** (one person, strongly stated) or a **leading artifact** (something the moderator suggested that the participant just agreed with).",
          "Keep **traceability**: theme → which sessions → which quotes, so anyone can check it later.",
          "Report disagreement and minority views explicitly — don't smooth them away into the majority theme.",
        ],
        keyIdea: "A theme = an unprompted pattern across multiple independent sources, with a name, a count, and traceable quotes — not a vibe.",
      },
      demonstrate: {
        task: "Synthesising 8 checkout-flow interviews.",
        steps: [
          { move: "Check the 'dashboard' theme", think: "How many, and prompted or not?", result: "2 of 8, both after the moderator asked 'would a dashboard help?' — a leading artifact" },
          { move: "Demote it", think: "Not a finding.", result: "moved to a minor note, not a headline" },
          { move: "Check 'discount code distrust'", think: "Pattern check.", result: "6 of 8 mentioned it unprompted, in their own words" },
          { move: "Promote it with traceability", think: "Real theme.", result: "\"Users don't trust the discount code field (6/8, unprompted)\" + linked quotes from sessions 1,2,4,5,7,8" },
        ],
        full: "The prompted, 2/8 'dashboard' comment was demoted to a note. The unprompted, 6/8 'discount code distrust' comment was promoted to a real theme with quotes linked to sessions. Counted by participant, not by mention.",
      },
      deconstruct: [
        "Counting participants (not mentions) stops one chatty user dominating the synthesis.",
        "Checking whether a comment was prompted separates real signal from the moderator's own leading question.",
        "Traceability is what lets someone challenge the finding later instead of just trusting it.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI summarised 5 usability-test sessions and produced \"Users love the new icon set\" as a top finding.",
        fields: [
          { key: "check", label: "What you'd check before trusting it", hint: "Count, prompted or not, quotes.", minWords: 8 },
          { key: "showwork", label: "What you'd ask the AI to show", hint: "To make it checkable.", minWords: 5 },
          { key: "redflag", label: "A red flag that would demote this from 'finding' to 'noted'", hint: "Be specific.", minWords: 6 },
        ],
        model: {
          check: "How many of the 5 said it unprompted vs. in response to a direct question about the icons; whether it's the same 1-2 enthusiastic participants each time; whether any session's actual quote is milder than the paraphrase suggests.",
          showwork: "The exact quotes per participant, and whether the comment came up before or after the moderator mentioned the icons.",
          redflag: "If only 1 of 5 said it, or if it only appeared after the moderator asked 'what do you think of the icons?' — that's a prompted, single-source comment, not a finding.",
        },
      },
    },
    challenges: [
      fieldsChallenge("UX1.1", "Reproduce", "Synthesise a real research set",
        "Take real (or plausible) user research — interviews, a survey, session notes. Produce themes with counts, prompted/unprompted status, and traceable quotes.",
        "Strong answer: themes are counted by participant, not mention; prompted vs unprompted is distinguished; and quotes are traceable to specific sources.",
        [
          { key: "source", label: "The research (and how many participants)", hint: "One line.", minWords: 6 },
          { key: "themes", label: "The themes, with counts and prompted/unprompted status", hint: "Be specific per theme.", minWords: 12 },
          { key: "trace", label: "How each theme traces back to quotes/sessions", hint: "Concrete.", minWords: 6 },
        ],
        [
          { label: "Themes counted by participant, not mention" },
          { label: "Prompted vs unprompted distinguished" },
          { label: "Traceable to specific quotes/sessions" },
        ],
        "independent"),
      critiqueChallenge("UX1.2", "Adapt", "A synthesis that oversells one opinion",
        "Here's an AI-generated research synthesis. Find what's wrong with how it turned one strong opinion into a majority finding.",
        "\"Key finding: Users want a dark mode. One participant said 'I really wish this had dark mode, I'd use it constantly' and the team should prioritize this.\"",
        [
          { label: "It's a single participant, not a pattern across multiple sources", signals: ["one participant", "single participant", "only one", "not a pattern", "single source", "just one person"] },
          { label: "No count given relative to the total sample", signals: ["how many", "out of how many", "sample size", "relative to", "what fraction", "denominator"] },
          { label: "Presented as a 'key finding' when it's one strongly-worded opinion", signals: ["strongly worded", "loud opinion", "not a finding", "overstated", "key finding is too strong", "single quote"] },
          { label: "No check on whether it was prompted or unprompted", signals: ["prompted", "unprompted", "leading question", "was it asked", "moderator"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "UX2", name: "Generate and evaluate design options",
    canDo: "Use AI to widen the option space, then evaluate against real constraints instead of picking the prettiest option.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI generated one polished onboarding flow. It got built. Nobody had checked whether it fit the actual data model — it needed a field the backend didn't capture — and a chunk of engineering time went into a redesign.",
        point: "One good-looking option isn't a design process. And 'looks good' isn't the same as 'fits the real constraints'.",
      },
      explain: {
        paras: [
          "Ask for **genuinely different** approaches — structurally different, not five color variants of the same idea — each with its **trade-offs named explicitly**.",
          "Evaluate against **real, specific constraints**: the actual data model, accessibility requirements, technical feasibility, brand — not 'does it look good'.",
          "Involve the people who **own those constraints** (engineering, content, accessibility) **before** committing, not after the build starts.",
        ],
        keyIdea: "Ask for genuinely different options with named trade-offs, then score them against real constraints — feasibility, data, accessibility — before picking one.",
      },
      demonstrate: {
        task: "Redesigning onboarding.",
        steps: [
          { move: "Generate distinct options", think: "Structurally different.", result: "single-page form / multi-step wizard / progressive disclosure inline — 3 real approaches" },
          { move: "Name trade-offs", think: "Per option.", result: "wizard: clearer but more steps to abandon at; single-page: fast but overwhelming; progressive: balanced but needs conditional logic" },
          { move: "Check against real constraints", think: "The actual API.", result: "the wizard needs a field the backend doesn't capture yet — flagged before committing" },
          { move: "Decide", think: "Fits now.", result: "progressive disclosure chosen — fits the current data model" },
        ],
        full: "3 structurally distinct options generated, each with named trade-offs. Checked against the real API before committing — the wizard's requirement wasn't supported yet, so it was ruled out at the design stage, not after a build attempt.",
      },
      deconstruct: [
        "'Different' means structurally different — three color variants of one idea is not three options.",
        "The constraint check happened before build, which is what saved the wasted engineering time.",
        "Trade-offs were written down, not just felt — that's what makes the decision defensible later.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI generated 4 visually distinct homepage hero layouts for a product launch.",
        fields: [
          { key: "different", label: "What makes options genuinely different vs. cosmetic variants?", hint: "Structural, not color/spacing.", minWords: 6 },
          { key: "constraints", label: "The real constraints you'd check each against", hint: "Data, feasibility, accessibility, brand.", minWords: 6 },
          { key: "who", label: "Who you'd loop in before deciding", hint: "The people who own the constraints.", minWords: 5 },
        ],
        model: {
          different: "Different information hierarchy (what's shown first), different interaction model (static vs. carousel vs. video-led), different CTA strategy — not just four palettes on the same layout.",
          constraints: "Whether the copy needed exists yet, page-load budget (a video-led hero vs. performance targets), whether the CTA links to a page that's actually built, colour-contrast for the text over any background image.",
          who: "Engineering (feasibility/performance), content (is the copy real or placeholder), whoever owns performance budgets, before any option is picked as final.",
        },
      },
    },
    challenges: [
      fieldsChallenge("UX2.1", "Reproduce", "Generate and evaluate real design options",
        "Take a real design problem. Generate genuinely different options with AI, name their trade-offs, and check them against real constraints.",
        "Strong answer: options are structurally different, not cosmetic variants; trade-offs are named for each; and at least one real constraint (data, feasibility, accessibility) is actually checked, not assumed.",
        [
          { key: "problem", label: "The design problem", hint: "One line.", minWords: 4 },
          { key: "options", label: "The options, structurally different, with trade-offs", hint: "At least 2, real trade-offs each.", minWords: 12 },
          { key: "check", label: "The real constraint(s) you checked", hint: "And what you found.", minWords: 8 },
        ],
        [
          { label: "Options are structurally different" },
          { label: "Trade-offs named for each" },
          { label: "At least one real constraint actually checked" },
        ],
        "independent"),
      scenarioChallenge("UX2.2", "Create", "The stakeholder likes the first option",
        "You show a stakeholder the AI's first generated option. They like it immediately and ask you to move straight to build.",
        "What do you do?",
        [
          { id: "a", label: "Move to build — a happy stakeholder is the goal", ok: false, why: "Liking how it looks isn't the same as it fitting the real constraints — you haven't checked feasibility, data, or accessibility yet." },
          { id: "b", label: "Show them 1-2 genuinely different alternatives and the constraint check first, then confirm the choice", ok: true, why: "A real choice needs real alternatives and a constraint check, even if they end up picking the first one." },
          { id: "c", label: "Quietly do the constraint check yourself and only raise it if something's wrong", ok: false, why: "The stakeholder should see the trade-offs and be part of the decision, not just be told about a problem after the fact." },
        ],
        "transferable"),
    ],
  },

  {
    id: "UX3", name: "Accessibility as a real check",
    canDo: "Use AI to help find accessibility problems, while knowing what it reliably catches and what it doesn't.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "An AI accessibility review said the page \"looks accessible\" with no issues found. A screen-reader user couldn't complete checkout — the custom dropdown had no keyboard support. No text-based review would have caught that without actually testing the interaction.",
        point: "AI reads markup. It doesn't experience your interface the way a screen-reader or keyboard-only user does.",
      },
      explain: {
        paras: [
          "AI is genuinely useful for **known, checkable, static patterns**: missing alt text, low contrast ratios, missing form labels, heading structure. Treat that as a real first pass.",
          "It's **unreliable for interaction-level issues**: keyboard navigation, focus order, screen-reader announcement of dynamic content, custom-component behaviour. These need **actual testing** — a keyboard-only pass, a real screen reader, or a person with a disability.",
          "Don't let an AI \"looks fine\" substitute for real testing on anything **interactive or custom-built**.",
        ],
        keyIdea: "AI catches static, checkable accessibility issues well. Interaction and custom components need real testing — keyboard-only, a screen reader, or a real user — not a text-based review.",
      },
      demonstrate: {
        task: "Reviewing a checkout page.",
        steps: [
          { move: "Run the AI pass", think: "Static, checkable.", result: "flags 3 real issues: missing alt text, a contrast failure, an unlabelled input" },
          { move: "Fix those", think: "Real value from the pass.", result: "all 3 fixed" },
          { move: "Keyboard-only pass on the custom dropdown", think: "Interaction — needs real testing.", result: "it's a keyboard trap — can't tab out of it" },
          { move: "Compare", think: "What the AI pass missed.", result: "the trap was invisible to a text-based review because it's about interaction, not markup content" },
        ],
        full: "AI caught 3 real static issues (alt text, contrast, labels) — genuinely useful. A manual keyboard-only test then found a keyboard trap in a custom dropdown that no text-based AI review could have surfaced.",
      },
      deconstruct: [
        "The AI pass is a real, useful first filter — not nothing.",
        "But it has a clear boundary: static analysis vs. interaction — knowing that boundary is the actual skill.",
        "Custom components are exactly where that boundary bites hardest, because there's no standard markup pattern to check against.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're about to ship a new custom date-picker component.",
        fields: [
          { key: "catch", label: "What an AI accessibility check would likely catch", hint: "The static stuff.", minWords: 6 },
          { key: "miss", label: "What it would likely miss", hint: "The interaction stuff.", minWords: 6 },
          { key: "test", label: "The real test you'd run before shipping", hint: "Concrete.", minWords: 6 },
        ],
        model: {
          catch: "Missing ARIA labels on the buttons, insufficient color contrast on selected/today states, missing alt text on any icon buttons.",
          miss: "Whether you can operate the whole picker with only a keyboard (arrow keys between dates, Escape to close, focus trapped correctly), and whether a screen reader announces the selected date and month changes.",
          test: "A full keyboard-only pass (no mouse) navigating to a date and selecting it, plus running it with a real screen reader (VoiceOver/NVDA) to confirm the month/date changes are announced.",
        },
      },
    },
    challenges: [
      fieldsChallenge("UX3.1", "Reproduce", "AI pass + real test on a real component",
        "Take a real page or component. Run an AI-assisted accessibility pass, then do one real test (keyboard-only or screen reader) on anything interactive.",
        "Strong answer: the AI pass catches genuine static issues; a real interaction test is actually performed (not assumed); and anything the real test found that the AI pass missed is called out.",
        [
          { key: "component", label: "The page/component", hint: "One line, note if it's custom/interactive.", minWords: 4 },
          { key: "aipass", label: "What the AI pass found", hint: "Real static issues.", minWords: 8 },
          { key: "realtest", label: "The real test you ran and what it found", hint: "Keyboard-only or screen reader.", minWords: 8 },
        ],
        [
          { label: "AI pass catches genuine static issues" },
          { label: "A real interaction test is actually performed" },
          { label: "Anything missed by the AI pass is called out" },
        ],
        "independent"),
      scenarioChallenge("UX3.2", "Create", "Zero issues found on a custom interactive component",
        "An AI accessibility review returns zero issues on a new custom interactive component (a drag-and-drop reorder list).",
        "Do you ship it as accessible?",
        [
          { id: "a", label: "Yes — a clean AI report is good evidence for a custom component", ok: false, why: "AI reads markup, not interaction. Drag-and-drop is exactly the kind of interaction-heavy pattern a text-based review can't evaluate." },
          { id: "b", label: "No — run a real keyboard-only and screen-reader test on it before calling it accessible", ok: true, why: "Custom, interactive components are precisely where the AI pass's static-analysis boundary matters most." },
          { id: "c", label: "Ship it, but add a note to test it later if anyone complains", ok: false, why: "That defers a real accessibility barrier onto affected users finding it themselves." },
        ],
        "transferable"),
    ],
  },

  {
    id: "UX4", name: "Interface copy that doesn't overclaim",
    canDo: "Get AI to draft UI copy that's honest about what the product actually does right now.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "An AI-drafted empty state said \"Your dashboard will automatically optimize your workflow!\" The feature didn't automatically do anything yet — it was a placeholder. A user filed a complaint when nothing happened.",
        point: "UI copy is a promise about behaviour. AI will happily promise things the product doesn't do yet.",
      },
      explain: {
        paras: [
          "Before shipping AI-drafted copy, check **every claim against what the interface actually does right now** — not the roadmap, not the intended future state.",
          "Watch for: verbs that promise **automation/intelligence** the product doesn't have yet ('automatically', 'smart', 'AI-powered'), **error messages that blame the user** for a system fault, and **success states that overstate** what actually happened.",
          "Keep a **\"what does this button/state actually do\"** fact next to the draft copy while reviewing it.",
        ],
        keyIdea: "UI copy is a promise about behaviour — check every claim against what the product actually does right now, not the roadmap.",
      },
      demonstrate: {
        task: "Reviewing AI-drafted copy for a CSV upload feature.",
        steps: [
          { move: "Draft claim", think: "Check it.", result: "\"Your data is now perfectly organized!\" — but the feature just stores the raw file, no organizing happens" },
          { move: "Rewrite", think: "Match reality.", result: "\"Your file has been uploaded.\"" },
          { move: "Check the error copy too", think: "Same discipline.", result: "\"Invalid input\" → rewritten to \"That file isn't a CSV — try exporting from your spreadsheet as .csv\"" },
        ],
        full: "'Automatically optimize' and 'perfectly organized' both overclaimed features the product didn't have. Rewritten to state exactly what happened. The vague 'Invalid input' error was rewritten to name the actual problem.",
      },
      deconstruct: [
        "The check is against current behaviour, not intent or the roadmap.",
        "Vague, blame-y errors get replaced with specific, actionable ones.",
        "'Automatically'/'AI-powered'/'smart'/'optimized' are exactly the words that need a behaviour check every time.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted this success message for a manual CSV upload feature: \"Your data is now perfectly organized!\"",
        fields: [
          { key: "claim", label: "What claim needs checking?", hint: "Name it.", minWords: 4 },
          { key: "actual", label: "What does the interface actually do?", hint: "Be precise.", minWords: 6 },
          { key: "fix", label: "The corrected copy", hint: "Match reality.", minWords: 4 },
        ],
        model: {
          claim: "\"Perfectly organized\" implies the system did some organizing/cleanup work on the data.",
          actual: "The upload just stores the raw file as-is — no organizing, cleaning, or structuring happens automatically.",
          fix: "\"Your file has been uploaded.\" — states exactly what happened, nothing more.",
        },
      },
    },
    challenges: [
      fieldsChallenge("UX4.1", "Reproduce", "Review real UI copy against actual behaviour",
        "Take a real (or plausible) piece of AI-drafted UI copy. Check its claims against what the interface actually does, and rewrite anything that overclaims.",
        "Strong answer: at least one specific claim is checked against real behaviour (not assumed); the rewrite matches reality exactly; and any vague/blame-y error copy is made specific.",
        [
          { key: "copy", label: "The original AI-drafted copy", hint: "Quote it.", minWords: 5 },
          { key: "claim", label: "The claim checked, and against what behaviour", hint: "Be specific.", minWords: 8 },
          { key: "fix", label: "The corrected copy", hint: "Matches reality.", minWords: 5 },
        ],
        [
          { label: "A specific claim is checked against real behaviour" },
          { label: "Rewrite matches reality exactly" },
          { label: "Vague/blame-y copy made specific" },
        ],
        "independent"),
      critiqueChallenge("UX4.2", "Adapt", "A set of overclaiming microcopy",
        "Here's a set of AI-drafted microcopy for a basic task-list app. Find every claim that overclaims what the app actually does (it has no AI features, no automation, and no collaboration features yet).",
        "\"Smart Sync: your tasks are automatically organized by our AI for maximum productivity! Collaborate seamlessly with your team in real time.\"",
        [
          { label: "'Smart Sync' / 'organized by our AI' — no AI feature exists in the app", signals: ["no ai feature", "not ai-powered", "doesn't use ai", "no such ai", "false ai claim", "there is no ai"] },
          { label: "'Automatically organized' — nothing automatic happens", signals: ["not automatic", "no automation", "nothing happens automatically", "manual", "doesn't automatically"] },
          { label: "'Maximum productivity' — an unverifiable, overstated benefit claim", signals: ["unverifiable", "overstated", "can't prove", "vague benefit", "puffery", "no evidence for"] },
          { label: "'Collaborate seamlessly in real time' — no collaboration feature exists at all", signals: ["no collaboration", "doesn't exist", "not built", "no real-time", "feature doesn't", "not a real feature"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "UX5", name: "Critique that's specific enough to act on",
    canDo: "Give and get design critique that names the problem and the user impact — not just an opinion.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI feedback on a design said \"the layout feels cluttered, consider simplifying.\" The designer had no idea what to change — which elements, why, for whom. A week was spent guessing.",
        point: "Vague critique costs a whole cycle. Specific critique can be acted on in the next one.",
      },
      explain: {
        paras: [
          "Useful critique names: the **specific element**, the **principle or user impact** it violates (not just taste), and a **testable fix**.",
          "\"Feels cluttered\" → \"the 6 CTAs above the fold compete for attention; a first-time user won't know which to click — reduce to one primary action.\"",
          "Ask AI for critique in that structure, and give it that way yourself.",
          "**Separate taste from usability**: \"I'd prefer blue\" is taste; \"this fails a real user goal\" is usability — flag which is which so a personal preference isn't treated as a user problem.",
        ],
        keyIdea: "Critique = the specific element + the user impact or principle it violates + a testable fix. Separate taste from usability.",
      },
      demonstrate: {
        task: "Decomposing \"feels cluttered\".",
        steps: [
          { move: "Find element 1", think: "What specifically?", result: "6 competing CTAs above the fold → usability: unclear primary action for a first-time user" },
          { move: "Find element 2", think: "Another specific.", result: "inconsistent button styles → principle: reduces learnability across the product" },
          { move: "Find element 3", think: "Another.", result: "dense paragraph text → usability: fails scannability for a skimming user" },
          { move: "Propose fixes", think: "Testable.", result: "reduce to one primary CTA; standardise button styles; break text into scannable chunks" },
        ],
        full: "\"Feels cluttered\" decomposed into 3 specific, named issues, each tied to a user impact or principle, each with a testable fix — not a vague direction to \"simplify\".",
      },
      deconstruct: [
        "Vague feedback wastes a whole design cycle on guessing.",
        "Naming the element + impact + fix makes critique actionable in one pass.",
        "Tagging taste vs. usability stops a personal preference being treated as a real user problem.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You get this AI critique on a form design: \"This could be more user-friendly.\"",
        fields: [
          { key: "missing", label: "What's missing from this critique?", hint: "Be specific.", minWords: 6 },
          { key: "rewrite", label: "How you'd rewrite it to be actionable", hint: "Element + impact + fix.", minWords: 8 },
          { key: "ask", label: "One thing you'd ask the AI to check specifically", hint: "To get better critique next time.", minWords: 5 },
        ],
        model: {
          missing: "No specific element named, no stated user impact, no testable fix — 'user-friendly' could mean anything.",
          rewrite: "\"The 12 required fields with no grouping make the form feel long and error-prone for a first-time user — group into 3 labelled sections (contact, address, payment) and mark only the truly required fields.\"",
          ask: "Ask it to check the form specifically against a stated user goal (e.g. 'complete checkout in under 2 minutes') and flag which elements work against that goal, with a reason.",
        },
      },
    },
    challenges: [
      fieldsChallenge("UX5.1", "Reproduce", "Turn vague feedback into actionable critique",
        "Take a real piece of vague design feedback (AI-given or human-given). Rewrite it as specific, actionable critique: element, impact, fix — and tag taste vs usability.",
        "Strong answer: the rewrite names a specific element; ties it to a real user impact or principle, not just taste; and proposes a testable fix.",
        [
          { key: "vague", label: "The original vague feedback", hint: "Quote it.", minWords: 4 },
          { key: "specific", label: "Rewritten: element + impact + fix", hint: "All three parts.", minWords: 12 },
          { key: "tag", label: "Taste or usability — and why", hint: "Be honest about which.", minWords: 5 },
        ],
        [
          { label: "Names a specific element" },
          { label: "Ties to a real user impact or principle, not just taste" },
          { label: "Proposes a testable fix" },
        ],
        "independent"),
      scenarioChallenge("UX5.2", "Create", "AI critique flags 10 things",
        "AI critique on your design flags 10 separate issues, from minor spacing inconsistencies to a confusing checkout flow.",
        "How do you decide what to act on first?",
        [
          { id: "a", label: "Fix them in the order they were listed", ok: false, why: "List order from the AI carries no information about what actually matters to users." },
          { id: "b", label: "Prioritise by real user impact — the checkout confusion first, spacing last — and check each is usability, not taste, before committing time", ok: true, why: "Impact-ordering plus the taste/usability check is what turns a list of 10 into a real plan." },
          { id: "c", label: "Fix the easiest ones first to show quick progress", ok: false, why: "Easy-first optimises for the appearance of progress, not for what actually helps users." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: UX_COMPETENCIES, capstoneId: "UXCAP" };
};
