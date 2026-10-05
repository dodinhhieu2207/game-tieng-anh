(()=>{
 let data={};try{data=JSON.parse(localStorage.getItem('learning.navigation.v1')||'{}')||{};}catch{}
 const save=()=>{try{localStorage.setItem('learning.navigation.v1',JSON.stringify(data));}catch{}};
 window.LearningProgress={
  get(key){return data[key]||{played:false,completed:false,stars:null};},
  played(key){data[key]={...this.get(key),played:true};save();},
  completed(key,stars=null){const old=this.get(key);data[key]={...old,played:true,completed:true,stars:stars===null?old.stars:Math.max(old.stars||0,stars)};save();},
  summary(keys){const values=keys.map(key=>this.get(key));return {played:values.filter(v=>v.played).length,completed:values.filter(v=>v.completed).length,total:keys.length};}
 };
})();
