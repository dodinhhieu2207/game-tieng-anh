/* Visible semantic-result choreography for Family Treehouse Talk. */
(()=>{'use strict';
 const speech=window.Unit3Speech;if(!speech||speech.__familyFeedback)return;
 const original=speech.start.bind(speech);speech.__familyFeedback=true;
 function root(){return document.querySelector('.u4-talk-scene')}
 function clear(){const scene=root();if(!scene)return;scene.classList.remove('result-correct','result-retry','result-unclear');scene.querySelector('.u4-talk-result')?.remove()}
 function show(kind,text){const scene=root();if(!scene)return;clear();scene.classList.add(kind==='correct'?'result-correct':'result-retry');const box=document.createElement('div');box.className='u4-talk-result';box.setAttribute('role','status');box.innerHTML=`<img src="assets/family-treehouse-talk/result-${kind}.svg" alt=""><strong>${text}</strong>`;scene.append(box);requestAnimationFrame(()=>{box.classList.add('is-visible');if(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo(box,{scale:.2,rotation:kind==='correct'?-12:8},{scale:1,rotation:0,duration:.55,ease:'back.out(1.8)'})});if(kind==='correct')window.LearningFeedback?.play('complete',scene,{visualize:true});else window.LearningFeedback?.play('retry',scene,{visualize:true})}
 speech.start=options=>{if(options?.questionType!=='family-introduction')return original(options);const result=options.onResult,error=options.onError,start=options.onStart;return original({...options,onStart:(...a)=>{clear();start?.(...a)},onResult:r=>{if(r.result==='UNCLEAR')neutral('I could not hear clearly. Try again.');else show(r.result==='CORRECT'?'correct':'retry',r.result==='CORRECT'?'Great speaking!':r.result==='WRONG_LOGIC'?'Try this person':'Say the whole line');result?.(r)},onError:(...a)=>{neutral('The listener needs another try.');error?.(...a)}})};
 function neutral(text){const scene=root();if(!scene)return;clear();scene.classList.add('result-unclear');const box=document.createElement('div');box.className='u4-talk-result is-visible';box.setAttribute('role','status');const strong=document.createElement('strong');strong.textContent=text;box.append(strong);scene.append(box)}
 window.FamilyTalkFeedback=Object.freeze({show,clear});
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-next]'))clear()},true);
 document.addEventListener('learning:leave-activity',clear);
})();
