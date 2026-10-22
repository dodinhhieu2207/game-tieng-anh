"""Native alpha crop/resize/export of imagegen motion layers; no repainting."""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/unit3/lesson6/motion'
records=json.loads((OUT/'generation.json').read_text(encoding='utf-8'))
# Coordinates in 1000 x 667 Phaser scene; actors registered against approved art.
boxes=[(580,145,270,318),(602,135,275,355),(224,295,330,214),(432,174,324,360)]
for item in records:
    im=Image.open(item['source']).convert('RGBA')
    if item['type']=='actor':
        bbox=im.getchannel('A').point(lambda a:255 if a>12 else 0).getbbox()
        item['nativeCrop']=list(bbox);im=im.crop(bbox);im.thumbnail((1100,1100),Image.Resampling.LANCZOS)
    else:im.thumbnail((1536,1024),Image.Resampling.LANCZOS)
    p=OUT/f'{item["type"]}-0{item["scene"]}.webp';im.save(p,'WEBP',quality=94,method=6)
    item.update(file=p.name,size=list(im.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest())
scenes=[]
for i,(x,y,w,h) in enumerate(boxes):scenes.append({'id':i+1,'x':x+w/2,'y':y+h/2,'width':w,'height':h})
(OUT/'manifest.json').write_text(json.dumps({'scenes':scenes,'assets':records,'note':'Registered cutout layers. Audio-clocked GSAP transforms; no lip-sync or frame-identical video claim.'},indent=2),encoding='utf-8')
cards=''.join(f'<figure><img src="{r["file"]}" alt="Scene {r["scene"]} {r["type"]}"><figcaption>Scene {r["scene"]} · {r["type"]}</figcaption></figure>' for r in records)
(OUT/'catalog.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Story motion layers</title><style>body{font:18px system-ui;background:#fff9ec;color:#164573;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}figure{margin:0;padding:14px;border:1px solid #79bca7;border-radius:16px}img{width:100%;height:260px;object-fit:contain;background:#dde7df}figcaption{padding:12px}</style><h1>Story Studio · Motion layers</h1><p>Generated background plates and transparent actors derived from approved story art. Supplied video used as motion reference.</p><main>'+cards+'</main></html>',encoding='utf-8')
