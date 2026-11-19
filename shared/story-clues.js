(() => {
  'use strict';
  const key = 'u4storyclues';
  const base = 'assets/unit4/lesson6/';
  const art = base + 'story-clues/';
  const people = [
    {name:'grandpa',scene:1,reply:'meet-grandpa',text:'This is my grandpa.',description:'A white-haired man waves at two schoolgirls from his computer.',marks:[0,.30,.50,.76]},
    {name:'mum',scene:2,reply:'meet-mum',text:'This is my mum.',description:'A woman greets two schoolgirls while other people watch.',marks:[0,.38,.56,.80]},
    {name:'brother',scene:4,reply:'hello-billy',text:'This is my brother, Billy.',description:'Two girls laugh with a boy wearing a hat and scarf.',marks:[0,.34,.54,.80,1.32]}
  ];
  const shuffle = items => {
    const result = [...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  };
  const icon = name => `<img src="${art+name}.webp" alt="" aria-hidden="true">`;
  let current;

  class StoryClues {
    constructor() {
      this.rounds=[...shuffle(people).map(person=>({person,long:false})),...shuffle(people).map(person=>({person,long:true}))];
      this.index=0;
      this.results=[];
      this.dead=false;
      this.epoch=0;
      this.leave=()=>this.dispose();
      this.hide=()=>{if(document.hidden)this.interrupt('Paused. Tap Listen when you are ready.');};
      this.mute=()=>{if(window.LearningApp?.isMuted())this.interrupt('Sound is off. Turn it on in Game controls, then tap Listen.');};
      this.motionChange=()=>this.stopMotion();
      this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
      this.reduced.addEventListener('change',this.motionChange);
      document.addEventListener('learning:leave-activity',this.leave);
      document.addEventListener('visibilitychange',this.hide);
      document.addEventListener('toybuddy:enter',this.mute);
      this.render();
    }
    $(selector){return this.root.querySelector(selector);}
    alive(epoch){return !this.dead && this.epoch===epoch && currentGame===key;}
    stopMotion(){this.motion?.dispose();this.motion=null;}
    stopAudio(){
      ++this.audioToken;
      clearTimeout(this.timeout);
      cancelAnimationFrame(this.frame);
      if(this.audio){
        this.audio.onended=this.audio.onerror=this.audio.onplaying=this.audio.onwaiting=this.audio.onstalled=null;
        this.audio.pause();
        this.audio=null;
      }
      this.sfx?.pause();
      this.sfx=null;
      this.root?.querySelectorAll('.is-speaking').forEach(el=>el.classList.remove('is-speaking'));
    }
    interrupt(message){
      if(this.dead || this.phase==='complete')return;
      const playing=!!this.audio;
      this.stopAudio();this.stopMotion();
      if(!playing)return;
      if(!this.solved)this.heard=false;
      this.canContinue=false;
      this.setState(this.solved?'resolved':'ready',message);
    }
    render(){
      this.epoch++;
      this.audioToken=0;
      this.stopAudio();this.stopMotion();
      this.round=this.rounds[this.index];
      this.heard=false;this.solved=false;this.canContinue=false;
      this.mistakes=0;this.hinted=false;this.replays=0;
      this.tried=new Set();
      const distractors=shuffle(people.filter(p=>p!==this.round.person));
      const options=shuffle([this.round.person,...distractors.slice(0,this.index===0?1:2)]);
      setStage(`<section class="story-clues" aria-label="Story Clues listening game">
        <header class="sc-header"><div><p>UNIT 4 · LESSON 6</p><h2>Story Clues</h2></div><b aria-label="Round ${this.index+1} of 6">${this.index+1} / 6</b></header>
        <div class="sc-chapters" aria-label="Your collected story clues">${Array.from({length:6},(_,i)=>`<span class="${i<this.index?'is-collected':i===this.index?'is-current':''}" aria-label="Clue ${i+1}${i<this.index?' collected':''}">${i<this.index?icon('success-star'):'<span aria-hidden="true">'+(i+1)+'</span>'}</span>`).join('')}</div>
        <div class="sc-board">
          <div class="sc-prompt"><span class="sc-level">${this.round.long?'Listen to the conversation':'Listen for the family word'}</span><h3 tabindex="-1">Which picture matches?</h3>
            <button class="sc-control sc-listen" data-clue-action="listen">${icon('headphones')}<span>Listen</span></button>
          </div>
          <div class="sc-options" data-count="${options.length}">${options.map((person,i)=>`<button class="sc-card" data-person="${person.name}" aria-label="Choose picture ${i+1}. ${person.description}" disabled>
            <span class="sc-photo"><img src="${base}clues/scene-${person.scene}.webp?v=source-sharp" alt="Story picture ${i+1}" draggable="false"></span>
            <span class="sc-picture-label" aria-hidden="true">Picture ${i+1}</span>
            <img class="sc-halo" src="${art}confirmation-halo.webp" alt="" hidden>
            <img class="sc-correct" src="${art}success-star.webp" alt="Correct picture" hidden>
          </button>`).join('')}</div>
          <div class="sc-reveal" hidden><p class="sc-sentence">${this.round.person.text.split(' ').map(word=>`<span>${word}</span>`).join(' ')}</p></div>
          <p class="sc-status" role="status">Tap Listen. Hear the clue, then choose a picture.</p>
          <div class="sc-actions"><button class="sc-control" data-clue-action="hint" hidden>${icon('listen-again')}<span>Show a clue</span></button>
            <button class="sc-control" data-clue-action="next" hidden>${icon('next-arrow')}<span>${this.index===5?'Finish':'Next clue'}</span></button></div>
        </div>
      </section>`);
      this.root=document.querySelector('.story-clues');
      this.root.onclick=e=>{
        const button=e.target.closest('button');
        if(!button || button.disabled)return;
        if(button.dataset.person)this.choose(button);
        else this.action(button.dataset.clueAction);
      };
      this.setState('ready');
      this.motion=window.LearningMotion?.create(this.root);
      this.motion?.run(tl=>tl.fromTo(this.root.querySelectorAll('.sc-card'),{y:12,opacity:0},{y:0,opacity:1,duration:.3,stagger:.07,ease:'power2.out'}));
      restartCurrent=start;
      replayCurrent=()=>{if(this.phase!=='complete')this.listen();};
    }
    setState(phase,message){
      this.phase=phase;this.root.dataset.phase=phase;
      const busy=phase==='listening'||phase==='responding';
      const listen=this.$('[data-clue-action=listen]');
      listen.disabled=busy;
      listen.querySelector('span').textContent=busy?'Listening…':this.solved?'Hear it again':this.heard?'Listen again':'Listen';
      this.root.querySelectorAll('.sc-card').forEach(button=>{
        button.disabled=busy||!this.heard||this.solved||this.tried.has(button.dataset.person);
      });
      this.$('[data-clue-action=hint]').hidden=this.solved||this.mistakes<2||this.hinted;
      this.$('[data-clue-action=hint]').disabled=busy;
      this.$('[data-clue-action=next]').hidden=!this.solved;
      this.$('[data-clue-action=next]').disabled=busy||!this.canContinue;
      if(message!==undefined)this.$('.sc-status').textContent=message;
    }
    action(name){
      if(name==='listen')this.listen();
      if(name==='hint'){
        this.hinted=true;
        this.$(`[data-person="${this.round.person.name}"]`).classList.add('is-hinted');
        this.setState('choosing','Look at the glowing picture. Listen again if you need to.');
      }
      if(name==='next'&&this.canContinue){
        if(++this.index===6)this.finish();
        else{this.render();this.$('h3').focus();}
      }
    }
    listen(){
      if(this.phase==='listening'||this.phase==='responding')return;
      if(this.solved){this.respond();return;}
      if(this.heard)this.replays++;
      this.heard=false;
      this.play(this.round.long?'scene-'+this.round.person.scene:this.round.person.name,{
        purpose:'listening',
        ended:()=>{this.heard=true;this.setState('choosing','Your turn. Choose the picture you heard.');}
      });
    }
    play(clip,{purpose='responding',highlight=false,ended}={}){
      this.stopAudio();
      if(window.LearningApp?.isMuted()){
        this.setState(this.solved?'resolved':'ready','Sound is off. Turn it on in Game controls, then tap Listen.');return;
      }
      const epoch=this.epoch,token=this.audioToken;
      const audio=this.audio=new Audio(base+'audio/'+clip+'.mp3');
      const valid=()=>this.alive(epoch)&&this.audio===audio&&this.audioToken===token;
      const failed=()=>{
        if(!valid())return;
        this.stopAudio();
        if(!this.solved)this.heard=false;
        this.setState(this.solved?'resolved':'ready','The audio could not play. Tap Listen to try again.');
      };
      const watchdog=()=>{clearTimeout(this.timeout);this.timeout=setTimeout(failed,15000);};
      this.setState(purpose,this.solved?'Listen to the story continue.':'Listen carefully…');
      audio.onplaying=()=>{
        if(!valid())return;
        clearTimeout(this.timeout);
        if(highlight){
          cancelAnimationFrame(this.frame);
          const words=[...this.$('.sc-sentence').children];
          const tick=()=>{
            if(!valid())return;
            const active=this.round.person.marks.findLastIndex(mark=>audio.currentTime>=mark);
            words.forEach((word,i)=>word.classList.toggle('is-speaking',i===active&&!audio.paused));
            this.frame=requestAnimationFrame(tick);
          };
          tick();
        }
      };
      audio.onwaiting=audio.onstalled=watchdog;
      audio.onerror=failed;
      audio.onended=()=>{if(valid()){this.stopAudio();ended?.();}};
      watchdog();
      audio.play().catch(failed);
    }
    choose(button){
      if(this.dead||!this.heard||this.solved||this.phase!=='choosing')return;
      if(button.dataset.person!==this.round.person.name){
        this.mistakes++;
        this.tried.add(button.dataset.person);
        button.classList.add('is-tried');
        button.setAttribute('aria-label',button.getAttribute('aria-label')+'. Try another picture.');
        this.setState('choosing','Not this picture. Listen again or try another one.');
        return;
      }
      this.solved=true;
      this.results.push({firstChoice:this.mistakes===0,hinted:this.hinted,replays:this.replays});
      button.classList.add('is-correct');
      button.setAttribute('aria-label','Correct. '+this.round.person.text);
      button.querySelector('.sc-halo').hidden=false;
      button.querySelector('.sc-correct').hidden=false;
      this.$('.sc-reveal').hidden=false;
      this.$('h3').textContent='You found the story!';
      this.root.querySelectorAll('.sc-card').forEach(other=>{if(other!==button)other.classList.add('is-other');});
      this.stopMotion();
      this.motion=window.LearningMotion?.create(this.root);
      this.motion?.run(tl=>{
        tl.fromTo(button.querySelector('.sc-photo'),{scale:1},{scale:1.035,duration:.65,ease:'power2.out'})
          .fromTo(button.querySelector('.sc-correct'),{scale:.75,opacity:0},{scale:1,opacity:1,duration:.35,ease:'back.out(1.2)'},.08)
          .fromTo(button.querySelector('.sc-halo'),{opacity:0},{opacity:1,duration:.6},0);
      });
      this.respond();
    }
    respond(){
      this.canContinue=false;
      this.play(this.round.person.name,{highlight:true,ended:()=>{
        this.play(this.round.person.reply,{ended:()=>{
          this.canContinue=true;
          this.setState('resolved','You found it! Ready for the next clue.');
          this.feedbackSound();
        }});
      }});
    }
    feedbackSound(){
      if(window.LearningApp?.isMuted()||this.dead)return;
      const audio=this.sfx=new Audio('assets/playful-foley/correct.wav');
      audio.learningSfx=true;audio.volume=.3;
      audio.play().catch(()=>{});
    }
    finish(){
      this.stopAudio();this.stopMotion();this.epoch++;
      this.phase='complete';this.root.dataset.phase='complete';
      const independent=this.results.filter(result=>result.firstChoice&&!result.hinted&&result.replays===0).length;
      this.root.innerHTML=`<div class="sc-finish">${icon('success-star')}<h2 tabindex="-1">Your story collection!</h2>
        <p>You matched all six listening clues.</p>
        <div class="sc-album">${people.map(person=>`<figure><img src="${base}clues/scene-${person.scene}.webp?v=source-sharp" alt="${person.name} story"><figcaption>${person.name}</figcaption></figure>`).join('')}</div>
        <p class="sc-result-note">${independent} / 6 matched on the first listen and first choice.</p>
        <div class="sc-next-step"><p>Now introduce the family.</p>
          <button class="sc-control" data-clue-speak><img src="${base}your-turn/microphone.webp" alt=""><span>Your turn to speak</span></button></div>
        <button class="sc-control" data-clue-again>${icon('listen-again')}<span>Play again</span></button>
        <button class="sc-control" data-clue-home>${icon('next-arrow')}<span>Lesson 6</span></button></div>`;
      this.$('h2').focus();
      this.$('[data-clue-speak]').onclick=()=>LearningApp.go('#/unit/4/lesson/6?mode=practice&activity=roleplay-stage');
      this.$('[data-clue-again]').onclick=start;
      this.$('[data-clue-home]').onclick=()=>LearningApp.go('#/unit/4/lesson/6?mode=practice');
      document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:key,stars:3}}));
    }
    dispose(){
      if(this.dead)return;
      this.dead=true;this.epoch++;this.stopAudio();this.stopMotion();
      document.removeEventListener('learning:leave-activity',this.leave);
      document.removeEventListener('visibilitychange',this.hide);
      document.removeEventListener('toybuddy:enter',this.mute);
      this.reduced.removeEventListener('change',this.motionChange);
    }
  }
  function start(){current?.dispose();current=new StoryClues();}
  games[key]={enter:start};
  GAME_META[key]=['UNIT 4 · LESSON 6','Story Clues','Listen and match the story picture'];
})();
