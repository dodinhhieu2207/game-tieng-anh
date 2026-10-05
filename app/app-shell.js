/* Wrap the existing engine. The original game objects, DOM targets and assets stay in place. */
(()=>{
 'use strict';
 addEventListener('DOMContentLoaded',()=>{
  const config=window.LearningConfig,router=window.LearningRouter,progress=window.LearningProgress;
  const original={openGame:window.openGame,showHome:window.showHome,setSpace:window.setSpace,speakText:window.speakText,autoSpeak:window.autoSpeak};
  const unitById=id=>config.units.find(unit=>unit.id===id),lessonById=(u,id)=>u.lessons.find(l=>l.id===id);
  const esc=window.escapeHTML;
  const asset=name=>'assets/shared-ui/'+name+'.png';
  const icon=(name)=>['home','back','next','full-screen','sound-on','sound-off','replay'].includes(name)?`<img src="${asset('pack-'+name)}" alt="" aria-hidden="true">`:`<img src="${asset(name)}" alt="" aria-hidden="true">`;
  const originals=new Map(),heroes=new Map();
  document.querySelectorAll('#homeScreen [data-game]').forEach(card=>{if(!originals.has(card.dataset.game))originals.set(card.dataset.game,card.cloneNode(true));});
  config.units.forEach(unit=>{const h=document.querySelector('#spaceUnit'+unit.id+' .hero');if(h)heroes.set(unit.id,h.cloneNode(true));});
  config.units.forEach(unit=>{if(document.querySelector(`.side-item[data-space="${unit.space}"]`))return;const b=document.createElement('button');b.type='button';b.className='side-item';b.dataset.space=unit.space;b.innerHTML=`<span class="side-icon side-unit">U${unit.id}</span><span class="side-copy"><b>Unit ${unit.id}</b><em>${esc(unit.title)}</em></span>`;const sidebar=document.querySelector('.side-nav');sidebar.insertBefore(b,sidebar.querySelector('.side-soon'));});
  const pane=document.createElement('div');pane.id='lessonApp';pane.className='space';document.querySelector('.space-wrap').appendChild(pane);
  const nav=document.createElement('div');nav.className='shell-game-nav';nav.hidden=true;els.gameScreen.prepend(nav);
  const drawer=document.createElement('dialog');drawer.className='shell-drawer';drawer.setAttribute('aria-label','Choose an activity');document.body.appendChild(drawer);
  let route={screen:'home'},context=null,mounted='',muted=false,lastFocus=null;
  // Existing games keep their Audio API; this shared owner stops detached clips and applies mute.
  const NativeAudio=window.Audio,media=new Set();
  window.Audio=function(src){const audio=new NativeAudio(src);audio.muted=muted;media.add(audio);audio.addEventListener('ended',()=>media.delete(audio));audio.addEventListener('error',()=>media.delete(audio));return audio;};
  window.Audio.prototype=NativeAudio.prototype;Object.setPrototypeOf(window.Audio,NativeAudio);
  window.speakText=function(){return muted?Promise.resolve():original.speakText.apply(this,arguments);};
  window.autoSpeak=function(fn,delay){const owner=currentGame;return original.autoSpeak(()=>{if(currentGame===owner)fn();},delay);};
  const key=(u,l,a)=>`${u}/${l}/${a.id}`;
  const lessonKeys=(u,l)=>l.activities.filter(a=>a.game).map(a=>key(u.id,l.id,a));
  const lessonHref=(u,l,mode='practice',activity)=>`#/unit/${u}/lesson/${l}?mode=${mode}${activity?'&activity='+encodeURIComponent(activity):''}`;
  function closeDrawer(){if(drawer.open)drawer.close();lastFocus?.focus();}
  function stop(){
   document.dispatchEvent(new Event('learning:leave-activity'));
   media.forEach(audio=>audio.pause());media.clear();
   if(currentGame==='listen')games.listen.clearTimer(false);
   if(currentGame==='missing')games.missing.stopTimer();
   if(typeof letterAudio!=='undefined')letterAudio.stop();
   document.dispatchEvent(new Event('toybuddy:enter'));
   original.showHome();nav.hidden=true;els.gameScreen.classList.remove('app-managed');mounted='';
   // The actor's existing observer handles Home cleanup before a later mount.
  }
  function hideLibraries(){document.querySelectorAll('.space-wrap>.space').forEach(space=>space.hidden=space!==pane);}
  function activeSidebar(space){document.querySelectorAll('.side-item').forEach(b=>b.classList.toggle('active',b.dataset.space===space));}
  function main(html,unit=null){
   if(mounted||currentGame)stop();hideLibraries();pane.hidden=false;pane.classList.toggle('unit3-toytown',unit?.id===3);pane.innerHTML=html;
   pane.classList.toggle('shell-art-selector',html.includes('shell-lesson-grid'));pane.classList.toggle('shell-art-home',!unit&&html.includes('shell-unit-grid'));pane.style.backgroundImage=unit?.selectorScene&&html.includes('shell-lesson-grid')?`url("${unit.selectorScene}")`:'';
   activeSidebar(unit?.space||null);currentSpace=unit?.space||'home';window.scrollTo({top:0,behavior:'instant'});
  }
  function bread(unit,lesson){return `<div class="shell-breadcrumb"><a href="#/">Home</a>${unit?`<span>›</span><a href="#/unit/${unit.id}">Unit ${unit.id}</a>`:''}${lesson?`<span>›</span><span>Lesson ${lesson.id}</span>`:''}</div>`;}
  function hero(unit,lesson=null,selector=false){
   if(selector&&unit.selectorBanner){const heading=heroes.get(unit.id)?.querySelector('h1')?.textContent||unit.title;return `<header class="shell-image-banner"><h1 class="shell-sr-only">${esc(heading)}</h1><img src="${unit.selectorBanner}" alt="${esc(heroes.get(unit.id)?.querySelector('.hero-copy')?.textContent.trim()||unit.title)}"></header>`;}
   const own=heroes.get(unit.id),h=(own||heroes.get(3)).cloneNode(true);
   if(!own){h.querySelector('.eyebrow').textContent='Family and Friends Starter · Unit '+unit.id;h.querySelector('h1').textContent=unit.title;h.querySelector('.hero-copy>p').textContent='Choose a lesson.';h.querySelector('.hero-scene').innerHTML=`<img src="${unit.thumbnail}" alt="">`;h.querySelector('.hero-badges')?.remove();}
   if(lesson){h.querySelector('.eyebrow').textContent=`Family and Friends Starter · Unit ${unit.id} · Lesson ${lesson.id}`;
    if(!(unit.id===3&&lesson.id===1)){h.querySelector('h1').textContent=lesson.title||'Lesson '+lesson.id;h.querySelector('.hero-copy>p').textContent=lesson.description||lesson.targetLanguage.join(' ')||'Choose an activity below.';}
   }
   if(selector&&unit.selectorBackground){h.classList.add('shell-unit-art-hero');h.style.backgroundImage=`url("${unit.selectorBackground}")`;}
   return h.outerHTML;
  }
  function statusHTML(value){return value.stars?`${'★'.repeat(value.stars)}`:value.completed?'COMPLETED':value.played?'PLAYED':'NEW';}
  function activityCard(activity,index,unit,lesson){
   const value=progress.get(key(unit.id,lesson.id,activity));const legacy=originals.get(activity.game);let card;
   if(legacy?.classList.contains('activity-card'))card=legacy.cloneNode(true);
   else {card=document.createElement('button');card.className='activity-card'+(unit.id===3?' u3':'');
    const image=legacy?.querySelector('img');card.innerHTML=`<span class="activity-card-copy"><small>${activity.final?'Final Mission':'Activity '+(index+1)}</small><b>${esc(activity.title||GAME_META[activity.game]?.[1]||'Activity')}</b><em>${esc(GAME_META[activity.game]?.[2]||'')}</em><span class="play-pill">PLAY</span></span>${image?image.outerHTML:icon(activity.icon||'flashcards')}`;
   }
   card.type='button';card.removeAttribute('id');card.removeAttribute('data-game');card.dataset.activity=activity.id;card.classList.add('shell-activity');card.dataset.status=value.completed?'completed':value.played?'played':'normal';
   if(activity.title){const title=card.querySelector('b');if(title)title.textContent=activity.title;}
   if(!activity.game){card.classList.add('shell-planned');const pill=card.querySelector('.play-pill');if(pill)pill.textContent='COMING SOON';}
   if(activity.final)card.classList.add('shell-final');
   card.insertAdjacentHTML('beforeend',`<span class="shell-progress-badge">${activity.game?statusHTML(value):'COMING SOON'}</span>`);
   return card.outerHTML;
  }
  function home(){
   const cards=config.units.map(unit=>{const s=progress.summary(unit.lessons.flatMap(l=>lessonKeys(unit,l)));
    if(unit.navigationCard)return `<a class="shell-unit-art-card" href="#/unit/${unit.id}" aria-label="Unit ${unit.id}: ${esc(unit.title)}, 6 lessons"><img src="${unit.navigationCard}" alt=""><span class="shell-art-progress">${s.completed} / ${s.total} activities completed<progress max="${s.total||1}" value="${s.completed}" aria-label="Unit ${unit.id} completed activities"></progress></span></a>`;
    return `<a class="activity-card shell-unit-card" href="#/unit/${unit.id}"><span class="activity-card-copy"><small>Unit ${unit.id}</small><b>${esc(unit.title)}</b><em>6 lessons</em><progress max="${s.total||1}" value="${s.completed}" aria-label="Unit ${unit.id} completed activities"></progress><span class="play-pill">CHOOSE</span></span><img src="${unit.thumbnail}" alt=""></a>`;}).join('');
   main(`<div class="hero"><div class="hero-copy"><div class="eyebrow">Family and Friends Starter</div><h1>Choose a unit</h1><p>Pick your unit, then choose a lesson.</p></div></div><div class="activity-grid shell-unit-grid">${cards}</div><a class="btn secondary shell-letter-link" href="#/letters">Letter Land · Letters A–F</a>`);
  }
  function selectUnit(unit){
   const cards=unit.lessons.map(lesson=>{const s=progress.summary(lessonKeys(unit,lesson));const state=lesson.locked?'locked':s.total&&s.total===lesson.activities.length&&s.completed===s.total?'completed':s.played?'played':'normal';
    if(lesson.cardImage)return `<a class="shell-lesson-card shell-illustrated-lesson ${state}" data-lesson="${lesson.id}" data-status="${state}" aria-label="Unit ${unit.id}, Lesson ${lesson.id}: ${esc(lesson.selectorLabel||lesson.title||'Choose a lesson')}" ${lesson.locked?'aria-disabled="true" tabindex="-1"':`href="${lessonHref(unit.id,lesson.id)}"`}><img class="shell-lesson-art" style="aspect-ratio:${lesson.cardAspect||'1 / 1.1'}" src="${lesson.cardImage}" alt="" aria-hidden="true"><span class="shell-art-progress"><span>${state==='completed'?'Completed':state==='played'?'Played':lesson.activities.length?'Choose lesson':'Coming soon'}</span><progress max="${s.total||1}" value="${s.completed}" aria-label="Lesson ${lesson.id} completed activities"></progress></span></a>`;
    return `<a class="activity-card shell-lesson-card ${state}" data-lesson="${lesson.id}" data-status="${state}" ${lesson.locked?'aria-disabled="true" tabindex="-1"':`href="${lessonHref(unit.id,lesson.id)}"`}><img class="shell-card-frame" src="${asset('lesson-frame-'+((lesson.id-1)%5+1))}" alt=""><span class="shell-lesson-copy"><small>Unit ${unit.id}</small><b>Lesson ${lesson.id}</b>${lesson.title?`<em>${esc(lesson.title)}</em>`:''}<span>${state==='completed'?'Completed':state==='played'?'Played':lesson.activities.length?'Choose':'Coming soon'}</span><progress max="${s.total||1}" value="${s.completed}" aria-label="Lesson ${lesson.id} completed activities"></progress></span></a>`;
   }).join('');
   const unmapped=config.migration.filter(m=>m.unit===unit.id&&m.lesson===null);
   const groups=[...new Set(unmapped.map(m=>m.group))];
   main(`${bread(unit)}${hero(unit,null,true)}<section class="learning-zone"><div class="library-heading"><div><h2>Choose a lesson</h2><p>Choose Lesson 1–6.</p></div><span class="library-count">6 lessons</span></div><div class="activity-grid shell-lesson-grid">${cards}</div></section>${unmapped.length?`<section class="learning-zone"><div class="library-heading"><div><h2>More activities</h2><p>Enjoy these extra activities.</p></div></div><div class="shell-group-links">${groups.map(group=>`<a class="btn secondary" href="#/unit/${unit.id}/existing?group=${encodeURIComponent(group)}">${esc(group)}</a>`).join('')}</div></section>`:''}`,unit);
  }
  function lessonPage(unit,lesson){
   const activityCards=lesson.activities.map((a,i)=>activityCard(a,i,unit,lesson)).join('');
   main(`${bread(unit,lesson)}${hero(unit,lesson)}<section class="learning-zone"><div class="library-heading"><div class="zone-title-row"><span class="zone-bubble">L${lesson.id}</span><div><h2>Lesson ${lesson.id}${lesson.title?' · '+esc(lesson.title):''}</h2><p>${lesson.targetLanguage.length?esc(lesson.targetLanguage.join(' ')):'Choose Class Mode or Practice Mode.'}</p></div></div><span class="library-count">${lesson.activities.length} activities</span></div><div class="shell-mode-row"><button type="button" class="btn primary" data-start-class>${icon('teacher')}Class Mode</button><a class="btn secondary" href="${lessonHref(unit.id,lesson.id,'practice')}" ${route.mode==='practice'?'aria-current="page"':''}>${icon('student')}Practice Mode</a></div><p class="shell-mode-hint">Class Mode: follow the activities together. Practice Mode: choose any activity.</p><div class="activity-grid">${activityCards}</div>${!lesson.activities.length?`<div class="shell-empty"><h3>Activities coming soon</h3><p>${unit.id===2&&lesson.id===6?'Story activities will be added here.':'This lesson is ready for future activities.'}</p>${unit.id===2?'<a class="btn secondary" href="#/unit/2/existing">Open existing activities</a>':''}</div>`:''}</section>`,unit);
  }
  function existing(unit){
   const entries=config.migration.filter(m=>m.unit===unit.id&&m.lesson===null&&(!route.group||m.group===route.group));
   if(route.game){const entry=entries.find(m=>m.game===route.game);if(!entry)return invalid();
    return mount(unit,{id:null,activities:entries.map(m=>({id:m.game,game:m.game}))}, {id:entry.game,game:entry.game},'practice');}
   const virtual={id:'existing'};
   main(`${bread(unit)}${hero(unit)}<section class="learning-zone"><div class="library-heading"><div><h2>${esc(route.group||'Existing activities')}</h2><p>Enjoy these extra activities.</p></div></div><div class="activity-grid">${entries.map((entry,i)=>activityCard({id:entry.game,game:entry.game},i,unit,virtual)).join('')}</div></section>`,unit);
  }
  function invalid(){main(`${bread()}<div class="shell-empty"><h2>Page not found</h2><a href="#/" class="btn primary">Home</a></div>`);}
  function navigateActivity(activity){
   if(route.screen==='existing'){router.go(`#/unit/${route.unit}/existing?group=${encodeURIComponent(route.group||'')}&game=${encodeURIComponent(activity)}`);return;}
   router.go(lessonHref(route.unit,route.lesson,route.mode,activity));
  }
  function mount(unit,lesson,activity,mode){
   const token=`${unit.id}/${lesson.id}/${activity.id}/${mode}`;
   context={unit,lesson,activity,mode};
   if(mounted===token)return;
   if(mounted||currentGame)stop();hideLibraries();pane.hidden=true;activeSidebar(unit.space);currentSpace=unit.space;
   mounted=token;context={unit,lesson,activity,mode};
   if(activity.game){original.openGame(activity.game);progress.played(key(unit.id,lesson.id??'existing',activity));}
   else {els.homeScreen.classList.remove('active');els.gameScreen.classList.add('active');currentGame=null;els.gameNumber.textContent='UNIT '+unit.id+' · LESSON '+lesson.id;els.gameTitle.textContent=activity.title;els.gameSubtitle.textContent='Coming soon';setStage(`<div class="game-layout shell-placeholder"><img src="${asset(activity.icon||'flashcards')}" alt=""><h2>${esc(activity.title)}</h2><p>This activity will be added later.</p><p>Use Activities to choose an existing game, or Next to preview the next activity.</p></div>`);}
   nav.hidden=false;els.gameScreen.classList.add('app-managed');renderGameNav();
  }
  function renderGameNav(){
   const {unit,lesson,activity}=context,index=lesson.activities.findIndex(a=>a.id===activity.id);
   nav.innerHTML=`<div class="shell-game-context">Unit ${unit.id}${lesson.id?' · Lesson '+lesson.id:' · Existing activities'} · ${activity.final?'Final Mission':'Activity '+(index+1)} / ${lesson.activities.length}</div><div class="shell-game-controls">${[['home','home','Home'],['back','back','Back'],['drawer','menu','Activities'],['replay','replay','Replay'],['sound',muted?'sound-off':'sound-on',muted?'Sound off':'Sound on'],['fullscreen','full-screen','Full Screen'],['next','next',index===lesson.activities.length-1?'Finish':'Next']].map(([act,img,label])=>`<button type="button" class="btn secondary" data-shell-action="${act}" ${act==='replay'&&!activity.game?'disabled':''}>${icon(img)}<span class="${['replay','sound'].includes(act)?'shell-sr-only':''}">${label}</span></button>`).join('')}</div>`;
  }
  function openDrawer(){
   lastFocus=document.activeElement;const {unit,lesson,activity}=context;
   drawer.innerHTML=`<header><h2>Choose an activity</h2><button class="btn secondary" type="button" data-close-drawer>Close</button></header><div class="shell-drawer-list">${lesson.activities.map((a,i)=>`<button type="button" class="btn secondary" data-jump="${esc(a.id)}" ${a.id===activity.id?'aria-current="true"':''}>${a.final?'Final Mission':i+1+'.'} ${esc(a.title||GAME_META[a.game]?.[1]||'Activity')}${!a.game?' · Coming soon':''}</button>`).join('')}</div>`;
   drawer.showModal();
  }
  function parentRoute(){if(route.screen==='letter-game')return '#/letters';if(route.screen==='existing')return `#/unit/${route.unit}/existing${route.group?'?group='+encodeURIComponent(route.group):''}`;return route.lesson?lessonHref(route.unit,route.lesson,route.mode):'#/';}
  function chooseGame(game){
   if(config.independentGames.includes(game)){router.go('#/letters/game/'+game);return;}
   const preferred=context?.lesson.activities.find(a=>a.game===game);
   if(preferred&&route.screen==='lesson'){navigateActivity(preferred.id);return;}
   for(const unit of config.units)for(const lesson of unit.lessons){const a=lesson.activities.find(a=>a.game===game);if(a){router.go(lessonHref(unit.id,lesson.id,'practice',a.id));return;}}
   const entry=config.migration.find(m=>m.game===game);if(entry)router.go(`#/unit/${entry.unit}/existing?group=${encodeURIComponent(entry.group)}&game=${encodeURIComponent(game)}`);
   else if(games[game])original.openGame(game);
  }
  window.openGame=chooseGame;
  window.showHome=()=>router.go(parentRoute());
  window.setSpace=(space)=>router.go(space==='letters'?'#/letters':config.units.some(u=>u.space===space)?'#/unit/'+config.units.find(u=>u.space===space).id:'#/');
  // Capture only existing sidebar/header navigation; leave game controls and Letter Land intact.
  document.addEventListener('click',event=>{
   const side=event.target.closest('.side-item');
   if(side){event.preventDefault();event.stopImmediatePropagation();window.setSpace(side.dataset.space);return;}
   if(event.target.closest('#brandHome')){event.preventDefault();event.stopImmediatePropagation();router.go('#/');return;}
  },true);
  pane.addEventListener('click',event=>{
   const a=event.target.closest('[data-activity]');if(a){event.preventDefault();navigateActivity(a.dataset.activity);}
   if(event.target.closest('[data-start-class]')){const lesson=lessonById(unitById(route.unit),route.lesson);if(lesson.activities.length)router.go(lessonHref(route.unit,route.lesson,'class',lesson.activities[0].id));}
  });
  nav.addEventListener('click',event=>{
   const b=event.target.closest('[data-shell-action]');if(!b)return;
   const act=b.dataset.shellAction;
   if(act==='home')router.go('#/');if(act==='back')router.go(parentRoute());if(act==='drawer')openDrawer();if(act==='replay')replayCurrent();if(act==='fullscreen')toggleFullscreen();
   if(act==='next'){const list=context.lesson.activities,i=list.findIndex(a=>a.id===context.activity.id);if(i+1<list.length)navigateActivity(list[i+1].id);else router.go(parentRoute());}
   if(act==='sound'){
    muted=!muted;els.soundFx.checked=!muted;els.autoVoice.checked=!muted;
    document.querySelectorAll('audio,video').forEach(media=>media.muted=muted);
    media.forEach(audio=>{audio.muted=muted;if(muted&&!window.Unit3Lesson2?.current())audio.pause();});
    document.dispatchEvent(new Event('toybuddy:enter'));if(muted){cancelVoice();letterAudio.stop();}
    const unit3Mute=document.getElementById('u3Mute');if(unit3Mute){if((unit3Mute.getAttribute('aria-pressed')==='true')!==muted)unit3Mute.click();}
    renderGameNav();
   }
  });
  drawer.addEventListener('click',event=>{if(event.target.closest('[data-close-drawer]'))closeDrawer();const jump=event.target.closest('[data-jump]');if(jump){const id=jump.dataset.jump;closeDrawer();navigateActivity(id);}});
  drawer.addEventListener('cancel',()=>lastFocus?.focus());
  document.addEventListener('learning:activity-completed',event=>{const {game,stars}=event.detail||{};if(context&&mounted&&context.activity.game===game)progress.completed(key(context.unit.id,context.lesson.id??'existing',context.activity),Math.max(1,Math.min(3,stars)));});
  new MutationObserver(()=>{
   if(!context||!mounted)return;
   const victory=els.gameStage.querySelector('.u3-victory'),complete=els.gameStage.querySelector('.ff-complete,.tb-scene[data-state="SUCCESS"]');
   if(victory||complete){const stars=victory?Math.min(3,victory.querySelectorAll('.u3-stars .u3-star:not(.off)').length)||null:null;progress.completed(key(context.unit.id,context.lesson.id??'existing',context.activity),stars);}
  }).observe(els.gameStage,{childList:true,subtree:true,attributes:true,attributeFilter:['data-state']});
  function render(next){
   closeDrawer();route=next;context=null;
   if(next.screen==='home')return home();
   if(next.screen==='letters'){if(mounted||currentGame)stop();pane.hidden=true;original.setSpace('letters',{scroll:false});activeSidebar('letters');return;}
   if(next.screen==='letter-game'){if(!config.independentGames.includes(next.game))return invalid();if(mounted||currentGame)stop();pane.hidden=true;original.setSpace('letters',{scroll:false});original.openGame(next.game);mounted='letter/'+next.game;return;}
   const unit=unitById(next.unit);if(!unit)return invalid();
   if(next.screen==='unit')return selectUnit(unit);
   if(next.screen==='existing')return existing(unit);
   if(next.screen==='lesson'){const lesson=lessonById(unit,next.lesson);if(!lesson)return invalid();if(next.activity){const a=lesson.activities.find(a=>a.id===next.activity);if(!a)return invalid();return mount(unit,lesson,a,next.mode);}return lessonPage(unit,lesson);}
   invalid();
  }
  // Prevent detached Unit 3 backgrounds leaking into the home shell.
  window.LearningApp={config,go:router.go,context:()=>context,isMuted:()=>muted,original};
  router.start(render);
 });
})();
