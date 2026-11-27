"""Encode original UI plates and author native matching interaction glyphs."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/unit5/lesson1'
GENERATED = Path.home() / '.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7'
GLYPHS = {
 'music': '<path d="M26 45V15l25-6v30M26 23l25-6"/><ellipse cx="17" cy="46" rx="10" ry="7" fill="#ffd75b"/><ellipse cx="42" cy="40" rx="10" ry="7" fill="#ffd75b"/>',
 'hear-word': '<path d="M9 25h10l12-10v34L19 39H9Z" fill="#ffd75b"/><path d="M39 24q9 8 0 16M45 17q16 15 0 30"/>',
 'hear-sentence': '<rect x="9" y="13" width="46" height="32" rx="10" fill="#e8f7ff"/><path d="M19 45v9l12-9M20 24h24M20 33h16"/>',
 'play': '<path d="M22 13 51 32 22 51Z" fill="#ffd75b"/>',
 'next': '<path d="M10 26h28V15l18 17-18 17V38H10Z" fill="#ffd75b"/>',
 'done': '<circle cx="32" cy="32" r="25" fill="#e0f7dd"/><path d="m18 32 9 9 19-21"/>',
 'microphone': '<rect x="24" y="8" width="16" height="30" rx="8" fill="#ffd75b"/><path d="M16 28v4a16 16 0 0 0 32 0v-4M32 48v9M23 57h18"/>',
 'sound': '<path d="M9 25h10l12-10v34L19 39H9Z" fill="#c3efff"/><path d="M39 24q9 8 0 16M45 17q16 15 0 30"/>',
 'help': '<circle cx="32" cy="32" r="25" fill="#fff0aa"/><path d="M24 24c0-12 23-12 18 1-2 5-10 5-10 12M32 45v1"/>',
 'undo': '<path d="M24 15 9 29l15 14V33h15c12 0 14 14 4 20 21-4 19-30-4-30H24Z" fill="#c3efff"/>',
 'back': '<path d="M54 26H26V15L8 32l18 17V38h28Z" fill="#ffd75b"/>',
 'close': '<circle cx="32" cy="32" r="25" fill="#ffe3df"/><path d="m23 23 18 18m0-18L23 41"/>',
 'replay': '<path d="M49 19a23 23 0 1 0 5 24M49 8v15H34"/>',
 'camera': '<path d="m22 17 4-8h13l4 8h10a5 5 0 0 1 5 5v29H6V22a5 5 0 0 1 5-5Z" fill="#c3efff"/><circle cx="32" cy="34" r="12" fill="#ffd75b"/>',
 'home': '<path d="m6 30 26-23 26 23M13 25v31h38V25M26 56V37h13v19" fill="#c3efff"/>',
 'photo': '<rect x="10" y="6" width="44" height="52" rx="8" fill="#fff"/><circle cx="26" cy="24" r="7" fill="#ffd75b"/><path d="m14 46 12-11 9 7 9-13 6 17" fill="#c3efff"/>'
}

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    manifest_path = OUT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    provenance_path = OUT / 'sources/ui-v3.json'
    provenance = json.loads(provenance_path.read_text(encoding='utf-8'))
    added = []
    def record(p, role, generation=None):
        item = {'file': p.relative_to(OUT).as_posix(), 'role': role, 'sha256': sha(p)}
        if generation: item['generation'] = generation
        if p.suffix != '.svg':
            im = Image.open(p); item.update(width=im.width, height=im.height)
        added.append(item)
    for name, entry in provenance['assets'].items():
        raw = OUT / f'sources/ui-v3/{name}.png'; raw.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(GENERATED / (entry['generation'] + '.png'), raw)
        im = Image.open(raw).convert('RGBA')
        assert im.getextrema()[3][0] == 0 and im.getpixel((im.width//2, im.height//2))[3] >= 250, (name, 'alpha')
        target = OUT / f'ui/v3/{name}.webp'; target.parent.mkdir(parents=True, exist_ok=True)
        im.save(target, 'WEBP', quality=94, method=6)
        entry.update(source=raw.relative_to(OUT).as_posix(), runtime=target.relative_to(OUT).as_posix(), sourceSha256=sha(raw), size=list(im.size))
        record(raw, 'imagegen original tactile UI plate', entry['generation']); record(target, 'runtime tactile UI plate, encoding only', entry['generation'])
    provenance['styleReferenceSha256'] = sha(ROOT / provenance['styleReference'])
    for name, body in GLYPHS.items():
        target = OUT / f'ui/v3/icons/{name}.svg'; target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g stroke="#173f65" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none">{body}</g></svg>', encoding='utf-8')
        record(target, 'project-authored 64px dual-tone interaction glyph')
    for word in manifest['words']:
        source = OUT / f'words/v2/{word}-base.svg'
        # Preserve the approved learning glyph paths, expose them without the previous flat tile.
        paths = ''.join(re.findall(r'<path[^>]+/>', source.read_text(encoding='utf-8')))
        target = OUT / f'words/v3/{word}-ink.svg'; target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="236" height="80" viewBox="12 22 236 80">{paths}</svg>', encoding='utf-8')
        record(target, 'approved word glyph paths only, tighter viewport for legibility')
    files = {a['file'] for a in added}
    manifest['assets'] = [a for a in manifest['assets'] if a['file'] not in files] + added
    manifest['interfaceV3'] = {'plates': {k: e['runtime'] for k,e in provenance['assets'].items()}, 'icons': 'ui/v3/icons/', 'wordInk': 'words/v3/', 'interfaceFont': 'Learning Fredoka 600/700, inherited app font', 'learningFont': 'App Outfit 700/800 and unchanged approved paths'}
    manifest_path.write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
    provenance_path.write_text(json.dumps(provenance, indent=2)+'\n', encoding='utf-8')
    print(f'Exported five original alpha plates, {len(GLYPHS)} interaction glyphs and six approved word-ink assets.')

if __name__ == '__main__': main()
