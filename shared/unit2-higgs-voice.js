/* Replace Unit 2 browser speech with a finite, pre-recorded Higgs catalogue. */
(()=>{
 'use strict';let active=null,serial=0,queue=Promise.resolve(),sequence=Promise.resolve();
 const norm=text=>String(text).toLowerCase().replace(/’/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
 const scoped=()=>window.LearningApp?.context()?.unit?.id===2;
 const clip=text=>{let key=norm(text);if(/^[1-6]$/.test(key))key=['one','two','three','four','five','six'][Number(key)-1];return window.Unit2HiggsClips?.clips[key];};
 function emit(detail){document.dispatchEvent(new CustomEvent('learning:unit2-voice',{detail}));}
 function stop(){serial++;if(active){active.audio.pause();active.finish('cancel');}queue=Promise.resolve();sequence=Promise.resolve();}
 const finished=()=>Promise.all([queue,sequence]);
 function report(text,reason){emit({text,reason});const status=document.querySelector('#sentenceStatus,#ellieStatus,#listenStatus,.status-line');if(status)status.textContent='The lesson audio could not play. Tap Listen to try again.';}
 function play(text,{interrupt=false,button=null,volume=.94,rate=null}={}){
  if(window.LearningApp?.isMuted())return Promise.resolve(false);
  if(interrupt)cancelVoice();const token=serial,c=clip(text);
  if(!c){report(text,'missing');return Promise.resolve(false);}
  const task=async()=>{
   if(token!==serial||!scoped()||window.LearningApp?.isMuted())return false;
   return new Promise(resolve=>{const audio=new Audio(c.src);audio.volume=volume;audio.playbackRate=Math.max(.8,Math.min(1.15,Number(rate??els.voiceRate?.value??.65)/.65));button?.classList.add('playing');
    const item={audio,finish:reason=>{if(active!==item)return;active=null;button?.classList.remove('playing');if(reason==='cancel')document.dispatchEvent(new Event('learning:voice-end'));emit({text,src:c.src,reason});resolve(reason==='ended');}};active=item;
    audio.addEventListener('ended',()=>item.finish('ended'),{once:true});audio.addEventListener('error',()=>{report(text,'error');item.finish('error');},{once:true});
    audio.play().then(()=>emit({text,src:c.src,reason:'start'})).catch(e=>{if(e.name!=='AbortError')report(text,'error');item.finish(e.name==='AbortError'?'cancel':'error');});
   });
  };
  queue=queue.then(task,task);return queue;
 }
 addEventListener('DOMContentLoaded',()=>{
  const originalSpeak=window.speakText,originalSequence=window.speakSequence,originalCancel=window.cancelVoice,originalLearning=window.playLearningSound;
  window.cancelVoice=function(){stop();return originalCancel.apply(this,arguments);};
  window.speakText=function(text,options){return scoped()?play(text,options):originalSpeak.apply(this,arguments);};
  window.speakSequence=function(){const result=originalSequence.apply(this,arguments);if(scoped())sequence=result;return result;};
  const assetMap={letterENameSound:'E',letterFNameSound:'F',shortESound:'Eh.',shortFSound:'Fff.',ffVoiceFish:'fish',ffVoiceFarm:'farm'},old=new Map();
  for(const [key,text] of Object.entries(assetMap)){const c=clip(text);if(!c)continue;old.set(DATA.unitAssets[key],text);DATA.unitAssets[key]=c.src;}
  PHONICS_GUIDES.shortE.audio=DATA.unitAssets.shortESound;PHONICS_GUIDES.shortF.audio=DATA.unitAssets.shortFSound;
  window.playLearningSound=function(src,options={}){const text=old.get(src)||Object.values(window.Unit2HiggsClips.clips).find(c=>c.src===src)?.text;return scoped()&&text?play(text,{...options,interrupt:true}):originalLearning.apply(this,arguments);};
  // Keep the existing animation delays, but never let a round advance cut a longer recording.
  const advanceMethods={elliejourney:['checkListen','placeCountItem','speechFeedback'],team:['correct'],race:['correct'],missing:['check'],colour:['check'],eefind:['pick'],match:['pickWord'],puzzle:['check'],eggcount:['check'],numberpaint:['paint']};
  for(const [name,methods] of Object.entries(advanceMethods))for(const method of methods){const fn=games[name]?.[method];if(!fn)continue;games[name][method]=function(){const native=window.setTimeout;window.setTimeout=function(callback,delay,...args){if(![180,330,650,700,900,1050,1150,1450,1500].includes(delay))return native(callback,delay,...args);const owner=currentGame,token=serial;return native(()=>{finished().then(()=>{if(currentGame===owner&&token===serial)callback(...args);});},delay);};try{return fn.apply(this,arguments);}finally{window.setTimeout=native;}};}
  document.addEventListener('learning:leave-activity',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 });
 window.Unit2HiggsVoice=Object.freeze({play,stop,clip,norm,finished});
})();
