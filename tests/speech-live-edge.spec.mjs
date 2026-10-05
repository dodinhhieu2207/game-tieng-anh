import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const endpoint='https://toy-buddy-speech.hiei1121.workers.dev/api/speaking-check';
function wave(noise=false){const bytes=Buffer.alloc(44+16000*2*3);bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(16000,24);bytes.writeUInt32LE(32000,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(bytes.length-44,40);if(noise)for(let i=44;i<bytes.length;i+=2)bytes.writeInt16LE(Math.floor((Math.random()-.5)*10000),i);return bytes;}
for(const [name,bytes,expected] of [['bare yes',await fs.readFile(new URL('./speech-only-yes.wav',import.meta.url)),'INCOMPLETE'],['bare no',await fs.readFile(new URL('./speech-only-no.wav',import.meta.url)),'INCOMPLETE'],['silence',wave(),'UNCLEAR'],['noise',wave(true),'UNCLEAR']]){
 const form=new FormData();form.append('audio',new Blob([bytes],{type:'audio/wav'}),'synthetic.wav');form.append('questionToy','robot');form.append('displayedToy','robot');form.append('expectedAnswer','no');
 const r=await fetch(endpoint,{method:'POST',headers:{Origin:'https://dodinhhieu2207.github.io'},body:form,signal:AbortSignal.timeout(25000)}),body=await r.json();console.log(JSON.stringify({name,status:r.status,...body}));assert.equal(r.status,200);assert.equal(body.result,expected);
}
console.log('PASS live Whisper bare yes/no, synthetic silence and noise. Test-only Zira clips; website Higgs output is unchanged. No child recording used.');
