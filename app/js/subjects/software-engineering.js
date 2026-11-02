/* Subject: software-engineering
 *
 * Computer engineering: the software track. A learner builds real software from scratch
 * — reading code, writing it, debugging it, version-controlling it, and testing it —
 * without an AI doing it for them. This is Phase A.1 of docs/12-expansion-map.md.
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 *
 * Each competency now carries `resources` (authoritative external learning materials) and
 * `selfCheck` (verification questions the learner answers before moving on) so the learning is
 * provable without relying on a model-scored verdict.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["software-engineering"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const SWE_COMPETENCIES = [
  {
    id: "SWE1", name: "Read & understand code",
    canDo: "Read a short program and explain what it does, line by line, including the edge cases.",
    resources: [
      { title: "Learn web development (MDN)", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", type: "course", description: "Start here if you've never coded before — setup, editors, command line, your first website." },
      { title: "JavaScript Guide — Introduction (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction", type: "reference", description: "JavaScript fundamentals: what it is, how to run it, where to find reference material." },
      { title: "Supercharge Learning to Code with the Feynman Technique (DEV)", url: "https://dev.to/rwparrish/supercharge-learning-to-code-with-the-feynman-technique-502o", type: "article", description: "Learn by teaching each step aloud — gaps in your understanding show up immediately." },
    ],
    selfCheck: [
      "Can I name the inputs and the output of this function in one sentence?",
      "Can I trace one concrete input through every line, writing each variable's value as it changes?",
      "Can I name at least one input where this code behaves wrongly or confusingly?",
      "Could another person read my explanation and predict the same output I do?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A teammate handed over a 30-line function. You ran it, it worked on your input, so you shipped it. Two days later a customer hit an empty-list case the function silently dropped — because nobody had actually read the loop condition.",
        point: "Running code is not understanding it. You need to read the logic, not just the output.",
      },
      explain: {
        paras: [
          "Read code the way you'd read a recipe: identify the inputs, what happens at each step, and what comes out at the end.",
          "Name every variable and function by what it actually holds or does, not by what you hope it means.",
          "Look for branches (if/else), loops, and early returns — those are where edge cases hide.",
          "Trace one concrete input through every line, writing down each variable's value as it changes.",
        ],
        keyIdea: "Trace one real input through the code, line by line, writing down each value. That's reading; everything else is guessing.",
      },
      demonstrate: {
        task: "Read this function and say exactly what it returns for the input [5, 3, 8, 1, 9].",
        steps: [
          { move: "Name inputs and output", think: "numbers is an array; the function returns a number.", result: "Input: [5, 3, 8, 1, 9]. Output: the largest value." },
          { move: "Trace with a concrete case", think: "Follow max = numbers[0] = 5, then compare each next item.", result: "5→5, 3→5, 8→8, 1→8, 9→9. Returns 9." },
          { move: "Check the edge cases", think: "Empty array? numbers[0] crashes. Negative numbers? The comparison still works.", result: "Empty array is the bug — it needs a guard first." },
          { move: "State it in one sentence", think: "Summarise the behaviour precisely.", result: "It returns the largest number, but crashes on an empty array." },
        ],
        full: "It loops through the array keeping the running maximum in max, starting from numbers[0], and returns max at the end. For [5, 3, 8, 1, 9] it returns 9. It crashes if the array is empty.",
      },
      deconstruct: [
        "Naming inputs/outputs first keeps the trace anchored to what the function actually does.",
        "Tracing one concrete case catches errors a skim-read misses — max never changed on 3, which confirmed the comparison direction.",
        "The edge case (empty array) was invisible until we asked 'what if there is no first item?'.",
        "Visual trace for [5, 3, 8, 1, 9]:\n  max=5 → compare 3 (no change) → max=8 (8>5) → max=8 (1<8) → max=9 (9>8) → return 9",
      ],
      guided: {
        intro: "Your turn. Read this snippet and answer the fields. Then reveal the model answer.",
        task: "What does this do, and when does it misbehave?\n\n  function total(items) {\n    let sum = 0;\n    for (let i = 0; i <= items.length; i++) {\n      sum += items[i];\n    }\n    return sum;\n  }",
        fields: [
          { key: "behaviour", label: "What it does", hint: "One sentence: inputs → output.", minWords: 6 },
          { key: "bug", label: "When it misbehaves", hint: "Name the input that breaks it and why.", minWords: 8 },
          { key: "fix", label: "The one-line fix", hint: "Change the smallest thing that makes it correct.", minWords: 4 },
        ],
        model: {
          behaviour: "It adds up every number in items and returns the total.",
          bug: "When items has any length, i reaches items.length on the last iteration, so items[i] is undefined and sum becomes NaN. The loop should be i < items.length.",
          fix: "Change `i <= items.length` to `i < items.length`.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SWE1.1", "Reproduce", "Read a real function",
        "Take a short function from your own code or a public example. Explain what it does, trace one input through it, and name its edge case.",
        "Strong answer: names inputs/outputs, traces a concrete case line by line, and identifies a real edge case the code mishandles.",
        [
          { key: "source", label: "The function", hint: "Paste it or describe it precisely — language, name, parameters.", minWords: 8 },
          { key: "trace", label: "Trace one input", hint: "A concrete input and the value of each variable after each step.", minWords: 12 },
          { key: "edge", label: "The edge case", hint: "An input where the code behaves wrongly or confusingly.", minWords: 8 },
        ],
        [
          { label: "Inputs and outputs named clearly" },
          { label: "Concrete trace, line by line" },
          { label: "A real edge case identified" },
        ],
        "independent"),
      scenarioChallenge("SWE1.2", "Adapt", "The code works, but does it?",
        "A function returns the right answer for the example you tried. Before you use it, what do you check?",
        "What do you check first?",
        [
          { id: "a", label: "Nothing — if it works once it works always", ok: false, why: "One working case says nothing about the other cases it will see." },
          { id: "b", label: "Try a few more inputs, especially empty, zero, negative, and very large ones", ok: true, why: "Edge cases are where reading matters most — one passing example is not evidence." },
          { id: "c", label: "Ask the person who wrote it", ok: false, why: "They may not know either, and you still can't verify it yourself." },
        ],
        "transferable"),
    ],
  },
  {
    id: "SWE2", name: "Write clean, working code",
    canDo: "Write short, readable programs that do one thing and do it correctly.",
    resources: [
      { title: "The Clean Code Handbook (freeCodeCamp)", url: "https://www.freecodecamp.org/news/the-clean-code-handbook", type: "guide", description: "12 clean code principles: meaningful names, laser-focused functions, thoughtful comments, readable structure." },
      { title: "How to Write Clean Code — Tips for Developers (freeCodeCamp)", url: "https://www.freecodecamp.org/news/how-to-write-clean-code-tips-for-developers", type: "article", description: "10 practical tips: meaningful names, single responsibility, readable formatting, consistent conventions." },
      { title: "Guidelines for Writing Code Examples (MDN)", url: "https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide", type: "reference", description: "MDN's own code style: short examples, one feature at a time, understandable over clever." },
    ],
    selfCheck: [
      "Does every variable and function name say what it holds or does — not its type?",
      "Does each function do exactly one thing I can name in a single phrase?",
      "Is the happy path easy to see (flat structure, early returns, no deep nesting)?",
      "Do my comments explain *why*, not *what* (the code itself shows the what)?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You wrote a clever one-liner that filtered and transformed a list in six nested calls. It worked. Six weeks later, including by you, nobody could tell what it did — so a small change broke it silently.",
        point: "Code is read far more often than it is written. Clever that no one can read is a liability, not an asset.",
      },
      explain: {
        paras: [
          "Give variables and functions names that state their purpose, not their type (use `customerCount`, not `n` or `cnt`).",
          "Do one thing per function. A function should be short enough to name in a single phrase.",
          "Prefer flat code over deep nesting — early returns keep the happy path visible.",
          "A comment explains *why*, not *what*; the code itself should make the *what* obvious.",
        ],
        keyIdea: "Write for the next reader — including yourself in six weeks. Names, single-purpose functions, and flat structure beat cleverness every time.",
      },
      demonstrate: {
        task: "Write a function that takes ages (years) and returns only the ones that are leap years.",
        steps: [
          { move: "Name it well", think: "isLeapYear or filterLeapYears — says what it does.", result: "function filterLeapYears(years) { ... }" },
          { move: "One rule per check", think: "Divisible by 4, unless by 100, unless by 400.", result: "Three conditions, each obvious on its own line." },
          { move: "Flat structure", think: "Return early instead of nesting ifs.", result: "Filter with a guard-style condition, no nesting three levels deep." },
          { move: "Name the loop variable", think: "Not i — year.", result: "for (const year of years) reads like a sentence." },
        ],
        full: "function filterLeapYears(years) { return years.filter(y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0); } — one line, one job, a name that says exactly what it returns.",
      },
      deconstruct: [
        "The name `filterLeapYears` tells a reader what to expect before they read the body.",
        "The condition is one expression but each part is meaningful — no magic numbers without context.",
        "There is no nesting: filter + a single condition keeps the happy path on one line.",
        "Before/after:\n  Bad: function x(a) { let r = 0; for (let i = 0; i < a.length; i++) { if (a[i] > 10) r += a[i]; } return r; }\n  Good: function sumOverTen(numbers) { let total = 0; for (const number of numbers) { if (number > 10) total += number; } return total; }",
      ],
      guided: {
        intro: "Your turn. Write this function, then compare with the model answer.",
        task: "Write a function longestWord(sentence) that returns the longest word in a sentence.",
        fields: [
          { key: "name", label: "Function name", hint: "Say what it returns.", minWords: 2 },
          { key: "steps", label: "The steps in plain order", hint: "Split → find longest → return it.", minWords: 8 },
          { key: "edge", label: "The edge case you handled", hint: "Empty string? Tied lengths?", minWords: 6 },
        ],
        model: {
          name: "longestWord",
          steps: "Split the sentence into words; track the longest seen; return it. If the sentence is empty, return an empty string.",
          edge: "An empty input returns '' instead of crashing on an undefined word.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SWE2.1", "Reproduce", "Write a small program",
        "Write a short function that solves a real, tiny problem you actually have (convert units, format a name, validate a length). Keep it under 15 lines.",
        "Strong answer: a focused function, a descriptive name, correct for the normal case, and one edge case considered.",
        [
          { key: "name", label: "Function name", hint: "Describes what it returns.", minWords: 2 },
          { key: "code", label: "The code", hint: "Under 15 lines, one job.", minWords: 10 },
          { key: "example", label: "One input and its output", hint: "Show it works on a real case.", minWords: 6 },
        ],
        [
          { label: "Name says what it returns" },
          { label: "Under 15 lines, one job" },
          { label: "A concrete input→output example" },
        ],
        "independent"),
      critiqueChallenge("SWE2.2", "Adapt", "Review this function",
        "Here is a function someone wrote. Say what is clear, what is confusing, and rewrite it so a reader could pick it up cold.",
        "  function x(a) {\n    let r = 0;\n    for (let i = 0; i < a.length; i++) {\n      if (a[i] > 10) r += a[i];\n    }\n    return r;\n  }",
        [
          { label: "Names tell nothing — x, a, r, i", signals: ["x is not a name", "a is not a name", "r is not a name", "i is not a name", "meaningless names", "single letter", "what does x do", "what does a hold"] },
          { label: "The purpose is hidden", signals: ["no comment", "unclear purpose", "what is it for", "does not say why", "hidden intent", "magic number 10"] },
          { label: "No edge-case handling", signals: ["empty", "null", "negative", "edge case", "no guard", "what if empty"] },
        ],
        "transferable",
        { text: `function sumOverTen(numbers) {
  // Returns the sum of numbers greater than 10.
  let total = 0;
  for (const number of numbers) {
    if (number > 10) total += number;
  }
  return total;
}`, changes: ["Renamed to sumOverTen so the purpose is obvious", "Renamed parameters: numbers instead of a, total instead of r", "Added a one-line comment stating what it returns", "Used for…of for clearer iteration"] }),
    ],
  },
  {
    id: "SWE3", name: "Debug & fix bugs",
    canDo: "Reproduce a bug, isolate the line that causes it, and fix it without breaking something else.",
    resources: [
      { title: "Debugging Code for Absolute Beginners (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/visualstudio/debugger/debugging-absolute-beginners", type: "guide", description: "Step through code in a debugger, find where the problem occurred, question your assumptions." },
      { title: "CS107 Debugging Guide (Stanford)", url: "https://web.stanford.edu/class/cs107/resources/debugging.html", type: "guide", description: "Observe the bug → reproducible input → narrow the search space → hypothesize → experiment → fix → validate." },
      { title: "Debugging tips and tricks for JavaScript beginners (freeCodeCamp)", url: "https://www.freecodecamp.org/news/debugging-javascript-for-beginners-5d4ac15dd1cd", type: "article", description: "console.log vs dev tools debugger, stepping through function calls, checking variable values." },
      { title: "What Is Debugging? (IBM)", url: "https://www.ibm.com/think/topics/debugging", type: "overview", description: "The six-step debugging process: reproduce → find → root cause → fix → test → document." },
    ],
    selfCheck: [
      "Can I reproduce the bug on purpose — the exact input that makes it happen, every time?",
      "Can I point to the single line that causes the wrong output?",
      "Did I change only one thing, then re-run to confirm the fix?",
      "Does the same input now give the correct output after my fix?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The checkout button stopped working. You changed three things at once — removed a validation, updated a library, rewrote the handler. It started working again, but you never knew which change fixed it, and a week later a different button broke the same way.",
        point: "Changing everything at once fixes nothing durably. Reproduce first, isolate second, fix one thing at a time.",
      },
      explain: {
        paras: [
          "Reproduce the bug on purpose: find the exact input that makes it happen, every time.",
          "Add logging or print statements at the boundaries — what went in, what came out, where it diverged.",
          "Bisect: comment out or revert half the code. If the bug disappears, it's in that half; repeat until you have one line.",
          "Change one thing, then re-run the reproduction. If it still fails, revert and try the next suspect.",
        ],
        keyIdea: "Reproduce reliably, then narrow to one line by halving the code. Fix that line, re-run, and confirm.",
      },
      demonstrate: {
        task: "A discount function returns 0 for every input. Find the bug.",
        steps: [
          { move: "Reproduce", think: "Call it with price=100, discount=20 → expect 80, got 0.", result: "Reproduced: 100 with 20% off returns 0, not 80." },
          { move: "Log the middle", think: "Print the discount amount before subtracting.", result: "The discount amount is computed as 0 — so price - 0 = price... wait, it returned 0?" },
          { move: "Bisect", think: "The discount amount line itself is wrong.", result: "It computes discount as price * (percent / 100) but percent is a string '20', so NaN → 0 after coercion." },
          { move: "Fix one thing", think: "Coerce percent to a number before multiplying.", result: "Changed `percent / 100` to `Number(percent) / 100`. Re-run: 80. Fixed." },
        ],
        full: "Reproduced: returns 0. Logged: discount amount was NaN. Bisected: `percent` arrived as the string '20'. Fixed: wrapped percent in Number(). Re-ran with the reproduction case: 80. Confirmed.",
      },
      deconstruct: [
        "Reproducing first meant we knew when it was actually fixed, not when it looked fixed.",
        "Logging the middle showed where the number went wrong — between input and output.",
        "Changing one thing (the coercion) and re-running confirmed the fix without side effects.",
        "Debugging flowchart:\n  Bug found → Reproduce it (exact input) → Log the middle → Bisect (halve the code) → One line found → Fix one thing → Re-run to confirm",
      ],
      guided: {
        intro: "Your turn. Debug this function, then reveal the model answer.",
        task: "average([10, 20, 30]) returns 30 instead of 20. Why?",
        fields: [
          { key: "repro", label: "The reproduction case", hint: "Exact input and the wrong output.", minWords: 6 },
          { key: "suspect", label: "The line you suspect", hint: "Point to the exact line and explain why.", minWords: 8 },
          { key: "fix", label: "The one-line fix", hint: "Change the smallest thing.", minWords: 4 },
        ],
        model: {
          repro: "average([10, 20, 30]) returns 30, should be 20.",
          suspect: "The return divides by the wrong thing — it divides by the last item (30) instead of the count (3), so 10+20+30=60 / 30... no, it divides sum by items[items.length-1] which is 30.",
          fix: "Change `items[items.length - 1]` to `items.length`.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SWE3.1", "Reproduce", "Fix a real bug",
        "Take a bug you've hit (or a small program that behaves wrongly). Reproduce it, isolate the line, fix it, and show before/after.",
        "Strong answer: exact reproduction, the single line identified, a minimal fix, and confirmation the same input now gives the right output.",
        [
          { key: "repro", label: "Reproduction case", hint: "Input and the wrong output you actually saw.", minWords: 8 },
          { key: "line", label: "The line that causes it", hint: "The exact line, and why it's wrong.", minWords: 8 },
          { key: "fix", label: "The fix and the result", hint: "What you changed and the correct output now.", minWords: 8 },
        ],
        [
          { label: "Exact reproduction with wrong output" },
          { label: "The causal line identified" },
          { label: "Minimal fix + correct result after" },
        ],
        "independent"),
      scenarioChallenge("SWE3.2", "Create", "Three changes at once",
        "You made three edits to fix a login failure, and now it works. A teammate asks which change fixed it. What do you say?",
        "What do you tell them?",
        [
          { id: "a", label: "All three together — they worked as a combo", ok: false, why: "You don't know which one mattered, so you can't reproduce the fix or prevent the next bug." },
          { id: "b", label: "Revert all three, then re-apply one at a time until it works again", ok: true, why: "That isolates the actual fix — the rest can stay reverted." },
          { id: "c", label: "It works now, so ship it — the cause doesn't matter", ok: false, why: "Without knowing the cause, the same class of bug will recur somewhere else." },
        ],
        "transferable"),
    ],
  },
  {
    id: "SWE4", name: "Version control with Git",
    canDo: "Track changes with Git: commit, branch, merge, and undo a mistake safely.",
    resources: [
      { title: "Pro Git Book (official)", url: "https://git-scm.com/book/en/v2", type: "book", description: "The entire Pro Git book by Scott Chacon and Ben Straub, free online — the reference working developers actually reach for." },
      { title: "Git — Learn (official)", url: "https://git-scm.com/learn", type: "official", description: "Pro Git book, beginner videos, cheat sheet with merge/rebase diagrams." },
      { title: "Git for Beginners: Visual Guide to Version Control (env.dev)", url: "https://env.dev/guides/git-getting-started", type: "visual guide", description: "Cloning, branching, committing, pushing, pull requests, conflict resolution — with VS Code and GitHub Desktop walkthroughs." },
    ],
    selfCheck: [
      "Can I make a commit on a branch with a message that says what changed and why?",
      "Can I find the last good commit with git log?",
      "Can I revert a breaking change without losing history?",
      "If I committed a secret, do I know to revoke the key first — then remove it from history?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You spent all afternoon refactoring a module. It broke everything, and you had no idea which of twenty edits caused it — because you never committed, so there was nothing to go back to.",
        point: "Commits are save points. Without them, a mistake has no undo button.",
      },
      explain: {
        paras: [
          "Commit early and often, with a message that says *what changed and why*, not \"stuff\".",
          "Work on a branch for each change, so a half-finished idea never blocks the main line.",
          "Merge only after the branch is tested, and resolve conflicts one file at a time.",
          "If you break something, `git revert` or `git checkout` gets you back to the last good commit — no re-typing from memory.",
        ],
        keyIdea: "Small commits on named branches = a safe undo button for every mistake.",
      },
      demonstrate: {
        task: "You added a feature on a branch, but it introduced a bug. Undo it cleanly.",
        steps: [
          { move: "Find the last good commit", think: "git log shows where it worked.", result: "Commit abc123 was the last green one." },
          { move: "Create a fix branch", think: "Never fix directly on main.", result: "git checkout -b fix/login-bug" },
          { move: "Revert the breaking commit", think: "Undo just that change, keep the rest.", result: "git revert <breaking-commit>" },
          { move: "Test and merge", think: "Green on the branch, then to main.", result: "Tests pass, merge to main with a clear message." },
        ],
        full: "Found last good commit (abc123). Branched fix/login-bug from main. Reverted the breaking commit. Tests green. Merged to main. Main still builds — the feature can be re-done properly.",
      },
      deconstruct: [
        "git log gave a named point to return to — without commits there is no 'last good'.",
        "A branch isolates the fix so main stays deployable while you work.",
        "git revert keeps history (the mistake is still recorded) but removes its effect — safer than rewriting.",
        "Visual: main branch ──●──●──● (green)\n                    └─ feature branch ──●──● (bug introduced)\n                    └─ fix branch ── revert ● ── merge back to main",
      ],
      guided: {
        intro: "Your turn. Answer the fields, then compare.",
        task: "You committed a secret API key by mistake. What do you do?",
        fields: [
          { key: "immediate", label: "The first thing", hint: "Not 'delete the file'.", minWords: 6 },
          { key: "revoke", label: "The thing that actually matters", hint: "The key itself, not the commit.", minWords: 6 },
          { key: "cleanup", label: "Removing it from history", hint: "Why a plain commit is not enough.", minWords: 6 },
        ],
        model: {
          immediate: "Stop — don't push or commit anything else that might contain it.",
          revoke: "Revoke the key immediately in the provider's dashboard. A key in a commit is already considered compromised.",
          cleanup: "Remove it from history with a history-rewrite tool (git filter-repo / BFG), then force-push — because deleting the file in a new commit leaves the key in the old commit.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SWE4.1", "Reproduce", "Commit a real change",
        "Make a real Git commit for a small change you've made. Show the command, the message, and what the commit contains.",
        "Strong answer: a real git commit message (imperative, explains what and why), the branch name, and confirmation the commit is on that branch.",
        [
          { key: "branch", label: "The branch", hint: "Named for the change, not 'main' or 'fix' unless that's accurate.", minWords: 4 },
          { key: "message", label: "The commit message", hint: "Imperative mood: 'Add', 'Fix', not 'Added' or 'fixing'.", minWords: 6 },
          { key: "contains", label: "What changed", hint: "Files and the one-line summary of each.", minWords: 8 },
        ],
        [
          { label: "A real branch name for the change" },
          { label: "Imperative commit message explaining what and why" },
          { label: "Lists the files and what changed" },
        ],
        "independent"),
      scenarioChallenge("SWE4.2", "Adapt", "main is broken after a merge",
        "Someone merged a branch and now the main branch won't even start. You need to ship a hotfix today. What do you do?",
        "What do you do?",
        [
          { id: "a", label: "Fix it directly on main and push", ok: false, why: "Working on main mixes the hotfix with the broken state and risks pushing half-done work." },
          { id: "b", label: "Revert the merge commit on a new branch, test, then merge that back to main", ok: true, why: "Revert the merge to restore a known-good main, then ship the hotfix from a clean branch." },
          { id: "c", label: "Delete main and rename the branch", ok: false, why: "Destructive, loses history, and confuses everyone else's clones." },
        ],
        "transferable"),
    ],
  },
  {
    id: "SWE5", name: "Write tests that catch regressions",
    canDo: "Write tests that fail when the behaviour breaks and pass when it is correct.",
    resources: [
      { title: "Getting Started · Jest (official)", url: "https://jestjs.io/docs/getting-started", type: "official docs", description: "Write your first test, run it, see PASS/FAIL — the official Jest tutorial." },
      { title: "Unit Testing for Beginners: Simple Guide with Examples (2025)", url: "https://quashbugs.com/blog/unit-testing-guide-for-beginners", type: "guide", description: "What unit testing is, how it works, Arrange-Act-Assert, Jest/Mocha/PyTest examples." },
      { title: "Testing JavaScript: A Practical Guide to TDD with Jest (2026) (DEV)", url: "https://dev.to/armorbreak/testing-javascript-a-practical-guide-to-tdd-with-jest-2026-5a16", type: "article", description: "TDD cycle, one assertion per test, test behavior not implementation, coverage goals and limits." },
    ],
    selfCheck: [
      "Did I write the failing case first — the exact input that exposed the bug, with the expected correct output?",
      "Did I run that test against the broken code and confirm it failed?",
      "After the fix, does the same test now pass?",
      "Did I add one happy-path case plus the edge cases, not just the happy path?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You added tests for a bug fix. All twelve passed. You shipped. The same bug came back a week later — none of the twelve tests actually exercised the broken code.",
        point: "A test that never fails proves nothing. A good test fails on the bug, then passes after the fix.",
      },
      explain: {
        paras: [
          "Write the failing case first: the input that exposed the bug, with the expected correct output.",
          "Run the test against the broken code. It must fail — if it passes, it's not testing the bug.",
          "Fix the code, re-run: the test should now pass.",
          "Add the happy path and obvious edge cases after, but never let them replace the failing case.",
        ],
        keyIdea: "A regression test's job is to catch the same bug twice. It must fail before the fix and pass after.",
      },
      demonstrate: {
        task: "A cart accepted negative quantities. Add a regression test.",
        steps: [
          { move: "State the behaviour", think: "Quantity must be an integer ≥ 1.", result: "Behaviour: qty is a whole number of 1 or more, else rejected." },
          { move: "Write the failing case", think: "Add -1 → expect rejection.", result: "test('rejects negative quantity', () => expect(addToCart(-1)).toReject())." },
          { move: "Run against the old code", think: "Does the test fail?", result: "It failed — the old code accepted -1. The test bites." },
          { move: "Fix and re-run", think: "Add the guard, then re-run.", result: "The test passes now, and still passes a month later." },
        ],
        full: "Behaviour: reject non-integer or sub-1 quantities. Wrote the -1 case first. Ran against old code: failed (it bit). Added the guard: test passes. The bug cannot silently return.",
      },
      deconstruct: [
        "The failing case came from the actual bug, not from imagination.",
        "Running it against the broken code proved it bites — that's the difference between a test and a suggestion.",
        "After the fix, the same test guards against the bug coming back.",
        "Test lifecycle:\n  Write failing case (expect it to fail) → Run against broken code (must fail) → Fix code → Re-run (must pass) → Add happy path + edge cases",
      ],
      guided: {
        intro: "Your turn. Design the regression test, then compare.",
        task: "A discount code could be applied twice, stacking the discount. Write the test.",
        fields: [
          { key: "case", label: "The failing case", hint: "Apply the same code twice — what should happen.", minWords: 8 },
          { key: "expect", label: "The expected result", hint: "The second apply is rejected, total unchanged.", minWords: 6 },
          { key: "prove", label: "How you'd confirm it bites", hint: "Run it against the code before the fix.", minWords: 6 },
        ],
        model: {
          case: "Apply code 'SAVE10' to a $100 cart once (total $90), then apply it again.",
          expect: "The second apply is rejected and the total stays $90 — no stacking.",
          prove: "Before the fix, the second apply stacked (total $80). The test fails there, passes after the fix.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SWE5.1", "Reproduce", "Write a regression test",
        "Take a bug you've fixed. Write the one test that would have caught it before the fix, plus the happy path.",
        "Strong answer: the bug's exact failing case, shown to fail on the old code and pass on the fixed code, plus one happy-path case.",
        [
          { key: "bug", label: "The bug", hint: "What went wrong, in one sentence.", minWords: 8 },
          { key: "failingCase", label: "The failing case", hint: "The input that exposes it, and the correct output.", minWords: 8 },
          { key: "confirm", label: "How you confirmed it bites", hint: "Ran it pre-fix: it failed.", minWords: 6 },
        ],
        [
          { label: "The bug described clearly" },
          { label: "A concrete failing case with expected output" },
          { label: "Confirmation it failed pre-fix" },
        ],
        "independent"),
      scenarioChallenge("SWE5.2", "Transfer", "All green on the first run",
        "You wrote tests for a new feature. They all pass first time, no edits. What do you check before trusting them?",
        "What do you check?",
        [
          { id: "a", label: "Nothing — passing is the point", ok: false, why: "Passing on correct code tells you nothing about whether they'd catch a regression." },
          { id: "b", label: "Break the feature deliberately and confirm at least one test fails", ok: true, why: "A test that cannot fail proves nothing. Mutating the code confirms the tests bite." },
          { id: "c", label: "Delete the redundant ones — if they all pass, some are useless", ok: false, why: "Passing does not mean redundant; they may cover different cases." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: SWE_COMPETENCIES, capstoneId: "SWECAP" };
};
