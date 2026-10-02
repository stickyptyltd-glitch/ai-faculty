/* Subject: software
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["software"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
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
        "transferable", { text: `Title: "Search returns no results for common misspellings."
Body: "Support tickets show users searching 'recieve', 'seperate', etc. and getting zero results, then abandoning. Acceptance: a 20-term misspelling test set returns the correct top result for ≥18/20. Out of scope: synonym search, filters. No implementation prescribed — the team decides whether that's AI or a static correction list."`, changes: ["“bad” / “complain” → one concrete, observed problem (misspellings return zero results)", "Added testable acceptance criteria (≥18/20 on a named test set)", "“Make it use AI” removed — states the problem, leaves the solution open", "Added an explicit scope boundary (no synonyms, no filters)"] }),
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
          { label: "Constraints are concrete, and the ask is a reviewable change, not a rewrite" },
          { label: "Names the first thing to review and why" },
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
        "transferable", { text: `function validEmails(csv) {
  const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return csv.split('\\n')
  .slice(1) // drop the header row
  .map(line => splitCsvLine(line)[2])
  .filter(v => v && EMAIL_RE.test(v.trim()));
}`, changes: ["Skips the header row instead of trying to validate it as an email", "Uses a real CSV-line splitter, not naive split(',') — quoted commas won't break it", "A real email pattern replaces the near-useless includes('@')", "Filters blank/short lines before checking, so it can't throw on a missing column"] }),
      fieldsChallenge("S3.2", "Transfer", "Review a real AI change from your work",
        "Take a real change AI has written for you (or a snippet from a project). Run the failure-mode checklist and write up what you found.",
        "Strong answer: you actually went through the specific checks (invented APIs, swallowed errors, edges, security, spec match) and reported concrete findings — or a reasoned 'clean, and here's what I verified'.",
        [
          { key: "snippet", label: "What the change does (and paste/describe it)", hint: "Enough for the finding to make sense.", minWords: 8 },
          { key: "findings", label: "What you found, check by check", hint: "Go through the five failure modes.", minWords: 15 },
        ],
        [
          { label: "The change is described clearly enough for the findings to make sense" },
          { label: "Went through the specific failure modes with concrete findings (or a justified 'clean'), including a spec/intent check" },
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

  {
    id: "S5", name: "Shipping responsibly",
    canDo: "Name what AI must not own, and put the human gates in before you ship.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You let the AI-assisted deploy script pick the rollout. It chose 100%. The bug hit every user at once, and rollback took 20 minutes because nobody had ever tested it.",
        point: "\"The AI wrote it\" is not an owner. Someone has to decide what ships and how.",
      },
      explain: {
        paras: [
          "Before AI-assisted work ships, decide **what a human must approve**: anything user-facing, anything irreversible, anything touching money, auth, or customer data.",
          "Make mistakes cheap: **behind a flag, with a rollback you've actually tested.**",
          "Keep **secrets and customer data out of prompts and logs**.",
          "Ask: **what did the AI decide that it shouldn't have?** Rollout %, who gets a refund, what data to delete — those are human calls.",
        ],
        keyIdea: "Name what AI must not decide, put a human gate before every irreversible or user-facing step, and never ship without a tested rollback.",
      },
      demonstrate: {
        task: "Shipping the rate-limit feature from S2.",
        steps: [
          { move: "Flag it", think: "So I can turn it off in one click.", result: "behind `feature.rate_limit`, default off" },
          { move: "Stage the rollout", think: "Not 0→100.", result: "5% → 50% → 100% over a day, a human checks metrics at each bump" },
          { move: "Test the rollback", think: "In staging, before I need it.", result: "flipped the flag off in staging, confirmed traffic returns to normal in <1 min" },
          { move: "Check data & secrets", think: "What's in the logs?", result: "confirmed no customer IPs written to logs; no keys in the prompt history" },
          { move: "Name the human calls", think: "What the AI drafted but didn't decide.", result: "AI drafted the rollout plan; a human approved each percentage bump" },
        ],
        full: "Behind a flag (default off). Rollout 5→50→100% over a day with a human metrics check at each step. Rollback tested in staging. No customer IPs in logs, no secrets in prompts. AI drafted the plan; a human owned every go/no-go.",
      },
      deconstruct: [
        "The flag + tested rollback is the single thing that makes a bad deploy a 1-minute problem instead of a 20-minute one.",
        "Human gates are on the irreversible and visible steps — not on everything, or nothing ships.",
        "\"AI drafted, human approved each step\" is the pattern for anything consequential.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You used AI to write a database migration that renames a column and backfills the data.",
        fields: [
          { key: "approve", label: "What must a human approve before this runs?", hint: "Think irreversible + data.", minWords: 6 },
          { key: "rollback", label: "Flag & rollback plan", hint: "How do you undo this if the backfill is wrong?", minWords: 6 },
          { key: "data", label: "Data & secrets check", hint: "What could leak into a prompt or log?", minWords: 5 },
          { key: "notdecide", label: "What must the AI NOT decide here?", hint: "Name it.", minWords: 4 },
        ],
        model: {
          approve: "A senior engineer reviews the migration and the backfill query, and approves running it against production — after it's been run against a prod-sized copy first.",
          rollback: "Ship in two steps: add the new column and backfill while keeping the old one; only drop the old column a week later once verified. Rollback in the meantime = stop reading the new column. A full DB snapshot is taken immediately before.",
          data: "The migration script and any AI conversation about it must not contain real customer data samples; run counts and schema only.",
          notdecide: "Whether to drop the old column, and when — that's a human decision after verification, not something the script does in one pass.",
        },
      },
    },
    challenges: [
      fieldsChallenge("S5.1", "Reproduce", "Write the ship plan for a real change",
        "Take a real AI-assisted change (yours or plausible). Write what a human must approve, the flag/rollback plan, the data & secrets check, and what the AI must not decide.",
        "Strong answer: human gates are on the genuinely risky steps (not everything, not nothing); the rollback is concrete and testable; data/secret risks in prompts and logs are addressed; and at least one 'AI must not decide this' call is named.",
        [
          { key: "approve", label: "What a human must approve", hint: "The irreversible / user-facing / money / data / auth steps.", minWords: 6 },
          { key: "rollback", label: "Flag & rollback plan", hint: "Concrete and tested.", minWords: 6 },
          { key: "data", label: "Data & secrets check", hint: "Prompts and logs.", minWords: 5 },
          { key: "notdecide", label: "What the AI must not decide", hint: "At least one.", minWords: 4 },
        ],
        [
          { label: "Human gates are on the genuinely risky steps" },
          { label: "Rollback is concrete and testable" },
          { label: "Data/secret risk in prompts & logs is handled" },
          { label: "At least one 'AI must not decide' is named" },
        ],
        "independent"),
      scenarioChallenge("S5.2", "Create", "The deploy script set rollout to 100%",
        "Your AI-generated deploy script is ready. It's configured to release the change to 100% of users immediately on merge.",
        "What do you do?",
        [
          { id: "a", label: "Merge it — the change passed review and tests", ok: false, why: "Review and tests reduce the chance of a bug, they don't eliminate it. A 100% instant rollout removes your ability to limit the blast radius." },
          { id: "b", label: "Change it to a staged rollout behind a flag, and confirm the rollback works first", ok: true, why: "The rollout strategy is a human call. Staged + flagged + tested-rollback makes any remaining bug cheap." },
          { id: "c", label: "Merge it but watch the dashboards closely for an hour", ok: false, why: "Watching doesn't undo a bad release any faster; by the time you see it, everyone's affected." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: SOFTWARE_COMPETENCIES, capstoneId: "SWCAP" };
};
