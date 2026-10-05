const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();await page.goto('http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>window.LearningApp);
 for(const [width,height] of [[1920,1080],[1366,768],[1024,768]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=talk-to-toy-buddy'));await page.waitForSelector('.l2-scene[data-phase="listening"]');
  // Exercise the completion renderer directly; full-round completion is covered by unit3-lesson2.spec.cjs.
  await page.evaluate(()=>{window.oldActor=Unit3Lesson2.current().buddy;Unit3Lesson2.current().complete();});
  await page.waitForFunction(()=>Unit3Lesson2.current().buddy.state==='CELEBRATE');
  assert(await page.evaluate(()=>oldActor===Unit3Lesson2.current().buddy&&oldActor.root.closest('#l2Result')));
  assert((await page.locator('#gameStage').boundingBox()).y+(await page.locator('#gameStage').boundingBox()).height<=height+2);
  await page.screenshot({path:`tests/l2-complete-${width}.png`,fullPage:true});
  await page.locator('[data-complete-action="unit"]').click();await page.waitForSelector('#lessonApp [data-lesson]');
 }
 await browser.close();console.log('PASS completion layout: persistent girl, celebration, controls and Back to Unit 3 fit all three classroom sizes');
})().catch(e=>{console.error(e);process.exit(1)});
