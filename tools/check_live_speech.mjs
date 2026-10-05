/* Live inference smoke check, using provided synthetic lesson audio, never child recordings. */
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const endpoint=process.argv[2],origin=process.argv[3]||'https://dodinhhieu2207.github.io';
if(!endpoint||new URL(endpoint).protocol!=='https:')throw new Error('Usage: node tools/check_live_speech.mjs https://WORKER/api/speaking-check [Pages origin]');
for(const toy of ['plane','puppet','robot','balloon','teddy'])for(const truth of [true,false]){
 const audio=await fs.readFile(new URL('../assets/unit3/lesson2/audio/answers/'+(truth?'yes_it_is':'no_it_isnt')+'.mp3',import.meta.url));
 const form=new FormData();form.append('audio',new Blob([audio],{type:'audio/mpeg'}),'synthetic-lesson-answer.mp3');form.append('questionToy',toy);form.append('displayedToy',truth?toy:toy==='robot'?'teddy':'robot');form.append('expectedAnswer','deliberately-untrusted');
 const response=await fetch(endpoint,{method:'POST',headers:{Origin:origin},body:form,signal:AbortSignal.timeout(25000)});
 const result=await response.json();assert.equal(response.status,200,JSON.stringify(result));assert.equal(result.result,'CORRECT',JSON.stringify(result));
 console.log(JSON.stringify({questionToy:toy,displayedToy:form.get('displayedToy'),...result}));
}
console.log('PASS live Whisper: ten synthetic-audio full answers across all five toys. Human-child/noise pronunciation still requires classroom validation.');
