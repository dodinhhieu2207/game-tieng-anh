/* Toy Catch: isolated Phaser Arcade activity, app-owned voice/progress/accessible controls. */
(()=>{
 'use strict';
 const KEY='u3toycatch',ROOT='assets/toy-catch/',TOYS='assets/number-studio/toys/';
 const WORDS={5:'five',6:'six',7:'seven',8:'eight'};
 const ROWS=[{n:7,toy:'car',noun:'cars'},{n:8,toy:'balloon',noun:'balloons'},{n:7,toy:'robot',noun:'robots'},{n:8,toy:'teddy',noun:'teddies'},{n:5,toy:'plane',noun:'planes'},{n:6,toy:'puppet',noun:'puppets'}];
 const TYPES=['car','balloon','robot','teddy','plane','puppet'];
 let current,library;
 function phaser(){if(window.Phaser)return Promise.resolve();return library||(library=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='shared/vendor/phaser/phaser.min.js?v=3.90.0';s.onload=resolve;s.onerror=()=>{library=null;s.remove();reject(Error('engine'));};document.head.append(s);}));}
 class Session{
  constructor(){
   this.dead=false;this.epoch=0;this.index=0;this.count=0;this.history=[];this.errors=0;this.points=0;this.seen=new Set();this.sounds=new Set();this.lane=1;this.mode=matchMedia('(prefers-reduced-motion: reduce)').matches?'calm':'drive';
   cancelVoice();document.dispatchEvent(new Event('toybuddy:enter'));this.mount();this.boot();
  }
  $(q){return this.root.querySelector(q);}alive(t=this.epoch){return !this.dead&&t===this.epoch&&currentGame===KEY;}
  mount(){
   setStage(`<section class="toy-catch" aria-label="Toy Catch"><header class="tc-heading"><h2>Toy Catch</h2><span class="tc-round"></span></header><div class="tc-mission"><img class="tc-target-pic" alt=""><div><span class="tc-target-label">Collect</span><strong class="tc-target-words"></strong></div><b class="tc-target-number"></b></div><div class="tc-collection"><div class="tc-collected" aria-label="Collected toys"></div><span class="tc-count" aria-live="polite"></span></div><div class="tc-road"><div class="tc-canvas" aria-hidden="true"></div><div class="tc-discrete" hidden></div><div class="tc-panel" hidden></div><span class="tc-lane-hint" aria-hidden="true">◀ &nbsp; ▶</span></div><p class="tc-status" role="status" aria-live="polite"></p><div class="tc-controls"><button data-tc="left" aria-label="Move left">◀</button><button data-tc="hear" aria-label="Hear the task again">♪ Listen</button><button data-tc="pause">Pause</button><button data-tc="right" aria-label="Move right">▶</button></div><div class="tc-footer"><span class="tc-points"></span><details><summary>Play options</summary><button data-tc="mode">Calm mode</button><p>Move with the arrows, tap a lane or drag. Collect the matching toys. Missed toys come back. In calm mode, tap a toy lane.</p></details></div></section>`);
   this.root=document.querySelector('.toy-catch');this.root.onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.hasAttribute('data-answer'))this.answer(Number(b.dataset.answer));else if(b.hasAttribute('data-lane'))this.discretePick(Number(b.dataset.lane));else this.action(b.dataset.tc);};
   this.key=e=>{if(!this.alive()||e.altKey||e.ctrlKey||e.metaKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.steer(e.key==='ArrowLeft'?-1:1);}else if(e.code==='Space'&&!e.target.closest('button,summary')){e.preventDefault();if(this.phase==='driving')this.pause();else if(this.phase==='paused')this.resume();}};
   this.hidden=()=>{if(document.hidden){this.stopSfx();this.stopVoice(false);if(this.phase==='driving')this.pause('Take a break. Tap Resume when you are ready.');}};
   this.muted=()=>{if(LearningApp.isMuted()){this.stopVoice(true);this.stopSfx();}};
   this.reduce=e=>{if(e.matches&&this.mode!=='calm')this.changeMode('calm');};this.reduceQuery=matchMedia('(prefers-reduced-motion: reduce)');this.reduceQuery.addEventListener('change',this.reduce);this.soundChange=e=>{if(e.target.id==='soundFx'&&!e.target.checked)this.stopSfx();};document.addEventListener('change',this.soundChange);
   document.addEventListener('keydown',this.key);document.addEventListener('visibilitychange',this.hidden);document.addEventListener('toybuddy:enter',this.muted);
   restartCurrent=()=>start();replayCurrent=()=>this.guide();this.row=ROWS[0];this.updateGoal();this.phaseTo('loading');this.status('Getting your toy road ready…');
  }
  async boot(){
   const t=this.epoch;
   try{
    await phaser();if(!this.alive(t))return;
    const owner=this,Scene=sceneClass(owner),el=this.$('.tc-canvas');
    this.game=new Phaser.Game({type:Phaser.AUTO,parent:el,width:el.clientWidth,height:el.clientHeight,transparent:true,antialias:true,roundPixels:true,physics:{default:'arcade',arcade:{gravity:{y:0},debug:false}},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Scene,audio:{noAudio:true},fps:{target:60,limit:60},render:{powerPreference:'low-power'},banner:false});
    this.observer=new ResizeObserver(()=>{if(!this.dead&&this.game?.scale){const r=el.getBoundingClientRect();if(r.width&&r.height)this.game.scale.resize(r.width,r.height);}});this.observer.observe(el);
   }catch{if(this.alive(t))this.fallback();}
  }
  sceneReady(engine){if(this.dead){engine.game.destroy(true);return;}this.engine=engine;this.root.dataset.renderer='phaser';this.round();}
  fallback(){this.mode='calm';this.root.dataset.renderer='discrete';this.engine=null;this.game?.destroy(true);this.game=null;this.round();}
  phaseTo(p){
   this.phase=p;this.root.dataset.phase=p;const driving=p==='driving';for(const name of ['left','right','pause'])this.$(`[data-tc=${name}]`).disabled=!driving;
   this.$('[data-tc=hear]').disabled=!['ready','driving','paused','resolved','check','audio-error'].includes(p);this.$('[data-tc=mode]').disabled=['loading','reading','finishing','reward'].includes(p);
  }
  status(text){this.$('.tc-status').textContent=text;}
  panel(html){const p=this.$('.tc-panel');p.hidden=!html;p.innerHTML=html;}
  updateGoal(){this.$('.tc-target-pic').src=TOYS+this.row.toy+'.webp';this.$('.tc-target-pic').alt=this.row.toy;this.$('.tc-target-words').textContent=WORDS[this.row.n]+' '+this.row.noun;this.$('.tc-target-number').textContent=this.row.n;this.$('.tc-round').textContent=`${this.index+1} / ${ROWS.length}`;this.$('.tc-count').textContent=`${this.count} / ${this.row.n}`;this.$('.tc-points').textContent=`${this.points} points`;}
  round(){
   this.epoch++;this.stopVoice(false);this.stopSfx();this.row=ROWS[this.index];this.count=0;this.roundWrong=false;this.seen.clear();this.wave=0;this.lane=1;this.$('.tc-collected').innerHTML='<span class="tc-empty-collection">Your toys will stay here</span>';this.$('.tc-discrete').hidden=true;this.engine?.resetRound();this.updateGoal();this.modeLabel();this.guide('ready');
  }
  modeLabel(){this.$('[data-tc=mode]').textContent=this.mode==='calm'?'Driving mode':'Calm mode';this.$('[data-tc=mode]').hidden=!this.engine;this.root.dataset.mode=this.mode;}
  stopVoice(ok=false){this.audio?.pause();this.audio=null;this.voiceFinish?.(ok);this.voiceFinish=null;}
  voice(src){
   this.stopVoice(false);this.stopSfx();if(LearningApp.isMuted())return Promise.resolve(true);if(document.hidden)return Promise.resolve(false);if(!src)return Promise.resolve(false);
   return new Promise(resolve=>{const a=new Audio(src);this.audio=a;let ended=false;const finish=ok=>{if(ended)return;ended=true;if(this.audio===a)this.audio=null;this.voiceFinish=null;resolve(ok);};this.voiceFinish=finish;a.onended=()=>finish(true);a.onerror=()=>finish(false);a.play().catch(()=>finish(false));});
  }
  sfx(name){if(document.hidden||LearningApp.isMuted()||document.querySelector('#soundFx')?.checked===false)return;const a=new Audio('assets/number-studio/sfx/'+name+'.ogg');a.learningSfx=true;a.volume=.22;this.sounds.add(a);a.onended=a.onerror=()=>this.sounds.delete(a);a.play().catch(()=>this.sounds.delete(a));}
  stopSfx(){for(const a of this.sounds){a.pause();a.currentTime=0;}this.sounds.clear();}
  async guide(after){
   if(!after&&!['ready','driving','paused','check','resolved','audio-error'].includes(this.phase))return;
   const previous=after||this.phase,t=this.epoch;this.engine?.pauseDrive();this.phaseTo('reading');this.panel('<div class="tc-listen"><span>♪</span><h3>Listen to your task</h3></div>');this.status('Listen, then drive.');
   const ok=await this.voice(ToyCatchClips?.clips[this.row.noun]?.src);if(!this.alive(t))return;
   if(!ok){this.afterAudio=previous;this.phaseTo('audio-error');this.panel('<h3>Read your task above</h3><p>You can try the sound again or play with the words.</p><button data-tc="retry-audio">Try sound</button><button data-tc="text">Play with words</button>');this.status('The sound could not play. Your points are unchanged.');return;}
   this.restore(previous);
  }
  restore(p){if(p==='ready'){this.phaseTo('ready');this.panel(`<img class="tc-ready-badge" src="${ROOT}badge.webp" alt=""><h3>Ready to collect?</h3><p>Move left and right.<br>Collect the ${this.row.noun}.</p><button class="tc-primary" data-tc="start">${this.mode==='calm'?'Let’s collect':'Let’s drive'}</button>`);this.status('Use ◀ ▶, tap a lane or drag.');}else if(p==='driving'){this.begin();}else if(p==='check'){this.showCheck();}else if(p==='resolved'){this.showResolved();}else{this.phaseTo('paused');this.panel('<h3>Road paused</h3><button class="tc-primary" data-tc="resume">Resume</button>');}}
  begin(){if(!['ready','paused','reading','audio-error'].includes(this.phase))return;this.panel('');this.phaseTo('driving');this.status('Collect the '+this.row.noun+'.');if(this.mode==='drive'&&this.engine){this.$('.tc-discrete').hidden=true;this.engine.resumeDrive();}else{this.engine?.pauseDrive();this.opportunity();}if(innerWidth<=520&&this.$('.tc-controls').getBoundingClientRect().bottom>innerHeight){const t=this.epoch;requestAnimationFrame(()=>{if(this.alive(t)&&this.phase==='driving')this.$('.tc-collection').scrollIntoView({block:'start',behavior:this.reduceQuery.matches?'instant':'smooth'});});}}
  pause(message='Your toys are safe. Tap Resume to keep driving.'){if(this.phase!=='driving')return;this.engine?.pauseDrive();this.phaseTo('paused');this.panel('<h3>Road paused</h3><button class="tc-primary" data-tc="resume">Resume</button>');this.status(message);this.$('.tc-discrete').hidden=true;}
  resume(){if(this.phase!=='paused')return;this.begin();}
  steer(direction){if(this.phase!=='driving')return;this.setLane(Math.max(0,Math.min(2,this.lane+direction)));}
  setLane(lane){if(this.phase!=='driving')return;const previous=this.lane;this.lane=lane;this.engine?.steer(lane,previous);this.root.querySelectorAll('[data-lane]').forEach(e=>e.classList.toggle('tc-lane-selected',Number(e.dataset.lane)===lane));}
  changeMode(mode){if(['loading','reading','finishing','reward'].includes(this.phase))return;const was=this.phase==='driving';this.engine?.clearItems();this.mode=mode|| (this.mode==='drive'?'calm':'drive');this.modeLabel();if(was){this.engine?.pauseDrive();this.phaseTo('paused');this.begin();}else if(this.phase==='ready')this.restore('ready');}
  opportunitySpec(){const wave=this.wave++,training=this.index===0&&wave<2;return {id:`${this.epoch}-${wave}`,toy:!training&&wave%4===3?TYPES[(TYPES.indexOf(this.row.toy)+1+(this.index%2))%TYPES.length]:this.row.toy,lane:training?this.lane:(wave*2+this.index)%3};}
  opportunity(){if(this.phase!=='driving'||this.mode!=='calm'&&this.engine)return;this.discreteItem=this.opportunitySpec();const row=this.$('.tc-discrete');row.hidden=false;row.innerHTML=[0,1,2].map(lane=>`<button data-lane="${lane}" aria-label="${lane===this.discreteItem.lane?'Collect '+this.discreteItem.toy:'Empty lane'}" class="${lane===this.lane?'tc-lane-selected':''}">${lane===this.discreteItem.lane?`<img src="${TOYS+this.discreteItem.toy}.webp" alt="${this.discreteItem.toy}">`:'·'}</button>`).join('')+'<button class="tc-pass" data-tc="pass">Let it pass</button>';this.status('Tap a matching toy. Let other toys pass.');}
  discretePick(lane){if(this.phase!=='driving'||!this.discreteItem)return;this.setLane(lane);if(lane!==this.discreteItem.lane){this.status('Move to the toy.');return;}const item=this.discreteItem;this.discreteItem=null;this.pick(item,()=>Promise.resolve());if(this.phase==='driving')this.opportunity();}
  async pick(item,fly){
   if(!this.alive()||this.phase!=='driving'||this.seen.has(item.id))return;this.seen.add(item.id);const t=this.epoch;
   if(item.toy!==this.row.toy){this.roundWrong=true;this.errors++;this.status('That is another toy. Collect the '+this.row.noun+'.');this.sfx('retry');return false;}
   this.count++;this.$('.tc-empty-collection')?.remove();const im=document.createElement('img');im.src=TOYS+this.row.toy+'.webp';im.alt=`${this.count}: ${this.row.toy}`;im.className='tc-incoming';this.$('.tc-collected').append(im);this.updateGoal();this.sfx('place');
   const last=this.count===this.row.n;if(last){this.engine?.pauseDrive(false);this.phaseTo('finishing');this.$('.tc-discrete').hidden=true;this.status('Your collection is ready.');}
   await fly(this.count);if(!this.alive(t))return true;im.classList.remove('tc-incoming');
   if(last&&this.phase==='finishing')this.finishCollection();return true;
  }
  async finishCollection(){const t=this.epoch;this.phaseTo('reading');const ok=await this.voice(NumberStudioClips?.clips[WORDS[this.row.n]]?.src);if(!this.alive(t))return;if(!ok){this.afterAudio='check';this.phaseTo('audio-error');this.panel('<h3>Your toys are ready</h3><button data-tc="retry-audio">Try sound</button><button data-tc="text">Continue with words</button>');return;}this.showCheck();}
  showCheck(){this.phaseTo('check');const asWord=this.index%2===1;this.panel(`<h3>${asWord?'Choose the number word':'How many did you collect?'}</h3><div class="tc-number-choices">${[5,6,7,8].map(n=>`<button data-answer="${n}">${asWord?WORDS[n]:n}</button>`).join('')}</div>`);this.status('Look at your collection above.');}
  async answer(n){if(this.phase!=='check')return;if(n!==this.row.n){this.errors++;this.roundWrong=true;this.sfx('retry');this.status('Count your toys again. Try another number.');return;}this.phaseTo('reward');const t=this.epoch;this.points+=this.roundWrong?1:2;this.history.push({n:this.row.n,toy:this.row.toy,correct:true,assisted:true,firstTry:!this.roundWrong});this.updateGoal();this.panel(`<img class="tc-win-badge" src="${ROOT}badge.webp" alt=""><h3>${this.row.n} · ${WORDS[this.row.n]}</h3><p>${this.row.n} ${this.row.noun} collected!</p>`);this.sfx('reward');if(this.engine&&this.mode==='drive')await this.engine.finishMotion();if(this.alive(t))this.showResolved();}
  showResolved(){this.phaseTo('resolved');this.panel(`<img class="tc-win-badge" src="${ROOT}badge.webp" alt=""><h3>${this.row.n} · ${WORDS[this.row.n]}</h3><p>${this.row.n} ${this.row.noun} collected!</p><button class="tc-primary" data-tc="next">${this.index===ROWS.length-1?'Finish':'Next road'}</button>`);this.status('You matched the number!');}
  next(){if(this.phase!=='resolved')return;if(++this.index<ROWS.length)this.round();else this.complete();}
  complete(){this.engine?.pauseDrive();this.phaseTo('complete');this.stopVoice();this.stopSfx();const stars=this.errors===0?3:this.errors<=4?2:1;this.panel(`<img class="tc-win-badge" src="${ROOT}badge.webp" alt=""><h3>Your toy road!</h3><div class="tc-stars" aria-label="${stars} stars">${'★'.repeat(stars)}</div><p>${this.points} points · ${ROWS.length} collections</p><button class="tc-primary" data-tc="again">Play again</button><button data-tc="home">Activities</button>`);this.status('Your practice stars are saved.');document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:KEY,stars}}));LearningFeedback.play('complete',this.root,{visualize:false});}
  action(name){if(name==='left')this.steer(-1);if(name==='right')this.steer(1);if(name==='hear')this.guide();if(name==='start')this.begin();if(name==='pause')this.pause();if(name==='resume')this.resume();if(name==='next')this.next();if(name==='again')start();if(name==='home')LearningApp.go('#/unit/3/lesson/4?mode='+(LearningApp.context()?.mode||'practice'));if(name==='mode')this.changeMode();if(name==='pass'&&this.phase==='driving'&&(this.mode==='calm'||!this.engine))this.opportunity();if(name==='retry-audio')this.guide(this.afterAudio);if(name==='text'&&this.phase==='audio-error')this.restore(this.afterAudio);}
  dispose(){if(this.dead)return;this.dead=true;this.phase='disposed';this.epoch++;this.engine?.pauseDrive();this.stopVoice(false);this.stopSfx();this.observer?.disconnect();document.removeEventListener('keydown',this.key);document.removeEventListener('visibilitychange',this.hidden);document.removeEventListener('toybuddy:enter',this.muted);document.removeEventListener('change',this.soundChange);this.reduceQuery.removeEventListener('change',this.reduce);this.root.onclick=null;this.game?.destroy(true);this.game=null;this.engine=null;}
 }

 function sceneClass(owner){return class CatchScene extends Phaser.Scene{
  constructor(){super({key:'ToyCatchRoad'});this.spawnIndex=0;this.frameSamples=[];}
  preload(){for(const name of ['road','buggy','tire','tree','badge'])this.load.image('tc-'+name,ROOT+name+'.webp');for(const toy of TYPES)this.load.image('tc-'+toy,TOYS+toy+'.webp');this.missing=false;this.load.on('loaderror',()=>{this.missing=true;});}
  create(){
   if(this.missing){owner.fallback();return;}
   this.road=this.add.image(0,0,'tc-road').setOrigin(0);this.marks=this.add.graphics();this.sideTrees=[0,1,2,3].map(()=>this.add.image(0,0,'tc-tree').setDepth(1));
   this.shadow=this.add.ellipse(0,0,110,135,0x34534a,.18).setDepth(2);this.vehicle=this.add.container(0,0).setDepth(4);this.wheels=[];
   for(const x of [-.37,.37])for(const y of [-.28,.28]){const wheel=this.add.image(x*100,y*100,'tc-tire').setDisplaySize(17,37);this.wheels.push(wheel);this.vehicle.add(wheel);}
   this.chassis=this.add.image(0,0,'tc-buggy');this.chassis.setScale(88/this.chassis.width);this.vehicle.add(this.chassis);
   this.player=this.add.zone(0,0,60,55);this.physics.add.existing(this.player);this.player.body.setAllowGravity(false);
   this.items=this.physics.add.group({allowGravity:false,immovable:true});this.overlap=this.physics.add.overlap(this.player,this.items,(_,item)=>this.contact(item));
   this.spark=this.add.particles(0,0,'tc-badge',{emitting:false,lifespan:420,speed:{min:35,max:80},angle:{min:210,max:330},gravityY:130,scale:{start:.045,end:0},alpha:{start:.8,end:0},quantity:4}).setDepth(7);
   this.spawnTimer=this.time.addEvent({delay:1450,loop:true,callback:()=>{if(owner.phase==='driving'&&owner.mode==='drive')this.spawn();}});this.spawnTimer.paused=true;
   this.scale.on('resize',()=>this.layout());this.input.on('pointerdown',p=>this.point(p));this.input.on('pointermove',p=>{if(p.isDown)this.point(p);});this.events.once('shutdown',()=>this.clearItems());this.layout();this.physics.world.pause();owner.sceneReady(this);
  }
  point(p){if(owner.phase!=='driving'||owner.mode!=='drive')return;const lanes=this.lanes;let best=0;for(let i=1;i<3;i++)if(Math.abs(p.x-lanes[i])<Math.abs(p.x-lanes[best]))best=i;owner.setLane(best);}
  layout(){
   const w=this.scale.width,h=this.scale.height;this.lanes=[w*.24,w*.5,w*.76];this.h=h;this.w=w;this.carSize=Phaser.Math.Clamp(w*.16,72,137);this.carY=h-92;
   const roadScale=Math.max(w/this.road.width,h/this.road.height);this.road.setScale(roadScale).setPosition((w-this.road.displayWidth)/2,(h-this.road.displayHeight)/2);this.vehicle.setScale(this.carSize/100);this.player.body.setSize(this.carSize*.64,this.carSize*.55);this.player.body.reset(this.lanes[owner.lane],this.carY);this.vehicle.setPosition(this.player.x,this.carY);this.shadow.setPosition(this.player.x,this.carY+8).setDisplaySize(this.carSize*.95,this.carSize*1.28);
   this.sideTrees.forEach((e,i)=>{e.setDisplaySize(Phaser.Math.Clamp(w*.10,40,100),Phaser.Math.Clamp(w*.10,40,100));e.x=i%2?w*.96:w*.04;e.y=h*(.18+i*.22);});this.physics.world.setBounds(0,0,w,h);this.clearItems();this.marks.clear();
  }
  resetRound(){this.pauseDrive();this.clearItems();this.tweens.killAll();this.vehicle.alpha=1;this.vehicle.angle=0;this.spawnIndex=0;this.player.body.reset(this.lanes[1],this.carY);this.vehicle.setPosition(this.lanes[1],this.carY);this.shadow.setPosition(this.lanes[1],this.carY+8).setAlpha(1);}
  clearItems(){if(!this.items)return;this.items.getChildren().slice().forEach(i=>{i.tcShadow?.destroy();this.tweens.killTweensOf(i);if(i.tcFlightFinish)i.tcFlightFinish();else i.destroy();});}
  pauseDrive(freeze=true){this.physics.world.pause();this.spawnTimer.paused=true;this.player.body.setVelocityX(0);if(freeze)this.tweens.pauseAll();}
  resumeDrive(){this.physics.world.resume();this.spawnTimer.paused=false;this.tweens.resumeAll();if(!this.items.countActive())this.spawn();}
  steer(lane,previous){if(lane===previous)return;this.tweens.killTweensOf(this.vehicle);this.tweens.add({targets:this.vehicle,angle:(lane>previous?-1:1)*7,duration:130,ease:'Sine.Out',yoyo:true,hold:80});this.wheels.forEach(e=>this.tweens.add({targets:e,angle:(lane>previous?1:-1)*11,duration:130,yoyo:true}));}
  spawn(spec=owner.opportunitySpec(),y=-55){
   if(owner.phase!=='driving'||owner.mode!=='drive')return null;
   const size=Phaser.Math.Clamp(this.w*.11,48,96),item=this.items.create(this.lanes[spec.lane],y,'tc-'+spec.toy);item.setScale(size/Math.max(item.width,item.height)).setDepth(3).setData('spec',spec).setData('handled',false);item.body.setSize(item.width*.65,item.height*.65,true);item.setVelocityY(this.h*.23);item.tcShadow=this.add.ellipse(item.x,y+21,size*.75,size*.26,0x77663f,.16).setDepth(2);return item;
  }
  contact(item){
   if(owner.dead||owner.phase!=='driving'||item.getData('handled'))return;item.setData('handled',true);item.body.enable=false;item.tcShadow?.destroy();const spec=item.getData('spec');
   if(spec.toy!==owner.row.toy){owner.pick(spec,()=>Promise.resolve());this.tweens.add({targets:item,x:item.x<this.w/2?-40:this.w+40,y:item.y+30,angle:22,alpha:0,duration:430,ease:'Sine.Out',onComplete:()=>item.destroy()});return;}
   this.spark.explode(4,item.x,item.y);
   owner.pick(spec,()=>new Promise(resolve=>{
    let ended=false;const done=()=>{if(ended)return;ended=true;item.tcFlightFinish=null;item.destroy();resolve();};item.tcFlightFinish=done;
    this.tweens.add({targets:item,x:this.w*.5,y:-35,scaleX:item.scaleX*.45,scaleY:item.scaleY*.45,alpha:.5,duration:440,ease:'Cubic.In',onComplete:done});
   }));
  }
  finishMotion(){this.tweens.resumeAll();return new Promise(resolve=>{this.tweens.add({targets:this.vehicle,alpha:.1,y:this.h+100,duration:650,ease:'Sine.In',onComplete:resolve});this.tweens.add({targets:this.shadow,alpha:0,duration:550});});}
  update(time,delta){
   if(owner.dead||!this.player?.body)return;const driving=owner.phase==='driving'&&owner.mode==='drive';if(driving){const dx=this.lanes[owner.lane]-this.player.x;this.player.body.setVelocityX(Phaser.Math.Clamp(dx*11,-650,650));if(Math.abs(dx)<.5)this.player.body.reset(this.lanes[owner.lane],this.carY);this.vehicle.setPosition(this.player.x,this.carY);this.shadow.setPosition(this.player.x,this.carY+8);}
   this.items?.getChildren().slice().forEach(item=>{if(item.body?.enable){item.tcShadow?.setPosition(item.x,item.y+21);if(item.y>this.h+90){item.tcShadow?.destroy();item.destroy();}}});
   if(driving){this.roadTime=(this.roadTime||0)+delta;this.marks.clear();this.marks.fillStyle(0xfffdf0,.72);for(const x of [this.w*.37,this.w*.63])for(let y=(this.roadTime*.075)%80-80;y<this.h;y+=80)this.marks.fillRoundedRect(x-2,y,4,25,2);this.sideTrees.forEach((e,i)=>{e.y=(this.roadTime*.022+i*this.h*.3)%(this.h+100)-50;});if(this.frameSamples.length<600)this.frameSamples.push(delta);}
  }
 };}
 function start(){current?.dispose();current=new Session();}
 games[KEY]={enter:start};GAME_META[KEY]=['UNIT 3 · LESSON 4','Toy Catch','Drive, collect and match the number.'];
 window.ToyCatch={current:()=>current,rounds:ROWS};document.addEventListener('learning:leave-activity',()=>{current?.dispose();current=null;});
})();
