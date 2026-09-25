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
    assert.ok(md.includes("Demonstrated (formative evidence only)"), "missing formative-only qualifier");
    assert.ok(!/## Some real task — \*\*Demonstrated\*\*/.test(md), "project reads plain Demonstrated");
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
    assert.ok(!md.includes("Demonstrated (formative evidence only)"), "over-corrected: hides real assessment");
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

test("known internal disagreement, still open for the founder", async t => {
  await t.test("projectDemonstrated disagrees with moduleComplete on challenge-only evidence", () => {
    const l = gameableProfile();
    C.COMPETENCIES.forEach(c => answerChallenge(l, c.id, 1));
    assert.equal(M.moduleComplete(l, "foundation"), false);
    assert.equal(M.projectDemonstrated(l, "pr1", "foundation"), true);
  });
});
