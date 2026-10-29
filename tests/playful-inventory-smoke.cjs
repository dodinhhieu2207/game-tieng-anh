const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage({viewport:{width:1366,height:1000}});
 const entries=JSON.parse(fs.readFileSync('docs/design/GAME_UPGRADE_INVENTORY.json')).entries.filter(e=>!e.group);
 const errors=[],rows=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8770/index.html');
 const registry=await p.evaluate(()=>Object.keys(games));
 for(const row of entries){
  const start=errors.length;await p.evaluate(route=>LearningApp.go(route),row.route);await p.waitForTimeout(300);
  const result=await p.evaluate(()=>({game:currentGame,stageChildren:document.querySelector('#gameStage').children.length,font:getComputedStyle(document.body).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth}));
  const widths=[];for(const width of [320,390,768,1024,1366]){await p.setViewportSize({width,height:1000});await p.waitForTimeout(80);widths.push({width,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)})}rows.push({game:row.game,...result,widths,errors:errors.slice(start)});
 }
 await p.goto('http://127.0.0.1:8770/index.html#/letters');await p.waitForTimeout(500);
 const letters=await p.locator('#spaceLetters [data-game]').evaluateAll(a=>a.map(e=>e.dataset.game));
 fs.writeFileSync('docs/design/PLAYFUL_SMOKE_RESULT.json',JSON.stringify({date:'2026-10-29',meaning:'Initial route mount smoke only. Not full gameplay/animation/audio acceptance.',registry,letters,rows},null,2)+'\n');
 console.log(JSON.stringify({mounted:rows.length,registry:registry.length,letters,errors:rows.filter(r=>r.errors.length),overflows:rows.filter(r=>r.widths.some(w=>w.overflow)).map(r=>({game:r.game,widths:r.widths.filter(w=>w.overflow)})),empty:rows.filter(r=>!r.stageChildren)}));await b.close();
 if(rows.some(r=>r.errors.length||!r.stageChildren))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
