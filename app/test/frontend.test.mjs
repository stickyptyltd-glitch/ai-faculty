// Frontend tests for the app's pure-logic modules.
//
// The Worker has a 200-test suite; app/js had none at all, and the bug class this repo
// has actually been hunted for -- derived numbers and status words that look right and
// report falsely -- lives disproportionately in app/js. These run under `node --test`
// with no dependencies, no build step and no network.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadApp } from "./load.mjs";

const win = loadApp();
const C = win.CONTENT;
const M = win.MODEL;
const E = win.EXPORT;
const F = win.FACULTY;

function newLearner() {
  const capabilities = {};
  C.COMPETENCIES.forEach(c => {
    capabilities[c.id] = { state: "unknown", confidence: "low", taughtAt: null };
  });
  return {
    track: null, pathway: null, capabilities,
    challenges: {}, checkpoints: {}, projects: [],
    evidence: [], pendingReviews: [],
  };
}

function answerChallenge(learner, capId, index = 0) {
  const c = C.competency(capId);
  const ch = c.challenges[index];
  const ev = M.addEvidence(learner, {
    capId, kind: "challenge", challengeId: ch.id, title: `${ch.id} · ${c.name}`,
    fields: { response: "I did the task and it worked because the team agreed the format first." },
    feedback: "thin", confidence: "high",
  });
  M.markChallengeDone(learner, ch.id, ev.id);
  M.raise(learner, capId, ch.raises, "high");
  return ev;
}

function passCheckpoint(learner, cpId, projectId) {
  const cp = C.checkpoint(cpId);
  const ev = M.addEvidence(learner, {
    capId: cp.after[0], kind: "checkpoint", checkpointId: cpId, projectId,
    title: `${cpId} · ${cp.title}`, fields: { a: "real work" }, feedback: "agreed",
    confidence: "high", assessors: "1 + 2 (independent) agree", rubric: [],
  });
  M.markCheckpointDone(learner, cpId, ev.id);
  cp.after.forEach(id => M.raise(learner, id, cp.raisesTo, "medium"));
  return ev;
}

// The profile v0.53 identified as gameable: one passed challenge per competency, every
// answer the same single sentence, no checkpoint, no capstone.
function gameableProfile() {
  const l = newLearner();
  l.projects = [{ id: "pr1", name: "Some real task", context: "ctx", goal: "goal" }];
  C.COMPETENCIES.forEach(c => {
    const ev = answerChallenge(l, c.id, 0);
    ev.projectId = "pr1";
  });
  return l;
}

function fullyAssessedProfile() {
  const l = newLearner();
  l.projects = [{ id: "pr1", name: "Some real task", context: "ctx", goal: "goal" }];
  C.COMPETENCIES.forEach(c => {
    const ev = answerChallenge(l, c.id, 0);
    ev.projectId = "pr1";
  });
  passCheckpoint(l, "CP1", "pr1");
  passCheckpoint(l, "CP2", "pr1");
  return l;
}

test("content integrity", async t => {
  await t.test("every challenge id is unique and carries a valid raises target", () => {
    const ids = new Set();
    C.COMPETENCIES.forEach(c => c.challenges.forEach(ch => {
      assert.ok(!ids.has(ch.id), `duplicate challenge id ${ch.id}`);
      ids.add(ch.id);
      assert.ok(ch.ladder, `${ch.id} missing ladder`);
      assert.ok(ch.raises, `${ch.id} missing raises`);
      assert.ok(C.LEVEL_ORDER.includes(ch.raises), `${ch.id} raises to unknown state ${ch.raises}`);
    }));
  });

  await t.test("no challenge can raise a competency to the top state", () => {
    const top = C.LEVEL_ORDER[C.LEVEL_ORDER.length - 1];
    C.COMPETENCIES.forEach(c => c.challenges.forEach(ch => {
      assert.notEqual(ch.raises, top, `${ch.id} raises to the top state ${top}`);
    }));
  });

  await t.test("only CP2 grants the top state, and covers every competency", () => {
    const top = C.LEVEL_ORDER[C.LEVEL_ORDER.length - 1];
    const grantsTop = C.CHECKPOINTS.filter(cp => cp.raisesTo === top);
    assert.equal(grantsTop.length, 1, "expected exactly one checkpoint granting the top state");
    const all = C.COMPETENCIES.map(c => c.id);
    grantsTop[0].after.forEach(id => assert.ok(all.includes(id), `CP grants ${id} which is not a competency`));
  });

  await t.test("every checkpoint references real competencies", () => {
    const all = C.COMPETENCIES.map(c => c.id);
    C.CHECKPOINTS.forEach(cp => {
      assert.ok(cp.after.length, `${cp.id} assesses nothing`);
      cp.after.forEach(id => assert.ok(all.includes(id), `${cp.id} references unknown ${id}`));
    });
  });
});

test("the ladder is not reachable by challenges alone", async t => {
  await t.test("passing every challenge tops out below the top state", () => {
    const l = newLearner();
    C.COMPETENCIES.forEach(c => c.challenges.forEach(ch => answerChallenge(l, c.id, c.challenges.indexOf(ch))));
    const top = C.LEVEL_ORDER[C.LEVEL_ORDER.length - 1];
    C.COMPETENCIES.forEach(c => {
      assert.notEqual(l.capabilities[c.id].state, top, `${c.id} reached ${top} with no checkpoint`);
    });
  });

  await t.test("CP2 does grant the top state", () => {
    const l = newLearner();
    passCheckpoint(l, "CP2", null);
    const top = C.LEVEL_ORDER[C.LEVEL_ORDER.length - 1];
    C.COMPETENCIES.forEach(c => assert.equal(l.capabilities[c.id].state, top));
  });

  await t.test("states never downgrade", () => {
    const l = newLearner();
    passCheckpoint(l, "CP2", null);
    M.raise(l, "C1", "emerging", "low");
    assert.notEqual(l.capabilities.C1.state, "emerging");
  });
});

