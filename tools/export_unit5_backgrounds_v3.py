"""Encode imagegen-restyled scenes, retaining exact edit/style reference hashes."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import shutil
from export_unit5_backgrounds_v2 import ROOT, OUT, GENERATED, record

SCENES = {
    'menu': ('7a1d511f-9e2a-4f0d-8a8c-15c19bab77bc', 'Bright azure sky, puffy white clouds, rich green garden, warm playhouse exteriors at edges, open center; match older Unit3/4 selector art.'),
    'house': ('af110cf6-086d-4d24-881c-68b5080ac389', 'Clean warm peach living room, honey wood, turquoise sofa, colorful shelf props, cream/blue rug; match Family Dialogue rendering.'),
    'camera': ('e5b22a74-c036-483c-b3c9-fbfda0dae4a5', 'Light sky-blue seamless photo backdrop, coral camera, golden tripod, turquoise studio light, warm wood cabinet at edges.'),
    'helping': ('9866da61-3444-4f8c-a77b-f7459f1cb75a', 'Bright kindness room, coral canopy, turquoise cabinet, colorful folded towels, honey wood, green plant; center clear of answer props.'),
    'workshop': ('527cc0f3-e927-4acf-aeac-77387dbdaa89', 'Clean light blue art room, golden shelves, turquoise cabinet, colorful paper and tools at edges, no baked labels or receivers.'),
    'reporter': ('0517699e-16b3-47dd-8609-e3d0be877f8e', 'Light blue recording nook with pale golden sun disk, coral microphone and headphones at outer edges, honey wood and turquoise rug border; no theater.')
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    raw, web = OUT / 'sources/backgrounds-v3', OUT / 'backgrounds/v3'
    raw.mkdir(parents=True, exist_ok=True)
    web.mkdir(parents=True, exist_ok=True)
    manifest_path = OUT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    provenance = {'tool': 'built-in image_gen, referenced-image edit', 'date': '2026-11-26',
      'promptFormat': 'Normalized prompt briefs, with original output generation IDs and exact input hashes.',
      'commonPromptBrief': 'Restyle FIRST image (Unit5 v2 edit target) using other reference images only for older-unit rendering style. Crisp bright polished 2.5D educational game art, modeled rounded shapes, azure/turquoise/green/coral/yellow and honey wood, clear sunlight. Remove faded gouache/paper grain/sage wash. Preserve large quiet center and edge-only furnishings. No people, words, letters, numbers, UI or watermark. One 1536x1024 scene.',
      'scenes': {}}
    for name, (generation, prompt) in SCENES.items():
        source = raw / (name + '.png')
        shutil.copy2(GENERATED / ('exec-' + generation + '.png'), source)
        im = Image.open(source).convert('RGB')
        assert im.size == (1536, 1024), (name, im.size)
        target = web / (name + '.webp')
        im.save(target, 'WEBP', quality=92, method=6)
        for item in [record(source, 'imagegen reference-restyled background v3', generation),
                     record(target, 'runtime reference-restyled background v3, WebP encoding only', generation)]:
            manifest['assets'] = [x for x in manifest['assets'] if x['file'] != item['file']]
            manifest['assets'].append(item)
        refs = ['assets/unit4/navigation-v2/lesson1-background.webp', 'assets/shared-ui/unit3-select-bg.png'] if name == 'menu' else ['assets/family-dialogue/room.png']
        edit = OUT / 'sources/backgrounds-v2' / (name + '.png')
        provenance['scenes'][name] = {'generation': 'exec-' + generation, 'promptBrief': prompt,
          'editTarget': {'file': edit.relative_to(ROOT).as_posix(), 'sha256': digest(edit)},
          'styleReferences': [{'file': p, 'sha256': digest(ROOT / p)} for p in refs],
          'source': source.relative_to(OUT).as_posix(), 'runtime': target.relative_to(OUT).as_posix()}
    manifest['backgroundsV3'] = {name: 'backgrounds/v3/' + name + '.webp' for name in SCENES}
    (OUT / 'sources/backgrounds-v3.json').write_text(json.dumps(provenance, indent=2) + '\n', encoding='utf-8')
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print('Exported six reference-restyled scenes; exact source/reference hashes retained; old versions untouched.')

if __name__ == '__main__':
    main()
