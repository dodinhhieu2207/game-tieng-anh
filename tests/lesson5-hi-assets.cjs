const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.HI_BASE||'http://127.0.0.1:8770/index.html';
const readConfig=s=>{const c={window:{}};vm.runInNewContext(s,c);return JSON.parse(JSON.stringify(c.window.LearningConfig));};
const current=readConfig(fs.readFileSync('data/units.js','utf8')),previous=readConfig(cp.execFileSync('git',['show','ce85bf5:data/units.js'],{encoding:'utf8'}));
for(const u of previous.units)for(const l of u.lessons)if(!(u.id===3&&l.id===5))assert.deepEqual(current.units.find(x=>x.id===u.id).lessons.find(x=>x.id===l.id),l);
assert.equal(current.units.find(x=>x.id===3).lessons[4].activities.length,0);
const root='assets/unit3/lesson5/',manifest=JSON.parse(fs.readFileSync(root+'asset-manifest.json'));
assert.equal(manifest.length,20);for(const a of manifest)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+a.file)).digest('hex'),a.sha256);
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(base+'#/unit/3');await p.locator('[data-lesson="5"]').waitFor();assert.equal(await p.locator('[data-lesson]').count(),6);assert.match(await p.locator('[data-lesson="5"]').innerText(),/Letters and Sounds/);await p.locator('[data-lesson="5"]').click();await p.locator('.lesson-asset-preview').waitFor();
const storageBefore=await p.evaluate(()=>JSON.stringify(localStorage));
assert.deepEqual(await p.locator('.lap-word-group figcaption').allTextContents(),['hat','horse','ill','insect']);
for(const width of [320,390,768,1024,1366]){await p.setViewportSize({width,height:1000});await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>[...document.querySelectorAll('.lesson-asset-preview img')].every(i=>i.complete&&i.naturalWidth>0));assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);for(const a of await p.locator('.lap-footer a').all()){const r=await a.boundingBox();assert(r.width>=48&&r.height>=48);}await p.locator('.lesson-asset-preview').screenshot({path:`tests/lesson5-hi-${width}.png`});}
assert.equal(await p.evaluate(()=>JSON.stringify(localStorage)),storageBefore);assert.equal(await p.locator('.lesson-asset-preview button,audio,canvas').count(),0);
await p.goto(new URL('assets/unit3/lesson5/catalog.html',base).href);await p.waitForFunction(()=>[...document.images].length===20&&[...document.images].every(i=>i.complete&&i.naturalWidth>0));await p.screenshot({path:'tests/lesson5-hi-catalog.png',fullPage:true});assert.deepEqual(errors,[]);await b.close();console.log('PASS: twenty hashes; other lessons unchanged; six-card navigation; exact vocabulary; five widths/images/48px links; no preview progress writes or game controls; full catalog loads.');})().catch(e=>{console.error(e);process.exit(1);});
