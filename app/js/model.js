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
  // which of a module's competencies have any evidence record against this project
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
  // "Demonstrated" is an assessed claim, so it now requires assessed evidence: every
  // competency in the module covered on this project, and at least one checkpoint backing
  // it. Before v0.63 a single challenge per competency was enough, which contradicted
  // moduleComplete and let a learner badge a project they had only practised on.
  function projectDemonstrated(learner, projectId, moduleId) {
    const total = C.competenciesFor(moduleId || "foundation").length;
    if (total === 0) return false;
    if (projectCoverage(learner, projectId, moduleId).length !== total) return false;
    return projectProvenance(learner, projectId).assessed;
  }

  // ---- module rollups -----------------------------------------
  function moduleComplete(learner, moduleId) {
    const caps = C.competenciesFor(moduleId);
    const cps = C.checkpointsFor(moduleId);
    return caps.length > 0 &&
      caps.every(c => competencyComplete(learner, c.id)) &&
      cps.every(cp => checkpointDone(learner, cp.id));
  }
  // Average demonstrated level across the module's competencies. Being taught is not
  // attainment, so a competency only contributes once the learner has evidence for it --
  // otherwise browsing every lesson manufactures 20% with nothing recorded.
  function overallPct(learner, moduleId) {
    const caps = C.competenciesFor(moduleId || "foundation");
    if (!caps.length) return 0;
    const vals = caps.map(c =>
      (evidenceFor(learner, c.id).length ? levelIndex(learner.capabilities[c.id].state) : 0));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round((mean / (LEVELS.length - 1)) * 100);
  }

  // The share of the module's competencies whose recorded level rests on assessed
  // (checkpoint) evidence rather than challenge practice alone.
  function assessedPct(learner, moduleId) {
    const caps = C.competenciesFor(moduleId || "foundation");
    if (!caps.length) return 0;
    const backing = checkpointBacking(learner);
    const assessed = caps.filter(c => capabilityProvenance(learner, c.id, backing).assessed).length;
    return Math.round((assessed / caps.length) * 100);
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

  // ---- provenance ---------------------------------------------------
  // What a claim actually rests on. A capability state is only as strong as the
  // evidence behind it, and a challenge is formative: self-confirmed and scored
  // by local heuristics, never an independent judgement. Only a checkpoint goes
  // through the Assessment Resolution Protocol. Anything rendering a claim to
  // the learner or to a third party should say which of these it is.
  function checkpointBacking(learner) {
    const out = {};
    Object.keys((learner && learner.checkpoints) || {}).forEach(cpId => {
      const cp = C.checkpoint(cpId);
      if (!cp) return;
      cp.after.forEach(capId => {
        if (!out[capId]) out[capId] = [];
        out[capId].push(cpId);
      });
    });
    return out;
  }

  function capabilityProvenance(learner, capId, backing) {
    const back = backing || checkpointBacking(learner);
    const checkpoints = (back[capId] || []).slice().sort();
    const kinds = [];
    evidenceFor(learner, capId).forEach(e => {
      if (e.kind && !kinds.includes(e.kind)) kinds.push(e.kind);
    });
    const assessed = checkpoints.length > 0;
    const formative = kinds.includes("challenge");
    let label;
    if (assessed && formative) label = "challenge + " + checkpoints.join(", ");
    else if (assessed) label = checkpoints.join(", ");
    else if (formative) label = "formative only (challenge)";
    else label = kinds.length ? kinds.join(", ") : "no evidence";
    return { assessed, formative, checkpoints, kinds, label };
  }

  function projectProvenance(learner, projectId) {
    const cps = [];
    evidenceForProject(learner, projectId).forEach(e => {
      if (e.checkpointId && !cps.includes(e.checkpointId)) cps.push(e.checkpointId);
    });
    cps.sort();
    const hasChallenge = evidenceForProject(learner, projectId).some(e => e.kind === "challenge");
    return { assessed: cps.length > 0, formativeOnly: hasChallenge && cps.length === 0, checkpoints: cps };
  }

  // The Assessment Resolution Protocol's second pass is the SAME rubric engine re-run at a
  // higher bar -- one algorithm asked twice, sharing every blind spot. It is real corroboration
  // and it really detects disagreement, but it is not an independent assessor, and nothing in the
  // system may imply otherwise. docs/08-assessment-model.md still lists real independent
  // assessors (human + AI) as to do; this naming is what keeps the code honest about that.
  // How many records are formative vs assessed, and whether a checkpoint was passed at all.
  // Any "what have I proved" style count needs this split: a pile of challenge records is not
  // proof of anything, it is practice.
  function evidenceSplit(learner) {
    const evs = (learner && learner.evidence) || [];
    const assessed = evs.filter(e => e.kind === "checkpoint").length;
    return {
      total: evs.length,
      assessed,
      formative: evs.length - assessed,
      checkpointsPassed: Object.keys((learner && learner.checkpoints) || {}).length,
    };
  }

  // Whether a module's completion rests on assessed evidence, or only on challenges.
  function moduleProvenance(learner, moduleId) {
    const caps = C.competenciesFor(moduleId);
    const cps = C.checkpointsFor(moduleId);
    const passed = cps.filter(cp => checkpointDone(learner, cp.id)).length;
    return {
      checkpointsPassed: passed,
      checkpointsTotal: cps.length,
      fullyAssessed: cps.length > 0 && passed === cps.length,
      challengedOnly: cps.length > 0 && passed === 0,
    };
  }

  const ARP = {
    secondPass: "stricter second pass",
    basis: "the same local rubric engine re-run at a higher bar",
    disclaimer: "No independent human or AI assessor is connected yet, so nothing here is a "
      + "corroborated second opinion. Disagreement is detected by re-running one rubric, not by "
      + "asking a second judge.",
  };

  // Derive an honest assessors line from a record rather than trusting whatever string was
  // persisted. Records written by earlier builds stored a line claiming two independent
  // assessors agreed, and a learner who upgrades must not keep asserting that.
  function assessorLineFor(ev) {
    if (!ev) return "local rubric";
    const a = ev.assessors || "";
    if (/1\s*\+\s*2/.test(a)) {
      return "local rubric + " + ARP.secondPass
        + (ev.lineage ? " (via Control Plane)" : "")
        + " — " + ARP.basis;
    }
    if (/\b1\b/.test(a)) return "local rubric, single pass";
    return a.replace(/\s*\(independent\)\s*/g, " ").trim() || "local rubric";
  }

  // Honest assessors line for an evidence record. Never says "independent".
  function assessorLine(result, lineage) {
    if (!result) return "local rubric";
    if (result.assessor !== 2) return "local rubric, single pass";
    return "local rubric + " + ARP.secondPass
      + (lineage ? " (via Control Plane)" : "")
      + " — " + ARP.basis;
  }

  const PROVENANCE_NOTE =
    "A capability state is only as strong as the evidence named on it. Formative evidence is a "
    + "competency challenge: self-confirmed, scored by local heuristics, and not a judgement. "
    + "Assessed evidence is a checkpoint passed on the local mastery rubric; where a second pass "
    + "is shown it is " + ARP.basis + ", not an independent assessor. " + ARP.disclaimer;

  return {
    levelIndex, levelLabel, raise, markTaught, addEvidence, evidenceFor,
    checkpointBacking, capabilityProvenance, projectProvenance, PROVENANCE_NOTE, ARP, assessorLine,
    evidenceSplit, moduleProvenance, assessorLineFor,
    challengeDone, nextChallenge, challengeProgress, competencyComplete, markChallengeDone,
    checkpointDone, checkpointReady, markCheckpointDone,
    addProject, project, evidenceForProject, projectCoverage, projectDemonstrated,
    moduleComplete, overallPct, assessedPct, isDiagnosed, foundationDone, summary,
  };
})();
