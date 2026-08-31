/* AI Faculty — Learner Intelligence Model helpers.
 * A living capability model, not a static profile. See docs/04-learning-engine.md.
 */
window.MODEL = (function () {
  const C = window.CONTENT;
  const { LEVEL_ORDER, LEVELS } = C;
  const comp = id => C.competency(id);

  function levelIndex(state) {
    const i = LEVEL_ORDER.indexOf(state);
    return i < 0 ? 0 : i;
  }
  function levelLabel(state) {
    const l = LEVELS.find(x => x.key === state);
    return l ? l.label : state;
  }

  // Advance a capability's state, but never downgrade.
  function raise(learner, capId, targetState, confidence) {
    const cap = learner.capabilities[capId];
    if (!cap) return;
    if (levelIndex(targetState) > levelIndex(cap.state)) cap.state = targetState;
    if (confidence) cap.confidence = confidence;
  }

  function markTaught(learner, capId) {
    const cap = learner.capabilities[capId];
    if (!cap) return;
    cap.taughtAt = new Date().toISOString();
    raise(learner, capId, "emerging", "low");
  }

  function addEvidence(learner, ev) {
    ev.id = "ev_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    ev.createdAt = new Date().toISOString();
    learner.evidence.unshift(ev);
    return ev;
  }
  function evidenceFor(learner, capId) {
    return learner.evidence.filter(e => e.capId === capId);
  }

  // ---- challenges --------------------------------------------------
  function challengeDone(learner, chId) {
    return !!(learner.challenges && learner.challenges[chId]);
  }
  function nextChallenge(learner, capId) {
    const c = comp(capId);
    if (!c) return null;
    return c.challenges.find(ch => !challengeDone(learner, ch.id)) || null;
  }
  function challengeProgress(learner, capId) {
    const c = comp(capId);
    if (!c) return { done: 0, total: 0 };
    const done = c.challenges.filter(ch => challengeDone(learner, ch.id)).length;
    return { done, total: c.challenges.length };
  }
  function competencyComplete(learner, capId) {
    const p = challengeProgress(learner, capId);
    return p.total > 0 && p.done === p.total;
  }
  function markChallengeDone(learner, chId, evidenceId) {
    if (!learner.challenges) learner.challenges = {};
    learner.challenges[chId] = { completedAt: new Date().toISOString(), evidenceId };
  }

  // ---- checkpoints -----------------------------------------------
  function checkpointDone(learner, cpId) {
    return !!(learner.checkpoints && learner.checkpoints[cpId]);
  }
  function checkpointReady(learner, cpId) {
    const cp = C.checkpoint(cpId);
    if (!cp) return false;
    return cp.after.every(capId => competencyComplete(learner, capId));
  }
  function markCheckpointDone(learner, cpId, evidenceId) {
    if (!learner.checkpoints) learner.checkpoints = {};
    learner.checkpoints[cpId] = { completedAt: new Date().toISOString(), evidenceId };
  }

  // ---- applied projects -----------------------------------------
  function addProject(learner, name, context, goal) {
    const p = { id: "pr_" + Date.now().toString(36), name, context, goal, createdAt: new Date().toISOString() };
    if (!learner.projects) learner.projects = [];
    learner.projects.push(p);
    return p;
  }
  function project(learner, id) {
    return (learner.projects || []).find(p => p.id === id) || null;
  }
  function evidenceForProject(learner, projectId) {
    return learner.evidence.filter(e => e.projectId === projectId);
  }
  // which of a module's competencies have a confirmed evidence record against this project
  function projectCoverage(learner, projectId, moduleId) {
    const caps = C.competenciesFor(moduleId || "foundation");
    const seen = new Set();
    evidenceForProject(learner, projectId).forEach(e => {
      if (e.kind === "checkpoint") {
        const cp = C.checkpoint(e.checkpointId);
        if (cp) cp.after.forEach(id => seen.add(id));
      } else if (e.capId) seen.add(e.capId);
    });
    return caps.map(c => c.id).filter(id => seen.has(id));
  }
  function projectDemonstrated(learner, projectId, moduleId) {
    const total = C.competenciesFor(moduleId || "foundation").length;
    return total > 0 && projectCoverage(learner, projectId, moduleId).length === total;
  }

  // ---- module rollups -----------------------------------------
  function moduleComplete(learner, moduleId) {
    const caps = C.competenciesFor(moduleId);
    const cps = C.checkpointsFor(moduleId);
    return caps.length > 0 &&
      caps.every(c => competencyComplete(learner, c.id)) &&
      cps.every(cp => checkpointDone(learner, cp.id));
  }
  function overallPct(learner, moduleId) {
    const caps = C.competenciesFor(moduleId || "foundation");
    if (!caps.length) return 0;
    const vals = caps.map(c => levelIndex(learner.capabilities[c.id].state));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round((mean / (LEVELS.length - 1)) * 100);
  }
  function isDiagnosed(learner) {
    return !!learner.intake && !!learner.track;
  }
  function foundationDone(learner) {
    return learner.foundationSkipped || moduleComplete(learner, "foundation");
  }

  function summary(learner, moduleId) {
    return C.competenciesFor(moduleId || "foundation").map(c => {
      const p = challengeProgress(learner, c.id);
      return {
        id: c.id,
        name: c.name,
        state: learner.capabilities[c.id].state,
        stateLabel: levelLabel(learner.capabilities[c.id].state),
        confidence: learner.capabilities[c.id].confidence,
        challengesDone: p.done,
        challengesTotal: p.total,
        complete: competencyComplete(learner, c.id),
        evidenceCount: evidenceFor(learner, c.id).length,
      };
    });
  }

  return {
    levelIndex, levelLabel, raise, markTaught, addEvidence, evidenceFor,
    challengeDone, nextChallenge, challengeProgress, competencyComplete, markChallengeDone,
    checkpointDone, checkpointReady, markCheckpointDone,
    addProject, project, evidenceForProject, projectCoverage, projectDemonstrated,
    moduleComplete, overallPct, isDiagnosed, foundationDone, summary,
  };
})();
