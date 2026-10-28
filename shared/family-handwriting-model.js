/* Original print model. Formation reference/provenance: assets/family-classroom/print/formation-source.json. */
(()=>{'use strict';
 const glyphs={
  m:['M25 76 V145 V100 C25 67 68 67 68 100 V145 V100 C68 67 112 67 112 100 V145'],
  u:['M28 76 V120 C28 155 80 155 102 119 V76 V145'],
  d:['M98 76 C72 63 28 73 28 111 C28 152 98 153 98 112 V22 V145'],
  a:['M98 76 C72 63 28 73 28 111 C28 152 98 153 98 112 V76 V145'],
  b:['M30 22 V145 V94 C50 65 102 76 102 112 C102 149 53 159 30 133'],
  r:['M32 76 V145 V99 C47 72 74 68 96 81'],
  o:['M98 83 C83 64 47 69 32 88 C10 114 27 149 65 145 C99 147 114 104 98 83'],
  t:['M65 30 V145','M32 76 H100'],
  h:['M30 22 V145 V101 C46 68 100 67 100 104 V145'],
  e:['M28 108 H102 C102 66 28 63 28 110 C28 148 73 155 100 134'],
  s:['M98 85 C74 62 28 75 32 96 C36 115 99 107 99 130 C98 152 51 157 28 135'],
  i:['M65 76 V145','M65 44 L65 46'],
  g:['M98 76 C72 63 28 73 28 111 C28 152 98 153 98 112 V163 C98 188 58 192 40 174'],
  n:['M30 76 V145 V101 C46 68 100 67 100 104 V145'],
  p:['M30 76 V190 V94 C53 62 102 76 102 112 C102 149 54 159 30 127']
 };
 const cues={m:['Down, back up, over and down, back up, over and down.'],u:['Down, round, up, then down.'],d:['Round, up to the top, then down.'],a:['Round, up, then down.'],b:['Down, back up, then round.'],r:['Down, back up, then over.'],o:['Round and close.'],t:['Down.','Lift. Cross from left to right.'],h:['Down, back up, over and down.'],e:['Across, then round.'],s:['Curve, turn, and curve back.'],i:['Down.','Lift. Add the dot.'],g:['Round, down, then curl left.'],n:['Down, back up, over and down.'],p:['Down below the line, back up, then round.']};
 function create(samples,length){return {samples,length,at:0,projected:0,travel:0,reverse:0,points:[],visited:new Uint8Array(samples.length)}}
 function begin(state,p){const a=state.samples[0];if(Math.hypot(p.x-a.x,p.y-a.y)>8)return false;state.points=[{x:p.x,y:p.y}];state.visited[0]=1;return true}
 function advance(s,p){const a=s.points.at(-1),dx=p.x-a.x,dy=p.y-a.y,dist=Math.hypot(dx,dy);if(dist<.35)return {ok:true};if(dist>24)return {ok:false,reason:'jump'};
  const samples=s.samples,reach=Math.min(19,Math.ceil((dist*1.7+3)/2));let best=-1,score=Infinity,near=Infinity;
  for(let i=Math.max(0,s.at-4);i<Math.min(samples.length,s.at+reach+1);i++){const q=samples[i],d=Math.hypot(p.x-q.x,p.y-q.y),next=samples[Math.min(samples.length-1,i+1)],prev=i===samples.length-1?samples[Math.max(0,i-1)]:q,tx=next.x-prev.x,ty=next.y-prev.y,n=Math.hypot(tx,ty),alignment=n?(dx*tx+dy*ty)/(dist*n):1;const value=d+Math.max(0,-alignment)*3.5+(i<s.projected?.15:0);if(value<score){best=i;score=value;near=d}}
  if(best<0||near>8)return {ok:false,reason:'off-path'};
  const backwards=Math.max(0,s.projected-best)*2;s.reverse+=backwards;
  if((s.at-best)*2>5||s.reverse>7)return {ok:false,reason:'reverse'};
  if((best-s.at)*2>dist*1.8+3)return {ok:false,reason:'skip'};
  const from=s.at;s.at=Math.max(s.at,best);s.projected=best;s.travel+=dist;
  for(let i=from;i<=s.at;i++)s.visited[i]=1;
  if(s.travel>s.length*1.28+10)return {ok:false,reason:'scribble'};
  s.points.push({x:p.x,y:p.y});return {ok:true}
 }
 function finish(s,p){const end=s.samples.at(-1),coverage=s.visited.reduce((a,b)=>a+b,0)/s.samples.length;return s.length<5?Math.hypot(p.x-end.x,p.y-end.y)<=6:s.at>=s.samples.length-3&&coverage>=.97&&Math.hypot(p.x-end.x,p.y-end.y)<=8&&s.travel>=s.length*.88&&s.travel<=s.length*1.28+10}
 let stencilId=0;
 function stencilMarkup(paths,completed=0){const id='fc-stencil-'+(++stencilId),safe=paths.map(d=>{if(!/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+\-]+$/.test(d))throw Error('Invalid stroke data');return d});return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="0" width="180" height="220">${safe.map(d=>`<path d="${d}" fill="none" stroke="white" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</mask></defs><g class="fc-stencil-outline" aria-hidden="true">${safe.map(d=>`<path d="${d}"/>`).join('')}</g><g class="fc-stencil-body">${safe.map((d,i)=>`<path class="fc-model ${i<completed?'complete':''}" d="${d}"/>`).join('')}</g><g class="fc-stencil-paint" mask="url(#${id})"><g class="fc-demo-ink"></g><g class="fc-child-ink"></g></g>`}
 const api={glyphs,cues,create,begin,advance,finish,stencilMarkup};globalThis.FamilyHandwriting=api;if(typeof module!=='undefined')module.exports=api;
})();
