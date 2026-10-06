const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.addInitScript(()=>{window.feedbackMedia=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){feedbackMedia.push(this);if(this.src.includes('/lesson2/')&&this!==window.testVoice)this.playbackRate=4;return play.call(this);};});
 await page.goto(process.env.FEEDBACK_TEST_BASE||'http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>!!window.LearningFeedback&&!!window.LearningApp);
 await page.locator('[data-start-adventure]').click();await page.waitForSelector('#gameScreen.active');
 await page.evaluate(()=>LearningFeedback.play('correct',document.querySelector('.shell-game-nav')));await page.waitForTimeout(120);
 assert(await page.locator('.learning-fx-particle').count()>0);assert.equal(await page.locator('.learning-fx-layer').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
 assert(await page.evaluate(()=>feedbackMedia.some(a=>a.src.endsWith('/feedback/confirmation_002.wav'))));
 await page.screenshot({path:'tests/feedback-correct.png'});await page.waitForTimeout(1200);assert.equal(await page.locator('.learning-fx-particle').count(),0);
 // Voice owns audio: a real prerecorded voice cancels the currently playing effect.
 await page.evaluate(async()=>{LearningFeedback.play('badge');window.testVoice=new Audio('assets/unit3/lesson2/audio/questions/whats_this.mp3');await testVoice.play();});
 await page.waitForFunction(()=>testVoice.paused||feedbackMedia.filter(a=>a.learningSfx).every(a=>a.paused||a.ended));
 const before=await page.evaluate(()=>feedbackMedia.length);await page.evaluate(()=>LearningFeedback.play('correct'));assert.equal(await page.evaluate(()=>feedbackMedia.length),before);await page.evaluate(()=>testVoice.pause());
 // Real Lesson 2 answer path still waits for audio ended, then resolves and offers Next.
 await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=listen-decide'));
 await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='listening',{timeout:15000});
 const yes=await page.evaluate(()=>Unit3Lesson2.current().round.yes);
 await page.locator(`[data-choice="${!yes}"]`).click();await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='listening',null,{timeout:15000});
 assert.equal(await page.evaluate(()=>Unit3Lesson2.current().errors),1);
 await page.locator(`[data-choice="${yes}"]`).click();await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='resolved',null,{timeout:15000});
 assert(await page.evaluate(()=>feedbackMedia.some(a=>a.src.endsWith('/feedback/confirmation_002.wav'))));
 assert(await page.locator('#l2Next').isEnabled());
 // Rewards fly into the in-game HUD; a replay doesn't create extra stars.
 await page.evaluate(()=>LearningProgress.completed('3/2/listen-decide',3));await page.waitForSelector('.reward-toast:not([hidden])');
 assert(await page.locator('.learning-fx-reward').count()>0);await page.screenshot({path:'tests/feedback-reward.png'});
 await page.evaluate(()=>{for(let i=0;i<20;i++)LearningFeedback.visual('reward',document.querySelector('#l2Toy'));});assert(await page.locator('.learning-fx-particle').count()<=40);
 await page.locator('.app-game-more>summary').click();await page.locator('[data-shell-action="sound"]').click();
 assert(await page.evaluate(()=>feedbackMedia.filter(a=>a.learningSfx).every(a=>a.paused||a.ended)));
 const muted=await page.evaluate(()=>feedbackMedia.length);await page.evaluate(()=>LearningFeedback.play('complete'));assert.equal(await page.evaluate(()=>feedbackMedia.length),muted);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches&&document.querySelector('.learning-fx-layer').childElementCount===0);await page.evaluate(()=>LearningFeedback.visual('reward'));assert.equal(await page.locator('.learning-fx-particle').count(),0);assert.equal(await page.locator('.learning-fx-halo').count(),1);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.evaluate(()=>LearningApp.go('#/'));await page.waitForSelector('.app-playground');assert.equal(await page.locator('.learning-fx-layer>*').count(),0);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();console.log('PASS feedback: actual CC0 WAV playback, real Lesson 2 wrong/correct/Next, bounded particle cleanup, reward flight, speech priority, mute, reduced motion, mobile and navigation cleanup; no JS/asset errors.');
})().catch(e=>{console.error(e);process.exit(1);});
