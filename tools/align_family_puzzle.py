from pathlib import Path
import json,hashlib
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parents[1];m=WhisperModel('base.en',device='cpu',compute_type='int8',download_root='C:/Users/Admin/.cache/learning-higgs/whisper',local_files_only=True)
out={}
for word in ['mum','dad','brother','sister','grandpa','grandma']:
 p=root/f'assets/family-album/audio/{word}.mp3';segments,_=m.transcribe(str(p),language='en',word_timestamps=True,initial_prompt=f'This is my {word}.',vad_filter=False)
 words=[{'word':w.word.strip().strip('.').lower(),'start':round(w.start,3),'end':round(w.end,3)} for s in segments for w in s.words]
 print(word,words,flush=True);assert len(words)==4 and words[:3] and [w['word'] for w in words[:3]]==['this','is','my']
 out[word]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'words':words}
p=root/'assets/family-sentence-puzzle/precision/speech-timing.js';p.write_text('window.FamilyPuzzleTiming='+json.dumps(out)+';\n',encoding='utf-8')
