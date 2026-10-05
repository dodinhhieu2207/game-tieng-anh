const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();
 await page.goto('http://127.0.0.1:8765/index.html');
 await page.evaluate(()=>{const root=document.createElement('div');root.style.cssText='width:250px';document.body.append(root);window.testBuddy=new ToyBuddy(root);});
 await page.waitForFunction(()=>testBuddy.root.classList.contains('tb-blinking'),null,{timeout:6500});
 for(const state of ['IDLE','ASKING','TALKING','LISTENING','THINKING','CORRECT','RETRY','CELEBRATE','SUCCESS']){await page.evaluate(s=>testBuddy.setState(s),state);assert.equal(await page.evaluate(()=>testBuddy.state),state);}
 await page.evaluate(()=>testBuddy.ask('assets/toy-buddy/does-not-exist.mp3'));
 await page.waitForFunction(()=>testBuddy.state==='IDLE');
 await page.evaluate(()=>{const clip=Unit3Lesson2Clips.clips['questions/is_it_a_robot'];window.audioResult=testBuddy.ask(clip.src,{cues:clip.cues});});
 await page.waitForFunction(()=>testBuddy.root.classList.contains('tb-speaking'));
 await page.evaluate(()=>testBuddy.audio.pause());await page.waitForTimeout(2400);
 assert(await page.evaluate(()=>testBuddy.state==='ASKING'&&!testBuddy.root.classList.contains('tb-speaking')));
 await page.evaluate(()=>testBuddy.audio.play());await page.waitForFunction(()=>testBuddy.state==='LISTENING');assert(await page.evaluate(()=>audioResult));
 await page.evaluate(()=>{const c=Unit3Lesson2Clips.clips['questions/is_it_a_plane'];window.cancelled=testBuddy.ask(c.src,{cues:c.cues});testBuddy.destroy();});
 assert.equal(await page.evaluate(()=>cancelled),false);
 assert(await page.evaluate(()=>testBuddy.destroyed&&testBuddy.timers.size===0&&testBuddy.audio===null&&testBuddy.animationFrame===null));
 await browser.close();console.log('PASS actor: automatic blink, all states, error recovery, real audio ended, pause, cancelled promise and cleanup');
})().catch(e=>{console.error(e);process.exit(1)});
