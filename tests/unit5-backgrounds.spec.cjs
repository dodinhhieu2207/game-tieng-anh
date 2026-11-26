const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const origin=process.env.U5_QA_ORIGIN||'http://127.0.0.1:8765';
const routes={'feelings-house':'house','feelings-camera':'camera','helping-hands':'helping','feelings-workshop':'workshop','little-reporter':'reporter'};
(async()=>{
 const dir=path.resolve('docs/game-plans/unit5-feelings/evidence/backgrounds-v2'+(new URL(origin).protocol==='https:'?'-public':''));fs.mkdirSync(dir,{recursive:true});
 const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage(),errors=[],missing=[],layouts=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))missing.push(r.url())});
 try{
 for(const width of [320,390,768,1024,1366]){
  await p.setViewportSize({width,height:1000});
  await p.goto(origin+'/index.html?release=u5scenery2#/unit/5/lesson/1?mode=practice');await p.locator('[data-activity=feelings-house]').waitFor();
  let bg=await p.locator('#lessonApp').evaluate(e=>getComputedStyle(e).backgroundImage);assert(bg.includes('/backgrounds/v2/menu.webp'));
  assert.equal(await p.locator('#lessonApp .hero h1').evaluate(e=>getComputedStyle(e).color),'rgb(23, 78, 98)');
  await p.screenshot({path:path.join(dir,`menu-${width}.png`),fullPage:true});
  for(const [route,scene] of Object.entries(routes)){
   await p.goto(origin+'/index.html?release=u5scenery2#/unit/5/lesson/1?mode=practice&activity='+route);
   await p.waitForFunction(()=>window.Unit5Feelings?.current()?.loaded&&Unit5Feelings.current().phase!=='loading');
   bg=await p.locator('.u5-stage').evaluate(e=>getComputedStyle(e).backgroundImage);assert(bg.includes('/backgrounds/v2/'+scene+'.webp'));
   const url=bg.slice(5,-2);await p.evaluate(async u=>{const im=new Image();im.src=u;await im.decode();if(im.naturalWidth!==1536||im.naturalHeight!==1024)throw Error('background dimensions')},url);
   const x=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,canvas:document.querySelectorAll('.u5-stage canvas').length,broken:[...document.querySelectorAll('.u5-game img[src]')].filter(x=>x.complete&&!x.naturalWidth).length}));
   assert(x.scroll<=width+1,JSON.stringify(x));assert.equal(x.canvas,1);assert.equal(x.broken,0);layouts.push({route,scene,...x});
   await p.screenshot({path:path.join(dir,`${scene}-${width}.png`),fullPage:true});
  }
 }
 await p.goto(origin+'/index.html?release=u5scenery2#/unit/4/lesson/1?mode=practice');await p.locator('[data-activity=family-links]').waitFor();assert.equal(await p.locator('#lessonApp.u5-feelings-library').count(),0);assert(!(await p.locator('#lessonApp').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('unit5'));
 // A broken scene plate must expose retry instead of silently starting on a blank scene.
 const q=await b.newPage();await q.route('**/backgrounds/v2/camera.webp',r=>r.fulfill({status:404,body:'QA missing scene'}));await q.goto(origin+'/index.html?release=u5bgfailure#/unit/5/lesson/1?mode=practice&activity=feelings-camera');await q.waitForFunction(()=>Unit5Feelings.current()?.phase==='error');await q.unroute('**/backgrounds/v2/camera.webp');await q.locator('[data-u5-action=retry-load]').click();await q.waitForFunction(()=>Unit5Feelings.current()?.loaded);await q.close();
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify({origin,checkedAt:new Date().toISOString(),layouts,menuLayouts:5,scenesDistinct:5,legacySceneryPreserved:true,missingBackgroundRetry:true,menuTextContrastFixed:true,errors,missing},null,2));console.log('PASS six backgrounds, 30 layouts, decoded native art, no overflow/missing files, background retry and no Unit4 scenery leak');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
