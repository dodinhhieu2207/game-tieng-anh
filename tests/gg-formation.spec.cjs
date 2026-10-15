const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const BASE=process.env.GG_BASE||'http://127.0.0.1:8770/index.html';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:390,height:820},recordVideo:{dir:'tests/gg-formation-video',size:{width:390,height:820}}});
 const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(BASE);await p.waitForFunction(()=>window.GgWriting);
 const root=BASE.split('index.html')[0];await p.addStyleTag({url:root+'shared/gg-workshop.css?qa=formation'});
 await p.evaluate(()=>{document.body.innerHTML='<div id="formation" style="max-width:350px;margin:auto"></div>';window.mountFormation=c=>{window.pen?.dispose();window.pen=GgWriting.mount(document.getElementById('formation'),{text:c,mode:'trace'});};mountFormation('G');});
 const point=async(index,distance)=>p.evaluate(({index,distance})=>{const path=pen.refs[index],q=path.getPointAtLength(distance===null?path.getTotalLength():distance);return {x:q.x,y:q.y};},{index,distance});
 assert.deepEqual(await point(0,0),{x:103,y:32});assert.deepEqual(await point(0,null),{x:103,y:94});
 const nearEnd=await p.evaluate(()=>{const x=pen.refs[0],q=x.getPointAtLength(x.getTotalLength()-20);return {x:q.x,y:q.y};});assert(nearEnd.y>94,'G must travel UP the right edge');
 assert.deepEqual(await point(1,0),{x:74,y:94});assert.deepEqual(await point(1,null),{x:103,y:94});
 async function writeReal(){const count=await p.evaluate(()=>pen.refs.length);for(let i=0;i<count;i++){const points=await p.evaluate(()=>{const m=pen.svg.getScreenCTM();return pen.samples.map(q=>({x:m.a*q.x+m.c*q.y+m.e,y:m.b*q.x+m.d*q.y+m.f}));});await p.mouse.move(points[0].x,points[0].y);await p.mouse.down();for(const q of points.slice(1))await p.mouse.move(q.x,q.y);await p.mouse.up();assert.equal(await p.evaluate(()=>pen.index),i+1);}assert.equal(await p.locator('.gw-pen-status').textContent(),'Writing finished.');}
 assert.equal(await p.locator('.gw-motion-step').count(),3);assert.equal(await p.locator('.gw-motion-step.active text').textContent(),'1');
 await p.locator('[data-pen-demo]').click();await p.waitForFunction(()=>pen.host.dataset.motionStep==='2');await p.screenshot({path:'tests/gg-formation-G-up.png'});
 await p.waitForFunction(()=>pen.host.dataset.motionStep==='3');await p.screenshot({path:'tests/gg-formation-G-across.png'});await p.waitForFunction(()=>!pen.demo);assert.equal(await p.evaluate(()=>pen.index),0,'Demo cannot award writing credit');
 await writeReal();await p.evaluate(()=>mountFormation('g'));assert.equal(await p.evaluate(()=>pen.refs.length),2);assert.deepEqual(await point(0,0),await point(0,null),'g bowl closes before lifting');assert.deepEqual(await point(1,0),{x:95,y:70});const tail=await point(1,null);assert(tail.x<95&&tail.y>140,'descender curls left below baseline');await p.screenshot({path:'tests/gg-formation-g.png'});
 await p.locator('[data-pen-demo]').click();await p.waitForFunction(()=>pen.host.dataset.motionStep==='2');await p.waitForFunction(()=>!pen.demo);assert.equal(await p.evaluate(()=>pen.index),0);
 await writeReal();assert.deepEqual(errors,[]);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await context.close();await browser.close();console.log('PASS supplied G 1-around/2-up/3-right, two-stroke g, numbered live GSAP demo, actual pointer completion, no automatic credit, mobile layout.');
})().catch(e=>{console.error(e);process.exit(1);});
