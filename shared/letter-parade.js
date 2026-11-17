(() => {
  'use strict';
  const game = 'u4letterparade';
  const art = 'assets/letter-parade/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const foley = 'assets/playful-foley/';
  const plans = [
    {phase:'repair', letter:'K', piece:'fork', spare:'foot', word:'kangaroo'},
    {phase:'repair', letter:'L', piece:'foot', spare:'fork', word:'lion'},
    {phase:'repair', letter:'k', piece:'small-fork', spare:'stem', word:'key'},
    {phase:'repair', letter:'l', piece:'stem', spare:'small-fork', word:'lollipop'},
    {phase:'pair', letter:'k', word:'kangaroo'},
    {phase:'pair', letter:'L', word:'lion'},
    {phase:'recall', letter:'l', word:'lollipop'},
    {phase:'recall', letter:'K', word:'key'}
  ];
  const pieces = {fork:'two diagonal strokes',foot:'horizontal stroke','small-fork':'short diagonal strokes',stem:'vertical stroke'};
  let dispose, library;
  function loadPixi() {
    if (window.PIXI) return Promise.resolve();
    return library ??= new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'shared/vendor/pixi/pixi.min.js?v=8.22.0';
      script.onload = resolve;
      script.onerror = () => { library = null; script.remove(); reject(new Error('PixiJS unavailable')); };
      document.head.append(script);
    });
  }
  const filename = letter => (letter === letter.toUpperCase() ? 'upper-' : 'lower-') + letter.toLowerCase();
  const toyImages = {kangaroo:'kangaroo',key:'treasure-key',lion:'lion',lollipop:'lollipop'};

  async function enter() {
    dispose?.();
    window.cancelVoice?.();
    window.SentenceWordAudio?.stop();
    let alive = true, index = 0, state = 'loading', app, initialized = false, observer, cart, wheels, dust;
    let animation = 0, timer, selected, drag, suppressClick = false, voice, sound, voiceDone;
    let reactionUrl;
    const reactions = {};
    const order = Math.random() < .5 ? plans : [...plans.slice(0,6),plans[7],plans[6]];
    setStage(`<section class="lp-game">
      <header><h2>Letter Parade</h2><b class="lp-count"></b></header>
      <div class="lp-world"><div class="lp-gate" hidden></div><div class="lp-canvas" aria-hidden="true"></div><img class="lp-actor" alt="" hidden>
        <img class="lp-word-picture" alt="" hidden><div class="lp-flash" aria-hidden="true"></div></div>
      <div class="lp-task"></div><p class="lp-status" role="status">Getting the parade ready…</p>
      <div class="lp-actions"><button type="button" data-hear hidden>Hear the letter</button><button type="button" data-next hidden>Next</button></div>
    </section>`);
    const root = document.querySelector('.lp-game');
    const q = selector => root.querySelector(selector);
    const actor = q('.lp-actor');
    const world = q('.lp-world');
    const status = text => { q('.lp-status').textContent = text; };
    const round = () => order[index];
    const family = () => round().letter.toLowerCase();
    const otherCase = letter => letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase();
    function playSfx(file) {
      if (document.hidden || window.LearningApp?.isMuted() || !document.querySelector('#soundFx')?.checked) return;
      sound?.pause();
      sound = new Audio(foley + file);
      sound.volume = .25;
      sound.play().catch(() => {});
    }
    function stopVoice() {
      const finish = voiceDone;
      voiceDone = null;
      voice?.pause();
      voice = null;
      finish?.();
    }
    function speak(clip) {
      stopVoice();
      const src = window.KeyQuestClips?.clips[clip]?.src;
      if (!src || document.hidden || window.LearningApp?.isMuted()) return Promise.resolve();
      return new Promise(resolve => {
        const player = new Audio(src);
        voice = player;
        voiceDone = resolve;
        const finish = () => { if (voice === player) stopVoice(); };
        player.addEventListener('ended',finish,{once:true});
        player.addEventListener('error',finish,{once:true});
        player.play().catch(finish);
      });
    }
    function clearReaction() {
      actor.hidden = true;
      actor.removeAttribute('src');
      if (reactionUrl) URL.revokeObjectURL(reactionUrl);
      reactionUrl = null;
    }
    function draw(x, travel = 0, t = 0) {
      if (!initialized) return;
      const rolling = Math.sin(Math.PI*t);
      const bump = Math.sin(travel/19)*2.4*rolling;
      cart.position.set(x,313+bump);
      actor.style.transform = 'translateY('+(bump/4.5)+'%)';
      dust.clear();
      for(let i=0;rolling>.09&&i<5;i++) {
        const offset = (travel/49+i*.23)%1;
        dust.circle(x-75-offset*72,366-offset*18,i%3+2)
          .fill({color:0xffe2a4,alpha:(1-offset)*rolling*.65});
      }
      for (const wheel of wheels) wheel.rotation = travel / 33;
      actor.style.left = (x / 8) + '%';
      app.render();
    }
    function letterArt(letter) {
      return `<img src="assets/kl-letters/${filename(letter)}.png" alt="${letter}">`;
    }
    function renderRound() {
      const r = round();
      state = 'choose';
      root.dataset.phase = r.phase;
      selected = null;
      clearReaction();
      const picture = q('.lp-word-picture');
      world.append(picture);
      picture.hidden = true;
      q('.lp-gate').hidden = true;
      actor.src = art+(r.word === 'kangaroo' || r.word === 'lion' ? r.word : family() === 'k' ? 'kangaroo' : 'lion')+'-idle.png';
      actor.hidden = r.phase === 'recall';
      draw(235);
      q('.lp-count').textContent = (index+1) + ' / ' + order.length;
      q('[data-hear]').hidden = false;
      q('[data-next]').hidden = true;
      const task = q('.lp-task');
      if (r.phase === 'repair') {
        const options = Math.random() < .5 ? [r.piece,r.spare] : [r.spare,r.piece];
        task.innerHTML = `<button class="lp-slot" type="button" data-slot aria-label="Fit the missing piece"><img src="${art}fix-${filename(r.letter)}.png" alt=""></button>
          <div class="lp-options">${options.map(piece=>`<button type="button" data-piece="${piece}" aria-pressed="false" aria-label="${pieces[piece]}"><img src="${art}piece-${piece}.png" alt=""></button>`).join('')}</div>`;
        status('Fit the missing piece.');
      } else {
        const answer = otherCase(r.letter);
        const distractor = ({K:'L',L:'K',k:'l',l:'k'})[answer];
        const options = Math.random() < .5 ? [answer,distractor] : [distractor,answer];
        task.innerHTML = `<div class="lp-model">${letterArt(r.letter)}</div><div class="lp-options">${options.map(letter=>`<button type="button" data-letter="${letter}">${letterArt(letter)}</button>`).join('')}</div>`;
        status(r.phase==='pair' ? 'Send the cart through its matching letter gate.' : 'Which letter belongs with this one?');
      }
    }
    function select(piece) {
      selected = piece;
      root.querySelectorAll('[data-piece]').forEach(button=>button.setAttribute('aria-pressed',String(button===piece)));
    }
    function wrong(button) {
      status('Try the other shape.');
      select(null);
      playSfx('retry.wav');
      if (button && !reduced.matches) button.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],{duration:220});
    }
    const motionDone = () => new Promise(resolve => {
      if (reduced.matches) { draw(530); resolve(); return; }
      const start = performance.now();
      function frame(now) {
        if (!alive) return;
        const t = Math.min(1,(now-start)/950);
        const travel = 295*(t*t*(3-2*t));
        draw(235+travel,travel,t);
        if (t<1) animation=requestAnimationFrame(frame);
        else resolve();
      }
      animation=requestAnimationFrame(frame);
    });
    async function correct(piece) {
      state='moving';
      stopVoice();
      q('[data-hear]').disabled=true;
      const r=round();
      const mascot=family()==='k'?'kangaroo':'lion';
      if (piece || reduced.matches) playSfx('place.wav');
      if (piece) {
        const slot=q('[data-slot]');
        const fitted=piece.firstElementChild.cloneNode();
        fitted.className='lp-fitted';
        slot.append(fitted);
        if (!reduced.matches) {
          const snap=fitted.animate([{scale:'.93',opacity:.55},{scale:'1.07',opacity:1,offset:.62},{scale:'1',opacity:1}],{duration:300,easing:'ease-out'});
          await snap.finished.catch(()=>{});
        }
        if (!alive) return;
      } else {
        const gate=q('.lp-gate');
        gate.innerHTML=letterArt(otherCase(r.letter));
        gate.hidden=false;
      }
      q('.lp-task').innerHTML=`<div class="lp-pair">${letterArt(family().toUpperCase())}${letterArt(family())}</div>`;
      status('The letters fit. Here comes the cart!');
      const flash=q('.lp-flash');
      if (!reduced.matches) flash.animate([{opacity:0,scale:'.7'},{opacity:.8,scale:'1',offset:.25},{opacity:0,scale:'1.7'}],{duration:550});
      if (!reduced.matches) {
        reactionUrl=URL.createObjectURL(reactions[mascot]);
        actor.src=reactionUrl;
      } else actor.src=art+mascot+'-idle.png';
      actor.hidden=false;
      if (!reduced.matches) playSfx('roll.wav');
      await motionDone();
      if (!alive) return;
      await new Promise(resolve=>{timer=setTimeout(resolve,reduced.matches?0:230);});
      if (!alive) return;
      actor.src=art+mascot+'-idle.png';
      if (reactionUrl) URL.revokeObjectURL(reactionUrl);
      reactionUrl=null;
      const picture=q('.lp-word-picture');
      picture.src='assets/key-quest/'+toyImages[r.word]+'.png';
      picture.alt=r.word;
      picture.hidden=false;
      const wordCard = document.createElement('div');
      wordCard.className='lp-word-card';
      wordCard.append(picture);
      wordCard.insertAdjacentHTML('beforeend',`<strong class="lp-word">${r.word}</strong>`);
      q('.lp-task').append(wordCard);
      status(r.phase==='repair' ? 'The letter is ready!' : 'That is its matching letter!');
      sound?.pause();
      await speak('letter-'+family());
      if (!alive) return;
      await speak(r.word);
      if (!alive) return;
      state='done';
      q('[data-hear]').disabled=false;
      const next=q('[data-next]');
      next.hidden=false;
      next.textContent=index===order.length-1?'Play again':'Next cart';
      if (index===order.length-1) {
        status('The parade is ready!');
        document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game,stars:3}}));
      }
    }
    function match(piece) {
      if (state!=='choose'||!piece) return;
      if (piece.dataset.piece===round().piece) correct(piece);
      else wrong(piece);
    }
    root.addEventListener('click',event=>{
      const button=event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-retry')) {enter();return;}
      if (button.hasAttribute('data-next')&&state==='done') {
        stopVoice();
        if (++index===order.length) enter();
        else renderRound();
        return;
      }
      if (button.hasAttribute('data-hear')&&(state==='choose'||state==='done')) {speak('letter-'+family());return;}
      if (state!=='choose') return;
      if (button.dataset.piece && !suppressClick) select(button);
      if (button.hasAttribute('data-slot')) match(selected);
      if (button.dataset.letter) {
        if (button.dataset.letter===otherCase(round().letter)) correct();
        else wrong(button);
      }
    });
    root.onpointerdown=event=>{
      const button=event.target.closest('[data-piece]');
      if (!button||drag||event.button!==0||state!=='choose') return;
      suppressClick=false;
      drag={button,id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
      button.setPointerCapture(event.pointerId);
    };
    root.onpointermove=event=>{
      if (drag?.id!==event.pointerId) return;
      const x=event.clientX-drag.x,y=event.clientY-drag.y;
      if (Math.hypot(x,y)>7) drag.moved=true;
      if (drag.moved) {
        drag.button.classList.add('lp-drag');
        drag.button.style.translate=x+'px '+y+'px';
      }
    };
    function drop(event, submit) {
      if (drag?.id!==event.pointerId) return;
      const {button,moved}=drag;
      const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-slot]');
      const translated=button.style.translate;
      drag=null;
      button.classList.remove('lp-drag');
      button.style.translate='';
      if (moved) {
        suppressClick=true;
        queueMicrotask(()=>{setTimeout(()=>{suppressClick=false;},0);});
        if (submit&&target) match(button);
        else if (!reduced.matches) button.animate([{translate:translated},{translate:'0'}],{duration:230,easing:'ease-out'});
      }
    }
    root.onpointerup=event=>drop(event,true);
    root.onpointercancel=event=>drop(event,false);
    const audioSettings=()=>{if(document.hidden||window.LearningApp?.isMuted()){stopVoice();sound?.pause();}};
    document.addEventListener('visibilitychange',audioSettings);
    document.addEventListener('change',audioSettings);
    dispose=()=>{
      alive=false;
      cancelAnimationFrame(animation);
      clearTimeout(timer);
      stopVoice();
      sound?.pause();
      clearReaction();
      observer?.disconnect();
      if (initialized) app.destroy(true,{children:true,texture:false});
      document.removeEventListener('visibilitychange',audioSettings);
      document.removeEventListener('change',audioSettings);
      root.getAnimations({subtree:true}).forEach(item=>item.cancel());
      dispose=null;
    };
    try {
      await loadPixi();
      const [bodyTexture,wheelTexture]=await Promise.all([
        PIXI.Assets.load(art+'cart.webp'),
        PIXI.Assets.load(art+'wheel.webp'),
        ...['lion','kangaroo'].map(async name=>{
          const response=await fetch(art+name+'-reaction.gif');
          if (!response.ok) throw new Error('Reaction unavailable');
          reactions[name]=await response.blob();
        })
      ]);
      if (!alive) return;
      app=new PIXI.Application();
      await app.init({width:800,height:450,backgroundAlpha:0,antialias:true,autoStart:false,resolution:Math.min(devicePixelRatio,2)});
      if (!alive) {app.destroy(true,{children:true,texture:false});return;}
      initialized=true;
      q('.lp-canvas').append(app.canvas);
      cart=new PIXI.Container();
      const body=new PIXI.Sprite(bodyTexture);
      body.anchor.set(.5,.6);
      body.width=236;
      body.height=120;
      cart.addChild(body);
      wheels=[-68,32].map(x=>{
        const wheel=new PIXI.Sprite(wheelTexture);
        wheel.anchor.set(.5);
        wheel.position.set(x,49);
        wheel.width=66;
        wheel.height=66;
        cart.addChild(wheel);
        return wheel;
      });
      dust=new PIXI.Graphics();
      app.stage.addChild(dust,cart);
      const fit=()=>{app.canvas.style.width=world.clientWidth+'px';app.canvas.style.height=world.clientHeight+'px';};
      observer=new ResizeObserver(fit);
      observer.observe(world);
      fit();
      renderRound();
    } catch (error) {
      if (!alive) return;
      q('.lp-task').innerHTML='<button type="button" data-retry>Try again</button>';
      status('The parade could not load.');
      console.warn(error);
    }
  }
  games[game]={enter:()=>enter()};
  GAME_META[game]=['UNIT 4 · LESSON 5','Letter Parade','Repair and match Kk and Ll'];
  document.addEventListener('learning:leave-activity',()=>dispose?.());
})();
