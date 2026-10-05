import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const toys=['plane','puppet','robot','balloon','teddy'];
const cases=[...toys.map(t=>["It's a "+t,'assets/unit3/audio/its_a_'+t+'.mp3','name',t,'CORRECT']),['bare robot','assets/unit3/audio/robot.mp3','name','robot','INCOMPLETE'],['wrong toy','assets/unit3/audio/its_a_teddy.mp3','name','robot','WRONG_LOGIC'],["What's this?",'assets/unit3/lesson2/audio/questions/whats_this.mp3','name-question','robot','CORRECT']];
for(const [label,path,type,shown,expected] of cases){
 const form=new FormData();form.append('audio',new Blob([await fs.readFile(path)],{type:'audio/mpeg'}),'test.mp3');form.append('questionToy','robot');form.append('displayedToy',shown);form.append('questionType',type);
 const response=await fetch('https://toy-buddy-speech.hiei1121.workers.dev/api/speaking-check',{method:'POST',headers:{Origin:'https://dodinhhieu2207.github.io'},body:form,signal:AbortSignal.timeout(25000)});
 assert.equal(response.status,200);const result=await response.json();console.log(label,JSON.stringify(result));assert.equal(result.result,expected);
}
console.log('PASS live Cloudflare name/question modes: five full toy sentences, bare toy, wrong toy and full question. Existing adult Higgs clips are test input; child speech accuracy is not measured.');
