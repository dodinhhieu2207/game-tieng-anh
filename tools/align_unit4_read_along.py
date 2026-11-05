"""Offline word timings for the existing approved Unit 4 Higgs catalogue."""
from pathlib import Path
import json,hashlib,re,difflib
from faster_whisper import WhisperModel
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/unit4/read-along';OUT.mkdir(exist_ok=True)
folders=['unit4/lesson1','family-album','robot-workshop','family-dialogue','family-hide-seek','family-classroom','jj-adventures','jj-fine-motor','magic-jug']
clips={}
for folder in folders:
 for f in (ROOT/'assets'/folder).rglob('manifest.json'):
  d=json.loads(f.read_text(encoding='utf-8'))
  if not isinstance(d.get('clips'),dict):continue
  for k,v in d['clips'].items():
   if v.get('src') and v.get('text'):clips[v['src']]={**v,'manifest':f.relative_to(ROOT).as_posix()}
# Familiar distractor words played in Jj activities.
for word in ['hat','horse','insect']:
 src=f'assets/unit3/lesson5/audio/{word}.mp3'
 if (ROOT/src).exists():clips[src]={'text':word,'manifest':'assets/unit3/lesson5/audio'}
model=WhisperModel('base.en',device='cpu',compute_type='int8',download_root='C:/Users/Admin/.cache/learning-higgs/whisper',local_files_only=True)
result={};issues=[]
for src,c in clips.items():
 p=ROOT/src
 if not p.exists():issues.append([src,'missing']);continue
 text=c['text'];expected=re.findall(r"[A-Za-z]+(?:['’][A-Za-z]+)?",text)
 phoneme='sound-j' in src
 if phoneme:
  words=[{'word':'Jj','start':0,'end':c.get('duration',2.205)}];text='Jj'
 else:
  segments,_=model.transcribe(str(p),language='en',word_timestamps=True,initial_prompt=text,vad_filter=False)
  heard=[w for s in segments for w in s.words];clean=lambda s:re.sub('[^a-z]','',s.lower()).replace('mom','mum')
  if len(heard)!=len(expected):issues.append([src,text,[(w.word,float(w.start),float(w.end)) for w in heard]]);continue
  if any(clean(w.word)!=clean(e) for w,e in zip(heard,expected)):issues.append([src,text,[(w.word,float(w.start),float(w.end)) for w in heard]]);continue
  words=[{'word':e,'start':round(float(w.start),3),'end':round(float(w.end),3)} for w,e in zip(heard,expected)]
 result[src]={'text':text,'words':words,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source':c['manifest']}
 print(len(result),src,flush=True)
(OUT/'catalogue.json').write_text(json.dumps({'clips':result,'issues':issues,'method':'faster-whisper base.en word timestamps; strict transcript token check; original Higgs clips unchanged'},indent=2),encoding='utf-8')
(OUT/'catalogue.js').write_text('window.Unit4ReadAlongClips='+json.dumps(result)+';\n',encoding='utf-8')
print('RESULT',len(result),'ISSUES',issues,flush=True)
