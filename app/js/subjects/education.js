/* Subject: education
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["education"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const EDUCATION_COMPETENCIES = [
  {
    id: "ED1", name: "Design a learning outcome",
    canDo: "Define what a learner should be able to do, and how you'd know they can, before generating any material.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You asked AI for \"a lesson on fractions\" and got 12 polished slides. Halfway through teaching it you realised it never built to anything a student could *do* — it explained fractions four different ways and assessed none of them. You'd generated content, not a lesson.",
        point: "Without an outcome, AI produces material that looks like teaching but doesn't lead anywhere you can check.",
      },
      explain: {
        paras: [
          "This is Goal Definition (C1) for teaching. A usable learning outcome names four things: the **observable capability** — what the learner can *do* afterwards, in a verb you can assess (\"solve\", \"explain the trade-off\", \"identify errors in\"), not \"understand\" or \"know about\"; the **conditions** (with what, under what constraints); the **standard** (how well — how many, how accurate, unaided?); and **the task that would demonstrate it**.",
          "Write the assessment *before* the material, so the material builds toward something checkable rather than just \"covering\" the topic.",
        ],
        keyIdea: "A learning outcome names an observable capability (an assessable verb), its conditions, its standard, and the task that would demonstrate it — written before any material.",
      },
      demonstrate: {
        task: "Turning \"teach students about persuasive writing\" into an outcome.",
        steps: [
          { move: "Observable capability", think: "An assessable verb.", result: "Not 'understand persuasion' — 'write a paragraph that uses at least two named persuasive techniques for a stated audience'." },
          { move: "Conditions", think: "With what, how long.", result: "Given a topic and an audience; 20 minutes; may use a techniques checklist." },
          { move: "Standard", think: "How well.", result: "Two techniques used correctly and identifiable; the paragraph addresses the specified audience." },
          { move: "The assessment", think: "Written first.", result: "'Here's a topic and an audience — write the paragraph, then label the techniques you used.'" },
        ],
        full: "The outcome is a specific writing task with a clear bar. The assessment is written first — now any material generated has to build toward producing that paragraph, not just 'cover' persuasion.",
      },
      deconstruct: [
        "\"Write a paragraph using two techniques\" is assessable; \"understand persuasion\" is not.",
        "Writing the assessment first is what stops the material from wandering.",
        "The standard ('identifiable', 'addresses the audience') tells both the AI and the learner what 'good' means.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want to teach new hires \"how to give feedback\". Turn it into a learning outcome.",
        fields: [
          { key: "capability", label: "The observable capability", hint: "An assessable verb, not 'understand'.", minWords: 6 },
          { key: "conditions", label: "The conditions", hint: "With what, constraints.", minWords: 5 },
          { key: "standard", label: "The standard", hint: "How well is good enough.", minWords: 5 },
          { key: "assessment", label: "The task that shows it", hint: "The actual assessment.", minWords: 5 },
        ],
        model: {
          capability: "Given a realistic scenario, write feedback that is specific (names the behaviour and its effect), actionable (says what to do differently), and balanced (not only negative).",
          conditions: "A one-paragraph scenario describing an employee's behaviour; 10 minutes; may use the Situation-Behaviour-Impact template.",
          standard: "The feedback names a specific behaviour (not a trait), states its impact, and gives one concrete next step. A reviewer can tell what the employee is being asked to change.",
          assessment: "Read this scenario. Write the feedback you'd give. Then a peer checks it against the three criteria.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ED1.1", "Reproduce", "Write a learning outcome for a real topic",
        "Take something you need to teach. Write the outcome and the assessment — before any material.",
        "Strong answer: the verb is assessable (not 'understand' / 'know'); conditions and a standard are specified; and the assessment task is concrete and written as if before the material.",
        [
          { key: "topic", label: "The topic", hint: "One line.", minWords: 3 },
          { key: "capability", label: "The observable capability", hint: "Assessable verb.", minWords: 6 },
          { key: "standard", label: "The standard", hint: "The bar.", minWords: 4 },
          { key: "assessment", label: "The assessment task", hint: "What would demonstrate it.", minWords: 5 },
        ],
        [
          { label: "The verb is assessable, not 'understand' / 'know'" },
          { label: "Conditions and a standard are specified" },
          { label: "The assessment task is concrete, written before the material" },
        ],
        "independent"),
      critiqueChallenge("ED1.2", "Adapt", "Fix a vague outcome",
        "Here is a stated outcome. Using the four-part test from the lesson, find every problem and rewrite it.",
        "\"By the end of this module, learners will understand machine learning and be aware of its applications and be familiar with key concepts.\"",
        [
          { label: "'understand' / 'be aware of' / 'be familiar with' are not observable or assessable", signals: ["understand", "be aware", "be familiar", "not observable", "not assessable", "can't measure", "vague verb", "what would they do"] },
          { label: "No conditions — with what, unaided, how long", signals: ["conditions", "with what", "unaided", "how long", "constraints", "under what"] },
          { label: "No standard — how well, how much", signals: ["standard", "how well", "how much", "the bar", "pass mark", "criteria", "good enough", "threshold"] },
          { label: "No assessment task is implied", signals: ["assessment", "no task", "how would you assess", "what would demonstrate", "how do you check"] },
          { label: "Three vague goals stacked with 'and' — nothing single to build toward", signals: ["three goals", "three outcomes", "stacked", "one thing", "single outcome", "build toward", "too many", "unfocused", "multiple outcomes"] },
        ],
        "transferable", { text: `"Learners will correctly classify 8 of 10 unlabeled examples as supervised or unsupervised learning, unaided, in a 20-minute written test."`, changes: ["“understand” → “classify” — an action you can watch", "Conditions named — unaided, 20 minutes", "Standard named — 8 of 10", "One outcome, not three stacked"] }),
    ],
  },

  {
    id: "ED2", name: "Material generation with accuracy checks",
    canDo: "Produce explanations, examples and exercises with AI — fact-checked against sources before they reach a learner.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI-generated history worksheet had a confident, detailed account of a battle — wrong date, wrong outcome, a general who wasn't there. Thirty students learned it. Two years later one of them cited it in an exam.",
        point: "A wrong fact in teaching material doesn't just fail one check — it gets taught, believed, and repeated.",
      },
      explain: {
        paras: [
          "AI is good at *structuring* material — worked examples, graded exercises, analogies, question sets — and unreliable on *facts*: dates, names, quotes, statistics, anything domain-specific.",
          "Workflow: generate the structure with AI; **verify every factual claim against a real source** (textbook, primary source, subject expert) before it's used; for anything you can't verify, cut it or mark it clearly as illustrative.",
          "Higher stakes (exam prep, professional training, health, law) = tighter checking. The AI drafts; a knowledgeable human signs off.",
        ],
        keyIdea: "AI structures the material; a human verifies every fact against a source before a learner sees it. Unverifiable claims are cut or marked illustrative. Stakes set the checking bar.",
      },
      demonstrate: {
        task: "Generating a worked-examples sheet for a chemistry topic.",
        steps: [
          { move: "Generate the structure", think: "The tedious part.", result: "AI produces 6 worked examples of increasing difficulty, with steps shown." },
          { move: "Check the chemistry", think: "Someone who'd catch an error.", result: "A chemistry teacher works each example — are the equations balanced? the values right? the method standard?" },
          { move: "Fix or cut", think: "Don't ship the errors.", result: "Example 4 had a wrong molar mass; example 6 used a non-standard method — corrected and replaced." },
          { move: "Sign off", think: "Someone is accountable.", result: "The teacher confirms the sheet is correct before it goes to students." },
        ],
        full: "The AI did the tedious part — six graded examples with worked steps. A subject expert checked every number and method, fixed two errors, and signed off. Students never saw an unverified version.",
      },
      deconstruct: [
        "The AI's structure (six graded examples) was fine; two of its facts weren't.",
        "\"A chemistry teacher works each example\" — the check has to be done by someone who'd catch the error.",
        "Sign-off is a step, not an assumption — someone is accountable for the sheet being right.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're using AI to make a study guide for a first-aid course.",
        fields: [
          { key: "aidoes", label: "What you let AI generate", hint: "Structure vs authoritative content.", minWords: 5 },
          { key: "verify", label: "What gets checked, against what, by whom", hint: "The verification step.", minWords: 6 },
          { key: "stakes", label: "Why the bar is where it is here", hint: "What's at stake.", minWords: 5 },
          { key: "unverifiable", label: "What happens to claims you can't confirm", hint: "Cut or mark.", minWords: 4 },
        ],
        model: {
          aidoes: "The structure and wording: scenario descriptions, step-by-step response sequences, practice questions, a glossary. Not the clinical content as authoritative.",
          verify: "Every response sequence, ratio and 'when to call emergency services' line is checked against the current official first-aid guidelines by a qualified instructor. Nothing goes out unchecked.",
          stakes: "Someone may act on this in a real emergency. A wrong compression rate or a missed 'call 999 first' isn't a bad grade — it's a safety failure. Highest checking bar.",
          unverifiable: "Any technique or figure not matching current official guidance is removed, not softened. Plausible-but-not-in-the-guidelines content is cut.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ED2.1", "Reproduce", "A generate-then-verify plan for real material",
        "Take material you'd make with AI. Design the generate-then-verify workflow.",
        "Strong answer: AI is used for structure, not authoritative facts; every factual claim has a named source and a checker who'd catch an error; unverifiable claims are cut or marked; and the checking bar matches the stakes.",
        [
          { key: "material", label: "The material", hint: "One line.", minWords: 3 },
          { key: "aidoes", label: "What AI generates", hint: "Structure vs facts.", minWords: 5 },
          { key: "checks", label: "What's verified, against what, by whom", hint: "The check.", minWords: 6 },
          { key: "stakes", label: "Why the bar is where it is", hint: "The stakes.", minWords: 4 },
        ],
        [
          { label: "AI used for structure, not authoritative facts" },
          { label: "Every factual claim has a named source and checker" },
          { label: "Unverifiable claims cut or marked; bar matches stakes" },
        ],
        "independent"),
      scenarioChallenge("ED2.2", "Create", "A student caught an error in the AI-made notes",
        "A student points out that the AI-generated revision notes state a formula that's wrong. It's been used by three classes.",
        "What's the fix — for this and for next time?",
        [
          { id: "a", label: "Correct this formula and remind the AI to be more careful", ok: false, why: "'Remind the AI' isn't a control. The process had no verification step." },
          { id: "b", label: "Correct it, tell the affected classes, and add a subject-expert sign-off step before any AI-generated material reaches students", ok: true, why: "Fix the instance, fix the people affected, fix the process." },
          { id: "c", label: "Stop using AI for material generation", ok: false, why: "The fix is a verification step, not abandoning a useful tool." },
        ],
        "transferable"),
    ],
  },

  {
    id: "ED3", name: "Feedback & assessment support",
    canDo: "Use AI to give formative feedback and draft assessments — while a human reads the work and owns the grade.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI marking assistant gave a student 4/10 and a paragraph of feedback. The teacher, trusting it, entered the grade. The student appealed: the AI had misread the question, marked a correct answer wrong, and its feedback told the student to change a right answer. The teacher hadn't actually read the work.",
        point: "AI feedback that isn't checked doesn't assist the teacher — it replaces the teacher's judgement with an unaccountable one.",
      },
      explain: {
        paras: [
          "Two safe uses. **Formative feedback** (not graded): AI drafts specific, actionable comments on a draft — the learner uses them to improve, a teacher spot-checks. **Assessment drafting**: AI proposes questions, rubrics, model answers — a teacher edits and owns them.",
          "The line: **AI never assigns the final grade**, and its feedback is **reviewed before the learner acts on it** for anything high-stakes.",
          "Watch for: AI marking to a rubric it's misread, penalising correct-but-unusual answers, and generic feedback (\"add more detail\") rather than specific. The teacher reads the work; the AI speeds up the writing-up.",
        ],
        keyIdea: "AI drafts formative feedback and assessment components; a human reads the work, owns the grade, and reviews AI feedback before it's acted on. AI never assigns the final mark.",
      },
      demonstrate: {
        task: "Using AI to help mark a set of short essays.",
        steps: [
          { move: "AI first pass", think: "Draft, not decide.", result: "AI reads each essay against the rubric and drafts feedback + a suggested band." },
          { move: "Teacher reads the work", think: "Not just the AI's summary.", result: "The teacher reads each essay themselves." },
          { move: "Compare and decide", think: "Disagreements are the real work.", result: "Where teacher and AI agree, the feedback stands (lightly edited); where they differ, the teacher investigates and decides." },
          { move: "Teacher owns the grade", think: "AI's band is an input.", result: "The final band is the teacher's." },
        ],
        full: "AI drafts feedback for 30 essays, saving the write-up time. The teacher still reads all 30, uses the AI draft as a starting point, resolves every disagreement themselves, and assigns every grade.",
      },
      deconstruct: [
        "\"The teacher reads the work\" is the non-negotiable — the AI's summary is not a substitute.",
        "Disagreements between teacher and AI are where the real marking judgement happens.",
        "The AI saved time on writing feedback, not on the judgement.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want to use AI to give students feedback on essay drafts before they submit final versions.",
        fields: [
          { key: "airole", label: "What the AI does", hint: "The drafting scope.", minWords: 5 },
          { key: "humancheck", label: "What the teacher checks and when", hint: "Spot-checks, flags.", minWords: 5 },
          { key: "grade", label: "Who owns the grade, and how that's protected", hint: "Keeping AI out of the grading path.", minWords: 5 },
          { key: "risks", label: "What you watch for in the AI's feedback", hint: "The failure modes.", minWords: 5 },
        ],
        model: {
          airole: "On each draft: AI comments on structure, clarity, whether the argument is supported, and where evidence is thin — specific, tied to sentences. It suggests, it doesn't rewrite.",
          humancheck: "The teacher spot-checks ~1 in 4 sets of comments and any a student flags as confusing or unfair. All feedback is labelled 'draft feedback — check with me if unsure'.",
          grade: "The final essay is read and graded by the teacher, with no AI band shown until after the teacher has formed their own view (to avoid anchoring). The AI is not in the grading path.",
          risks: "Generic comments ('be more specific') with no example; penalising a valid unconventional structure; missing the actual strongest/weakest point; confident tone on a misread. The spot-check targets these.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ED3.1", "Reproduce", "Design AI feedback support that keeps the teacher in charge",
        "For a real teaching context, design how AI supports feedback or assessment without taking over the judgement.",
        "Strong answer: AI is limited to formative feedback and/or draft components; the teacher reads the work and owns the grade; AI feedback is reviewed before high-stakes use; and anchoring on the AI's band is avoided.",
        [
          { key: "use", label: "Formative feedback and/or assessment drafting — which", hint: "The use.", minWords: 4 },
          { key: "aiscope", label: "What the AI drafts", hint: "Its scope.", minWords: 5 },
          { key: "humanowns", label: "What stays with the human, incl. the grade", hint: "The non-negotiables.", minWords: 5 },
          { key: "safeguards", label: "How you stop the AI's judgement replacing the teacher's", hint: "Reads the work; anti-anchoring.", minWords: 5 },
        ],
        [
          { label: "AI limited to formative feedback and/or draft components" },
          { label: "The teacher reads the work and owns the grade" },
          { label: "AI feedback reviewed before high-stakes use; anchoring avoided" },
        ],
        "independent"),
      critiqueChallenge("ED3.2", "Adapt", "Find the problem in the marking setup",
        "Here is a proposed AI marking setup. Find every problem.",
        "\"To speed up marking, the AI reads each submission, applies the rubric, assigns a final grade, and writes the feedback. The teacher reviews any grade the student appeals.\"",
        [
          { label: "The AI assigns the final grade — that's the human's job", signals: ["assigns the final grade", "final grade", "ai grades", "human's job", "shouldn't grade", "ai in the grading path", "owns the grade"] },
          { label: "The teacher only reviews on appeal, so most work is never read by a human", signals: ["only on appeal", "never read", "most work", "no human reads", "unreviewed", "reads the work"] },
          { label: "A student who doesn't appeal an unfair mark keeps it", signals: ["doesn't appeal", "keeps it", "unfair mark", "won't appeal", "no recourse", "accepts a wrong grade"] },
          { label: "'Applies the rubric' assumes the AI reads the rubric and the work correctly, unchecked", signals: ["applies the rubric", "misread", "assumes", "unchecked", "reads correctly", "no check that"] },
          { label: "No spot-checking of non-appealed work", signals: ["spot-check", "sample", "non-appealed", "random check", "no sampling"] },
        ],
        "transferable", { text: `"AI reads each submission and drafts a grade and feedback against the rubric. The teacher reviews every draft grade before it’s released — a fast confirm for straightforward, low-stakes work; a full read for borderline grades or high-stakes assessments. Every AI-drafted grade and the teacher’s confirmation are logged, so a pattern of errors would be visible even before a student appeals."`, changes: ["The AI drafts; the teacher assigns the final grade, not the reverse", "Every submission gets a teacher pass, not just appealed ones", "A student who doesn’t appeal is still protected — nothing ships unreviewed", "A log makes systematic AI errors visible without relying on appeals"] }),
    ],
  },

  {
    id: "ED4", name: "Adapting to the learner",
    canDo: "Adjust level, pace, examples and explanation to the individual — without lowering the bar for what they must achieve.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The \"adaptive\" AI tutor noticed a student was struggling with algebra, so it made the problems easier. And easier. The student ended the term \"succeeding\" at problems two years below grade level, with a report that said \"good progress\". The bar had quietly moved.",
        point: "Adapting *how* someone learns is the goal. Adapting *what they have to achieve* down to meet them is how you hide a problem.",
      },
      explain: {
        paras: [
          "Good adaptation changes the **route**, not the **destination**. Legitimate: more scaffolding then removed; different examples relevant to the learner's context; slower pace with more practice; alternative explanations; prerequisite gaps filled.",
          "Not legitimate: permanently easier problems, dropping required content, a lower standard reported as the same.",
          "Also: the AI's model of the learner can be **wrong** — a bored student looks like a lost one. Check its adaptation against what the learner actually needs, and keep a fixed record of the real target outcome.",
        ],
        keyIdea: "Adapt the route (scaffolding, examples, pace, explanations, filling prerequisite gaps), never the destination (the required outcome and standard). Watch for a wrong learner-model, and keep the target outcome fixed.",
      },
      demonstrate: {
        task: "An AI tutor working with a student stuck on ratios.",
        steps: [
          { move: "Diagnose the actual gap", think: "Symptom vs cause.", result: "Not 'bad at ratios' — the student is fine with ratios but shaky on the multiplication underneath." },
          { move: "Fill the prerequisite", think: "Targeted.", result: "Brief targeted practice on the multiplication, then back to ratios." },
          { move: "Adapt the examples", think: "Context, not difficulty.", result: "Use ratios in cooking and in a game the student mentioned — same difficulty, relevant context." },
          { move: "Hold the target", think: "Written down.", result: "The goal is still 'solve grade-level ratio problems unaided' — the route changed, the bar didn't." },
        ],
        full: "The tutor found the real gap (a prerequisite), fixed it, made the examples relevant, and kept the student aimed at the same grade-level outcome — reached by a different path, not a lower one.",
      },
      deconstruct: [
        "The first adaptation was diagnostic — 'stuck on ratios' was the symptom, not the cause.",
        "Relevant examples change engagement and access, not difficulty.",
        "\"The goal is still [grade-level, unaided]\" — written down, so it can't quietly drift.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "An AI writing tutor is working with an adult learner who left school early and is anxious about writing, but needs to reach a workplace-report standard.",
        fields: [
          { key: "route", label: "What you'd adapt about how they learn", hint: "Scaffolding, examples, pace.", minWords: 6 },
          { key: "destination", label: "What must NOT change", hint: "The fixed outcome + standard.", minWords: 5 },
          { key: "wrongmodel", label: "How the AI's read of the learner could be wrong here", hint: "The mis-diagnosis risk.", minWords: 5 },
          { key: "check", label: "How you'd catch the bar slipping", hint: "A fixed-standard check.", minWords: 5 },
        ],
        model: {
          route: "Start with very short, structured tasks (fill-in-the-frame reports) and remove the frames over time. Use examples from the learner's own job. Slower pace, more drafts, explicit praise for specific improvements. Address the anxiety directly.",
          destination: "The learner must end able to write a clear, correctly-structured workplace report unaided, to the standard their job requires. That outcome and standard don't move.",
          wrongmodel: "The AI might read anxiety-driven hesitation as low ability and permanently simplify. Or read a confident but error-filled draft as 'ready' and stop scaffolding too soon.",
          check: "Every few weeks, an unaided task at the real target standard, marked against the real rubric. If the learner can't yet do it unaided, the scaffolding isn't done — but the target hasn't changed.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ED4.1", "Reproduce", "Adapt for a real learner without moving the bar",
        "Take a real learner (or a realistic one). Plan adaptation that changes the route, not the destination.",
        "Strong answer: adaptations are to route, not destination; the target outcome and standard are stated and fixed; there's a periodic unaided check at the real standard; and the risk of a wrong learner-model is considered.",
        [
          { key: "learner", label: "The learner and their situation", hint: "One or two lines.", minWords: 5 },
          { key: "route", label: "What you adapt about how they learn", hint: "Scaffolding, examples, pace.", minWords: 6 },
          { key: "destination", label: "The fixed outcome + standard", hint: "What doesn't move.", minWords: 4 },
          { key: "check", label: "How you confirm the bar held", hint: "An unaided check at the real standard.", minWords: 5 },
        ],
        [
          { label: "Adaptations are to route, not destination" },
          { label: "Target outcome and standard are stated and fixed" },
          { label: "Periodic unaided check at the real standard; wrong-model risk considered" },
        ],
        "independent"),
      scenarioChallenge("ED4.2", "Create", "The report says 'good progress' but the level dropped",
        "An AI tutor's end-of-term report says a student made 'good progress'. Looking closer, the student is now fluent at material two grade levels below where they should be — the AI made everything progressively easier.",
        "What went wrong, and what do you change?",
        [
          { id: "a", label: "The AI needs a better model of the student's ability", ok: false, why: "A better learner-model helps, but the missing piece is a fixed target the adaptation can't move below." },
          { id: "b", label: "The AI adapted the destination, not just the route; lock the target outcome / standard and test against it unaided periodically, so 'progress' means progress toward the real bar", ok: true, why: "The fix is structural: a fixed destination and a real-standard check." },
          { id: "c", label: "Stop using adaptive tutoring", ok: false, why: "Adaptation is valuable; it just needs a fixed destination." },
        ],
        "transferable"),
    ],
  },

  {
    id: "ED5", name: "Academic-integrity boundaries",
    canDo: "Set and teach clear rules for learner AI use, and design tasks that assess real capability rather than AI's.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The course banned AI. Half the class used it anyway on the take-home essays, undetectably. The honest students who didn't were disadvantaged. The assessment measured \"willingness to break a rule you can't enforce\", not learning.",
        point: "An unenforceable ban doesn't stop AI use — it just makes the assessment unfair and stops measuring what you think it measures.",
      },
      explain: {
        paras: [
          "**The rules**: state clearly, per task, what AI use is allowed (none / brainstorming only / drafting with disclosure / freely) and *why*, so learners can follow them — and be realistic about what you can actually detect.",
          "**The task design**: for capabilities you must assess directly, use methods AI can't do for the student — in-class work, oral defence of submitted work, process artefacts (drafts, notes), personalised prompts tied to class discussion, or assessing the *judgement* around AI use rather than the output.",
          "Teach AI literacy as part of the subject, not just police it.",
        ],
        keyIdea: "Per task, state the allowed AI use and why (realistically). For capabilities you must assess directly, design tasks AI can't do for the student — in-class, oral defence, process artefacts, personalised prompts. Teach the judgement, don't just ban.",
      },
      demonstrate: {
        task: "Redesigning a take-home essay assessment for an AI world.",
        steps: [
          { move: "Decide what's being assessed", think: "The real capability.", result: "'Construct and defend an argument from evidence' — that's what has to be real." },
          { move: "Set the AI rule", think: "Clear and realistic.", result: "AI allowed for research and outline feedback; the drafting and the argument must be the student's; disclose what you used it for." },
          { move: "Add an AI-proof check", think: "Can't be outsourced.", result: "A 10-minute oral: the student explains their argument and answers two questions on it." },
          { move: "Assess the judgement too", think: "Integrity as a skill.", result: "Part of the mark is a short note on how they used AI and where they chose not to trust it." },
        ],
        full: "The essay still exists, but the graded capability (build and defend an argument) is verified by an oral the student can't outsource. AI use is allowed and disclosed, and the student's judgement about that use is itself assessed.",
      },
      deconstruct: [
        "Naming the real capability ('build and defend an argument') is what tells you which part must be AI-proof.",
        "The oral defence is cheap and nearly impossible to fake.",
        "Assessing the AI-use note turns integrity from a rule into a skill.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You teach a coding course. Assignments are done at home and AI can write most of the code.",
        fields: [
          { key: "assessing", label: "The capability you actually need to assess", hint: "Not 'produces working code'.", minWords: 5 },
          { key: "rules", label: "The AI-use rule for the assignments + why", hint: "Clear, justified, realistic.", minWords: 6 },
          { key: "aiproof", label: "How you verify the capability directly", hint: "AI can't do it for them.", minWords: 6 },
          { key: "literacy", label: "How AI use becomes part of what's taught", hint: "Not just policed.", minWords: 5 },
        ],
        model: {
          assessing: "'Read a problem, design a solution, debug it, and explain why it works' — not 'produce code that passes tests', which AI does trivially.",
          rules: "AI allowed as a pair-programmer for the assignments (it's realistic and useful), with a required note on what you used it for. The design decisions and the debugging log must be your own work.",
          aiproof: "A short lab session each fortnight: modify your submitted code live to meet a new requirement, and explain a section of it. Plus a code-review exercise — find the bugs in a given (AI-written) snippet.",
          literacy: "Teach: when to trust AI-generated code, how to test it, how to spot its typical mistakes, when writing it yourself is faster. Assessed in the code-review exercise.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ED5.1", "Reproduce", "Redesign an assessment for an AI world",
        "Take an assessment AI could do for the student. Redesign it.",
        "Strong answer: the real capability is named; the AI-use rule is clear, justified and realistic about enforcement; there's a direct check AI can't do for the student; and AI-use judgement is taught or assessed.",
        [
          { key: "task", label: "The assessment", hint: "One line.", minWords: 3 },
          { key: "capability", label: "What it must actually measure", hint: "The real capability.", minWords: 5 },
          { key: "rule", label: "The AI-use rule + why (realistic)", hint: "Enforceable, honest.", minWords: 6 },
          { key: "aiproof", label: "How the capability is verified in a way AI can't fake", hint: "In-class / oral / artefacts.", minWords: 6 },
        ],
        [
          { label: "The real capability is named" },
          { label: "The AI-use rule is clear, justified and realistic about enforcement" },
          { label: "A direct check AI can't fake; AI-use judgement taught or assessed" },
        ],
        "independent"),
      scenarioChallenge("ED5.2", "Create", "Half the class used AI on a banned task",
        "Your take-home assessment banned AI. You now believe about half the class used it, undetectably, and the honest half are disadvantaged.",
        "What do you do for the next assessment?",
        [
          { id: "a", label: "Use an AI-detection tool and penalise flagged submissions", ok: false, why: "Detectors are unreliable, produce false positives, and punish honest students who get flagged." },
          { id: "b", label: "Stop relying on an unenforceable ban; redesign so the graded capability is checked in a way AI can't do for the student (in-class element, oral defence, or process artefacts), with a realistic disclosed-use rule", ok: true, why: "Move the assessment to ground AI can't cover, and make the rule one you can actually stand behind." },
          { id: "c", label: "Make the assessment worth less so it matters less", ok: false, why: "That shrinks the measurement problem, it doesn't fix it." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: EDUCATION_COMPETENCIES, capstoneId: "EDUCAP" };
};
