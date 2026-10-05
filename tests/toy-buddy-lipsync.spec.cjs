const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();await page.goto('http://127.0.0.1:8765/index.html');
 await page.evaluate(()=>{const r=document.createElement('div');r.style.cssText='position:fixed;left:300px;top:150px;width:400px;background:#e8f8ff;z-index:9999';document.body.append(r);window.actor=new ToyBuddy(r);window.clip=Unit3Lesson2Clips.clips['feedback/say_the_whole_sentence'];actor.ask(clip.src,{cues:clip.cues});actor.audio.playbackRate=.1;});
 await page.waitForFunction(()=>actor.root.classList.contains('tb-speaking'));
 const cues=await page.evaluate(()=>[...new Map(clip.cues.filter(c=>c.id!==0).map(c=>[c.id,c])).values()]);assert(cues.length>=4);
 const shapes=[];
 for(const cue of cues){await page.evaluate(async c=>{actor.audio.pause();actor.audio.currentTime=(c.ms+5)/1000;await actor.audio.play();},cue);await page.waitForFunction(id=>actor.root.dataset.viseme===String(id),cue.id);shapes.push(await page.evaluate(()=>actor.mouth.querySelector('.tb-mouth-opening').getAttribute('d')));await page.locator('.toy-buddy').screenshot({path:'tests/lesson2-viseme-'+cue.id+'.png'});}
 assert(new Set(shapes).size>=4);
 await page.evaluate(()=>actor.audio.pause());assert(await page.evaluate(()=>actor.root.dataset.viseme==='0'&&actor.animationFrame===null));
 await page.evaluate(()=>actor.destroy());assert(await page.evaluate(()=>actor.animationFrame===null));
 // The timeline was extracted from the final MP3, and ends in a silent mouth shape.
 assert(await page.evaluate(()=>Object.values(Unit3Lesson2Clips.clips).every(c=>c.cues.length>=2&&c.cues[0].ms===0&&c.cues.at(-1).id===0&&c.cues.at(-1).ms<=c.duration*1000+40)));
 await browser.close();console.log('PASS lip sync: waveform cues for all 25 MP3s, distinct shapes, seek, playback-rate sync, silence and cleanup');
})().catch(e=>{console.error(e);process.exit(1)});
