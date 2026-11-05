from pathlib import Path
import json,hashlib,re
from faster_whisper import WhisperModel
from faster_whisper.audio import decode_audio
from faster_whisper.tokenizer import Tokenizer
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/unit4/read-along';d=json.loads((OUT/'catalogue.json').read_text(encoding='utf-8'))
m=WhisperModel('base.en',device='cpu',compute_type='int8',download_root='C:/Users/Admin/.cache/learning-higgs/whisper',local_files_only=True);tok=Tokenizer(m.hf_tokenizer,m.model.is_multilingual,task='transcribe',language='en')
for issue in d['issues']:
 src,text=issue[:2];p=ROOT/src;audio=decode_audio(str(p),sampling_rate=16000);features=m.feature_extractor(audio);frames=min(features.shape[-1],3000);enc=m.encode(features)
 alignment=m.find_alignment(tok,[tok.encode(' '+text)],enc,frames)[0]
 words=[{'word':x['word'].strip(),'start':round(float(x['start']),3),'end':round(min(float(x['end']),len(audio)/16000),3)} for x in alignment if re.search('[A-Za-z]',x['word'])]
 assert words and all(w['end']>=w['start'] for w in words)
 d['clips'][src]={'text':text,'words':words,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source':'Approved transcript; forced word alignment with faster-whisper find_alignment'}
 print(src,words,flush=True)
d['issues']=[];d['method']='Whisper word timestamps; transcript mismatch cases use forced alignment of existing approved transcript. No audio regenerated.'
(OUT/'catalogue.json').write_text(json.dumps(d,indent=2),encoding='utf-8');(OUT/'catalogue.js').write_text('window.Unit4ReadAlongClips='+json.dumps(d['clips'])+';\n',encoding='utf-8');print('TOTAL',len(d['clips']))
