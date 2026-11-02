/* Word slots show only words returned by the final Cloudflare transcription. */
(()=>{'use strict';
 const speech=window.Unit3Speech;if(!speech||speech.__familyWords)return;
 const original=speech.start.bind(speech);speech.__familyWords=true;
 const words=['This','is','my'];
 const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z ]/g,' ').trim().replace(/\s+/g,' ');
 function slots(){const scene=document.querySelector('.u4-talk-scene');if(!scene)return null;let tray=scene.querySelector('.u4-talk-words');if(!tray){tray=document.createElement('div');tray.className='u4-talk-words';tray.setAttribute('aria-label','Words recognized after recording');scene.append(tray)}return tray}
 function paint(text,target,accepted){const tray=slots();if(!tray)return;const heard=normalize(text).split(' ').filter(Boolean);tray.replaceChildren();for(const [i,word] of [...words,target].entries()){const chip=document.createElement('span');chip.className='u4-talk-word';const heardWord=heard[i],matching=heardWord===word.toLowerCase();chip.dataset.state=!heardWord?'waiting':matching&&accepted?'confirmed':matching?'heard':'mismatch';chip.textContent=matching?word:heardWord||'···';chip.setAttribute('aria-label',heardWord||'word not recognized');tray.append(chip)}}
 speech.start=options=>{if(options?.questionType!=='family-introduction')return original(options);const start=options.onStart,result=options.onResult,error=options.onError,target=options.questionToy;
  paint('',target,false);
  return original({...options,onStart:(...args)=>{paint('',target,false);start?.(...args)},onResult:r=>{paint(r.result==='UNCLEAR'?'':r.transcript,target,r.result==='CORRECT');result?.(r)},onError:e=>{paint('',target,false);error?.(e)}});
 };
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-next]'))slots()?.remove()},true);
 document.addEventListener('learning:leave-activity',()=>slots()?.remove());
})();
