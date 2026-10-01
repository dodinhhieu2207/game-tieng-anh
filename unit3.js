/* Unit 3 · Toy Town (Lesson 1: plane, puppet, robot, balloon, teddy)
   Loaded AFTER the main script in index.html. It only ADDS: a side-nav item, a #spaceUnit3 panel,
   GAME_META entries and games.u3* objects. Unit 2 / Letter Land code is not modified. */
(()=>{
'use strict';
if(typeof games==='undefined'||typeof GAME_META==='undefined'||typeof setStage==='undefined'){console.warn('Unit 3: host engine not found');return;}

const WORDS=['plane','puppet','robot','balloon','teddy'];
const COL={plane:['#4FB3F6','#D5EBB5'],puppet:['#3F8FEF','#BDE5FA'],robot:['#5BA3F0','#FAD7DF'],balloon:['#7CC7FB','#FDF2A8'],teddy:['#FDB92A','#DCCBF3']};
const LEVELS={easy:{label:'Easy',choices:3,pairs:3,preview:7},normal:{label:'Normal',choices:4,pairs:4,preview:5},challenge:{label:'Challenge',choices:5,pairs:5,preview:3}};
const GOAL=5, MISSING_GOAL=3;
const img=w=>`assets/unit3/toys/${w}.webp`, sil=w=>`assets/unit3/toys/${w}-sil.png`;
const vars=w=>`--b:${COL[w][0]};--p:${COL[w][1]}`;
const pick=(arr,n)=>shuffle([...arr]).slice(0,n);

/* ---------- state + storage ---------- */
const store={get(k,d){try{const v=localStorage.getItem('unit3.'+k);return v===null?d:v;}catch(e){return d;}},set(k,v){try{localStorage.setItem('unit3.'+k,v);}catch(e){}}};
const S={ask:0,allRun:0,practice:store.get('practice','0')==='1',level:LEVELS[store.get('level','normal')]?store.get('level','normal'):'normal',muted:store.get('muted','0')==='1',aud:null,tok:0,bad:new Set()};
const L=()=>LEVELS[S.level];
const alive=k=>currentGame===k;
let RUN=0;/* bumped on every (re)start so timers from an old round are ignored */
const later=(key,ms,fn)=>{const r=RUN;setTimeout(()=>{if(r===RUN&&alive(key))fn();},ms);};

/* ---------- audio (SFX + word voice; one mute switch controls both) ---------- */
function stopAudio(){S.tok++;S.ask++;if(S.aud){try{S.aud.pause();}catch(e){}S.aud=null;}cancelVoice();}
function sfx(name,vol=.7){if(S.muted||!els.soundFx.checked)return;try{const a=new Audio(`assets/unit3/sfx/${name}.mp3`);a.volume=vol;a.play().catch(()=>{});}catch(e){}}
/* Voice clips (Higgs TTS, pre-rendered): assets/unit3/audio/<name>.mp3 (or .wav). If a clip is missing the
   site's browser voice reads the fallback text, so nothing breaks while recordings are being added. */
function playClip(name,fallback,btn){
  return new Promise(resolve=>{
    if(S.muted){resolve();return;}
    stopAudio();const my=S.tok;let finished=false;
    const fin=()=>{if(finished)return;finished=true;if(btn)btn.classList.remove('playing');resolve();};
    if(btn)btn.classList.add('playing');
    const srcs=['mp3','wav'].map(e=>`assets/unit3/audio/${name}.${e}`).filter(s=>!S.bad.has(s));
    const next=()=>{
      if(my!==S.tok){fin();return;}
      const src=srcs.shift();
      if(!src){speakText(fallback,{interrupt:true}).then(fin);return;}
      const a=new Audio(src);S.aud=a;let used=false;
      const fail=e=>{if(used)return;used=true;if(e&&e.name==='NotAllowedError'){fin();return;}S.bad.add(src);next();};
      a.onerror=()=>fail();a.onended=fin;a.play().catch(fail);
    };
    next();
  });
}
const sayWord=(word,btn)=>playClip(word,word,btn);
function say(text,btn){return S.muted?Promise.resolve():speakText(text,{interrupt:true,button:btn||null});}

/* ---------- shared UI pieces ---------- */
function bar({modes=true}={}){
  return `<div class="u3-bar" role="group" aria-label="Game settings">${modes?`<button id="u3Mode" class="toy-button" type="button" aria-pressed="${S.practice}" title="Practice: no score, try as many times as you like">${S.practice?'🧸 Practice mode':'⭐ Play mode'}</button><label class="u3-lv"><span>Level</span><select id="u3Level" aria-label="Difficulty">${Object.entries(LEVELS).map(([k,v])=>`<option value="${k}"${k===S.level?' selected':''}>${v.label}</option>`).join('')}</select></label>`:''}<button id="u3Mute" class="toy-button" type="button" aria-pressed="${S.muted}">${S.muted?'🔇 Sound off':'🔊 Sound on'}</button></div>`;
}
function bindBar(restart){
  const m=document.getElementById('u3Mode'),l=document.getElementById('u3Level'),mu=document.getElementById('u3Mute');
  if(m)m.onclick=()=>{S.practice=!S.practice;store.set('practice',S.practice?'1':'0');restart();};
  if(l)l.onchange=()=>{S.level=l.value;store.set('level',S.level);restart();};
  if(mu)mu.onclick=()=>{S.muted=!S.muted;store.set('muted',S.muted?'1':'0');if(S.muted)stopAudio();mu.textContent=S.muted?'🔇 Sound off':'🔊 Sound on';mu.setAttribute('aria-pressed',String(S.muted));};
}
const frame=(title,intro,body,{modes=true,hud=''}={})=>{setBg(BG[title]||'classroom');return `<div class="unit3-toytown game-layout u3-layout"><div class="u3-top">${bar({modes})}${hud}</div><div class="game-intro"><h2>${title}</h2><p>${intro}</p></div>${body}</div>`;};
const hud=(round,goal,stars)=>S.practice?`<div class="u3-hud"><span class="u3-chip soft">🧸 Practice · no score</span></div>`:`<div class="u3-hud"><span class="u3-chip">⭐ ${stars}</span><span class="u3-chip soft">Round ${Math.min(round+1,goal)} / ${goal}</span></div>`;
const card=(w,{label=false,cls='',extra=''}={})=>`<button class="u3-card ${cls}" type="button" data-w="${w}" style="${vars(w)}" aria-label="${w}"><img src="${img(w)}" alt="">${label?`<span class="u3-label">${w}</span>`:''}${extra}</button>`;
function starsFor(mistakes){return mistakes<=1?3:mistakes<=4?2:1;}
function victory(key,{stars,msg,again}){
  sfx('complete');
  setBg(BG.victory);
  setStage(`<div class="unit3-toytown game-layout u3-layout"><div class="u3-victory"><img class="u3-trophy" src="assets/unit3/ui/trophy.webp" alt=""><img class="u3-confetti" src="assets/unit3/ui/confetti.webp" alt=""><div class="u3-stars" aria-label="${stars} of 3 stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h2>Toy Town champion!</h2><p>${msg}</p>${controlRow(buttonHTML('u3Again','PLAY AGAIN','reset','primary')+buttonHTML('u3Lib','GAME LIBRARY','home','secondary'))}</div></div>`);
  document.getElementById('u3Again').onclick=again;document.getElementById('u3Lib').onclick=()=>showHome();
  playClip('great_job','Great job!');
}
const BG={'Meet the Toys':'classroom','Listen & Catch':'meadow','Mystery Toy':'stage',"What's Missing?":'classroom','Match Picture–Word':'meadow',victory:'party'};
function setBg(name){const g=els.gameStage;if(!g)return;g.classList.add('u3-stage');g.style.setProperty('--u3-bg',`url(assets/unit3/bg/${name}.webp)`);}
function badge(el,ok){if(!el)return;const i=document.createElement('img');i.className='u3-badge';i.alt=ok?'Correct':'Try again';i.src=`assets/unit3/ui/badge-${ok?'check':'x'}.webp`;el.appendChild(i);if(!ok)setTimeout(()=>i.remove(),700);}
const setStatus=(text,kind='')=>{const s=document.getElementById('u3Status');if(s){s.textContent=text;s.className='u3-status '+kind;}};
const bursting=el=>{if(el&&typeof burst==='function'){let layer=el.querySelector('.particle-layer');if(!layer){layer=document.createElement('div');layer.className='particle-layer';el.appendChild(layer);}burst(layer,14);}};

/* =========================================================
   1. MEET THE TOYS
   ========================================================= */
games.u3learn={cur:'plane',seen:new Set(),
  enter(){RUN++;this.seen=new Set();this.cur=WORDS[0];this.render();restartCurrent=()=>{this.seen=new Set();this.cur=WORDS[0];this.render();this.speak();};replayCurrent=()=>this.speak();autoSpeak(()=>this.speak(),250);},
  render(){
    const w=this.cur;
    setStage(frame('Meet the Toys','Touch a toy to hear its name.',`<button id="u3Hero" class="u3-hero-card" type="button" style="${vars(w)}" aria-label="Hear ${w}"><img src="${img(w)}" alt="${w}"><span class="u3-label">${w}</span></button><div class="u3-grid u3-thumbs">${WORDS.map(x=>card(x,{cls:'small'+(x===w?' selected':''),extra:this.seen.has(x)?'<i class="u3-tick">✓</i>':''})).join('')}</div><div class="u3-status" id="u3Status">${this.seen.size}/5 toys met</div>${controlRow(buttonHTML('u3Hear','HEAR IT','speaker')+buttonHTML('u3All','HEAR ALL','headphones')+buttonHTML('u3NextToy','NEXT TOY','next','primary'))}`,{modes:false}));
    bindBar(()=>{});
    document.getElementById('u3Hero').onclick=()=>this.speak();
    document.getElementById('u3Hear').onclick=()=>this.speak();
    document.getElementById('u3NextToy').onclick=()=>this.go(WORDS[(WORDS.indexOf(this.cur)+1)%WORDS.length]);
    document.getElementById('u3All').onclick=()=>this.all();
    document.querySelectorAll('.u3-thumbs .u3-card').forEach(b=>b.onclick=()=>this.go(b.dataset.w));
  },
  go(w){S.allRun++;this.cur=w;this.render();this.speak();},
  async speak(){S.allRun++;const w=this.cur;sfx('click',.5);await sayWord(w,document.getElementById('u3Hero'));if(!alive('u3learn'))return;if(!this.seen.has(w)){this.seen.add(w);this.mark();}},
  mark(){const done=this.seen.size;setStatus(done>=5?'You met all the toys! ⭐':`${done}/5 toys met`,done>=5?'good':'');document.querySelectorAll('.u3-thumbs .u3-card').forEach(b=>{if(this.seen.has(b.dataset.w)&&!b.querySelector('.u3-tick'))b.insertAdjacentHTML('beforeend','<i class="u3-tick">✓</i>');});if(done===5){sfx('complete');}},
  async all(){const my=++S.allRun;for(const w of WORDS){if(!alive('u3learn')||S.allRun!==my)return;this.cur=w;this.render();await sayWord(w,document.getElementById('u3Hero'));if(!alive('u3learn')||S.allRun!==my)return;this.seen.add(w);await new Promise(r=>setTimeout(r,350));}if(alive('u3learn')&&S.allRun===my){this.render();this.mark();}}
};

/* =========================================================
   2. LISTEN & CATCH
   ========================================================= */
games.u3catch={queue:[],target:'',round:0,stars:0,mistakes:0,wrongNow:0,locked:true,
  enter(){this.start();restartCurrent=()=>this.start();replayCurrent=()=>this.prompt();},
  start(){RUN++;this.queue=[];this.round=0;this.stars=0;this.mistakes=0;this.next(true);},
  next(first){
    if(!this.queue.length)this.queue=shuffle([...WORDS]);
    this.target=this.queue.shift();this.wrongNow=0;this.locked=false;
    const n=L().choices,others=pick(WORDS.filter(w=>w!==this.target),n-1);
    this.choices=shuffle([this.target,...others]);
    this.render();autoSpeak(()=>this.prompt(),first?300:200);
  },
  render(){
    const easy=S.level==='easy';
    setStage(frame('Listen & Catch','Listen carefully. Touch the matching toy.',`${voiceButton('u3Prompt','LISTEN')}<div class="u3-grid n${this.choices.length}" id="u3Grid">${this.choices.map(w=>card(w,{label:easy})).join('')}</div><div class="u3-status" id="u3Status">Listen. Touch the toy.</div>${controlRow(buttonHTML('u3Again2','LISTEN AGAIN','speaker')+(S.practice?buttonHTML('u3Skip','NEXT TOY','next','primary'):''))}`,{hud:hud(this.round,GOAL,this.stars)}));
    bindBar(()=>this.start());
    document.getElementById('u3Prompt').onclick=()=>this.prompt();document.getElementById('u3Again2').onclick=()=>this.prompt();
    const sk=document.getElementById('u3Skip');if(sk)sk.onclick=()=>this.next(false);
    document.querySelectorAll('#u3Grid .u3-card').forEach(b=>b.onclick=()=>this.check(b));
  },
  prompt(){return playClip('touch_'+this.target,`Touch the ${this.target}.`,document.getElementById('u3Prompt'));},
  check(b){
    if(this.locked)return;
    if(b.dataset.w===this.target){
      this.locked=true;b.classList.add('correct');badge(b,true);bursting(b);sfx('correct');
      if(!this.wrongNow&&!S.practice)this.stars++;this.mistakes+=this.wrongNow;
      setStatus(`Yes! ${this.target}!`,'good');this.round++;
      playClip('yes_'+this.target,`Yes! It's a ${this.target}!`);
      later('u3catch',1500,()=>{if(!S.practice&&this.round>=GOAL)victory('u3catch',{stars:starsFor(this.mistakes),msg:`You caught all ${GOAL} toys!`,again:()=>this.start()});else this.next(false);});
    }else{
      this.wrongNow++;b.classList.add('wrong');badge(b,false);sfx('wrong_soft');setStatus('Try again!','retry');setTimeout(()=>b.classList.remove('wrong'),400);
      later('u3catch',500,()=>this.prompt());
      if(S.practice||this.wrongNow>=2)later(currentGame,900,()=>{const c=document.querySelector(`#u3Grid [data-w="${this.target}"]`);if(c)c.classList.add('hint');});
    }
  }
};

/* =========================================================
   3. MYSTERY TOY
   ========================================================= */
games.u3mystery={queue:[],target:'',stage:0,round:0,stars:0,mistakes:0,wrongNow:0,locked:true,
  enter(){this.start();restartCurrent=()=>this.start();replayCurrent=()=>this.prompt();},
  start(){RUN++;this.queue=[];this.round=0;this.stars=0;this.mistakes=0;this.next(true);},
  next(first){
    if(!this.queue.length)this.queue=shuffle([...WORDS]);
    this.target=this.queue.shift();this.wrongNow=0;this.locked=false;this.stage=S.level==='easy'?1:0;
    this.choices=shuffle([this.target,...pick(WORDS.filter(w=>w!==this.target),L().choices-1)]);
    this.render();autoSpeak(()=>this.prompt(),first?300:200);
  },
  stageImg(){const t=this.target;return this.stage===0?`<img class="toy" src="${sil(t)}" alt="Mystery toy shape">`:`<img class="toy s${this.stage}" src="${img(t)}" alt="${this.stage===3?t:'Mystery toy, not clear yet'}">`;},
  render(){
    setStage(frame('Mystery Toy',"What's in the toy box?",`${voiceButton('u3Prompt',"WHAT'S IN THE BOX?")}<div class="u3-mystery" id="u3Box"><img class="box" src="assets/unit3/ui/chest-open.webp" alt="">${this.stageImg()}${this.stage<3?'<span class="q" aria-hidden="true">?</span>':''}</div><div class="u3-status" id="u3Status">Look at the shape. Which toy is it?</div><div class="u3-grid n${this.choices.length}" id="u3Grid">${this.choices.map(w=>card(w)).join('')}</div>${controlRow(buttonHTML('u3More','SHOW MORE','star')+(S.practice?buttonHTML('u3Skip','NEXT TOY','next','primary'):''))}`,{hud:hud(this.round,GOAL,this.stars)}));
    bindBar(()=>this.start());
    document.getElementById('u3Prompt').onclick=()=>this.prompt();
    document.getElementById('u3More').onclick=()=>this.more();
    const sk=document.getElementById('u3Skip');if(sk)sk.onclick=()=>this.next(false);
    document.querySelectorAll('#u3Grid .u3-card').forEach(b=>b.onclick=()=>this.check(b));
  },
  prompt(){return playClip('whats_in_box',"What's in the toy box?",document.getElementById('u3Prompt'));},
  paint(){const box=document.getElementById('u3Box');if(!box)return;box.querySelector('.toy').outerHTML=this.stageImg();const q=box.querySelector('.q');if(q&&this.stage>=3)q.remove();},
  more(){if(this.locked||this.stage>=2)return;this.stage++;sfx('reveal');this.paint();if(this.stage>=2)document.getElementById('u3More').disabled=true;},
  check(b){
    if(this.locked)return;
    if(b.dataset.w===this.target){
      this.locked=true;this.stage=3;this.paint();b.classList.add('correct');badge(b,true);bursting(document.getElementById('u3Box'));sfx('correct');
      if(!this.wrongNow&&!S.practice)this.stars++;this.mistakes+=this.wrongNow;this.round++;
      setStatus(`It's a ${this.target}!`,'good');playClip('its_a_'+this.target,`It's a ${this.target}!`);
      later('u3mystery',1900,()=>{if(!S.practice&&this.round>=GOAL)victory('u3mystery',{stars:starsFor(this.mistakes),msg:'You guessed every mystery toy!',again:()=>this.start()});else this.next(false);});
    }else{
      this.wrongNow++;b.classList.add('wrong');badge(b,false);sfx('wrong_soft');setStatus('Not this one. Try again!','retry');setTimeout(()=>b.classList.remove('wrong'),400);
      if(S.practice&&this.stage<2){this.stage++;this.paint();}
    }
  }
};

/* =========================================================
   4. WHAT'S MISSING?
   ========================================================= */
games.u3missing={queue:[],order:[],missing:'',phase:'look',round:0,stars:0,mistakes:0,wrongNow:0,locked:true,timer:null,left:0,total:0,
  enter(){this.start();restartCurrent=()=>this.start();replayCurrent=()=>this.phase==='look'?this.intro():this.ask();},
  clear(){if(this.timer){clearInterval(this.timer);this.timer=null;}},
  start(){RUN++;this.clear();this.round=0;this.stars=0;this.mistakes=0;this.queue=[];this.next(true);},
  next(first){
    this.clear();if(!this.queue.length)this.queue=shuffle([...WORDS]);
    this.missing=this.queue.shift();this.order=shuffle([...WORDS]);this.wrongNow=0;this.locked=true;this.phase='look';this.total=L().preview;this.left=this.total;
    const shown=WORDS.filter(w=>w!==this.missing);
    this.choices=shuffle([this.missing,...pick(shown,L().choices-1)]);
    this.render();autoSpeak(()=>this.intro(),first?300:200);
  },
  slots(){
    if(this.phase==='look')return this.order.map(w=>`<div class="u3-slot" style="${vars(w)}"><img src="${img(w)}" alt="${w}"></div>`).join('');
    return this.order.map(w=>w===this.missing?`<div class="u3-slot empty${this.phase==='found'?' found':''}" id="u3Hole" aria-label="Empty place">${this.phase==='found'?`<img src="${img(w)}" alt="${w}">`:'?'}</div>`:`<div class="u3-slot"><img src="${img(w)}" alt="${w}"></div>`).join('');
  },
  render(){
    const look=this.phase==='look';
    setStage(frame("What's Missing?",look?'Look and remember all five toys.':'One toy has gone. Which one?',`${voiceButton('u3Prompt',look?'LOOK & REMEMBER':"WHAT'S MISSING?")}${look?`<div class="u3-timer" id="u3Timer" style="--pct:${this.left/this.total*100}" aria-label="${this.left} seconds"><b id="u3Sec">${this.left}</b></div>`:''}<div class="u3-board" id="u3Board">${this.slots()}</div><div class="u3-status" id="u3Status">${look?'Remember the toys…':'Touch the toy that is missing.'}</div>${look?'':`<div class="u3-grid n${this.choices.length}" id="u3Grid">${this.choices.map(w=>card(w)).join('')}</div>`}${controlRow(look?buttonHTML('u3Ready',"I'M READY",'next','primary'):buttonHTML('u3Again2','ASK AGAIN','speaker')+(S.practice?buttonHTML('u3Skip','NEXT ROUND','next','primary'):''))}`,{hud:hud(this.round,MISSING_GOAL,this.stars)}));
    bindBar(()=>this.start());
    document.getElementById('u3Prompt').onclick=()=>look?this.intro():this.ask();
    if(look)document.getElementById('u3Ready').onclick=()=>this.toGuess();
    else{document.getElementById('u3Again2').onclick=()=>this.ask();const sk=document.getElementById('u3Skip');if(sk)sk.onclick=()=>this.next(false);document.querySelectorAll('#u3Grid .u3-card').forEach(b=>b.onclick=()=>this.check(b));}
  },
  async intro(){if(this.phase!=='look')return;this.clear();await playClip('look_remember','Look and remember.',document.getElementById('u3Prompt'));if(!alive('u3missing')||this.phase!=='look')return;this.startTimer();},
  startTimer(){this.clear();this.left=this.total;this.tick();this.timer=setInterval(()=>{this.left--;this.tick();if(this.left<=0)this.toGuess();},1000);},
  tick(){const t=document.getElementById('u3Timer'),s=document.getElementById('u3Sec');if(s)s.textContent=Math.max(0,this.left);if(t)t.style.setProperty('--pct',Math.max(0,this.left)/this.total*100);},
  toGuess(){if(this.phase!=='look')return;this.clear();this.phase='guess';this.locked=false;if(S.level==='challenge')this.order=shuffle(this.order);this.render();sfx('reveal');autoSpeak(()=>this.ask(),180);},
  ask(){return playClip('whats_missing',"What's missing?",document.getElementById('u3Prompt'));},
  check(b){
    if(this.locked)return;
    if(b.dataset.w===this.missing){
      this.locked=true;this.phase='found';b.classList.add('correct');badge(b,true);sfx('correct');
      const hole=document.getElementById('u3Hole');if(hole){hole.classList.remove('empty');hole.classList.add('found');hole.innerHTML=`<img src="${img(this.missing)}" alt="${this.missing}">`;bursting(hole);}
      if(!this.wrongNow&&!S.practice)this.stars++;this.mistakes+=this.wrongNow;this.round++;
      setStatus(`The ${this.missing} was missing!`,'good');playClip('missing_'+this.missing,`Yes! The missing toy is the ${this.missing}.`);
      later('u3missing',2000,()=>{if(!S.practice&&this.round>=MISSING_GOAL)victory('u3missing',{stars:starsFor(this.mistakes),msg:`You found the missing toy in all ${MISSING_GOAL} rounds!`,again:()=>this.start()});else this.next(false);});
    }else{
      this.wrongNow++;b.classList.add('wrong');badge(b,false);sfx('wrong_soft');setStatus('Look at the empty place. Try again!','retry');setTimeout(()=>b.classList.remove('wrong'),400);
      if(S.practice||this.wrongNow>=2)later(currentGame,700,()=>{const c=document.querySelector(`#u3Grid [data-w="${this.missing}"]`);if(c)c.classList.add('hint');});
    }
  }
};

/* =========================================================
   5. MATCH PICTURE – WORD  (tap + tap, no dragging, no spelling)
   ========================================================= */
games.u3match={items:[],words:[],sel:null,matched:new Set(),mistakes:0,rounds:0,locked:false,
  enter(){this.start();restartCurrent=()=>this.start();replayCurrent=()=>playClip('touch_picture_word','Touch a picture. Then touch its word.');},
  start(){RUN++;this.rounds=0;this.mistakes=0;this.board();},
  board(){this.items=pick(WORDS,L().pairs);this.words=shuffle([...this.items]);this.sel=null;this.matched=new Set();this.locked=false;this.render();autoSpeak(()=>playClip('touch_picture_word','Touch a picture. Then touch its word.'),250);},
  render(){
    setStage(frame('Match Picture–Word','Touch a picture. Then touch its word.',`<div class="u3-pairs"><div class="u3-grid n${this.items.length}" id="u3Pics">${this.items.map(w=>card(w,{cls:this.matched.has(w)?'done':''})).join('')}</div><div class="u3-words" id="u3Words">${this.words.map(w=>`<button class="u3-word${this.matched.has(w)?' done':''}" type="button" data-w="${w}" style="${vars(w)}">${w}</button>`).join('')}</div></div><div class="u3-status" id="u3Status">Touch a picture, then its word.</div>`,{hud:S.practice?hud(0,1,0):`<div class="u3-hud"><span class="u3-chip">✔ ${this.matched.size} / ${this.items.length}</span></div>`}));
    bindBar(()=>this.start());
    document.querySelectorAll('#u3Pics .u3-card').forEach(b=>b.onclick=()=>this.tap('pic',b));
    document.querySelectorAll('#u3Words .u3-word').forEach(b=>b.onclick=()=>this.tap('word',b));
  },
  tap(kind,b){
    if(this.locked||b.classList.contains('done'))return;
    const w=b.dataset.w;
    if(kind==='word')sayWord(w);else sfx('click',.5);
    if(!this.sel||this.sel.kind===kind){
      document.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');this.sel={kind,w,b};
      setStatus(kind==='pic'?'Now touch its word.':'Now touch its picture.');return;
    }
    const first=this.sel;this.sel=null;
    document.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));
    if(first.w===w){
      this.matched.add(w);sfx('correct');document.querySelectorAll(`#u3Pics [data-w="${w}"]`).forEach(x=>badge(x,true));
      document.querySelectorAll(`[data-w="${w}"]`).forEach(x=>{x.classList.add('done','correct');});
      setStatus(`${w}! ✓`,'good');
      const hudChip=document.querySelector('.u3-hud .u3-chip');if(hudChip&&!S.practice)hudChip.textContent=`✔ ${this.matched.size} / ${this.items.length}`;
      if(this.matched.size===this.items.length){
        this.locked=true;
        later('u3match',1300,()=>{if(S.practice){this.board();}else victory('u3match',{stars:starsFor(this.mistakes),msg:'You matched every picture with its word!',again:()=>this.start()});});
      }
    }else{
      this.mistakes++;sfx('wrong_soft');
      [first.b,b].forEach(x=>{x.classList.add('wrong');if(x.classList.contains('u3-card'))badge(x,false);setTimeout(()=>x.classList.remove('wrong'),400);});
      setStatus('Not a match. Try again!','retry');
      if(S.practice){const c=document.querySelector(`#u3Pics [data-w="${first.kind==='pic'?first.w:w}"]`);if(c)setTimeout(()=>c.classList.add('hint'),500);}
    }
  }
};

