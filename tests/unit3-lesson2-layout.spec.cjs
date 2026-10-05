const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();
 await page.goto('http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>window.LearningApp);
 const entries=await page.evaluate(()=>Unit3Lesson2.entries.map(e=>e[0]));
 for(const [width,height] of [[1920,1080],[1366,768],[1024,768]]){
  await page.setViewportSize({width,height});
  for(const id of entries){await page.evaluate(id=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity='+id),id);await page.waitForSelector('.l2-scene[data-phase="listening"]');
   if(id==='talk-to-toy-buddy')await page.locator('[data-teacher]').click();
   if(id==='match-answer'){await page.evaluate(()=>{const s=Unit3Lesson2.current();s.index=4;s.setRound();});await page.waitForSelector('.l2-scene[data-phase="listening"]');}
   const size=await page.locator('.l2-scene').evaluate(e=>({bottom:e.getBoundingClientRect().bottom+scrollY,width:e.scrollWidth,client:e.clientWidth}));
   assert(size.width<=size.client+1,`${id} overflow at ${width}`);assert(size.bottom<=height+2,`${id} bottom ${size.bottom} exceeds ${height} at ${width}`);
   if(id==='talk-to-toy-buddy'||id==='match-answer')await page.screenshot({path:`tests/l2-${id}-${width}.png`,fullPage:true});
  }
 }
 await browser.close();console.log('PASS layout: all six games fit 1920×1080, 1366×768 and 1024×768, including teacher controls and multi-card matching');
})().catch(e=>{console.error(e);process.exit(1)});
