(() => {
  'use strict';

  const base = 'assets/unit4/lesson6/';
  const lesson = '#/unit/4/lesson/6?mode=practice';
  const panel = number => base + 'clues/scene-' + number + '.webp?v=source-sharp';
  const lines = {
    grandpa: {text: 'This is my grandpa.', marks: [0,.30,.50,.76]},
    mum: {text: 'This is my mum.', marks: [0,.38,.56,.80]},
    brother: {text: 'This is my brother, Billy.', marks: [0,.34,.54,.80,1.32]}
  };
  const scenes = [
    {number: 1, person: 'grandpa', correct: 0},
    {number: 2, person: 'mum', correct: 0},
    {number: 3},
    {number: 4, person: 'brother', correct: 1}
  ];
  let activeAudio;

  function stopAudio() {
    activeAudio?.stop();
    activeAudio = null;
  }

  function play(clip, button, status, {words, marks, onEnd} = {}) {
    if (activeAudio?.button === button) {
      stopAudio();
      return;
    }
    stopAudio();
    if (window.LearningApp?.isMuted()) {
      status.textContent = 'Sound is off. Turn it on in Game controls.';
      return;
    }
    const audio = new Audio(base + 'audio/' + clip + '.mp3');
    let frame;
    const label = button.textContent;
    function stop() {
      cancelAnimationFrame(frame);
      audio.pause();
      button.textContent = label;
      words?.forEach(word => word.classList.remove('is-speaking'));
      audio.onended = audio.onerror = null;
    }
    function failed() {
      if (activeAudio?.audio !== audio) return;
      stopAudio();
      status.textContent = 'Audio could not play. Try again.';
    }
    function tick() {
      const index = marks.findLastIndex(mark => audio.currentTime >= mark);
      words.forEach((word,i) => word.classList.toggle('is-speaking', i === index && !audio.paused));
      frame = requestAnimationFrame(tick);
    }
    activeAudio = {audio,button,stop};
    button.textContent = 'Stop audio';
    status.textContent = '';
    audio.onended = () => {
      stopAudio();
      onEnd?.();
    };
    audio.onerror = failed;
    audio.play().then(() => {
      if (marks && activeAudio?.audio === audio) frame = requestAnimationFrame(tick);
    }).catch(failed);
  }

  function model(person, button, status, caption) {
    const line = lines[person];
    caption.replaceChildren(...line.text.split(' ').flatMap((word,i) => {
      const span = document.createElement('span');
      span.textContent = word;
      return i ? [' ',span] : [span];
    }));
    play(person,button,status,{words:[...caption.children],marks:line.marks});
  }

  function mount(title, caption, content) {
    stopAudio();
    setStage(`<section class="u4-story"><header><h2>${title}</h2><b>${caption}</b></header>${content}</section>`);
    return document.querySelector('.u4-story');
  }

  function storyFrame(scene, controls, markers = '') {
    return `<div class="u4-story-stage">
      <figure data-story-scene="${scene.number}"><img src="${panel(scene.number)}" alt="Story picture ${scene.number}">${markers}</figure>
      <div class="u4-story-controls">${controls}<p class="u4-story-status" role="status"></p></div>
    </div>`;
  }

  function finish(title, game, again) {
    const root = mount(title,'Finished',`<div class="u4-story-finish"><h3 tabindex="-1">Well done!</h3>
      <button data-story-again>Play again</button> <button data-story-back>Back to Lesson 6</button></div>`);
    root.querySelector('h3').focus();
    root.querySelector('[data-story-again]').onclick=again;
    root.querySelector('[data-story-back]').onclick=()=>window.LearningApp.go(lesson);
    document.dispatchEvent(new CustomEvent('learning:activity-completed',{detail:{game,stars:3}}));
  }

  function listenAndFind() {
    const title = 'Listen & Find';
    let index = 0;
    function render() {
      const scene = scenes[index];
      const markers = scene.person ? [0,1,2].map(i =>
        `<button class="u4-story-marker" data-story-person="${i}" aria-label="Person ${i+1}">${i+1}</button>`
      ).join('') : '';
      const root = mount(title,`${index+1} / 4`,storyFrame(scene,`
        <h3 tabindex="-1">${scene.person ? 'Listen and point.' : 'Look at the costume.'}</h3>
        <p data-story-prompt>${scene.person ? 'Which person did you hear about?' : 'What do you think will happen next? Say your idea.'}</p>
        <button data-story-hear>Hear the scene</button>
        <button data-story-model hidden>Hear the sentence</button>
        <button data-story-next ${scene.person ? 'hidden' : ''}>${index===3 ? 'Finish' : 'Next picture'}</button>
      `,markers));
      const status = root.querySelector('[role=status]');
      const hear = root.querySelector('[data-story-hear]');
      const headline = root.querySelector('h3');
      root.querySelector('[data-story-next]').onclick = () => {
        if (++index === scenes.length) finish(title,'u4storyfind',listenAndFind);
        else {render(); document.querySelector('.u4-story h3').focus();}
      };
      hear.onclick = () => play('scene-'+scene.number,hear,status);
      const hearModel = root.querySelector('[data-story-model]');
      hearModel.onclick = () => model(scene.person,hearModel,status,headline);
      const options = [...root.querySelectorAll('[data-story-person]')];
      options.forEach((option,i) => option.onclick = () => {
        if (i !== scene.correct) {
          status.textContent = 'Look again and try another person.';
          return;
        }
        stopAudio();
        options.forEach(other => {if(other!==option) other.hidden=true;});
        option.dataset.found = 'true';
        option.setAttribute('aria-disabled','true');
        option.onclick=null;
        headline.textContent=lines[scene.person].text;
        root.querySelector('[data-story-prompt]').textContent='Point and say the whole sentence.';
        root.querySelector('[data-story-next]').hidden=false;
        hearModel.hidden=false;
        status.textContent='You found the person!';
        headline.focus({preventScroll:true});
      });
    }
    render();
    restartCurrent = listenAndFind;
  }

  function orderAndTell() {
    const title = 'Story Order & Tell';
    const order = shuffle([1,2,3,4]);
    if (order.every((number,i) => number===i+1)) order.push(order.shift());
    const placed = [];
    let selected;
    const root = mount(title,'',`
      <p class="u4-story-order-prompt">Pick or drag the pictures into story order.</p>
      <div class="u4-story-row" data-story-slots>${scenes.map(({number}) =>
        `<button data-slot="${number}" aria-label="Slot ${number}">${number}</button>`).join('')}</div>
      <div class="u4-story-row" data-story-tiles>${order.map(number =>
        `<button data-tile="${number}" draggable="true" aria-pressed="false">
          <img src="${panel(number)}" draggable="false" alt="${['','A man by a computer','A family in the hallway','Someone in a costume','Two girls and a little boy'][number]}">
        </button>`).join('')}</div>
      <div class="u4-story-order-actions">
        <button data-order-reset hidden>Try again</button>
        <button data-order-hear hidden>Hear this scene</button>
        <button data-order-finish hidden>Finish</button>
      </div><p class="u4-story-status" role="status"></p>`);
    const slots = [...root.querySelectorAll('[data-slot]')];
    const tiles = [...root.querySelectorAll('[data-tile]')];
    const status = root.querySelector('[role=status]');
    const reset = root.querySelector('[data-order-reset]');
    const hear = root.querySelector('[data-order-hear]');
    const done = root.querySelector('[data-order-finish]');
    let ordered = false;

    function select(number) {
      selected = number;
      tiles.forEach(tile => tile.setAttribute('aria-pressed', String(+tile.dataset.tile === number)));
    }

    function place(i, number) {
      if (ordered || placed[i] || !number || placed.includes(number)) return;
      const tile = tiles.find(item => +item.dataset.tile === number);
      if (!tile) return;
      placed[i] = number;
      tile.hidden = true;
      const picture = tile.querySelector('img').cloneNode();
      slots[i].replaceChildren(picture);
      slots[i].setAttribute('aria-label',`Slot ${i+1}: ${picture.alt}`);
      select();
      if (placed.filter(Boolean).length < slots.length) {
        const nextTile = tiles.find(item => !item.hidden);
        nextTile?.focus();
        return;
      }
      ordered = placed.every((panelNumber, index) => panelNumber===index+1);
      reset.hidden = ordered;
      hear.hidden = done.hidden = !ordered;
      status.textContent = ordered ? 'Point to each picture and tell the story aloud.' : 'Look at what happens first and last. Try the order again.';
      if (ordered) {
        selectScene(0);
        slots[0].focus();
      } else reset.focus();
    }

    let sceneIndex=0;
    function selectScene(i) {
      stopAudio();
      sceneIndex=i;
      slots.forEach((slot,index)=>slot.setAttribute('aria-pressed',String(i===index)));
      hear.textContent=`Hear scene ${i+1}`;
    }
    tiles.forEach(tile=>{
      tile.onclick=()=>select(+tile.dataset.tile);
      tile.ondragstart=event=>{
        select(+tile.dataset.tile);
        event.dataTransfer.setData('application/x-letter-land-story',tile.dataset.tile);
        event.dataTransfer.effectAllowed='move';
      };
    });
    slots.forEach((slot,i)=>{
      slot.onclick=()=>ordered?selectScene(i):place(i,selected);
      slot.ondragover=event=>{
        if (!ordered && event.dataTransfer.types.includes('application/x-letter-land-story')) event.preventDefault();
      };
      slot.ondrop=event=>{
        event.preventDefault();
        place(i,Number(event.dataTransfer.getData('application/x-letter-land-story')));
      };
    });
    reset.onclick=orderAndTell;
    hear.onclick=()=>play('scene-'+(sceneIndex+1),hear,status);
    done.onclick=()=>finish(title,'u4storyorder',orderAndTell);
    restartCurrent=orderAndTell;
  }

  for (const [key,title,enter] of [
    ['u4storyfind','Listen & Find',listenAndFind],
    ['u4storyorder','Story Order & Tell',orderAndTell]
  ]) {
    games[key]={enter};
    GAME_META[key]=['UNIT 4 · LESSON 6',title,'My brother!'];
  }

  document.addEventListener('learning:leave-activity',stopAudio);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) stopAudio();});
  document.addEventListener('toybuddy:enter',()=>{if(window.LearningApp?.isMuted()) stopAudio();});
  window.Unit4StoryAudio={model,stop:stopAudio};
})();
