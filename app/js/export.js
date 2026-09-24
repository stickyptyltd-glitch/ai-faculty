/* AI Faculty — Evidence portfolio export.
 * The learner's evidence is their own (docs/01-architecture.md restricted-zone data). Export is
 * plain, no-build download: human-readable Markdown plus machine-readable JSON. No backend call —
 * a portfolio export is a local, learner-owned artefact that works signed-out too.
 */
window.EXPORT = (function () {
  const C = window.CONTENT;
  const M = window.MODEL;

  function isoNow() { return new Date().toISOString(); }
  function fileDate(d) { return (d || new Date()).toISOString().slice(0, 10); }

  function fmtDate(iso) {
    const d = new Date(iso);
    return isNaN(d) ? iso : d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 5) + " UTC";
  }

  function flat(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

  // one evidence record -> a markdown block
  function recordMd(ev, level) {
    const lvl = "#".repeat(level);
    const lines = [
      lvl + " " + (ev.title || "Untitled evidence"),
      "*" + (ev.kind || "record") + "* · confidence: " + (ev.confidence || "—") + (ev.assessors ? " · " + ev.assessors : ""),
      "**Recorded:** " + fmtDate(ev.createdAt),
      "",
    ];
    Object.entries(ev.fields || {}).forEach(([k, v]) => {
      const text = flat(v);
      if (text) lines.push("**" + k + ":** " + text);
    });
    if (ev.feedback) lines.push("", "**Faculty note:** " + flat(ev.feedback));
    lines.push("", "---", "");
    return lines.join("\n");
  }

  function demonstratedProjects(learner, moduleId) {
    const out = {};
    (learner.projects || []).forEach(p => { out[p.id] = M.projectDemonstrated(learner, p.id, moduleId); });
    return out;
  }

  // registered pathway on the learner, else the active module (matches main.js activeModule())
  function activeModuleOf(learner) {
    if (learner.pathway && C.pathway(learner.pathway)) return learner.pathway;
    if (learner.module && C.competenciesFor(learner.module).length) return learner.module;
    return "foundation";
  }

  function portfolioMarkdown(learner) {
    const moduleId = activeModuleOf(learner);
    const md = [];
    md.push("# AI Faculty — Evidence Portfolio");
    md.push("");
    md.push("A learner-owned record of confirmed evidence. Generated " + fmtDate(isoNow()) + ".");
    md.push("");
    md.push("**Assessed capability states:**");
    C.allCompetencies().forEach(c => {
      const cap = learner.capabilities[c.id];
      if (cap && cap.state && cap.state !== "unknown") {
        md.push("- " + c.id + " (" + c.name + "): **" + cap.state + "** — confidence " + cap.confidence);
      }
    });
    md.push("");
    md.push("## Evidence (" + learner.evidence.length + " record" + (learner.evidence.length === 1 ? "" : "s") + ")");
    md.push("");

    const groups = [];
    const demo = demonstratedProjects(learner, moduleId);
    (learner.projects || []).forEach(p => {
      const evs = learner.evidence.filter(e => e.projectId === p.id);
      if (evs.length) groups.push({ name: p.name, demonstrated: !!demo[p.id], evs });
    });
    const loose = learner.evidence.filter(e => !e.projectId || !(learner.projects || []).some(p => p.id === e.projectId));
    if (loose.length) groups.push({ name: "Not attached to a project", demonstrated: false, evs: loose });

    if (!groups.length) {
      md.push("_Nothing confirmed yet._");
    } else {
      groups.forEach(g => {
        md.push("## " + g.name + (g.demonstrated ? " — **Demonstrated**" : ""));
        md.push("");
        md.push(g.evs.map(ev => recordMd(ev, 3)).join("\n"));
        md.push("");
      });
    }

    return md.join("\n") + "\n";
  }

  function portfolioJSON(learner) {
    return JSON.stringify({
      exportedAt: isoNow(),
      format: "aifaculty-evidence-portfolio",
      version: 1,
      track: learner.track || null,
      pathway: learner.pathway || null,
      capabilities: learner.capabilities || {},
      challenges: learner.challenges || {},
      checkpoints: learner.checkpoints || {},
      projects: learner.projects || [],
      evidence: learner.evidence || [],
    }, null, 2);
  }

  function download(filename, text, type) {
    const blob = new Blob([text], { type: type + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportPortfolio(learner, format) {
    const date = fileDate();
    if (format === "json") {
      download("aifaculty-evidence-" + date + ".json", portfolioJSON(learner), "application/json");
    } else {
      download("aifaculty-evidence-" + date + ".md", portfolioMarkdown(learner), "text/markdown");
    }
  }

  return { portfolioMarkdown, portfolioJSON, exportPortfolio };
})();