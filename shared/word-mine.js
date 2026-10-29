/* Word Mine: direct scene aiming, true ray contact, outlined letter assembly. */
(()=>{
 'use strict';
 const KEY='u3himine',ROOT='assets/word-mine/',OLD='assets/unit3/lesson5/',WORDS=['hat','horse','ill','insect'],LETTERS=[...'acehilnorst'];
 let current,loading,lastFirst;
 const glyph=ch=>ROOT+'glyphs/'+ch+'.svg';
 function phaser(){if(window.Phaser)return Promise.resolve();return loading||(loading=new Promise((yes,no)=>{const s=document.createElement('script');s.src='shared/vendor/phaser/phaser.min.js';s.onload=yes;s.onerror=()=>{loading=null;no(Error('engine'));};document.head.append(s);}));}
 class Mine{
  constructor(){
   this.wordOrder=shuffle(WORDS);if(this.wordOrder[0]===lastFirst)this.wordOrder.push(this.wordOrder.shift());lastFirst=this.wordOrder[0];this.kind='mine';this.key=KEY;this.index=0;this.pos=0;this.errors=0;this.misses=0;this.epoch=0;this.dead=false;this.tweens=new Set();this.sounds=new Set();this.flights=new Set();this.calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
   cancelVoice();document.dispatchEvent(new Event('toybuddy:enter'));this.mount();this.boot();
  }
  $(s){return this.root.querySelector(s);} $$(s){return [...this.root.querySelectorAll(s)];}
  alive(t=this.epoch){return !this.dead&&t===this.epoch&&currentGame===KEY;}
  mount(){
   setStage(`<section class="wm-game" aria-label="Word Mine"><header><h2>Word Mine</h2><span class="wm-count"></span></header><div class="wm-mission"><img class="wm-picture" alt=""><div><span>Build the word</span><strong class="wm-model"></strong></div><button data-wm="hear" aria-label="Listen to the word">♪ Listen</button></div><div class="wm-world"><div class="wm-canvas" role="application" tabindex="0" aria-label="Aim the claw: touch or drag in the mine and release. Keyboard: left and right arrows, Space to drop."></div><div class="wm-word-dock" aria-label="Build the word"></div><div class="wm-panel" hidden></div></div><div class="wm-controls"><button data-wm="left" aria-label="Aim left">◀</button><button class="wm-drop" data-wm="drop" aria-label="Drop the claw">Drop claw</button><button data-wm="right" aria-label="Aim right">▶</button><button data-wm="pause">Pause</button></div><p class="wm-status" role="status" aria-live="polite"></p><details class="wm-options"><summary>Play options</summary><button data-wm="calm" aria-pressed="${this.calm}">Gentle motion</button><p>Touch or drag in the mine, then release to drop. On a keyboard, aim with ← and →, then press Space. An empty catch costs no points.</p><a href="${ROOT}catalog.html" target="_blank" rel="noopener">View the art set</a></details></section>`);
   this.root=document.querySelector('.wm-game');this.root.onclick=e=>{const b=e.target.closest('button');if(b&&!b.disabled)this.action(b.dataset.wm);};
   this.keydown=e=>{if(!this.alive()||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();this.aim(e.key==='ArrowLeft'?-.055:.055);}if(e.code==='Space'&&!e.repeat&&!e.target.closest('button,summary')){e.preventDefault();this.cast();}};
   this.hidden=()=>{if(document.hidden)this.pause();};this.muted=()=>{if(LearningApp.isMuted())this.stopAudio();};this.sfxToggle=e=>{if(e.target.id==='soundFx'&&!e.target.checked)this.stopSfx();};
   document.addEventListener('keydown',this.keydown);document.addEventListener('visibilitychange',this.hidden);document.addEventListener('toybuddy:enter',this.muted);document.addEventListener('change',this.sfxToggle);
   this.mq=matchMedia('(prefers-reduced-motion: reduce)');this.reduce=e=>{this.calm=e.matches;this.$('[data-wm=calm]').setAttribute('aria-pressed',this.calm);};this.mq.addEventListener('change',this.reduce);
   restartCurrent=()=>start();replayCurrent=()=>this.hear();this.phaseTo('loading');this.status('Getting your mine ready…');
  }
  status(s){this.$('.wm-status').textContent=s;}
  phaseTo(p){this.phase=p;this.root.dataset.phase=p;for(const name of ['left','right','drop'])this.$(`[data-wm=${name}]`).disabled=p!=='ready';this.$('[data-wm=hear]').disabled=!['ready','resolved'].includes(p);this.$('[data-wm=pause]').disabled=['loading','engine-error','complete'].includes(p);}
  panel(html){const el=this.$('.wm-panel');el.hidden=!html;el.innerHTML=html;}
  async boot(){
   try{await phaser();if(this.dead)return;const small=this.$('.wm-canvas').clientWidth<650;this.width=small?540:900;this.height=small?760:620;this.game=new Phaser.Game({type:Phaser.AUTO,parent:this.$('.wm-canvas'),width:this.width,height:this.height,transparent:true,banner:false,audio:{noAudio:true},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:scene(this)});this.observer=new ResizeObserver(()=>{if(this.dead)return;this.wantSmall=this.$('.wm-canvas').clientWidth<650;if(this.engine&&['ready','resolved'].includes(this.phase))this.resize();});this.observer.observe(this.$('.wm-canvas'));}
   catch{if(!this.dead){this.phaseTo('engine-error');this.panel('<h3>The mine could not load</h3><button data-wm="again">Try again</button>');}}
  }
  resize(){const small=this.wantSmall??this.$('.wm-canvas').clientWidth<650,w=small?540:900;if(this.width===w)return;this.width=w;this.height=small?760:620;this.game.scale.setGameSize(this.width,this.height);this.engine.arrange();}
  beginWord(){this.epoch++;this.stopAudio();this.panel('');this.row={model:this.wordOrder[this.index],audio:OLD+'audio/'+this.wordOrder[this.index]+'.mp3'};this.$('.wm-count').textContent=`${this.index+1} / 4`;this.$('.wm-model').textContent=this.row.model;this.$('.wm-picture').src=OLD+'words/'+this.row.model+'.webp?v=20261020-ladybug';this.$('.wm-picture').alt=this.row.model;this.$('.wm-word-dock').innerHTML=[...this.row.model].map((ch,i)=>`<span class="wm-slot ${i===0?'active':''}" data-slot="${i}" aria-label="${ch}, not collected"><img src="${glyph(ch)}" alt="${ch}"></span>`).join('');this.populate();this.hear();}
  populate(){this.target=this.row.model[this.pos];this.options=shuffle([this.target,...shuffle(LETTERS.filter(c=>c!==this.target)).slice(0,2)]);this.resize();this.engine.arrange();this.phaseTo('ready');this.status(`Find ${this.target}. Touch the mine and release to drop.`);}
  aim(delta){if(this.phase!=='ready')return;this.engine.manual=true;this.engine.angle=Phaser.Math.Clamp(this.engine.angle+delta,-.88,.88);this.engine.preview();}
  animate(obj,vars){if(this.dead)return Promise.resolve(false);return new Promise(resolve=>{let tween,done=false;const end=ok=>{if(done)return;done=true;this.tweens.delete(tween);resolve(ok);};tween=gsap.to(obj,{...vars,duration:this.calm?Math.min(.13,vars.duration):vars.duration,onComplete:()=>end(true),onInterrupt:()=>end(false)});this.tweens.add(tween);});}
  async cast(){
   if(this.phase!=='ready')return;const t=this.epoch;this.stopAudio();this.phaseTo('casting');this.status('');this.sfx('cast');const contact=await this.engine.throwClaw();if(!this.alive(t)||!contact)return;
   if(contact.kind==='miss'){this.misses++;this.phaseTo('ready');this.resize();this.status('Empty claw. Aim and try again.');return;}
   if(contact.kind==='wrong'){this.errors++;this.phaseTo('ready');this.resize();this.status(`That is ${contact.letter}. Find ${this.target}.`);return;}
   this.phaseTo('slotting');await this.flyLetter(contact.node,this.pos);if(!this.alive(t))return;
   const slot=this.$(`[data-slot="${this.pos}"]`);slot.className='wm-slot filled';slot.setAttribute('aria-label',this.target+', collected');this.pos++;this.sfx('snap');const next=this.$(`[data-slot="${this.pos}"]`);if(next)next.classList.add('active');
   if(this.pos<this.row.model.length){this.populate();return;}
   this.phaseTo('reading');this.status('You built '+this.row.model+'!');const ok=await this.voice(this.row.audio);if(!this.alive(t))return;this.resolveWord(ok,t);
  }
  async flyLetter(node,index){
   const bounds=node.letterSprite.getBounds(),canvas=this.game.canvas.getBoundingClientRect(),slot=this.$(`[data-slot="${index}"] img`),start={x:canvas.left+bounds.centerX/this.width*canvas.width,y:canvas.top+bounds.centerY/this.height*canvas.height,size:bounds.height/this.height*canvas.height};
   node.letterSprite.setVisible(false);const im=document.createElement('img');im.className='wm-letter-flight';im.src=glyph(this.target);im.alt='';im.setAttribute('aria-hidden','true');document.body.append(im);this.flights.add(im);const progress={v:0};
   const place=()=>{const r=slot.getBoundingClientRect(),v=progress.v,end={x:r.left+r.width/2,y:r.top+r.height/2};im.style.left=(start.x+(end.x-start.x)*v+Math.sin(v*Math.PI)*35)+'px';im.style.top=(start.y+(end.y-start.y)*v-Math.sin(v*Math.PI)*45)+'px';im.style.height=(start.size+(r.height-start.size)*v)+'px';};place();
   await this.animate(progress,{v:1,duration:.43,ease:'power2.inOut',onUpdate:place});im.remove();this.flights.delete(im);if(this.dead)return;
   slot.parentElement.classList.add('landing');await this.animate(slot,{scale:1.12,duration:.09,yoyo:true,repeat:1});slot.parentElement.classList.remove('landing');this.engine.release();
  }
  resolveWord(ok,t){if(!this.alive(t))return;if(this.phase==='paused'){this.deferred=()=>this.resolveWord(ok,t);return;}this.phaseTo('resolved');this.panel(`<h3>${this.row.model}</h3><p>${ok||LearningApp.isMuted()?'A word of treasure!':'Your word is complete. Sound could not play.'}</p><button data-wm="next">${this.index===3?'Finish':'Next word'}</button>`);this.$('[data-wm=next]').focus({preventScroll:true});}
  stopSfx(){for(const a of this.sounds){a.pause();a.currentTime=0;}this.sounds.clear();}
  stopAudio(){this.audio?.pause();this.voiceDone?.(false);this.audio=null;this.stopSfx();}
  sfx(name){if(LearningApp.isMuted()||!document.getElementById('soundFx')?.checked)return;const a=new Audio(OLD+'adventure/sfx/'+name+'.ogg');a.learningSfx=true;a.volume=this.audio?.paused===false?.1:.32;this.sounds.add(a);a.onended=a.onerror=()=>this.sounds.delete(a);a.play().catch(()=>this.sounds.delete(a));}
  voice(src){this.audio?.pause();this.voiceDone?.(false);if(LearningApp.isMuted())return Promise.resolve(true);for(const a of this.sounds)a.volume=.09;return new Promise(resolve=>{const a=new Audio(src);this.audio=a;let done=false;const end=ok=>{if(done)return;done=true;if(this.audio===a)this.audio=null;resolve(ok);};this.voiceDone=end;a.onended=()=>end(true);a.onerror=()=>end(false);a.play().catch(()=>end(false));});}
  async hear(){if(!this.row||!['ready','resolved'].includes(this.phase))return;const t=this.epoch,ok=await this.voice(this.row.audio);if(this.alive(t)&&!ok&&!LearningApp.isMuted()&&['ready','resolved'].includes(this.phase))this.status('Sound is unavailable. Use the picture and faded word, or tap Listen to retry.');}
  pause(){if(['paused','loading','engine-error','complete'].includes(this.phase))return;this.previous=this.phase;this.audio?.pause();this.stopSfx();this.engine.manual=true;this.game.scene.pause('WordMine');for(const tw of this.tweens)tw.pause();this.phaseTo('paused');this.$('[data-wm=pause]').textContent='Resume';this.status('Paused');}
  resume(){if(this.phase!=='paused')return;this.game.scene.resume('WordMine');for(const tw of this.tweens)tw.resume();this.phaseTo(this.previous);this.$('[data-wm=pause]').textContent='Pause';if(this.audio)this.audio.play().catch(()=>this.voiceDone?.(false));if(this.deferred){const cb=this.deferred;this.deferred=null;cb();}else this.status('Your turn.');}
  action(a){if(a==='hear')this.hear();if(a==='drop')this.cast();if(a==='left')this.aim(-.09);if(a==='right')this.aim(.09);if(a==='pause')this.phase==='paused'?this.resume():this.pause();if(a==='calm'){this.calm=!this.calm;this.$('[data-wm=calm]').setAttribute('aria-pressed',this.calm);}if(a==='next'&&this.phase==='resolved'){this.pos=0;if(++this.index<4)this.beginWord();else this.complete();}if(a==='again')start();if(a==='home')LearningApp.go('#/unit/3/lesson/5?mode=practice');}
  complete(){this.phaseTo('complete');this.stopAudio();const stars=this.errors===0?3:this.errors<5?2:1;this.panel(`<h3>Your word treasure!</h3><div class="wm-stars" aria-label="${stars} practice stars">${'★'.repeat(stars)}</div><button data-wm="again">Play again</button><button data-wm="home">Activities</button>`);this.sfx('complete');this.status('Four words complete.');document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:KEY,stars}}));}
  dispose(){if(this.dead)return;this.dead=true;this.phase='disposed';this.epoch++;this.stopAudio();for(const tw of [...this.tweens])tw.kill();this.tweens.clear();for(const im of this.flights)im.remove();this.flights.clear();this.observer?.disconnect();document.removeEventListener('keydown',this.keydown);document.removeEventListener('visibilitychange',this.hidden);document.removeEventListener('toybuddy:enter',this.muted);document.removeEventListener('change',this.sfxToggle);this.mq.removeEventListener('change',this.reduce);this.root.onclick=null;this.game?.destroy(true);this.game=null;}
 }
 function scene(o){return class extends Phaser.Scene{
  constructor(){super('WordMine');this.nodes=[];this.angle=0;this.elapsed=0;this.manual=false;this.holding=false;}
  preload(){this.load.on('loaderror',()=>{this.failed=true;});this.load.image('mine',OLD+'adventure/mine.webp');this.load.image('gem',OLD+'adventure/gem.webp');for(const n of ['claw-open','claw-closed','winch'])this.load.image(n,ROOT+n+'.webp');for(const ch of LETTERS)this.load.svg('glyph-'+ch,glyph(ch),{width:160,height:190});this.load.image('dust',OLD+'adventure/vfx/dust.png');this.load.image('spark',OLD+'adventure/vfx/spark.png');}
  create(){
   if(this.failed){o.phaseTo('engine-error');o.panel('<h3>The pictures could not load</h3><button data-wm="again">Try again</button>');return;}
   this.bg=this.add.image(0,0,'mine');this.rope=this.add.graphics().setDepth(8);this.guide=this.add.graphics().setDepth(3);this.winch=this.add.image(0,0,'winch').setDepth(10);this.hook=this.add.image(0,0,'claw-open').setOrigin(.5,.12).setDepth(12);this.dust=this.add.particles(0,0,'dust',{emitting:false,lifespan:360,speed:{min:25,max:95},scale:{start:.06,end:0},alpha:{start:.65,end:0},gravityY:120,tint:0xffd48b}).setDepth(20);this.spark=this.add.particles(0,0,'spark',{emitting:false,lifespan:330,speed:{min:20,max:90},scale:{start:.045,end:0},alpha:{start:.7,end:0},tint:0xffed9d}).setDepth(20);
   this.input.on('pointerdown',p=>{if(o.phase!=='ready'||!this.inPlayArea(p))return;this.holding=true;this.manual=true;this.point(p);});this.input.on('pointermove',p=>{if(this.holding&&o.phase==='ready')this.point(p);});this.input.on('pointerup',()=>{if(this.holding){this.holding=false;o.cast();}});this.input.on('pointerupoutside',()=>{this.holding=false;});o.engine=this;o.beginWord();
  }
  inPlayArea(p){return p.y>this.origin.y+30&&p.y<this.h-135&&p.x>=0&&p.x<=this.w;}
  point(p){this.angle=Phaser.Math.Clamp(Math.atan2(p.x-this.origin.x,p.y-this.origin.y),-.88,.88);this.preview();}
  arrange(){
   this.w=o.width;this.h=o.height;this.origin={x:this.w/2,y:78};this.bg.setPosition(this.w/2,this.h/2).setDisplaySize(this.w,this.h);this.winch.setPosition(this.w/2,44).setDisplaySize(110,90);this.hook.setDisplaySize(73,82).setTexture('claw-open');this.nodes.forEach(n=>n.destroy());this.nodes=[];
   if(!o.options)return;const mobile=this.w<650,size=mobile?115:152,y=mobile?410:345;
   o.options.forEach((ch,i)=>{const n=this.add.container(this.w*(.19+i*.31),y+(i===1?18:0)).setDepth(5),base=this.add.image(0,0,'gem').setDisplaySize(size,size*1.08),letter=this.add.image(0,-2,'glyph-'+ch).setDisplaySize(size*.77,size*.91);n.add([base,letter]);n.letterSprite=letter;n.letter=ch;n.radius=mobile?55:71;n.home={x:n.x,y:n.y};this.nodes.push(n);});
   this.manual=false;this.elapsed=0;this.angle=0;this.restHook();
  }
  restHook(){this.hook.setTexture('claw-open').setDisplaySize(73,82);const d=105;this.hook.setPosition(this.origin.x+Math.sin(this.angle)*d,this.origin.y+Math.cos(this.angle)*d);this.hook.rotation=-this.angle;this.drawRope();}
  drawRope(){this.rope.clear().lineStyle(5,0x775639,.8).beginPath().moveTo(this.origin.x,this.origin.y).lineTo(this.hook.x,this.hook.y).strokePath();this.rope.lineStyle(2,0xffedb4,1).beginPath().moveTo(this.origin.x,this.origin.y).lineTo(this.hook.x,this.hook.y).strokePath();}
  ray(){
   const dx=Math.sin(this.angle),dy=Math.cos(this.angle),floor=this.h-150;let length=(floor-this.origin.y)/dy;if(dx>0)length=Math.min(length,(this.w-25-this.origin.x)/dx);if(dx<0)length=Math.min(length,(25-this.origin.x)/dx);let hit=null;
   for(const n of this.nodes){if(!n.visible)continue;const x=n.x-this.origin.x,y=n.y-this.origin.y,t=x*dx+y*dy,perp=x*x+y*y-t*t;if(t<0||perp>n.radius*n.radius)continue;const entry=t-Math.sqrt(Math.max(0,n.radius*n.radius-perp));if(entry>=0&&entry<length){length=entry;hit=n;}}
   return {x:this.origin.x+dx*length,y:this.origin.y+dy*length,length,node:hit};
  }
  preview(){this.restHook();const ray=this.ray();this.guide.clear();this.guide.lineStyle(2,0xfff1b3,.4).beginPath().moveTo(this.hook.x,this.hook.y).lineTo(ray.x,ray.y).strokePath();if(ray.node)this.guide.lineStyle(3,0xffe6a0,.8).strokeCircle(ray.node.x,ray.node.y,ray.node.radius+5);else this.guide.lineStyle(2,0xffedbe,.65).strokeCircle(ray.x,ray.y,11);}
  async throwClaw(){
   const ray=this.ray(),t=o.epoch;this.guide.clear();await o.animate(this.hook,{x:ray.x,y:ray.y,duration:Math.max(.25,ray.length/850),ease:'power1.in',onUpdate:()=>this.drawRope()});if(!o.alive(t))return null;
   if(!ray.node){await o.animate(this.hook,{x:this.origin.x,y:this.origin.y+95,rotation:0,duration:.35,ease:'power1.out',onUpdate:()=>this.drawRope()});if(!o.alive(t))return null;this.manual=true;this.restHook();return {kind:'miss'};}
   const n=ray.node,correct=n.letter===o.target;this.hook.setTexture('claw-closed').setDisplaySize(73,82);this.dust.explode(o.calm?3:13,ray.x,ray.y);o.sfx('contact');
   if(!correct){
    const ring=this.add.circle(n.x,n.y,n.radius+8).setStrokeStyle(5,0xe77c5b,.95).setDepth(6);await o.animate(n,{y:n.y-25,rotation:.08,duration:.13,yoyo:true,repeat:1,ease:'sine.inOut'});if(!o.alive(t))return null;o.sfx('retry');await o.animate(this.hook,{x:this.origin.x,y:this.origin.y+95,rotation:0,duration:.3,ease:'power1.out',onUpdate:()=>this.drawRope()});ring.destroy();if(!o.alive(t))return null;n.setPosition(n.home.x,n.home.y);n.rotation=0;this.manual=true;this.restHook();return {kind:'wrong',letter:n.letter};
   }
   o.phaseTo('retrieving');const from={x:n.x,y:n.y},end={x:this.origin.x,y:this.origin.y+110},p={v:0};await o.animate(p,{v:1,duration:.65,ease:'power2.inOut',onUpdate:()=>{const v=p.v;n.setPosition(from.x+(end.x-from.x)*v,from.y+(end.y-from.y)*v);n.rotation=Math.sin(v*Math.PI*2)*.055;n.setScale(1-v*.18);this.hook.setPosition(n.x,n.y-35);this.hook.rotation=0;this.drawRope();}});if(!o.alive(t))return null;this.spark.explode(o.calm?3:10,n.x,n.y);return {kind:'correct',node:n};
  }
  release(){this.hook.setTexture('claw-open').setDisplaySize(73,82);this.restHook();}
  update(_,delta){if(!o.alive()||o.phase!=='ready'||this.holding)return;this.elapsed+=Math.min(delta,50);if(!this.manual)this.angle=o.calm?0:Math.sin(this.elapsed*.00105)*.75;this.preview();}
 };}
 function start(){current?.dispose();current=new Mine();}
 games[KEY]={enter:start};window.WordMine={current:()=>current};document.addEventListener('learning:leave-activity',()=>{current?.dispose();current=null;});
})();
