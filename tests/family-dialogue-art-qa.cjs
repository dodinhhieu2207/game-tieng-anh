const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const base=process.env.FAMILY_DIALOGUE_BASE||'http://127.0.0.1:8773';
 for(const width of (process.env.FAMILY_DIALOGUE_WIDTHS||'320,390,768,1024,1366').split(',').map(Number)){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/index.html?qa=dialogue-art#/unit/4/lesson/2?mode=practice&activity=family-dialogue');
  await page.locator('[data-person=dad]').click();
  await page.waitForTimeout(400);
  const geometry=await page.locator('[data-person=dad]').evaluate(person=>{const a=person.querySelector('.fd-arrow').getBoundingClientRect(),p=person.getBoundingClientRect();return {bottom:a.bottom,top:p.top,width:a.width,cx:a.x+a.width/2,px:p.x+p.width/2}});
  assert.ok(geometry.bottom<=geometry.top,JSON.stringify({width,geometry}));
  assert.ok(geometry.width<=40);
  assert.ok(Math.abs(geometry.cx-geometry.px)<2);
  await page.locator('.fd-panel:not(.fd-hidden)').waitFor();
  await page.waitForTimeout(550);
  const separation=await page.evaluate(()=>{const room=document.querySelector('.fd-room').getBoundingClientRect(),panel=document.querySelector('.fd-panel').getBoundingClientRect();return panel.top-room.bottom});
  assert.ok(separation>=20,`Build panel overlaps scene at ${width}: ${separation}`);
  for(const tile of ['This','is','my','dad'])await page.locator(`.fd-tile[data-tile="${tile}"]`).click();
  await page.locator('.fd-speak:not(.fd-hidden)').waitFor();
  await page.waitForTimeout(1800);
  await page.locator('[data-answer=yes]').click();
  const frame=await page.locator('.fd-speak').evaluate(e=>({background:getComputedStyle(e).backgroundImage,rect:e.getBoundingClientRect().toJSON()}));
  assert.match(frame.background,/speaking-console/);
  assert.ok(frame.rect.right<=width);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await page.locator('[data-speak] img').count(),1);
  assert.deepEqual(errors,[]);
  if(width===390||width===1366)await page.screenshot({path:`tests/family-dialogue-art-${width}.png`,fullPage:true});
  if(width===1366){
   await page.evaluate(()=>{window.Unit3Speech={available:true,start:o=>{queueMicrotask(()=>o.onStart());return {cancel(){},stop(){o.onProcessing();setTimeout(()=>o.onResult({result:'CORRECT',transcript:'Yes, it is.'}),25)}}}}});
   await page.locator('[data-speak]').click();
   assert.equal(await page.locator('.fd-speak').getAttribute('data-state'),'recording');
   await page.locator('[data-done]').click();
   await page.locator('[data-next]:not(.fd-hidden)').waitFor();
   assert.equal(await page.locator('.fd-speak').getAttribute('data-state'),'correct');
  }
  console.log('PASS',width,geometry.width,frame.rect.width);
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
