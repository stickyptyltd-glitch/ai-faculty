# Automated pathway-expansion prompt

**Purpose:** run this on a schedule (`/loop`, a scheduled cloud agent, or by hand) to grow AI
Faculty into new areas of education, unattended, without drifting from the patterns that keep
the curriculum safe and consistent. One pathway per run.

**Use it as-is — copy everything in the box below** as the prompt for `/loop`, `/schedule`, or a
one-off session.

---

```
Expand AI Faculty with ONE new learning pathway for an education domain not yet covered. Work in
the repo root — the directory containing `app/`, `docs/`, `landing/` and `workers/`. Check
docs/09-work-pathways.md and the PATHWAYS array in app/js/content.js for what already exists
before picking a domain — e.g. an uncovered professional-services variant, public sector,
product/design, journalism, K-12/exam-prep, or another genuinely new subject area. Do not trust any
count written in this prompt; read the real number at the start of the run:
  node -e 'const fs=require("fs");const w={};global.window=w;eval(fs.readFileSync("app/js/content.js","utf8"));console.log(w.CONTENT.PATHWAYS.length)'
Pick the single highest-value gap.

Build it to the exact depth and structure of the existing pathways in app/js/content.js:
- New entries in the `COMPETENCIES` array (that is the real name — it has been `COMPETENCIES`
  since the first working slice; there is no `_COMPETENCIES`, and adding one creates a dead array
  nothing reads, so the pathway renders empty).
- Each competency: a full 6-step lesson (activate, explain, demonstrate, deconstruct, quickcheck,
  guided) and 2 challenges (fieldsChallenge / critiqueChallenge / scenarioChallenge).
- A PATHWAYS entry with status: "available", competencies:, capstoneId:, group: "work" or "build".
- QUICK_CHECKS entries keyed by competency id.
- A PATHWAY_CHECKPOINTS entry (the capstone).

Non-negotiable rules, learned the hard way — breaking these makes the assessor unreliable:
- critiqueChallenge `signals` arrays must be lowercase AND specific. faculty.js scores with
  `text.includes(sig)` — a bare common word ("and", "time", "age", "log", "may", "who", "gap",
  "bar") or a substring of one makes that rubric line auto-pass on almost any submission. Use
  multi-word, on-topic phrases instead.
- fieldsChallenge: `rubric.length` must be <= `fields.length`. faculty.js pairs them by index;
  any rubric item past the field count renders as an unassessed pass.
- scenarioChallenge: exactly one option has `ok: true`.
- `guided.fields[].key` values must exactly match the keys of `guided.model`.
- If the domain carries regulated or professional-standard content (legal, medical, financial,
  psychological, etc.), add the same "Draft content — not yet expert-verified" notice used in
  `main.js` `viewPathwayOverview()` for the legal/finance/hr/health pathways. Do not state a
  specific regulation, standard, or legal threshold as settled fact — describe the transferable
  judgement and flag that the specific rule needs local/professional verification.

Validate before deploying: `node --check app/js/content.js` and `node --check app/js/main.js` (the
prompt's earlier `node -c` spelling is a valid alias, but `--check` is the documented one), then
`node workers/api/test.mjs` — 200 tests, all of which must pass; it is the only real gate in this
repo and it also fails on a broken Worker module. Then a vm-load structural sweep that checks —
every lesson step present, guided fields/model key match, >=2 challenges per competency, scenario
has exactly one `ok:true`, critique has >=3 expected items with lowercase+specific signals, fields
rubric <= fields, every pathway has a checkpoint. Confirm the pathway you just added actually
appears: `node -e '...PATHWAYS.map(p=>p.id)'` should list it. Fix anything the sweep flags before
deploying.

Deploy with `./build.sh && npx wrangler pages deploy dist --project-name aifaculty`, then verify
the live site (curl the served `app/js/content.js` for the new pathway id, plus a headless-Chrome
screenshot of it).

**Do not pass `--branch` to `wrangler pages deploy`.** Any `--branch X` makes it a *preview*
deployment: it reports success, serves the new build at `X.aifaculty.pages.dev`, and leaves
`aifaculty.pages.dev` and `aifaculty.org` on the old build. A run that follows the old
`--branch master` instruction ships nothing and says it shipped something. Production is the
deployment with no branch flag. The same trap applies to the API Worker, which is a Worker rather
than a Pages project: `npx wrangler deploy` from `workers/api/`, not `wrangler pages deploy`.

Commit and push. Log the addition in docs/continuity-log.md (new version entry) and update the
catalogue table + prototype-status line in docs/09-work-pathways.md.

Guardrails — stay in scope:
- Pathway content only. Do not touch auth, accounts, payments, the faculty/assessment plane
  (`workers/api` faculty handlers, `faculty.js` scoring), or any user-data code, even if you see
  related work in progress elsewhere in the repo. Adding a pathway must not change how anything is
  scored.
- One pathway per run. Stop after it's validated, deployed, and logged.
- If you can't find a genuinely new, valuable domain that isn't already covered, say so and stop
  rather than forcing a low-value or duplicate pathway.
- Add the new pathway as `status: "available"`, and say so plainly in the log entry. A pathway at
  `available` is publicly reachable the moment you deploy, so the founder's review-after-deploy
  step is a real gap in the governance chain, not a formality. If the founder has not pre-approved
  this specific domain, stop and ask instead of deploying.
```

---

## Notes for whoever runs this

- Each run should be a clean pass: pick domain → author → validate → deploy → log → stop. It
  does not need memory of previous runs beyond what's already in the repo (docs/09, content.js).
- Cadence: roughly one pathway a week is sustainable to review; there's no need to run it more
  often than you can read the diff.
- The founder should skim each new pathway's overview page in the live app before it's announced
  to real learners — the sweep catches structural breakage, not curriculum judgement.
- Know what a challenge is worth before you add twelve of them. Measured in v0.53: challenge
  evidence is **formative, not a mastery judgement**. The placeholder check only rejects literal
  filler (`n/a`, `none`, `-`, `idk`) and anything under 3 characters, so a fluent 15-word generic
  answer passes; the rubric feedback names the correct option; and `scenarioChallenge` reshuffles
  its options on every render, so the same question reads differently each attempt. `critiqueChallenge`
  is keyword-scored against a `signals` list and is the easiest of the three to farm. None of that
  is a reason to write weaker challenges — it is a reason not to let challenge evidence carry a
  credential, a leaderboard score, or a qualification when Phase 4 lands.
- Each pathway adds roughly 10–12 challenges to a corpus that is already gameable in the ways
  above. That is a reason to prefer fewer, better challenges over matching the existing count.
