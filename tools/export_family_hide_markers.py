import json
from pathlib import Path
from PIL import Image
base = Path(__file__).resolve().parents[1] / 'assets/family-hide-seek'
data = json.loads((base / 'markers-source.json').read_text(encoding='utf-8'))
im = Image.open(data['source']).convert('RGBA')
for i, name in enumerate(data['outputs']):
    cell = im.crop((i*im.width//2, 0, (i+1)*im.width//2, im.height))
    cell = cell.crop(cell.getchannel('A').getbbox())
    cell.thumbnail((184,184), Image.Resampling.LANCZOS)
    result = Image.new('RGBA', (192,192))
    result.alpha_composite(cell, ((192-cell.width)//2, (192-cell.height)//2))
    result.save(base / name, quality=95)
    print(name, result.getextrema()[3])
