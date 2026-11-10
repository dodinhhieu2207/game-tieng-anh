/* Mechanical SFX follow actual lift phases; Higgs stays on its speech lane. */
(()=>{'use strict';
class LiftSound{
 constructor(owner){this.owner=owner;this.phase='idle';this.active=new Set();this.suspended=new Set();this.generation=0;this.clips={};this.serial={};for(const kind of ['depart','motor','open']){const a=new Audio('assets/unit4-numbers/lift-audio/'+kind+'.wav');a.preload='auto';a.learningSfx=true;a.loop=kind==='motor';a.onended=()=>{if(a.ended)this.active.delete(kind)};a.onerror=()=>{this.active.delete(kind);owner.root.dataset.liftSfxError=kind};this.clips[kind]=a}this.changed=()=>{if(!this.enabled())this.stopAll();else if(this.phase==='moving'&&!owner.paused&&!this.active.has('motor'))this.start('motor')};document.addEventListener('change',this.changed);document.addEventListener('toybuddy:enter',this.changed)}
 enabled(){return !this.dead&&!this.owner.dead&&!this.owner.paused&&!document.hidden&&!window.LearningApp?.isMuted()&&document.querySelector('#soundFx')?.checked!==false}
 playMedia(kind){const token=this.serial[kind]=(this.serial[kind]||0)+1;this.clips[kind].play().catch(()=>{if(this.serial[kind]===token)this.active.delete(kind)})}
 start(kind){if(!this.enabled())return;const a=this.clips[kind];a.pause();try{a.currentTime=0}catch{}if(a.error)a.load();a.volume=kind==='motor'?.18:.38;this.active.add(kind);this.playMedia(kind)}
 stop(kind){this.serial[kind]=(this.serial[kind]||0)+1;const a=this.clips[kind];a.pause();try{a.currentTime=0}catch{}this.active.delete(kind);this.suspended.delete(kind)}
 stopAll(){for(const k of Object.keys(this.clips))this.stop(k)}
 setPhase(phase){if(this.dead)return;const old=this.phase;this.phase=phase;if(old===phase)return;this.generation++;if(phase==='moving'){this.stopAll();this.start('depart');this.start('motor')}else if(phase==='opening'){const token=this.generation,a=this.clips.motor;this.stop('depart');if(this.active.has('motor'))this.owner.tween(a,{volume:0,duration:.1}).then(()=>{if(!this.dead&&token===this.generation)this.stop('motor')});this.start('open')}else this.stopAll()}
 pause(value){if(value){for(const k of this.active){const a=this.clips[k];if(!a.paused){this.serial[k]=(this.serial[k]||0)+1;a.pause();this.suspended.add(k)}}}else if(this.enabled()){for(const k of this.suspended){if(this.active.has(k))this.playMedia(k)}this.suspended.clear();if(this.phase==='moving'&&!this.active.has('motor'))this.start('motor')}}
 reset(){this.generation++;this.phase='idle';this.stopAll()}
 dispose(){this.dead=true;this.reset();document.removeEventListener('change',this.changed);document.removeEventListener('toybuddy:enter',this.changed);for(const a of Object.values(this.clips)){a.onended=a.onerror=null;a.removeAttribute('src');a.load()}}
}
window.Unit4LiftSound=LiftSound;
})();
