/* Owned, audio-clocked cutout motion. Uses existing pinned GSAP/Phaser. */
(()=>{'use strict';const ROOT='assets/unit3/lesson6/motion/';
window.StoryMotion={preload(scene){scene.load.json('storyMotionManifest',ROOT+'manifest.json');for(let i=0;i<4;i++){scene.load.image('storyPlate'+i,ROOT+`plate-0${i+1}.webp`);scene.load.image('storyActor'+i,ROOT+`actor-0${i+1}.webp`)}},create(scene,owner){return new Motion(scene,owner)}};
class Motion{
 constructor(scene,owner){this.scene=scene;this.owner=owner;this.config=scene.cache.json.get('storyMotionManifest');this.actor=scene.add.image(0,0,'storyActor0').setDepth(1);this.clock=0;this.token=0}
 show(index){this.timeline?.kill();this.token++;this.index=index;const c=this.config.scenes[index];this.base={x:c.x,y:c.y,angle:0,scaleX:c.width/this.scene.textures.get('storyActor'+index).getSourceImage().width,scaleY:c.height/this.scene.textures.get('storyActor'+index).getSourceImage().height,alpha:1};this.actor.setTexture('storyActor'+index);this.restore();this.scene.picture.setTexture('storyPlate'+index).setDisplaySize(1000,667);this.actor.setVisible(!this.owner.calm);if(this.owner.calm)this.scene.picture.setTexture('story'+index).setDisplaySize(1000,667);const a=this.actor,b=this.base;this.timeline=gsap.timeline({paused:true});
 if(index===0){this.timeline.fromTo(a,{x:b.x+12,y:b.y+4,angle:1},{x:b.x,y:b.y,angle:0,duration:1.1,ease:'sine.inOut'},.25).to(a,{y:b.y-3,angle:-.6,duration:.6,ease:'sine.inOut'},2.0).to(a,{y:b.y,angle:0,duration:.7,ease:'sine.inOut'},2.6)}
 if(index===1){this.timeline.to(a,{x:b.x-4,y:b.y-4,angle:-1.4,duration:.55,ease:'sine.inOut'},.3).to(a,{x:b.x+3,angle:1.1,duration:.65,ease:'sine.inOut'},.85).to(a,{x:b.x-3,angle:-.8,duration:.6,ease:'sine.inOut'},1.5).to(a,{x:b.x,y:b.y,angle:0,duration:.65,ease:'sine.inOut'},2.1)}
 if(index===2){this.timeline.fromTo(a,{y:b.y-15,angle:-1},{y:b.y+2,angle:.4,duration:.6,ease:'power2.inOut'},.05).to(a,{y:b.y-4,angle:-.4,duration:.4,ease:'sine.out'},.65).to(a,{y:b.y,angle:0,duration:.6,ease:'sine.inOut'},1.05).to(a,{y:b.y-3,duration:.4,ease:'sine.inOut'},3.2).to(a,{y:b.y,duration:.5,ease:'sine.inOut'},3.6)}
 if(index===3){this.timeline.to(a,{y:b.y-5,angle:-.6,duration:.65,ease:'sine.inOut'},8.8).to(a,{y:b.y,angle:0,duration:.65,ease:'sine.inOut'},9.45);for(const t of [15.5,17.1,19.4])this.timeline.to(a,{angle:-1,y:b.y-3,duration:.32,ease:'power1.inOut'},t).to(a,{angle:1,y:b.y,duration:.45,ease:'power1.inOut'},t+.32).to(a,{angle:0,duration:.35,ease:'power1.inOut'},t+.77)}
 this.timeline.pause(0);this.restore();this.clock=0}
 restore(){Object.assign(this.actor,this.base||{});this.clock=0}
 sample(time){if(this.owner.calm){this.actor.setVisible(false);this.scene.picture.setTexture('story'+this.index).setDisplaySize(1000,667);this.restore();return}this.actor.setVisible(true);this.scene.picture.setTexture('storyPlate'+this.index).setDisplaySize(1000,667);this.clock=time;this.timeline.time(Math.min(time,this.timeline.duration()),true)}
 finish(){this.timeline?.pause(0);this.restore()}
 react(){if(this.owner.calm)return;this.owner.animate(this.actor,{y:this.base.y-7,duration:.28,yoyo:true,repeat:1,ease:'sine.inOut'})}
 destroy(){if(this.dead)return;this.dead=true;this.timeline?.kill();this.actor.destroy();this.timeline=null}
}
})();
