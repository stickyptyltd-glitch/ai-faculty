/* AI Faculty — Pathway Engine.
 * Output = the next best learning action, not necessarily "the next lesson".
 * Walks: diagnostic → foundation module → choose a work pathway → pathway → capstone.
 * See docs/04-learning-engine.md and docs/09-work-pathways.md.
 */
window.PATHWAY = (function () {
  const C = window.CONTENT;
  const M = window.MODEL;

  // Spaced retrieval cadence: a completed competency's ungraded quick-check resurfaces after this
  // many days of no exposure, interleaved at competency boundaries (10-pedagogy-review §4.2).
  const REVISIT_AFTER_DAYS = 3;
  const DAY_MS = 86400000;

  function lastChallengeTime(learner, capId) {
    const c = C.competency(capId);
    if (!c) return 0;
    let latest = 0;
    c.challenges.forEach(ch => {
      const rec = learner.challenges && learner.challenges[ch.id];
      if (rec && rec.completedAt) {
        const t = Date.parse(rec.completedAt);
        if (t > latest) latest = t;
      }
    });
    return latest;
  }

  // Is this completed competency due for its retrieval quick-check? Anchor = most recent exposure,
  // i.e. when it was last done OR last revisited — whichever is more recent.
  function dueFor(learner, capId) {
    if (!M.competencyComplete(learner, capId)) return null;
    const last = lastChallengeTime(learner, capId);
    if (!last) return null;
    const lastRev = learner.revisits && learner.revisits[capId];
    const anchor = Math.max(last, lastRev ? Date.parse(lastRev) : 0);
    const days = (Date.now() - anchor) / DAY_MS;
    return days >= REVISIT_AFTER_DAYS ? days : null;
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
      // Competency is fully done — if it's been > REVISIT_AFTER_DAYS since it was last touched,
      // interleave its ungraded quick-check back in before moving to the next block (only while
      // the learner is still actively working this module — never nag after it's finished).
      const since = dueFor(learner, comp.id);
      if (since && !M.moduleComplete(learner, moduleId)) {
        const days = Math.round(since);
        return {
          action: "revisit", capId: comp.id, capName: comp.name,
          reason: `${comp.id} (${comp.name}) is ${days} day${days === 1 ? "" : "s"} old. A quick check keeps it sharp before you push on — it's ungraded and takes a minute.`,
          href: `#/learn/${comp.id}/4`,
        };
      }
    }

    const cp = cps.find(x => M.checkpointReady(learner, x.id) && !M.checkpointDone(learner, x.id));
    if (cp) {
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
      const rec = learner.intake && C.recommendPathway(learner.intake.b);
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
      revisit: "Quick check — revisit",
      checkpoint: "Start the assessment",
      "choose-pathway": "Choose a work pathway",
      advance: "See work pathways",
    }[a] || "Continue";
  }

  return { next, actionVerb, walkModule };
})();
