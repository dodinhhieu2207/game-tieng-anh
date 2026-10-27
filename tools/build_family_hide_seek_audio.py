"""Generate this game's finite catalogue with the established local Higgs V3 pipeline."""
import json
from pathlib import Path
import build_unit4_lesson1_audio as build

build.OUT = build.ROOT / 'assets/family-hide-seek/audio'
build.TEXTS = {
    'intro': "Let's play hide and seek. Find your family!",
    'find-mum': 'Find mum!', 'find-dad': 'Find dad!',
    'find-brother': 'Find brother!', 'find-sister': 'Find sister!',
    'find-grandpa': 'Find grandpa!', 'find-grandma': 'Find grandma!',
    'retry': 'Try another hiding place.',
    'found': 'There you are! Come with me.',
    'complete': "You found your family! Let's have a picnic.",
}

def checked(key, transcript):
    def words(text):
        return build.norm(text.replace('Mom', 'Mum').replace('mom', 'mum'))
    return words(build.TEXTS[key]) == words(transcript)

if __name__ == '__main__':
    build.transcript_ok = checked
    build.main()
    path = build.OUT / 'manifest.json'
    manifest = json.loads(path.read_text(encoding='utf-8'))
    manifest['version'] = '20261027-family-hide-seek1'
    manifest['limits'] = 'Local Higgs V3 with prior accepted Belinda reference. Transcript QA only; humanReviewed remains false.'
    path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    (build.OUT / 'clips.js').write_text('window.FamilyHideSeekClips=' + json.dumps(manifest) + ';\n', encoding='utf-8')
