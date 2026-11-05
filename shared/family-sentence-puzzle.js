/* Standalone family sentence puzzle: PixiJS pieces, one shared input model. */
(()=>{'use strict';
 if(typeof games==='undefined'||typeof GAME_META==='undefined'||typeof setStage==='undefined')return;
 const PEOPLE=['mum','dad','brother','sister','grandpa','grandma'];
 const ROOT='assets/family-sentence-puzzle/';
 const PORTRAIT=w=>`assets/family-treehouse-talk/portraits/${w}.png`;
 const KIT=ROOT+'precision/';
 const piecePath=word=>KIT+({'This':'piece-this.svg','is':'piece-is.svg','my':'piece-my.svg'}[word]||'piece-family.svg');
 const MQ=matchMedia('(prefers-reduced-motion: reduce)');
 const control=(action,label,options={})=>`<button type="button" data-fsp="${action}" ${options.primary?'class="fsp-primary"':''} ${options.hidden?'hidden':''} ${options.disabled?'disabled':''}><img src="${ROOT}icon-${action}.svg" alt=""><span>${label}</span></button>`;
 const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 let current,loadingPixi;
 function loadPixi(){if(window.PIXI)return Promise.resolve();return loadingPixi||=(new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='shared/vendor/pixi/pixi.min.js?v=8.22.0';script.onload=resolve;script.onerror=()=>{loadingPixi=null;reject(new Error('renderer-load'))};document.head.append(script)}))}

 class FamilyPuzzle{
  constructor(){
   this.dead=false;this.phase='loading';this.round=0;this.order=shuffle(PEOPLE);this.collected=[];this.selected=null;
   this.placed=[null,null,null,null];this.locked=[false,false,false,false];this.marks=[null,null,null,null];this.drag=null;
   this.tweens=new Set();this.targets=new Map();this.portraitTextures=new Map();this.audio=null;this.sfx=null;this.epoch=0;this.awarded=false;
   this.mount();this.prepareRound();this.init();
  }
  q(s){return this.root.querySelector(s)}
  status(text){if(!this.dead)this.q('.fsp-status').textContent=text}
  mount(){
   setStage(`<section class="fsp" aria-label="Family Sentence Puzzle"><header class="fsp-head"><div><small>UNIT 4 · LESSON 2</small><h2>Family Sentence Puzzle</h2><p>Move the pieces. Build a family sentence.</p></div><b class="fsp-progress">1 / 6</b></header><p class="fsp-level" aria-live="polite"></p><div class="fsp-board" aria-label="Drag or tap the word pieces"><div class="fsp-loading" role="status">Opening the puzzle…</div></div><div class="fsp-fallback" hidden><img alt=""><strong>Build a sentence for this person.</strong></div><p class="fsp-status" role="status" aria-live="polite"></p><div class="fsp-controls">${control('listen','Listen')}${control('hint','Show hint')}${control('check','Check',{primary:true,disabled:true})}${control('next','Next person',{primary:true,hidden:true})}${control('restart','Start again')}</div><details class="fsp-alt"><summary>Use word buttons</summary><p>Choose a piece, then choose a position.</p><div class="fsp-word-buttons" aria-label="Word pieces"></div><div class="fsp-position-buttons" aria-label="Sentence positions"></div>${control('return','Return selected piece')}</details><div class="fsp-gallery" aria-label="Sentences built"></div><section class="fsp-finale" hidden><h3>Six family sentences!</h3><div class="fsp-album-pages"><div class="fsp-family"></div></div><p>Say the sentences with a friend.</p>${control('restart','Play again',{primary:true})}</section></section>`);
   this.root=document.querySelector('.fsp');this.host=this.q('.fsp-board');
   this.root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!this.root.contains(b)||b.disabled)return;
    if(b.dataset.piece!==undefined){this.select(Number(b.dataset.piece));if(e.detail===0)this.q('.fsp-position-buttons button:not(:disabled)')?.focus()}
    else if(b.dataset.position!==undefined){this.place(this.selected,Number(b.dataset.position));if(e.detail===0)this.q('.fsp-word-buttons button:not(:disabled)')?.focus()}
    else if(b.dataset.fsp==='check')this.check();else if(b.dataset.fsp==='next')this.next();
    else if(b.dataset.fsp==='listen')this.listen();else if(b.dataset.fsp==='hint')this.hint();
    else if(b.dataset.fsp==='return')this.returnSelected();else if(b.dataset.fsp==='restart')this.restart();
   });
   this.hidden=()=>{if(document.hidden){this.stopVoice();this.stopEffect();this.cancelDrag();for(const t of [...this.tweens])t.progress(1)}};
   this.muted=()=>{if(window.LearningApp?.isMuted()){this.stopVoice();this.stopEffect()}};
   this.changed=e=>{this.muted();if(e.target?.id==='soundFx'&&!e.target.checked)this.stopEffect()};
   document.addEventListener('visibilitychange',this.hidden);document.addEventListener('toybuddy:enter',this.muted);document.addEventListener('change',this.changed);
   restartCurrent=()=>this.restart();replayCurrent=()=>this.listen();
  }
  prepareRound(){
   this.word=this.order[this.round];this.expected=['This','is','my',this.word];
   this.level=this.round<2?1:this.round<4?2:3;
   this.words=shuffle(this.level<3?this.expected:[...this.expected,shuffle(PEOPLE.filter(x=>x!==this.word))[0]]);
   this.placed=[null,null,null,null];this.locked=[false,false,false,false];this.marks=[null,null,null,null];this.selected=null;this.guide=this.level===1;
   this.phase='arrange';this.q('.fsp-progress').textContent=`${this.round+1} / 6`;this.q('.fsp-fallback img').src=PORTRAIT(this.word);
   this.status(this.level===1?'Follow the faint words to build your sentence.':this.level===2?'Build the sentence yourself. The picture is your clue.':'Choose the right family word. One piece does not belong.');this.sync();
  }
  async init(){
   const token=++this.epoch;
   try{
    await Promise.all([loadPixi(),document.fonts.load('800 40px "App Outfit"')]);if(!this.alive(token))return;
    const paths=[ROOT+'desk.png',KIT+'piece-this.svg',KIT+'piece-is.svg',KIT+'piece-my.svg',KIT+'piece-family.svg',KIT+'slot.svg',ROOT+'photo-frame.svg',KIT+'tray.svg',KIT+'glow.svg',ROOT+'correct-seal.svg',ROOT+'retry-seal.svg',...PEOPLE.map(PORTRAIT)];
    const textures=await Promise.all(paths.map(p=>PIXI.Assets.load(p)));if(!this.alive(token))return;
    this.textures=new Map(paths.map((p,i)=>[p,textures[i]]));
    const app=new PIXI.Application();this.app=app;
    await app.init({width:100,height:100,backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio||1,2),autoDensity:true,sharedTicker:false});
    if(!this.alive(token)){try{app.destroy(true,{children:true,texture:false})}catch{}return}
    app.canvas.setAttribute('aria-hidden','true');this.host.append(app.canvas);this.q('.fsp-loading').remove();
    app.stage.eventMode='static';app.stage.on('globalpointermove',e=>this.moveDrag(e));app.stage.on('pointerup',e=>this.endDrag(e));app.stage.on('pointerupoutside',e=>this.endDrag(e));
    this.resizeObserver=new ResizeObserver(()=>this.layout());this.resizeObserver.observe(this.host);this.layout(true);
   }catch{
    if(this.dead)return;this.host.hidden=true;this.q('.fsp-fallback').hidden=false;this.q('.fsp-alt').open=true;
    this.status('Choose a word button, then a position to build the sentence.');
   }
  }
  alive(token){return !this.dead&&token===this.epoch}
  layout(force=false){
   if(this.dead||!this.app?.renderer||!this.textures)return;
   const width=this.host.clientWidth;if(!width||(!force&&this.lastWidth===width))return;this.lastWidth=width;
   this.cancelDrag();this.killMotion();this.mobile=width<650;this.worldWidth=this.mobile?600:1000;
   this.worldHeight=this.mobile?(this.words.length>4?1280:1130):770;
   const height=Math.round(width*this.worldHeight/this.worldWidth);this.host.style.height=height+'px';this.app.renderer.resize(width,height);
   this.app.stage.hitArea=new PIXI.Rectangle(0,0,width,height);this.drawScene();
  }
  text(value,size,color=0x174d65){return new PIXI.Text({text:value,style:{fontFamily:'App Outfit',fontWeight:'800',fontSize:size,fill:color,align:'center'}})}
  fitPieceLabel(label,width,height){
   // SVG body: safe text box x=60..220, y=40..104 in the 300x150 artwork.
   // Exclude the left socket and right tab from both centering and text fitting.
   label.scale.set(1);label.style.fontSize=Math.min(height*.36,44);
   const scale=Math.min(1,(width*160/300)/Math.max(1,label.width),(height*64/150)/Math.max(1,label.height));
   label.scale.set(scale);label.position.set(width*(140/300-.5),height*(72/150-.5));
  }
  sprite(path){const s=new PIXI.Sprite(this.textures.get(path));s.anchor.set(.5);return s}
  portraitTexture(word){
   if(this.portraitTextures.has(word))return this.portraitTextures.get(word);
   const original=this.textures.get(PORTRAIT(word)),source=original.source,ratio=Math.min(1,512/Math.max(source.width,source.height));
   const canvas=document.createElement('canvas');canvas.width=Math.round(source.width*ratio);canvas.height=Math.round(source.height*ratio);
   const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(source.resource,0,0,canvas.width,canvas.height);
   const texture=new PIXI.Texture({source:new PIXI.CanvasSource({resource:canvas,autoGenerateMipmaps:true,scaleMode:'linear'})});this.portraitTextures.set(word,texture);return texture;
  }
  drawScene(){
   this.killMotion();if(this.world){this.app.stage.removeChild(this.world);this.world.destroy({children:true,texture:false,textureSource:false})}
   const W=this.worldWidth,H=this.worldHeight;this.world=new PIXI.Container();this.world.scale.set(this.lastWidth/W);this.app.stage.addChild(this.world);
   const bg=this.sprite(ROOT+'desk.png'),scale=Math.max(W/bg.texture.width,H/bg.texture.height);bg.scale.set(scale);bg.position.set(W/2,H/2);this.world.addChild(bg);
   const photo=this.sprite(ROOT+'photo-frame.svg');photo.width=this.mobile?280:290;photo.height=this.mobile?300:310;photo.position.set(W/2,this.mobile?180:180);this.world.addChild(photo);
   const person=new PIXI.Sprite(this.portraitTexture(this.word));person.anchor.set(.5);const maxH=photo.height*.82,maxW=photo.width*.77;person.scale.set(Math.min(maxW/person.texture.width,maxH/person.texture.height));person.position.set(photo.x,photo.y-3);this.world.addChild(person);
   const prompt=this.text('Build the sentence.',this.mobile?30:24);prompt.anchor.set(.5);prompt.position.set(W/2,this.mobile?370:370);this.world.addChild(prompt);
   const pw=260,ph=130,step=pw*220/300;
   this.slotPositions=Array.from({length:4},(_,i)=>({x:this.mobile?W/2+(i%2===0?-step/2:step/2):W/2+(i-1.5)*step,y:this.mobile?480+Math.floor(i/2)*145:475,w:pw,h:ph}));
   this.slotNodes=[];
   this.slotPositions.forEach((p,i)=>{
    const group=new PIXI.Container();group.position.set(p.x,p.y);const art=this.sprite(KIT+'slot.svg');art.width=p.w;art.height=p.h;group.addChild(art);
    const ghost=this.text(this.expected[i],this.mobile?42:34,0x7e9c8d);ghost.anchor.set(.5);this.fitPieceLabel(ghost,p.w,p.h);ghost.alpha=this.guide?.5:0;group.addChild(ghost);group.ghost=ghost;
    const number=this.text(String(i+1),this.mobile?24:20,0x5e8b8c);number.anchor.set(.5);number.position.set(0,-p.h/2-15);group.addChild(number);
    group.eventMode='static';group.cursor='pointer';group.hitArea=new PIXI.Rectangle(-p.w/2,-p.h/2,p.w,p.h);
    group.on('pointertap',()=>{if(this.phase!=='arrange')return;if(this.selected!==null)this.place(this.selected,i);else if(this.placed[i]!==null)this.select(this.placed[i])});
    this.slotNodes.push(group);this.world.addChild(group);
   });
   const last=this.slotPositions[3],period=this.text('.',this.mobile?48:45);period.anchor.set(.5);period.position.set(last.x+pw*.5+6,last.y+ph*.05);this.world.addChild(period);
   const rows=this.mobile?Math.ceil(this.words.length/2):1;
   const tray=this.sprite(KIT+'tray.svg');tray.width=this.mobile?560:950;tray.height=this.mobile?(rows*145+34):164;tray.position.set(W/2,this.mobile?850+(rows-1)*72.5:667);this.world.addChild(tray);
   const trayLabel=this.text('Choose a word',this.mobile?27:23,0x517c79);trayLabel.anchor.set(.5);trayLabel.position.set(W/2,this.mobile?747:579);this.world.addChild(trayLabel);
   const inset=this.words.length>4?110:155;
   this.homePositions=this.words.map((_,i)=>this.mobile?{x:this.words.length%2&&i===this.words.length-1?300:i%2===0?165:435,y:850+Math.floor(i/2)*145,w:260,h:130}:{x:inset+((W-2*inset)/Math.max(1,this.words.length-1))*i,y:667,w:this.words.length>4?196:220,h:this.words.length>4?98:110});
   this.tileLayer=new PIXI.Container();this.markLayer=new PIXI.Container();this.world.addChild(this.tileLayer,this.markLayer);this.tileNodes=[];
   this.words.forEach((word,id)=>{
    const home=this.homePositions[id],group=new PIXI.Container(),selection=this.sprite(piecePath(word)),art=this.sprite(piecePath(word));selection.width=home.w*1.05;selection.height=home.h*1.05;selection.tint=0xf4edcd;selection.alpha=.4;selection.visible=false;const glow=this.sprite(KIT+'glow.svg');glow.width=home.w*1.08;glow.height=home.h*1.08;glow.alpha=0;group.addChild(glow,selection);group.glow=glow;group.selection=selection;art.width=home.w;art.height=home.h;group.addChild(art);group.art=art;
    const label=this.text(word,this.mobile?43:(word.length>5?32:38));label.anchor.set(.5);label.position.set(-home.w*.045,-3);group.addChild(label);group.label=label;
    const mark=new PIXI.Container();this.markLayer.addChild(mark);group.mark=mark;
    group.eventMode='static';group.cursor='grab';group.hitArea=new PIXI.Rectangle(-home.w/2,-home.h/2,home.w,home.h);
    group.on('pointerdown',e=>this.beginDrag(id,e));this.tileNodes.push(group);this.tileLayer.addChild(group);this.positionTile(id,false);
   });
   this.paint();
  }
  tileSlot(id){return this.placed.indexOf(id)}
  tileLocked(id){const i=this.tileSlot(id);return i>=0&&this.locked[i]}
  targetPosition(id){const i=this.tileSlot(id);return i>=0?this.slotPositions[i]:this.homePositions[id]}
  motion(target,vars){
   const previous=this.targets.get(target);if(previous){previous.kill();this.tweens.delete(previous);this.targets.delete(target)}
   if(MQ.matches||!window.gsap){for(const [k,v] of Object.entries(vars))if(!['duration','ease','onComplete','delay'].includes(k))target[k]=v;vars.onComplete?.();return}
   const tween=gsap.to(target,{...vars,onComplete:()=>{this.tweens.delete(tween);if(this.targets.get(target)===tween)this.targets.delete(target);vars.onComplete?.()}});this.tweens.add(tween);this.targets.set(target,tween);
  }
  killMotion(){for(const t of this.tweens)t.kill();this.tweens.clear();this.targets.clear()}
  positionTile(id,animate=true){const node=this.tileNodes?.[id];if(!node)return;const p=this.targetPosition(id);if(!p)return;const home=this.homePositions[id],isSlot=this.tileSlot(id)>=0;const width=isSlot?p.w:home.w,height=isSlot?p.h:home.h;
   node.glow.width=width*1.08;node.glow.height=height*1.08;node.art.width=width;node.art.height=height;node.selection.width=width*1.05;node.selection.height=height*1.05;this.fitPieceLabel(node.label,width,height);
   if(animate){this.motion(node,{x:p.x,y:p.y,rotation:0,duration:.26,ease:'power3.out'});this.motion(node.scale,{x:1,y:1,duration:.22,ease:'power2.out'})}else{node.position.set(p.x,p.y);node.scale.set(1)}
  }
  paint(){
   if(!this.tileNodes)return;
   this.slotNodes.forEach((n,i)=>{n.ghost.alpha=this.guide&&this.placed[i]===null?.5:0;n.cursor=this.locked[i]?'default':'pointer'});
   this.tileNodes.forEach((n,id)=>{
    n.selection.visible=this.selected===id&&!this.tileLocked(id);n.art.tint=0xffffff;
    n.eventMode=this.tileLocked(id)||this.phase!=='arrange'?'none':'static';n.cursor='grab';n.mark.removeChildren().forEach(c=>c.destroy());
    const slot=this.tileSlot(id);if(slot<0||this.marks[slot]===null)return;
    const good=this.marks[slot],p=this.slotPositions[slot],seal=this.sprite(ROOT+(good?'correct-seal.svg':'retry-seal.svg'));seal.anchor.set(.5,.4);seal.width=49;seal.height=54;
    n.mark.position.set(p.x+p.w*.27,p.y-p.h*.52);n.mark.addChild(seal);
   });
  }
  beginDrag(id,e){
   if(this.phase!=='arrange'||this.tileLocked(id)||this.drag||e.button>0)return;e.stopPropagation();
   this.select(id,false);const p=this.world.toLocal(e.global),n=this.tileNodes[id];this.drag={id,pointer:e.pointerId,x:p.x,y:p.y,dx:n.x-p.x,dy:n.y-p.y,moved:false};
   this.tileLayer.setChildIndex(n,this.tileLayer.children.length-1);try{this.app.canvas.setPointerCapture(e.pointerId)}catch{}
  }
  moveDrag(e){
   if(!this.drag||e.pointerId!==this.drag.pointer||this.phase!=='arrange')return;const p=this.world.toLocal(e.global),d=this.drag,n=this.tileNodes[d.id];
   if(!d.moved&&Math.hypot(p.x-d.x,p.y-d.y)>8/this.world.scale.x){d.moved=true;this.motion(n.scale,{x:1.06,y:1.06,duration:.13,ease:'power2.out'})}
   if(d.moved){const active=this.targets.get(n);if(active){active.kill();this.tweens.delete(active);this.targets.delete(n)}n.position.set(p.x+d.dx,p.y+d.dy)}
  }
  endDrag(e){
   if(!this.drag||e.pointerId!==this.drag.pointer)return;const drag=this.drag;this.drag=null;try{this.app.canvas.releasePointerCapture(e.pointerId)}catch{}
   if(!drag.moved){this.status(`${this.words[drag.id]} selected. Tap a position or drag the piece.`);this.sync();return}
   const p=this.world.toLocal(e.global),slot=this.slotPositions.findIndex(s=>Math.abs(p.x-s.x)<s.w*.55&&Math.abs(p.y-s.y)<s.h*.7);
   if(slot<0||!this.place(drag.id,slot)){this.positionTile(drag.id);this.paint()}
  }
  cancelDrag(){if(!this.drag)return;const d=this.drag;this.drag=null;try{this.app?.canvas?.releasePointerCapture(d.pointer)}catch{}this.positionTile(d.id,false)}
  select(id,announce=true){if(this.phase!=='arrange'||!Number.isInteger(id)||id<0||id>=this.words.length||this.tileLocked(id))return;this.selected=id;this.wordVoice(this.words[id]);this.paint();this.sync();if(announce)this.status(`${this.words[id]} selected. Choose a position.`)}
  place(id,slot){
   if(this.phase!=='arrange'||id===null||!Number.isInteger(id)||id<0||id>=this.words.length||!Number.isInteger(slot)||slot<0||slot>3||this.tileLocked(id))return false;
   if(this.locked[slot]){this.status('This piece already fits. Choose another position.');return false}
   const source=this.tileSlot(id),displaced=this.placed[slot];if(source===slot){this.positionTile(id);return true}
   if(source>=0)this.placed[source]=null;this.placed[slot]=id;
   if(displaced!==null&&displaced!==id){if(source>=0)this.placed[source]=displaced;this.positionTile(displaced)}
   this.selected=null;this.marks=this.marks.map((x,i)=>this.locked[i]?true:null);this.positionTile(id);this.effect('place');this.paint();this.sync();
   this.status(this.placed.every(x=>x!==null)?'Ready? Tap Check to test your sentence.':'Keep building. You can swap pieces.');return true;
  }
  returnSelected(){if(this.phase!=='arrange'||this.selected===null||this.tileLocked(this.selected))return;const id=this.selected,slot=this.tileSlot(id);if(slot>=0){this.placed[slot]=null;this.marks[slot]=null}this.selected=null;this.positionTile(id);this.paint();this.sync();this.status('Choose another piece or position.')}
  sync(){
   if(this.dead)return;this.root.dataset.phase=this.phase;this.root.dataset.level=String(this.level);this.root.dataset.guide=String(this.guide);
   this.q('.fsp-level').textContent=this.level===1?'Level 1 · Follow the words':this.level===2?'Level 2 · Build it yourself':'Level 3 · Choose the right family word';
   this.q('[data-fsp=check]').disabled=this.phase!=='arrange'||this.placed.some(x=>x===null);
   this.q('[data-fsp=listen]').disabled=['loading','reading','complete'].includes(this.phase);
   this.q('[data-fsp=next]').hidden=this.phase!=='solved';this.q('[data-fsp=next] span').textContent=this.round===5?'See the family':'Next person';
   this.q('[data-fsp=hint]').hidden=this.level!==1;this.q('[data-fsp=hint]').disabled=this.phase!=='arrange'||this.level!==1;this.q('[data-fsp=hint] span').textContent=this.guide?'Hide hint':'Show hint';
   this.q('[data-fsp=return]').disabled=this.phase!=='arrange'||this.selected===null;
   this.q('.fsp-word-buttons').innerHTML=this.words.map((w,id)=>`<button type="button" data-piece="${id}" style="background-image:url('${piecePath(w)}')" ${this.tileLocked(id)||this.phase!=='arrange'?'disabled':''} aria-pressed="${this.selected===id}">${w}</button>`).join('');
   this.q('.fsp-position-buttons').innerHTML=this.placed.map((id,i)=>`<button type="button" data-position="${i}" ${this.locked[i]||this.phase!=='arrange'?'disabled':''} aria-label="Position ${i+1}: ${id===null?'empty':this.words[id]}${this.locked[i]?', correct':''}">${i+1} · ${id===null?'empty':this.words[id]}${this.locked[i]?' ✓':''}</button>`).join('');
  }
  hint(){if(this.phase!=='arrange'||this.level!==1)return;this.guide=!this.guide;this.paint();this.sync();this.status(this.guide?'The faint words show one complete sentence.':'Try the order yourself.')}
  async check(){
   if(this.phase!=='arrange'||this.placed.some(x=>x===null))return;
   this.marks=this.placed.map((id,i)=>this.words[id]===this.expected[i]);this.locked=[...this.marks];this.selected=null;this.paint();
   const correct=this.marks.filter(Boolean).length;
   if(correct<4){
    this.phase='retrying';this.stopVoice();this.effect('retry');this.sync();this.status('Keep the checked pieces. The marked pieces are coming back.');
    const token=this.epoch;await new Promise(resolve=>setTimeout(resolve,MQ.matches?250:850));if(!this.alive(token))return;
    const returned=[];this.placed.forEach((id,i)=>{if(!this.locked[i]){returned.push(id);this.placed[i]=null;this.marks[i]=null}});
    returned.forEach(id=>this.positionTile(id));this.phase='arrange';this.paint();this.sync();this.status(`${correct} ${correct===1?'piece fits':'pieces fit'}. Try the pieces in the tray again.`);return;
   }
   this.phase='reading';this.sync();this.paint();this.status('A complete sentence! Listen and say it.');this.effect('correct');
   const token=this.epoch;await new Promise(resolve=>setTimeout(resolve,MQ.matches?0:220));if(!this.alive(token))return;
   const heard=await this.voice(window.FamilyAlbumClips?.clips?.[this.word]?.src);if(!this.alive(token)||this.phase!=='reading')return;
   this.phase='solved';if(!this.collected.includes(this.word)){this.collected.push(this.word);this.q('.fsp-gallery').insertAdjacentHTML('beforeend',`<figure><img src="${PORTRAIT(this.word)}" alt="${this.word}"><figcaption>${this.word}</figcaption></figure>`)}
   this.sync();this.status(heard||window.LearningApp?.isMuted()?`This is my ${this.word}. Say it together!`:'Your sentence is complete. Tap Listen to retry the sound.');
  }
  wordVoice(word){
   const src=['This','is','my'].includes(word)?`assets/robot-workshop/audio/${word.toLowerCase()}.mp3`:`assets/unit4/lesson1/audio/${word}.mp3`;
   this.voice(src);
  }
  async listen(){if(this.dead||['loading','reading','complete'].includes(this.phase))return;const token=this.epoch;const ok=await this.voice(window.FamilyAlbumClips?.clips?.[this.word]?.src);if(!this.alive(token))return;if(!ok&&!window.LearningApp?.isMuted())this.status('Sound could not play. Tap Listen to try again.')}
  speechLight(word,time=0){
   if(!this.root)return;this.root.dataset.speakingWord=word||'';
   this.tileNodes?.forEach((node,id)=>{const on=!!word&&this.words[id].toLowerCase()===word.toLowerCase();node.glow.alpha=on?(MQ.matches?.85:.85+.15*Math.sin(time*10)):0;node.label.tint=on?0x006d86:0xffffff});
   this.root.querySelectorAll('[data-piece]').forEach(b=>b.classList.toggle('fsp-speaking',!!word&&this.words[+b.dataset.piece]?.toLowerCase()===word.toLowerCase()));
  }
  followSpeech(audio,src){
   cancelAnimationFrame(this.speechFrame);const sentence=src===window.FamilyAlbumClips?.clips?.[this.word]?.src;
   const timings=sentence?window.FamilyPuzzleTiming?.[this.word]?.words:null;
   const single=!sentence?this.words.find(w=>src.endsWith('/'+w.toLowerCase()+'.mp3')):null;
   const tick=()=>{if(this.dead||this.audio?.element!==audio)return;const t=audio.currentTime;const word=!audio.paused&&!audio.ended?(timings?.find(w=>t>=w.start&&t<w.end)?.word||(!timings?single:null)):null;this.speechLight(word,t);this.speechFrame=requestAnimationFrame(tick)};tick();
  }
  voice(src){
   this.stopVoice();this.stopEffect();if(!src||window.LearningApp?.isMuted())return Promise.resolve(false);
   return new Promise(resolve=>{const a=new Audio(src);let settled=false;const finish=ok=>{if(settled)return;settled=true;clearTimeout(timer);cancelAnimationFrame(this.speechFrame);this.speechLight(null);if(this.audio?.element===a)this.audio=null;resolve(ok)};const timer=setTimeout(()=>{a.pause();finish(false)},15000);this.audio={element:a,finish};this.followSpeech(a,src);a.onended=()=>finish(true);a.onerror=()=>finish(false);a.play().catch(()=>finish(false))});
  }
  stopVoice(){cancelAnimationFrame(this.speechFrame);this.speechLight(null);const audio=this.audio;this.audio=null;if(audio){audio.element.pause();audio.finish(false)}}
  effect(kind){this.stopEffect();if(window.LearningApp?.isMuted()||document.getElementById('soundFx')?.checked===false)return;const paths={place:'assets/playful-foley/place.wav',retry:'assets/playful-foley/retry.wav',correct:'assets/playful-foley/correct.wav'};if(!paths[kind])return;const a=this.sfx=new Audio(paths[kind]);a.learningSfx=true;a.volume=.3;a.onended=()=>{if(this.sfx===a)this.sfx=null};a.play().catch(()=>{})}
  stopEffect(){this.sfx?.pause();this.sfx=null}
  next(){if(this.phase!=='solved')return;this.stopVoice();this.stopEffect();this.round++;if(this.round>=6){this.complete();return}this.prepareRound();if(this.app?.renderer)this.layout(true)}
  complete(){
   this.phase='complete';this.killMotion();this.host.hidden=true;this.q('.fsp-controls').hidden=true;this.q('.fsp-alt').hidden=true;this.q('.fsp-fallback').hidden=true;this.q('.fsp-gallery').hidden=true;this.q('.fsp-level').hidden=true;
   this.q('.fsp-finale').hidden=false;this.q('.fsp-family').innerHTML=this.order.map(w=>`<figure><img src="${PORTRAIT(w)}" alt="${w}"><figcaption>This is my<br>${w}.</figcaption></figure>`).join('');
   this.q('.fsp-progress').textContent='6 / 6';this.status('You built six family sentences!');
   if(!this.awarded){this.awarded=true;document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:'u4familypuzzle',stars:3}}))}
   this.voice(window.FamilyAlbumClips?.clips?.complete?.src);
  }
  restart(){this.dispose();current=new FamilyPuzzle()}
  dispose(){
   if(this.dead)return;this.dead=true;this.epoch++;this.stopVoice();this.stopEffect();this.cancelDrag();this.killMotion();this.resizeObserver?.disconnect();
   document.removeEventListener('visibilitychange',this.hidden);document.removeEventListener('toybuddy:enter',this.muted);document.removeEventListener('change',this.changed);
   if(this.app?.renderer){try{this.app.destroy(true,{children:true,texture:false,textureSource:false})}catch{}}this.app=null;for(const texture of this.portraitTextures.values())texture.destroy(true);this.portraitTextures.clear();
  }
 }
 games.u4familypuzzle={enter:()=>{current?.dispose();current=new FamilyPuzzle()}};
 GAME_META.u4familypuzzle=['UNIT 4 · LESSON 2','Family Sentence Puzzle','Arrange the pieces: This is my …'];
 document.addEventListener('learning:leave-activity',()=>{current?.dispose();current=null});
})();
