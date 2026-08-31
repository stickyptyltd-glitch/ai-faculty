/* AI Faculty — Learner Intelligence Model helpers.
 * A living capability model, not a static profile. See docs/04-learning-engine.md.
 */
window.MODEL = (function () {
  const { LEVEL_ORDER, LEVELS, COMPETENCIES } = window.CONTENT;

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
    if (levelIndex(targetState) > levelIndex(cap.state)) {
      cap.state = targetState;
    }
    if (confidence) cap.confidence = confidence;
  }

  function markTaught(learner, capId) {
    const cap = learner.capabilities[capId];
    if (!cap) return;
    cap.taughtAt = new Date().toISOString();
    raise(learner, capId, "emerging", "low");
  }

  function addEvidence(learner, ev) {
    ev.id = "ev_" + Date.now().toString(36);
    ev.createdAt = new Date().toISOString();
    learner.evidence.unshift(ev);
    return ev;
  }

  function evidenceFor(learner, capId) {
    return learner.evidence.filter(e => e.capId === capId);
  }

  // Overall progress across the master capability = mean level / 5.
  function overallPct(learner) {
    const vals = COMPETENCIES.map(c => levelIndex(learner.capabilities[c.id].state));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round((mean / (LEVELS.length - 1)) * 100);
  }

  function firstUnmastered(learner) {
    // "mastered enough to move on" = independent (index 3) or better
    return COMPETENCIES.find(c => levelIndex(learner.capabilities[c.id].state) < 3) || null;
  }

  function isDiagnosed(learner) {
    return !!learner.intake && !!learner.track;
  }

  function summary(learner) {
    return COMPETENCIES.map(c => ({
      id: c.id,
      name: c.name,
      state: learner.capabilities[c.id].state,
      stateLabel: levelLabel(learner.capabilities[c.id].state),
      confidence: learner.capabilities[c.id].confidence,
      evidenceCount: evidenceFor(learner, c.id).length,
    }));
  }

  return {
    levelIndex, levelLabel, raise, markTaught, addEvidence, evidenceFor,
    overallPct, firstUnmastered, isDiagnosed, summary,
  };
})();
