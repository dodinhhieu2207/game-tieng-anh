"""Audition only: explicit Vietnamese 'hờ' cue requested by teacher, not bare /h/."""
from pathlib import Path
import os,json,hashlib,subprocess
os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
import torch,soundfile as sf
from transformers import AutoTokenizer,AutoModelForCausalLM
root=Path(__file__).resolve().parents[1];cache=Path('C:/Users/Admin/.cache/learning-higgs');out=cache/'h-vietnamese-cue';out.mkdir(exist_ok=True)
path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d';tok=AutoTokenizer.from_pretrained(path,local_files_only=True);model=AutoModelForCausalLM.from_pretrained(path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval();model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417';a,sr=sf.read(cache/'letter-land-original-reference.wav');codes=model._encode_reference(torch.tensor(a,dtype=torch.float32),sr).cpu();rows=[]
for n,text in enumerate(['Hờ.','Huh.']):
 torch.manual_seed(21140+n);wav=model.generate_speech(text,tok,reference_codes=codes,reference_text='Girl. Goat. Fish. Farm. Girl. Goat. Cat. Car. Dog. Duck.',temperature=.6,top_p=.9,top_k=40,max_new_tokens=200);raw=out/('take-'+str(n+1)+'.wav');sf.write(raw,wav.numpy(),24000);dest=out/('take-'+str(n+1)+'.mp3');subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,loudnorm=I=-19:TP=-2:LRA=7','-ar','24000','-ac','1','-b:a','96k',str(dest)],check=True);rows.append({'file':dest.name,'input':text,'seconds':round(len(wav)/24000,3),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'status':'awaiting-teacher-listening; Vietnamese teaching cue not bare English phoneme'});print(dest,flush=True)
(out/'manifest.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8')
