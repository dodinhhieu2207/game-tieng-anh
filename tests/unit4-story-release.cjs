const assert = require('node:assert/strict');
const {chromium} = require(process.env.LESSON5_PLAYWRIGHT ||
  'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.U4STORY_URL || 'http://127.0.0.1:8768/index.html?qa=story';
const lesson = base + '#/unit/4/lesson/6?mode=practice';

async function run() {
  const browser = await chromium.launch({
    executablePath: process.env.LESSON5_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });
  try {
    const page = await browser.newPage({viewport:{width:1366,height:920},reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status()>=400 && new URL(response.url()).origin===new URL(base).origin) errors.push(response.url());
    });
    await page.addInitScript(() => {
      window.storyQA = {played:[],ended:[],awards:[],audio:null};
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        if (this.src.includes('/unit4/lesson6/audio/')) {
          const name = this.src.split('/').at(-1);
          this.addEventListener('playing',()=>storyQA.played.push(name),{once:true});
          this.addEventListener('ended',()=>storyQA.ended.push(name),{once:true});
          storyQA.audio=this;
          this.playbackRate=2.5;
        }
        return play.call(this);
      };
      document.addEventListener('learning:activity-completed',e=>storyQA.awards.push(e.detail.game));
    });
    const hear = async (file, button, end = true) => {
      const key = end?'ended':'played';
      const previous = await page.evaluate(({key,file})=>storyQA[key].filter(item=>item===file).length,{key,file});
      await button.click();
      await page.waitForFunction(({key,file,previous})=>storyQA[key].filter(item=>item===file).length>previous,{key,file,previous});
    };
    const widths = async selector => {
      for (const width of [320,390,768,1024,1366]) {
        await page.setViewportSize({width,height:920});
        assert.equal(await page.locator(selector).evaluate(el=>el.scrollWidth>el.clientWidth),false);
      }
    };
    const start = async (route, title) => {
      await page.goto(lesson);
      await page.getByText(title,{exact:true}).first().click();
      assert.match(page.url(),new RegExp('activity='+route+'$'));
    };

    await start('listen-and-find','Listen & Find');
    await widths('.u4-story');
    for (const [i,person,index] of [[1,'grandpa',0],[2,'mum',0],[3,null,null],[4,'brother',1]]) {
      await hear('scene-'+i+'.mp3',page.locator('[data-story-hear]'));
      if (person) {
        await page.locator('[data-story-person="'+(index===0?1:0)+'"]').click({timeout:6000});
        assert.match(await page.locator('.u4-story-status').innerText(),/try another/);
        await page.locator('[data-story-person="'+index+'"]').click();
        assert.match(await page.locator('.u4-story-controls h3').innerText(),new RegExp(person));
        await hear(person+'.mp3',page.locator('[data-story-model]'));
      }
      await page.locator('[data-story-next]').click();
    }
    assert.ok(await page.getByText('Well done!',{exact:true}).isVisible());

    await start('picture-clue','Picture Clue Challenge');
    await widths('.picture-clue');
    await page.getByRole('button',{name:'Show the picture'}).click();
    await hear('grandpa.mp3',page.locator('[data-clue-model]'));

    await start('story-order','Story Order & Tell');
    await widths('.u4-story');
    for (const [index,number] of [2,1,3,4].entries()) {
      await page.locator('[data-tile="'+number+'"]').click();
      await page.locator('[data-slot="'+(index+1)+'"]').click();
    }
    await page.locator('[data-order-reset]').click();
    await page.locator('[data-tile="1"]').dragTo(page.locator('[data-slot="1"]'));
    for (const number of [2,3,4]) {
      await page.locator('[data-tile="'+number+'"]').click();
      await page.locator('[data-slot="'+number+'"]').click();
    }
    await page.locator('[data-slot="4"]').click();
    await hear('scene-4.mp3',page.locator('[data-order-hear]'));
    await page.locator('[data-order-finish]').click();
    assert.ok(await page.getByText('Well done!',{exact:true}).isVisible());

    await start('roleplay-stage','Your Turn');
    await widths('.story-speaking');
    assert.match(await page.locator('.sspeak-line').innerText(),/grandpa/);
    assert.deepEqual(await page.evaluate(()=>storyQA.awards),['u4storyfind','u4storyorder']);
    await hear('grandpa.mp3',page.locator('[data-say=model]'),false);
    await page.getByRole('button',{name:'Back to lesson'}).click();
    assert.ok(await page.evaluate(()=>storyQA.audio.paused));
    assert.deepEqual(errors,[]);
    console.log('PASS: four activity entries, five widths, native audio, story order, awards and speaking entry audio cleanup');
  } finally {
    await browser.close();
  }
}

run().catch(error=>{console.error(error);process.exitCode=1;});
