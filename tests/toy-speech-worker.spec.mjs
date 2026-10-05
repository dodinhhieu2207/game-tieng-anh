import assert from 'node:assert/strict';
import worker,{MODEL,CONTEXT} from '../cloudflare/toy-buddy-speech/src/index.js';
const E=globalThis.ToySpeechEvaluator;
let cases=0,calls=[];
const env={ALLOWED_ORIGINS:'https://dodinhhieu2207.github.io,http://127.0.0.1:8765',SPEECH_LIMITER:{limit:async()=>({success:true})},AI:{run:async(model,input)=>{calls.push({model,input});return {text:env.text};}}};
async function request(text,q='robot',d='robot',options={}){
 env.text=text;const form=new FormData();form.append('audio',options.audio||new Blob([new Uint8Array(600)],{type:'audio/webm'}),'answer.webm');form.append('questionToy',q);form.append('displayedToy',d);form.append('expectedAnswer',options.expected||'wrong-client-answer');if(options.questionType)form.append('questionType',options.questionType);
 return worker.fetch(new Request('https://worker.example/api/speaking-check',{method:'POST',headers:{Origin:options.origin||'https://dodinhhieu2207.github.io'},body:form}),options.env||env);
}
for(const q of E.toys)for(const d of E.toys){
 for(const [text,expected] of [['Yes, it is.',q===d?'CORRECT':'WRONG_LOGIC'],["NO IT ISN’T!",q===d?'WRONG_LOGIC':'CORRECT'],['no it is not',q===d?'WRONG_LOGIC':'CORRECT'],['yes','INCOMPLETE'],['no','INCOMPLETE'],['','UNCLEAR'],['music and noise','UNCLEAR'],['yes yes it is','UNCLEAR'],['yesterday it is','UNCLEAR']]){
  const response=await request(text,q,d);assert.equal(response.status,200);const result=await response.json();assert.equal(result.result,expected);assert.deepEqual(result,E.evaluate(text,q,d));assert.equal(response.headers.get('Cache-Control'),'no-store');cases++;
 }
}
assert.equal(calls[0].model,MODEL);assert.equal(calls[0].input.language,'en');assert.equal(calls[0].input.vad_filter,true);assert.equal(calls[0].input.initial_prompt,CONTEXT);assert(calls.every(c=>c.input.initial_prompt===CONTEXT));assert.equal(Buffer.from(calls[0].input.audio,'base64').length,600);
assert.equal((await request('yes it is','invalid')).status,400);
assert.equal((await request('yes it is','robot','robot',{origin:'https://evil.example'})).status,403);
assert.equal((await request('yes it is','robot','robot',{audio:new Blob([],{type:'audio/webm'})})).status,400);
assert.equal((await request('yes it is','robot','robot',{audio:new Blob(['noise'],{type:'text/plain'})})).status,415);
assert.equal((await request('yes it is','robot','robot',{audio:new Blob([new Uint8Array(1024*1024+1)],{type:'audio/webm'})})).status,413);
assert.equal((await request('yes it is','robot','robot',{env:{...env,SPEECH_LIMITER:{limit:async()=>({success:false})}}})).status,429);
assert.equal((await request('yes it is','robot','robot',{env:{...env,AI:{run:async()=>{throw new Error('private internals');}}}})).status,502);
assert.equal((await request('yes it is','robot','robot',{env:{...env,AI:{run:async()=>({text:'yes it is',segments:[{no_speech_prob:.9}]})}}})).status,200);
assert.equal((await (await request('yes it is','robot','robot',{env:{...env,AI:{run:async()=>({text:'yes it is',segments:[{no_speech_prob:.9}]})}}})).json()).result,'UNCLEAR');
const preflight=await worker.fetch(new Request('https://worker.example/api/speaking-check',{method:'OPTIONS',headers:{Origin:'http://127.0.0.1:8765'}}),env);assert.equal(preflight.status,204);assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),'http://127.0.0.1:8765');
for(const shown of E.toys){
 for(const spoken of E.toys)for(const text of [`It's a ${spoken}.`,`It is a ${spoken}.`,`IT’S A ${spoken}!`]){
  const r=await (await request(text,'robot',shown,{questionType:'name'})).json();assert.equal(r.result,spoken===shown?'CORRECT':'WRONG_LOGIC');cases++;
 }
 for(const text of [shown,`a ${shown}`,`it's ${shown}`,"It's a..."]){assert.equal((await (await request(text,'robot',shown,{questionType:'name'})).json()).result,'INCOMPLETE');cases++;}
 for(const text of ["What's this?",'What is this?']){assert.equal((await (await request(text,'robot',shown,{questionType:'name-question'})).json()).result,'CORRECT');cases++;}
 for(const text of ['noise',"It's a robot.",'Yes it is'])assert.equal(E.evaluate(text,'robot',shown,'name-question').result,'UNCLEAR');
}
assert.equal((await request('yes it is','robot','robot',{questionType:'invalid'})).status,400);
for(const shown of E.toys)for(const guessed of E.toys){
 const response=await request(`Is it a ${guessed}?`,'robot',shown,{questionType:'mystery-question'}),r=await response.json();assert.equal(r.result,'CORRECT');assert.equal(r.guessedToy,guessed);cases++;
}
for(const text of ['robot','is it','is it a','is it robot'])assert.equal(E.evaluate(text,'robot','teddy','mystery-question').result,'INCOMPLETE');
for(const text of ['yes it is',"it's a robot",'is it a car','noise'])assert.equal(E.evaluate(text,'robot','teddy','mystery-question').result,'UNCLEAR');
assert.equal((await worker.fetch(new Request('https://worker.example/api/speaking-check',{headers:{Origin:'http://127.0.0.1:8765'}}),env)).status,405);
// Oversize streaming body without Content-Length cannot bypass upload bounds.
const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(1024*1024+16385));c.close();}});
assert.equal((await worker.fetch(new Request('https://worker.example/api/speaking-check',{method:'POST',headers:{Origin:'http://127.0.0.1:8765','Content-Type':'multipart/form-data; boundary=test'},body:stream,duplex:'half'}),env)).status,413);
console.log(`PASS Worker: ${cases} all-five-toy grammar/logic cases; neutral English/VAD model input, CORS, method, empty/type/size/stream limits, rate limit, AI failure and no-speech. AI binding mocked, not a live Whisper inference.`);
