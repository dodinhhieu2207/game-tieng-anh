/* Word practice uses the same capture/provider boundary as sentence practice.
   Temporary recordings, cancellable turns, and explicit teacher evidence only. */
(()=>{
 'use strict';
 const turns=new Set(),shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
 const TOYS=['plane','puppet','robot','balloon','teddy'],GG=['girl','guitar'];
 const picture=w=>GG.includes(w)?'assets/unit3/lesson3/art/'+w+'.webp':'assets/unit3/toys/'+w+'.webp';
 const wordClip=w=>GG.includes(w)?Unit3Lesson3Clips.clips[w]:{src:'assets/unit3/audio/'+w+'.mp3',text:w,cues:[]};
 const cue={src:'assets/unit3/audio/whats_in_box.mp3',text:"What's in the box?",cues:[]};
 const capturePhases=['starting','recording','processing'];
 const sprite=(name,cls='',label='')=>`<span class="sp-sprite ${cls}" data-sp-sprite="${name}" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}></span>`;
 let waveReady;
 function warmWave(){if(!waveReady){const im=new Image();im.src='assets/speaking-play/wave-atlas.png';waveReady=im.decode().then(()=>true,()=>false);}return waveReady;}
 class WordTurn{
  constructor(host,{target,type,prompt,onPhase=()=>{},onSuccess=()=>{},onWrong=()=>{},onUnclear=()=>{},onPlay=null}){
   this.host=host;this.target=target;this.type=type;this.onPhase=onPhase;this.onSuccess=onSuccess;this.onWrong=onWrong;this.onUnclear=onUnclear;this.onPlay=onPlay;this.model=prompt;this.phase='idle';this.epoch=0;this.destroyed=false;
   if(['girl','teddy'].includes(target))warmWave();
   host.innerHTML=ToyVoiceUI.html({support:type==='gg-letter-name'?'Say the letter name.':type==='gg-word'?'Say the word.':'Say the toy name.',idPrefix:'word',adapter:Unit3Speech.available})+'<p class="sp-status" role="status" aria-live="polite"></p><button type="button" class="sp-replay" data-word-replay>Listen again</button>';
   host.querySelector('#wordTeacher').remove();host.querySelector('[data-teacher]').remove();
   host.querySelector('.toy-voice-note').textContent='Tap the microphone. Say one word. Tap Done.';
   this.status=host.querySelector('.sp-status');this.mic=host.querySelector('#wordMic');this.replay=host.querySelector('[data-word-replay]');
   this.mic.querySelector('svg').style.display='none';this.mic.insertAdjacentHTML('afterbegin',sprite('mic','sp-mic-mark'));
   this.mic.onclick=()=>this.phase==='idle'?this.prompt():this.phase==='recording'?this.recognition?.stop():this.listen();this.replay.onclick=()=>this.prompt();
   this.hide=()=>{if(document.hidden&&!this.destroyed){this.cancel();this.state('idle','Tap Listen again when you are ready.');}};document.addEventListener('visibilitychange',this.hide);turns.add(this);
   this.state('idle','Listen first, then speak.');
  }
  alive(t){return !this.destroyed&&this.host.isConnected&&t===this.epoch;}
  state(phase,text){this.phase=phase;this.host.dataset.phase=phase;ToyVoiceUI.update(this.host,{phase});this.mic.disabled=!['idle','listening','recording'].includes(phase);if(phase==='idle'){this.host.querySelector('[data-voice-title]').textContent='Listen first';this.host.querySelector('[data-voice-label]').textContent='Listen to the model';this.mic.setAttribute('aria-label','Listen to the model');}this.replay.disabled=['asking','checking','complete',...capturePhases].includes(phase);if(text)this.status.textContent=text;this.onPhase(phase);}
  async prompt(){if(this.destroyed||!['idle','listening','resolved'].includes(this.phase))return;const resolved=this.phase==='resolved';this.review?.destroy();this.review=null;const t=++this.epoch;this.state('asking','Listen to the model.');const ok=await this.onPlay?.(this.model);if(this.alive(t))this.state(resolved?'resolved':ok===false?'idle':'listening',resolved?'Great speaking! Tap Next.':ok===false?'Audio could not play. Tap Listen again.':'Your turn. Say one word.');}
  reviewLast(result={}){
   this.review?.destroy();const t=this.epoch;
   this.review=SpeakingReview.mount(this.host,{audio:this.audio,transcript:result.transcript,reason:result.reason?'Recognition needs review. No mistake recorded.':'Listen again, then tap the microphone to retry.',confirmLabel:'I heard the correct word',onConfirm:()=>{if(this.alive(t)&&this.phase==='listening')this.accept(true);}});
  }
  listen(){
   if(this.destroyed||this.phase!=='listening')return;
   if(!Unit3Speech.available){this.reviewLast({reason:'microphone-unavailable'});this.review.panel.open=true;this.status.textContent='Allow microphone access, then tap the microphone again.';return;}
   this.review?.destroy();this.review=null;this.audio=null;cancelVoice();LearningFeedback?.stopSounds();LearningClickSound?.stop();const t=++this.epoch;
   this.state('starting','Getting your microphone ready…');
   try{const h=Unit3Speech.start({questionToy:this.target,displayedToy:this.target,questionType:this.type,
    onStart:()=>{if(this.alive(t))this.state('recording','Listening… Tap Done when you finish.');},
    onRecording:audio=>{if(this.alive(t))this.audio=audio;},
    onProcessing:()=>{if(this.alive(t))this.state('processing','Checking your word…');},
    onResult:r=>{if(!this.alive(t)||this.phase!=='processing')return;this.recognition=null;this.state('listening');this.host.querySelector('#wordHeard').textContent=r.transcript?'Heard: '+r.transcript:'No clear transcript';
     if(r.result==='CORRECT'){this.accept(false);return;}
     this.reviewLast(r);if(r.result==='WRONG_LOGIC'){this.onWrong();this.status.textContent='Try another word. Listen again if you need help.';}
     else{this.onUnclear();this.status.textContent='Let’s try together. Your points stay the same.';}
    },
    onError:reason=>{if(!this.alive(t))return;this.recognition=null;this.onUnclear();this.state('listening','The microphone needs checking. Your points stay the same.');this.reviewLast({reason});}
   });if(this.alive(t)&&capturePhases.includes(this.phase))this.recognition=h;else h?.cancel();
   }catch{this.onUnclear();this.state('listening','Let’s check the microphone together. Your points stay the same.');this.reviewLast({reason:'capture-error'});}
  }
  async accept(teacher){if(this.destroyed||this.phase!=='listening')return;this.review?.destroy();this.review=null;this.state('checking','Well done!');const t=this.epoch;const ok=await this.onSuccess({teacher});if(this.alive(t))this.state(ok===false?'idle':'resolved',ok===false?'Audio could not play. Tap Listen again.':'Great speaking! Tap Next.');}
  cancel(){this.epoch++;this.recognition?.cancel();this.recognition=null;this.review?.destroy();this.review=null;this.audio=null;}
  destroy(){if(this.destroyed)return;this.cancel();this.destroyed=true;document.removeEventListener('visibilitychange',this.hide);this.mic.onclick=null;this.replay.onclick=null;turns.delete(this);}
 }
 let scene=null;
 class PlayScene{
  constructor({game,lesson,mystery=false}){
   this.game=game;this.lesson=lesson;this.mystery=mystery;this.words=lesson===3?GG:TOYS;this.rounds=lesson===3?[...shuffle(GG),...shuffle(GG)]:shuffle(TOYS);this.index=0;this.errors=0;this.aiConfirmed=0;this.teacherConfirmed=0;this.recognitionReviews=0;this.roundStars=[];this.epoch=0;this.destroyed=false;
   cancelVoice();document.dispatchEvent(new Event('toybuddy:enter'));els.gameStage.classList.add('u3-stage');els.gameScreen.classList.add('u3-on');
   els.gameStage.style.setProperty('--u3-bg',`url(assets/speaking-play/${mystery?'mystery-garden':'say-stage'}.png)`);
   setStage(`<section class="unit3-toytown sp-scene" aria-label="${mystery?'Mystery Box':'Say & Play'}"><header class="sp-head"><h2>${mystery?'Mystery Box':'Say & Play'}</h2><span data-sp-progress></span></header><div class="sp-workspace"><aside class="sp-friend"><p data-sp-bubble></p><div data-sp-actor></div></aside><main><p class="sp-task">${mystery?'Look at the clue. Say what is inside.':'Listen. Say it. Make it move!'}</p><div class="sp-stage" data-sp-stage></div><div class="sp-choices" data-sp-choices></div><div data-sp-turn></div></main></div><footer><button type="button" data-sp-next disabled>Next</button></footer><div data-sp-result hidden></div></section>`);
   this.root=els.gameStage.querySelector('.sp-scene');this.root.dataset.assetPack=mystery?'mystery':'say';this.$=s=>this.root.querySelector(s);this.actor=new ToyBuddy(this.$('[data-sp-actor]'));this.$('[data-sp-next]').onclick=()=>this.next();
   this.hide=()=>{if(document.hidden){this.epoch++;this.actor.stopAudio();this.action?.cancel();}};document.addEventListener('visibilitychange',this.hide);
   this.mute=()=>{if(LearningApp.isMuted()){this.action?.cancel();this.actor.audio?.dispatchEvent(new Event('ended'));}};document.addEventListener('toybuddy:enter',this.mute);
   restartCurrent=()=>enter({game,lesson,mystery});replayCurrent=()=>this.turn?.prompt();this.render();
  }
  alive(t){return !this.destroyed&&this.root.isConnected&&t===this.epoch;}
  async play(c){if(!c)return false;if(LearningApp.isMuted())return true;this.$('[data-sp-bubble]').textContent=c.text;return this.actor.play(c.src,{cues:c.cues,state:'TALKING',endState:'LISTENING'});}
  render(){
   this.$('footer').append(this.$('[data-sp-next]'));
   this.epoch++;this.turn?.destroy();this.actor.stopAudio();this.guesses=0;this.wrong=false;this.target=this.rounds[this.index];this.phase='idle';this.root.dataset.revealed='false';this.$('[data-sp-next]').disabled=true;this.$('[data-sp-progress]').textContent=`${this.index+1} / ${this.rounds.length}`;
   const w=this.target;this.$('[data-sp-stage]').innerHTML=this.mystery?`${sprite('closed','sp-chest','Closed mystery box')}<img class="sp-clue" src="${picture(w)}" alt="Mystery shape"><span class="sp-question" aria-hidden="true">?</span>`:`${sprite('podium','sp-podium')}<img class="sp-object" src="${picture(w)}" alt="${w}">`;
   const choices=this.mystery?shuffle([w,shuffle(this.words.filter(x=>x!==w))[0]]):[];this.$('[data-sp-choices]').innerHTML=choices.map(x=>`<button type="button" data-sp-model="${x}" aria-label="Hear ${x}"><img src="${picture(x)}" alt=""><span>${x}</span></button>`).join('');
   this.root.querySelectorAll('[data-sp-model]').forEach(b=>b.onclick=async()=>{if(this.phase!=='listening')return;this.turn.state('asking','Listen to the word.');const t=this.epoch,ok=await this.play(wordClip(b.dataset.spModel));if(this.alive(t))this.turn.state(ok?'listening':'idle');});
   this.turn=new WordTurn(this.$('[data-sp-turn]'),{target:w,type:this.lesson===3?'gg-word':'toy-word',prompt:this.mystery?cue:wordClip(w),onPlay:c=>this.play(c),onPhase:p=>{this.phase=p;this.root.dataset.phase=p;this.$('[data-sp-next]').disabled=p!=='resolved';this.root.querySelectorAll('[data-sp-model]').forEach(b=>b.disabled=p!=='listening');},onWrong:()=>{this.guesses++;this.errors++;this.wrong=true;},onUnclear:()=>this.recognitionReviews++,onSuccess:r=>this.success(r)});this.turn.replay.after(this.$('[data-sp-next]'));this.turn.prompt();
  }
  async success({teacher}){
   const t=this.epoch;
   if(!await this.play(wordClip(this.target))||!this.alive(t))return false;
   this.guesses++;teacher?this.teacherConfirmed++:this.aiConfirmed++;
   this.root.dataset.revealed='true';this.$('[data-sp-stage]').innerHTML=`${this.mystery?sprite('open','sp-chest','Open mystery box'):sprite('podium','sp-podium')}<img class="sp-object" src="${picture(this.target)}" alt="${this.target}">${sprite('reward','sp-round-reward')}<span class="sp-round-stars" aria-label="Reward">${'★'.repeat(this.guesses===1?3:this.guesses<=3?2:1)}</span>`;
   const target=this.$('.sp-object');await action(this.target,target,a=>this.action=a);if(!this.alive(t))return;
   this.roundStars.push(this.guesses===1?3:this.guesses<=3?2:1);LearningFeedback.play('correct',target);this.actor.setState('CELEBRATE');
  }
  next(){if(this.phase!=='resolved')return;if(++this.index>=this.rounds.length)this.complete();else this.render();}
  complete(){this.turn.destroy();this.phase='complete';this.root.dataset.phase='complete';this.$('[data-sp-next]').disabled=true;const stars=Math.max(1,Math.round(this.roundStars.reduce((a,b)=>a+b,0)/this.roundStars.length));
   const ctx=LearningApp.context();LearningProgress.speakingReview(`3/${this.lesson}/${ctx.activity.id}`,{aiConfirmed:this.aiConfirmed,teacherConfirmed:this.teacherConfirmed,recognitionReviews:this.recognitionReviews});
   document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:this.game,stars}}));
   const result=this.$('[data-sp-result]');result.hidden=false;result.innerHTML=`<div class="sp-result"><img src="assets/unit3/ui/trophy.webp" alt=""><h2>Lovely speaking!</h2><p class="sp-stars">${'★'.repeat(stars)}</p><p>${this.aiConfirmed} speaking turns completed</p><button type="button" data-sp-again>Play again</button><button type="button" data-sp-activities>Choose activities</button></div>`;result.querySelector('[data-sp-again]').onclick=()=>enter({game:this.game,lesson:this.lesson,mystery:this.mystery});result.querySelector('[data-sp-activities]').onclick=()=>LearningApp.go(`#/unit/3/lesson/${this.lesson}?mode=${ctx.mode}`);LearningFeedback.play('complete',result);
  }
  dispose(){if(this.destroyed)return;this.destroyed=true;this.epoch++;this.turn?.destroy();this.actor.destroy();this.action?.cancel();document.removeEventListener('visibilitychange',this.hide);document.removeEventListener('toybuddy:enter',this.mute);if(scene===this)scene=null;}
 }
 async function action(word,target,track=()=>{}){
  if(word==='guitar'&&!LearningApp.isMuted()&&els.soundFx.checked){const a=new Audio('assets/feedback/guitar-strum.wav');a.learningSfx=true;a.volume=.35;track({cancel:()=>{a.pause();a.dispatchEvent(new Event('ended'));}});await new Promise(r=>{a.onended=r;a.onerror=r;a.play().catch(r);});}
  if(!target.isConnected||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(['girl','teddy'].includes(word)){
   if(!await warmWave()||!target.isConnected)return;
   const wave=document.createElement('span'),y=word==='girl'?'0%':'100%';wave.className='sp-wave-picture';wave.dataset.wave=word;wave.setAttribute('role','img');wave.setAttribute('aria-label',word+' waving');
   wave.style.cssText=`width:${target.clientWidth}px;height:${target.clientHeight}px;left:${target.offsetLeft}px;top:${target.offsetTop}px;background-position:0% ${y}`;target.after(wave);const visibility=target.style.visibility;target.style.visibility='hidden';
   const a=wave.animate(['0%','33.333%','66.666%','33.333%','66.666%','100%'].map(x=>({backgroundPosition:x+' '+y})),{duration:1200,easing:'steps(1,end)'});track(a);
   try{await a.finished.catch(()=>{});}finally{wave.remove();target.style.visibility=visibility;}return;
  }
  const frames=word==='plane'?[{transform:'translate(0,0) rotate(0)'},{transform:'translate(70px,-35px) rotate(-12deg)'},{transform:'translate(-55px,-15px) rotate(10deg)'},{transform:'translate(0,0) rotate(0)'}]:word==='balloon'?[{transform:'translateY(0)'},{transform:'translateY(-65px)'},{transform:'translateY(0)'}]:word==='robot'?[{transform:'rotate(0)'},{transform:'rotate(-14deg) translateY(-10px)'},{transform:'rotate(14deg) translateY(-10px)'},{transform:'rotate(0)'}]:[{transform:'rotate(0)'},{transform:'rotate(-8deg) scale(1.05)'},{transform:'rotate(8deg) scale(1.05)'},{transform:'rotate(0)'}];
  const a=target.animate(frames,{duration:950,easing:'ease-in-out'});track(a);await a.finished.catch(()=>{});
 }
 function enter(config){scene?.dispose();scene=new PlayScene(config);}
 window.SpeakingPlay={WordTurn,action,sprite,current:()=>scene,get recording(){return [...turns].some(t=>capturePhases.includes(t.phase));}};
 games.u3learn={enter:()=>enter({game:'u3learn',lesson:1})};games.u3mystery={enter:()=>enter({game:'u3mystery',lesson:1,mystery:true})};games.u3ggfinal={enter:()=>enter({game:'u3ggfinal',lesson:3,mystery:true})};
 GAME_META.u3learn=['UNIT 3 · LESSON 1','Say & Play','Listen · say · play'];GAME_META.u3mystery=['UNIT 3 · LESSON 1','Mystery Box','Look · say · discover'];GAME_META.u3ggfinal=['UNIT 3 · LESSON 3','Mystery Box: girl & guitar','Look · say · discover'];
 document.addEventListener('learning:leave-activity',()=>{scene?.dispose();for(const t of [...turns])t.destroy();});
})();
