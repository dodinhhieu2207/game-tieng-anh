/* Unit 4 Lesson 1 · Family Park
 * Core scene uses DOM/SVG + GSAP-friendly motion.  The relay exposes a
 * small adapter seam for Phaser; it deliberately falls back to the same
 * learning flow when the optional runtime is not loaded.
 */
(()=>{
  'use strict';
  if(typeof games==='undefined'||typeof GAME_META==='undefined'||typeof setStage==='undefined')return;

  const KEY={meet:'u4familymeet',find:'u4familyfind',pack:'u4familypack',relay:'u4familyrelay'};
  const PEOPLE=[
    {word:'mum',label:'Mum',role:'Mum',spot:'mum'},
    {word:'dad',label:'Dad',role:'Dad',spot:'dad'},
    {word:'brother',label:'Brother',role:'Brother',spot:'brother'},
    {word:'sister',label:'Sister',role:'Sister',spot:'sister'},
    {word:'grandpa',label:'Grandpa',role:'Grandpa',spot:'grandpa'},
    {word:'grandma',label:'Grandma',role:'Grandma',spot:'grandma'}
  ];
  let scene=null, voiceToken=0, activeAudio=null, activeResolve=null;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffled=a=>a.slice().sort(()=>Math.random()-.5);
  const stopAudio=()=>{if(activeAudio){try{activeAudio.pause()}catch{}activeAudio=null}if(activeResolve){const done=activeResolve;activeResolve=null;done(false)}};
  const stopVoice=()=>{voiceToken++;stopAudio();try{window.cancelVoice?.()}catch{}};
  const playClip=(key,button,owner)=>new Promise(resolve=>{
    if(owner!==voiceToken){resolve(false);return}
    stopAudio();
    const clip=window.Unit4FamilyClips?.clips?.[key];
    if(!clip?.src){resolve(false);return}
    const audio=new Audio(clip.src);activeAudio=audio;activeResolve=resolve;audio.preload='auto';
    const settle=ok=>{if(activeAudio===audio)activeAudio=null;if(activeResolve===resolve)activeResolve=null;resolve(ok)};
    audio.onended=()=>settle(owner===voiceToken);audio.onerror=()=>settle(false);
    const pending=audio.play();if(pending?.catch)pending.catch(()=>settle(false));
  });
  const feedback=(kind,el)=>{try{window.LearningFeedback?.play(kind,el,{visualize:true})}catch{}};
  const motion=(el,vars)=>{try{if(window.gsap&&el)return window.gsap.to(el,{duration:.5,ease:'back.out(1.6)',...vars})}catch{}return null};
  const person=(word)=>PEOPLE.find(p=>p.word===word)||PEOPLE[0];
  const hotspot=(p,opts='')=>`<button class="u4-hotspot" data-person="${p.spot}" data-word="${p.word}" aria-label="${esc(p.label)}${opts?` · ${esc(opts)}`:''}"><span class="u4-hotspot-name">${esc(p.label)}</span></button>`;
  const world=(mode,content,extra='')=>`<div class="u4-world" data-mode="${mode}" data-phase="ready"><div class="u4-layer" aria-hidden="true"><i class="u4-leaf"></i><i class="u4-leaf"></i><i class="u4-leaf"></i></div>${content}${extra}</div>`;
  const shell=(title,subtitle,progress,body)=>`<section class="u4-family" data-u4-family><header class="u4-head"><div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div><span class="u4-progress" data-u4-progress>${esc(progress)}</span></header>${body}</section>`;
  const controls=(extra='')=>`<div class="u4-toolbar"><button class="u4-btn" data-u4-listen>Listen again</button>${extra}<button class="u4-btn" data-u4-restart>Start again</button></div>`;

  class FamilyScene{
    constructor(kind){this.kind=kind;this.root=null;this.world=null;this.round=0;this.errors=0;this.done=0;this.alive=true;this.target=null;this.selected=null;this.tokens=[];this.team='blue';this.scores={blue:0,coral:0};this.mount();}
    q(sel){return this.root?.querySelector(sel)}
    qs(sel){return [...(this.root?.querySelectorAll(sel)||[])]}
    mount(){
      stopVoice();
      els.gameScreen.classList.add('u4-on');
      const base=`<div class="u4-taskbar"><strong class="u4-task" data-u4-task></strong><p class="u4-status" data-u4-status role="status" aria-live="polite"></p></div>`;
      if(this.kind==='meet')this.mountMeet(base);
      else if(this.kind==='find')this.mountFind(base);
      else if(this.kind==='pack')this.mountPack(base);
      else this.mountRelay(base);
      this.root=document.querySelector('[data-u4-family]');
      this.world=this.q('.u4-world');
      this.root?.addEventListener('click',e=>this.click(e));
      this.root?.addEventListener('pointerdown',e=>{const t=e.target.closest('.u4-hotspot,.u4-token,.u4-btn,.u4-team');if(t)t.classList.add('is-pressed');if(t?.matches('.u4-token')&&!this.listening)this.beginDrag(e,t)});
      this.root?.addEventListener('pointerup',e=>{const t=e.target.closest('.is-pressed');if(t)t.classList.remove('is-pressed')});
      this.reduce=()=>this.root?.classList.toggle('u4-reduced',matchMedia('(prefers-reduced-motion: reduce)').matches);
      this.reduce(); matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',this.reduce);
      this.root.addEventListener('pointermove',e=>this.moveDrag(e));this.root.addEventListener('pointerup',e=>this.endDrag(e));this.root.addEventListener('pointercancel',()=>this.cancelDrag());
      restartCurrent=()=>this.restart(); replayCurrent=()=>this.replay();
    }
    mountMeet(base){
      const spots=PEOPLE.map(p=>hotspot(p)).join('');
      setStage(shell('Meet the Family','Listen, point and say the family words.','1 / 4',`<div class="u4-intro-strip">${PEOPLE.map(p=>`<button class="u4-word-ribbon" data-u4-word="${p.word}">${esc(p.word)}</button>`).join('')}</div>${world('intro',spots)}${base}${controls()}`));
      this.root=document.querySelector('[data-u4-family]');
      this.task('Touch a family member.'); this.status('Listen, point and repeat.'); this.target=PEOPLE[0];
      setTimeout(()=>this.cue(['instruction/meet'],this.q('[data-u4-listen]'),'Touch a family member.'),220);
    }
    mountFind(base){
      this.order=shuffled(PEOPLE);this.target=this.order[0];
      setStage(shell('Family Finder','Find the person you hear.','1 / 6',`${world('find',PEOPLE.map(p=>hotspot(p,'find me')).join(''))}${base}${controls('<button class="u4-btn primary" data-u4-next>Next person</button>')}`));
      this.root=document.querySelector('[data-u4-family]');
      this.task(`Find ${this.target.word}.`); this.status('Listen, then tap the matching person.'); setTimeout(()=>this.cue(['instruction/find',this.target.word],this.q('[data-u4-listen]'),'Now choose the matching person.'),220);
    }
    mountPack(base){
      this.tokens=shuffled(PEOPLE); this.target=this.tokens[0];
      setStage(shell('Pack the Picnic','Choose a word, then place it beside the right person.','1 / 6',`${world('pack',PEOPLE.map(p=>hotspot(p,'drop here')).join(''))}<div class="u4-token-bank" aria-label="Family word cards">${this.tokens.map((p,i)=>`<button class="u4-token" data-token="${p.word}" aria-pressed="false" style="--u4-i:${i}">${esc(p.word)}</button>`).join('')}</div>${base}${controls('<span class="u4-progress" data-u4-pack-count>0 / 6 packed</span>')}`));
      this.root=document.querySelector('[data-u4-family]');
      this.task('Pack a family picnic.'); this.status('Choose a word card, then tap its family member.');
      setTimeout(()=>this.cue(['instruction/pack'],this.q('[data-u4-listen]'),'Choose a word card, then tap its family member.'),220);
    }
    mountRelay(base){
      this.order=shuffled(PEOPLE);this.target=this.order[0];
      const racers=`<div class="u4-parade"><div class="u4-path" aria-hidden="true"></div><span class="u4-racer" data-u4-racer aria-hidden="true">🧺</span><button class="u4-flag blue" data-team="blue" aria-label="Blue team">Blue <b data-score="blue">0</b></button><button class="u4-flag coral" data-team="coral" aria-label="Coral team">Coral <b data-score="coral">0</b></button></div>`;
      setStage(shell('Family Parade Relay','Take turns. Hear a word, then race to the right person.','1 / 6',`${world('relay',PEOPLE.map(p=>hotspot(p,'race here')).join(''),racers)}<div class="u4-teambar" role="group" aria-label="Choose a team"><button class="u4-team" data-team="blue" aria-pressed="true">Blue team</button><button class="u4-team" data-team="coral" aria-pressed="false">Coral team</button></div>${base}${controls('<button class="u4-btn primary" data-u4-next>Next turn</button>')}`));
      this.root=document.querySelector('[data-u4-family]');
      this.task(`Blue team: find ${this.target.word}.`); this.status('Tap a team, then tap the family member.'); setTimeout(()=>this.cue(['instruction/relay',this.target.word],this.q('[data-u4-listen]'),'Now choose the matching family member.'),220);
    }
    task(t){const n=this.q('[data-u4-task]');if(n)n.textContent=t}
    status(t){const n=this.q('[data-u4-status]');if(n)n.textContent=t}
    async cue(keys,button,afterStatus=''){
      stopVoice();const owner=voiceToken;this.listening=true;this.root.dataset.listening='true';this.root.dataset.audioError='false';
      let ok=true;for(const key of keys){ok=await playClip(key,button,owner);if(!ok||owner!==voiceToken)break}
      if(owner!==voiceToken)return false;this.listening=false;this.root.dataset.listening='false';
      if(!ok){this.root.dataset.audioError='true';this.status('Audio could not play. Tap Listen again.');}
      else if(afterStatus)this.status(afterStatus);
      return ok;
    }
    click(e){
      if(this.suppressClick)return;
      const b=e.target.closest('button');if(!b)return;
      if(b.hasAttribute('data-u4-restart')){this.restart();return;}
      if(!this.alive)return;
      if(b.hasAttribute('data-u4-listen')){this.cue([this.target?.word||'instruction/meet'],b,this.kind==='meet'?`Now say ${this.target?.word||'mum'}.`:'Now choose the matching family member.');return;}
      if(this.listening||this.flying)return;
      if(b.dataset.u4Word){this.target=person(b.dataset.u4Word);this.cue([b.dataset.u4Word],b,`Now say ${b.dataset.u4Word}.`);this.task(b.dataset.u4Word);this.status(`Say ${b.dataset.u4Word}.`);feedback('place',b);return;}
      if(b.hasAttribute('data-u4-next')){this.next();return;}
      if(b.dataset.team){this.team=b.dataset.team;this.qs('[data-team]').forEach(x=>x.setAttribute('aria-pressed',String(x===b||x.dataset.team===this.team)));if(this.kind==='relay')this.task(`${this.team==='blue'?'Blue':'Coral'} team: find ${this.target.word}.`);return;}
      if(b.dataset.token){this.selectToken(b);return;}
      if(b.dataset.word){this.choose(b);}
    }
    selectToken(b){if(this.kind!=='pack'||b.dataset.placed==='true')return;this.qs('.u4-token').forEach(t=>t.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');this.selected=b.dataset.token;this.world.dataset.carrying='true';this.status(`Drag ${this.selected} to a space, or tap a space.`);}
    beginDrag(e,b){if(this.kind!=='pack'||b.dataset.placed==='true'||!this.alive)return;this.drag={button:b,id:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,moved:false};b.setPointerCapture(e.pointerId)}
    moveDrag(e){const d=this.drag;if(!d||d.id!==e.pointerId)return;d.x=e.clientX;d.y=e.clientY;if(!d.moved&&Math.hypot(d.x-d.startX,d.y-d.startY)<7)return;if(!d.moved){d.moved=true;this.selectToken(d.button);d.ghost=d.button.cloneNode(true);d.ghost.removeAttribute('data-token');d.ghost.className='u4-token u4-flying-card';d.ghost.style.width=d.button.getBoundingClientRect().width+'px';document.body.append(d.ghost)}d.ghost.style.left=(d.x-d.ghost.offsetWidth/2)+'px';d.ghost.style.top=(d.y-25)+'px';this.qs('.u4-hotspot').forEach(b=>{const r=b.getBoundingClientRect();b.classList.toggle('drop-hover',d.x>=r.left&&d.x<=r.right&&d.y>=r.top&&d.y<=r.bottom)})}
    endDrag(e){const d=this.drag;if(!d||d.id!==e.pointerId)return;this.drag=null;this.qs('.drop-hover').forEach(b=>b.classList.remove('drop-hover'));if(!d.moved)return;this.suppressClick=true;setTimeout(()=>this.suppressClick=false,0);const target=this.qs('.u4-hotspot').find(b=>{const r=b.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom});d.ghost?.remove();if(target)this.choose(target);else{this.status('Try a space beside a family member.');feedback('retry',d.button)}}
    cancelDrag(){this.drag?.ghost?.remove();this.drag=null;this.qs('.drop-hover').forEach(b=>b.classList.remove('drop-hover'))}
    showPerson(b,word){this.qs('.u4-person-caption').forEach(n=>n.remove());const label=document.createElement('span');label.className='u4-person-caption';label.textContent=word;b.append(label);motion(b,{scale:1.09,duration:.25,onComplete:()=>motion(b,{scale:1,duration:.3})})}
    async placeCard(b,token,word){this.selected=null;delete this.world.dataset.carrying;token.dataset.placed='true';token.disabled=true;b.dataset.state='correct';b.classList.add('u4-filled');b.querySelector('.u4-hotspot-name').textContent=word;const from=token.getBoundingClientRect(),to=b.getBoundingClientRect();const flyer=token.cloneNode(true);flyer.removeAttribute('data-token');flyer.className='u4-token u4-flying-card';Object.assign(flyer.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px'});document.body.append(flyer);this.flying=flyer;const finish=()=>{flyer.remove();if(this.flying===flyer)this.flying=null;};if(window.gsap&&!this.root.classList.contains('u4-reduced'))await new Promise(resolve=>window.gsap.to(flyer,{x:to.left+to.width/2-from.left-from.width/2,y:to.top+to.height/2-from.top-from.height/2,scale:.88,rotation:0,duration:.65,ease:'power2.inOut',onComplete:()=>{finish();resolve()}}));else finish();if(!this.alive)return;this.done++;this.status(`Packed ${word}!`);this.q('[data-u4-pack-count]').textContent=`${this.done} / 6 packed`;this.q('[data-u4-progress]').textContent=`${this.done} / 6`;feedback('correct',b);const ok=await this.cue([word,'feedback/well-done'],null,`Packed ${word}! Choose another card.`);if(this.alive&&this.done===PEOPLE.length)this.complete();}
    choose(b){
      const word=b.dataset.word;
      if(this.kind==='pack'){
        if(b.classList.contains('u4-filled'))return;
        if(!this.selected){this.status('Choose a word card first.');feedback('retry',b);return;}
        if(word!==this.selected){this.errors++;b.dataset.state='wrong';this.status('Try another space.');feedback('retry',b);this.cue(['feedback/try-again'],null,'Try another space for your card.');setTimeout(()=>{if(this.alive)delete b.dataset.state},650);return;}
        const token=this.q(`[data-token="${this.selected}"]`);if(token)this.placeCard(b,token,word);return;
      }
      if(this.kind!=='meet'&&this.lastSolved===this.round)return;
      if(this.kind==='meet'||word===this.target.word)this.showPerson(b,word);
      if(this.kind!=='meet'&&word===this.target.word)this.lastSolved=this.round;
      if(this.kind==='meet'){this.target=person(word);this.cue([word],b,`Now say ${word}.`);this.task(word);this.status(`This is ${word}. Say it together.`);feedback('place',b);return;}
      if(this.kind==='pack'){if(!this.selected){this.status('Choose a word card first.');feedback('retry',b);return;}if(word!==this.selected){this.errors++;b.dataset.state='wrong';this.status('That card belongs with another person. Try again.');feedback('retry',b);this.cue(['feedback/try-again'],null,'Choose the matching family member.');setTimeout(()=>{if(b)this.qs('[data-state="wrong"]').forEach(x=>delete x.dataset.state)},520);return;}const token=this.q(`[data-token="${this.selected}"]`);token.dataset.placed='true';token.classList.add('correct');b.dataset.state='correct';this.done++;this.status(`Packed ${word}!`);const count=this.q('[data-u4-pack-count]');if(count)count.textContent=`${this.done} / 6 packed`;feedback('correct',b);this.cue(['feedback/well-done'],null,`Packed ${word}!`);if(token&&b){motion(token,{x:b.offsetLeft-token.offsetLeft,y:b.offsetTop-token.offsetTop,opacity:.1})}this.selected=null;if(this.done===PEOPLE.length)this.complete();return;}
      if(word!==this.target.word){this.errors++;b.dataset.state='wrong';this.status('Look again. Listen to the word once more.');feedback('retry',b);this.cue(['feedback/try-again',this.target.word],null,'Try again. Choose the matching family member.');setTimeout(()=>{if(b)delete b.dataset.state},520);return;}
      b.dataset.state='correct';b.dataset.active='false';this.done++;this.status(`Yes — ${word}!`);feedback('correct',b);this.cue(['feedback/well-done'],null,'Well done! Tap Next.');motion(b,{scale:1.08,y:-8});if(this.kind==='relay'){this.scores[this.team]++;const score=this.q(`[data-score="${this.team}"]`);if(score)score.textContent=this.scores[this.team];const racer=this.q('[data-u4-racer]');if(racer)racer.style.left=`${Math.min(78,12+this.scores[this.team]*11)}%`;}if(this.done>=PEOPLE.length)this.complete();
    }
    next(){if(this.done>=PEOPLE.length){this.complete();return}this.round++;this.target=(this.order||PEOPLE)[this.round%(this.order?.length||PEOPLE.length)];this.qs('[data-state]').forEach(x=>delete x.dataset.state);this.qs('[data-active]').forEach(x=>x.dataset.active='false');const target=this.q(`[data-word="${this.target.word}"]`);if(target)target.dataset.active='true';this.task(this.kind==='relay'?`${this.team==='blue'?'Blue':'Coral'} team: find ${this.target.word}.`:`Find ${this.target.word}.`);this.status('Listen, then choose.');this.cue([this.target.word],this.q('[data-u4-listen]'),'Now choose the matching family member.');const p=this.q('[data-u4-progress]');if(p)p.textContent=`${Math.min(this.round+1,PEOPLE.length)} / ${PEOPLE.length}`;}
    complete(){if(!this.alive)return;this.alive=false;const stars=this.errors===0?3:this.errors<=2?2:1;const reward=this.q('[data-u4-reward]');if(reward){reward.hidden=false;return;}const world=this.q('.u4-world');if(world)world.insertAdjacentHTML('beforeend',`<div class="u4-reward" data-u4-reward><div><h3>Family team!</h3><div class="u4-stars" aria-label="${stars} stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>${this.kind==='relay'?'The parade reached the picnic!':'You found all six family words.'}</p><button class="u4-btn primary" data-u4-restart>Play again</button></div></div>`);document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:KEY[this.kind],stars}}));feedback('complete',this.root);this.cue(['feedback/complete'],null,'You found all six family words.');}
    replay(){this.cue([this.target?.word||'instruction/meet'],this.q('[data-u4-listen]'),'Now choose the matching family member.');}
    restart(){const kind=this.kind;this.dispose();scene=new FamilyScene(kind)}
    dispose(){this.alive=false;this.cancelDrag();if(this.flying){window.gsap?.killTweensOf(this.flying);this.flying.remove()}stopVoice();matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change',this.reduce);els.gameScreen.classList.remove('u4-on');}
  }
  function start(kind){scene?.dispose();scene=new FamilyScene(kind);window.Unit4FamilyPark={current:()=>scene};}
  games.u4familymeet={enter:()=>start('meet')}; games.u4familyfind={enter:()=>start('find')}; games.u4familypack={enter:()=>start('pack')}; games.u4familyrelay={enter:()=>start('relay')};
  GAME_META.u4familymeet=['UNIT 4 · LESSON 1','Meet the Family','Listen · point · say'];
  GAME_META.u4familyfind=['UNIT 4 · LESSON 1','Family Finder','Listen · find · remember'];
  GAME_META.u4familypack=['UNIT 4 · LESSON 1','Pack the Picnic','Choose · place · collect'];
  GAME_META.u4familyrelay=['UNIT 4 · LESSON 1','Family Parade Relay','Take turns · race · say'];
  document.addEventListener('learning:leave-activity',()=>{scene?.dispose();scene=null});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVoice()});
})();
