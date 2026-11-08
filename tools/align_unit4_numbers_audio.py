from pathlib import Path
import json,hashlib,re
from faster_whisper import WhisperModel
from faster_whisper.audio import decode_audio
from faster_whisper.tokenizer import Tokenizer
root=Path(__file__).resolve().parents[1];p=root/'assets/unit4-numbers/audio/manifest.json';manifest=json.loads(p.read_text(encoding='utf-8'));out=root/'assets/unit4/read-along/catalogue.json';catalog=json.loads(out.read_text(encoding='utf-8'));m=WhisperModel('base.en',device='cpu',compute_type='int8',download_root='C:/Users/Admin/.cache/learning-higgs/whisper',local_files_only=True);tok=Tokenizer(m.hf_tokenizer,m.model.is_multilingual,task='transcribe',language='en')
for k,c in manifest['clips'].items():
 text=c['text'];tokens=re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?",text)
 if len(tokens)==1:words=[{'word':tokens[0],'start':0,'end':c['duration']}]
 else:
  audio=decode_audio(str(root/c['src']),sampling_rate=16000);f=m.feature_extractor(audio);a=m.find_alignment(tok,[tok.encode(' '+text)],m.encode(f),min(f.shape[-1],3000))[0]
  words=[{'word':w['word'].strip(),'start':round(float(w['start']),3),'end':round(float(w['end']),3)} for w in a if re.search('[A-Za-z]',w['word'])]
  if any(w['end']<=w['start'] for w in words):
   seg,_=m.transcribe(str(root/c['src']),language='en',word_timestamps=True,condition_on_previous_text=False);heard=[w for s in seg for w in s.words]
   for w in words:
    if w['end']>w['start']:continue
    options=[x for x in heard if re.sub('[^a-z]','',x.word.lower())==re.sub('[^a-z]','',w['word'].lower()) and x.end>x.start]
    if options:x=min(options,key=lambda x:abs(x.end-w['end']));w['start']=float(x.start);w['end']=float(x.end)
 c['words']=words;catalog['clips'][c['src']]={'text':text,'words':words,'sha256':c['sha256'],'source':'assets/unit4-numbers/audio/manifest.json'}
p.write_text(json.dumps(manifest,indent=2),encoding='utf-8');p.with_name('clips.js').write_text('window.Unit4NumbersClips='+json.dumps(manifest)+';\n',encoding='utf-8');out.write_text(json.dumps(catalog,indent=2),encoding='utf-8');out.with_name('catalogue.js').write_text('window.Unit4ReadAlongClips='+json.dumps(catalog['clips'])+';\n',encoding='utf-8');print('Aligned',len(manifest['clips']),'Higgs clips')
