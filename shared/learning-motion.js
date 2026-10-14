/* Scoped GSAP choreography. A scene owns its timelines and cancels them on exit. */
(()=>{
 'use strict';
 const scopes=new Set();
 if(window.gsap&&window.MotionPathPlugin)gsap.registerPlugin(MotionPathPlugin);
 function create(root){
  const active=new Set(),contexts=new Set();let dead=false;
  const scope={
   run(build){if(dead||!root?.isConnected||!window.gsap||!window.MotionPathPlugin||matchMedia('(prefers-reduced-motion: reduce)').matches)return Promise.resolve(false);
    return new Promise(resolve=>{let timeline,context,done=false;const finish=ok=>{if(done)return;done=true;active.delete(item);resolve(ok);};const item={cancel(){timeline?.kill();context?.revert();contexts.delete(context);finish(false);},pause(){timeline?.pause();},resume(){timeline?.resume();}};active.add(item);
     context=gsap.context(()=>{timeline=gsap.timeline({paused:true,onComplete:()=>finish(true)});build(timeline);timeline.play();},root);contexts.add(context);
    });
   },
   pause(){active.forEach(a=>a.pause());},resume(){active.forEach(a=>a.resume());},count:()=>active.size,
   dispose(){if(dead)return;dead=true;active.forEach(a=>a.cancel());active.clear();contexts.forEach(c=>c.revert());contexts.clear();scopes.delete(scope);}
  };scopes.add(scope);return scope;
 }
 document.addEventListener('visibilitychange',()=>scopes.forEach(s=>document.hidden?s.pause():s.resume()));
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)scopes.forEach(s=>s.dispose());});
 window.LearningMotion=Object.freeze({create,activeCount:()=>[...scopes].reduce((n,s)=>n+s.count(),0)});
})();
