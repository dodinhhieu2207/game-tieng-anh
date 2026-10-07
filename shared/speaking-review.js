/* Ephemeral review audio: held in this tab only, revoked on replacement/navigation. */
(()=>{'use strict';const active=new Set();
 function mount(parent,{audio=null,transcript='',reason='',onConfirm=null}={}){
  const panel=document.createElement('details');panel.className='speaking-review';
  const summary=document.createElement('summary');summary.textContent='Teacher: listen & check';panel.append(summary);
  const note=document.createElement('p');note.textContent=transcript?'AI heard: '+transcript:'AI did not produce a clear transcript.';panel.append(note);
  const detail=document.createElement('p');detail.textContent=reason||'Listen to the recording before confirming. This is not a pronunciation score.';panel.append(detail);
  let url=null,player=null;if(audio){url=URL.createObjectURL(audio);player=document.createElement('audio');player.controls=true;player.src=url;player.preload='metadata';player.setAttribute('aria-label','Replay the last student recording');panel.append(player);}
  if(onConfirm){const button=document.createElement('button');button.type='button';button.className='btn success';button.textContent='I heard the correct full sentence';button.onclick=()=>{player?.pause();onConfirm();};panel.append(button);}
  parent?.append(panel);const handle={destroy(){player?.pause();if(url)URL.revokeObjectURL(url);url=null;panel.remove();active.delete(handle);},pause(){player?.pause();},panel};active.add(handle);return handle;
 }
 document.addEventListener('learning:leave-activity',()=>{for(const h of active)h.destroy();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const h of active)h.pause();});
 window.SpeakingReview=Object.freeze({mount});
 const style=document.createElement('style');style.textContent='.speaking-review{margin:14px 0;padding:12px 16px;border:2px solid #b9d9ef;border-radius:18px;background:#f5fbff;color:#173b59;font-size:16px;text-align:left}.speaking-review summary{cursor:pointer;font-weight:800;min-height:32px}.speaking-review p{margin:10px 0;overflow-wrap:anywhere}.speaking-review audio{display:block;width:100%;max-width:340px;margin:12px 0}.speaking-review button{min-height:48px;white-space:normal}';document.head.append(style);
})();
