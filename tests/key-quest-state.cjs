const assert=require('node:assert/strict'),M=require('../shared/key-quest-state.js');
let seed=32;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
let prev=[];for(let i=0;i<1000;i++){const a=M.order(random,prev);assert.equal(new Set(a).size,4);assert.notDeepEqual(a,prev);assert.notEqual(M.WORDS[a[0]],M.WORDS[a[1]]);assert.notEqual(M.WORDS[a[2]],M.WORDS[a[3]]);for(const w of a){assert(M.accepts(w,M.WORDS[w].toUpperCase()));assert(!M.accepts(w,M.WORDS[w]==='k'?'L':'K'))}prev=a}
console.log('PASS 1000 finite plans: both letters in each half, four rewards, semantics, replay');
