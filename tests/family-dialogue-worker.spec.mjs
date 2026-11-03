import assert from 'node:assert/strict';
import worker from '../cloudflare/toy-buddy-speech/src/index.js';

let heard='Yes, it is.',last;
const env={ALLOWED_ORIGINS:'https://dodinhhieu2207.github.io',SPEECH_LIMITER:{limit:async()=>({success:true})},AI:{run:async(_,input)=>{last=input;return {text:heard,segments:[{avg_logprob:-.2,no_speech_prob:.01}]}}}};
async function check(asked,shown){const f=new FormData();f.append('audio',new Blob([new Uint8Array(800)],{type:'audio/webm'}),'family.webm');f.append('questionType','family-yes-no');f.append('questionToy',asked);f.append('displayedToy',shown);const r=await worker.fetch(new Request('https://worker.example/api/speaking-check',{method:'POST',headers:{Origin:'https://dodinhhieu2207.github.io'},body:f}),env);return {status:r.status,body:await r.json()}}
assert.equal((await check('mum','mum')).body.result,'CORRECT');
assert.match(last.initial_prompt,/Yes, it is/);
heard="No, it isn't.";assert.equal((await check('dad','mum')).body.result,'CORRECT');
heard='Yes, it is.';assert.equal((await check('dad','mum')).body.result,'WRONG_LOGIC');
heard='No';assert.equal((await check('dad','mum')).body.result,'INCOMPLETE');
assert.equal((await check('puppet','mum')).status,400);
console.log('PASS family yes/no Worker contract with mocked transcription');
