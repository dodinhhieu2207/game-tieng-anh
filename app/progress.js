(()=>{
 let students=[{id:'default',name:'My Stars'}],active='default',data={};
 try{const saved=JSON.parse(localStorage.getItem('learning.students.v1')||'null');if(saved&&Array.isArray(saved.students)&&saved.students.length&&saved.students.every(s=>/^(default|student-\d+-\w+)$/.test(s.id)&&typeof s.name==='string')){students=saved.students;active=students.some(s=>s.id===saved.active)?saved.active:students[0].id;}}catch{}
 const storageKey=()=>active==='default'?'learning.navigation.v1':'learning.student.'+active+'.v1';
 const load=()=>{data={};try{const saved=JSON.parse(localStorage.getItem(storageKey())||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))data=saved;}catch{}};load();
 const save=()=>{try{localStorage.setItem(storageKey(),JSON.stringify(data));}catch{}};
 const saveStudents=()=>{try{localStorage.setItem('learning.students.v1',JSON.stringify({students,active}));}catch{}};
 window.LearningProgress={
  get(key){return data[key]||{played:false,completed:false,stars:null};},
  played(key){data[key]={...this.get(key),played:true};save();},
  completed(key,stars=null){
   if(typeof key!=='string'||!/^\d+\/(?:[1-6]|existing)\/[^/]+$/.test(key))return;
   const old=this.get(key),earned=Number.isFinite(stars)?Math.max(1,Math.min(3,Math.floor(stars))):1;
   data[key]={...old,played:true,completed:true,stars:Math.max(old.stars||0,earned)};save();
   const delta=data[key].stars-(old.stars||0);
   if(delta>0||!old.completed)document.dispatchEvent(new CustomEvent('learning:progress-updated',{detail:{key,previous:old,current:{...data[key]},delta,points:delta*100}}));
  },
  all(){return JSON.parse(JSON.stringify(data));},
  speakingReview(key,evidence){
   if(typeof key!=='string'||!/^\d+\/(?:[1-6]|existing)\/[^/]+$/.test(key))return;
   const fields=['aiConfirmed','teacherConfirmed','recognitionReviews'];
   if(!evidence||fields.some(f=>!Number.isInteger(evidence[f])||evidence[f]<0||evidence[f]>1000))return;
   data[key]={...this.get(key),speakingReview:Object.fromEntries(fields.map(f=>[f,evidence[f]]))};save();
  },
  remember(hash){if(typeof hash!=='string'||!hash.startsWith('#/'))return;try{localStorage.setItem('learning.resume.'+active+'.v1',hash);}catch{}},
  last(){try{return localStorage.getItem('learning.resume.'+active+'.v1')||null;}catch{return null;}},
  students(){return students.map(s=>({...s}));},
  student(){return {...students.find(s=>s.id===active)};},
  addStudent(name){name=String(name||'').trim().slice(0,24);if(!name)return null;const s={id:'student-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),name};students.push(s);saveStudents();return {...s};},
  selectStudent(id){if(!students.some(s=>s.id===id))return false;active=id;load();saveStudents();document.dispatchEvent(new Event('learning:student-changed'));return true;},
  summary(keys){const values=keys.map(key=>this.get(key));return {played:values.filter(v=>v.played).length,completed:values.filter(v=>v.completed).length,total:keys.length};}
 };
})();
