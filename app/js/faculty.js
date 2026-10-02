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

  // ---- Teaching Faculty ---------------------------------------------
  function lesson(capId) {
    const c = C.competency(capId);
    if (!c) return null;
    return { id: c.id, name: c.name, canDo: c.canDo, ...c.lesson };
  }

  // Formative feedback on the guided (supported) attempt — encouraging, never blocking.
  // Compares the learner's answer to the lesson's model answer, field by field.
  function guidedFeedback(capId, submission) {
    const l = C.competency(capId).lesson.guided;
    const reports = l.fields.map(f => {
      const val = submission[f.key] || "";
      const b = fieldBand(f, val, false);
      let note;
      if (b === "Not yet") note = "Have a go at this one before you check the model answer.";
      else if (b === "Developing") note = "Reasonable start — the model answer below is more specific; see what it pins down that yours doesn't.";
      else note = "Good — compare with the model answer for any details you'd add.";
      return { key: f.key, label: f.label, band: b, yours: val, model: l.model[f.key], note };
    });
    const attempted = reports.filter(r => r.band !== "Not yet").length;
    return {
      reports,
      summary: attempted === reports.length
        ? "Nice work — you've done a full first attempt. Now compare each field with the model answer, then move on to doing it on your own task."
        : "Fill in what you can, then reveal the model answer to see the whole thing. This one's for practice — it isn't graded.",
    };
  }

  // ---- helpers -------------------------------------------------------
  const BANDS = ["Not yet", "Developing", "Meets", "Exceeds"];
  const bandIndex = b => BANDS.indexOf(b);

  // What we can honestly say about a field without reading it.
  //
  // This used to return competency bands. It graded length plus a regex for digits, weekdays,
  // month names and the words "because|so|since|unless". Any answer over the word floor came
  // back "Meets", which is why the questions had to be written to trip a regex: the questions
  // were reverse-engineered from the checker rather than from anything a learner needs.
  //
  // What is left here is only what is mechanically true — was it answered, how long is it.
  // It makes no claim about quality, and it is not a competency band. Whether an answer is
  // any good is a reading task, and reading is what the model in `gradeWithModel` is for.
  // With no model configured these return no band at all, and the UI says so.
  function fieldBand(f, val) {
    if (!val || !val.trim() || placeholderish(val)) return "Not yet";
    const n = wc(val);
    if (n < f.minWords) return "Developing";
    return "Answered";
  }

  function fieldReport(f, val) {
    const b = fieldBand(f, val);
    const n = wc(val);
    let note;
    if (b === "Not yet") note = !val || !val.trim() ? "Not answered yet." : "Reads as a placeholder — give this a real answer.";
    else if (b === "Developing") note = `Below the ${f.minWords}-word floor for this field (${n} words). ${f.hint || ""}`.trim();
    else note = `Answered — ${n} words. Not yet assessed.`;
    return { key: f.key, label: f.label, band: b, ok: null, note };
  }

  // ---- Assessment Faculty (formative) -------------------------------
  //
  // Assessment is a reading task. It is not done by counting words or looking for keywords.
  //
  // The previous implementation decided quality by `text.includes("result")` against 211
  // hand-written signal lists, and for fields-challenges by a regex for digits and the word
  // "because". Both produced bands, so the app could show "Meets" on evidence that was never
  // read. That is the same defect v0.60-v0.63 removed from the evidence portfolio, one layer
  // down and still live: a learner saw a verdict, and no model had looked at their words.
  //
  // So: `assessChallenge` now returns mechanical facts only, plus an explicit
  // `assessed: false`. There is no verdict and no band until a model has read the answer.
  // `gradeWithModel` (async, in main.js, via /api/faculty/assess) turns a challenge into a
  // real verdict once a model is configured. Until then the UI shows the rubric and the
  // learner's own answer and tells them nothing has been assessed yet.
  //
  // A note on "scenario" challenges: multiple choice with one correct option is not a reading
  // task and does not need a keyword list — `option.ok` is the author's answer key, and
  // guessing it is exactly what the justification field is there to make visible. It keeps a
  // verdict. That is a genuine assessment, not a proxy for one.

  function assessChallenge(capId, chId, submission) {
    const ch = C.challenge(capId, chId);
    if (!ch) return null;

    if (ch.type === "scenario") {
      const chosen = ch.options.find(o => o.id === submission.choice);
      // The choice is the author's answer key, so it is a real assessment. The justification is
      // prose, and a word count is not a reading of it -- thirty characters of filler used to be
      // enough to report "Reasoning is substantive" and to downgrade a correct call to "revise".
      // So the verdict comes from the choice alone, and the justification is reported as a
      // mechanical completeness fact with nothing claimed about its quality.
      const justifyOk = wc(submission.justify) >= ch.ask.minWords && !placeholderish(submission.justify);
      const correct = chosen && chosen.ok;
      const verdict = correct ? "ready" : "more";
      const reports = [
        { key: "choice", label: "Your choice", ok: !!correct,
          note: chosen ? chosen.feedback : "No option selected." },
        { key: "justify", label: ch.ask.label, ok: justifyOk,
          note: justifyOk
            ? "Written. Not assessed — no model has read your reasoning."
            : `Too short to show your reasoning — at least ${ch.ask.minWords} words.` },
      ];
      return {
        verdict,
        assessed: true,
        // Scoped honestly: the key graded the call, not the argument for it.
        assessedBy: "author answer key (choice only)",
        justificationAssessed: false,
        confidence: verdict === "ready" ? "medium" : "low",
        summary: verdict === "ready"
          ? (justifyOk
              ? "Right call. Your reasoning for it hasn't been read yet, so nothing has checked that you know why."
              : "Right call. Nothing has checked your reasoning for it — write it down when you're ready.")
          : "Not the strongest option. Read the feedback on your choice, then pick again.",
        kind: "scenario",
        stateTarget: verdict === "ready" ? ch.raises : "emerging",
        fieldReports: reports,
        rubric: ch.options.map((o, i) => ({
          label: `${String(o.id || String.fromCharCode(65 + i)).toUpperCase()}. ${o.label}`, ok: o.ok,
        })),
      };
    }

    // fields + critique: mechanical facts, no verdict.
    const answered = [];
    const rubric = [];
    if (ch.type === "fields") {
      for (const f of ch.fields) answered.push(fieldReport(f, submission[f.key]));
      ch.rubric.forEach(item => rubric.push({ label: item.label, band: null, ok: null, note: null }));
    } else {
      const text = submission.critique || "";
      const enough = wc(text) >= ch.ask.minWords && !placeholderish(text);
      answered.push({
        key: "critique", label: ch.ask.label, band: enough ? "Answered" : "Developing", ok: null,
        note: enough
          ? `${wc(text)} words written. Not yet assessed.`
          : `Say more — at least ${ch.ask.minWords} words, working through each problem. (${wc(text)} so far.)`,
      });
      (ch.expected || []).forEach(e => rubric.push({ label: e.label, band: null, ok: null, note: null }));
    }

    const missing = answered.filter(a => a.band === "Not yet").length;
    const thin = answered.filter(a => a.band === "Developing").length;
    const blocker = missing || thin
      ? `Not assessed. ${missing ? `${missing} field${missing === 1 ? "" : "s"} still empty. ` : ""}${thin ? `${thin} below the word floor.` : ""}`
      : "Not assessed yet — a model has not read this answer.";

    return {
      verdict: null,
      assessed: false,
      blocker,
      canSubmitForAssessment: !missing && !thin,
      confidence: null,
      summary: blocker,
      kind: ch.type,
      stateTarget: null,
      fieldReports: answered,
      rubric,
      awaitingModel: true,
    };
  }

  // ---- Assessment Faculty — checkpoint (mastery-rubric) -------------
  //
  // Checkpoints had the same defect plus one more. `verdictFromBands` returned "ready" whenever
  // every field cleared a word floor, and the "stricter second pass" raised the same floor by 40%
  // on the same engine — so the second pass could confidently report agreement with a judgement
  // that had never been made. That is the v0.62 lie one level down.
  //
  // `strict` is now carried through to the model call rather than applied to a word count.
  // Locally this returns mechanical facts and withholds the verdict, exactly as challenges do.
  function assessCheckpoint(cpId, submission, strict) {
    const cp = C.checkpoint(cpId);
    if (!cp) return null;
    const reports = cp.fields.map(f => fieldReport(f, submission[f.key]));
    const missing = reports.filter(r => r.band === "Not yet").length;
    const thin = reports.filter(r => r.band === "Developing").length;
    const blocker = missing || thin
      ? `Not assessed. ${missing ? `${missing} field${missing === 1 ? "" : "s"} still empty. ` : ""}${thin ? `${thin} below the word floor.` : ""}`
      : "Not assessed yet — a model has not read this checkpoint.";

    return {
      verdict: null,
      assessed: false,
      blocker,
      canSubmitForAssessment: !missing && !thin,
      confidence: null,
      summary: blocker,
      kind: "checkpoint",
      assessor: strict ? 2 : 1,
      stateTarget: null,
      fieldReports: reports,
      rubric: cp.rubricDims.map(dim => ({ label: dim, band: null, ok: null, note: null })),
      awaitingModel: true,
    };
  }

  // Roll-up of a checkpoint/multi-dim result onto the mastery rubric: per-band counts, the
  // dimensions that fell below Meets, and the banded verdict (08-assessment-model §3). Shared by
  // the master rubric scoring UI and the Assessment Resolution Protocol's reasoned review.
  // A rubric whose bands are all null has not been assessed. Summing that as "all dimensions
  // weak, verdict: more" would manufacture a failing result out of the absence of a reading —
  // so an unassessed rubric returns null and the caller has to say so.
  function masterySummary(result) {
    if (!result || !Array.isArray(result.rubric) || !result.rubric.length) return null;
    const banded = result.rubric.filter(d => d && bandIndex(d.band) >= 0);
    if (!banded.length) {
      return { counts: null, weak: null, total: result.rubric.length, met: null,
               ready: null, verdict: null, weakestBand: null, assessed: false };
    }
    const counts = { "Not yet": 0, "Developing": 0, "Meets": 0, "Exceeds": 0 };
    const weak = [];
    banded.forEach(d => {
      counts[d.band] = (counts[d.band] || 0) + 1;
      if (bandIndex(d.band) < 2) weak.push(d);
    });
    const met = banded.length - weak.length;
    return {
      counts, weak, total: banded.length, met, assessed: true,
      ready: weak.length === 0,
      verdict: weak.length === 0 ? "ready" : (met * 2 >= banded.length ? "revise" : "more"),
      weakestBand: weak.length ? weak.reduce((a, b) => bandIndex(a.band) <= bandIndex(b.band) ? a : b).band : null,
    };
  }

  return { lesson, guidedFeedback, assessChallenge, assessCheckpoint, masterySummary };
})();
