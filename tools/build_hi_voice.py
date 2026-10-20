"""Higgs V3, same Letter Land reference; phoneme takes require listening approval."""
from pathlib import Path
import os,json,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1];CACHE=Path('C:/Users/Admin/.cache/learning-higgs');OUT=ROOT/'assets/unit3/lesson5/audio'
def main():
 os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
 import torch,soundfile as sf
 from transformers import AutoTokenizer,AutoModelForCausalLM
 OUT.mkdir(exist_ok=True);ref=CACHE/'letter-land-original-reference.wav';assert ref.exists()
 path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
 tok=AutoTokenizer.from_pretrained(path,local_files_only=True);model=AutoModelForCausalLM.from_pretrained(path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
 model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
 a,sr=sf.read(ref);codes=model._encode_reference(torch.tensor(a,dtype=torch.float32),sr).cpu();clips={}
 import sys
 review='--review-only' in sys.argv
 if review: clips=json.loads((OUT/'manifest.json').read_text())['clips'];clips['sound-h-review']['status']='rejected-by-user';clips['sound-i-review']['status']='rejected-by-user'
 rows=[('sound-h-v2-review','Hhhhh. Hhhhh. Hhhhh.'),('sound-i-v2-review','Ih. Ih. Ih.')] if review else [('letter-h','H.'),('letter-i','I.'),('hat','Hat.'),('horse','Horse.'),('ill','Ill.'),('insect','Insect.'),('sound-h-review','Hhh.'),('sound-i-review','Ih.')]
 for i,(key,text) in enumerate(rows):
  torch.manual_seed(20810+i);wav=model.generate_speech(text,tok,reference_codes=codes,reference_text='Girl. Goat. Fish. Farm. Girl. Goat. Cat. Car. Dog. Duck.',temperature=.5,top_p=.9,top_k=40,max_new_tokens=400)
  raw=CACHE/('hi-'+key+'.wav');sf.write(raw,wav.numpy(),24000);dest=OUT/(key+'.mp3')
  subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-19:TP=-2:LRA=7','-ar','24000','-ac','1','-b:a','96k',str(dest)],check=True)
  clips[key]={'src':dest.relative_to(ROOT).as_posix(),'text':text,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'status':'pending-phonetics-listening-review' if 'review' in key else 'generated-awaiting-listening','seconds':round(len(wav)/24000,3)}
  (OUT/'manifest.json').write_text(json.dumps({'engine':'Higgs Audio V3 offline','reference':'Existing Letter Land original voice reference','referenceSha256':hashlib.sha256(ref.read_bytes()).hexdigest(),'clips':clips},indent=2));print(key,flush=True)
if __name__=='__main__':main()
