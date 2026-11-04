"""Finite Higgs V3 Magic Jug catalogue; reuse approved Belinda reference."""
import json
import build_unit4_lesson1_audio as build
build.OUT=build.ROOT/'assets/magic-jug/audio'
build.TEXTS={'letter':'J.','jug':'Jug.','juice':'Juice.','discover':'Touch the letters and pictures. Listen and say.','pour':'Tilt the jug. Pour the juice.','complete':'Well done! A jug of juice!'}
def checked(key,transcript):
    heard=build.norm(transcript)
    return heard in {'j','jay'} if key=='letter' else (build.norm(build.TEXTS[key])==heard or (key in {'jug','juice'} and key in heard))
if __name__=='__main__':
    build.transcript_ok=checked
    build.main()
    (build.OUT/'clips.js').unlink(missing_ok=True)
    p=build.OUT/'manifest.json';m=json.loads(p.read_text(encoding='utf-8'));m['version']='20261104-magicjug1';m['limits']='ASR text check only, humanReviewed=false. J is the letter name, not a standalone phoneme. Child learning outcomes not measured.';p.write_text(json.dumps(m,indent=2),encoding='utf-8')
