// Browser regression checks. Start an isolated Chrome with remote debugging first;
// see app/README.md. Uses only Node built-ins and never submits external requests.
import {createServer} from 'node:http';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
const server = createServer(async (req,res) => {
  const path = resolve(root, '.' + new URL(req.url,'http://localhost').pathname);
  if (!path.startsWith(root.endsWith(sep) ? root : root+sep)) {res.writeHead(403).end();return;}
  try {
    const body = await readFile(path.endsWith(sep) ? path+'index.html' : path);
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp'})[extname(path)] || 'application/octet-stream');
    res.end(body);
  } catch {res.writeHead(404).end();}
});
await new Promise(r => server.listen(0,'127.0.0.1',r));
let socket;
try {
  const port=server.address().port;
  const debug=process.env.CHROME_DEBUG_URL || 'http://127.0.0.1:9337';
  const target=await (await fetch(debug+'/json/new?about:blank',{method:'PUT'})).json();
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
  let id=0;const pending=new Map();const errors=[];
  socket.onmessage=event=>{
    const message=JSON.parse(event.data);
    if(message.id){const p=pending.get(message.id);pending.delete(message.id);message.error?p.reject(message.error):p.resolve(message.result);}
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails);
    if(message.method==='Fetch.requestPaused')void send('Fetch.failRequest',{requestId:message.params.requestId,errorReason:'Aborted'});
  };
  function send(method,params={}) {
    return new Promise((resolve,reject)=>{
      const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));
    });
  }
  await send('Runtime.enable');
  // Block remote service calls: these tests exercise local learning, not accounts or grading.
  await send('Fetch.enable',{patterns:[{urlPattern:'https://*'}]});
  await send('Page.enable');
  await send('Page.navigate',{url:`http://127.0.0.1:${port}/index.html#/learn/DS1/0`});
  const result=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{
    const assert=(ok,label)=>{if(!ok)throw new Error(label);};
    const wait=ms=>new Promise(r=>setTimeout(r,ms));
    for(let i=0;i<100&&!window.CONTENT;i++)await wait(50);
    assert(window.CONTENT,'app loaded');
    await wait(100);
    const $=s=>document.querySelector(s);
    const $$=s=>[...document.querySelectorAll(s)];
    const navigate=async hash=>{
      if(location.hash!==hash){
        await wait(60); // Stay below Chrome's history-update flood limit.
        await new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>reject(new Error('Navigation timed out: '+hash)),5000);
          window.addEventListener('hashchange',()=>{clearTimeout(timer);resolve();},{once:true});
          location.hash=hash;
        });
      }
    };
    const lesson=async(id,step)=>navigate('#/learn/'+id+'/'+CONTENT.lessonSteps(id).indexOf(step));
    const initial=JSON.stringify(STORE.get().capabilities);
    const initialXP=STORE.get().xp;
    await lesson('DS1','quickcheck');
    assert(!STORE.get().revisits.DS1,'opening check must not stamp revisit');
    $('.qcheck .qopt[data-ok="false"]').click();
    assert($('.qcheck__fb').textContent.includes('Not quite'),'wrong answer explains');
    assert(!STORE.get().revisits.DS1,'one question must not stamp revisit');
    assert(!$('.qcheck__retry').hidden,'retry visible');
    $('.qcheck__retry').click();
    assert($$('.qcheck:first-child .qopt').every(b=>!b.disabled),'retry unlocks answers');
    assert(document.activeElement===$('.qcheck .qopt'),'retry keyboard focus');
    $('.qcheck .qopt[data-ok="true"]').click();
    $$('.qcheck').slice(1).forEach(q=>q.querySelector('.qopt').click());
    assert(STORE.get().revisits.DS1,'complete practice stamps revisit');
    const stamp=STORE.get().revisits.DS1;
    $('.qcheck__retry').click();$('.qcheck .qopt').click();
    assert(STORE.get().revisits.DS1===stamp,'retry does not double record');
    assert($('#qcheckStatus').textContent.includes('complete'),'completion status');
    assert(JSON.stringify(STORE.get().capabilities)===initial,'practice does not grant mastery');
    assert(STORE.get().xp===initialXP,'retry does not farm XP');
    await lesson('DS1','demonstrate');
    assert($$('.demo-step:not([hidden])').length===1,'one initial move');
    await wait(1000);
    assert($$('.demo-step:not([hidden])').length===1,'no autoplay');
    $('[data-action="demo-next"]').click();
    assert($$('.demo-step:not([hidden])').length===2,'one move per click');
    $('[data-action="demo-all"]').click();
    assert($$('.demo-step[hidden]').length===0,'show all');
    assert($('[data-action="demo-next"]').disabled,'finished next disabled');
    await lesson('DS1','guided');
    const draft='SELECT <tag> & "quoted";';
    $('textarea[name="query"]').value=draft;
    $('textarea[name="query"]').dispatchEvent(new Event('input',{bubbles:true}));
    assert(STORE.get().lessonDrafts.DS1.query===draft,'draft saved');
    await lesson('DS1','explain');await lesson('DS1','guided');
    assert($('textarea[name="query"]').value===draft,'draft restored and escaped');
    assert(!$('#app tag'),'draft cannot inject markup');
    const form=$('form[data-form="guided"]');
    form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    assert($('#guidedResult').textContent.includes('has not been graded'),'honest guided feedback');
    assert(!$('#guidedResult').textContent.includes('null'),'no null grade label');
    assert(JSON.stringify(STORE.get().capabilities)===initial,'guided comparison does not grant mastery');
    const download=$('.lesson-materials a');
    assert((await (await fetch(download.href)).text()).includes('CREATE TABLE sales'),'dataset download');
    // Delayed review: first attempt, early support, persistence and honest reflection.
    STORE.update(l => { l.guided.DS1 = new Date(Date.now()-4*86400000).toISOString(); });
    const beforeReview=JSON.stringify({caps:STORE.get().capabilities,xp:STORE.get().xp,evidence:STORE.get().evidence});
    const submit=kind=>$('form[data-form="'+kind+'"]').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    await navigate('#/');
    assert($('.review-summary a'),'review discoverable from progress');
    await navigate('#/review/DS1');
    assert(!STORE.get().reviewDrafts?.DS1,'opening review creates no attempt');
    submit('review-start');
    assert(!$('#app').textContent.includes('Expected: customer_id'),'answer hidden initially');
    $('#review-recall').value='My <first> recall';
    $('#review-application').value='My initial query';
    $('#review-recall').dispatchEvent(new Event('input',{bubbles:true}));
    await navigate('#/review');await navigate('#/review/DS1');
    assert($('#review-recall').value==='My <first> recall','review draft survives navigation');
    $('[data-action="review-help"]').click();
    assert(STORE.get().reviewDrafts.DS1.usedSupport,'support tracked');
    assert($('#review-recall').value==='My <first> recall','support preserves draft');
    submit('review-attempt');
    assert($('#app').textContent.includes('Expected: customer_id'),'comparison shown');
    assert(!$('#review-recall'),'first submitted answer not editable');
    assert(REVIEW.status(STORE.get(),'DS1').due,'comparison alone not completion');
    $('#review-recall-rating').value='partial';$('#review-application-rating').value='again';
    $('#review-takeaway').value='Practise the upper date boundary';
    submit('review-finish');
    const record=STORE.get().learningReviews.DS1[0];
    assert(record.usedSupport&&record.recall==='My <first> recall','original attempt recorded');
    assert(!REVIEW.status(STORE.get(),'DS1').due,'completion reschedules');
    assert(!STORE.get().reviewDrafts.DS1,'completed draft cleared');
    assert(JSON.stringify({caps:STORE.get().capabilities,xp:STORE.get().xp,evidence:STORE.get().evidence})===beforeReview,'review grants no mastery or XP');
    await navigate('#/review/DS1');
    assert($('#app').textContent.includes('Practise the upper date boundary'),'reflection visible');
    let views=0;
    const competencies=[...new Map(CONTENT.allCompetencies().map(c=>[c.id,c])).values()];
    for(const comp of competencies){
      for(const step of CONTENT.lessonSteps(comp.id)){
        await lesson(comp.id,step);
        assert($('#app h1'),comp.id+' '+step+' rendered');
        if(step==='quickcheck')assert($$('.qcheck').length===CONTENT.quickCheck(comp.id).length,comp.id+' questions');
        if(step==='guided')assert($$('form[data-form="guided"] textarea').length===comp.lesson.guided.fields.length,comp.id+' fields');
        views++;
      }
    }
    let challenges=0;
    for(const comp of competencies.filter(c=>/^(COOK|LAN)/.test(c.id))){
      for(const ch of comp.challenges.filter(c=>c.type==='fields')){
        await navigate('#/challenge/'+comp.id+'/'+ch.id);
        assert($$('form textarea').length>=ch.fields.length,ch.id+' form');challenges++;
      }
    }
    await navigate('#/review/DS1');
    return {views,challenges,reviews:'first attempt, hints, drafts, reflection, schedule, mastery unchanged',checks:'retry, revisit, mastery, XP, self-paced reveal, drafts, feedback, dataset'};
  })()`});
  if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
  assert.equal(errors.length,0,JSON.stringify(errors));
  console.log(JSON.stringify(result.result.value));
  await send('Page.reload');
  const persisted=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{
    for(let i=0;i<100;i++){
      if(window.STORE&&document.querySelector('#app h1'))return STORE.get().learningReviews?.DS1?.[0]?.takeaway;
      await new Promise(r=>setTimeout(r,50));
    }
  })()`});
  assert.equal(persisted.result.value,'Practise the upper date boundary');
  for(const width of [390,1280]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});
    const layout=await send('Runtime.evaluate',{returnByValue:true,expression:'({width:innerWidth,content:document.documentElement.scrollWidth})'});
    assert.ok(layout.result.value.content<=layout.result.value.width,JSON.stringify(layout.result.value));
    if(process.env.AIF_SCREENSHOT_DIR){
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
      await writeFile(resolve(process.env.AIF_SCREENSHOT_DIR, 'aif-learning-'+width+'.png'),Buffer.from(shot.data,'base64'));
    }
  }
  console.log('Mobile and desktop: no horizontal overflow.');
  await send('Page.close');
} finally {
  socket?.close();server.closeAllConnections();await new Promise(r=>server.close(r));
}
