/* AI Faculty — the Faculty seam.
 *
 * For the v0.1 prototype, Teaching Faculty and Assessment Faculty run on authored content and
 * transparent heuristics. This module is deliberately the ONE place that "is" the faculty, so a
 * model behind the Institutional AI Control Plane can replace it later without touching the rest
 * of the app. See docs/01-architecture.md and docs/02-faculty-roles.md.
 */
window.FACULTY = (function () {
  const C = window.CONTENT;

  const wc = s => (s || "").trim().split(/\s+/).filter(Boolean).length;
  const norm = s => (s || "").toLowerCase();
  const placeholderish = v => /^(n\/?a|none|-|\.|idk|nothing)$/i.test((v || "").trim()) || (v || "").trim().length < 3;

  // ---- Teaching Faculty -------------------------------------------------
  function teaching(capId) {
    const c = C.competency(capId);
    if (!c) return null;
    return { heading: `${c.id} — ${c.name}`, canDo: c.canDo, why: c.why, points: c.teach, example: c.example };
  }

  // ---- helpers -------------------------------------------------------
  function fieldReport(f, val) {
    const n = wc(val);
    const ok = n >= f.minWords && !placeholderish(val);
    let note;
    if (!val || !val.trim()) note = "Not answered yet.";
    else if (placeholderish(val)) note = "This reads as a placeholder — this field matters, give it a real answer.";
    else if (n < f.minWords) note = `Only ${n} word${n === 1 ? "" : "s"}. Say more — aim for at least ${f.minWords}. ${f.hint || ""}`.trim();
    else note = "Clear enough to work with.";
    return { key: f.key, label: f.label, ok, note };
  }

  function verdictFrom(okCount, total, kind) {
    if (okCount === total) {
      return { verdict: "ready", confidence: "medium",
        summary: kind === "checkpoint"
          ? "This holds together as a whole workflow. It records as evidence against the mastery rubric. Read the rubric check, then confirm to save it."
          : "Complete and concrete. It records as evidence for this challenge. Read the rubric check below, then confirm to save it." };
    }
    if (okCount >= Math.ceil(total * 0.6)) {
      return { verdict: "revise", confidence: "low",
        summary: "You're close. The pieces are here but some are too thin to verify or build on later. Fill the gaps flagged below and resubmit." };
    }
    return { verdict: "more", confidence: "low",
      summary: "Not enough here yet. Go back to the teaching, then try again on a real task — vague answers here always cost you later in testing and improvement." };
  }

  // ---- Assessment Faculty (formative) -------------------------------
  // assess a competency challenge (type: fields | critique | scenario)
  function assessChallenge(capId, chId, submission) {
    const ch = C.challenge(capId, chId);
    if (!ch) return null;

    if (ch.type === "fields") {
      const reports = ch.fields.map(f => fieldReport(f, submission[f.key]));
      const okCount = reports.filter(r => r.ok).length;
      const v = verdictFrom(okCount, reports.length, "challenge");
      const rubric = ch.rubric.map((item, i) => ({ label: item.label, ok: reports[i] ? reports[i].ok : okCount === reports.length }));
      return { ...v, kind: "fields", stateTarget: v.verdict === "ready" ? ch.raises : (v.verdict === "revise" ? "guided" : "emerging"),
               fieldReports: reports, rubric };
    }

    if (ch.type === "critique") {
      const text = norm(submission.critique);
      const enough = wc(submission.critique) >= ch.ask.minWords && !placeholderish(submission.critique);
      const rubric = ch.expected.map(e => ({
        label: e.label,
        ok: enough && (e.signals || []).some(sig => text.includes(sig)),
      }));
      const caught = rubric.filter(r => r.ok).length;
      const reports = [{
        key: "critique", label: ch.ask.label,
        ok: enough && caught >= Math.ceil(ch.expected.length * 0.6),
        note: !enough
          ? `Say more — at least ${ch.ask.minWords} words, working through each problem.`
          : `You identified ${caught} of ${ch.expected.length} problems. ${caught < ch.expected.length ? "Look again at the unticked items below." : "All of them — good."}`,
      }];
      const okAll = reports[0].ok;
      const v = verdictFrom(caught, ch.expected.length, "challenge");
      // enough words but few catches => "more"; good catches => ready
      const verdict = !enough ? "more" : (caught >= ch.expected.length - 0 ? "ready"
                        : caught >= Math.ceil(ch.expected.length * 0.75) ? "ready"
                        : caught >= Math.ceil(ch.expected.length * 0.5) ? "revise" : "more");
      return {
        verdict,
        confidence: verdict === "ready" ? "medium" : "low",
        summary: verdict === "ready"
          ? "You found the substance of what's wrong and how to fix it. Records as evidence."
          : verdict === "revise"
            ? "You've got some of it. The rubric below shows what you missed — add those and resubmit."
            : "Not enough of the real problems identified yet. Re-read the teaching and look at the rubric below.",
        kind: "critique",
        stateTarget: verdict === "ready" ? ch.raises : (verdict === "revise" ? "guided" : "emerging"),
        fieldReports: reports,
        rubric,
      };
    }

    if (ch.type === "scenario") {
      const chosen = ch.options.find(o => o.id === submission.choice);
      const justifyOk = wc(submission.justify) >= ch.ask.minWords && !placeholderish(submission.justify);
      const correct = chosen && chosen.ok;
      let verdict;
      if (correct && justifyOk) verdict = "ready";
      else if (correct && !justifyOk) verdict = "revise";
      else verdict = "more";
      const reports = [
        { key: "choice", label: "Your choice", ok: !!correct,
          note: chosen ? chosen.feedback : "No option selected." },
        { key: "justify", label: ch.ask.label, ok: justifyOk,
          note: justifyOk ? "Reasoning is substantive." : `Give real reasoning — at least ${ch.ask.minWords} words.` },
      ];
      return {
        verdict,
        confidence: verdict === "ready" ? "medium" : "low",
        summary: verdict === "ready"
          ? "Right call, and you can say why. Records as evidence."
          : verdict === "revise"
            ? "Right call — now write the reasoning that makes it a decision rather than a guess."
            : "Not the strongest option. Read the feedback on your choice, then pick again and justify it.",
        kind: "scenario",
        stateTarget: verdict === "ready" ? ch.raises : "emerging",
        fieldReports: reports,
        rubric: ch.options.map(o => ({ label: `${o.id.toUpperCase()}. ${o.label}`, ok: o.ok })),
      };
    }

    return null;
  }

  // ---- Assessment Faculty — checkpoint (mastery-rubric) -------------
  function assessCheckpoint(cpId, submission) {
    const cp = C.checkpoint(cpId);
    if (!cp) return null;
    const reports = cp.fields.map(f => fieldReport(f, submission[f.key]));
    const okCount = reports.filter(r => r.ok).length;
    const v = verdictFrom(okCount, reports.length, "checkpoint");
    // map rubric dimensions onto field adequacy (best-effort, transparent)
    const rubric = cp.rubricDims.map((dim, i) => ({
      label: dim,
      ok: reports[i] ? reports[i].ok : okCount === reports.length,
    }));
    return {
      ...v,
      kind: "checkpoint",
      stateTarget: v.verdict === "ready" ? cp.raisesTo : (v.verdict === "revise" ? "independent" : "guided"),
      fieldReports: reports,
      rubric,
    };
  }

  return { teaching, assessChallenge, assessCheckpoint };
})();
