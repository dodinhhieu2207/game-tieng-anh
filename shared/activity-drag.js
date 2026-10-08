/* Pointer/touch drag lifecycle extracted from the Lesson 2 tile engine. */
(()=>{
 function bind(root,{items='.l2-draggable',zones='.l2-drop',enabled=()=>true,pick=()=>{},drop=()=>{},gesture=()=>{}}={}){
  let drag=null,ignoreClick=false;
  const cancel=()=>{if(!drag)return;const {item,id}=drag;item.style.transform='';item.classList.remove('l2-dragging');try{item.releasePointerCapture(id);}catch{}drag=null;};
  const down=e=>{ignoreClick=false;const item=e.target.closest(items);if(!item||!root.contains(item)||item.disabled||item.hidden||!enabled())return;cancel();drag={item,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};pick(item);try{item.setPointerCapture(e.pointerId);}catch{}};
  const move=e=>{const d=drag;if(!d||d.id!==e.pointerId)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>8)d.moved=true;if(d.moved){d.item.classList.add('l2-dragging');d.item.style.transform=`translate(${e.clientX-d.x}px,${e.clientY-d.y}px)`;}};
  const up=e=>{const d=drag;if(!d||d.id!==e.pointerId)return;const zone=[...root.querySelectorAll(zones)].find(z=>{const r=z.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});cancel();ignoreClick=d.moved;gesture(d.item,d.moved);if(d.moved&&enabled()&&zone)drop(d.item,zone);};
  const click=e=>{if(ignoreClick&&e.detail!==0){ignoreClick=false;e.preventDefault();e.stopImmediatePropagation();}};
  root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',cancel);root.addEventListener('click',click,true);
  return {cancel,destroy(){cancel();root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',cancel);root.removeEventListener('click',click,true);}};
 }
 window.ActivityDrag=Object.freeze({bind});
})();
