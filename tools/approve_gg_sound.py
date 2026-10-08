"""Register take 1 after the user's explicit listening approval: 'mau 1 nhe'."""
import json,hashlib
import soundfile as sf
import build_unit3_lesson2_audio as base
out=base.ROOT/'assets/unit3/lesson3/audio';review=out/'review'
target=out/'sound-g.mp3'
approved_sha='5ab7c0b5e611820bf41a4677276c041eb4aefd5cccfc1ad44da9d4e1973c52dd'
if hashlib.sha256((review/'hard-g-take-1.mp3').read_bytes()).hexdigest()!=approved_sha:
    raise RuntimeError('The audition file has changed since the user listened. Obtain a new listening review before approval.')
target.write_bytes((review/'hard-g-take-1.mp3').read_bytes())
wav=base.CACHE/'gg-approved-sound.wav';base.run(base.FFMPEG,'-v','error','-y','-i',target,'-ar','24000','-ac','1',wav)
cuefile=base.CACHE/'gg-approved-mouth.json';base.run(base.rhubarb(),'-r','phonetic','-f','json','-o',cuefile,wav)
a,sr=sf.read(wav);cues=json.loads(cuefile.read_text())['mouthCues']
doc=json.loads((out/'manifest.json').read_text())
doc['phoneme']={'status':'human-reviewed','approvedTake':'hard-g-take-1','approvedOn':'2026-10-08','approval':'User listened to the audition files and explicitly selected take 1 in this task.'}
doc['clips']['sound-g']={'src':target.relative_to(base.ROOT).as_posix(),'text':'G sound.','kind':'phoneme','humanReviewed':True,'intendedPhoneme':'/g/','duration':round(len(a)/sr,3),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'reviewTake':'hard-g-take-1','cues':[{'id':base.SHAPES[c['value']],'ms':round(c['start']*1000)} for c in cues]}
(out/'manifest.json').write_text(json.dumps(doc,indent=2),encoding='utf8');(out/'clips.js').write_text('window.Unit3Lesson3Clips='+json.dumps(doc)+';\n',encoding='utf8')
rd=json.loads((review/'manifest.json').read_text());rd['clips']['hard-g-take-1']['status']='human-reviewed-selected-by-user';rd['clips']['hard-g-take-1']['approvedOn']='2026-10-08';(review/'manifest.json').write_text(json.dumps(rd,indent=2),encoding='utf8')
print('Registered user-approved take 1; '+str(len(doc['clips']))+' production clips')
