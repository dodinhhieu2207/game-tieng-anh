"""Reuse the approved Unit 3 Higgs name sentences, with analysed mouth cues."""
from pathlib import Path
import hashlib, json, subprocess

ROOT=Path(__file__).resolve().parents[1]
CACHE=Path('C:/Users/Admin/.cache/learning-higgs')
FFMPEG=Path('D:/VoiceStudioApp/ffmpeg.exe')
RHUBARB=CACHE/'rhubarb/Rhubarb-Lip-Sync-1.14.0-Windows/rhubarb.exe'
SHAPES={'A':21,'B':15,'C':4,'D':2,'E':9,'F':7,'G':16,'H':19,'X':0}
manifest_path=ROOT/'assets/unit3/lesson2/audio/manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf8'))
for toy in ['plane','puppet','robot','balloon','teddy']:
    source=ROOT/f'assets/unit3/audio/its_a_{toy}.mp3'
    wav=CACHE/f'name-{toy}.wav'; dialog=CACHE/f'name-{toy}.txt'; cues=CACHE/f'name-{toy}.json'
    text=f"It's a {toy}.";dialog.write_text(text,encoding='utf8')
    subprocess.run([str(FFMPEG),'-v','error','-y','-i',str(source),'-ar','24000','-ac','1',str(wav)],check=True)
    subprocess.run([str(RHUBARB),'-f','json','-d',str(dialog),'-o',str(cues),str(wav)],check=True,capture_output=True)
    result=json.loads(cues.read_text())
    manifest['clips'][f'answers/its_a_{toy}']={'src':source.relative_to(ROOT).as_posix(),'text':text,'duration':result['metadata']['duration'],'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'provenance':'Existing approved Unit 3 Higgs Belinda recording; original bytes retained','cues':[{'id':SHAPES[c['value']],'ms':round(c['start']*1000)} for c in result['mouthCues']]}
manifest_path.write_text(json.dumps(manifest,indent=2),encoding='utf8')
(manifest_path.parent/'clips.js').write_text('window.Unit3Lesson2Clips='+json.dumps(manifest)+';\n',encoding='utf8')
print('Reused five original Higgs name sentences; added waveform mouth cues.')
