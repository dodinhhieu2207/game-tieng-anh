const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function setup(options={}){
 let stopped=0,uploads=0,requested=0,rec;
 const stream={getTracks:()=>[{stop(){stopped++;}}]};
 class Recorder{static isTypeSupported(t){return t.includes('webm');}constructor(s,o){this.mimeType=o?.mimeType;this.state='inactive';rec=this;}start(){this.state='recording';}stop(){this.state='inactive';queueMicrotask(()=>{this.ondataavailable?.({data:new Blob(options.empty?[]:['audio-bytes'],{type:this.mimeType})});this.onstop?.();});}}
 const context={window:null,navigator:{mediaDevices:{getUserMedia:async()=>{requested++;if(options.permission)throw Object.assign(new Error(),{name:options.permission});if(options.permissionDelay)await delay(options.permissionDelay);return stream;}}},MediaRecorder:options.unsupported?undefined:Recorder,location:{href:'http://127.0.0.1:8765/'},Unit3SpeechConfig:{endpoint:options.unconfigured?'':'https://speech.example/api/speaking-check',maxRecordingMs:40,requestTimeoutMs:30},AbortController,FormData,Blob,URL,setTimeout,clearTimeout,queueMicrotask,fetch:async(url,init)=>{uploads++;assert.equal(init.credentials,'omit');assert.equal(init.body.get('questionToy'),'robot');assert.equal(init.body.get('displayedToy'),'teddy');assert(init.body.get('audio').size>0);assert.equal([...init.body.keys()].sort().join(','),'audio,displayedToy,expectedAnswer,questionToy');if(options.timeout)await delay(100);if(options.network)throw new Error('network');return {ok:!options.serverError,json:async()=>options.invalid?{}:{transcript:"No, it isn't.",normalized:"no it isn't",result:'CORRECT',answerType:'NO'}};}};
 context.window=context;vm.runInNewContext(fs.readFileSync('unit3-speech.js','utf8'),context);
 return {api:context.Unit3Speech,get stopped(){return stopped;},get uploads(){return uploads;},get requested(){return requested;},get rec(){return rec;}};
}
(async()=>{
 for(const options of [{},{permission:'NotAllowedError'},{permission:'NotFoundError'},{unsupported:true},{unconfigured:true},{empty:true},{network:true},{serverError:true},{invalid:true},{timeout:true}]){
  const s=setup(options),events=[];let result;
  const h=s.api.start({questionToy:'robot',displayedToy:'teddy',onStart:()=>events.push('recording'),onProcessing:()=>events.push('processing'),onResult:r=>{events.push('result');result=r;},onError:r=>events.push(r)});
  if(!Object.keys(options).length){assert.throws(()=>s.api.start({}),/busy/);await delay(2);h.stop();h.stop();}
  await delay(180);
  if(!Object.keys(options).length){assert.deepEqual(events,['recording','processing','result']);assert.equal(result.result,'CORRECT');assert.equal(s.uploads,1);}else assert(!events.includes('result'));
  if(events.includes('recording'))assert(s.stopped>0);
 }
 // Cancel before permission resolves, during capture, and while a fetch is pending.
 for(const options of [{permissionDelay:40},{},{timeout:true}]){
  const s=setup(options),events=[];const h=s.api.start({questionToy:'robot',displayedToy:'teddy',onResult:()=>events.push('result'),onError:()=>events.push('error')});await delay(options.timeout?45:5);h.cancel();await delay(150);assert.deepEqual(events,[]);assert(s.stopped>0);
 }
 console.log('PASS capture adapter: one active session, manual/automatic stop, English round multipart, tracks released, denial/no mic/unsupported/empty/network/AI/timeout fallback, cancellation before permission/during capture/during fetch.');
})().catch(e=>{console.error(e);process.exit(1);});
