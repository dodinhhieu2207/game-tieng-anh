/* Picture-to-word delivery. Keep the original u3match route and progress key. */
(()=>{
 'use strict';
 const words=['robot','teddy','plane','puppet','balloon'],base='assets/toy-delivery/';
 const art=w=>`assets/unit3/toys/${w}.webp`;
 const sprite=(name,cls='')=>`<span class="td-sprite td-${name} ${cls}" aria-hidden="true"></span>`;
 let scene;
 class Delivery {
  constructor(){this.dead=false;this.turn=0;this.index=0;this.mistakes=0;this.assisted=0;this.rounds=['robot',...shuffle(words.filter(w=>w!=='robot'))];this.animations=new Set();this.audio=null;this.finishAudio=null;this.render();}
  alive(t){return !this.dead&&this.turn===t&&currentGame==='u3match';}
  $(s){return this.root.querySelector(s);}
  feedback(kind,el){window.LearningFeedback?.play(kind,el);}
  stopVoice(ok=false){const a=this.audio;a?.pause();this.finishAudio?.(ok);if(a){a.onended=null;a.dispatchEvent(new Event('ended'));}this.audio=null;this.finishAudio=null;}
  voice(word){this.stopVoice();if(LearningApp.isMuted())return Promise.resolve(true);
   return new Promise(resolve=>{const a=new Audio(`assets/unit3/audio/${word}.mp3`);this.audio=a;let done=false;
    const finish=ok=>{if(done)return;done=true;if(this.audio===a)this.audio=null;this.finishAudio=null;resolve(ok);};
    this.finishAudio=finish;a.onended=()=>finish(true);a.onerror=()=>finish(false);a.play().catch(()=>finish(false));
   });
  }
  render(){this.stopVoice();const t=++this.turn;this.phase='choose';this.target=this.rounds[this.index];this.hinted=false;this.wrong=new Set();
   const other=this.index===0?'teddy':shuffle(words.filter(w=>w!==this.target))[0];this.choices=shuffle([this.target,other]);
   setStage(`<section class="toy-delivery" data-phase="choose" aria-label="Toy Delivery">
    <header class="td-header"><h2>Toy Delivery</h2><div class="td-progress" aria-label="Delivery progress">${this.rounds.map((_,i)=>`<span class="${i<this.index?'done':''}">${i<this.index?'★':'○'}</span>`).join('')}<b>${this.index+1} / 5</b></div></header>
    <div class="td-world"><div class="td-request">${sprite('sign')}<img src="${art(this.target)}" alt="Find the matching word"><span>Find my word!</span></div>
     <div class="td-receiver"><img src="${art('puppet')}" alt="Your delivery friend"><span class="td-speech">For me?</span></div>
     <div class="td-runway" aria-hidden="true"></div><div class="td-aircraft">${sprite('plane')}<span class="td-cargo" hidden>${sprite('crate')}</span></div>
     <div class="td-destination">${sprite('pad')}<div class="td-delivered" hidden>${sprite('open')}<img class="td-toy" src="${art(this.target)}" alt="${this.target}"></div></div>
     <div class="td-parcels" role="group" aria-label="Choose a word">${this.choices.map(w=>`<button type="button" class="td-parcel" data-word="${w}">${sprite('crate')}<span>${w}</span></button>`).join('')}</div>
    </div>
    <footer class="td-footer"><p data-td-status role="status" aria-live="polite">Look at the toy. Choose its word.</p><div class="td-actions"><button type="button" data-td-hint>♪ Hear a hint</button><button type="button" data-td-next disabled>Next delivery →</button></div><button type="button" data-td-retry hidden>Hear it again</button></footer>
   </section>`);
   this.root=document.querySelector('.toy-delivery');
   this.root.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>this.choose(b));
   this.$('[data-td-hint]').onclick=()=>this.hint();this.$('[data-td-next]').onclick=()=>this.next();this.$('[data-td-retry]').onclick=()=>this.finishDelivery(t);
   restartCurrent=()=>start();replayCurrent=()=>this.phase==='choose'?this.hint():this.phase==='resolved'?this.voice(this.target):null;
  }
  status(text){this.$('[data-td-status]').textContent=text;}
  async hint(){if(this.phase!=='choose')return;const t=this.turn;this.phase='hint';this.lock(true);if(!this.hinted){this.hinted=true;this.assisted++;}this.status('Listen, then choose.');
   const ok=await this.voice(this.target);if(!this.alive(t))return;this.phase='choose';this.lock(false);this.status(ok?'Choose its word.':'Sound could not play. Try the hint again.');
  }
  lock(value){this.root.querySelectorAll('[data-word],[data-td-hint]').forEach(b=>b.disabled=value);}
  async animate(el,frames,ms){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!el?.isConnected)return;
   const a=el.animate(frames,{duration:ms,easing:'ease-in-out',fill:'forwards'});this.animations.add(a);await a.finished.catch(()=>{});this.animations.delete(a);a.cancel();
  }
  async choose(b){if(this.phase!=='choose')return;const t=this.turn;
   if(b.dataset.word!==this.target){if(!this.wrong.has(b.dataset.word)){this.wrong.add(b.dataset.word);this.mistakes++;}this.feedback('retry',b);b.classList.add('td-try');this.status('Try the other parcel.');return;}
   this.phase='flying';this.root.dataset.phase='flying';this.lock(true);b.classList.add('td-picked');this.status('Off we go!');this.feedback('place',b);
   const plane=this.$('.td-aircraft'),cargo=this.$('.td-cargo');cargo.hidden=false;
   const from=plane.getBoundingClientRect(),to=this.$('.td-destination').getBoundingClientRect(),dx=to.left+to.width/2-from.left-from.width/2,dy=to.top-from.top-20;
   await this.animate(plane,[{transform:'translate(0,0)'},{transform:`translate(${dx*.45}px,${dy-70}px) rotate(-8deg)`,offset:.5},{transform:`translate(${dx}px,${dy}px) rotate(0)`}],1250);
   if(!this.alive(t))return;plane.style.transform=`translate(${dx}px,${dy}px)`;cargo.hidden=true;plane.style.visibility='hidden';this.$('.td-delivered').hidden=false;b.style.visibility='hidden';this.feedback('reveal',this.$('.td-destination'));
   await this.finishDelivery(t);
  }
  async finishDelivery(t){if(!this.alive(t))return;this.$('[data-td-retry]').hidden=true;this.phase='reading';this.root.dataset.phase='reading';this.status(this.target+'!');
   const ok=await this.voice(this.target);if(!this.alive(t))return;
   if(!ok){this.phase='audio-error';this.status('Sound could not play. Tap to hear it again.');this.$('[data-td-retry]').hidden=false;return;}
   this.feedback('correct',this.$('.td-toy'));await SpeakingPlay.action(this.target,this.$('.td-toy'),a=>this.animations.add(a));if(!this.alive(t))return;
   this.phase='resolved';this.root.dataset.phase='resolved';this.$('.td-speech').textContent='Thank you!';this.status('Delivered!');this.$('.td-progress span:nth-child('+(this.index+1)+')').textContent='★';this.$('[data-td-next]').disabled=false;this.$('[data-td-next]').focus({preventScroll:true});
  }
  next(){if(this.phase!=='resolved')return;if(++this.index===5)this.complete();else this.render();}
  complete(){this.phase='complete';this.stopVoice();const score=this.mistakes+this.assisted,stars=score===0?3:score<=3?2:1;
   this.root.innerHTML=`<div class="td-result">${sprite('reward')}<h2>All toys delivered!</h2><p class="td-result-stars" aria-label="${stars} of 3 stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</p><p>5 happy deliveries</p>${this.assisted?'<p>You used listening hints.</p>':''}<button type="button" data-td-again>Play again</button><button type="button" data-td-library>Choose activities</button></div>`;this.root.dataset.phase='complete';
   this.$('[data-td-again]').onclick=start;this.$('[data-td-library]').onclick=()=>LearningApp.go('#/unit/3/lesson/1?mode=practice');
   document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:'u3match',stars}}));this.feedback('complete',this.root);
  }
  dispose(){this.dead=true;this.turn++;this.stopVoice();this.animations.forEach(a=>a.cancel());this.animations.clear();}
 }
 function start(){scene?.dispose();scene=new Delivery();}
 games.u3match={enter:start};GAME_META.u3match=['UNIT 3 · LESSON 1','Toy Delivery','Look · choose · deliver'];
 window.ToyDelivery={current:()=>scene};
 document.addEventListener('learning:leave-activity',()=>{scene?.dispose();scene=null;});
 document.addEventListener('toybuddy:enter',()=>scene?.stopVoice(LearningApp.isMuted()));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)scene?.stopVoice();});
})();
