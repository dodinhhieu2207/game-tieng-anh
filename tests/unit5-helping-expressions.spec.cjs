const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const origin=process.env.U5_QA_ORIGIN||'http://127.0.0.1:8765',dir=path.resolve('docs/game-plans/unit5-feelings/evidence/helping-expressions-v1'+(origin.startsWith('https:')?'-public':''));
const props={hungry:'sandwich',thirsty:'water',hot:'fan',cold:'blanket'};let entryId=0;const url=profile=>origin+'/index.html?release=helpfaces-v1-'+(++entryId)+'#/unit/5/lesson/1?mode=practice&activity=helping-hands&support='+profile;
const ready=p=>p.waitForFunction(()=>{const g=Unit5Feelings.current();return g?.loaded&&g.mode==='helping'&&g.profile===new URLSearchParams(location.hash.split('?')[1]).get('support')});
const idle=p=>p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing');
const resolved=p=>p.waitForFunction(()=>Unit5Feelings.current().canContinue&&Unit5Feelings.current().phase==='resolved');
const imageSelector='.u5-actor>img:not(.u5-result-medal)';
async function choose(p,value){await p.locator(`[data-u5-pick="${value}"]`).click();await p.locator('[data-u5-actor]').click()}
async function hashCurrent(p){return p.locator(imageSelector).evaluate(async im=>{const bytes=await(await fetch(im.src)).arrayBuffer();return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('')})}
(async()=>{
 fs.mkdirSync(dir,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext({viewport:{width:1366,height:1000},recordVideo:{dir:path.join(dir,'video'),size:{width:1366,height:1000}}});
 await context.addInitScript(()=>{window.motionURLs=new Set();window.helpAwards=[];window.helpSounds=[];document.addEventListener('learning:activity-completed',e=>helpAwards.push(e.detail));const make=URL.createObjectURL.bind(URL),drop=URL.revokeObjectURL.bind(URL);URL.createObjectURL=x=>{const u=make(x);motionURLs.add(u);return u};URL.revokeObjectURL=u=>{motionURLs.delete(u);drop(u)};const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(this.src.includes('/unit5/lesson1/')){const src=this.src;if(src.endsWith('answer-confirm.wav'))window.lastConfirmation=this;helpSounds.push({kind:'play',src,time:performance.now(),confirmationEnded:window.lastConfirmation?.ended});this.addEventListener('ended',e=>helpSounds.push({kind:'ended',src,time:e.timeStamp,observedAt:performance.now()}),{once:true})}return play.apply(this,arguments)}});
 const p=await context.newPage(),errors=[],report={origin,scope:'Authored Helping GIF playback and task rules, not child learning outcomes'};p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(url('practice'));await ready(p);const initial=await p.evaluate(()=>Unit5Feelings.current().order);assert.equal(initial.length,8);assert.equal(new Set(initial.slice(0,4)).size,4);assert.equal(new Set(initial.slice(4)).size,4);assert(initial.every((x,i)=>!i||x!==initial[i-1]));
  const records=[],docks=[];
  for(let i=0;i<8;i++){
   await p.locator('[data-u5-action=cue]').click();await idle(p);const word=await p.evaluate(()=>Unit5Feelings.current().word);docks.push(await p.locator('[data-u5-pick]').evaluateAll(es=>es.map(x=>x.dataset.u5Pick).join(',')));
   if(i<4){
    const wrong=Object.values(props).find(x=>x!==props[word]);const before=await p.evaluate(()=>Unit5Feelings.current().errors);await choose(p,wrong);
    await p.waitForFunction(()=>Unit5Feelings.current().phase==='retrying');const retryHash=await hashCurrent(p);assert.equal(retryHash,crypto.createHash('sha256').update(fs.readFileSync(`assets/unit5/lesson1/actors/${word}/help-v2/retry.gif`)).digest('hex'));
    assert.equal(await p.locator('.u5-result-medal').count(),0);assert.equal(await p.evaluate(()=>Unit5Feelings.current().solved),false);
    await p.locator('[data-u5-actor]').evaluate(e=>e.click());assert.equal(await p.evaluate(()=>Unit5Feelings.current().errors),before+1,'disabled rapid repeat must not add a mistake');
    const a=await p.locator(imageSelector).screenshot();await p.waitForTimeout(290);const b=await p.locator(imageSelector).screenshot();assert(!a.equals(b),'actual head/face GIF frames change');
    await p.screenshot({path:path.join(dir,word+'-retry.png'),fullPage:true});await idle(p);assert((await p.locator(imageSelector).getAttribute('src')).endsWith('idle.webp'));assert.equal(await p.locator('.u5-album figure').count(),i);
    records.push({word,retryHash,actualRetryFramesChange:true,noRetryReward:true,returnsToNeed:true});
   }
   const start=await p.evaluate(()=>performance.now());await choose(p,props[word]);await p.waitForFunction(()=>Unit5Feelings.current().solved&&Unit5Feelings.current().motionWords.has(Unit5Feelings.current().word));
   const positiveHash=await hashCurrent(p);assert.equal(positiveHash,crypto.createHash('sha256').update(fs.readFileSync(`assets/unit5/lesson1/actors/${word}/help-v2/positive.gif`)).digest('hex'));
   if(i<4){
    await p.waitForTimeout(2040);assert.equal(await p.evaluate(()=>Unit5Feelings.current().canContinue),false,'new expression tail must finish before Next');const a=await p.locator(imageSelector).screenshot();await p.waitForTimeout(220);const b=await p.locator(imageSelector).screenshot();assert(!a.equals(b),'authored expression tail must change on screen');
   }
   await resolved(p);assert((await p.locator(imageSelector).getAttribute('src')).endsWith('help-v2/positive-final.webp'));
   if(i<4){await p.screenshot({path:path.join(dir,word+'-happy.png'),fullPage:true});Object.assign(records[i],{positiveHash,authoredExpressionTailChanges:true,holdsHappyPose:true});}
   const sounds=await p.evaluate(t=>helpSounds.filter(x=>x.time>=t),start),cue=sounds.find(x=>x.kind==='play'&&x.src.endsWith('answer-confirm.wav')),voice=sounds.find(x=>x.kind==='play'&&x.src.includes('/sentences/'));assert(cue&&voice&&cue.time<=voice.time&&voice.confirmationEnded===true,'native confirmation media must have ended at Higgs play');
   await p.locator('[data-u5-action=next]').click();
  }
  await p.locator('.u5-finish').waitFor();assert.equal(await p.evaluate(()=>helpAwards.length),1);assert.equal(new Set(docks).size>1,true);report.practice={records,rounds:8,noAdjacentSameNeed:true,twoBalancedPasses:true,docksShuffle:true,nativeSfxBeforeHiggs:true};
  // Replays differ while all four needs remain in each balanced pass.
  const orders=[initial.join(',')];for(let n=0;n<8;n++){
   if(await p.locator('[data-u5-action=again]').count())await p.locator('[data-u5-action=again]').click();else{await p.locator('.u5-learning-bar').evaluate(e=>e.open=true);await p.locator('[data-u5-action=profile-learn]').click();await ready(p);await p.locator('.u5-learning-bar').evaluate(e=>e.open=true);await p.locator('[data-u5-action=profile-practice]').click();}
   await ready(p);const order=await p.evaluate(()=>Unit5Feelings.current().order);assert.notEqual(order.join(','),orders.at(-1));assert(order.every((x,i)=>!i||x!==order[i-1]));orders.push(order.join(','));
  }
  report.practice.replayOrders=orders;console.log('PASS eight real Helping rounds, retry/positive GIFs, held expressions and shuffle');
  // Learn together: wrong reaction must finish before supported model replay, without retrieval credit.
  await p.goto(url('learn'));await ready(p);const learnOrder=await p.evaluate(()=>Unit5Feelings.current().learning.pairs);let turns=0;
  while(!await p.locator('.u5-finish').count()){
   if(await p.evaluate(()=>Unit5Feelings.current().isTeaching)){await p.locator('[data-u5-action=teach-model]').click();await p.waitForFunction(()=>Unit5Feelings.current().modelHeard);await p.locator('[data-u5-action=try-now]').click()}
   await p.locator('[data-u5-action=cue]').click();await idle(p);const word=await p.evaluate(()=>Unit5Feelings.current().word);
   if(turns===0){
    const other=await p.locator('[data-u5-pick]').evaluateAll((es,right)=>es.find(e=>e.dataset.u5Pick!==right).dataset.u5Pick,props[word]);
    const time=await p.evaluate(()=>performance.now());await choose(p,other);await p.waitForFunction(()=>Unit5Feelings.current().phase==='retrying');await p.waitForTimeout(250);assert.equal(await p.evaluate(t=>helpSounds.some(e=>e.time>t&&e.src.includes('/words/')),time),false);assert.equal(await p.locator('.u5-result-medal').count(),0);
    await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing'&&Unit5Feelings.current().modelHeard);assert.equal(await p.evaluate(w=>Unit5Feelings.current().learning.records[w].independent,word),0);
   }
   await choose(p,props[word]);await resolved(p);turns++;assert(turns<=16);await p.locator('[data-u5-action=next]').click();
  }
  report.learn={turns,pairs:learnOrder,wrongBeforeTeaching:true,noIndependentCreditForSupportedAnswer:true};
  // Reduced motion substitutes authored stills, including gentle puzzled feedback.
  await p.emulateMedia({reducedMotion:'reduce'});await p.goto(url('practice'));await ready(p);await p.locator('[data-u5-action=cue]').click();await idle(p);const reducedWord=await p.evaluate(()=>Unit5Feelings.current().word);await choose(p,Object.values(props).find(x=>x!==props[reducedWord]));await p.waitForFunction(()=>Unit5Feelings.current().phase==='retrying');assert((await p.locator(imageSelector).getAttribute('src')).endsWith('retry-still.webp'));await idle(p);await choose(p,props[reducedWord]);await resolved(p);assert((await p.locator(imageSelector).getAttribute('src')).endsWith('positive-final.webp'));report.reducedMotion={puzzledStill:true,happyStill:true};await p.emulateMedia({reducedMotion:'no-preference'});
  // Route exit during a retry never starts a late teaching model or leaks owned URLs.
  await p.goto(url('learn')+'&leave=1');await ready(p);await p.locator('[data-u5-action=teach-model]').click();await p.waitForFunction(()=>Unit5Feelings.current().modelHeard);await p.locator('[data-u5-action=try-now]').click();await p.locator('[data-u5-action=cue]').click();await idle(p);const leavingWord=await p.evaluate(()=>Unit5Feelings.current().word),wrongProp=await p.locator('[data-u5-pick]').evaluateAll((es,right)=>es.find(e=>e.dataset.u5Pick!==right).dataset.u5Pick,props[leavingWord]);await choose(p,wrongProp);await p.waitForFunction(()=>Unit5Feelings.current().phase==='retrying');const mutedAt=await p.evaluate(()=>{const t=performance.now();document.querySelector('[data-shell-action=sound]').click();return t});await p.waitForTimeout(1250);assert.equal(await p.evaluate(()=>Unit5Feelings.current().motionWords.size),0);assert.equal(await p.evaluate(t=>helpSounds.filter(e=>e.time>t&&e.kind==='play'&&(/\/(sentences|words)\//.test(e.src))).length,mutedAt),0);await p.evaluate(()=>document.querySelector('[data-shell-action=sound]').click());await p.locator('[data-u5-action=cue]').click();await idle(p);await choose(p,wrongProp);await p.waitForFunction(()=>Unit5Feelings.current().phase==='retrying');const leaveAt=await p.evaluate(()=>{const t=performance.now();LearningApp.go('#/unit/5/lesson/1?mode=practice');return t});await p.waitForSelector('[data-activity=helping-hands]');await p.waitForTimeout(1300);assert.equal(await p.evaluate(()=>motionURLs.size),0);assert.equal(await p.evaluate(t=>helpSounds.filter(e=>e.time>t&&e.kind==='play'&&(/\/(sentences|words)\//.test(e.src))).length,leaveAt),0);report.exit={profile:'learn',ownedURLs:0,noLateVoice:true,muteCancelsRetryAndTeaching:true};
  // Both new expression endpoints decode/load at all required sizes; scene stays registered.
  const layouts=[];for(const width of [320,390,768,1024,1366]){await p.setViewportSize({width,height:1000});await p.goto(url('practice')+'&width='+width);await ready(p);const m=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.querySelectorAll('.u5-game img')].filter(x=>x.complete&&!x.naturalWidth).length}));assert(m.scroll<=width+1);assert.equal(m.images,0);layouts.push(m);await p.screenshot({path:path.join(dir,'helping-'+width+'.png'),fullPage:true})}
  report.layouts=layouts;report.errors=errors;assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS Helping expression learning/retry gates, reduced stills, exit and five widths');
 }catch(e){await p.screenshot({path:path.join(dir,'failure.png'),fullPage:true}).catch(()=>{});throw e}finally{await context.close();await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
