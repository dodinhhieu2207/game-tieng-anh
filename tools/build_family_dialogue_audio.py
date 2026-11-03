"""Generate bounded Family Dialogue Studio clips with the approved Higgs V3 voice."""
import json
import build_unit4_lesson1_audio as build

build.OUT = build.ROOT / 'assets/family-dialogue/audio'
build.TEXTS = {
    **{f'question-{word}': f'Is this your {word}?' for word in ['mum', 'dad', 'brother', 'sister', 'grandpa', 'grandma']},
    'answer-yes': 'Yes, it is.',
    'answer-no': "No, it isn't.",
}

def checked(key, transcript):
    heard = build.norm(transcript.lower().replace('mom', 'mum'))
    expected = build.norm(build.TEXTS[key])
    return heard == expected

if __name__ == '__main__':
    build.transcript_ok = checked
    build.main()
    path = build.OUT / 'manifest.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    data['version'] = '20261103-family-dialogue1'
    data['limits'] = 'Transcript QA only; child microphone speech remains unmeasured; humanReviewed=false.'
    path.write_text(json.dumps(data, indent=2), encoding='utf-8')
    (build.OUT / 'clips.js').write_text('window.FamilyDialogueClips=' + json.dumps(data) + ';\n', encoding='utf-8')
