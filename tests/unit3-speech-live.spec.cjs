/* Real browser MediaRecorder -> deployed Worker -> real Whisper, using synthetic lesson audio. */
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[],results=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',async r=>{if(r.url().includes('workers.dev/api/speaking-check')&&r.request().method()==='POST'){results.push({status:r.status(),body:await r.json()});}});
 await page.addInitScript(()=>{
  window.qaInput='yes_it_is';window.qaCaptures=0;
  // Synthetic source replaces the microphone only in this test. The recorder and request are real.
  navigator.mediaDevices.getUserMedia=async()=>{
   qaCaptures++;const context=new AudioContext(),buffer=await context.decodeAudioData(await (await fetch('assets/unit3/lesson2/audio/answers/'+qaInput+'.mp3')).arrayBuffer());
   const source=context.createBufferSource(),destination=context.createMediaStreamDestination();source.buffer=buffer;source.connect(destination);await context.resume();source.start(context.currentTime+.2);
   const track=destination.stream.getAudioTracks()[0],stop=track.stop.bind(track);let closed=false;track.stop=()=>{if(closed)return;closed=true;stop();source.stop();context.close();};return destination.stream;
  };
  const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=4;return play.call(this);};
 });
 const base=process.env.SPEECH_TEST_BASE||'http://127.0.0.1:8765/index.html';
 await page.goto(base);await page.waitForFunction(()=>window.LearningApp);
 await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=talk-to-toy-buddy'));
 assert(await page.locator('#l2Mic').isDisabled());assert.equal(await page.evaluate(()=>qaCaptures),0);
 const ready=()=>page.waitForSelector('.l2-scene[data-phase="listening"]',{timeout:30000});await ready();
 for(const [input,shown,asked,expected] of [['yes_it_is','robot','robot','CORRECT'],['no_it_isnt','teddy','robot','CORRECT'],['yes_it_is','teddy','robot','WRONG_LOGIC']]){
  await page.evaluate(({input,shown,asked})=>{window.qaInput=input;const s=Unit3Lesson2.current();s.index=0;s.rounds=[{shown,asked,yes:shown===asked},{shown:'plane',asked:'plane',yes:true}];s.setRound();},{input,shown,asked});await ready();
  const count=results.length;await page.locator('#l2Mic').click();await page.waitForSelector('.l2-scene[data-phase="recording"]');await page.waitForSelector('.l2-scene[data-phase="processing"]');assert(await page.locator('#l2Mic').isDisabled());
  await page.waitForFunction(()=>Unit3Lesson2.current()?.index===1||Unit3Lesson2.current()?.phase==='listening',{},{timeout:30000});
  assert.equal(results.length,count+1);assert.equal(results.at(-1).status,200);assert.equal(results.at(-1).body.result,expected,JSON.stringify(results.at(-1)));
  if(expected==='CORRECT')assert.equal(await page.evaluate(()=>Unit3Lesson2.current().index),1);else assert.equal(await page.evaluate(()=>Unit3Lesson2.current().index),0);
  await ready();console.log(JSON.stringify({source:input,shown,asked,...results.at(-1).body}));
 }
 assert.deepEqual(errors,[]);await page.screenshot({path:'tests/unit3-speech-live.png',fullPage:true});await browser.close();console.log('PASS real browser -> live Worker -> real Whisper: positive, negative, wrong-logic, loading, feedback and advancement. Audio is synthetic Higgs, not a child microphone quality test.');
})().catch(e=>{console.error(e);process.exit(1);});
