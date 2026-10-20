"""Compose chants from user-approved isolated Higgs phonemes and word clips."""
from pathlib import Path
import json,hashlib,subprocess,numpy as np,soundfile as sf
root=Path(__file__).resolve().parents[1];folder=root/'assets/unit3/lesson5/audio';cache=Path('C:/Users/Admin/.cache/learning-higgs');p=folder/'manifest.json';m=json.loads(p.read_text())
for k,words in [('h',['hat','horse']),('i',['ill','insect'])]:
 assert m['clips']['sound-'+k+'-v3-review']['status']=='user-approved-2026-10-21'
 parts=[]
 for w in words:
  for file,gap in [('sound-'+k+'-v3-review.mp3',.28),('sound-'+k+'-v3-review.mp3',.28),(w+'.mp3',.6)]:
   a,sr=sf.read(folder/file);parts.extend([a,np.zeros(int(sr*gap))])
 raw=cache/('chant-hi-'+k+'.wav');sf.write(raw,np.concatenate(parts),sr);out=folder/('chant-'+k+'.mp3');subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-b:a','96k',str(out)],check=True);m['clips']['chant-'+k]={'src':out.relative_to(root).as_posix(),'source':'User-approved Higgs phoneme + Higgs words with explicit pauses','sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'words':words}
p.write_text(json.dumps(m,indent=2))
