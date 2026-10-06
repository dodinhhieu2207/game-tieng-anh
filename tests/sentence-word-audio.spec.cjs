const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.addInitScript(()=>{window.wordEvents=[];window.audioEvents=[];document.addEventListener('learning:word-audio',e=>wordEvents.push(e.detail));const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=4;audioEvents.push({kind:'start',src:this.src,time:performance.now()});this.addEventListener('ended',()=>audioEvents.push({kind:'end',src:this.src,time:performance.now()}),{once:true});return play.call(this);};const speak=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{u.rate=3;speak(u);};});
 await page.goto(process.env.SENTENCE_TEST_BASE||'http://127.0.0.1:8765/index.html');
 await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=build-sentence'));
 await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='listening');
 assert.equal(await page.locator('[data-slot]').count(),4);assert.equal(await page.locator('[data-tile]').filter({hasText:/^\?$/}).count(),0);
 // A held tile is read once, even when its click follows more than 180 ms later.
 const first=page.locator('[data-tile="0"]'),box=await first.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(230);await page.mouse.up();assert.equal(await page.evaluate(()=>wordEvents.filter(e=>e.text==='is').length),1);
 for(let i=1;i<4;i++)await page.locator(`[data-tile="${i}"]`).click();
 await page.waitForFunction(()=>Unit3Lesson2.current()?.phase==='resolved');
 assert.deepEqual(await page.evaluate(()=>wordEvents.map(e=>e.text).slice(0,3)),['is','it','a']);
 assert(await page.evaluate(()=>{const events=audioEvents,wordEnd=events.findLast(e=>e.kind==='end'&&/assets\/unit3\/audio\/(plane|puppet|robot|balloon|teddy)\.mp3/.test(e.src));const question=events.findLast(e=>e.kind==='start'&&/questions\/is_it_a_/.test(e.src));return wordEnd&&question&&wordEnd.time<=question.time;}),'Sentence must wait for the last word ended event');
 // Muted explicit word requests stay silent.
 await page.locator('.app-game-more>summary').click();await page.locator('[data-shell-action="sound"]').click();const n=await page.evaluate(()=>wordEvents.length);await page.evaluate(()=>SentenceWordAudio.play('Is',document.querySelector('#gameStage')));assert.equal(await page.evaluate(()=>wordEvents.length),n);
 await page.locator('.app-game-more>summary').click();await page.locator('[data-shell-action="sound"]').click();
 await page.evaluate(()=>LearningApp.go('#/unit/2/lesson/2?mode=practice&activity=sentence'));await page.waitForFunction(()=>!games.sentence.locked);
 assert.equal(await page.locator('[data-word-slot]').count(),5);assert.equal(await page.locator('[data-word-id="0"] span').textContent(),"What's");
 // Real pointer drag puts one word in a slot and reads only that word.
 const tile=await page.locator('[data-word-id="0"]').boundingBox(),slot=await page.locator('[data-word-slot="0"]').boundingBox();const before=await page.evaluate(()=>wordEvents.length);
 await page.mouse.move(tile.x+tile.width/2,tile.y+tile.height/2);await page.mouse.down();await page.mouse.move(slot.x+slot.width/2,slot.y+slot.height/2,{steps:12});await page.mouse.up();assert.equal(await page.evaluate(()=>games.sentence.step),1);assert.equal(await page.evaluate(n=>wordEvents[n].text,before),"what's");
 for(let i=1;i<5;i++){await page.locator(`[data-word-id="${i}"]`).focus();await page.keyboard.press('Enter');}
 await page.waitForFunction(()=>document.querySelector('#sentenceStatus')?.textContent==='Great job! Tap Next.');assert.equal(await page.evaluate(()=>games.sentence.step),5);
 assert(await page.evaluate(()=>LearningProgress.get('2/2/sentence').completed));assert(await page.locator('#sentenceNext').isEnabled());
 await page.locator('#sentenceNext').click();await page.waitForFunction(()=>games.sentence.step===0);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();console.log('PASS word audio: Unit 3 held tile once, exact single words, punctuation attached, completion waits for word end, mute; Unit 2 real drag, keyboard, full dialogue, completion reward, manual Next and mobile layout.');
})().catch(e=>{console.error(e);process.exit(1);});
