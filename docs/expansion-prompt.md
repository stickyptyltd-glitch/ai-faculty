# Automated pathway-expansion prompt

**Purpose:** run this on a schedule (`/loop`, a scheduled cloud agent, or by hand) to grow AI
Faculty into new areas of education, unattended, without drifting from the patterns that keep
the curriculum safe and consistent. One pathway per run.

**Use it as-is — copy everything in the box below** as the prompt for `/loop`, `/schedule`, or a
one-off session.

---

```
Expand AI Faculty (repo: ~/projects/ai-faculty) with ONE new learning pathway for an education
domain not yet covered. Check docs/09-work-pathways.md and the PATHWAYS array in
app/js/content.js for what already exists (16 pathways as of 2026-09) before picking a domain —
e.g. an uncovered professional-services variant, public sector, product/design, journalism,
K-12/exam-prep, or another genuinely new subject area. Pick the single highest-value gap.

Build it to the exact depth and structure of the existing pathways in app/js/content.js:
- A `_COMPETENCIES` array of 4-6 competencies before `const PATHWAYS`.
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

Validate before deploying: `node -c app/js/content.js`, `node -c app/js/main.js`, and a vm-load
structural sweep that checks — every lesson step present, guided fields/model key match, >=2
challenges per competency, scenario has exactly one `ok:true`, critique has >=3 expected items
with lowercase+specific signals, fields rubric <= fields, every pathway has a checkpoint. Fix
anything the sweep flags before deploying.

Deploy with `./build.sh && npx wrangler pages deploy dist --project-name aifaculty --branch
master`, then verify the live site (curl + a headless-Chrome screenshot of the new pathway).
Commit and push. Log the addition in docs/continuity-log.md (new version entry) and update the
catalogue table + prototype-status line in docs/09-work-pathways.md.

Guardrails — stay in scope:
- Pathway content only. Do not touch auth, accounts, payments, subscriptions, the leaderboard,
  or any user-data code, even if you see related work in progress elsewhere in the repo.
- One pathway per run. Stop after it's validated, deployed, and logged.
- If you can't find a genuinely new, valuable domain that isn't already covered, say so and stop
  rather than forcing a low-value or duplicate pathway.
```

---

## Notes for whoever runs this

- Each run should be a clean pass: pick domain → author → validate → deploy → log → stop. It
  does not need memory of previous runs beyond what's already in the repo (docs/09, content.js).
- Cadence: roughly one pathway a week is sustainable to review; there's no need to run it more
  often than you can read the diff.
- The founder should skim each new pathway's overview page in the live app before it's announced
  to real learners — the sweep catches structural breakage, not curriculum judgement.
