/* AI Faculty — Progress view (the 8-panel learner view).
 * Answers, at a glance: Where am I? Why am I here? What have I proved? What do I do next?
 */
window.PROGRESS = (function () {
  const C = window.CONTENT;
  const M = window.MODEL;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  }
  function pill(state, label) {
    return `<span class="pill pill--${state}">${esc(label)}</span>`;
  }

  function render(learner) {
    const diagnosed = M.isDiagnosed(learner);
    const pct = M.overallPct(learner);
    const nba = window.PATHWAY.next(learner);
    const caps = M.summary(learner);
    const trackLabel = { personal: "Personal", professional: "Professional", mixed: "Mixed" }[learner.track] || "—";

    const goal = diagnosed
      ? `${esc(C.MASTER_CAPABILITY.title)} · <strong>${trackLabel}</strong> track`
      : "Not set — complete the diagnostic";

    const nextCard = `
      <div class="card next">
        <div class="card__label">Active mission — do this next</div>
        <p style="margin-bottom:10px">${esc(nba.reason)}</p>
        <a class="btn" data-nav href="${nba.href}">${esc(window.PATHWAY.actionVerb(nba.action))}</a>
      </div>`;

    const capRows = caps.map(c => {
      const href = c.challengesDone === 0 && M.levelIndex(c.state) === 0
        ? `#/learn/${c.id}` : `#/competency/${c.id}`;
      return `
      <a class="caprow" data-nav href="${href}">
        <span class="caprow__id">${c.id}</span>
        <span class="caprow__name">${esc(c.name)}
          <span style="color:var(--text-dim);font-size:12px">· ${c.challengesDone}/${c.challengesTotal} challenges</span>
        </span>
        ${pill(c.state, c.stateLabel)}
      </a>`;
    }).join("");

    const cpRows = C.CHECKPOINTS.map(cp => {
      const done = M.checkpointDone(learner, cp.id);
      const ready = M.checkpointReady(learner, cp.id);
      const state = done ? "independent" : ready ? "guided" : "unknown";
      const label = done ? "Passed" : ready ? "Unlocked" : `Locked · needs ${cp.after.join(", ")}`;
      const inner = `<span class="caprow__id">✔</span>
        <span class="caprow__name">${esc(cp.title)}</span>${pill(state, label)}`;
      return (done || ready)
        ? `<a class="caprow" data-nav href="#/checkpoint/${cp.id}">${inner}</a>`
        : `<div class="caprow" style="opacity:.55">${inner}</div>`;
    }).join("");

    const evidenceCount = learner.evidence.length;
    const mastered = caps.filter(c => c.complete).length;

    return `
      <h1>Your progress</h1>
      <p class="lead">${goal}</p>
      ${nextCard}
      <div class="grid grid--2">
        <div class="card card--tight">
          <div class="card__label">Where am I</div>
          <div class="bar"><span style="width:${pct}%"></span></div>
          <p style="margin:0">${pct}% across the capability · <strong>${mastered}/7</strong> competencies complete</p>
        </div>
        <div class="card card--tight">
          <div class="card__label">What have I proved</div>
          <p style="margin:0"><strong>${evidenceCount}</strong> evidence record${evidenceCount === 1 ? "" : "s"} ·
          <a data-nav href="#/evidence">view</a></p>
        </div>
      </div>

      <h2>Competencies &amp; challenges</h2>
      <div class="caplist">${capRows}</div>

      <h2>Practical assessments</h2>
      <div class="caplist">${cpRows}</div>

      <h2>Pathway</h2>
      <a class="btn btn--ghost" data-nav href="#/pathway">See the 10-stage pathway</a>
    `;
  }

  return { render, esc };
})();
