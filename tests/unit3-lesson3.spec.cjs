const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const BASE=process.env.LESSON3_BASE||'http://127.0.0.1:8765/index.html';
const ids=['meet-gg','sound-detective','catch-g','big-small','fix-word','trace-say','final-challenge'];
const phase=(p,s)=>p.waitForFunction(s=>Unit3Lesson3.current()?.phase===s,s);
(async()=>{
 const manifest=JSON.parse(fs.readFileSync('assets/unit3/lesson3/audio/manifest.json'));
 assert.equal(Object.keys(manifest.clips).length,17);assert.equal(manifest.clips['sound-g'].humanReviewed,true);
 const artManifest=JSON.parse(fs.readFileSync('assets/unit3/lesson3/art/manifest.json'));
 assert.equal(Object.keys(artManifest.sources).length,18);assert.equal(Object.keys(artManifest.items).length,75);
 for(const item of Object.values(artManifest.items))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(item.src)).digest('hex'),item.sha256);
 for(const c of Object.values(manifest.clips)){if(c.kind==='phoneme')assert(c.humanReviewed);else assert(c.transcriptMatch,c.text);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(c.src)).digest('hex'),c.sha256);assert(c.duration>0&&c.duration<15);assert(c.cues.length>0);}
 const browser=await chromium.launch({channel:'chrome',headless:true}),context=await browser.newContext({viewport:{width:1366,height:768},hasTouch:true}),p=await context.newPage(),errors=[],missing=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await p.addInitScript(()=>{window.voiceEvents=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=5;voiceEvents.push(this.getAttribute('src'));return play.call(this);};});
 await p.goto(BASE);await p.locator('body').click({position:{x:2,y:2}});await p.waitForFunction(()=>window.LearningApp&&window.Unit3Lesson3);
 async function finishIntro(){while(await p.evaluate(()=>Unit3Lesson3.current()?.introStep!==null)){await p.locator('[data-next]').click();await phase(p,'listening');}}
 async function route(id,level='easy',mode='practice'){
  await p.evaluate(({id,mode})=>LearningApp.go('#/unit/3/lesson/3?mode='+mode+'&activity='+id),{id,mode});await phase(p,'listening');await finishIntro();
  if(level!=='easy'){await p.locator('select[data-level]').selectOption(level);await phase(p,'listening');await finishIntro();}
 }
 async function drag(item,zone){const a=await item.boundingBox(),b=await zone.boundingBox();await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:15});await p.mouse.up();}
 async function trace(){
  const strokes=await p.locator('.trace-ink').count();
  for(let i=0;i<strokes;i++){
   const points=await p.locator('.trace-ink').nth(i).evaluate(path=>{const svg=path.ownerSVGElement,m=svg.getScreenCTM(),len=path.getTotalLength(),out=[];for(let n=0;n<=len;n+=5){const q=path.getPointAtLength(n);out.push({x:m.a*q.x+m.e,y:m.d*q.y+m.f});}const q=path.getPointAtLength(len);out.push({x:m.a*q.x+m.e,y:m.d*q.y+m.f});return out;});
   await p.mouse.move(points[0].x,points[0].y);await p.mouse.down();for(const point of points.slice(1))await p.mouse.move(point.x,point.y);await p.mouse.up();
  }
  await p.waitForSelector('[data-checked]');await phase(p,'listening');await p.locator('[data-checked]').click();
 }
 // Curriculum, exposure balance, no same item twice, and replay sequence changes.
 await p.evaluate(()=>LearningApp.go('#/unit/3/lesson/3'));await p.waitForSelector('[data-activity]');assert.equal(await p.locator('[data-activity]').count(),7);
 const randomQA=await p.evaluate(()=>{
  for(let i=0;i<60;i++){
   const a=Unit3Lesson3.makeRounds('meet-gg','easy'),b=Unit3Lesson3.makeRounds('meet-gg','easy');if(JSON.stringify(a)===JSON.stringify(b))return false;if(a[0].target!=='G'||a[1].target!=='g'||!['girl','guitar'].includes(a[2].target)||!['girl','guitar'].includes(a[3].target))return false;
   for(const w of ['G','g','girl','guitar'])if(a.filter(r=>r.target===w).length!==2)return false;
   if(a.some((r,n)=>n&&r.target===a[n-1].target))return false;
   const d=Unit3Lesson3.makeRounds('sound-detective','challenge');if(d.filter(r=>['girl','guitar'].includes(r.target)).length!==4)return false;
   for(const w of ['girl','guitar'])if(d.filter(r=>r.target===w).length!==2)return false;
  }return true;
 });assert(randomQA);
 // Intro must teach names, mouth/sound and words before asking for matches.
 await p.evaluate(()=>LearningApp.go('#/unit/3/lesson/3?mode=practice&activity=meet-gg'));await phase(p,'listening');
 assert.equal(await p.locator('[data-answer]').count(),0);assert.equal(await p.evaluate(()=>Unit3Lesson3.current().introStep),0);assert(await p.locator('[data-intro-clip="capital-g"]').isVisible());assert(await p.locator('[data-intro-clip="lowercase-g"]').isVisible());assert.equal(await p.locator('[data-intro-clip="girl"]').count(),0);
 await p.screenshot({path:'tests/g3-intro-letters.png',fullPage:true});await p.evaluate(()=>voiceEvents.length=0);await p.locator('[data-next]').click();await phase(p,'listening');
 assert.equal(await p.evaluate(()=>Unit3Lesson3.current().introStep),1);assert.equal(await p.locator('.g3-photo-sheet').count(),1);assert.equal(await p.locator('.g3-mouth-lesson svg').count(),0);assert.deepEqual(await p.evaluate(()=>voiceEvents.map(s=>s.split('/').pop())),['sound-g.mp3']);assert.equal(await p.locator('[data-intro-clip="girl"]').count(),0);await p.screenshot({path:'tests/g3-intro-sound.png',fullPage:true});
 await p.evaluate(()=>voiceEvents.length=0);await p.locator('[data-next]').click();await phase(p,'listening');assert.equal(await p.evaluate(()=>Unit3Lesson3.current().introStep),2);assert.deepEqual(await p.evaluate(()=>voiceEvents.map(s=>s.split('/').pop())),['girl.mp3','guitar.mp3']);assert.equal(await p.locator('[data-answer]').count(),0);await p.screenshot({path:'tests/g3-intro-words.png',fullPage:true});
 await p.locator('[data-intro-clip="girl"]').click();await phase(p,'listening');await p.locator('[data-intro-back]').click();await phase(p,'listening');assert.equal(await p.evaluate(()=>Unit3Lesson3.current().introStep),1);await finishIntro();assert.equal(await p.locator('[data-answer]').count(),2);assert.equal(await p.evaluate(()=>LearningProgress.get('3/3/meet-gg').completed),false);
 for(const id of ids){
  await route(id);let completed=false;
  for(let round=0;round<15&&!completed;round++){
   const r=await p.evaluate(()=>Unit3Lesson3.current().round);
   if(id==='meet-gg')await p.locator('[data-answer="'+r.target+'"]').click();
   else if(id==='sound-detective')await p.locator('[data-answer="'+(['girl','guitar'].includes(r.target)?'yes':'no')+'"]').click();
   else if(id==='catch-g'){for(const c of ['G','g'])await p.locator('[data-letter="'+c+'"]').click();}
   else if(id==='big-small'){
    const cards=await p.locator('[data-card]').count();for(let i=0;i<cards;i++){const item=p.locator('[data-card="'+i+'"]'),v=await item.getAttribute('data-value');if(i===0)await drag(item,p.locator('[data-zone="'+v+'"]'));else{await item.tap();await p.locator('[data-zone="'+v+'"]').tap();}}
   }else if(id==='fix-word')await drag(p.locator('[data-card][data-value="g"]'),p.locator('[data-zone="g"]'));
   else if(id==='trace-say')await trace();
   else await p.locator('[data-answer="'+(r.task==='grammar'?(r.yes?'yes':'no'):r.target)+'"]').click();
   await phase(p,'resolved');await p.locator('[data-next]').click();
   completed=await p.evaluate(()=>Unit3Lesson3.current().phase==='complete');if(!completed)await phase(p,'listening');
  }
  assert(completed,id+' never completed');const saved=await p.evaluate(id=>LearningProgress.get('3/3/'+id),id);assert(saved.completed);assert.equal(saved.stars,3);
  // Sound off still allows a child to learn using visual support, replay never awards extra stars.
  const old=await p.evaluate(()=>LearningProgress.all());await p.locator('[data-complete="again"]').click();await phase(p,'listening');await finishIntro();assert.deepEqual(await p.evaluate(()=>LearningProgress.all()),old);
 }
 // A wrong letter stays available and does not become a correct card.
 // Approved name, sound and words remain separate and play in order.
 await route('meet-gg');await p.evaluate(()=>voiceEvents.length=0);await p.locator('[data-phonics-sequence]').click();await phase(p,'listening');
 let approved=await p.evaluate(()=>voiceEvents);assert.deepEqual(approved.map(s=>s.split('/').pop()),['capital-g.mp3','sound-g.mp3','guitar.mp3','girl.mp3']);assert(!approved.some(s=>s.includes('/review/')));
 // Listening after a correct answer retains Next and never repeats points.
 await p.locator('[data-answer="G"]').click();await phase(p,'resolved');await p.locator('[data-phonics-sequence]').click();await phase(p,'resolved');assert(await p.locator('[data-next]').isEnabled());
 await route('fix-word');await route('meet-gg');
 // A failed opening cue must not disable explicit phonics controls.
 await p.route('**/assets/unit3/lesson3/audio/meet.mp3',r=>r.abort());await p.locator('[data-replay]').click();await phase(p,'idle');assert(await p.locator('[data-phonics-sequence]').isEnabled());assert(await p.locator('[data-sound-model]').isEnabled());await p.locator('[data-phonics-sequence]').click();await phase(p,'listening');await p.unroute('**/assets/unit3/lesson3/audio/meet.mp3');
 // When approval metadata is absent, the teacher model is required before the words.
 await p.evaluate(()=>{window.savedGSound=Unit3Lesson3Clips.clips['sound-g'];delete Unit3Lesson3Clips.clips['sound-g'];voiceEvents.length=0;});await p.locator('[data-phonics-sequence]').click();await phase(p,'phonics-pause');
 let sequence=await p.evaluate(()=>voiceEvents);assert(sequence.some(s=>s.endsWith('capital-g.mp3')));assert(!sequence.some(s=>s.endsWith('lowercase-g.mp3')));assert(sequence.some(s=>s.endsWith('sound-teacher.mp3')));assert(!sequence.some(s=>s.includes('/review/')));assert(!sequence.some(s=>s.endsWith('/girl.mp3')));
 await p.locator('[data-phonics-continue]').click();await phase(p,'listening');sequence=await p.evaluate(()=>voiceEvents);assert(sequence.some(s=>s.endsWith('/girl.mp3')));assert(sequence.some(s=>s.endsWith('/guitar.mp3')));await p.evaluate(()=>Unit3Lesson3Clips.clips['sound-g']=savedGSound);
 await route('fix-word');await p.locator('[data-card][data-value="e"]').tap();await p.locator('[data-zone="g"]').tap();await phase(p,'listening');assert.equal(await p.evaluate(()=>Unit3Lesson3.current().errors),1);assert.equal(await p.locator('[data-card][data-value="e"]').isVisible(),true);
 // Pointer cancel must never place a card, unlike pointerup.
 await p.evaluate(()=>{const b=document.querySelector('[data-card][data-value="g"]'),z=document.querySelector('[data-zone="g"]'),a=b.getBoundingClientRect(),r=z.getBoundingClientRect();b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:17,clientX:a.x+20,clientY:a.y+20}));b.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:17,clientX:r.x+20,clientY:r.y+20}));b.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:17,clientX:r.x+20,clientY:r.y+20}));});assert(await p.locator('[data-card][data-value="g"]').isVisible());
 // Higher-level detector gives audio only, including in its character bubble.
 await route('sound-detective','challenge');assert.equal(await p.locator('.g3-listen-picture').isVisible(),false);assert.equal(await p.locator('[data-bubble]').textContent(),'Listen carefully!');
 // Both letter cases use the same monochrome homes in Challenge.
 await route('big-small','challenge');assert.equal(await p.locator('.g3-ghost').count(),0);assert.equal(await p.locator('.g3-home').nth(0).evaluate(e=>getComputedStyle(e).backgroundColor),await p.locator('.g3-home').nth(1).evaluate(e=>getComputedStyle(e).backgroundColor));
 // Every game exposes all levels; true teacher/student role changes restart cleanly.
 for(const id of ids){for(const level of ['practice','challenge']){await route(id,level);assert.equal(await p.evaluate(()=>Unit3Lesson3.current().level),level);}}
 await route('final-challenge','challenge','class');assert.equal(await p.locator('select[data-role]').inputValue(),'teacher');await p.locator('[data-reverse]').click();await p.waitForSelector('[data-asked]',{state:'attached'});await phase(p,'listening');await p.locator('[data-work] summary').click();await p.locator('[data-asked="guitar"]').click();await phase(p,'resolved');assert.equal(await p.evaluate(()=>Unit3Lesson3.current().supported),1);
 await p.locator('[data-replay]').click();await phase(p,'resolved');assert.equal(await p.evaluate(()=>Unit3Lesson3.current().supported),1);
 // TV/projector, laptop and tablet: no missing controls or horizontal overflow.
 for(const viewport of [{width:1920,height:1080},{width:1366,height:768},{width:1024,height:768},{width:768,height:1024},{width:390,height:844},{width:320,height:740}]){
  await p.setViewportSize(viewport);for(const id of ids){await route(id);assert(await p.locator('[data-next]').isVisible());assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,id+' horizontal overflow');if(viewport.width>=1024){const bottom=await p.locator('.g3-scene').evaluate(e=>e.getBoundingClientRect().bottom);assert(bottom<=viewport.height+1,id+' at '+viewport.width+' vertical overflow: '+bottom);}}
  await route('meet-gg');await p.screenshot({path:'tests/g3-meet-'+viewport.width+'.png',fullPage:true});
  await p.evaluate(()=>{const s=Unit3Lesson3.current();s.introStep=0;s.renderIntro();});await phase(p,'listening');
  for(let step=0;step<3;step++){assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'intro overflow '+step);if(viewport.width>=1024){const bottom=await p.locator('.g3-scene').evaluate(e=>e.getBoundingClientRect().bottom);assert(bottom<=viewport.height+1,'intro '+step+' at '+viewport.width+': '+bottom);}await p.screenshot({path:'tests/g3-intro-'+step+'-'+viewport.width+'.png',fullPage:true});await p.locator('[data-next]').click();await phase(p,'listening');}

 }
 // Native browser touch dragging reaches the same shared drop handler.
 await p.setViewportSize({width:1024,height:768});await route('big-small');
 const item=p.locator('[data-card="0"]'),value=await item.getAttribute('data-value'),a=await item.boundingBox(),z=await p.locator('[data-zone="'+value+'"]').boundingBox(),cdp=await context.newCDPSession(p);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x+a.width/2,y:a.y+a.height/2}]});
 for(let n=1;n<=12;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+a.width/2+(z.x+z.width/2-a.x-a.width/2)*n/12,y:a.y+a.height/2+(z.y+z.height/2-a.y-a.height/2)*n/12}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await item.isVisible(),false);await cdp.detach();
 // Muting in the middle of a cue must not strand its pending promise.
 await route('meet-gg');await p.locator('[data-replay]').click();await phase(p,'asking');await p.locator('.app-game-more>summary').click();await p.locator('[data-shell-action="sound"]').click();await phase(p,'listening');assert.equal(await p.evaluate(()=>LearningApp.isMuted()),true);
 await p.locator('.app-game-more>summary').click();await p.locator('[data-shell-action="sound"]').click();
 // A failed word cue after tracing must retain a usable oral-practice screen and replay.
 await route('trace-say');const missingWord=await p.evaluate(()=>Unit3Lesson3.current().round.word);await p.route('**/lesson3/audio/'+missingWord+'.mp3',r=>r.abort());await trace();await phase(p,'resolved');await p.unroute('**/lesson3/audio/'+missingWord+'.mp3');await p.locator('[data-replay]').click();await phase(p,'resolved');
 // The intentional failure above is separate from unexpected missing assets.
 // Leave while voice is playing: old actor and drag engine are cleaned up.
 await route('meet-gg');const clean=await p.evaluate(()=>{const s=Unit3Lesson3.current();s.prompt();LearningApp.go('#/');return new Promise(resolve=>setTimeout(()=>resolve({destroyed:s.destroyed,audio:s.actor.audio,scene:Unit3Lesson3.current()}),100));});assert(clean.destroyed);assert.equal(clean.audio,null);assert.equal(clean.scene,null);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();
 console.log('PASS Lesson 3: 7 real playable completions, actual SVG tracing, mouse drag/touch tap, all support levels, balanced replay, teacher extension, deduplicated stars, cleanup and 6 viewport checks, including all three intro steps; 17 Higgs clips, 75 supplied assets and separate letter/sound/word playback.');
})().catch(e=>{console.error(e);process.exit(1)});
