/* AI Faculty — Learner Intelligence Model helpers.
 * A living capability model, not a static profile. See docs/04-learning-engine.md.
 */
window.MODEL = (function () {
  const { LEVEL_ORDER, LEVELS, COMPETENCIES, CHECKPOINTS } = window.CONTENT;

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
    const c = COMPETENCIES.find(x => x.id === capId);
    if (!c) return null;
    return c.challenges.find(ch => !challengeDone(learner, ch.id)) || null;
  }
  function challengeProgress(learner, capId) {
    const c = COMPETENCIES.find(x => x.id === capId);
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
    const cp = CHECKPOINTS.find(x => x.id === cpId);
    if (!cp) return false;
    return cp.after.every(capId => competencyComplete(learner, capId));
  }
  function markCheckpointDone(learner, cpId, evidenceId) {
    if (!learner.checkpoints) learner.checkpoints = {};
    learner.checkpoints[cpId] = { completedAt: new Date().toISOString(), evidenceId };
  }

  // ---- rollups --------------------------------------------------
  function overallPct(learner) {
    const vals = COMPETENCIES.map(c => levelIndex(learner.capabilities[c.id].state));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round((mean / (LEVELS.length - 1)) * 100);
  }
  function isDiagnosed(learner) {
    return !!learner.intake && !!learner.track;
  }
  function allComplete(learner) {
    return COMPETENCIES.every(c => competencyComplete(learner, c.id)) &&
           CHECKPOINTS.every(cp => checkpointDone(learner, cp.id));
  }

  function summary(learner) {
    return COMPETENCIES.map(c => {
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
    overallPct, isDiagnosed, allComplete, summary,
  };
})();
