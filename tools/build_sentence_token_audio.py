"""Generate static word clips using the existing cached Higgs/Belinda setup."""
from pathlib import Path
import json, os, hashlib, subprocess
ROOT=Path(__file__).resolve().parents[1]
CACHE=Path('C:/Users/Admin/.cache/learning-higgs')
OUT=ROOT/'assets/sentence-words'
os.environ['HF_HOME']='D:/AI_Models/HF_Cache'
os.environ['HF_HUB_OFFLINE']='1'
def main():
 import torch, soundfile as sf
 from transformers import AutoModelForCausalLM, AutoTokenizer
 OUT.mkdir(parents=True,exist_ok=True)
 model_path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
 tokenizer=AutoTokenizer.from_pretrained(model_path,local_files_only=True)
 model=AutoModelForCausalLM.from_pretrained(model_path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
 model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
 audio,sr=sf.read(CACHE/'unit3-belinda-reference.wav')
 codes=model._encode_reference(torch.tensor(audio,dtype=torch.float32),sr).cpu()
 clips={}
 for i,(key,text) in enumerate({'is':'Is','it':'it','a':'a','yes':'Yes','no':'No',"isnt":"isn't",'whats':"What's",'this':'this','its':"It's"}.items()):
  target=OUT/(key+'.mp3')
  if not target.exists():
   torch.manual_seed(1800+i)
   wav=model.generate_speech(text,tokenizer,reference_codes=codes,reference_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy.",temperature=.6,top_p=.95,top_k=50,max_new_tokens=250)
   raw=CACHE/('token-'+key+'.wav');sf.write(raw,wav.numpy(),24000)
   subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',str(target)],check=True)
  clips[key]={'text':text,'src':target.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
  print('READY '+key,flush=True)
 manifest={'voice':'Higgs V3 with existing approved Belinda reference','clips':clips}
 (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
 print('DONE',flush=True)
if __name__=='__main__':main()
