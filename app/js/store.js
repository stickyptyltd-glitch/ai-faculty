/* AI Faculty — persistence. localStorage-backed learner record.
 * Restricted-zone data (see docs/01-architecture.md) stays on this device only.
 */
window.STORE = (function () {
  const KEY = "aifaculty.learner.v1";

  function blankLearner() {
    const caps = {};
    window.CONTENT.COMPETENCIES.forEach(c => {
      caps[c.id] = { state: "unknown", confidence: "low", taughtAt: null };
    });
    const now = new Date().toISOString();
    return {
      version: 1,
      createdAt: now,
      updatedAt: now,
      intake: null,          // filled by the diagnostic
      track: null,           // personal | professional | mixed
      capabilities: caps,
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
    if (!l) l = save(blankLearner());
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
