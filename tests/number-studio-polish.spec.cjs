const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const BASE=process.env.NS_BASE||'http://127.0.0.1:8770/index.html';
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1366,height:1050},recordVideo:{dir:'tests/number-polish-video',size:{width:1366,height:1050}}}),p=await ctx.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=8;return play.call(this);};});
 const phase=async s=>p.waitForFunction(s=>NumberStudio.current()?.phase===s,s);
 const go=async kind=>{await p.goto(BASE+'#/unit/3/lesson/4?mode=practice&activity='+kind);await phase('ready');await p.waitForFunction(()=>NumberStudio.current().root.dataset.renderer==='pixi');await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>NumberStudio.current().motion.count()===0);};
 await go('gift-workshop');
 await p.evaluate(()=>window.sameToy=document.querySelector('[data-item=gift0]'));
 await p.locator('[data-item=gift0]').click();
 assert(await p.evaluate(()=>sameToy===document.querySelector('[data-item=gift0]')),'packing preserves visual object identity');
 await p.waitForFunction(()=>NumberStudio.current().moves.size===0);
 assert(await p.evaluate(()=>sameToy.closest('.ns-packed')!==null),'actual item now inside box');
 await p.locator('[data-item=gift0]').click();await p.waitForFunction(()=>NumberStudio.current().moves.size===0);
 assert(await p.evaluate(()=>sameToy.closest('[data-slot=gift0]')!==null),'undo returns same object to original stable source slot');
 const a=await p.locator('[data-item=gift1]').boundingBox(),dest=await p.locator('.ns-pack').boundingBox();
 await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(dest.x+dest.width/2,dest.y+dest.height/2,{steps:12});
 assert.equal(await p.locator('.ns-drag-ghost').count(),1,'pointer has a visual object');await p.mouse.up();await p.waitForFunction(()=>NumberStudio.current().moves.size===0);
 assert.deepEqual(await p.evaluate(()=>[...NumberStudio.current().selected]),['gift1']);assert.equal(await p.locator('.ns-drag-ghost').count(),0);
 // Exit mid-drag must not leave an artifact or an active owned timeline.
 const a2=await p.locator('[data-item=gift2]').boundingBox();await p.mouse.move(a2.x+20,a2.y+20);await p.mouse.down();await p.mouse.move(a2.x+70,a2.y+40,{steps:4});
 await p.evaluate(()=>LearningApp.go('#/'));await p.mouse.up();assert.equal(await p.locator('.ns-drag-ghost').count(),0);assert.equal(await p.evaluate(()=>LearningMotion.activeCount()),0);
 await p.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,768,1024,1366]){
  await p.setViewportSize({width,height:1050});
  for(const kind of ['gift-workshop','number-parade','toy-detective','number-snap','say-open','toy-relay']){
   await go(kind);await p.waitForFunction(()=>[...document.querySelectorAll('.number-studio img')].every(i=>i.complete&&i.naturalWidth>0));
   const geometry=await p.evaluate(()=>{const s=document.querySelector('.ns-scene').getBoundingClientRect(),q=document.querySelector('.ns-prompt').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,prompt:q.left>=s.left-1&&q.right<=s.right+1,font:getComputedStyle(document.querySelector('.ns-prompt')).fontFamily,appFont:getComputedStyle(document.body).fontFamily};});
   assert(!geometry.overflow,kind+' overflow '+width);assert(geometry.prompt,kind+' prompt clipping '+width);assert.equal(geometry.font,geometry.appFont,'inherit actual app typeface');assert(geometry.font.includes('App Outfit'),'approved local Outfit family loaded');
   for(const el of await p.locator('[data-item]').all()){const r=await el.boundingBox();assert(r.width>=48&&r.height>=48,kind+' touch '+width);}
   await p.screenshot({path:`tests/number-polish-${kind}-${width}.png`,fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);await ctx.close();await b.close();console.log('PASS persistent pickup/place/undo, pointer journey + exit, six game compositions at five widths, prompt bounds, font family, image decode and touch controls. This is not a child engagement or device-FPS study.');
})().catch(e=>{console.error(e);process.exit(1);});
