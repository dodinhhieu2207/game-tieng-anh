"""Dedicated numbers, same existing local Higgs V3 and Belinda reference."""
from pathlib import Path
import os, json, hashlib, subprocess, re
ROOT = Path(__file__).resolve().parents[1]
CACHE = Path('C:/Users/Admin/.cache/learning-higgs')
OUT = ROOT / 'assets/number-studio/audio'
WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
def main():
    os.environ['HF_HOME'] = 'D:/AI_Models/HF_Cache'
    os.environ['HF_HUB_OFFLINE'] = '1'
    import torch, soundfile as sf
    from transformers import AutoTokenizer, AutoModelForCausalLM
    from faster_whisper import WhisperModel
    OUT.mkdir(parents=True, exist_ok=True)
    ref = CACHE / 'unit3-belinda-reference.wav'
    qa = WhisperModel('base.en', device='cpu', compute_type='int8', download_root=str(CACHE/'whisper'), local_files_only=True)
    path = 'D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
    tok = AutoTokenizer.from_pretrained(path, local_files_only=True)
    model = AutoModelForCausalLM.from_pretrained(path, trust_remote_code=True, dtype=torch.bfloat16, local_files_only=True).to('cuda').eval()
    model.config.audio_tokenizer_id = 'D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
    audio, sr = sf.read(ref)
    codes = model._encode_reference(torch.tensor(audio, dtype=torch.float32), sr).cpu()
    manifest = OUT / 'manifest.json'
    clips = json.loads(manifest.read_text())['clips'] if manifest.exists() else {}
    for i, word in enumerate(WORDS):
        target = OUT / (word+'.mp3')
        if word in clips and clips[word]['transcriptMatch'] and target.exists():
            continue
        text = word.capitalize()+'.'
        matched = False
        for attempt in range(3):
            torch.manual_seed(105700+i+attempt*100)
            wav = model.generate_speech(text, tok, reference_codes=codes, reference_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy.", temperature=.55, top_p=.95, top_k=50, max_new_tokens=400)
            raw = CACHE / ('numbers-'+word+'.wav')
            sf.write(raw, wav.numpy(), 24000)
            subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',str(target)], check=True)
            segments, _ = qa.transcribe(str(target), language='en', beam_size=5, condition_on_previous_text=False)
            transcript = ' '.join(s.text.strip() for s in segments)
            normalized = re.sub('[^a-z0-9]', '', transcript.lower())
            matched = normalized in (word, str(i+1))
            if matched:
                break
        clips[word] = {'src':target.relative_to(ROOT).as_posix(),'text':text,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'qaTranscript':transcript,'transcriptMatch':matched,'duration':round(len(wav)/24000,3),'humanReviewed':False}
        doc = {'engine':'Higgs V3 offline','voice':'Existing Unit 3 Belinda reference','referenceSha256':hashlib.sha256(ref.read_bytes()).hexdigest(),'clips':clips,'limits':'ASR verifies transcript only; timbre and classroom suitability require listening review.'}
        manifest.write_text(json.dumps(doc, indent=2), encoding='utf8')
        (OUT/'clips.js').write_text('window.NumberStudioClips='+json.dumps(doc)+';\n', encoding='utf8')
        print(word+': '+('PASS ' if matched else 'REVIEW ')+transcript, flush=True)
        if not matched:
            raise RuntimeError('Number audio transcript mismatch')
if __name__ == '__main__':
    main()
