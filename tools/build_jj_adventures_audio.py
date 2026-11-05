"""Finite Higgs guidance for Jj adventures; approved word/sound clips reused."""
import json
import build_unit4_lesson1_audio as build
build.OUT=build.ROOT/'assets/jj-adventures/audio'
build.TEXTS={'jump-intro':'Listen. Choose a leaf. Let us jump!','cafe-intro':'Listen to the order. Serve it, then say the word.','rub-intro':'Wipe the mist. Find the matching picture or letter.','order-jug':'A jug, please.','order-juice':'Juice, please.','speak':'Your turn. Say the word.','finished':'Wonderful! You did it!'}
if __name__=='__main__':
 build.transcript_ok=lambda key,heard: build.norm(heard)==build.norm(build.TEXTS[key])
 build.main()
 (build.OUT/'clips.js').unlink(missing_ok=True)
 p=build.OUT/'manifest.json';m=json.loads(p.read_text());m['version']='20261105-jjadventures1';m['limits']='Finite script transcript QA only; not pronunciation certification.';p.write_text(json.dumps(m,indent=2),encoding='utf-8')
