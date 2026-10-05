const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const BASE='http://127.0.0.1:8765/index.html';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:1000}}),page=await context.newPage();
 const errors=[],badAssets=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)badAssets.push(r.url());});
 await page.addInitScript(()=>{
  window.qaAudio=[];window.qaOverlaps=[];window.qaRate=4;
  const play=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){
   if(this.src.includes('/lesson2/')||this.src.includes('/sfx/'))this.playbackRate=window.qaRate;
   if(!qaAudio.includes(this))qaAudio.push(this);
   const active=qaAudio.filter(a=>a!==this&&!a.paused&&!a.ended&&!a.muted&&a.currentTime>0);
   if(!this.muted&&active.length)qaOverlaps.push([this.src,...active.map(a=>a.src)]);
   return play.call(this);
  };
 });
 await page.goto(BASE);
 await page.waitForFunction(()=>!!window.LearningApp);
 await page.evaluate(()=>localStorage.removeItem('learning.navigation.v1'));
 const enter=async(id,mode='practice')=>{await page.evaluate(({id,mode})=>LearningApp.go('#/unit/3/lesson/2?mode='+mode+'&activity='+id),{id,mode});await phase('listening');};
 const phase=async value=>page.waitForFunction(v=>Unit3Lesson2.current()?.phase===v,value,{timeout:15000});
 const state=()=>page.evaluate(()=>{const s=Unit3Lesson2.current();return {round:s.round,index:s.index,count:s.rounds.length,first:s.firstCorrect,errors:s.errors,kind:s.kind,tokens:s.tokens,tiles:s.tiles};});
 const next=async()=>{await page.locator('#l2Next').click();await page.waitForFunction(()=>['listening','complete'].includes(Unit3Lesson2.current()?.phase));};
 const drag=async(source,target,p=page)=>{const a=await source.boundingBox(),b=await target.boundingBox();assert(a&&b);await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:10});await p.mouse.up();};
 // Real media pause must not advance on any duration timeout.
 await enter('meet-pattern');await page.evaluate(()=>{window.qaRate=1;Unit3Lesson2.current().prompt();});
 await page.waitForFunction(()=>Unit3Lesson2.current().buddy.audio?.currentTime>0);
 await page.evaluate(()=>Unit3Lesson2.current().buddy.audio.pause());await page.waitForTimeout(2500);
 assert.equal(await page.locator('.l2-scene').getAttribute('data-phase'),'asking');assert(await page.locator('[data-choice="true"]').isDisabled());
 assert(await page.evaluate(()=>!Unit3Lesson2.current().buddy.root.classList.contains('tb-speaking')));
 await page.evaluate(()=>{qaRate=4;Unit3Lesson2.current().buddy.audio.play();});await phase('listening');
 await page.locator('[data-shell-action="fullscreen"]').click();assert(await page.evaluate(()=>!!document.fullscreenElement));
 await page.locator('[data-shell-action="fullscreen"]').click();assert(await page.evaluate(()=>!document.fullscreenElement));
 // One persistent actor over eight balanced rounds; wrong choice models the full answer.
 const seen=new Set();let positives=0;
 await page.evaluate(()=>window.firstActor=Unit3Lesson2.current().buddy);
 for(let i=0;i<8;i++){
  const s=await state();seen.add(s.round.shown);positives+=Number(s.round.yes);
  if(i===0){await page.locator(`[data-choice="${!s.round.yes}"]`).click();await phase('listening');assert.equal(await page.locator('#l2Model').textContent(),s.round.yes?'Yes, it is.':"No, it isn't.");}
  await page.locator(`[data-choice="${s.round.yes}"]`).click();await phase('resolved');
  assert(await page.evaluate(()=>firstActor===Unit3Lesson2.current().buddy));
  await next();
 }
 assert.equal(seen.size,5);assert.equal(positives,4);assert.equal((await state()).first,7);
 assert(await page.evaluate(()=>LearningProgress.get('3/2/meet-pattern').completed));
 console.log('PASS pattern: all five toys, balanced answers, full model, persistent actor, real ended, fullscreen');
 await enter('question-detective');const categories=new Set();
 for(let i=0;i<8;i++){const s=await state();categories.add(s.round.category);if(i===0){await page.locator('[data-category]').filter({hasText:s.round.category==='NUMBER'?'COLOR':'NUMBER'}).click();await phase('listening');}
  await page.locator(`[data-category="${s.round.category}"]`).click();await phase('resolved');await next();}
 assert.equal(categories.size,4);console.log('PASS detective: four categories and gentle retry');
 await enter('match-answer');
 for(let i=0;i<10;i++){const s=await state();const drop=page.locator('[data-drop-answer]');if(i===0){await drag(page.locator(`[data-match="${!s.round.yes}"]`),drop);await phase('listening');assert.equal(await drop.textContent(),'Drop the answer here');assert.equal(await page.locator('.l2-dragging').count(),0);}
  if(i===0)await drag(page.locator(`[data-match="${s.round.yes}"]`),drop);else await page.locator(`[data-match="${s.round.yes}"]`).click();
  await phase('resolved');assert(await drop.evaluate(e=>e.classList.contains('l2-snapped')));if(i>=4)assert.equal(await page.locator('.l2-match-card').count(),2);await next();}
 console.log('PASS match: mouse drag, wrong return, snap and tap');
 await enter('build-sentence');
 for(let i=0;i<7;i++){
  if(i===1||i===2){await page.locator('#l2Level').selectOption(i===1?'practice':'challenge');await phase('listening');assert(await page.locator('.l2-sentence-model').isHidden());if(i===1)assert.equal(await page.locator('#l2Question').textContent(),'Build the question.');}
  const s=await state();if(i===2){await page.locator('[data-tile="100"]').click();await phase('listening');assert(await page.locator('[data-tile="100"]').isVisible());}
  for(let slot=0;slot<s.tokens.length;slot++){const tile=s.tiles.find(t=>t.word===s.tokens[slot]&&t.id<100);if(slot===0&&i===0){await drag(page.locator(`[data-tile="${tile.id}"]`),page.locator(`[data-slot="${slot}"]`));await page.locator('[data-undo]').click();}
   await page.locator(`[data-tile="${tile.id}"]`).click();}
  await phase('resolved');await next();
 }
 console.log('PASS sentence: question/positive/negative, drag, undo, three supports, distractor retry');
 await enter('listen-decide');let negatives=0;
 for(let i=0;i<10;i++){const s=await state();negatives+=Number(!s.round.yes);assert.equal(await page.locator('#l2Question').textContent(),'');assert.equal(await page.locator('#l2Model').textContent(),'');
  await page.locator(`[data-choice="${s.round.yes}"]`).click();await phase('resolved');assert.match(await page.locator('#l2Question').textContent(),/^Is it a/);assert.match(await page.locator('#l2Status').textContent(),/Accuracy:/);await next();}
 assert.equal(negatives,5);console.log('PASS listening: transcript hidden until response, positive/negative, accuracy');
 await enter('talk-to-toy-buddy');await page.locator('[data-teacher]').click();assert.match(await page.locator('.l2-manual-note').textContent(),/no microphone recording/);
 assert.equal(await page.evaluate(()=>LearningProgress.get('3/2/talk-to-toy-buddy').completed),false);
 await page.locator('#l2Mic').click();
 for(const [result,text] of [['partial','Good! Say the whole sentence.'],['logical','Look again. Try again.'],['unclear',"I couldn't hear you. Try again."]]){await page.evaluate(r=>Unit3Lesson2.current().gradeSpeech(r),result);await phase('listening');assert.equal(await page.locator('#l2Status').textContent(),text);assert(await page.locator('#l2Next').isDisabled());}
 const speech=await page.evaluate(()=>['Yes, it is.','yes',"No, it isn't.",'mumble'].map(t=>Unit3Lesson2.evaluateSpeech(t,true)));assert.deepEqual(speech,['correct','partial','logical','unclear']);
 await page.locator('#l2Level').selectOption('practice');await phase('listening');assert.equal(await page.locator('.l2-speaking-support').textContent(),'YES / NO');
 await page.locator('#l2Level').selectOption('challenge');await phase('listening');assert.equal(await page.locator('.l2-speaking-support').textContent(),'Say your answer.');
 await page.screenshot({path:'tests/unit3-lesson2-desktop.png',fullPage:true});
 for(let i=0;i<10;i++){await page.locator('#l2Mic').click();await page.locator('[data-validate="correct"]').click();await page.waitForFunction(i=>Unit3Lesson2.current()?.index>i,i);await page.waitForFunction(()=>['listening','complete'].includes(Unit3Lesson2.current()?.phase));}
 assert.equal(await page.locator('[data-complete-action]').count(),3);assert.match(await page.locator('#l2Result').textContent(),/Lesson stars earned: 15 \/ 18/);
 await page.waitForFunction(()=>Unit3Lesson2.current().buddy.state==='CELEBRATE'&&Unit3Lesson2.current().buddy.audio===null);
 await page.screenshot({path:'tests/unit3-lesson2-complete.png',fullPage:true});
 await page.reload();assert(await page.evaluate(()=>LearningProgress.get('3/2/talk-to-toy-buddy').completed));
 console.log('PASS speaking: four evaluation cases, manual mode, support levels, completion and persisted stars');
 // Restart, sound toggles, actual route teardown, Class order, practice drawer and Browser Back.
 await enter('meet-pattern');await page.locator('#restartGame').click();await phase('listening');assert.equal((await state()).index,0);
 await page.locator('[data-shell-action="sound"]').click();await page.locator('#l2Replay').click();await page.waitForFunction(()=>Unit3Lesson2.current().buddy.audio?.currentTime>0);assert(await page.evaluate(()=>Unit3Lesson2.current().buddy.audio.muted));await phase('listening');
 await page.locator('[data-shell-action="sound"]').click();assert(!(await page.evaluate(()=>LearningApp.isMuted())));
 await enter('meet-pattern','class');
 for(const expected of ['question-detective','match-answer','build-sentence','listen-decide','talk-to-toy-buddy']){await page.evaluate(()=>{window.oldActor=Unit3Lesson2.current().buddy;});await page.locator('[data-shell-action="next"]').click();await phase('listening');assert.equal((await state()).kind,expected);assert(await page.evaluate(()=>oldActor.destroyed&&oldActor.audio===null));}
 await page.locator('[data-shell-action="drawer"]').click();await page.locator('[data-jump="build-sentence"]').click();await phase('listening');assert.equal((await state()).kind,'build-sentence');
 await page.locator('[data-shell-action="back"]').click();assert.equal(await page.evaluate(()=>Unit3Lesson2.current()),null);await page.goBack();await phase('listening');
 await page.evaluate(()=>{for(let i=0;i<10;i++)restartCurrent();});await phase('listening');
 assert.deepEqual(await page.evaluate(()=>qaOverlaps),[],'Overlapping audible media');
 assert.deepEqual(errors,[]);assert.deepEqual(badAssets,[]);
 console.log('PASS controls: restart, sound, Class sequence, drawer jump, Back, burst restarts, no stale audio or errors');
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await mobile.newPage();await p.goto(BASE);await p.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=match-answer'));await p.waitForSelector('.l2-scene[data-phase="listening"]');
 const yes=await p.evaluate(()=>Unit3Lesson2.current().round.yes);await p.locator(`[data-match="${yes}"]`).scrollIntoViewIfNeeded();
 const a=await p.locator(`[data-match="${yes}"]`).boundingBox(),b=await p.locator('[data-drop-answer]').boundingBox(),cdp=await mobile.newCDPSession(p);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x+a.width/2,y:a.y+a.height/2}]});
 for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+a.width/2+(b.x+b.width/2-a.x-a.width/2)*i/6,y:a.y+a.height/2+(b.y+b.height/2-a.y-a.height/2)*i/6}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForSelector('.l2-scene[data-phase="resolved"]');
 await p.screenshot({path:'tests/unit3-lesson2-mobile.png',fullPage:true});
 for(const width of [390,320]){await p.setViewportSize({width,height:844});assert(!(await p.locator('.l2-scene').evaluate(e=>e.scrollWidth>e.clientWidth+1)),width+'px overflow');}
 await p.goto('file:///'+require('node:path').resolve('index.html').replaceAll('\\','/'));await p.evaluate(()=>LearningApp.go('#/unit/3/lesson/2?mode=practice&activity=listen-decide'));await p.waitForSelector('.l2-scene[data-phase="listening"]');
 console.log('PASS mobile: real touch drag, 390/320px layout, file:// audio');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
