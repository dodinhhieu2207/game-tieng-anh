const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=4;return play.call(this);};});
 await page.goto(process.env.VOICE_UI_TEST_BASE||'http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>window.LearningApp);
 await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=talk-to-toy-buddy'));await page.waitForSelector('.l2-scene[data-phase="listening"]');
 await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.fonts.check('700 20px "App Outfit"')&&document.fonts.check('800 20px "App Outfit"')));
 assert.match(await page.locator('#l2Mic').evaluate(e=>getComputedStyle(e).fontFamily),/App Outfit/);
 assert.equal(await page.locator('#l2Mic').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)),25);
 assert.equal(await page.locator('.toy-voice-panel').getAttribute('data-voice-state'),'LISTENING');
 assert(await page.locator('#l2Mic svg').isVisible());assert(await page.locator('#l2Mic').isEnabled());
 await page.screenshot({path:'tests/toy-voice-ready.png',fullPage:true});
 // Presentation states only; real recording and speech progression are covered separately.
 for(const [phase,state,label] of [['asking','ASKING','Tap the microphone'],['starting','STARTING','Starting microphone'],['recording','RECORDING','Stop recording'],['processing','THINKING','Checking']]){
  await page.evaluate(phase=>{const s=Unit3Lesson2.current();s.phase=phase;s.refresh();},phase);
  assert.equal(await page.locator('.toy-voice-panel').getAttribute('data-voice-state'),state);assert.match(await page.locator('#l2Mic').getAttribute('aria-label'),new RegExp(label));
  assert.equal(await page.locator('#l2Mic').isEnabled(),phase==='recording');
  if(phase==='recording'){assert(await page.locator('.toy-voice-stop').isVisible());await page.screenshot({path:'tests/toy-voice-recording.png',fullPage:true});}
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.toy-voice-wave i').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.evaluate(()=>{const s=Unit3Lesson2.current();s.phase='listening';s.refresh();});
 for(const [width,height] of [[1024,768],[390,844],[320,740]]){
  await page.setViewportSize({width,height});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page has horizontal overflow');
  const b=await page.locator('#l2Mic').boundingBox();assert(b.height>=44&&b.width>=44);
  await page.screenshot({path:`tests/toy-voice-ready-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:1366,height:768});await page.locator('[data-teacher]').click();assert(await page.locator('#l2Teacher').isVisible());assert(await page.locator('#l2Mic').isHidden());
 const bounds=await page.locator('.l2-scene').boundingBox();assert(bounds.y+bounds.height<=768);
 await page.screenshot({path:'tests/toy-voice-teacher.png',fullPage:true});
 await page.evaluate(()=>{Unit3Lesson2.current().manualMode=false;});
 for(const type of ['name','name-question']){
  await page.selectOption('#l2SpeakingType',type);await page.waitForSelector('.l2-scene[data-phase="listening"]');
  assert.equal(await page.locator('#l2Question').textContent(),"What's this?");
  assert.match(await page.locator('.toy-voice-support').textContent(),type==='name'?/It's a/:/What's this/);
  for(const [width,height] of [[1366,768],[390,844],[320,740]]){
   await page.setViewportSize({width,height});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const b=await page.locator('#l2SpeakingType').boundingBox();assert(b.x>=0&&b.x+b.width<=width);await page.screenshot({path:`tests/toy-voice-${type}-${width}.png`,fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS voice UI: visual states, mic availability, Stop indicator, reduced motion, 320/390 touch layouts, teacher controls and desktop fit.');
})().catch(e=>{console.error(e);process.exit(1)});
