const assert=require('node:assert/strict'),E=require('../shared/speech-evaluator.js');
const names=['one','two','three','four','five','six','seven','eight'];
for(const target of names)for(let i=0;i<names.length;i++)for(const said of [names[i],String(i+1),names[i]+'.']){
 const r=E.evaluate(said,target,target,'number-word');
 assert.equal(r.result,names[i]===target?'CORRECT':'WRONG_LOGIC');
 assert.equal(r.answerType,'WORD');assert.equal(r.normalized,names[i]);
}
for(const said of ['', 'ate','seven eight','seventy','eighteen','17','8 cars','seven cars','robot','yes'])assert.equal(E.evaluate(said,'seven','seven','number-word').result,'UNCLEAR');
assert.throws(()=>E.evaluate('seven','nine','seven','number-word'),/INVALID_TOY/);
console.log('PASS number speech contract: exact words/digits 1-8, wrong numbers rejected, no phrase/homophone/teen-number guessing.');
