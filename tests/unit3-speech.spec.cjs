const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const {default:worker}=await import('../cloudflare/toy-buddy-speech/src/index.js');
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']}),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 let transcript='yes',uploads=0,modelCalls=0,hold=false;
 await page.route('**/data/speech-config.js*',route=>route.fulfill({contentType:'application/javascript',body:"window.Unit3SpeechConfig={endpoint:'https://speech.test/api/speaking-check',maxRecordingMs:250,requestTimeoutMs:1500};"}));
 await page.route('https://speech.test/api/speaking-check',async route=>{
  uploads++;const req=route.request();assert(req.postDataBuffer().length>100);if(hold)await new Promise(r=>setTimeout(r,500));
  const response=await worker.fetch(new Request(req.url(),{method:'POST',headers:req.headers(),body:req.postDataBuffer()}),{ALLOWED_ORIGINS:'http://127.0.0.1:8765',SPEECH_LIMITER:{limit:async()=>({success:true})},AI:{run:async(m,input)=>{modelCalls++;assert.equal(m,'@cf/openai/whisper-large-v3-turbo');assert(Buffer.from(input.audio,'base64').length>0);return {text:transcript};}}});
  await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});
 });
 await page.addInitScript(()=>{window.qaOriginalCapture=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async options=>{const stream=await qaOriginalCapture(options);window.qaCapture=stream;return stream;};const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=4;return play.call(this);};});
 await page.goto('http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>window.LearningApp);
 const enter=async()=>{await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=talk-to-toy-buddy'));};
 await enter();assert(await page.locator('#l2Mic').isDisabled());assert.equal(uploads,0);
 const ready=()=>page.waitForSelector('.l2-scene[data-phase="listening"]');
 const start=async()=>{await ready();await page.locator('#l2Mic').click();await page.waitForSelector('.l2-scene[data-phase="recording"]');assert.match(await page.locator('#l2Mic').textContent(),/Stop recording/);};
 await start();await page.locator('#l2Mic').click();await ready();assert.match(await page.locator('#l2Status').textContent(),/whole sentence/);assert(await page.locator('#l2Next').isDisabled());assert.equal(await page.evaluate(()=>Unit3Lesson2.current().characterState),'LISTENING');
 let yes=await page.evaluate(()=>Unit3Lesson2.current().round.yes);
 transcript=yes?"No, it isn't.":'Yes it is';await start();await ready();assert.match(await page.locator('#l2Status').textContent(),/Look again/);
 transcript='music noise';await start();await ready();assert.match(await page.locator('#l2Status').textContent(),/couldn't hear/);
 // Actual browser MediaRecorder bytes reach the Worker handler. Inference remains mocked.
 transcript=yes?'YES, IT IS.':'no it is not';hold=true;await start();await page.waitForSelector('.l2-scene[data-phase="processing"]');assert(await page.locator('#l2Mic').isDisabled());assert(await page.locator('#l2Replay').isDisabled());assert(await page.locator('.l2-waveform').isVisible());assert.equal(await page.evaluate(()=>Unit3Lesson2.current().characterState),'THINKING');assert(await page.evaluate(()=>qaCapture.getTracks().every(t=>t.readyState==='ended')));await page.screenshot({path:'tests/unit3-speaking-processing.png',fullPage:true});
 await page.waitForFunction(()=>Unit3Lesson2.current()?.index===1);await ready();hold=false;
 // All five toys, yes and no, use the same unchanged lesson grammar in the game.
 for(const shown of ['plane','puppet','robot','balloon','teddy'])for(const truth of [true,false]){
  await page.evaluate(({shown,truth})=>{const s=Unit3Lesson2.current();s.rounds[s.index]={shown,asked:truth?shown:shown==='robot'?'teddy':'robot',yes:truth};s.setRound();},{shown,truth});await ready();
  const index=await page.evaluate(()=>Unit3Lesson2.current().index);transcript=truth?'Yes, it is.':"No, it isn't.";await start();await page.waitForFunction(i=>Unit3Lesson2.current()?.index>i,index);if(index<9)await ready();
  if(index===9){await page.waitForSelector('.l2-scene[data-phase="complete"]');await page.locator('#restartGame').click();await ready();}
 }
 // A stale pending result after Back cannot mutate the old scene or next scene.
 for(const type of ['name','name-question']){
  await page.selectOption('#l2SpeakingType',type);await ready();assert.equal(await page.locator('#l2Question').textContent(),"What's this?");
  const seen=new Set();
  for(let i=0;i<5;i++){
   const shown=await page.evaluate(()=>Unit3Lesson2.current().round.shown);seen.add(shown);
   if(i===0){transcript=type==='name'?shown:'what';await start();await ready();assert.match(await page.locator('#l2Status').textContent(),/whole sentence/);assert.equal(await page.evaluate(()=>Unit3Lesson2.current().index),0);}
   if(i===0&&type==='name'){transcript=`It's a ${shown==='robot'?'teddy':'robot'}.`;await start();await ready();assert.match(await page.locator('#l2Status').textContent(),/Look again/);}
   transcript=type==='name'?`It's a ${shown}.`:"What's this?";await start();await page.waitForFunction(i=>Unit3Lesson2.current()?.index>i,i);if(i<4)await ready();
  }
  assert.equal(seen.size,5);await page.waitForSelector('.l2-scene[data-phase="complete"]');await page.locator('#restartGame').click();await ready();
 }
 hold=true;transcript='Yes, it is.';await start();await page.waitForSelector('.l2-scene[data-phase="processing"]');await page.locator('[data-shell-action="back"]').click();await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>Unit3Lesson2.current()),null);await enter();await ready();hold=false;
 // Permission denied: exactly two teacher controls, same audio and actor remain.
 await page.evaluate(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('denied','NotAllowedError');};});
 await page.locator('#l2Mic').click();await page.waitForSelector('#l2Teacher:not([hidden])');assert.equal(await page.locator('[data-validate]').count(),2);assert.deepEqual(await page.locator('[data-validate]').allTextContents(),['CORRECT','TRY AGAIN']);await page.locator('[data-validate="unclear"]').click();await ready();
 await page.screenshot({path:'tests/unit3-lesson2-teacher-fallback.png',fullPage:true});
 await page.locator('[data-shell-action="back"]').click();assert.equal(await page.evaluate(()=>Unit3Lesson2.current()),null);assert.deepEqual(errors,[]);assert.equal(uploads,modelCalls);
 await browser.close();console.log(`PASS browser: ${uploads} real MediaRecorder uploads through Worker handler (AI mocked), ended gating, manual/auto stop, loading, four results, all-five-toy yes/no, automatic advance, permission fallback and navigation cleanup.`);
})().catch(e=>{console.error(e);process.exit(1)});
