"""Finite Higgs-only Key Quest vocabulary; approved existing Belinda reference."""
import build_unit4_lesson1_audio as b
import json
b.OUT=b.ROOT/'assets/key-quest/audio'
b.TEXTS={'kangaroo':'Kangaroo.','key':'Key.','lion':'Lion.','lollipop':'Lollipop.','letter-k':'K.','letter-l':'L.','intro':'Listen. Choose a key. Open the treasure chest.'}
b.transcript_ok=lambda key,text: b.norm(text)==b.norm(b.TEXTS[key]) or (key=='letter-l' and b.norm(text)=='ell') or (key=='letter-k' and b.norm(text)=='kay')
if __name__=='__main__':
 b.main()
 p=b.OUT/'manifest.json';d=json.loads(p.read_text(encoding='utf-8'));d['version']='20261112-keyquest';d['limits']='Transcript QA only; no human phonetic certification. Letter names and words, no synthetic IPA approximations.';p.write_text(json.dumps(d,indent=2),encoding='utf-8');(b.OUT/'clips.js').write_text('window.KeyQuestClips='+json.dumps(d)+';\n',encoding='utf-8')
