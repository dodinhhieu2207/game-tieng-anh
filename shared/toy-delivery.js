/* Picture-to-word delivery. Keep the original u3match route and progress key. */
(()=>{
 'use strict';
 const words=['robot','teddy','plane','puppet','balloon'],base='assets/toy-delivery/';
 const art=w=>`assets/unit3/toys/${w}.webp`;
 const sprite=(name,cls='')=>`<span class="td-sprite td-${name} ${cls}" aria-hidden="true"></span>`;
 let scene,artWarmed=false;
 function warmArt(){if(artWarmed)return;artWarmed=true;for(const [folder,names] of [['controls',['up','down','takeoff','pause','resume','hint','next','replay','home']],['vfx',['pickup-ring','wind','star','dust','confetti','bloom']]])for(const name of names){const image=new Image();image.src=base+folder+'/'+name+'.webp';}}
 class Delivery {
  constructor(config={}){this.config=config;this.game=config.game||'u3match';this.vocab=config.words||words;this.picture=config.picture||art;this.title=config.title||'Toy Delivery';this.dead=false;this.turn=0;this.index=0;this.mistakes=0;this.assisted=0;this.rounds=[this.vocab[0],...shuffle(this.vocab.slice(1))];this.animations=new Set();this.audio=null;this.finishAudio=null;this.render();}
  alive(t){return !this.dead&&this.turn===t&&currentGame===this.game;}
  $(s){return this.root.querySelector(s);}
  skin(button,icon,label='',compact=false){if(!button)return;button.classList.add('td-art-button');button.classList.toggle('td-art-compact',compact);button.dataset.icon=icon;button.innerHTML=`<span class="td-button-art" aria-hidden="true"></span>${label?`<span class="td-button-label">${label}</span>`:''}`;}
  flightSkin(icon,label){this.skin(this.$('[data-td-flight]'),icon,label);}
  skinControls(){this.skin(this.$('[data-td-up]'),'up');this.skin(this.$('[data-td-down]'),'down');this.flightSkin('takeoff','Take off!');this.skin(this.$('[data-td-hint]'),'hint','Hear a hint',true);this.skin(this.$('[data-td-next]'),'next','Next delivery',true);this.skin(this.$('[data-td-retry]'),'hint','Hear it again',true);}
  async effect(kind,target,{size=160,dx=0,dy=-25,duration=650}={}){if(this.dead||!target?.isConnected||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const host=this.$('.td-world')||this.root;let layer=host.querySelector('.td-fx');if(!layer){layer=document.createElement('div');layer.className='td-fx';layer.setAttribute('aria-hidden','true');host.appendChild(layer);}const el=document.createElement('span');el.className='td-texture-fx td-fx-'+kind;layer.appendChild(el);const r=target.getBoundingClientRect(),h=host.getBoundingClientRect();size=Math.min(size,h.width*.65);el.style.cssText=`width:${size}px;height:${size}px;left:${r.left+r.width/2-h.left-size/2}px;top:${r.top+r.height/2-h.top-size/2}px`;
   try{await this.animate(el,[{transform:'scale(.25)',opacity:0},{transform:'scale(1)',opacity:kind==='bloom'?.6:.9,offset:.3},{transform:`translate(${dx}px,${dy}px) scale(1.3)`,opacity:0}],duration);}finally{el.remove();}
  }
  feedback(kind,el){window.LearningFeedback?.play(kind,el);}
  stopVoice(ok=false){const a=this.audio;a?.pause();this.finishAudio?.(ok);if(a){a.onended=null;a.dispatchEvent(new Event('ended'));}this.audio=null;this.finishAudio=null;}
  voice(word){this.stopSounds();this.stopVoice();if(LearningApp.isMuted())return Promise.resolve(true);
   return new Promise(resolve=>{const a=new Audio(this.config.audio?this.config.audio(word):`assets/unit3/audio/${word}.mp3`);this.audio=a;let done=false;
    const finish=ok=>{if(done)return;done=true;if(this.audio===a)this.audio=null;this.finishAudio=null;resolve(ok);};
    this.finishAudio=finish;a.onended=()=>finish(true);a.onerror=()=>finish(false);a.play().catch(()=>finish(false));
   });
  }
  render(){this.stopFlight();this.stopVoice();const t=++this.turn;this.phase='choose';this.target=this.rounds[this.index];this.hinted=false;this.wrong=new Set();this.lane=-1;this.planeY=292;this.aimY=292;this.travel=0;
   const other=this.index===0?(this.config.firstOther||'teddy'):shuffle(this.vocab.filter(w=>w!==this.target))[0];this.choices=shuffle([this.target,other]);
   setStage(`<section class="toy-delivery ${this.config.className||''}" data-phase="choose" aria-label="${this.title}">
    <header class="td-header"><h2>${this.title}</h2><div class="td-progress" aria-label="Delivery progress">${this.rounds.map((_,i)=>`<span class="${i<this.index?'done':''}">${i<this.index?'★':'○'}</span>`).join('')}<b>${this.index+1} / ${this.rounds.length}</b></div></header>
    <div class="td-world" tabindex="0" aria-label="Flight area. Drag up or down, or use arrow keys to steer."><div class="td-clouds" aria-hidden="true"><i></i><i></i><i></i></div><div class="td-request">${sprite('sign')}<img src="${this.picture(this.target)}" alt="Find the matching word"><span>${this.config.request||'Find my word!'}</span></div>
     <div class="td-receiver"><img src="${this.config.receiver||art('puppet')}" alt="Your delivery friend"><span class="td-speech">For me?</span></div>
     <div class="td-lane td-lane-top" aria-hidden="true"></div><div class="td-lane td-lane-bottom" aria-hidden="true"></div><div class="td-aircraft">${sprite('plane')}<span class="td-propeller" aria-hidden="true"></span><span class="td-trail" aria-hidden="true"><i></i><i></i><i></i></span><span class="td-cargo" hidden>${sprite('crate')}</span></div>
     <div class="td-destination">${sprite('pad')}<div class="td-delivered" hidden>${sprite('open','td-closed')}<img class="td-toy" src="${this.picture(this.target)}" alt="${this.target}"></div></div>
     <div class="td-parcels" role="group" aria-label="Steer toward a word">${this.choices.map((w,i)=>`<button type="button" class="td-parcel" data-lane="${i}" data-word="${w}" aria-label="Fly ${i?'down':'up'} toward ${w}">${sprite('crate')}<span>${w}</span></button>`).join('')}</div>
     <div class="td-flight-banner" aria-hidden="true">Ready, pilot?</div><div class="td-fx" aria-hidden="true"></div>
    </div>
    <footer class="td-footer"><p data-td-status role="status" aria-live="polite">Fly to the matching word!</p><div class="td-pilot-controls"><button type="button" data-td-up aria-label="Steer up">↑</button><button type="button" data-td-flight>Take off!</button><button type="button" data-td-down aria-label="Steer down">↓</button></div><div class="td-actions"><button type="button" data-td-hint>♪ Hear a hint</button><button type="button" data-td-next disabled hidden>Next delivery →</button></div><button type="button" data-td-retry hidden>Hear it again</button></footer>
   </section>`);
   this.root=document.querySelector('.toy-delivery');
   this.config.onRender?.(this);
   this.skinControls();
   this.root.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>this.choose(b));
   this.$('[data-td-hint]').onclick=()=>this.hint();this.$('[data-td-next]').onclick=()=>this.next();this.$('[data-td-retry]').onclick=()=>this.finishDelivery(t);
   this.$('[data-td-up]').onclick=()=>this.steer(0);this.$('[data-td-down]').onclick=()=>this.steer(1);this.$('[data-td-flight]').onclick=()=>this.toggleFlight();
   this.root.onkeydown=e=>{if(['ArrowUp','ArrowDown'].includes(e.key)||(e.key===' '&&!e.target.matches('button'))){e.preventDefault();e.key===' '?this.toggleFlight():this.steer(e.key==='ArrowUp'?0:1);}};
   const world=this.$('.td-world');world.onpointerdown=e=>{if(e.target.closest('button')||!['choose','pilot','paused'].includes(this.phase))return;world.setPointerCapture(e.pointerId);this.drag(e);};world.onpointermove=e=>{if(world.hasPointerCapture(e.pointerId))this.drag(e);};world.onpointerup=e=>{if(world.hasPointerCapture(e.pointerId))world.releasePointerCapture(e.pointerId);};
   this.position();this.$('[data-td-flight]').focus({preventScroll:true});
   restartCurrent=()=>start(this.config);replayCurrent=()=>['choose','pilot','paused'].includes(this.phase)?this.hint():this.phase==='resolved'?this.voice(this.target):null;
  }
  drag(e){const y=e.clientY-this.$('.td-world').getBoundingClientRect().top;if(y<170)return;this.steer(y<290?0:1);}
  steer(lane){if(!['choose','pilot','paused'].includes(this.phase))return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.phase='choose';this.choose(this.$(`[data-lane="${lane}"]`),true);return;}this.lane=lane;this.aimY=lane?355:235;this.root.dataset.lane=lane;this.root.querySelectorAll('[data-lane]').forEach(b=>b.classList.toggle('td-aimed',Number(b.dataset.lane)===lane));if(this.phase==='choose')this.launch();else if(this.phase==='paused'){this.planeY=this.aimY;this.position();this.launch();}}
  toggleFlight(){if(this.phase==='pilot'){this.pause();return;}if(['choose','paused'].includes(this.phase))this.launch();}
  pause(){if(this.phase!=='pilot')return;this.stopFlight();this.phase='paused';this.root.dataset.phase='paused';this.flightSkin('resume','Keep flying');this.status('Choose a lane, then keep flying.');}
  launch(){if(!['choose','paused'].includes(this.phase))return;const first=this.phase==='choose';this.phase='pilot';this.root.dataset.phase='pilot';this.flightSkin('pause','Pause');this.status('Up or down? Fly to its word.');if(first){this.sound('takeoff');this.effect('wind',this.$('.td-aircraft'),{size:140,dx:-100,dy:0});}this.lastFrame=performance.now();this.raf=requestAnimationFrame(now=>this.tick(now));}
  stopFlight(){cancelAnimationFrame(this.raf);this.raf=null;}
  tick(now){if(this.dead||this.phase!=='pilot')return;const dt=Math.min((now-this.lastFrame)/1000,.05);this.lastFrame=now;if(document.hidden){this.pause();return;}
   this.planeY+=(this.aimY-this.planeY)*Math.min(1,dt*10);this.travel+=dt/(this.flightSeconds||6);this.position();
   if(this.travel>=1){this.stopFlight();const lane=Math.abs(this.planeY-235)<44?0:Math.abs(this.planeY-355)<44?1:-1;if(lane<0||(this.lane>=0&&lane!==this.lane)){this.travel=0;this.status('Go around! Pick a lane.');this.lastFrame=now;this.raf=requestAnimationFrame(n=>this.tick(n));return;}
    this.phase='choose';this.choose(this.$(`[data-lane="${lane}"]`),true);return;
   }this.raf=requestAnimationFrame(n=>this.tick(n));
  }
  position(){const world=this.$('.td-world');if(!world)return;const w=world.clientWidth,plane=this.$('.td-aircraft');plane.style.left='7%';plane.style.top=(this.planeY-plane.offsetHeight/2)+'px';plane.style.transform=`rotate(${Math.max(-9,Math.min(9,(this.aimY-this.planeY)/8))}deg)`;
   this.root.querySelectorAll('[data-lane]').forEach((b,i)=>{b.style.left=(w*.74+this.travel*(w*.07+plane.offsetWidth/2-w*.74)-b.offsetWidth/2)+'px';b.style.top=((i?355:235)-b.offsetHeight/2)+'px';});
  }
  sound(name){if(LearningApp.isMuted()||!els.soundFx.checked||document.hidden)return;this.sounds??=new Set();const a=new Audio(base+name+'.wav');a.learningSfx=true;a.volume=.28;this.sounds.add(a);a.onended=a.onerror=()=>this.sounds.delete(a);a.play().catch(()=>this.sounds.delete(a));}
  stopSounds(){this.sounds?.forEach(a=>{a.pause();a.dispatchEvent(new Event('ended'));});this.sounds?.clear();}
  status(text){this.$('[data-td-status]').textContent=text;}
  async hint(){if(!['choose','pilot','paused'].includes(this.phase))return;const t=this.turn;this.stopFlight();this.stopSounds();this.phase='hint';this.root.dataset.phase='paused';this.lock(true);if(!this.hinted){this.hinted=true;this.assisted++;}this.status('Listen, then fly.');
   const ok=await this.voice(this.target);if(!this.alive(t))return;this.phase='paused';this.lock(false);this.flightSkin('resume','Keep flying');this.status(ok?'Choose a lane, then keep flying.':'Sound could not play. Try the hint again.');
  }
  lock(value){this.root.querySelectorAll('[data-word],[data-td-hint],[data-td-up],[data-td-down],[data-td-flight]').forEach(b=>b.disabled=value);}
  async animate(el,frames,ms){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!el?.isConnected)return;
   const a=el.animate(frames,{duration:ms,easing:'ease-in-out',fill:'forwards'});this.animations.add(a);await a.finished.catch(()=>{});this.animations.delete(a);a.cancel();
  }
  async choose(b,caught=false){const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!caught&&!reduced){this.steer(Number(b.dataset.lane));return;}if(!caught&&reduced&&['pilot','paused'].includes(this.phase)){this.stopFlight();this.phase='choose';}if(this.phase!=='choose')return;const t=this.turn;
   if(b.dataset.word!==this.target){if(!this.wrong.has(b.dataset.word)){this.wrong.add(b.dataset.word);this.mistakes++;}this.feedback('retry',b);b.classList.add('td-try');this.travel=0;this.phase=matchMedia('(prefers-reduced-motion: reduce)').matches?'choose':'paused';this.root.dataset.phase=this.phase;this.position();this.flightSkin('resume','Try again');this.status('Try the other word.');return;}
   this.phase='flying';this.root.dataset.phase='flying';this.lock(true);b.classList.add('td-picked');this.status('Off we go!');this.feedback('place',b);
   this.stopFlight();this.$('.td-pilot-controls').hidden=true;this.root.querySelectorAll('[data-lane]').forEach(x=>x.style.visibility='hidden');this.sound('pickup');
   const plane=this.$('.td-aircraft'),cargo=this.$('.td-cargo');cargo.hidden=false;this.$('.td-flight-banner').textContent='Special delivery!';
   this.effect('pickup-ring',plane,{size:190,dy:0,duration:650});await this.animate(cargo,[{transform:'translateY(-35px) scale(.25)',opacity:0},{transform:'translateY(5px) scale(1.15)',opacity:1,offset:.75},{transform:'translateY(0) scale(1)',opacity:1}],420);if(!this.alive(t))return;
   const from=plane.getBoundingClientRect(),to=this.$('.td-destination').getBoundingClientRect(),dx=to.left+to.width/2-from.left-from.width/2,dy=to.top-from.top-20;
   await this.animate(plane,[{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.35}px,${dy-80}px) rotate(-9deg) scale(1.05)`,offset:.4},{transform:`translate(${dx}px,${dy}px) rotate(4deg) scale(.92)`,offset:.85},{transform:`translate(${dx}px,${dy}px) rotate(0) scale(1)`}],1700);
   if(!this.alive(t))return;plane.style.transform=`translate(${dx}px,${dy}px)`;cargo.hidden=true;this.$('.td-delivered').hidden=false;b.style.visibility='hidden';this.feedback('reveal',this.$('.td-destination'));
   this.sound('landing');this.effect('dust',this.$('.td-destination'),{size:220,dy:15,duration:750});await Promise.all([this.animate(this.$('.td-delivered'),[{transform:'translateY(-50px) scale(.75)',opacity:0},{transform:'translateY(7px) scale(1.08)',opacity:1,offset:.7},{transform:'translateY(0) scale(1)',opacity:1}],550),this.animate(plane,[{transform:`translate(${dx}px,${dy}px)`,opacity:1},{transform:`translate(${dx+180}px,${dy-100}px) rotate(-12deg) scale(.75)`,opacity:0}],700)]);if(!this.alive(t))return;plane.style.visibility='hidden';
   const box=this.$('.td-delivered');await this.animate(box,[{transform:'scale(1)'},{transform:'rotate(-4deg) scale(1.04)',offset:.3},{transform:'rotate(4deg) scale(1.04)',offset:.65},{transform:'scale(1)'}],300);if(!this.alive(t))return;box.querySelector('.td-open').classList.remove('td-closed');box.dataset.open='true';this.effect('bloom',box,{size:200,dy:0,duration:900});this.feedback('reveal',box);await this.animate(this.$('.td-toy'),[{transform:'translateY(30px) scale(.3)',opacity:0},{transform:'translateY(-8px) scale(1.08)',opacity:1,offset:.75},{transform:'translateY(0) scale(1)',opacity:1}],500);if(!this.alive(t))return;await this.finishDelivery(t);
  }
  async finishDelivery(t){if(!this.alive(t))return;this.$('[data-td-retry]').hidden=true;this.phase='reading';this.root.dataset.phase='reading';this.status(this.target+'!');
   const ok=await this.voice(this.target);if(!this.alive(t))return;
   if(!ok){this.phase='audio-error';this.status('Sound could not play. Tap to hear it again.');this.$('[data-td-retry]').hidden=false;return;}
   this.feedback('correct',this.$('.td-toy'));if(this.config.action)await this.config.action(this,this.$('.td-toy'));else await SpeakingPlay.action(this.target,this.$('.td-toy'),a=>this.animations.add(a));if(!this.alive(t))return;
   await this.rewardFlight();if(!this.alive(t))return;this.phase='resolved';this.root.dataset.phase='resolved';this.$('.td-speech').textContent='Thank you!';this.status('Delivered!');this.$('[data-td-next]').hidden=false;this.$('[data-td-next]').disabled=false;this.$('[data-td-next]').focus({preventScroll:true});
  }
  async rewardFlight(){const star=document.createElement('span');star.className='td-earned-star';this.$('.td-fx').appendChild(star);const toy=this.$('.td-destination').getBoundingClientRect(),root=this.$('.td-world').getBoundingClientRect(),slot=this.$('.td-progress span:nth-child('+(this.index+1)+')'),to=slot.getBoundingClientRect();const x=toy.left-root.left+toy.width/2,y=toy.top-root.top;star.style.left=(x-39)+'px';star.style.top=(y-39)+'px';this.sound('star-flight');await this.animate(star,[{transform:'scale(.2)',opacity:0},{transform:'translateY(-45px) scale(1.4)',opacity:1,offset:.3},{transform:`translate(${to.left+to.width/2-root.left-x}px,${to.top+to.height/2-root.top-y}px) rotate(180deg) scale(.35)`,opacity:1}],1050);star.remove();slot.textContent='★';slot.classList.add('done');this.feedback('star',slot);}
  next(){if(this.phase!=='resolved')return;if(++this.index===this.rounds.length)this.complete();else this.render();}
  complete(){this.phase='complete';this.stopVoice();const score=this.mistakes+this.assisted,stars=score===0?3:score<=3?2:1;
   this.root.innerHTML=`<div class="td-result">${sprite('reward')}<h2>${this.config.completeTitle||'All toys delivered!'}</h2><p class="td-result-stars" aria-label="${stars} of 3 stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</p><p>${this.rounds.length} happy deliveries</p>${this.assisted?'<p>You used listening hints.</p>':''}<button type="button" data-td-again>Play again</button><button type="button" data-td-library>Choose activities</button></div>`;this.root.dataset.phase='complete';
   this.$('[data-td-again]').onclick=()=>start(this.config);this.$('[data-td-library]').onclick=()=>LearningApp.go(this.config.back||'#/unit/3/lesson/1?mode=practice');
   this.skin(this.$('[data-td-again]'),'replay','Play again',true);this.skin(this.$('[data-td-library]'),'home','Choose activities',true);this.effect('confetti',this.$('.td-result h2'),{size:300,dy:80,duration:1200});
   document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:this.game,stars}}));this.feedback('complete',this.root);
  }
  dispose(){this.dead=true;this.turn++;this.stopFlight();this.stopSounds();this.stopVoice();this.animations.forEach(a=>a.cancel());this.animations.clear();}
 }
 function start(config={}){warmArt();scene?.dispose();scene=new Delivery(config);}
 games.u3match={enter:()=>start()};GAME_META.u3match=['UNIT 3 · LESSON 1','Toy Delivery','Look · choose · deliver'];
 window.ToyDelivery={current:()=>scene,start};
 document.addEventListener('learning:leave-activity',()=>{scene?.dispose();scene=null;});
 document.addEventListener('toybuddy:enter',()=>{scene?.stopVoice(LearningApp.isMuted());scene?.stopSounds();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){scene?.pause();scene?.stopVoice();scene?.stopSounds();}});
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>scene?.pause());
 addEventListener('resize',()=>{if(scene&&['choose','pilot','paused'].includes(scene.phase))scene.position();});
})();
