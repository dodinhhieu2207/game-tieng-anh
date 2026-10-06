const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.addInitScript(()=>{window.unit2Events=[];window.browserSpeech=[];document.addEventListener('learning:unit2-voice',e=>unit2Events.push(e.detail));const speak=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{browserSpeech.push(u.text);return speak(u);};const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.playbackRate=window.slowEgg === this.getAttribute('src') ? .35 : 4;return play.call(this);};});
 await page.goto(process.env.UNIT2_VOICE_TEST_BASE||'http://127.0.0.1:8765/index.html');await page.waitForFunction(()=>window.Unit2HiggsVoice&&window.LearningApp);
 await page.evaluate(()=>LearningApp.go('#/unit/2/lesson/2?mode=practice&activity=sentence'));await page.waitForFunction(()=>!games.sentence.locked);
 assert(await page.evaluate(()=>unit2Events.some(e=>e.text==="What's this?"&&e.reason==='ended')&&unit2Events.some(e=>/^It's a /.test(e.text)&&e.reason==='ended')));
 await page.evaluate(async()=>{for(const w of ['desk','chair','pencil','crayon','notebook','egg','elephant','fish','farm'])await speakText(w,{interrupt:true});});
 // Queue semantics, rapid cancellation and replay must not switch to browser TTS.
 await page.evaluate(async()=>{speakText('desk',{interrupt:true});await speakText('chair',{interrupt:true});await speakSequence(["What's this?","It's a notebook."],{interrupt:true});});
 for(const [activity,selector] of [['eeintro','#eeLessonVoice'],['ffintro','#ffLessonVoice']]){
  await page.evaluate(a=>LearningApp.go(`#/unit/2/lesson/${a==='eeintro'?3:5}?mode=practice&activity=${a}`),activity);await page.waitForSelector(selector);await page.locator(selector).click();await page.waitForTimeout(1600);
 }
 // Exhaustive finite catalogue coverage for all randomized voices.
 assert(await page.evaluate(()=>{const c=Unit2HiggsVoice.clip,words=['desk','chair','pencil','crayon','notebook'],colors=['red','green','blue','black','white'],nums=['one','two','three','four'];return words.every(w=>colors.every(color=>nums.every((num,i)=>c(`${num} ${color} ${i?w+'s':w}`)&&c(`${color} ${w}`))))&&['1','2','3','4','5','6'].every(n=>c(n));}));
 const activities=await page.evaluate(()=>LearningConfig.units.find(u=>u.id===2).lessons.flatMap(l=>l.activities.map(a=>({lesson:l.id,id:a.id}))));
 for(const a of activities){await page.evaluate(a=>LearningApp.go(`#/unit/2/lesson/${a.lesson}?mode=practice&activity=${a.id}`),a);await page.waitForTimeout(320);await page.evaluate(async()=>{await replayCurrent?.();await Unit2HiggsVoice.finished();});}
 await page.evaluate(()=>LearningApp.go('#/unit/2/lesson/4?mode=practice&activity=eggcount'));await page.waitForSelector('[data-count-answer]');await page.waitForTimeout(320);
 await page.evaluate(()=>{cancelVoice();games.eggcount.target=5;games.eggcount.render();window.slowEgg=Unit2HiggsVoice.clip('Five eggs.').src;});await page.locator('[data-count-answer="5"]').click();await page.waitForTimeout(1600);assert(await page.evaluate(()=>games.eggcount.locked&&!unit2Events.some(e=>e.text==='Five eggs.'&&e.reason==='ended')),'Round must wait for a long recording beyond its old 1450ms advance timer');await page.waitForFunction(()=>unit2Events.some(e=>e.text==='Five eggs.'&&e.reason==='ended'));await page.waitForFunction(()=>!games.eggcount.locked);await page.evaluate(()=>window.slowEgg=null);
 await page.locator('.app-game-more>summary').click();await page.locator('[data-shell-action="sound"]').click();const n=await page.evaluate(()=>unit2Events.filter(e=>e.reason==='start').length);await page.evaluate(()=>speakText('pencil',{interrupt:true}));assert.equal(await page.evaluate(()=>unit2Events.filter(e=>e.reason==='start').length),n);
 assert.deepEqual(await page.evaluate(()=>browserSpeech),[],'Unit 2 must never silently fall back to browser TTS');assert.deepEqual(await page.evaluate(()=>unit2Events.filter(e=>['missing','error'].includes(e.reason))),[]);assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 await browser.close();console.log('PASS Unit 2 Higgs: all '+activities.length+' activity replays, real questions/answers, all vocabulary, Ee/Ff recordings, randomized coverage, queue/replay/cancel, audio-ended round advance and mute; zero browser speech calls or missing assets.');
})().catch(e=>{console.error(e);process.exit(1);});
