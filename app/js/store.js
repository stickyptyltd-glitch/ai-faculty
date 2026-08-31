/* AI Faculty — persistence. localStorage-backed learner record.
 * Restricted-zone data (see docs/01-architecture.md) stays on this device only.
 */
window.STORE = (function () {
  const KEY = "aifaculty.learner.v1";

  function blankLearner() {
    const caps = {};
    window.CONTENT.allCompetencies().forEach(c => {
      caps[c.id] = { state: "unknown", confidence: "low", taughtAt: null };
    });
    const now = new Date().toISOString();
    return {
      version: 1,
      createdAt: now,
      updatedAt: now,
      intake: null,          // filled by the diagnostic
      track: null,           // personal | professional | mixed
      module: "foundation",  // "foundation" | <pathwayId> — what the learner is working now
      pathway: null,         // chosen work pathway id (once foundation is done)
      foundationSkipped: false,
      capabilities: caps,
      projects: [],          // { id, name, context, goal, createdAt } — Applied Projects
      challenges: {},        // { "C1.1": { completedAt, evidenceId } }
      checkpoints: {},       // { "CP1": { completedAt, evidenceId } }
      evidence: [],          // { id, capId, kind, fields, feedback, confidence, createdAt }
      activity: [],          // { ts, kind, detail }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("STORE.load failed", e);
      return null;
    }
  }

  function save(learner) {
    learner.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(learner));
    } catch (e) {
      console.warn("STORE.save failed", e);
    }
    return learner;
  }

  function get() {
    let l = load();
    if (!l) { l = save(blankLearner()); return l; }
    // forward-compatible defaults for records saved by an earlier version
    if (!l.challenges) l.challenges = {};
    if (!l.checkpoints) l.checkpoints = {};
    if (!l.projects) l.projects = [];
    if (!l.module) l.module = "foundation";
    if (l.pathway === undefined) l.pathway = null;
    if (l.foundationSkipped === undefined) l.foundationSkipped = false;
    // add capability slots for any competency not seen before (e.g. new pathway)
    window.CONTENT.allCompetencies().forEach(c => {
      if (!l.capabilities[c.id]) l.capabilities[c.id] = { state: "unknown", confidence: "low", taughtAt: null };
    });
    return l;
  }

  function update(fn) {
    const l = get();
    fn(l);
    return save(l);
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    return get();
  }

  function log(kind, detail) {
    update(l => { l.activity.unshift({ ts: new Date().toISOString(), kind, detail }); });
  }

  return { get, update, reset, log, blankLearner };
})();
