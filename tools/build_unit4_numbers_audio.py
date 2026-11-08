"""Approved local Higgs voice, finite Unit 4 Lesson 4 catalogue."""
import build_unit4_lesson1_audio as b
from pathlib import Path
import json,re
b.OUT=b.ROOT/'assets/unit4-numbers/audio'
b.TEXTS={**{w:w.capitalize()+'.' for w in ['one','two','three','four','five','six','seven','eight','nine','ten']},'firefly-intro':'Listen to the number. Catch that many fireflies.','lift-intro':'Listen. Choose the floor. Then meet the family.','belt-intro':'Collect the jugs. Stop when you have enough.','repair-intro':'Listen. Fix the number of lights.','nine-jugs':'Nine jugs.','ten-jugs':'Ten jugs.'}
def norm(s):
 for i,w in reversed(list(enumerate(['zero','one','two','three','four','five','six','seven','eight','nine','ten']))):s=re.sub(r'\b'+str(i)+r'\b',w,s)
 return re.sub('[^a-z]','',s.lower())
b.transcript_ok=lambda k,t:norm(t)==norm(b.TEXTS[k])
if __name__=='__main__':
 b.main();p=b.OUT/'manifest.json';d=json.loads(p.read_text(encoding='utf-8'));d['version']='20261108-numbers1';d['limits']='Automated transcript QA; approved Belinda Higgs reference reused; no pronunciation certification.';p.write_text(json.dumps(d,indent=2),encoding='utf-8');(b.OUT/'clips.js').write_text('window.Unit4NumbersClips='+json.dumps(d)+';\n',encoding='utf-8')
