/* Browser contract: direct canvas input, editable checks, six real Higgs reads. */
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const BASE=process.env.FAMILY_PUZZLE_BASE||'http://127.0.0.1:8773';
const URL=BASE+'/index.html?qa=family-puzzle#/unit/4/lesson/2?mode=practice&activity=family-sentence-puzzle';
async function ready(page){await page.goto(URL);await page.locator('.fsp-board canvas').waitFor();await page.waitForTimeout(150)}
async function words(page){return page.locator('.fsp-word-buttons button').allTextContents()}
async function point(page,x,y){await page.locator('.fsp-board').scrollIntoViewIfNeeded();const box=await page.locator('.fsp-board').boundingBox();const virtual=box.width<650?600:1000;return {x:box.x+x*box.width/virtual,y:box.y+y*box.width/virtual}}
async function canvasDrag(page,from,to){const a=await point(page,...from),b=await point(page,...to);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:12});await page.mouse.up();await page.waitForTimeout(300)}
async function canvasTap(page,xy){const p=await point(page,...xy);if(await page.evaluate(()=>navigator.maxTouchPoints>0))await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);await page.waitForTimeout(80)}
async function placeButtons(page,word,slot){const w=await words(page),id=w.indexOf(word);assert.ok(id>=0);await page.locator(`[data-piece="${id}"]`).click();await page.locator(`[data-position="${slot}"]`).click()}

