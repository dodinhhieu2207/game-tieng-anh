from pathlib import Path
import json,re
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parents[1];folder=root/'assets/unit3/lesson5/audio';p=folder/'manifest.json';m=json.loads(p.read_text());qa=WhisperModel('base.en',device='cpu',compute_type='int8',download_root='C:/Users/Admin/.cache/learning-higgs/whisper',local_files_only=True)
for key,expected in [('letter-h','h'),('letter-i','i'),('hat','hat'),('horse','horse'),('ill','ill'),('insect','insect')]:
 seg,_=qa.transcribe(str(folder/(key+'.mp3')),language='en',beam_size=5,condition_on_previous_text=False);text=' '.join(s.text.strip() for s in seg);m['clips'][key]['qaTranscript']=text;m['clips'][key]['transcriptMatch']=re.sub('[^a-z]','',text.lower())==expected;print(key,text,flush=True)
p.write_text(json.dumps(m,indent=2))
