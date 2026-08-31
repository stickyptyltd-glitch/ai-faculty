/* AI Faculty — the Faculty seam.
 *
 * For the v0.1 prototype, Teaching Faculty and Assessment Faculty run on authored content and
 * transparent heuristics. This module is deliberately the ONE place that "is" the faculty, so a
 * model behind the Institutional AI Control Plane can replace it later without touching the rest
 * of the app. See docs/01-architecture.md and docs/02-faculty-roles.md.
 */
window.FACULTY = (function () {
  const { competency } = window.CONTENT;

  function wordCount(s) {
    return (s || "").trim().split(/\s+/).filter(Boolean).length;
  }

  // --- Teaching Faculty -----------------------------------------------------
  function teaching(capId) {
    const c = competency(capId);
    if (!c) return null;
    return {
      heading: `${c.id} — ${c.name}`,
      canDo: c.canDo,
      why: c.why,
      points: c.teach,
      example: c.example,
    };
  }

  // --- Assessment Faculty (formative) -------------------------------------
  // Transparent rubric-based feedback. Never a hidden score.
  function assess(capId, fields) {
    const c = competency(capId);
    const spec = c.practice.fields;

    const fieldReports = spec.map(f => {
      const val = (fields[f.key] || "").trim();
      const wc = wordCount(val);
      const enough = wc >= f.minWords;
      const looksPlaceholder = /^(n\/?a|none|-|\.)$/i.test(val) || val.length < 3;
      const ok = enough && !looksPlaceholder;
      let note;
      if (!val) note = "Not answered yet.";
      else if (looksPlaceholder) note = "This reads as a placeholder — this field matters, give it a real answer.";
      else if (!enough) note = `Only ${wc} word${wc === 1 ? "" : "s"}. Say more — aim for at least ${f.minWords}. ${f.hint}`;
      else note = "Clear enough to work with.";
      return { key: f.key, label: f.label, ok, note };
    });

    const okCount = fieldReports.filter(r => r.ok).length;
    const total = fieldReports.length;

    let verdict, stateTarget, confidence, summary;
    if (okCount === total) {
      verdict = "ready";
      stateTarget = "independent";
      confidence = "medium";
      summary =
        "This is a complete, concrete definition. It records as evidence that you can perform " +
        `${c.name} independently. Read the rubric check below, then confirm to save it.`;
    } else if (okCount >= Math.ceil(total * 0.6)) {
      verdict = "revise";
      stateTarget = "guided";
      confidence = "low";
      summary =
        "You're close. The pieces are here but some are too thin to verify or improve against later. " +
        "Fill the gaps flagged below and resubmit.";
    } else {
      verdict = "more";
      stateTarget = "emerging";
      confidence = "low";
      summary =
        "Not enough here yet to call it done. Go back to the teaching, then try again on a real task — " +
        "vague answers here always cost you later in testing and improvement.";
    }

    const rubric = c.rubric.map((item, i) => ({
      label: item.label,
      // map rubric item to the field in the same position where possible
      ok: fieldReports[i] ? fieldReports[i].ok : okCount === total,
    }));

    return { verdict, stateTarget, confidence, summary, fieldReports, rubric };
  }

  return { teaching, assess };
})();
