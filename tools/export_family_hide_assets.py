import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
out = root / 'assets/family-hide-seek'
out.mkdir(exist_ok=True, parents=True)
items = json.loads((out / 'sources.json').read_text(encoding='utf-8'))
for item in items:
    im = Image.open(item['path']).convert('RGBA')
    size = (1024,1024) if item['name'].startswith('family-') or item['name']=='puppy' else None
    if size: im = im.resize(size, Image.Resampling.LANCZOS)
    else: im.thumbnail((1600,1000), Image.Resampling.LANCZOS)
    im.save(out / (item['name']+'.webp'), quality=90)
    print(item['name'], im.size, im.getextrema()[3])
