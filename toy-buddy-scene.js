/* Additive Unit 3 integration; loaded after unit3.js. */
(()=>{
  'use strict';
  if(typeof games==='undefined'||typeof GAME_META==='undefined'||!window.ToyBuddy)return;
  let scene=null;
  function dispose(){if(!scene)return;scene.buddy.destroy();scene.sounds.forEach(a=>{a.pause();});scene.observer.disconnect();scene=null;}
  function enter(){
    dispose();cancelVoice();
    // Stop a previous Unit 3 recording before this scene starts.
    document.dispatchEvent(new Event('toybuddy:enter'));
    els.gameStage.classList.add('u3-stage');document.getElementById('gameScreen').classList.add('u3-on');
    els.gameStage.style.setProperty('--u3-bg','url(assets/unit3/bg/classroom.webp)');
    setStage(`<section class="unit3-toytown tb-scene" aria-label="Talk to Toy Buddy">
      <div class="tb-heading"><h2>Talk to Toy Buddy</h2><p>Listen, look, then choose your answer.</p></div>
      <div class="tb-playground"><div class="tb-friend"><div class="tb-question">Is it a robot?</div><div id="toyBuddyActor"></div><span class="tb-name">Toy Buddy</span></div>
      <div class="tb-toy"><img src="assets/unit3/toys/robot.webp" alt="A robot"><img class="tb-check" src="assets/toy-buddy/check.png" alt="" aria-hidden="true"><span>Look at the toy!</span></div></div>
      <p id="tbStatus" class="tb-status" role="status" aria-live="polite">Ready to play?</p>
      <div class="tb-answers" role="group" aria-label="Answer the question"><button id="tbYes" class="tb-answer tb-yes" type="button" aria-label="Yes" disabled><img src="assets/toy-buddy/yes.png" alt=""></button><button id="tbNo" class="tb-answer tb-no" type="button" aria-label="No" disabled><img src="assets/toy-buddy/no.png" alt=""></button></div>
      <div class="tb-controls"><button id="tbReplay" type="button"><img src="assets/toy-buddy/replay.png" alt="">Replay Question</button><button id="tbAgain" type="button" hidden>Play again</button></div>
    </section>`);
    const root=document.querySelector('.tb-scene'),status=root.querySelector('#tbStatus'),yes=root.querySelector('#tbYes'),no=root.querySelector('#tbNo'),replay=root.querySelector('#tbReplay'),again=root.querySelector('#tbAgain');
    const messages={IDLE:'Tap Replay Question to listen.',ASKING:'Listen to Toy Buddy…',LISTENING:'Your turn! Choose Yes or No.',THINKING:'Let’s see…',SUCCESS:'Yes! It is a robot. Great job!',RETRY:'Good try! Look at the toy and try again.'};
    const buddy=new ToyBuddy(root.querySelector('#toyBuddyActor'),{
      onStateChange(state){status.textContent=messages[state];yes.disabled=no.disabled=!(state==='LISTENING'||state==='RETRY');replay.disabled=state==='THINKING';again.hidden=state!=='SUCCESS';root.dataset.state=state;},
      onAudioError(){status.textContent='Tap Replay Question to start the audio. Check your sound if it cannot play.';}
    });
    const current=scene={buddy,root,sounds:new Set(),observer:null};
    function sfx(name){
      if(!els.soundFx.checked)return;
      const audio=new Audio('assets/unit3/sfx/'+name+'.mp3');current.sounds.add(audio);
      const done=()=>current.sounds.delete(audio);audio.addEventListener('ended',done);audio.addEventListener('error',done);audio.play().catch(done);
    }
    function ask(){if(scene!==current)return;current.sounds.forEach(a=>a.pause());current.sounds.clear();const clip=window.ToyBuddyClips.robot;buddy.ask(clip.src,{cues:clip.cues});}
    function answer(correct){
      if(!['LISTENING','RETRY'].includes(buddy.state))return;
      buddy.setState('THINKING');
      const generation=buddy.generation;
      buddy.later(()=>{if(buddy.generation!==generation||buddy.state!=='THINKING')return;buddy.setState(correct?'SUCCESS':'RETRY');sfx(correct?'correct':'wrong_soft');},450);
    }
    yes.onclick=()=>answer(true);no.onclick=()=>answer(false);replay.onclick=ask;again.onclick=ask;
    current.observer=new MutationObserver(()=>{if(!root.isConnected||currentGame!=='u3buddy'||!els.gameScreen.classList.contains('active'))dispose();});
    current.observer.observe(els.gameStage,{childList:true});current.observer.observe(els.gameScreen,{attributes:true,attributeFilter:['class']});
    restartCurrent=enter;replayCurrent=ask;ask();
  }
  games.u3buddy={enter};
  GAME_META.u3buddy=['UNIT 3 · PROTOTYPE 01','Talk to Toy Buddy','Listen • look • answer'];
  const grid=document.querySelector('#spaceUnit3 .activity-grid');
  if(grid){const tile=document.createElement('button');tile.type='button';tile.className='activity-card u3 warm';tile.dataset.game='u3buddy';
    tile.innerHTML='<span class="activity-card-copy"><small>Talk with a friend</small><b>Talk to Toy Buddy</b><em>Is it a robot? Listen and answer.</em><span class="play-pill">PLAY</span></span><img src="assets/toy-buddy/idle.png" alt="">';
    tile.addEventListener('click',()=>openGame('u3buddy'));grid.appendChild(tile);
  }
})();
