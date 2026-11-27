"""Register imagegen-authored poses and encode Helping Hands expression GIFs.

No character painting or inferred/interpolated poses: crop native atlas cells,
register at the approved feet, and append them to the approved physical action.
"""
from pathlib import Path
from PIL import Image
import json, shutil, hashlib
import export_unit5_feelings_assets as base

OUT=base.OUT
manifest=json.loads((OUT/'manifest.json').read_text(encoding='utf-8'))
manifest['assets']=[a for a in manifest['assets'] if '/help-v2/' not in a['file'] and not a['file'].startswith('sources/helping-expressions-v1') and a['file']!='effects/helping-expressions-v1.js']
base.manifest=manifest
source=OUT/'sources/helping-expressions-v1.json'
spec=json.loads(source.read_text(encoding='utf-8'))
config={'version':1,'canvas':[400,520],'anchor':[200,508],'words':{}}
evidence=base.ROOT/'docs/game-plans/unit5-feelings/evidence/helping-expressions-v1'
evidence.mkdir(parents=True,exist_ok=True)
audit={}

for word in ['hungry','thirsty','hot','cold']:
    phases={}
    for kind in ['happy','retry']:
        item=next(i for i in spec['assets'] if i['word']==word and i['kind']==kind)
        dest=OUT/item['file'];dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists():shutil.copy2(item['source'],dest)
        item['sha256']=hashlib.sha256(dest.read_bytes()).hexdigest()
        item['referenceSha256']=hashlib.sha256((OUT/item['reference']).read_bytes()).hexdigest()
        base.record(dest,'imagegen authored Helping expression atlas',generation=item['generation'],prompt=item['prompt'])
        im=Image.open(dest).convert('RGBA');assert im.size==(1536,1024)
        assert im.getchannel('A').histogram()[0]/(im.width*im.height)>.55, 'Atlas background must be transparent'
        cells=[]
        for n in range(6):
            tile=im.crop((n%3*512,n//3*512,(n%3+1)*512,(n//3+1)*512))
            box=tile.getchannel('A').point(lambda a:255 if a>220 else 0).getbbox();assert box
            cells.append(tile.crop(box))
        scale=min(476/max(c.height for c in cells),366/max(c.width for c in cells))
        frames=[]
        for n,cell in enumerate(cells):
            band=cell.getchannel('A').crop((0,round(cell.height*.88),cell.width,cell.height))
            box=band.point(lambda a:255 if a>150 else 0).getbbox();assert box
            center=(box[0]+box[2])/2
            sprite=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.LANCZOS)
            frame=Image.new('RGBA',(400,520));frame.alpha_composite(sprite,(round(200-center*scale),508-sprite.height))
            frames.append(frame)
            base.save_image(frame,f'actors/{word}/help-v2/{kind}-{n+1:02}.png','authored expression frame',anchor=[200,508])
        phases[kind]=frames
    # Keep all six approved physical-action frames, then the actual authored
    # relieved/smiling poses. Cold's fifth pose is the strongest happy expression.
    order=[0,1,2,3,5,4] if word=='cold' else list(range(6))
    positive=[Image.open(OUT/f'actors/{word}/reaction-{n:02}.png').convert('RGBA') for n in range(1,7)]+[phases['happy'][n] for n in order]
    idle=Image.open(OUT/f'actors/{word}/idle.webp').convert('RGBA')
    retry=[idle]+phases['retry']+[idle]
    pd=[300,260,320,360,260,380,120,140,150,140,180,420]
    rd=[80,100,160,180,180,140,100,160]
    entry={}
    for kind,frames,durations,final in [('positive',positive,pd,positive[-1]),('retry',retry,rd,idle)]:
        stem=f'actors/{word}/help-v2/{kind}'
        base.encode_gif(frames,OUT/(stem+'.gif'),durations,False)
        base.save_image(final,stem+'-final.webp','settled expression',anchor=[200,508])
        entry[kind]={'file':stem+'.gif','final':stem+'-final.webp' if kind=='positive' else f'actors/{word}/idle.webp','durationMs':sum(durations),'frames':len(frames)}
        gif=Image.open(OUT/(stem+'.gif'));assert 'loop' not in gif.info
        hashes=[];feet=[];actual=[]
        for n in range(gif.n_frames):
            gif.seek(n);rgba=gif.convert('RGBA');hashes.append(hashlib.sha256(rgba.tobytes()).hexdigest());actual.append(gif.info['duration'])
            feet.append(rgba.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox()[3])
        assert sum(actual)==sum(durations) and len(set(hashes))>=6
        assert max(feet)-min(feet)<=1,(word,kind,feet)
        audit[word+'-'+kind]={'frames':gif.n_frames,'distinctFrames':len(set(hashes)),'durationMs':sum(actual),'footBottoms':feet,'oneShot':True}
        sheet=Image.new('RGB',(len(frames)*160,218),'#f8f0db')
        for n,f in enumerate(frames):
            tile=f.resize((160,208),Image.Resampling.LANCZOS);sheet.paste(tile,(160*n,5),tile)
        sheet.save(evidence/f'{word}-{kind}.jpg',quality=94)
    # A still conveying a puzzled look rather than a moving head under reduced motion.
    still=f'actors/{word}/help-v2/retry-still.webp'
    base.save_image(phases['retry'][2],still,'reduced-motion puzzled still',anchor=[200,508])
    entry['retry']['still']=still
    entry['positive']['sourcePoseOrder']=order
    config['words'][word]=entry

source.write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
base.record(source,'source prompts and input hashes for authored Helping expressions')
runtime=OUT/'effects/helping-expressions-v1.js'
runtime.write_bytes(('window.Unit5HelpingMotion='+json.dumps(config,separators=(',',':'))+';\n').encode('utf-8'))
base.record(runtime,'Helping expression media catalogue')
manifest['helpingExpressions']=config
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
(evidence/'asset-audit.json').write_text(json.dumps(audit,indent=2)+'\n',encoding='utf-8')
print('PASS four authored positive-action GIFs, four retry GIFs, alpha, finite timing and fixed feet')