/* ---------- metadata ---------- */
Object.assign(GAME_META,{
  u3learn:['UNIT 3 · LESSON 1','Meet the Toys','Look • listen • say'],
  u3catch:['UNIT 3 · GAME 1','Listen & Catch','Listen and touch the toy'],
  u3mystery:['UNIT 3 · GAME 2','Mystery Toy','Guess from the shape'],
  u3missing:['UNIT 3 · GAME 3',"What's Missing?",'Remember • spot • choose'],
  u3match:['UNIT 3 · GAME 4','Match Picture–Word','Touch the picture and its word']
});

/* ---------- Unit 3 space (side-nav item + home panel) ---------- */
const nav=document.querySelector('.side-nav'),wrap=document.querySelector('.space-wrap');
if(!nav||!wrap){console.warn('Unit 3: hub layout not found');return;}
const soon=nav.querySelector('.side-soon');
const navBtn=document.createElement('button');navBtn.className='side-item';navBtn.type='button';navBtn.dataset.space='unit3';
navBtn.innerHTML='<span class="side-icon u3-side" aria-hidden="true">U3</span><span class="side-copy"><b>Unit 3</b><em>Toy Town · Toys</em></span>';
if(soon)nav.insertBefore(navBtn,soon);else nav.appendChild(navBtn);
if(soon)soon.textContent='More units will appear here.';

