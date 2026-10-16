"""Crop inspected generated atlases; preserve original alpha and image proportions."""
from pathlib import Path
from PIL import Image
import json, hashlib, html
ROOT=Path(__file__).resolve().parents[1]
SRC=Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7')
OUT=ROOT/'assets/toy-detective';OUT.mkdir(exist_ok=True)
items=[]
def save(name,source,region=None,size=(800,800)):
    im=Image.open(SRC/source).convert('RGBA');box=None
    if region:
        w,h=im.size;box=tuple(round(v*(w if i%2==0 else h)) for i,v in enumerate(region));im=im.crop(box)
        bounds=im.getchannel('A').point(lambda a:255 if a>35 else 0).getbbox()
        if not bounds:raise ValueError(name)
        im=im.crop(bounds)
    im.thumbnail(size,Image.Resampling.LANCZOS);p=OUT/(name+'.webp');im.save(p,quality=94)
    items.append(dict(file=p.name,source=source,crop=box,size=im.size,alpha=im.getchannel('A').getextrema(),sha256=hashlib.sha256(p.read_bytes()).hexdigest()))
save('room','exec-9f4ff448-8812-4e3d-bea3-9844fb5a9e06.png',size=(1536,1024))
storage='exec-c1b06d31-a7bc-423e-b5c7-7dd4b1b1f322.png'
alcove='exec-b967fe0e-9bdf-4a1b-b5d1-6c2163fac14a.png'
for n,s,r in [('cabinet',storage,(0,0,.5,.5)),('door','exec-a3a1a169-a471-42fd-930d-ace4b18cad8e.png',(0,0,1,1)),('basket',storage,(0,.52,.51,1)),('lid',storage,(.52,.55,1,1)),('alcove',alcove,(0,0,.63,.63)),('curtain',alcove,(.63,0,1,.63)),('tray',alcove,(0,.63,.67,1)),('badge',alcove,(.67,.63,1,1))]:save(n,s,r)
(OUT/'asset-manifest.json').write_text(json.dumps(items,indent=2),encoding='utf8')
cards=''.join(f'<figure><img src="{i["file"]}"><figcaption>{i["file"]}</figcaption></figure>' for i in items)
(OUT/'catalog.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Toy Detective assets</title><style>body{font:20px system-ui;background:#eef8fb;color:#164573;margin:28px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}figure{margin:0;background:white;border-radius:18px;padding:15px}img{width:100%;height:230px;object-fit:contain;background:repeating-conic-gradient(#e8eeeb 0 25%,white 0 50%) 0/20px 20px}</style><h1>Toy Detective room</h1><p>Nine dedicated layers. Countable toys remain separate approved Number Studio sprites.</p><main>'+cards+'</main></html>',encoding='utf8')
print('Exported',len(items),'room layers; alpha preserved.')
