from pathlib import Path
from PIL import Image
import json, hashlib

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/unit3/lesson6/sample'
data=json.loads((OUT/'generation.json').read_text(encoding='utf-8'))
for item in data:
    im=Image.open(item['source']).convert('RGBA')
    if item['name'] not in ('scene-01','story-frame'):
        im=im.crop(im.getchannel('A').point(lambda a:255 if a>12 else 0).getbbox())
    im.thumbnail((1536,1024) if item['name']=='scene-01' else (1000,800),Image.Resampling.LANCZOS)
    target=OUT/(item['name']+'.webp')
    im.save(target,'WEBP',quality=92,method=6)
    item['size']=list(im.size)
    item['sha256']=hashlib.sha256(target.read_bytes()).hexdigest()
    item['file']=target.name
(OUT/'manifest.json').write_text(json.dumps({'source':'Family and Friends Starter Class Book, second edition; printed page 27 / PDF page 28. First scene only.','audio':'Existing lesson practice clips; not original track 46.','assets':data},ensure_ascii=False,indent=2),encoding='utf-8')
cards=''.join(f'<figure><img src="{i["file"]}" alt="{i["name"]}"><figcaption>{i["name"]}</figcaption></figure>' for i in data)
(OUT/'catalog.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Lesson 6 artwork sample</title><style>body{font:18px system-ui;background:#fff9ec;color:#164573;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}figure{margin:0;padding:16px;border:1px solid #79bca7;border-radius:16px}img{width:100%;height:240px;object-fit:contain;background:#dce8e2}figcaption{margin-top:12px}</style><h1>Lesson 6 · First-scene artwork</h1><p>Source-adapted scene and dedicated interface artwork. Preview only.</p><main>'+cards+'</main></html>',encoding='utf-8')
