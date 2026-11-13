import test from 'node:test';
import assert from 'node:assert/strict';
import {loadApp} from './load.mjs';
const {CONTENT:C, REVIEW:R, PATHWAY:P, PROGRESS:V} = loadApp();
const DAY=86400000;
const start=Date.parse('2026-11-01T12:00:00Z');
function learner(){return {capabilities:Object.fromEntries(C.allCompetencies().map(c=>[c.id,{state:'unknown',taughtAt:null}])),guided:{DS1:new Date(start).toISOString()},challenges:{},checkpoints:{},projects:[],evidence:[],xp:0};}
function finish(l,id,now=start+3*DAY){R.begin(l,id,now);R.submit(l,id,{recall:'My recall',application:'My application'},now);return R.finish(l,id,{recallRating:'partial',applicationRating:'again',takeaway:'Check the date boundary'},now);}

test('review appears exactly three days after learning; legacy learners and bad dates are safe',()=>{
 const l=learner();assert.equal(R.status(l,'DS1',start+3*DAY-1).due,false);assert.equal(R.status(l,'DS1',start+3*DAY).due,true);
 assert.equal(R.status(l,'missing'),null);assert.equal(R.status(l,'C1'),null);
 l.guided.DS1='invalid';assert.equal(R.status(l,'DS1'),null);
 assert.deepEqual(JSON.parse(JSON.stringify(R.queue({}))),[]);
});
test('queue deduplicates reused foundation skills and includes skills outside the active module',()=>{
 const l=learner();l.capabilities.C1.taughtAt=new Date(start-DAY).toISOString();l.module='writing';
 const q=R.queue(l,start+4*DAY);assert.equal(q.length,2);assert.equal(q[0].id,'C1');assert.equal(q[1].id,'DS1');
});
test('rendering, starting, hints and unfinished attempts do not postpone a due review',()=>{
 const l=learner();const before=JSON.stringify(l);R.render(l,['review','DS1']);assert.equal(JSON.stringify(l),before);
 R.begin(l,'DS1',start+4*DAY);R.reveal(l,'DS1');R.submit(l,'DS1',{recall:'Unsure',application:'Unsure'},start+4*DAY);
 assert.equal(R.status(l,'DS1',start+4*DAY).due,true);assert.equal(R.history(l,'DS1').length,0);
});
test('blank attempts and invalid reflections cannot complete a review',()=>{
 const l=learner();assert.throws(()=>R.begin(l,'C1',start));R.begin(l,'DS1',start);
 assert.throws(()=>R.submit(l,'DS1',{recall:' ',application:'A'}));assert.throws(()=>R.finish(l,'DS1',{}));
 R.submit(l,'DS1',{recall:'A',application:'B'},start);
 for(const fields of [{},{recallRating:'toString',applicationRating:'solid',takeaway:'A'},{recallRating:'solid',applicationRating:'again',takeaway:' '}])assert.throws(()=>R.finish(l,'DS1',fields));
 assert.equal(R.history(l,'DS1').length,0);
});
test('first attempt stays fixed after comparison and early support remains recorded',()=>{
 const l=learner();R.begin(l,'DS1',start);R.draft(l,'DS1',{recall:'First',application:'Guess'});R.reveal(l,'DS1');
 R.submit(l,'DS1',{recall:'First',application:'Guess'},start);R.draft(l,'DS1',{recall:'Copied',application:'Copied'});R.submit(l,'DS1',{recall:'Copied',application:'Copied'},start+DAY);
 assert.equal(l.reviewDrafts.DS1.attempt.recall,'First');assert.equal(l.reviewDrafts.DS1.attempt.usedSupport,true);
 const restored=JSON.parse(JSON.stringify(l));assert.equal(restored.reviewDrafts.DS1.attempt.application,'Guess');
});
test('completion schedules a future review without modifying mastery, evidence, XP or quick-check history',()=>{
 const l=learner();l.revisits={DS1:'unchanged'};const before=JSON.stringify(l);const row=finish(l,'DS1');
 assert.equal(row.applicationRating,'again');assert.equal(R.status(l,'DS1',start+3*DAY).due,false);assert.equal(R.status(l,'DS1',start+6*DAY).due,true);
 assert.equal(l.reviewDrafts.DS1,undefined);const {reviewDrafts,learningReviews,...rest}=l;assert.equal(JSON.stringify(rest),before);
 assert.throws(()=>R.finish(l,'DS1',{recallRating:'solid',applicationRating:'solid',takeaway:'Again'}));
});
test('all competencies have authored prompts and explanations; saved exercise remains stable',()=>{
 for(const c of C.allCompetencies())for(let i=0;i<2;i++){const ex=R.exercise(c.id,i);assert.ok(ex.prompt&&ex.answer&&ex.source,c.id);assert.notEqual(ex.prompt,c.lesson.guided.task,c.id);}
 const l=learner();R.begin(l,'DS1',start);const ex=l.reviewDrafts.DS1.exercise;R.begin(l,'DS1',start+DAY);assert.equal(l.reviewDrafts.DS1.exercise,ex);
});
test('history is bounded while question rotation continues after twenty reviews',()=>{
 const l=learner();for(let n=0;n<21;n++)finish(l,'DS1',start+n*DAY);
 assert.equal(R.history(l,'DS1').length,20);assert.equal(R.history(l,'DS1')[19].roundNumber,21);
 assert.notEqual(R.history(l,'DS1')[18].exercise.prompt,R.history(l,'DS1')[19].exercise.prompt);
 R.begin(l,'DS1',start+22*DAY);assert.equal(l.reviewDrafts.DS1.roundNumber,22);
});
test('answer reference stays hidden until submit or help; learner input is escaped',()=>{
 const l=learner();R.begin(l,'DS1',start);R.draft(l,'DS1',{recall:'<script>bad()</script>',application:'<img src=x>'});
 let html=R.render(l,['review','DS1']);assert.ok(!html.includes('Expected: customer_id'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<img src=x>'));
 R.reveal(l,'DS1');html=R.render(l,['review','DS1']);assert.ok(html.includes('Expected: customer_id'));assert.ok(html.includes('recorded as supported'));
});
test('progress offers reviews and in-module recommendations route to the written review',()=>{
 const l=learner();l.capabilities.C1.taughtAt=new Date(start).toISOString();for(const ch of C.competency('C1').challenges)l.challenges[ch.id]={completedAt:new Date(start).toISOString()};
 const step=P.walkModule(l,'foundation');assert.equal(step.action,'revisit');assert.equal(step.href,'#/review/C1');
 assert.ok(V.render(l).includes('href="#/review"'));
 finish(l,'C1',Date.now());assert.notEqual(P.walkModule(l,'foundation').action,'revisit');
});
