"""Publish imagegen covers and geometry-preserving blue/white SVG UI variants."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/unit5/lesson1'
GENERATED = Path.home() / '.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7'
COLORS = {
    '#174e62': '#194e76', '#195866': '#194e76',
    '#fff6da': '#ffffff', '#fff9e9': '#ffffff', '#fff8df': '#ffffff',
    '#69a797': '#36a8df', '#65a596': '#36a8df',
    '#8bb5a6': '#80c7e8', '#93b3a5': '#80c7e8', '#9dbdb0': '#80c7e8',
    '#90b6a4': '#80c7e8', '#88b3a2': '#80c7e8', '#75a999': '#79c8eb',
    '#e8f0df': '#dff4ff', '#e8eee3': '#edf8ff', '#8bb4a5': '#8ccdea',
    '#a2bfb1': '#5a9fbe', '#a9b9ad': '#c7dfec', '#9caeaa': '#7297b0',
    '#e6f4db': '#dcf5dc', '#f5f2e9': '#edf5f9', '#e2f3ea': '#fff0ae',
    '#e6e8dc': '#dbe9f2', '#cce8dc': '#dff4ff', '#b7d0c1': '#b4deef'
}
REFS = {
    'world': ['assets/unit4/navigation-v2/unit-card.webp',
              'assets/unit5/lesson1/actors/happy/idle.webp',
              'assets/unit5/lesson1/actors/hungry/idle.webp',
              'assets/unit5/lesson1/actors/cold/idle.webp'],
    'present': ['happy', 'hungry'], 'camera': ['sad'], 'helping': ['hungry'],
    'workshop': ['thirsty', 'happy'], 'reporter': ['thirsty', 'happy']
}

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    manifest_path = OUT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    provenance_path = OUT / 'sources/covers-v2.json'
    provenance = json.loads(provenance_path.read_text(encoding='utf-8'))
    added = []
    def record(path, role, generation=None):
        item = {'file': path.relative_to(OUT).as_posix(), 'role': role, 'sha256': sha(path)}
        if generation:
            item['generation'] = generation
            im = Image.open(path)
            item.update(width=im.width, height=im.height)
        added.append(item)
    for name, spec in provenance['covers'].items():
        source = OUT / f'sources/covers-v2/{name}.png'
        source.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(GENERATED / (spec['generation'] + '.png'), source)
        im = Image.open(source).convert('RGBA')
        ratio = 3 if name == 'world' else 2
        assert abs(im.width / im.height - ratio) < .015, (name, im.size)
        # Encode only. Preserve the generated aspect ratio, text, edge art and alpha.
        target = OUT / f'covers/v2/{name}.webp'
        target.parent.mkdir(parents=True, exist_ok=True)
        im.save(target, 'WEBP', quality=94, method=6)
        refs = REFS[name] if name == 'world' else [
            'assets/unit5/lesson1/sources/covers-v2/world.png',
            *[f'assets/unit5/lesson1/actors/{w}/idle.webp' for w in REFS[name]]]
        spec.update(source=source.relative_to(OUT).as_posix(), runtime=target.relative_to(OUT).as_posix(),
                    size=list(im.size), references=[{'file': p, 'sha256': sha(ROOT / p)} for p in refs])
        record(source, 'imagegen original reference-guided cover v2', spec['generation'])
        record(target, 'runtime cover v2, encoding only', spec['generation'])
    vectors = []
    for folder in ['ui', 'letters', 'words']:
        # Select original kit only, never recursively read a previously generated variant.
        sources = list((OUT / folder).glob('*.svg'))
        if folder == 'ui':
            sources += list((OUT / folder / 'icons').glob('*.svg'))
        for source in sources:
            relative = source.relative_to(OUT / folder)
            target = OUT / folder / 'v2' / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            original = source.read_text(encoding='utf-8')
            revised = re.sub(r'#[0-9a-fA-F]{6}', lambda m: COLORS.get(m[0].lower(), m[0]), original)
            # Paint-only transform: every glyph path, viewBox and size stays exact.
            target.write_text(revised, encoding='utf-8')
            vectors.append({'source': source.relative_to(OUT).as_posix(), 'sourceSha256': sha(source),
                            'runtime': target.relative_to(OUT).as_posix(), 'sha256': sha(target)})
            record(target, 'blue-white UI v2, paint-only SVG variant')
    files = {item['file'] for item in added}
    manifest['assets'] = [item for item in manifest['assets'] if item['file'] not in files] + added
    manifest['coversV2'] = {name: spec['runtime'] for name, spec in provenance['covers'].items()}
    manifest['uiV2'] = {'ui': 'ui/v2/', 'words': 'words/v2/', 'letters': 'letters/v2/'}
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    provenance_path.write_text(json.dumps(provenance, indent=2) + '\n', encoding='utf-8')
    (OUT / 'sources/ui-v2.json').write_text(json.dumps({'method': 'paint-only SVG variants; original geometry and glyph paths unchanged',
        'palette': COLORS, 'vectors': vectors}, indent=2) + '\n', encoding='utf-8')
    print(f'Exported six original covers and {len(vectors)} geometry-preserving UI variants; {len(manifest["assets"])} manifest records.')

if __name__ == '__main__':
    main()