const space=document.createElement('div');space.className='space unit3-toytown';space.id='spaceUnit3';space.hidden=true;
const tile=(game,cls,small,title,desc,pill,w)=>`<button class="activity-card u3 ${cls}" data-game="${game}" type="button"><span class="activity-card-copy"><small>${small}</small><b>${title}</b><em>${desc}</em><span class="play-pill">${pill}</span></span><img src="${img(w)}" alt=""></button>`;
space.innerHTML=`<div class="hero u3-hero"><div class="hero-copy"><div class="eyebrow">Family and Friends Starter · Unit 3</div><h1>Toy Town</h1><p>Meet the plane, puppet, robot, balloon and teddy. Listen, look, remember and match.</p><div class="hero-badges" aria-label="Unit skills"><span class="hero-badge">🧸 Toys</span><span class="hero-badge">👂 Listening</span><span class="hero-badge">🗣 Speaking</span></div></div><div class="hero-scene" aria-hidden="true">${WORDS.map(w=>`<img src="${img(w)}" alt="">`).join('')}</div></div>
<section class="learning-zone"><div class="library-heading"><div class="zone-title-row"><span class="zone-bubble">U3</span><div><h2>Lesson 1 · Toys</h2><p>Meet the five toys first, then play. Every game has Practice mode and three levels.</p></div></div><span class="library-count">1 lesson + 4 games</span></div>
<div class="activity-grid">${tile('u3learn','mint','Vocabulary lesson','Meet the Toys','Touch each toy and hear its name.','START','teddy')}${tile('u3catch','','Listening game','Listen & Catch','Hear a word and touch the right toy.','PLAY','plane')}${tile('u3mystery','warm','Guessing game','Mystery Toy','Guess the toy from its shape.','PLAY','puppet')}${tile('u3missing','mint','Memory game',"What's Missing?",'Remember five toys. Which one went away?','PLAY','robot')}${tile('u3match','','Picture and word','Match Picture–Word','Touch a picture, then its word.','MATCH','balloon')}</div></section>`;
wrap.appendChild(space);
space.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.game)));

