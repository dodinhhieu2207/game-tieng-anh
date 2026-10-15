from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7/exec-4df24e53-cf1d-436e-a38b-cc6dc5247f4e.png')
atlas = Image.open(source).convert('RGBA')
regions = {'mission-frame': (0, 0, 795, 555), 'answer-yes': (795, 150, 1536, 515), 'answer-no': (0, 560, 900, 950), 'collection-pocket': (930, 550, 1380, 950)}
for name, region in regions.items():
    sprite = atlas.crop(region)
    sprite = sprite.crop(sprite.getchannel('A').getbbox())
    sprite.thumbnail((800, 600), Image.Resampling.LANCZOS)
    sprite.save(root / 'assets/toy-machine' / (name + '.webp'), quality=92)
    print(name, sprite.size)
