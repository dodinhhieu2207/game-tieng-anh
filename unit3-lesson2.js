/* Six Lesson 2 activities, using the host registry, original toys and the single ToyBuddy actor. */
(()=>{
 'use strict';
 const WORDS=['plane','puppet','robot','balloon','teddy'];
 const ENTRIES=[['meet-pattern','u3pattern','Meet the Pattern'],['question-detective','u3detective','Question Detective'],['match-answer','u3answer','Match the Answer'],['build-sentence','u3sentence','Build the Sentence'],['listen-decide','u3decide','Listen & Decide'],['talk-to-toy-buddy','u3buddy','Talk to Toy Buddy']];
 const TYPES=['NAME','YES / NO','COLOR','NUMBER'];
 const TYPE_ICONS=['flashcards','question','colour','numbers'];
 const esc=window.escapeHTML;
 const mix=items=>{const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
 const toy=w=>'assets/unit3/toys/'+w+'.webp';
 const question=w=>'Is it a '+w+'?';
 const answer=yes=>yes?'Yes, it is.':"No, it isn't.";
 const answerClip=yes=>'answers/'+(yes?'yes_it_is':'no_it_isnt');
 function rounds(){return mix(WORDS.flatMap(shown=>[true,false].map(yes=>({shown,asked:yes?shown:mix(WORDS.filter(w=>w!==shown))[0],yes}))));}
 function evaluateSpeech(text,yes){
  const result=ToySpeechEvaluator.evaluate(text,'robot',yes?'robot':'teddy').result;
  return {CORRECT:'correct',INCOMPLETE:'partial',WRONG_LOGIC:'logical',UNCLEAR:'unclear'}[result];
 }
 let scene=null;
 const api=window.Unit3Lesson2={entries:ENTRIES,words:WORDS,evaluateSpeech,recognitionAdapter:window.Unit3Speech?.available?window.Unit3Speech:null,current:()=>scene};
 class LessonScene {
  get currentGame(){return this.entry[1];}get currentRound(){return this.index+1;}get score(){return this.firstCorrect;}get soundEnabled(){return !window.LearningApp?.isMuted();}get isQuestionPlaying(){return this.phase==='asking';}get isInputEnabled(){return this.phase==='listening';}get characterState(){return this.buddy.state;}get currentToy(){return this.round.shown;}get questionToy(){return this.round.asked;}get correctAnswer(){return this.round.yes;}get difficulty(){return this.level;}
  constructor(kind){
   this.kind=kind;this.entry=ENTRIES.find(e=>e[0]===kind);this.destroyed=false;this.run=0;this.phase='idle';this.index=0;this.errors=0;this.attempts=0;this.firstCorrect=0;this.roundWrong=false;this.level='easy';this.sounds=new Set();this.drag=null;this.recognition=null;
   this.rounds=rounds();
   if(kind==='meet-pattern'){const shown=mix([...WORDS,...mix(WORDS).slice(0,3)]),truth=mix([true,true,true,true,false,false,false,false]);this.rounds=mix(shown.map((w,i)=>({shown:w,asked:truth[i]?w:mix(WORDS.filter(x=>x!==w))[0],yes:truth[i]})));}
   if(kind==='question-detective')this.rounds=mix([...WORDS.map(w=>({shown:w,asked:w,category:'YES / NO',clip:'questions/is_it_a_'+w,text:question(w)})),{shown:'puppet',category:'NAME',clip:'questions/whats_this',text:"What's this?"},{shown:'balloon',category:'COLOR',clip:'questions/what_color',text:'What color is it?'},{shown:'teddy',category:'NUMBER',clip:'questions/how_many',text:'How many?'}]);
   if(kind==='build-sentence')this.rounds=[...mix(WORDS).map(w=>({shown:w,asked:w,yes:true,form:'question'})),{shown:'robot',asked:'robot',yes:true,form:'positive'},{shown:'teddy',asked:'robot',yes:false,form:'negative'}];
   cancelVoice();document.dispatchEvent(new Event('toybuddy:enter'));
   els.gameStage.classList.add('u3-stage');els.gameScreen.classList.add('u3-on');els.gameStage.style.setProperty('--u3-bg','url(assets/unit3/bg/classroom.webp)');
   setStage(`<section class="unit3-toytown l2-scene" aria-label="${this.entry[2]}">
    <header class="l2-head"><h2>${this.entry[2]}</h2><label class="l2-level" ${['build-sentence','talk-to-toy-buddy'].includes(kind)?'':'hidden'}>Support <select id="l2Level" aria-label="Support level"><option value="easy">Easy</option><option value="practice">Practice</option><option value="challenge">Challenge</option></select></label><span id="l2Progress"></span></header>
    <div class="l2-playground"><div class="l2-friend"><div id="l2Bubble" class="l2-bubble"></div><div id="l2Actor"></div></div><div class="l2-task"><div class="l2-picture"><img id="l2Toy" alt=""><span id="l2Question"></span></div><p id="l2Instruction"></p><div id="l2Interaction"></div></div></div>
    <p id="l2Status" role="status" aria-live="polite"></p><div class="l2-round-controls"><button id="l2Replay" type="button">Replay Question</button><button id="l2Next" type="button" disabled>Next</button></div>
    <div id="l2Result" hidden></div></section>`);
   this.root=els.gameStage.querySelector('.l2-scene');this.ui={};['Bubble','Progress','Toy','Question','Instruction','Interaction','Status','Replay','Next','Result','Level'].forEach(n=>this.ui[n]=this.root.querySelector('#l2'+n));
   this.buddy=new ToyBuddy(this.root.querySelector('#l2Actor'),{onStateChange:state=>{this.root.dataset.state=state;},onAudioError:()=>{if(!this.destroyed){this.phase='audio-error';this.status('Audio could not play. Tap Replay Question to try again.');this.refresh();}}});
   this.ui.Replay.onclick=()=>this.prompt();this.ui.Next.onclick=()=>this.next();
   this.ui.Level.onchange=()=>{this.level=this.ui.Level.value;this.setRound(true);};
   this.root.addEventListener('click',e=>this.click(e));
   this.root.addEventListener('pointerdown',e=>this.pointerDown(e));this.root.addEventListener('pointermove',e=>this.pointerMove(e));this.root.addEventListener('pointerup',e=>this.pointerUp(e));this.root.addEventListener('pointercancel',()=>this.cancelDrag());
   this.observer=new MutationObserver(()=>{if(!this.root.isConnected||currentGame!==this.entry[1]||!els.gameScreen.classList.contains('active'))this.dispose();});
   this.observer.observe(els.gameStage,{childList:true});this.observer.observe(els.gameScreen,{attributes:true,attributeFilter:['class']});
   this.hideListener=()=>{if(document.hidden&&!this.destroyed){this.run++;this.stopRecognition();this.phase='audio-error';this.buddy.stopAudio();this.buddy.setState('IDLE');this.status('Tap Replay Question when you are ready.');this.refresh();}};
   document.addEventListener('visibilitychange',this.hideListener);
   restartCurrent=()=>enter(kind);replayCurrent=()=>this.prompt();this.setRound();
  }
  status(text){this.ui.Status.textContent=text;}
  active(token){return !this.destroyed&&token===this.run&&scene===this;}
  refresh(){
   const listening=this.phase==='listening';this.root.dataset.phase=this.phase;
   this.root.querySelectorAll('[data-choice],[data-category],[data-tile],[data-match],#l2Mic,[data-teacher],[data-validate]').forEach(b=>b.disabled=!listening);
   const busy=['starting','recording','processing'].includes(this.phase);
   if(this.phase==='recording')this.root.querySelector('#l2Mic').disabled=false;
   this.ui.Next.disabled=this.phase!=='resolved';this.ui.Replay.disabled=busy||['asking','checking','complete'].includes(this.phase);this.ui.Level.disabled=busy||['asking','checking','resolved','complete'].includes(this.phase);
  }
  clip(key){return window.Unit3Lesson2Clips?.clips[key];}
  async speak(key,token,{asking=false,endState='IDLE'}={}){
   const clip=this.clip(key);if(!clip){this.phase='audio-error';this.status('The lesson audio is missing. Please restore the audio files.');this.refresh();return false;}
   const ok=await this.buddy.play(clip.src,{cues:clip.cues,state:asking?'ASKING':'TALKING',playingState:asking?'TALKING':null,endState});return ok&&this.active(token);
  }
  async sfx(name,token){
   if(!els.soundFx.checked||window.LearningApp?.isMuted())return this.active(token);
   const a=new Audio('assets/unit3/sfx/'+name+'.mp3');this.sounds.add(a);
   const ok=await new Promise(resolve=>{const done=()=>{this.sounds.delete(a);resolve(this.active(token));};a.addEventListener('ended',done,{once:true});a.addEventListener('error',done,{once:true});a.play().catch(done);this.sfxDone=()=>{a.pause();resolve(false);};});return ok;
  }
  stopRecognition(){this.recognition?.cancel?.();this.recognition=null;}
  resetAudio(){this.run++;this.stopRecognition();this.cancelDrag();this.buddy.stopAudio();this.sounds.forEach(a=>a.pause());this.sounds.clear();this.sfxDone?.();this.sfxDone=null;}
  setRound(preserveWrong=false){
   const wasWrong=this.roundWrong;this.resetAudio();this.phase='idle';this.buddy.setState('IDLE');this.roundWrong=preserveWrong&&wasWrong;this.round=this.rounds[this.index];this.ui.Result.hidden=true;
   this.ui.Progress.textContent=`Round ${this.index+1} / ${this.rounds.length}`;this.ui.Toy.src=toy(this.round.shown);this.ui.Toy.alt='A '+this.round.shown;
   const hidden=this.kind==='listen-decide';this.ui.Question.textContent=hidden?'':(this.round.text||question(this.round.asked));this.ui.Bubble.textContent=hidden?'Listen carefully!':(this.round.text||question(this.round.asked));
   if(this.kind==='build-sentence'&&this.level!=='easy'&&this.round.form==='question'){this.ui.Question.textContent='Build the question.';this.ui.Bubble.textContent='Listen, then build the question.';}
   const instructions={'meet-pattern':'Look, listen, then choose YES or NO.','question-detective':'What kind of question did you hear?','match-answer':'Drag an answer to the question card, or tap an answer.','build-sentence':'Move the word tiles into the slots. You can drag or tap.','listen-decide':'Listen first. Choose YES or NO.','talk-to-toy-buddy':'Listen, then say the whole answer.'};
   this.ui.Instruction.textContent=instructions[this.kind];
   if(this.kind==='question-detective')this.ui.Interaction.innerHTML=`<div class="l2-categories">${TYPES.map((t,i)=>`<button type="button" data-category="${t}">${i<2?`<img src="assets/shared-ui/${TYPE_ICONS[i]}.png" alt="">`:i===2?'<span class="l2-colors" aria-hidden="true">● ● ●</span>':'<span class="l2-number-icon" aria-hidden="true">1 2 3</span>'}<span>${t}</span></button>`).join('')}</div>`;
   else if(this.kind==='match-answer')this.matchCards();
   else if(this.kind==='build-sentence')this.buildTiles();
   else if(this.kind==='talk-to-toy-buddy')this.speakingControls();
   else this.ui.Interaction.innerHTML='<div class="l2-yesno"><button type="button" data-choice="true">YES</button><button type="button" data-choice="false">NO</button></div><p id="l2Model" class="l2-model"></p>';
   this.preload();this.refresh();this.prompt();
  }
  preload(){
   for(const r of [this.round,this.rounds[this.index+1]].filter(Boolean)){const im=new Image();im.src=toy(r.shown);const clip=this.clip(r.clip||'questions/is_it_a_'+r.asked);if(clip){const a=new Audio(clip.src);a.preload='auto';}}
  }
  promptKey(){return this.round.clip||'questions/is_it_a_'+this.round.asked;}
  async prompt(){
   if(this.destroyed||['asking','checking','complete'].includes(this.phase))return;
   const wasResolved=this.phase==='resolved';this.resetAudio();const token=this.run;this.phase='asking';this.status('Listen to Toy Buddy…');this.refresh();
   if(this.index===0&&!this.introduced){this.introduced=true;const intro=this.kind==='build-sentence'?'build_sentence':this.kind==='talk-to-toy-buddy'?'tap_the_microphone':'listen_and_choose';if(!await this.speak('feedback/'+intro,token))return;}
   if(await this.speak(this.promptKey(),token,{asking:true,endState:'LISTENING'})){
    this.phase=wasResolved?'resolved':'listening';this.status(wasResolved?'Tap Next when you are ready.':this.kind==='talk-to-toy-buddy'?'Your turn! Say the whole answer.':'Your turn!');this.refresh();
   }
  }
  matchCards(){
   const multi=this.index>=4,start=multi?4+Math.floor((this.index-4)/2)*2:this.index;
   const cards=multi?this.rounds.slice(start,start+2):[this.round];
   this.root.classList.toggle('l2-multi-match',multi);
   this.ui.Interaction.innerHTML=`${multi?`<div class="l2-match-cards">${cards.map((r,i)=>{const n=start+i,current=n===this.index,done=n<this.index;return `<div class="l2-match-card ${current?'l2-current-card':''}"><img src="${toy(r.shown)}" alt="A ${r.shown}"><b>${question(r.asked)}</b><div class="l2-drop l2-answer-drop ${done?'l2-snapped':''}" ${current?'data-drop-answer':''}>${done?answer(r.yes):current?'Drop the answer here':'Next question'}</div></div>`;}).join('')}</div>`:'<div class="l2-drop l2-answer-drop" data-drop-answer aria-label="Drop your answer here">Drop the answer here</div>'}<div class="l2-answer-bank">${[true,false].map(y=>`<button type="button" class="l2-draggable" data-match="${y}">${answer(y)}</button>`).join('')}</div>`;
  }
  buildTiles(){
   const r=this.round;this.tokens=r.form==='question'?['Is','it','a',r.asked,'?']:r.form==='positive'?['Yes',',','it','is','.']:['No',',','it',"isn't",'.'];this.placed=Array(this.tokens.length).fill(null);
   this.tiles=mix(this.tokens.map((word,id)=>({id,word})));if(this.level==='challenge')this.tiles=mix([...this.tiles,{id:100,word:r.form==='question'?'No':'Is'},{id:101,word:r.form==='negative'?'is':"isn't"}]);
   this.ui.Interaction.innerHTML=`<p class="l2-sentence-model" ${this.level==='easy'?'':'hidden'}>${this.tokens.join(' ').replace(/ ([,.?])/g,'$1')}</p><div class="l2-slots" role="group" aria-label="Sentence slots">${this.tokens.map((word,i)=>`<button type="button" class="l2-drop" data-slot="${i}" aria-label="Word slot ${i+1}">${this.level==='easy'?`<span class="l2-ghost">${esc(word)}</span>`:i+1}</button>`).join('')}</div><div class="l2-tiles">${this.tiles.map(t=>`<button type="button" class="l2-draggable" data-tile="${t.id}">${esc(t.word)}</button>`).join('')}</div><button type="button" data-undo>Undo last word</button>`;
  }
  speakingControls(){
   const adapter=api.recognitionAdapter&&!this.manualMode;
   const support=this.level==='easy'?"Yes, it is. / No, it isn't.":this.level==='practice'?'YES / NO':'Say your answer.';
   this.ui.Interaction.innerHTML=`<p class="l2-speaking-support">${support}</p><div class="l2-speaking-actions"><button id="l2Mic" type="button">${adapter?'🎙 Tap the microphone':'Speak, then teacher check'}</button><button data-teacher type="button">Teacher Check</button></div><p class="l2-manual-note">${adapter?'Speak after the question ends. Tap Stop when finished, or recording stops after four seconds.':'Teacher check mode: no microphone recording. The teacher listens and checks the response.'}</p><div id="l2Teacher" class="l2-teacher" hidden><b>Teacher: check the whole answer.</b><button type="button" data-validate="correct">CORRECT</button><button type="button" data-validate="unclear">TRY AGAIN</button></div><p id="l2Heard"></p><span class="l2-waveform" role="status" aria-label="Checking your answer" hidden><i></i><i></i><i></i><i></i><i></i></span>`;
  }
  async click(event){
   const b=event.target.closest('button');if(!b||b.disabled)return;
   if(b.dataset.completeAction){this.completionAction(b.dataset.completeAction);return;}
   if(b.hasAttribute('data-undo')&&this.phase==='listening'){this.undo();return;}
   if(b.id==='l2Mic'&&this.phase==='recording'){this.recognition?.stop?.();return;}
   if(this.phase!=='listening')return;
   if(b.dataset.choice!==undefined)this.check((b.dataset.choice==='true')===this.round.yes);
   if(b.dataset.category)this.check(b.dataset.category===this.round.category);
   if(b.dataset.match!==undefined&&!this.suppressClick)this.placeAnswer(b);
   if(b.dataset.tile!==undefined&&!this.suppressClick)this.placeTile(Number(b.dataset.tile));
   if(b.hasAttribute('data-teacher'))this.teacherCheck();if(b.id==='l2Mic')this.listen();if(b.dataset.validate)this.gradeSpeech(b.dataset.validate);
  }
  reveal(){if(this.kind==='listen-decide'){const q=question(this.round.asked);this.ui.Question.textContent=q;this.ui.Bubble.textContent=q;}}
  async check(correct){
   if(this.phase!=='listening')return;this.phase='checking';this.attempts++;this.refresh();const token=this.run;this.buddy.setState('THINKING');this.reveal();
   if(!correct){this.roundWrong=true;this.errors++;this.status('Good try! Look again.');
    if(!await this.speak(this.kind==='question-detective'?'feedback/listen_again':'feedback/try_again',token,{endState:'RETRY'}))return;
    if(this.kind==='meet-pattern'||this.kind==='listen-decide'){this.root.querySelector('#l2Model').textContent=answer(this.round.yes);if(!await this.speak(answerClip(this.round.yes),token,{endState:'RETRY'}))return;}
    this.phase='listening';this.refresh();return;
   }
   if(this.kind!=='question-detective'){
    const model=this.root.querySelector('#l2Model');if(model)model.textContent=answer(this.round.yes);
    const key=this.kind==='build-sentence'&&this.round.form==='question'?this.promptKey():answerClip(this.round.yes);
    if(!await this.speak(key,token,{endState:'CORRECT'}))return;
   }else if(!await this.speak('feedback/excellent',token,{endState:'CELEBRATE'}))return;
   if(!await this.sfx('correct',token))return;
   if(!this.roundWrong)this.firstCorrect++;
   this.buddy.setState('CORRECT');this.phase='resolved';this.status('Great job! '+(this.kind==='listen-decide'?`Accuracy: ${this.firstCorrect} / ${this.index+1} first tries. `:'')+'Tap Next.');this.refresh();
  }
  placeAnswer(b){
   if(this.phase!=='listening')return;
   const ok=(b.dataset.match==='true')===this.round.yes,drop=this.root.querySelector('[data-drop-answer]');
   if(ok){drop.textContent=b.textContent;drop.classList.add('l2-snapped');b.hidden=true;}else {b.classList.remove('l2-return');void b.offsetWidth;b.classList.add('l2-return');}
   this.check(ok);
  }
  placeTile(id,slot=this.placed.indexOf(null)){
   if(this.phase!=='listening'||slot<0||this.placed[slot]!==null||this.placed.includes(id))return;
   const t=this.tiles.find(t=>t.id===id);if(!t)return;
   if(t.word!==this.tokens[slot]){this.check(false);return;}
   this.placed[slot]=id;const target=this.root.querySelector(`[data-slot="${slot}"]`);target.textContent=t.word;target.classList.add('l2-snapped');this.root.querySelector(`[data-tile="${id}"]`).hidden=true;
   if(this.placed.every(id=>id!==null))this.check(true);
  }
  undo(){const slot=this.placed.findLastIndex(id=>id!==null);if(slot<0)return;const id=this.placed[slot];this.placed[slot]=null;const b=this.root.querySelector(`[data-slot="${slot}"]`);b.innerHTML=this.level==='easy'?`<span class="l2-ghost">${esc(this.tokens[slot])}</span>`:slot+1;b.classList.remove('l2-snapped');this.root.querySelector(`[data-tile="${id}"]`).hidden=false;}
  pointerDown(e){
   const b=e.target.closest('.l2-draggable');if(!b||b.disabled||this.phase!=='listening')return;
   this.drag={b,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};try{b.setPointerCapture(e.pointerId);}catch{}
  }
  pointerMove(e){
   const d=this.drag;if(!d||d.id!==e.pointerId)return;
   if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>8)d.moved=true;
   if(d.moved){d.b.classList.add('l2-dragging');d.b.style.transform=`translate(${e.clientX-d.x}px,${e.clientY-d.y}px)`;}
  }
  pointerUp(e){
   const d=this.drag;if(!d||d.id!==e.pointerId)return;
   const rects=[...this.root.querySelectorAll('.l2-drop')].map(b=>({b,r:b.getBoundingClientRect()}));
   this.cancelDrag();if(!d.moved)return;
   this.suppressClick=true;queueMicrotask(()=>setTimeout(()=>{this.suppressClick=false;},0));
   const target=rects.find(({b,r})=>(d.b.dataset.match===undefined||b.hasAttribute('data-drop-answer'))&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)?.b;
   if(target){if(d.b.dataset.match!==undefined)this.placeAnswer(d.b);else this.placeTile(Number(d.b.dataset.tile),Number(target.dataset.slot));}
   else {d.b.classList.remove('l2-return');void d.b.offsetWidth;d.b.classList.add('l2-return');}
  }
  cancelDrag(){if(this.drag){this.drag.b.style.transform='';this.drag.b.classList.remove('l2-dragging');try{this.drag.b.releasePointerCapture(this.drag.id);}catch{}this.drag=null;}}
  teacherCheck(){this.stopRecognition();this.phase='listening';this.buddy.setState('LISTENING');this.manualMode=true;this.speakingControls();this.root.querySelector('#l2Teacher').hidden=false;this.status('Say your answer. Your teacher will check it.');this.refresh();}
  listen(){
   if(this.phase!=='listening')return;
   const adapter=this.manualMode?null:api.recognitionAdapter;
   if(!adapter){this.teacherCheck();return;}
   if(this.recognition)return;const token=this.run;this.phase='starting';this.root.querySelector('#l2Heard').textContent='';this.refresh();this.status('Starting microphone…');
   try{
    const recognition=adapter.start({questionToy:this.round.asked,displayedToy:this.round.shown,
     onStart:()=>{if(!this.active(token))return;this.phase='recording';this.root.querySelector('#l2Mic').textContent='■ Stop recording';this.buddy.setState('LISTENING');this.status('Listening… say the whole answer.');this.refresh();},
     onProcessing:()=>{if(!this.active(token))return;this.phase='processing';this.root.querySelector('#l2Mic').textContent='Checking…';this.buddy.setState('THINKING');this.root.querySelector('.l2-waveform').hidden=false;this.status('Checking your answer…');this.refresh();},
     onResult:result=>{if(!this.active(token)||this.phase!=='processing')return;this.stopRecognition();this.phase='listening';this.root.querySelector('.l2-waveform').hidden=true;this.root.querySelector('#l2Mic').textContent='🎙 Tap the microphone';this.root.querySelector('#l2Heard').textContent=result.transcript?'Heard: '+result.transcript:'';this.gradeSpeech({CORRECT:'correct',INCOMPLETE:'partial',WRONG_LOGIC:'logical',UNCLEAR:'unclear'}[result.result]||'unclear');},
     onError:()=>{if(this.active(token))this.teacherCheck();}
    });
    if(this.active(token)&&['starting','recording','processing'].includes(this.phase)&&!this.manualMode)this.recognition=recognition;else recognition?.cancel?.();
   }catch{this.teacherCheck();}
  }
  async gradeSpeech(result){
   if(this.phase!=='listening')return;this.stopRecognition();
   if(result==='correct'){
    this.phase='checking';this.attempts++;this.refresh();const token=this.run;this.buddy.setState('CORRECT');
    if(!await this.speak('feedback/excellent',token,{endState:'CELEBRATE'}))return;
    if(!await this.sfx('correct',token))return;if(!this.roundWrong)this.firstCorrect++;
    this.buddy.setState('CELEBRATE');this.phase='resolved';this.status('Excellent!');this.refresh();this.next();return;
   }
   this.phase='checking';this.roundWrong=true;this.errors++;this.attempts++;this.refresh();const token=this.run;this.buddy.setState('THINKING');
   const feedback={partial:['Good! Say the whole sentence.','say_the_whole_sentence'],logical:['Look again. Try again.','look_again'],unclear:["I couldn't hear you. Try again.",'i_couldnt_hear_you']};const [text,key]=feedback[result]||feedback.unclear;
   this.status(text);if(await this.speak('feedback/'+key,token,{endState:result==='partial'?'LISTENING':'RETRY'})){this.phase='listening';this.refresh();}
  }
  next(){if(this.phase!=='resolved')return;this.index++;if(this.index>=this.rounds.length){this.complete();return;}this.setRound();}
  complete(){
   this.resetAudio();this.phase='complete';this.stars=this.firstCorrect/this.rounds.length>=.9?3:this.firstCorrect/this.rounds.length>=.65?2:1;this.buddy.setState('CELEBRATE');
   document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:this.entry[1],stars:this.stars}}));
   const last=this.kind==='talk-to-toy-buddy',ctx=window.LearningApp?.context();
   const earned=ENTRIES.reduce((sum,e)=>sum+(window.LearningProgress?.get('3/2/'+e[0]).stars||0),0);
   this.ui.Result.hidden=false;this.ui.Result.innerHTML=`<div class="l2-complete"><div class="l2-complete-actor"></div><div class="l2-complete-copy"><h2>${last?'UNIT 3 – LESSON 2 COMPLETE':'Activity Complete'}</h2><h3>Great job!</h3><p class="l2-earned">${'★'.repeat(this.stars)}${'☆'.repeat(3-this.stars)}</p><p>${this.firstCorrect} / ${this.rounds.length} correct on the first try.</p>${last?`<p>Is it a ...?<br>Yes, it is.<br>No, it isn't.</p><p>Lesson stars earned: ${earned} / 18</p>`:''}<div class="l2-complete-controls"><button type="button" data-complete-action="again">PLAY AGAIN</button><button type="button" data-complete-action="activities">CHOOSE ACTIVITY</button>${last?'<button type="button" data-complete-action="unit">BACK TO UNIT 3</button>':'<button type="button" data-complete-action="next">NEXT ACTIVITY</button>'}</div></div></div>`;
   this.ui.Result.querySelector('.l2-complete-actor').appendChild(this.buddy.root);
   this.root.classList.add('l2-finished');this.status(last?'Lesson Complete!':'Activity complete!');this.refresh();
   this.speak('feedback/great_job',this.run,{endState:'CELEBRATE'});
  }
  completionAction(action){
   const ctx=window.LearningApp?.context(),mode=ctx?.mode||'practice';
   if(action==='again'){if(this.kind==='talk-to-toy-buddy'&&mode==='class')window.LearningApp.go('#/unit/3/lesson/2?mode=class&activity=meet-pattern');else enter(this.kind);}
   if(action==='activities')window.LearningApp.go('#/unit/3/lesson/2?mode='+mode);
   if(action==='unit')window.LearningApp.go('#/unit/3');
   if(action==='next'){const next=ENTRIES[ENTRIES.findIndex(e=>e[0]===this.kind)+1];if(next)window.LearningApp.go('#/unit/3/lesson/2?mode='+mode+'&activity='+next[0]);}
  }
  dispose(){if(this.destroyed)return;this.resetAudio();this.destroyed=true;this.observer?.disconnect();document.removeEventListener('visibilitychange',this.hideListener);this.buddy.destroy();if(scene===this)scene=null;}
 }
 function enter(kind){scene?.dispose();const current=new LessonScene(kind);scene=current;/* async audio promises settle after assignment */}
 ENTRIES.forEach(([id,game,title])=>{games[game]={enter:()=>enter(id)};GAME_META[game]=['UNIT 3 · LESSON 2',title,'Listen • look • answer'];});
 document.addEventListener('learning:leave-activity',()=>scene?.dispose());
})();
