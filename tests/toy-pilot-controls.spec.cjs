const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({viewport:{width:390,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto((process.env.DELIVERY_BASE||'http://127.0.0.1:8770/index.html')+'#/unit/3/lesson/1?mode=practice&activity=u3match');await p.waitForSelector('.td-world');await p.evaluate(()=>ToyDelivery.current().flightSeconds=1);
 await p.locator('[data-td-flight]').click();await p.waitForTimeout(1200);assert.equal(await p.evaluate(()=>ToyDelivery.current().mistakes),0,'An unselected lane/motor miss does not lower score');
 await p.locator('[data-td-flight]').click();const travel=await p.evaluate(()=>ToyDelivery.current().travel);await p.waitForTimeout(250);assert.equal(await p.evaluate(()=>ToyDelivery.current().travel),travel,'Pause freezes parcels');
 const lane=await p.evaluate(()=>ToyDelivery.current().choices.indexOf(ToyDelivery.current().target)),world=await p.locator('.td-world').boundingBox();
 await p.mouse.move(world.x+40,world.y+290);await p.mouse.down();await p.mouse.move(world.x+40,world.y+(lane?355:235),{steps:8});await p.mouse.up();await p.waitForFunction(()=>ToyDelivery.current()?.phase==='resolved');assert.equal(await p.evaluate(()=>ToyDelivery.current().mistakes),0);
 await p.locator('[data-td-next]').click();await p.locator('[data-td-flight]').click();await p.locator('[data-td-hint]').click();await p.waitForFunction(()=>ToyDelivery.current()?.phase==='paused');const before=await p.evaluate(()=>ToyDelivery.current().travel);await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>ToyDelivery.current().travel),before);
 await p.locator('.td-world').focus();const second=await p.evaluate(()=>ToyDelivery.current().choices.indexOf(ToyDelivery.current().target));await p.keyboard.press(second?'ArrowDown':'ArrowUp');await p.waitForFunction(()=>ToyDelivery.current()?.phase==='resolved');
 await p.locator('[data-td-next]').click();await p.locator('[data-td-flight]').click();await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>ToyDelivery.current()?.phase==='paused');await p.locator('.toy-delivery [data-word]').filter({hasText:await p.evaluate(()=>ToyDelivery.current().target)}).click();await p.waitForFunction(()=>ToyDelivery.current()?.phase==='resolved');
 assert.deepEqual(errors,[]);await b.close();console.log('PASS: motor miss without penalty, real pointer drag, pause freezes movement, hint pauses flight, keyboard steering, reduced motion during flight.');
})().catch(e=>{console.error(e);process.exit(1);});
