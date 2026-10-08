/* Gg learning activities. Reuses the host router, actor, drag, trace and rewards engines. */
(()=>{
 'use strict';
 const E=[['meet-gg','u3ggmeet','Meet Gg','flashcards','recognition'],['sound-detective','u3ggsound','Sound Detective','listening','initial-sound'],['catch-g','u3ggcatch','Catch the G','question','visual-search'],['big-small','u3ggsort','Big G or small g?','matching','case-sort'],['fix-word','u3ggfix','Fix the Word','sentence','initial-letter'],['trace-say','u3ggtrace','Trace & Say','book','motor-trace'],['final-challenge','u3ggfinal','Final Challenge','question','grammar-transfer']];
 const TARGETS=['girl','guitar'],TOYS=['plane','puppet','robot','balloon','teddy'],LETTERS=['G','g'];
 const esc=window.escapeHTML,shuffle=arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 let current=null;const previous=new Map();
 function balanced(items,repeats=1,key=x=>String(x)){
  const pool=Array.from({length:repeats},()=>items).flat();
  const arrange=(rest,last)=>{if(!rest.length)return [];const tried=new Set();for(const x of shuffle(rest.map((v,i)=>({v,i})))){const k=key(x.v);if(k===last||tried.has(k))continue;tried.add(k);const next=arrange(rest.filter((_,i)=>i!==x.i),k);if(next)return [x.v,...next];}return null;};
  return arrange(pool,null)||shuffle(pool);
 }
 function makeRounds(kind,level){
  let rounds;
  if(kind==='meet-gg')rounds=balanced(['G','g','girl','guitar'],2).map(target=>({target}));
  if(kind==='sound-detective'){const positives=balanced(TARGETS,2),neg=shuffle(TOYS).slice(0,4);rounds=balanced([...positives,...neg]).map(target=>({target}));}
  if(kind==='catch-g')rounds=Array.from({length:4},()=>({target:'Gg',field:shuffle(['G','g',...shuffle(['E','e','F','f']).slice(0,level==='easy'?1:level==='practice'?2:4)])}));
  if(kind==='big-small')rounds=Array.from({length:2},()=>({cards:shuffle(['G','g','G','g'])}));
  if(kind==='fix-word')rounds=balanced(TARGETS,2).map(target=>({target}));
  if(kind==='trace-say'){const words=shuffle(TARGETS);rounds=LETTERS.map((target,i)=>({target,word:words[i]}));}
  if(kind==='final-challenge'){
   const shown=balanced([...TARGETS,...shuffle(TOYS).slice(0,2)],2),truth=balanced([true,false],4);
   rounds=shown.map((target,i)=>({target,asked:truth[i]?target:shuffle([...TARGETS,...TOYS].filter(w=>w!==target))[0],yes:truth[i],task:'grammar'}));
   rounds.splice(3,0,{target:'G',task:'letter'});rounds.push({target:'g',task:'letter'},{target:shuffle(TARGETS)[0],task:'sound'});
  }
  const signature=JSON.stringify(rounds),old=previous.get(kind);if(signature===old&&kind==='trace-say'){[rounds[0].word,rounds[1].word]=[rounds[1].word,rounds[0].word];}
  else if(signature===old&&rounds.length>1){
   for(let n=1;n<rounds.length;n++){const rotated=[...rounds.slice(n),...rounds.slice(0,n)];if(JSON.stringify(rotated)!==old&&!rotated.some((r,i)=>i&&r.target&&r.target===rotated[i-1].target)){rounds=rotated;break;}}
  }previous.set(kind,JSON.stringify(rounds));return rounds;
 }
 function picture(word){return word==='girl'?DATA.book.girlClose:word==='guitar'?'assets/unit3/lesson3/guitar.webp':'assets/unit3/toys/'+word+'.webp';}
 function visual(word,label=false){return /^[GEFgef]$/.test(word)?`<span class="g3-letter ${word==='g'?'g3-lower':''}">${word}</span>`:`<img src="${picture(word)}" alt="${word}" draggable="false">`;}
 function button(value,content,attrs=''){return `<button type="button" data-answer="${esc(value)}" ${attrs}>${content}</button>`;}
 TRACE_STROKES.G=['M105 45 C91 16 40 15 28 67 C12 123 45 156 91 137 L105 137 L105 94 L72 94'];
 // Reuse the existing single-storey g outline, with a separate descender stroke.
 TRACE_STROKES.g=['M101 72 C84 52 45 57 35 91 C26 124 59 147 88 130 C101 122 104 103 101 72','M101 72 L101 137 C101 158 82 164 61 155'];
 class GScene{
  constructor(kind,level='easy',role){
   this.kind=kind;this.entry=E.find(e=>e[0]===kind);this.level=level;this.role=role|| (LearningApp?.context()?.mode==='class'?'teacher':'student');this.rounds=makeRounds(kind,level);this.index=0;this.errors=0;this.independent=0;this.supported=0;this.epoch=0;this.destroyed=false;this.phase='idle';this.selected=null;
   cancelVoice();document.dispatchEvent(new Event('toybuddy:enter'));els.gameStage.classList.add('u3-stage');els.gameScreen.classList.add('u3-on');
   els.gameStage.style.setProperty('--u3-bg','url(assets/unit3/bg/classroom.webp)');
   setStage(`<section class="unit3-toytown g3-scene" data-experience-family="${this.entry[4]}" aria-label="${this.entry[2]}">
    <header class="g3-head"><h2>${this.entry[2]}</h2><div class="g3-settings"><label>Support <select data-level aria-label="Support level"><option value="easy">Easy</option><option value="practice">Practice</option><option value="challenge">Challenge</option></select></label><label>Mode <select data-role aria-label="Learner role"><option value="student">Student</option><option value="teacher">Teacher</option></select></label></div><span data-progress></span></header>
    <div class="g3-workspace"><aside class="g3-friend"><div class="g3-bubble" data-bubble></div><div data-actor></div><details data-teacher-notes><summary>Teacher guide</summary><p>Model the short initial sound in girl and guitar. The letter name is a separate recording.</p><label>Use a checked teacher sound <input data-sound-file type="file" accept="audio/*"></label><p data-sound-note>The teacher models the sound until a checked recording is supplied.</p></details></aside>
    <main class="g3-task"><p class="g3-instruction" data-instruction></p><div data-work></div></main></div>
    <footer class="g3-footer"><p data-status role="status" aria-live="polite"></p><div>${kind==='trace-say'?'<button type="button" data-clear-trace>Trace again</button>':''}<button type="button" data-replay>Listen again</button><button type="button" data-next disabled>Next</button></div></footer><div data-result hidden></div></section>`);
   this.root=els.gameStage.querySelector('.g3-scene');this.$=selector=>this.root.querySelector(selector);this.actor=new ToyBuddy(this.$('[data-actor]'),{onAudioError:()=>{if(!this.destroyed){this.status('Tap Listen again to hear the audio.');}}});this.actor.pose.alt='Your learning friend';
   this.$('[data-level]').value=level;this.$('[data-role]').value=this.role;
   this.$('[data-level]').onchange=e=>enter(kind,e.target.value,this.role);
   this.$('[data-role]').onchange=e=>enter(kind,this.level,e.target.value);
   this.$('[data-sound-file]').onchange=e=>{const f=e.target.files[0];if(!f||!f.type.startsWith('audio/')||f.size>5000000){this.$('[data-sound-note]').textContent='Choose a short audio file under 5 MB.';return;}if(this.soundURL)URL.revokeObjectURL(this.soundURL);this.soundURL=URL.createObjectURL(f);this.$('[data-sound-note]').textContent='Teacher sound ready for this activity. Listen and check before using.';};
   this.$('[data-replay]').onclick=()=>this.prompt();this.$('[data-next]').onclick=()=>this.next();
   this.onClick=e=>this.click(e);this.root.addEventListener('click',this.onClick);
   this.dragEngine=ActivityDrag.bind(this.root,{enabled:()=>this.phase==='listening',pick:b=>{this.selected=b.dataset.card;this.root.querySelectorAll('[data-card]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));},drop:(b,z)=>this.place(b,z)});
   this.hide=()=>{if(document.hidden){this.epoch++;this.actor.stopAudio();this.dragEngine.cancel();if(this.phase!=='complete'&&this.phase!=='resolved'){this.phase='idle';this.status('Tap Listen again when you are ready.');this.refresh();}}};document.addEventListener('visibilitychange',this.hide);
   // The shell pauses tracked media on mute. Resolve that paused cue so the task remains usable silently.
   this.mute=()=>{if(LearningApp?.isMuted()&&this.actor.audio){this.actor.audio.pause();this.actor.audio.dispatchEvent(new Event('ended'));}};document.addEventListener('toybuddy:enter',this.mute);
   this.root.dataset.role=this.role;this.$('[data-teacher-notes]').hidden=this.role!=='teacher';
   restartCurrent=()=>enter(kind,this.level,this.role);replayCurrent=()=>this.prompt();this.render();
  }
  alive(t){return !this.destroyed&&this.root.isConnected&&t===this.epoch;}
  status(text){this.$('[data-status]').textContent=text;}
  clip(key){const own=window.Unit3Lesson3Clips?.clips;return own?.[key]||window.Unit3Lesson2Clips?.clips[key]||(TOYS.includes(key)?{src:'assets/unit3/audio/'+key+'.mp3',cues:[],text:key}:null);}
  async speak(key,t=this.epoch){
   if(LearningApp?.isMuted()){this.actor.setState('IDLE');return this.alive(t);}
   const c=this.clip(key);if(!c){this.status('Audio is missing. Tap Listen again after restoring the lesson files.');this.audioMissing=true;return false;}
   const hideText=(this.kind==='sound-detective'&&this.level!=='easy')||(this.kind==='meet-gg'&&this.level==='challenge')||(this.kind==='final-challenge'&&this.level==='challenge');
   this.$('[data-bubble]').textContent=hideText?'Listen carefully!':c.text;const result=await this.actor.play(c.src,{cues:c.cues,state:'TALKING',endState:'LISTENING'});return result&&this.alive(t);
  }
  refresh(){
   this.root.dataset.phase=this.phase;this.root.dataset.level=this.level;
   this.root.querySelectorAll('[data-answer],[data-card],[data-zone],[data-reverse],[data-checked],[data-try],[data-sound-model]').forEach(b=>b.disabled=this.phase!=='listening');
   this.$('[data-next]').disabled=this.phase!=='resolved';this.$('[data-replay]').disabled=['checking','asking','complete'].includes(this.phase);
   this.$('[data-level]').disabled=['asking','checking'].includes(this.phase);this.$('[data-role]').disabled=['asking','checking'].includes(this.phase);
   this.root.querySelectorAll('.g3-trace-board svg').forEach(s=>s.style.pointerEvents=this.phase==='listening'?'auto':'none');
   this.locked=this.phase!=='listening';
  }
  options(list,labels=false){return `<div class="g3-options">${shuffle(list).map(w=>button(w,visual(w,labels)+(labels&&!LETTERS.includes(w)?`<b>${w}</b>`:''),`aria-label="${LETTERS.includes(w)?(w==='G'?'Capital G':'Lowercase g'):w}"`)).join('')}</div>`;}
  render(){
   this.epoch++;this.actor.stopAudio();this.dragEngine.cancel();this.round=this.rounds[this.index];this.phase='idle';this.roundWrong=false;this.roundSupported=false;this.selected=null;this.$('[data-result]').hidden=true;
   this.$('[data-progress]').textContent=`${this.index+1} / ${this.rounds.length}`;const w=this.round.target;
   let html='',instruction='',bubble='G g';
   if(this.kind==='meet-gg'){
    instruction='Listen. Find the matching letter or picture.';
    html=`<div class="g3-model" ${this.level==='challenge'?'hidden':''}>${this.level==='easy'?visual(w,true):'<span class="g3-ear">♪</span>'}</div>`+this.options(LETTERS.includes(w)?LETTERS:TARGETS,this.level==='easy')+'<button type="button" class="g3-sound-button" data-sound-model>Hear the sound with your teacher</button>';
   }
   if(this.kind==='sound-detective'){
    instruction='Listen. Does it start like girl and guitar?';html=`<div class="g3-listen-picture" ${this.level==='easy'?'':'hidden'}>${visual(w,true)}${this.level==='easy'?`<b>${w}</b>`:''}</div><div class="g3-decision">${button('yes','<strong>G</strong><span>G sound</span>')}${button('no','<strong>↗</strong><span>Not G sound</span>')}</div>`;
   }
   if(this.kind==='catch-g'){
    instruction='Find both G and g. Leave E and F.';this.caught=new Set();html=`<div class="g3-catch ${this.level==='challenge'?'g3-moving':''}">${this.round.field.map((c,i)=>button(String(i),visual(c),`data-letter="${c}" style="--float-delay:${i*.3}s" aria-label="${c===c.toUpperCase()?'Capital':'Lowercase'} ${c.toUpperCase()}"`)).join('')}</div><p class="g3-small" data-catch-count>0 / 2 found</p>`;
   }
   if(this.kind==='big-small'){
    instruction='Move each letter into its home.';this.placed=new Set();html=`<div class="g3-homes">${LETTERS.map((c,i)=>`<button type="button" class="l2-drop g3-home" data-zone="${c}" data-slot="${i}" data-ff-drop><b>${c==='G'?'Big G':'small g'}</b>${this.level==='easy'?`<span class="g3-ghost">${c}</span>`:''}<span data-home-count>0</span></button>`).join('')}</div><div class="g3-bank">${this.round.cards.map((c,i)=>`<button type="button" class="l2-draggable" data-card="${i}" data-value="${c}" aria-pressed="false" aria-label="${c==='G'?'Capital G':'Lowercase g'}">${c}</button>`).join('')}</div>`;
   }
   if(this.kind==='fix-word'){
    instruction='Find the missing first letter.';html=`<div class="g3-word-picture" ${this.level==='challenge'?'hidden':''}>${visual(w,true)}</div><div class="g3-word"><button type="button" class="l2-drop g3-gap" data-zone="g" data-slot="0" aria-label="Missing first letter">${this.level==='easy'?'<span class="g3-ghost">g</span>':'?'}</button><span>${w.slice(1)}</span></div><div class="g3-bank">${shuffle(this.level==='easy'?['g','e']:['g','e','f']).map((c,i)=>`<button type="button" class="l2-draggable" data-card="${i}" data-value="${c}" aria-pressed="false">${c}</button>`).join('')}</div>`;
   }
   if(this.kind==='trace-say'){
    instruction='Start at the dot. Follow the path.';html=`<div class="g3-trace-board">${traceCardHTML(w,0)}${this.level==='easy'?'<span class="g3-direction" aria-hidden="true">Follow the yellow dot →</span>':''}</div><p id="traceStatus">Start at the yellow dot.</p>`;
   }
   if(this.kind==='final-challenge'){
    if(this.round.task==='grammar'){
     bubble=`Is it a ${this.round.asked}?`;instruction=this.role==='teacher'?'Listen. Say the whole answer.':'Listen. Say, then choose the whole answer.';
     html=`<div class="g3-final-picture">${visual(w,true)}</div><p class="g3-question" ${this.level==='challenge'?'hidden':''}>${bubble}</p><div class="g3-decision">${button('yes','Yes, it is.')}${button('no',"No, it isn't.")}</div>${this.role==='teacher'?'<p class="g3-small">Teacher: select the answer the child said.</p>':''}${this.level==='challenge'?'<button type="button" data-reverse>Your turn to ask</button>':''}`;
    }else if(this.round.task==='letter'){instruction='Listen. Find the letter.';html=this.options(LETTERS);}
    else{instruction='Which picture starts with the G sound?';html=this.options([w,shuffle(TOYS)[0]]);}
   }
   this.$('[data-instruction]').textContent=instruction;this.$('[data-work]').innerHTML=html;this.$('[data-bubble]').textContent=bubble;this.status('Ready to listen.');this.refresh();this.prompt();
  }
  async prompt(){
   if(this.destroyed||['checking','complete','asking'].includes(this.phase))return;
   const resolved=this.phase==='resolved',t=++this.epoch;this.actor.stopAudio();this.phase='asking';this.audioMissing=false;this.refresh();
   let keys=[];const r=this.round,w=r.target;
   if(this.kind==='meet-gg')keys=['meet',w==='G'?'capital-g':w==='g'?'lowercase-g':w];
   else if(this.kind==='sound-detective')keys=['detective',w];
   else if(this.kind==='catch-g')keys=['catch'];
   else if(this.kind==='big-small')keys=['sort'];
   else if(this.kind==='fix-word')keys=['fix',w];
   else if(this.kind==='trace-say')keys=['trace',w==='G'?'capital-g':'lowercase-g'];
   else if(r.task==='grammar')keys=['final',TARGETS.includes(r.asked)?'is-'+r.asked:'questions/is_it_a_'+r.asked];
   else if(r.task==='letter')keys=[w==='G'?'capital-g':'lowercase-g'];else keys=['detective'];
   for(const key of keys)if(!await this.speak(key,t)){if(this.alive(t)){this.phase='idle';this.refresh();}return;}
   if(!this.alive(t))return;this.phase=resolved?'resolved':'listening';this.status(resolved?'Well done! Tap Next when you are ready.':this.kind==='trace-say'?'Follow the moving dot.':'Your turn!');this.refresh();
   if(this.kind==='trace-say'){const card=this.$('[data-trace-card]');if(card&&!card.dataset.bound)bindTraceCard(this,card);}
  }
  click(e){
   const b=e.target.closest('button');if(!b||b.disabled)return;
   if(b.dataset.complete){this.completion(b.dataset.complete);return;}
   if(b.hasAttribute('data-clear-trace')){this.render();return;}
   if(this.phase!=='listening')return;
   if(b.hasAttribute('data-sound-model')){this.modelSound();return;}
   if(b.hasAttribute('data-reverse')){this.reverse();return;}
   if(b.hasAttribute('data-checked')){this.check(true,'feedback/great_job',true);return;}
   if(b.hasAttribute('data-try')){this.status('Good try! Listen, then ask again.');this.speak('feedback/your_turn');return;}
   if(b.dataset.card!==undefined){if(this.suppressClick){this.suppressClick=false;return;}this.selected=b.dataset.card;this.root.querySelectorAll('[data-card]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));this.status('Now tap the matching home.');return;}
   if(b.dataset.zone!==undefined){const item=this.root.querySelector(`[data-card="${this.selected}"]`);if(item)this.place(item,b);else this.status('Choose a letter first.');return;}
   if(b.dataset.answer===undefined)return;const value=b.dataset.answer,r=this.round;
   if(this.kind==='catch-g'){
    const c=this.round.field[Number(value)];if(!LETTERS.includes(c)){this.check(false);return;}if(this.caught.has(value))return;this.caught.add(value);b.dataset.caught='true';b.setAttribute('aria-pressed','true');b.hidden=true;LearningFeedback?.play('place',b);this.$('[data-catch-count]').textContent=`${this.caught.size} / 2 found`;if(this.caught.size===2)this.check(true);return;
   }
   let correct=this.kind==='sound-detective'?(value==='yes')===TARGETS.includes(r.target):this.kind==='final-challenge'&&r.task==='grammar'?(value==='yes')===r.yes:value===r.target;
   const key=this.kind==='final-challenge'&&r.task==='grammar'?(r.yes?'answers/yes_it_is':'answers/no_it_isnt'):LETTERS.includes(r.target)?(r.target==='G'?'capital-g':'lowercase-g'):r.target;
   this.check(correct,key,this.kind==='final-challenge'&&this.role==='teacher'&&r.task==='grammar');
  }
  place(item,zone){
   if(this.phase!=='listening'||item.hidden)return;const correct=item.dataset.value===zone.dataset.zone;
   if(!correct){this.selected=null;this.check(false);return;}this.selected=null;item.hidden=true;zone.classList.add('g3-filled');LearningFeedback?.play('place',zone);
   if(this.kind==='fix-word'){zone.textContent='g';this.check(true,this.round.target);}
   else{this.placed.add(item.dataset.card);zone.querySelector('[data-home-count]').textContent=[...this.root.querySelectorAll('[data-card]')].filter(c=>c.hidden&&c.dataset.value===zone.dataset.zone).length;if(this.placed.size===this.round.cards.length)this.check(true,'feedback/great_job');else this.status('Lovely! Find the next home.');}
  }
  updateTraceProgress(ratio){if(!this.alive(this.epoch)||this.phase!=='listening')return;this.$('#traceStatus').textContent=ratio<.6?'Keep following the path.':'Nearly there!';}
  async modelSound(){
   const t=this.epoch;this.phase='asking';this.refresh();
   if(this.soundURL){await this.actor.play(this.soundURL,{state:'TALKING',endState:'LISTENING'});}
   else await this.speak('sound-teacher',t);
   if(this.alive(t)){this.phase='listening';this.status(this.soundURL?'Listen, then say the sound.':'Listen to your teacher. Say the sound together.');this.refresh();}
  }
  async finishLetter(card){
   if(this.destroyed||this.phase!=='listening'||card.classList.contains('done'))return;card.classList.add('done');card.classList.remove('active');this.phase='checking';this.refresh();const t=this.epoch;
   if(!await this.speak(this.round.word,t)||!await this.speak('say',t))return;
   if(!this.alive(t))return;this.$('[data-work]').innerHTML=`<div class="g3-say-picture">${visual(this.round.word,true)}<b>${this.round.word}</b></div><p>Your turn. Say the word.</p><button type="button" data-checked>${this.role==='teacher'?'Teacher: heard the word':'I said the word'}</button>`;this.phase='listening';this.status('Say it with your learning friend.');this.refresh();
  }
  async reverse(){
   this.phase='asking';this.refresh();const t=this.epoch;if(!await this.speak('feedback/your_turn',t))return;
   const models=[...TARGETS,...TOYS];this.$('[data-work]').innerHTML=`<div class="g3-final-picture">${visual(this.round.target,true)}</div><p class="g3-question">Your turn to ask</p><p>Is it a …?</p><details><summary>Teacher: check the question</summary><p>Select the object the child asked about.</p><div class="g3-question-bank">${models.map(w=>`<button type="button" data-asked="${w}">${w}</button>`).join('')}</div></details>`;
   this.root.querySelectorAll('[data-asked]').forEach(b=>b.onclick=async()=>{if(this.phase!=='listening')return;this.phase='checking';this.refresh();const yes=b.dataset.asked===this.round.target;this.roundSupported=true;await this.speak(yes?'answers/yes_it_is':'answers/no_it_isnt',t);if(this.alive(t)){this.phase='listening';this.check(true,'feedback/great_job',true);}});this.phase='listening';this.status('Ask a full question. Your teacher will check it.');this.refresh();
  }
  async check(correct,key='feedback/great_job',supported=false){
   if(this.phase!=='listening')return;this.phase='checking';this.refresh();const t=this.epoch;
   if(!correct){this.errors++;this.roundWrong=true;this.status('Good try! Listen and try again.');await this.speak('feedback/try_again',t);if(this.alive(t)){LearningFeedback?.play('retry',this.$('[data-work]'));this.phase='listening';this.refresh();}return;}
   this.roundSupported=this.roundSupported||supported;
   if(!await this.speak(key,t)){if(this.alive(t)){if(this.roundSupported)this.supported++;else if(!this.roundWrong)this.independent++;this.phase='resolved';this.status('Correct. Audio is unavailable. Try Listen again, or tap Next.');this.refresh();}return;}
   if(this.roundSupported)this.supported++;else if(!this.roundWrong)this.independent++;
   if(this.kind==='sound-detective')this.$('.g3-listen-picture').hidden=false;
   LearningFeedback?.play('correct',this.$('[data-work]'));this.actor.setState('CELEBRATE');this.phase='resolved';this.status('Well done! Tap Next when you are ready.');this.refresh();
  }
  next(){if(this.phase!=='resolved')return;if(++this.index>=this.rounds.length)this.complete();else this.render();}
  complete(){
   const stars=this.errors===0?3:this.errors<=Math.ceil(this.rounds.length/3)?2:1;this.phase='complete';this.refresh();this.root.classList.add('g3-complete');
   document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:this.entry[1],stars}}));
   this.$('[data-result]').hidden=false;this.$('[data-result]').innerHTML=`<div class="g3-result"><h2>Lovely learning!</h2><div class="g3-stars" aria-label="${stars} stars">${'★'.repeat(stars)}</div><p>${this.rounds.length} rounds finished</p>${this.supported?`<p>${this.supported} ${this.role==='teacher'?'teacher-supported':'say-and-check practice'} rounds</p>`:''}<div><button type="button" data-complete="again">Play again</button><button type="button" data-complete="next">${this.kind==='final-challenge'?'Choose activities':'Next activity'}</button><button type="button" data-complete="activities">Activities</button></div></div>`;
   this.status('Your stars are saved.');LearningFeedback?.play('reward',this.$('[data-result]'));this.speak('feedback/great_job');
  }
  completion(action){const mode=LearningApp.context()?.mode||'practice',next=E[E.findIndex(e=>e[0]===this.kind)+1];if(action==='again')enter(this.kind,this.level,this.role);else LearningApp.go('#/unit/3/lesson/3?mode='+mode+(action==='next'&&next?'&activity='+next[0]:''));}
  dispose(){if(this.destroyed)return;this.destroyed=true;this.epoch++;this.actor.destroy();this.dragEngine.destroy();document.removeEventListener('visibilitychange',this.hide);document.removeEventListener('toybuddy:enter',this.mute);this.root.removeEventListener('click',this.onClick);this.root.querySelectorAll('svg').forEach(s=>{s.onpointerdown=s.onpointermove=s.onpointerup=s.onpointercancel=null;});if(this.soundURL)URL.revokeObjectURL(this.soundURL);if(current===this)current=null;}
 }
 function enter(kind,level,role){current?.dispose();current=new GScene(kind,level,role);}
 E.forEach(([id,game,title])=>{games[game]={enter:()=>enter(id)};GAME_META[game]=['UNIT 3 · LESSON 3',title,'G g · girl · guitar'];});
 window.Unit3Lesson3={entries:E,current:()=>current,makeRounds};
 document.addEventListener('learning:leave-activity',()=>current?.dispose());
})();
