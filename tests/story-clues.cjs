const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.STORY_CLUES_URL||'http://127.0.0.1:8768/index.html?qa=clues1';
const route=base+'#/unit/4/lesson/6?mode=practice&activity=story-clues';
const output=process.env.STORY_CLUES_OUTPUT||path.join(os.tmpdir(),'story-clues-review');
fs.mkdirSync(output,{recursive:true});

async function run(){
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try{
    const context=await browser.newContext({viewport:{width:1366,height:1000},reducedMotion:'reduce'});
    await context.addInitScript(()=>{
      window.clueQA={played:[],ended:[],awards:[],audio:null};
      const original=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){
        if(this.src.includes('/unit4/lesson6/audio/')){
          clueQA.audio=this;this.playbackRate=4;
          this.addEventListener('playing',()=>clueQA.played.push(this.src.split('/').at(-1)),{once:true});
          this.addEventListener('ended',()=>clueQA.ended.push(this.src.split('/').at(-1)),{once:true});
        }
        return original.call(this);
      };
      document.addEventListener('learning:activity-completed',e=>clueQA.awards.push(e.detail.game));
    });
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(route);
    const root=page.locator('.story-clues');
    await root.waitFor();
    const action=name=>root.locator('[data-clue-action="'+name+'"]');
    const phase=name=>page.waitForFunction(name=>document.querySelector('.story-clues')?.dataset.phase===name,name);
    const target=()=>page.evaluate(()=>{
      const clip=clueQA.audio.src.split('/').at(-1).replace('.mp3','');
      return ({'scene-1':'grandpa','scene-2':'mum','scene-4':'brother'})[clip]||clip;
    });
    async function hear(){await action('listen').click();await phase('choosing');}
    async function accept(person){
      await root.locator('[data-person="'+person+'"]').click();
      await phase('resolved');
      assert.ok(await action('next').isEnabled());
    }
    assert.equal(await root.locator('.sc-card').count(),2);
    assert.equal(await root.locator('.sc-card:enabled').count(),0,'Cannot answer without hearing');
    assert.ok(await root.locator('.sc-reveal').isHidden());

    // A missing clue must keep answers locked and allow a genuine native-audio retry.
    await page.route('**/unit4/lesson6/audio/*.mp3',route=>route.abort());
    await action('listen').click();
    await page.waitForFunction(()=>document.querySelector('.sc-status')?.textContent.includes('could not play'));
    assert.equal(await root.locator('.sc-card:enabled').count(),0);
    await page.unroute('**/unit4/lesson6/audio/*.mp3');
    await hear();
    let person=await target();
    await root.locator('.sc-card:not([data-person="'+person+'"])').first().click();
    assert.match(await root.locator('.sc-status').innerText(),/try another/i);
    assert.ok(await action('next').isHidden());
    await accept(person);
    assert.match(await root.locator('.sc-sentence').innerText(),new RegExp(person));
    assert.ok((await page.evaluate(()=>clueQA.ended)).includes(person+'.mp3'));
    await action('next').click();

    for(const width of [320,390,768,1024,1366]){
      await page.setViewportSize({width,height:1000});
      assert.equal(await root.evaluate(el=>el.scrollWidth>el.clientWidth),false);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.ok(await root.locator('.sc-card').evaluateAll(items=>items.every(el=>el.getBoundingClientRect().width>=48)));
      await page.screenshot({path:path.join(output,'ready-'+width+'.png'),fullPage:true});
    }
    await root.locator('.sc-board').screenshot({path:path.join(output,'activity-cover.png')});
    assert.equal(await root.locator('.sc-card').count(),3);
    const shortTargets=[person],longTargets=[];
    for(let i=1;i<6;i++){
      assert.ok(await root.locator('.sc-reveal').isHidden());
      await hear();person=await target();
      (i<3?shortTargets:longTargets).push(person);
      if(i===1){
        for(const button of await root.locator('.sc-card:not([data-person="'+person+'"])').all())await button.click();
        await action('hint').click();
        assert.equal(await root.locator('.is-hinted').getAttribute('data-person'),person);
      }
      await accept(person);
      if(i===1)await page.screenshot({path:path.join(output,'correct-1366.png'),fullPage:true});
      if(i===5)await page.screenshot({path:path.join(output,'last-1366.png'),fullPage:true});
      await action('next').click();
    }
    assert.deepEqual([...new Set(shortTargets)].sort(),['brother','grandpa','mum']);
    assert.deepEqual([...new Set(longTargets)].sort(),['brother','grandpa','mum']);
    assert.deepEqual(await page.evaluate(()=>clueQA.awards),['u4storyclues']);
    assert.deepEqual(await page.evaluate(()=>{
      const progress=LearningProgress.get('4/6/story-clues');
      return {completed:progress.completed,stars:progress.stars};
    }),{completed:true,stars:3});
    assert.match(await root.locator('.sc-result-note').innerText(),/^4 \/ 6/);
    await page.screenshot({path:path.join(output,'complete-1366.png'),fullPage:true});
    assert.ok(await root.locator('[data-clue-again]').isVisible());
    for(const width of [320,390,768,1024,1366]){
      await page.setViewportSize({width,height:1000});
      assert.equal(await root.evaluate(el=>el.scrollWidth>el.clientWidth),false);
      if(width===320||width===390)await page.screenshot({path:path.join(output,'complete-'+width+'.png'),fullPage:true});
    }
    await page.setViewportSize({width:390,height:1000});
    await root.locator('[data-clue-speak]').click();
    await page.locator('.story-speaking').waitFor();
    assert.match(page.url(),/activity=roleplay-stage/);
    assert.equal(await page.locator('.story-speaking').getAttribute('data-phase'),'ready');
    assert.ok(await page.locator('[data-say=speak]').isVisible());
    assert.ok(await page.locator('[data-say=done]').isHidden(),'Microphone does not start on navigation');
    assert.deepEqual(await page.evaluate(()=>clueQA.awards),['u4storyclues'],'Listening completion does not award speaking credit');
    await page.getByRole('button',{name:'Back to lesson',exact:true}).click();
    await page.getByText('Story Clues',{exact:true}).first().click();
    await page.setViewportSize({width:1366,height:1000});
    assert.equal(await root.locator('.sc-card:enabled').count(),0);

    // Interruptions never authorize an unheard answer. Actual Audio object is stopped.
    await action('listen').click();
    await page.waitForFunction(()=>clueQA.audio&&!clueQA.audio.paused);
    await page.evaluate(()=>{
      Object.defineProperty(document,'hidden',{configurable:true,value:true});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await phase('ready');
    assert.ok(await page.evaluate(()=>clueQA.audio.paused));
    assert.equal(await root.locator('.sc-card:enabled').count(),0);
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
    await page.locator('summary[aria-label="Game controls"]').click();
    await page.locator('[data-shell-action=sound]').click();
    await action('listen').click();
    assert.match(await root.locator('.sc-status').innerText(),/Sound is off/);
    assert.equal(await root.locator('.sc-card:enabled').count(),0);
    await page.locator('summary[aria-label="Game controls"]').click();
    await page.locator('[data-shell-action=sound]').click();
    await action('listen').click();
    await page.waitForFunction(()=>clueQA.audio&&!clueQA.audio.paused);
    await page.getByRole('button',{name:'Back to lesson',exact:true}).click();
    assert.ok(await page.evaluate(()=>clueQA.audio.paused));
    assert.equal(await page.evaluate(()=>LearningMotion.activeCount()),0);
    assert.deepEqual(await page.evaluate(()=>clueQA.awards),['u4storyclues']);
    await page.getByText('Story Clues',{exact:true}).first().click();
    await root.waitFor();
    await action('listen').focus();
    await page.keyboard.press('Enter');
    await phase('choosing');
    person=await target();
    await root.locator('[data-person="'+person+'"]').focus();
    await page.keyboard.press('Enter');
    await phase('resolved');
    assert.deepEqual(errors,[]);
    console.log('PASS Story Clues: catalogue, six native-audio rounds, bounded hints, missing-audio retry, keyboard, five widths, mute/hidden/leave, single completion, re-entry and Your Turn handoff without automatic microphone capture or speaking credit. Screenshots: '+output);
    await context.close();
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
