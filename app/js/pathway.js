/* AI Faculty — Pathway Engine.
 * Output = the next best learning action, not necessarily "the next lesson".
 * Walks: diagnostic → per competency (learn → each challenge) → checkpoints → advance.
 * See docs/04-learning-engine.md.
 */
window.PATHWAY = (function () {
  const C = window.CONTENT;
  const M = window.MODEL;

  function next(learner) {
    if (!M.isDiagnosed(learner)) {
      return {
        action: "diagnose",
        reason: "We don't yet have your starting point. The diagnostic takes a few minutes and isn't graded.",
        href: "#/diagnostic",
      };
    }

    for (const comp of C.COMPETENCIES) {
      const cap = learner.capabilities[comp.id];

      // interleave the checkpoint as soon as its prerequisites are complete
      const cpDue = C.CHECKPOINTS.find(cp =>
        cp.after[cp.after.length - 1] === comp.id &&
        M.checkpointReady(learner, cp.id) &&
        !M.checkpointDone(learner, cp.id));
      // (handled after the competency loop below — see checkpoint pass)

      if (!cap.taughtAt) {
        return {
          action: "learn", capId: comp.id, capName: comp.name,
          reason: `${comp.id} (${comp.name}) is next and you haven't started it. Begin with the short teaching.`,
          href: `#/learn/${comp.id}`,
        };
      }

      const ch = M.nextChallenge(learner, comp.id);
      if (ch) {
        const p = M.challengeProgress(learner, comp.id);
        const first = p.done === 0;
        return {
          action: "challenge",
          capId: comp.id, capName: comp.name, challengeId: ch.id, challengeTitle: ch.title,
          reason: first
            ? `Practise ${comp.name} on a real task of your own — challenge 1 of ${p.total}: "${ch.title}".`
            : `Keep building ${comp.name} — challenge ${p.done + 1} of ${p.total}: "${ch.title}" (${ch.ladder.toLowerCase()}).`,
          href: `#/challenge/${comp.id}/${ch.id}`,
        };
      }

      // competency's challenges are all done — is its checkpoint now due?
      if (cpDue) {
        return {
          action: "checkpoint", cpId: cpDue.id, cpTitle: cpDue.title,
          reason: `You've finished the competencies for "${cpDue.title}". Time for the combined practical assessment.`,
          href: `#/checkpoint/${cpDue.id}`,
        };
      }
    }

    // any remaining ready-but-undone checkpoints
    const cp = C.CHECKPOINTS.find(x => M.checkpointReady(learner, x.id) && !M.checkpointDone(learner, x.id));
    if (cp) {
      return {
        action: "checkpoint", cpId: cp.id, cpTitle: cp.title,
        reason: `"${cp.title}" is unlocked — a combined practical assessment across ${cp.after.join(", ")}.`,
        href: `#/checkpoint/${cp.id}`,
      };
    }

    return {
      action: "advance",
      reason: "You've completed every competency, both practical checkpoints and the capstone. AI-Assisted Workflow Designer is demonstrated. Next: a transfer project or the next capability in the graph.",
      href: "#/evidence",
    };
  }

  function actionVerb(a) {
    return {
      diagnose: "Start the diagnostic",
      learn: "Learn it",
      challenge: "Start the challenge",
      checkpoint: "Start the assessment",
      advance: "Review & advance",
    }[a] || "Continue";
  }

  return { next, actionVerb };
})();
