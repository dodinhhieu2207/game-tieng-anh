"""Finite Unit 5 Lesson 1 catalogue; same local Higgs/Belinda voice, resumable.

Run with the project's cached Higgs Python environment. No network model downloads,
new provider, pitch manipulation or sentence concatenation. ASR is technical QA,
not human voice approval or pronunciation assessment.
"""
from pathlib import Path
import hashlib, json, os, re, subprocess, time, argparse

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/unit5/lesson1/audio'
CACHE = Path('C:/Users/Admin/.cache/learning-higgs')
MODEL = Path('D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d')
TOKENIZER = Path('D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417')
FFMPEG = Path('D:/VoiceStudioApp/ffmpeg.exe')
WORDS = ['happy', 'sad', 'hungry', 'thirsty', 'hot', 'cold']
TEXTS = {**{f'words/{w}': w.capitalize() + '.' for w in WORDS},
         **{f'sentences/{p}-{w}': f"{p.capitalize()}'s {w}." for w in WORDS for p in ['he', 'she']},
         'instructions/present': 'Listen, point, and say.',
         'instructions/camera': 'Listen. Find the person.',
         'instructions/help': 'Look. What does she need?',
         'instructions/help-he': 'Look. What does he need?',
         'instructions/match': 'Listen. Match the word to the picture.',
         'instructions/build': 'Look at the word. Put the letters together.',
         'instructions/speak': 'Look at the picture. Your turn to speak.',
         'feedback/try-again': 'Try again.',
         'feedback/correct': 'Well done!',
         'feedback/complete': 'Great job! Look at your photos!'}

def norm(s):
    return re.sub('[^a-z]', '', s.lower().replace('’', "'"))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--align-only', action='store_true')
    args = parser.parse_args()
    os.environ['HF_HOME'] = 'D:/AI_Models/HF_Cache'
    os.environ['HF_HUB_OFFLINE'] = '1'
    import soundfile as sf
    import torch
    from faster_whisper import WhisperModel
    from faster_whisper.audio import decode_audio
    from faster_whisper.tokenizer import Tokenizer

    OUT.mkdir(parents=True, exist_ok=True)
    reference = CACHE / 'unit3-belinda-reference.wav'
    reference_text = "It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy."
    qa = WhisperModel('base.en', device='cpu', compute_type='int8',
                      download_root=str(CACHE / 'whisper'), local_files_only=True)
    qtok = Tokenizer(qa.hf_tokenizer, qa.model.is_multilingual, task='transcribe', language='en')
    manifest_path = OUT / 'manifest.json'
    data = json.loads(manifest_path.read_text()) if manifest_path.exists() else {'clips': {}}
    data.update(version='20261126-unit5-feelings-v1', engine='Higgs Audio V3 local cached weights',
                voice='Approved Unit 3 Belinda reference; original pitch, no pitch shift',
                referenceSha256=hashlib.sha256(reference.read_bytes()).hexdigest(),
                humanReviewed=False, limits='Automated transcript and alignment QA only. Listening approval and child outcomes are not measured.')
    if not args.align_only:
        from transformers import AutoModelForCausalLM, AutoTokenizer
        print('Loading approved Higgs V3 / Belinda', flush=True)
        tok = AutoTokenizer.from_pretrained(MODEL, local_files_only=True)
        model = AutoModelForCausalLM.from_pretrained(MODEL, trust_remote_code=True,
                   dtype=torch.bfloat16, local_files_only=True).to('cuda').eval()
        model.config.audio_tokenizer_id = str(TOKENIZER)
        ref, sr = sf.read(reference)
        codes = model._encode_reference(torch.tensor(ref, dtype=torch.float32), sr).cpu()

    for i, (key, text) in enumerate(TEXTS.items()):
        target = OUT / (key + '.mp3')
        target.parent.mkdir(parents=True, exist_ok=True)
        previous = data['clips'].get(key)
        reuse_audio = bool(previous and target.exists() and previous.get('text') == text and previous.get('transcriptMatch') and hashlib.sha256(target.read_bytes()).hexdigest() == previous.get('sha256'))
        if reuse_audio and previous.get('alignmentValid'):
            print('CACHED', key, flush=True)
            continue
        start = time.time()
        matched = False
        transcript = ''
        if args.align_only:
            assert target.exists(), target
        for attempt in range(1 if args.align_only or reuse_audio else 3):
            if not args.align_only and not reuse_audio:
                seed = 19710 + i * 13 + attempt * 101
                torch.manual_seed(seed)
                wav = model.generate_speech(text, tok, reference_codes=codes,
                       reference_text=reference_text, temperature=.65, top_p=.95,
                       top_k=50, max_new_tokens=700)
                raw = CACHE / f'unit5-{key.replace("/", "-")}.wav'
                sf.write(raw, wav.numpy(), 24000)
                subprocess.run([str(FFMPEG), '-v', 'error', '-y', '-i', str(raw), '-af',
                    'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7',
                    '-ar', '24000', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '96k', str(target)], check=True)
            seg, _ = qa.transcribe(str(target), language='en', beam_size=5,
                                  word_timestamps=True, condition_on_previous_text=False)
            segments = list(seg)
            transcript = ' '.join(s.text.strip() for s in segments)
            matched = norm(transcript) == norm(text)
            if matched:
                break
        audio = decode_audio(str(target), sampling_rate=16000)
        features = qa.feature_extractor(audio)
        alignment = qa.find_alignment(qtok, [qtok.encode(' ' + text)], qa.encode(features), min(features.shape[-1], 3000))[0]
        words = [{'word':w['word'].strip(), 'start':round(float(w['start']), 3), 'end':round(float(w['end']), 3)} for w in alignment if re.search('[a-zA-Z]', w['word'])]
        # Repair collapsed forced-alignment spans with a matching measured ASR word,
        # never an evenly divided duration or guessed timer.
        heard_words = [w for segment in segments for w in (segment.words or [])]
        for w in words:
            if w['end'] > w['start']:
                continue
            options = [x for x in heard_words if norm(x.word) == norm(w['word']) and x.end > x.start]
            if options:
                actual = min(options, key=lambda x:abs(x.end-w['end']))
                w['start'], w['end'] = round(actual.start,3), round(actual.end,3)
        # A single isolated word occupies its actual voiced extent, not an artificial equal subdivision.
        valid_alignment = bool(words) and all(0 <= w['start'] < w['end'] <= len(audio)/16000+.05 for w in words)
        record = {'text':text, 'src':target.relative_to(ROOT).as_posix(),
                  'duration':round(len(audio)/16000,3), 'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
                  'qaTranscript':transcript, 'transcriptMatch':matched, 'humanReviewed':False,
                  'words':words, 'alignmentValid':valid_alignment,
                  'alignmentMethod':'Whisper acoustic alignment against exact recorded script',
                  'seed':19710 + i * 13 + attempt * 101}
        data['clips'][key] = record
        manifest_path.write_text(json.dumps(data, indent=2), encoding='utf-8')
        (OUT / 'clips.js').write_text('window.Unit5FeelingsClips=' + json.dumps(data) + ';\n', encoding='utf-8')
        print(key, 'PASS' if matched and valid_alignment else 'REVIEW', transcript, round(time.time()-start,1), flush=True)
        if not matched or not valid_alignment:
            raise RuntimeError(f'Audio QA needs review: {key}: {transcript}; alignment={words}')
    print('DONE', len(data['clips']), 'whole recorded Higgs clips', flush=True)

if __name__ == '__main__':
    main()
