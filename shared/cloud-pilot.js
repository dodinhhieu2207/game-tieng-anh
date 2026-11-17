(() => {
  'use strict';
  const game = 'u4cloudpilot';
  const words = ['key','lion','kangaroo','lollipop'];
  const art = 'assets/cloud-pilot/';
  const images = {key:'treasure-key',lion:'lion',kangaroo:'kangaroo',lollipop:'lollipop'};
  const letterFor = word => word[0].toUpperCase();
  const pairFor = letter => letter + letter.toLowerCase();
  const picture = word => 'assets/key-quest/' + images[word] + '.png';

  const chapters = {
    listen:{title:'Listen for the sound', effect:'radio'},
    picture:{title:'Find the picture word', effect:'cloud-split'},
    compare:{title:'Read past the first letter', effect:'cargo'}
  };
  const stageFor = index => index<2?'listen':index<6?'picture':'compare';
  const soundFor = word => letterData[letterFor(word)].soundAudio;
  const foils = {key:'kangaroo',kangaroo:'key',lion:'lollipop',lollipop:'lion'};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const effects = new Map();
  function motionAsset(name) {
    if (!effects.has(name)) {
      effects.set(name,fetch(art+name+'.gif').then(response=>{
        if (!response.ok) throw new Error('Cloud animation unavailable');
        return response.blob();
      }).catch(()=>{effects.delete(name);return null;}));
    }
    return effects.get(name);
  }
  function buildRounds() {
    const k=shuffle(['key','kangaroo']), l=shuffle(['lion','lollipop']);
    return [...shuffle([k[0],l[0]]),...shuffle(words.slice()),...shuffle([k[1],l[1]])];
  }
  function inventory(scene, host) {
    host.replaceChildren();
    for(const word of words) {
      const item=document.createElement('span');
      item.className='cpk-cargo-slot';
      item.setAttribute('aria-label',scene.cargo.has(word)?word:'Empty cargo slot');
      if(scene.cargo.has(word)) {
        const image=new Image();
        image.src=picture(word);
        image.alt=word;
        item.append(image);
      }
      host.append(item);
    }
  }
  function render(scene) {
    const stage = stageFor(scene.index);
    const chapter = chapters[stage];
    if (!reduced.matches) motionAsset(chapter.effect);
    scene.root.dataset.chapter=stage;
    scene.cargo??=new Set();
    const world = scene.$('.td-world');
    const badge=document.createElement('div');
    badge.className='cpk-chapter';
    const number=stage==='listen'?1:stage==='picture'?2:3;
    badge.innerHTML=`<img src="${art}${chapter.effect}-idle.webp" alt=""><h3>${chapter.title}</h3><span>${number} / 3</span>`;
    scene.$('.td-header').after(badge);
    const cargo=document.createElement('div');
    cargo.className='cpk-cargo';
    cargo.setAttribute('aria-label','Collected cargo');
    inventory(scene,cargo);
    world.after(cargo);
    if(stage==='listen') {
      const prompt=world.querySelector('.td-request');
      prompt.querySelector('img').src=art+'radio-idle.webp';
      prompt.querySelector('img').alt='';
      prompt.querySelector('span:last-child').textContent='Listen first!';
      world.querySelectorAll('[data-lane]').forEach(button=>{
        const label=scene.index===0?letterFor(button.dataset.word):letterFor(button.dataset.word).toLowerCase();
        button.querySelector('span:last-child').textContent=label;
        button.setAttribute('aria-label','Fly to '+label);
      });
    } else if(stage==='compare') {
      world.querySelector('.td-request>span:last-child').textContent='Look at the whole word!';
    }
    world.querySelector('.td-receiver').hidden = true;
    const pilot = world.querySelector('.td-aircraft');
    pilot.setAttribute('aria-hidden','true');
    const strip = document.createElement('div');
    strip.className = 'cpk-lesson';
    strip.hidden = true;
    strip.setAttribute('aria-label','Letter, first sound and word');
    const letter = letterFor(scene.target);
    strip.innerHTML = `<span data-step="letter"><small>Letter</small><img alt="${pairFor(letter)}" src="assets/kl-letters/${pairFor(letter).toLowerCase()}-badge.png"></span><span data-step="sound"><small>Sound</small><b>/${letter.toLowerCase()}/</b></span><span data-step="word"><small>Word</small><b>${scene.target}</b></span>`;
    cargo.after(strip);
    scene.status(stage==='listen'?'Hear the sound, then find its letter.':stage==='compare'?'Both words start alike. Which one matches?':'Fly to the word that matches the picture.');
  }

  async function catchCloud(scene, cloud, turn) {
    const world = scene.$('.td-world');
    const plane = scene.$('.td-aircraft');
    scene.$('.td-pilot-controls').hidden = true;
    scene.status('Through the cloud!');
    const stage=stageFor(scene.index);
    const fx=chapters[stage].effect;
    const box=world.getBoundingClientRect();
    const target=cloud.getBoundingClientRect();
    const animated = document.createElement('img');
    animated.className='cpk-contact';
    animated.alt='';
    animated.style.left=(target.left+target.width/2-box.left)+'px';
    animated.style.top=(target.top+target.height/2-box.top)+'px';
    const blob = reduced.matches ? null : await motionAsset(fx);
    if (!scene.alive(turn)) return;
    const url = blob ? URL.createObjectURL(blob) : null;
    animated.dataset.effect=fx;
    animated.src=url||art+fx+'-end.webp';
    world.append(animated);
    cloud.style.visibility='hidden';
    const flight = reduced.matches ? 0 : Math.min(world.clientWidth*.45,410);
    const trail = scene.animate(plane,[
      {transform:'translate(0,0) rotate(0)'},
      {transform:`translate(${flight*.45}px,-32px) rotate(-12deg)`,offset:.53},
      {transform:`translate(${flight}px,-18px) rotate(0)`}
    ],790);
    scene.sound(stage);
    try { await trail; } finally {
      animated.remove();
      if (url) URL.revokeObjectURL(url);
    }
    if (!scene.alive(turn)) return;
    plane.style.transform = `translate(${flight}px,-18px)`;
    if(stage!=='listen'&&!scene.cargo.has(scene.target)){
      const cargo=scene.$('.cpk-cargo');
      const from = target;
      const berth=cargo.children[words.indexOf(scene.target)].getBoundingClientRect();
      const object=new Image();
      object.alt='';
      object.src=picture(scene.target);
      object.className='cpk-flying-cargo';
      Object.assign(object.style,{left:(from.left+from.width/2-31)+'px',top:(from.top+from.height/2-31)+'px'});
      scene.root.append(object);
      const x=berth.left+berth.width/2-from.left-from.width/2;
      const y=berth.top+berth.height/2-from.top-from.height/2;
      try {
        await scene.animate(object,[{transform:'none'},{transform:`translate(${x*.48}px,${y*.42-30}px) rotate(12deg)`,offset:.52},{transform:`translate(${x}px,${y}px) scale(.53)`}],520);
      } finally {object.remove();}
      if(!scene.alive(turn))return;
      scene.cargo.add(scene.target);
      inventory(scene,cargo);
    }
    world.querySelectorAll('[data-lane]').forEach(button=>button.hidden=true);
    scene.$('.td-delivered').hidden = false;
    scene.$('.td-delivered').dataset.open = 'true';
  }

  async function teach(scene, turn) {
    const strip = scene.$('.cpk-lesson');
    const letter = letterFor(scene.target);
    const name = window.KeyQuestClips?.clips['letter-'+letter.toLowerCase()]?.src;
    const sound = letterData[letter].soundAudio;
    const word = window.KeyQuestClips?.clips[scene.target]?.src;
    strip.hidden = false;
    try {
      for (const [step,src] of [['letter',name],['sound',sound],['word',word]]) {
        if (!scene.alive(turn)) return false;
        strip.dataset.active = step;
        if (!src || !await scene.voice(scene.target,src)) return false;
      }
      return true;
    } finally {
      delete strip.dataset.active;
    }
  }

  const config = {
    game, title:'Cloud Pilot', className:'cloud-pilot', words,
    request:'Find this word!',
    picture, buildRounds,
    audio:(word,scene)=>stageFor(scene.index)==='listen'?soundFor(word):window.KeyQuestClips.clips[word].src,
    hintLabel:scene=>stageFor(scene.index)==='listen'?'Hear the sound':'Hear the word',
    requireHint:scene=>stageFor(scene.index)==='listen',
    onHint(scene){
      if (stageFor(scene.index)==='listen' && window.LearningApp?.isMuted()) {
        scene.$('.td-request>span:last-child').textContent='/'+scene.target[0]+'/';
      }
    },
    distractor:(word,index)=>stageFor(index)==='compare'?foils[word]:(word[0]==='k'?'lion':'key'),
    flightSeconds:3.3,
    completeTitle:'Cargo ready!',
    resultCount:scene=>scene.cargo.size+' / 4 cargo items found',
    onComplete(scene){
      const cargo=document.createElement('div');
      cargo.className='cpk-cargo';
      cargo.setAttribute('aria-label','Collected cargo');
      inventory(scene,cargo);
      scene.$('.td-result h2').after(cargo);
    },
    back:'#/unit/4/lesson/5?mode=practice',
    sounds:{listen:'assets/feedback/pluck_001.wav',picture:'assets/feedback/open_001.wav',compare:'assets/feedback/confirmation_002.wav'}, onRender:render, catchAnimation:catchCloud, teach, action:async()=>{}
  };
  games[game] = {enter:()=>ToyDelivery.start(config)};
  GAME_META[game] = ['UNIT 4 · LESSON 5','Cloud Pilot','Fly, match and hear Kk and Ll'];
})();