/* other games must not inherit the Unit 3 background */
const baseOpen=window.openGame;
window.openGame=function(name){if(!String(name).startsWith('u3')&&els.gameStage){els.gameStage.classList.remove('u3-stage');els.gameStage.style.removeProperty('--u3-bg');}return baseOpen.apply(this,arguments);};

/* wrap setSpace so 'unit3' is a valid space; other spaces behave exactly as before */
const baseSetSpace=window.setSpace;
function setSpaceU3(name,opts={}){
  const {scroll=true}=opts;
  if(name==='unit3'){
    document.getElementById('spaceUnit2').hidden=true;
    const lt=document.getElementById('spaceLetters');if(lt)lt.hidden=true;
    space.hidden=false;
    document.querySelectorAll('.side-item').forEach(b=>b.classList.toggle('active',b.dataset.space==='unit3'));
    currentSpace='unit3';store.set('inSpace','1');try{localStorage.setItem('hubSpace','unit2');}catch(e){}
    if(scroll)window.scrollTo({top:0,behavior:'smooth'});
  }else{space.hidden=true;store.set('inSpace','0');baseSetSpace(name,opts);}
}
window.setSpace=setSpaceU3;
navBtn.addEventListener('click',()=>setSpaceU3('unit3'));
if(store.get('inSpace','0')==='1')setSpaceU3('unit3',{scroll:false});
})();
