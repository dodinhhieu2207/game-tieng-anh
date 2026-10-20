"""Compose chants from user-approved isolated Higgs phonemes and word clips."""
from pathlib import Path
import json,hashlib,subprocess,sys,numpy as np,soundfile as sf
root=Path(__file__).resolve().parents[1];folder=root/'assets/unit3/lesson5/audio';cache=Path('C:/Users/Admin/.cache/learning-higgs');p=folder/'manifest.json';m=json.loads(p.read_text(encoding="utf8"))
for k,words in [('h',['hat','horse']),('i',['ill','insect'])]:
 if '--letter' in sys.argv and k!=sys.argv[sys.argv.index('--letter')+1]:continue
 sound=m.get('activeSound',{}).get(k,'sound-'+k+'-v3-review')
 assert m['clips'][sound]['status'].startswith('user-approved')
 parts=[]
 for w in words:
  for file,gap in [(sound+'.mp3',.28),(sound+'.mp3',.28),(w+'.mp3',.6)]:
   a,sr=sf.read(folder/file);parts.extend([a,np.zeros(int(sr*gap))])
 raw=cache/('chant-hi-'+k+'.wav');sf.write(raw,np.concatenate(parts),sr);chant='chant-h-cue' if k=='h' and sound=='sound-h-vietnamese-cue' else 'chant-'+k;out=folder/(chant+'.mp3');subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-b:a','96k',str(out)],check=True);m['clips'][chant]={'src':out.relative_to(root).as_posix(),'source':'User-approved Higgs sound cue + Higgs words with explicit pauses','soundKey':sound,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'words':words}
p.write_text(json.dumps(m,indent=2),encoding="utf8")
