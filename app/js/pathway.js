/* AI Faculty — Pathway Engine.
 * Output = the next best learning action, not necessarily "the next lesson".
 * See docs/04-learning-engine.md.
 */
window.PATHWAY = (function () {
  const { levelIndex, isDiagnosed, firstUnmastered, evidenceFor } = window.MODEL;

  // Returns { action, capId, capName, reason, href }
  function next(learner) {
    if (!isDiagnosed(learner)) {
      return {
        action: "diagnose",
        reason: "We don't yet have your starting point. The diagnostic takes a few minutes and isn't graded.",
        href: "#/diagnostic",
      };
    }

    const cap = firstUnmastered(learner);
    if (!cap) {
      return {
        action: "advance",
        reason: "You've reached at least 'independent' on all seven competencies of AI-Assisted Workflow Designer. Time to consolidate with a transfer challenge or move to the next capability.",
        href: "#/evidence",
      };
    }

    const c = learner.capabilities[cap.id];
    const idx = levelIndex(c.state);
    const hasEvidence = evidenceFor(learner, cap.id).length > 0;

    if (idx <= 0) {
      return {
        action: "learn",
        capId: cap.id, capName: cap.name,
        reason: `${cap.id} (${cap.name}) is the next competency and you haven't started it. Begin with the short teaching.`,
        href: `#/learn/${cap.id}`,
      };
    }
    if (idx === 1) { // emerging -> needs practice
      return {
        action: "practise",
        capId: cap.id, capName: cap.name,
        reason: `You understand ${cap.name}. Now do it on a real task of your own so it produces evidence.`,
        href: `#/practise/${cap.id}`,
      };
    }
    if (idx === 2 && !hasEvidence) { // guided but no evidence recorded
      return {
        action: "demonstrate",
        capId: cap.id, capName: cap.name,
        reason: `You can do ${cap.name} with support. One clean independent attempt will record it as evidence.`,
        href: `#/practise/${cap.id}`,
      };
    }
    // guided with evidence, or anything below independent — push for the independent rep
    return {
      action: "practise",
      capId: cap.id, capName: cap.name,
      reason: `Keep working ${cap.name} until you can do it independently and cleanly.`,
      href: `#/practise/${cap.id}`,
    };
  }

  function actionVerb(action) {
    return {
      diagnose: "Start the diagnostic",
      learn: "Learn it",
      practise: "Practise it",
      demonstrate: "Demonstrate it",
      advance: "Review & advance",
    }[action] || "Continue";
  }

  return { next, actionVerb };
})();
