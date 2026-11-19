const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=process.env.STORY_CLUES_OUTPUT||path.join(os.tmpdir(),'story-clues-review');
fs.mkdirSync(output,{recursive:true});
const base=process.env.STORY_CLUES_URL||'http://127.0.0.1:8768/index.html?qa=clues-motion';
const route=base+'#/unit/4/lesson/6?mode=practice&activity=story-clues';
async function run(){
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try{
    const context=await browser.newContext({viewport:{width:1366,height:1000},reducedMotion:'no-preference',recordVideo:{dir:output,size:{width:1366,height:1000}}});
    await context.addInitScript(()=>{
      window.motionQA={audio:null,played:[]};
      const native=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){
        if(this.src.includes('/unit4/lesson6/audio/'))motionQA.audio=this;
        this.addEventListener('playing',()=>motionQA.played.push({src:this.src,sfx:!!this.learningSfx}),{once:true});
        return native.call(this);
      };
    });
    const page=await context.newPage();
    await page.goto(route);
    const root=page.locator('.story-clues');
    await root.waitFor();
    await root.locator('[data-clue-action=listen]').click();
    await page.waitForFunction(()=>document.querySelector('.story-clues')?.dataset.phase==='choosing');
    const person=await page.evaluate(()=>motionQA.audio.src.split('/').at(-1).replace('.mp3',''));
    const correct=root.locator('[data-person="'+person+'"]');
    await correct.click();
    await page.waitForSelector('.sc-sentence .is-speaking');
    const samples=[];
    const sample=async()=>{
      samples.push(await correct.locator('.sc-photo').evaluate(el=>getComputedStyle(el).transform));
    };
    await sample();
    await page.screenshot({path:path.join(output,'motion-wordglow.png'),fullPage:true});
    await page.waitForTimeout(240);
    await sample();
    await page.screenshot({path:path.join(output,'motion-focus.png'),fullPage:true});
    await page.waitForTimeout(600);
    await sample();
    assert.ok(new Set(samples).size>1,'Camera focus must actually change across frames');
    await page.waitForFunction(()=>document.querySelector('.story-clues')?.dataset.phase==='resolved');
    assert.ok(await root.locator('[data-clue-action=next]').isEnabled());
    assert.equal(await page.evaluate(()=>LearningMotion.activeCount()),0);
    await page.waitForFunction(()=>motionQA.played.some(item=>item.sfx&&item.src.endsWith('correct.wav')));
    assert.ok(await page.evaluate(()=>motionQA.played.some(item=>item.src.includes('meet-')||item.src.includes('hello-billy'))));
    await page.screenshot({path:path.join(output,'motion-settled.png'),fullPage:true});

    // Reduced-motion path keeps all feedback and skips choreography.
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.evaluate(()=>restartCurrent());
    await root.locator('[data-clue-action=listen]').click();
    await page.waitForFunction(()=>document.querySelector('.story-clues')?.dataset.phase==='choosing');
    const reducedTarget=await page.evaluate(()=>motionQA.audio.src.split('/').at(-1).replace('.mp3',''));
    await root.locator('[data-person="'+reducedTarget+'"]').click();
    assert.equal(await page.evaluate(()=>LearningMotion.activeCount()),0);
    assert.equal(await root.locator('.is-correct .sc-photo').evaluate(el=>getComputedStyle(el).transform),'none');
    await page.getByRole('button',{name:'Back to lesson',exact:true}).click();
    assert.ok(await page.evaluate(()=>motionQA.audio.paused));
    assert.equal(await page.evaluate(()=>LearningMotion.activeCount()),0);

    // Deterministic random input verifies replay permutations without a flaky probability assertion.
    await page.goto(route);
    await root.waitFor();
    await page.evaluate(()=>{let seed=42;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};});
    const patterns=[];
    for(let i=0;i<8;i++){
      await page.evaluate(()=>restartCurrent());
      patterns.push(await root.locator('.sc-card').evaluateAll(cards=>cards.map(card=>card.dataset.person).join(',')));
    }
    assert.ok(new Set(patterns).size>=3);
    const video=page.video();
    await context.close();
    await video.saveAs(path.join(output,'story-clues-motion.webm'));
    fs.writeFileSync(path.join(output,'motion-evidence.json'),JSON.stringify({samples,replayPatterns:patterns,video:'story-clues-motion.webm',note:'Silent browser video; native audio playback verified separately.'},null,2));
    console.log('PASS Story Clues motion: real-time source audio, changing camera transforms, word glow, reply then sampled SFX, reduced motion, cleanup and seeded replay permutations. Evidence: '+output);
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
