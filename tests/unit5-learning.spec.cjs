const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const origin=process.env.U5_QA_ORIGIN||'http://127.0.0.1:8765';
const corsOrigin=new URL(origin).origin;
const dir=path.resolve(process.env.U5_LEARN_QA_DIR||'docs/game-plans/unit5-feelings/evidence/learning-v1'+(origin.startsWith('https:')?'-public':''));
const routes=['feelings-house','feelings-camera','helping-hands','feelings-workshop','little-reporter'];
const href=r=>origin+'/index.html?release=learning-v1#/unit/5/lesson/1?mode=practice&activity='+r;
const ready=p=>p.waitForFunction(()=>{const g=window.Unit5Feelings?.current();return g?.loaded&&g.def.route===new URLSearchParams(location.hash.split('?')[1]).get('activity')});
const settled=p=>p.waitForFunction(()=>Unit5Feelings.current().canContinue&&Unit5Feelings.current().phase==='resolved');
const snapshot=p=>p.evaluate(()=>{const g=Unit5Feelings.current();return {word:g.word,mode:g.mode,teaching:g.isTeaching,pair:g.learning?.pair,ready:g.learning?.ready,history:g.learning?.history,records:g.learning?.records,errors:g.errors}});
async function introduced(p){
 if(await p.evaluate(()=>Unit5Feelings.current().isTeaching)){
  assert.equal(await p.locator('[data-u5-actor]:not(:disabled)').count(),0);
  assert.equal(await p.locator('[data-u5-action=try-now]').isVisible(),false);
  await p.locator('[data-u5-action=teach-model]').click();await p.waitForFunction(()=>Unit5Feelings.current().modelHeard&&!Unit5Feelings.current().audio);
  await p.locator('[data-u5-action=try-now]').click();
 }
}
async function touchDrag(p,from,to){
 await from.scrollIntoViewIfNeeded();await to.scrollIntoViewIfNeeded();
 const a=await from.boundingBox(),b=await to.boundingBox(),s=await p.context().newCDPSession(p);
 const start={x:a.x+a.width/2,y:a.y+a.height/2},end={x:b.x+b.width/2,y:b.y+b.height/2};
 await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
 for(let i=1;i<=12;i++)await s.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+(end.x-start.x)*i/12,y:start.y+(end.y-start.y)*i/12}]});
 await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await s.detach();
}
async function answer(p,{wrong=false,touch=false,keyboard=false}={}){
 await introduced(p);const g=await snapshot(p);
 if(g.mode!=='workshop'){await p.locator('[data-u5-action=cue]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing')}
 if(wrong){
  const other=await p.evaluate(()=>Unit5Feelings.current().options.find(w=>w!==Unit5Feelings.current().word));
  const before=await p.locator('.u5-album figure').count();await p.locator(`[data-u5-actor="${other}"]`).click();
  assert.equal(await p.locator('.u5-result-medal').count(),0);assert.equal(await p.locator('.u5-album figure').count(),before);
  await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing'&&Unit5Feelings.current().modelHeard);
  assert.equal(await p.evaluate(()=>Unit5Feelings.current().roundHinted),true);
 }
 if(g.mode==='camera')await p.locator(`[data-u5-actor="${g.word}"]`).click();
 else{
  const prop=g.mode==='helping'?{hungry:'sandwich',thirsty:'water',hot:'fan',cold:'blanket'}[g.word]:g.word;
  const from=p.locator(`[data-u5-pick="${prop}"]`),to=p.locator(g.mode==='helping'?'[data-u5-actor]':'.u5-receiver');
  if(touch)await touchDrag(p,from,to);
  else if(keyboard){await from.focus();await p.keyboard.press('Enter');await to.focus();await p.keyboard.press('Enter')}
  else{await from.click();await to.click()}
 }
 await settled(p);return snapshot(p);
}
(async()=>{
 fs.mkdirSync(dir,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
 const ctx=await browser.newContext({viewport:{width:1366,height:1000},permissions:['microphone'],hasTouch:true,recordVideo:{dir:path.join(dir,'video'),size:{width:1366,height:1000}}});
 await ctx.addInitScript(()=>{
  window.learningAwards=[];document.addEventListener('learning:activity-completed',e=>learningAwards.push(e.detail));
  window.modelEvents=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const src=this.src;if(src.includes('/unit5/lesson1/')){modelEvents.push({kind:'play',src,time:performance.now()});this.addEventListener('ended',()=>modelEvents.push({kind:'ended',src,time:performance.now()}),{once:true})}return play.apply(this,arguments)};
  window.ownedURLs=new Set();const make=URL.createObjectURL.bind(URL),drop=URL.revokeObjectURL.bind(URL);URL.createObjectURL=b=>{const u=make(b);ownedURLs.add(u);return u};URL.revokeObjectURL=u=>{ownedURLs.delete(u);drop(u)};
 });
 const p=await ctx.newPage(),errors=[],report={origin,scope:'Native first-learning gameplay; one simulated UNCLEAR reply only, no student accuracy claim'};
 p.on('pageerror',e=>errors.push(e.message));
 try{
  // First encounter: missing model audio must not mark exposure or unlock Try it.
  await p.goto(href('feelings-camera'));await ready(p);assert(await p.evaluate(()=>Unit5Feelings.current().learn));
  await p.route('**/assets/unit5/lesson1/audio/sentences/*.mp3',r=>r.fulfill({status:404,body:'QA missing model'}));
  await p.locator('[data-u5-action=teach-model]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='ready'&&!Unit5Feelings.current().audio);
  assert.equal(await p.evaluate(()=>Unit5Feelings.current().learning.records.happy.exposed),false);assert.equal(await p.locator('[data-u5-action=try-now]').isVisible(),false);
  await p.unroute('**/assets/unit5/lesson1/audio/sentences/*.mp3');await introduced(p);
  const initial=await p.evaluate(()=>modelEvents);const wordEnd=initial.find(e=>e.kind==='ended'&&e.src.endsWith('/words/happy.mp3'));
  const sentencePlay=initial.find(e=>e.kind==='play'&&e.src.endsWith('/sentences/he-happy.mp3'));assert(wordEnd&&sentencePlay&&wordEnd.time<=sentencePlay.time);
  // Four mistakes must cause teaching replays, no fake retrievals or lost completion stars.
  for(let i=0;i<4;i++){
   await p.locator('[data-u5-action=cue]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing');
   await p.locator('[data-u5-actor=sad]').click();assert.equal(await p.locator('.u5-result-medal').count(),0);
   await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing'&&Unit5Feelings.current().modelHeard);assert.equal(await p.evaluate(()=>Unit5Feelings.current().learning.records.happy.independent),0);
  }
  let first=await answer(p);assert(first.history[0].assisted);assert.equal(first.pair,0);
  await p.screenshot({path:path.join(dir,'camera-supported.png'),fullPage:true});
  await p.locator('[data-u5-action=next]').click();let turns=1,repeated=false;
  while(!await p.locator('.u5-finish').count()){
   assert(turns++<40,'finite clean path');const s=await answer(p);
   if(s.ready&&!repeated){
    assert.equal(s.pair,0);assert(s.records.happy.independent>=2&&s.records.sad.independent>=2);
    await p.screenshot({path:path.join(dir,'pair-choice.png'),fullPage:true});await p.locator('[data-u5-action=repeat-pair]').click();
    assert.equal((await snapshot(p)).pair,0);await answer(p);repeated=true;
   }
   await p.locator('[data-u5-action=next]').click();
  }
  assert(repeated);assert.equal(await p.evaluate(()=>learningAwards.length),1);assert.equal(await p.evaluate(()=>learningAwards[0].stars),3);
  assert((await p.locator('.u5-finish').innerText()).includes('with help'));report.camera={turns,wrongTeachingReplays:4,noStarPenalty:true,teacherRepeatedPair:true,modelAudioGate:true};console.log('PASS Camera pair learning and supported/independent distinction');
  // Helping: actual touch delivery with only the active pair, all pairs complete.
  for(const route of ['helping-hands','feelings-workshop']){
   await p.goto(href(route));await ready(p);const beforeAwards=await p.evaluate(()=>learningAwards.length);let n=0;
   while(!await p.locator('.u5-finish').count()){
    assert(n<26);await introduced(p);assert.equal(await p.locator('[data-u5-pick]').count(),2);
    await answer(p,{touch:route==='helping-hands'&&n===0,keyboard:route==='feelings-workshop'&&n===0});n++;
    await p.locator('[data-u5-action=next]').click();
   }
   assert.equal(await p.evaluate(()=>learningAwards.length),beforeAwards+1);report[route]={turns:n,twoChoices:true,completed:true,nativeTouch:route==='helping-hands',keyboardPlacement:route==='feelings-workshop'};console.log('PASS '+route+' full supported path');
  }
  // House: only two pictures at a time, next pair follows actual model endings.
  await p.goto(href('feelings-house'));await ready(p);const beforeHouse=await p.evaluate(()=>learningAwards.length);
  for(let pair=0;pair<3;pair++){
   assert.equal(await p.locator('[data-u5-visit]').count(),2);
   const words=await p.locator('[data-u5-visit]').evaluateAll(es=>es.map(e=>e.dataset.u5Visit));
   for(const w of words){await p.locator(`[data-u5-visit="${w}"]`).click();await p.waitForFunction(w=>Unit5Feelings.current().visited.has(w)&&!Unit5Feelings.current().audio,w)}
   if(pair<2){await p.locator('[data-u5-action=house-pair]').click();await p.waitForFunction(()=>!Unit5Feelings.current().audio)}
  }
  await p.locator('[data-u5-action=next]').click();await p.locator('.u5-finish').waitFor();assert.equal(await p.evaluate(()=>learningAwards.length),beforeHouse+1);report.house={twoAtATime:true,allSixHeard:true};
  // Reporter: actual existing adapter may be UNCLEAR; listening can continue, without an AI award.
  await p.goto(href('little-reporter'));await ready(p);const beforeReporter=await p.evaluate(()=>learningAwards.length);let simulatedRequests=0;
  await p.route('**/api/speaking-check',r=>{if(r.request().method()==='OPTIONS')return r.fulfill({status:204,headers:{'Access-Control-Allow-Origin':corsOrigin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});simulatedRequests++;return r.fulfill({status:200,headers:{'Access-Control-Allow-Origin':corsOrigin,'Content-Type':'application/json'},body:JSON.stringify({result:'UNCLEAR',transcript:'',reason:'recognition-uncertain'})})});
  for(let i=0;i<6;i++){
   assert(await p.locator('.u5-sentence').isVisible());assert.equal(await p.locator('[data-u5-action=next]').isVisible(),false);
   await p.locator('[data-u5-action=sentence]').click();await p.waitForFunction(()=>Unit5Feelings.current().modelHeard&&Unit5Feelings.current().canContinue);
   if(i===0){await p.locator('[data-u5-action=speak]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='recording');await p.waitForTimeout(250);await p.locator('[data-u5-action=done]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='ready');assert.equal(await p.locator('.u5-result-medal').count(),0);assert.equal(await p.evaluate(()=>Unit5Feelings.current().errors),0);}
   await p.locator('[data-u5-action=next]').click();
  }
  await p.locator('.u5-finish').waitFor();assert.equal(simulatedRequests,1);assert.equal(await p.evaluate(()=>learningAwards.length),beforeReporter);assert((await p.locator('.u5-finish').innerText()).includes('0 complete sentences recognized. 6 pictures practised by listening.'));report.reporter={modelsRemainVisible:6,modelOnlyContinues:true,unclearNotScored:true,recognitionRepliesSimulated:1,noAICompletionAward:true};
  // Partial stop is a pause, not completion; switching modes/reloading is explicit.
  await p.goto(href('feelings-workshop'));await ready(p);const beforePause=await p.evaluate(()=>learningAwards.length);await p.locator('.u5-learning-bar').evaluate(e=>e.open=true);await p.locator('[data-u5-action=pause-learning]').click();assert.equal(await p.evaluate(()=>learningAwards.length),beforePause);assert((await p.locator('.u5-finish').innerText()).includes('pause'));
  await p.locator('[data-u5-action=again]').click();await ready(p);await p.locator('.u5-learning-bar').evaluate(e=>e.open=true);await p.locator('[data-u5-action=profile-practice]').click();await p.waitForFunction(()=>Unit5Feelings.current()?.loaded&&!Unit5Feelings.current().learn);assert(p.url().includes('support=practice'));assert.equal(await p.locator('[data-u5-action=teach-model]').count(),0);await p.reload();await ready(p);assert.equal(await p.evaluate(()=>Unit5Feelings.current().learn),false);report.profileAndPause=true;
  // Interrupted models must not mark exposure or leave audio/blob work behind.
  await p.goto(href('feelings-camera'));await ready(p);await p.locator('[data-u5-action=teach-model]').click();await p.waitForFunction(()=>!!Unit5Feelings.current().audio);await p.evaluate(()=>document.querySelector('[data-shell-action=sound]').click());assert.equal(await p.evaluate(()=>Unit5Feelings.current().learning.records.happy.exposed),false);assert.equal(await p.locator('[data-u5-action=try-now]').isVisible(),false);await p.evaluate(()=>document.querySelector('[data-shell-action=sound]').click());
  await p.locator('[data-u5-action=teach-model]').click();await p.waitForFunction(()=>!!Unit5Feelings.current().audio);await p.evaluate(()=>LearningApp.go('#/unit/5/lesson/1?mode=practice'));await p.waitForSelector('[data-activity=feelings-house]');await p.waitForTimeout(250);assert.equal(await p.evaluate(()=>ownedURLs.size),0);report.muteAndMidModelLeave=true;
  // New teaching screens and expanded teacher settings at every required width.
  const layouts=[];
  for(const width of [320,390,768,1024,1366])for(const route of routes){
   await p.setViewportSize({width,height:1000});await p.goto(href(route));await ready(p);await p.locator('.u5-learning-bar').evaluate(e=>e.open=true);
   const m=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,badImages:[...document.querySelectorAll('.u5-game img[src]')].filter(im=>im.complete&&!im.naturalWidth).length,small:[...document.querySelectorAll('.u5-game button')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height<47).map(e=>e.textContent)}));assert(m.scroll<=width+1,JSON.stringify(m));assert.equal(m.badImages,0);assert.deepEqual(m.small,[]);layouts.push({route,...m});await p.screenshot({path:path.join(dir,route+'-'+width+'.png'),fullPage:true});
  }
  await p.emulateMedia({reducedMotion:'reduce'});await p.goto(href('feelings-camera'));await ready(p);await p.locator('[data-u5-action=teach-model]').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>Unit5Feelings.current().modelHeard);assert((await p.locator('.u5-actor>img').getAttribute('src')).endsWith('idle.webp'));report.reducedMotionAndKeyboardModel=true;
  report.layouts=layouts;report.errors=errors;assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS first learning, all pairs, optional speaking, pause, profiles, cancellation and 25 layouts');
 }catch(e){await p.screenshot({path:path.join(dir,'failure.png'),fullPage:true}).catch(()=>{});throw e}finally{await ctx.close();await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
