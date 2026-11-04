"""Finite Higgs V3 guidance for three new Jj fine-motor activities."""
import json
import build_unit4_lesson1_audio as build
build.OUT=build.ROOT/'assets/jj-fine-motor/audio'
build.TEXTS={'trace-intro':'Trace the letters. Follow the drop.','lab-intro':'Build a path. Guide the juice to the jug.','artist-intro':'Choose a colour. Paint the jug and the juice.','trail-complete':'Well done! You followed every letter!','artist-complete':'Your picture is ready! Beautiful work!'}
def checked(key,transcript):
 return build.norm(transcript).replace("colour","color")==build.norm(build.TEXTS[key]).replace("colour","color")
if __name__=='__main__':
 build.transcript_ok=checked
 build.main()
 (build.OUT/'clips.js').unlink(missing_ok=True)
 p=build.OUT/'manifest.json';m=json.loads(p.read_text());m['version']='20261104-jjfine1';m['limits']='Instruction text QA only; no phonetic, motor or mastery assessment. Reuse user-selected /dʒ/ take 1 separately.';p.write_text(json.dumps(m,indent=2),encoding='utf-8')
