/* Unit 5 Lesson 1. Phaser scene feedback + authored GIF actors + native controls.
   The app remains owner of routes/progress; Unit3Speech owns recording/transport. */
(()=>{
 'use strict';
 const BASE='assets/unit5/lesson1/';
 const WORDS=['happy','sad','hungry','thirsty','hot','cold'];
 const PRONOUN={happy:'he',sad:'he',hungry:'she',thirsty:'she',hot:'he',cold:'she'};
 const PROPS={hungry:'sandwich',thirsty:'water',hot:'fan',cold:'blanket'};
 const DEFINITIONS={
  house:{key:'u5feelingshouse',route:'feelings-house',title:'The Feelings House',subtitle:'Tap, listen and discover.',world:'house'},
  camera:{key:'u5feelingscamera',route:'feelings-camera',title:'Feelings Camera',subtitle:'Listen. Find the person. Take a photo.',world:'camera'},
  helping:{key:'u5helpinghands',route:'helping-hands',title:'Helping Hands',subtitle:'Listen, then help the child.',world:'helping'},
  workshop:{key:'u5feelingsworkshop',route:'feelings-workshop',title:'Feelings Photo Workshop',subtitle:'Give each photo its word.',world:'workshop'},
  reporter:{key:'u5littlereporter',route:'little-reporter',title:'Little Reporter',subtitle:'Look at the picture. Say the whole sentence.',world:'reporter'}
 };
 const previousOrders=new Map();let current,phaserPromise;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 function orderFor(mode){let a=mode==='helping'?[...shuffle(Object.keys(PROPS)),...shuffle(Object.keys(PROPS))]:mode==='house'?[...WORDS]:shuffle(WORDS);if(a.join()===previousOrders.get(mode)&&mode!=='house')a.push(a.shift());previousOrders.set(mode,a.join());return a;}
 const icon=name=>`<img src="${BASE}ui/v3/icons/${name}.svg" alt="">`;
 const button=(action,label,img='play',extra='')=>`<button type="button" class="u5-btn" data-u5-action="${action}" ${extra}>${icon(img)}<span>${label}</span></button>`;
 const actor=(word,options={})=>`<button type="button" class="u5-actor ${options.className||''}" data-u5-actor="${word}" ${options.slot!==undefined?`data-u5-person="${options.slot}"`:''} ${options.drop?'data-u5-drop="actor"':''} aria-label="${escape(options.label||'Explore '+word)}"><img src="${BASE}actors/${word}/idle.webp" alt="" draggable="false"></button>`;
 function loadPhaser(){
  if(window.Phaser)return Promise.resolve(window.Phaser);
  if(phaserPromise)return phaserPromise;
  phaserPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');const fail=()=>{clearTimeout(timer);script.remove();phaserPromise=null;reject(Error('renderer'));};const timer=setTimeout(fail,18000);script.src='shared/vendor/phaser/phaser.min.js';script.onload=()=>{clearTimeout(timer);if(window.Phaser)resolve(window.Phaser);else fail();};script.onerror=fail;document.head.appendChild(script);});
  return phaserPromise;
 }

 class FeelingsScene{
  constructor(owner,Phaser){
   this.owner=owner;this.scene=null;this.dead=false;this.pending=new Set();
   const self=this;
   this.ready=new Promise((resolve,reject)=>{
    this.game=new Phaser.Game({type:Phaser.CANVAS,parent:owner.$('.u5-phaser'),width:Math.max(1,owner.stage.clientWidth),height:Math.max(1,owner.stage.clientHeight),transparent:true,banner:false,audio:{noAudio:true},render:{antialias:true},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},fps:{target:60},scene:{
     preload(){this.load.on('loaderror',()=>reject(Error('scene-asset')));for(const name of [...Object.values(PROPS),'camera','reward-star'])this.load.image('u5-'+name,BASE+'props/'+name+'.webp');},
     create(){self.scene=this;resolve();},
    }});
   });
   this.resize=new ResizeObserver(()=>{if(!self.dead&&owner.stage.isConnected&&owner.stage.clientWidth>0&&owner.stage.clientHeight>0){this.game.scale.resize(owner.stage.clientWidth,owner.stage.clientHeight);owner.repositionSuccess();}});this.resize.observe(owner.stage);
  }
  rect(element){const s=this.owner.stage.getBoundingClientRect(),r=element.getBoundingClientRect();return {x:r.left-s.left,y:r.top-s.top,w:r.width,h:r.height,cx:r.left-s.left+r.width/2,cy:r.top-s.top+r.height/2};}
  clear(){for(const resolve of this.pending)resolve();this.pending.clear();if(!this.scene)return;this.scene.tweens.killAll();this.scene.time.removeAllEvents();this.scene.children.removeAll(true);}
  resume(){if(!this.dead)this.game.resume();}
  pause(){if(!this.dead){this.clear();this.game.pause();}}
  ring(x,y){
   if(!this.scene||this.dead)return;
   const s=this.scene;const g=s.add.graphics().lineStyle(5,0xf0c461,1).strokeCircle(0,0,27);g.setPosition(x,y);
   if(this.owner.reduced.matches){s.time.delayedCall(250,()=>g.destroy());return;}
   s.tweens.add({targets:g,scaleX:2,scaleY:2,alpha:0,duration:550,ease:'Sine.Out',onComplete:()=>g.destroy()});
  }
  focusBounds(element){
   const r=this.rect(element),im=element.querySelector('img'),canvas=window.Unit5Feedback?.canvas||[400,520];
   const scale=Math.min(r.w/canvas[0],r.h/canvas[1]),left=r.x+(r.w-canvas[0]*scale)/2,top=r.y+(r.h-canvas[1]*scale)/2;
   const box=window.Unit5Feedback?.bounds?.[element.dataset.u5Actor]||[80,20,320,510];
   return {x:left+box[0]*scale,y:top+box[1]*scale,w:(box[2]-box[0])*scale,h:(box[3]-box[1])*scale,element:r};
  }
  sparkle(element){
   if(!this.scene||this.dead||this.owner.reduced.matches)return;this.resume();const r=this.rect(element),s=this.scene;
   for(let i=0;i<4;i++){const a=(i*90+45)*Math.PI/180,star=s.add.image(r.cx,r.cy,'u5-reward-star').setDisplaySize(12,12).setAlpha(.8);
    s.tweens.add({targets:star,x:r.cx+Math.cos(a)*32,y:r.cy+Math.sin(a)*23,scaleX:star.scaleX*.6,scaleY:star.scaleY*.6,alpha:0,duration:380,ease:'Sine.Out',onComplete:()=>star.destroy()});}
  }
  capture(element){
   if(!this.scene||this.dead||this.owner.reduced.matches)return;this.resume();const s=this.scene,b=this.focusBounds(element),pad=9,length=Math.min(25,b.w*.18),g=s.add.graphics();
   g.lineStyle(2.5,0xffd66a,.94);g.beginPath();
   for(const [x,y,dx,dy] of [[b.x-pad,b.y-pad,1,1],[b.x+b.w+pad,b.y-pad,-1,1],[b.x-pad,b.y+b.h+pad,1,-1],[b.x+b.w+pad,b.y+b.h+pad,-1,-1]]){g.moveTo(x+dx*length,y);g.lineTo(x,y);g.lineTo(x,y+dy*length)}
   g.strokePath();s.tweens.add({targets:g,alpha:0,delay:160,duration:650,ease:'Sine.InOut',onComplete:()=>g.destroy()});
   for(const [x,y] of [[b.x-5,b.y+8],[b.x+b.w+5,b.y+20],[b.x-3,b.y+b.h-12]]){const light=s.add.graphics().fillStyle(0xffdc82,.8).fillCircle(0,0,3).setPosition(x,y);s.tweens.add({targets:light,y:y-19,alpha:0,delay:70,duration:500,ease:'Sine.Out',onComplete:()=>light.destroy()});}
  }
  deliver(prop,from,to){
   if(!this.scene||this.dead)return Promise.resolve();this.resume();const a=this.rect(from),b=this.rect(to),s=this.scene;
   const texture=s.textures.get('u5-'+prop).getSourceImage();const sprite=s.add.image(a.cx,a.cy,'u5-'+prop).setScale(Math.min(78/texture.width,78/texture.height));
   const end={x:b.x+b.w*.63,y:b.y+b.h*.57};
   return new Promise(resolve=>{const done=()=>{this.pending.delete(done);resolve();};this.pending.add(done);if(this.owner.reduced.matches){sprite.setPosition(end.x,end.y);s.time.delayedCall(180,()=>{sprite.destroy();done();});return;}
    s.tweens.add({targets:sprite,x:end.x,y:end.y,angle:-8,duration:700,ease:'Cubic.InOut',onComplete:()=>{this.ring(end.x,end.y);s.tweens.add({targets:sprite,alpha:0,duration:250,delay:300,onComplete:()=>{sprite.destroy();done();}});}});
   });
  }
  dispose(){if(this.dead)return;this.dead=true;this.resize.disconnect();this.clear();this.game.destroy(true);}
 }

 class FeelingsGame{
  constructor(mode,profile){
   this.profile=(profile||new URLSearchParams(location.hash.split('?')[1]||'').get('support'))==='practice'?'practice':'learn';this.learn=this.profile==='learn';this.pairIndex=0;
   this.learning=this.learn&&['camera','helping','workshop'].includes(mode)?new Unit5Learning.Path(mode==='helping'):null;
   this.mode=mode;this.def=DEFINITIONS[mode];this.order=this.learning?[this.learning.target]:this.learn?[...WORDS]:orderFor(mode);this.index=0;this.errors=0;this.roundErrors=0;this.visited=new Set();this.collected=[];this.results=[];this.dead=false;this.epoch=0;this.audioToken=0;this.timers=new Set();this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.loaded=false;this.awarded=false;this.capture=null;this.clipURL=null;this.selected=null;this.showModel=false;this.motionWords=new Map();this.motionBlobs={};
   this.mount();
   this.leave=()=>this.dispose();this.hide=()=>{if(document.hidden)this.suspend('Paused. Listen again when you are ready.');};this.mute=()=>{if(window.LearningApp?.isMuted())this.suspend('Sound is off. Turn it on in Game controls, then listen again.');};this.motionChange=()=>{this.stopMotion();this.scene?.clear();};
   document.addEventListener('learning:leave-activity',this.leave);document.addEventListener('visibilitychange',this.hide);document.addEventListener('toybuddy:enter',this.mute);this.reduced.addEventListener('change',this.motionChange);
   restartCurrent=()=>start(mode,this.profile);replayCurrent=()=>this.cue();
   this.boot();
  }
  $(s){return this.root.querySelector(s);}
  alive(e=this.epoch){return !this.dead&&this.epoch===e&&this.root.isConnected;}
  get word(){return this.order[this.index];}
  get sentenceKey(){return `sentences/${PRONOUN[this.word]}-${this.word}`;}
  later(fn,ms){const id=setTimeout(()=>{this.timers.delete(id);if(!this.dead)fn();},ms);this.timers.add(id);return id;}
  status(text){const node=this.$('.u5-status');if(!node)return;node.textContent=text;node.dataset.tone=this.phase==='resolved'?'success':this.phase==='error'?'error':['recording','processing','audio'].includes(this.phase)?this.phase:'guide';}
  setPhase(phase,text){this.phase=phase;this.root.dataset.phase=phase;if(text)this.status(text);this.updateControls();}
  mount(){
   setStage(`<section class="u5-game" data-mode="${this.mode}" data-phase="loading"><header class="u5-top"><h2 class="u5-sr-only">${this.def.title}</h2><div class="u5-task-copy">${icon(this.mode==='house'?'home':this.mode==='camera'?'camera':this.mode==='reporter'?'microphone':this.mode==='workshop'?'photo':'help')}<p>${this.learn&&this.mode==='reporter'?'Listen. Practise together. Speak when ready.':this.def.subtitle}</p></div><div class="u5-progress"><span class="u5-count" aria-label="Progress">0 / ${this.order.length}</span><progress class="u5-progress-bar" max="${this.order.length}" value="0" aria-label="Completed pictures"></progress></div></header>
    <details class="u5-learning-bar"><summary><span>${this.learn?'Learn together':'Practice'}</span><span class="u5-pair-label"></span></summary><div class="u5-support-actions"><div role="group" aria-label="Activity approach">${button('profile-learn','Learn together','help',`aria-pressed="${this.learn}"`)}${button('profile-practice','Practice','play',`aria-pressed="${!this.learn}"`)}</div>${this.learn?button('pause-learning','Finish for now','done'):''}</div></details>
    <div class="u5-stage" style="background-image:url('${BASE}backgrounds/v3/${this.def.world}.webp')"><div class="u5-phaser" aria-hidden="true"></div><div class="u5-world"></div><div class="u5-ready-overlay"><p>Getting the room ready…</p></div></div>
    <div class="u5-controls"></div><p class="u5-status" role="status" aria-live="polite"></p><div class="u5-extras"></div><div class="u5-extension"></div><div class="u5-album" aria-label="Collected photos"></div></section>`);
   this.root=document.querySelector('.u5-game');this.root.dataset.support=this.profile;this.stage=this.$('.u5-stage');
   this.root.onclick=e=>this.click(e);this.root.onpointerdown=e=>this.pointerDown(e);
   this.pointerMove=e=>this.dragMove(e);this.pointerUp=e=>this.dragEnd(e);this.pointerCancel=()=>this.clearDrag();
   window.addEventListener('pointermove',this.pointerMove,{passive:false});window.addEventListener('pointerup',this.pointerUp);window.addEventListener('pointercancel',this.pointerCancel);
  }
  async boot(){
   const e=this.epoch,controller=this.bootAbort=new AbortController();const bootTimeout=setTimeout(()=>controller.abort(),18000);
   try{
    const backdrop=async()=>{const response=await fetch(BASE+`backgrounds/v3/${this.def.world}.webp`,{signal:controller.signal});if(!response.ok)throw Error('background-asset');const url=URL.createObjectURL(await response.blob());try{const im=new Image();im.src=url;await im.decode();}finally{URL.revokeObjectURL(url);}};
    const motions=[...WORDS.map(w=>({word:w,key:w,file:w+'-once.gif'})),...(this.mode==='helping'?Object.keys(PROPS).map(w=>({word:w,key:w+'-help',file:'reaction.gif'})):[])];
    const reward=async()=>{const r=await fetch(BASE+'effects/feedback-v1/success.gif',{signal:controller.signal});if(!r.ok)throw Error('feedback-asset');this.successBlob=await r.blob();};
    const [P]=await Promise.all([loadPhaser(),reward(),backdrop(),Promise.all([document.fonts.load('700 24px "App Outfit"'),document.fonts.load('600 24px "Game Nunito"')]),...motions.map(async item=>{const response=await fetch(BASE+`actors/${item.word}/${item.file}`,{signal:controller.signal});if(!response.ok)throw Error('motion-asset');const blob=await response.blob();const url=URL.createObjectURL(blob);try{await new Promise((resolve,reject)=>{const im=new Image();im.onload=resolve;im.onerror=reject;im.src=url;});this.motionBlobs[item.key]=blob;}finally{URL.revokeObjectURL(url);}})]);
    if(!this.alive(e))return;this.scene=new FeelingsScene(this,P);await Promise.race([this.scene.ready,new Promise((_,reject)=>controller.signal.addEventListener('abort',()=>reject(Error('scene-timeout')),{once:true}))]);if(!this.alive(e))return;
    this.loaded=true;this.$('.u5-ready-overlay').hidden=true;this.renderRound();
   }catch(error){if(!this.alive(e))return;this.scene?.dispose();this.scene=null;this.setPhase('error','Some game pictures could not load. Please try again.');this.$('.u5-ready-overlay').innerHTML=`<p>The room could not load.</p>${button('retry-load','Try again','replay')}`;}finally{clearTimeout(bootTimeout);controller.abort();if(this.bootAbort===controller)this.bootAbort=null;}
  }
  sentenceHTML(word=this.word){return `<span>${PRONOUN[word]==='he'?'He’s':'She’s'}</span><span>${word}.</span>`;}
  labelHTML(revealed=true){return `<div class="u5-scene-label"><div class="u5-sentence" ${revealed?'':'hidden'}>${this.sentenceHTML()}</div><div class="u5-cue" ${revealed?'hidden':''}>Listen to the clue.</div></div>`;}
  renderRound(){
   this.epoch++;this.stopAudio();this.stopMotion();this.stopSuccess();this.clearRecording();this.clearDrag();this.scene?.clear();this.scene?.resume();this.heard=false;this.solved=false;this.canContinue=false;this.selected=null;this.building=false;this.roundErrors=0;this.roundHinted=!!this.pendingAssistance||(this.learn&&this.mode==='reporter');this.pendingAssistance=false;this.learningRecorded=false;this.isTeaching=false;this.modelHeard=false;this.showModel=this.learn||this.mode!=='reporter'||this.index<2;
   const word=this.word;const world=this.$('.u5-world');this.$('.u5-extras').innerHTML='';this.$('.u5-extension').innerHTML='';
   if(this.mode==='house'){
    world.className='u5-world';world.innerHTML=this.labelHTML()+actor(word,{label:'Listen and explore '+word});
    this.$('.u5-controls').innerHTML=button('explore','Explore','play','aria-label="Listen and explore"')+button('word','Word','hear-word','aria-label="Hear the word"')+button('sentence','Sentence','hear-sentence','aria-label="Hear the sentence"')+button('next','Finish','done','hidden')+this.musicButton();
    this.$('.u5-extras').innerHTML=`<div class="u5-visits">${(this.learn?Unit5Learning.pairs[this.pairIndex]:WORDS).map(w=>`<button type="button" class="u5-visit" data-u5-visit="${w}" aria-label="Explore ${w}" aria-pressed="${w===word}"><img class="u5-thumb" src="${BASE}actors/${w}/idle.webp" alt=""><img class="u5-word-art" src="${BASE}words/v3/${w}-ink.svg" alt="${w}"></button>`).join('')}</div>`;
    this.setPhase('ready','Choose a picture to explore.');if(this.learn)this.$('.u5-controls').insertAdjacentHTML('beforeend',button('previous-pair','Previous pair','back',this.pairIndex===0?'hidden':'')+button('house-pair','Next pair','next','hidden'));
   }else if(this.mode==='camera'){
    this.options=this.learning?shuffle(this.learning.pool):shuffle([word,...shuffle(WORDS.filter(w=>w!==word)).slice(0,this.index<2?1:2)]);
    world.className='u5-world u5-people';world.dataset.count=this.options.length;
    world.innerHTML=this.labelHTML(false)+this.options.map((w,i)=>actor(w,{label:'Take photo '+(i+1),slot:i})).join('');
    this.$('.u5-controls').innerHTML=button('cue','Hear the clue','hear-sentence')+button('next',this.index===5?'Finish':'Next photo','next','hidden')+this.musicButton();
    this.setPhase('ready','Tap Hear the clue, then choose a person.');
   }else if(this.mode==='helping'){
    world.className='u5-world u5-help-world';world.innerHTML=this.labelHTML()+actor(word,{drop:true,label:'Give the selected item to the child'})+`<div class="u5-drop-note" hidden>Bring it here.</div><div class="u5-dock" aria-label="Things to help">${shuffle(this.learning?this.learning.pool.map(w=>PROPS[w]):Object.values(PROPS)).map(p=>`<button type="button" class="u5-pick u5-prop-pick" data-u5-pick="${p}" aria-label="Choose ${p}"><img src="${BASE}props/${p}.webp" alt="${p}" draggable="false"></button>`).join('')}</div>`;
    this.$('.u5-controls').innerHTML=button('cue','Hear the clue','hear-sentence')+button('next',this.index===7?'Finish':'Next child','next','hidden')+this.musicButton();
    this.setPhase('ready','Listen, then choose an item.');
   }else if(this.mode==='workshop'){
    this.options=this.learning?shuffle(this.learning.pool):shuffle([word,...shuffle(WORDS.filter(w=>w!==word)).slice(0,this.index<2?1:2)]);
    world.className='u5-world u5-photo-world';world.innerHTML=this.labelHTML(false)+`<div class="u5-photo-mat" aria-hidden="true"></div>`+actor(word,{drop:true,label:'Place the selected label on this photo'})+`<button type="button" class="u5-receiver" data-u5-drop="label" aria-label="Place the selected word under the photo">Choose a word</button>`;
    this.$('.u5-cue').textContent='Find the word.';
    this.$('.u5-controls').innerHTML=button('word','Listen','hear-word')+button('next',this.index===5?'Finish':'Next photo','next','hidden')+this.musicButton();
    this.$('.u5-extras').innerHTML=`<div class="u5-dock" data-count="${this.options.length}" aria-label="Word labels">${this.options.map(w=>`<button type="button" class="u5-pick u5-word-pick" data-u5-pick="${w}" aria-label="Hear and choose ${w}"><img src="${BASE}words/v3/${w}-ink.svg" alt="${w}" draggable="false"></button>`).join('')}</div>`;this.$('.u5-extension').innerHTML=`<div class="u5-optional" hidden><p>Want to build the word? Keep the model to help you.</p>${button('letters','Try letter pieces','play')}</div>`;
    this.setPhase('choosing','Tap a word to hear it. Drag it or tap the photo label space.');
   }else{
    world.className='u5-world';world.innerHTML=this.labelHTML(this.showModel)+actor(word,{label:'Look at the child'})+`<div class="u5-recorder" aria-hidden="true">${icon('microphone')}<span class="u5-mic-state">Your turn</span><i></i></div>`;
    this.$('.u5-controls').innerHTML=button('sentence','Hear model','hear-sentence')+button('hint',this.showModel?'Hide words':'Show words','help')+button('speak','Speak','microphone')+button('recording','My recording','play','hidden')+button('next',this.index===5?'Finish':'Next picture','next','hidden')+this.musicButton();
    this.$('.u5-extras').innerHTML=`<div class="u5-record-controls" hidden>${button('done','Done','done')}${button('cancel','Cancel','close')}</div><div class="u5-speech-box" hidden><p class="u5-result"></p><div class="u5-transcript"></div></div>`;
    const cue=this.$('.u5-cue');cue.hidden=true;
    this.setPhase('ready',this.learn?'Listen and practise together. Speaking is optional.':this.index<2?'Listen, then tap Speak.':'Your turn. Say the sentence.');
   }
   if(this.learning&&!this.learning.records[word].exposed)this.renderTeaching();
   else if(this.learning)this.$('.u5-controls').insertAdjacentHTML('beforeend',button('support-model','Show me','help'));
   this.refreshSupportLabel();this.refreshProgress();this.updateAlbum();
  }
  refreshSupportLabel(){
   const n=this.$('.u5-pair-label');if(!n)return;
   n.textContent=this.learning?`Pair ${this.learning.pair+1} of ${this.learning.pairs.length} · Two choices`:
    this.learn&&this.mode==='house'?`Pair ${this.pairIndex+1} of 3`:this.learn&&this.mode==='reporter'?'Listen first · Speaking is optional':'Choose your pace';
  }
  renderTeaching(){
   this.isTeaching=true;this.roundHinted=true;this.$('.u5-world').className='u5-world u5-teaching';
   this.$('.u5-world').innerHTML=this.labelHTML()+actor(this.word,{label:'Watch the feeling'});
   this.$('.u5-controls').innerHTML=button('teach-model','Watch and listen','hear-sentence')+button('try-now','Try it','play','hidden')+this.musicButton();
   this.$('.u5-extras').innerHTML='';this.$('.u5-extension').innerHTML='';this.setPhase('ready','Meet this feeling. Listen to the word, then the sentence.');
  }
  async supportModel(retry=false){
   if(!this.learning||this.solved||!['ready','choosing'].includes(this.phase))return;
   const e=this.epoch;this.roundHinted=true;this.heard=false;this.modelHeard=false;
   this.setPhase('supporting','Watch and listen. Then try with me.');this.setLine(true);
   const target=this.mode==='helping'?this.$(`[data-u5-pick="${PROPS[this.word]}"]`):this.mode==='workshop'?this.$(`[data-u5-pick="${this.word}"]`):this.$(`[data-u5-actor="${this.word}"]`);
   target?.classList.add('is-guided');this.motion();
   if(retry){await this.sfxPlay('retry');if(!this.alive(e))return;}
   const wordOK=await this.say('words/'+this.word,{highlight:true});if(!this.alive(e))return;
   const sentenceOK=wordOK&&await this.say(this.sentenceKey,{highlight:true});if(!this.alive(e))return;
   if(!sentenceOK){this.setPhase('ready','Tap Watch and listen or Show me to hear the model again.');return;}
   this.learning.expose(this.word);this.modelHeard=true;this.heard=true;
   this.setPhase(this.isTeaching?'ready':'choosing',this.isTeaching?'Now try the two pictures.':'Try with me. This is a supported turn.');
  }
  finishPartial(){
   if(!this.learn||this.dead)return;const count=this.mode==='house'?this.visited.size:this.collected.length;
   const history=this.learning?.history||[];this.epoch++;this.capture?.cancel();this.capture=null;this.stopAudio();this.stopMusic();this.stopMotion();this.stopSuccess();this.clearRecording();this.clearDrag();this.scene?.dispose();this.scene=null;this.setPhase('complete');
   this.root.innerHTML=`<section class="u5-finish"><h2 tabindex="-1">A good place to pause.</h2><p>${count} pictures explored. ${history.filter(r=>!r.assisted).length} answers on your own; ${history.filter(r=>r.assisted).length} with help.</p><p>No need to rush. Come back and practise again.</p><div class="u5-controls">${button('again','Start together again','replay')}${button('lesson','Lesson 1','home')}</div></section>`;this.$('h2').focus();
  }
  musicButton(){return button('music',this.musicOn?'Music on':'Music off','music',`aria-pressed="${!!this.musicOn}"`);}
  refreshProgress(){const n=this.mode==='house'?this.visited.size:this.collected.length,total=this.learning?this.learning.pairs.flat().length:this.order.length;this.$('.u5-count').textContent=`${n} / ${total}`;this.$('.u5-progress-bar').max=total;this.$('.u5-progress-bar').value=n;if(this.mode==='house'&&this.learn){const next=this.$('[data-u5-action=house-pair]');if(next)next.hidden=this.pairIndex===2||!Unit5Learning.pairs[this.pairIndex].every(w=>this.visited.has(w));}this.root.querySelectorAll('[data-u5-visit]').forEach(b=>b.classList.toggle('is-visited',this.visited.has(b.dataset.u5Visit)));if(this.mode==='house'&&this.visited.size===6){this.canContinue=true;this.$('[data-u5-action=next]').hidden=false;}}
  updateAlbum(){const before=this.$('.u5-album').children.length;this.$('.u5-album').innerHTML=this.collected.map(w=>`<figure><img src="${BASE}actors/${w}/idle.webp" alt=""><figcaption>${w}</figcaption></figure>`).join('');if(this.collected.length>before)this.$('.u5-album').lastElementChild?.classList.add('is-new');}
  updateControls(){
   if(!this.root)return;const recording=['permission','recording','processing'].includes(this.phase);const busy=['loading','audio','responding','delivery','supporting'].includes(this.phase)||recording;
   this.root.querySelectorAll('[data-u5-action]').forEach(b=>{const a=b.dataset.u5Action;b.disabled=busy&&!['cancel','done','retry-load'].includes(a);if(a==='next')b.disabled=!this.canContinue||busy;if(a==='support-model')b.hidden=this.solved;});
   this.root.querySelectorAll('[data-u5-actor]').forEach(b=>b.disabled=busy||this.solved||(this.mode==='camera'||this.mode==='helping')&&!this.heard||this.isTeaching);
   if(this.mode==='house')this.root.querySelectorAll('[data-u5-actor]').forEach(b=>b.disabled=busy);
   if(this.mode==='workshop')this.root.querySelectorAll('[data-u5-actor]').forEach(b=>b.disabled=busy||this.solved||this.isTeaching);
   this.root.querySelectorAll('[data-u5-pick]').forEach(b=>b.disabled=busy||this.solved||(this.mode==='helping'&&!this.heard));
   this.root.querySelectorAll('[data-u5-visit]').forEach(b=>b.disabled=recording||this.phase==='loading');
   const rec=this.$('.u5-record-controls');if(rec){rec.hidden=!recording;this.$('[data-u5-action=done]').hidden=this.phase!=='recording';this.$('[data-u5-action=cancel]').disabled=false;}
   const speak=this.$('[data-u5-action=speak]');if(speak)speak.hidden=recording||this.solved||(this.learn&&!this.modelHeard);
   const tryNow=this.$('[data-u5-action=try-now]');if(tryNow){tryNow.hidden=!this.modelHeard;tryNow.disabled=busy||!this.modelHeard;}const next=this.$('[data-u5-action=next]');if(next&&this.mode!=='house')next.hidden=!this.solved&&!(this.learn&&this.mode==='reporter'&&this.modelHeard);if(next&&this.learning&&this.learning.ready)next.querySelector('span').textContent=this.learning.pair===this.learning.pairs.length-1?'Finish':'Next pair';
   const receiver=this.$('.u5-receiver');if(receiver)receiver.disabled=busy||this.solved;
   const mic=this.$('.u5-recorder');if(mic){mic.dataset.state=this.phase;mic.querySelector('.u5-mic-state').textContent=this.phase==='recording'?'Listening…':this.phase==='processing'?'Checking…':this.solved?'Well done!':this.phase==='permission'?'Getting ready…':this.learn&&!this.modelHeard?'Listen first':'Your turn';}
  }
  setLine(show=true){const line=this.$('.u5-sentence');if(line){line.hidden=!show;line.innerHTML=this.sentenceHTML();}const cue=this.$('.u5-cue');if(cue)cue.hidden=show||this.mode==='reporter';}
  stopAudio(){
   if(this.root)this.root.dataset.voicing='false';this.audioToken++;clearTimeout(this.audioTimeout);cancelAnimationFrame(this.audioFrame);
   if(this.audio){this.audio.onended=this.audio.onerror=this.audio.onplaying=this.audio.onwaiting=this.audio.onstalled=null;this.audio.pause();this.audio=null;}
   const resolve=this.voiceResolve;this.voiceResolve=null;resolve?.(false);
   this.root?.querySelectorAll('.is-speaking').forEach(el=>el.classList.remove('is-speaking'));if(this.music)this.music.volume=.13;
   this.stopSfx();
  }
  stopSfx(){if(this.sfx){this.sfx.onended=this.sfx.onerror=null;this.sfx.pause();this.sfx=null;}const resolve=this.sfxResolve;this.sfxResolve=null;resolve?.(false);}
  say(key,{freeze=true,highlight=false}={}){
   this.stopAudio();if(!this.alive())return Promise.resolve(false);
   if(window.LearningApp?.isMuted()){this.status('Sound is off. Turn it on in Game controls, then listen again.');return Promise.resolve(false);}
   const clip=window.Unit5FeelingsClips?.clips?.[key];if(!clip){this.status('The sound could not load. Please try again.');return Promise.resolve(false);}
   if(this.music)this.music.volume=.025;
   const e=this.epoch,token=this.audioToken;const audio=this.audio=new Audio(clip.src);const before=this.phase;audio.volume=.85;this.root.dataset.voicing='true';this.root.dataset.voiceKind=key.startsWith('words/')?'word':'sentence';
   if(freeze)this.setPhase('audio','Listen…');
   return new Promise(resolve=>{
    this.voiceResolve=resolve;const valid=()=>this.alive(e)&&this.audio===audio&&this.audioToken===token;
    const finish=ok=>{if(!valid())return;this.root.dataset.voicing='false';clearTimeout(this.audioTimeout);cancelAnimationFrame(this.audioFrame);audio.onended=audio.onerror=audio.onplaying=audio.onwaiting=audio.onstalled=null;this.audio=null;this.voiceResolve=null;this.root.querySelectorAll('.is-speaking').forEach(el=>el.classList.remove('is-speaking'));if(this.music)this.music.volume=.13;if(freeze)this.setPhase(before==='audio'?'ready':before);if(!ok)this.status('The sound could not play. Tap the listening button to try again.');resolve(ok);};
    const watchdog=()=>{clearTimeout(this.audioTimeout);this.audioTimeout=setTimeout(()=>{if(valid()){audio.pause();finish(false);}},18000);};
    const paint=()=>{if(!valid())return;const spans=this.$('.u5-sentence')?.children;const mark=(clip.words||[]).find(w=>audio.currentTime>=w.start&&audio.currentTime<w.end);if(spans){[...spans].forEach(s=>s.classList.remove('is-speaking'));if(mark&&!audio.paused){const target=mark.word.toLowerCase().replace(/[^a-z]/g,'');spans[target===this.word?1:0]?.classList.add('is-speaking');}}this.audioFrame=requestAnimationFrame(paint);};
    audio.onplaying=()=>{watchdog();if(highlight)paint();};audio.onended=()=>finish(true);audio.onerror=()=>finish(false);audio.onwaiting=audio.onstalled=watchdog;watchdog();audio.play().catch(()=>finish(false));
   });
  }
  sfxPlay(name){
   if(this.dead||window.LearningApp?.isMuted()||this.audio||['permission','recording','processing'].includes(this.phase))return Promise.resolve(false);
   this.stopSfx();const a=this.sfx=new Audio(BASE+'audio/sfx/'+name+'.wav');a.learningSfx=true;a.volume=name==='photo-collected'?.23:.3;
   return new Promise(resolve=>{let finished=false;const done=ok=>{if(finished)return;finished=true;clearTimeout(timer);a.onended=a.onerror=null;if(this.sfx===a){this.sfx=null;this.sfxResolve=null;}resolve(ok);};
    const timer=setTimeout(()=>{a.pause();done(false)},4000);this.sfxResolve=done;a.onended=()=>done(true);a.onerror=()=>done(false);a.play().catch(()=>done(false));});
  }
  showSuccess(element){
   if(!element||!this.alive())return;this.stopSuccess();element.classList.add('is-correct');this.scene?.capture(element);
   const badge=document.createElement('img');badge.className='u5-result-medal';badge.alt='Correct';badge.draggable=false;
   const config=window.Unit5Feedback;let url;
   if(!this.reduced.matches&&this.successBlob){url=this.successURL=URL.createObjectURL(this.successBlob);badge.src=url;}else badge.src=BASE+config.still;
   element.append(badge);this.repositionSuccess();
   if(url)this.later(()=>{if(this.successURL===url){badge.src=BASE+config.still;URL.revokeObjectURL(url);this.successURL=null;}},config.durationMs+150);
  }
  repositionSuccess(){
   if(!this.scene||this.dead)return;this.root?.querySelectorAll('.u5-result-medal').forEach(badge=>{const element=badge.parentElement,b=this.scene.focusBounds(element),host=b.element,stage=this.stage.getBoundingClientRect(),size=this.stage.clientWidth<650?68:90;
    badge.style.width=badge.style.height=size+'px';badge.style.left=Math.max(0,Math.min(b.x+b.w-host.x-size*.18,stage.width-host.x-size-8))+'px';badge.style.top=Math.max(0,b.y-host.y+5)+'px';});
  }
  stopSuccess(keep=false){
   if(this.successURL){URL.revokeObjectURL(this.successURL);this.successURL=null;}
   this.root?.querySelectorAll('.u5-result-medal').forEach(im=>{if(keep)im.src=BASE+window.Unit5Feedback.still;else im.remove()});
  }
  motion(word=this.word,kind='state'){
   if(this.dead)return Promise.resolve(false);const im=this.$(`[data-u5-actor="${word}"] img`);if(!im)return Promise.resolve(false);
   const finalSrc=BASE+`actors/${word}/${kind==='help'?'reaction-final.webp':'idle.webp'}`;
   if(this.reduced.matches){if(kind==='help')im.src=finalSrc;return Promise.resolve(true);}
   const blob=this.motionBlobs[word+(kind==='help'?'-help':'')];if(!blob)return Promise.resolve(false);
   this.motionWords.get(word)?.stop(false);
   let resolveMotion;const settled=new Promise(resolve=>{resolveMotion=resolve;});
   const url=URL.createObjectURL(blob),entry={url,im,timer:null,stop:null};this.motionWords.set(word,entry);const e=this.epoch;
   const stop=(ok=true)=>{if(this.motionWords.get(word)!==entry)return;clearTimeout(entry.timer);im.onload=im.onerror=null;if(im.isConnected)im.src=ok||kind==='help'&&this.solved?finalSrc:BASE+`actors/${word}/idle.webp`;URL.revokeObjectURL(url);this.motionWords.delete(word);resolveMotion(ok);};entry.stop=stop;
   im.onload=()=>{if(!this.alive(e))return stop(false);im.onload=null;entry.timer=this.later(()=>stop(true),kind==='help'?1920:1320);};im.onerror=()=>stop(false);im.src=url;return settled;
  }
  stopMotion(){for(const entry of [...this.motionWords.values()])entry.stop(false);this.motionWords.clear();}
  async explore(word=this.word){
   if(!this.loaded||this.dead)return;this.index=this.order.indexOf(word);this.renderRound();this.motion();const e=this.epoch;
   if(!await this.say('words/'+word,{highlight:true})||!this.alive(e))return;
   if(!await this.say(this.sentenceKey,{highlight:true})||!this.alive(e))return;
   this.visited.add(word);this.refreshProgress();this.setPhase('ready',this.visited.size===6?'You explored all six feelings. Choose Finish when you are ready.':'Your turn. Try the action, then choose another picture.');
  }
  async cue(){
   if(!this.loaded||this.dead||['recording','permission','processing','delivery','responding','audio'].includes(this.phase))return;
   if(this.mode==='house')return this.explore();
   if(this.isTeaching)return this.supportModel();
   const e=this.epoch;if(this.mode==='reporter'){this.showModel=true;this.roundHinted=true;this.setLine(true);}
   if(this.mode==='camera'&&!this.solved)this.heard=false;
   const ok=await this.say(this.mode==='workshop'?'words/'+this.word:this.sentenceKey,{highlight:this.mode!=='camera'||this.solved});
   if(!this.alive(e))return;
   if(ok){this.heard=true;this.scene.resume();if(this.mode!=='camera'&&!(this.mode==='helping'&&this.solved))this.motion();if(this.learn&&this.mode==='reporter'){this.modelHeard=true;this.canContinue=true;}this.setPhase(this.solved?'resolved':this.mode==='reporter'?'ready':'choosing',this.solved?'Ready for the next picture.':this.mode==='camera'?'Your turn. Take a photo of the person you heard.':this.mode==='helping'?'Choose something to help. Drag it or tap the child.':this.mode==='reporter'?'Your turn. Say the whole sentence.':'Choose a word and place it under the photo.');}
   else this.setPhase(this.solved?'resolved':'ready');
  }
  async modelWord(){
   if(this.mode==='house'){const e=this.epoch;const ok=await this.say('words/'+this.word,{highlight:true});if(ok&&this.alive(e))this.motion();return;}
   if(this.mode==='workshop')return this.cue();
  }
  async pick(value,element){
   if(!['choosing','ready'].includes(this.phase)||this.solved||this.mode==='helping'&&!this.heard)return;
   this.selected=value;this.pickElement=element;this.root.querySelectorAll('[data-u5-pick]').forEach(b=>{b.classList.toggle('is-picked',b===element);b.setAttribute('aria-pressed',String(b===element));});
   const note=this.$('.u5-drop-note');if(note)note.hidden=false;
   this.status(this.mode==='helping'?'Bring it to the child. You can also tap the child.':'Place the word under the photo. You can also tap the empty label.');
   this.pickVoice=this.mode==='workshop'?this.say('words/'+value,{freeze:false,highlight:value===this.word}):Promise.resolve(true);
  }
  async choose(word,element){
   if(this.mode==='house')return this.explore(word);
   if(this.mode==='workshop'||this.mode==='helping')return this.drop();
   if(this.mode!=='camera'||this.phase!=='choosing'||!this.heard||this.solved)return;
   if(word!==this.word){this.wrong(element,'Not this person. Listen again and look carefully.');return;}
   const e=this.epoch;this.motion(word);this.setLine(true);this.root.querySelectorAll('[data-u5-actor]').forEach(el=>el.classList.add(el===element?'is-correct':'is-other'));this.solved=true;this.responsePending=true;this.setPhase('responding','Well done. Listen to the sentence.');this.showSuccess(element);await this.sfxPlay('answer-confirm');if(this.alive(e))await this.respond();
  }
  wrong(element,message){this.roundErrors++;this.errors++;this.selected=null;this.root.querySelectorAll('.is-picked').forEach(x=>x.classList.remove('is-picked'));element?.classList.add('is-retry');this.later(()=>element?.classList.remove('is-retry'),550);if(!this.learning)this.sfxPlay('retry');this.status(message);this.$('.u5-status').dataset.tone='retry';if(this.learning)this.supportModel(true);}
  async drop(){
   if(!this.selected||this.solved||!['choosing','ready'].includes(this.phase))return;
   const value=this.selected,origin=this.pickElement,e=this.epoch;
   const correct=this.mode==='helping'?value===PROPS[this.word]:value===this.word;
   if(!correct){this.wrong(origin,this.mode==='helping'?'Try another thing. What does the child need?':'That word belongs to another picture. Try again.');return;}
   this.setPhase('delivery','Putting it in place…');
   if(this.pickVoice&&!await this.pickVoice){if(this.alive(e))this.setPhase('choosing','Tap the word to hear it, then place it again.');return;}
   if(!this.alive(e))return;
   const target=this.$('[data-u5-actor]');
   if(this.mode==='helping')await this.scene.deliver(value,origin,target);
   else{const receiver=this.$('.u5-receiver');receiver.innerHTML=`<img src="${BASE}words/v3/${this.word}-ink.svg" alt="${this.word}">`;this.scene.sparkle(receiver);}
   if(!this.alive(e))return;const reaction=this.motion(this.word,this.mode==='helping'?'help':'state');this.setLine(true);this.solved=true;this.responsePending=true;this.setPhase('responding','Well done. Listen to the sentence.');this.showSuccess(target);await this.sfxPlay('answer-confirm');if(this.alive(e))await this.respond(reaction);
  }
  async respond(reaction){
   const e=this.epoch;this.canContinue=false;this.setPhase('responding','Listen to the whole sentence.');
   const ok=await this.say(this.sentenceKey,{highlight:true});if(!this.alive(e))return;
   if(!ok){this.setPhase('resolved','Tap Hear the clue to finish listening, then continue.');this.responsePending=true;return;}
   if(reaction)await reaction;if(!this.alive(e))return;
   this.resolveRound();
  }
  resolveRound(){
   this.responsePending=false;this.canContinue=true;
   if(!this.results[this.index]){this.results[this.index]={word:this.word,firstChoice:this.roundErrors===0,assisted:this.roundHinted,kind:this.mode==='reporter'?'recognized':'matched'};if(!this.learning||!this.collected.includes(this.word))this.collected.push(this.word);if(this.learning&&!this.learningRecorded){this.learning.record(this.word,this.roundHinted||this.roundErrors>0);this.learningRecorded=true;}}
   this.setPhase('resolved',this.mode==='reporter'?'Your sentence was recognized. Ready for the next picture.':'You did it! Your photo is in the collection.');this.refreshProgress();this.updateAlbum();if(this.mode==='reporter')this.showSuccess(this.$('[data-u5-actor]'));this.sfxPlay('photo-collected');
   if(this.learning){this.refreshSupportLabel();if(this.learning.ready)this.$('.u5-extension').innerHTML=`<div class="u5-pair-choice"><p>You tried both words on your own. Move on or practise this pair again.</p>${button('repeat-pair','Practise this pair','replay')}</div>`;}const optional=this.$('.u5-optional');if(optional)optional.hidden=false;
  }
  next(){
   if(!this.canContinue)return;
   if(this.learn&&this.mode==='reporter'&&!this.solved){this.results[this.index]={word:this.word,firstChoice:false,assisted:true,kind:'model-listened'};if(!this.collected.includes(this.word))this.collected.push(this.word);}
   if(this.learning){if(this.learning.ready){this.learning.advance();if(this.learning.complete)return this.finish();}else this.learning.next();this.order.push(this.learning.target);this.index++;return this.renderRound();}
   if(this.mode==='house'||this.index===this.order.length-1)return this.finish();this.index++;this.renderRound();
  }
  buildLetters(){
   if(!this.solved||!this.canContinue||this.building)return;this.stopAudio();this.building=true;const optional=this.$('.u5-optional');if(optional)optional.hidden=true;this.letters=[];this.bank=shuffle([...this.word].map((letter,id)=>({letter,id})));
   this.$('.u5-extras').innerHTML=`<section class="u5-letter-area"><p class="u5-hint">Use the model. Tap or drag each letter into the next space.</p><img class="u5-letter-model" src="${BASE}words/v3/${this.word}-ink.svg" alt="Model: ${this.word}"><div class="u5-letter-targets" aria-label="Build the word">${[...this.word].map((_,i)=>`<button type="button" class="u5-letter-slot" data-u5-slot="${i}" aria-label="Letter space ${i+1}"></button>`).join('')}</div><div class="u5-letter-bank">${this.bank.map(v=>`<button type="button" class="u5-pick u5-letter-pick" data-u5-letter="${v.id}" aria-label="Choose letter ${v.letter}"><img src="${BASE}letters/v2/${v.letter}-base.svg" alt="${v.letter}" draggable="false"></button>`).join('')}</div><div class="u5-controls">${button('undo-letter','Undo','undo')}${button('close-letters','Back to photo','back')}</div></section>`;
   this.setPhase('building','The model stays above. Find the next letter.');
  }
  letter(id,slot=null){
   if(!this.building||this.phase!=='building')return;const item=this.bank.find(v=>v.id===Number(id));if(!item||this.letters.some(v=>v.id===item.id))return;
   if(slot!==null&&Number(slot)!==this.letters.length){this.status('Place it in the next empty space.');return;}
   if(item.letter!==this.word[this.letters.length]){this.status('Look at the model. Try another letter.');this.sfxPlay('retry');return;}
   this.letters.push(item);const b=this.$(`[data-u5-letter="${id}"]`);b.disabled=true;b.style.opacity='.3';const box=this.$(`[data-u5-slot="${this.letters.length-1}"]`);box.innerHTML=`<img src="${BASE}letters/v2/${item.letter}-correct.svg" alt="${item.letter}">`;this.scene.sparkle(this.$('.u5-receiver'));this.sfxPlay('tile-snap');
   const next=this.$(`[data-u5-slot="${this.letters.length}"]`),strip=this.$('.u5-letter-targets');if(next&&strip){const delta=next.getBoundingClientRect().right-strip.getBoundingClientRect().right;if(delta>0)strip.scrollBy({left:delta+8,behavior:this.reduced.matches?'instant':'smooth'});}
   if(this.letters.length===this.word.length){const e=this.epoch;this.say(this.sentenceKey,{highlight:true}).then(ok=>{if(this.alive(e)){this.setPhase('building',ok?'You built the word! Continue to the next photo when you are ready.':'You built the word. Tap Listen to hear it again.');this.canContinue=true;this.updateControls();}});}
  }
  undoLetter(){if(this.phase!=='building'||!this.letters.length)return;const item=this.letters.pop();this.$(`[data-u5-slot="${this.letters.length}"]`).innerHTML='';const b=this.$(`[data-u5-letter="${item.id}"]`);b.disabled=false;b.style.opacity='';this.status('Try the next letter.');}
  clearRecording(){if(this.clipURL){URL.revokeObjectURL(this.clipURL);this.clipURL=null;}const replay=this.$('[data-u5-action=recording]');if(replay)replay.hidden=true;}
  record(){
   if(!this.loaded||this.dead||this.solved||this.mode!=='reporter'||(this.learn&&!this.modelHeard)||!['ready','choosing'].includes(this.phase))return;
   this.stopAudio();this.stopMotion();this.stopMusic();window.LearningFeedback?.stopSounds();window.LearningClickSound?.stop();
   if(!window.Unit3Speech?.available){this.status('The microphone or speech service is unavailable. Check access and try again.');return;}
   this.clearRecording();const e=++this.epoch;this.$('.u5-speech-box').hidden=true;this.setPhase('permission','Getting the microphone ready…');
   const target=PRONOUN[this.word]+'-'+this.word;
   try{const handle=Unit3Speech.start({questionToy:target,displayedToy:target,questionType:'feeling-sentence',
    onStart:()=>{if(this.alive(e))this.setPhase('recording','Speak now. Tap Done when you finish.');},
    onRecording:blob=>{if(this.alive(e)){this.clearRecording();this.clipURL=URL.createObjectURL(blob);this.$('[data-u5-action=recording]').hidden=false;}},
    onProcessing:()=>{if(this.alive(e))this.setPhase('processing','Listening to your sentence…');},
    onResult:result=>{if(!this.alive(e))return;this.capture=null;const checked=ToySpeechEvaluator.evaluate(result.transcript,target,target,'feeling-sentence');const correct=result.result==='CORRECT'&&checked.result==='CORRECT';const kind=correct?'CORRECT':result.result==='UNCLEAR'?'UNCLEAR':checked.result;const box=this.$('.u5-speech-box');box.hidden=false;box.dataset.result=kind;this.$('.u5-transcript').textContent=result.transcript?'I heard: “'+result.transcript+'”':'';this.$('.u5-result').textContent=correct?'Your whole sentence was recognized!':kind==='INCOMPLETE'?'Try the whole sentence.':kind==='WRONG_LOGIC'?'Look at this child. Try that sentence.':'I could not hear clearly. Please try again.';
     if(correct){this.solved=true;this.setLine(true);this.motion();this.scene.sparkle(this.$('[data-u5-actor]'));this.respond();}
     else this.setPhase('ready',kind==='UNCLEAR'?'No answer was scored. Listen or try speaking again.':'Listen to the model if you need help, then try again.');
    },
    onError:reason=>{if(!this.alive(e))return;this.capture=null;this.setPhase('ready',reason==='permission-denied'?'Allow microphone access, then tap Speak again.':reason==='no-microphone'?'Connect a microphone and try again.':reason==='lesson-unavailable'?'Speech checking is unavailable right now. You can hear your recording and try again later.':'The microphone or service could not connect. No answer was scored. Try again.');}
   });if(this.alive(e))this.capture=handle;else handle.cancel();}catch{this.setPhase('ready','The microphone is busy. Please try again.');}
  }
  cancelRecording(){this.epoch++;this.capture?.cancel();this.capture=null;this.setPhase('ready','Ready when you are. Tap Speak to try again.');}
  listenRecording(){if(!this.clipURL||['permission','recording','processing'].includes(this.phase))return;this.stopAudio();if(window.LearningApp?.isMuted()){this.status('Sound is off.');return;}const e=this.epoch,a=this.audio=new Audio(this.clipURL);this.setPhase('audio','Listen to your recording.');const done=()=>{if(this.alive(e)&&this.audio===a){this.stopAudio();this.setPhase(this.solved?'resolved':'ready','You can try speaking again or hear the model.');}};a.onended=done;a.onerror=done;a.play().catch(done);}
  stopMusic(){this.musicRequest=(this.musicRequest||0)+1;if(this.music)this.music.pause();this.musicOn=false;const b=this.$('[data-u5-action=music]');if(b){b.setAttribute('aria-pressed','false');b.querySelector('span').textContent='Music off';}}
  toggleMusic(){if(this.musicOn){this.stopMusic();return;}if(window.LearningApp?.isMuted()||['permission','recording','processing'].includes(this.phase))return;const token=this.musicRequest=(this.musicRequest||0)+1;this.music??=new Audio(BASE+'audio/music/feelings-room-loop.wav');this.music.learningSfx=true;this.music.loop=true;this.music.volume=this.audio ? .025 : .13;this.music.play().then(()=>{if(this.dead||token!==this.musicRequest)return this.music.pause();this.musicOn=true;const b=this.$('[data-u5-action=music]');b?.setAttribute('aria-pressed','true');if(b)b.querySelector('span').textContent='Music on';}).catch(error=>{if(!this.dead&&token===this.musicRequest&&error.name!=='AbortError')this.status('Music could not play. You can try again.');});}
  click(event){
   if(this.suppressClick){this.suppressClick=false;return;}const b=event.target.closest('button');if(!b||b.disabled)return;
   if(b.dataset.u5Visit)return this.explore(b.dataset.u5Visit);
   if(b.dataset.u5Actor)return this.choose(b.dataset.u5Actor,b);
   if(b.dataset.u5Pick){if(this.pointerPicked===b){this.pointerPicked=null;return;}this.pick(b.dataset.u5Pick,b);return;}
   if(b.dataset.u5Drop)return this.drop();
   if(b.dataset.u5Letter!==undefined)return this.letter(b.dataset.u5Letter);
   const action=b.dataset.u5Action;
   if(action==='retry-load')return start(this.mode,this.profile);
   if(action==='profile-learn'||action==='profile-practice'){const profile=action==='profile-learn'?'learn':'practice';if(profile===this.profile)return;const [route,query='']=location.hash.split('?');const params=new URLSearchParams(query);params.set('support',profile);history.replaceState(null,'',route+'?'+params);return start(this.mode,profile);}
   if(action==='pause-learning')return this.finishPartial();
   if(action==='teach-model'||action==='support-model')return this.supportModel();
   if(action==='try-now'&&this.isTeaching&&this.modelHeard){this.pendingAssistance=true;return this.renderRound();}
   if(action==='repeat-pair'&&this.learning?.ready){this.learning.next();this.order.push(this.learning.target);this.index++;return this.renderRound();}
   if(action==='house-pair'&&this.learn&&this.pairIndex<2&&Unit5Learning.pairs[this.pairIndex].every(w=>this.visited.has(w))){this.pairIndex++;return this.explore(Unit5Learning.pairs[this.pairIndex][0]);}
   if(action==='previous-pair'&&this.learn&&this.pairIndex>0){this.pairIndex--;return this.explore(Unit5Learning.pairs[this.pairIndex][0]);}
   if(action==='explore')return this.explore();
   if(action==='word')return this.modelWord();
   if(action==='cue'||action==='sentence'){if(this.responsePending)return this.respond();if(this.mode==='house'&&action==='sentence'){this.motion();return this.say(this.sentenceKey,{highlight:true});}return this.cue();}
   if(action==='next')return this.next();
   if(action==='letters')return this.buildLetters();
   if(action==='undo-letter')return this.undoLetter();
   if(action==='close-letters'){this.building=false;this.$('.u5-letter-area').remove();this.setPhase('resolved','Continue to the next photo when you are ready.');}
   if(action==='hint'){this.showModel=!this.showModel;this.roundHinted=true;this.setLine(this.showModel);b.querySelector('span').textContent=this.showModel?'Hide words':'Show words';}
   if(action==='speak')return this.record();
   if(action==='done')return this.capture?.stop();
   if(action==='cancel')return this.cancelRecording();
   if(action==='recording')return this.listenRecording();
   if(action==='music')return this.toggleMusic();
   if(action==='again')return start(this.mode,this.profile);
   if(action==='lesson')return LearningApp.go('#/unit/5/lesson/1?mode=practice');
   if(action==='next-game'){const modes=Object.keys(DEFINITIONS),next=DEFINITIONS[modes[modes.indexOf(this.mode)+1]];if(next)LearningApp.go('#/unit/5/lesson/1?mode=practice&activity='+next.route+'&support='+this.profile);}
  }
  pointerDown(event){
   const b=event.target.closest('[data-u5-pick],[data-u5-letter]');if(!b||b.disabled||event.button!==0||this.dead)return;
   if(b.dataset.u5Pick){this.pick(b.dataset.u5Pick,b);this.pointerPicked=b;}
   this.drag={button:b,id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
  }
  dragMove(event){const d=this.drag;if(!d||event.pointerId!==d.id)return;if(Math.hypot(event.clientX-d.x,event.clientY-d.y)>8&&!d.moved){d.moved=true;const im=this.ghost=new Image();im.src=d.button.querySelector('img').src;im.alt='';im.className='u5-ghost';const r=d.button.getBoundingClientRect();im.style.width=r.width+'px';im.style.height=r.height+'px';document.body.appendChild(im);}if(d.moved){event.preventDefault();this.ghost.style.left=event.clientX+'px';this.ghost.style.top=event.clientY+'px';}}
  dragEnd(event){
   const d=this.drag;if(!d||event.pointerId!==d.id)return;const target=document.elementFromPoint(event.clientX,event.clientY);const drop=target?.closest('[data-u5-drop],[data-u5-actor],[data-u5-slot]');this.clearDrag();if(!d.moved)return;
   this.suppressClick=true;this.later(()=>{this.suppressClick=false;},200);
   if(d.button.dataset.u5Letter!==undefined){if(drop?.dataset.u5Slot!==undefined)this.letter(d.button.dataset.u5Letter,drop.dataset.u5Slot);else this.status('Bring the letter to the next space.');}
   else if(drop&&this.root.contains(drop))this.drop();else{this.status('Bring it to the picture. You can also select it, then tap the picture.');this.sfxPlay('retry');}
  }
  clearDrag(){this.ghost?.remove();this.ghost=null;this.drag=null;}
  suspend(message){
   if(this.dead||this.phase==='complete'||!this.loaded)return;this.epoch++;this.capture?.cancel();this.capture=null;this.stopAudio();this.stopMusic();this.stopMotion();this.stopSuccess(true);this.clearDrag();this.scene?.pause();if(!this.solved)this.heard=false;
   if(this.loaded)this.setPhase(this.building?'building':this.solved?'resolved':this.mode==='workshop'?'choosing':'ready',message);
  }
  finish(){
   if(this.awarded||this.dead)return;if(this.learning?!this.learning.complete:this.mode==='house'?this.visited.size!==6:this.collected.length!==this.order.length)return;
   this.awarded=true;this.stopAudio();this.stopMusic();this.stopMotion();this.stopSuccess();this.clearRecording();this.clearDrag();this.scene?.dispose();this.scene=null;this.setPhase('complete');
   const independent=this.results.filter(r=>r.firstChoice&&!r.assisted).length;const stars=this.learn?3:this.errors>3?2:3;const modes=Object.keys(DEFINITIONS),hasNext=modes.indexOf(this.mode)<4;
   this.root.innerHTML=`<section class="u5-finish"><img src="${BASE}props/reward-star.webp" alt=""><h2 tabindex="-1">${this.mode==='house'?'You met all six feelings!':this.mode==='reporter'?'Your feelings report!':'Your photo collection!'}</h2><p>${this.mode==='reporter'?`${this.results.filter(r=>r.kind==='recognized').length} complete sentences recognized. ${this.results.filter(r=>r.kind==='model-listened').length} pictures practised by listening.`:this.mode==='house'?'You heard six words and their whole sentences. Keep practising to remember them.':this.learning?`${this.collected.length} pictures revisited. ${this.learning.history.filter(r=>!r.assisted).length} answers on your own; ${this.learning.history.filter(r=>r.assisted).length} with help.`:`${this.order.length} pictures completed. ${independent} matched on the first choice.`}</p><div class="u5-album">${(this.mode==='house'?WORDS:this.collected).map(w=>`<figure><img src="${BASE}actors/${w}/idle.webp" alt=""><figcaption>${w}</figcaption></figure>`).join('')}</div><p>${this.learn&&this.mode==='reporter'&&this.results.some(r=>r.kind!=='recognized')?'Listening practice finished.':('★'.repeat(stars))}</p><div class="u5-controls">${hasNext?button('next-game','Next activity','next'):''}${button('again','Play again','replay')}${button('lesson','Lesson 1','home')}</div></section>`;
   this.$('h2').focus();if(this.learn&&this.mode==='reporter'&&this.results.some(r=>r.kind!=='recognized'))return;document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:this.def.key,stars}}));
  }
  dispose(){
   if(this.dead)return;this.dead=true;this.epoch++;this.bootAbort?.abort();this.capture?.cancel();this.capture=null;this.stopAudio();this.stopMusic();this.stopMotion();this.stopSuccess();this.clearRecording();this.clearDrag();for(const timer of this.timers)clearTimeout(timer);this.timers.clear();this.scene?.dispose();this.scene=null;
   document.removeEventListener('learning:leave-activity',this.leave);document.removeEventListener('visibilitychange',this.hide);document.removeEventListener('toybuddy:enter',this.mute);this.reduced.removeEventListener('change',this.motionChange);window.removeEventListener('pointermove',this.pointerMove);window.removeEventListener('pointerup',this.pointerUp);window.removeEventListener('pointercancel',this.pointerCancel);
  }
 }
 function start(mode,profile){current?.dispose();current=new FeelingsGame(mode,profile);}
 for(const [mode,def] of Object.entries(DEFINITIONS)){games[def.key]={enter:()=>start(mode)};GAME_META[def.key]=['UNIT 5 · LESSON 1',def.title,def.subtitle];}
 window.Unit5Feelings={current:()=>current};
})();
