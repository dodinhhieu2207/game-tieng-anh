/* Short, sampled UI sounds have their own ducked lane; never delay a lesson voice. */
(()=>{
 'use strict';
 const NativeAudio=window.Audio,files={button:'ui-click1.wav',select:'ui-click3.wav',next:'ui-rollover4.wav',toggle:'toggle_001.wav'},raw=new Map(),buffers=new Map(),active=new Set();
 let ctx,last=0,lastGesture=-1000;
 const recording=()=>['starting','recording','processing'].includes(window.Unit3Lesson2?.current()?.phase);
 function enabled(){if(document.hidden||window.LearningApp?.isMuted()||!document.querySelector('#soundFx')?.checked||recording())return false;if(document.querySelector('#gameScreen.active #u3Mute[aria-pressed="true"]'))return false;if(typeof currentGame!=='undefined'&&['letterfly','abcflash'].includes(currentGame)&&typeof letterAudio!=='undefined'&&!letterAudio.isOn())return false;return true;}
 function classify(target){if(target?.matches('[data-shell-action="sound"],.js-sound-toggle,#u3Mute'))return 'toggle';if(target?.matches('[data-shell-action="next"],[data-shell-action="back"],#l2Next,#u3NextToy,[data-start-adventure],[data-continue]'))return 'next';if(target?.matches('.u3-card,#u3Hero,.l2-draggable,[data-ff-drag],.lf-tile,[data-choice],[data-match],.crayon,.paint-swatch-btn'))return 'select';return 'button';}
 function stop(){for(const item of active){try{item.source?.stop();item.audio?.pause();}catch{}item.finish?.();}active.clear();}
 function duck(){for(const item of active){if(item.gain){item.gain.gain.cancelScheduledValues(ctx.currentTime);item.gain.gain.setTargetAtTime(.32,ctx.currentTime,.008);}if(item.audio)item.audio.volume=.32;}}
 function prime(){if(location.protocol==='file:')return;for(const file of Object.values(files))if(!raw.has(file))raw.set(file,fetch('assets/feedback/'+file).then(r=>{if(!r.ok)throw Error('Missing click sound');return r.arrayBuffer();}).catch(()=>null));}
 function unlock(){if(!ctx){const Context=window.AudioContext||window.webkitAudioContext;if(Context){try{ctx=new Context();}catch{}}}if(ctx){ctx.resume().catch(()=>{});for(const file of Object.values(files))if(!buffers.has(file)){const bytes=raw.get(file);if(bytes)buffers.set(file,bytes.then(data=>data?ctx.decodeAudioData(data.slice(0)).catch(()=>null):null));}}}
 function emit(kind,file,duration,gain){document.dispatchEvent(new CustomEvent('learning:ui-sound',{detail:{kind,file,duration,gain}}));}
 function fallback(kind,file){return new Promise(resolve=>{const audio=new NativeAudio('assets/feedback/'+file);audio.learningSfx=true;audio.learningUiSound=true;audio.volume=window.LearningApp?.isVoiceBusy?.()?.32:.52;const item={audio,finish:()=>{active.delete(item);resolve(true);}};active.add(item);audio.addEventListener('ended',item.finish,{once:true});audio.addEventListener('error',item.finish,{once:true});audio.play().then(()=>emit(kind,file,audio.duration,audio.volume)).catch(item.finish);});}
 async function play(target,kind=classify(target)){
  if(!enabled())return false;const now=performance.now();if(now-last<90)return false;last=now;prime();unlock();const file=files[kind]||files.button;
  const buffer=ctx&&await buffers.get(file);if(!enabled())return false;
  // A route may change while this 86–139 ms cue is being decoded. Keep the user's click audible.
  stop();if(!buffer||ctx.state!=='running')return fallback(kind,file);
  return new Promise(resolve=>{const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;gain.gain.value=window.LearningApp?.isVoiceBusy?.()?.32:.52;source.connect(gain);gain.connect(ctx.destination);const item={source,gain,finish:()=>{active.delete(item);source.disconnect();gain.disconnect();resolve(true);}};active.add(item);source.onended=item.finish;source.start();emit(kind,file,buffer.duration,gain.gain.value);});
 }
 addEventListener('DOMContentLoaded',()=>{
  prime();document.addEventListener('pointerdown',()=>{lastGesture=performance.now();unlock();},{capture:true});document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){lastGesture=performance.now();unlock();}},true);
  document.addEventListener('learning:voice-start',duck);
  new MutationObserver(()=>{if(recording())stop();}).observe(document.querySelector('#gameStage'),{subtree:true,attributes:true,attributeFilter:['data-phase']});
  document.addEventListener('change',()=>{if(!enabled())stop();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-shell-action="sound"],.js-sound-toggle,#u3Mute');if(b)queueMicrotask(()=>{if(enabled())play(b,'toggle');else stop();});});
  const panel=document.querySelector('#teacherPanel');if(panel){const row=document.createElement('div');row.className='feedback-sound-preview';row.innerHTML='<button type="button" class="btn secondary" id="feedbackSoundPreview">Test click sound</button><p>Sound on plays a short click when you tap a control.</p>';panel.appendChild(row);}
 });
 window.LearningClickSound=Object.freeze({play,stop,enabled,legacy:target=>performance.now()-lastGesture<160?play(target):Promise.resolve(false)});
})();
