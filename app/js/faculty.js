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

  // Band one field's answer. `strict` = the second, independent assessment (higher bar).
  function fieldBand(f, val, strict) {
    if (!val || !val.trim() || placeholderish(val)) return "Not yet";
    const n = wc(val);
    const min = strict ? Math.ceil(f.minWords * 1.4) : f.minWords;
    if (n < min) return "Developing";
    // Broadened once already (spelled-out numbers, more connectors, quoted detail) after a
    // walkthrough found a genuinely detailed answer capped for missing "instead of" by one
    // word ("instead"). Second walkthrough pass found the same failure again on different
    // wording ("since", "so there is") — a fixed phrase list will always miss some genuine
    // way of writing a reason. Real fix: a phrase list should raise the band, never be the
    // only way to avoid being capped. An answer already well past the word floor (strict or
    // not) is itself evidence of real engagement, not padding — the floor above already
    // screens out padding — so length alone is enough to clear "Developing" under strict;
    // the phrase match now only decides Meets vs. Exceeds.
    const specific =
      /\d/.test(val) ||
      /\b(because|so|since|given that|due to|as a result|which means|means that|so that|trade-?off|instead of|whereas|rather than|in order to|for example|for instance|such as|specifically|in practice|as opposed to|in particular)\b/i.test(val) ||
      /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand)\b/i.test(val) ||
      /["“][^"”]{3,}["”]/.test(val) ||
      /\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/.test(val) ||
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(val);
    if (n >= min * 2 && specific) return "Exceeds";
    if (strict && !specific && n < min * 2) return "Developing";
    return "Meets";
  }

  function fieldReport(f, val, strict) {
    const b = fieldBand(f, val, strict);
    const n = wc(val);
    let note;
    if (b === "Not yet") note = !val || !val.trim() ? "Not answered yet." : "Reads as a placeholder — give this a real answer.";
    else if (b === "Developing") note = `Too thin${strict ? " for an independent pass" : ""}. ${f.hint || ""}`.trim() + (n ? ` (${n} words)` : "");
    else if (b === "Meets") note = "Concrete and usable.";
    else note = "Specific and well-reasoned — names, numbers or trade-offs are explicit.";
    return { key: f.key, label: f.label, band: b, ok: bandIndex(b) >= 2, note };
  }

  // Derive a verdict from a set of banded reports.
  function verdictFromBands(reports, kind, strict) {
    const idx = reports.map(r => bandIndex(r.band));
    const allMeet = idx.every(i => i >= 2);
    const noDeveloping = idx.every(i => i >= 2);
    const majorityPresent = idx.filter(i => i >= 1).length >= Math.ceil(reports.length * 0.6);
    const ready = strict ? (allMeet && noDeveloping && idx.some(i => i >= 3)) : allMeet;

    if (ready) {
      return { verdict: "ready", confidence: strict ? "high" : "medium",
        summary: kind === "checkpoint"
          ? (strict
              ? "Second assessment agrees: this meets the mastery rubric on every dimension, specifically. Confirm to record it."
              : "This holds together as a whole workflow and meets the rubric. You can confirm now, or request an independent second assessment.")
          : "Every rubric dimension is met. Records as evidence for this challenge — confirm below." };
    }
    if (majorityPresent) {
      return { verdict: "revise", confidence: "low",
        summary: strict
          ? "The second assessor wants more here — the dimensions marked below are present but not specific enough for a mastery pass. Add detail and resubmit."
          : "You're close. The dimensions marked below are too thin to verify or build on. Fill them in and resubmit." };
    }
    return { verdict: "more", confidence: "low",
      summary: "Not enough here yet. Go back to the teaching, then try again on a real task." };
  }

  // ---- Assessment Faculty (formative) -------------------------------
  // assess a competency challenge (type: fields | critique | scenario)
  function assessChallenge(capId, chId, submission) {
    const ch = C.challenge(capId, chId);
    if (!ch) return null;

    if (ch.type === "fields") {
      const reports = ch.fields.map(f => fieldReport(f, submission[f.key], false));
      const v = verdictFromBands(reports, "challenge", false);
      const rubric = ch.rubric.map((item, i) => ({
        label: item.label,
        band: reports[i] ? reports[i].band : "Meets",
        ok: reports[i] ? reports[i].ok : true,
      }));
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
      // enough words but few catches => "more"; most catches => ready
      const verdict = !enough ? "more"
        : caught >= Math.ceil(ch.expected.length * 0.75) ? "ready"
        : caught >= Math.ceil(ch.expected.length * 0.5) ? "revise" : "more";
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
  // pass strict:true for the independent second assessment (Assessment Resolution Protocol).
  function assessCheckpoint(cpId, submission, strict) {
    const cp = C.checkpoint(cpId);
    if (!cp) return null;
    const reports = cp.fields.map(f => fieldReport(f, submission[f.key], !!strict));
    const v = verdictFromBands(reports, "checkpoint", !!strict);
    // map rubric dimensions onto field bands; dimensions beyond the field count
    // inherit the weakest band observed (transparent, conservative).
    const minBand = BANDS[Math.min(...reports.map(r => bandIndex(r.band)))];
    const rubric = cp.rubricDims.map((dim, i) => {
      const b = reports[i] ? reports[i].band : minBand;
      return { label: dim, band: b, ok: bandIndex(b) >= 2 };
    });
    return {
      ...v,
      kind: "checkpoint",
      assessor: strict ? 2 : 1,
      stateTarget: v.verdict === "ready" ? cp.raisesTo : (v.verdict === "revise" ? "independent" : "guided"),
      fieldReports: reports,
      rubric,
    };
  }

  return { lesson, guidedFeedback, assessChallenge, assessCheckpoint };
})();
