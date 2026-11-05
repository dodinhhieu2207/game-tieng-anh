from pathlib import Path
import json,re
from faster_whisper import WhisperModel
p=Path('assets/unit4/read-along/catalogue.json');d=json.loads(p.read_text(encoding='utf-8'));m=WhisperModel('base.en',device='cpu',compute_type='int8',download_root='C:/Users/Admin/.cache/learning-higgs/whisper',local_files_only=True)
for src,c in d['clips'].items():
 bad=[w for w in c['words'] if w['end']-w['start']<.04]
 if not bad:continue
 seg,_=m.transcribe(src,language='en',word_timestamps=True,condition_on_previous_text=False,vad_filter=False)
 heard=[w for s in seg for w in s.words];norm=lambda s:re.sub('[^a-z]','',s.lower())
 for w in bad:
  candidates=[x for x in heard if norm(x.word)==norm(w['word']) and x.end-x.start>=.04]
  if candidates:
   x=min(candidates,key=lambda x:abs(x.end-w['end']));w['start']=round(float(x.start),3);w['end']=round(float(x.end),3)
  print(src,w,flush=True)
( p).write_text(json.dumps(d,indent=2),encoding='utf-8');p.with_name('catalogue.js').write_text('window.Unit4ReadAlongClips='+json.dumps(d['clips'])+';\n',encoding='utf-8')