test("provenance tells formative from assessed", async t => {
  await t.test("challenge-only evidence is formative only", () => {
    const l = gameableProfile();
    C.COMPETENCIES.forEach(c => {
      const pv = M.capabilityProvenance(l, c.id);
      assert.equal(pv.assessed, false, `${c.id} claims assessment with no checkpoint`);
      assert.equal(pv.formative, true);
      assert.equal(pv.label, "formative only (challenge)");
    });
  });

  await t.test("checkpoint evidence is assessed, and CP scope is respected", () => {
    const l = fullyAssessedProfile();
    ["C1", "C2", "C3"].forEach(id => {
      const pv = M.capabilityProvenance(l, id);
      assert.equal(pv.assessed, true);
      assert.deepEqual([...pv.checkpoints], ["CP1", "CP2"], `${id} should be backed by both checkpoints`);
    });
    ["C4", "C5", "C6", "C7"].forEach(id => {
      const pv = M.capabilityProvenance(l, id);
      assert.equal(pv.assessed, true);
      assert.deepEqual([...pv.checkpoints], ["CP2"], `${id} must not claim CP1, which only covers C1-C3`);
    });
  });

  await t.test("a project is formative-only exactly when no checkpoint covers it", () => {
    const g = M.projectProvenance(gameableProfile(), "pr1");
    assert.equal(g.assessed, false);
    assert.equal(g.formativeOnly, true);
    const a = M.projectProvenance(fullyAssessedProfile(), "pr1");
    assert.equal(a.assessed, true);
    assert.equal(a.formativeOnly, false);
    assert.deepEqual([...a.checkpoints], ["CP1", "CP2"]);
  });
});

test("the exported portfolio cannot launder formative evidence", async t => {
  const g = gameableProfile();
  const md = E.portfolioMarkdown(g);
  const json = JSON.parse(E.portfolioJSON(g));

  await t.test("markdown does not present a challenge-only project as assessed", () => {
    assert.ok(md.includes("Covered by challenge evidence only"), "missing unassessed-coverage qualifier");
    assert.ok(!/## Some real task — \*\*Demonstrated\*\*/.test(md), "challenge-only project reads Demonstrated");
    assert.ok(md.includes("not an independent judgement"), "challenge records not labelled formative");
  });

  await t.test("markdown says what formative and assessed each mean", () => {
    assert.ok(md.includes("How to read this"));
    assert.ok(md.toLowerCase().includes("not") && md.toLowerCase().includes("independent judgement"));
  });

  await t.test("every capability names the evidence it rests on", () => {
    C.COMPETENCIES.forEach(c => {
      assert.ok(md.includes(`evidence: formative only (challenge)`), `${c.id} provenance missing`);
    });
  });

  await t.test("json marks every capability formative and unassessed", () => {
    assert.equal(json.version, 2, "json schema version must be bumped when provenance is added");
    assert.ok(json.provenance && json.provenance.note);
    C.COMPETENCIES.forEach(c => {
      const cap = json.capabilities[c.id];
      assert.ok(cap, `${c.id} missing from json`);
      assert.equal(cap.assessedByCheckpoint, false, `${c.id} claims assessment with no checkpoint`);
      assert.equal(cap.formativeOnly, true, `${c.id} not marked formative`);
    });
    assert.equal(json.projects[0].formativeOnly, true);
    assert.equal(json.projects[0].demonstratedByCheckpoint, false);
  });

  await t.test("json evidenceKinds has no duplicates", () => {
    const a = JSON.parse(E.portfolioJSON(fullyAssessedProfile()));
    Object.values(a.capabilities).forEach(cap => {
      assert.equal(new Set(cap.evidenceKinds).size, cap.evidenceKinds.length,
        `duplicate evidenceKinds in ${JSON.stringify(cap.evidenceKinds)}`);
    });
  });
});

test("the assessed path stays legible", async t => {
  const a = fullyAssessedProfile();
  const md = E.portfolioMarkdown(a);
  const json = JSON.parse(E.portfolioJSON(a));

  await t.test("a checkpoint-backed project reads plain Demonstrated", () => {
    assert.ok(md.includes("## Some real task — **Demonstrated**"));
    assert.ok(!md.includes("Covered by challenge evidence only"), "over-corrected: hides real assessment");
  });

  await t.test("capabilities name their checkpoints", () => {
    assert.ok(md.includes("evidence: challenge + CP1, CP2"));
    assert.ok(md.includes("evidence: challenge + CP2"));
    assert.ok(!md.includes("formative only (challenge)"));
  });

  await t.test("json reports assessed, not formative", () => {
    C.COMPETENCIES.forEach(c => {
      assert.equal(json.capabilities[c.id].assessedByCheckpoint, true, `${c.id} not assessed`);
      assert.equal(json.capabilities[c.id].formativeOnly, false, `${c.id} wrongly formative`);
    });
    assert.equal(json.projects[0].demonstratedByCheckpoint, true);
  });
});

test("resolved in v0.63: projectDemonstrated no longer contradicts moduleComplete", async t => {
  await t.test("challenge-only evidence never demonstrates a project", () => {
    const l = gameableProfile();
    C.COMPETENCIES.forEach(c => answerChallenge(l, c.id, 1));
    assert.equal(M.moduleComplete(l, "foundation"), false);
    assert.equal(M.projectDemonstrated(l, "pr1", "foundation"), false,
      "formative evidence alone must not demonstrate a project");
  });

  await t.test("assessed evidence does demonstrate it", () => {
    const l = gameableProfile();
    passCheckpoint(l, "CP2", "pr1");
    assert.equal(M.projectDemonstrated(l, "pr1", "foundation"), true);
  });

  await t.test("partial coverage never demonstrates it", () => {
    const l = newLearner();
    l.projects = [{ id: "pr1", name: "P", context: "c", goal: "g" }];
    const ev = answerChallenge(l, "C1", 0);
    ev.projectId = "pr1";
    passCheckpoint(l, "CP1", "pr1"); // covers C1-C3 only
    assert.equal(M.projectDemonstrated(l, "pr1", "foundation"), false, "CP1 covers 3 of 7");
  });
});

test("the progress bar rewards evidence, not exposure", async t => {
  await t.test("being taught with no evidence scores zero", () => {
    const l = newLearner();
    C.COMPETENCIES.forEach(c => M.markTaught(l, c.id));
    assert.equal(l.evidence.length, 0);
    assert.equal(M.overallPct(l, "foundation"), 0, "browsing every lesson must not manufacture progress");
  });

  await t.test("challenge practice raises the level but never the assessed share", () => {
    const l = gameableProfile();
    assert.ok(M.overallPct(l, "foundation") > 0, "practice should register");
    assert.equal(M.assessedPct(l, "foundation"), 0, "practice is not assessment");
  });

  await t.test("a passed checkpoint moves the assessed share", () => {
    const l = fullyAssessedProfile();
    assert.equal(M.assessedPct(l, "foundation"), 100);
    assert.equal(M.overallPct(l, "foundation"), 100);
  });

  await t.test("CP1 alone assesses only its own competencies", () => {
    const l = gameableProfile();
    passCheckpoint(l, "CP1", "pr1");
    assert.equal(M.assessedPct(l, "foundation"), 43, "3 of 7 = 43%");
  });
});

test("the second pass is never called independent", async t => {
  const claims = [
    [/1 \+ 2 \(independent\)/, "evidence record claims independent agreement"],
    [/independent second assess/i, "copy calls the second pass an independent assessor"],
    [/independently agree/i, "copy claims the passes independently agree"],
    [/assessor \d of 2 · independent/, "assessor badge claims independence"],
  ];

  await t.test("assessorLine never claims independence", () => {
    const single = M.assessorLine({ assessor: 1 });
    const both = M.assessorLine({ assessor: 2 }, true);
    for (const [re, why] of claims) {
      assert.ok(!re.test(single), `single: ${why}`);
      assert.ok(!re.test(both), `double: ${why}`);
    }
    assert.match(single, /single pass/);
    assert.match(both, /stricter second pass/);
    assert.match(both, /same model reading it a second time/, "must name what assesses honestly");
  });

  await t.test("provenance note says what assessed does and does not mean", () => {
    assert.match(M.PROVENANCE_NOTE, /same model reading it a second time at a higher bar/);
    assert.match(M.PROVENANCE_NOTE, /No independent human or AI assessor is connected/);
    assert.match(M.PROVENANCE_NOTE, /Until a model is configured, nothing is assessed at all/);
  });

  await t.test("no learner-facing source string claims an independent assessor", async () => {
    const { readFileSync, readdirSync } = await import("node:fs");
    const { join, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const jsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "js");
    const banned = [/1 \+ 2 \(independent\)/, /independent second assess/i, /independently agree/i];
    for (const f of readdirSync(jsDir).filter(n => n.endsWith(".js"))) {
      const src = readFileSync(join(jsDir, f), "utf8");
      for (const re of banned) {
        assert.ok(!re.test(src), `${f} contains ${re} — claims independence it does not have`);
      }
    }
  });

  await t.test("no local verdict path exists any more", async () => {
    // The stronger guarantee. There used to be exactly one local verdict implementation shared
    // by both passes, which made "same engine, higher bar" defensible. Now there is no local
    // verdict at all: a verdict can only come from a model reading the answer. If this ever
    // fails, a word-count heuristic is grading again and the wording above is a lie.
    const { readFileSync } = await import("node:fs");
    const { join, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "faculty.js"), "utf8");

    assert.doesNotMatch(src, /function verdictFromBands/,
      "a local band-aggregator must not be reintroduced as a verdict path");
    assert.doesNotMatch(src, /verdict:\s*bandIndex/,
      "no verdict may be derived from a band index without a model having graded it");
    assert.doesNotMatch(src, /\.signals\s*\|\|\s*\[\]\)\s*\.some\(/,
      "keyword signal matching must not come back as grading");
    assert.doesNotMatch(src, /text\.includes\(sig\)/,
      "substring keyword matching must not come back as grading");
    assert.match(src, /awaitingModel:\s*true/,
      "an ungraded result must declare that it is waiting on a model");
  });

  await t.test("an unassessed rubric is never summarised as a failing one", async () => {
    // Every dimension ungraded must not roll up to "all weak, verdict: more" — that manufactures
    // a failure out of the absence of a reading.
    const { readFileSync } = await import("node:fs");
    const { join, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "faculty.js"), "utf8");
    const body = src.slice(src.indexOf("function masterySummary"), src.indexOf("return { lesson"));
    assert.match(body, /if\s*\(!banded\.length\)/,
      "must detect a rubric with no graded dimension before tallying");
    assert.match(body, /assessed:\s*false/,
      "an ungraded rubric must report assessed:false");
  });
});

