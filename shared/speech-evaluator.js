/* Same deterministic grammar on the Worker and in contract tests. No AI scoring. */
(function(root){
 'use strict';
 const toys=Object.freeze(['plane','puppet','robot','balloon','teddy']);
 function normalize(text){return String(text||'').toLowerCase().replace(/[’‘ʼ`]/g,"'").replace(/[.,!?;:"()\[\]{}]/g,' ').replace(/\s+/g,' ').trim();}
 function evaluate(transcript,questionToy,displayedToy){
  if(!toys.includes(questionToy)||!toys.includes(displayedToy))throw new Error('INVALID_TOY');
  transcript=typeof transcript==='string'?transcript:'';
  const normalized=normalize(transcript);
  const positive=normalized==='yes it is',negative=["no it isn't",'no it isnt','no it is not'].includes(normalized);
  const partial=normalized==='yes'||normalized==='no';
  const answerType=positive||normalized==='yes'?'YES':negative||normalized==='no'?'NO':null;
  const result=partial?'INCOMPLETE':!positive&&!negative?'UNCLEAR':positive===(questionToy===displayedToy)?'CORRECT':'WRONG_LOGIC';
  return {transcript,normalized,result,answerType};
 }
 const api=Object.freeze({toys,normalize,evaluate});
 root.ToySpeechEvaluator=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
