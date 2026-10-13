import {Buffer} from 'node:buffer';
import '../../../shared/speech-evaluator.js';

export const MODEL='@cf/openai/whisper-large-v3-turbo';
export const CONTEXT='English classroom speech about toys. Vocabulary: plane, puppet, robot, balloon, teddy.';
const MAX_AUDIO=1024*1024,MAX_BODY=MAX_AUDIO+16384;
const TYPES=new Set(['audio/webm','audio/ogg','audio/mp4','audio/wav','audio/x-wav','audio/mpeg']);

// Bound reads even when Content-Length is absent; do not buffer an unlimited upload.
async function readBody(request){
 const reader=request.body?.getReader();if(!reader)throw new Error('EMPTY');
 let size=0;const chunks=[];
 try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BODY){await reader.cancel();throw new Error('LARGE');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return bytes;
}

export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin')||'';
  const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
  const reply=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
  if(!allowed.includes(origin))return reply({error:'ORIGIN_NOT_ALLOWED'},403);
  headers['Access-Control-Allow-Origin']=origin;
  if(new URL(request.url).pathname!=='/api/speaking-check')return reply({error:'NOT_FOUND'},404);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
  if(request.method!=='POST')return reply({error:'METHOD_NOT_ALLOWED'},405,{Allow:'POST, OPTIONS'});
  if(!env.AI||!env.SPEECH_LIMITER)return reply({error:'SERVICE_UNAVAILABLE'},503);
  // IP is only used as a transient limiter key; no child identity, audio or transcript logging.
  if(!(await env.SPEECH_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'local'})).success)return reply({error:'RATE_LIMITED'},429,{'Retry-After':'60'});
  const type=request.headers.get('Content-Type')||'';
  if(!type.toLowerCase().startsWith('multipart/form-data;'))return reply({error:'MULTIPART_REQUIRED'},415);
  if(Number(request.headers.get('Content-Length')||0)>MAX_BODY)return reply({error:'AUDIO_TOO_LARGE'},413);
  let form;
  try{const body=await readBody(request);form=await new Response(body,{headers:{'Content-Type':type}}).formData();}
  catch(e){return reply({error:e.message==='LARGE'?'AUDIO_TOO_LARGE':'INVALID_FORM'},e.message==='LARGE'?413:400);}
  const questionToy=form.get('questionToy'),displayedToy=form.get('displayedToy'),audio=form.get('audio');
  const questionType=form.get('questionType')||'yes-no';
  if(!ToySpeechEvaluator.questionTypes.includes(questionType))return reply({error:'INVALID_QUESTION_TYPE'},400);
  const vocabulary=ToySpeechEvaluator.vocabularyFor(questionType);
  if(!vocabulary.includes(questionToy)||!vocabulary.includes(displayedToy))return reply({error:'INVALID_TOY'},400);
  // expectedAnswer is deliberately ignored: derive truth from the two validated toys.
  if(!audio||typeof audio.arrayBuffer!=='function'||!audio.size)return reply({error:'EMPTY_AUDIO'},400);
  if(audio.size>MAX_AUDIO)return reply({error:'AUDIO_TOO_LARGE'},413);
  if(!TYPES.has(audio.type.split(';')[0].toLowerCase()))return reply({error:'UNSUPPORTED_AUDIO'},415);
  let timer;
  try{
   // Short, quiet child utterances should not be discarded by a pre-transcription VAD.
   // Context includes the whole lesson vocabulary, never the expected answer.
   const input={audio:Buffer.from(await audio.arrayBuffer()).toString('base64'),task:'transcribe',language:'en',vad_filter:false,initial_prompt:['school-name','gg-word'].includes(questionType)?'English classroom speech. Vocabulary: '+vocabulary.join(', ')+'.':CONTEXT,condition_on_previous_text:false};
   const uncertain=output=>Array.isArray(output?.segments)&&output.segments.length&&output.segments.every(s=>Number.isFinite(s.avg_logprob)?s.avg_logprob< -1:s.no_speech_prob>=.6);
   let expired=false;
   const infer=async()=>{
    const first=await env.AI.run(MODEL,input);
    if(!expired&&['toy-word','gg-word'].includes(questionType)&&uncertain(first)&&vocabulary.includes(ToySpeechEvaluator.normalize(first?.text))){
     // A second neutral pass may recover short words without suggesting the answer.
     // Require agreement and a reliable second pass; two uncertain guesses never pass.
     const second=await env.AI.run(MODEL,{...input,initial_prompt:''});
     if(typeof second?.text==='string'&&second.segments?.some(s=>Number.isFinite(s.avg_logprob)&&s.avg_logprob>=-1)&&!uncertain(second)&&ToySpeechEvaluator.normalize(second.text)===ToySpeechEvaluator.normalize(first.text))return second;
    }
    return first;
   };
   const output=await Promise.race([infer(),new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(new Error('TIMEOUT'));},18000);})]);
   if(!output||typeof output.text!=='string')return reply({error:'AI_UNAVAILABLE'},502);
   // Discard low-confidence/no-speech segments instead of interpreting a hallucinated answer.
   const segments=Array.isArray(output.segments)?output.segments:[];
   // Whisper's own transcription gate lets a reliable token score override a high
   // no_speech probability, which often occurs on very short single-word clips.
   // Low token confidence still needs review; missing scores cannot override silence.
   const unreliable=segments.length&&segments.every(s=>Number.isFinite(s.avg_logprob)?s.avg_logprob< -1:s.no_speech_prob>=.6);
   const result=ToySpeechEvaluator.evaluate(output.text,questionToy,displayedToy,questionType);
   if(unreliable||result.result==='UNCLEAR')return reply({...result,result:'UNCLEAR',reason:unreliable?'recognition-uncertain':output.text.trim()?'sentence-unrecognized':'no-transcript'});
   return reply(result);
  }catch(e){return reply({error:e.message==='TIMEOUT'?'AI_TIMEOUT':'AI_UNAVAILABLE'},e.message==='TIMEOUT'?504:502);}
  finally{clearTimeout(timer);form=null;}
 }
};
