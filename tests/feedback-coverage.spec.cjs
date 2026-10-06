const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.addInitScript(()=>{window.arrivals=[];window.audioHistory=[];document.addEventListener('learning:presentation',e=>arrivals.push(e.detail));const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(!this.learningSfx)this.playbackRate=6;audioHistory.push(this);return play.call(this);};});
 await page.goto(process.env.FEEDBACK_TEST_BASE||'http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>!!window.LearningApp);
 const keys=await page.evaluate(()=>Object.keys(games));
 for(const game of keys){await page.evaluate(k=>openGame(k),game);await page.waitForFunction(k=>arrivals.some(a=>a.game===k&&a.kind==='scene'),game);assert(await page.evaluate(k=>arrivals.some(a=>a.game===k&&a.kind==='scene'),game),game+' missing real arrival event');}
 console.log('PASS scene coverage: '+keys.length+' / '+keys.length+' existing games have an actual scene entrance (Unit 2, Unit 3 Lessons 1–2, Letter Land).');
 // Real pointer drag in Match the Answer: target guidance, snapped slot, next round cards.
 await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=match-answer'));await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='listening');
 const yes=await page.evaluate(()=>Unit3Lesson2.current().round.yes),source=page.locator(`[data-match="${yes}"]`),target=page.locator('[data-drop-answer]');
 const a=await source.boundingBox(),b=await target.boundingBox();await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();assert(await page.locator('#gameStage').evaluate(e=>e.classList.contains('learning-drag-active')));await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:10});await page.mouse.up();
 await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='resolved');assert(await target.evaluate(e=>e.classList.contains('l2-snapped')));assert.equal(await page.locator('#gameStage.learning-drag-active').count(),0);
 const before=await page.evaluate(()=>arrivals.filter(a=>a.kind==='cards').length);await page.locator('#l2Next').click();await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='listening');assert(await page.evaluate(n=>arrivals.filter(a=>a.kind==='cards').length>n,before));
 await page.screenshot({path:'tests/feedback-match-answer.png'});
 // The Letter Land engine owns correctness: perform an actual accepted letter drop.
 await page.evaluate(()=>openGame('letterfly'));await page.waitForSelector('.lf-slot');await page.evaluate(()=>{const g=games.letterfly,slot=document.querySelector('.lf-slot'),tile=[...document.querySelectorAll('.lf-tile')].find(t=>t.dataset.letter===slot.dataset.letter);g.handleCorrectDrop(tile,slot);});
 await page.waitForSelector('.lf-slot.filled');assert(await page.evaluate(()=>audioHistory.some(a=>a.src.endsWith('/feedback/confirmation_002.wav'))));
 await page.evaluate(()=>openGame('eggcount'));await page.waitForSelector('[data-count-answer]');const number=await page.evaluate(()=>games.eggcount.target);await page.locator(`[data-count-answer="${number}"]`).click();assert(await page.locator(`[data-count-answer="${number}"]`).evaluate(e=>e.classList.contains('correct')));
 // Ff drop uses the existing acceptance rules and receives local feedback.
 await page.evaluate(()=>openGame('ffsort'));await page.waitForSelector('[data-ff-drop]');await page.evaluate(()=>{const g=games.ffsort,item=document.querySelector('[data-ff-drag="F"]'),zone=[...document.querySelectorAll('[data-ff-drop]')].find(z=>z.dataset.accept===item.dataset.ffDrag);g.handleDrop(item,zone);});
 assert(await page.evaluate(()=>games.ffsort.done>0));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();console.log('PASS real Match the Answer drag/round appearance, accepted Letter Land drop, Unit 2 number answer and Ff drop; no engine, JS or asset errors.');
})().catch(e=>{console.error(e);process.exit(1);});
