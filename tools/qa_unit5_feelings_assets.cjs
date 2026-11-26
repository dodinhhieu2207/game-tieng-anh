// Native browser media/layout verification for the standalone asset inspector.
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/unit5/lesson1'),evidence=path.join(root,'docs/game-plans/unit5-feelings-assets/evidence');fs.mkdirSync(evidence,{recursive:true});
const url='http://127.0.0.1:8775/assets/unit5/lesson1/preview.html';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const context=await browser.newContext({viewport:{width:1366,height:1000},recordVideo:{dir:path.join(evidence,'video'),size:{width:1366,height:1000}}});
 const p=await context.newPage(),errors=[],missing=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url())});
 await p.goto(url);await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>window.AssetStudio&&Object.keys(AssetStudio.bank).length===28);
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'))),audio=JSON.parse(fs.readFileSync(path.join(dir,'audio/manifest.json')));
 for(const item of manifest.assets){assert(fs.existsSync(path.join(dir,item.file)),item.file);assert.strictEqual(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,item.file))).digest('hex'),item.sha256,item.file)}
 const layouts=[];
 for(const width of [320,390,768,1024,1366]){
  await p.setViewportSize({width,height:1000});await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,20))}scrollTo(0,0)});
  await p.waitForFunction(()=>[...document.images].filter(x=>x.hasAttribute('src')).every(x=>x.complete&&x.naturalWidth>0));
  const metrics=await p.evaluate(()=>({viewport:innerWidth,body:document.documentElement.scrollWidth,images:document.images.length,font:document.fonts.check('20px AppOutfit'),badImages:[...document.images].filter(x=>x.hasAttribute('src')&&!x.naturalWidth).length}));
  assert(metrics.body<=width+1,JSON.stringify(metrics));assert(metrics.font);layouts.push(metrics);
  await p.screenshot({path:path.join(evidence,`preview-${width}.png`),fullPage:true});
 }
 await p.setViewportSize({width:1366,height:1000});
 const models=[];
 for(const word of manifest.words){
  await p.locator(`[data-word="${word}"]`).click();await p.locator('#motion').click();await p.waitForTimeout(250);
  const a=await p.locator('.actor').screenshot();await p.waitForTimeout(370);const b=await p.locator('.actor').screenshot();
  assert(!a.equals(b),'GIF did not visibly change: '+word);
  await p.evaluate(()=>{window.wordLights=[];window.observer?.disconnect();window.observer=new MutationObserver(()=>{const lit=[...document.querySelectorAll('.sentence .lit')].map(e=>e.textContent);if(lit.length)window.wordLights.push(lit.join(' '))});window.observer.observe(document.querySelector('.sentence'),{subtree:true,attributes:true,attributeFilter:['class']})});
  await p.locator('#sentence').click();await p.waitForFunction(()=>AssetStudio.audio&&!AssetStudio.audio.paused);await p.waitForFunction(()=>!AssetStudio.audio,{timeout:10000});
  const lights=await p.evaluate(()=>window.wordLights);assert(lights.some(x=>x.toLowerCase().includes(word)),'No target word light: '+word);assert(lights.some(x=>/he|she/i.test(x)),'No prefix light: '+word);
  models.push({word,nativeGifChanges:true,wordLights:[...new Set(lights)]});
 }
 // Every clip is decoded and played by the browser; no mocked Audio API.
 const nativeAudio=await p.evaluate(async clips=>{const out=[];for(const [key,c] of Object.entries(clips)){await new Promise((resolve,reject)=>{const a=new Audio(c.src.replace('assets/unit5/lesson1/',''));a.playbackRate=3;let played=false;const timer=setTimeout(()=>reject(new Error('Timeout '+key)),10000);a.onplaying=()=>played=true;a.onerror=()=>reject(new Error('Audio failed '+key));a.onended=()=>{clearTimeout(timer);out.push({key,played,duration:a.duration});resolve()};a.play().catch(reject)})}return out},audio.clips);assert(nativeAudio.every(a=>a.played&&a.duration>0));
 await p.locator('#sentence').click();await p.waitForFunction(()=>AssetStudio.audio&&!AssetStudio.audio.paused);await p.locator('#mute').click();assert(await p.evaluate(()=>AssetStudio.audio===null));assert.strictEqual(await p.locator('.sentence .lit').count(),0);
 await p.locator('#mute').click();await p.locator('#sentence').click();await p.waitForFunction(()=>AssetStudio.audio&&!AssetStudio.audio.paused);await p.evaluate(()=>AssetStudio.suspend());assert(await p.evaluate(()=>AssetStudio.audio===null));
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('#motion').click();assert((await p.locator('.actor').getAttribute('src')).endsWith('idle.webp'));
 // Failure must produce a visible retry status, not silent TTS substitution.
 await p.route('**/audio/words/happy.mp3',r=>r.fulfill({status:404,body:'QA simulated unavailable file'}));await p.locator('[data-word="happy"]').click();await p.locator('#word').click();await p.waitForFunction(()=>document.querySelector('.status').textContent.includes('Could not play'));
 await p.unroute('**/audio/words/happy.mp3');
 // Capture useful assets rather than one very long catalogue screenshot.
 await p.emulateMedia({reducedMotion:'no-preference'});await p.locator('[data-word="hungry"]').click();await p.locator('.scene').screenshot({path:path.join(evidence,'scene-hungry.png')});await p.locator('.letters').screenshot({path:path.join(evidence,'letters-hungry.png')});await p.locator('#props').screenshot({path:path.join(evidence,'props.png')});
 const result={scope:'Standalone asset preview, not integrated game',assetsVerified:manifest.assets.length,layouts,models,nativeAudio,nativeAudioCount:nativeAudio.length,muteStopsAudio:true,suspendStopsAudio:true,reducedMotionStill:true,audioFailureVisible:true,errors,missing:missing.filter(x=>!x.includes('/audio/words/happy.mp3')),humanListeningReview:false,classroomOutcomes:'NOT_MEASURED',publicDeployment:false,video:await p.video().path()};
 fs.writeFileSync(path.join(evidence,'browser-qa.json'),JSON.stringify(result,null,2));assert.deepStrictEqual(errors,[]);assert.deepStrictEqual(result.missing,[]);await context.close();await browser.close();console.log('PASS',result.assetsVerified,'asset hashes, 5 widths, 6 native GIFs, 28 native audio clips, read-along/mute/reduced motion/error states');
})().catch(e=>{console.error(e);process.exit(1)});
