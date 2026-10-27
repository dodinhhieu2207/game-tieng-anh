"""Deterministic export and region-label extraction; originals retained."""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage

base = Path(__file__).resolve().parents[1] / 'assets/family-classroom'
base.mkdir(parents=True, exist_ok=True)
sources = json.loads((base/'sources.json').read_text(encoding='utf-8'))
summary = {}
for item in sources:
    im = Image.open(item['path']).convert('RGBA')
    name = item['name']
    if name.startswith('line-'):
        im = ImageOps.contain(im, (480,600), Image.Resampling.LANCZOS)
        page = Image.new('RGBA', (480,600), 'white')
        page.alpha_composite(im, ((480-im.width)//2, (600-im.height)//2))
        im = page
        gray = np.asarray(page.convert('L'))
        # Label large closed white interiors; any component touching page border is outside.
        walls = ndimage.binary_closing(gray < 180, iterations=1)
        regions, _ = ndimage.label(~walls)
        outside = set(np.concatenate((regions[0,:],regions[-1,:],regions[:,0],regions[:,-1])).tolist())
        out = np.zeros_like(regions, dtype=np.uint16)
        sizes = np.bincount(regions.ravel())
        ident = 0
        for k, size in enumerate(sizes):
            if k and k not in outside and size >= 35:
                ident += 1
                out[regions==k] = ident
        rgb = np.zeros((600,480,3), dtype=np.uint8)
        rgb[:,:,0] = out % 256
        rgb[:,:,1] = out // 256
        Image.fromarray(rgb).save(base/('regions-'+name[5:]+'.png'))
        summary[name] = {'regions':ident, 'fillablePixels':int((out>0).sum()),'outsideExcluded':True}
    else:
        im.thumbnail((1400,900), Image.Resampling.LANCZOS)
    im.save(base/(name+'.webp'), quality=94)
    print(name, im.size, im.getextrema()[3], summary.get(name,''))
(base/'region-audit.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
