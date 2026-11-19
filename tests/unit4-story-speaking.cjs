const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.STORY_SPEAK_URL||'http://127.0.0.1:8768/index.html?qa=yourturn1';
const route=base+'#/unit/4/lesson/6?mode=practice&activity=roleplay-stage';

async function main(){
  const browser=await chromium.launch({
    executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']
  });
  try{
    const page=await browser.newPage({viewport:{width:1366,height:920},reducedMotion:'reduce'});
    const errors=[];
    const calls=[];
    let result={transcript:'brother',result:'INCOMPLETE',normalized:'brother',answerType:null};
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{
      window.speakingQA={played:[],awards:[],audio:null};
      const original=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){
        if(this.src.includes('/unit4/lesson6/audio/')){
          speakingQA.audio=this;
          this.addEventListener('playing',()=>speakingQA.played.push(this.src.split('/').at(-1)),{once:true});
          this.playbackRate=3;
        }
        return original.call(this);
      };
      document.addEventListener('learning:activity-completed',e=>speakingQA.awards.push(e.detail.game));
    });
    await page.route('**/api/speaking-check',async route=>{
      calls.push(route.request().postDataBuffer().length);
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
    });
    const root=page.locator('.story-speaking');
    const action=name=>root.locator('[data-say="'+name+'"]');
    const ready=()=>page.waitForFunction(()=>document.querySelector('.story-speaking')?.dataset.phase==='ready');
    async function record(){
      await action('speak').click();
      await page.waitForFunction(()=>document.querySelector('.story-speaking')?.dataset.phase==='recording');
      await page.waitForTimeout(350);
      await action('done').click();
      await ready();
    }
    await page.goto(route);
    await root.waitFor();
    for(const width of [320,390,768,1024,1366]){
      await page.setViewportSize({width,height:920});
      assert.equal(await root.evaluate(el=>el.scrollWidth>el.clientWidth),false);
    }
    await page.screenshot({path:process.env.TEMP+'/your-turn-1366.png',fullPage:true});
    await action('scene').click();
    await ready();
    assert.ok((await page.evaluate(()=>speakingQA.played)).includes('scene-1.mp3'));
    await action('model').click();
    await page.waitForSelector('.sspeak-line .is-speaking');
    await ready();
    result={transcript:'grandpa',result:'INCOMPLETE',normalized:'grandpa',answerType:null};
    await record();
    assert.match(await root.locator('.sspeak-result').innerText(),/whole sentence/);
    assert.ok(await action('next').isHidden());
    assert.ok(await action('recording').isVisible());
    result={transcript:'This is my mum.',result:'WRONG_LOGIC',normalized:'this is my mum',answerType:'NAME'};
    await record();
    assert.match(await root.locator('.sspeak-result').innerText(),/person in this picture/);
    assert.ok(await action('next').isHidden());
    result={transcript:'This is my grandpa.',result:'UNCLEAR',normalized:'this is my grandpa',answerType:'NAME'};
    await record();
    assert.match(await root.locator('.sspeak-result').innerText(),/hear clearly/);
    assert.ok(await action('next').isHidden());
    for(const [person,reply] of [['grandpa','meet-grandpa'],['mum','meet-mum'],['brother','hello-billy']]){
      if(person==='brother'){
        await action('scene').click();
        await page.waitForFunction(()=>document.querySelector('.sspeak-picture').dataset.picture==='3');
        await page.waitForFunction(()=>document.querySelector('.sspeak-picture').dataset.picture==='4');
        await ready();
      }
      result={transcript:person==='brother'?'This is my brother Billy.':'This is my '+person+'.',result:'CORRECT',normalized:'this is my '+person,answerType:'NAME'};
      if(person==='brother'){
        result.result='UNCLEAR';
        result.reason='sentence-unrecognized';
        result.answerType=null;
      }
      await record();
      assert.match(await root.locator('.sspeak-result').innerText(),/recognized/);
      assert.ok((await page.evaluate(()=>speakingQA.played)).includes(reply+'.mp3'));
      await action('next').click();
    }
    assert.deepEqual(await page.evaluate(()=>speakingQA.awards),['u4storyrole']);
    await root.locator('[data-complete-again]').click();
    await action('speak').click();
    await page.waitForFunction(()=>document.querySelector('.story-speaking')?.dataset.phase==='recording');
    const before=calls.length;
    await action('cancel').click();
    await ready();
    assert.equal(calls.length,before);
    await action('model').click();
    await page.getByRole('button',{name:'Back to lesson'}).click();
    assert.ok(await page.evaluate(()=>speakingQA.audio.paused));
    await page.goto(route);
    await root.waitFor();
    await page.evaluate(()=>Object.defineProperty(navigator.mediaDevices,'getUserMedia',{value:()=>Promise.reject(new DOMException('Denied','NotAllowedError'))}));
    await action('speak').click();
    await ready();
    assert.match(await root.locator('.sspeak-status').innerText(),/Allow microphone/);
    assert.deepEqual(errors,[]);
    console.log('PASS five widths, source audio, word glow, fake-device capture, incomplete/wrong/unclear/correct recognition, original replies, all three turns, award, cancel, permission failure, leave');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
