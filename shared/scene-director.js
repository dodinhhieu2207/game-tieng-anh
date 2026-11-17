(() => {
  const key = 'u4scenedirector';
  const art = 'assets/scene-director/';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const rounds = [
    {actor:'lion', prop:'key', cue:'Give the lion the key.', audio:'give-lion-key-belinda.mp3',
      gif:'lion-unlock.gif', still:'lion-open.png', hand:[131,283], reveal:[376,336],
      middle:'latch.wav', finish:'The lion has the key. The chest is open!'},
    {actor:'kangaroo', prop:'lollipop', cue:'Give the kangaroo the lollipop.', audio:'give-kangaroo-lollipop-belinda.mp3',
      gif:'kangaroo-pocket.gif', still:'kangaroo-pocket.png', hand:[389,220], reveal:[295,322],
      middle:'cloth4.ogg', finish:'The kangaroo has the lollipop!'},
    {actor:'lion', prop:'lollipop', cue:'Give the lion the lollipop.', audio:'give-lion-lollipop-belinda.mp3',
      idle:'lion-candy-idle.png', gif:'lion-candy.gif', still:'lion-candy-end.png', hand:[305,281], reveal:[422,309],
      middle:'place.wav', finish:'The lion put the lollipop on the stand!'},
    {actor:'kangaroo', prop:'key', cue:'Give the kangaroo the key.', audio:'give-kangaroo-key-belinda.mp3',
      idle:'kangaroo-key-idle.png', gif:'kangaroo-key.gif', still:'kangaroo-key-end.png', hand:[327,263], reveal:[401,331],
      middle:'latch.wav', finish:'The kangaroo opened the chest!'}
  ];
  let close, pixiLoad;
  function pixi() {
    if (window.PIXI) return Promise.resolve();
    return pixiLoad ??= new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.src = 'shared/vendor/pixi/pixi.min.js?v=8.22.0';
      script.onload = resolve;
      script.onerror = () => { pixiLoad = null; script.remove(); reject(); };
      document.head.append(script);
    });
  }
  function enter(index = 0, order = rounds) {
    close?.();
    const round = order[index];
    let dead = false, phase = 'ready', selected, drag, gif, gifUrl, app, ready = false, voice;
    const timers = new Set();
    const sounds = new Set();
    const foley = 'assets/playful-foley/';
    setStage(`<section class="sd-game" data-round="${index}" data-active-actor="${round.actor}">
      <header><h2>Scene Director</h2><strong>${index+1} / ${rounds.length}</strong><button type="button" data-hear>▶ Hear the cue</button></header>
      <div class="sd-scene">
        <button type="button" class="sd-actor sd-lion" data-actor="lion" aria-label="Give to the lion"><img src="${art+(round.actor === 'lion' && round.idle ? round.idle : 'lion-idle.png')}" alt=""><span>lion</span></button>
        <button type="button" class="sd-actor sd-kangaroo" data-actor="kangaroo" aria-label="Give to the kangaroo"><img src="${round.actor === 'kangaroo' ? art+(round.idle || 'kangaroo-idle.png') : 'assets/shadow-stage/kangaroo.webp'}" alt=""><span>kangaroo</span></button>
        <div class="sd-fx" aria-hidden="true"></div>
        <div class="sd-tray"><button type="button" data-prop="key" aria-pressed="false"><img src="assets/shadow-stage/key.webp" alt="">key</button><button type="button" data-prop="lollipop" aria-pressed="false"><img src="assets/shadow-stage/lollipop.webp" alt="">lollipop</button></div>
      </div>
      <p class="sd-status" role="status">Listen, then give the prop to the right actor.</p>
      <details><summary>Show the cue</summary>${round.cue}</details>
      <button type="button" data-reset hidden>${index+1 < rounds.length ? 'Next scene' : 'Mix it up'}</button>
    </section>`);
    const root = document.querySelector('.sd-game');
    const q = selector => root.querySelector(selector);
    const actor = q('[data-actor='+round.actor+']');
    const sprite = actor.querySelector('img');
    const status = text => { q('.sd-status').textContent = text; };
    const after = (ms, fn) => {
      const timer = setTimeout(() => { timers.delete(timer); if (!dead) fn(); }, ms);
      timers.add(timer);
    };
    const animate = (element, frames, options) => {
      if (!reduce.matches) return element.animate(frames, options);
    };
    function play(name, isVoice = false) {
      if (document.hidden || window.LearningApp?.isMuted() || (!isVoice && !document.querySelector('#soundFx')?.checked)) return;
      if (isVoice) voice?.pause();
      const audio = new Audio(name);
      if (isVoice) voice = audio;
      audio.volume = isVoice ? .95 : .37;
      sounds.add(audio);
      audio.onended = audio.onerror = () => sounds.delete(audio);
      audio.play().catch(() => sounds.delete(audio));
    }
    function select(prop) {
      selected = prop;
      root.querySelectorAll('[data-prop]').forEach(button => button.setAttribute('aria-pressed', String(button === prop)));
    }
    function burst(x, y, large) {
      if (!ready || reduce.matches) return;
      const group = new PIXI.Container();
      const count = large ? 24 : 9;
      const dots = Array.from({length:count}, (_, i) => {
        const dot = new PIXI.Graphics();
        dot.circle(0, 0, i % 4 + 2).fill(i % 2 ? 0xffe4a2 : 0xffae55);
        group.addChild(dot);
        const angle = i / count * Math.PI * 2;
        return {dot, vx:Math.cos(angle) * (large ? 124 : 55), vy:Math.sin(angle) * 70 - 55};
      });
      app.stage.addChild(group);
      let elapsed = 0;
      const step = ticker => {
        elapsed += ticker.deltaMS / 1000;
        for (const {dot,vx,vy} of dots) {
          dot.position.set(x + vx * elapsed, y + vy * elapsed + 120 * elapsed * elapsed);
          dot.alpha = Math.max(0, 1 - elapsed / .7);
        }
        if (elapsed > .7) { app.ticker.remove(step); group.destroy({children:true}); }
      };
      app.ticker.add(step);
    }
    async function deliver(prop, target) {
      if (phase !== 'ready' || !prop) return;
      if (prop.dataset.prop !== round.prop || target.dataset.actor !== round.actor) {
        select(null);
        status('Try another prop or actor.');
        play(foley+'retry.wav');
        animate(prop,[{translate:'10px'},{translate:'-6px'},{translate:'0'}],{duration:240});
        return;
      }
      phase = 'playing';
      voice?.pause();
      q('[data-hear]').disabled = true;
      const from = prop.querySelector('img').getBoundingClientRect();
      const to = sprite.getBoundingClientRect();
      const scene = q('.sd-scene').getBoundingClientRect();
      const scale = Math.min(to.width / 520, to.height / 480);
      const left = to.left + (to.width - 520 * scale) / 2;
      const top = to.top + (to.height - 480 * scale) / 2;
      const x = left + round.hand[0] * scale;
      const y = top + round.hand[1] * scale;
      const chestX = 800 * (left + round.reveal[0] * scale - scene.left) / scene.width;
      const chestY = 450 * (top + round.reveal[1] * scale - scene.top) / scene.height;
      const fly = prop.querySelector('img').cloneNode();
      fly.className = 'sd-flying';
      Object.assign(fly.style,{left:(from.left-scene.left)+'px',top:(from.top-scene.top)+'px',width:from.width+'px',height:from.height+'px'});
      q('.sd-scene').append(fly);
      prop.style.visibility = 'hidden';
      status(`The ${round.actor} catches the ${round.prop}…`);
      play(foley+'cloth1.ogg');
      const dx = x-from.left-from.width/2, dy = y-from.top-from.height/2;
      const flight = animate(fly,[{transform:'none'},{transform:`translate(${dx*.55}px,${dy*.6-25}px) rotate(18deg)`,offset:.55},{transform:`translate(${dx}px,${dy}px) rotate(-12deg) scale(.43)`}],{duration:340,easing:'ease-out',fill:'forwards'});
      if (flight) await flight.finished.catch(() => {});
      if (dead) return;
      if (!reduce.matches && gif) {
        gifUrl = URL.createObjectURL(gif);
        sprite.src = gifUrl;
      }
      after(160,() => { fly.remove(); play(foley+'place.wav'); burst(800*(x-scene.left)/scene.width,450*(y-scene.top)/scene.height,false); });
      after(520,() => play(foley+round.middle));
      after(920,() => {
        play(foley+'reveal.wav');
        burst(chestX,chestY,true);
        q('.sd-scene').classList.add('sd-open');
        animate(q('.sd-scene'),[{filter:'brightness(1.26)'},{filter:'none'}],{duration:500});
      });
      after(1560,() => {
        sprite.src = art+round.still;
        if (gifUrl) URL.revokeObjectURL(gifUrl);
        gifUrl = null;
        phase = 'done';
        q('[data-hear]').disabled = false;
        status(round.finish);
        q('[data-reset]').hidden = false;
        if (index === rounds.length-1) document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game:key,stars:3}}));
      });
    }
    root.addEventListener('click',event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-reset')) {
        if (index+1 < order.length) enter(index+1, order);
        else {
          const mixed = rounds.slice();
          for (let i=mixed.length-1;i>0;i--) {
            const j=Math.floor(Math.random()*(i+1));
            [mixed[i],mixed[j]]=[mixed[j],mixed[i]];
          }
          if (mixed.every((item,i)=>item===order[i])) mixed.push(mixed.shift());
          enter(0,mixed);
        }
        return;
      }
      if (button.hasAttribute('data-hear')) { play(art+round.audio,true); return; }
      if (phase !== 'ready') return;
      if (button.dataset.prop) select(button);
      if (button.dataset.actor) deliver(selected,button);
    });
    root.onpointerdown = event => {
      const prop = event.target.closest('[data-prop]');
      if (!prop || phase !== 'ready' || drag || event.button !== 0) return;
      drag = {prop,id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
      prop.setPointerCapture(event.pointerId);
    };
    root.onpointermove = event => {
      if (drag?.id !== event.pointerId) return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if (Math.hypot(dx,dy)>7) drag.moved=true;
      if (drag.moved) {
        drag.prop.style.translate=dx+'px '+dy+'px';
        drag.prop.classList.add('sd-drag');
        const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-actor]');
        root.querySelectorAll('[data-actor]').forEach(actor=>actor.classList.toggle('sd-hover',actor===target));
      }
    };
    function clearDrag(event, submit) {
      if (drag?.id !== event.pointerId) return;
      const {prop,moved}=drag;
      const target = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-actor]');
      drag=null;
      root.querySelectorAll('.sd-hover').forEach(actor=>actor.classList.remove('sd-hover'));
      if (submit && moved && target && prop.dataset.prop===round.prop && target.dataset.actor===round.actor) deliver(prop,target);
      const previous=prop.style.translate;
      prop.classList.remove('sd-drag');
      prop.style.translate='';
      if (submit && moved && target && phase==='ready') deliver(prop,target);
      else if (phase==='ready' && moved) animate(prop,[{translate:previous},{translate:'0'}],{duration:250,easing:'ease-out'});
    }
    root.onpointerup = event => clearDrag(event,true);
    root.onpointercancel = event => clearDrag(event,false);
    const hush = () => { if (document.hidden || window.LearningApp?.isMuted()) sounds.forEach(audio=>audio.pause()); };
    document.addEventListener('visibilitychange',hush);
    document.addEventListener('change',hush);
    close = () => {
      dead=true;
      timers.forEach(clearTimeout);
      sounds.forEach(audio=>audio.pause());
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      if (ready) app.destroy(true,{children:true,texture:false});
      root.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
      document.removeEventListener('visibilitychange',hush);
      document.removeEventListener('change',hush);
      close=null;
    };
    fetch(art+round.gif).then(r=>{if(r.ok)return r.blob();}).then(blob=>{gif=blob;}).catch(()=>{});
    pixi().then(async()=>{
      if (dead) return;
      app=new PIXI.Application();
      await app.init({width:800,height:450,backgroundAlpha:0,antialias:true});
      if (dead) { app.destroy(true,{children:true,texture:false}); return; }
      ready=true;
      app.ticker.maxFPS=45;
      q('.sd-fx').append(app.canvas);
    }).catch(()=>{});
  }
  games[key]={enter};
  GAME_META[key]=['UNIT 4 · LESSON 5','Scene Director','Listen and move the props'];
  document.addEventListener('learning:leave-activity',()=>close?.());
})();
