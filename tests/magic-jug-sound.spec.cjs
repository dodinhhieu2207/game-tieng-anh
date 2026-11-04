const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const p=await b.newPage({viewport:{width:390,height:900}});
 await p.addInitScript(()=>{window.audios=[];const A=window.Audio;window.Audio=function(s){const a=new A(s);if(String(s).includes('magic-jug'))window.audios.push(a);return a}});
 await p.goto((process.env.MAGIC_JUG_BASE||'http://127.0.0.1:8773')+'/index.html?qa=jjsound4#/unit/4/lesson/3?mode=practice&activity=magic-jug');await p.locator('.mj-canvas canvas').waitFor();
 await p.locator('[data-mj=name]').click();await p.waitForTimeout(100);await p.locator('[data-mj=sound]').click();assert.ok(await p.evaluate(()=>audios.filter(a=>a.src.endsWith('letter.mp3')).every(a=>a.paused)),'name interrupted');
 await p.locator('[data-mj=sound]').click();assert.equal(await p.evaluate(()=>audios.filter(a=>!a.paused).length),1,'only one playing');
 await p.locator('summary[aria-label="Game controls"]').click();await p.locator('[data-shell-action=sound]').click();assert.ok(await p.evaluate(()=>audios.every(a=>a.paused)),'mute stops all');await p.locator('summary[aria-label="Game controls"]').click();
 await p.locator('[data-mj=sound]').click();assert.match(await p.locator('.mj-status').textContent(),/Sound is off/);
 await p.locator('summary[aria-label="Game controls"]').click();await p.locator('[data-shell-action=sound]').click();await p.locator('summary[aria-label="Game controls"]').click();
 await p.route('**/assets/magic-jug/audio/sound-j.wav',r=>r.abort());await p.locator('[data-mj=sound]').click();await p.locator('.mj-status').filter({hasText:'Sound could not play'}).waitFor();assert.equal(await p.locator('.magic-jug').getAttribute('data-heard'),'0');assert.ok(await p.evaluate(()=>audios.every(a=>a.paused)),'failed clip stopped');
 await p.unroute('**/assets/magic-jug/audio/sound-j.wav');await p.locator('[data-mj=sound]').click();await p.waitForFunction(()=>audios.at(-1)?.ended);assert.ok(await p.evaluate(()=>Math.abs(audios.at(-1).duration-2.205)<.01));
 await p.screenshot({path:'tests/magic-jug-sound-390.png',fullPage:true});await p.locator('[data-mj=sound]').click();await p.evaluate(()=>LearningApp.go('/unit/4/lesson/3?mode=practice'));await p.waitForTimeout(100);assert.ok(await p.evaluate(()=>audios.every(a=>a.paused)),'leave stops all');
 console.log('PASS selected sound actual playback/duration, separate name, no overlap, mute, error/retry, no false discovery progress, leave cleanup');
}finally{await b.close()}})();
