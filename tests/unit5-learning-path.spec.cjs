const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context={window:{}};vm.runInNewContext(fs.readFileSync('shared/unit5-learning.js','utf8'),context);
const Path=context.window.Unit5Learning.Path;
const p=new Path();
assert.throws(()=>p.record('happy',false),/Unsupported/);
p.expose('happy');p.record('happy',true);assert.equal(p.records.happy.independent,0);
p.next();p.expose('sad');p.record('sad',true);assert(!p.ready);assert.equal(p.advance(),false);
// Repeated support, wrong-answer correction or model display never earns retrieval.
for(let i=0;i<4;i++){p.next();p.record(p.target,true)}
assert.equal(p.records.happy.independent+p.records.sad.independent,0);
for(let i=0;i<4;i++){p.next();p.record(p.target,false)}
assert(p.ready);assert.equal(p.pair,0,'readiness must not automatically move the pair');
p.next();p.record(p.target,true);assert(p.ready,'teacher can keep the same pair');
assert(p.advance());assert.equal(p.pair,1);assert.equal(p.pool.join(','),'hungry,thirsty');
while(!p.complete){
 for(let i=0;i<6;i++){p.expose(p.target);p.record(p.target,i<2);if(i<5)p.next()}
 assert(p.ready);p.advance();
}
assert.equal(p.records.cold.independent,2);assert.equal(p.history.filter(r=>!r.assisted).length,12);
assert.equal(p.next(),null);assert.throws(()=>p.record('cold',false),/Unsupported/);
const h=new Path(true);assert.equal(h.pool.join(','),'hungry,thirsty');assert.equal(h.pairs.length,2);
// Even a caller that repeats a target on adjacent turns cannot raise it twice.
const gap=new Path();gap.expose('happy');gap.record('happy',false);gap.record('happy',false);gap.record('happy',false);assert.equal(gap.records.happy.independent,1);
gap.next();gap.expose('sad');gap.record('sad',false);gap.next();gap.record('happy',false);assert.equal(gap.records.happy.independent,2);
assert.equal(p.advance(),false);
console.log('PASS pair readiness, explicit advance, spaced clean retrieval, assisted exclusion, repeat and helping scope');
