/* Within-session teaching support. No learner diagnosis, storage or scoring API. */
(()=>{
 'use strict';
 const PAIRS=[['happy','sad'],['hungry','thirsty'],['hot','cold']];
 let previousHelping=null;
 const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 class Path{
  constructor(helping=false){
   this.pairs=(helping?PAIRS.slice(1):PAIRS).map(p=>[...p]);this.pair=0;this.turn=0;this.complete=false;this.history=[];
   if(helping){this.pairs=shuffle(this.pairs).map(shuffle);if(this.pairs.flat().join()===previousHelping)this.pairs.reverse();previousHelping=this.pairs.flat().join();}
   this.records=Object.fromEntries(this.pairs.flat().map(word=>[word,{exposed:false,independent:0,assisted:0,lastIndependent:-2}]));
   this.target=this.pool[0];
  }
  get pool(){return this.pairs[this.pair];}
  get ready(){return this.pool.every(word=>this.records[word].independent>=2);}
  expose(word){if(this.pool.includes(word))this.records[word].exposed=true;}
  record(word,assisted){
   if(this.complete||word!==this.target||!this.records[word].exposed)throw Error('Unsupported learning turn');
   const r=this.records[word];
   const independent=!assisted&&(r.lastIndependent<0||this.history.some(h=>h.turn>r.lastIndependent&&h.word!==word));
   if(independent){r.independent=Math.min(2,r.independent+1);r.lastIndependent=this.turn;}else r.assisted++;
   this.history.push({word,assisted:!independent,turn:this.turn++});
  }
  next(){
   if(this.complete)return null;
   // Always interleave the other target; repeated clicks on one picture cannot
   // satisfy the separated-retrieval rule. Pair advancement is an explicit action.
   this.target=this.pool.find(word=>word!==this.target);return this.target;
  }
  advance(){
   if(this.complete||!this.ready)return false;
   if(this.pair===this.pairs.length-1){this.complete=true;return true;}
   this.pair++;this.target=this.pool[0];return true;
  }
 }
 window.Unit5Learning={Path,pairs:PAIRS.map(p=>[...p])};
})();
