from pathlib import Path
import os,json,hashlib,subprocess,re
os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
import torch,soundfile as sf
from transformers import AutoTokenizer,AutoModelForCausalLM
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parents[1];cache=Path('C:/Users/Admin/.cache/learning-higgs');out=root/'assets/unit3/lesson5/audio';modelpath='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
tok=AutoTokenizer.from_pretrained(modelpath,local_files_only=True);model=AutoModelForCausalLM.from_pretrained(modelpath,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval();model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417';a,sr=sf.read(cache/'letter-land-original-reference.wav');codes=model._encode_reference(torch.tensor(a,dtype=torch.float32),sr).cpu();qa=WhisperModel('base.en',device='cpu',compute_type='int8',download_root=str(cache/'whisper'),local_files_only=True)
for attempt in range(4):
 torch.manual_seed(22601+attempt);wav=model.generate_speech('Ill.',tok,reference_codes=codes,reference_text='Girl. Goat. Fish. Farm. Girl. Goat. Cat. Car. Dog. Duck.',temperature=.65,top_p=.95,top_k=50,max_new_tokens=300);raw=cache/'ill-repair.wav';sf.write(raw,wav.numpy(),24000);take=cache/'ill-repair.mp3';subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-19:TP=-2:LRA=7','-ar','24000','-ac','1','-b:a','96k',str(take)],check=True);seg,_=qa.transcribe(str(take),language='en',beam_size=5,condition_on_previous_text=False);text=' '.join(s.text.strip() for s in seg);print(attempt,text,flush=True)
 if re.sub('[^a-z]','',text.lower())=='ill':
  target=out/'ill.mp3';target.write_bytes(take.read_bytes());p=out/'manifest.json';m=json.loads(p.read_text());m['clips']['ill'].update(sha256=hashlib.sha256(target.read_bytes()).hexdigest(),qaTranscript=text,transcriptMatch=True,status='word-transcript-checked',seed=22601+attempt);p.write_text(json.dumps(m,indent=2));break
else:raise RuntimeError('Ill word remains unresolved; do not claim accepted word take')
