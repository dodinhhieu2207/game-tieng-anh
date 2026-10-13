"""Higgs word takes + approved /g/, paced like Letter Land; preserves existing clips."""
from pathlib import Path
import hashlib,json,os
import build_unit3_lesson2_audio as base

ROOT=base.ROOT; OUT=ROOT/'assets/unit3/lesson3/audio'; CACHE=base.CACHE
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
 os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
 import torch,numpy as np,soundfile as sf
 from transformers import AutoTokenizer,AutoModelForCausalLM
 from faster_whisper import WhisperModel
 manifest=json.loads((OUT/'manifest.json').read_text(encoding='utf-8'));clips=manifest['clips'];sound=clips['sound-g']
 assert sound['humanReviewed'] and digest(ROOT/sound['src'])==sound['sha256'],'Approved phoneme required'
 qa=WhisperModel('base.en',device='cpu',compute_type='int8',download_root=str(CACHE/'whisper'),local_files_only=True)
 model=None
 for i,word in enumerate(['girl','guitar']):
  key='chant-'+word;target=OUT/(key+'.mp3');text=word.capitalize()+'!'
  if key in clips and target.exists() and digest(target)==clips[key]['sha256']:continue
  if model is None:
   path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
   print('Loading offline Higgs V3 and accepted Belinda reference',flush=True)
   tok=AutoTokenizer.from_pretrained(path,local_files_only=True)
   model=AutoModelForCausalLM.from_pretrained(path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
   model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
   ref,sr=sf.read(CACHE/'unit3-belinda-reference.wav');codes=model._encode_reference(torch.tensor(ref,dtype=torch.float32),sr).cpu()
  for attempt in range(3):
   torch.manual_seed(32100+i+attempt*1000)
   wav=model.generate_speech(text,tok,reference_codes=codes,reference_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy.",temperature=.55,top_p=.95,top_k=50,max_new_tokens=350)
   raw=CACHE/(key+'.wav');sf.write(raw,wav.numpy(),24000)
   base.run(base.FFMPEG,'-v','error','-y','-i',raw,'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',target)
   seg,_=qa.transcribe(str(target),language='en',beam_size=5,condition_on_previous_text=False);transcript=' '.join(s.text.strip() for s in seg)
   if ''.join(c for c in transcript.lower() if c.isalpha())==word:break
  else:raise RuntimeError('Word failed transcript check: '+transcript)
  decoded=CACHE/(key+'-decoded.wav');base.run(base.FFMPEG,'-v','error','-y','-i',target,'-ar','24000','-ac','1',decoded)
  dialog=CACHE/(key+'.txt');dialog.write_text(text,encoding='utf8');cuefile=CACHE/(key+'.json');base.run(base.rhubarb(),'-f','json','-d',dialog,'-o',cuefile,decoded)
  a,sr=sf.read(decoded);cues=json.loads(cuefile.read_text())['mouthCues']
  clips[key]={'src':target.relative_to(ROOT).as_posix(),'text':text,'duration':round(len(a)/sr,3),'sha256':digest(target),'qaTranscript':transcript,'transcriptMatch':True,'cues':[{'id':base.SHAPES[c['value']],'ms':round(c['start']*1000)} for c in cues]}
  print(key+': '+transcript,flush=True)
 # Retain the human-reviewed phoneme instead of asking a generative model to invent it again.
 pattern=[('sound-g',450),('sound-g',450),('chant-girl',1000),('sound-g',450),('sound-g',450),('chant-guitar',0)]
 parts=[];cues=[];beats=[];samples=0
 for key,gap in pattern:
  source=clips[key];raw=CACHE/(key+'-concat.wav');base.run(base.FFMPEG,'-v','error','-y','-i',ROOT/source['src'],'-ar','24000','-ac','1',raw);a,sr=sf.read(raw)
  start=round(samples/24);end=round((samples+len(a))/24)
  beats.append({'key':key,'startMs':start,'endMs':end,'gapMs':gap,'sourceSha256':source['sha256']})
  cues.extend({'id':c['id'],'ms':start+c['ms']} for c in source['cues']);cues.append({'id':0,'ms':end})
  silence=np.zeros(round(gap*24));parts.extend([a,silence]);samples+=len(a)+len(silence)
 raw=CACHE/'gg-chant.wav';sf.write(raw,np.concatenate(parts),24000);target=OUT/'chant-gg.mp3'
 base.run(base.FFMPEG,'-v','error','-y','-i',raw,'-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',target)
 clips['chant-gg']={'src':target.relative_to(ROOT).as_posix(),'kind':'phonics-chant','text':'/g/ /g/ girl; /g/ /g/ guitar.','duration':round(samples/24000,3),'sha256':digest(target),'transcriptMatch':True,'validation':'Words checked by ASR; four phonemes reuse the hash-verified human-approved take 1. No ASR phoneme approval.','rhythm':'Letter Land: two phonemes before each word; 450 ms between sounds, 1000 ms between word groups.','beats':beats,'cues':sorted(cues,key=lambda c:c['ms'])}
 (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8');(OUT/'clips.js').write_text('window.Unit3Lesson3Clips='+json.dumps(manifest)+';\n',encoding='utf8')
 print('DONE: '+str(clips['chant-gg']['duration'])+'s Higgs chant, approved sound preserved',flush=True)
if __name__=='__main__':main()
