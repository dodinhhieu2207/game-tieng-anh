/* Reusable sprite actor. No host engine, microphone, network API or speech synthesis dependency. */
(()=>{
  'use strict';
  const STATES=Object.freeze({IDLE:'IDLE',ASKING:'ASKING',TALKING:'TALKING',LISTENING:'LISTENING',THINKING:'THINKING',SUCCESS:'SUCCESS',CORRECT:'CORRECT',RETRY:'RETRY',CELEBRATE:'CELEBRATE'});
  const POSES={IDLE:'idle',ASKING:'asking',TALKING:'asking',LISTENING:'listening',THINKING:'retry',SUCCESS:'success',CORRECT:'success',RETRY:'retry',CELEBRATE:'success'};
  // SAPI US-English visemes: width, jaw opening, teeth visibility, tongue visibility.
  const MOUTHS={0:[27,0,0,0],1:[29,16,.25,.8],2:[30,23,.2,.8],3:[19,23,0,.6],4:[30,13,.4,.6],5:[22,15,.2,.4],6:[33,9,.7,.3],7:[13,17,0,0],8:[17,23,0,.3],9:[23,21,.2,.5],10:[19,20,.1,.4],11:[28,19,.3,.6],12:[27,15,.2,.3],13:[16,14,.15,.2],14:[26,10,.5,.8],15:[29,5,1,0],16:[21,9,.8,.1],17:[27,7,.5,1],18:[27,3,1,0],19:[26,8,.65,.7],20:[26,12,.4,.5],21:[25,0,0,0]};
  let actorId=0;
  class ToyBuddy {
    static STATES=STATES;
    constructor(root,{assetBase='assets/toy-buddy/',onStateChange=()=>{},onAudioError=()=>{}}={}){
      this.root=root;this.assetBase=assetBase;this.onStateChange=onStateChange;this.onAudioError=onAudioError;
      this.destroyed=false;this.audio=null;this.generation=0;this.timers=new Set();this.state=STATES.IDLE;
      root.classList.add('toy-buddy');
      const clipId='tb-mouth-'+(++actorId);
      root.innerHTML=`<div class="tb-body"><img class="tb-pose" alt="Toy Buddy" draggable="false"><img class="tb-blink" alt="" draggable="false"><span class="tb-mouth-bed"></span><svg class="tb-mouth" viewBox="0 0 48 40" aria-hidden="true"><defs><clipPath id="${clipId}"><path class="tb-mouth-clip"/></clipPath></defs><path class="tb-mouth-opening" fill="#651e19" stroke="#8d3329" stroke-width="2.2" stroke-linejoin="round"/><g clip-path="url(#${clipId})"><path class="tb-teeth" fill="#fff9ed"/><ellipse class="tb-tongue" fill="#ed626a"/></g><path class="tb-lips" fill="none" stroke="#a8402d" stroke-width="2.4" stroke-linecap="round"/></svg></div><div class="tb-stars" aria-hidden="true"><img alt=""><img alt=""><img alt=""></div>`;
      this.pose=root.querySelector('.tb-pose');this.blink=root.querySelector('.tb-blink');this.mouth=root.querySelector('.tb-mouth');
      this.blink.src=assetBase+'blink.png';this.animationFrame=null;this.cues=[];this.drawMouth(MOUTHS[0],0);
      root.querySelectorAll('.tb-stars img').forEach(im=>im.src=assetBase+'sparkle.png');
      Object.values(POSES).forEach(name=>{const im=new Image();im.src=assetBase+name+'.png';});
      this.visibility=()=>{if(document.hidden){this.stopAudio();this.setState(STATES.IDLE);}};
      document.addEventListener('visibilitychange',this.visibility);
      this.setState(STATES.IDLE);this.scheduleBlink();
    }
    later(fn,ms){const id=setTimeout(()=>{this.timers.delete(id);if(!this.destroyed)fn();},ms);this.timers.add(id);return id;}
    setState(state){
      if(this.destroyed)return;
      if(!Object.values(STATES).includes(state))throw new Error('Unknown ToyBuddy state: '+state);
      this.state=state;this.root.dataset.state=state;this.root.classList.remove('tb-blinking');
      this.pose.src=this.assetBase+POSES[state]+'.png';
      this.onStateChange(state);
      this.root.dispatchEvent(new CustomEvent('toybuddy:statechange',{detail:{state}}));
    }
    scheduleBlink(){this.later(()=>{
      if(this.state===STATES.IDLE&&!document.hidden){this.root.classList.add('tb-blinking');this.later(()=>this.root.classList.remove('tb-blinking'),150);}
      this.scheduleBlink();
    },2800+Math.random()*2200);}
    drawMouth([width,opening,teeth,tongue],viseme){
      const cx=24,cy=18,l=cx-width/2,r=cx+width/2,top=cy-opening*.42,bottom=cy+opening*.58;
      const shape=`M ${l} ${top} Q ${cx} ${top-opening*.16} ${r} ${top} C ${r} ${bottom} ${l} ${bottom} ${l} ${top} Z`;
      this.mouth.querySelector('.tb-mouth-opening').setAttribute('d',shape);
      this.mouth.querySelector('.tb-mouth-opening').style.opacity=opening>1?'1':'0';
      this.mouth.querySelector('.tb-mouth-clip').setAttribute('d',shape);
      const t=this.mouth.querySelector('.tb-teeth');t.setAttribute('d',`M ${l-2} ${top-3} H ${r+2} V ${top+4} Q ${cx} ${top+7} ${l-2} ${top+4} Z`);t.style.opacity=String(teeth);
      const tongueEl=this.mouth.querySelector('.tb-tongue');tongueEl.setAttribute('cx',cx);tongueEl.setAttribute('cy',bottom+1);tongueEl.setAttribute('rx',width*.3);tongueEl.setAttribute('ry',Math.max(2,opening*.28));tongueEl.style.opacity=String(tongue);
      const lips=this.mouth.querySelector('.tb-lips');lips.setAttribute('d',`M ${l} ${cy} Q ${cx} ${cy+3} ${r} ${cy}`);lips.style.opacity=opening<=1?'1':'0';
      this.root.dataset.viseme=String(viseme);
    }
    syncMouth(){
      if(!this.audio||this.audio.paused||this.destroyed)return;
      const ms=this.audio.currentTime*1000;let i=0;
      while(i+1<this.cues.length&&this.cues[i+1].ms<=ms)i++;
      const cue=this.cues[i]||{id:0,ms:0},next=this.cues[i+1];
      const from=MOUTHS[cue.id]||MOUTHS[0],to=next?(MOUTHS[next.id]||MOUTHS[0]):from;
      // Brief coarticulation at each boundary, measured against the media clock.
      const blend=next?Math.max(0,Math.min(1,(ms-(next.ms-35))/35)):0;
      this.drawMouth(from.map((v,n)=>v+(to[n]-v)*blend),cue.id);
      this.animationFrame=requestAnimationFrame(()=>this.syncMouth());
    }
    quietMouth(){if(this.animationFrame!==null)cancelAnimationFrame(this.animationFrame);this.animationFrame=null;this.drawMouth(MOUTHS[0],0);}
    stopAudio(){
      if(this.finishAudio){this.finishAudio(false);this.finishAudio=null;}
      ++this.generation;this.root.classList.remove('tb-speaking');this.quietMouth();
      if(this.audio){this.audio.pause();this.audio.removeAttribute('src');this.audio.load();this.audio=null;}
    }
    ask(src,options={}){return this.play(src,{...options,state:STATES.ASKING,endState:STATES.LISTENING});}
    play(src,{cues=[],state=STATES.TALKING,endState=STATES.IDLE,playingState=null}={}){
      if(this.destroyed)return Promise.resolve(false);
      this.stopAudio();this.cues=cues;const generation=this.generation;
      const audio=this.audio=new Audio(src);audio.preload='auto';this.setState(state);
      const result=new Promise(resolve=>{this.finishAudio=resolve;});
      const active=()=>!this.destroyed&&generation===this.generation&&this.audio===audio;
      const speaking=()=>{if(active()){if(playingState)this.setState(playingState);this.root.classList.add('tb-speaking');this.quietMouth();this.syncMouth();}};
      const quiet=()=>{if(active()){this.root.classList.remove('tb-speaking');this.quietMouth();}};
      audio.addEventListener('playing',speaking);
      ['waiting','stalled','pause'].forEach(event=>audio.addEventListener(event,quiet));
      audio.addEventListener('ended',()=>{if(!active())return;quiet();this.audio=null;this.setState(endState);const finish=this.finishAudio;this.finishAudio=null;finish?.(true);});
      let failed=false;
      const failure=error=>{if(!active()||failed)return;failed=true;this.stopAudio();this.setState(STATES.IDLE);this.onAudioError(error);};
      audio.addEventListener('error',()=>failure(audio.error));
      audio.play().catch(failure);
      return result;
    }
    destroy(){
      if(this.destroyed)return;this.stopAudio();this.destroyed=true;
      this.timers.forEach(clearTimeout);this.timers.clear();
      document.removeEventListener('visibilitychange',this.visibility);this.root.classList.remove('tb-speaking','tb-blinking');
    }
  }
  window.ToyBuddy=ToyBuddy;
})();
