/* Delayed recall and application practice. All results are learner reflections,
 * stored on this device; this module never awards capability, evidence or XP. */
window.REVIEW = (function () {
  const C = window.CONTENT;
  const DAY = 86400000;
  const INTERVAL = 3 * DAY;
  const RATINGS = { solid: "Felt solid", partial: "Needed a little help", again: "Practise again" };
  const time = value => { const n = Date.parse(value); return Number.isFinite(n) ? n : 0; };
  const unique = () => [...new Map(C.allCompetencies().map(c => [c.id, c])).values()];
  const history = (learner, id) => learner.learningReviews?.[id] || [];

  function studiedAt(learner, id) {
    const c = C.competency(id);
    if (!c) return 0;
    return Math.max(time(learner.capabilities?.[id]?.taughtAt), time(learner.guided?.[id]),
      ...c.challenges.map(ch => time(learner.challenges?.[ch.id]?.completedAt)));
  }
  function status(learner, id, now = Date.now()) {
    const studied = studiedAt(learner, id);
    if (!studied) return null;
    const rounds = history(learner, id);
    const latest = rounds[rounds.length - 1];
    const anchor = Math.max(studied, time(latest?.completedAt));
    const dueAt = anchor + INTERVAL;
    return { id, dueAt, due: now >= dueAt, latest, rounds: rounds.length,
      started: Boolean(learner.reviewDrafts?.[id]) };
  }
  function queue(learner, now = Date.now()) {
    return unique().map(c => status(learner, c.id, now)).filter(Boolean)
      .sort((a, b) => a.dueAt - b.dueAt || a.id.localeCompare(b.id));
  }

  function exercise(id, round) {
    // Changed datasets have checkable answers rather than invented outcome claims.
    const examples = {
      DS1: [
        { prompt: "A shop has orders (id, customer_id, order_date, amount): (1,7,'2026-12-01',12), (2,7,'2026-12-20',18), (3,8,'2027-01-01',90). Write a query for December 2026 spend per customer and predict the rows. Explain one boundary check.",
          answer: "SELECT customer_id, SUM(amount) AS total FROM orders WHERE order_date >= '2026-12-01' AND order_date < '2027-01-01' GROUP BY customer_id;\nExpected: customer_id 7, total 30. Order 3 is outside December. The included amounts 12 + 18 reconcile to 30." },
        { prompt: "An orders table has (customer_id, order_date, amount): (4,'2027-01-03',25), (4,'2027-01-20',15), (5,'2027-02-01',80). Write a query for January 2027 spend per customer, predict its rows and explain a check.",
          answer: "SELECT customer_id, SUM(amount) AS total FROM orders WHERE order_date >= '2027-01-01' AND order_date < '2027-02-01' GROUP BY customer_id;\nExpected: customer_id 4, total 40. Exclude the February order; 25 + 15 = 40." }
      ],
      DS2: [
        { prompt: "An export contains order amounts: X1 $8, X2 $12, X2 $12 (confirmed duplicate export record), X3 unknown, X4 $40. Explain your cleaning decisions, calculate the mean and median of known amounts, and describe a labelled chart with one limitation.",
          answer: "Keep one X2 record and retain X3 as unknown. Three known amounts: 8, 12, 40; sum $60, mean $20, median $12. A bar chart starts at zero, labels dollars and marks X3 unknown. The complete total is unknown; equal values on different order IDs would not justify removing a record." },
        { prompt: "Four distinct orders have amounts $10, $20, $60 and unknown. Find the mean and median of known amounts. Describe a labelled chart and explain why replacing unknown with zero would change the claim.",
          answer: "Known sum $90, mean $30 and median $20 across three known orders. Show bars from zero with dollar labels and mark the fourth amount unknown. Zero would assert a known zero-value order and give a different denominator; the complete total remains unknown." }
      ]
    };
    if (examples[id]) return { ...examples[id][round % examples[id].length], source: "Changed practice dataset" };
    // Existing practice questions already carry authored explanations. Free response
    // hides their choices, so recognition of a marked option cannot substitute for reasoning.
    const checks = C.quickCheck(id);
    const check = checks[round % checks.length];
    const correct = check.options.find(o => o.ok);
    const openQuestions = {
      "Which of these is a goal, not a task?": "Write an example of a goal and explain how it differs from a task.",
      "Which step deserves the most care?": "When breaking AI-assisted work into steps, what kind of step needs the most care? Give an example.",
      "Which is a buildable spec?": "Write a small buildable software specification. What makes it specific enough to test?",
      "Which is a researchable question, not just a topic?": "Turn a topic into a researchable question. Explain what evidence could answer it.",
      "Which is a usable learning outcome?": "Write an observable learning outcome and explain how you would check it.",
      "Which is a real acceptance criterion?": "Write a testable acceptance criterion for a small feature and explain how you would check it.",
      "Which claim is the most dangerous in AI-written content?": "Describe a particularly risky kind of claim in AI-written content. Explain how you would verify it.",
      "Which revision keeps the meaning of 'The estimate may change if costs rise'?": "Rewrite 'The estimate may change if costs rise' more simply while preserving its uncertainty and condition.",
      "Which note says more about learning than a streak counter?": "Write an example of a language-learning progress note that shows what you can do, beyond counting a streak."
    };
    return { prompt: (openQuestions[check.q] || check.q) + " Explain your decision and how you would check it.",
      answer: correct.label + "\n\n" + correct.why, source: "Practice question, without answer choices" };
  }
  function begin(learner, id, now = Date.now()) {
    if (!status(learner, id, now)) throw new Error("Complete a guided lesson before starting a review.");
    if (!learner.reviewDrafts) learner.reviewDrafts = {};
    if (!learner.reviewDrafts[id]) {
      const rounds = history(learner, id);
      const roundNumber = (rounds[rounds.length - 1]?.roundNumber || rounds.length) + 1;
      learner.reviewDrafts[id] = { startedAt: new Date(now).toISOString(), recall: "", application: "",
        usedSupport: false, roundNumber, exercise: exercise(id, roundNumber - 1),
        moves: C.competency(id).lesson.deconstruct.slice() };
    }
    return learner.reviewDrafts[id];
  }
  function draft(learner, id, fields) {
    const d = learner.reviewDrafts?.[id];
    if (!d || d.attempt) return;
    d.recall = String(fields.recall || "").slice(0, 12000);
    d.application = String(fields.application || "").slice(0, 12000);
  }
  function reveal(learner, id) {
    const d = learner.reviewDrafts?.[id];
    if (d && !d.attempt) d.usedSupport = true;
  }
  function submit(learner, id, fields, now = Date.now()) {
    const d = learner.reviewDrafts?.[id];
    if (!d) throw new Error("Start a review first.");
    if (d.attempt) return;
    draft(learner, id, fields);
    if (!d.recall.trim() || !d.application.trim()) throw new Error("Try both parts first. A note about what you cannot remember is a useful attempt too.");
    d.attempt = { recall: d.recall.trim(), application: d.application.trim(), usedSupport: d.usedSupport,
      submittedAt: new Date(now).toISOString() };
  }
  function finish(learner, id, fields, now = Date.now()) {
    const d = learner.reviewDrafts?.[id];
    if (!d?.attempt) throw new Error("Save your attempt before reflecting on it.");
    if (!Object.hasOwn(RATINGS, fields.recallRating) || !Object.hasOwn(RATINGS, fields.applicationRating))
      throw new Error("Choose how each part felt.");
    if (!(fields.takeaway || "").trim()) throw new Error("Note one thing to keep or practise next.");
    if (!learner.learningReviews) learner.learningReviews = {};
    const record = { ...d.attempt, startedAt: d.startedAt, exercise: d.exercise, roundNumber: d.roundNumber,
      completedAt: new Date(now).toISOString(), recallRating: fields.recallRating,
      applicationRating: fields.applicationRating, takeaway: fields.takeaway.trim().slice(0, 4000) };
    learner.learningReviews[id] = [...history(learner, id), record].slice(-20);
    delete learner.reviewDrafts[id];
    return record;
  }
  const esc = value => window.PROGRESS.esc(value);
  const date = value => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  function summary(learner) {
    const items = queue(learner);
    if (!items.length) return "";
    const due = items.filter(s => s.due).length;
    return `<section class="card review-summary"><h2>Remember &amp; apply</h2>
      <p>${due ? `${due} skill${due === 1 ? " is" : "s are"} ready for another look.` : `Next review suggested ${esc(date(items[0].dueAt))}. You can practise sooner.`}
      Try recalling the idea, then use it in a situation.</p>
      <a class="btn btn--ghost btn--sm" data-nav href="#/review">${due ? "See your reviews" : "Visit your review space"}</a></section>`;
  }
  function render(learner, parts) {
    const id = parts[1];
    if (!id) {
      const items = queue(learner);
      return `<h1>Remember &amp; apply</h1><p class="lead">Come back to a skill, try it from memory, then compare your reasoning. No timer or lost progress.</p>
        <p class="hint">Reviews are suggested three days after learning or your last review. Reflections and drafts stay on this device; they are not assessed mastery.</p>
        ${items.length ? items.map(s => `<section class="card"><h2>${esc(C.competency(s.id).name)}</h2>
          <p>${s.due ? "Ready for another look" : `Suggested ${esc(date(s.dueAt))}`}${s.started ? " · draft saved" : ""}</p>
          ${s.latest ? `<p class="hint">Last reflection: recall — ${esc(RATINGS[s.latest.recallRating])}; applying — ${esc(RATINGS[s.latest.applicationRating])}.</p>` : ""}
          <a class="btn btn--sm" data-nav href="#/review/${esc(s.id)}">${s.started ? "Continue review" : "Open review"}</a></section>`).join("")
          : `<div class="notice">Finish a guided practice to add your first skill here. <a data-nav href="#/pathways">Explore lessons</a></div>`}
        <a class="btn btn--ghost" data-nav href="#/">Back to progress</a>`;
    }
    const c = C.competency(id), s = status(learner, id);
    if (!c || !s) return `<h1>Review a skill</h1><p>Complete its guided practice first.</p><a class="btn" data-nav href="${c ? `#/learn/${esc(id)}/0` : "#/review"}">${c ? "Open lesson" : "See reviews"}</a>`;
    const d = learner.reviewDrafts?.[id];
    const header = `<p><a data-nav class="lesson-review" href="#/review">← Your reviews</a></p><h1>${esc(c.name)}</h1>`;
    if (!d) return `${header}${s.latest ? `<div class="notice">Review saved ${esc(date(s.latest.completedAt))}. Next suggested ${esc(date(s.dueAt))}.</div>
      <p class="hint">Your reflection: recall — ${esc(RATINGS[s.latest.recallRating])}; applying — ${esc(RATINGS[s.latest.applicationRating])}. ${s.latest.usedSupport ? "Support used before comparison." : "No in-app hints opened before comparison."} This is ungraded.</p>
      <p class="lesson-output"><strong>Your next step:</strong> ${esc(s.latest.takeaway)}</p>
      <details class="card"><summary>See your last attempt</summary><h3>Recall</h3><p class="lesson-output">${esc(s.latest.recall)}</p><h3>Apply</h3><p>${esc(s.latest.exercise.prompt)}</p><p class="lesson-output">${esc(s.latest.application)}</p></details>`
      : `<p class="lead">Try recalling the main moves and one common mistake. Then tackle a practice question without answer choices.</p>`}
      <form data-form="review-start" data-cap="${esc(id)}"><button class="btn" type="submit">${s.latest ? "Practise again" : "Start review"}</button></form>
      <a class="btn btn--ghost" data-nav href="#/competency/${esc(id)}">Continue learning</a>`;
    const reference = `<section class="card"><h2>Compare the reasoning</h2><h3>The main moves</h3><ul>${d.moves.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
      <h3>Application example</h3><p class="lesson-output">${esc(d.exercise.answer)}</p><p class="hint">Other wording can work. Check your reasoning against the details; an example match alone is not a grade.</p></section>`;
    if (!d.attempt) return `${header}<p class="lead">Try from memory first. If you get stuck, use the support and keep going.</p>
      <form data-form="review-attempt" data-cap="${esc(id)}">
        <div class="field"><label for="review-recall">1. What do you remember?</label><p id="review-recall-hint" class="hint">In your own words: the main moves for “${esc(c.canDo)}” and a mistake to watch for.</p>
          <textarea id="review-recall" name="recall" maxlength="12000" aria-describedby="review-recall-hint" required>${esc(d.recall)}</textarea></div>
        <div class="field"><label for="review-application">2. Apply the idea</label><p id="review-task" class="lesson-output">${esc(d.exercise.prompt)}</p>
          <textarea id="review-application" name="application" maxlength="12000" aria-describedby="review-task" required>${esc(d.application)}</textarea></div>
        <p class="hint">Draft saved as you type on this device. Your first submitted attempt stays unchanged so you can compare it honestly.</p>
        <button class="btn" type="submit">Save attempt &amp; compare</button>
        ${d.usedSupport ? "" : `<button class="btn btn--ghost" type="button" data-action="review-help" data-cap="${esc(id)}">Need help? Show support</button>`}
      </form><p id="reviewError" role="alert"></p>${d.usedSupport ? `<p class="notice">Support is open. This attempt will be recorded as supported.</p>${reference}` : ""}`;
    const options = Object.entries(RATINGS).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    return `${header}<p class="notice">Attempt saved. Compare it below, then choose what to practise next. Your answers have not been graded.</p>
      <section class="card"><h2>Your first attempt</h2><h3>Recall</h3><p class="lesson-output">${esc(d.attempt.recall)}</p><h3>Apply</h3><p>${esc(d.exercise.prompt)}</p><p class="lesson-output">${esc(d.attempt.application)}</p></section>
      ${reference}<form data-form="review-finish" data-cap="${esc(id)}">
        <div class="field"><label for="review-recall-rating">How did recall feel?</label><select id="review-recall-rating" name="recallRating" required><option value="">Choose…</option>${options}</select></div>
        <div class="field"><label for="review-application-rating">How did applying it feel?</label><select id="review-application-rating" name="applicationRating" required><option value="">Choose…</option>${options}</select></div>
        <div class="field"><label for="review-takeaway">One thing to keep or practise next</label><textarea id="review-takeaway" name="takeaway" maxlength="4000" required></textarea></div>
        <button class="btn" type="submit">Save reflection</button></form><p id="reviewError" role="alert"></p>`;
  }
  return { status, queue, exercise, begin, draft, reveal, submit, finish, history, summary, render };
})();
