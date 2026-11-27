const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const origin=process.env.U5_QA_ORIGIN||'http://127.0.0.1:8765';
const routes=['feelings-house','feelings-camera','helping-hands','feelings-workshop','little-reporter'];
const href=r=>origin+'/index.html?release=coverui2#'+r;
const dir=path.resolve('docs/game-plans/unit5-feelings/evidence/covers-ui-v2'+(origin.startsWith('https:')?'-public':''));
async function decoded(p,selector){return p.locator(selector).evaluateAll(async images=>Promise.all(images.map(async im=>{await im.decode();return {src:im.getAttribute('src'),width:im.naturalWidth,height:im.naturalHeight,box:im.getBoundingClientRect().toJSON()}})));}
(async()=>{
 fs.mkdirSync(dir,{recursive:true});
 const b=await chromium.launch({channel:'msedge',headless:true});
 const p=await b.newPage({viewport:{width:1366,height:1000}}),errors=[],missing=[],layouts=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))missing.push(r.url())});
 try{
 for(const width of [320,390,768,1024,1366]){
  await p.setViewportSize({width,height:1000});
  await p.goto(href('/'));const world=p.locator('#lessonApp a[href="#/unit/5"]>img');await world.waitFor();
  const banner=(await decoded(p,'#lessonApp a[href="#/unit/5"]>img'))[0];assert(banner.src.endsWith('covers/v2/world.webp'));assert(Math.abs(banner.width/banner.height-3)<.015);assert(banner.box.width>100);
  await p.locator('#lessonApp .shell-worlds').screenshot({path:path.join(dir,`worlds-${width}.png`)});
  await p.goto(href('/unit/5/lesson/1?mode=practice'));await p.locator('[data-activity=feelings-house]').waitFor();
  const covers=await decoded(p,'#lessonApp .shell-activity-art img');assert.equal(covers.length,5);assert(covers.every(im=>im.src.includes('/covers/v2/')&&Math.abs(im.width/im.height-2)<.015));
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.locator('#lessonApp .learning-zone').screenshot({path:path.join(dir,`activities-${width}.png`)});
  for(const route of routes){
   await p.goto(href('/unit/5/lesson/1?mode=practice&activity='+route));await p.waitForFunction(()=>Unit5Feelings.current()?.loaded);
   await decoded(p,'.u5-game img');
   const state=await p.evaluate(()=>{const root=document.querySelector('.u5-game');return {scroll:document.documentElement.scrollWidth,width:innerWidth,buttons:[...root.querySelectorAll('.u5-controls button')].filter(e=>e.offsetWidth&&e.offsetHeight).map(e=>({label:e.textContent.trim(),height:e.getBoundingClientRect().height,color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor})),bad:[...root.querySelectorAll('img')].filter(im=>im.src.includes('/words/')||im.src.includes('/letters/')||im.src.includes('/ui/')).filter(im=>!im.src.includes('/v2/')).map(im=>im.src)}});
   assert(state.scroll<=width+1,route+' overflow');assert(state.buttons.every(x=>x.height>=48));assert.deepEqual(state.bad,[]);
   await p.screenshot({path:path.join(dir,`${route}-${width}.png`),fullPage:true});layouts.push({route,...state});
  }
 }
 // Exercise actual word feedback, completed readability, next action and optional letter panel.
 for(const width of [320,1366]){
  await p.setViewportSize({width,height:1000});await p.goto(href('/unit/5/lesson/1?mode=practice&activity=feelings-workshop').replace('?release=',`?state=${width}&release=`));await p.waitForFunction(()=>Unit5Feelings.current()?.loaded);
  const word=await p.evaluate(()=>Unit5Feelings.current().word);
  await p.locator(`[data-u5-pick="${word}"]`).click();await p.locator('.u5-receiver').click();
  await p.waitForFunction(()=>Unit5Feelings.current().canContinue);
  assert.equal(await p.locator('.u5-word-pick').first().evaluate(e=>getComputedStyle(e).opacity),'1');
  const next=p.locator('[data-u5-action=next]');assert(await next.isEnabled());await p.keyboard.press('Tab');await next.focus();assert(await next.evaluate(e=>e.matches(':focus-visible')));
  await p.screenshot({path:path.join(dir,`workshop-resolved-${width}.png`),fullPage:true});
  await p.locator('[data-u5-action=letters]').click();await p.locator('.u5-letter-area').waitFor();await decoded(p,'.u5-letter-area img');
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  const letter=await p.evaluate(()=>Unit5Feelings.current().bank.find(x=>x.letter===Unit5Feelings.current().word[0]).id);
  await p.locator(`[data-u5-letter="${letter}"]`).click();assert.equal(await p.locator('.u5-letter-slot img').count(),1);
  await p.screenshot({path:path.join(dir,`workshop-letters-${width}.png`),fullPage:true});
 }
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.u5-btn').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify({origin,checkedAt:new Date().toISOString(),covers:6,worldAndActivityMenusAtFiveWidths:true,gameLayouts:layouts,nativeWordSuccessAndLetterPlacement:true,focusVisible:true,reducedMotion:true,errors,missing},null,2));
 console.log('PASS six assigned covers, five menu widths, 25 game layouts, native word/letter states, 48px controls and keyboard focus');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
