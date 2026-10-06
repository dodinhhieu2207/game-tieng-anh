"""Offline finite Unit 2 voice catalogue. Static MP3s only; no runtime model."""
from pathlib import Path
import hashlib,json,os,re,subprocess,time,argparse
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/unit2/audio-higgs'
CACHE=Path('C:/Users/Admin/.cache/learning-higgs')
def norm(text):return re.sub(r'[^a-z0-9]+',' ',text.lower().replace('’',"'")).strip()
def qa_norm(text):
 text=norm(text).replace('colour','color').replace('lower case','lowercase').replace('practise','practice').replace('note book','notebook')
 for i,w in enumerate(['one','two','three','four','five','six'],1):text=re.sub(r'\b'+str(i)+r'\b',w,text)
 return text
def catalogue():
 words=['desk','chair','pencil','crayon','notebook','egg','elephant','fish','farm']
 school=words[:5];vocab=words[:7];nums=['one','two','three','four','five','six']
 colors=['red','green','blue','black','white','yellow','pink','purple','orange']
 texts=["What's this?","It's a",'Spin and say.','Yeah! Great job!','Try again!',
 'Look and remember.',"What's missing?",'Choose the missing picture.','Correct!',
 'Match the picture to the word.','Fantastic! All five are matched!',
 'Match the two halves of the same picture.','Puzzle complete! Great job!',
 'Find uppercase E and lowercase e.','Capital E','Lowercase e','Capital F',
 'Listen and count.','How many eggs?','Choose a colour. Then paint the matching number.',
 'Beautiful work! You finished the picture.','Team A wins!','Team B wins!','Fantastic teamwork!',
 'Incorrect. Try again. Look carefully.',"Hello! I'm Ellie. Let's meet desk, chair, pencil, crayon, notebook, egg, elephant.",
 'Yeah! Great learning! Choose a game to practise again.','E','F','Eh.','Fff.',
 *words,*nums]
 for w in vocab:
  article='an' if w in ['egg','elephant'] else 'a'
  texts += [f"It's {article} {w}.",f'Yeah! Great listening! {w}.',f'Incorrect. Try again. Touch the {w}.',
   f'Yeah! Great job! {w}.',f'Touch the {w}.',f"Listen: It's {article} {w}. Now you try.",f'The missing picture is {w}.']
  for n,num in enumerate(nums,1):
   plural=w if n==1 else w+'s'
   texts += [f'Put {num} {plural} on the yellow mat.',f'Yeah! Great job! {num} {plural}.']
 for w in school:
  for c in colors[:5]:
   texts += [f'{c} {w}']
   for n,num in enumerate(nums[:4],1):texts += [f'{num} {c} {w if n==1 else w+"s"}']
 for num in ['Five','Six']:texts += [f'{num} eggs.',f'Correct! {num} eggs.']
 for n in range(1,7):
  for c in colors[5:]+['blue','green']:
   texts += [f'{n}. {c}.',f'Correct. Number {n} is {c}.']
 result={}
 for text in texts:
  key=norm(text)
  if key not in result:result[key]={'text':text,'src':'assets/unit2/audio-higgs/'+hashlib.sha256(key.encode()).hexdigest()[:16]+'.mp3'}
 return result
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--catalog-only',action='store_true');args=parser.parse_args()
 OUT.mkdir(parents=True,exist_ok=True);clips=catalogue()
 if (OUT/'manifest.json').exists():
  previous=json.loads((OUT/'manifest.json').read_text(encoding='utf8'))['clips']
  for key in clips:
   if key in previous and previous[key].get('sha256'):clips[key].update(previous[key])
 def save():
  doc={'version':'20261006-unit2-higgs1','engine':'Higgs V3 offline','voice':'Existing Belinda reference','clips':clips}
  (OUT/'manifest.json').write_text(json.dumps(doc,indent=2),encoding='utf8')
  (OUT/'clips.js').write_text('window.Unit2HiggsClips='+json.dumps(doc)+';\n',encoding='utf8')
 save();print('Catalogue:',len(clips),'clips',flush=True)
 if args.catalog_only:return
 os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
 import torch,soundfile as sf
 from transformers import AutoModelForCausalLM,AutoTokenizer
 from faster_whisper import WhisperModel
 qa=WhisperModel('base.en',device='cpu',compute_type='int8',download_root=str(CACHE/'whisper'),local_files_only=True)
 model_path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
 tokenizer=AutoTokenizer.from_pretrained(model_path,local_files_only=True)
 model=AutoModelForCausalLM.from_pretrained(model_path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
 model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
 audio,sr=sf.read(CACHE/'unit3-belinda-reference.wav');codes=model._encode_reference(torch.tensor(audio,dtype=torch.float32),sr).cpu()
 failed=[]
 for i,(key,clip) in enumerate(clips.items()):
  target=ROOT/clip['src'];raw=CACHE/'unit2-build.wav'
  if target.exists() and clip.get('sha256'):
   if key in ['e','f','eh','fff'] or qa_norm(clip.get('qaTranscript',''))==qa_norm(clip['text']):
    clip['transcriptMatch']=True;save();continue
  success=False
  for attempt in range(3):
   torch.manual_seed(8000+i+attempt*1000)
   wav=model.generate_speech(clip['text'],tokenizer,reference_codes=codes,reference_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy.",temperature=.6,top_p=.95,top_k=50,max_new_tokens=900)
   sf.write(raw,wav.numpy(),24000)
   subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',str(target)],check=True)
   segments,_=qa.transcribe(str(target),language='en',beam_size=5,condition_on_previous_text=False)
   transcript=' '.join(s.text.strip() for s in segments)
   clip['qaTranscript']=transcript;clip['transcriptMatch']=qa_norm(transcript)==qa_norm(clip['text'])
   if key in ['e','f','eh','fff']:clip['phonicsReviewRequired']=key in ['eh','fff'];success=True
   else:success=clip['transcriptMatch']
   if success:break
  clip['sha256']=hashlib.sha256(target.read_bytes()).hexdigest();clip['duration']=round(len(wav)/24000,3)
  if not success:failed.append(key)
  save();print(f'{i+1}/{len(clips)} '+('PASS ' if success else 'REVIEW ')+clip['text']+' -> '+transcript,flush=True)
 print('DONE; review:',failed,flush=True)
if __name__=='__main__':main()
