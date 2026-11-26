import assert from 'node:assert/strict';
import worker from '../cloudflare/toy-buddy-speech/src/index.js';
const E=globalThis.ToySpeechEvaluator;
let cases=0;
for(const target of E.feelings){
 for(const spoken of E.feelings){const [p,w]=spoken.split('-');for(const text of [`${p}'s ${w}`,`${p} is ${w}`,`Um, ${p} is ${w} ${w}.`]){const r=E.evaluate(text,target,target,'feeling-sentence');assert.equal(r.result,spoken===target?'CORRECT':'WRONG_LOGIC');cases++;}}
 for(const text of ['happy','sad','hungry','thirsty','hot','cold','he happy','she cold','he is','she']){assert.equal(E.evaluate(text,target,target,'feeling-sentence').result,'INCOMPLETE');cases++;}
 for(const text of ["he isn't happy",'she is not cold']){assert.equal(E.evaluate(text,target,target,'feeling-sentence').result,'WRONG_LOGIC');cases++;}
 for(const text of ['', 'noise','a happy child','I am happy',"he's hungry and she's sad",'he was cold']){assert.equal(E.evaluate(text,target,target,'feeling-sentence').result,'UNCLEAR');cases++;}
}
async function request(text,target,segments=[{avg_logprob:-.2,no_speech_prob:.1}]){
 let input;
 const form=new FormData();form.append('audio',new Blob([new Uint8Array(600)],{type:'audio/webm'}),'answer.webm');form.append('questionType','feeling-sentence');form.append('questionToy',target);form.append('displayedToy',target);
 const response=await worker.fetch(new Request('https://worker.example/api/speaking-check',{method:'POST',headers:{Origin:'http://127.0.0.1:8765'},body:form}),{ALLOWED_ORIGINS:'http://127.0.0.1:8765',SPEECH_LIMITER:{limit:async()=>({success:true})},AI:{run:async(model,i)=>{input=i;return {text,segments}}}});
 return {response,input};
}
for(const target of E.feelings){const [p,w]=target.split('-');const {response,input}=await request(`${p}'s ${w}`,target);assert.equal(response.status,200);assert.equal((await response.json()).result,'CORRECT');assert.equal(input.initial_prompt,'English feelings vocabulary: happy, sad, hungry, thirsty, hot, cold.');}
assert.equal((await (await request("he's happy",'he-happy',[{avg_logprob:-2,no_speech_prob:.1}])).response.json()).result,'UNCLEAR');
assert.equal((await request("he's happy",'he-happiness')).response.status,400);
console.log(`PASS ${cases} strict feelings sentence cases, complete vocabulary context and uncertainty/input safeguards; AI mocked, no child accuracy claim.`);
