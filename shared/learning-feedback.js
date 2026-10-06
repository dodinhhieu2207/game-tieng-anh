/* Shared, event-driven toy feedback. Scoring remains owned by each game. */
(()=>{
 'use strict';
 const base='assets/feedback/',clips={tap:'click_003',correct:'confirmation_002',retry:'question_002',star:'pluck_001',complete:'maximize_003',badge:'confirmation_004',open:'open_001',reveal:'select_002'};
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),sounds=new Set(),animations=new Set();
 let layer,lastTarget,lastTap=0,lastEffect=0,lastCorrectSound=0;
 const busy=()=>window.LearningApp?.isVoiceBusy?.()||['asking','recording','starting','processing'].includes(window.Unit3Lesson2?.current()?.phase)||window.speechSynthesis?.speaking;
 const enabled=()=>!window.LearningApp?.isMuted()&&document.querySelector('#soundFx')?.checked;
 function stopSounds(){sounds.forEach(a=>{a.pause();a.dispatchEvent(new Event('learning:sfx-cancel'));});sounds.clear();}
 function clear(){stopSounds();animations.forEach(a=>a.cancel());animations.clear();layer?.replaceChildren();}
 function run(el,frames,options){if(motion.matches||!el?.animate)return;const a=el.animate(frames,options);animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;}
 function position(target){const r=target?.isConnected?target.getBoundingClientRect():document.querySelector('#gameStage')?.getBoundingClientRect();return {x:r?r.left+r.width/2:innerWidth/2,y:r?r.top+Math.min(r.height/2,320):innerHeight/2};}
 function mount(){const host=document.fullscreenElement||document.querySelector('#gameScreen.active')||document.body;if(layer.parentElement!==host)host.appendChild(layer);}
 function particle(x,y,dx,dy,i,flight=false){if(layer.childElementCount>=40)return;const p=document.createElement('span');p.className='learning-fx-particle '+(flight?'learning-fx-reward':'');p.style.cssText=`left:${x}px;top:${y}px;--fx-color:${['#ffce35','#35caff','#ff83b6','#8ddb52'][i%4]}`;layer.appendChild(p);
  const a=run(p,[{transform:'translate(-50%,-50%) scale(.2)',opacity:0},{transform:'translate(-50%,-50%) scale(1.1)',opacity:1,offset:.18},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) rotate(${flight?180:i*65}deg) scale(${flight?.4:.45})`,opacity:flight?1:0}],{duration:flight?850:760+i%3*90,delay:flight?i*110:0,easing:'cubic-bezier(.2,.7,.25,1)',fill:'forwards'});
  if(a)a.finished.catch(()=>{}).finally(()=>p.remove());else p.remove();
 }
 function visual(kind,target=lastTarget){if(!layer)return;mount();const now=performance.now();if(kind!=='tap'&&kind!=='reward'&&now-lastEffect<140)return;if(kind!=='tap')lastEffect=now;if(kind==='reward'&&target?.classList.contains('reward-toast'))target=document.querySelector('.l2-complete,.missing-victory,.ff-complete,.u3-victory,#l2Toy')||document.querySelector('#gameStage');const {x,y}=position(target);
  const el=target?.isConnected?target:document.querySelector('.l2-toy,.u3-hero,.ff-game');
  if(kind==='retry'){run(el,[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:420,easing:'ease-in-out'});return;}
  if(kind==='tap'){run(el,[{transform:'scale(1)'},{transform:'scale(.96)',offset:.3},{transform:'scale(1.025)',offset:.7},{transform:'scale(1)'}],{duration:240,easing:'ease-out'});return;}
  if(motion.matches){const halo=document.createElement('span');halo.className='learning-fx-halo';halo.style.cssText=`left:${x}px;top:${y}px`;layer.appendChild(halo);setTimeout(()=>halo.remove(),550);return;}
  run(el,[{transform:'scale(1)'},{transform:'scale(1.045)',offset:.4},{transform:'scale(1)'}],{duration:470,easing:'cubic-bezier(.22,1,.36,1)'});
  const halo=document.createElement('span');halo.className='learning-fx-halo';halo.style.cssText=`left:${x}px;top:${y}px`;layer.appendChild(halo);const ring=run(halo,[{transform:'translate(-50%,-50%) scale(.4)',opacity:.7},{transform:'translate(-50%,-50%) scale(1.7)',opacity:0}],{duration:620,easing:'ease-out'});ring?.finished.catch(()=>{}).finally(()=>halo.remove());
  const count=kind==='reward'?22:12;
  for(let i=0;i<count;i++){const angle=i/count*Math.PI*2,r=kind==='reward'?145:90;particle(x,y,Math.cos(angle)*r,Math.sin(angle)*r,i);}
  if(kind==='reward'){
   const to=position(document.querySelector('.reward-game-book,.reward-header-button'));
   for(let i=0;i<3;i++)particle(x,y,to.x-x,to.y-y,i,true);
   const hud=document.querySelector('.reward-game-book,.reward-header-button');setTimeout(()=>{if(hud?.isConnected)run(hud,[{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:330});},900);
  }
 }
 function play(kind,target,{visualize=true}={}){
  if(visualize&&['correct','retry','complete','badge'].includes(kind))visual(kind==='correct'||kind==='retry'?kind:'reward',target);
  if(!enabled()||busy()||!clips[kind])return Promise.resolve(false);
  stopSounds();const a=new Audio(base+clips[kind]+'.wav');a.learningSfx=true;a.volume=kind==='tap'?.18:.38;sounds.add(a);
  return new Promise(resolve=>{const done=()=>{sounds.delete(a);resolve(true);};a.addEventListener('ended',done,{once:true});a.addEventListener('error',done,{once:true});a.addEventListener('learning:sfx-cancel',done,{once:true});a.play().catch(done);});
 }
 document.addEventListener('DOMContentLoaded',()=>{
  layer=document.createElement('div');layer.className='learning-fx-layer';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
  // Adapt legacy sound calls without rewriting the approved game engines or their audio files.
  const AudioOwner=window.Audio;
  window.Audio=function(src){let kind;const path=String(src||'');
   const old=path.match(/assets\/unit3\/sfx\/([^/.]+)/)?.[1];if(old)kind=({correct:'correct',wrong_soft:'retry',complete:'complete',click:'tap',reveal:'reveal'})[old];
   if(path.includes('/unit2-ff/game-pack/audio/'))kind=({'correct-star.wav':'correct','retry-soft.wav':'retry','pickup-pop.wav':'tap','drop-snap.wav':'tap','game-complete.wav':'complete'})[path.split('/').pop()];
   const a=new AudioOwner(kind?base+clips[kind]+'.wav':src);
   if(kind||path.startsWith(base)||path.includes('assets/rewards/')||path.includes('/unit2-ff/game-pack/audio/')){a.learningSfx=true;sounds.add(a);const release=()=>sounds.delete(a);a.addEventListener('ended',release);a.addEventListener('error',release);a.addEventListener('learning:sfx-cancel',()=>a.dispatchEvent(new Event('ended')));}
   if(kind){a.volume=.38;a.addEventListener('play',()=>{a.volume=Math.min(a.volume,.4);if(['correct','retry','complete'].includes(kind))visual(kind==='complete'?'reward':kind);const now=performance.now();if(!enabled()||busy()||(kind==='correct'&&now-lastCorrectSound<200)){a.pause();a.dispatchEvent(new Event('ended'));return;}if(kind==='correct')lastCorrectSound=now;sounds.forEach(other=>{if(other!==a){other.pause();other.dispatchEvent(new Event('learning:sfx-cancel'));}});});}
   return a;
  };window.Audio.prototype=AudioOwner.prototype;Object.setPrototypeOf(window.Audio,AudioOwner);
  window.correctFx=()=>play('correct');window.retryFx=()=>play('retry');
  document.addEventListener('click',e=>{const b=e.target.closest('button,a[href]');if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return;lastTarget=b;visual('tap',b);if(document.body.dataset.learningScreen!=='game'&&performance.now()-lastTap>180){lastTap=performance.now();play('tap',b,{visualize:false});}},true);
  document.addEventListener('learning:voice-start',stopSounds);
  new MutationObserver(()=>{if(['recording','starting','processing'].includes(window.Unit3Lesson2?.current()?.phase))stopSounds();}).observe(document.querySelector('#gameStage'),{subtree:true,attributes:true,attributeFilter:['data-phase']});
  document.addEventListener('learning:leave-activity',clear);addEventListener('hashchange',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});motion.addEventListener('change',clear);
  document.addEventListener('learning:feedback',e=>{const {kind,target}=e.detail||{};play(kind,target);});
 });
 window.LearningFeedback=Object.freeze({play,visual,clear,stopSounds,busy});
})();