test("progress counts split formative from assessed", async t => {
  await t.test("challenge-only learner has zero assessed", () => {
    const l = gameableProfile();
    const s = M.evidenceSplit(l);
    assert.equal(s.total, 7);
    assert.equal(s.formative, 7);
    assert.equal(s.assessed, 0);
    assert.equal(s.checkpointsPassed, 0);
  });

  await t.test("moduleProvenance flags a module that is challenged but not assessed", () => {
    const mp = M.moduleProvenance(gameableProfile(), "foundation");
    assert.equal(mp.challengedOnly, true);
    assert.equal(mp.fullyAssessed, false);
  });

  await t.test("passing both checkpoints makes it fully assessed", () => {
    const mp = M.moduleProvenance(fullyAssessedProfile(), "foundation");
    assert.equal(mp.fullyAssessed, true);
    assert.equal(mp.challengedOnly, false);
  });
});

// The claims above are made in rendered HTML, so assert on the rendered HTML, not just
// on the helpers feeding it. A helper test cannot catch a view that ignores it.
const P = win.PROGRESS;

test("the progress view does not overclaim", async t => {
  await t.test("challenge-only learner: nothing presented as proved or assessed", () => {
    const l = gameableProfile();
    const html = P.render(l);
    assert.match(html, /0<\/strong> assessed/, "assessed count must be visible and zero");
    assert.match(html, /7<\/strong> formative/, "formative count must be shown separately");
    assert.match(html, /Nothing assessed yet/, "must say plainly that nothing is assessed");
    assert.match(html, /<strong>0% assessed<\/strong>\s*\(0\/2 checkpoints\)/);
    assert.ok(!/\b\d+<\/strong> evidenced?\b/.test(html), "must not present a raw record count as proof");
  });

  await t.test("challenge-only learner: no unqualified Demonstrated pill", () => {
    const l = gameableProfile();
    const html = P.render(l);
    assert.ok(!/pill--independent">Demonstrated</.test(html), "challenge-only project shown as Demonstrated");
    assert.match(html, /Covered \(formative\)/);
  });

  await t.test("challenge-only learner: the bar is labelled as level, not completion", () => {
    const html = P.render(gameableProfile());
    assert.match(html, /average demonstrated level/);
    assert.ok(!/competencies complete/.test(html), "still frames challenge count as competencies complete");
  });

  await t.test("fully assessed learner: assessed counts and plain Demonstrated are correct", () => {
    const html = P.render(fullyAssessedProfile());
    assert.match(html, /2<\/strong> assessed/);
    assert.match(html, /<strong>100% assessed<\/strong>\s*\(2\/2 checkpoints\)/);
    assert.match(html, /pill--independent">Demonstrated</, "a genuinely assessed project should say Demonstrated");
    assert.ok(!/Nothing assessed yet/.test(html), "over-corrected: hides real assessment");
  });

  await t.test("a skipped foundation is not reported as done", () => {
    const l = gameableProfile();
    l.foundationSkipped = true;
    l.pathway = null;
    const html = P.render(l);
    assert.match(html, /Foundation skipped/, "skip must be reported as a skip");
    assert.ok(!/Foundation done/.test(html), "a skipped module must not read as done");
  });
});

test("records saved by earlier builds cannot keep claiming independence", async t => {
  const legacy = [
    { kind: "checkpoint", assessors: "1 + 2 (independent) agree" },
    { kind: "checkpoint", assessors: "1 + 2 (independent) agree — Control Plane", lineage: "cp-1" },
    { kind: "checkpoint", assessors: "1" },
  ];

  await t.test("legacy strings map to honest ones", () => {
    assert.match(M.assessorLineFor(legacy[0]), /stricter second pass/);
    assert.match(M.assessorLineFor(legacy[0]), /same model reading it a second time/);
    assert.match(M.assessorLineFor(legacy[1]), /via Control Plane/);
    assert.match(M.assessorLineFor(legacy[2]), /single pass/);
    legacy.forEach(ev => assert.doesNotMatch(M.assessorLineFor(ev), /independent/i));
  });

  await t.test("a legacy record exports without the old claim", () => {
    const l = gameableProfile();
    // simulate a record persisted by an earlier build
    l.evidence[0].assessors = "1 + 2 (independent) agree";
    const md = E.portfolioMarkdown(l);
    const json = E.portfolioJSON(l);
    // Target the claim itself, not the word: "not an independent judgement" and the
    // "no independent assessor connected" disclaimer are correct and must survive.
    const claim = /1 \+ 2 \(independent\)|independently agree/i;
    assert.doesNotMatch(md, claim, "export markdown still carries the old claim");
    assert.doesNotMatch(json, claim, "export json still carries the old claim");
    assert.match(md, /not an independent judgement/, "the honest disclaimer must remain");
    assert.match(md, /stricter second pass/);
  });
});

test("learner-facing copy matches v0.63 semantics", async t => {
  const { readFileSync } = await import("node:fs");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const jsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "js");
  const read = f => readFileSync(join(jsDir, f), "utf8");

  await t.test("no copy defines 'Demonstrated' as mere coverage", () => {
    const banned = [
      /confirmed evidence across/i,          // v0.6x phrasing: implies verification
      /Demonstrated<\/strong> once it has\s*$/, // the old "once it has..." definition
      /or a passed capstone/i,               // assessment is required, not an alternative
    ];
    for (const f of ["main.js", "progress.js", "export.js"]) {
      for (const re of banned) {
        assert.ok(!re.test(read(f)), `${f} still defines Demonstrated as coverage: ${re}`);
      }
    }
  });

  await t.test("the projects page states the assessed requirement", () => {
    assert.match(read("main.js"), /assessed<\/em> evidence — a passed checkpoint — across/);
    assert.match(read("main.js"), /Challenge\s+evidence alone leaves it covered, not demonstrated/);
  });
});

test("the admin panel discloses what it excludes", async t => {
  const { readFileSync } = await import("node:fs");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "main.js"), "utf8");

  await t.test("staff exclusion is stated, not silently dropped", () => {
    assert.match(src, /Counts are learners only\./, "panel must say the counts are learner-scoped");
    assert.match(src, /founder QA activity is not learner engagement/);
    assert.match(src, /d\.totals\.staffByRole/, "must be able to say how many of each staff role");
  });

  await t.test("an empty analytics table is not presented as 'no struggle found'", () => {
    assert.match(src, /No learners yet, so the tables below are empty by\s*definition/);
    assert.match(src, /not reporting that nobody struggled/);
  });
});

