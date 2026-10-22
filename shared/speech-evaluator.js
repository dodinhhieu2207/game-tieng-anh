/* Same deterministic grammar on the Worker and in contract tests. No AI scoring. */
(function(root){
 'use strict';
 const toys=Object.freeze(['plane','puppet','robot','balloon','teddy']);
 const school=Object.freeze(['desk','chair','pencil','crayon','notebook','egg','elephant','fish','farm']);
 const phonics=Object.freeze(['girl','guitar']);
 const numbers=Object.freeze(['one','two','three','four','five','six','seven','eight']);
 const storyLines=Object.freeze({
  'teddy-question':[/^is it a teddy(?: bear)?$/],
  'plane-question':[/^is it a plane$/],
  'robot-question':[/^is it a robot$/],
  'no-answer':[/^no it (?:isn't|isnt|is not)$/],
  'yes-answer':[/^yes it is$/],
  'open-it':[/^open it$/],
  'billy-present':[/^billy my present$/],
  'robot-name':[/^(?:it's|its|it is) a robot$/],
  'teddy-cheer':[/^teddy bear(?: teddy bear)?$/],
  'billy-robot':[/^(?:i'm|im|i am) a robot$/]
 });
 const questionTypes=Object.freeze(['yes-no','name','school-name','name-question','mystery-question','toy-word','gg-word','gg-letter-name','number-word','story-line']);
 const vocabularyFor=type=>type==='story-line'?Object.keys(storyLines):type==='number-word'?numbers:type==='gg-letter-name'?['G']:type==='school-name'?school:type==='gg-word'?phonics:toys;
 // Bounded ASR spellings/homophones, independent of the displayed answer.
 // Do not fuzzy-match short words such as cat/car, or add missing grammar.
 const aliases=Object.freeze({'plain':'plane','airplane':'plane','aeroplane':'plane','ro bot':'robot','robo':'robot','baloon':'balloon','ballon':'balloon','tedi':'teddy','teddie':'teddy','gurl':'girl','guitah':'guitar','guiter':'guitar','pensil':'pencil','pencill':'pencil','cray on':'crayon','note book':'notebook','elefant':'elephant'});
 function canonicalWords(text,type){const vocabulary=type==='story-line'?toys:vocabularyFor(type);let value=text;for(const [heard,word] of Object.entries(aliases))if(vocabulary.includes(word))value=value.replace(new RegExp('\\b'+heard+'\\b','g'),word);return value;}
 function normalize(text){return String(text||'').toLowerCase().replace(/[’‘ʼ`]/g,"'").replace(/[.,!?;:"()\[\]{}]/g,' ').replace(/\s+/g,' ').trim();}
 function evaluate(transcript,questionToy,displayedToy,questionType='yes-no'){
  const vocabulary=vocabularyFor(questionType);
  if(!vocabulary.includes(questionToy)||!vocabulary.includes(displayedToy))throw new Error('INVALID_TOY');
  if(!questionTypes.includes(questionType))throw new Error('INVALID_QUESTION_TYPE');
  transcript=typeof transcript==='string'?transcript:'';
  // Only remove fillers and adjacent repeated words. Never invent missing grammar or toy names.
  const normalized=canonicalWords(normalize(transcript).replace(/\b(?:um|uh|erm|er|hmm)\b/g,' ').replace(/\s+/g,' ').trim().split(' ').filter((w,i,a)=>i===0||w!==a[i-1]).join(' '),questionType);
  if(questionType==='story-line'){
   const matches=Object.entries(storyLines).filter(([,patterns])=>patterns.some(p=>p.test(normalized))).map(([id])=>id);
   const correct=matches.includes(displayedToy);
   const partial=['yes','no','robot','teddy','teddy bear','open','billy','my present',"i'm",'i am','is it'].includes(normalized);
   return {transcript,normalized,result:correct?'CORRECT':matches.length?'WRONG_LOGIC':partial?'INCOMPLETE':'UNCLEAR',answerType:correct||matches.length?'NAME':null};
  }
  if(questionType==='number-word'){
   const value=/^[1-8]$/.test(normalized)?numbers[Number(normalized)-1]:normalized;
   const known=numbers.includes(value);
   return {transcript,normalized:value,result:known?(value===displayedToy?'CORRECT':'WRONG_LOGIC'):'UNCLEAR',answerType:known?'WORD':null};
  }
  if(questionType==='gg-letter-name'){
   const named=['g','gee','letter g','the letter g','letter gee'].includes(normalized);
   const other=/^(?:letter |the letter )?[abcdefh-z]$/.test(normalized);
   return {transcript,normalized,result:named?'CORRECT':other?'WRONG_LOGIC':'UNCLEAR',answerType:named||other?'NAME':null};
  }
  if(questionType==='toy-word'||questionType==='gg-word'){
   const word=vocabulary.includes(normalized);
   return {transcript,normalized,result:word?(normalized===displayedToy?'CORRECT':'WRONG_LOGIC'):'UNCLEAR',answerType:word?'WORD':null};
  }
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
 const api=Object.freeze({toys,school,phonics,questionTypes,vocabularyFor,normalize,evaluate,canonicalWords});
 root.ToySpeechEvaluator=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
