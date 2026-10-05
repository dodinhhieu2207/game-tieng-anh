const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const {default:worker}=await import('../cloudflare/toy-buddy-speech/src/index.js');
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']}),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));let transcript='',uploads=0;
 await page.route('**/data/speech-config.js*',r=>r.fulfill({contentType:'application/javascript',body:"window.Unit3SpeechConfig={endpoint:'https://speech.test/api/speaking-check',maxRecordingMs:150,requestTimeoutMs:3000};"}));
 await page.route('https://speech.test/api/speaking-check',async r=>{uploads++;const q=r.request();const result=await worker.fetch(new Request(q.url(),{method:'POST',headers:q.headers(),body:q.postDataBuffer()}),{ALLOWED_ORIGINS:'http://127.0.0.1:8765',SPEECH_LIMITER:{limit:async()=>({success:true})},AI:{run:async()=>({text:transcript})}});await r.fulfill({status:result.status,body:await result.text(),headers:Object.fromEntries(result.headers)});});
 await page.addInitScript(()=>{window.testAudio=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=4;testAudio.push(this.src);return play.call(this);};});
 await page.goto('http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>window.LearningApp);await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=talk-to-toy-buddy'));
 const ready=()=>page.waitForSelector('.l2-scene[data-phase="listening"]');await ready();
 await page.selectOption('#l2SpeakingType','name-question');await ready();assert.match(await page.locator('[data-voice-title]').textContent(),/YOU ASK.*TOY BUDDY ANSWERS/);assert(await page.locator('[data-voice-title]').isVisible());assert.equal(await page.locator('#l2Bubble').textContent(),'Ask me!');
 await page.selectOption('#l2SpeakingType','name');await ready();assert.match(await page.locator('[data-voice-title]').textContent(),/TOY BUDDY ASKS.*YOU ANSWER/);assert(await page.locator('[data-voice-title]').isVisible());
 await page.selectOption('#l2SpeakingType','mystery-question');await ready();assert.equal(await page.evaluate(()=>Unit3Lesson2.current().rounds.length),5);
 const say=async text=>{transcript=text;await page.locator('#l2Mic').click();await page.waitForSelector('.l2-scene[data-phase="recording"]');await page.waitForFunction(()=>['listening','resolved'].includes(Unit3Lesson2.current().phase));};
 // Incomplete/noise speech does not consume a competitive guess.
 await say('robot');assert.equal(await page.evaluate(()=>Unit3Lesson2.current().round.guesses.length),0);await say('noise');assert.equal(await page.evaluate(()=>Unit3Lesson2.current().round.guesses.length),0);
 const earned=[];
 for(let i=0;i<5;i++){
  const shown=await page.evaluate(()=>Unit3Lesson2.current().round.shown),wrong=shown==='robot'?'teddy':'robot';
  assert.equal(await page.locator('#l2Toy').getAttribute('src'),'assets/shared-ui/question.png');assert.equal(await page.locator('#l2Toy').getAttribute('alt'),'Hidden mystery toy');
  for(let j=0;j<i;j++){
   await say(`Is it a ${wrong}?`);assert.equal(await page.evaluate(()=>Unit3Lesson2.current().index),i);assert.equal(await page.evaluate(()=>Unit3Lesson2.current().phase),'listening');assert(await page.locator('#l2Next').isDisabled());assert.equal(await page.locator('#l2Bubble').textContent(),"No, it isn't.");assert.equal(await page.locator('#l2Toy').getAttribute('src'),'assets/shared-ui/question.png');
  }
  // Replay and support changes preserve competitive attempts and the hidden toy.
  if(i===1){await page.locator('#l2Replay').click();await ready();await page.selectOption('#l2Level','practice');await ready();assert.equal(await page.evaluate(()=>Unit3Lesson2.current().round.guesses.length),1);}
  await say(`Is it a ${shown}?`);assert.equal(await page.evaluate(()=>Unit3Lesson2.current().phase),'resolved');assert.equal(await page.locator('#l2Bubble').textContent(),'Yes, it is.');assert.match(await page.locator('#l2Toy').getAttribute('src'),new RegExp(shown));earned.push(await page.evaluate(()=>Unit3Lesson2.current().round.earnedStars));
  if(i===0){await page.screenshot({path:'tests/toy-mystery-reveal.png',fullPage:true});}
  await page.locator('#l2Next').click();if(i<4)await ready();else await page.waitForSelector('.l2-scene[data-phase="complete"]');
 }
 assert.deepEqual(earned,[3,2,2,1,1]);assert.equal(await page.evaluate(()=>Unit3Lesson2.current().stars),2);assert.match(await page.locator('#l2Result').textContent(),/9 \/ 15 mystery stars/);
 await page.locator('#restartGame').click();await ready();await page.selectOption('#l2SpeakingType','mystery-question');await ready();
 // Class fallback still needs the selected spoken toy; it cannot award a blind CORRECT.
 await page.locator('[data-teacher]').click();assert.equal(await page.locator('[data-validate="correct"]').count(),0);
 const shown=await page.evaluate(()=>Unit3Lesson2.current().round.shown);await page.locator(`[data-guess="${shown}"]`).click();await page.waitForSelector('.l2-scene[data-phase="resolved"]');
 await page.selectOption('#l2SpeakingType','mystery-question');await ready();await page.evaluate(()=>{const s=Unit3Lesson2.current();s.manualMode=false;s.speakingControls();s.refresh();});
 for(const [width,height] of [[1366,768],[1024,768],[390,844],[320,740]]){
  await page.setViewportSize({width,height});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width>=1024){const b=await page.locator('.l2-scene').boundingBox();assert(b.y+b.height<=height,JSON.stringify(b));}
  await page.screenshot({path:`tests/toy-mystery-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);await browser.close();console.log(`PASS mystery: ${uploads} MediaRecorder/Worker uploads (inference mocked); role direction, hidden toy, repeat guesses, no scoring on No, full question, no charge for partial/noise, reveal, 1–5 guess stars, replay/support continuity, completion, teacher fallback and desktop/mobile layout.`);
})().catch(e=>{console.error(e);process.exit(1)});
