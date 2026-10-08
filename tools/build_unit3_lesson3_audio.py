"""Finite Lesson 3 Higgs clips, reusing the accepted Belinda reference and mouth analysis."""
from pathlib import Path
import json,hashlib,os,subprocess,re
import build_unit3_lesson2_audio as base
ROOT=base.ROOT; OUT=ROOT/'assets/unit3/lesson3/audio'; CACHE=base.CACHE
TEXTS={
 'girl':'Girl.','guitar':'Guitar.','capital-g':'Capital G.','lowercase-g':'Lowercase g.',
 'meet':'Look, listen, and choose.','detective':'Listen. Does it start with the G sound?',
 'catch':'Catch capital G and lowercase g.','sort':'Put capital G and lowercase g in their homes.',
 'fix':'Find the missing first letter.','trace':'Start at the dot. Follow the path.',
 'say':'Your turn. Say the word.','final':'Listen to the question. Say the whole answer.',
 'is-girl':'Is it a girl?','is-guitar':'Is it a guitar?',
 'sound-teacher':'Listen to your teacher. Then say the sound.',
}
def norm(s):return re.sub('[^a-z]','',s.lower())
def main():
 os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
 import torch,soundfile as sf
 from transformers import AutoTokenizer,AutoModelForCausalLM
 from faster_whisper import WhisperModel
 model_path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
 OUT.mkdir(parents=True,exist_ok=True);entries={};model=None
 qa=WhisperModel('base.en',device='cpu',compute_type='int8',download_root=str(CACHE/'whisper'),local_files_only=True)
 old=json.loads((OUT/'manifest.json').read_text())['clips'] if (OUT/'manifest.json').exists() else {}
 def save():
  doc={'engine':'Higgs V3 offline','voice':'Existing Belinda reference','phoneme':'Not generated; isolated /g/ requires teacher review','clips':entries}
  (OUT/'manifest.json').write_text(json.dumps(doc,indent=2),encoding='utf8');(OUT/'clips.js').write_text('window.Unit3Lesson3Clips='+json.dumps(doc)+';\n',encoding='utf8')
 for i,(key,text) in enumerate(TEXTS.items()):
  target=OUT/(key+'.mp3')
  if key in old and target.exists() and old[key].get('transcriptMatch') and hashlib.sha256(target.read_bytes()).hexdigest()==old[key]['sha256']:entries[key]=old[key];save();continue
  if model is None:
   print('Loading Higgs V3...',flush=True);tok=AutoTokenizer.from_pretrained(model_path,local_files_only=True)
   model=AutoModelForCausalLM.from_pretrained(model_path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
   model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
   a,sr=sf.read(CACHE/'unit3-belinda-reference.wav');codes=model._encode_reference(torch.tensor(a,dtype=torch.float32),sr).cpu()
  matched=False;raw=CACHE/'lesson3-build.wav'
  for attempt in range(3):
   torch.manual_seed(16000+i+1000*attempt)
   wav=model.generate_speech(text,tok,reference_codes=codes,reference_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy.",temperature=.6,top_p=.95,top_k=50,max_new_tokens=700)
   sf.write(raw,wav.numpy(),24000)
   base.run(base.FFMPEG,'-v','error','-y','-i',raw,'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',target)
   seg,_=qa.transcribe(str(target),language='en',beam_size=5,condition_on_previous_text=False);transcript=' '.join(s.text.strip() for s in seg)
   matched=norm(transcript)==norm(text)
   if matched:break
  normwav=CACHE/'lesson3-mouth.wav';base.run(base.FFMPEG,'-v','error','-y','-i',target,'-ar','24000','-ac','1',normwav)
  dialog=CACHE/'lesson3-dialog.txt';dialog.write_text(text,encoding='utf8');cuefile=CACHE/'lesson3-mouth.json'
  base.run(base.rhubarb(),'-f','json','-d',dialog,'-o',cuefile,normwav)
  cues=json.loads(cuefile.read_text())['mouthCues'];a,sr=sf.read(normwav)
  entries[key]={'src':target.relative_to(ROOT).as_posix(),'text':text,'duration':round(len(a)/sr,3),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'qaTranscript':transcript,'transcriptMatch':matched,'cues':[{'id':base.SHAPES[c['value']],'ms':round(c['start']*1000)} for c in cues]};save()
  print(key+': '+('PASS ' if matched else 'REVIEW ')+transcript,flush=True)
 print('DONE '+str(len(entries)),flush=True)
if __name__=='__main__':main()