test("assessment withholds a verdict until something has read the answer", async t => {
  await t.test("a complete fields answer is answered but not assessed", () => {
    const def = C.challenge("C1", "C1.1");
    const full = {};
    // Real space-separated words: "a".repeat(40) is a single token, so it would fail the floor
    // for the wrong reason and this test would pass without the answer being complete.
    for (const f of def.fields) {
      full[f.key] = ("a clear specific outcome with named constraints stated in full on Tuesday "
        + "because the budget is fixed and two people must approve it before anyone ships it").repeat(3);
    }
    const r = F.assessChallenge("C1", "C1.1", full);
    assert.equal(r.verdict, null, "no verdict may be invented locally");
    assert.equal(r.assessed, false);
    assert.equal(r.awaitingModel, true);
    assert.equal(r.canSubmitForAssessment, true, "a complete answer should be sendable to a model");
  });

  await t.test("length alone never produces a competency band", () => {
    const def = C.challenge("C1", "C1.1");
    const full = {};
    // Deliberately padded with filler and no substance, no keywords, no numbers.
    for (const f of def.fields) full[f.key] = "this is just padding text ".repeat(12);
    const r = F.assessChallenge("C1", "C1.1", full);
    assert.equal(r.verdict, null);
    assert.ok(!r.fieldReports.some(x => x.band === "Meets" || x.band === "Exceeds"),
      "padding must not be banded as Meets or Exceeds: " + JSON.stringify(r.fieldReports.map(x => x.band)));
  });

  await t.test("a critique with none of the keyword signals is still unassessed, not failed", () => {
    const def = C.challenge("C1", "C1.2");
    const text = "I think this goal statement is quite weak and could be much better if it were " +
      "rewritten in a clearer fashion with attention to what actually matters here, which the " +
      "original text does not really achieve at any point in its current form, unfortunately.";
    const r = F.assessChallenge("C1", "C1.2", { critique: text });
    assert.equal(r.verdict, null, "keyword absence must not become a failing verdict");
    assert.equal(r.assessed, false);
  });

  await t.test("an empty answer is blocked from submission with a reason", () => {
    const def = C.challenge("C1", "C1.1");
    const r = F.assessChallenge("C1", "C1.1", {});
    assert.equal(r.canSubmitForAssessment, false);
    assert.match(r.blocker, /still empty|Not assessed/);
  });

  await t.test("checkpoints also withhold the verdict", () => {
    const cp = C.checkpoint("CP1");
    const full = {};
    for (const f of cp.fields) full[f.key] = "a".repeat(40) + " with specifics on Monday and 5 numbers";
    const r = F.assessCheckpoint("CP1", full, false);
    assert.equal(r.verdict, null, "the stricter second pass must not be a local word-count check");
    assert.equal(r.assessed, false);
    assert.ok(r.rubric.every(x => x.band === null));
  });

  // A real scenario, found rather than hard-coded, and asserted to exist. The previous version of
  // these tests used C2.1 with `if (ch.type !== "scenario") return;` -- C2.1 is a fields
  // challenge, so all three tests returned immediately, asserted nothing, and passed green. Four
  // separate mutations of the code under test survived because of it.
  function aScenario() {
    for (const c of C.COMPETENCIES) {
      for (const ch of c.challenges || []) {
        if (ch.type === "scenario" && ch.options.some(o => o.ok) && ch.options.some(o => !o.ok)) {
          return { capId: c.id, ch };
        }
      }
    }
    throw new Error("no scenario challenge with a real answer key exists to test");
  }

  await t.test("scenario challenges keep a real verdict, from the key alone", () => {
    const { capId, ch } = aScenario();
    const good = ch.options.find(o => o.ok);
    const bad = ch.options.find(o => !o.ok);

    const right = F.assessChallenge(capId, ch.id, {
      choice: good.id, justify: "Because ".concat("x".repeat(30)),
    });
    assert.equal(right.verdict, "ready");
    assert.equal(right.assessed, true);

    const wrong = F.assessChallenge(capId, ch.id, {
      choice: bad.id, justify: "Because ".concat("x".repeat(30)),
    });
    assert.equal(wrong.verdict, "more");
  });

  await t.test("a correct choice is not downgraded by word count", () => {
    // This used to return "revise" purely because the justification was short, and thirty
    // characters of filler used to earn "Reasoning is substantive". Both were word-count
    // assessments of prose.
    const { capId, ch } = aScenario();
    const good = ch.options.find(o => o.ok);

    const short = F.assessChallenge(capId, ch.id, { choice: good.id, justify: "yes" });
    assert.equal(short.verdict, "ready", "a short justification must not change the verdict");

    // Real prose, long enough to clear the length gate. Deliberately not "x".repeat(n): the
    // placeholder check already catches repeated filler, so that string never reaches the branch
    // under test. Both branches are asserted below.
    const prose = "Because the model guesses at anything it cannot verify, so the cheapest thing "
      + "to check first is whether the number in the output is the number in the source at all.";
    assert.ok(prose.split(/\s+/).length >= ch.ask.minWords, "fixture prose must clear minWords");

    const written = F.assessChallenge(capId, ch.id, { choice: good.id, justify: prose });
    const report = written.fieldReports.find(f => f.key === "justify");
    assert.equal(report.ok, true, "prose that clears the gate should be marked written");
    assert.doesNotMatch(report.note, /substantive/i,
      "word count must not be reported as evidence of reasoning");
    assert.match(report.note, /not assessed/i,
      "the justification must say plainly that nothing has read it");

    const filler = F.assessChallenge(capId, ch.id, {
      choice: good.id, justify: "x".repeat(ch.ask.minWords * 3),
    });
    assert.equal(filler.verdict, "ready",
      "placeholder filler must not change the verdict either");
    assert.equal(filler.fieldReports.find(f => f.key === "justify").ok, false,
      "repeated filler is not a justification");
  });

  await t.test("what was assessed is stated, and the justification is excluded", () => {
    const { capId, ch } = aScenario();
    const good = ch.options.find(o => o.ok);
    const r = F.assessChallenge(capId, ch.id, { choice: good.id, justify: "Because ".repeat(20) });
    assert.match(r.assessedBy, /choice only/i,
      "assessment scope must say the argument was not graded");
    assert.equal(r.justificationAssessed, false);
    assert.doesNotMatch(r.summary, /records as evidence/i,
      "a length gate must not be described as recording evidence");
    assert.match(r.summary, /hasn.t been read|hasn.t checked/i);
  });

  await t.test("no test silently skips because a fixture changed shape", () => {
    // The failure mode this guards: a guard clause that returns early turns a test into a no-op
    // that stays green forever. Any challenge id this file hard-codes must still exist and still
    // be the type the test assumes.
    const pinned = [
      ["C2", "C2.1", "fields"],
      ["C3", "C3.2", "scenario"],
      ["C5", "C5.2", "scenario"],
      ["C7", "C7.3", "scenario"],
    ];
    for (const [capId, chId, type] of pinned) {
      const ch = C.challenge(capId, chId);
      assert.ok(ch, `pinned challenge ${chId} no longer exists`);
      assert.equal(ch.type, type, `pinned challenge ${chId} changed type`);
    }
  });

  await t.test("masterySummary refuses to score an ungraded rubric", () => {
    const s = F.masterySummary({ rubric: [{ label: "A", band: null }, { label: "B", band: null }] });
    assert.equal(s.assessed, false);
    assert.equal(s.verdict, null, "an ungraded rubric must not roll up to a verdict");
    assert.equal(s.ready, null);
  });

  await t.test("masterySummary still scores a graded rubric", () => {
    const s = F.masterySummary({ rubric: [{ label: "A", band: "Meets" }, { label: "B", band: "Exceeds" }] });
    assert.equal(s.assessed, true);
    assert.equal(s.ready, true);
    assert.equal(s.met, 2);
  });
});

