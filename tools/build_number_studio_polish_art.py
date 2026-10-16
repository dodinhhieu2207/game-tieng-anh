"""Crop/resize generated additions only. Alpha is preserved, never repainted."""
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7')
OUT=ROOT/'assets/number-studio/v2'
OUT.mkdir(exist_ok=True)
items=[]
def save(name,source,region=None,maximum=(750,600)):
    im=Image.open(SOURCE/source).convert('RGBA')
    if region:
        im=im.crop(region)
        # Threshold determines crop bounds only. The generated alpha is unchanged.
        bounds=im.getchannel('A').point(lambda a:255 if a>40 else 0).getbbox()
        if not bounds: raise ValueError(name)
        im=im.crop(bounds)
    im.thumbnail(maximum,Image.Resampling.LANCZOS)
    im.save(OUT/(name+'.webp'),quality=93)
    items.append(dict(file='v2/'+name+'.webp',source=source,crop=region,size=im.size,alphaExtrema=im.getchannel('A').getextrema()))
rig='exec-b1fdf740-35b5-477e-a16d-f9847c77bfa4.png'
for name,region in [('gift-open',(0,0,627,627)),('gift-lid',(627,0,1254,627)),('gift-bow',(0,627,627,1254)),('gift-wrapped',(627,627,1254,1254))]:
    save(name,rig,region)
save('gift-desk','exec-1a6e4203-acd3-4494-9b80-c60824411989.png',maximum=(1500,900))
for name,source in [('magnifier','exec-a83233c2-a570-4eed-b22d-ffa45d36236e.png'),('rosette','exec-8a2cf99a-3275-441e-b028-071b7793e473.png')]:
    with Image.open(SOURCE/source) as im:
        save(name,source,(0,0,*im.size),maximum=(400,450))
manifest=ROOT/'assets/number-studio/asset-manifest.json'
original=[i for i in json.loads(manifest.read_text(encoding='utf-8')) if not i['file'].startswith('v2/')]
manifest.write_text(json.dumps(original+items,indent=2),encoding='utf-8')
print('Added',len(items),'generated assets. Existing 34 preserved.')
