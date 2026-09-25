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

  function recordMd(ev, level) {
    const lvl = "#".repeat(level);
    const formative = ev.kind === "challenge";
    const lines = [
      lvl + " " + (ev.title || "Untitled evidence"),
      "*" + (ev.kind || "record") + "*" + (formative ? " — *formative, not an independent judgement*" : "")
        + " · confidence: " + (ev.confidence || "—")
        + (ev.assessors ? " · " + M.assessorLineFor(ev) : ""),
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
    const backing = M.checkpointBacking(learner);
    const md = [];
    md.push("# AI Faculty — Evidence Portfolio");
    md.push("");
    md.push("A learner-owned record of evidence. Generated " + fmtDate(isoNow()) + ".");
    md.push("");
    md.push("**How to read this.** *Formative* evidence is a competency challenge: self-confirmed and "
      + "scored by local heuristics, recorded for practice and revision, and **not** an independent "
      + "judgement. *Assessed* evidence is a checkpoint that went through the Assessment Resolution "
      + "Protocol, with the assessor count shown. A capability state is only as strong as the evidence "
      + "named beside it — a state marked *formative only* has not been independently assessed.");
    md.push("");
    md.push("**Assessed capability states:**");
    C.allCompetencies().forEach(c => {
      const cap = learner.capabilities[c.id];
      if (cap && cap.state && cap.state !== "unknown") {
        const pv = M.capabilityProvenance(learner, c.id, backing);
        md.push("- " + c.id + " (" + c.name + "): **" + M.levelLabel(cap.state) + "** — confidence "
          + cap.confidence + " — evidence: " + pv.label);
      }
    });
    md.push("");
    md.push("## Evidence (" + learner.evidence.length + " record" + (learner.evidence.length === 1 ? "" : "s") + ")");
    md.push("");

    const groups = [];
    const demo = demonstratedProjects(learner, moduleId);
    (learner.projects || []).forEach(p => {
      const evs = learner.evidence.filter(e => e.projectId === p.id);
      if (evs.length) groups.push({ name: p.name, demonstrated: !!demo[p.id], pv: M.projectProvenance(learner, p.id), evs });
    });
    const loose = learner.evidence.filter(e => !e.projectId || !(learner.projects || []).some(p => p.id === e.projectId));
    if (loose.length) groups.push({ name: "Not attached to a project", demonstrated: false, evs: loose });

    if (!groups.length) {
      md.push("_Nothing confirmed yet._");
    } else {
      groups.forEach(g => {
        let suffix = "";
        if (g.demonstrated) suffix = g.pv && g.pv.formativeOnly
          ? " — **Demonstrated (formative evidence only)**"
          : " — **Demonstrated**";
        md.push("## " + g.name + suffix);
        md.push("");
        if (g.demonstrated && g.pv && g.pv.formativeOnly) {
          md.push("_Every competency in this module has evidence on this project, but none of it has "
            + "been independently assessed. This is practice, not a verified outcome._");
          md.push("");
        }
        md.push(g.evs.map(ev => recordMd(ev, 3)).join("\n"));
        md.push("");
      });
    }

    return md.join("\n") + "\n";
  }

  function portfolioJSON(learner) {
    const backing = M.checkpointBacking(learner);
    const capabilities = {};
    C.allCompetencies().forEach(c => {
      const cap = (learner.capabilities || {})[c.id];
      if (!cap || !cap.state || cap.state === "unknown") return;
      const pv = M.capabilityProvenance(learner, c.id, backing);
      capabilities[c.id] = {
        state: cap.state,
        stateLabel: M.levelLabel(cap.state),
        confidence: cap.confidence,
        evidenceKinds: [...new Set(pv.kinds.concat(pv.checkpoints.length ? ["checkpoint"] : []))],
        assessedByCheckpoint: pv.assessed,
        checkpoints: pv.checkpoints,
        formativeOnly: !pv.assessed && pv.formative,
      };
    });
    return JSON.stringify({
      exportedAt: isoNow(),
      format: "aifaculty-evidence-portfolio",
      version: 2,
      provenance: {
        note: M.PROVENANCE_NOTE,
        formativeOnly: "Set on a capability or project whose evidence is entirely self-confirmed challenges.",
        assessedByCheckpoint: "True when a checkpoint went through the Assessment Resolution Protocol; see the assessor count on the evidence record.",
        kindSemantics: {
          challenge: "formative - self-confirmed practice, not an independent judgement",
          checkpoint: "assessed - went through the Assessment Resolution Protocol",
        },
      },
      track: learner.track || null,
      pathway: learner.pathway || null,
      capabilities,
      challenges: learner.challenges || {},
      checkpoints: learner.checkpoints || {},
      projects: (learner.projects || []).map(p => {
        const pv = M.projectProvenance(learner, p.id);
        return Object.assign({}, p, {
          demonstrated: !!M.projectDemonstrated(learner, p.id, activeModuleOf(learner)),
          demonstratedByCheckpoint: pv.assessed,
          formativeOnly: pv.formativeOnly,
          checkpoints: pv.checkpoints,
        });
      }),
      evidence: (learner.evidence || []).map(ev =>
        ev.assessors ? Object.assign({}, ev, { assessors: M.assessorLineFor(ev) }) : ev),
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