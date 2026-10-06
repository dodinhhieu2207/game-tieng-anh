const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.goto(process.env.APP_TEST_BASE||'http://127.0.0.1:8765/index.html');await page.waitForSelector('.shell-welcome');
 assert.equal(await page.locator('#brandHome b').textContent(),'My English Adventure');assert.equal(await page.locator('[data-continue]').count(),0);
 assert.equal(await page.locator('.shell-unit-art-card').count(),2);assert.equal(await page.locator('.shell-letter-world').count(),1);
 assert.equal(await page.locator('.shell-unit-art-card .shell-integrated-progress').count(),2);
 for(const [w,h] of [[1366,900],[1024,768],[768,1024],[390,844],[320,740]]){await page.setViewportSize({width:w,height:h});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`tests/app-home-${w}.png`,fullPage:true});}
 await page.setViewportSize({width:1366,height:900});await page.locator('.shell-unit-art-card[href="#/unit/3"]').click();await page.waitForSelector('[data-lesson]');assert.equal(await page.locator('#brandHome b').textContent(),'Toy Town');
 await page.locator('[data-lesson="1"]').click();await page.waitForSelector('[data-activity]');assert.equal(await page.locator('.learning-zone>.shell-integrated-progress').count(),1);
 await page.locator('[data-activity="u3learn"]').click();await page.waitForFunction(()=>currentGame==='u3learn');assert(await page.locator('.reward-game-hud').isVisible());
 await page.locator('[data-shell-action="home"]').click();await page.waitForSelector('[data-continue]');assert.match(await page.locator('[data-continue]').getAttribute('href'),/unit\/3\/lesson\/1.*activity=u3learn/);
 await page.reload();await page.waitForSelector('[data-continue]');await page.locator('[data-continue]').click();await page.waitForFunction(()=>currentGame==='u3learn');
 await page.locator('[data-shell-action="back"]').click();await page.waitForSelector('#lessonApp .learning-zone');assert.equal(await page.locator('[data-continue]').count(),1);
 await page.evaluate(()=>LearningApp.go('#/unit/3'));assert.equal(await page.locator('[data-lesson="1"]').getAttribute('aria-current'),'step');await page.screenshot({path:'tests/app-lessons.png',fullPage:true});
 await page.evaluate(()=>LearningApp.go('#/'));await page.locator('[data-manage-learner]').click();await page.locator('#rewardNewStudent input').fill('Mai');await page.locator('#rewardNewStudent button').click();await page.locator('[data-reward-close]').click();
 assert.equal(await page.locator('.shell-welcome h1').textContent(),'Hello, Mai!');assert.equal(await page.locator('[data-continue]').count(),0);
 await page.evaluate(()=>{LearningApp.go('#/unit/2/lesson/3?mode=practice&activity=eeintro');});await page.waitForFunction(()=>currentGame==='eeintro');await page.locator('[data-shell-action="home"]').click();await page.waitForSelector('[data-continue]');assert.match(await page.locator('[data-continue]').getAttribute('href'),/eeintro/);
 await page.locator('[data-manage-learner]').click();await page.selectOption('#rewardStudent','default');await page.locator('[data-reward-close]').click();assert.match(await page.locator('[data-continue]').getAttribute('href'),/u3learn/);
 await page.locator('[data-continue]').click();await page.waitForFunction(()=>currentGame==='u3learn');await page.evaluate(()=>LearningRewards.open());assert(await page.locator('#rewardStudent').isDisabled());await page.locator('[data-reward-close]').click();await page.locator('[data-shell-action="home"]').click();
 await page.locator('.shell-letter-world').click();await page.waitForSelector('#spaceLetters');assert.equal(await page.locator('#brandHome b').textContent(),'Letter Land');
 await page.evaluate(()=>LearningProgress.remember('#/unit/99/lesson/6?activity=gone'));await page.evaluate(()=>LearningApp.go('#/'));assert.equal(await page.locator('[data-continue]').count(),0);
 await page.evaluate(()=>{LearningProgress.remember('#/unit/3/lesson/1?mode=practice&activity=u3learn');LearningRewards.record({unit:3,lesson:1,activity:'u3learn',stars:2});LearningApp.go('#/');});await page.reload();await page.waitForSelector('[data-continue]');await page.screenshot({path:'tests/app-home-returning.png',fullPage:true});
 await page.locator('#settingsBtn').click();assert(await page.locator('#manageLearners').isVisible());await page.locator('#manageLearners').click();assert(await page.locator('.reward-book').isVisible());await page.locator('[data-reward-close]').click();
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();console.log('PASS app experience: fresh/returning Home, resume after reload, isolated learner history, invalid history, current lesson, progress integration, Teacher learner control, Letter Land, in-game stars and five responsive sizes.');
})().catch(e=>{console.error(e);process.exit(1)});
