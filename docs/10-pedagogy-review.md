# AI Faculty — Pedagogy Review: Teaching Method, Practicality, and Where It Falls Short of Its Own Design

**Date:** 2026-09-22
**Scope:** an assessment of how the shipped app (`app/js/`) actually teaches and assesses, against
learning-science practice and against the platform's own design docs
([04-learning-engine.md](04-learning-engine.md), [08-assessment-model.md](08-assessment-model.md)) —
requested by the founder, not tied to any single pathway. This is an assessment and a set of
recommendations, not a build — nothing here has been implemented; every recommendation below is a
proposal for the founder to prioritise.

---

## Bottom line

The **lesson structure is genuinely well-designed** and matches established learning science
closely — story-driven hook, worked example, explicit named "moves," a real (if optional) retrieval
attempt, then graded practice on the learner's own task, escalating up a difficulty ladder. That
part doesn't need a redesign.

The **weak points are not in the lesson design — they're in what happens after it**: nothing is
ever revisited (no spaced retrieval), the whole teaching sequence is skippable with zero friction,
and — the one that matters most — **the "evidence" the whole platform is built around is graded by
a word-counter and a keyword regex, not real reasoning assessment.** That's not a bug so much as a
scope gap: [08-assessment-model.md](08-assessment-model.md) §8 already lists "model-scored rubric
behind the Control Plane" as a **Later** item and explicitly names the current heuristic as v0.2
prototype scope. The design was right on paper. The shipped app has just never moved past the "Now"
column of that table — and the platform has grown to 23 pathways and 121 competencies on top of
that same v0.2 assessment core.

---

## 1. What's working (keep this)

Every competency's lesson (`app/js/content.js`) runs the same six steps, and the pattern holds up
well against how people actually learn a skill:

- **`activate`** — a concrete story showing the cost of *not* having the skill, before any
  abstraction. This is a real hook, not decoration — it gives the learner a reason to care before
  the explanation arrives.
- **`explain`** — the mental model in plain language, ending in one boxed `keyIdea`. Short, and
  the repetition of a single crisp sentence per competency is a legitimate dual-coding/summary
  technique, not padding.
- **`demonstrate`** — a fully worked example, shown as a sequence of `{move, think, result}` steps.
  This is the worked-example effect done properly: the reasoning is shown, not just the answer.
- **`deconstruct`** — the moves named explicitly as a bulleted list, so the learner has something
  reusable, not just a memory of the story.
- **`guided`** — a *different* scenario from the worked example (near-transfer, not a copy), with a
  model answer to compare against. Right idea: transfer needs a new instance, not a repeat.
- **Challenges** climb a real difficulty ladder (`Reproduce → Adapt → Create/Transfer`) and mix
  three genuinely different task types (fill in fields on your own task / critique a flawed
  example / pick-and-justify a scenario) — this varies retrieval format instead of asking the same
  kind of question five times in a row, which is itself a desirable-difficulty technique.
- **Applied Projects** tie evidence to a real task the learner is actually doing, not a generic
  prompt — this is the strongest design idea in the whole system and it's implemented, not just
  planned.
- **Never-downgrade progression** (`model.js` `raise()`) is a sound choice — a bad day doesn't
  erase demonstrated capability, which avoids a common source of learner frustration in mastery
  systems.

None of this needs to change. The recommendations below are about what surrounds it.

---

## 2. The practicality/viability problem: assessment is a word-counter wearing a rubric's clothes

This is the headline finding, and it deserves to be stated plainly rather than softened.

`app/js/faculty.js` `fieldBand()` scores every free-text answer like this:

```js
const specific =
  /\d/.test(val) ||
  /\b(because|so|since|given that|due to|...)\b/i.test(val) ||
  /\b(two|three|...)\b/i.test(val) ||
  /["“][^"”]{3,}["”]/.test(val) || ...
if (n >= min * 2 && specific) return "Exceeds";
```

A learner who writes a long answer containing **any digit, any connector word like "because," or
any quoted phrase** clears "Exceeds" — the platform's top band, the one meant to signal "specific
and well-reasoned." A learner who writes a genuinely sharp, correct, 11-word answer with none of
those surface features scores "Developing," the same band as a placeholder. `verdictFromBands`
with `strict: true` — the **"independent second assessment,"** presented to learners as the
platform's rigor guarantee (the "Assessment Resolution Protocol" in
[08-assessment-model.md](08-assessment-model.md) §5) — is the same regex with the word floor
raised by 1.4×. It is not independent in any meaningful sense; it's the same test, stricter.

Why this matters more than a normal "the heuristic is approximate" caveat: **every downstream
artefact inherits it.** The evidence portfolio, the mastery states, the free-on-every-tier
certificates, and the Phase D/E/F admin-panel plans already scoped (peer-review credit, a
Trust-Pilot-style skill-reputation score, honour-roll recognition) all sit on top of this same
grader. None of those features can be more rigorous than the assessment they're built on. And the
specific failure mode — *reward surface confidence markers over actual correctness* — is the exact
failure mode this curriculum spends dozens of competencies teaching learners to catch in AI output
(don't trust a fluent answer, check what it's actually claiming). The assessor teaching that lesson
is itself vulnerable to it.

