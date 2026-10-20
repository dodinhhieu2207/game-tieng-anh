"""Export original generated art and native recognition/card SVGs; no gameplay."""
from pathlib import Path
from PIL import Image
import json, hashlib, base64
ROOT=Path(__file__).resolve().parents[1]
SRC=Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7')
OUT=ROOT/'assets/unit3/lesson5';OUT.mkdir(parents=True,exist_ok=True)
for d in ['words','letters','cards']:(OUT/d).mkdir(exist_ok=True)
manifest=[]
def entry(p,**kw):manifest.append(dict(file=p.relative_to(OUT).as_posix(),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),**kw))
sources={'background':'exec-35a7efb5-a1f1-4a6d-8be6-1a6587e4cc66.png','lesson-card':'exec-84110220-287e-4fba-9a1d-64d9f66d4a20.png','hat':'exec-4d00af14-63c9-4196-840b-8867201f39a2.png','horse':'exec-b887e486-674d-43b3-8406-6f8b50e719fc.png','ill':'exec-cc139073-fef4-46bc-b074-b072c98a7f96.png','insect':'exec-f69d89de-5e91-44cb-96ea-710da05f77c8.png'}
for name,source in sources.items():
    im=Image.open(SRC/source).convert('RGBA');box=None
    if name not in ['background','lesson-card']:
        bounds=im.getchannel('A').point(lambda a:255 if a>35 else 0).getbbox()
        if bounds:
            box=(max(0,bounds[0]-12),max(0,bounds[1]-12),min(im.width,bounds[2]+12),min(im.height,bounds[3]+12));im=im.crop(box)
    im.thumbnail((1600,1100) if name=='background' else (1400,700) if name=='lesson-card' else (760,760),Image.Resampling.LANCZOS)
    p=OUT/((name if name in ['background','lesson-card'] else 'words/'+name)+'.webp');im.save(p,quality=94);entry(p,source=source,crop=box,size=im.size,alpha=im.getchannel('A').getextrema(),kind='generated raster')
paths={'H':'M65 58 V222 M175 58 V222 M65 140 H175','h':'M68 48 V222 M68 157 C68 110 165 110 165 160 V222','I':'M74 60 H166 M120 60 V222 M74 222 H166','i':'M120 139 V222'}
ink='#174b88'
def glyph(letter,outline=False):
    p=f'<path d="{paths[letter]}" fill="none" stroke="{ink}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>'
    if outline:p+=f'<path d="{paths[letter]}" fill="none" stroke="#fffdf4" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>'
    if letter=='i':p+=f'<circle cx="120" cy="88" r="17" fill="{chr(35)+"fffdf4" if outline else ink}" stroke="{ink}" stroke-width="{8 if outline else 0}"/>'
    return p
for letter in paths:
    name={'H':'capital-h','h':'lowercase-h','I':'capital-i','i':'lowercase-i'}[letter]
    for outline in [False,True]:
        p=OUT/'letters'/(name+('-outline' if outline else '')+'.svg');p.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280" role="img" aria-label="{letter}">{glyph(letter,outline)}</svg>',encoding='utf8');entry(p,kind='native recognition outline' if outline else 'native recognition glyph',letter=letter,strokeOrderValidated=False)
for pair in ['Hh','Ii']:
    p=OUT/'letters'/(pair.lower()+'-badge.svg');p.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 280" role="img" aria-label="{pair}"><rect x="8" y="8" width="464" height="264" rx="55" fill="#fffbea" stroke="#c6d9eb" stroke-width="8"/>{glyph(pair[0])}<g transform="translate(240 0)">{glyph(pair[1])}</g></svg>',encoding='utf8');entry(p,kind='native letter pair',letter=pair)
font=base64.b64encode((ROOT/'assets/fonts/Outfit-Bold.ttf').read_bytes()).decode()
words=[]
for word in ['hat','horse','ill','insect']:
    image=base64.b64encode((OUT/'words'/(word+'.webp')).read_bytes()).decode();p=OUT/'cards'/(word+'.svg')
    p.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 410" role="img" aria-label="{word}"><style>@font-face{{font-family:LessonOutfit;src:url(data:font/ttf;base64,{font})}}text{{font-family:LessonOutfit,sans-serif;font-size:58px;font-weight:700}}</style><rect x="7" y="7" width="406" height="396" rx="30" fill="#fffbed" stroke="#c4d9e8" stroke-width="9"/><image href="data:image/webp;base64,{image}" x="35" y="25" width="350" height="270" preserveAspectRatio="xMidYMid meet"/><text x="210" y="365" text-anchor="middle" fill="{ink}"><tspan fill="#d3445b">{word[0]}</tspan>{word[1:]}</text></svg>',encoding='utf8');entry(p,kind='native word card with embedded original image and bundled Outfit',word=word)
    words.append(dict(word=word,letter='Hh' if word.startswith('h') else 'Ii',image='words/'+word+'.webp',card='cards/'+word+'.svg'))
(OUT/'vocabulary.json').write_text(json.dumps(dict(unit=3,lesson=5,title='Letters and Sounds',phase='assets-ready',words=words,playableActivities=0),indent=2),encoding='utf8')
(OUT/'asset-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
cards=''.join(f'<figure><img src="{x["file"]}" alt="{x.get("word",x.get("letter",x["file"]))}"><figcaption>{x["file"]}</figcaption></figure>' for x in manifest)
cards=cards.replace('src="words/insect.webp"','src="words/insect.webp?v=20261020-cute"').replace('src="cards/insect.svg"','src="cards/insect.svg?v=20261020-cute"')
(OUT/'catalog.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unit 3 Lesson 5 — Hh and Ii art</title><style>@font-face{font-family:Outfit;src:url(../../fonts/Outfit-Bold.ttf)}body{font:20px Outfit,system-ui;background:#edf8fb;color:#164573;margin:25px}h1{font-size:34px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}figure{margin:0;background:white;padding:15px;border-radius:20px}img{width:100%;height:230px;object-fit:contain;background:repeating-conic-gradient(#e9efee 0 25%,#fff 0 50%) 0/20px 20px}figcaption{font-size:16px;margin-top:10px;overflow-wrap:anywhere}</style><h1>Letters and Sounds · Hh / Ii</h1><p>hat · horse · ill · insect</p><p>Asset preview only. Recognition outlines are not stroke-order instructions.</p><main>'+cards+'</main></html>',encoding='utf8')
print('Exported',len(manifest),'visual assets; six generated rasters, fourteen native vectors/cards.')
