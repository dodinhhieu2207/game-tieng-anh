/* Static word cues; sentence recordings remain separate and retain natural prosody. */
(()=>{
 'use strict';
 const keys={is:'is',it:'it',a:'a',yes:'yes',no:'no',"isn't":'isnt',"what's":'whats',this:'this',"it's":'its'};
 const toys=new Set(['plane','puppet','robot','balloon','teddy']);let active=null,pending=Promise.resolve(),lastWord='',lastAt=-1000;
 function clean(word){return word.replace(/[,.?!]/g,'').trim().toLowerCase();}
 function stop(){if(active){active.audio?.pause();active.cancel?.();active.finish();active=null;}}
 function play(word,owner,target){
  const text=clean(word);if(!text||window.LearningApp?.isMuted())return Promise.resolve();
  if(text===lastWord&&performance.now()-lastAt<180)return pending;
  lastWord=text;lastAt=performance.now();stop();
  const src=keys[text]?'assets/sentence-words/'+keys[text]+'.mp3':toys.has(text)?'assets/unit3/audio/'+text+'.mp3':null;
  target?.classList.add('sentence-word-speaking');
  if(!src){pending=new Promise(resolve=>{const item={owner,cancel:()=>cancelVoice(),finish:()=>{target?.classList.remove('sentence-word-speaking');if(active===item)active=null;resolve();}};active=item;Promise.resolve(speakText(text,{interrupt:true})).then(item.finish,item.finish);});document.dispatchEvent(new CustomEvent('learning:word-audio',{detail:{text,src:null,engine:'existing-speech'}}));return pending;}
  pending=new Promise(resolve=>{const audio=new Audio(src);const item={audio,owner,finish:()=>{target?.classList.remove('sentence-word-speaking');if(active===item)active=null;resolve();}};active=item;audio.volume=.9;audio.addEventListener('ended',item.finish,{once:true});audio.addEventListener('error',item.finish,{once:true});audio.play().catch(item.finish);document.dispatchEvent(new CustomEvent('learning:word-audio',{detail:{text,src}}));});return pending;
 }
 addEventListener('DOMContentLoaded',()=>{
  new MutationObserver(()=>{if(active&&!active.owner?.isConnected)stop();}).observe(document.querySelector('#gameStage'),{childList:true,subtree:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  document.addEventListener('click',e=>{if(e.target.closest('[data-shell-action="sound"],#sentencePrompt')&&window.LearningApp?.isMuted())stop();});
 });
 window.SentenceWordAudio=Object.freeze({play,stop,finished:()=>pending});
})();
