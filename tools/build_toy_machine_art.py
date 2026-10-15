from pathlib import Path
from PIL import Image
import sys

root = Path(__file__).resolve().parents[1]
source = Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7')
dest = root / 'assets/toy-machine'
dest.mkdir(parents=True, exist_ok=True)
files = {'cabinet': 'exec-d40008f4-32c1-4a1f-9d17-15c9ab23ec17.png', 'hatch': 'exec-36be0d25-2bd1-4532-abc9-671dbb7b4f60.png'}
if len(sys.argv) > 1:
    files['lever'] = sys.argv[1]
for name, file in files.items():
    im = Image.open(source / file).convert('RGBA')
    if name == 'hatch':
        im = im.crop(im.getchannel('A').getbbox())
    im.thumbnail((900, 900) if name == 'cabinet' else (700, 350) if name == 'hatch' else (200, 600), Image.Resampling.LANCZOS)
    im.save(dest / (name + '.webp'), quality=90)
    assert im.getextrema()[3][0] == 0
    print(name, im.size)
