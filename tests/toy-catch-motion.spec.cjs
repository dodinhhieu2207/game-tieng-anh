const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.TC_BASE||'http://127.0.0.1:8770/index.html';
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=no-user-gesture-required']}),ctx=await b.newContext({viewport:{width:1366,height:1050},recordVideo:{dir:'tests/toy-catch-motion',size:{width:1366,height:1050}}}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(BASE+'#/unit/3/lesson/4?mode=practice&activity=toy-catch');await p.waitForFunction(()=>ToyCatch.current()?.phase==='ready');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'tests/toy-catch-ready.png',fullPage:true});await p.locator('[data-tc=start]').click();
 // Natural timed spawns, real-time physics, actual keyboard input. No count injection or speed-up.
 const end=Date.now()+23000;let turns=0;
 while(Date.now()<end&&await p.evaluate(()=>ToyCatch.current().count<4)){
  const d=await p.evaluate(()=>{const s=ToyCatch.current(),e=s.engine;const choices=e.items.getChildren().filter(i=>i.body?.enable&&i.getData('spec').toy===s.row.toy).sort((a,b)=>b.y-a.y);return {lane:s.lane,target:choices[0]?.getData('spec').lane};});
  if(d.target!==undefined&&d.target!==d.lane){await p.keyboard.press(d.target>d.lane?'ArrowRight':'ArrowLeft');turns++;}
  await p.waitForTimeout(120);
 }
 assert(await p.evaluate(()=>ToyCatch.current().count>=3),'natural spawns are catchable');assert(turns>0,'actual steering was required');await p.waitForTimeout(500);await p.screenshot({path:'tests/toy-catch-driving.png',fullPage:true});
 const observed=await p.evaluate(()=>({count:ToyCatch.current().count,samples:ToyCatch.current().engine.frameSamples,renderer:ToyCatch.current().game.renderer.type,phaser:Phaser.VERSION}));fs.writeFileSync('tests/toy-catch-motion-observations.json',JSON.stringify({environment:'Headless Edge, natural spawn/physics and keyboard, no speed-up. Not classroom device certification.',...observed},null,2));
 await p.locator('[data-tc=pause]').click();await p.screenshot({path:'tests/toy-catch-paused.png',fullPage:true});assert.deepEqual(errors,[]);await ctx.close();await b.close();console.log('PASS natural Toy Catch spawn/steer/catch at real time; captured source video and observations, without child-engagement or rendered-FPS claims.');
})().catch(e=>{console.error(e);process.exit(1);});