test("the pathway recommendation uses every diagnostic answer", async t => {
  await t.test("a goal stated only in answer A is considered", () => {
    // This is the defect: A is what the learner said they want in their real life, and the old
    // implementation never read it. A was collected, stored, and thrown away.
    const only = C.recommendPathway({ a: "I want help with coding and debugging my python scripts",
                                      b: "", c: "", d: "2", e: "" });
    assert.ok(only && only.id === "software",
      "answer A alone must be able to drive the recommendation, got " + JSON.stringify(only && only.id));
  });

  await t.test("a goal stated only in answer C is considered", () => {
    const only = C.recommendPathway({ a: "", b: "", c: "ship features and debug code with a pair",
                                      d: "", e: "" });
    assert.ok(only && only.id === "software", "answer C alone must count");
  });

  await t.test("a real task in answer E is considered", () => {
    const only = C.recommendPathway({ a: "", b: "", c: "", d: "", e: "I used it to write a newsletter draft" });
    assert.ok(only && only.id === "content", "answer E alone must count, got " + JSON.stringify(only && only.id));
  });

  await t.test("answers matching nothing recommend nothing", () => {
    // No keywords matched. The old code would still have picked the first pathway with any
    // overlap, or nothing at all silently. Returning null and letting the learner browse is
    // the honest outcome — a bad match is worse than no match when it gets presented as
    // "recommended for you".
    const rec = C.recommendPathway({ a: "help me plan my week", b: "nothing in particular really" });
    assert.equal(rec, null, "must not invent a recommendation from a non-match");
  });

  await t.test("a specific goal in one answer beats a vague professional answer", () => {
    const rec = C.recommendPathway({
      a: "I want to ship features and debug code",
      b: "general productivity",
    });
    assert.ok(rec && rec.id === "software", JSON.stringify(rec && rec.id));
  });

  await t.test("it reports which answer drove it, so the learner can check", () => {
    const rec = C.recommendPathway({ a: "help me with coding", b: "", c: "", d: "", e: "" });
    assert.ok(rec.fromAnswer && rec.fromAnswer.length, "must attribute the match to an answer");
    assert.ok(rec.matchedOn && rec.matchedOn.length, "must show the words that matched");
    assert.equal(rec.consideredAnswers, 1);
  });

  await t.test("no answers gives no recommendation, not a default pick", () => {
    assert.equal(C.recommendPathway({ a: "", b: "", c: "", d: "", e: "" }), null);
    assert.equal(C.recommendPathway(null), null);
  });

  await t.test("a bare string still works, so old callers cannot crash", () => {
    const rec = C.recommendPathway("I want to write code and debug things");
    assert.ok(rec && rec.id === "software");
  });
});

