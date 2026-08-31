/* AI Faculty — authored curriculum content (the "Knowledge" layer).
 *
 * Each competency carries a full LESSON that actually teaches, then CHALLENGES that apply it:
 *
 *   lesson.activate     — a concrete story showing the cost of not having this skill
 *   lesson.explain      — the mental model in plain language + one boxed key idea
 *   lesson.demonstrate  — a worked example, built step by step, with the thinking shown
 *   lesson.deconstruct  — the moves called out, so the learner can reuse them
 *   lesson.guided       — a supported first attempt on a PROVIDED task, with a model answer
 *
 *   challenges[]        — gated practical challenges on the learner's OWN task, up the
 *                         difficulty ladder (Reproduce → Adapt → Transfer …), rubric-assessed
 *
 * Faculty responses (js/faculty.js) draw on this; a model behind the Control Plane can replace
 * that seam later.
 */
window.CONTENT = (function () {

  const MASTER_CAPABILITY = {
    id: "workflow-designer",
    title: "AI-Assisted Workflow Designer",
    statement:
      "Someone who can reliably design, test, verify and improve AI-assisted workflows for real personal or professional tasks.",
  };

  const LEVELS = [
    { key: "unknown",       label: "Not started" },
    { key: "emerging",      label: "Learning it" },
    { key: "guided",        label: "Can do it with support" },
    { key: "independent",   label: "Can do it independently" },
    { key: "transferable",  label: "Can adapt it to new contexts" },
    { key: "advanced",      label: "Can design better approaches" },
  ];
  const LEVEL_ORDER = LEVELS.map(l => l.key);

  const LESSON_STEPS = ["activate", "explain", "demonstrate", "deconstruct", "quickcheck", "guided"];
  const LESSON_STEP_LABELS = {
    activate: "Why it matters", explain: "The idea", demonstrate: "Watch it done",
    deconstruct: "The moves", quickcheck: "Quick check", guided: "Your turn (guided)",
  };
  const LESSON_STEP_ICONS = {
    activate: "⚠️", explain: "💡", demonstrate: "▶️", deconstruct: "🧩", quickcheck: "✅", guided: "✍️",
  };

  const PATHWAY = [
    "Diagnose", "Mental models", "Working with AI", "Verification",
    "Workflow design", "Iteration", "Application", "Demonstration",
    "Reflection", "Advance",
  ];

  // ---- challenge builders -------------------------------------------
  function fieldsChallenge(id, ladder, title, brief, whatGood, fields, rubric, raises) {
    return { id, ladder, type: "fields", title, brief, whatGood, fields, rubric, raises };
  }
  function critiqueChallenge(id, ladder, title, brief, material, expected, raises) {
    return {
      id, ladder, type: "critique", title, brief, material, expected, raises,
      whatGood: "A complete critique names each problem, says why it's a problem, and gives the fix. Aim to catch every issue in the checklist, not just one.",
      ask: { key: "critique", label: "Work through it: what's wrong, why, and how would you fix each one?", hint: "One problem at a time. For each: name it → why it matters → the fix.", minWords: 30 },
    };
  }
  function scenarioChallenge(id, ladder, title, scenario, question, options, raises) {
    return {
      id, ladder, type: "scenario", title, scenario, question, options, raises,
      brief: scenario,
      whatGood: "Pick the option that best fits the reasoning from the lesson, then justify it in your own words — a right pick with no reasoning is only half the answer.",
      ask: { key: "justify", label: "Why is that the right call?", hint: "Two or three sentences of real reasoning — connect it to the idea from the lesson.", minWords: 15 },
    };
  }

  // =================================================================
  //  COMPETENCIES
  // =================================================================
  const COMPETENCIES = [

    // ---- C1 -------------------------------------------------------
    {
      id: "C1",
      name: "Goal Definition",
      canDo: "Turn a vague want into a precise, testable goal before you involve AI.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You tell AI: \"plan my week.\" It hands back a tidy schedule — and books your deep-work block straight over the 3pm school pickup, because it never knew that was fixed. You spend an hour redoing it by hand.",
          point: "The AI wasn't wrong. It worked perfectly toward a goal that was never actually stated.",
        },
        explain: {
          paras: [
            "A **task** is a thing to do (\"write an email\"). A **goal** is the result you actually need (\"get a yes/no from my manager on the budget by Friday, with no follow-up needed\").",
            "AI will happily complete a task. Whether that gets you the result is up to how well you defined the goal.",
            "If you can't say how you'd know the goal was met, you won't be able to check the AI's work later — or improve the workflow when it underperforms.",
          ],
          keyIdea: "A usable goal names four things: the real outcome, how you'll know it worked, the constraints it must respect, and what is explicitly out of scope.",
        },
        demonstrate: {
          task: "Real task: I need to plan next week.",
          steps: [
            { move: "Find the real outcome", think: "Not \"a plan\" — a plan is an artefact. The result I want is a week I actually follow without rebuilding it.", result: "Outcome: a weekly plan I follow Monday–Friday without redoing it." },
            { move: "Make it checkable", think: "How would I know on Friday that it worked? If I stuck to it most days.", result: "Success test: I followed it on at least 4 of 5 days." },
            { move: "Name the constraints", think: "What must the plan not break? Fixed things and hard limits.", result: "Constraints: school pickup 15:00 every day; gym Tue/Thu 18:00; no work after 18:00." },
            { move: "Bound the scope", think: "What am I NOT trying to solve here, so the AI (and I) don't wander?", result: "Out of scope: long-term goals, meal planning." },
          ],
          full: "Outcome: a weekly plan I follow Mon–Fri without redoing it. Success test: stuck to it on ≥4 of 5 days. Constraints: school pickup 15:00 every day; gym Tue/Thu 18:00; no work after 18:00. Out of scope: long-term goals, meal planning.",
        },
        deconstruct: [
          "Each move turned something vague (\"a plan\") into something testable (\"followed ≥4 of 5 days\").",
          "The constraints are specific enough that the AI can't accidentally break them — \"15:00 every day\", not \"afternoons\".",
          "Naming what's out of scope stops the workflow ballooning into meal-prep and life goals.",
        ],
        guided: {
          intro: "Your turn — but on this provided task, not your own yet. Fill each field, then reveal the model answer and compare.",
          task: "Provided task: get your manager to approve a £2,000 training budget.",
          fields: [
            { key: "outcome", label: "The real outcome", hint: "The result you need — not \"send an email\". e.g. \"manager approves the £2,000 in writing\".", minWords: 6 },
            { key: "success", label: "How you'll know it worked", hint: "A test you could actually apply. e.g. \"written approval received by Friday\".", minWords: 5 },
            { key: "constraints", label: "Constraints it must respect", hint: "e.g. \"stay within this quarter's L&D budget line; keep it to one email\".", minWords: 5 },
            { key: "notgoals", label: "Out of scope", hint: "Name one thing you're NOT solving. e.g. \"choosing the specific course\".", minWords: 3 },
          ],
          model: {
            outcome: "My manager approves the £2,000 training spend in writing.",
            success: "I have written approval (email or ticket) by end of Friday, with no open questions.",
            constraints: "Must fit this quarter's L&D budget line; one email, not a meeting; no commitment to a specific vendor yet.",
            notgoals: "Not choosing which course, and not booking travel.",
          },
        },
      },
      challenges: [
        fieldsChallenge("C1.1", "Reproduce", "Define a real goal (your task)",
          "Now do it for real. Pick one task from your own life or work this week and define it as a goal using the same four fields.",
          "A strong answer: the outcome is a result not a task; success is something you could actually check; the constraints are specific (names, times, numbers); and you've named at least one thing that's out of scope.",
          [
            { key: "outcome",     label: "The real outcome", hint: "What must be true when this is done? The result, not the thing you produce.", minWords: 8 },
            { key: "success",     label: "How you'll know it worked", hint: "A test you could apply. \"It feels good\" is not a test.", minWords: 6 },
            { key: "constraints", label: "Constraints it must respect", hint: "Time, people, tone, budget, format, rules — be specific.", minWords: 5 },
            { key: "notgoals",    label: "Explicitly out of scope", hint: "At least one thing you are NOT trying to solve here.", minWords: 3 },
          ],
          [
            { label: "Outcome is a result, not a task" },
            { label: "Success is a checkable test" },
            { label: "Constraints are specific" },
            { label: "Scope is bounded (not-goals given)" },
          ],
          "independent"),
        critiqueChallenge("C1.2", "Adapt", "Fix a broken goal",
          "A colleague hands you this goal for an AI-assisted workflow. It's not good enough to build against. Use the four-part test from the lesson to find every problem and rewrite it.",
          "\"Just get the Q3 report done with AI.\"",
          [
            { label: "The outcome is a task (\"done\"), not a result", signals: ["not a result", "not an outcome", "what 'done'", "what \"done\"", "what done means", "real outcome", "result", "decision", "what needs to be true", "task not"] },
            { label: "There is no success test", signals: ["how you'd know", "how would you know", "success", "measure", "criteria", "checkable", "know it worked", "acceptance", "how to check"] },
            { label: "No constraints are given", signals: ["constraint", "deadline", "by when", "audience", "length", "format", "tone", "who is it for", "template"] },
            { label: "No scope boundary / not-goals", signals: ["scope", "out of scope", "not trying", "boundary", "exclude", "not covering", "not solving"] },
          ],
          "transferable"),
        fieldsChallenge("C1.3", "Transfer", "New context",
          "Define a goal for a task in a part of your life you have NOT used yet in this course. If C1.1 was for work, do this one for home, or vice versa.",
          "Same bar as C1.1 — plus it should be a genuinely different context, showing you can apply the four-part test anywhere.",
          [
            { key: "context",     label: "The task and where it sits", hint: "One line: what, and which part of your life.", minWords: 5 },
            { key: "outcome",     label: "The real outcome", hint: "The result, not the artefact.", minWords: 8 },
            { key: "success",     label: "How you'll know it worked", hint: "An applicable test.", minWords: 6 },
            { key: "constraints", label: "Constraints + what's out of scope", hint: "Both, in one field.", minWords: 8 },
          ],
          [
            { label: "A genuinely different context from C1.1" },
            { label: "Outcome is a result with a checkable test" },
            { label: "Constraints and scope both handled" },
          ],
          "transferable"),
      ],
    },

    // ---- C2 -------------------------------------------------------
    {
      id: "C2",
      name: "Workflow Structuring",
      canDo: "Break a goal into an ordered set of steps you can see, test and fix.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You ask AI to \"write and send the client update\". It writes something reasonable and — because you said \"send\" — you nearly do, before spotting it invented a delivery date. There was no step where anyone checked, because there were no steps at all.",
          point: "With no visible steps, there's nowhere to put a check and nowhere to see what went wrong.",
        },
        explain: {
          paras: [
            "A workflow is the ordered list of steps that gets you from the goal to the outcome — written as if you were handing them to someone else.",
            "Each step has three parts: an **input** (what it needs), an **action** (what happens), and an **output** the next step can use.",
            "Mark which steps are **reversible** and which aren't. \"Send to client\" can't be undone — those steps get the most care and the most checking.",
          ],
          keyIdea: "A workflow is an ordered list of steps, each with an input, an action, and an output the next step uses — with the irreversible steps clearly marked.",
        },
        demonstrate: {
          task: "Goal: send an accurate weekly project update to the client by Thursday.",
          steps: [
            { move: "Step 1 — gather facts", think: "I can't draft anything trustworthy without the raw facts first.", result: "in: last update + this week's notes · action: pull out what changed · out: fact list" },
            { move: "Step 2 — outline", think: "Structure before prose, so I can see if anything's missing.", result: "in: fact list · action: arrange into sections · out: outline" },
            { move: "Step 3 — draft", think: "Now prose — this is a good AI step.", result: "in: outline · action: write it · out: draft" },
            { move: "Step 4 — fact-check", think: "Check the draft against the fact list before anyone sees it.", result: "in: draft + fact list · action: verify every claim · out: checked draft" },
            { move: "Step 5 — tone & format", think: "Match the house style.", result: "in: checked draft · action: tidy tone/format · out: final" },
            { move: "Step 6 — send (irreversible)", think: "Last, and only after 4 and 5.", result: "in: final · action: send to client · out: sent" },
          ],
          full: "1) gather facts → 2) outline → 3) draft → 4) fact-check against the fact list → 5) tone/format pass → 6) send to client (irreversible).",
        },
        deconstruct: [
          "Step 4 (the check) only exists because the steps are visible — in a one-shot \"write and send\" there's nowhere to put it.",
          "Every step's output is the next step's input. No gaps, no \"and then magic happens\".",
          "\"Send\" is last and marked irreversible — that's the signal for where care and checking concentrate.",
        ],
        guided: {
          intro: "Your turn, on this provided task. Lay out the steps, then reveal the model answer.",
          task: "Provided task: plan a birthday dinner for 8 people at a restaurant.",
          fields: [
            { key: "steps", label: "The steps, in order", hint: "One per line. For each: input → action → output. e.g. \"in: 8 names · action: collect dietary needs · out: needs list\".", minWords: 15 },
            { key: "risky", label: "Which step is riskiest, and why", hint: "Where would a mistake cost the most or be hardest to undo? e.g. booking the wrong date.", minWords: 8 },
          ],
          model: {
            steps: "in: guest list · action: collect dates people can do · out: shortlist of dates\nin: shortlist · action: pick date + confirm with everyone · out: locked date\nin: locked date · action: collect dietary needs · out: needs list\nin: needs list · action: shortlist restaurants that fit · out: 3 options\nin: 3 options · action: pick one + book · out: confirmed booking\nin: booking · action: send details to all 8 · out: everyone informed",
            risky: "Booking the restaurant — it usually needs a deposit and the date is hard to change once 8 people have planned around it. That step gets a double-check of date, time and headcount before confirming.",
          },
        },
      },
      challenges: [
        fieldsChallenge("C2.1", "Reproduce", "Structure your workflow",
          "Take the goal you defined in C1 and lay out the steps from start to finished outcome.",
          "Strong answer: the steps run in a sensible order from goal to outcome; each has an input and output that connect to its neighbours; and you've identified the riskiest step with a real reason.",
          [
            { key: "steps", label: "The steps, in order", hint: "One per line: input → action → output.", minWords: 15 },
            { key: "risky", label: "Which step is riskiest and why", hint: "Most damage, or hardest to undo.", minWords: 8 },
          ],
          [
            { label: "Steps run in order from goal to outcome" },
            { label: "Inputs and outputs connect between steps" },
            { label: "Riskiest step identified with a reason" },
          ],
          "independent"),
        critiqueChallenge("C2.2", "Adapt", "Spot the gap",
          "Here is someone's workflow for sending a customer-facing announcement. Using the lesson, find what's missing or in the wrong order, and fix it.",
          "1) Ask AI to write the announcement.  2) Send it to the mailing list.  3) Post it on social media.",
          [
            { label: "No step that checks facts / accuracy before sending", signals: ["fact", "accuracy", "check", "verify", "true", "correct", "review the content"] },
            { label: "No human review / approval before it goes out", signals: ["review", "approval", "sign-off", "sign off", "human", "someone checks", "proofread", "approve"] },
            { label: "Sending is irreversible and comes too early", signals: ["irreversible", "can't undo", "cannot undo", "too early", "before checking", "no going back", "can't take it back"] },
            { label: "No step to decide the message / audience first", signals: ["audience", "what to say", "key message", "brief", "purpose", "goal first", "decide the message"] },
          ],
          "transferable"),
        fieldsChallenge("C2.3", "Transfer", "A workflow with a human-only step",
          "Structure a different real task as a workflow — one where at least one step must NOT use AI.",
          "Strong answer: clear ordered steps for a new task, at least one step correctly kept human-only, and a sound reason why AI can't do that step.",
          [
            { key: "task",  label: "The task", hint: "One line.", minWords: 4 },
            { key: "steps", label: "The steps, in order", hint: "Mark the step(s) that must stay human-only.", minWords: 15 },
            { key: "why",   label: "Why the human-only step can't be AI", hint: "The specific risk or judgement involved.", minWords: 8 },
          ],
          [
            { label: "Clear ordered steps for a new task" },
            { label: "At least one step correctly kept human-only" },
            { label: "The reasoning for that is sound" },
          ],
          "transferable"),
      ],
    },

    // ---- C3 -------------------------------------------------------
    {
      id: "C3",
      name: "AI Role Design",
      canDo: "Give the AI an explicit, justified role on every step — or keep it out.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "Your workflow had AI do everything, including deciding which invoices were overdue. It confidently flagged one that had already been paid. The client got a chasing email for money they didn't owe.",
          point: "AI is genuinely good at some steps and a liability at others. Deciding which — on purpose — is the skill.",
        },
        explain: {
          paras: [
            "For every step, ask one question: is AI faster or better here, or is it a liability?",
            "AI is strong at generating options, drafting, summarising and transforming. It's risky wherever a confident wrong answer is costly and hard to catch — judgements, facts with consequences, anything involving money, safety or people.",
            "Give each step one of four roles: **do-it** (AI performs it), **assist** (AI helps, you decide), **check** (AI reviews your work), **stay out** (humans only).",
          ],
          keyIdea: "Assign every step a role — do-it, assist, check, or stay out — and be able to say why in one sentence.",
        },
        demonstrate: {
          task: "The client-update workflow from C2.",
          steps: [
            { move: "Step 1 gather facts", think: "AI can pull out what changed, but I confirm — it's the basis for everything.", result: "assist" },
            { move: "Step 2 outline", think: "Low risk, saves time.", result: "do-it" },
            { move: "Step 3 draft", think: "This is what AI is best at.", result: "do-it" },
            { move: "Step 4 fact-check", think: "The model can't independently verify its own draft — I check against the fact list.", result: "stay out" },
            { move: "Step 5 tone/format", think: "AI suggests, I approve against house style.", result: "assist" },
            { move: "Step 6 send", think: "Never automated.", result: "stay out" },
          ],
          full: "gather = assist · outline = do-it · draft = do-it · fact-check = stay out (human) · tone = assist · send = stay out. Biggest confident-wrong risk: the draft inventing a fact, which is why step 4 is human and non-negotiable.",
        },
        deconstruct: [
          "The risky steps (fact-check, send) are exactly the ones where a confident wrong answer is costly and hard to catch — so AI stays out.",
          "\"do-it\" is reserved for steps where a mistake is cheap and obvious (an outline, a first draft).",
          "Every role has a one-sentence reason. If you can't give the reason, you haven't decided — you've defaulted.",
        ],
        guided: {
          intro: "Your turn. Assign roles to the steps of this provided workflow, then reveal the model answer.",
          task: "Provided workflow: sift first-round job applications. Steps: 1) parse each CV into a summary  2) score each against the must-have criteria  3) decide who advances to interview  4) write rejection notes to the rest.",
          fields: [
            { key: "roles", label: "AI role for each step (1–4)", hint: "step → do-it / assist / check / stay out, and one line of why.", minWords: 15 },
            { key: "danger", label: "Where is AI most likely to be confidently wrong?", hint: "Which step, and what would the wrong answer cost?", minWords: 8 },
          ],
          model: {
            roles: "1 parse CV → do-it (low risk, easy to eyeball). 2 score against must-haves → assist (AI proposes, human confirms — scoring drives who gets rejected). 3 decide who advances → stay out (a consequential judgement about people). 4 write rejection notes → assist (AI drafts a kind, standard note; human approves each).",
            danger: "Step 2/3 — the AI could confidently misread a CV and score a strong candidate low, and that error is invisible unless a human checks, because the rejected person never appears again.",
          },
        },
      },
      challenges: [
        fieldsChallenge("C3.1", "Reproduce", "Assign roles in your workflow",
          "For each step of your C2 workflow, give the AI a role and a one-line reason.",
          "Strong answer: every step has a deliberate role; the roles are justified, not defaulted; and you've located the step where AI is most likely to be confidently wrong.",
          [
            { key: "roles",  label: "AI role per step", hint: "step → do-it / assist / check / stay out — and why.", minWords: 15 },
            { key: "danger", label: "Where AI could confidently be wrong", hint: "The step most exposed to a plausible-sounding wrong answer.", minWords: 8 },
          ],
          [
            { label: "Every step has a deliberate role" },
            { label: "Roles are justified, not defaulted" },
            { label: "Confident-wrong risk is located" },
          ],
          "independent"),
        scenarioChallenge("C3.2", "Create", "Where's the real danger?",
          "A workflow drafts customer refund emails. It has four steps: decide if the customer qualifies for a refund, calculate the amount, write the email, and format it to the house template.",
          "Which step is most dangerous to hand to AI with no human check?",
          [
            { id: "a", label: "Deciding whether the customer qualifies for a refund", ok: true,
              feedback: "Right. It's a consequential judgement where a confident wrong answer costs money and trust and won't be caught unless a human looks. AI can assist; a human must decide." },
            { id: "b", label: "Formatting the email to the house template", ok: false,
              feedback: "Low stakes and easy to eyeball. Not the dangerous one." },
            { id: "c", label: "Writing the wording of the email", ok: false,
              feedback: "A real drafting task, but a bad sentence is obvious on a read-through. The hidden danger is the decision behind it." },
          ],
          "transferable"),
      ],
    },

    // ---- C4 -------------------------------------------------------
    {
      id: "C4",
      name: "Verification Design",
      canDo: "Choose checks that could actually catch the error, and set reject conditions up front.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "\"Fully verified,\" you said — you'd asked the model \"is this correct?\" and it said yes. The report went out with two figures transposed. The model had no way to know; it was checking its own homework.",
          point: "A check only counts if it could actually catch the mistake. Asking the model to grade itself can't.",
        },
        explain: {
          paras: [
            "For each output that matters, pick a check that could genuinely catch an error: **fact-check** (against a source of truth), **quality review** (is it good?), **test** (run it on a known case), or **human review**.",
            "Fact-checking and quality review are different jobs. A beautifully written paragraph can still be factually wrong.",
            "Decide **now**, before you run it, what would make you reject the output. If you don't, you'll rationalise accepting whatever comes back.",
          ],
          keyIdea: "For each consequential output: a check that could catch the error (not the model checking itself), and a reject condition decided in advance.",
        },
        demonstrate: {
          task: "Output: a financial summary paragraph in the client report.",
          steps: [
            { move: "Name the consequential output", think: "The numbers and the claims — a wrong one here is expensive.", result: "the figures + every factual claim" },
            { move: "Pick the check for the numbers", think: "Recompute from the source data, don't eyeball.", result: "recompute each figure from the source spreadsheet" },
            { move: "Pick the check for the claims", think: "Trace each claim to where it came from.", result: "every claim linked to a source line" },
            { move: "Set the reject condition", think: "Decide the bar now.", result: "reject if any figure doesn't match source, or any claim is unsourced" },
          ],
          full: "Recompute every figure from the source spreadsheet; trace every factual claim to a source line; separately, one read for clarity/tone against 2 past approved reports. Reject if any figure mismatches or any claim is unsourced.",
        },
        deconstruct: [
          "The check is independent of the thing being checked — source data, not the model's opinion.",
          "Numbers and claims get different checks; tone gets a third, separate pass.",
          "The reject condition is concrete and decided before seeing the output, so it can't be argued away.",
        ],
        guided: {
          intro: "Your turn, on this provided workflow. Design the verification, then reveal the model answer.",
          task: "Provided workflow: AI reads a week of customer reviews and produces a one-page \"top 3 themes\" report for the team.",
          fields: [
            { key: "checks", label: "What gets checked, and how", hint: "For the main output: check method → who/what does it. e.g. \"spot-check 5 reviews per theme against the raw text\".", minWords: 12 },
            { key: "reject", label: "What would make you reject it", hint: "Concrete conditions, decided now.", minWords: 6 },
          ],
          model: {
            checks: "For each of the 3 themes: pull the reviews the AI says support it and read 5 of them in the raw text — do they actually say that? Check the counts (\"mentioned by 20 customers\") against a keyword filter on the raw file. Separately, a human reads the page for whether it's actually useful to the team.",
            reject: "Reject if any theme's supporting reviews don't match when spot-checked, if a count is off by more than ~10%, or if a theme is real but too vague to act on.",
          },
        },
      },
      challenges: [
        fieldsChallenge("C4.1", "Reproduce", "Design the checks for your workflow",
          "Design the verification for your workflow's most consequential output.",
          "Strong answer: the check could actually catch the error (it's independent of the AI); fact-checking and quality review are kept separate; and the reject conditions are decided in advance.",
          [
            { key: "checks", label: "What gets checked, and how", hint: "Output → check method → who/what does it.", minWords: 12 },
            { key: "reject", label: "What would make you reject the output", hint: "Concrete failure conditions.", minWords: 6 },
          ],
          [
            { label: "Checks match the consequences and are independent" },
            { label: "Fact-check vs quality review kept separate" },
            { label: "Reject conditions decided in advance" },
          ],
          "independent"),
        critiqueChallenge("C4.2", "Adapt", "This verification is theatre",
          "Someone says their AI workflow is \"fully verified\". Here's their entire check. Using the lesson, explain why it barely verifies anything, and design a real one.",
          "\"After the AI writes it, I ask the AI 'is this correct and accurate?' — it says yes, so I send it.\"",
          [
            { label: "The model grading itself is not independent verification", signals: ["itself", "self", "same model", "grade its own", "not independent", "circular", "no external", "checking its own", "own homework"] },
            { label: "No check against an external source of truth", signals: ["source", "external", "reference", "ground truth", "original data", "documents", "against the"] },
            { label: "No human judgement in the loop", signals: ["human", "person", "someone", "reviewer", "a colleague"] },
            { label: "No reject condition set in advance", signals: ["reject", "fail condition", "what would make", "threshold", "criteria to reject", "bar", "in advance"] },
          ],
          "transferable"),
      ],
    },

    // ---- C5 -------------------------------------------------------
    {
      id: "C5",
      name: "Workflow Testing",
      canDo: "Test on realistic cases — especially the awkward one — and record what actually happened.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "It worked the one time you tried it — on an easy week. The first real week it hit was the one with two days of travel, and the plan fell apart by Tuesday lunchtime.",
          point: "A workflow that only works on the easy case isn't finished. The easy case is the one least likely to expose a problem.",
        },
        explain: {
          paras: [
            "Pick 2–3 realistic cases: a **normal** one, an **awkward** one near the edge of what it should handle, and if useful an **edge** case.",
            "Run the whole workflow on each — end to end, not just the AI step.",
            "Record what **actually** happened, not what should have. A failed test is a finding, not a setback — it's the whole point of testing.",
          ],
          keyIdea: "Run the full workflow on a normal case and an awkward case, and write down what actually happened each time.",
        },
        demonstrate: {
          task: "Testing the week-planning workflow.",
          steps: [
            { move: "Normal case", think: "A standard week, nothing unusual.", result: "Ran fine. Plan held all 5 days." },
            { move: "Awkward case", think: "A week with 2 days of client travel — realistic, and near the edge.", result: "Broke: it scheduled deep work on travel days and didn't account for travel time. Had to redo Mon–Tue." },
            { move: "Edge case", think: "A week with a sick day mid-week.", result: "Partly held: no way to re-flow the plan after a disruption — everything after the sick day was stale." },
          ],
          full: "3 cases run end to end. Normal: held. Travel week: failed — ignored travel time, put deep work on travel days. Sick day: no recovery path, rest of week went stale. Two concrete weaknesses found.",
        },
        deconstruct: [
          "The normal case passing told us almost nothing — the travel week is where the hidden assumption (\"every day is a normal office day\") broke.",
          "The results say what happened (\"scheduled deep work on travel days\"), not a vague \"needs work\".",
          "Each failure is now a specific finding you could hand to C6 and fix.",
        ],
        guided: {
          intro: "Your turn, on this provided workflow. Choose your cases and predict where it strains.",
          task: "Provided workflow: AI drafts replies to incoming customer-support emails; a human approves each before it sends.",
          fields: [
            { key: "cases", label: "The 2–3 cases you'd test", hint: "Normal, awkward, edge — and one line on why each is realistic.", minWords: 10 },
            { key: "results", label: "What you'd expect to happen / watch for", hint: "Per case, where might it strain or break?", minWords: 12 },
          ],
          model: {
            cases: "Normal: a routine \"where's my order?\" question. Awkward: an angry customer demanding a refund and threatening to leave a review. Edge: an email that's actually two unrelated questions in one.",
            results: "Normal: likely fine. Angry customer: watch for the AI matching the customer's heat, over-promising a refund it can't authorise, or sounding robotically calm in a way that reads as dismissive. Two-questions email: watch for it answering only the first and silently dropping the second.",
          },
        },
      },
      challenges: [
        fieldsChallenge("C5.1", "Reproduce", "Test your workflow",
          "Run your workflow on at least two realistic cases and report honestly.",
          "Strong answer: the cases are realistic and varied (not all easy); the results say what actually happened including failures; and at least one concrete weakness came out of it.",
          [
            { key: "cases",   label: "The cases you tested", hint: "Why is each realistic?", minWords: 10 },
            { key: "results", label: "What actually happened", hint: "Per case: did it hold? Where did it strain or break?", minWords: 12 },
          ],
          [
            { label: "Cases are realistic and varied" },
            { label: "Results describe what happened, incl. failures" },
            { label: "At least one concrete weakness surfaced" },
          ],
          "independent"),
        scenarioChallenge("C5.2", "Create", "Pick the test that matters",
          "You have time to run your workflow on exactly one test case before you start relying on it.",
          "Which case tells you the most?",
          [
            { id: "a", label: "The most common, straightforward case", ok: false,
              feedback: "Reassuring, but it's the case least likely to expose a problem — you mostly already know it works here." },
            { id: "b", label: "A realistic awkward case near the edge of what it's meant to handle", ok: true,
              feedback: "Right. The awkward-but-plausible case is where hidden assumptions break, and it's still a case you genuinely need to handle." },
            { id: "c", label: "An absurd, extreme case it was never designed for", ok: false,
              feedback: "A failure here tells you little — it was never scoped for this. Save it for later hardening." },
          ],
          "transferable"),
      ],
    },

    // ---- C6 -------------------------------------------------------
    {
      id: "C6",
      name: "Workflow Improvement",
      canDo: "Change the workflow because a test showed a specific problem, then re-test and compare.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "The test showed unsourced claims slipping through. You \"improved\" the workflow by making the prompt longer and more insistent. Next test: same failure.",
          point: "Improvement isn't tinkering with wording. It's a specific change aimed at a specific finding, then checked.",
        },
        explain: {
          paras: [
            "Take **one** weakness from testing. State the change you'll make. Predict what effect it should have.",
            "Re-test the **same case** you originally failed. Compare before and after — concretely.",
            "Then decide: **keep** the change, **revise** it, or **revert** it — and record why.",
          ],
          keyIdea: "One finding → one specific change → re-test the same case → keep / revise / revert, with the reason written down.",
        },
        demonstrate: {
          task: "Finding from C5: the report workflow let unsourced claims through.",
          steps: [
            { move: "Name the change", think: "Not \"better prompt\" — a structural change.", result: "add a step: every claim must be tagged with its source line before the draft is accepted" },
            { move: "Predict the effect", think: "What should happen if this works?", result: "unsourced claims can't reach the final draft; drafting is a little slower" },
            { move: "Re-test the same case", think: "The exact report that failed before.", result: "re-ran: 0 unsourced claims (was 3); drafting +4 minutes" },
            { move: "Decide", think: "Net effect is clearly positive.", result: "keep it; the time cost is worth eliminating the error" },
          ],
          full: "Finding: 3 unsourced claims. Change: mandatory source tag per claim before draft acceptance. Predicted: no unsourced claims reach final. Re-test (same report): 0 unsourced (was 3), +4 min. Decision: keep — the trade is worth it.",
        },
        deconstruct: [
          "The change is structural (a new step), not cosmetic (nicer wording) — that's why it actually worked.",
          "Re-testing the *same* case is what makes before/after a real comparison.",
          "The keep decision names the trade-off (slower vs correct) instead of pretending there isn't one.",
        ],
        guided: {
          intro: "Your turn. Improve this workflow from a given finding, then reveal the model answer.",
          task: "Provided finding: your support-email workflow sometimes replies in a too-calm, dismissive-sounding tone to angry customers.",
          fields: [
            { key: "change", label: "The change you'd make", hint: "Weakness → specific change → predicted effect.", minWords: 12 },
            { key: "compare", label: "How you'd check it worked", hint: "What would you re-test, and what would 'better' look like?", minWords: 10 },
          ],
          model: {
            change: "Add a step before drafting: classify the incoming email's emotional tone (calm / frustrated / angry). For frustrated/angry, switch to a template that leads with explicit acknowledgement (\"I can see how frustrating this is\") and a clear next action, and route the draft to a human before sending, always. Predicted effect: angry customers get replies that acknowledge the problem instead of sounding like a form letter.",
            compare: "Re-run the exact angry-customer test email from C5. 'Better' = the reply opens by acknowledging the specific problem, commits to a concrete next step, and a reviewer agrees it wouldn't inflame the situation. Compare side by side with the old reply.",
          },
        },
      },
      challenges: [
        fieldsChallenge("C6.1", "Reproduce", "Improve your workflow",
          "Improve your workflow based on one finding from your C5 testing, and show the before/after.",
          "Strong answer: the change is driven by a specific finding (not general tinkering); you re-tested the same case; and you recorded a keep/revise/revert decision with a reason.",
          [
            { key: "change",  label: "The weakness and the change you made", hint: "Weakness → specific change → predicted effect.", minWords: 12 },
            { key: "compare", label: "Before vs after on the same case", hint: "What measurably changed when you re-tested?", minWords: 10 },
          ],
          [
            { label: "Change is driven by a specific finding" },
            { label: "Re-tested on the same case" },
            { label: "Keep/revise/revert decision recorded with a reason" },
          ],
          "independent"),
        scenarioChallenge("C6.2", "Create", "Change or revert?",
          "You changed a step to fix a problem. On re-test the original problem is gone — but a new, smaller problem has appeared.",
          "What's the right move?",
          [
            { id: "a", label: "Keep the change — the original problem was worse", ok: false,
              feedback: "Maybe true, but deciding without addressing the new problem just swaps one bug for another quietly." },
            { id: "b", label: "Revert — any new problem means the change failed", ok: false,
              feedback: "Too rigid. A net improvement is still an improvement; you'd be throwing away a real fix." },
            { id: "c", label: "Keep it, but log the new problem as its own finding to fix next", ok: true,
              feedback: "Right. You take the net gain, make the trade-off explicit, and feed the new problem back into the same improvement loop." },
          ],
          "transferable"),
      ],
    },

    // ---- C7 -------------------------------------------------------
    {
      id: "C7",
      name: "Responsible Application",
      canDo: "Write the boundary, the human check and the wider-use risk before someone finds them the hard way.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You shared your handy summarising workflow with a colleague. They used it to draft a legal letter to a customer. It was never built for that, and nobody had written down that it wasn't.",
          point: "A workflow that works for you can fail badly in another context or another person's hands. Saying so is part of building it.",
        },
        explain: {
          paras: [
            "State clearly what this workflow should **not** be used for — the boundary.",
            "Name the **human oversight point**: where a person must review, and who that is.",
            "Note what could go wrong **at scale** or **in someone else's hands** — run 100 times, or used by a colleague who doesn't know your assumptions.",
          ],
          keyIdea: "Every workflow ships with a short note: what it's not for, where the human check is, and how it could fail in wider use.",
        },
        demonstrate: {
          task: "Responsible-use note for the client-report workflow.",
          steps: [
            { move: "The boundary", think: "Where would this be dangerous?", result: "Not for anything legal, financial-advice, or HR. Internal/client status updates only." },
            { move: "The human check", think: "Who signs off, and where?", result: "The account lead reads and approves step 5 output before step 6 (send). No exceptions." },
            { move: "Wider-use risk", think: "What breaks if it spreads?", result: "If a colleague uses it without the fact-check step, unsourced claims go out. The note and the steps travel together." },
          ],
          full: "Not for legal, financial-advice or HR communications — internal and client status updates only. Human check: account lead approves before send, every time. Wider-use risk: the fact-check step is the safety-critical one; anyone reusing this must keep it, so the workflow is only ever shared with its steps and this note attached.",
        },
        deconstruct: [
          "The boundary is specific (\"legal, financial-advice, HR\"), not a vague \"use sensibly\".",
          "The human check names a role and a point in the workflow, so it can't quietly be skipped.",
          "The wider-use risk identifies the one step that must never be dropped — the thing you'd most want a new user to know.",
        ],
        guided: {
          intro: "Your turn. Write the responsible-use note for this provided workflow.",
          task: "Provided workflow: AI drafts daily social-media posts for a small business; the owner picks one and posts it.",
          fields: [
            { key: "limits", label: "What it should NOT be used for", hint: "Be specific about the boundary.", minWords: 6 },
            { key: "oversight", label: "The human oversight point", hint: "Where a person must review, and who.", minWords: 5 },
            { key: "scale", label: "What could go wrong in wider use", hint: "Handed to a new social media manager, or set to auto-post.", minWords: 8 },
          ],
          model: {
            limits: "Not for responding to complaints, crises, or anything about pricing, legal or safety claims. Everyday promotional and community posts only.",
            oversight: "The owner reads and approves every post before it goes out — the AI never posts directly.",
            scale: "If a new manager takes over and trusts it more, off-brand or tone-deaf posts could go out during a sensitive news moment; if it's ever set to auto-post, there's no one to catch a bad one. The note must say: always human-approved, never during a crisis.",
          },
        },
      },
      challenges: [
        fieldsChallenge("C7.1", "Reproduce", "Write your responsible-use note",
          "Write the responsible-use note for your own workflow.",
          "Strong answer: a specific boundary on use; a named human oversight point tied to a step; and a realistic risk for wider or larger-scale use.",
          [
            { key: "limits",    label: "What it should NOT be used for", hint: "Be specific.", minWords: 6 },
            { key: "oversight", label: "The human oversight point", hint: "Where, and who.", minWords: 5 },
            { key: "scale",     label: "What could go wrong in wider use", hint: "Someone else's hands, or 100x the volume.", minWords: 8 },
          ],
          [
            { label: "Specific boundary on appropriate use" },
            { label: "Named human oversight point tied to a step" },
            { label: "Realistic wider-use risk identified" },
          ],
          "independent"),
        scenarioChallenge("C7.2", "Create", "Should this be shared?",
          "A colleague asks for your workflow so they can use it for their own, similar task.",
          "What's the responsible thing to do?",
          [
            { id: "a", label: "Send it over — it works for you, it'll work for them", ok: false,
              feedback: "Their task and context differ. The verification and scope you built may not fit, and they won't know what you assumed." },
            { id: "b", label: "Don't share it — workflows shouldn't be passed around", ok: false,
              feedback: "Over-cautious. Sharing capability is a goal; it just has to carry its guardrails." },
            { id: "c", label: "Share it with its goal, constraints, verification steps and responsible-use note, and check it fits their case first", ok: true,
              feedback: "Right. You transfer the whole thing — including the guardrails — and confirm the assumptions still hold for them." },
          ],
          "transferable"),
      ],
    },
  ];

  // ---- checkpoints -------------------------------------------------
  const CHECKPOINTS = [
    {
      id: "CP1",
      title: "Checkpoint — design a small workflow",
      after: ["C1", "C2", "C3"],
      stage: "Workflow design",
      brief:
        "Put C1–C3 together on one real task you haven't fully worked yet: define the goal, structure the steps, assign the AI a role on each. Assessed against the mastery rubric, not just for completeness.",
      whatGood:
        "A goal with all four parts; steps that connect input→output in a sensible order; a deliberate, justified AI role on every step; and the riskiest step named.",
      fields: [
        { key: "goal",  label: "The goal (all four parts)", hint: "Outcome · success test · constraints · out-of-scope.", minWords: 15 },
        { key: "steps", label: "The workflow steps", hint: "Ordered, each with input → action → output.", minWords: 15 },
        { key: "roles", label: "AI role per step + the biggest risk", hint: "do-it / assist / check / stay out per step, and where confident-wrong would hurt most.", minWords: 15 },
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
        "The whole capability, end to end, on a real task that matters to you. This is the demonstration of AI-Assisted Workflow Designer.",
      whatGood:
        "Each section stands on its own and they connect: the verification matches the risks in your design; the tests are real and at least one found something; the improvement is driven by a test finding; the responsible-use note is specific.",
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

  // =================================================================
  //  QUICK CHECKS  — 2 multiple-choice questions per competency,
  //  shown as the "Quick check" lesson step. Instant feedback, not gated.
  // =================================================================
  const QUICK_CHECKS = {
    C1: [
      { q: "Which of these is a goal, not a task?", options: [
        { label: "\"Write a follow-up email to the client.\"", ok: false, why: "That's a task — a thing to produce. It doesn't say what result you need." },
        { label: "\"Get the client to confirm the delivery date in writing by Friday.\"", ok: true, why: "It names the result, a deadline, and how you'd know it happened." },
        { label: "\"Use AI to help with client comms.\"", ok: false, why: "Far too broad — no outcome, no test, no constraints." },
      ]},
      { q: "You can't state how you'd know a workflow succeeded. What's the real cost later?", options: [
        { label: "The AI will refuse to run it", ok: false, why: "It'll run fine — that's the problem." },
        { label: "You can't verify the output or improve the workflow", ok: true, why: "With no success test there's nothing to check against and nothing to measure an improvement." },
        { label: "It just takes a bit longer", ok: false, why: "It's not a speed issue — it's that you can't tell whether it worked." },
      ]},
    ],
    C2: [
      { q: "Why write the workflow as visible, ordered steps?", options: [
        { label: "It looks more professional", ok: false, why: "Not the point." },
        { label: "So there's somewhere to put checks and somewhere to see what went wrong", ok: true, why: "A one-shot 'do it all' has no place to insert verification or diagnose a failure." },
        { label: "The AI needs numbered lists", ok: false, why: "It's for you, not the model." },
      ]},
      { q: "Which step deserves the most care?", options: [
        { label: "The first step", ok: false, why: "Not inherently — depends what it does." },
        { label: "The irreversible one (e.g. 'send to client')", ok: true, why: "You can't undo it, so it gets the most checking and comes last." },
        { label: "The longest step", ok: false, why: "Length isn't risk." },
      ]},
    ],
    C3: [
      { q: "Where is AI most of a liability?", options: [
        { label: "Drafting a first version of some text", ok: false, why: "Low stakes, easy to fix — a good AI step." },
        { label: "A consequential judgement where a confident wrong answer is costly and hard to catch", ok: true, why: "That's exactly the danger zone — decisions about money, people, safety, facts with consequences." },
        { label: "Summarising a long document", ok: false, why: "Usually fine, and easy to spot-check." },
      ]},
      { q: "You've given a step the role 'do-it' but can't say why. What does that tell you?", options: [
        { label: "It's fine — do-it is the default", ok: false, why: "There is no safe default; every step needs a reason." },
        { label: "You haven't decided — you've defaulted", ok: true, why: "If you can't give the one-sentence reason, the role wasn't a decision." },
        { label: "The step should be removed", ok: false, why: "Not necessarily — it just needs a considered role." },
      ]},
    ],
    C4: [
      { q: "Why doesn't 'I asked the model if it was correct and it said yes' count as verification?", options: [
        { label: "The model is too slow to check properly", ok: false, why: "Speed isn't the issue." },
        { label: "It's checking its own work — not independent of what's being checked", ok: true, why: "A real check is independent: a source of truth, a test, or a human." },
        { label: "Models aren't allowed to self-assess", ok: false, why: "They can respond — it just isn't meaningful verification." },
      ]},
      { q: "When should you decide what would make you reject the output?", options: [
        { label: "After you see the output", ok: false, why: "Then you'll rationalise accepting whatever came back." },
        { label: "Before you run the workflow", ok: true, why: "Pre-committing to a reject condition keeps the bar honest." },
        { label: "Only if it looks wrong", ok: false, why: "The dangerous errors are the ones that look right." },
      ]},
    ],
    C5: [
      { q: "You have time for one test. Which case teaches you the most?", options: [
        { label: "The most common, straightforward case", ok: false, why: "Least likely to expose a problem — you mostly know it works." },
        { label: "A realistic awkward case near the edge of what it should handle", ok: true, why: "That's where hidden assumptions break, and you still need to handle it." },
        { label: "An absurd case it was never built for", ok: false, why: "A failure there tells you little." },
      ]},
      { q: "A test fails. What is that?", options: [
        { label: "A setback — the workflow is broken", ok: false, why: "It's not a setback." },
        { label: "A finding — exactly what testing is for", ok: true, why: "You now have a specific problem you can fix in C6." },
        { label: "A sign to stop testing", ok: false, why: "The opposite." },
      ]},
    ],
    C6: [
      { q: "What makes a change an 'improvement' rather than tinkering?", options: [
        { label: "It makes the prompt longer and more forceful", ok: false, why: "That's tinkering with wording." },
        { label: "It targets a specific finding, and you re-test the same case to compare", ok: true, why: "Specific cause, specific change, measured effect." },
        { label: "It feels better when you read it", ok: false, why: "Not measurable." },
      ]},
      { q: "Your fix removes the original problem but introduces a smaller new one. Best move?", options: [
        { label: "Revert — any new problem means it failed", ok: false, why: "Too rigid; you'd lose a real fix." },
        { label: "Keep it silently — the original was worse", ok: false, why: "You've hidden a trade-off." },
        { label: "Keep it, and log the new problem as its own finding to fix next", ok: true, why: "Take the net gain, make the trade-off explicit, feed it back into the loop." },
      ]},
    ],
    C7: [
      { q: "What belongs in a responsible-use note?", options: [
        { label: "A disclaimer that says 'use sensibly'", ok: false, why: "Too vague to act on." },
        { label: "What it's NOT for, the human oversight point, and the wider-use risk", ok: true, why: "Specific boundary, named check, realistic failure in other hands." },
        { label: "The prompt you used", ok: false, why: "Useful, but not the responsible-use note." },
      ]},
      { q: "A colleague wants your workflow for their similar task. Best response?", options: [
        { label: "Send it over — it works for you", ok: false, why: "Their context differs and they won't know your assumptions." },
        { label: "Refuse — workflows shouldn't be shared", ok: false, why: "Sharing capability is a goal; it just needs its guardrails." },
        { label: "Share it with its goal, constraints, verification steps and note — and check it fits their case", ok: true, why: "Transfer the whole thing, guardrails included." },
      ]},
    ],

    // ---- Software pathway ----
    S1: [
      { q: "Which is a buildable spec?", options: [
        { label: "\"Make the login better.\"", ok: false, why: "No problem stated, nothing testable, no boundary." },
        { label: "\"Cut password-reset support tickets: reset rate down over 2 weeks, existing login still works, no SSO/2FA changes, ship behind a flag.\"", ok: true, why: "User problem, measurable acceptance, out-of-scope, constraints." },
        { label: "\"Add a magic-link login flow.\"", ok: false, why: "That's a solution, not the problem — maybe not even the right one." },
      ]},
      { q: "What does 'out of scope' do in a spec?", options: [
        { label: "Nothing much — it's optional", ok: false, why: "It's one of the four load-bearing parts." },
        { label: "Stops scope creep and sets a shared boundary before work starts", ok: true, why: "It's the cheapest disagreement to have early." },
        { label: "Tells the AI what to build", ok: false, why: "It tells everyone what NOT to build." },
      ]},
    ],
    S2: [
      { q: "You want AI to add rate limiting. What gives you code you can trust?", options: [
        { label: "\"Add rate limiting to my API.\"", ok: false, why: "No context — you'll get generic code against assumptions." },
        { label: "The router file + \"we use Redis, no new deps\" + the acceptance criteria + \"give me a diff and a test\"", ok: true, why: "Real code, constraints, target, reviewable output." },
        { label: "\"Add rate limiting. Make it production-ready and secure.\"", ok: false, why: "Adjectives aren't context." },
      ]},
      { q: "Why ask for a diff and small steps instead of a full rewrite?", options: [
        { label: "It's faster to generate", ok: false, why: "Not the reason." },
        { label: "So you can actually review it", ok: true, why: "A wall of new code is unreviewable; small diffs you can check." },
        { label: "The model prefers it", ok: false, why: "It's for your review, not the model." },
      ]},
    ],
    S3: [
      { q: "AI code 'looks idiomatic and passes review'. Why is that a trap?", options: [
        { label: "It never is idiomatic", ok: false, why: "It often is — fluently so." },
        { label: "It's confident and fluent, so 'looks right' hides invented APIs, swallowed errors and missed edges", ok: true, why: "Its failure modes are different from a human's; you have to check them on purpose." },
        { label: "Reviewers are lazy", ok: false, why: "Not the point being made." },
      ]},
      { q: "Which is a distinctively AI-code failure to check for?", options: [
        { label: "Inconsistent indentation", ok: false, why: "A formatter catches that; not the risk." },
        { label: "A call to a method or parameter that doesn't exist in your version of the library", ok: true, why: "Hallucinated APIs are classic — plausible name, not real." },
        { label: "Slightly verbose variable names", ok: false, why: "Cosmetic." },
      ]},
    ],
    S4: [
      { q: "AI wrote 12 tests, all green, 90% coverage. What's missing?", options: [
        { label: "Nothing — that's a good result", ok: false, why: "Coverage and green say nothing about whether the right behaviour is proven." },
        { label: "A test that would have failed on the old, broken code", ok: true, why: "If no test fails against the bug you fixed, the tests don't prove the fix." },
        { label: "More tests", ok: false, why: "Quantity isn't the gap." },
      ]},
      { q: "A test asserts on internal implementation details rather than behaviour. Problem?", options: [
        { label: "No — more assertions is better", ok: false, why: "It'll break on safe refactors and still miss behaviour regressions." },
        { label: "Yes — it's brittle and doesn't protect the behaviour from the spec", ok: true, why: "Tests should pin the behaviour the acceptance criteria describe." },
        { label: "Only if it's slow", ok: false, why: "Speed isn't the issue." },
      ]},
    ],
  };

  // =================================================================
  //  WORK PATHWAYS  — profession-specific tracks after the foundation.
  //  See docs/09-work-pathways.md.
  // =================================================================
  const SOFTWARE_COMPETENCIES = [
    {
      id: "S1", name: "Ask → Spec",
      canDo: "Turn \"can you just add X\" into a spec you could build and verify against.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "The PM said \"make the login better\". You built a slick magic-link flow. Turns out they meant \"stop the flood of password-reset tickets\" — and magic links didn't touch that. Two days of rework.",
          point: "You built the right solution to the wrong problem, because the ask was never turned into a spec.",
        },
        explain: {
          paras: [
            "This is C1 (Goal Definition) aimed at a build. A vague ask isn't a spec — it's the start of a conversation.",
            "A buildable spec names four things: the **user problem** (why does this matter, to whom), the **acceptance criteria** (what must be true and how you'd test it), what's **out of scope**, and the **constraints** (tech, patterns, time).",
            "The solution isn't in the spec. \"Add a magic link\" is a solution — and maybe the wrong one. The spec describes the problem and the finish line.",
          ],
          keyIdea: "Buildable spec = user problem + testable acceptance criteria + out-of-scope + constraints. The solution comes after.",
        },
        demonstrate: {
          task: "The ask: \"make the login better.\"",
          steps: [
            { move: "Get the real problem", think: "\"Better\" how? I ask.", result: "Problem: too many password-reset support tickets; users locked out and churning." },
            { move: "Write testable acceptance", think: "What must be true, measurably?", result: "Acceptance: password-reset rate drops over 2 weeks; existing email+password login still works for all current users." },
            { move: "Bound the scope", think: "What am I not doing?", result: "Out of scope: SSO, 2FA changes, UI redesign." },
            { move: "Name the constraints", think: "What must it fit?", result: "Constraints: use the existing email provider; ship behind a feature flag; no new auth library." },
          ],
          full: "Problem: password-reset tickets are high and users churn when locked out. Acceptance: reset rate down over 2 weeks; current login unaffected. Out of scope: SSO, 2FA, UI redesign. Constraints: existing email provider, feature flag, no new auth lib.",
        },
        deconstruct: [
          "The acceptance criteria are measurable (\"reset rate down over 2 weeks\") — you can tell if it worked.",
          "\"Existing login still works\" is an acceptance criterion too — the thing you must not break.",
          "Constraints (\"no new auth lib\", \"behind a flag\") are what make it shippable, not just buildable.",
        ],
        guided: {
          intro: "Your turn, on this provided ask. Then reveal the model answer.",
          task: "An internal user says: \"the dashboard is slow, can AI fix it?\"",
          fields: [
            { key: "problem", label: "The user problem", hint: "Who's affected, and what's the actual pain? e.g. \"analysts wait 8s per filter, so they batch work and miss deadlines\".", minWords: 8 },
            { key: "acceptance", label: "Testable acceptance criteria", hint: "e.g. \"filter response under 1s at p95 on the standard dataset; existing exports unchanged\".", minWords: 8 },
            { key: "scope", label: "Out of scope", hint: "e.g. \"redesigning the dashboard; adding new charts\".", minWords: 4 },
            { key: "constraints", label: "Constraints", hint: "e.g. \"no schema changes this sprint; must work on the current DB\".", minWords: 5 },
          ],
          model: {
            problem: "Analysts wait ~8s every time they change a filter, so they avoid exploring the data and lean on stale saved views — decisions get made on old numbers.",
            acceptance: "Filter-to-render under 1s at p95 on the standard 90-day dataset; all existing saved views and exports return identical results.",
            scope: "Not redesigning the dashboard, not adding new metrics, not touching mobile.",
            constraints: "No schema migrations this sprint; must run on the current Postgres instance; changes behind a flag with a fast rollback.",
          },
        },
      },
      challenges: [
        fieldsChallenge("S1.1", "Reproduce", "Spec a real ask from your work",
          "Take a real, vague request you've been given (or would plausibly get) and turn it into a spec with the four parts.",
          "Strong answer: a real user problem (not a restated solution); acceptance criteria you could actually test; a scope boundary; and constraints that make it shippable.",
          [
            { key: "problem", label: "The user problem", hint: "Who, and what pain — not the feature.", minWords: 8 },
            { key: "acceptance", label: "Testable acceptance criteria", hint: "How you'd prove it's done. Include what must not break.", minWords: 8 },
            { key: "scope", label: "Out of scope", hint: "At least two things.", minWords: 4 },
            { key: "constraints", label: "Constraints", hint: "Tech, patterns, time, rollout.", minWords: 5 },
          ],
          [
            { label: "Problem is a real user problem, not a solution" },
            { label: "Acceptance criteria are testable" },
            { label: "Scope boundary is set" },
            { label: "Constraints make it shippable" },
          ],
          "independent"),
        critiqueChallenge("S1.2", "Adapt", "Fix a bad ticket",
          "Here's a ticket as written. Using the four-part spec, find what's missing and rewrite it so a developer (or an AI) could build and verify against it.",
          "Title: \"Improve search.\"  Body: \"Search is bad, users complain. Make it use AI. Should be fast and accurate.\"",
          [
            { label: "No stated user problem — 'bad' and 'complain' aren't specific", signals: ["what problem", "user problem", "what's actually", "which users", "what do they", "specific", "vague problem", "no problem"] },
            { label: "No testable acceptance criteria", signals: ["acceptance", "how to test", "measurable", "how would you know", "criteria", "testable", "define fast", "define accurate", "what does fast"] },
            { label: "'Make it use AI' is a solution, not a requirement", signals: ["solution not", "prescribes a solution", "not a requirement", "jumps to", "premature solution", "why ai", "solution rather"] },
            { label: "No scope boundary or constraints", signals: ["scope", "out of scope", "constraint", "boundary", "what's not", "no constraints"] },
          ],
          "transferable"),
      ],
    },

    {
      id: "S2", name: "Driving AI to write trustworthy code",
      canDo: "Give AI the context and constraints to return small, reviewable changes — not a wall of code.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You typed \"add caching\" into the chat. It gave you 200 lines using a library you don't have, referencing a `config/cache.yml` that doesn't exist in your repo. Twenty minutes gone untangling it.",
          point: "Garbage context in, plausible garbage out. The model filled the gaps with assumptions.",
        },
        explain: {
          paras: [
            "Give the model what a competent contractor would need: the **spec / acceptance criteria**, the **actual code** it will touch plus your conventions, and the **constraints** (which libraries, which patterns, no new deps).",
            "Ask for the change as a **diff or small steps**, not a rewrite — so you can review it.",
            "Ask it to **explain the risky parts** (\"walk me through the window-reset logic\"). That surfaces bugs before they land.",
            "Work in small loops: one change, review, next.",
          ],
          keyIdea: "Real code + constraints + acceptance criteria in → small reviewable diff out → make it explain the risky bit.",
        },
        demonstrate: {
          task: "Add rate limiting to the API.",
          steps: [
            { move: "Give real context", think: "Paste the actual router file, not a description.", result: "router.js + \"we use Redis (ioredis), no new deps\" + acceptance: 100 req/min/IP, 429 over limit" },
            { move: "Ask for a reviewable change", think: "Diff, plus a test.", result: "\"Give me this as a diff against router.js and a test file.\"" },
            { move: "Review the diff", think: "Read it like a PR.", result: "spotted: window never resets on the happy path" },
            { move: "Make it explain the risk", think: "The bit I'm unsure about.", result: "\"Walk me through the window reset\" → confirms the bug → asks for the fix" },
          ],
          full: "Context: real router.js + \"Redis via ioredis, no new deps\" + acceptance (100/min/IP → 429). Asked for a diff + test. Reviewed it, found the window-reset bug, had it explain and fix that part, then accepted.",
        },
        deconstruct: [
          "Pasting the real file beats describing it — the model stops guessing your structure.",
          "\"Give me a diff\" keeps the change small enough to actually review.",
          "\"Explain the risky part\" is where the reset bug surfaced — it wouldn't have from just reading fluent code.",
        ],
        guided: {
          intro: "Your turn. Then reveal the model answer.",
          task: "You need to add input validation to a signup form. Your codebase already uses zod for schemas.",
          fields: [
            { key: "context", label: "What context would you give the model?", hint: "Files, conventions, constraints.", minWords: 8 },
            { key: "ask", label: "What would you ask it to produce?", hint: "Format and scope of the output.", minWords: 6 },
            { key: "check", label: "What would you review first?", hint: "The most likely place it goes wrong.", minWords: 6 },
          ],
          model: {
            context: "The signup handler file, an existing zod schema from a nearby form as the pattern to follow, and: \"use zod, match this style, no new deps, return field-level errors like the existing one\".",
            ask: "\"Give me the zod schema and the changed handler as a diff, plus the error-shape it returns. Keep it to this one form.\"",
            check: "Whether the error shape actually matches the existing form's (so the frontend doesn't break), and whether it handles the empty-submission and extra-unknown-fields cases.",
          },
        },
      },
      challenges: [
        fieldsChallenge("S2.1", "Reproduce", "Drive a real change",
          "Pick a small real change in your own codebase (or a project you know). Write the context, the constraints, and what you'd ask for — as if briefing the model now.",
          "Strong answer: names the real files/conventions; constraints are concrete (libraries, patterns, no new deps); asks for a reviewable output; and identifies what you'd check first.",
          [
            { key: "change", label: "The change, and the real files/conventions involved", hint: "Be specific about the code it touches.", minWords: 10 },
            { key: "constraints", label: "Constraints you'd give the model", hint: "Libraries, patterns, scope limits.", minWords: 6 },
            { key: "review", label: "What you'd review first and why", hint: "Where it's most likely to be wrong.", minWords: 8 },
          ],
          [
            { label: "Real context (files, conventions) is provided" },
            { label: "Constraints are concrete" },
            { label: "Asks for a reviewable change, not a rewrite" },
            { label: "Names the first thing to check" },
          ],
          "independent"),
        scenarioChallenge("S2.2", "Create", "It used a package you don't have",
          "You asked AI for a change. The code it returned imports `date-fns`, which isn't in your project — you use the native `Intl` API and a small helper.",
          "What's the right move?",
          [
            { id: "a", label: "Add date-fns — it's a popular, well-tested library", ok: false, why: "You just took on a dependency to satisfy generated code. That's the tail wagging the dog." },
            { id: "b", label: "Tell it your constraint (\"no new deps, we use Intl + this helper\") and ask it to redo the change", ok: true, why: "Fix the brief, not the codebase. The constraint was missing from your context." },
            { id: "c", label: "Rewrite it yourself to use Intl", ok: false, why: "You can — but the faster, repeatable fix is to give the model the constraint so it gets it right now and next time." },
          ],
          "transferable"),
      ],
    },

    {
      id: "S3", name: "Reviewing AI-generated code",
      canDo: "Review AI code for the things it gets wrong that humans usually don't.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "The AI code looked idiomatic and passed review in five minutes. In production it called `.flatMap()` on an object (not an array), swallowed the error in a bare `catch {}`, and users saw a blank screen with no log line.",
          point: "It reads as fluent and confident. \"Looks right\" is exactly the trap.",
        },
        explain: {
          paras: [
            "AI code fails **differently** from human code. Review for these on purpose:",
            "**Hallucinated APIs** — a method, parameter or import that's plausible but not real in your version. **Swallowed errors** — empty catches, ignored return values. **Missing edges** — empty, null, very large, concurrent, unicode. **Security** — injection, secrets in code, missing authorization checks. **Spec drift** — does it actually do what the ticket said?",
            "Fluency is not correctness. Read it like you're suspicious.",
          ],
          keyIdea: "Check the AI-specific failure modes: invented APIs, swallowed errors, unhandled edges, security, and does it match the spec.",
        },
        demonstrate: {
          task: "Review a short function the AI wrote to \"return the average order value for a customer\".",
          steps: [
            { move: "Invented API?", think: "Scan every call.", result: "`orders.sumBy('total')` — no such method on our array; hallucinated" },
            { move: "Swallowed errors?", think: "Look at catches and unchecked returns.", result: "wraps the DB call in `try { } catch { return 0 }` — a DB error silently looks like a £0 average" },
            { move: "Edge cases?", think: "Empty, null, one item.", result: "customer with zero orders → divides by zero → NaN" },
            { move: "Matches the spec?", think: "Re-read the ticket.", result: "spec said 'last 12 months'; the code averages all time" },
          ],
          full: "Found: a hallucinated `sumBy`; a catch that turns DB errors into a silent £0; a divide-by-zero for customers with no orders; and it ignores the '12 months' from the spec. None of these are visible from 'it looks clean'.",
        },
        deconstruct: [
          "Every issue came from a specific check, not a general read-through.",
          "The swallowed error is the scariest — it fails silently and looks like real data.",
          "Re-reading the spec caught a bug that was 'correct code' for the wrong requirement.",
        ],
        guided: {
          intro: "Your turn. Here's an AI-written snippet — list what you'd check and what you suspect. Then reveal the model answer.",
          task: "AI wrote this to \"send a welcome email when a user signs up\":\n\n  async function onSignup(user) {\n    try {\n      await mailer.send({ to: user.email, template: 'welcome', vars: { name: user.name } });\n    } catch (e) {}\n    await db.users.update(user.id, { welcomed: true });\n  }",
          fields: [
            { key: "checks", label: "What would you check?", hint: "Go through the failure modes from the lesson.", minWords: 10 },
            { key: "suspect", label: "What do you already suspect is wrong?", hint: "Name at least two concrete issues.", minWords: 8 },
          ],
          model: {
            checks: "Does `mailer.send` take that shape in our client? Is `user.name` always present (nullable?)? What happens when the email fails? Is `welcomed: true` set even if the email never went? Any rate/retry concern on signup spikes?",
            suspect: "The bare `catch {}` swallows every send failure with no log — and then it marks the user `welcomed: true` regardless, so a failed welcome email is invisible and will never be retried. Also `user.name` could be null and render 'Hi ,'.",
          },
        },
      },
      challenges: [
        critiqueChallenge("S3.1", "Adapt", "Review this AI change",
          "Here's an AI-written function to \"parse a CSV of contacts and return valid email addresses\". Review it against the failure modes from the lesson.",
          "  function validEmails(csv) {\n    return csv.split('\\n').map(line => line.split(',')[2]).filter(e => e.includes('@'));\n  }",
          [
            { label: "No handling of the header row — it'll try to validate the column title", signals: ["header", "first row", "title row", "skip the header", "column name"] },
            { label: "Fragile CSV parsing — commas inside quoted fields break split(',')", signals: ["comma", "quoted", "quotes", "csv parsing", "split(',')", "embedded comma", "proper csv", "escaped"] },
            { label: "`e.includes('@')` is a near-useless email check", signals: ["includes('@')", "weak check", "not a real", "\"@\" is not", "barely validates", "poor validation", "just checks for @"] },
            { label: "Crashes on a short/blank line — split(',')[2] is undefined, then .includes throws", signals: ["undefined", "blank line", "empty line", "short line", "throws", "crash", "missing column", "[2]"] },
          ],
          "transferable"),
        fieldsChallenge("S3.2", "Transfer", "Review a real AI change from your work",
          "Take a real change AI has written for you (or a snippet from a project). Run the failure-mode checklist and write up what you found.",
          "Strong answer: you actually went through the specific checks (invented APIs, swallowed errors, edges, security, spec match) and reported concrete findings — or a reasoned 'clean, and here's what I verified'.",
          [
            { key: "snippet", label: "What the change does (and paste/describe it)", hint: "Enough for the finding to make sense.", minWords: 8 },
            { key: "findings", label: "What you found, check by check", hint: "Go through the five failure modes.", minWords: 15 },
          ],
          [
            { label: "Went through the specific AI failure modes" },
            { label: "Findings are concrete (or the 'clean' verdict is justified)" },
            { label: "Checked it against the actual spec/intent" },
          ],
          "transferable"),
      ],
    },

    {
      id: "S4", name: "Generating tests you can trust",
      canDo: "Get AI to write tests that catch real regressions — and know when green means nothing.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You asked AI to add tests for the bug you just fixed. It produced 12 tests, all green, coverage up to 90%. A week later the same bug came back — none of the 12 actually exercised it.",
          point: "Green and high coverage tell you the tests ran, not that they'd catch the thing you care about.",
        },
        explain: {
          paras: [
            "Tell it the **behaviour to prove**, straight from the acceptance criteria — not \"write tests for this file\".",
            "Ask for the **failure cases first**: what inputs *should* be rejected or handled specially.",
            "**Run the new tests against the old, broken code.** If none fail, they don't protect the fix.",
            "Watch for tests that assert on **implementation** (internal calls, private state) instead of **behaviour** — they break on safe refactors and miss real regressions.",
          ],
          keyIdea: "Tests prove behaviour from the spec. Write the failing case first; run it against the bug; a test that never fails proves nothing.",
        },
        demonstrate: {
          task: "You fixed a bug: the cart accepted negative quantities. Now get tests.",
          steps: [
            { move: "State the behaviour", think: "From the fix.", result: "\"Quantity must be an integer ≥ 1; anything else is rejected with a clear error.\"" },
            { move: "Ask for failure cases first", think: "The rejections matter most.", result: "tests for: -1, 0, 1.5, \"2\", null, missing" },
            { move: "Run against the pre-fix code", think: "Would they have caught it?", result: "the -1 and 0 tests fail on old code ✓; the 1.5 test passes on old code — old code coerced it, so that's a real gap the fix also closed" },
            { move: "Check the assertions", think: "Behaviour, not internals.", result: "assert the API returns 400 + error message, not that a private `validateQty()` was called" },
          ],
          full: "Behaviour: qty is integer ≥ 1 or rejected. Asked for the rejection cases first (-1, 0, 1.5, \"2\", null). Ran them against the old code — the key ones failed, confirming they catch the bug. Assertions check the response, not internal calls.",
        },
        deconstruct: [
          "Running the tests against the broken code is the step that proves they're worth anything.",
          "Asking for failure cases first stops you with a suite of only happy-path tests.",
          "Behaviour assertions survive refactors; implementation assertions give false confidence.",
        ],
        guided: {
          intro: "Your turn. Then reveal the model answer.",
          task: "You fixed a bug where a discount code could be applied twice, stacking the discount. Now you want tests.",
          fields: [
            { key: "behaviour", label: "The behaviour to prove", hint: "State it precisely, from the fix.", minWords: 6 },
            { key: "cases", label: "The cases you'd ask AI to write", hint: "Failure cases first.", minWords: 8 },
            { key: "trust", label: "How you'd know the tests are actually good", hint: "The step that proves it.", minWords: 6 },
          ],
          model: {
            behaviour: "A given discount code can be applied at most once per cart; a second attempt is rejected and the total is unchanged.",
            cases: "Apply code once → total drops correctly. Apply the same code again → rejected, total unchanged. Apply a different valid code after → allowed. Remove and re-apply → allowed once. Concurrent double-apply (two requests) → only one takes effect.",
            trust: "Run the 'apply twice' and 'concurrent' tests against the pre-fix code — they should fail there. If they pass on the broken code, they aren't testing the bug.",
          },
        },
      },
      challenges: [
        fieldsChallenge("S4.1", "Reproduce", "Test a real fix or feature",
          "Take a real bug you've fixed or feature you've built. Write the behaviour, the cases you'd ask AI for, and how you'd verify the tests are good.",
          "Strong answer: behaviour stated from the spec; failure cases included; and a concrete plan to confirm the tests would have caught the problem (e.g. run against the old code).",
          [
            { key: "behaviour", label: "The behaviour to prove", hint: "Precise, testable.", minWords: 6 },
            { key: "cases", label: "Cases to ask AI for", hint: "Failure cases first, then happy path.", minWords: 10 },
            { key: "verify", label: "How you'd confirm the tests are meaningful", hint: "The step that proves it.", minWords: 6 },
          ],
          [
            { label: "Behaviour stated from the spec, not the code" },
            { label: "Failure cases included, not just happy path" },
            { label: "A concrete way to confirm the tests catch the issue" },
          ],
          "independent"),
        scenarioChallenge("S4.2", "Create", "All the tests passed first try",
          "You asked AI for tests on a tricky bit of logic. It generated them and they all pass on the first run, no edits.",
          "What should you do before trusting them?",
          [
            { id: "a", label: "Nothing — passing tests on a correct implementation is the expected result", ok: false, why: "You don't yet know the tests would fail on a wrong implementation — which is the whole point of a test." },
            { id: "b", label: "Break the code deliberately (or run against a known-bad version) and check the tests fail", ok: true, why: "A test that can't fail proves nothing. Mutating the code or running against the pre-fix version confirms they bite." },
            { id: "c", label: "Delete half of them — if they all pass they're redundant", ok: false, why: "Passing doesn't mean redundant; they may cover different cases. The issue is whether any of them can fail." },
          ],
          "transferable"),
      ],
    },
  ];

  const PATHWAYS = [
    {
      id: "software",
      title: "Software & Product Development",
      tagline: "Ship real features and fixes with AI as a fast pair — and catch it when it's wrong.",
      forRoles: "engineers · PMs · technical founders · designers who build",
      status: "available",
      prereq: "foundation",
      competencies: SOFTWARE_COMPETENCIES,
      capstoneId: "SWCAP",
      rubricEmphasis: ["Verification", "Safety"],
    },
    { id: "content", title: "Content, Marketing & Comms", tagline: "Draft at scale with brand voice, checked claims, and disclosure done right.", forRoles: "writers · marketers · founders doing their own marketing", status: "planned", prereq: "foundation", competencies: [], rubricEmphasis: ["Reasoning", "Safety"] },
    { id: "ops", title: "Operations & Admin", tagline: "Map a process, then automate it with human checkpoints and an audit trail.", forRoles: "ops · EAs · office managers · small-business owners", status: "planned", prereq: "foundation", competencies: [], rubricEmphasis: ["Structure", "Safety"] },
    { id: "support", title: "Customer Support", tagline: "Triage, draft, ground answers in the knowledge base, and handle the hard cases.", forRoles: "support · customer success", status: "planned", prereq: "foundation", competencies: [], rubricEmphasis: ["Reasoning", "Safety"] },
    { id: "research", title: "Research & Analysis", tagline: "Frame the question, synthesise many sources, verify every claim, never ship a fake citation.", forRoles: "analysts · researchers · journalists · students", status: "planned", prereq: "foundation", competencies: [], rubricEmphasis: ["Verification", "Reasoning"] },
    { id: "education", title: "Education & Training", tagline: "Design outcomes, generate checked materials, support feedback and assessment.", forRoles: "teachers · trainers · L&D · course creators", status: "planned", prereq: "foundation", competencies: [], rubricEmphasis: ["Clarity", "Safety"] },
  ];

  const PATHWAY_CHECKPOINTS = [
    {
      id: "SWCAP",
      pathway: "software",
      title: "Work Capstone — ship a real change with AI, responsibly",
      after: ["S1", "S2", "S3", "S4"],
      stage: "Demonstration",
      brief:
        "Take a real feature or bug in your work. Run the whole loop with AI and show it: the spec, how you drove the AI, what your review caught, the tests, and the ship checklist.",
      whatGood:
        "The spec is testable; the AI-collaboration approach gives reviewable changes; the review caught something real; the tests would fail on the bug; and the ship checklist covers flag, rollback, human review and data/secrets.",
      fields: [
        { key: "spec", label: "The spec", hint: "User problem, acceptance criteria, out-of-scope, constraints.", minWords: 15 },
        { key: "drive", label: "How you drove the AI", hint: "Context given, what you asked for, how you iterated.", minWords: 12 },
        { key: "review", label: "What your review caught", hint: "Concrete issues in the AI's code (or a justified 'clean').", minWords: 10 },
        { key: "tests", label: "The tests, and why you trust them", hint: "Behaviour proven + how you confirmed they bite.", minWords: 10 },
        { key: "ship", label: "Ship checklist", hint: "Flag, rollback, human review gate, secrets/data, what AI must NOT decide.", minWords: 10 },
      ],
      rubricDims: ["Clarity", "Structure", "Verification", "Reasoning", "Evidence", "Safety"],
      raisesTo: "advanced",
    },
  ];

  const ALL_CHECKPOINTS = CHECKPOINTS.concat(PATHWAY_CHECKPOINTS);

  // ---- lookups (search foundation + every pathway) ------------------
  function allCompetencies() {
    return COMPETENCIES.concat(...PATHWAYS.map(p => p.competencies));
  }
  function competency(id) { return allCompetencies().find(c => c.id === id); }
  function challenge(capId, chId) {
    const c = competency(capId);
    return c ? c.challenges.find(ch => ch.id === chId) : null;
  }
  function checkpoint(id) { return ALL_CHECKPOINTS.find(cp => cp.id === id); }
  function pathway(id) { return PATHWAYS.find(p => p.id === id); }
  function competenciesFor(moduleId) {
    if (!moduleId || moduleId === "foundation") return COMPETENCIES;
    const p = pathway(moduleId);
    return p ? p.competencies : [];
  }
  function checkpointsFor(moduleId) {
    if (!moduleId || moduleId === "foundation") return CHECKPOINTS;
    return PATHWAY_CHECKPOINTS.filter(cp => cp.pathway === moduleId);
  }
  function quickCheck(capId) { return QUICK_CHECKS[capId] || []; }
  function lessonSteps(capId) {
    return LESSON_STEPS.filter(s => s !== "quickcheck" || quickCheck(capId).length);
  }

  return {
    MASTER_CAPABILITY, LEVELS, LEVEL_ORDER, LESSON_STEPS, LESSON_STEP_LABELS, LESSON_STEP_ICONS,
    PATHWAY, COMPETENCIES, CHECKPOINTS, DIAGNOSTIC,
    PATHWAYS, PATHWAY_CHECKPOINTS, QUICK_CHECKS,
    competency, challenge, checkpoint, pathway,
    allCompetencies, competenciesFor, checkpointsFor, quickCheck, lessonSteps,
  };
})();
