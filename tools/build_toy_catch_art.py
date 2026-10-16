"""Export generated Toy Catch scene and separated rig; preserve alpha."""
from pathlib import Path
from PIL import Image
import json,hashlib,html
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7')
OUT=ROOT/'assets/toy-catch';OUT.mkdir(exist_ok=True)
items=[]
def save(name,source,region=None,maxsize=(700,700)):
    im=Image.open(SOURCE/source).convert('RGBA')
    if region:
        w,h=im.size;box=tuple(round(v*(w if i%2==0 else h)) for i,v in enumerate(region));im=im.crop(box)
        bounds=im.getchannel('A').point(lambda a:255 if a>40 else 0).getbbox();im=im.crop(bounds)
    else:box=None
    im.thumbnail(maxsize,Image.Resampling.LANCZOS);target=OUT/(name+'.webp');im.save(target,quality=93)
    items.append(dict(file=name+'.webp',source=source,crop=box,size=im.size,alphaExtrema=im.getchannel('A').getextrema(),sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
save('road','exec-774746db-2673-46f2-903b-5c6e7a0f6027.png',maxsize=(1500,1100))
rig='exec-a94b7603-c9d8-4c7f-91d6-82c310ccab37.png'
for name,region in [('buggy',(0,0,.50,.61)),('tire',(.58,0,1,.61)),('tree',(0,.62,.50,1)),('badge',(.55,.62,1,1))]:save(name,rig,region)
(OUT/'asset-manifest.json').write_text(json.dumps(items,indent=2),encoding='utf-8')
cards=''.join(f'<figure><img src="{html.escape(i["file"])}"><figcaption>{i["file"]}</figcaption></figure>' for i in items)
(OUT/'catalog.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Toy Catch assets</title><style>body{background:#eef8fb;color:#164573;font:20px system-ui;margin:30px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}figure{background:white;padding:20px;border-radius:15px;margin:0}img{width:100%;height:260px;object-fit:contain;background:repeating-conic-gradient(#edf2f0 0 25%,white 0 50%) 0/20px 20px}figcaption{margin-top:10px}</style><h1>Toy Catch</h1><p>Five dedicated scene/rig images. Countable toy identities use the existing approved six toy sprites. Six Higgs guidance clips are documented in audio/manifest.json.</p><main>'+cards+'</main></html>',encoding='utf-8')
print('Toy Catch: 5 generated scene/rig assets exported; vocabulary art unchanged.')
