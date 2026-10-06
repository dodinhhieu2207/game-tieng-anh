/* App navigation and focused stage controls; game engines retain ownership of their rounds. */
(()=>{
 'use strict';
 addEventListener('DOMContentLoaded',()=>{
  const dock=document.createElement('nav');dock.className='app-bottom-nav';dock.setAttribute('aria-label','Learning app navigation');
  dock.innerHTML='<button type="button" data-app-tab="home"><img src="assets/shared-ui/pack-home.png" alt=""><span>Home</span></button><button type="button" data-app-tab="lessons"><img src="assets/shared-ui/book.png" alt=""><span>Lessons</span></button><button type="button" data-app-tab="stars"><img src="assets/shared-ui/star.png" alt=""><span>My Stars</span></button>';
  document.body.appendChild(dock);
  function update(){const r=LearningRouter.parse(location.hash);dock.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.appTab===(r.screen==='home'?'home':'lessons')?'page':'false'));}
  dock.onclick=e=>{const b=e.target.closest('[data-app-tab]');if(!b)return;const tab=b.dataset.appTab;if(tab==='stars')return LearningRewards.open();if(tab==='home')return LearningApp.go('#/');const r=LearningRouter.parse(location.hash),last=LearningRouter.parse(LearningProgress.last()||'#/');LearningApp.go('#/unit/'+(r.unit||last.unit||LearningConfig.units[0].id));};
  document.addEventListener('click',e=>{const menu=document.querySelector('.app-game-more[open]');if(menu&&!menu.contains(e.target))menu.removeAttribute('open');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=document.querySelector('.app-game-more[open]');if(menu){menu.removeAttribute('open');menu.querySelector('summary').focus();}}});
  addEventListener('hashchange',update);update();
 });
})();
