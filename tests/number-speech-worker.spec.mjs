import assert from 'node:assert/strict';
import worker from '../cloudflare/toy-buddy-speech/src/index.js';
const words=['one','two','three','four','five','six','seven','eight'];let heard='seven',last;
const env={ALLOWED_ORIGINS:'https://dodinhhieu2207.github.io',SPEECH_LIMITER:{limit:async()=>({success:true})},AI:{run:async(_,input)=>{last=input;return {text:heard,segments:[{avg_logprob:-.2,no_speech_prob:.01}]};}}};
async function call(target){const f=new FormData();f.append('audio',new Blob([new Uint8Array(800)],{type:'audio/webm'}),'number.webm');f.append('questionType','number-word');f.append('questionToy',target);f.append('displayedToy',target);f.append('expectedAnswer',heard);return worker.fetch(new Request('https://worker.example/api/speaking-check',{method:'POST',headers:{Origin:'https://dodinhhieu2207.github.io'},body:f}),env);}
for(const target of words){heard=target;assert.equal((await(await call(target)).json()).result,'CORRECT');assert.equal(last.initial_prompt,'');heard=String(words.indexOf(target)+1);assert.equal((await(await call(target)).json()).result,'CORRECT');heard=target==='seven'?'eight':'seven';assert.equal((await(await call(target)).json()).result,'WRONG_LOGIC');}
heard='seventy';assert.equal((await(await call('seven')).json()).result,'UNCLEAR');assert.equal((await call('nine')).status,400);
console.log('PASS number Worker integration: all 1-8 words/digits, wrong numbers, empty neutral context, no count-sequence priming, invalid targets. Model inference mocked.');
