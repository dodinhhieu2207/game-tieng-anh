/* Same deterministic grammar on the Worker and in contract tests. No AI scoring. */
(function(root){
 'use strict';
 const toys=Object.freeze(['plane','puppet','robot','balloon','teddy']);
 function normalize(text){return String(text||'').toLowerCase().replace(/[’‘ʼ`]/g,"'").replace(/[.,!?;:"()\[\]{}]/g,' ').replace(/\s+/g,' ').trim();}
 function evaluate(transcript,questionToy,displayedToy,questionType='yes-no'){
  if(!toys.includes(questionToy)||!toys.includes(displayedToy))throw new Error('INVALID_TOY');
  if(!['yes-no','name','name-question','mystery-question'].includes(questionType))throw new Error('INVALID_QUESTION_TYPE');
  transcript=typeof transcript==='string'?transcript:'';
  const normalized=normalize(transcript);
  if(questionType==='mystery-question'){
   const match=normalized.match(/^is it a (plane|puppet|robot|balloon|teddy)$/);
   const partial=toys.includes(normalized)||/^is it(?: a)?$/.test(normalized)||/^(?:a|is it) (plane|puppet|robot|balloon|teddy)$/.test(normalized);
   return {transcript,normalized,result:match?'CORRECT':partial?'INCOMPLETE':'UNCLEAR',answerType:match?'QUESTION':null,guessedToy:match?.[1]||null};
  }
  if(questionType==='name-question'){
   const full=["what's this",'whats this','what is this'].includes(normalized);
   return {transcript,normalized,result:full?'CORRECT':['what','what is',"what's",'whats','this'].includes(normalized)?'INCOMPLETE':'UNCLEAR',answerType:full?'QUESTION':null};
  }
  if(questionType==='name'){
   const match=normalized.match(/^(?:it's|its|it is) a (plane|puppet|robot|balloon|teddy)$/);
   const partial=toys.includes(normalized)||/^(?:a |(?:it's|its|it is) )(plane|puppet|robot|balloon|teddy)$/.test(normalized)||["it's",'its','it is',"it's a",'its a','it is a'].includes(normalized);
   return {transcript,normalized,result:match?(match[1]===displayedToy?'CORRECT':'WRONG_LOGIC'):partial?'INCOMPLETE':'UNCLEAR',answerType:match?'NAME':null};
  }
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