test("subjects are independent files and lose nothing", async t => {
  const { readdirSync, existsSync, readFileSync } = await import("node:fs");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const jsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "js");
  const subjDir = join(jsDir, "subjects");

  await t.test("every pathway has a subject file, and every subject file a pathway", () => {
    const files = readdirSync(subjDir).filter(f => f.endsWith(".js")).map(f => f.replace(/\.js$/, ""));
    const ids = C.PATHWAYS.map(p => p.id);
    // A pathway may legitimately have no competencies of its own (none today), but any
    // subject file with no pathway is content nobody can reach.
    // A subject is reachable if a pathway uses it, or if it is the foundation. Anything else is
    // content shipped to the browser that no learner can ever be routed to.
    const foundation = C.COMPETENCIES.length ? "foundation-core" : null;
    const orphans = files.filter(f => !ids.includes(f) && f !== foundation);
    assert.deepEqual(orphans, [], "subject files nothing can reach: " + orphans.join(", "));
    for (const f of files) {
      assert.ok(existsSync(join(subjDir, f + ".js")), f);
    }
  });

  await t.test("a subject file is loadable on its own, with only helpers passed in", async () => {
    // This is the whole point of the split: a subject must not reach into content.js.
    const src = readFileSync(join(subjDir, "software.js"), "utf8");
    assert.ok(!/window\.CONTENT/.test(src), "subject must not read window.CONTENT");
    assert.ok(!/\bCONTENT\./.test(src), "subject must not reference CONTENT");
    assert.match(src, /function \(h\)/, "subject takes its helpers as a parameter");
  });

  await t.test("adding a subject does not require editing content.js", async () => {
    // The structural claim behind "add a plethora of subjects". A subject registers itself;
    // content.js only holds the pathway table and calls the factories.
    const content = readFileSync(join(jsDir, "content.js"), "utf8");
    const factoryCalls = (content.match(/factory\(\{/g) || []).length;
    assert.equal(factoryCalls, 1,
      "content.js should compose subjects through one generic loop, not per-subject wiring");
    assert.ok(!/const [A-Z_0-9]+_COMPETENCIES = \[/.test(content),
      "content.js must not hold inline competency bodies again");
  });

  await t.test("no subject body is left behind in content.js", async () => {
    const content = readFileSync(join(jsDir, "content.js"), "utf8");
    // The foundation moved out too, so content.js should now hold zero competency bodies -- only
    // the challenge helpers, the pathway table and the registry that composes the subject files.
    const inline = (content.match(/canDo:/g) || []).length;
    assert.equal(inline, 0, `content.js should hold no competency bodies, found ${inline}`);
    assert.ok(C.COMPETENCIES.length >= 7, "the foundation must still be wired in and non-empty");
  });
});

test("track steers the recommendation away from job-role content", async t => {
  // A deliberately balanced fixture: one answer is pure build content ("how ai works"), one is
  // pure job-role content ("teacher"). Both weigh 3, both match exactly one keyword, so the only
  // thing that can decide the winner is the track prior.
  const INTAKE = { a: "i want to understand how ai works", b: "i am a teacher", c: "", d: "3", e: "" };

  await t.test("professional track prefers the job-role pathway", () => {
    const rec = C.recommendPathway(INTAKE, "professional");
    assert.equal(rec.group, "work", `expected a work pathway, got ${rec.id} (${rec.group})`);
    assert.equal(rec.fromTrack.multiplier, 1.5);
  });

  await t.test("personal track flips the same answers to the build pathway", () => {
    const rec = C.recommendPathway(INTAKE, "personal");
    assert.equal(rec.group, "build", `expected a build pathway, got ${rec.id} (${rec.group})`);
    assert.equal(rec.fromTrack.multiplier, 2.5);
  });

  await t.test("the demoted pathway was a real contender, not an absent one", () => {
    // If education never scored, "personal" would trivially pick foundations and this test would
    // pass for the wrong reason. Confirm the losing side is genuinely in play.
    const pro = C.recommendPathway(INTAKE, "professional");
    assert.ok(pro.recommend.includes("teacher"));
    assert.ok(C.PATHWAYS.find(p => p.id === pro.id).group === "work");
  });

  await t.test("track can arrive inside the intake object instead of as an argument", () => {
    const viaArg = C.recommendPathway(INTAKE, "personal");
    const viaObj = C.recommendPathway({ ...INTAKE, track: "personal" });
    assert.equal(viaObj.id, viaArg.id);
    assert.deepEqual(viaObj.fromTrack, viaArg.fromTrack);
  });

  await t.test("the prior is explained rather than applied silently", () => {
    const rec = C.recommendPathway(INTAKE, "personal");
    assert.match(rec.fromTrack.note, /You chose personal/);
    assert.match(rec.fromTrack.note, /weighted/);
  });

  await t.test("no track means no prior and no claim about one", () => {
    assert.equal(C.recommendPathway(INTAKE).fromTrack, null);
  });

  await t.test("the full pathway is returned, not a partial subset", () => {
    const rec = C.recommendPathway(INTAKE, "professional");
    const real = C.PATHWAYS.find(p => p.id === rec.id);
    for (const k of ["id", "group", "status", "prereq", "capstoneId", "rubricEmphasis", "tagline"]) {
      assert.equal(rec[k], real[k], `recommendation lost pathway field: ${k}`);
    }
    assert.equal(rec.competencies, real.competencies, "should be the same competency objects");
  });

  await t.test("unknown or absent answers give no recommendation, not a wrong one", () => {
    assert.equal(C.recommendPathway({}, "personal"), null);
    assert.equal(C.recommendPathway({ a: "   ", b: "" }, "professional"), null);
  });
});

test("nothing asks every learner to have a job", async t => {
  // Measured, then fixed. An audit of every question a learner sees before choosing a pathway
  // found the diagnostic asked, of everyone, "what would you most like AI to help you accomplish
  // professionally?" and three foundation quick checks assumed a client, a colleague, or a job.
  // That is the "irrelevant questions" complaint at the front door: it is the first thing the
  // system says, and someone who is not working has no answer to give.

  const WORK = /\b(colleague|manager|client|customer|CRM|KPI|stakeholder|coworker|workplace|timesheet|onboarding|inbox|mailing list|spreadsheet|invoice|headcount|roadmap|sprint|OKR|deliverable|employee|employer|professionally)\b/i;

  await t.test("no diagnostic question assumes the learner works", () => {
    for (const q of C.DIAGNOSTIC.questions) {
      assert.doesNotMatch(q.label + " " + (q.hint || ""), WORK,
        `diagnostic ${q.key} assumes a job: ${q.label}`);
    }
  });

  await t.test("the diagnostic lets a learner say they have no work context", () => {
    // A question with no valid answer for a real learner is a broken question, not a hard one.
    const b = C.DIAGNOSTIC.questions.find(q => q.key === "b");
    assert.ok(b, "diagnostic lost question b");
    assert.match(b.hint, /none right now/i,
      "question b must offer a legitimate 'none of this applies' answer");
  });

  await t.test("no foundation quick check assumes a job", () => {
    // Only the foundation. A learner who chose Customer Support or Real Estate should be asked
    // about customers and properties; a learner on the foundation has not opted into any of that.
    for (const cap of ["C1", "C2", "C3", "C4", "C5", "C6", "C7"]) {
      for (const q of C.QUICK_CHECKS[cap] || []) {
        assert.doesNotMatch(JSON.stringify(q), WORK,
          `foundation quick check ${cap} assumes a job: ${q.q}`);
      }
    }
  });

  await t.test("every pathway lesson actually teaches AI, not just the job", async t => {
    // The suspicion was that a profession subject taught the profession with AI attached. Measured
    // across all 25 pathways, every single competency lesson already grounds itself in how models
    // behave, so this locks that in rather than assuming it.
    const AI = /\b(model|context|prompt|token|confabulat|hallucinat|retriev|ground(ed|ing)?|inference|fine-?tun|embedding|eval(uation)?|training data|rag|tool call|system prompt|temperature|deterministic|verif(y|ication)|bias|jailbreak|classifier)\b/i;
    const weak = [];
    for (const p of C.PATHWAYS) {
      for (const c of p.competencies) {
        if (!AI.test(JSON.stringify(c.lesson || {}))) weak.push(`${p.id}/${c.id}`);
      }
    }
    assert.equal(weak.join(","), "",
      `these competencies teach a job but never how a model behaves: ${weak.join(", ")}`);
  });
});

test("a personal goal gets a personal pathway, not a blank", async t => {
  // This used to assert null. The vocabulary was 168 profession and specialism terms, so a
  // learner who answered honestly about their own life got no recommendation at all -- which is
  // the "irrelevant questions" problem in its sharpest form. There is now a personal pathway and
  // personal-life vocabulary, so these must resolve.

  const personal = "sort out my prescriptions, help my kids with homework, plan a holiday on a budget";
  const rec = C.recommendPathway({ a: personal }, "personal");
  assert.ok(rec, "an ordinary personal goal still gets no recommendation");
  assert.equal(rec.id, "personal");
  assert.equal(rec.group, "personal");
  assert.ok(rec.matchedOn.length, "a personal match must say what it matched on");

  await t.test("a range of personal goals all resolve", () => {
    const goals = [
      "understand my medication instructions",
      "get in shape and stop guessing",
      "budget for a holiday",
      "help my kids with homework",
      "sort out my mortgage",
      "my sleep and my anxiety",
      "learn a language",
    ];
    for (const g of goals) {
      const r = C.recommendPathway({ a: g }, "personal");
      assert.ok(r, `personal goal got no recommendation: ${g}`);
      assert.equal(r.id, "personal", `personal goal routed elsewhere: ${g} -> ${r.id}`);
    }
  });

  await t.test("the personal pathway is the real foundation capability, not a stub", () => {
    const p = C.pathway("personal");
    assert.ok(p, "no personal pathway registered");
    assert.equal(p.competencies, C.COMPETENCIES,
      "personal pathway should expose the same capability objects the foundation does");
    assert.equal(p.competencies.length, 7);
    assert.equal(p.capstoneId, "PERCAP");
    assert.equal(C.checkpoint("PERCAP").pathway, "personal");
    assert.equal(C.checkpointsFor("personal").map(c => c.id).join(","), "PERCAP",
      "the personal pathway must resolve its own capstone, or it renders with no checkpoint");
  });

  await t.test("choosing the personal track does not hijack a work goal", () => {
    const r = C.recommendPathway({ a: "write code and ship features" }, "personal");
    assert.equal(r.id, "software");
    assert.equal(r.fromTrack.multiplier, 0.3, "work should stay demoted on the personal track");
  });

  await t.test("genuinely unmatchable input still falls back honestly", () => {
    // The browse-all route must survive, for answers that genuinely match nothing.
    assert.equal(C.recommendPathway({ a: "zxqv frobnicate" }, "personal"), null);
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "main.js"), "utf8");
    assert.match(src, /Browse all pathways/);
    assert.match(src, /\$\{rec \? /, "recommendation must stay conditional on a match");
  });

  await t.test("the browse view offers the personal group", () => {
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "main.js"), "utf8");
    assert.match(src, /group\("personal"/, "no personal section in the browse view");
  });
});

