/* AI Faculty — Pathway Engine.
 * Output = the next best learning action, not necessarily "the next lesson".
 * Walks: diagnostic → foundation module → choose a work pathway → pathway → capstone.
 * See docs/04-learning-engine.md and docs/09-work-pathways.md.
 */
window.PATHWAY = (function () {
  const C = window.CONTENT;
  const M = window.MODEL;

  // Delayed written recall and application; the separate review space also includes
  // taught skills after a module is complete. In-module reminders stay at boundaries.
  function dueFor(learner, capId) {
    if (!M.competencyComplete(learner, capId)) return null;
    const review = window.REVIEW.status(learner, capId);
    return review?.due ? review : null;
  }

  // The covered capability with the weakest current state — the natural target when a checkpoint
  // hasn't been met, so the engine branches back to that teaching rather than re-running blindly.
  function weakestCovered(learner, capIds) {
    const { LEVEL_ORDER } = C;
    let weak = null, min = Infinity;
    capIds.forEach(id => {
      const level = learner.capabilities[id] && learner.capabilities[id].state;
      const idx = LEVEL_ORDER.indexOf(level);
      if (idx >= 0 && idx < min) { min = idx; weak = C.competency(id); }
    });
    return weak || C.competency(capIds[0]) || { id: capIds[0] || "", name: capIds[0] || "" };
  }

  function branchOnCheckpoint(learner, cp) {
    const attempt = learner.checkpointAttempts && learner.checkpointAttempts[cp.id];
    if (attempt && attempt.verdict !== "ready") {
      const weak = weakestCovered(learner, cp.after);
      const dims = (attempt.weak && attempt.weak.length) ? attempt.weak.join(", ") : "deeper specifics";
      const second = attempt.disagreement
        ? ` — a stricter second pass disagreed with the first (reasoned review)`
        : attempt.assessor === 2 ? " — confirmed against the stricter bar" : "";
      return {
        action: "branch", cpId: cp.id, capId: weak.id, capName: weak.name, weakDims: attempt.weak,
        reason: `${cp.title} isn't met yet (${attempt.verdict}${second}). The rubric wanted more on ${dims} —
        branch back to ${weak.name} and re-attempt with that in mind. Re-running an unmet assessment cold is
        the slowest way forward (08-assessment-model §5.4).`,
        href: `#/learn/${weak.id}/3`,
      };
    }
    return null;
  }

  function walkModule(learner, moduleId) {
    const caps = C.competenciesFor(moduleId);
    const cps = C.checkpointsFor(moduleId);

    for (const comp of caps) {
      const cap = learner.capabilities[comp.id];
      if (!cap.taughtAt) {
        return {
          action: "learn", capId: comp.id, capName: comp.name,
          reason: `${comp.id} (${comp.name}) is next. Start with the lesson — it teaches the idea before you apply it.`,
          href: `#/learn/${comp.id}/0`,
        };
      }
      const ch = M.nextChallenge(learner, comp.id);
      if (ch) {
        const p = M.challengeProgress(learner, comp.id);
        return {
          action: "challenge",
          capId: comp.id, capName: comp.name, challengeId: ch.id,
          reason: p.done === 0
            ? `You've done the ${comp.name} lesson. Now challenge 1 of ${p.total} — "${ch.title}" — on your own real task.`
            : `Keep going on ${comp.name}: challenge ${p.done + 1} of ${p.total} — "${ch.title}" (${ch.ladder.toLowerCase()}).`,
          href: `#/challenge/${comp.id}/${ch.id}`,
        };
      }
      // Competency is fully done — when a delayed review is due,
      // interleave recall and application before the next block (only while
      // the learner is still actively working this module — never nag after it's finished).
      const since = dueFor(learner, comp.id);
      if (since && !M.moduleComplete(learner, moduleId)) {
        return {
          action: "revisit", capId: comp.id, capName: comp.name,
          reason: `Return to ${comp.name}: recall the main moves, try an application question, then compare. This review is ungraded.`,
          href: `#/review/${comp.id}`,
        };
      }
    }

    const cp = cps.find(x => M.checkpointReady(learner, x.id) && !M.checkpointDone(learner, x.id));
    if (cp) {
      const branch = branchOnCheckpoint(learner, cp);
      if (branch) return branch;
      return {
        action: "checkpoint", cpId: cp.id, cpTitle: cp.title,
        reason: `${cp.title} — a combined practical assessment across ${cp.after.join(", ")}.`,
        href: `#/checkpoint/${cp.id}`,
      };
    }
    return null;
  }

  function next(learner) {
    if (!M.isDiagnosed(learner)) {
      return { action: "diagnose",
        reason: "We don't have your starting point yet. The diagnostic takes a few minutes and isn't graded.",
        href: "#/diagnostic" };
    }

    // 1) Foundation module
    if (!M.foundationDone(learner)) {
      const step = walkModule(learner, "foundation");
      if (step) return step;
    }

    // 2) Choose a work pathway
    if (!learner.pathway) {
      const rec = learner.intake && C.recommendPathway(learner.intake, learner.track);
      return { action: "choose-pathway",
        reason: rec
          ? `Foundation done. Based on what you told us in the diagnostic, "${rec.title}" looks like a good fit — or browse all pathways and pick your own.`
          : "Foundation done. Now pick a work pathway — it takes these skills into the real tasks of your job.",
        href: "#/pathways" };
    }

    // 3) The chosen pathway
    const step = walkModule(learner, learner.pathway);
    if (step) return step;

    // 4) Everything in the current pathway is done
    const p = C.pathway(learner.pathway);
    return { action: "advance",
      reason: `You've completed the ${p ? p.title : "current"} pathway, capstone included. Pick another work pathway, or deepen this one as new capabilities are added.`,
      href: "#/pathways" };
  }

  function actionVerb(a) {
    return {
      diagnose: "Start the diagnostic",
      learn: "Start the lesson",
      challenge: "Start the challenge",
      revisit: "Remember & apply",
      checkpoint: "Start the assessment",
      branch: "Branch back",
      "choose-pathway": "Choose a work pathway",
      advance: "See work pathways",
    }[a] || "Continue";
  }

  return { next, actionVerb, walkModule };
})();
