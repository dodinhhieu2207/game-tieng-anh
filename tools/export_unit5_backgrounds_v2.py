"""Copy original imagegen artwork and encode web assets without repainting it."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/unit5/lesson1'
GENERATED = Path.home() / '.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7'
SCENES = {
    'house': ('7fb78a88-a716-4abe-8ee0-86dbb8dbb128', 'Discovery living room: arched garden window and sofa at left, mint shelf at right, cream wall, timber floor, woven rug, quiet center.'),
    'camera': ('321ece1f-a625-4832-82a2-a06ab8f2b845', 'Photo corner: pale mint seamless fabric backdrop, coral camera and wooden tripod at left, albums, plant and studio lamp at right, empty photo clips near outer top edges.'),
    'helping': ('b68021e4-2a39-4d0d-8d88-dcf580159b68', 'Kindness corner: peach canopy and mint towel cabinet at left, low rounded shelf, cup and plant at right, light sage woven rug, open standing area.'),
    'workshop': ('6640c46f-5dda-44fc-9ed6-a0a399132d3e', 'Photo and word workshop: clean pale cream wall, art tools and rolled paper at left, craft cabinet and albums at right, blank clipped paper at outer edges, cloth rug.'),
    'reporter': ('a5d4d2b8-997d-4f2e-9580-1435680791f2', 'Friendly recording nook: pale apricot painted sun behind standing area, headphones and camera at far left, coral microphone tripod and bookshelf at far right, mint rug. No theater or stage.'),
    'menu': ('6f0c69a1-0611-4fce-b129-996ac40478fe', 'Feelings Playhouse garden: sage and peach cottages at far edges, leaf branches in upper corners, daisy beds in lower corners, cream stone path, quiet pale garden and sky in central 75 percent.')
}
COMMON = ('Landscape 3:2 full-bleed preschool English mobile game background. Beautiful matte hand-painted gouache with fine paper grain, rounded furniture, sage mint, warm pale cream, peach and honey accents, restrained dark teal detailing. Soft daylight and coherent front-facing child-eye-level perspective. Keep central 70 percent spacious and light for independently rendered actors and controls; decoration at outer edges, floor in bottom 35-38 percent. No people, animals, text, letters, numbers, logos, watermark, interface, cards or buttons. Original production illustration, not a screenshot or mockup.')

def record(path, role, generation):
    im = Image.open(path)
    return {'file': path.relative_to(OUT).as_posix(), 'role': role,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'generation': 'exec-' + generation, 'width': im.width, 'height': im.height}

def main():
    raw = OUT / 'sources/backgrounds-v2'
    web = OUT / 'backgrounds/v2'
    raw.mkdir(parents=True, exist_ok=True)
    web.mkdir(parents=True, exist_ok=True)
    provenance = {'tool': 'built-in image_gen', 'date': '2026-11-26',
                  'promptFormat': 'Normalized production prompt briefs; generation IDs bind original tool outputs.',
                  'commonPromptBrief': COMMON, 'scenes': {}}
    manifest_path = OUT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    for name, (generation, brief) in SCENES.items():
        source = raw / (name + '.png')
        shutil.copy2(GENERATED / ('exec-' + generation + '.png'), source)
        im = Image.open(source).convert('RGB')
        assert im.size == (1536, 1024), (name, im.size)
        target = web / (name + '.webp')
        im.save(target, 'WEBP', quality=92, method=6)
        entries = [record(source, 'imagegen original background v2', generation),
                   record(target, 'runtime background v2, WebP encoding only', generation)]
        for item in entries:
            manifest['assets'] = [x for x in manifest['assets'] if x['file'] != item['file']]
            manifest['assets'].append(item)
        provenance['scenes'][name] = {'generation': 'exec-' + generation, 'promptBrief': brief,
                                      'source': source.relative_to(OUT).as_posix(),
                                      'runtime': target.relative_to(OUT).as_posix()}
    manifest['backgroundsV2'] = {name: 'backgrounds/v2/' + name + '.webp' for name in SCENES}
    (OUT / 'sources/backgrounds-v2.json').write_text(json.dumps(provenance, indent=2) + '\n', encoding='utf-8')
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print('Exported six original PNG sources and six 1536x1024 runtime WebP backgrounds; old art retained.')

if __name__ == '__main__':
    main()
