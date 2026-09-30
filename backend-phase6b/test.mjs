import assert from 'node:assert/strict';
import {scoreMockPayload} from './mock-core.mjs';
import {assessWithAzure,azureConfig} from './azure-pronunciation.mjs';
import {scoreSpeechPayload} from './speech-service.mjs';

function testWav(){const b=Buffer.alloc(48);b.write('RIFF',0);b.writeUInt32LE(40,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(16000,24);b.writeUInt32LE(32000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(4,40);return b.toString('base64');}

const full=scoreMockPayload({target:'pencil',browserAlternatives:[{transcript:"It's a pencil",confidence:.91}],audioBase64:'AAAA'});
const word=scoreMockPayload({target:'egg',browserAlternatives:[{transcript:'egg',confidence:.82}],audioBase64:'AAAA'});
const wrong=scoreMockPayload({target:'desk',browserAlternatives:[{transcript:'chair',confidence:.88}],audioBase64:'AAAA'});
const uncertain=scoreMockPayload({target:'crayon',browserAlternatives:[],audioBase64:'AAAA'});
assert.equal(full.result,'independent');
assert.equal(word.result,'with-support');
assert.equal(wrong.result,'try-again');
assert.equal(uncertain.result,'uncertain');
assert.equal(full.provider,'phase6b-fallback');
assert.equal(azureConfig({}).configured,false);

const healthFallback=await scoreSpeechPayload({test:true},{env:{}});
assert.equal(healthFallback.liveProviderConfigured,false);
assert.equal(healthFallback.phase,'6B');

const healthAzure=await scoreSpeechPayload({test:true},{env:{AZURE_SPEECH_KEY:'secret',AZURE_SPEECH_REGION:'eastus'}});
assert.equal(healthAzure.liveProviderConfigured,true);
assert.equal(healthAzure.provider,'azure-pronunciation');

let sentHeaders=null;
const fetchImpl=async(_url,options)=>{sentHeaders=options.headers;return {ok:true,status:200,json:async()=>({RecognitionStatus:'Success',DisplayText:"It's a pencil.",NBest:[{Confidence:.94,Display:"It's a pencil.",PronunciationAssessment:{AccuracyScore:86,FluencyScore:82,CompletenessScore:100,ProsodyScore:75,PronScore:85},Words:[{Word:'pencil',PronunciationAssessment:{AccuracyScore:88,ErrorType:'None'}}]}]})};};
const azure=await assessWithAzure({target:'pencil',expectedPhrase:"It's a pencil.",locale:'en-US',audioBase64:testWav()},{fetchImpl,env:{AZURE_SPEECH_KEY:'secret',AZURE_SPEECH_REGION:'eastus'}});
assert.equal(azure.result,'independent');
assert.equal(azure.provider,'azure-pronunciation');
assert.equal(azure.pronunciationScore,85);
assert.match(sentHeaders['Content-Type'],/audio\/wav/);
assert.ok(sentHeaders['Pronunciation-Assessment']);

const providerFailure=await scoreSpeechPayload({target:'pencil',expectedPhrase:"It's a pencil.",audioBase64:testWav(),browserAlternatives:[{transcript:"It's a pencil",confidence:.9}]},{fetchImpl:async()=>{throw new Error('network down');},env:{AZURE_SPEECH_KEY:'secret',AZURE_SPEECH_REGION:'eastus'}});
assert.equal(providerFailure.provider,'phase6b-fallback');
assert.equal(providerFailure.result,'independent');
assert.equal(providerFailure.fallbackReason,'provider_error');

console.log('Phase 6B hybrid speech scoring tests passed.');
