// Actual Cloudflare inference through native recording UI, with approved Higgs
// model audio substituted for fake microphone bytes at the transport boundary.
// No recognizer response is mocked. This is not child microphone accuracy.
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const origin=process.env.U5_QA_ORIGIN||'http://127.0.0.1:8765';
const pageOrigin=new URL(origin).origin,publicCheck=new URL(origin).protocol==='https:';
const endpoint='https://toy-buddy-speech.hiei1121.workers.dev/api/speaking-check';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required']});
 const context=await browser.newContext({permissions:['microphone'],viewport:{width:1366,height:1000}});const p=await context.newPage(),responses=[];let outcome='incomplete';
 try{
 await p.route(endpoint,async route=>{
  if(route.request().method()==='OPTIONS')return route.continue();
  const req=route.request(),form=await new Response(req.postDataBuffer(),{headers:{'Content-Type':req.headers()['content-type']}}).formData();
  assert(form.get('audio').size>0);assert.equal(form.get('questionType'),'feeling-sentence');const target=form.get('displayedToy'),[pronoun,word]=target.split('-');
  const clip=outcome==='incomplete'?`words/${word}.mp3`:`sentences/${outcome==='wrong'?(pronoun==='he'?'she':'he'):pronoun}-${word}.mp3`;
  const response=await context.request.post(endpoint,{headers:{Origin:pageOrigin},multipart:{questionType:'feeling-sentence',questionToy:target,displayedToy:target,audio:{name:'approved-higgs.mp3',mimeType:'audio/mpeg',buffer:fs.readFileSync(path.resolve('assets/unit5/lesson1/audio',clip))}},timeout:30000});
  const body=await response.json();responses.push({target,clip,outcome,status:response.status(),body});console.log('Live UI:',outcome,target,response.status(),body.result||body.error);await route.fulfill({response});
 });
 await p.goto(origin+'/index.html?release=u5live2#/unit/5/lesson/1?mode=practice&activity=little-reporter');await p.waitForFunction(()=>window.Unit5Feelings?.current()?.loaded);
 async function speak(){await p.locator('[data-u5-action=speak]').click();await p.waitForFunction(()=>Unit5Feelings.current().phase==='recording');await p.waitForTimeout(300);await p.locator('[data-u5-action=done]').click();}
 const dir=path.resolve('docs/game-plans/unit5-feelings/evidence');
 for(const kind of ['incomplete','wrong']){outcome=kind;await speak();await p.waitForFunction(()=>Unit5Feelings.current().phase==='ready',null,{timeout:40000});assert.equal(await p.locator('.u5-album figure').count(),0);assert.equal(responses.at(-1).body.result,kind==='incomplete'?'INCOMPLETE':'WRONG_LOGIC');await p.screenshot({path:path.join(dir,'live-ui-'+(publicCheck?'public-':'')+kind+'.png'),fullPage:true});}
 outcome='correct';
 for(let i=0;i<6;i++){await speak();await p.waitForFunction(()=>Unit5Feelings.current().phase==='resolved'&&Unit5Feelings.current().canContinue,null,{timeout:40000});assert.equal(responses.at(-1).body.result,'CORRECT');assert.equal(await p.locator('.u5-speech-box').getAttribute('data-result'),'CORRECT');if(i===0)await p.screenshot({path:path.join(dir,'live-ui-'+(publicCheck?'public-':'')+'correct.png'),fullPage:true});await p.locator('[data-u5-action=next]').click();}
 await p.locator('.u5-finish').waitFor();assert(await p.evaluate(()=>LearningProgress.get('5/1/little-reporter').completed));
 fs.writeFileSync(path.join(dir,publicCheck?'live-ui-public.json':'live-ui.json'),JSON.stringify({checkedAt:new Date().toISOString(),origin,endpoint,source:'Approved generated Higgs clips at transport boundary; native fake-device recording UI, actual Cloudflare inference',limits:'Child accuracy and pronunciation NOT_MEASURED',responses,nativeRecordDone:true,incompleteRetry:true,wrongPronounRetry:true,correctFeedback:true,sixRoundsCompleted:true},null,2));
 console.log('PASS real AI UI: incomplete/wrong retries and six actual accepted model sentences with progress');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
