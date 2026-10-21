"""Lengthen approved I cue at user request; retain source and pitch, no new TTS."""
from pathlib import Path
import subprocess,json,hashlib
root=Path(__file__).resolve().parents[1];folder=root/'assets/unit3/lesson5/audio';ff='D:/VoiceStudioApp/ffmpeg.exe'
out=folder/'sound-i-longer.mp3';subprocess.run([ff,'-v','error','-y','-i',str(folder/'sound-i-v3-review.mp3'),'-af','rubberband=tempo=0.60:pitch=1,apad=pad_dur=0.06','-ar','24000','-ac','1','-b:a','96k',str(out)],check=True)
p=folder/'manifest.json';m=json.loads(p.read_text(encoding='utf-8'));m['clips']['sound-i-longer']={'src':out.relative_to(root).as_posix(),'status':'duration-adjusted-at-user-request-2026-10-21','sourceKey':'sound-i-v3-review','method':'Pitch-preserving Rubber Band tempo 0.60 of user-approved Higgs I cue; 60ms tail padding, no new vowel or new voice','sha256':hashlib.sha256(out.read_bytes()).hexdigest()};m['activeSound']['i']='sound-i-longer';p.write_text(json.dumps(m,indent=2),encoding='utf-8')
# Keep all routes on the same cue; original clip retained for rollback.
for file in ['index.html','shared/hi-adventures.js']:
 p=root/file;s=p.read_text(encoding='utf-8');s=s.replace('sound-i-v3-review.mp3','sound-i-longer.mp3');
 if file=='index.html':s=s.replace('hi-adventures.js?v=20261021-artui1','hi-adventures.js?v=20261021-ilonger')
 p.write_text(s,encoding='utf-8')
