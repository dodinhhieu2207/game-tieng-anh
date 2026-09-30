import {containsTarget} from './mock-core.mjs';

const MAX_AUDIO_BYTES=1800000;

export function azureConfig(env=process.env){
  const key=String(env.AZURE_SPEECH_KEY||'').trim();
  const region=String(env.AZURE_SPEECH_REGION||'').trim();
  const endpoint=String(env.AZURE_SPEECH_ENDPOINT||'').trim();
  return {key,region,endpoint,configured:Boolean(key&&(endpoint||region))};
}

function speechUrl(config,locale){
  const base=config.endpoint
    ? config.endpoint.replace(/\/$/,'')
    : `https://${config.region}.stt.speech.microsoft.com`;
  const path=/\/speech\/recognition\//i.test(base)?base:`${base}/speech/recognition/conversation/cognitiveservices/v1`;
  const url=new URL(path);
  url.searchParams.set('language',locale||'en-US');
  url.searchParams.set('format','detailed');
  return url;
}

function scoreNumber(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(100,n)):null;}

export async function assessWithAzure(payload,{fetchImpl=fetch,env=process.env}={}){
  const config=azureConfig(env);
  if(!config.configured)throw new Error('azure_not_configured');
  const audio=Buffer.from(String(payload.audioBase64||''),'base64');
  if(audio.length<44)throw new Error('audio_missing');
  if(audio.length>MAX_AUDIO_BYTES)throw new Error('audio_too_large');
  if(audio.subarray(0,4).toString('ascii')!=='RIFF'||audio.subarray(8,12).toString('ascii')!=='WAVE')throw new Error('wav_required');
  const referenceText=String(payload.expectedPhrase||payload.target||'').trim().slice(0,300);
  if(!referenceText)throw new Error('reference_text_required');
  const assessment={ReferenceText:referenceText,GradingSystem:'HundredMark',Granularity:'Word',Dimension:'Comprehensive',EnableMiscue:'True',EnableProsodyAssessment:'True'};
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),8000);
  let response;
  try{
    response=await fetchImpl(speechUrl(config,payload.locale),{method:'POST',headers:{Accept:'application/json','Content-Type':'audio/wav; codecs=audio/pcm; samplerate=16000','Ocp-Apim-Subscription-Key':config.key,'Pronunciation-Assessment':Buffer.from(JSON.stringify(assessment),'utf8').toString('base64')},body:audio,signal:controller.signal});
  }finally{clearTimeout(timeout);}
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(`azure_http_${response.status}`);
  if(data.RecognitionStatus!=='Success')throw new Error(`azure_${String(data.RecognitionStatus||'no_match').toLowerCase()}`);
  const best=data.NBest?.[0]||{};
  const pronunciation=best.PronunciationAssessment||{};
  const transcript=String(best.Display||data.DisplayText||best.Lexical||'').trim();
  const scores={
    accuracy:scoreNumber(pronunciation.AccuracyScore),
    fluency:scoreNumber(pronunciation.FluencyScore),
    completeness:scoreNumber(pronunciation.CompletenessScore),
    prosody:scoreNumber(pronunciation.ProsodyScore),
    overall:scoreNumber(pronunciation.PronScore)
  };
  const words=(best.Words||[]).map(word=>({word:String(word.Word||''),accuracy:scoreNumber(word.PronunciationAssessment?.AccuracyScore),errorType:String(word.PronunciationAssessment?.ErrorType||'None')}));
  const understood=containsTarget(transcript,String(payload.target||'').toLowerCase());
  const sentenceComplete=(scores.completeness??0)>=75;
  let result='uncertain';
  if(!understood)result='try-again';
  else if((scores.accuracy??0)>=60&&(scores.overall??scores.accuracy??0)>=55&&sentenceComplete)result='independent';
  else if((scores.accuracy??0)>=35)result='with-support';
  else result='try-again';
  return {target:payload.target,transcript,confidence:Number(best.Confidence)||0,audioReceived:true,audioBytes:audio.length,pronunciationScore:scores.overall??scores.accuracy,pronunciationScores:scores,wordScores:words,provider:'azure-pronunciation',mock:false,understood,sentenceComplete,result,feedback:result==='independent'?'Great speaking!':result==='with-support'?'Good answer. Listen once more and try the whole sentence.':result==='try-again'?'Good try. Listen and say it again.':"I couldn't score that clearly. Let's try again."};
}
