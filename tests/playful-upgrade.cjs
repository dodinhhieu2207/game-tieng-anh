const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const context=await browser.newContext({viewport:{width:1366,height:1000},recordVideo:{dir:'tests/playful-upgrade-video/',size:{width:1366,height:1000}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.PLAYFUL_BASE||'http://127.0.0.1:8770/index.html';
 await page.goto(base+'#/unit/4/lesson/1?mode=practice&activity=family-switcheroo');
 await page.waitForFunction(()=>window.FamilyClassroom?.current()?.phase==='guess',null,{timeout:35000});
 assert(await page.evaluate(()=>document.fonts.check('700 20px "Learning Fredoka"')));
 assert(await page.evaluate(()=>document.fonts.check('400 30px "Learning Display"')));
 await page.evaluate(()=>{window.pilotCompletions=0;document.addEventListener('learning:activity-completed',e=>{if(e.detail.game==='u4familyswitch')pilotCompletions++})});
 const target=await page.evaluate(()=>FamilyClassroom.current().target),wrong=await page.evaluate(()=>FamilyClassroom.current().members.find(w=>w!==FamilyClassroom.current().target));
 await page.locator(`[data-word="${wrong}"]`).click();
 await page.waitForFunction(()=>FamilyClassroom.current().phase==='guess');
 assert(await page.locator(`[data-word="${wrong}"]`).evaluate(b=>b.classList.contains('fc-wrong')));
 assert.equal(await page.locator('.fc-answer-mark').isVisible(),false);
 await page.screenshot({path:'tests/playful-stage-retry.png',fullPage:true});
 // Missed drag returns to the original tile without checking/scoring an answer.
 const tile=page.locator(`[data-word="${target}"]`),r=await tile.boundingBox();
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(r.x+r.width/2,r.y-60,{steps:8});await page.mouse.up();
 await page.waitForFunction(()=>FamilyClassroom.current().phase==='guess'&&!document.querySelector('.fc-drag'));
 assert.equal(await page.locator('.fc-answer-mark').isVisible(),false);
 // Valid drag settles onto the actual missing slot and reveals the character.
 const rr=await tile.boundingBox(),drop=await page.locator('.fc-drop').boundingBox();
 await page.mouse.move(rr.x+rr.width/2,rr.y+rr.height/2);await page.mouse.down();await page.mouse.move(drop.x+drop.width/2,drop.y+drop.height/2,{steps:15});await page.mouse.up();
 await page.waitForFunction(()=>FamilyClassroom.current().phase==='solved',null,{timeout:15000});
 assert.equal((await page.locator('.fc-answer-mark').textContent()).trim(),'✓ '+target);
 for(const width of [320,390,768,1024,1366]){
  await page.setViewportSize({width,height:1000});await page.waitForTimeout(150);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow at '+width);
  assert(await page.locator('.fc-answer-mark').evaluate(e=>{const a=e.getBoundingClientRect(),b=e.closest('.fc-scene').getBoundingClientRect();return a.left>=b.left&&a.right<=b.right&&a.top>=b.top}),'answer badge contained at '+width);
  await page.screenshot({path:`tests/playful-stage-${width}.png`,fullPage:true});
 }
 await page.locator('[data-fc="next"]').click();await page.waitForFunction(()=>FamilyClassroom.current().phase==='preview');
 assert.equal(await page.locator('.fc-wrong').count(),0);assert.equal(await page.locator('.fc-picked').count(),0);
 // Finish the remaining five rounds with app mute, preserving each full observation timer.
 await page.locator('.app-game-more>summary').click();await page.locator('[data-shell-action="sound"]').click();
 for(let round=1;round<6;round++){await page.waitForFunction(()=>FamilyClassroom.current().phase==='guess',null,{timeout:15000});const answer=await page.evaluate(()=>FamilyClassroom.current().target);await page.locator('[data-word="'+answer+'"]').click();await page.waitForFunction(()=>FamilyClassroom.current().phase==='solved');await page.locator('[data-fc="next"]').click()}
 await page.waitForFunction(()=>FamilyClassroom.current().phase==='complete');assert.equal(await page.evaluate(()=>pilotCompletions),1);assert.equal(await page.locator('.fc-count').textContent(),'6 / 6');
 await page.evaluate(()=>document.dispatchEvent(new Event('learning:leave-activity')));
 assert.equal(await page.locator('.fc-drag').count(),0);assert.equal(await page.evaluate(()=>FamilyClassroom.current()),null);
 assert.deepEqual(errors,[]);
 await context.close();await browser.close();console.log('PASS real Higgs, retry, missed-drop return, correct-drop reveal, badge/scene containment at five widths, next reset and leave cleanup; motion video recorded.');
})().catch(e=>{console.error(e);process.exit(1)});
