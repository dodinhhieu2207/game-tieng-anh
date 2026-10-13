"""Replace only guitar using Higgs and the actual existing Letter Land voice bank."""
from pathlib import Path
import hashlib,json,os
import build_unit3_lesson2_audio as base
ROOT=base.ROOT; CACHE=base.CACHE; OUT=ROOT/'assets/audio'
REFERENCE_WORDS=['girl','goat','fish','farm','girl','goat','cat','car','dog','duck']
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
 import numpy as np,soundfile as sf,torch
 from transformers import AutoTokenizer,AutoModelForCausalLM
 from faster_whisper import WhisperModel
 sources=[];parts=[];speech=[]
 for word in REFERENCE_WORDS:
  source=OUT/(word+'.mp3');decoded=CACHE/('letter-reference-'+word+'.wav')
  base.run(base.FFMPEG,'-v','error','-y','-i',source,'-ar','24000','-ac','1',decoded)
  a,sr=sf.read(decoded);parts.extend([a,np.zeros(3600)]);speech.append(a)
  sources.append({'word':word,'src':source.relative_to(ROOT).as_posix(),'sha256':digest(source)})
 ref=CACHE/'letter-land-original-reference.wav';sf.write(ref,np.concatenate(parts),24000)
 model_path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
 print('Loading Higgs with original Letter Land reference, not Unit 3 Belinda',flush=True)
 tok=AutoTokenizer.from_pretrained(model_path,local_files_only=True)
 model=AutoModelForCausalLM.from_pretrained(model_path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
 model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
 ref_audio,sr=sf.read(ref);codes=model._encode_reference(torch.tensor(ref_audio,dtype=torch.float32),sr).cpu()
 reference_text=' '.join(word.capitalize()+'.' for word in REFERENCE_WORDS)
 qa=WhisperModel('base.en',device='cpu',compute_type='int8',download_root=str(CACHE/'whisper'),local_files_only=True)
 # Match active RMS to the old girl/goat clips instead of imposing the Unit 3 gain.
 def active_rms(a):
  frames=[a[i:i+480] for i in range(0,len(a)-479,480)];rms=np.array([np.sqrt(np.mean(f*f)) for f in frames]);active=rms[rms>max(.0005,float(rms.max())*.08)]
  return float(np.sqrt(np.mean(active*active)))
 target_rms=float(np.mean([active_rms(speech[0]),active_rms(speech[1])]))
 for attempt in range(3):
  torch.manual_seed(43130+attempt)
  wav=model.generate_speech('Guitar.',tok,reference_codes=codes,reference_text=reference_text,temperature=.5,top_p=.9,top_k=40,max_new_tokens=400)
  raw=CACHE/'letter-land-guitar-higgs.wav';sf.write(raw,wav.numpy(),24000)
  trimmed=CACHE/'letter-land-guitar-trimmed.wav';base.run(base.FFMPEG,'-v','error','-y','-i',raw,'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04','-ar','24000','-ac','1',trimmed)
  a,sr=sf.read(trimmed);gain=target_rms/max(active_rms(a),1e-6);gain=min(gain,.96/max(float(np.abs(a).max()),1e-6));sf.write(trimmed,a*gain,sr)
  seg,_=qa.transcribe(str(trimmed),language='en',condition_on_previous_text=False,beam_size=5);transcript=' '.join(s.text.strip() for s in seg)
  if ''.join(c for c in transcript.lower() if c.isalpha())=='guitar' and .3<len(a)/sr<3:break
 else:raise RuntimeError('Guitar take did not pass word/duration check: '+transcript)
 target=OUT/'guitar.mp3';base.run(base.FFMPEG,'-v','error','-y','-i',trimmed,'-ar','44100','-ac','1','-codec:a','libmp3lame','-b:a','80k',target)
 doc={'engine':'Higgs Audio V3 offline','voice':'Cloned from the existing Letter Land girl/goat and vocabulary MP3s','text':'Guitar.','src':'assets/audio/guitar.mp3','sha256':digest(target),'duration':round(len(a)/sr,3),'qaTranscript':transcript,'transcriptMatch':True,'referenceText':reference_text,'referenceSources':sources,'referenceScope':'Original Letter Land bank only; no Unit 3 Belinda reference and no new SAPI synthesis','referenceActiveRms':target_rms,'gainApplied':gain,'seed':43130+attempt,'scope':'Only guitar is replaced; all original phoneme/name/girl clips and the chant timing are preserved.'}
 (OUT/'guitar.json').write_text(json.dumps(doc,indent=2),encoding='utf8')
 # A real audio preview of the same chain the child hears (existing /g/ and girl).
 pattern=[('sound-g',450),('sound-g',450),('girl',1000),('sound-g',450),('sound-g',450),('guitar',0)];parts=[]
 for word,gap in pattern:
  decoded=CACHE/('letter-chant-'+word+'.wav');base.run(base.FFMPEG,'-v','error','-y','-i',OUT/(word+'.mp3'),'-ar','24000','-ac','1',decoded);a,sr=sf.read(decoded);parts.extend([a,np.zeros(gap*24)])
 sf.write(CACHE/'letter-land-g-chant-preview.wav',np.concatenate(parts),24000)
 for source in sources:assert digest(ROOT/source['src'])==source['sha256'],'Original voice changed'
 print('PASS guitar: '+transcript+'; '+str(doc['duration'])+'s; Letter Land references and matching gain; original files preserved',flush=True)
if __name__=='__main__':main()
