/* Extend the existing Unit 2 sentence game; retain its pictures, dialogue and cycles. */
(()=>{
 'use strict';
 addEventListener('DOMContentLoaded',()=>{
  const g=games.sentence,originalNext=g.next,originalDialogue=g.playDialogue;
  g.next=function(first=false){this.wordRun=(this.wordRun||0)+1;SentenceWordAudio.stop();originalNext.call(this,first);};
  g.playDialogue=async function(){SentenceWordAudio.stop();return originalDialogue.call(this);};
  g.render=function(){
   const [asker,answerer]=this.pairs[this.pairIndex];this.wordRun=(this.wordRun||0)+1;this.wordErrors=0;
   this.wordTokens=["What's",'this?',"It's",'a',this.current+'.'];
   const wrong=shuffle(DATA.words.filter(x=>x!==this.current)).slice(0,2);
   const tiles=shuffle([...this.wordTokens.map((text,id)=>({text,id})),...wrong.map((text,i)=>({text:text+'.',id:100+i}))]);
   setStage(`<div class="game-layout"><div class="game-intro"><h2>Build the Sentence</h2><p>Drag or tap a word to hear it. Build the question, then the answer.</p></div><div class="book-dialogue"><div class="book-card"><img src="${INLINE_BOOK[asker]}" alt="Book character asking"><div class="speech-bubble">What's this?</div></div><div class="book-card"><img src="${INLINE_BOOK[answerer]}" alt="Book character answering"><div class="speech-bubble answer" id="answerBubble">It's a ______.</div></div></div>${voiceButton('sentencePrompt','PLAY FULL DIALOGUE')}<div class="sentence-listening" id="sentenceListening">Listen first. The words unlock after the answer finishes.</div><div class="sentence-word-slots" aria-label="Question and answer word slots">${this.wordTokens.map((_,i)=>`<div class="sentence-slot" data-word-slot="${i}">${i<2?'Question':'Answer'} ${i<2?i+1:i-1}</div>`).join('')}</div><div class="sentence-word-bank">${tiles.map(t=>`<button class="sentence-tile" data-word-id="${t.id}" type="button" disabled>${t.id>=4?`<img src="${DATA.images[t.text.slice(0,-1)]}" alt="">`:''}<span>${escapeHTML(t.text)}</span></button>`).join('')}</div><div class="status-line" id="sentenceStatus">Listen first.</div>${controlRow(buttonHTML('sentenceReset','RESET','reset')+buttonHTML('sentenceNext','NEXT','next','primary'))}</div>`);
   const root=document.querySelector('#gameStage .game-layout');this.wordRoot=root;
   document.getElementById('sentencePrompt').onclick=()=>this.playDialogue();document.getElementById('sentenceReset').onclick=()=>{SentenceWordAudio.stop();this.resetRound(true);};document.getElementById('sentenceNext').onclick=()=>this.next();
   let drag=null,suppress=false,pointerHeard=null;
   const hear=tile=>SentenceWordAudio.play(tile.querySelector('span').textContent,root,tile);
   root.addEventListener('pointerdown',e=>{const tile=e.target.closest('[data-word-id]');if(!tile||tile.disabled||this.locked||tile.classList.contains('used'))return;pointerHeard=tile;hear(tile);drag={tile,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};tile.setPointerCapture(e.pointerId);});
   const clear=()=>{if(drag){drag.tile.style.transform='';drag.tile.classList.remove('word-dragging');try{drag.tile.releasePointerCapture(drag.id);}catch{}drag=null;}};
   root.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8)drag.moved=true;if(drag.moved){drag.tile.classList.add('word-dragging');drag.tile.style.transform=`translate(${e.clientX-drag.x}px,${e.clientY-drag.y}px)`;}});
   root.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const {tile,moved}=drag;const slots=[...root.querySelectorAll('[data-word-slot]')];const slot=slots.find(s=>{const r=s.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});clear();if(moved){suppress=true;setTimeout(()=>suppress=false,0);if(slot)this.pick(tile,Number(slot.dataset.wordSlot));}});
   root.addEventListener('pointercancel',clear);
   root.addEventListener('click',e=>{const tile=e.target.closest('[data-word-id]');if(!tile||tile.disabled||suppress||this.locked||tile.classList.contains('used'))return;if(pointerHeard!==tile)hear(tile);pointerHeard=null;this.pick(tile);});
  };
  g.pick=async function(tile,slot=this.step){
   if(this.locked||tile.classList.contains('used'))return;
   if(Number(tile.dataset.wordId)!==this.step||slot!==this.step){this.wordErrors++;tile.classList.add('wrong');retryFx();document.getElementById('sentenceStatus').textContent='Try another word.';setTimeout(()=>tile.classList.remove('wrong'),360);return;}
   const target=this.wordRoot.querySelector(`[data-word-slot="${this.step}"]`);target.textContent=this.wordTokens[this.step];target.classList.add('filled');tile.classList.add('used');this.step++;
   if(this.step!==this.wordTokens.length)return;
   this.locked=true;document.getElementById('sentenceNext').disabled=true;const run=this.wordRun,root=this.wordRoot;await SentenceWordAudio.finished();if(currentGame!=='sentence'||run!==this.wordRun||!root.isConnected)return;
   document.getElementById('answerBubble').textContent=DATA.sentences[this.current];document.getElementById('sentenceStatus').textContent='Excellent! Listen to your whole dialogue.';correctFx();toast('Excellent!');
   await speakSequence(["What's this?",{pause:260},DATA.sentences[this.current]],{interrupt:true});
   if(currentGame!=='sentence'||run!==this.wordRun||!root.isConnected)return;
   document.getElementById('sentenceStatus').textContent='Great job! Tap Next.';document.getElementById('sentenceNext').disabled=false;
   document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:'sentence',stars:this.wordErrors?2:3}}));
  };
 });
})();
