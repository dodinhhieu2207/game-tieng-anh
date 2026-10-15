from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7')
dest = root / 'assets/gg-maze-relay'
dest.mkdir(parents=True, exist_ok=True)
background = Image.open(source / 'exec-dc245104-3eaf-4853-b5f8-a94a627003ed.png').convert('RGB')
background.thumbnail((1440, 960), Image.Resampling.LANCZOS)
background.save(dest / 'garden.webp', quality=87)
gate = Image.open(source / 'exec-ea62b230-2217-4a8a-b4cd-28a257abb5f7.png').convert('RGBA')
gate.thumbnail((400, 500), Image.Resampling.LANCZOS)
gate.save(dest / 'gate.webp', quality=90)
assert gate.getextrema()[3][0] == 0, 'Gate needs transparent exterior and opening'
assert gate.getpixel((gate.width // 2, gate.height // 2))[3] == 0, 'Gate opening must stay transparent'
print('Saved garden and transparent arch WebP assets.')
