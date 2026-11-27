const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');const E=require('../shared/speech-evaluator.js');
const evidence=path.resolve('docs/game-plans/unit5-feelings/evidence');fs.mkdirSync(evidence,{recursive:true});
const origin='http://127.0.0.1:8765';
const routes=['feelings-house','feelings-camera','helping-hands','feelings-workshop','little-reporter'];
const href=r=>origin+'/index.html?dev=u5qa1#/unit/5/lesson/1?mode=practice&activity='+r;
const waitReady=p=>p.waitForFunction(()=>window.Unit5Feelings?.current()?.loaded&&Unit5Feelings.current().phase!=='loading');
const waitChoice=p=>p.waitForFunction(()=>Unit5Feelings.current().phase==='choosing');
const waitResolved=p=>p.waitForFunction(()=>Unit5Feelings.current().canContinue&&Unit5Feelings.current().phase==='resolved');
const state=p=>p.evaluate(()=>{const g=Unit5Feelings.current();return {word:g.word,index:g.index,order:g.order,phase:g.phase,errors:g.errors,key:g.def.key,options:g.options,canContinue:g.canContinue,selected:g.selected}});
async function drag(p,from,to){const a=await from.boundingBox(),b=await to.boundingBox();await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:15});await p.mouse.up();}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required']});
 const context=await browser.newContext({viewport:{width:1366,height:1000},permissions:['microphone'],recordVideo:{dir:path.join(evidence,'video'),size:{width:1366,height:1000}}});
 await context.addInitScript(()=>{localStorage.setItem('learning.navigation.v1',JSON.stringify({'3/1/u3learn':{played:true,completed:true,stars:2}}));window.u5completions=[];document.addEventListener('learning:activity-completed',e=>{if(e.detail.game.startsWith('u5'))u5completions.push(e.detail)});});
 const p=await context.newPage(),errors=[],missing=[],result={scope:'Native frontend gameplay with simulated ASR responses; no real student accuracy measured'};
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))missing.push(r.url())});
 // Full real Higgs Present sequence and single participation completion.
 await p.goto(href(routes[0]));await waitReady(p);assert.equal(await p.locator('.u5-stage canvas').count(),1);
 for(const word of ['happy','sad','hungry','thirsty','hot','cold']){await p.locator(`[data-u5-visit="${word}"]`).click();await p.waitForFunction(w=>Unit5Feelings.current().visited.has(w)&&Unit5Feelings.current().phase==='ready',word);}
 await p.locator('[data-u5-action=next]').click();await p.waitForSelector('.u5-finish');result.present={explored:6,completed:true};
 const before=await p.evaluate(()=>LearningProgress.get('3/1/u3learn'));assert.equal(before.stars,2);
 const initialStars=await p.evaluate(()=>LearningProgress.get('5/1/feelings-house').stars);await p.locator('[data-u5-action=again]').click();await waitReady(p);assert.equal(await p.evaluate(()=>LearningProgress.get('5/1/feelings-house').stars),initialStars);
 console.log('PASS Present, complete Higgs sequence, legacy progress');
 // Deep route switches use the existing shell, not page reload/reset.
 await p.evaluate(()=>LearningApp.go('#/unit/5/lesson/1?mode=practice&activity=feelings-camera'));await waitReady(p);result.camera={rounds:6};
 const firstOrder=(await state(p)).order.join();
 for(let i=0;i<6;i++){
  assert.equal(await p.locator('[data-u5-actor]:not(:disabled)').count(),0);
  assert(await p.locator('.u5-sentence').evaluate(e=>e.hidden));await p.locator('[data-u5-action=cue]').click();
  assert.equal(await p.locator('[data-u5-actor]:not(:disabled)').count(),0);await waitChoice(p);const s=await state(p);
  if(i===0){const wrong=s.options.find(x=>x!==s.word);await p.locator(`[data-u5-actor="${wrong}"]`).click();assert.equal((await state(p)).errors,1);assert.equal(await p.locator('.u5-album figure').count(),0);}
  await p.locator(`[data-u5-actor="${s.word}"]`).click();await waitResolved(p);assert.equal(await p.locator('.u5-album figure').count(),i+1);
  if(i===2)await p.screenshot({path:path.join(evidence,'camera-capture.png'),fullPage:true});await p.locator('[data-u5-action=next]').click();
 }
 await p.waitForSelector('.u5-finish');await p.locator('[data-u5-action=again]').click();await waitReady(p);assert.notEqual((await state(p)).order.join(),firstOrder);result.camera.randomReplay=true;result.camera.noTextLeak=true;result.camera.audioEndedGated=true;
 console.log('PASS Camera, wrong/retry, 6 captures, native audio-ended gate, replay shuffle');
 // Eight meaningful helping deliveries, including actual physical pointer drag.
 await p.evaluate(()=>LearningApp.go('#/unit/5/lesson/1?mode=practice&activity=helping-hands'));await waitReady(p);
 const props={hungry:'sandwich',thirsty:'water',hot:'fan',cold:'blanket'};
 for(let i=0;i<8;i++){
  await p.locator('[data-u5-action=cue]').click();await waitChoice(p);const s=await state(p),prop=props[s.word];
  if(i===0){const wrong=Object.values(props).find(x=>x!==prop);await p.locator(`[data-u5-pick="${wrong}"]`).click();await p.locator('[data-u5-actor]').click();assert.equal((await state(p)).errors,1);}
  if(i===1)await drag(p,p.locator(`[data-u5-pick="${prop}"]`),p.locator('[data-u5-actor]'));
  else{await p.locator(`[data-u5-pick="${prop}"]`).click();await p.locator('[data-u5-actor]').click();}
  await waitResolved(p);if(i===1)await p.screenshot({path:path.join(evidence,'helping-delivered.png'),fullPage:true});await p.locator('[data-u5-action=next]').click();
 }
 await p.waitForSelector('.u5-finish');result.helping={deliveries:8,physicalDrag:true,wrongRetry:true};console.log('PASS Helping Hands, 8 deliveries, real pointer drag and tap-place');
 // Word-on-pick, matching, optional supported letter pieces and keyboard.
 await p.evaluate(()=>LearningApp.go('#/unit/5/lesson/1?mode=practice&activity=feelings-workshop'));await waitReady(p);
 for(let i=0;i<6;i++){
  const s=await state(p);if(i===0){const wrong=s.options.find(x=>x!==s.word);await p.locator(`[data-u5-pick="${wrong}"]`).click();await p.locator('.u5-receiver').click();assert.equal((await state(p)).errors,1);}
  if(i===1)await drag(p,p.locator(`[data-u5-pick="${s.word}"]`),p.locator('.u5-receiver'));
  else{await p.locator(`[data-u5-pick="${s.word}"]`).click();await p.locator('.u5-receiver').click();}
  await waitResolved(p);
  if(i===0){await p.locator('[data-u5-action=letters]').click();for(const c of s.word){const id=await p.evaluate(c=>{const g=Unit5Feelings.current();return g.bank.find(x=>x.letter===c&&!g.letters.some(v=>v.id===x.id)).id},c);await p.locator(`[data-u5-letter="${id}"]`).focus();await p.keyboard.press('Enter');}await p.waitForFunction(()=>Unit5Feelings.current().phase==='building'&&!Unit5Feelings.current().audio);assert.equal(await p.locator('.u5-letter-slot img').count(),s.word.length);await p.screenshot({path:path.join(evidence,'workshop-letters.png'),fullPage:true});await p.locator('[data-u5-action=close-letters]').click();}
  await p.locator('[data-u5-action=next]').click();
 }
 await p.waitForSelector('.u5-finish');result.workshop={matches:6,physicalDrag:true,supportedLetters:true,keyboard:true};console.log('PASS Photo Workshop, word-on-pick, matching, supported letter assembly');
 // Actual shared recording adapter with fake hardware; only ASR response is mocked.
 let outcome='correct',speechRequests=0;
 await p.route('https://toy-buddy-speech.hiei1121.workers.dev/api/speaking-check',async route=>{
  if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
  speechRequests++;const req=route.request();const form=await new Response(req.postDataBuffer(),{headers:{'Content-Type':req.headers()['content-type']}}).formData();assert.equal(form.get('questionType'),'feeling-sentence');assert(form.get('audio').size>0);const target=form.get('displayedToy'),[pronoun,word]=target.split('-');
  let transcript=outcome==='incomplete'?word:outcome==='wrong'?`${pronoun==='he'?'she':'he'} is ${word}`:`${pronoun}'s ${word}`;
  let body=E.evaluate(transcript,target,target,'feeling-sentence');if(outcome==='unclear')body={...body,result:'UNCLEAR',reason:'recognition-uncertain'};
  return route.fulfill({status:200,headers:{'Access-Control-Allow-Origin':origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 });
 await p.evaluate(()=>LearningApp.go('#/unit/5/lesson/1?mode=practice&activity=little-reporter'));await waitReady(p);
 async function speak(){await p.locator('[data-u5-action=speak]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='recording');await p.waitForTimeout(280);await p.locator('[data-u5-action=done]').click();}
 for(const kind of ['incomplete','wrong','unclear']){outcome=kind;await speak();await p.waitForFunction(()=>Unit5Feelings.current().phase==='ready');assert.equal(await p.locator('.u5-album figure').count(),0);if(kind==='unclear'){assert((await p.locator('.u5-status').innerText()).includes('No answer was scored'));assert.equal((await state(p)).errors,0);}}
 outcome='correct';for(let i=0;i<6;i++){await speak();await waitResolved(p);assert.equal(await p.locator('.u5-speech-box').getAttribute('data-result'),'CORRECT');if(i===0){await p.screenshot({path:path.join(evidence,'reporter-recognized.png'),fullPage:true});assert.equal(await p.locator('[data-u5-action=recording]').isVisible(),true);}await p.locator('[data-u5-action=next]').click();}
 await p.waitForSelector('.u5-finish');result.reporter={sentencesRecognizedInSimulatedASR:6,realAdapterAndFakeHardware:true,speechRequests,incompleteRetry:true,wrongPronounRetry:true,unclearNotScored:true};
 const progress=await p.evaluate(()=>LearningProgress.all());for(const r of routes)assert(progress['5/1/'+r].completed);assert.equal(progress['3/1/u3learn'].stars,2);result.progress=routes.map(r=>({route:r,...progress['5/1/'+r]}));
 const defaultStudent=await p.evaluate(()=>LearningProgress.student().id);const learner=await p.evaluate(()=>LearningProgress.addStudent('QA learner'));await p.evaluate(id=>LearningProgress.selectStudent(id),learner.id);assert.equal(await p.evaluate(()=>LearningProgress.get('5/1/feelings-house').completed),false);await p.evaluate(id=>LearningProgress.selectStudent(id),defaultStudent);assert.equal(await p.evaluate(()=>LearningProgress.get('5/1/feelings-house').completed),true);result.learnerSeparation=true;
 console.log('PASS Reporter adapter, incomplete/wrong/unclear, 6 accepted sentence UI states; ASR simulated');
 // All routes and meaningful controls at five responsive sizes.
 const layouts=[];
 for(const width of [320,390,768,1024,1366])for(const r of routes){await p.setViewportSize({width,height:1000});await p.evaluate(r=>LearningApp.go('#/unit/5/lesson/1?mode=practice&activity='+r),r);await waitReady(p);await p.evaluate(()=>document.fonts.ready);const m=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.querySelector('.u5-status')).fontFamily,canvas:document.querySelectorAll('.u5-stage canvas').length,badImages:[...document.querySelectorAll('.u5-game img[src]')].filter(im=>im.complete&&!im.naturalWidth).length}));assert(m.scroll<=width+1,JSON.stringify(m));assert(m.font.startsWith('"Game Nunito"'));assert.equal(m.canvas,1);assert.equal(m.badImages,0);layouts.push({route:r,...m});await p.screenshot({path:path.join(evidence,`${r}-${width}.png`),fullPage:true});}
 result.layouts=layouts;
 // Stop native model audio on mute and leave; reduced motion and failure gate.
 await p.locator('[data-u5-action=sentence]').click();await p.waitForFunction(()=>!!Unit5Feelings.current().audio);await p.evaluate(()=>document.querySelector('[data-shell-action=sound]').click());assert(await p.evaluate(()=>Unit5Feelings.current().audio===null));assert.equal(await p.locator('.is-speaking').count(),0);await p.evaluate(()=>document.querySelector('[data-shell-action=sound]').click());
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-u5-action=sentence]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='ready');assert((await p.locator('.u5-actor>img:not(.u5-result-medal)').getAttribute('src')).endsWith('idle.webp'));
 await p.evaluate(()=>LearningApp.go('#/unit/5/lesson/1?mode=practice&activity=feelings-camera'));await waitReady(p);await p.route('**/assets/unit5/lesson1/audio/sentences/*.mp3',route=>route.fulfill({status:404,body:'QA unavailable clip'}));await p.locator('[data-u5-action=cue]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='ready'&&!Unit5Feelings.current().audio);assert.equal(await p.locator('[data-u5-actor]:not(:disabled)').count(),0);assert((await p.locator('.u5-status').innerText()).includes('could not play'));await p.unroute('**/assets/unit5/lesson1/audio/sentences/*.mp3');
 await p.locator('[data-u5-action=cue]').click();await p.waitForFunction(()=>!!Unit5Feelings.current().audio);await p.evaluate(()=>LearningApp.go('#/unit/5/lesson/1?mode=practice'));await p.waitForSelector('[data-activity=feelings-house]');assert.equal(await p.locator('.u5-stage canvas').count(),0);assert(await p.evaluate(()=>Unit5Feelings.current().dead));
 const completionCounts=await p.evaluate(()=>u5completions.reduce((a,x)=>(a[x.game]=(a[x.game]||0)+1,a),{}));assert(Object.values(completionCounts).every(n=>n===1));
 result.completionCounts=completionCounts;result.lifecycle={muteStopsAudio:true,leaveDestroysScene:true,reducedMotionStill:true,audioFailureBlocksListeningTask:true};result.errors=errors;result.missing=missing.filter(x=>!x.includes('/audio/sentences/'));result.liveWorkerContacted=false;result.speechResponses='Simulated for deterministic frontend state checks';result.childOutcomes='NOT_MEASURED';result.video=await p.video().path();fs.writeFileSync(path.join(evidence,'gameplay.json'),JSON.stringify(result,null,2));assert.deepStrictEqual(errors,[]);assert.deepStrictEqual(result.missing,[]);await context.close();await browser.close();console.log('PASS Unit5: five activities, gameplay, 25 layouts, progress, media lifecycle and bounded simulated speaking');
})().catch(e=>{console.error(e);process.exit(1)});
