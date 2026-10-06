const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1400,height:1000}});
 const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 async function action(name){if(name!=='back')await page.locator('.app-game-more>summary').click();await page.locator('[data-shell-action="'+name+'"]').click();}
 await page.goto('http://127.0.0.1:8765/index.html');
 await page.waitForSelector('#lessonApp h1');assert.equal(await page.locator('#lessonApp h1').textContent(),"Ready to play?");
 await page.locator('#lessonApp a[href="#/unit/3"]').click();await page.waitForSelector('#lessonApp [data-lesson]');assert.equal(await page.locator('#lessonApp [data-lesson]').count(),6);
 await page.screenshot({path:'tests/navigation-unit3.png',fullPage:true});
 await page.locator('#lessonApp [data-lesson="1"]').click();await page.waitForSelector('#lessonApp [data-activity]');assert.equal(await page.locator('#lessonApp [data-activity]').count(),7);assert.equal(await page.locator('#lessonApp .hero h1').textContent(),'Toy Town');
 await page.screenshot({path:'tests/navigation-unit3-lesson1.png',fullPage:true});
 await page.locator('[data-start-class]').click();await page.waitForSelector('#gameScreen.app-managed');
 assert(page.url().includes('mode=class'));assert(page.url().includes('activity=u3learn'));
 await action('next');await page.waitForFunction(()=>currentGame==='u3catch');
 await action('drawer');await page.locator('[data-jump="u3colour"]').click();await page.waitForFunction(()=>currentGame==='u3colour');
 await page.locator('[data-shell-action="back"]').click();await page.waitForSelector('#lessonApp [data-start-class]');
 await page.goBack();await page.waitForFunction(()=>currentGame==='u3colour');
 await page.reload();await page.waitForFunction(()=>currentGame==='u3colour');
 await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice'));
 assert.equal(await page.locator('#lessonApp [data-activity]').count(),6);
 const sequence=await page.evaluate(()=>LearningConfig.units.find(u=>u.id===3).lessons[1].activities.map(a=>a.title));
 assert.deepEqual(sequence,['Meet the Pattern','Question Detective','Match the Answer','Build the Sentence','Listen & Decide','Talk to Toy Buddy']);
 await page.locator('[data-start-class]').click();await page.waitForSelector('.l2-scene');
 await action('drawer');await page.locator('[data-jump="talk-to-toy-buddy"]').click();
 await page.waitForSelector('.toy-buddy[data-state="LISTENING"]');
 await page.locator('[data-teacher]').click();await page.locator('[data-validate="correct"]').click();await page.waitForFunction(()=>Unit3Lesson2.current()?.index===1);
 await page.locator('[data-shell-action="back"]').click();
 await page.waitForSelector('#lessonApp [data-activity="talk-to-toy-buddy"][data-status="played"]');
 await page.evaluate(()=>LearningApp.go('#/unit/2'));assert.equal(await page.locator('[data-lesson]').count(),6);
 assert.equal(await page.locator('#lessonApp .shell-lesson-art').count(),6);
 assert.equal(await page.locator('#lessonApp .app-journey-heading').count(),1);
 await page.waitForFunction(()=>[...document.querySelectorAll('#lessonApp .shell-lesson-art')].every(i=>i.complete&&i.naturalWidth>0));
 assert(await page.locator('[data-lesson="6"]').textContent().then(t=>t.includes('Coming soon')));
 await page.screenshot({path:'tests/navigation-unit2.png',fullPage:true});
 for(const id of [1,2,3,4,5,6]){await page.evaluate(n=>LearningApp.go('#/unit/2/lesson/'+n),id);await page.waitForSelector('#lessonApp .zone-title-row h2');}
 const coverage=await page.evaluate(()=>{const mapped=LearningConfig.units.flatMap(u=>u.lessons.flatMap(l=>l.activities.filter(a=>a.game).map(a=>a.game)));const extra=LearningConfig.migration.map(a=>a.game);return Object.keys(games).filter(g=>!mapped.includes(g)&&!extra.includes(g)&&!LearningConfig.independentGames.includes(g));});assert.deepEqual(coverage,[]);
 // Exercise all original game entry points via the new adapter, with their startup callbacks.
 const keys=await page.evaluate(()=>Object.keys(games));
 for(const game of keys){await page.evaluate(k=>openGame(k),game);await page.waitForTimeout(420);assert(await page.locator('#gameStage').textContent(),game+' did not render');}
 await page.evaluate(()=>LearningApp.go('#/letters'));assert(await page.locator('#spaceLetters').isVisible());assert(await page.locator('.app-bottom-nav').isVisible());
 await page.evaluate(()=>LearningApp.go('#/unit/3'));await page.waitForSelector('#lessonApp [data-lesson]');
 
 await page.evaluate(()=>LearningApp.go('#/unit/3/lesson/1?mode=practice&activity=u3learn'));
 await page.waitForSelector('[data-shell-action="sound"]',{state:'attached'});
 await page.evaluate(()=>{window.testClip=new Audio('assets/unit3/audio/robot.mp3');window.stalePrompt=false;autoSpeak(()=>{window.stalePrompt=true;},40);});
 await action('sound');assert(await page.evaluate(()=>testClip.muted));
 await action('sound');assert(!(await page.evaluate(()=>testClip.muted)));
 await page.evaluate(()=>{window.stalePrompt=false;autoSpeak(()=>{window.stalePrompt=true;},40);LearningApp.go('#/unit/2');});
 await page.waitForTimeout(100);assert(!(await page.evaluate(()=>stalePrompt)),'Detached automatic prompt fired');
 await page.evaluate(()=>{LearningConfig.units.push({id:4,title:'Future Unit',space:'unit4',thumbnail:'assets/unit3/toys/teddy.webp',lessons:Array.from({length:6},(_,i)=>({id:i+1,title:null,targetLanguage:[],activities:[],locked:false}))});LearningApp.go('#/unit/4');});
 assert.equal(await page.locator('#lessonApp [data-lesson]').count(),6);await page.evaluate(()=>LearningApp.go('#/unit/4/lesson/1'));await page.waitForSelector('#lessonApp .shell-empty');
 await page.evaluate(()=>LearningApp.go('#/unit/3'));
await page.setViewportSize({width:820,height:1180});await page.screenshot({path:'tests/navigation-tablet.png',fullPage:true});
 assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'Tablet overflow');
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'tests/navigation-mobile.png',fullPage:true});
 assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'Mobile overflow');
 await page.goto('file:///'+require('node:path').resolve('index.html').replaceAll('\\','/')+'#/unit/2/lesson/3');await page.waitForSelector('#lessonApp [data-activity="eeintro"]');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 console.log('PASS: config, six lessons, confirmed Unit 2 mapping, Unit 3 template, exact Lesson 2 order, Class/Practice, drawer jumps, Browser Back, route refresh, progress evidence, all '+keys.length+' existing games, Letter Land, tablet/mobile, file://, no console or asset errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
