/* Answer Islands retains the existing match-answer activity and award key. */
(()=>{
 'use strict';
 const WORDS=['plane','puppet','robot','balloon','teddy'];
 const art=n=>'assets/answer-islands/'+n+'.webp';
 const answer=yes=>yes?'Yes, it is.':"No, it isn't.";
 const answerKey=yes=>'answers/'+(yes?'yes_it_is':'no_it_isnt');
 const control=(name,label)=>`<button type="button" data-ai-${name} class="ai-control"><img src="assets/toy-delivery/controls/${name==='hear'?'hint':name==='again'?'replay':name==='home'?'home':'next'}.webp" alt=""><b>${label}</b></button>`;
 let scene;
 class Islands{
  constructor(){this.dead=false;this.epoch=0;this.index=0;this.firstCorrect=0;this.animations=new Set();this.rounds=shuffle(WORDS.flatMap(shown=>[true,false].map(yes=>({shown,asked:yes?shown:shuffle(WORDS.filter(x=>x!==shown))[0],yes}))));this.render();}
  $(q){return this.root.querySelector(q);}
  alive(t){return !this.dead&&this.epoch===t&&currentGame==='u3answer';}
  status(s){this.$('.ai-status').textContent=s;}
  phaseTo(p){this.phase=p;this.root.dataset.phase=p;this.root.querySelectorAll('[data-ai-answer],.ai-boat').forEach(b=>b.disabled=p!=='listening');this.$('[data-ai-hear]').disabled=!['listening','audio-error','answer-error','resolved'].includes(p);}
  stopVoice(ok=false){this.audio?.pause();this.finishVoice?.(ok);this.audio?.dispatchEvent(new Event('ended'));this.audio=null;this.finishVoice=null;}
  voice(key){this.stopVoice();SentenceWordAudio.stop();if(LearningApp.isMuted())return Promise.resolve(true);const clip=window.Unit3Lesson2Clips?.clips?.[key];if(!clip)return Promise.resolve(false);return new Promise(resolve=>{const a=new Audio(clip.src);this.audio=a;let done=false;const finish=ok=>{if(done)return;done=true;if(this.audio===a)this.audio=null;this.finishVoice=null;resolve(ok);};this.finishVoice=finish;a.onended=()=>finish(true);a.onerror=()=>finish(false);a.play().catch(()=>finish(false));});}
  stopWater(){this.water?.pause();this.water=null;}
  waterSound(){this.stopWater();if(LearningApp.isMuted()||!els.soundFx.checked||document.hidden)return;const a=new Audio('assets/answer-islands/sail.wav');a.learningSfx=true;a.volume=.28;this.water=a;a.play().catch(()=>{});}
  async animate(el,frames,ms){if(matchMedia('(prefers-reduced-motion: reduce)').matches||!el?.isConnected)return;const a=el.animate(frames,{duration:ms,easing:'cubic-bezier(.3,.1,.35,1)',fill:'forwards'});this.animations.add(a);try{await a.finished.catch(()=>{});}finally{a.cancel();this.animations.delete(a);}}
  render(){this.motion?.dispose();this.stopVoice();this.stopWater();this.drag?.destroy();cancelVoice();document.dispatchEvent(new Event('toybuddy:enter'));const t=++this.epoch;this.round=this.rounds[this.index];this.roundWrong=false;this.chosen=null;this.resolved=false;
   setStage(`<section class="answer-islands" aria-label="Answer Islands"><header class="ai-header"><h2>Answer Islands</h2><span>${this.index+1} / 10</span></header><div class="ai-collection" aria-label="Island treasures">${this.rounds.map((_,i)=>`<span class="${i<this.index?'done':''}" data-ai-pearl="${i}">${i<this.index?`<img src="${art('pearl')}" alt="Treasure collected">`:'○'}</span>`).join('')}</div><h3 class="ai-question">Is it a ${this.round.asked}?</h3><div class="ai-ocean"><svg class="ai-waves" viewBox="0 0 900 280" preserveAspectRatio="none" aria-hidden="true"><path class="ai-waterline" d="M-60 80 Q90 55 240 80 T540 80 T960 80"/><path class="ai-waterline" d="M-60 190 Q110 165 280 190 T620 190 T960 190"/></svg><div class="ai-islands">${[true,false].map(y=>`<button type="button" class="ai-island ai-${y?'yes':'no'}" data-ai-answer="${y}" aria-label="${answer(y)}"><img class="ai-island-art" src="${art(y?'yes-island':'no-island')}" alt=""><b>${y?'Yes,':'No,'}<br>${y?'it is.':"it isn't."}</b></button>`).join('')}</div><button type="button" class="ai-boat" aria-label="Drag the ${this.round.shown} boat to an answer island"><span class="ai-wake" aria-hidden="true"><i></i><i></i><i></i></span><span class="ai-boat-body"><img class="ai-toy" src="assets/unit3/toys/${this.round.shown}.webp" alt="${this.round.shown}"><img class="ai-hull" src="${art('boat')}" alt=""></span></button></div><p class="ai-status" role="status" aria-live="polite">Listen first.</p><div class="ai-controls">${control('hear','Hear again')}${control('next','Next island')}</div></section>`);
   this.root=document.querySelector('.answer-islands');this.motion=LearningMotion.create(this.root);this.$('[data-ai-next]').hidden=true;
   this.root.onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.hasAttribute('data-ai-answer'))this.choose(b.dataset.aiAnswer==='true');if(b.hasAttribute('data-ai-hear'))this.phase==='answer-error'?this.arrive(this.epoch):this.prompt();if(b.hasAttribute('data-ai-next'))this.next();};
   this.drag=ActivityDrag.bind(this.root,{items:'.ai-boat',zones:'[data-ai-answer]',enabled:()=>this.phase==='listening',drop:(_,z)=>this.choose(z.dataset.aiAnswer==='true')});
   restartCurrent=start;replayCurrent=()=>this.phase==='answer-error'?this.arrive(this.epoch):this.prompt();this.prompt(t);
  }
  async prompt(){if(['asking','reading','sailing','celebrating','complete'].includes(this.phase))return;const t=this.epoch,resolved=this.resolved;this.phaseTo('asking');this.status('Listen to the question.');const ok=await this.voice('questions/is_it_a_'+this.round.asked);if(!this.alive(t))return;this.phaseTo(ok?(resolved?'resolved':'listening'):'audio-error');if(resolved)this.root.querySelectorAll('[data-ai-answer],.ai-boat').forEach(b=>b.disabled=true);this.status(ok?(resolved?'Ready for the next island?':'Tap an island, or drag the boat.'): 'Audio could not play. Tap Hear again.');}
  async choose(yes){if(this.phase!=='listening')return;const t=this.epoch;this.chosen=yes;this.phaseTo('reading');
   if(yes!==this.round.yes){this.roundWrong=true;this.$(`[data-ai-answer="${yes}"]`).classList.add('ai-retry');LearningFeedback.visual('retry',this.$(`[data-ai-answer="${yes}"]`));this.status('Look at the toy. Try the other island.');await this.voice('feedback/look_again');if(!this.alive(t))return;this.$(`[data-ai-answer="${yes}"]`).classList.remove('ai-retry');this.phaseTo('listening');return;}
   this.status(answer(yes)+' Listen!');await this.arrive(t);
  }
  async arrive(t){this.phaseTo('reading');const ok=await this.voice(answerKey(this.round.yes));if(!this.alive(t))return;if(!ok){this.phaseTo('answer-error');this.status('Audio could not play. Hear again before we sail.');return;}
   this.phaseTo('sailing');this.status('All aboard!');const boat=this.$('.ai-boat'),target=this.$(`[data-ai-answer="${this.round.yes}"]`),b=boat.getBoundingClientRect(),r=target.getBoundingClientRect(),dx=r.left+r.width/2-b.left-b.width/2,dy=Math.min(r.bottom+90,this.$('.ai-ocean').getBoundingClientRect().bottom-8)-b.bottom;boat.dataset.direction=dx<0?'left':'right';this.waterSound();
   await this.motion.run(tl=>{
    const body=this.$('.ai-boat-body'),foam=this.root.querySelectorAll('.ai-wake i'),lines=this.root.querySelectorAll('.ai-waterline'),direction=dx<0?-1:1;
    tl.set(boat,{x:0,y:0,rotation:0}).set(body,{transformOrigin:'50% 85%'}).set(foam,{opacity:0,scaleX:.4});
    tl.to(body,{rotation:-direction*1.2,y:-1,duration:.2,ease:'sine.out'},0);
    tl.to(boat,{motionPath:{path:[{x:0,y:0},{x:dx*.16,y:dy*.08-3},{x:dx*.53,y:dy*.35-6},{x:dx*.9,y:dy*.85},{x:dx,y:dy}],curviness:1},duration:2.35,ease:'power1.inOut'},.18);
    tl.to(body,{rotation:direction*.9,y:-2,duration:.42,repeat:4,yoyo:true,ease:'sine.inOut'},.2);
    tl.to(body,{rotation:0,y:0,duration:.34,ease:'sine.out'},2.3);
    tl.to(foam,{opacity:.42,scaleX:1,stagger:.09,duration:.24,ease:'sine.out'},.24);
    tl.to(foam,{x:-direction*18,duration:.7,repeat:2,stagger:.07,ease:'none'},.35);
    tl.to(foam,{opacity:0,scaleX:1.2,stagger:.05,duration:.4,ease:'sine.out'},2.05);
    tl.to(lines,{x:direction*22,opacity:.2,stagger:.12,duration:2.4,ease:'sine.inOut'},.1);
   });
   if(!this.alive(t))return;this.stopWater();
   if(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const now=boat.getBoundingClientRect(),dock=target.getBoundingClientRect();gsap.set(boat,{x:Number(gsap.getProperty(boat,'x'))+dock.left+dock.width/2-now.left-now.width/2,y:Number(gsap.getProperty(boat,'y'))+Math.min(dock.bottom+90,this.$('.ai-ocean').getBoundingClientRect().bottom-8)-now.bottom});}
   this.phaseTo('celebrating');target.classList.add('ai-docked');await LearningFeedback.play('correct',target);if(!this.alive(t))return;
   const pearl=document.createElement('img');pearl.className='ai-earned';pearl.src=art('pearl');pearl.alt='';this.root.appendChild(pearl);const root=this.root.getBoundingClientRect(),to=this.$(`[data-ai-pearl="${this.index}"]`).getBoundingClientRect(),x=r.left+r.width/2-root.left,y=r.top+r.height/2-root.top;pearl.style.left=(x-32)+'px';pearl.style.top=(y-32)+'px';
   await this.motion.run(tl=>{const px=to.left+to.width/2-root.left-x,py=to.top+to.height/2-root.top-y;
    tl.fromTo(pearl,{scale:.6,opacity:0,rotation:-12},{scale:1,opacity:1,rotation:0,duration:.24,ease:'back.out(1.2)'},0);
    tl.to(pearl,{motionPath:{path:[{x:0,y:0},{x:-15,y:-28},{x:px*.4,y:py*.6-25},{x:px,y:py}],curviness:1},duration:.75,ease:'power2.inOut'},.16);
    tl.to(pearl,{scale:.36,duration:.6,ease:'power1.in'},.3);
   });pearl.remove();if(!this.alive(t))return;
   if(!this.roundWrong)this.firstCorrect++;this.$(`[data-ai-pearl="${this.index}"]`).innerHTML=`<img src="${art('pearl')}" alt="Treasure collected">`;this.resolved=true;this.phaseTo('resolved');this.$('[data-ai-next]').hidden=false;this.$('[data-ai-next]').focus({preventScroll:true});this.status('Treasure collected! Next island?');
  }
  next(){if(this.phase!=='resolved')return;if(++this.index===this.rounds.length)this.complete();else this.render();}
  complete(){this.motion?.dispose();this.phase='complete';this.drag?.destroy();this.stopVoice();this.stopWater();const stars=this.firstCorrect>=9?3:this.firstCorrect>=7?2:1;this.root.dataset.phase='complete';this.root.innerHTML=`<div class="ai-result"><img src="${art('lighthouse')}" alt="Island lighthouse"><h2>Island explorer!</h2><p class="ai-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</p><p>10 island treasures collected</p>${control('again','Play again')}${control('home','Choose activities')}</div>`;this.$('[data-ai-again]').onclick=start;this.$('[data-ai-home]').onclick=()=>LearningApp.go('#/unit/3/lesson/2?mode='+(LearningApp.context()?.mode||'practice'));document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:'u3answer',stars}}));LearningFeedback.play('complete',this.root);}
  dispose(){this.motion?.dispose();this.dead=true;this.epoch++;this.stopVoice();this.stopWater();this.drag?.destroy();this.animations.forEach(a=>a.cancel());this.animations.clear();}
 }
 function start(){scene?.dispose();scene=new Islands();}
 games.u3answer={enter:start};GAME_META.u3answer=['UNIT 3 · LESSON 2','Answer Islands','Listen · choose · sail'];window.AnswerIslands={current:()=>scene};
 document.addEventListener('learning:leave-activity',()=>{scene?.dispose();scene=null;});document.addEventListener('toybuddy:enter',()=>{scene?.stopVoice(LearningApp.isMuted());scene?.stopWater();});document.addEventListener('visibilitychange',()=>{if(document.hidden){scene?.stopVoice();scene?.stopWater();}});document.addEventListener('change',()=>{if(!els.soundFx.checked)scene?.stopWater();});
})();
