/* Subject: foundation-core (the free foundation every learner starts in)
 *
 * This replaced a foundation built entirely out of office workflows: "get the Q3 report done",
 * "post it on social media", "draft a customer refund email". Every worked example assumed a
 * job, a team and a document, so a learner who wanted to understand how AI works, or who was
 * not working at all, was asked questions about a world they had not opted into. The lessons were
 * fine; the examples were the problem.
 *
 * What changed:
 *
 *   - The spine is unchanged, because it is sound: define the outcome, break it into steps, give
 *     AI an explicit role, design checks, test on real cases, improve from what broke, write the
 *     boundary. That sequence works on anything and is worth learning on its own.
 *   - Every worked example is now about AI's actual behaviour — what it does with context, where
 *     it confabulates, why asking it whether it is right is not a check, what a retrieval step
 *     is for, when a confident answer is a warning sign. A learner who takes this course should
 *     leave it knowing something true about how these systems work, not just how to file a report.
 *   - The written challenges bind to the learner's own real task (captured once, carried through),
 *     so "define a goal" means their goal, not a hypothetical.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["foundation-core"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;

  const COMPETENCIES = [
    {
      id: "C1", name: "Goal Definition",
      canDo: "Turn a vague want into something specific enough that you'd know whether it worked.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You ask an AI to \"help me get organised\" and it produces a beautiful, confident plan you will not follow. Nothing was wrong with the AI's answer. The problem was upstream: you never said what \"organised\" meant, so it guessed a meaning that fit the shape of your sentence rather than your life.",
          point: "Most disappointing AI output is a correctly-formed answer to a question you did not actually ask.",
        },
        explain: {
          heading: "Outcome, test, constraints, boundary",
          story: "Four parts turn a want into something you can check. The outcome is the state that ends up true — not the artefact you produce. The test is how you'd know, applied by someone else without asking you. The constraints are what it must respect: time, money, other people, format, tone, things that are simply not permitted. The boundary is at least one thing you are deliberately not solving, which is what stops the work expanding every time you mention it.",
          point: "\"Get the Q3 report done\" has no outcome. \"A report that lets the team decide whether to cut the project, with the two numbers that drive that decision up front\" has one.",
        },
        demonstrate: {
          heading: "Same task, two specs",
          story: "Vague: \"help me learn AI.\" Specific: outcome — I can build and debug a small LLM app end to end without copying a tutorial. Test — I ship something another person can run, and I can explain why each choice was made. Constraints — a few evenings a week, no team, budget for API calls. Boundary — I am not training models. That last line is what turns a course into a plan.",
          point: "Write the boundary even when nothing is currently out of scope. It is the clause that saves you in week six.",
        },
        deconstruct: {
          heading: "Where learners actually go wrong",
          story: "Two failure modes dominate. The outcome is written as a deliverable (\"a summary document\") rather than a decision that gets made. Or the test is a feeling (\"it'll be useful\"). Both feel like specificity while remaining unmeasurable. If your test cannot be run by someone who does not know you, it is not a test.",
          point: "If two people would disagree about whether you passed, the test is not finished.",
        },
        guided: {
          heading: "Say it, then cut it",
          story: "Draft the four parts in full sentences, then cut every word that does not change what someone else would do. The result is short enough to remember and specific enough to build against — which is the entire point.",
          point: "Short and specific beats long and vague. Aim for one paragraph you could paste into a prompt.",
        },
      },
      challenges: [
        fieldsChallenge("C1.1", "Reproduce", "Define your goal", "Now do it for your own real task — the one you captured when you started. Write the same four parts.", 
          "A goal with all four parts: an outcome that is a state rather than a deliverable, a test someone else could apply, concrete constraints, and at least one genuine non-goal.",[
          {
            key: "outcome", label: "The real outcome",
            hint: "The state that ends up true. Not the document you produce — the decision that gets made, or the thing that changes. What is true when this is finished that isn't true now?",
            minWords: 15,
          },
          {
            key: "test", label: "How you'd know it worked",
            hint: "A test someone else could apply without asking you. If two people would disagree about whether you passed, it isn't finished.",
            minWords: 15,
          },
          {
            key: "constraints", label: "Constraints it must respect",
            hint: "Time, money, other people's time, format, tone, rules, things that are simply not permitted. Be specific — these are what the AI will otherwise ignore.",
            minWords: 12,
          },
          {
            key: "outofscope", label: "Explicitly not doing",
            hint: "At least one thing you are deliberately not solving here. This is the clause that stops the work expanding every time you mention it.",
            minWords: 8,
          },
        ], [
          { label: "Outcome is a state, not a deliverable" },
          { label: "The test is applicable by someone else" },
          { label: "Constraints are named concretely" },
          { label: "There is a real boundary" },
        ], "transferable"),

        critiqueChallenge("C1.2", "Reproduce", "Fix a goal that could not be built against",
          "Someone asked an AI to help them \"get into shape using AI\". It produced a confident, well-formatted plan they abandoned in a week. Here is the brief they gave the AI. Find every problem and rewrite it.",
          "Help me get into shape using AI. Make it a good plan.",
          [
            { label: "The outcome is a wish, not a state", signals: ["'fit' is not measurable", "no number", "not a state", "vague", "how would you know", "what is true when", "no definition", "unmeasurable", "not observable"] },
            { label: "There is no success test", signals: ["no test", "no measure", "no criterion", "how would you know", "nothing to check", "success is not defined", "unmeasurable success", "no acceptance", "cannot be checked"] },
            { label: "Constraints and limits are absent", signals: ["no time budget", "no mention of", "injury", "medical", "not considered", "constraint missing", "ignores", "no limit", "availability"] },
            { label: "There is no boundary", signals: ["no boundary", "not out of scope", "no limit on", "open ended", "no stopping point", "nothing excluded", "scope creep", "no 'not doing'"] },
          ],
          "independent",
          "Get fitter by using AI. Weekly exercise plan. Make it detailed.",
          "In eight weeks I can do three sets of ten reps three times a week, up from one set of five. A doctor cleared me for that, and any pain means I stop and rest. Ten minutes a day, no gym. I'm not trying to enter anything or change what I eat."),

        fieldsChallenge("C1.3", "Transfer", "A goal in a different part of your life",
          "Do the same four parts for a task from a part of your life you have not used yet. If your real task was work, do a personal one, or the reverse. The method does not change; the material does.",
          
          "The same four-part structure applied to a genuinely different context, with a test that works there rather than one carried over from the first task.",[
            { key: "task", label: "The task and where it sits", hint: "One line: what it is, and which part of your life it belongs to. Name it plainly.", minWords: 8 },
            { key: "outcome", label: "The real outcome", hint: "The state that ends up true. Not the artefact.", minWords: 12 },
            { key: "test", label: "How you'd know it worked", hint: "A test you could actually apply, not a feeling.", minWords: 10 },
            { key: "limits", label: "Constraints and what you're not doing", hint: "Both in one field — what it must respect, and what it isn't trying to solve.", minWords: 10 },
          ], [
            { label: "It is a genuinely different context, not a reworded C1.1" },
            { label: "The same four-part structure holds" },
            { label: "The test is applicable" },
            { label: "There is a real boundary" },
          ], "transferable"),
      ],
    },

    {
      id: "C2", name: "Structuring the Work",
      canDo: "Break the goal into steps you can see, order, and check — including where AI fits and where it does not.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You give an AI the whole goal in one message. It returns something enormous: a strategy, a plan, three options, a tone guide and a summary of your own brief back to you. None of it is wrong. Most of it is useless, because you did not tell it which part you actually needed next.",
          point: "A vague request gets a vague-shaped answer. The fix is not a better prompt — it is knowing the steps before you ask.",
        },
        explain: {
          heading: "Steps, inputs, outputs, and the seams",
          story: "Write each step as input → action → output. The value is not the tidy list: it is that you can see the seams. A step with no clear input is a step the AI will invent data for. Two steps that could be swapped are steps you have not really thought about. A step whose output is not checkable is a step you will find out about late.",
          point: "The structure is not bureaucracy. It is how you notice that step three is where this quietly goes wrong.",
        },
        demonstrate: {
          heading: "Same goal, two structures",
          story: "Unstructured: \"help me research a new laptop.\" Structured: (1) list what I actually do with it → budget and battery vs screen; (2) check which of those are non-negotiable → screen, battery, weight; (3) compare only models meeting all three; (4) check reviews specifically for the failure mode I care about; (5) decide. The second version is shorter and far more useful, because step two is where the real decision lives and the unversioned request never surfaces it.",
          point: "Steps are how you find out what you actually want. You often cannot answer until you have written the order.",
        },
        deconstruct: {
          heading: "The missing step is usually the informative one",
          story: "The gap that matters is rarely a missing action. It is a missing decision — the point where you have to choose a criterion, and the AI cannot choose it for you because it does not know which one you are actually optimising for. If a step needs a judgement you cannot make, that step is human, and it should be written down as such.",
          point: "A workflow with no human-only step is usually a workflow nobody has examined closely.",
        },
        guided: {
          heading: "Name the seam, not just the step",
          story: "For each step, say what would have to be true for the next step to be safe. If you cannot answer, that is the seam to look at first — it is where the AI's plausible-sounding output meets your real constraints.",
          point: "Six steps with named seams beat a page of prose about process.",
        },
      },
      challenges: [
        fieldsChallenge("C2.1", "Reproduce", "Structure your own task", "Take the goal you defined in C1 and lay out the steps, in order, as input → action → output.", 
          "Ordered steps where each has a clear input and output, the riskiest step named specifically, and at least one step honestly marked human-only with a reason.",[
          { key: "steps", label: "The steps, in order", hint: "One per line: input → action → output. If a step's input is not obvious, that is the step most likely to be invented.", minWords: 20 },
          { key: "riskiest", label: "Which step is riskiest, and why", hint: "Most damage if wrong, or hardest to undo. Name the step, not the general area.", minWords: 12 },
          { key: "humanstep", label: "A step that must stay human", hint: "At least one step should not use AI. What judgement does it need that the AI cannot make for you?", minWords: 10 },
        ], [
          { label: "Steps are ordered and each has a clear output" },
          { label: "The riskiest step is named specifically" },
          { label: "A human-only step is identified with its reason" },
        ], "transferable"),

        critiqueChallenge("C2.2", "Reproduce", "A prompt with no context in it",
          "Someone asked an AI to summarise their support inbox. Here is exactly what they sent. It produced something confident, well-formatted, and wrong. Find what is missing.",
          "Summarise my support inbox and tell me what to do.\n\nHere are the last 20 messages.",
          [
            { label: "No definition of what to summarise *for*", signals: ["no purpose", "does not say what for", "no audience", "no decision", "purpose is missing", "does not ask what the summary is for", "no goal for the summary"] },
            { label: "No instruction to use only the messages given", signals: ["not told to use only", "no grounding", "may draw on prior knowledge", "not constrained to", "invents", "outside the 20", "no source limit"] },
            { label: "Nothing says what to do with missing or contradictory information", signals: ["contradictory", "conflicting", "missing information", "what if incomplete", "no instruction for gaps", "conflicting messages", "does not say what to do when"] },
            { label: "No checkable definition of done", signals: ["no format", "no length", "no definition of a good summary", "not specified", "no output format", "no success", "nothing says what a good one looks like"] },
          ],
          "independent",
          "Summarise the support inbox and draft replies to the ten most urgent ones. Here's the last 20 messages.\n\n[20 messages, mostly short, two of which contradict each other about whether the customer already refunded]",
          "Summarise the inbox for the support lead, who will decide what gets escalated today. Use only these 20 messages — do not fill gaps from general knowledge, and say \"insufficient information\" where the thread is incomplete or the messages conflict. Six bullets, most urgent first, each with the message number and what is blocking it.\n\nDraft replies only where the requested action is unambiguous from the thread. Where it is not, list it as needing a decision instead of guessing."),

        fieldsChallenge("C2.3", "Transfer", "Structure something with a hard constraint",
          "Do the same for a different task of yours — one where something limits the options in a way the first task did not. Money, time, another person's agreement, or something you are not allowed to do.",
          
          "The constraint actually shapes the steps rather than being mentioned in passing, human-only steps marked, and a seam named.",[
            { key: "task", label: "The task and the constraint", hint: "One line each. What is it, and what limits you.", minWords: 10 },
            { key: "steps", label: "The steps, in order", hint: "Mark any step that must stay human-only.", minWords: 18 },
            { key: "seam", label: "The seam that worried you most", hint: "The step where the next step goes wrong if this one is slightly off.", minWords: 10 },
          ], [
            { label: "The constraint is actually reflected in the steps" },
            { label: "Human-only steps are marked" },
            { label: "The seam is identified concretely" },
          ], "transferable"),
      ],
    },

    {
      id: "C3", name: "Giving AI a Role",
      canDo: "Give the AI a defined job on each step — and recognise the steps where a confident answer is a warning rather than a result.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You ask a model a factual question it has no way of checking. It answers — fluently, specifically, with dates and numbers — and you find out ten minutes later that it invented the citation. The model was not being unreliable. It was answering from the only place it has: its training. Nothing in your prompt told it that was not allowed here.",
          point: "A model has no built-in sense of when it is guessing. You have to supply that boundary, every time.",
        },
        explain: {
          heading: "Four roles, and the one that matters most",
          story: "Do-it (produce the artefact). Assist (propose, you decide). Check (look for specific named problems). Stay out (do not use AI at all). Most bad AI use is a stay-out step given a do-it role: the step that needs a judgement about your actual situation, or a commitment, or a consequence you cannot undo.",
          point: "The highest-value question is not 'how do I prompt this' but 'should this step use AI at all'.",
        },
        demonstrate: {
          heading: "Same step, two roles",
          story: "Summarising a document: do-it is fine, and fast. Deciding whether the document means the project is off track is stay-out — it depends on context the model does not have and consequences that are yours. Drafting the sentence that tells the team is assist — you know the tone and the politics; it just words it faster.",
          point: "Same document, same model, three different correct roles. Role is a decision, not a default.",
        },
        deconstruct: {
          heading: "Why models confabulate rather than hedge",
          story: "A language model produces the most plausible continuation, not a lookup. When it does not have the specific fact, the most plausible continuation of \"the study by\" is a study that sounds real, with an author and a year. Fluency is generated; it is not evidence of recall. This is why \"the model said so\" is never a check, and why anything you have not supplied must be asked for explicitly or not trusted.",
          point: "Plausible-sounding is the model's default output quality. It tells you nothing about whether it is right.",
        },
        guided: {
          heading: "Name the source for every claim",
          story: "For each step, decide where the facts are allowed to come from: what you supplied, a document you attached, a source it may search, or nowhere. \"Answer from the document\" and \"if it is not in the document, say so\" are two of the highest-value phrases in prompting, precisely because they remove the default.",
          point: "Ground it, or forbid it. The middle is where invented citations live.",
        },
      },
      challenges: [
        fieldsChallenge("C3.1", "Reproduce", "Assign roles across your workflow", "For each step of your C2 workflow, give the AI a role and a one-line reason.", 
          "A role on every step with a stated reason, at least one step honestly marked stay-out, the step most exposed to confident error identified, and the permitted source of facts stated per step.",[
          { key: "roles", label: "Role per step", hint: "step → do-it / assist / check / stay out, and why. \"Stay out\" is a real answer and often the right one.", minWords: 18 },
          { key: "wrong", label: "Where it could be confidently wrong", hint: "The step most exposed to a plausible-sounding wrong answer. What would it get wrong, and how would it sound while being wrong?", minWords: 12 },
          { key: "source", label: "Where the facts may come from", hint: "Per step: what you supplied, a document, a searchable source, or nowhere. What must it not invent?", minWords: 10 },
        ], [
          { label: "Every step has an explicit role and reason" },
          { label: "At least one step is honestly marked stay-out" },
          { label: "The confident-failure step is named" },
          { label: "Sources of truth are constrained per step" },
        ], "transferable"),

        scenarioChallenge("C3.2", "Reproduce", "The confident answer", "You build a small tool that answers questions about your own documents. A user asks something their document does not cover. The system replies with a specific, well-cited answer — and there is no such citation in the document. What is actually happening, and what is the fix?",
          "Why is this happening, and what do you change?",
          [
            { label: "Nothing — the model found the answer elsewhere", why: "There is no evidence it searched, and the user was told a citation exists. The likely cause is generation, not retrieval." },
            { label: "The model completed the citation pattern rather than retrieving it", ok: true, why: "Correct. It generates the most plausible continuation, so a missing citation becomes an invented one. This is why 'the model said so' is never a check." },
            { label: "The document is too short and needs expanding", why: "Length is not the issue at all. The issue is that nothing told the model to refuse when the document does not cover the question." },
            { label: "The user should not ask questions like that", why: "That punts the problem onto the user and will fail constantly in practice. The failure is in the system's design, not in the question." },
          ],
          "independent"),

        fieldsChallenge("C3.3", "Transfer", "Write the refusal into the prompt", "Take the step from C3.1 where AI could be confidently wrong, and write the instruction that makes it say \"I don't know\" instead of inventing.", 
          "The change names a specific failure it prevents, constrains where facts may come from, and acknowledges what it still cannot fix.",[
          { key: "before", label: "How you asked before", hint: "The prompt or request as it stands.", minWords: 12 },
          { key: "after", label: "How you ask now", hint: "What you changed, and which specific failure it prevents.", minWords: 15 },
          { key: "still", label: "What it can still get wrong", hint: "Being explicit removes one failure. It does not make the model reliable. Name what remains.", minWords: 12 },
        ], [
          { label: "The change constrains the source of truth" },
          { label: "The failure prevented is named specifically" },
          { label: "Residual risk is acknowledged rather than implied solved" },
        ], "transferable"),
      ],
    },

    {
      id: "C4", name: "Verification",
      canDo: "Choose checks that could actually catch the error — because the check that fails to catch it is worse than no check at all.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "Someone's AI output \"passed review\" — and the review was the AI reading its own work. It agreed with itself, found nothing, and produced a clean report. The check ran, took time, and made everyone more confident in something nobody had examined. That is worse than no check, because it manufactures certainty.",
          point: "A check that cannot fail is not reassurance. It is decoration.",
        },
        explain: {
          heading: "Checks that can fail",
          story: "For each output, name the specific way it could be wrong, then pick a check that would catch that particular failure. A check that catches a different failure is not a check on this one. You can verify this yourself: state the wrong answer you are looking for. If you cannot imagine what it would look like, you do not know what you are checking for.",
          point: "Write down the failure you are hunting. Then the check has a target.",
        },
        demonstrate: {
          heading: "Ask the AI whether it is correct",
          story: "You paste an AI's answer back to a model and ask \"is this correct?\" It is very likely to say yes, and to be persuasive about it — it is optimised to continue coherently, and agreeing with the text in front of it is the coherent continuation. Asking a model to grade its own output is asking the thing that produced the error whether it made an error.",
          point: "The most reassuring check is the one most likely to pass. Be suspicious of checks whose failure mode is \"it was fine\".",
        },
        deconstruct: {
          heading: "Independence is the property that matters",
          story: "A check is worth something when it does not share the failure modes of the thing it checks. A second identical AI pass shares everything — same training, same blind spots, same confident gaps — which is why a second opinion from the same model is a re-run, not a review. An actual test, a real lookup, a person who can tell, or a different kind of check entirely: those are worth something.",
          point: "Same model, second prompt = the same answer twice. That is repetition, not corroboration.",
        },
        guided: {
          heading: "Reject conditions in advance",
          story: "Decide before you look what would make you reject the output. \"If any citation is missing, I reject it\" is a rule you can apply in ten seconds. Deciding afterwards, knowing what you were hoping for, is how a bad output gets signed off.",
          point: "Write the reject rule now, while you are not invested in the answer.",
        },
      },
      challenges: [
        fieldsChallenge("C4.1", "Reproduce", "Design checks for your workflow", "Design the verification for your workflow's most consequential output.", 
          "Named check methods, each aimed at a stated target failure, with concrete reject conditions decided before the output is seen.",[
          { key: "checks", label: "What gets checked, and how", hint: "Output → the specific check → who or what does it. Name the check, not the intention to check.", minWords: 18 },
          { key: "target", label: "The failure you are hunting", hint: "Write down the specific wrong answer this check exists to catch. If you cannot state it, the check has no target.", minWords: 12 },
          { key: "reject", label: "What would make you reject it", hint: "Concrete conditions, decided in advance. 'It looks off' is not a condition.", minWords: 10 },
        ], [
          { label: "Each check names a specific method" },
          { label: "The target failure is stated concretely" },
          { label: "Reject conditions are concrete and set in advance" },
        ], "transferable"),

        critiqueChallenge("C4.2", "Reproduce", "This check cannot fail", "Someone's whole verification for an AI system is below. Explain why it verifies almost nothing, and redesign it.", "After the AI writes it, I ask the AI 'is this correct and accurate?' — it says yes, so I send it.",
          [
            { label: "The checker shares the failure modes of the thing checked", signals: ["same model", "self", "shares", "same blind spots", "not independent", "same system", "correlated", "same weaknesses"] },
            { label: "Agreeing is the model's most likely output, so it almost always passes", signals: ["always says yes", "biased toward", "will agree", "compliant", "agrees", "not a meaningful signal", "always passes"] },
            { label: "There is no target failure stated", signals: ["no failure", "not looking for", "no target", "nothing to catch", "no idea what wrong looks like", "unspecified"] },
            { label: "No source is checked against anything", signals: ["not checked against", "no lookup", "no verification of facts", "not compared to", "no reference", "nothing external", "no ground truth"] },
          ],
          "independent",
          "We verify every output. The AI reviews its own work and confirms accuracy, and it passed our check.",
          "For each claim, look it up in the source document and quote the line — if there is no supporting line, the claim is rejected. For each number, recompute it. Run the test suite; a failing test is a rejection regardless of how the output reads. I review anything that changes what we tell a customer or what we spend. Anything that fails a check goes back with the specific failed claim named."),

        fieldsChallenge("C4.3", "Transfer", "Find the check you have been trusting", "Think of a check you currently rely on that is really the AI agreeing with itself — a second pass, a \"let me review\" prompt, a confidence-sounding output. Name it, and say what would actually catch its failures.", 
          "A specific existing practice, the failure mode it shares with the thing it checks, and a concrete replacement action.",[
          { key: "check", label: "The check you have been trusting", hint: "What you do now, specifically — the exact prompt, the re-run, the glance. Name the habit, not the intention behind it.", minWords: 12 },
          { key: "why", label: "Why it cannot catch the real failures", hint: "What it shares with the thing it is checking: same model, same blind spots, same thing that produced the error in the first place.", minWords: 12 },
          { key: "replacement", label: "What would actually catch them", hint: "A lookup, a test, a person, a different kind of check. Name it concretely.", minWords: 12 },
        ], [
          { label: "The existing check is described specifically, not abstractly" },
          { label: "The shared failure mode is identified" },
          { label: "The replacement is a concrete action, not a stronger feeling" },
        ], "transferable"),
      ],
    },

    {
      id: "C5", name: "Testing",
      canDo: "Test on cases that could actually go wrong — especially the awkward one — and write down what happened rather than what you hoped.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You try your workflow on the three examples that obviously work, it works on all three, and you conclude it works. None of them were interesting. The failure you get in real use is in the case you did not try — the ambiguous one, the one where the input is longer than expected, the one with a typo, the one where two reasonable interpretations exist.",
          point: "Testing on cases that work proves nothing. You are testing whether the awkward case is handled.",
        },
        explain: {
          heading: "Realistic beats representative",
          story: "A good test case is one taken from something that actually happened, or plausibly could: the messy real input, the edge of the range, the one with contradictory information. Synthetic tidy examples mostly confirm that the tidy case works, which you already knew.",
          point: "Choose the case you would be least confident about, not the one you are most confident about.",
        },
        demonstrate: {
          heading: "The awkward case is the informative one",
          story: "A summarising tool works beautifully on three clean documents. Try it on a document that contains three contradictory versions of the same number and it produces something confident and internally inconsistent. That single test tells you more than the three clean ones combined — and it tells you which rule to add.",
          point: "One well-chosen hard case beats ten tidy ones. Find the case that makes it break.",
        },
        deconstruct: {
          heading: "AI output is not fixed, so one run is not a test",
          story: "Run the same prompt on the same case and you may get a different answer — usually similar, occasionally not. This breaks ordinary intuition: run it once, it looks fine; run it later, it looks broken; and you cannot tell whether your change caused that or the model just rolled differently. \"It worked when I tried it\" is therefore not evidence about anything. If a result varies, you need to know the variation before you can attribute a change to yourself — and if the variation is large, that is a finding in its own right, not noise to average over.",
          point: "Record what happened per run. Re-run before concluding that a change helped.",
        },        guided: {
          heading: "Test the thing you changed, and write it down",
          story: "After any change, re-run the same case and compare. Without the before, you cannot tell whether the change helped or you just got a different answer this time — which, given that AI output varies run to run, is the more likely explanation. Write it down while it is fresh, including the parts that were mediocre and the part you fixed by hand without noticing you had. The record is what lets you improve systematically rather than re-improvising.",
          point: "Same case, before and after, written down. Otherwise you are reading noise.",
        },
      },
      challenges: [
        fieldsChallenge("C5.1", "Reproduce", "Test your workflow honestly", "Run your workflow on at least two cases — one ordinary, one deliberately awkward — and report what actually happened.", 
          "At least one genuinely hard case, failures reported including anything fixed by hand, and a specific surprise.",[
          { key: "cases", label: "The cases you tested", hint: "Which, and why is each a realistic or hard case? 'Because it is an example' is not why.", minWords: 15 },
          { key: "happened", label: "What actually happened", hint: "Per case: did it hold, and where did it strain, drift or break? Include what you fixed by hand.", minWords: 20 },
          { key: "surprise", label: "The bit that surprised you", hint: "The thing you did not expect. This is usually the most useful sentence you write.", minWords: 10 },
        ], [
          { label: "At least one case is genuinely hard" },
          { label: "Failures are reported, including manual fixes" },
          { label: "The surprise is specific" },
        ], "transferable"),

        scenarioChallenge("C5.2", "Reproduce", "One test case, one hour", "You have one hour before you start relying on this. You can test exactly one case. Which one do you pick?", "Which case do you run, and why that one?",
          [
            { label: "The case most likely to be common in real use", why: "Reasonable — the common case is genuinely worth knowing about. But it is the one you have the least reason to doubt, so an hour spent there buys the least information. With one hour, spend it where you are unsure rather than where you are not." },
            { label: "A typical, straightforward case", why: "It will probably pass, which tells you almost nothing you did not already assume. This is the comfortable choice, not the informative one." },
            { label: "The case you are least confident about, drawn from something real", ok: true, why: "Correct. An hour spent confirming what you already believe is worth less than an hour spent finding out where it breaks, especially if the break is expensive." },
            { label: "Any case at all, to confirm the pipeline runs", why: "That only tests that nothing crashed. Plausible-looking output on an easy case is exactly what you get when it is broken in the ways that matter." },
          ],
          "independent"),

        fieldsChallenge("C5.3", "Transfer", "Write down the record", "Turn your C5.1 test into something you could act on next month, when you have forgotten all of it.", 
          "A retained test case specific enough to re-run, changes tied to observed failures, and remaining uncertainty named.",[
          { key: "keep", label: "What to keep", hint: "The case, what it does, why it is a useful permanent test.", minWords: 12 },
          { key: "fix", label: "What broke and what you changed", hint: "Specific: the failure, the change, the predicted effect.", minWords: 15 },
          { key: "next", label: "The next test you would run", hint: "The case you would try with more time. What are you still unsure about?", minWords: 10 },
        ], [
          { label: "The permanent test is specific enough to re-run" },
          { label: "Changes are linked to observed failures" },
          { label: "Remaining uncertainty is named" },
        ], "transferable"),
      ],
    },

    {
      id: "C6", name: "Improvement",
      canDo: "Change the work because a test showed a specific problem — and check the change actually helped.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "Output is mediocre. You add three sentences to the prompt. Output is slightly different. You conclude the prompt change helped, because the new output looks better than the old one. You do not know whether it is better or you simply got a different answer this time — and you have now made the prompt longer without evidence.",
          point: "Changing something and seeing different output is not evidence that the change worked.",
        },
        explain: {
          heading: "Change one thing, against a case that failed",
          story: "Improvement starts from a specific failure on a specific case. Change the thing you believe is responsible. Re-run the same case. If you cannot name the failure you are fixing, you are not improving, you are fiddling — and fiddling makes prompts longer and less predictable.",
          point: "Name the failure, change one thing, re-run the case that showed it.",
        },
        demonstrate: {
          heading: "The change that helped, and the one that did not",
          story: "Your summaries are too long. You ask for shorter — output is shorter but loses the caveats you needed. You try again: \"six bullets, most important first; keep the caveats\" — now it is both shorter and still complete. The difference is that the second change was aimed at the failure the first one created, and you tested for it.",
          point: "A fix that removes one problem and quietly creates another is not a fix. Test for the second one.",
        },
        deconstruct: {
          heading: "When to change, and when to revert",
          story: "Some improvements are real and some are noise. If the same case gives a different answer each run, you cannot tell whether your change worked — which means either the check is not stable enough to measure, or you need to run it more than once before concluding anything. If fixing one thing reliably breaks another, that is information about the task, not a reason to keep pushing.",
          point: "If you cannot tell whether it improved, you have not finished testing, not finished improving.",
        },
        guided: {
          heading: "Keep the version that worked",
          story: "Save the change alongside the case and the result. Without that, you will make the same change again in six months, or undo something that was deliberate.",
          point: "Improvement you cannot reproduce is indistinguishable from luck.",
        },
      },
      challenges: [
        fieldsChallenge("C6.1", "Reproduce", "Improve from a real finding", "Pick one specific failure from your C5 testing and fix that, showing the before and after.", 
          "A change aimed at a named observed failure, before and after on the same case, and possible new problems actually checked rather than assumed away.",[
          { key: "weakness", label: "The failure and the change", hint: "Weakness → the specific change → why you expect it to help. Not 'improve the prompt'.", minWords: 18 },
          { key: "beforeafter", label: "Before and after on the same case", hint: "Same case, both outputs. What measurably changed?", minWords: 18 },
          { key: "broke", label: "What the change might have broken", hint: "Anything the new version now does worse. Did you check?", minWords: 10 },
        ], [
          { label: "The change targets a named observed failure" },
          { label: "Before and after use the same case" },
          { label: "Possible new problems are checked, not just hoped about" },
        ], "transferable"),

        scenarioChallenge("C6.2", "Reproduce", "Change or revert?", "You changed a step to fix a problem. On re-test the original problem is gone — but a smaller new one has appeared. What do you do?", "What do you do, and why?",
          [
            { label: "Revert immediately — the new problem is worse", why: "Premature. The original problem was the reason you made the change in the first place, so reverting reinstates it. Compare the two problems by cost rather than by recency, before deciding." },
            { label: "Keep the change — the new problem is smaller", why: "The reasoning is right but it skips the work. You still need to know whether the smaller problem is acceptable, and whether you can fix it without losing the original gain. Calling it smaller is not yet a decision." },
            { label: "Name both problems, weigh them, then try a third option that keeps the gain and fixes the new one", ok: true, why: "Correct. You are not choosing between the old version and the new one — you are identifying what specifically caused the new problem and whether it can be removed without losing the improvement." },
            { label: "Ignore it — smaller problems are normal", why: "This does not hold up as a decision rule. A smaller problem still has to be understood, and an unexamined regression is how a system quietly gets worse, one small fix at a time. Small is not the same as acceptable." },
          ],
          "independent"),

        fieldsChallenge("C6.3", "Transfer", "Make one improvement reproducible", "Take your C6.1 change and record it so that in six months you could re-apply it deliberately rather than re-deriving it.", 
          "The change recorded concretely, the validating case retained, and the condition for re-using it stated.",[
          { key: "what", label: "The change itself", hint: "The exact before and after — the words or steps, not a description of them.", minWords: 15 },
          { key: "case", label: "The case that shows it worked", hint: "Kept somewhere you will find it.", minWords: 10 },
          { key: "trigger", label: "When to use it again", hint: "The situation you would re-apply this in. If you cannot say, you will not recognise it when it happens.", minWords: 10 },
        ], [
          { label: "The change is recorded concretely, not described" },
          { label: "The validating case is identified and retained" },
          { label: "The reuse condition is stated" },
        ], "transferable"),
      ],
    },

    {
      id: "C7", name: "Limits and Responsibility",
      canDo: "Write the boundary, the human check and the wider-use risk before someone finds them the hard way.",
      lesson: {
        activate: {
          heading: "When this goes wrong",
          story: "You paste something sensitive into a tool because it was the fastest way to get an answer. Nothing bad happens, so it becomes how you work. Six months later you cannot tell which of your inputs went where, and you cannot answer the question you are now being asked.",
          point: "The risk is not the one time. It is that a habit becomes normal before you have decided whether it should be.",
        },
        explain: {
          heading: "What leaves your hands",
          story: "A prompt you send to a hosted model is not a note to yourself. It leaves your machine, and depending on the provider and its settings it may be logged, retained, reviewed by a human for safety, or used to improve future models. That is often disclosed in a document nobody reads. The question is not \"is this service safe\" in the abstract — it is specific to your data: what do you send, what does the provider do with it, how long is it kept, and who else can see it. Personal data, other people's data, anything under NDA, anything you would not put in an email to a stranger: those have a different answer than your own rough notes.",
          point: "Sending something is a disclosure. Ask what you would be comfortable explaining afterwards.",
        },
        demonstrate: {
          heading: "The check before you paste",
          story: "Before sending anything: is this mine to share, or someone else's? Does it contain anything identifying — names, addresses, health, financial, credentials? Would I be comfortable if it appeared in a screenshot? If any answer is unclear, the answer is to generalise it or ask. Three seconds, and it catches most of what matters.",
          point: "Generalising often works fine. \"Customer aged 67, medication review overdue\" is usually enough to get the useful answer.",
        },
        deconstruct: {
          heading: "The wider use risk",
          story: "There is a second-order risk: what becomes normal because you did it once. If AI drafts something you did not verify and nobody objects, it gets harder to verify next time. Skills atrophy quietly — you stop checking because checking has become optional. The boundary worth writing is not only about data; it is about which judgements you keep making yourself.",
          point: "Automation you stop checking is not saved time. It is an unmonitored system you now depend on.",
        },
        guided: {
          heading: "Write it down where you will see it",
          story: "A boundary you keep only in your head is not a boundary. Write the two or three lines: what this is not for, who checks it, what you will not paste. Put it where the work happens.",
          point: "Three lines, visible, beats a policy nobody reads.",
        },
      },
      challenges: [
        fieldsChallenge("C7.1", "Reproduce", "Write your boundary note", "For your own workflow and real task, write the short note you would actually keep.", 
          "A specific boundary, a human check naming both a point and a person, and an identified second-order habit risk.",[
          { key: "notfor", label: "What this is not for", hint: "Be specific. 'Sensitive data' is not a boundary; 'anything identifying another person' is.", minWords: 12 },
          { key: "human", label: "The human check, and who does it", hint: "Where in the process, and by whom. 'A person reviews it' is not a step.", minWords: 12 },
          { key: "wider", label: "The habit risk", hint: "What becomes normal because you did this once. What judgement are you at risk of ceasing to make yourself?", minWords: 12 },
        ], [
          { label: "The boundary is specific enough to apply" },
          { label: "The human check names a point and a person" },
          { label: "Second-order habit risk is identified" },
        ], "transferable"),

        fieldsChallenge("C7.2", "Transfer", "Check your own inputs", "Look at what you actually send to AI tools for this task, and check it against your own boundary.", 
          "Inputs described by category, the uncomfortable part acknowledged honestly, and at least one concrete change named.",[
          { key: "what", label: "What you are sending", hint: "The categories, not a confession. Notes, documents, other people's details, anything identifying.", minWords: 12 },
          { key: "risk", label: "What is in there that you would not publish", hint: "Be honest here — this is the useful part. Another person\u2019s details, credentials, health or financial specifics, anything under an agreement.", minWords: 12 },
          { key: "fix", label: "What you will change", hint: "What to stop sending, what to generalise, what to ask about first.", minWords: 12 },
        ], [
          { label: "The inputs are described by category" },
          { label: "The uncomfortable part is acknowledged" },
          { label: "At least one concrete change is named" },
        ], "transferable"),

        scenarioChallenge("C7.3", "Reproduce", "The fastest path", "You need an answer now. The fastest way to get it means pasting a document containing another person's name, address and medical details into a tool you do not control. Is that the right call?", "What do you do?",
          [
            { label: "Yes — it is public, the information is technically already known, and the answer is needed now", why: "Publicly available is not the same as appropriate to disclose. You are also reasoning under time pressure, and the pressure is real, but this is not a process. It is a justification." },
            { label: "Yes, but remove the identifying details first", why: "This is the right instinct, though it needs the discipline to be a habit rather than a decision made once under pressure. Generalising usually loses nothing you needed." },
            { label: "No — generalise the details first, or use an approved channel", ok: true, why: "Correct. The identifying details are usually not needed for the answer, so removing them costs almost nothing and removes the disclosure. If they are needed, that is the moment to use a channel you control." },
            { label: "No — never send documents to any external tool", why: "A defensible position, but Too absolute to apply. A rule with no exceptions gets abandoned the first time it is inconvenient, and a boundary you keep breaking is not a boundary." },
          ],
          "independent"),
      ],
    },
  ];

  return { competencies: COMPETENCIES, capstoneId: "FNDCP1" };
};
