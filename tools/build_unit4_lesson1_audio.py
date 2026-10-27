"""Build the finite Unit 4 Lesson 1 Higgs V3 catalogue.

This runs offline with the already accepted Unit 3 Belinda reference.  Only
the generated MP3 catalogue and its provenance are shipped to the browser.
"""
from pathlib import Path
import hashlib
import json
import os
import re
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path("C:/Users/Admin/.cache/learning-higgs")
OUT = ROOT / "assets/unit4/lesson1/audio"
FFMPEG = Path("D:/VoiceStudioApp/ffmpeg.exe")
MODEL = Path("D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d")
TOKENIZER = Path("D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417")

TEXTS = {
    "mum": "Mum.",
    "dad": "Dad.",
    "brother": "Brother.",
    "sister": "Sister.",
    "grandpa": "Grandpa.",
    "grandma": "Grandma.",
    "instruction/meet": "Listen, point, and say.",
    "instruction/find": "Listen. Find the family member.",
    "instruction/pack": "Choose a word. Then choose the matching family member.",
    "instruction/relay": "Take turns. Listen and find the family member.",
    "feedback/try-again": "Try again.",
    "feedback/well-done": "Well done!",
    "feedback/complete": "Great job! You found the family.",
}


def run(*args):
    return subprocess.run([str(a) for a in args], check=True, capture_output=True, text=True).stdout


def norm(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())


def transcript_ok(key, transcript):
    heard = norm(transcript)
    expected = norm(TEXTS[key])
    if key == "mum":
        return heard in {"mum", "mom"}
    if "/" not in key:
        return norm(key) in heard
    important = {
        "instruction/meet": ["listen", "point", "say"],
        "instruction/find": ["listen", "find", "family", "member"],
        "instruction/pack": ["choose", "word", "matching", "family", "member"],
        "instruction/relay": ["turns", "listen", "find", "family", "member"],
        "feedback/try-again": ["try", "again"],
        "feedback/well-done": ["well", "done"],
        "feedback/complete": ["great", "job", "found", "family"],
    }[key]
    return all(norm(word) in heard for word in important) or heard == expected


def main():
    os.environ["HF_HOME"] = "D:/AI_Models/HF_Cache"
    os.environ["HF_HUB_OFFLINE"] = "1"
    import soundfile as sf
    import torch
    from faster_whisper import WhisperModel
    from transformers import AutoModelForCausalLM, AutoTokenizer

    OUT.mkdir(parents=True, exist_ok=True)
    reference = CACHE / "unit3-belinda-reference.wav"
    reference_text = "It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy."
    ref_audio, sample_rate = sf.read(reference)
    print("Loading cached Higgs V3 model and approved Belinda reference...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, local_files_only=True)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL, trust_remote_code=True, dtype=torch.bfloat16, local_files_only=True
    ).to("cuda").eval()
    model.config.audio_tokenizer_id = str(TOKENIZER)
    reference_codes = model._encode_reference(
        torch.tensor(ref_audio, dtype=torch.float32), sample_rate
    ).cpu()
    qa = WhisperModel(
        "base.en", device="cpu", compute_type="int8",
        download_root=str(CACHE / "whisper"), local_files_only=True,
    )

    clips = {}
    for index, (key, text) in enumerate(TEXTS.items()):
        target = OUT / f"{key}.mp3"
        target.parent.mkdir(parents=True, exist_ok=True)
        raw = CACHE / f"u4-{key.replace('/', '-')}.wav"
        decoded = CACHE / f"u4-{key.replace('/', '-')}-decoded.wav"
        transcript = ""
        matched = False
        started = time.time()
        for attempt in range(3):
            torch.manual_seed(41000 + index * 17 + attempt * 101)
            wav = model.generate_speech(
                text, tokenizer, reference_codes=reference_codes,
                reference_text=reference_text, temperature=.58,
                top_p=.95, top_k=50, max_new_tokens=650,
            )
            if wav.numel() < 2400 or wav.numel() > 24000 * 12:
                continue
            sf.write(raw, wav.numpy(), 24000)
            run(
                FFMPEG, "-v", "error", "-y", "-i", raw,
                "-af", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7",
                "-ar", "24000", "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "96k", target,
            )
            segments, _ = qa.transcribe(
                str(target), language="en", beam_size=5,
                condition_on_previous_text=False,
            )
            transcript = " ".join(s.text.strip() for s in segments)
            matched = transcript_ok(key, transcript)
            if matched:
                break
        run(FFMPEG, "-v", "error", "-y", "-i", target, "-ar", "24000", "-ac", "1", decoded)
        audio, final_rate = sf.read(decoded)
        clips[key] = {
            "src": target.relative_to(ROOT).as_posix(),
            "text": text,
            "duration": round(len(audio) / final_rate, 3),
            "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
            "qaTranscript": transcript,
            "transcriptMatch": matched,
            "humanReviewed": False,
        }
        print(f"{key}: {'PASS' if matched else 'REVIEW'} · {transcript} · {time.time()-started:.1f}s", flush=True)
        if not matched:
            raise RuntimeError(f"Transcript check failed for {key}: {transcript}")

    manifest = {
        "version": "20261027-u4-family1",
        "engine": "Higgs Audio V3, cached local weights",
        "voice": "Belinda reference from existing accepted Unit 3 recordings",
        "referenceSha256": hashlib.sha256(reference.read_bytes()).hexdigest(),
        "normalization": "FFmpeg loudnorm I=-18, TP=-1.5, LRA=7",
        "clips": clips,
        "limits": "ASR verifies words only. Teacher listening review is still required before public classroom release.",
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (OUT / "clips.js").write_text(
        "window.Unit4FamilyClips=" + json.dumps(manifest) + ";\n", encoding="utf-8"
    )
    print(f"DONE: {len(clips)} static Higgs clips", flush=True)


if __name__ == "__main__":
    main()
