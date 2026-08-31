/* AI Faculty — authored curriculum content.
 * Capability-first. This is the "Knowledge" layer for the prototype.
 * Faculty responses (js/faculty.js) draw on this; a model/Control Plane can replace that seam later.
 *
 * Each competency carries:
 *   teach[]      — short teaching
 *   example      — weak vs strong
 *   challenges[] — ordered practical challenges up the difficulty ladder
 *                  (Recognise → Explain → Reproduce → Adapt → Create → Transfer → Optimise)
 * Plus CHECKPOINTS — combined practical assessments that span several competencies.
 */
window.CONTENT = (function () {

  const MASTER_CAPABILITY = {
    id: "workflow-designer",
    title: "AI-Assisted Workflow Designer",
    statement:
      "A learner who can reliably design, test, verify and improve AI-assisted workflows for real personal or professional tasks.",
  };

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

  // ---- reusable challenge builders ------------------------------------
  function fieldsChallenge(id, ladder, title, brief, fields, rubric, raises) {
    return { id, ladder, type: "fields", title, brief, fields, rubric, raises };
  }
  function critiqueChallenge(id, ladder, title, brief, material, expected, raises) {
    return {
      id, ladder, type: "critique", title, brief, material, expected, raises,
      ask: { key: "critique", label: "What's wrong here, and how would you fix each problem?", hint: "Work through it point by point.", minWords: 30 },
    };
  }
  function scenarioChallenge(id, ladder, title, brief, question, options, raises) {
    return {
      id, ladder, type: "scenario", title, brief, question, options, raises,
      ask: { key: "justify", label: "Why? Justify your choice.", hint: "One or two sentences of real reasoning.", minWords: 15 },
    };
  }

  // ---- competencies --------------------------------------------------
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
        context: "Planning your week",
        weak: "\"Use AI to plan my week.\"",
        strong: "\"Produce a realistic plan for next week that protects 3 deep-work blocks, keeps evenings free, fits around 2 fixed appointments, and that I actually follow for 5 days. Out of scope: long-term goals, budgeting.\"",
      },
      challenges: [
        fieldsChallenge("C1.1", "Reproduce", "Define a real goal",
          "Pick one real task from your own life or work this week. Define it as a goal, not a task, by filling in each field. Be concrete — real names, real dates, real numbers.",
          [
            { key: "outcome",     label: "The real outcome", hint: "What actually needs to be true when this is done? Not the artefact — the result.", minWords: 8 },
            { key: "success",     label: "How you'll know it worked", hint: "A test you could actually apply. \"It feels good\" is not a test.", minWords: 6 },
            { key: "constraints", label: "Constraints it must respect", hint: "Time, people, tone, budget, format, rules — whatever it must not break.", minWords: 5 },
            { key: "notgoals",    label: "Explicitly out of scope", hint: "Name at least one thing you are NOT trying to solve here.", minWords: 3 },
          ],
          [
            { label: "Outcome is a result, not a task" },
            { label: "Success is stated as a checkable test" },
            { label: "Real constraints are named" },
            { label: "Scope is bounded (not-goals given)" },
          ],
          "independent"),
        critiqueChallenge("C1.2", "Adapt", "Fix a broken goal",
          "A colleague hands you the goal below for an AI-assisted workflow. It is not good enough to build against. Identify every problem and rewrite it properly.",
          "\"Just get the Q3 report done with AI.\"",
          [
            { label: "The outcome is a task (\"done\"), not a result", signals: ["not a result", "not an outcome", "what 'done'", "what \"done\"", "what done means", "real outcome", "result", "decision", "what needs to be true"] },
            { label: "There is no success test", signals: ["how you'd know", "how would you know", "success", "measure", "criteria", "checkable", "know it worked", "acceptance"] },
            { label: "No constraints are given", signals: ["constraint", "deadline", "by when", "audience", "length", "format", "tone", "who is it for"] },
            { label: "No scope boundary / not-goals", signals: ["scope", "out of scope", "not trying", "boundary", "exclude", "not covering"] },
          ],
          "transferable"),
        fieldsChallenge("C1.3", "Transfer", "New domain",
          "Define a goal for a task in a part of your life you have NOT used in this course yet (if you did C1.1 for work, do this one for home, or vice versa).",
          [
            { key: "context",     label: "The task and its context", hint: "One line: what and where.", minWords: 5 },
            { key: "outcome",     label: "The real outcome", hint: "The result, not the artefact.", minWords: 8 },
            { key: "success",     label: "How you'll know it worked", hint: "An applicable test.", minWords: 6 },
            { key: "constraints", label: "Constraints + what's out of scope", hint: "Both, in one field.", minWords: 8 },
          ],
          [
            { label: "A genuinely different context from C1.1" },
            { label: "Outcome is a result with a checkable test" },
            { label: "Constraints and scope are both handled" },
          ],
          "transferable"),
      ],
    },

    {
      id: "C2",
      name: "Workflow Structuring",
      canDo: "Break the outcome into logical steps.",
      why: "A workflow you can see is a workflow you can test and fix. Steps expose where things can go wrong.",
      teach: [
        "List the steps from goal to outcome as if handing them to someone else.",
        "Each step has an input, an action, and an output the next step can use.",
        "Mark which steps are reversible and which are not — the irreversible ones need the most care.",
      ],
      example: {
        context: "Drafting a work document",
        weak: "\"Ask AI to write it.\"",
        strong: "1) gather source facts → 2) draft outline → 3) draft prose → 4) fact-check against sources → 5) tone/format pass → 6) human sign-off.",
      },
      challenges: [
        fieldsChallenge("C2.1", "Reproduce", "Lay out the steps",
          "Take the goal you defined in C1 and lay out the steps from start to finished outcome.",
          [
            { key: "steps", label: "The steps, in order", hint: "One per line. For each: input → action → output.", minWords: 15 },
            { key: "risky", label: "Which step is riskiest and why", hint: "Where would a mistake do the most damage or be hardest to undo?", minWords: 8 },
          ],
          [
            { label: "Steps go from goal to outcome with clear order" },
            { label: "Steps have inputs/outputs that connect" },
            { label: "Riskiest step is identified with a reason" },
          ],
          "independent"),
        critiqueChallenge("C2.2", "Adapt", "Spot the gap",
          "Here is someone's workflow for sending a customer-facing announcement. Find what's missing or in the wrong order, and fix it.",
          "1) Ask AI to write the announcement.  2) Send it to the mailing list.  3) Post it on social media.",
          [
            { label: "No step that checks facts / accuracy before sending", signals: ["fact", "accuracy", "check", "verify", "true", "correct"] },
            { label: "No human review / approval before it goes out", signals: ["review", "approval", "sign-off", "sign off", "human", "someone checks", "proofread"] },
            { label: "Sending is irreversible and comes too early", signals: ["irreversible", "can't undo", "cannot undo", "too early", "before checking", "no going back"] },
            { label: "No step to define the message / audience first", signals: ["audience", "what to say", "key message", "brief", "purpose", "goal first"] },
          ],
          "transferable"),
        fieldsChallenge("C2.3", "Transfer", "Restructure for a new task",
          "Take a different real task and structure it as a workflow — one where at least one step must NOT use AI.",
          [
            { key: "task",  label: "The task", hint: "One line.", minWords: 4 },
            { key: "steps", label: "The steps, in order", hint: "Mark the step(s) that must stay human-only.", minWords: 15 },
            { key: "why",   label: "Why the human-only step can't be AI", hint: "Be specific about the risk or the judgement involved.", minWords: 8 },
          ],
          [
            { label: "Clear ordered steps for a new task" },
            { label: "At least one step is correctly kept human-only" },
            { label: "The reasoning for that is sound" },
          ],
          "transferable"),
      ],
    },

    {
      id: "C3",
      name: "AI Role Design",
      canDo: "Decide where and how AI should be used.",
      why: "AI is not automatically the right tool for every step. Deciding this deliberately is the skill.",
      teach: [
        "For each step, ask: is AI faster/better here, or is it a liability?",
        "Good AI steps: generating options, drafting, summarising, transforming. Risky AI steps: anything where a confident wrong answer is costly and hard to catch.",
        "Decide the AI's role per step: do-it, assist, check, or stay out.",
      ],
      example: {
        context: "The document workflow",
        weak: "\"AI does all of it.\"",
        strong: "AI drafts (do-it), AI suggests tone fixes (assist), human fact-checks (AI stays out), human signs off.",
      },
      challenges: [
        fieldsChallenge("C3.1", "Reproduce", "Assign AI a role per step",
          "For each step of your C2 workflow, assign the AI a role and justify it.",
          [
            { key: "roles",  label: "AI role per step", hint: "step → do-it / assist / check / stay out — and one line of why.", minWords: 15 },
            { key: "danger", label: "Where AI could confidently be wrong", hint: "Which step is most exposed to a plausible-sounding wrong answer?", minWords: 8 },
          ],
          [
            { label: "Every step has a deliberate AI role" },
            { label: "Roles are justified, not defaulted" },
            { label: "Confident-wrong risk is located" },
          ],
          "independent"),
        scenarioChallenge("C3.2", "Create", "Where's the real danger?",
          "A workflow drafts customer refund emails.",
          "Which step is most dangerous to hand to AI with no human check?",
          [
            { id: "a", label: "Deciding whether the customer qualifies for a refund", ok: true,
              feedback: "Right. This is a consequential judgement where a confident wrong answer costs money and trust. AI can assist, but a human must decide." },
            { id: "b", label: "Formatting the email to match the house template", ok: false,
              feedback: "Low stakes and easy to eyeball. Not the dangerous one." },
            { id: "c", label: "Translating the finished email into the customer's language", ok: false,
              feedback: "A real risk, but usually catchable and lower-consequence than getting the refund decision itself wrong." },
          ],
          "transferable"),
      ],
    },

    {
      id: "C4",
      name: "Verification Design",
      canDo: "Identify what must be checked and how.",
      why: "Verification is what separates a workflow you can trust from one that just looks finished.",
      teach: [
        "For each consequential output, decide the check: fact-check, quality review, test against a case, or human review.",
        "Fact-checking and quality review are different jobs — don't collapse them.",
        "Decide in advance what would make you reject the output.",
      ],
      example: {
        context: "The document workflow",
        weak: "\"Read it over at the end.\"",
        strong: "Every claim traced to a source; numbers recomputed; tone checked against 2 past approved docs; reject if any claim is unsourced.",
      },
      challenges: [
        fieldsChallenge("C4.1", "Reproduce", "Design the checks",
          "Design the verification for your workflow's most consequential output.",
          [
            { key: "checks", label: "What gets checked, and how", hint: "Output → check method → who/what does it.", minWords: 12 },
            { key: "reject", label: "What would make you reject the output", hint: "Concrete failure conditions, decided now.", minWords: 6 },
          ],
          [
            { label: "Checks match the consequences of each output" },
            { label: "Fact-check vs quality review are distinguished" },
            { label: "Rejection conditions are pre-defined" },
          ],
          "independent"),
        critiqueChallenge("C4.2", "Adapt", "This verification is theatre",
          "Someone claims their AI workflow is \"fully verified\". Here's their check. Explain why it doesn't actually verify much, and design a real one.",
          "\"After the AI writes it, I ask the AI 'is this correct and accurate?' and it says yes, so I send it.\"",
          [
            { label: "Asking the model to grade itself is not independent verification", signals: ["itself", "self", "same model", "grade its own", "not independent", "circular", "no external"] },
            { label: "No check against an external source of truth", signals: ["source", "external", "reference", "ground truth", "original data", "documents"] },
            { label: "No human judgement in the loop", signals: ["human", "person", "someone", "reviewer"] },
            { label: "No pre-defined reject condition", signals: ["reject", "fail condition", "what would make", "threshold", "criteria to reject"] },
          ],
          "transferable"),
      ],
    },

    {
      id: "C5",
      name: "Workflow Testing",
      canDo: "Test the workflow against realistic cases.",
      why: "A workflow that only works on the easy case isn't done.",
      teach: [
        "Choose 2–3 realistic cases: a normal one, an awkward one, an edge case.",
        "Run the whole workflow on each. Record what actually happened, not what should have.",
        "A failed test is a finding, not a setback.",
      ],
      example: {
        context: "The week-planning workflow",
        weak: "\"It worked when I tried it once.\"",
        strong: "Tested on a normal week, a week with travel, and a week with a sick day — noted where the plan broke each time.",
      },
      challenges: [
        fieldsChallenge("C5.1", "Reproduce", "Run it on real cases",
          "Run your workflow on at least two realistic cases and report honestly.",
          [
            { key: "cases",   label: "The cases you tested", hint: "Describe each briefly — why is it realistic?", minWords: 10 },
            { key: "results", label: "What actually happened", hint: "Per case: did it hold up? Where did it strain or break?", minWords: 12 },
          ],
          [
            { label: "Cases are realistic and varied" },
            { label: "Results describe what happened, incl. failures" },
            { label: "At least one concrete weakness surfaced" },
          ],
          "independent"),
        scenarioChallenge("C5.2", "Create", "Pick the test that matters",
          "You have time to run your workflow on exactly one test case before you rely on it.",
          "Which case tells you the most?",
          [
            { id: "a", label: "The most common, straightforward case", ok: false,
              feedback: "Reassuring, but it's the case least likely to expose a problem. You mostly already know it works here." },
            { id: "b", label: "A realistic awkward case near the edge of what it's meant to handle", ok: true,
              feedback: "Right. The awkward-but-plausible case is where hidden assumptions break, and it's still a case you actually need to handle." },
            { id: "c", label: "An absurd, extreme case it was never meant for", ok: false,
              feedback: "A failure here tells you little — the workflow wasn't scoped for it. Save this for later hardening." },
          ],
          "transferable"),
      ],
    },

    {
      id: "C6",
      name: "Workflow Improvement",
      canDo: "Use evidence to improve performance.",
      why: "Improvement means changing the workflow because of what a test showed — not just tinkering.",
      teach: [
        "Take one weakness from testing. State the change. Predict the effect.",
        "Re-test the same case. Compare before and after.",
        "Keep, revise, or revert — and record why.",
      ],
      example: {
        context: "The document workflow",
        weak: "\"Made the prompt longer.\"",
        strong: "Test showed unsourced claims slipping through → added a step forcing a source per claim → re-tested → zero unsourced claims; kept the change.",
      },
      challenges: [
        fieldsChallenge("C6.1", "Reproduce", "Improve from a finding",
          "Improve your workflow based on one testing finding, and show the before/after.",
          [
            { key: "change",  label: "The weakness and the change you made", hint: "Weakness → specific change → predicted effect.", minWords: 12 },
            { key: "compare", label: "Before vs after on the same case", hint: "What measurably changed when you re-tested?", minWords: 10 },
          ],
          [
            { label: "Change is driven by a specific finding" },
            { label: "Re-tested on the same case" },
            { label: "Keep/revise/revert decision is recorded with a reason" },
          ],
          "independent"),
        scenarioChallenge("C6.2", "Create", "Change or revert?",
          "You changed a step to fix a problem. On re-test the original problem is gone, but a new, smaller problem has appeared.",
          "What's the right move?",
          [
            { id: "a", label: "Keep the change — the original problem was worse", ok: false,
              feedback: "Maybe, but deciding without addressing the new problem just trades one bug for another silently." },
            { id: "b", label: "Revert — any new problem means the change failed", ok: false,
              feedback: "Too rigid. Net improvement is still improvement; you'd be throwing away a real fix." },
            { id: "c", label: "Keep it, but log the new problem as its own finding to fix next", ok: true,
              feedback: "Right. You accept the net gain, make the trade-off explicit, and feed the new problem back into the improvement loop." },
          ],
          "transferable"),
      ],
    },

    {
      id: "C7",
      name: "Responsible Application",
      canDo: "Recognise limitations, risks and appropriate human oversight.",
      why: "Knowing when not to trust the workflow — and building in the human check — is part of the capability, not an add-on.",
      teach: [
        "State what this workflow should not be used for.",
        "Name the human oversight point and who holds it.",
        "Note what could go wrong at scale or in someone else's hands.",
      ],
      example: {
        context: "Any workflow",
        weak: "\"It's fine, I checked it.\"",
        strong: "\"Not for legal/medical decisions. Human sign-off before anything is sent. If shared with the team, they must keep the fact-check step.\"",
      },
      challenges: [
        fieldsChallenge("C7.1", "Reproduce", "Write the responsible-use note",
          "Write the responsible-use note for your workflow.",
          [
            { key: "limits",    label: "What it should NOT be used for", hint: "Be specific about the boundary.", minWords: 6 },
            { key: "oversight", label: "The human oversight point", hint: "Where a person must review, and who.", minWords: 5 },
            { key: "scale",     label: "What could go wrong in wider use", hint: "Handed to someone else, or run 100x.", minWords: 8 },
          ],
          [
            { label: "Clear boundary on appropriate use" },
            { label: "Named human oversight point" },
            { label: "Realistic wider-use risk identified" },
          ],
          "independent"),
        scenarioChallenge("C7.2", "Create", "Should this be shared?",
          "A colleague asks for your workflow so they can use it for their own similar task.",
          "What's the responsible thing to do?",
          [
            { id: "a", label: "Send it — it works for you, it'll work for them", ok: false,
              feedback: "Their task and context differ. The verification and scope you built may not fit, and they won't know what you assumed." },
            { id: "b", label: "Refuse — workflows shouldn't be shared", ok: false,
              feedback: "Over-cautious. Sharing capability is a goal of the institution; it just has to be done responsibly." },
            { id: "c", label: "Share it with its goal, constraints, verification steps and responsible-use note, and check it fits their case", ok: true,
              feedback: "Right. You transfer the whole thing — including the guardrails — and confirm the assumptions still hold for them." },
          ],
          "transferable"),
      ],
    },
  ];

  // ---- checkpoints (combined practical assessments) ------------------
  const CHECKPOINTS = [
    {
      id: "CP1",
      title: "Checkpoint — design a small workflow",
      after: ["C1", "C2", "C3"],
      stage: "Workflow design",
      brief:
        "Combine C1–C3 on one real task you haven't fully worked yet. This is assessed against the mastery rubric, not just for completeness.",
      fields: [
        { key: "goal",  label: "The goal", hint: "Outcome, success test, constraints, out-of-scope.", minWords: 15 },
        { key: "steps", label: "The workflow steps", hint: "Ordered, connected inputs/outputs.", minWords: 15 },
        { key: "roles", label: "AI role per step + the biggest risk", hint: "do-it / assist / check / stay out, and where confident-wrong would hurt most.", minWords: 15 },
      ],
      rubricDims: ["Clarity", "Structure", "Reasoning", "Safety"],
      raisesTo: "transferable",
    },
    {
      id: "CP2",
      title: "Capstone — build, test and improve a real workflow",
      after: ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
      stage: "Demonstration",
      brief:
        "The full loop, end to end, on a real task that matters to you. This is the demonstration of the master capability.",
      fields: [
        { key: "goal",    label: "Goal", hint: "Outcome, success test, constraints, scope.", minWords: 12 },
        { key: "design",  label: "Workflow + AI role per step", hint: "Steps and where AI is used / not used.", minWords: 15 },
        { key: "verify",  label: "Verification design", hint: "Checks per consequential output + reject conditions.", minWords: 12 },
        { key: "test",    label: "Test results", hint: "The cases you ran and what actually happened.", minWords: 12 },
        { key: "improve", label: "One evidence-driven improvement", hint: "Finding → change → before/after.", minWords: 12 },
        { key: "responsible", label: "Responsible-use note", hint: "Limits, oversight point, wider-use risk.", minWords: 10 },
      ],
      rubricDims: ["Clarity", "Structure", "Verification", "Reasoning", "Evidence", "Transfer", "Safety"],
      raisesTo: "advanced",
    },
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

  function competency(id) { return COMPETENCIES.find(c => c.id === id); }
  function challenge(capId, chId) {
    const c = competency(capId);
    return c ? c.challenges.find(ch => ch.id === chId) : null;
  }
  function checkpoint(id) { return CHECKPOINTS.find(cp => cp.id === id); }

  return {
    MASTER_CAPABILITY, LEVELS, LEVEL_ORDER, PATHWAY, COMPETENCIES, CHECKPOINTS, DIAGNOSTIC,
    competency, challenge, checkpoint,
  };
})();
