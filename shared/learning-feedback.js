/* Shared, event-driven toy feedback. Scoring remains owned by each game. */
(()=>{
 'use strict';
 const base='assets/feedback/',clips={tap:'click_003',place:'pluck_001',correct:'confirmation_002',retry:'question_002',star:'pluck_001',complete:'maximize_003',badge:'confirmation_004',open:'open_001',reveal:'select_002'};
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),sounds=new Set(),animations=new Set();
 let layer,lastTarget,lastTap=0,lastEffect=0,lastCorrectSound=0,sceneSerial=0,deferred,lastSound;
 const busy=()=>window.LearningApp?.isVoiceBusy?.()||['asking','recording','starting','processing'].includes(window.Unit3Lesson2?.current()?.phase)||window.speechSynthesis?.speaking;
 const enabled=()=>!window.LearningApp?.isMuted()&&document.querySelector('#soundFx')?.checked;
 function stopSounds(){sounds.forEach(a=>{a.pause();a.dispatchEvent(new Event('learning:sfx-cancel'));});sounds.clear();}
 function clear(){deferred=null;lastSound=null;stopSounds();animations.forEach(a=>a.cancel());animations.clear();layer?.replaceChildren();}
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
  const count=kind==='reward'?22:kind==='place'?5:12;
  for(let i=0;i<count;i++){const angle=i/count*Math.PI*2,r=kind==='reward'?145:90;particle(x,y,Math.cos(angle)*r,Math.sin(angle)*r,i);}
  if(kind==='reward'){
   const to=position(document.querySelector('.reward-game-book,.reward-header-button'));
   for(let i=0;i<3;i++)particle(x,y,to.x-x,to.y-y,i,true);
   const hud=document.querySelector('.reward-game-book,.reward-header-button');setTimeout(()=>{if(hud?.isConnected)run(hud,[{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:330});},900);
  }
 }
 function play(kind,target,{visualize=true}={}){
  if(kind==='tap'&&window.LearningClickSound)return window.LearningClickSound.play(target);
  if(visualize&&['place','correct','retry','complete','badge'].includes(kind))visual(['place','correct','retry'].includes(kind)?kind:'reward',target);
  if(!enabled()||!clips[kind])return Promise.resolve(false);
  if(kind==='place'&&performance.now()-lastCorrectSound<220)return Promise.resolve(false);
  if(busy()){if(['correct','retry','complete','badge','star'].includes(kind))deferred={kind,target,scene:sceneSerial};return Promise.resolve(false);}
  if(kind==='correct'&&performance.now()-lastCorrectSound<200)return Promise.resolve(false);if(kind==='correct')lastCorrectSound=performance.now();
  lastSound={kind,target,scene:sceneSerial,time:performance.now()};
  stopSounds();const a=new Audio(base+clips[kind]+'.wav');a.learningSfx=true;a.volume=kind==='tap'?.18:.38;sounds.add(a);
  return new Promise(resolve=>{const done=()=>{sounds.delete(a);resolve(true);};a.addEventListener('ended',done,{once:true});a.addEventListener('error',done,{once:true});a.addEventListener('learning:sfx-cancel',done,{once:true});a.play().catch(done);});
 }
 // Observe authoritative game UI states. This adapter never decides whether an answer is correct.
 const arrived=new WeakSet(),seenImages=new WeakMap(),seenStates=new WeakMap();let activeRoot;
 function arrive(root,kind='scene'){
  if(!root?.isConnected||arrived.has(root)||root.closest('.toy-buddy,.learning-fx-layer'))return;
  arrived.add(root);root.dataset.feedbackArrival=kind;
  if(motion.matches)return;
  run(root,[{opacity:.3},{opacity:1}],{duration:240,easing:'ease-out'});
  const cards=[...root.querySelectorAll('.l2-match-card,.l2-picture,.af-card,.lf-picture,.ff-drop-target,.app-world-door,.app-lesson-stop,.shell-activity-card,button>img')].filter(e=>!e.closest('.toy-buddy')).slice(0,8);
  cards.forEach((card,i)=>run(card,[{opacity:.15},{opacity:1}],{duration:300,delay:i*32,easing:'ease-out'}));
  document.dispatchEvent(new CustomEvent('learning:presentation',{detail:{kind,game:typeof currentGame==='undefined'?null:currentGame}}));
 }
 function imageArrival(img){if(img.closest('.toy-buddy,[id="l2Actor"],.particle-layer,.learning-fx-layer')||img.getBoundingClientRect().width<45)return;
  const src=img.currentSrc||img.src;if(seenImages.get(img)===src)return;seenImages.set(img,src);img.dataset.feedbackArrival='picture';run(img,[{opacity:.2,transform:'scale(.92)'},{opacity:1,transform:'scale(1.025)',offset:.7},{opacity:1,transform:'scale(1)'}],{duration:430,easing:'cubic-bezier(.2,.8,.3,1)'});
 }
 function presentationAdapter(){
  const stage=document.querySelector('#gameStage'),pane=document.querySelector('#lessonApp');
  const checkRoot=()=>{if(!stage.closest('#gameScreen.active'))return;const root=stage.firstElementChild;if(root&&root!==activeRoot){clear();sceneSerial++;activeRoot=root;requestAnimationFrame(()=>{if(stage.closest('#gameScreen.active'))arrive(root);});}};
  const observer=new MutationObserver(records=>{
   checkRoot();const changed=new Set(),containers=new Set();
   for(const record of records){const e=record.target;if(!(e instanceof Element)||!e.isConnected||e.closest('.toy-buddy,.learning-fx-layer')||(e.closest('#gameStage')&&!stage.closest('#gameScreen.active')))continue;
    if(record.type==='childList'){
     if(e===pane)requestAnimationFrame(()=>arrive(pane.firstElementChild,'page'));
     if(e.matches('#l2Interaction,#l2Result,#afHint,.lf-done,.u3-victory,.ff-complete,.paint-complete,.missing-victory'))containers.add(e);
     if(e.matches('#l2Question,#l2Bubble,#l2Instruction,#l2Status,.status-line,#lfStatus,.hunt-progress,.fm-score,#l2Progress,#paintProgress'))run(e,[{opacity:.45},{opacity:1}],{duration:260});
     for(const node of record.addedNodes)if(node instanceof Element&&node.matches('.lf-done,.u3-victory,.ff-complete,.paint-complete,.missing-victory,.l2-complete'))containers.add(node);
    }else if(record.attributeName==='class')changed.add(e);
    else if(record.attributeName==='hidden'&&!e.hidden&&e.matches('#l2Result,#afHint'))containers.add(e);
    else if(record.attributeName==='data-phase'&&e.dataset.phase==='resolved'&&performance.now()-lastEffect>900)visual('correct',stage.querySelector('#l2Toy'));
   }
   containers.forEach(e=>requestAnimationFrame(()=>{if(!e.isConnected||e.hidden||!stage.closest('#gameScreen.active'))return;if(e.matches('#l2Interaction,#l2Result,#afHint'))arrived.delete(e);arrive(e,'cards');if(e.matches('.lf-done,.u3-victory,.ff-complete,.paint-complete,.missing-victory,.l2-complete'))visual('reward',e);}));
   changed.forEach(e=>{
    const before=seenStates.get(e)||new Set(),now=new Set(e.classList);seenStates.set(e,now);
    const entered=names=>names.some(name=>now.has(name)&&!before.has(name));
    if(entered(['l2-snapped','filled','is-filled']))play('place',e);
    else if(entered(['correct','answer-success','celebrate','win','found'])&&performance.now()-lastEffect>180)visual('correct',e);
    else if(entered(['wrong','bad','answer-wrong','l2-return','is-returning']))visual('retry',e);
    else if(entered(['selected','revealed'])&&!e.matches('.lf-tile,.l2-draggable,[data-ff-drag]'))visual('tap',e);
   });
  });
  observer.observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','data-phase']});observer.observe(pane,{childList:true});checkRoot();
  stage.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)imageArrival(e.target);},true);
  stage.addEventListener('pointerdown',e=>{const tile=e.target.closest('.l2-draggable,.lf-tile,[data-ff-drag]'),work=e.target.closest('[data-paint-number],.trace-card,canvas');if(work)lastTarget=work;if(!tile||tile.disabled||tile.hidden)return;lastTarget=tile;stage.classList.add('learning-drag-active');if(!busy())play('tap',tile,{visualize:false});},true);
  const release=e=>{if(stage.classList.contains('learning-drag-active')&&e?.type==='pointerup'){const zone=[...stage.querySelectorAll('.l2-drop,.ff-drop-target,.lf-slot')].find(b=>{const r=b.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});if(zone)lastTarget=zone;}stage.classList.remove('learning-drag-active');};addEventListener('pointerup',release,true);addEventListener('pointercancel',release,true);document.addEventListener('learning:leave-activity',release);
 }
 addEventListener('DOMContentLoaded',()=>{
  layer=document.createElement('div');layer.className='learning-fx-layer';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
  // Adapt legacy sound calls without rewriting the approved game engines or their audio files.
  const AudioOwner=window.Audio,extraRoutes=new Map();
  if(typeof DATA!=='undefined'){extraRoutes.set(DATA.unitAssets.correctSound,'correct');extraRoutes.set(DATA.unitAssets.retrySound,'retry');}
  window.Audio=function(src){let kind;const path=String(src||'');
   const old=path.match(/assets\/unit3\/sfx\/([^/.]+)/)?.[1];if(old)kind=({correct:'correct',wrong_soft:'retry',complete:'complete',click:'tap',reveal:'reveal'})[old];kind=kind||extraRoutes.get(path);
   if(path.includes('/unit2-ff/game-pack/audio/'))kind=({'correct-star.wav':'correct','retry-soft.wav':'retry','pickup-pop.wav':'tap','drop-snap.wav':'tap','game-complete.wav':'complete'})[path.split('/').pop()];
   const a=new AudioOwner(kind?base+clips[kind]+'.wav':src);
   if(kind==='tap'&&window.LearningClickSound){a.learningSfx=true;a.play=()=>window.LearningClickSound.legacy(lastTarget).then(()=>{a.dispatchEvent(new Event('ended'));});return a;}
   if(kind||path.startsWith(base)||path.includes('assets/rewards/')||path.includes('/unit2-ff/game-pack/audio/')){a.learningSfx=true;sounds.add(a);const release=()=>sounds.delete(a);a.addEventListener('ended',release);a.addEventListener('error',release);a.addEventListener('learning:sfx-cancel',()=>a.dispatchEvent(new Event('ended')));}
   if(kind){a.volume=.38;a.addEventListener('play',()=>{a.volume=Math.min(a.volume,.4);if(['correct','retry','complete'].includes(kind))visual(kind==='complete'?'reward':kind);const now=performance.now();if(!enabled()||busy()||(kind==='correct'&&now-lastCorrectSound<200)){if(enabled()&&busy()&&['correct','retry','complete'].includes(kind))deferred={kind,target:lastTarget,scene:sceneSerial};a.pause();a.dispatchEvent(new Event('ended'));return;}if(kind==='correct')lastCorrectSound=now;lastSound={kind,target:lastTarget,scene:sceneSerial,time:now};sounds.forEach(other=>{if(other!==a){other.pause();other.dispatchEvent(new Event('learning:sfx-cancel'));}});});}
   return a;
  };window.Audio.prototype=AudioOwner.prototype;Object.setPrototypeOf(window.Audio,AudioOwner);
  window.correctFx=()=>play('correct');window.retryFx=()=>play('retry');
  if(typeof letterAudio!=='undefined'){const originalLetterSfx=letterAudio.sfx;letterAudio.sfx=function(name,volume){if(!this.isOn())return;const kind={correct:'correct',wrong:'retry',complete:'complete',click:'tap'}[name];return kind?play(kind,lastTarget):originalLetterSfx.call(this,name,volume);};}
  presentationAdapter();
  document.addEventListener('click',e=>{const b=e.target.closest('button,a[href]');if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return;lastTarget=b;if(!b.matches('.l2-draggable,.lf-tile,[data-ff-drag]'))visual('tap',b);if(performance.now()-lastTap>180){lastTap=performance.now();play('tap',b,{visualize:false});}},true);
  document.addEventListener('learning:voice-start',()=>{if(sounds.size&&lastSound&&performance.now()-lastSound.time<300&&['correct','retry','complete','badge','star'].includes(lastSound.kind))deferred=lastSound;stopSounds();});
  document.addEventListener('learning:voice-end',()=>requestAnimationFrame(()=>{if(deferred&&deferred.scene===sceneSerial&&!busy()&&enabled()){const d=deferred;deferred=null;play(d.kind,d.target,{visualize:false});}}));
  new MutationObserver(()=>{if(['recording','starting','processing'].includes(window.Unit3Lesson2?.current()?.phase))stopSounds();}).observe(document.querySelector('#gameStage'),{subtree:true,attributes:true,attributeFilter:['data-phase']});
  document.addEventListener('learning:leave-activity',clear);addEventListener('hashchange',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});motion.addEventListener('change',clear);
  document.addEventListener('learning:feedback',e=>{const {kind,target}=e.detail||{};play(kind,target);});
 });
 window.LearningFeedback=Object.freeze({play,visual,clear,stopSounds,busy});
})();
