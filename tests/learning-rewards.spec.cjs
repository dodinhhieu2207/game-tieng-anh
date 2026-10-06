const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=4;return play.call(this);};});
 await page.goto(process.env.REWARDS_TEST_BASE||'http://127.0.0.1:8765/index.html');await page.waitForSelector('#rewardOpen');
 await page.evaluate(()=>{LearningRewards.record({unit:2,lesson:1,activity:'spin',stars:2});});await page.waitForSelector('.reward-toast:not([hidden])');assert.equal(await page.locator('#rewardOpen b').textContent(),'2 Stars');
 await page.evaluate(()=>LearningRewards.record({unit:2,lesson:1,activity:'spin',stars:1}));assert.equal(await page.evaluate(()=>LearningRewards.totals().stars),2);
 await page.evaluate(()=>LearningRewards.record({unit:2,lesson:1,activity:'spin',stars:3}));assert.equal(await page.evaluate(()=>LearningRewards.totals().stars),3);assert.equal(await page.evaluate(()=>LearningRewards.record({unit:2,lesson:1,activity:'spin',stars:NaN})),false);
 await page.reload();await page.waitForSelector('#rewardOpen');assert.equal(await page.locator('#rewardOpen b').textContent(),'3 Stars');
 await page.locator('#rewardOpen').click();assert.equal(await page.locator('.reward-unit').count(),2);assert.equal(await page.locator('.reward-lesson').count(),12);assert.equal(await page.locator('.reward-badges .earned').count(),1);
 await page.locator('.reward-lesson').first().locator('summary').click();assert.equal(await page.locator('.reward-lesson').first().locator('.reward-star').count(),4);assert.match(await page.locator('.reward-unit').first().textContent(),/Story.*Activities coming soon/s);
 await page.screenshot({path:'tests/reward-book-desktop.png',fullPage:true});
 // Separate learner books retain both the new student's and legacy student's records.
 await page.locator('#rewardNewStudent input').fill('Linh');await page.locator('#rewardNewStudent button').click();assert.equal(await page.locator('#rewardOpen b').textContent(),'0 Stars');
 await page.locator('[data-reward-close]').click();await page.evaluate(()=>LearningRewards.record({unit:3,lesson:2,activity:'talk-to-toy-buddy',stars:2}));assert.equal(await page.evaluate(()=>LearningRewards.totals().stars),2);
 await page.locator('#rewardOpen').click();await page.selectOption('#rewardStudent','default');assert.equal(await page.evaluate(()=>LearningRewards.totals().stars),3);
 await page.locator('[data-reward-close]').click();
 // Future game registration automatically appears: same config and record API.
 await page.evaluate(()=>{LearningConfig.units[1].lessons[5].activities.push({id:'future-story',game:'future-story',title:'Future story test'});LearningRewards.record({unit:3,lesson:6,activity:'future-story',stars:3});});await page.locator('#rewardOpen').click();assert.match(await page.locator('#reward-unit-3').textContent(),/Future story test/);await page.locator('[data-reward-close]').click();
 await page.evaluate(()=>LearningApp.go('#/unit/2/lesson/1?mode=practice&activity=missing'));await page.waitForFunction(()=>currentGame==='missing');
 await page.evaluate(()=>games.missing.renderVictory());await page.waitForFunction(()=>LearningProgress.get('2/1/missing').stars===3);assert.equal(await page.evaluate(()=>LearningProgress.get('2/1/missing').completed),true);
 await page.locator('#rewardOpen').click();assert(await page.locator('#rewardStudent').isDisabled());assert.equal(await page.locator('#rewardNewStudent').count(),0);await page.locator('[data-reward-close]').click();
 await page.evaluate(()=>LearningApp.go('#/'));await page.waitForSelector('#lessonApp h1');await page.locator('#rewardOpen').click();
 for(const [width,height] of [[1366,900],[390,844],[320,740]]){
  await page.setViewportSize({width,height});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const b=await page.locator('.reward-book').boundingBox();assert(b.x>=0&&b.x+b.width<=width);assert(b.height<=height);await page.screenshot({path:`tests/reward-book-${width}.png`,fullPage:true});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-reward-close]').click();await page.evaluate(()=>LearningRewards.record({unit:2,lesson:2,activity:'sentence',stars:2}));await page.waitForSelector('.reward-toast:not([hidden])');assert.equal(await page.locator('.reward-toast').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.screenshot({path:'tests/reward-earned.png',fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();console.log('PASS rewards: best-score persistence, replay deduplication, invalid-score rejection, learner isolation, legacy book preservation, 12 lessons, future game registration, real Unit 2 victory bridge, mid-game learner lock, 320/390 desktop layouts, reduced motion and no asset/JS errors.');
})().catch(e=>{console.error(e);process.exit(1)});
