const assert=require('node:assert/strict');
const {NumberTask,words,liftGoalOrder}=require('../shared/number-task.js');
const seen=new Set(),plans=new Set();
for(let seed=1;seed<=2000;seed++){
 let state=seed;const rng=()=>((state=(1664525*state+1013904223)>>>0)/4294967296);
 const plan=liftGoalOrder(rng);
 assert.equal(plan.length,8);assert.deepEqual([...plan.slice(0,2)].sort((a,b)=>a-b),[9,10]);
 const review=plan.slice(2);assert.equal(new Set(review).size,6);assert(review.filter(n=>n<=8).length>=4);
 assert(plan.every(n=>Number.isInteger(n)&&n>=1&&n<=10));
 assert(plan.every((n,i)=>i===0||n!==plan[i-1]));
 review.forEach(n=>seen.add(n));plans.add(plan.join(','));
 for(const n of plan){const task=new NumberTask(n,n,{allowReview:true});assert(task.test());assert.equal(task.word,words[n])}
 const replay=liftGoalOrder(()=>0, liftGoalOrder(()=>0));assert.notDeepEqual(replay,liftGoalOrder(()=>0));
}
assert.equal(seen.size,10);assert(plans.size>1000);
for(const n of [1,2,3,4,5,6,7,8])assert.throws(()=>new NumberTask(n));
for(const n of [0,11,-1,2.5,NaN,'3'])assert.throws(()=>new NumberTask(n,0,{allowReview:true}));
console.log('PASS 2000 seeded plans, 1–10 coverage, focus/review/replay invariants and opt-in model bounds');
