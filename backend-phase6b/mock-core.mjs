const aliases={notebook:['notebook','note book'],crayon:['crayon','crayons'],pencil:['pencil','pencils'],elephant:['elephant','elephants'],chair:['chair','chairs'],desk:['desk','desks'],egg:['egg','eggs']};

export function cleanSpeech(text=''){return String(text).toLowerCase().replace(/[^a-z\s']/g,' ').replace(/\s+/g,' ').trim();}
export function containsTarget(text,target){const clean=cleanSpeech(text);return (aliases[target]||[target]).some(alias=>new RegExp(`\\b${alias.replace(' ','\\s+')}\\b`).test(clean));}

export function scoreMockPayload(payload={}){
  const target=cleanSpeech(payload.target);
  const alternatives=Array.isArray(payload.browserAlternatives)?payload.browserAlternatives:[];
  const normalized=alternatives.map(item=>typeof item==='string'?{transcript:item,confidence:0}:{transcript:String(item?.transcript||''),confidence:Number(item?.confidence)||0});
  const best=normalized[0]||{transcript:'',confidence:0};
  const matched=normalized.find(item=>containsTarget(item.transcript,target));
  const audioBytes=payload.audioBase64?Math.floor(String(payload.audioBase64).length*0.75):0;
  const base={target,transcript:best.transcript,confidence:best.confidence||0,audioReceived:audioBytes>0,audioBytes,pronunciationScore:null,pronunciationScores:null,provider:'phase6b-fallback',mock:true};
  if(!matched)return best.transcript?{...base,understood:false,sentenceComplete:false,result:'try-again',feedback:'Good try. Look carefully and say the object name.'}:{...base,understood:null,sentenceComplete:null,result:'uncertain',feedback:"I couldn't hear clearly. Let's try again."};
  const clean=cleanSpeech(matched.transcript);
  const sentenceComplete=/\b(it'?s|it is|this is|that is)\b/.test(clean);
  return {...base,transcript:matched.transcript,confidence:matched.confidence||best.confidence||0,understood:true,sentenceComplete,result:sentenceComplete?'independent':'with-support',feedback:sentenceComplete?'Great speaking!':'Great word! Now try the full sentence.'};
}

export function allowedOrigin(origin=''){
  const configured=(process.env.ALLOWED_ORIGINS||'').split(',').map(value=>value.trim()).filter(Boolean);
  if(configured.includes(origin))return origin;
  if(/^https:\/\/[a-z0-9-]+\.github\.io$/i.test(origin))return origin;
  if(/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(origin))return origin;
  return configured[0]||'null';
}
