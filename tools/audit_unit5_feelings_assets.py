"""Audit decoded motion and media metadata; no classroom/voice-quality claims."""
from pathlib import Path
from PIL import Image
import json, hashlib, wave

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/unit5/lesson1'
EVIDENCE=ROOT/'docs/game-plans/unit5-feelings-assets/evidence'
EVIDENCE.mkdir(parents=True,exist_ok=True)
manifest=json.loads((OUT/'manifest.json').read_text())
report={'actors':{},'effects':{},'audio':{},'limits':'Technical asset checks; human listening and classroom outcomes not measured.'}
for word,actor in manifest['actors'].items():
    p=OUT/actor['motion'];im=Image.open(p);frames=[];durations=[];feet=[]
    for i in range(im.n_frames):
        im.seek(i);rgba=im.convert('RGBA');frames.append(hashlib.sha256(rgba.tobytes()).hexdigest());durations.append(im.info['duration'])
        a=rgba.getchannel('A');box=a.point(lambda x:255 if x>128 else 0).getbbox();feet.append(box[3])
    assert im.n_frames==6 and len(set(frames))==6,(word,'duplicate or missing poses')
    assert max(feet)-min(feet)<=1,(word,'moving ground contact',feet)
    once=Image.open(OUT/actor['once']);assert 'loop' not in once.info
    report['actors'][word]={'frames':len(frames),'distinctFrames':len(set(frames)),'durationMs':sum(durations),'canvas':list(im.size),'footBottoms':feet,'looping':True,'oneShotAvailable':True}
    # Real registered poses on a contrasting surface for human visual review.
    sheet=Image.new('RGB',(1200,280),'#f7f0df')
    for i in range(6):
        f=Image.open(OUT/f'actors/{word}/frame-{i+1:02}.png');f.thumbnail((200,260));sheet.paste(f,(i*200,10),f)
    sheet.save(EVIDENCE/f'motion-{word}.jpg',quality=92)
for p in (OUT/'effects').glob('*.gif'):
    im=Image.open(p);assert im.n_frames>=2;assert 'loop' not in im.info
    report['effects'][p.stem]={'frames':im.n_frames,'oneShot':True}
audio=json.loads((OUT/'audio/manifest.json').read_text())
for key,clip in audio['clips'].items():
    p=ROOT/clip['src'];assert p.exists();assert hashlib.sha256(p.read_bytes()).hexdigest()==clip['sha256'];assert clip['transcriptMatch'] and clip['alignmentValid'];assert clip['humanReviewed'] is False
    for word in clip['words']:assert 0<=word['start']<word['end']<=clip['duration']+.05
report['audio']={'clips':len(audio['clips']),'transcriptsMatch':True,'hashBoundWordTimings':True,'humanReviewed':False}
assert len(audio['clips'])==28
for p in (OUT/'audio/sfx').glob('*.wav'):
    with wave.open(str(p)) as w:assert 0<w.getnframes()/w.getframerate()<2
assert all(len(v['positions'])==len(word) for word,v in manifest['buildWords'].items())
report['assetRecords']=len(manifest['assets']);report['letterGlyphs']=len(list((OUT/'glyphs').glob('*.svg')))
report['reactions']={}
for word,entry in manifest.get('reactions',{}).items():
    im=Image.open(OUT/entry['file']);hashes=[];feet=[]
    for n in range(im.n_frames):
        im.seek(n);frame=im.convert('RGBA');hashes.append(hashlib.sha256(frame.tobytes()).hexdigest());feet.append(frame.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox()[3])
    assert im.n_frames==6 and len(set(hashes))==6 and max(feet)-min(feet)<=1
    report['reactions'][word]={'frames':6,'uniqueFrames':6,'anchorStable':True,'canvas':list(im.size),'durationMs':entry['durationMs']}
for asset in manifest['assets']:
    p=OUT/asset['file'];assert p.exists() and hashlib.sha256(p.read_bytes()).hexdigest()==asset['sha256'],asset['file']
(EVIDENCE/'media-audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('PASS decoded motion, fixed ground anchors, 28 audio hashes/timings, exact letter counts')