(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader'],executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().includes('family-sentence-puzzle'))missing.push(r.url())});
 await ready(page);const initial=await words(page),target=initial.find(w=>!['This','is','my'].includes(w));
 assert.equal(await page.locator('.fsp').getAttribute('data-level'),'1');
 assert.equal(await page.locator('.fsp').getAttribute('data-guide'),'true');
 assert.match(await page.locator('.fsp-head').evaluate(e=>getComputedStyle(e).backgroundImage),/title-plaque.webp/);
 assert.match(await page.locator('[data-fsp=check]').evaluate(e=>getComputedStyle(e).backgroundImage),/button-gold.webp/);
 assert.equal(await page.locator('[data-fsp=listen] img').getAttribute('src'),'assets/family-sentence-puzzle/icon-listen.svg');
 const home=id=>[155+690/3*id,667],slot=i=>[500+(i-1.5)*260*220/300,475];
 await canvasDrag(page,home(initial.indexOf('This')),slot(0));
 assert.match(await page.locator('[data-position="0"]').textContent(),/This/);
 await canvasTap(page,home(initial.indexOf('is')));await page.screenshot({path:'tests/family-puzzle-selection.png',fullPage:true});await canvasTap(page,slot(1));
 assert.match(await page.locator('[data-position="1"]').textContent(),/is/);
 await page.locator('.fsp-alt summary').click();
 await placeButtons(page,'my',2);await placeButtons(page,target,3);
 await canvasDrag(page,slot(0),slot(1));
 assert.match(await page.locator('[data-position="0"]').textContent(),/is/);
 assert.match(await page.locator('[data-position="1"]').textContent(),/This/);
 await page.locator('[data-fsp=check]').click();
 assert.equal(await page.locator('[data-position="2"]').isDisabled(),true);
 assert.equal(await page.locator('[data-position="3"]').isDisabled(),true);
 await page.locator('.fsp[data-phase=arrange]').waitFor();
 assert.equal(await page.locator('[data-position="0"]').isDisabled(),false);
 await page.screenshot({path:'tests/family-puzzle-retry.png',fullPage:true});
 await page.locator('.fsp[data-phase=arrange]').waitFor();
 assert.match(await page.locator('[data-position="0"]').textContent(),/empty/);
 assert.match(await page.locator('[data-position="1"]').textContent(),/empty/);
 await placeButtons(page,'This',0);await placeButtons(page,'is',1);
 await page.locator('[data-fsp=check]').click();await page.locator('.fsp[data-phase=solved]').waitFor();
 assert.equal(await page.locator('.fsp-gallery figure').count(),1);
 console.log('PASS canvas drag, tap, occupied swap, partial check, locked correct pieces, real Higgs completion');

 await page.evaluate(()=>{window.__puzzleEvents=0;document.addEventListener('learning:activity-completed',e=>{if(e.detail.game==='u4familypuzzle')window.__puzzleEvents++})});
 for(let round=1;round<6;round++){
  await page.locator('[data-fsp=next]').click();const current=await words(page);
  const level=round<2?1:round<4?2:3;
  assert.equal(await page.locator('.fsp').getAttribute('data-level'),String(level));
  assert.equal(await page.locator('.fsp').getAttribute('data-guide'),String(level===1));
  assert.equal(await page.locator('[data-fsp=hint]').isVisible(),level===1);
  if(round===1||round===2||round===4)await page.screenshot({path:`tests/family-puzzle-level-${round+1}.png`,fullPage:true});
  const src=await page.locator('.fsp-fallback img').getAttribute('src'),word=src.split('/').pop().replace('.png','');
  for(const [i,text]of ['This','is','my',word].entries())await placeButtons(page,text,i);
  assert.equal(current.length,round<4?4:5);
  await page.locator('[data-fsp=check]').click();await page.locator('.fsp[data-phase=solved]').waitFor();
 }
 await page.locator('[data-fsp=next]').click();assert.equal(await page.locator('.fsp-finale').isVisible(),true);
 assert.equal(await page.evaluate(()=>window.__puzzleEvents),1);
 assert.equal(await page.locator('.fsp-family figure').count(),6);
 assert.match(await page.locator('.fsp-album-pages').evaluate(e=>getComputedStyle(e).backgroundImage),/finale-album.webp/);
 await page.screenshot({path:'tests/family-puzzle-finale-1366.png',fullPage:true});
 await page.setViewportSize({width:390,height:900});await page.waitForTimeout(200);
 assert.match(await page.locator('.fsp-album-pages').evaluate(e=>getComputedStyle(e).backgroundImage),/finale-album-mobile.webp/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'tests/family-puzzle-finale-390.png',fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 console.log('PASS six sentences, distractors, gallery and one completion event');
 await page.close();

 for(const width of [320,390,768,1024,1366]){
  const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',hasTouch:width===390,isMobile:width===390});await ready(p);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.ok((await p.locator('.fsp-board').boundingBox()).height>250);
  if(width===390||width===1366)await p.screenshot({path:`tests/family-puzzle-${width}.png`,fullPage:true});
  if(width===390){
   const list=await words(p);const start=[list.indexOf('This')%2===0?165:435,850+Math.floor(list.indexOf('This')/2)*145];
   await canvasTap(p,start);await canvasTap(p,[300-260*220/600,480]);assert.match(await p.locator('[data-position="0"]').textContent(),/This/);
   await p.setViewportSize({width:1024,height:900});await p.waitForTimeout(200);assert.match(await p.locator('[data-position="0"]').textContent(),/This/);
  }
  console.log('PASS layout',width);await p.close();
 }
 const fallback=await browser.newPage({viewport:{width:390,height:844}});
 await fallback.route('**/shared/vendor/pixi/pixi.min.js*',r=>r.abort());await fallback.goto(URL);
 await fallback.locator('.fsp-fallback:visible').waitFor();assert.equal(await fallback.locator('.fsp-alt').getAttribute('open')!==null,true);
 await fallback.locator('[data-piece="0"]').focus();await fallback.keyboard.press('Enter');
 assert.match(await fallback.evaluate(()=>document.activeElement.dataset.position),/^[0-3]$/);
 await fallback.keyboard.press('Enter');assert.notEqual(await fallback.locator('[data-position="0"]').textContent(),'1 · empty');
 console.log('PASS renderer fallback and keyboard focus');await fallback.close();

 const audio=await browser.newPage({viewport:{width:1024,height:900}});
 await audio.addInitScript(()=>{window.__puzzleAudio=[];const NativeAudio=window.Audio;window.Audio=function(src){const a=new NativeAudio(src);if(/family-album\/audio|robot-workshop\/audio|unit4\/lesson1\/audio/.test(String(src)))window.__puzzleAudio.push(a);return a}});
 await ready(audio);await audio.locator('.fsp-alt summary').click();await audio.locator('[data-piece="0"]').click();await audio.waitForTimeout(100);
 assert.ok(await audio.evaluate(()=>window.__puzzleAudio.some(a=>/robot-workshop|unit4/.test(a.src))));
 await audio.locator('[data-fsp=listen]').click();await audio.waitForTimeout(150);
 assert.ok(await audio.evaluate(()=>window.__puzzleAudio.some(a=>!a.paused)));
 await audio.locator('summary[aria-label="Game controls"]').click();await audio.locator('[data-shell-action=sound]').click();
 assert.ok(await audio.evaluate(()=>window.__puzzleAudio.every(a=>a.paused)));
 await audio.locator('summary[aria-label="Game controls"]').click();
 await audio.locator('[data-shell-action=sound]').click();
 await audio.locator('[data-fsp=listen]').click();await audio.waitForTimeout(100);
 await audio.evaluate(()=>LearningApp.go('/unit/4/lesson/2?mode=practice'));await audio.waitForTimeout(200);
 assert.ok(await audio.evaluate(()=>window.__puzzleAudio.every(a=>a.paused)));
 assert.equal(await audio.locator('.fsp-board canvas').count(),0);
 console.log('PASS mute, playback and leave cleanup');await audio.close();
 const failure=await browser.newPage({viewport:{width:390,height:844}});
 await failure.route('**/assets/family-album/audio/*.mp3',r=>r.abort());await ready(failure);
 await failure.locator('.fsp-alt summary').click();
 const targetSrc=await failure.locator('.fsp-fallback img').getAttribute('src'),targetWord=targetSrc.split('/').pop().replace('.png','');
 for(const [i,text]of ['This','is','my',targetWord].entries())await placeButtons(failure,text,i);
 await failure.locator('[data-fsp=check]').click();await failure.locator('.fsp[data-phase=solved]').waitFor();
 assert.match(await failure.locator('.fsp-status').textContent(),/retry the sound/);
 assert.equal(await failure.locator('[data-fsp=next]').isVisible(),true);
 console.log('PASS audio failure is retryable without trapping the round');await failure.close();
 const catalog=await browser.newPage();await catalog.goto(BASE+'/assets/family-sentence-puzzle/catalog.html');
 await catalog.waitForFunction(()=>document.querySelectorAll('.card img').length===26&&[...document.querySelectorAll('.card img')].every(img=>img.complete&&img.naturalWidth>0));
 assert.equal(await catalog.locator('.card').count(),26);
 console.log('PASS complete 26-graphic asset catalogue');await catalog.close();
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
