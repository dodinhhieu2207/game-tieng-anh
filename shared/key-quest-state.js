/* Pure finite curriculum model. Random reward order, never random answer semantics. */
((root,factory)=>{const api=factory();if(typeof module==='object')module.exports=api;else root.KeyQuestState=api})(typeof window==='undefined'?globalThis:window,()=>{
 const WORDS={kangaroo:'k',key:'k',lion:'l',lollipop:'l'};
 const shuffle=(values,rng=Math.random)=>{const a=values.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 function order(rng=Math.random,previous=[]){const k=shuffle(['kangaroo','key'],rng),l=shuffle(['lion','lollipop'],rng),first=rng()<.5;let a=first?[k[0],l[0],l[1],k[1]]:[l[0],k[0],k[1],l[1]];if(a.every((v,i)=>v===previous[i]))a=[a[3],a[2],a[1],a[0]];return a}
 return Object.freeze({WORDS,shuffle,order,accepts:(word,letter)=>WORDS[word]===String(letter).toLowerCase()});
});
