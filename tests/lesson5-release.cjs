const assert = require('node:assert/strict');
const { chromium } = require(process.env.LESSON5_PLAYWRIGHT ||
  'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.LESSON5_URL || 'http://127.0.0.1:8765/index.html?qa=lesson5';
const route = game => base + '#/unit/4/lesson/5?mode=practice&activity=' + game;

async function trace(page) {
  for (let stroke = 0; await page.locator('.mk-slip .trace-card.active').count(); stroke++) {
    assert.ok(stroke < 34, 'Tracing stalled');
    const svg = page.locator('.mk-slip .trace-card.active svg');
    await svg.evaluate(el => el.scrollIntoView({block:'center', behavior:'instant'}));
    const points = await svg.evaluate(el => {
      const dot = el.querySelector('.trace-dot.current');
      const path = el.querySelector('[data-trace-stroke="'+dot.dataset.traceDot+'"]');
      const length = path.getTotalLength(), matrix = el.getScreenCTM();
      const samples = [];
      for (let t = 0; t < length; t += 4) samples.push(t);
      samples.push(length);
      return samples.map(t => {
        const p = path.getPointAtLength(t).matrixTransform(matrix);
        return [p.x,p.y];
      });
    });
    await page.mouse.move(...points[0]);
    await page.mouse.down();
    for (const point of points.slice(1)) await page.mouse.move(...point);
    await page.mouse.up();
  }
}

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.LESSON5_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']
  });
  try {
    const page = await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on('pageerror',error => errors.push(error));
    page.on('response',response => {
      if(response.status()>=400 && new URL(response.url()).origin===new URL(base).origin) errors.push(response.url());
    });
    await page.addInitScript(() => {
      window.qaAudio = [];
      window.qaAwards = [];
      document.addEventListener('learning:activity-completed',event=>qaAwards.push(event.detail.game));
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function() {
        this.addEventListener('playing',()=>qaAudio.push(this.src),{once:true});
        return play.call(this);
      };
    });
    const count = async key => page.evaluate(key=>qaAwards.filter(game=>game===key).length,key);
    const native = async file => page.waitForFunction(file=>qaAudio.some(src=>src.endsWith(file)),file);

    await page.goto(route('cloud-pilot'));
    const cloud = page.locator('.cloud-pilot');
    for (const width of [320,390,768,1024,1366]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await cloud.evaluate(el=>el.scrollWidth>el.clientWidth),false);
    }
    await page.setViewportSize({width:390,height:900});
    for(let i=0;i<8;i++){
      const chapter=i<2?'listen':i<6?'picture':'compare';
      assert.equal(await cloud.getAttribute('data-chapter'), chapter);
      const word=await page.evaluate(()=>ToyDelivery.current().target);
      const good=cloud.locator('[data-word="'+word+'"]');
      const wrong=cloud.locator('[data-lane]:not([data-word="'+word+'"])');
      if(i<2){
        if(i===0){
          await good.click();
          assert.match(await cloud.locator('[data-td-status]').textContent(),/Hear the sound/);
          assert.equal(await cloud.locator('.cpk-lesson').isVisible(),false);
        }
        await cloud.locator('[data-td-hint]').click();
        await page.waitForFunction(()=>ToyDelivery.current().hintHeard);
      }
      if(chapter==='compare') assert.equal((await wrong.getAttribute('data-word'))[0],word[0]);
      if(i===2){
        await wrong.click();
        assert.match(await cloud.locator('[data-td-status]').textContent(),/Try/);
      }
      if(i===0||i===2||i===6){
        await page.emulateMedia({reducedMotion:'no-preference'});
        await good.click();
        await page.waitForFunction(name=>document.querySelector('.cpk-contact')?.src.includes(name+'.gif'),
          {listen:'radio',picture:'cloud-split',compare:'cargo'}[chapter]);
      }else{
        await page.emulateMedia({reducedMotion:'reduce'});
        await good.click();
      }
      await cloud.locator('[data-td-next]').waitFor();
      const last=(await page.evaluate(()=>qaAudio)).filter(url=>url.endsWith('.mp3')).slice(-3);
      assert.ok(last[0].endsWith('/letter-'+word[0]+'.mp3'));
      assert.ok(last[1].endsWith('/sound-'+word[0]+'.mp3'));
      assert.ok(last[2].endsWith('/'+word+'.mp3'));
      await cloud.locator('[data-td-next]').click();
    }
    assert.equal(await cloud.locator('.cpk-cargo img').count(),4);
    assert.equal(await count('u4cloudpilot'),1);
    console.log('PASS Cloud Pilot: all 8 flights, all 3 chapters, audio sequence, cargo, 5 widths');

    if (process.env.LESSON5_CLOUD_ONLY) return;
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(route('letter-parade'));
    const parade=page.locator('.lp-game');
    for(const piece of ['fork','foot','small-fork','stem']){
      await parade.locator('[data-piece="'+piece+'"]').click();
      await parade.locator('[data-slot]').click();
      await parade.locator('[data-next]').click();
    }
    for(let i=0;i<4;i++){
      const letter=await parade.locator('.lp-model img').getAttribute('alt');
      const match=letter===letter.toUpperCase()?letter.toLowerCase():letter.toUpperCase();
      await parade.locator('button[data-letter="'+match+'"]').click();
      await parade.locator('[data-next]').waitFor();
      if(i<3) await parade.locator('[data-next]').click();
    }
    assert.equal(await count('u4letterparade'),1);
    console.log('PASS Letter Parade: 8 rounds and award');

    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto(route('scene-director'));
    const director=page.locator('.sd-game');
    for(const [index,actor,prop] of [[0,'lion','key'],[1,'kangaroo','lollipop'],[2,'lion','lollipop'],[3,'kangaroo','key']]){
      await director.locator('[data-hear]').click();
      await native('/give-'+actor+'-'+prop+'-belinda.mp3');
      await director.locator('[data-prop="'+prop+'"]').click();
      await director.locator('[data-actor="'+actor+'"]').click();
      await page.waitForFunction(actor=>document.querySelector('.sd-game [data-actor="'+actor+'"] img').src.startsWith('blob:'),actor);
      await director.locator('[data-reset]').waitFor();
      if(index<3)await director.locator('[data-reset]').click();
    }
    assert.equal(await count('u4scenedirector'),1);
    console.log('PASS Scene Director: 4 Belinda cues, all GIFs and award');

    await page.goto(route('shadow-stage'));
    const shadow=page.locator('.ss-game');
    await shadow.locator('[data-act=operate]').click();
    await shadow.locator('.ss-seated .ss-key-bow').waitFor();
    await shadow.locator('[data-act=operate]').click();
    await shadow.locator('.ss-done .ss-bolt-retracted').waitFor();
    for(let i=0;i<2;i++){
      await shadow.locator('[data-act=turn]').click();
      await shadow.locator('[data-act=operate]').click();
    }
    await shadow.locator('[data-act=turn]').click();
    await shadow.locator('.ss-finale').waitFor();
    assert.equal(await count('u4shadowstage'),1);
    console.log('PASS Shadow Stage: lock, lift, cart and finale');

    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(route('missing-key'));
    const missing=page.locator('.mk-game');
    for(let i=0;i<8;i++){
      await missing.locator('.mk-teacher summary').click();
      await missing.locator('[data-act=confirm]').click();
      if(i<4){
        await missing.locator('[data-act=trace]').click();
        await trace(page);
      }
      await missing.locator('[data-act=next]').click();
    }
    await missing.and(page.locator('.mk-finale')).waitFor();
    assert.equal(await count('u4missingkey'),1);
    console.log('PASS The Missing Key: 4 real traces and 4 teacher-confirmed recall rounds');

    await page.goto(new URL('assets/beat-band/preview.html',base).href);
    await page.locator('button').click();
    await page.waitForFunction(()=>document.querySelector('img').src.startsWith('blob:'));
    await page.locator('button:enabled').waitFor();
    assert.deepEqual(errors,[]);
    console.log('PASS Beat Band: approved two-hand GIF preview');
  }finally{await browser.close();}
}

main().catch(error=>{console.error(error);process.exitCode=1;});
