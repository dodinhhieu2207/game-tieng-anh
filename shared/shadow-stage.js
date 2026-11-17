(() => {
  const game = 'u4shadowstage';
  const art = 'assets/shadow-stage/';
  const steps = [
    { title: 'Open the gate', word: 'key', other: 'kangaroo', hint: 'Drag the key into the lock, then turn it.', label: 'Turn the key' },
    { title: 'Raise the lift', word: 'lion', hint: 'Pull the handle up to lift the lion.', label: 'Raise the lift' },
    { title: 'Move the cart', word: 'lollipop', hint: 'Push the cart to the gold mark.', label: 'Push the cart' }
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const image = (name, className) => `<img class="${className}" src="${art}${name}.webp" alt="" draggable="false">`;
  let leave;

  function start() {
    leave?.();
    let index = 0;
    let amount = 0;
    let inserted = false;
    let finished = false;
    let turn = false;
    let gesture;
    let dragged = false;
    let audio;
    let transition;
    let voiceTimer;
    let locking = false;
    let alive = true;
    setStage(`<section class="ss-game"><header><h2>Shadow Stage</h2><span class="ss-count"></span></header>
      <div class="ss-stage"><div class="ss-camera">${image('stage','ss-backdrop')}<div class="ss-table"></div><div class="ss-curtains">${image('curtain','')}${image('curtain','')}</div></div></div>
      <p class="ss-status" role="status"></p>
      <div class="ss-controls"></div></section>`);
    const root = document.querySelector('.ss-game');
    const q = selector => root.querySelector(selector);
    const table = q('.ss-table');
    const status = value => { q('.ss-status').textContent = value; };
    function play(word, fx = false) {
      audio?.pause();
      audio = null;
      if (window.LearningApp?.isMuted() || (fx && !document.querySelector('#soundFx')?.checked)) return;
      const src = fx ? 'assets/feedback/open_001.wav' : window.KeyQuestClips?.clips[word]?.src;
      if (!src) return;
      audio = new Audio(src);
      audio.volume = fx ? .25 : 1;
      audio.play().catch(() => {});
    }
    function motion(node, frames, duration) {
      if (!reduced.matches) return node.animate(frames, {duration, easing:'cubic-bezier(.22,.7,.23,1)'});
    }
    function controls(html) { q('.ss-controls').innerHTML = html; }
    function render() {
      inserted = finished = false;
      amount = 0;
      const step = steps[index];
      root.dataset.scene = String(index);
      q('.ss-count').textContent = (index + 1) + ' / 3';
      const props = [
        `<div class="ss-gate">${image('curtain','')}${image('curtain','')}</div><button class="ss-guest ss-word-target" data-word="kangaroo" aria-label="Hear kangaroo">${image('kangaroo','')}</button><button class="ss-lock ss-word-target" data-word="key" aria-label="Hear key">${image('lock-bolt','ss-lock-bolt')}${image('lock','ss-lock-plate')}${image('lock-cylinder','ss-lock-cylinder')}<i class="ss-lock-ring" aria-hidden="true"></i></button>
          <button class="ss-key ss-prop" data-word="key" aria-label="Insert or turn the key">${image('key','ss-key-full')}${image('key-bow','ss-key-bow')}<span>key</span></button>`,
        `<div class="ss-lift"><button class="ss-lion ss-word-target" data-word="lion" aria-label="Hear lion">${image('lion','')}</button>${image('lift','ss-podium')}<span>lion</span></div>
          <button class="ss-lever ss-prop" aria-label="Raise the lift">${image('knob','')}</button>`,
        `<div class="ss-mark"></div><button class="ss-cart ss-prop" data-word="lollipop" aria-label="Push the cart">${image('lollipop','ss-candy')}${image('cart','ss-body')}${image('wheel','ss-wheel')}${image('wheel','ss-wheel')}<span>lollipop</span></button>`
      ];
      table.className = 'ss-table';
      table.style.cssText = '';
      table.innerHTML = props[index];
      controls(`<button data-act="operate">${index === 0 ? 'Insert the key' : step.label}</button>`);
      status(step.hint);
      update();
    }
    function update() {
      table.style.setProperty('--travel', amount);
    }
    async function seat() {
      if (locking || inserted) return;
      locking = true;
      const key = q('.ss-key');
      const lock = q('.ss-lock').getBoundingClientRect();
      const from = key.getBoundingClientRect();
      const dx = lock.left + lock.width * .5 - (from.left + from.width * .78);
      const dy = lock.top + lock.height * .536 - (from.top + from.height * .82);
      status('Sliding the key into the lock…');
      const slide = motion(key.querySelector('.ss-key-full'), [
        {transform:'none',clipPath:'polygon(0 0,100% 0,100% 100%,100% 100%,0 100%)'},
        {transform:`translate(${dx}px,${dy}px) scale(.72)`,clipPath:'polygon(0 0,100% 0,100% 36%,36% 100%,0 100%)'}
      ], 540);
      if (slide) await slide.finished.catch(() => {});
      if (!alive) return;
      inserted = true;
      amount = 0;
      table.classList.add('ss-seated');
      key.style.translate = '';
      update();
      locking = false;
      status('Turn the key clockwise.');
      q('[data-act=operate]').textContent = 'Turn the key';
      play('key');
    }
    async function turnKey() {
      if (locking || finished || !inserted) return;
      locking = true;
      status('Turning the lock…');
      zoomLock();
      const start = amount;
      const spinFrames = [
        {rotate: start * 85 + 'deg'},
        {rotate: '90deg', offset:.83},
        {rotate: '85deg'}
      ];
      const spins = ['.ss-key-bow', '.ss-lock-cylinder'].map(selector =>
        motion(q(selector), spinFrames, 760)
      );
      await Promise.all(spins.map(animation => animation?.finished.catch(() => {})));
      if (!alive) return;
      await releaseLatch();
    }
    function zoomLock() {
      const camera = q('.ss-camera');
      camera.getAnimations().forEach(animation => animation.cancel());
      motion(camera, [
        {transform:'scale(1)'},
        {transform:'scale(1.62)',offset:.29},
        {transform:'scale(1.62)',offset:.56},
        {transform:'scale(1)'}
      ], 2250);
    }
    async function releaseLatch() {
      locking = true;
      amount = 1;
      update();
      status('Click! The gate is unlocked.');
      play(null, true);
      const bolt = motion(q('.ss-lock-bolt'), [
        {transform:'none'},
        {transform:'translateX(8%)',offset:.24},
        {transform:'translateX(-66%)'}
      ], 400);
      const ring = motion(q('.ss-lock-ring'), [
        {transform:'scale(.75)',opacity:0},
        {transform:'scale(1.12)',opacity:1,offset:.25},
        {transform:'scale(2.05)',opacity:0}
      ], 400);
      await Promise.all([bolt, ring].map(animation => animation?.finished.catch(() => {})));
      if (!alive) return;
      q('.ss-lock-bolt').classList.add('ss-bolt-retracted');
      locking = false;
      complete();
    }
    function complete() {
      if (finished) return;
      finished = true;
      amount = 1;
      update();
      table.classList.add('ss-done');

      const guest = q('.ss-guest');
      if (guest) motion(guest, [
        {transform:'translate(-90%,4%) scale(.46)',opacity:0},
        {transform:'translate(-64%,-6%) scale(.65)',opacity:1,offset:.38},
        {transform:'translate(-25%,-14%) scale(.87)',opacity:1,offset:.76},
        {transform:'none',opacity:1}
      ], 1050);
      if (index === 0) {
        voiceTimer = setTimeout(() => play('kangaroo'), 1040);
      } else {
        play(steps[index].word);
      }
      status(['The kangaroo is through the gate!', 'The lion is in the spotlight!', 'The cart is on its mark!'][index]);
      controls(`<button class="ss-turn" data-act="turn">${index === 2 ? 'Turn to the audience' : 'Turn the stage'}</button>`);
    }
    async function rotate() {
      if (!finished || turn) return;
      turn = true;
      const old = motion(table,[{transform:'perspective(850px) rotateY(0deg)'},{transform:'perspective(850px) rotateY(-84deg)'}],300);
      transition = old;
      if (old) await old.finished.catch(() => {});
      if (!root.isConnected || transition !== old) return;
      if (++index < steps.length) render();
      else finale();
      transition = motion(table,[{transform:'perspective(850px) rotateY(84deg)'},{transform:'none'}],390);
      turn = false;
    }
    function finale() {
      root.dataset.scene = 'finale';
      q('.ss-count').textContent = 'Showtime!';
      table.className = 'ss-table ss-finale';
      table.innerHTML = ['kangaroo','lion','lollipop'].map(word => `<figure><button class="ss-word-target" data-word="${word}" aria-label="Hear ${word}">${image(word,'')}</button><figcaption>${word}</figcaption></figure>`).join('');
      root.classList.add('ss-show');
      root.querySelectorAll('.ss-curtains img').forEach((curtain, i) => {
        motion(curtain, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + (i ? 105 : -105) + '%)' }], 920);
      });
      motion(q('.ss-stage'),[{transform:'scale(.98)'},{transform:'scale(1.025)',offset:.55},{transform:'scale(1)'}],1100);
      status('The show is ready!');
      controls('<button data-act="restart">Play again</button>');
      play(null, true);
      document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game,stars:3}}));
    }
    root.addEventListener('click', event => {
      const action = event.target.closest('button')?.dataset.act;
      if (action === 'restart') start();
      if (action === 'turn') rotate();
      if (action === 'operate' && !finished && !locking) {
        if (index === 0 && !inserted) seat();
        else if (index === 0) turnKey();
        else complete();
      }
      const wordTarget = event.target.closest('[data-word]');
      if (wordTarget && (event.detail === 0 || !dragged)) {
        clearTimeout(voiceTimer);
        play(wordTarget.dataset.word);
        const sprite = wordTarget.querySelector('.ss-lock-plate, .ss-seated .ss-key-bow, .ss-key-full:not(.ss-seated *), .ss-candy') || wordTarget.querySelector('img');
        if (sprite) {
          sprite.getAnimations().forEach(animation => animation.cancel());
          motion(sprite, [
            { scale: '1', filter: 'brightness(1)' },
            { scale: '1.09', filter: 'brightness(1.18) drop-shadow(0 0 9px #ffe692)', offset: .4 },
            { scale: '1', filter: 'brightness(1)' }
          ], 480);
        }
      }
    });
    root.onpointerdown = event => {
      dragged = false;
      const prop = event.target.closest('.ss-prop,.ss-turn');
      if (!prop || locking || gesture || event.button !== 0 || (finished && prop.matches('.ss-prop'))) return;
      gesture = {prop,id:event.pointerId,x:event.clientX,y:event.clientY,amount};
      prop.setPointerCapture(event.pointerId);
    };
    root.onpointermove = event => {
      if (gesture?.id !== event.pointerId) return;
      if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 6) dragged = true;
      if (!dragged) return;
      if (gesture.prop.matches('.ss-turn')) {
        const angle = Math.max(-28, Math.min(28, (event.clientX - gesture.x) * .45));
        table.style.transform = 'perspective(850px) rotateY(' + angle + 'deg)';
        return;
      }
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      const width = table.clientWidth;
      if (index === 0 && !inserted) {
        gesture.prop.style.translate = dx + 'px ' + dy + 'px';
        return;
      }
      const distance = index === 1 ? -dy : index === 0 ? dx + dy * .35 : dx;
      amount = Math.min(1, Math.max(0, gesture.amount + distance / (width * (index === 2 ? .48 : .22))));
      update();
      if (amount >= .98 && !locking) {
        gesture = null;
        if (index === 0) { zoomLock(); releaseLatch(); }
        else complete();
      }
    };
    root.onpointerup = event => {
      if (gesture?.id !== event.pointerId) return;
      const {prop, x} = gesture;
      gesture = null;
      if (prop.matches('.ss-turn')) {
        table.style.transform = '';
        if (Math.abs(event.clientX - x) > 26) rotate();
        return;
      }
      if (!dragged || index !== 0 || inserted) return;
      const lock = q('.ss-lock').getBoundingClientRect();
      if (Math.hypot(event.clientX - (lock.left + lock.width / 2),event.clientY - (lock.top + lock.height / 2)) < Math.max(35, lock.width * .7)) seat();
      else prop.style.translate = '';
    };
    root.onpointercancel = () => {
      table.style.transform = '';
      if (gesture && index === 0 && !inserted) gesture.prop.style.translate = '';
      gesture = null;
    };
    const stopWhenHidden = () => { if (document.hidden) { clearTimeout(voiceTimer); audio?.pause(); } };
    document.addEventListener('visibilitychange', stopWhenHidden);
    leave = () => {
      alive = false;
      clearTimeout(voiceTimer);
      audio?.pause();
      transition?.cancel();
      transition = null;
      root.getAnimations({subtree:true}).forEach(animation => animation.cancel());
      document.removeEventListener('visibilitychange', stopWhenHidden);
      leave = null;
    };
    render();
  }

  games[game] = {enter:start};
  GAME_META[game] = ['UNIT 4 · LESSON 5','Shadow Stage','Get the show ready'];
  document.addEventListener('learning:leave-activity', () => leave?.());
})();
