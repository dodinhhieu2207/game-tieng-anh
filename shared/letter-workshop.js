/* Build the Word: existing curriculum and letter models, owned scene/input/audio. */
(()=>{'use strict';
 const game=games.letterfly,reduce=matchMedia('(prefers-reduced-motion: reduce)');let owner;
 function clear(){if(!owner)return;owner.abort.abort();owner.animations.forEach(a=>a.kill());owner.timers.forEach(clearTimeout);owner.stopVoice?.();owner=null;letterAudio.stop()}
 function alive(o){return owner===o&&!o.abort.signal.aborted&&currentGame==='letterfly'}
 function later(o,fn,ms){const id=setTimeout(()=>{o.timers.delete(id);if(alive(o))fn()},ms);o.timers.add(id)}
 function stopMotion(o,el){for(const a of o.animations)if(a.targets().includes(el)){a.kill();o.animations.delete(a)}}
 function tween(o,el,vars,done){stopMotion(o,el);if(reduce.matches||!window.gsap){window.gsap?.set(el,{...vars,duration:0,onComplete:null});done?.();return}let a;a=gsap.to(el,{...vars,onComplete:()=>{o.animations.delete(a);if(alive(o))done?.()}});o.animations.add(a)}
 function selected(tile){owner?.root.querySelectorAll('.lf-tile').forEach(t=>{t.classList.toggle('workshop-selected',t===tile);t.setAttribute('aria-pressed',String(t===tile))});if(owner)owner.selected=tile}
 async function voice(o){o.stopVoice?.();letterAudio.stop();if(!alive(o)||!letterAudio.isOn())return false;const w=game.current;
  return new Promise(resolve=>{const a=new Audio(w.audio);let settled=false;const end=ok=>{if(settled)return;settled=true;a.pause();a.onended=a.onerror=null;if(o.audio===a){o.audio=null;o.stopVoice=null}o.root.querySelector('#lfPicture')?.classList.remove('playing');resolve(ok)};o.audio=a;o.stopVoice=()=>end(false);a.onended=()=>end(true);a.onerror=()=>{if(alive(o))game.status('Sound unavailable. Tap the picture to try again.','retry');end(false)};o.root.querySelector('#lfPicture')?.classList.add('playing');a.play().catch(error=>{if(settled)return;if(alive(o)&&error.name!=='AbortError')game.status(error.name==='NotAllowedError'?'Tap the picture to hear the word.':'Sound unavailable. Tap the picture to try again.','retry');end(false)})})
 }
 game.sayCurrent=function(){if(!owner)return Promise.resolve(false);const o=owner;return o.voicePromise=voice(o)};
 game.bindResize=function(){};game.placeTiles=function(){};
 game.loadWord=function(){clear();const w=this.current,L=w.letter;this.filled=0;this.mistakes=0;this.locked=false;this.round++;
  const chip=(v,label,c)=>`<button class="lf-chip ${this.filter===v?'on':''}" data-lf-filter="${v}" style="--c:${c}">${label}</button>`;
  setStage(`<section class="lf-game letter-workshop" style="${letterVars(L)}" data-motion-owned="true">
   <header class="lf-head"><details class="workshop-settings"><summary>Letters: ${this.filter.toUpperCase()} · ${this.mode==='easy'?'Easy':'Tricky'}</summary><div class="workshop-option-groups"><div class="lf-chips" role="group" aria-label="Choose letters">${chip('all','ALL','#3c82ea')}${LETTERS.map(x=>chip(x.upper,x.upper,x.color)).join('')}</div><div class="lf-chips" role="group" aria-label="Choose level">${['easy','tricky'].map(m=>`<button class="lf-chip ${this.mode===m?'on':''}" data-lf-mode="${m}">${m==='easy'?'Easy':'Tricky'}</button>`).join('')}</div></div></details><div class="abc-head-right"><div class="lf-progress" id="lfProgress">${this.built} built · ${this.index+1} / ${this.queue.length}</div><button class="lbtn sm llsound js-sound-toggle"></button></div></header>
   <div class="lf-field" id="lfField"><div class="lf-center" id="lfCenter"><button class="lf-picture" id="lfPicture" aria-label="Hear the word">${picHTML(w)}<span class="lf-hear" aria-hidden="true">♪</span></button><div class="lf-guide">${wordMarkup(w.word,w.hi||0)}</div><div class="lf-slots" id="lfSlots" style="--n:${w.word.length}">${[...w.word].map((ch,i)=>`<button class="lf-slot" data-index="${i}" data-letter="${escapeHTML(ch)}" aria-label="Place letter ${ch} in box ${i+1}"><span class="lf-ghost">${escapeHTML(ch)}</span></button>`).join('')}</div><p class="lf-status" id="lfStatus" role="status" aria-live="polite">Choose a letter, then its box. Or drag it!</p></div><div class="workshop-tray" role="group" aria-label="Letter tiles">${this.createLetterTiles()}</div></div></section>`);
  const o=owner={root:document.querySelector('.letter-workshop'),abort:new AbortController(),animations:new Set(),timers:new Set(),selected:null};const signal=o.abort.signal;
  o.root.querySelector('#lfSlots').style.setProperty('--mobile-n',Math.min(4,w.word.length));
  letterAudio.syncToggles();o.root.querySelectorAll('[data-lf-filter]').forEach(b=>b.addEventListener('click',()=>{this.filter=b.dataset.lfFilter;this.newSet()},{signal}));o.root.querySelectorAll('[data-lf-mode]').forEach(b=>b.addEventListener('click',()=>{this.mode=b.dataset.lfMode;this.loadWord()},{signal}));
  document.addEventListener('change',()=>{if(!letterAudio.isOn())o.stopVoice?.()},{signal});
  o.root.querySelector('#lfPicture').addEventListener('click',()=>this.sayCurrent(),{signal});o.root.querySelector('.js-sound-toggle').addEventListener('click',()=>o.stopVoice?.(),{signal});
  o.root.querySelectorAll('.lf-slot').forEach(slot=>slot.addEventListener('click',()=>{if(o.selected)this.handleDrop(o.selected,slot);else this.status('Choose a letter first.')},{signal}));this.bindTiles();
  if(els.autoVoice.checked)later(o,()=>this.sayCurrent(),420);
 };
 game.bindTiles=function(){const o=owner,signal=o.abort.signal;let drag;
  const cancel=()=>{if(!drag)return;const t=drag.tile;try{t.releasePointerCapture(drag.id)}catch{}drag=null;t.classList.remove('dragging');this.clearOver();this.goHome(t)};o.cancelInput=cancel;
  o.root.querySelectorAll('.lf-tile').forEach(tile=>{tile.setAttribute('aria-pressed','false');
   tile.addEventListener('pointerdown',e=>{if(this.locked||tile.disabled||drag||e.button!==0)return;stopMotion(o,tile);gsap.set(tile,{x:0,y:0});drag={tile,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};tile.setPointerCapture(e.pointerId);selected(tile)},{signal});
   tile.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId||drag.tile!==tile)return;const x=e.clientX-drag.x,y=e.clientY-drag.y;if(Math.hypot(x,y)>6)drag.moved=true;if(!drag.moved)return;tile.classList.add('dragging');gsap.set(tile,{x,y});this.clearOver();this.slotAt(e.clientX,e.clientY)?.classList.add('is-over');e.preventDefault()},{signal});
   tile.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId||drag.tile!==tile)return;const moved=drag.moved;drag=null;try{tile.releasePointerCapture(e.pointerId)}catch{}tile.classList.remove('dragging');this.clearOver();if(!moved)return;tile.dataset.suppressClick='yes';const slot=this.slotAt(e.clientX,e.clientY);if(slot)this.handleDrop(tile,slot);else{this.goHome(tile);this.status('Bring the letter into a box.')}},{signal});
   tile.addEventListener('pointercancel',cancel,{signal});tile.addEventListener('lostpointercapture',()=>{if(drag?.tile===tile)cancel()},{signal});
   tile.addEventListener('click',()=>{if(tile.dataset.suppressClick){delete tile.dataset.suppressClick;return}if(!this.locked&&!tile.disabled){selected(tile);this.status('Now choose its box.')}},{signal});
  });
  window.addEventListener('blur',cancel,{signal});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancel();selected(null);this.status('Choose a letter, then its box.')}},{signal});
 };
 game.goHome=function(tile){const o=owner;if(!o||!tile.isConnected)return;tween(o,tile,{x:0,y:0,duration:.3,ease:'power3.out'});selected(null)};
 game.handleDrop=function(tile,slot){if(this.locked||!owner||tile.disabled||!tile.isConnected||!owner.root.contains(slot))return;if(slot.classList.contains('filled')){this.goHome(tile);this.status('That box is full. Try an empty box.');return}tile.dataset.letter===slot.dataset.letter?this.handleCorrectDrop(tile,slot):this.handleWrongDrop(tile,slot)};
 game.handleCorrectDrop=function(tile,slot){const o=owner;if(!alive(o)||tile.disabled||slot.classList.contains('filled'))return;const a=tile.getBoundingClientRect(),b=slot.getBoundingClientRect();tile.disabled=true;slot.disabled=true;slot.classList.add('filled','workshop-pending');selected(null);this.filled++;
  tile.classList.add('snapping');const x=Number(gsap.getProperty(tile,'x'))+b.left+b.width/2-a.left-a.width/2,y=Number(gsap.getProperty(tile,'y'))+b.top+b.height/2-a.top-a.height/2;
  tween(o,tile,{x,y,scale:.92,duration:.34,ease:'power3.inOut'},()=>{tile.style.visibility='hidden';slot.classList.remove('workshop-pending');slot.innerHTML=`<span class="lf-placed">${escapeHTML(tile.dataset.letter)}</span><small aria-hidden="true">✓</small>`;LearningFeedback?.visual('place',slot);if(o.root.querySelectorAll('.lf-placed').length===this.current.word.length)this.completeWord();else this.status('Yes! '+tile.dataset.letter+'!')});
 };
 game.handleWrongDrop=function(tile,slot){const o=owner;this.mistakes++;slot.classList.add('workshop-retry');slot.setAttribute('aria-invalid','true');this.status('Try another box.','retry');this.goHome(tile);later(o,()=>{slot.classList.remove('workshop-retry');slot.removeAttribute('aria-invalid')},700)};
 game.completeWord=async function(){if(this.locked)return;const o=owner;this.locked=true;this.built++;document.getElementById('lfProgress').textContent=`${this.built} built · ${this.index+1} / ${this.queue.length}`;this.status(this.current.word+'!');o.root.querySelectorAll('.lf-tile').forEach(t=>t.disabled=true);LearningFeedback?.visual('correct',o.root.querySelector('#lfSlots'));
  let playback=this.sayCurrent();await playback;while(alive(o)&&o.voicePromise!==playback){playback=o.voicePromise;await playback}if(!alive(o))return;
  if(document.hidden){await new Promise(resolve=>{const resume=()=>{if(!document.hidden){document.removeEventListener('visibilitychange',resume);resolve()}};document.addEventListener('visibilitychange',resume,{signal:o.abort.signal});o.abort.signal.addEventListener('abort',resolve,{once:true})});if(!alive(o))return;await voice(o)}
  if(alive(o))this.showDone();
 };
 game.showDone=function(){const o=owner;if(!o||o.root.querySelector('.workshop-done'))return;const w=this.current;o.root.querySelector('.workshop-tray').outerHTML=`<div class="workshop-done" role="region" aria-label="Word complete"><strong>✓ ${escapeHTML(w.word)}</strong><span>You built the word!</span><div><button class="lbtn sm" id="lfAgain">Build again</button><button class="lbtn next sm" id="lfNext">Next word →</button><button class="lbtn back sm" id="lfBack">Back to letters</button></div></div>`;for(const [id,fn]of [['lfAgain',()=>this.resetWord()],['lfNext',()=>this.nextWord()],['lfBack',backToLetters]])o.root.querySelector('#'+id).addEventListener('click',fn,{signal:o.abort.signal});o.root.querySelector('#lfNext').focus({preventScroll:true})};
 document.addEventListener('learning:leave-activity',clear);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&owner){owner.cancelInput?.();owner.stopVoice?.()}});
})();
