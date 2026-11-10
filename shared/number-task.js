/* Serializable number-task state: no renderer, timers or audio. */
(function(root){'use strict';
const words=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
class NumberTask{
 constructor(goal,count=0,{allowReview=false}={}){
  const validGoal=allowReview?Number.isInteger(goal)&&goal>=1&&goal<=10:[9,10].includes(goal);
  if(!validGoal||!Number.isInteger(count)||count<0||count>10)throw Error('Invalid number task');
  this.goal=goal;this.count=count;this.checks=0;
 }
 add(){if(this.count>=10)return false;this.count++;return true}
 remove(){if(this.count<=0)return false;this.count--;return true}
 test(){this.checks++;return this.count===this.goal}
 get difference(){return this.goal-this.count}
 get word(){return words[this.goal]}
}
function liftGoalOrder(random=Math.random,previous=[]){
 const shuffle=input=>{const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const focus=shuffle([9,10]),review=shuffle([1,2,3,4,5,6,7,8,9,10]);
 if(review[0]===focus[1])[review[0],review[1]]=[review[1],review[0]];
 const result=[...focus,...review.slice(0,6)];
 if(result.length===previous.length&&result.every((n,i)=>n===previous[i]))[result[6],result[7]]=[result[7],result[6]];
 return result;
}
root.Unit4NumberTask={NumberTask,words,liftGoalOrder};
if(typeof module!=='undefined')module.exports=root.Unit4NumberTask;
})(globalThis);