**This is not a quick fix.** [08-assessment-model.md](08-assessment-model.md) already scopes the
real fix correctly: a model-scored rubric behind the Control Plane (`faculty.js` is deliberately
written as "the one swappable seam" for exactly this reason — see its file header). Patching the
regex with more phrases would only move the gameable boundary, not close it. The honest framing for
the founder: **this is the one piece of the platform that can't be meaningfully improved without
the LLM integration that's already an open thread** — everything else in this document is
independently buildable without it.

---

## 3. Structural gaps against the platform's own design docs

These aren't things I'm inventing — [04-learning-engine.md](04-learning-engine.md) already specifies
a Pathway Engine action set of `learn · practise · revisit · test · apply · demonstrate · transfer ·
skip · branch · escalate` and a Progress Engine state of `Revisiting`. The shipped `pathway.js` and
`model.js` implement none of the revisit/branch behaviour — only a strict, one-directional forward
walk. So the design already called for what's missing; it just was never built.

**a) No spaced retrieval — a completed competency is gone forever.**
`PATHWAY.next()` walks forward only. Once every challenge on a competency is done, nothing in the
app ever resurfaces it. There's no protection anywhere against the forgetting curve — a learner who
finishes 20 competencies has no mechanism nudging them back to competency 3 before it fades. The
`taughtAt` and `completedAt` timestamps already exist on every capability and challenge record; they
just aren't used for anything after the fact.

**b) The whole teaching sequence is skippable with zero friction.**
The guided-practice textareas (`main.js`, the `guided` step) are **not** marked `required` — unlike
every challenge form, which is. The "I'm ready — do it on my own task" button is available
immediately, with no check that the learner even opened the guided form. A learner can click through
activate → explain → demonstrate → deconstruct → quick-check → guided in seconds without reading or
attempting anything, and land straight on the graded challenge. The two graded challenges are
currently the *only* forcing function in the entire lesson-to-mastery pipeline.

**c) Blocked practice throughout, never interleaved.**
Every lesson step and both challenges for competency N run back-to-back before competency N+1
starts. Interleaving practice across competencies (a known technique for durable learning and for
telling similar-but-different ideas apart — e.g. Rohrer & Taylor) isn't used anywhere. Naming this
honestly: interleaving would cut against the pathway's current identity as a coherent, one-thing-
at-a-time course, which is a real design value the founder has built toward — this is a genuine
trade-off to weigh, not a strict improvement to just add.

**d) Remediation on failure is vague, not targeted.**
When a challenge verdict is `"more"`, the learner sees: *"Not enough here yet. Go back to the
teaching, then try again."* There's no deep link to the specific lesson step (the worked example,
or the named "moves" list) that's actually relevant to what they missed — even though the app
already knows the step keys (`LESSON_STEPS`) and could point precisely.

---

## 4. Recommendations, ranked by what's actually buildable in this architecture

**Buildable now, no backend or model integration required:**

1. **Make the guided step's retrieval attempt required before the model answer reveals.**
   One-line change (add `required` to the guided textareas, or gate the reveal button on non-empty
   fields) — turns the single highest-value retrieval-practice step from optional to real, for
   every existing pathway at once.
2. **Add a spaced "revisit" action to the Pathway Engine.**
   `walkModule()` already has everything it needs (`taughtAt`, `completedAt`) to occasionally
   surface a completed competency's quick-check (already built, already ungraded — no assessment
   risk) after N days, instead of only ever walking forward. This is the single highest-leverage
   change for actual retention, and it's the exact `revisit` action already named in
   [04-learning-engine.md](04-learning-engine.md) but never implemented.
3. **Make the "more" verdict's feedback a deep link, not a vague pointer.**
   `assessChallenge`'s `"more"` case already knows which competency and lesson it's attached to —
   point back at the specific step (e.g. `#/learn/{capId}/2` for `demonstrate`) instead of "go back
   to the teaching."
4. **Decide deliberately on interleaving, rather than leaving it undecided.**
   Not a recommendation to build blindly — a recommendation to make an explicit founder call,
   because it trades against the pathway's current coherent-course identity.

**Not buildable without the model/Control-Plane seam already in the roadmap:**

5. **Real reasoning assessment**, replacing or augmenting `fieldBand`'s regex-based scoring. This is
   the fix for §2 above, and it's already the correctly-scoped "Later" item in
   [08-assessment-model.md](08-assessment-model.md) §8 — restated here because it's the change that
   determines whether every other improvement in this document is assessing something real.

---

## 5. One unrelated small finding, noted but not fixed here

`main.js` (the `/about` page, around line 1037) still names only "Legal, Finance, HR, Healthcare"
as the regulated-domain pathways and repeats a "specifically reviewed (2026-09-12)" date — both
now stale (there are seven regulated-notice pathways as of v0.33, and the dated-audit-claim
wording was already generalised on the pathway-overview banner itself in v0.32 for the same
accuracy reason). Flagging it here rather than fixing it unasked, since it wasn't part of what was
requested this round.
