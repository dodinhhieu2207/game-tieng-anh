/* Media capture + provider boundary. Game 6 never handles Cloudflare requests or secrets. */
(()=>{
 'use strict';
 const config=window.Unit3SpeechConfig||{};
 let current=null;
 const api=window.Unit3Speech={
  get available(){return !!(config.endpoint&&navigator.mediaDevices?.getUserMedia&&window.MediaRecorder);},
  async evaluate(audio,round,signal){
   if(!config.endpoint)throw new Error('unconfigured');
   const url=new URL(config.endpoint,location.href);
   if(url.protocol!=='https:'&&!(['localhost','127.0.0.1'].includes(url.hostname)&&url.protocol==='http:'))throw new Error('invalid-endpoint');
   const form=new FormData();
   form.append('audio',audio,'answer.'+(audio.type.includes('mp4')?'m4a':audio.type.includes('ogg')?'ogg':'webm'));
   form.append('questionToy',round.questionToy);form.append('displayedToy',round.displayedToy);
   form.append('expectedAnswer',round.questionToy===round.displayedToy?'yes':'no');
   if(round.questionType)form.append('questionType',round.questionType);
   const response=await fetch(url,{method:'POST',body:form,signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});
   if(!response.ok)throw new Error('service-unavailable');
   const result=await response.json();
   if(typeof result.transcript!=='string'||typeof result.normalized!=='string'||!['CORRECT','INCOMPLETE','WRONG_LOGIC','UNCLEAR'].includes(result.result)||!['YES','NO','NAME','QUESTION',null].includes(result.answerType))throw new Error('invalid-response');
   return result;
  },
  start({questionToy,displayedToy,questionType,onStart=()=>{},onProcessing=()=>{},onResult=()=>{},onError=()=>{}}){
   if(current)throw new Error('busy');
   let active=true,stream=null,recorder=null,chunks=[],recordTimer,permissionTimer,requestTimer;
   const controller=new AbortController();
   const release=()=>{clearTimeout(recordTimer);clearTimeout(permissionTimer);clearTimeout(requestTimer);stream?.getTracks().forEach(track=>track.stop());};
   const cancel=()=>{if(!active)return;active=false;release();controller.abort();if(recorder?.state==='recording'){recorder.onstop=null;recorder.ondataavailable=null;try{recorder.stop();}catch{}}chunks=[];if(current===handle)current=null;};
   const fail=reason=>{if(!active)return;cancel();onError(reason);};
   const finish=()=>{if(active&&recorder?.state==='recording'){clearTimeout(recordTimer);recorder.stop();}};
   const handle={stop:finish,cancel};current=handle;
   (async()=>{
    if(!api.available){fail(config.endpoint?'unsupported':'unconfigured');return;}
    permissionTimer=setTimeout(()=>fail('permission-timeout'),8000);
    try{
     const media=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
     if(!active){media.getTracks().forEach(t=>t.stop());return;}
     stream=media;clearTimeout(permissionTimer);
     const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));
     recorder=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream);
     recorder.ondataavailable=e=>{if(active&&e.data?.size)chunks.push(e.data);};
     recorder.onerror=()=>fail('recording-error');
     recorder.onstop=async()=>{
      if(!active)return;release();const audio=new Blob(chunks,{type:recorder.mimeType||mime||'audio/webm'});chunks=[];
      if(!audio.size){fail('empty-recording');return;}
      if(audio.size>1024*1024){fail('recording-too-large');return;}
      onProcessing();requestTimer=setTimeout(()=>fail('network-timeout'),Math.min(config.requestTimeoutMs||20000,30000));
      try{const result=await api.evaluate(audio,{questionToy,displayedToy,questionType},controller.signal);if(!active)return;active=false;release();if(current===handle)current=null;onResult(result);}
      catch(e){if(active)fail(e.name==='AbortError'?'network-timeout':e.message||'network');}
     };
     recorder.start();onStart();recordTimer=setTimeout(finish,Math.min(config.maxRecordingMs||4000,4000));
    }catch(e){fail(['NotAllowedError','SecurityError'].includes(e.name)?'permission-denied':e.name==='NotFoundError'?'no-microphone':'recording-error');}
   })();
   return handle;
  }
 };
})();
