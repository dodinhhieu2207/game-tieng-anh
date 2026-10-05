/* Reusable presentation only. The lesson owns recording, audio gating and scoring. */
(()=>{
 'use strict';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const mic='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="22" y="7" width="20" height="34" rx="10" fill="white" stroke="#075ca5" stroke-width="3"/><path d="M15 29v5a17 17 0 0 0 34 0v-5M32 51v8M23 59h18" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/><path d="M28 13v11" stroke="#c2f7ff" stroke-width="4" stroke-linecap="round"/></svg>';
 function html({support='',adapter=true,idPrefix='l2'}={}){
  if(!/^[a-zA-Z][\w-]*$/.test(idPrefix))throw new Error('Invalid voice UI prefix');
  return `<section class="toy-voice-panel" data-voice-state="ASKING" aria-label="Speaking controls"><p class="l2-speaking-support toy-voice-support">${esc(support)}</p><div class="toy-voice-state"><img data-voice-icon src="assets/shared-ui/listening.png" alt=""><b data-voice-title>Listen to Toy Buddy</b><span class="l2-waveform toy-voice-wave" aria-hidden="true" hidden><i></i><i></i><i></i><i></i><i></i></span><span class="toy-voice-duration" title="Recording stops after four seconds">4 sec</span></div><div class="l2-speaking-actions toy-voice-actions"><button id="${idPrefix}Mic" class="toy-voice-mic" type="button">${mic}<span data-voice-label>${adapter?'Tap the microphone':'Speak, then teacher check'}</span><span class="toy-voice-stop" aria-hidden="true"></span></button><button data-teacher class="toy-voice-teacher" type="button"><img src="assets/shared-ui/teacher.png" alt=""><span>Teacher Check</span></button></div><p class="l2-manual-note toy-voice-note">${adapter?'Tap to speak. Tap Stop when you finish.':'Say your answer to your teacher.'}</p><div id="${idPrefix}Teacher" class="l2-teacher toy-voice-validation" hidden><b>Teacher: check the whole answer.</b><button type="button" data-validate="correct"><img src="assets/toy-buddy/check.png" alt="">CORRECT</button><button type="button" data-validate="unclear"><img src="assets/shared-ui/replay.png" alt="">TRY AGAIN</button></div><p id="${idPrefix}Heard" class="toy-voice-heard"></p></section>`;
 }
 function update(host,{phase='idle',manual=false,feedback=null}={}){
  const panel=host.querySelector('.toy-voice-panel');if(!panel)return;
  const state=phase==='recording'?'RECORDING':phase==='starting'?'STARTING':phase==='processing'?'THINKING':phase==='asking'?'ASKING':phase==='checking'?(feedback==='correct'?'SUCCESS':'RETRY'):phase==='audio-error'?'RETRY':feedback&&feedback!=='correct'?'RETRY':phase==='resolved'||phase==='complete'?'SUCCESS':'LISTENING';
  panel.dataset.voiceState=state;panel.setAttribute('aria-busy',String(['STARTING','THINKING'].includes(state)));
  const titles={ASKING:'Listen to Toy Buddy',LISTENING:manual?'Your teacher is listening':'Your turn to speak!',STARTING:'Getting the microphone ready…',RECORDING:'Listening to you…',THINKING:'Checking your answer…',SUCCESS:'Great speaking!',RETRY:phase==='audio-error'?'Replay the question to try again':'Let’s try again!'};
  panel.querySelector('[data-voice-title]').textContent=titles[state];
  panel.querySelector('[data-voice-icon]').src=state==='SUCCESS'?'assets/toy-buddy/check.png':state==='RETRY'?'assets/shared-ui/replay.png':state==='THINKING'?'assets/shared-ui/question.png':'assets/shared-ui/listening.png';
  const label=state==='RECORDING'?'Stop recording':state==='STARTING'?'Starting microphone…':state==='THINKING'?'Checking…':manual?'Speak, then teacher check':'Tap the microphone';
  panel.querySelector('[data-voice-label]').textContent=label;
  const button=panel.querySelector('.toy-voice-mic');button.setAttribute('aria-label',label);button.setAttribute('aria-describedby',host.querySelector('#l2Status')?'l2Status':'');
  panel.querySelector('.l2-waveform').hidden=!['RECORDING','THINKING'].includes(state);
  panel.querySelector('.toy-voice-duration').hidden=manual;
 }
 window.ToyVoiceUI=Object.freeze({html,update});
})();
