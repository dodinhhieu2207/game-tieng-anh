import {scoreMockPayload} from './mock-core.mjs';
import {assessWithAzure,azureConfig} from './azure-pronunciation.mjs';

function safeProviderError(error){
  const code=String(error?.message||'provider_error');
  return /^(azure_|audio_|wav_|reference_)/.test(code)?code:'provider_error';
}

export async function scoreSpeechPayload(payload={},options={}){
  const config=azureConfig(options.env||process.env);
  if(payload.test)return {ok:true,provider:config.configured?'azure-pronunciation':'phase6b-fallback',liveProviderConfigured:config.configured,mock:!config.configured,phase:'6B'};
  if(config.configured){
    try{return await assessWithAzure(payload,options);}
    catch(error){return {...scoreMockPayload(payload),provider:'phase6b-fallback',fallbackReason:safeProviderError(error),liveProviderConfigured:true};}
  }
  return {...scoreMockPayload(payload),provider:'phase6b-fallback',fallbackReason:'azure_not_configured',liveProviderConfigured:false};
}
