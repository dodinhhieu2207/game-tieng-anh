/* Unit 2 colour route uses the existing pilot engine and shared progress. */
(()=>{
 'use strict';
 const colors=['red','green','blue','black','white'],hex={red:'#ef3434',green:'#21bb46',blue:'#1989ed',black:'#171c25',white:'#ffffff'};
 const image=w=>'assets/color-pilot/colors/'+w+'.webp';
 async function celebrate(scene,target){const t=scene.turn,world=scene.$('.td-world'),layer=scene.$('.td-fx'),area=world.getBoundingClientRect(),r=target.getBoundingClientRect(),x=r.left+r.width/2-area.left,y=r.top+r.height/2-area.top;
  scene.root.dataset.paint='revealing';scene.status('Lovely color!');await scene.animate(target,[{transform:'scale(1)'},{transform:'translateY(-25px) scale(1.3)',offset:.6},{transform:'translateY(-8px) scale(1.15)'}],350);if(!scene.alive(t))return;
  const splash=document.createElement('img');splash.className='cp-splash';splash.src='assets/color-pilot/vfx/'+scene.target+'.webp';splash.alt='';splash.setAttribute('aria-hidden','true');splash.style.cssText=`left:${x-85}px;top:${y-15}px`;layer.appendChild(splash);scene.sound('paint-pop');
  const specks=[];for(let i=0;i<8;i++){const dot=document.createElement('img');dot.src=image(scene.target);dot.alt='';dot.className='cp-paint-speck';dot.style.cssText=`left:${x-14}px;top:${y-14}px`;layer.appendChild(dot);specks.push(dot);}
  const bursts=specks.map((dot,i)=>{const a=(i/8)*Math.PI*2,dx=Math.cos(a)*65,dy=Math.sin(a)*40;return scene.animate(dot,[{transform:'scale(.2)',opacity:0},{transform:`translate(${dx*.6}px,${dy-40}px) scale(.85)`,opacity:.85,offset:.55},{transform:`translate(${dx}px,${dy+25}px) scale(.45)`,opacity:0}],650).finally(()=>dot.remove());});
  const elephant=scene.$('.td-receiver>img');elephant.src='assets/unit2-ee/characters/elephant-celebrate-four-limbs.png';scene.$('.td-speech').textContent='Hooray!';
  await Promise.all([scene.animate(splash,[{transform:'scale(.1)',opacity:0},{transform:'scale(1.1)',opacity:1,offset:.5},{transform:'scale(1)',opacity:.9}],650),scene.animate(elephant,[{transform:'translateY(0)'},{transform:'translateY(-10px) scale(1.05)',offset:.5},{transform:'translateY(0)'}],650),...bursts]);if(!scene.alive(t)){splash.remove();return;}
  scene.root.dataset.paint='collected';const slot=scene.$(`[data-collected-color="${scene.target}"]`),to=slot.getBoundingClientRect();const fly=document.createElement('img');fly.src=image(scene.target);fly.className='cp-collect-flight';fly.alt='';fly.style.cssText=`left:${x-25}px;top:${y-25}px`;layer.appendChild(fly);
  try{await scene.animate(fly,[{transform:'scale(.5)',opacity:0},{transform:'translateY(-40px) scale(1.1)',opacity:1,offset:.35},{transform:`translate(${to.left+to.width/2-area.left-x}px,${to.top+to.height/2-area.top-y}px) scale(.55)`,opacity:1}],850);}finally{fly.remove();}
  if(!scene.alive(t)){splash.remove();return;}scene.colorCollection.add(scene.target);slot.classList.add('collected');slot.querySelector('img').alt=scene.target+' collected';await scene.animate(slot,[{transform:'scale(1)'},{transform:'scale(1.18)',offset:.45},{transform:'scale(1)'}],280);splash.classList.add('cp-settled');scene.status('Color collected!');
 }
 const config={game:'colour',words:colors,title:'Color Pilot',className:'color-pilot',firstOther:'blue',request:'Find my color!',receiver:'assets/unit2-ee/characters/elephant-neutral.png',completeTitle:'Lovely colors!',back:'#/unit/2/lesson/1?mode=practice',picture:w=>'assets/color-pilot/colors/'+w+'.webp',audio:w=>'assets/color-pilot/audio/'+w+'.mp3',
  sounds:{'paint-pop':'assets/color-pilot/vfx/paint-pop.wav'},
  onRender(scene){scene.root.style.setProperty('--pilot-color',hex[scene.target]);scene.root.dataset.color=scene.target;scene.colorCollection??=new Set();const collection=document.createElement('div');collection.className='cp-collection';collection.setAttribute('aria-label','Colors collected this flight');collection.innerHTML='<span>My colors</span>'+colors.map((w,i)=>`<span class="cp-color-slot ${scene.colorCollection.has(w)?'collected':''}" data-collected-color="${w}"><img src="${image(w)}" alt="${scene.colorCollection.has(w)?w+' collected':'Color '+(i+1)+' waiting'}"></span>`).join('');scene.$('.td-header').after(collection);},
  action:celebrate,
  onComplete(scene){const result=document.createElement('div');result.className='cp-result-colors';result.setAttribute('aria-label','All five colors collected');result.innerHTML=colors.map(w=>`<img src="${image(w)}" alt="${w}">`).join('');scene.$('.td-result h2').after(result);}
 };
 games.colour={enter:()=>ToyDelivery.start(config)};GAME_META.colour=['UNIT 2 · LESSON 1','Color Pilot','Look · fly · match the color'];
 window.ColorPilot={current:()=>ToyDelivery.current()?.game==='colour'?ToyDelivery.current():null};
})();
