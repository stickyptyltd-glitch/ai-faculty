/* AI Faculty — authored curriculum content.
 * Capability-first. This is the "Knowledge" layer for the prototype.
 * Faculty responses (js/faculty.js) draw on this; a model/Control Plane can replace that seam later.
 */
window.CONTENT = (function () {

  const MASTER_CAPABILITY = {
    id: "workflow-designer",
    title: "AI-Assisted Workflow Designer",
    statement:
      "A learner who can reliably design, test, verify and improve AI-assisted workflows for real personal or professional tasks.",
  };

  // Competency levels (0..5) — see docs/03-competency-framework.md
  const LEVELS = [
    { key: "unknown",       label: "Not yet claimed" },
    { key: "emerging",      label: "Understands the idea" },
    { key: "guided",        label: "Can do it with support" },
    { key: "independent",   label: "Can do it independently" },
    { key: "transferable",  label: "Can adapt it to new contexts" },
    { key: "advanced",      label: "Can design better approaches" },
  ];
  const LEVEL_ORDER = LEVELS.map(l => l.key);

  const PATHWAY = [
    "Diagnose", "Mental models", "Working with AI", "Verification",
    "Workflow design", "Iteration", "Application", "Demonstration",
    "Reflection", "Advance",
  ];

  // The seven competencies of the first master capability.
  const COMPETENCIES = [
    {
      id: "C1",
      name: "Goal Definition",
      canDo: "Define the real outcome a workflow needs to achieve.",
      why: "Most AI workflows fail because the goal was vague, not because the AI was weak. A precise goal is what everything else is checked against.",
      teach: [
        "A goal is not a task. \"Write an email\" is a task. \"Get a clear yes/no decision from my manager on the budget by Friday, without a follow-up needed\" is a goal.",
        "A usable goal names four things: the real outcome, how you'll know it worked, the constraints it must respect, and what is explicitly out of scope.",
        "If you can't state how you'd know the workflow succeeded, you can't verify it later — so you can't improve it either.",
        "Write the goal before you involve AI. The goal is yours; the AI works to it.",
      ],
      example: {
        context: "Planning your week (personal track)",
        weak: "\"Use AI to plan my week.\"",
        strong: "\"Produce a realistic plan for next week that protects 3 deep-work blocks, keeps evenings free, fits around 2 fixed appointments, and that I actually follow for 5 days. Out of scope: long-term goals, budgeting.\"",
      },
      practice: {
        brief: "Pick one real task from your own life or work this week. Define it as a goal, not a task, by filling in each field. Be concrete — use real names, real dates, real numbers.",
        fields: [
          { key: "outcome",   label: "The real outcome", hint: "What actually needs to be true when this is done? Not the artefact — the result.", minWords: 8 },
          { key: "success",   label: "How you'll know it worked", hint: "A test you could actually apply. \"It feels good\" is not a test.", minWords: 6 },
          { key: "constraints", label: "Constraints it must respect", hint: "Time, people, tone, budget, format, rules — whatever it must not break.", minWords: 5 },
          { key: "notgoals",  label: "Explicitly out of scope", hint: "Name at least one thing you are NOT trying to solve here.", minWords: 3 },
        ],
      },
      rubric: [
        { key: "outcome",     label: "Outcome is a result, not a task" },
        { key: "success",     label: "Success is stated as a checkable test" },
        { key: "constraints", label: "Real constraints are named" },
        { key: "notgoals",    label: "Scope is bounded (not-goals given)" },
      ],
    },

    { id: "C2", name: "Workflow Structuring", canDo: "Break the outcome into logical steps.",
      why: "A workflow you can see is a workflow you can test and fix. Steps expose where things can go wrong.",
      teach: [
        "List the steps from goal to outcome as if handing them to someone else.",
        "Each step has an input, an action, and an output that the next step can use.",
        "Mark which steps are reversible and which are not — the irreversible ones need the most care.",
      ],
      example: { context: "Drafting a work document", weak: "\"Ask AI to write it.\"",
        strong: "1) gather source facts → 2) draft outline → 3) draft prose → 4) fact-check against sources → 5) tone/format pass → 6) human sign-off." },
      practice: { brief: "Take the goal you defined in C1 and lay out the steps from start to finished outcome.",
        fields: [
          { key: "steps", label: "The steps, in order", hint: "One per line. For each: input → action → output.", minWords: 15 },
          { key: "risky", label: "Which step is riskiest and why", hint: "Where would a mistake do the most damage or be hardest to undo?", minWords: 8 },
        ]},
      rubric: [
        { key: "steps", label: "Steps go from goal to outcome with clear order" },
        { key: "io", label: "Steps have inputs/outputs that connect" },
        { key: "risky", label: "Riskiest step is identified with a reason" },
      ]},

    { id: "C3", name: "AI Role Design", canDo: "Decide where and how AI should be used.",
      why: "AI is not automatically the right tool for every step. Deciding this deliberately is the skill.",
      teach: [
        "For each step, ask: is AI faster/better here, or is it a liability?",
        "Good AI steps: generating options, drafting, summarising, transforming. Risky AI steps: anything where a confident wrong answer is costly and hard to catch.",
        "Decide the AI's role per step: do-it, assist, check, or stay out.",
      ],
      example: { context: "The document workflow", weak: "\"AI does all of it.\"",
        strong: "AI drafts (do-it), AI suggests tone fixes (assist), human fact-checks (AI stays out), human signs off." },
      practice: { brief: "For each step of your C2 workflow, assign the AI a role and justify it.",
        fields: [
          { key: "roles", label: "AI role per step", hint: "step → do-it / assist / check / stay out — and one line of why.", minWords: 15 },
          { key: "danger", label: "Where AI could confidently be wrong", hint: "Which step is most exposed to a plausible-sounding wrong answer?", minWords: 8 },
        ]},
      rubric: [
        { key: "roles", label: "Every step has a deliberate AI role" },
        { key: "just", label: "Roles are justified, not defaulted" },
        { key: "danger", label: "Confident-wrong risk is located" },
      ]},

    { id: "C4", name: "Verification Design", canDo: "Identify what must be checked and how.",
      why: "Verification is what separates a workflow you can trust from one that just looks finished.",
      teach: [
        "For each consequential output, decide the check: fact-check, quality review, test against a case, or human review.",
        "Fact-checking and quality review are different jobs — don't collapse them.",
        "Decide in advance what would make you reject the output.",
      ],
      example: { context: "The document workflow",
        weak: "\"Read it over at the end.\"",
        strong: "Every claim traced to a source; numbers recomputed; tone checked against 2 past approved docs; reject if any claim is unsourced." },
      practice: { brief: "Design the verification for your workflow's most consequential output.",
        fields: [
          { key: "checks", label: "What gets checked, and how", hint: "Output → check method → who/what does it.", minWords: 12 },
          { key: "reject", label: "What would make you reject the output", hint: "Concrete failure conditions, decided now.", minWords: 6 },
        ]},
      rubric: [
        { key: "checks", label: "Checks match the consequences of each output" },
        { key: "kind", label: "Fact-check vs quality review are distinguished" },
        { key: "reject", label: "Rejection conditions are pre-defined" },
      ]},

    { id: "C5", name: "Workflow Testing", canDo: "Test the workflow against realistic cases.",
      why: "A workflow that only works on the easy case isn't done.",
      teach: [
        "Choose 2–3 realistic cases: a normal one, an awkward one, an edge case.",
        "Run the whole workflow on each. Record what actually happened, not what should have.",
        "A failed test is a finding, not a setback.",
      ],
      example: { context: "The week-planning workflow",
        weak: "\"It worked when I tried it once.\"",
        strong: "Tested on a normal week, a week with travel, and a week with a sick day — noted where the plan broke each time." },
      practice: { brief: "Run your workflow on at least two realistic cases and report honestly.",
        fields: [
          { key: "cases", label: "The cases you tested", hint: "Describe each briefly — why is it realistic?", minWords: 10 },
          { key: "results", label: "What actually happened", hint: "Per case: did it hold up? Where did it strain or break?", minWords: 12 },
        ]},
      rubric: [
        { key: "cases", label: "Cases are realistic and varied" },
        { key: "honest", label: "Results describe what happened, incl. failures" },
        { key: "found", label: "At least one concrete weakness surfaced" },
      ]},

    { id: "C6", name: "Workflow Improvement", canDo: "Use evidence to improve performance.",
      why: "Improvement means changing the workflow because of what a test showed — not just tinkering.",
      teach: [
        "Take one weakness from testing. State the change. Predict the effect.",
        "Re-test the same case. Compare before and after.",
        "Keep, revise, or revert — and record why.",
      ],
      example: { context: "The document workflow",
        weak: "\"Made the prompt longer.\"",
        strong: "Test showed unsourced claims slipping through → added a step forcing a source per claim → re-tested → zero unsourced claims; kept the change." },
      practice: { brief: "Improve your workflow based on one testing finding, and show the before/after.",
        fields: [
          { key: "change", label: "The weakness and the change you made", hint: "Weakness → specific change → predicted effect.", minWords: 12 },
          { key: "compare", label: "Before vs after on the same case", hint: "What measurably changed when you re-tested?", minWords: 10 },
        ]},
      rubric: [
        { key: "evidence", label: "Change is driven by a specific finding" },
        { key: "retest", label: "Re-tested on the same case" },
        { key: "decision", label: "Keep/revise/revert decision is recorded with a reason" },
      ]},

    { id: "C7", name: "Responsible Application", canDo: "Recognise limitations, risks and appropriate human oversight.",
      why: "Knowing when not to trust the workflow — and building in the human check — is part of the capability, not an add-on.",
      teach: [
        "State what this workflow should not be used for.",
        "Name the human oversight point and who holds it.",
        "Note what could go wrong at scale or in someone else's hands.",
      ],
      example: { context: "Any workflow",
        weak: "\"It's fine, I checked it.\"",
        strong: "\"Not for legal/medical decisions. Human sign-off before anything is sent. If shared with the team, they must keep the fact-check step.\"" },
      practice: { brief: "Write the responsible-use note for your workflow.",
        fields: [
          { key: "limits", label: "What it should NOT be used for", hint: "Be specific about the boundary.", minWords: 6 },
          { key: "oversight", label: "The human oversight point", hint: "Where a person must review, and who.", minWords: 5 },
          { key: "scale", label: "What could go wrong in wider use", hint: "Handed to someone else, or run 100x.", minWords: 8 },
        ]},
      rubric: [
        { key: "limits", label: "Clear boundary on appropriate use" },
        { key: "oversight", label: "Named human oversight point" },
        { key: "scale", label: "Realistic wider-use risk identified" },
      ]},
  ];

  const DIAGNOSTIC = {
    intro:
      "This is the diagnostic. Don't try to give the \"right\" answers — it exists to find where you actually are. Nothing here is graded.",
    questions: [
      { key: "a", type: "text", label: "A. What would you most like AI to help you accomplish in your real life right now?", hint: "Up to 3 things, most important first." },
      { key: "b", type: "text", label: "B. What would you most like AI to help you accomplish professionally?", hint: "Up to 3." },
      { key: "c", type: "text", label: "C. If this worked extraordinarily well over 12 months, what would you be able to do with AI that you can't reliably do today?", hint: "" },
      { key: "d", type: "select", label: "D. How would you describe your current AI ability?", options: [
        { value: "1", label: "1 — Beginner: straightforward questions/tasks" },
        { value: "2", label: "2 — Developing: reasonably well, often trial and error" },
        { value: "3", label: "3 — Capable: I can structure tasks and get useful results" },
        { value: "4", label: "4 — Advanced: I design workflows and evaluate/improve them" },
        { value: "5", label: "5 — Expert: I design systems and teach others" },
      ]},
      { key: "e", type: "text", label: "E. One real task you recently used AI for.", hint: "What you wanted → what you did → what AI did → what happened." },
      { key: "track", type: "select", label: "Which context should we start in?", options: [
        { value: "personal", label: "Personal — everyday life tasks" },
        { value: "professional", label: "Professional — work tasks" },
        { value: "mixed", label: "Mixed — both" },
      ]},
    ],
  };

  return {
    MASTER_CAPABILITY, LEVELS, LEVEL_ORDER, PATHWAY, COMPETENCIES, DIAGNOSTIC,
    competency: (id) => COMPETENCIES.find(c => c.id === id),
  };
})();
