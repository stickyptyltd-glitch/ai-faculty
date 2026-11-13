# Learner experience research and curriculum changes

Reviewed 2026-11-13. This is a targeted qualitative review, not a representative survey or a
claim that these changes have already improved AI Faculty outcomes. Learner reviews are
self-selected, course quality varies, and provider descriptions explain features rather than
independently proving effectiveness. No private participant data was collected.

| Evidence | What learners value / dislike | Design response |
| --- | --- | --- |
| [Study of 190 Duolingo and 190 Babbel reviews](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1569058/full) | Duolingo's approachable gamification and Babbel's structured explanations were appreciated. Repetition, limited depth, price and insufficient personalization were recurring criticisms. | Short practice with explanatory feedback and practical tasks; no loss of access for wrong answers. |
| [Brilliant learner's year-long review](https://www.reddit.com/r/learnmath/comments/1gkot3t/review_one_year_of_learning_math_on_brilliant/) | This learner enjoyed the interactive design and review of familiar topics, but found advanced explanations insufficient. One person's experience is not a platform-wide conclusion. | Show the reasoning before independent practice; let learners control the pace of worked examples. |
| [Brilliant's product FAQ](https://brilliant.org/faq/) | Provider describes interactive problems, explanations and immediate feedback. This is a feature description, not independent evidence of superior outcomes. | Retryable low-stakes checks with an explanation for each choice. |
| [Coursera Applied AI learner reviews](https://www.coursera.org/specializations/applied-ai/reviews) | Visible learner comments value clear explanations, hands-on assignments and real-world applications. These comments are course-specific. | Concrete supplied examples, inspectable outputs, then transfer to a learner's own task. |
| [Class Central's review of Coursera assessment](https://www.classcentral.com/report/coursera-peer-assessment-still-broken/) | Reports recurring concerns about delays, inconsistent peer assessment and the cost of meaningful review. | Keep immediate practice feedback separate from verified mastery; do not label a click or long answer as demonstrated skill. |
| [Duolingo energy-system learner discussion](https://www.reddit.com/r/duolingo/comments/1ldb7m7/energy_has_ruined_the_experience/) | Participants describe frustration when usage limits interrupt practice. This thread is complaint-selected. | Unlimited practice retries, no hearts, penalties or forced timers. |

## Audit findings

- 172 unique competencies across 41 pathways; 143 had quick checks, 29 had none.
  The lookup returns 179 entries because the seven foundation competencies are reused by a pathway.
- Seven foundation lessons used narrative section objects where the shared renderer required
  paragraph arrays, demonstration steps, guided fields and example answers. Browser navigation
  exposed these failures; the lessons now preserve the explanations and supply that structure.
- Nine fields challenges in Cooking and Language Learning had an extra positional string,
  shifting the fields/rubric arguments and preventing the forms from rendering properly.
- Opening a quick-check page reset the revisit clock before any question was attempted.
- Worked examples offered a fixed-speed animated playback with automatic scrolling.
- Guided answers disappeared when navigating back to the explanation.
- Data Science examples omitted the actual dataset and expected result, used an unbounded
  date filter for a named month, grouped customers only by name, and inferred a cause from
  correlation too confidently.

## Implementation scope

1. Add 58 authored practice questions covering all 29 missing competencies, with explanations
   for every option. These checks are practice, not assessed evidence.
2. Let learners step through examples at their own pace or show the whole worked example.
3. Offer retries and useful next steps after mistakes; only log a revisit after all questions
   have been attempted. Track practice completion separately from correctness or mastery.
4. Keep guided drafts on the current device and make example support optional to expand.
5. Repair the nine malformed challenges and the seven foundation lesson contracts, with
   concrete worked moves and different supplied tasks for guided practice.
6. Give Data Science supplied data, exact outputs, bounded queries and a defensible treatment
   of missing data and causal claims. These supplied-data challenges do not require a learner
   to register a separate real task.
7. Describe guided answers as attempted and ungraded; invite comparison without treating
   answer length or a nonempty response as evidence of correctness.

## Technical references for the new examples and checks

- [PostgreSQL joins](https://www.postgresql.org/docs/current/tutorial-join.html) and
  [aggregates](https://www.postgresql.org/docs/current/tutorial-agg.html).
- [pandas: missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html).
- [OWASP: SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
  and [authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
- [FoodSafety.gov: clean, separate, cook, chill](https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety).
- [CDC: starting and building physical activity](https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html).

## How to evaluate after learner use

Ask whether the learner can explain one decision and complete a changed task without the
example. Compare first-attempt practice errors with a later revisit, guided-task completion,
and abandonment at each step. Ask which explanation was confusing or repetitive. Do not use
XP, time in app or streak length as proof of learning. No outcome improvement is claimed yet.
