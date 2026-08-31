/* AI Faculty — Progress view.
 * At a glance: Where am I? Why am I here? What have I proved? What do I do next?
 */
window.PROGRESS = (function () {
  const C = window.CONTENT;
  const M = window.MODEL;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  }
  const pill = (state, label) => `<span class="pill pill--${state}">${esc(label)}</span>`;

  function capList(learner, moduleId) {
    return M.summary(learner, moduleId).map(c => {
      const href = (c.challengesDone === 0 && M.levelIndex(c.state) === 0)
        ? `#/learn/${c.id}/0` : `#/competency/${c.id}`;
      return `<a class="caprow" data-nav href="${href}">
        <span class="caprow__id">${c.id}</span>
        <span class="caprow__name">${esc(c.name)}
          <span style="color:var(--text-dim);font-size:12px">· ${c.challengesDone}/${c.challengesTotal}</span></span>
        ${pill(c.state, c.stateLabel)}
      </a>`;
    }).join("");
  }

  function checkpointRows(learner, moduleId) {
    return C.checkpointsFor(moduleId).map(cp => {
      const done = M.checkpointDone(learner, cp.id);
      const ready = M.checkpointReady(learner, cp.id);
      const state = done ? "independent" : ready ? "guided" : "unknown";
      const label = done ? "Passed" : ready ? "Unlocked" : `Locked`;
      const inner = `<span class="caprow__id">✔</span>
        <span class="caprow__name">${esc(cp.title)}</span>${pill(state, label)}`;
      return (done || ready)
        ? `<a class="caprow" data-nav href="#/checkpoint/${cp.id}">${inner}</a>`
        : `<div class="caprow" style="opacity:.5">${inner}</div>`;
    }).join("");
  }

  function moduleBlock(learner, moduleId, title) {
    const pct = M.overallPct(learner, moduleId);
    const caps = M.summary(learner, moduleId);
    const done = caps.filter(c => c.complete).length;
    return `
      <div class="card card--tight" style="margin-bottom:10px">
        <div class="card__label">${esc(title)}</div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <p style="margin:0">${pct}% · <strong>${done}/${caps.length}</strong> competencies complete</p>
      </div>
      <div class="caplist">${capList(learner, moduleId)}</div>
      <div class="caplist" style="margin-top:8px">${checkpointRows(learner, moduleId)}</div>`;
  }

  function render(learner) {
    const diagnosed = M.isDiagnosed(learner);
    const nba = window.PATHWAY.next(learner);
    const trackLabel = { personal: "Personal", professional: "Professional", mixed: "Mixed" }[learner.track] || "—";
    const chosen = learner.pathway ? C.pathway(learner.pathway) : null;

    const goal = diagnosed
      ? `Foundation: ${esc(C.MASTER_CAPABILITY.title)}${chosen ? ` · Pathway: <strong>${esc(chosen.title)}</strong>` : ""} · ${trackLabel}`
      : "Not set — complete the diagnostic";

    const nextCard = `
      <div class="card next">
        <div class="card__label">Do this next</div>
        <p style="margin-bottom:10px">${esc(nba.reason)}</p>
        <a class="btn" data-nav href="${nba.href}">${esc(window.PATHWAY.actionVerb(nba.action))}</a>
      </div>`;

    const evidenceCount = learner.evidence.length;

    // work pathway section
    let pathwaySection;
    if (chosen && chosen.competencies.length) {
      pathwaySection = `<h2>Work pathway — ${esc(chosen.title)}</h2>${moduleBlock(learner, chosen.id, chosen.title)}`;
    } else if (chosen) {
      pathwaySection = `<h2>Work pathway — ${esc(chosen.title)}</h2>
        <div class="notice">This pathway is planned — content coming soon. <a data-nav href="#/pathways">Switch pathway</a>.</div>`;
    } else if (M.foundationDone(learner)) {
      pathwaySection = `<h2>Work pathway</h2>
        <div class="card next"><p style="margin:0 0 10px">Foundation done — choose the pathway that matches your work.</p>
          <a class="btn" data-nav href="#/pathways">Browse work pathways</a></div>`;
    } else {
      pathwaySection = `<h2>Work pathway</h2>
        <div class="notice">Unlocks when you finish the foundation module (or skip it — founder option on the
        <a data-nav href="#/pathways">pathways</a> page).</div>`;
    }

    // applied projects
    const projSection = (learner.projects && learner.projects.length)
      ? `<div class="caplist">` + learner.projects.map(p => {
          const mod = M.foundationDone(learner) && learner.pathway ? learner.pathway : "foundation";
          const cov = M.projectCoverage(learner, p.id, mod).length;
          const dem = M.projectDemonstrated(learner, p.id, mod);
          const tot = C.competenciesFor(mod).length;
          return `<a class="caprow" data-nav href="#/projects">
            <span class="caprow__id">▷</span>
            <span class="caprow__name">${esc(p.name)}
              <span style="color:var(--text-dim);font-size:12px">· ${cov}/${tot} covered</span></span>
            ${pill(dem ? "independent" : "guided", dem ? "Demonstrated" : "In progress")}</a>`;
        }).join("") + `</div>`
      : `<div class="notice">Register a real task to apply the course to — <a data-nav href="#/projects">add a project</a>.</div>`;

    return `
      <h1>Your progress</h1>
      <p class="lead">${goal}</p>
      ${nextCard}
      <div class="card card--tight">
        <div class="card__label">What have I proved</div>
        <p style="margin:0"><strong>${evidenceCount}</strong> evidence record${evidenceCount === 1 ? "" : "s"} ·
          <a data-nav href="#/evidence">view portfolio</a></p>
      </div>

      <h2>Foundation module</h2>
      ${moduleBlock(learner, "foundation", C.MASTER_CAPABILITY.title)}

      ${pathwaySection}

      <h2>Applied Projects</h2>
      ${projSection}
    `;
  }

  return { render, esc };
})();
