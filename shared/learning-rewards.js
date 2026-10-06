/* Shared rewards presentation and public completion adapter. No game-specific timers/scoring. */
(()=>{
 'use strict';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sprite=(type,extra='')=>`<span class="reward-sprite reward-${type} ${extra}" aria-hidden="true"></span>`;
 const stars=n=>`<span class="reward-star-row" aria-label="${n} of 3 stars">${[0,1,2].map(i=>sprite(i<n?'star':'silver')).join('')}</span>`;
 const activityTitle=a=>a.title||(typeof GAME_META!=='undefined'?GAME_META[a.game]?.[1]:null)||a.id;
 let book,button,toast,timer,pending,lastFocus,activeSound;
 const get=()=>window.LearningProgress;
 const inGame=()=>document.body.dataset.learningScreen==='game'||!!window.LearningApp?.context()?.activity;
 function totals(){const values=Object.values(get().all());return {stars:values.reduce((s,v)=>s+(Number.isFinite(v.stars)?v.stars:0),0),completed:values.filter(v=>v.completed).length};}
 function sound(name){
  if(window.LearningApp?.isMuted()||!document.querySelector('#soundFx')?.checked)return;
  // Avoid obscuring the lesson's voice with a reward chime.
  if([...document.querySelectorAll('audio')].some(a=>!a.paused&&!a.ended)||window.Unit3Lesson2?.current()?.buddy.audio&&!window.Unit3Lesson2.current().buddy.audio.paused)return;
  activeSound?.pause();activeSound=new Audio('assets/rewards/'+name+'.wav');activeSound.volume=.5;activeSound.play().catch(()=>{});
 }
 function gameHud(){
  const context=window.LearningApp?.context(),row=document.querySelector('#gameScreen.active .shell-game-context');
  if(!row||!context?.activity.game){if(toast)document.body.appendChild(toast);return;}
  let hud=row.querySelector('.reward-game-hud');
  if(!hud){const label=document.createElement('span');label.className='reward-game-context';label.textContent=row.textContent;row.replaceChildren(label);hud=document.createElement('div');hud.className='reward-game-hud';row.appendChild(hud);}
  const key=`${context.unit.id}/${context.lesson.id??'existing'}/${context.activity.id}`,best=get().get(key).stars||0,t=totals();
  hud.innerHTML=`<div class="reward-game-best"><span>My best</span>${stars(best)}</div><button type="button" class="reward-game-book" aria-label="Open my star book, ${t.stars} stars">${sprite('star')}<b>${t.stars}</b><span>Stars</span></button>`;
  hud.querySelector('button').onclick=show;
  if(toast)document.querySelector('#gameScreen').appendChild(toast);
 }
 function update(){const t=totals();button.querySelector('b').textContent=t.stars+' Stars';button.setAttribute('aria-label',`My Stars, ${t.stars} stars, ${t.stars*100} reward points`);gameHud();if(book.open)render();}
 function render(){
  const p=get(),t=totals(),inGame=window.LearningApp?.context()?.activity||document.body.dataset.learningScreen==='game';
  book.innerHTML=`<div class="reward-book-head"><div>${sprite('medal')}<h2>My Star Book</h2></div><button type="button" data-reward-close aria-label="Close star book">×</button></div><div class="reward-student"><label>Star book for <select id="rewardStudent" ${inGame?'disabled':''}>${p.students().map(s=>`<option value="${s.id}" ${s.id===p.student().id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>${inGame?'<span>Go Home to change learner.</span>':'<form id="rewardNewStudent"><input name="name" aria-label="New learner nickname" maxlength="24" placeholder="Learner nickname" required><button type="submit">Add learner</button></form>'}</div><div class="reward-totals"><div>${sprite('star')}<b>${t.stars}</b><span>Stars collected</span></div><div>${sprite('chest')}<b>${t.stars*100}</b><span>Reward points</span></div><div>${sprite('trophy')}<b>${t.completed}</b><span>Games completed</span></div></div><p class="reward-guidance">Every star shows your practice. Play again to improve your best result!</p><div class="reward-badges">${[1,5,15,30,60].map((goal,i)=>`<div class="${t.stars>=goal?"earned":"waiting"}">${sprite(i<2?"medal":i<4?"chest":"trophy")}<b>${goal} star${goal===1?"":"s"}</b><span>${t.stars>=goal?"Unlocked!":"Keep practising"}</span></div>`).join("")}</div><div class="reward-unit-tabs">${window.LearningConfig.units.map(u=>`<a href="#reward-unit-${u.id}">Unit ${u.id}</a>`).join('')}</div>${window.LearningConfig.units.map(u=>`<section class="reward-unit" id="reward-unit-${u.id}"><h3>Unit ${u.id} · ${esc(u.title)}</h3><div class="reward-lessons">${u.lessons.map(l=>{
   const activities=l.activities.filter(a=>a.game),values=activities.map(a=>p.get(`${u.id}/${l.id}/${a.id}`)),earned=values.reduce((s,v)=>s+(v.stars||0),0),done=values.filter(v=>v.completed).length;
   return `<details class="reward-lesson"><summary>${sprite(done&&done===activities.length?'medal':'star')}<div><b>Lesson ${l.id}</b><span>${esc(l.selectorLabel||l.title||'Coming soon')}</span></div><strong>${activities.length?earned+' ★':'Soon'}</strong></summary>${activities.length?`<div class="reward-lesson-meter"><span>${done} / ${activities.length} games completed</span><progress value="${done}" max="${activities.length}" aria-label="Lesson ${l.id} completed games"></progress></div><div class="reward-activities">${activities.map((a,i)=>{const v=values[i];return `<a href="#/unit/${u.id}/lesson/${l.id}?mode=practice&activity=${encodeURIComponent(a.id)}"><span>${esc(activityTitle(a))}</span>${stars(v.stars||0)}<small>${v.completed?'Completed':v.played?'Keep practising':'Ready to play'}</small></a>`;}).join('')}</div>`:'<p>Activities coming soon. Your stars will appear here when you play.</p>'}</details>`;
  }).join('')}</div></section>`).join('')}<p class="reward-storage-note">Saved in this browser on this device. Stars stay when you replay a game. Reward points = 100 × your best stars.</p>`;
 }
 function close(){if(book.open)book.close();lastFocus?.focus();}
 function show(){lastFocus=document.activeElement;render();book.showModal();sound('open-book');}
 function rewardKind(d){
  const total=totals().stars,goal=[1,5,15,30,60].filter(g=>total>=g&&total-d.delta<g).pop();
  if(goal)return {asset:'medal',title:`${goal}-star badge unlocked!`,sound:'badge-unlocked'};
  const [u,l]=d.key.split('/'),unit=window.LearningConfig.units.find(x=>String(x.id)===u),lesson=unit?.lessons.find(x=>String(x.id)===l),activities=lesson?.activities.filter(a=>a.game)||[];
  if(!d.previous.completed&&activities.length&&activities.every(a=>get().get(`${u}/${l}/${a.id}`).completed))return {asset:'trophy',title:`Lesson ${l} complete!`,sound:'lesson-complete'};
  return {asset:'star',title:`+${d.delta} star${d.delta===1?'':'s'}! Great job!`,sound:'star-earned'};
 }
 function celebrate(detail){
  if(detail.delta<=0)return;pending=detail;clearTimeout(timer);
  const deliver=()=>{
   if(!pending)return;
   // Wait until the current spoken confirmation has finished. Never interrupt speech.
   const actor=window.Unit3Lesson2?.current();if(actor&&(['asking','checking'].includes(actor.phase)||(actor.buddy.audio&&!actor.buddy.audio.paused&&!actor.buddy.audio.ended))){timer=setTimeout(deliver,180);return;}
   const d=pending;pending=null;const kind=rewardKind(d);const actions=window.LearningApp?.context()?.activity?'<div class="app-reward-actions"><button type="button" data-reward-action="replay">Play again</button><button type="button" data-reward-action="next">Next game</button></div>':'';toast.innerHTML=`${sprite(kind.asset)}<div><b>${kind.title}</b><span>+${d.points} reward points · ${totals().stars} stars collected</span>${actions}</div><button type="button" data-toast-close aria-label="Dismiss reward">×</button><span class="reward-sparkles" aria-hidden="true">${Array.from({length:9},(_,i)=>sprite('sparkle',`reward-particle particle-${i}`)).join('')}</span>`;toast.hidden=false;toast.classList.remove('reward-pop');void toast.offsetWidth;toast.classList.add('reward-pop');sound(kind.sound);timer=setTimeout(()=>{toast.hidden=true;toast.innerHTML='';},6000);
  };requestAnimationFrame(()=>requestAnimationFrame(deliver));
 }
 document.addEventListener('DOMContentLoaded',()=>{
  button=document.createElement('button');button.type='button';button.className='reward-header-button';button.id='rewardOpen';button.innerHTML=sprite('star')+'<b>0 Stars</b>';document.querySelector('.header-actions').prepend(button);button.onclick=show;
  book=document.createElement('dialog');book.className='reward-book';book.setAttribute('aria-label','My Star Book');document.body.appendChild(book);
  toast=document.createElement('aside');toast.className='reward-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.hidden=true;document.body.appendChild(toast);
  book.addEventListener('click',e=>{if(e.target.closest('[data-reward-close]'))close();if(e.target.closest('.reward-activities a'))close();});book.addEventListener('cancel',()=>lastFocus?.focus());
  book.addEventListener('change',e=>{if(e.target.id==='rewardStudent'&&!inGame()){get().selectStudent(e.target.value);window.LearningApp.go(location.hash);}});
  book.addEventListener('submit',e=>{if(e.target.id!=='rewardNewStudent')return;e.preventDefault();if(inGame())return;const s=get().addStudent(new FormData(e.target).get('name'));if(s){get().selectStudent(s.id);window.LearningApp.go(location.hash);}});
  toast.addEventListener('click',e=>{const action=e.target.closest('[data-reward-action]')?.dataset.rewardAction;if(action){document.querySelector(`[data-shell-action="${action}"]`)?.click();toast.hidden=true;clearTimeout(timer);}if(e.target.closest('[data-toast-close]')){toast.hidden=true;clearTimeout(timer);}});
  document.addEventListener('learning:progress-updated',e=>{update();celebrate(e.detail);});document.addEventListener('learning:student-changed',update);
  document.addEventListener('learning:game-nav-rendered',gameHud);
  addEventListener('hashchange',()=>{pending=null;clearTimeout(timer);toast.hidden=true;gameHud();});update();
 });
 window.LearningRewards=Object.freeze({
  record({unit,lesson,activity,stars:earned}){if(!Number.isInteger(unit)||unit<1||!([1,2,3,4,5,6,'existing'].includes(lesson))||typeof activity!=='string'||!activity||activity.includes('/')||!Number.isFinite(earned)||![1,2,3].includes(earned))return false;get().completed(`${unit}/${lesson}/${activity}`,earned);return true;},
  open:()=>show(),totals
 });
})();
