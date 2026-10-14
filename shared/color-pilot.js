/* Unit 2 colour route uses the existing pilot engine and shared progress. */
(()=>{
 'use strict';
 const colors=['red','green','blue','black','white'],hex={red:'#ef3434',green:'#21bb46',blue:'#1989ed',black:'#171c25',white:'#ffffff'};
 const config={game:'colour',words:colors,title:'Color Pilot',className:'color-pilot',firstOther:'blue',request:'Find my color!',receiver:'assets/unit2-ee/characters/elephant-neutral.png',completeTitle:'Lovely colors!',back:'#/unit/2/lesson/1?mode=practice',picture:w=>'assets/color-pilot/colors/'+w+'.webp',audio:w=>'assets/color-pilot/audio/'+w+'.mp3',
  onRender(scene){scene.root.style.setProperty('--pilot-color',hex[scene.target]);scene.root.dataset.color=scene.target;},
  async action(scene,target){scene.effect('confetti',target,{size:170,dy:-35,duration:900});await scene.animate(target,[{transform:'scale(.8)'},{transform:'translateY(-18px) scale(1.18)',offset:.5},{transform:'scale(1)'}],850);}
 };
 games.colour={enter:()=>ToyDelivery.start(config)};GAME_META.colour=['UNIT 2 · LESSON 1','Color Pilot','Look · fly · match the color'];
 window.ColorPilot={current:()=>ToyDelivery.current()?.game==='colour'?ToyDelivery.current():null};
})();
