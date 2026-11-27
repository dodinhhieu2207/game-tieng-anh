"""Encode authored reward poses and mix finite cues from the existing licensed Foley."""
from pathlib import Path
from PIL import Image
import array
import hashlib
import json
import math
import shutil
import wave

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/unit5/lesson1'
CACHE=Path.home()/'.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def pcm(path):
    with wave.open(str(path)) as f:
        assert (f.getnchannels(),f.getsampwidth(),f.getframerate())==(1,2,44100)
        return array.array('h',f.readframes(f.getnframes()))
def cue(name,sources,duration):
    data=[0.] * round(duration*44100)
    evidence=[]
    for file,gain,offset in sources:
        p=OUT/'audio/sfx'/file;v=pcm(p);start=round(offset*44100)
        evidence.append({'file':'audio/sfx/'+file,'sha256':sha(p),'gain':gain,'offsetSeconds':offset})
        for i,x in enumerate(v):
            if start+i<len(data): data[start+i]+=x*gain
    peak=max(abs(v) for v in data) or 1
    scale=min(1,18000/peak)
    result=array.array('h')
    for i,v in enumerate(data):
        envelope=min(1,i/(44100*.008),(len(data)-1-i)/(44100*.06))
        result.append(round(v*scale*max(0,envelope)))
    p=OUT/'audio/sfx'/(name+'.wav')
    with wave.open(str(p),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(44100);f.writeframes(result.tobytes())
    return p,{'duration':duration,'sources':evidence,'processing':'Existing Kenney CC0 Foley mixed only, 8ms in/60ms out fade, peak <=18000 PCM16. No synthesized tones.'}

def main():
    sourcefile=OUT/'sources/feedback-v1.json';meta=json.loads(sourcefile.read_text(encoding='utf-8'))
    raw=OUT/'sources/feedback-v1.png';shutil.copy2(CACHE/(meta['generation']+'.png'),raw)
    original=OUT/'sources/feedback-v1-original.png';shutil.copy2(CACHE/(meta['originalGeneration']+'.png'),original)
    source=Image.open(raw).convert('RGBA');assert source.size==(1536,1024)
    folder=OUT/'effects/feedback-v1';folder.mkdir(parents=True,exist_ok=True)
    added=[]
    def record(p,role): added.append({'file':p.relative_to(OUT).as_posix(),'role':role,'sha256':sha(p)})
    record(raw,'imagegen original reward pose sheet');record(original,'imagegen initial source retained')
    frames=[];colors=[]
    for i in range(6):
        x=(i%3)*512;y=(i//3)*512
        frame=source.crop((x,y,x+512,y+512)).resize((256,256),Image.Resampling.LANCZOS)
        p=folder/f'frame-{i+1:02}.png';frame.save(p);record(p,'authored reward pose, native grid crop/encoding')
        frames.append(frame)
        indexed=frame.convert('RGB').quantize(colors=255)
        indexed.paste(255,mask=frame.getchannel('A').point(lambda a:255 if a<128 else 0))
        indexed.info['transparency']=255;colors.append(indexed)
    target=folder/'success.gif';colors[0].save(target,save_all=True,append_images=colors[1:],duration=meta['frames']['durationsMs'],transparency=255,disposal=2,optimize=False)
    check=Image.open(target);assert check.n_frames==6 and 'loop' not in check.info
    record(target,'single-play six-pose glint GIF, binary-alpha encoding required by GIF')
    still=folder/'success.webp';frames[-1].save(still,'WEBP',quality=95,method=6);record(still,'settled/static reduced-motion medal')
    sounds={}
    for name,sources,duration in [
        ('answer-confirm',[('photo-clip.wav',.5,0),('correct.wav',.65,.055),('star.wav',.12,.07)],.43),
        ('photo-collected',[('star.wav',.45,0),('correct.wav',.18,.025)],.36)]:
        p,entry=cue(name,sources,duration);record(p,'finite soft success cue, mixed existing CC0 Foley');sounds[name]=entry
    bounds={}
    for word in ['happy','sad','hungry','thirsty','hot','cold']:
        boxes=[]
        for p in [OUT/f'actors/{word}/idle.webp',*sorted((OUT/f'actors/{word}').glob('frame-*.png'))]:
            im=Image.open(p).convert('RGBA');box=im.getchannel('A').point(lambda x:255 if x>128 else 0).getbbox()
            if box: boxes.append(box)
        bounds[word]=[min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes)]
    config={'medal':'effects/feedback-v1/success.gif','still':'effects/feedback-v1/success.webp','durationMs':sum(meta['frames']['durationsMs']),'canvas':[400,520],'bounds':bounds,'cues':{n:s['duration'] for n,s in sounds.items()}}
    configfile=folder/'config.js';configfile.write_bytes(('window.Unit5Feedback='+json.dumps(config,separators=(',',':'))+';\n').encode('utf-8'));record(configfile,'source-bound frame anchors and cue durations')
    meta.update(source=raw.relative_to(OUT).as_posix(),sourceSha256=sha(raw),runtime=config,sounds=sounds)
    sourcefile.write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
    mp=OUT/'manifest.json';manifest=json.loads(mp.read_text(encoding='utf-8'));files={a['file'] for a in added};manifest['assets']=[a for a in manifest['assets'] if a['file'] not in files]+added;manifest['feedbackV1']=config;mp.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    print('Exported six-pose single-play medal, static fallback, two finite CC0 mixes and exact actor anchors.')
if __name__=='__main__': main()
