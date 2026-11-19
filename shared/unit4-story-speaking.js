(() => {
  'use strict';
  const key = 'u4storyrole';
  const rootPath = 'assets/unit4/lesson6/';
  const art = rootPath + 'your-turn/';
  const rounds = [
    {scene:1, person:'grandpa', reply:'meet-grandpa', marks:[0,.30,.50,.76]},
    {scene:2, person:'mum', reply:'meet-mum', marks:[0,.38,.56,.80]},
    {scene:4, person:'brother', reply:'hello-billy', marks:[0,.34,.54,.80,1.32]}
  ];
  let current;
  const icon = name => `<img src="${art+name}.webp" alt="">`;

  class StorySpeaking {
    constructor() {
      this.index=0;
      this.turn=0;
      this.dead=false;
      this.clipURL=null;
      this.audio=null;
      this.capture=null;
      this.root=null;
      this.leave=()=>this.dispose();
      this.hide=()=>{
        if(document.hidden && !this.dead){
          this.turn++;
          this.capture?.cancel();
          this.capture=null;
          this.stopAudio();
          if(this.phase!=='complete') this.setState('ready','Paused. Listen again or tap Speak when you are ready.');
        }
      };
      this.mute=()=>{
        if(window.LearningApp?.isMuted() && this.phase==='audio'){
          this.stopAudio();
          this.setState('ready','Sound is off. Turn it on in Game controls to listen.');
        }
      };
      document.addEventListener('learning:leave-activity',this.leave);
      document.addEventListener('visibilitychange',this.hide);
      document.addEventListener('toybuddy:enter',this.mute);
      this.render();
    }

    $(selector) {return this.root.querySelector(selector);}
    alive(turn) {return !this.dead && this.turn===turn && currentGame===key;}
    clearRecording() {
      if(this.clipURL) URL.revokeObjectURL(this.clipURL);
      this.clipURL=null;
    }
    stopAudio() {
      cancelAnimationFrame(this.frame);
      this.audio?.pause();
      if(this.audio) this.audio.onended=this.audio.onerror=null;
      this.audio=null;
      this.root?.querySelectorAll('.is-speaking').forEach(word=>word.classList.remove('is-speaking'));
    }

    render() {
      this.turn++;
      this.stopAudio();
      this.capture?.cancel();
      this.capture=null;
      this.clearRecording();
      this.round=rounds[this.index];
      this.accepted=false;
      const sentence=this.round.person==='brother'?'This is my brother, Billy.':'This is my '+this.round.person+'.';
      setStage(`<section class="story-speaking" aria-label="My brother listening and speaking">
        <header><h2>My brother!</h2><b>${this.index+1} / ${rounds.length}</b></header>
        <div class="sspeak-layout">
          <figure class="sspeak-picture" data-picture="${this.round.scene}">
            <img src="${rootPath}clues/scene-${this.round.scene}.webp?v=source-sharp" alt="Story scene ${this.round.scene}">
            <span class="sspeak-person" aria-hidden="true"></span>
          </figure>
          <div class="sspeak-dialogue">
            <p class="sspeak-role">Be the girl introducing her family.</p>
            <h3 tabindex="-1">Listen, then take your turn.</h3>
            <div class="sspeak-line" aria-label="Your line">${sentence.split(' ').map(word=>`<span>${word}</span>`).join(' ')}</div>
            <button class="sspeak-hint" data-say="hint" aria-expanded="${this.index===0}">${this.index===0?'Hide my line':'Show my line'}</button>
            <div class="sspeak-audio">
              <button data-say="scene">${icon('listen')}<span>Hear the story</span></button>
              <button data-say="model">${icon('replay')}<span>Hear my line</span></button>
            </div>
            <button class="sspeak-mic" data-say="speak">${icon('microphone')}<span>Speak</span></button>
            <div class="sspeak-record-actions" hidden>
              <button data-say="done">Done</button><button data-say="cancel">Cancel</button>
            </div>
            <div class="sspeak-feedback" hidden>
              <img class="sspeak-feedback-art" alt=""><p class="sspeak-result" role="status"></p>
              <p class="sspeak-transcript"></p>
            </div>
            <p class="sspeak-status" role="status">Hear the story, then introduce the person.</p>
            <div class="sspeak-bottom">
              <button data-say="recording" hidden>Hear my recording</button>
              <button data-say="reply" hidden>Hear the reply</button>
              <button data-say="next" hidden>${icon('next')}<span>${this.index===2?'Finish':'Continue'}</span></button>
            </div>
          </div>
        </div>
      </section>`);
      this.root=document.querySelector('.story-speaking');
      this.$('.sspeak-line').hidden=this.index>0;
      this.root.onclick=event=>{
        const button=event.target.closest('[data-say]');
        if(button && !button.disabled) this.action(button.dataset.say);
      };
      this.setState('ready');
      restartCurrent=start;
      replayCurrent=()=>{if(this.phase!=='complete')this.listen('model');};
    }

    setState(phase,message) {
      this.phase=phase;
      this.root.dataset.phase=phase;
      const busy=['permission','recording','processing','audio'].includes(phase);
      this.root.querySelectorAll('[data-say]').forEach(button=>button.disabled=busy);
      this.$('.sspeak-record-actions').hidden=!['permission','recording','processing'].includes(phase);
      this.$('[data-say=done]').hidden=phase!=='recording';
      this.$('[data-say=cancel]').disabled=false;
      this.$('[data-say=done]').disabled=false;
      this.$('[data-say=speak]').hidden=busy || this.accepted;
      this.$('[data-say=next]').hidden=!this.accepted;
      this.$('[data-say=reply]').hidden=!this.accepted;
      this.$('[data-say=recording]').hidden=!this.clipURL;
      if(message!==undefined) this.$('.sspeak-status').textContent=message;
      this.$('h3').textContent=phase==='recording'?'Your turn — speak now.':phase==='processing'?'Listening carefully…':this.accepted?'Your conversation continues!':'Listen, then take your turn.';
    }

    action(action) {
      if(action==='scene'||action==='model') return this.listen(action);
      if(action==='speak') return this.record();
      if(action==='done') return this.capture?.stop();
      if(action==='cancel'){
        this.turn++;
        this.capture?.cancel();
        this.capture=null;
        this.setState('ready','Ready when you are.');
      }
      if(action==='recording') return this.playURL(this.clipURL);
      if(action==='reply') return this.playURL(rootPath+'audio/'+this.round.reply+'.mp3');
      if(action==='hint'){
        const line=this.$('.sspeak-line');
        line.hidden=!line.hidden;
        this.$('[data-say=hint]').textContent=line.hidden?'Show my line':'Hide my line';
        this.$('[data-say=hint]').setAttribute('aria-expanded',String(!line.hidden));
      }
      if(action==='next'){
        if(++this.index===rounds.length) this.finish();
        else {this.render();this.$('h3').focus();}
      }
    }

    listen(mode) {
      this.stopAudio();
      if(mode==='model'){
        this.$('.sspeak-line').hidden=false;
        this.$('[data-say=hint]').textContent='Hide my line';
        this.$('[data-say=hint]').setAttribute('aria-expanded','true');
      }
      const storyClip=this.round.scene===4?'scene-3-4':'scene-'+this.round.scene;
      const modelClip=this.round.person;
      this.playURL(rootPath+'audio/'+(mode==='scene'?storyClip:modelClip)+'.mp3',mode==='model',mode==='scene' && this.round.scene===4);
    }

    playURL(url,highlight=false,storyEnding=false) {
      this.stopAudio();
      if(window.LearningApp?.isMuted()){
        this.setState('ready','Sound is off. Turn it on in Game controls to listen.');
        return;
      }
      const turn=this.turn;
      const audio=this.audio=new Audio(url);
      const showScene=number=>{
        const figure=this.$('.sspeak-picture');
        if(figure.dataset.picture!==String(number)){
          figure.dataset.picture=String(number);
          figure.querySelector('img').src=rootPath+'clues/scene-'+number+'.webp?v=source-sharp';
          figure.querySelector('img').alt='Story scene '+number;
        }
      };
      showScene(storyEnding?3:this.round.scene);
      this.setState('audio','Listening…');
      const sample=()=>{
        if(!this.alive(turn)||this.audio!==audio)return;
        if(storyEnding)showScene(audio.currentTime<8.98?3:4);
        if(highlight){
          const wordIndex=this.round.marks.findLastIndex(time=>audio.currentTime>=time);
          this.$('.sspeak-line').querySelectorAll('span').forEach((word,i)=>word.classList.toggle('is-speaking',i===wordIndex&&!audio.paused));
        }
        this.frame=requestAnimationFrame(sample);
      };
      const end=message=>{
        if(!this.alive(turn)||this.audio!==audio)return;
        this.stopAudio();
        showScene(this.round.scene);
        this.setState('ready',message);
      };
      audio.onended=()=>end(this.accepted?'You spoke your line. Continue when you are ready.':'Your turn. Tap Speak and say the whole line.');
      audio.onerror=()=>end('Sound could not play. Tap a listening button to try again.');
      audio.play().then(()=>sample()).catch(()=>end('Sound could not play. Tap a listening button to try again.'));
    }

    feedback(result,transcript) {
      const box=this.$('.sspeak-feedback');
      box.hidden=false;
      box.dataset.result=result;
      this.$('.sspeak-feedback-art').src=art+(result==='correct'?'correct':'retry')+'.webp';
      this.$('.sspeak-result').textContent=result==='correct'?'Your sentence was recognized!':result==='incomplete'?'Say the whole sentence.':result==='wrong'?'Try the person in this picture.':'I could not hear clearly. Try again.';
      this.$('.sspeak-transcript').textContent=transcript?'I heard “'+transcript+'”':'';
    }

    record() {
      if(this.phase!=='ready'||this.accepted)return;
      this.stopAudio();
      window.LearningFeedback?.stopSounds();
      window.LearningClickSound?.stop();
      if(!window.Unit3Speech?.available){
        this.setState('ready','Microphone or speech service is unavailable. Check microphone access and try again.');
        return;
      }
      this.clearRecording();
      const turn=++this.turn;
      this.$('.sspeak-feedback').hidden=true;
      this.setState('permission','Getting the microphone ready…');
      try{
        const capture=window.Unit3Speech.start({
          questionToy:this.round.person,displayedToy:this.round.person,questionType:'family-introduction',
          onStart:()=>{if(this.alive(turn))this.setState('recording','Say the whole line. Tap Done when you finish.');},
          onRecording:blob=>{
            if(!this.alive(turn))return;
            this.clearRecording();
            this.clipURL=URL.createObjectURL(blob);
          },
          onProcessing:()=>{if(this.alive(turn))this.setState('processing','Checking the recognized sentence…');},
          onResult:result=>{
            if(!this.alive(turn))return;
            this.capture=null;
            const checked=ToySpeechEvaluator.evaluate(result.transcript,this.round.person,this.round.person,'family-introduction');
            // The existing service identifies a confident but unsupported
            // sentence separately from an uncertain recognition.
            const recognized=result.result==='CORRECT' ||
              (result.result==='UNCLEAR' && result.reason==='sentence-unrecognized');
            const correct=recognized && checked.result==='CORRECT';
            if(correct){
              this.accepted=true;
              this.feedback('correct',result.transcript);
              this.playURL(rootPath+'audio/'+this.round.reply+'.mp3');
            }else{
              const kind=result.result==='UNCLEAR'?'unclear':checked.result==='INCOMPLETE'?'incomplete':checked.result==='WRONG_LOGIC'?'wrong':'unclear';
              this.feedback(kind,result.transcript);
              this.setState('ready','Listen again or tap Speak to try your line.');
            }
          },
          onError:reason=>{
            if(!this.alive(turn))return;
            this.capture=null;
            const message=reason==='permission-denied'?'Allow microphone access, then tap Speak again.':reason==='no-microphone'?'Connect a microphone and try again.':'The microphone or speech service could not connect. Try again.';
            this.setState('ready',message);
          }
        });
        if(this.alive(turn))this.capture=capture;
        else capture.cancel();
      }catch{
        this.setState('ready','Please try Speak again.');
      }
    }

    finish() {
      this.stopAudio();
      this.clearRecording();
      this.phase='complete';
      this.root.dataset.phase='complete';
      this.root.innerHTML=`<div class="sspeak-complete">${icon('correct')}<h2 tabindex="-1">Your story voices!</h2>
        <p>Three family introductions recognized.</p>
        <button data-complete-again>Play again</button><button data-complete-home>Lesson 6</button></div>`;
      this.$('h2').focus();
      this.$('[data-complete-again]').onclick=start;
      this.$('[data-complete-home]').onclick=()=>LearningApp.go('#/unit/4/lesson/6?mode=practice');
      document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:key,stars:3}}));
    }

    dispose() {
      if(this.dead)return;
      this.dead=true;
      this.turn++;
      this.capture?.cancel();
      this.capture=null;
      this.stopAudio();
      this.clearRecording();
      document.removeEventListener('learning:leave-activity',this.leave);
      document.removeEventListener('visibilitychange',this.hide);
      document.removeEventListener('toybuddy:enter',this.mute);
    }
  }
  function start() {current?.dispose();current=new StorySpeaking();}
  games[key]={enter:start};
  GAME_META[key]=['UNIT 4 · LESSON 6','Your Turn','Listen and speak with the story'];
})();
