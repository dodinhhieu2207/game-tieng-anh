const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const origin=process.env.U5_QA_ORIGIN||'http://127.0.0.1:8765';
const dir=path.resolve('docs/game-plans/unit5-feelings/evidence/feedback-v1'+(origin.startsWith('https:')?'-public':''));
const url=origin+'/index.html?release=typefx-feedback#/unit/5/lesson/1?mode=practice&support=practice&activity=feelings-camera';
(async()=>{
 fs.mkdirSync(dir,{recursive:true});const b=await chromium.launch({channel:'msedge',headless:true});
 const context=await b.newContext({viewport:{width:1366,height:1000}});
 await context.addInitScript(()=>{
  window.soundEvents=[];window.feedbackURLs=new Set();const play=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){const src=this.currentSrc||this.src;if(src.includes('/unit5/lesson1/')){soundEvents.push({kind:'play',src,time:performance.now()});this.addEventListener('ended',()=>soundEvents.push({kind:'ended',src,time:performance.now()}),{capture:true,once:true});}return play.apply(this,arguments)};
  const make=URL.createObjectURL.bind(URL),drop=URL.revokeObjectURL.bind(URL);URL.createObjectURL=x=>{const u=make(x);feedbackURLs.add(u);return u};URL.revokeObjectURL=u=>{feedbackURLs.delete(u);drop(u)};
 });
 const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 try{
 await p.goto(url);await p.waitForFunction(()=>window.Unit5Feelings?.current()?.loaded);
 await p.locator('[data-u5-action=cue]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing');
 const word=await p.evaluate(()=>Unit5Feelings.current().word),wrong=await p.evaluate(()=>Unit5Feelings.current().options.find(x=>x!==Unit5Feelings.current().word));
 await p.locator(`[data-u5-actor="${wrong}"]`).click();assert.equal(await p.locator('.u5-result-medal').count(),0);
 const start=await p.evaluate(()=>performance.now());await p.locator(`[data-u5-actor="${word}"]`).click();await p.locator('.u5-result-medal').waitFor();
 const a=await p.locator('.u5-result-medal').screenshot();await p.waitForTimeout(300);const c=await p.locator('.u5-result-medal').screenshot();assert(!a.equals(c),'real glint frames must differ');
 await p.screenshot({path:path.join(dir,'camera-confirming.png'),fullPage:true});
 await p.waitForFunction(()=>Unit5Feelings.current().canContinue);
 await p.waitForFunction(()=>soundEvents.some(e=>e.kind==='ended'&&e.src.endsWith('photo-collected.wav')));
 const log=await p.evaluate(t=>soundEvents.filter(e=>e.time>=t),start);
 const cueEnd=log.find(e=>e.kind==='ended'&&e.src.endsWith('answer-confirm.wav'));
 const speechStart=log.find(e=>e.kind==='play'&&e.src.includes('/sentences/'));
 const speechEnd=log.find(e=>e.kind==='ended'&&e.src.includes('/sentences/'));
 const collected=log.find(e=>e.kind==='play'&&e.src.endsWith('photo-collected.wav'));
 assert(cueEnd&&speechStart&&speechEnd&&collected);assert(cueEnd.time<=speechStart.time);assert(speechEnd.time<=collected.time);
 assert.equal(await p.locator('.u5-album figure').count(),1);assert((await p.locator('.u5-result-medal').getAttribute('src')).endsWith('success.webp'));
 await p.screenshot({path:path.join(dir,'camera-collected.png'),fullPage:true});
 await p.setViewportSize({width:390,height:1000});await p.locator('.u5-result-medal').evaluate(im=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const medal=await p.locator('.u5-result-medal').boundingBox(),stage=await p.locator('.u5-stage').boundingBox();assert(medal.x>=stage.x&&medal.x+medal.width<=stage.x+stage.width+1);await p.screenshot({path:path.join(dir,'camera-resized.png'),fullPage:true});
 // Mid-cue route exit must release the new GIF and prevent a late model/success callback.
 await p.locator('[data-u5-action=next]').click();await p.locator('[data-u5-action=cue]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing');
 const second=await p.evaluate(()=>Unit5Feelings.current().word);await p.locator(`[data-u5-actor="${second}"]`).click();
 await p.waitForFunction(()=>Unit5Feelings.current().sfx?.src.endsWith('answer-confirm.wav'));
 const leaveAt=await p.evaluate(()=>{const t=performance.now();LearningApp.go('#/unit/5/lesson/1?mode=practice');return t});await p.waitForSelector('[data-activity=feelings-camera]');
 await p.waitForTimeout(700);assert.equal(await p.evaluate(()=>feedbackURLs.size),0);
 assert.equal(await p.evaluate(t=>soundEvents.filter(e=>e.kind==='play'&&e.time>t&&e.src.includes('/sentences/')).length,leaveAt),0);
 await p.emulateMedia({reducedMotion:'reduce'});await p.goto(url+'&reduced=1');await p.waitForFunction(()=>Unit5Feelings.current()?.loaded);
 await p.locator('[data-u5-action=cue]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing');const reducedWord=await p.evaluate(()=>Unit5Feelings.current().word);await p.locator(`[data-u5-actor="${reducedWord}"]`).click();await p.waitForFunction(()=>Unit5Feelings.current().canContinue);
 assert((await p.locator('.u5-result-medal').getAttribute('src')).endsWith('.webp'));
 assert.equal(await p.evaluate(()=>Unit5Feelings.current().scene.scene.children.list.length),0);
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify({origin,word,authoredGlintFramesDiffer:true,wrongGetsNoMedal:true,nativeSoundSequence:log,cueEndsBeforeHiggs:true,collectionAfterHiggs:true,onePhotoCollected:true,midCueExitStopsLateVoice:true,blobURLsAfterLeave:0,reducedMotionStillOnly:true,errors},null,2));
 console.log('PASS authored glint, wrong gating, native SFX-ended/Higgs/collection sequence, cancellation and reduced motion');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
