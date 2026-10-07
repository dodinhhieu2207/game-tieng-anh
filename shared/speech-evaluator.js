/* Same deterministic grammar on the Worker and in contract tests. No AI scoring. */
(function(root){
 'use strict';
 const toys=Object.freeze(['plane','puppet','robot','balloon','teddy']);
 const school=Object.freeze(['desk','chair','pencil','crayon','notebook','egg','elephant','fish','farm']);
 function normalize(text){return String(text||'').toLowerCase().replace(/[’‘ʼ`]/g,"'").replace(/[.,!?;:"()\[\]{}]/g,' ').replace(/\s+/g,' ').trim();}
 function evaluate(transcript,questionToy,displayedToy,questionType='yes-no'){
  const vocabulary=questionType==='school-name'?school:toys;
  if(!vocabulary.includes(questionToy)||!vocabulary.includes(displayedToy))throw new Error('INVALID_TOY');
  if(!['yes-no','name','school-name','name-question','mystery-question'].includes(questionType))throw new Error('INVALID_QUESTION_TYPE');
  transcript=typeof transcript==='string'?transcript:'';
  // Only remove fillers and adjacent repeated words. Never invent missing grammar or toy names.
  const normalized=normalize(transcript).replace(/\b(?:um|uh|erm|er|hmm)\b/g,' ').replace(/\s+/g,' ').trim().split(' ').filter((w,i,a)=>i===0||w!==a[i-1]).join(' ');
  if(questionType==='mystery-question'){
   const match=normalized.match(/^is it a (plane|puppet|robot|balloon|teddy)$/);
   const partial=toys.includes(normalized)||/^is it(?: a)?$/.test(normalized)||/^(?:a|is it) (plane|puppet|robot|balloon|teddy)$/.test(normalized);
   return {transcript,normalized,result:match?'CORRECT':partial?'INCOMPLETE':'UNCLEAR',answerType:match?'QUESTION':null,guessedToy:match?.[1]||null};
  }
  if(questionType==='name-question'){
   const full=["what's this",'whats this','what is this'].includes(normalized);
   return {transcript,normalized,result:full?'CORRECT':['what','what is',"what's",'whats','this'].includes(normalized)?'INCOMPLETE':'UNCLEAR',answerType:full?'QUESTION':null};
  }
  if(questionType==='name'||questionType==='school-name'){
   const names=vocabulary.join('|'),match=normalized.match(new RegExp("^(?:it's|its|it is) (a|an) ("+names+")$"));
   const full=match&&match[1]===(['egg','elephant'].includes(match[2])?'an':'a');
   const partial=vocabulary.includes(normalized)||new RegExp("^(?:a |an |(?:it's|its|it is) )("+names+")$").test(normalized)||["it's",'its','it is',"it's a",'its a','it is a'].includes(normalized)||!!match;
   return {transcript,normalized,result:full?(match[2]===displayedToy?'CORRECT':'WRONG_LOGIC'):partial?'INCOMPLETE':'UNCLEAR',answerType:full?'NAME':null};
  }
  const positive=normalized==='yes it is',negative=["no it isn't",'no it isnt','no it is not'].includes(normalized);
  const partial=normalized==='yes'||normalized==='no';
  const answerType=positive||normalized==='yes'?'YES':negative||normalized==='no'?'NO':null;
  const result=partial?'INCOMPLETE':!positive&&!negative?'UNCLEAR':positive===(questionToy===displayedToy)?'CORRECT':'WRONG_LOGIC';
  return {transcript,normalized,result,answerType};
 }
 const api=Object.freeze({toys,school,normalize,evaluate});
 root.ToySpeechEvaluator=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
