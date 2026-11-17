(() => {
  'use strict';
  const game = 'u4missingkey';
  const art = 'assets/missing-key/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lines = {
    key: 'I need the key!',
    lion: 'Come in, Lion!',
    kangaroo: 'Come in, Kangaroo!',
    lollipop: 'A lollipop, please!'
  };
  const slips = { key: 'Key receipt', lion: 'Entry ticket', kangaroo: 'Entry ticket', lollipop: 'Delivery label' };
  let leave;

  function start() {
    leave?.();
    window.cancelVoice?.();
    window.SentenceWordAudio?.stop();
    const guests = Math.random() < .5 ? ['lion', 'kangaroo'] : ['kangaroo', 'lion'];
    const recall = ['key', 'lion', 'kangaroo', 'lollipop'];
    for (let i = recall.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [recall[i], recall[j]] = [recall[j], recall[i]];
    }
    const words = ['key', ...guests, 'lollipop', ...recall];
    let round = 0;
    let phase = 'say';
    let recognition;
    let timeout;
    let voice;
    let motion;
    let fanfare;
    const arrivals = new Set();

    setStage(`<section class="mk-game"><header><h2>The Missing Key</h2><span class="mk-progress"></span></header>
      <div class="mk-scene"><div class="mk-camera"><img class="mk-backdrop" src="${art}parade.webp" alt="">
        <div class="mk-gate" aria-hidden="true"><i></i><i></i></div><div class="mk-signal" aria-hidden="true"></div><div class="mk-reveal"></div></div>
        <div class="mk-radio"><span class="mk-radiolabel"></span><strong class="mk-word"></strong></div>
      </div>
      <section class="mk-slip" hidden><h3></h3><div class="mk-trace-row"></div></section>
      <p class="mk-status" role="status"></p><div class="mk-actions"></div>
      <details class="mk-teacher"><summary>Teacher controls</summary>
        <p>Have the learner say the word or the full line before confirming.</p>
        <button type="button" data-act="confirm">Confirm spoken response</button>
      </details>
    </section>`);
    const root = document.querySelector('.mk-game');
    const q = selector => root.querySelector(selector);
    const slip = q('.mk-slip');
    const status = text => { q('.mk-status').textContent = text; };
    const actions = (...buttons) => {
      q('.mk-actions').innerHTML = buttons.map(([action, label]) =>
        `<button type="button" data-act="${action}">${label}</button>`).join('');
    };
    const word = () => words[round];
    function stopMic() {
      clearTimeout(timeout);
      if (!recognition) return;
      const active = recognition;
      recognition = null;
      active.abort();
      root.classList.remove('mk-listening');
    }
    function stopVoice() {
      voice?.pause();
      voice = null;
    }
    function playWord() {
      stopMic();
      stopVoice();
      const clip = window.KeyQuestClips?.clips[word()];
      if (!clip || window.LearningApp?.isMuted()) return;
      voice = new Audio(clip.src);
      voice.play().catch(() => status('Audio is unavailable. You can keep playing.'));
    }
    function camera(origin, scale, duration) {
      if (reduced.matches) return;
      const stage = q('.mk-camera');
      stage.getAnimations().forEach(animation => animation.cancel());
      stage.style.transformOrigin = origin;
      stage.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(' + scale + ')', offset: .37 },
        { transform: 'scale(' + scale + ')', offset: .66 },
        { transform: 'scale(1)' }
      ], { duration, easing: 'ease-in-out' });
    }
    function showRound() {
      q('.mk-camera').getAnimations().forEach(animation => animation.cancel());
      phase = 'say';
      root.dataset.target = word();
      root.classList.remove('mk-gate-open');
      q('.mk-progress').textContent = round < 4 ? `${round + 1} / 4` : `${round - 3} / 4`;
      q('.mk-radiolabel').textContent = round < 4 ? 'Parade radio' : 'Final roll call';
      q('.mk-word').textContent = word();
      q('.mk-reveal').replaceChildren();
      q('.mk-teacher').hidden = false;
      q('.mk-teacher').open = false;
      slip.hidden = true;
      status(round < 4 ? 'Read the word aloud.' : 'Read it as soon as you know it.');
      actions(['mic', 'Speak'], ['hint', 'Get help']);
    }
    function acceptSpeech() {
      if (phase !== 'say') return;
      stopMic();
      stopVoice();
      phase = 'revealed';
      if (round < 4 && guests.includes(word())) root.classList.add('mk-gate-open');
      q('.mk-teacher').hidden = true;
      const sprite = new Image();
      sprite.src = art + word() + '.webp';
      sprite.alt = word();
      q('.mk-reveal').append(sprite);
      if (round < 4) camera(word() === 'key' ? '16% 65%' : word() === 'lollipop' ? '84% 60%' : '50% 63%', 1.24, 1800);
      if (!reduced.matches) {
        motion = sprite.animate([
          { opacity: 0, transform: 'translateY(24%) scale(.62)' },
          { opacity: 1, transform: 'translateY(-5%) scale(1.04)', offset: .76 },
          { opacity: 1, transform: 'none' }
        ], { duration: 620, easing: 'cubic-bezier(.22,.7,.25,1)' });
      }
      playWord();
      if (round < 4) {
        status('Trace the word to finish your slip.');
        actions(['trace', 'Trace the word'], ['listen', 'Hear the word']);
      } else {
        status('You called the right word!');
        actions(['next', round === 7 ? 'Start the parade' : 'Next call']);
      }
    }
    function listen() {
      stopMic();
      stopVoice();
      const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Speech) {
        status('Say it to your teacher, then ask them to confirm.');
        q('.mk-teacher').open = true;
        return;
      }
      const active = new Speech();
      recognition = active;
      active.lang = 'en-US';
      active.interimResults = false;
      active.maxAlternatives = 3;
      function retry(message) {
        if (recognition !== active) return;
        stopMic();
        status(message);
      }
      active.onstart = () => {
        if (recognition !== active) return;
        root.classList.add('mk-listening');
        status('Listening…');
      };
      active.onresult = event => {
        if (recognition !== active) return;
        const heard = Array.from(event.results[0], result =>
          result.transcript.toLowerCase().match(/[a-z]+/g) || []);
        if (heard.some(tokens => tokens.includes(word()))) acceptSpeech();
        else retry('Try the word again, or ask your teacher to confirm.');
      };
      active.onerror = () => retry('The microphone could not hear clearly. Try again or ask your teacher.');
      active.onend = () => retry('Tap Speak to try again.');
      timeout = setTimeout(() => retry('Tap Speak to try again.'), 9000);
      try { active.start(); } catch { retry('The microphone is unavailable. Ask your teacher to confirm.'); }
    }
    function finish() {
      phase = 'complete';
      stopVoice();
      q('.mk-radiolabel').textContent = 'Parade ready';
      q('.mk-word').textContent = 'Let’s go!';
      q('.mk-reveal').replaceChildren(...Array.from(arrivals, name => {
        const sprite = new Image();
        sprite.src = art + name + '.webp';
        sprite.alt = name;
        return sprite;
      }));
      root.classList.add('mk-finale');
      camera('50% 56%', 1.17, 2800);
      root.classList.add('mk-gate-open');
      if (!reduced.matches) {
        q('.mk-reveal').querySelectorAll('img').forEach((sprite, i) => {
          sprite.animate([
            { opacity: 0, transform: 'translate(155%, -42%) scale(.28)' },
            { opacity: 1, transform: 'translate(85%, -24%) scale(.57)', offset: .28 },
            { transform: 'translate(30%, 2%) rotate(-7deg) scale(.9)', offset: .72 },
            { transform: 'translateY(-7%) rotate(4deg)', offset: .88 },
            { transform: 'none' }
          ], { delay: 350 + i * 220, duration: 1750, fill: 'backwards', easing: 'ease-out' });
        });
        const colors = ['#ffe079', '#ff806b', '#a2edda', '#a8c9ff'];
        for (let i = 0; i < 36; i++) {
          const ribbon = document.createElement('i');
          ribbon.className = 'mk-ribbon';
          ribbon.style.backgroundColor = colors[i % colors.length];
          ribbon.style.left = (8 + ((i * 31) % 84)) + '%';
          q('.mk-scene').append(ribbon);
          const fall = ribbon.animate([
            { opacity: 0, transform: 'translateY(-30px) rotate(0deg)' },
            { opacity: 1, offset: .15 },
            { opacity: 0, transform: 'translate(36px, 260px) rotate(480deg)' }
          ], { delay: 1000 + (i % 9) * 85, duration: 1450, fill: 'backwards' });
          fall.finished.then(() => ribbon.remove(), () => ribbon.remove());
        }
      }
      if (!document.hidden && !window.LearningApp?.isMuted() && document.querySelector('#soundFx')?.checked) {
        fanfare = new Audio('assets/feedback/confirmation_004.wav');
        fanfare.volume = .25;
        fanfare.play().catch(() => {});
      }

      status('You called and wrote all four words.');
      actions(['restart', 'Play again']);
      document.dispatchEvent(new CustomEvent('learning:activity-completed', { detail: { game, stars: 3 } }));
    }
    function startTrace() {
      phase = 'trace';
      stopVoice();
      slip.hidden = false;
      slip.querySelector('h3').textContent = slips[word()];
      const row = slip.querySelector('.mk-trace-row');
      row.innerHTML = [...word()].map((letter, index) => {
        const paths = letter === 'p'
          ? ['M32 72 L32 183', 'M32 95 C45 61 103 62 103 104 C103 145 55 155 32 127']
          : window.KLAdventures.tracePaths(letter);
        return traceCardHTML(letter, index, paths ? { paths } : undefined);
      }).join('');
      const cards = [...row.children];
      const tracing = {
        updateTraceProgress() {},
        finishLetter(card) {
          card.classList.remove('active');
          card.classList.add('done');
          card.querySelector('.trace-dot.current')?.classList.remove('current');
          const next = cards[Number(card.dataset.traceCard) + 1];
          if (next) {
            next.classList.add('active');
            bindTraceCard(tracing, next);
            next.scrollIntoView({ block: 'center', behavior: 'instant' });
            return;
          }
          arrivals.add(word());
          phase = 'written';
          status('Your word is on the list!');
          actions(['next', round === 3 ? 'Start roll call' : 'Next mission']);
          playWord();
        }
      };
      bindTraceCard(tracing, cards[0]);
      status('Start at the yellow dot. Lift your finger between strokes.');
      actions(['listen', 'Hear the word']);
      cards[0].scrollIntoView({ block: 'center', behavior: 'instant' });
    }
    root.addEventListener('click', event => {
      const action = event.target.closest('button')?.dataset.act;
      if (action === 'mic' && phase === 'say') listen();
      if (action === 'confirm') acceptSpeech();
      if (action === 'hint' && phase === 'say') {
        status(round < 4 ? lines[word()] : 'Listen, then say the word.');
        playWord();
      }
      if (action === 'listen' && ['revealed', 'trace'].includes(phase)) playWord();
      if (action === 'trace' && phase === 'revealed') startTrace();
      if (action === 'next' && ['written', 'revealed'].includes(phase)) {
        stopVoice();
        motion?.cancel();
        if (round === 7) finish();
        else { round++; showRound(); }
      }
      if (action === 'restart' && phase === 'complete') start();
    });
    const onVisibility = () => { if (document.hidden) { stopMic(); stopVoice(); fanfare?.pause(); } };
    const onSettings = () => { if (window.LearningApp?.isMuted()) { stopVoice(); fanfare?.pause(); } };
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('change', onSettings);
    leave = () => {
      stopMic();
      stopVoice();
      motion?.cancel();
      fanfare?.pause();
      root.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('change', onSettings);
      leave = null;
    };
    showRound();
  }
  games[game] = { enter: start };
  GAME_META[game] = ['UNIT 4 · LESSON 5', 'The Missing Key', 'Read, speak and write'];
  document.addEventListener('learning:leave-activity', () => leave?.());
})();
