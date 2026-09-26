// Frontend tests for the app's pure-logic modules.
//
// The Worker has a 200-test suite; app/js had none at all, and the bug class this repo
// has actually been hunted for -- derived numbers and status words that look right and
// report falsely -- lives disproportionately in app/js. These run under `node --test`
// with no dependencies, no build step and no network.
import test from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./load.mjs";

const win = loadApp();
const C = win.CONTENT;
const M = win.MODEL;
const E = win.EXPORT;

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
    assert.match(both, /same local rubric engine/, "must name the engine honestly");
  });

  await t.test("provenance note says what assessed does and does not mean", () => {
    assert.match(M.PROVENANCE_NOTE, /same local rubric engine re-run at a higher bar/);
    assert.match(M.PROVENANCE_NOTE, /No independent human or AI assessor is connected yet/);
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

  await t.test("the two passes really are the same engine at two thresholds", async () => {
    // Guards the claim itself: if these ever diverge into genuinely different logic, the
    // honest wording above becomes under-stated and the docs need revisiting.
    const { readFileSync } = await import("node:fs");
    const { join, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "js", "faculty.js"), "utf8");
    assert.match(src, /function fieldBand\(f, val, strict\)/);
    assert.match(src, /const ready = strict \?/,
      "verdict must be one code path with a strict flag, not a separate assessor implementation");
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
    assert.match(M.assessorLineFor(legacy[0]), /same local rubric engine/);
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
