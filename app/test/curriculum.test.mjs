import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadApp} from './load.mjs';
const {CONTENT: C, FACULTY: F, AIF_PRACTICE_CHECKS: extra} = loadApp();
const competencies = [...new Map(C.allCompetencies().map(c => [c.id, c])).values()];

test('every competency has usable practice with one correct answer per question', () => {
  assert.equal(competencies.length, 172);
  for (const c of competencies) {
    const checks = C.quickCheck(c.id);
    assert.ok(checks.length >= 2, c.id);
    assert.ok(C.lessonSteps(c.id).includes('quickcheck'), c.id);
    for (const q of checks) {
      assert.ok(q.q.trim(), c.id);
      assert.ok(q.options.length >= 2, c.id);
      assert.equal(q.options.filter(o => o.ok).length, 1, `${c.id}: ${q.q}`);
      assert.equal(new Set(q.options.map(o => o.label)).size, q.options.length, c.id);
      for (const o of q.options) assert.ok(o.label.trim() && o.why.trim(), c.id);
    }
  }
});

test('the supplemental bank fills 29 gaps with 58 questions', () => {
  assert.equal(Object.keys(extra).length, 29);
  assert.equal(Object.values(extra).flat().length, 58);
  for (const id of Object.keys(extra)) {
    assert.ok(C.competency(id), id);
    assert.equal(C.quickCheck(id), extra[id], id);
  }
});

test('every written challenge has renderable fields, rubric and valid targets', () => {
  for (const c of competencies) for (const ch of c.challenges) {
    if (ch.type !== 'fields') continue;
    assert.ok(Array.isArray(ch.fields) && ch.fields.length, ch.id);
    assert.ok(Array.isArray(ch.rubric) && ch.rubric.length, ch.id);
    assert.equal(new Set(ch.fields.map(f => f.key)).size, ch.fields.length, ch.id);
    for (const f of ch.fields) assert.ok(f.key && f.label && f.minWords > 0, ch.id);
    for (const r of ch.rubric) assert.ok(r.label, ch.id);
    assert.ok(C.LEVEL_ORDER.includes(ch.raises), ch.id);
  }
});

test('guided comparison records attempts without grading correctness or length', () => {
  const blank = F.guidedFeedback('DS1', {query:'   '});
  assert.ok(blank.reports.every(r => !r.attempted && r.band === null));
  const response = F.guidedFeedback('DS1', {query:'wrong',result:'wrong',explain:'wrong'});
  assert.ok(response.reports.every(r => r.attempted && r.band === null));
  assert.ok(response.reports.every(r => r.note.includes('has not been graded')));
  assert.match(response.summary, /full first attempt/);
  assert.doesNotMatch(response.summary, /correct|passed|mastered/i);
});

test('every lesson supports the full interactive teaching sequence', () => {
  for (const c of competencies) {
    const l = c.lesson;
    assert.ok(l.activate.heading && l.activate.story && l.activate.point, c.id);
    assert.ok(Array.isArray(l.explain.paras) && l.explain.paras.length && l.explain.keyIdea, c.id);
    assert.ok(l.demonstrate.task && l.demonstrate.full && l.demonstrate.steps.length, c.id);
    for (const step of l.demonstrate.steps) assert.ok(step.move && step.think && step.result, c.id);
    assert.ok(Array.isArray(l.deconstruct) && l.deconstruct.length, c.id);
    assert.ok(l.guided.intro && l.guided.task && l.guided.fields.length, c.id);
    for (const field of l.guided.fields) assert.ok(l.guided.model[field.key], `${c.id}:${field.key}`);
    assert.ok(F.guidedFeedback(c.id, {}).reports.every(r => r.band === null && !r.attempted), c.id);
  }
});

test('supplied data downloads exist and every guided field has an example', () => {
  for (const id of ['DS1', 'DS2']) {
    const lesson = C.competency(id).lesson;
    assert.ok(readFileSync(new URL('../'+lesson.materials.download, import.meta.url)).length);
    for (const field of lesson.guided.fields) assert.ok(lesson.guided.model[field.key], `${id}:${field.key}`);
  }
});