test("the foundation teaches AI, not office life", async t => {
  // The foundation used to assume a job, a team and a document: "get the Q3 report done", "post
  // it on social media", "draft a customer refund email". A learner who wanted to understand AI,
  // or who was not working at all, was asked questions about a world they had not opted into.
  // These assertions are deliberately blunt about that.

  await t.test("every foundation competency teaches something about AI itself", () => {
    for (const c of C.COMPETENCIES) {
      const lesson = JSON.stringify(c.lesson).toLowerCase();
      assert.ok(
        /model|context|prompt|confabulat|invent|retriev|ground|hallucinat|training|token|source|citation|tool use|fine-?tun/.test(lesson),
        `${c.id} (${c.name}) teaches no AI behaviour: its lesson never mentions how a model actually behaves`);
    }
  });

  await t.test("critique material does not assume the learner has a job", () => {
    // Allowed in a lesson as a deliberate counter-example, which is how C1.2 teaches. Not allowed
    // as the material a learner is handed to analyse, because that assumes their working life.
    const ASSUMES_JOB = /\b(Q3|quarter[ -]report|colleague|mailing list|customer refund|CRM|stakeholder|coworker|workplace|team meeting|timesheet)\b/i;
    for (const c of C.COMPETENCIES) {
      for (const ch of c.challenges || []) {
        if (ch.type !== "critique") continue;
        assert.ok(!ASSUMES_JOB.test(String(ch.material || "")),
          `${ch.id} hands the learner workplace material: ${String(ch.material).slice(0, 90)}`);
      }
    }
  });

  await t.test("the critiques teach real AI failure modes", () => {
    const critiques = C.COMPETENCIES.flatMap(c => (c.challenges || []).filter(ch => ch.type === "critique"));
    assert.ok(critiques.length >= 3, "expected several critiques to teach from");
    const all = JSON.stringify(critiques).toLowerCase();
    for (const concept of ["context", "invent", "correct", "source"]) {
      assert.ok(all.includes(concept),
        `the critiques never touch "${concept}" — they are not teaching AI behaviour, just process`);
    }
  });

  await t.test("written challenges are about the learner's own task, not a hypothetical", () => {
    for (const c of C.COMPETENCIES) {
      for (const ch of c.challenges || []) {
        if (ch.type !== "fields") continue;
        const brief = String(ch.brief || "");
        assert.ok(!/pick one task from your own life or work this week/i.test(brief),
          `${ch.id} still tells the learner to invent a task instead of using the one they captured: ${brief.slice(0, 80)}`);
      }
    }
  });

  await t.test("scenarios are about AI judgement, not office politics", () => {
    const ASSUMES_JOB = /\b(Q3|customer refund|mailing list|crm|ticket queue|refund email)\b/i;
    for (const c of C.COMPETENCIES) {
      for (const ch of c.challenges || []) {
        if (ch.type !== "scenario") continue;
        assert.ok(!ASSUMES_JOB.test(JSON.stringify(ch)),
          `${ch.id} is an office scenario rather than an AI judgement: ${ch.title}`);
      }
    }
  });

  await t.test("every foundation challenge asks for a specific, answerable thing", () => {
    for (const c of C.COMPETENCIES) {
      for (const ch of c.challenges || []) {
        if (ch.type === "fields") {
          assert.ok(ch.fields.length >= 2, `${ch.id} has too few fields to be substantive`);
          for (const f of ch.fields) {
            assert.ok(f.hint && f.hint.length > 30, `${ch.id}/${f.key} has no usable hint`);
          }
        }
        if (ch.type === "critique") {
          assert.ok((ch.expected || []).length >= 3, `${ch.id} gives the learner fewer than 3 things to look for`);
        }
        if (ch.type === "scenario") {
          assert.ok((ch.options || []).length === 4, `${ch.id} should offer 4 options`);
          assert.ok((ch.options || []).some(o => o.ok), `${ch.id} has no correct option`);
          assert.ok((ch.options || []).filter(o => o.ok).length === 1, `${ch.id} must have exactly one right answer`);
          assert.ok((ch.options || []).every(o => o.why && o.why.length > 20),
            `${ch.id} has an option with no real explanation of why it is wrong`);
          // Each explanation must be its own. A duplicated or generic "why" is the shape a
          // distractor takes when nobody actually worked out why it is wrong.
          const whys = (ch.options || []).map(o => o.why);
          assert.equal(new Set(whys).size, whys.length, `${ch.id} repeats an explanation across options`);
          // A distractor is explained by saying what is actually true instead. If a wrong option's
          // explanation does not push back at all, the learner is left to guess why it lost.
          const PUSHES_BACK = /\b(not|no|nothing|never|nobody|does not|doesn\u2019t|is not|was not|too absolute|punts|premium|unlikely|instead|rather|length is|publicly available is)\b/i;
          for (const o of (ch.options || [])) {
            if (o.ok) continue;
            assert.match(o.why, PUSHES_BACK,
              `${ch.id}: the wrong option "${o.label.slice(0, 40)}" is not explained — its why just asserts something: ${o.why.slice(0, 80)}`);
          }
        }
      }
    }
  });
});
