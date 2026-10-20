# Hh / Ii audio

Higgs Audio V3 offline, cloned from the same existing Letter Land reference as the earlier guitar repair. No provider/voice-bank substitution. Exact clip hashes, word transcripts and review status in manifest.json. Runtime/model/cache stay outside the website.

First isolated H/I takes were rejected by the user. Repeated-spelling V2 candidates were not installed. V3 extracts initial /h/ from the Higgs hat recording (0.08–0.215s) and /ɪ/ from the first Higgs ill recording (0.085–0.25s), with 6ms edge fades and short padding. The user explicitly approved both audition files on 2026-10-21. These exact approved segments are the deployed Sound clips, not the rejected takes. Rejected recordings are archived outside the repo; their metadata is retained with deployed=false.

Letter names H/I and hat/horse/ill/insect have word-level Whisper transcripts checked. The first ill recording transcribed as Ew and was replaced with a Higgs take at seed 22603 that transcribes ill. This is a word transcript check, not phoneme/pronunciation certification. The separately approved short I segment remains unchanged. Chants combine the approved sound twice, then the related word, with explicit gaps; the I chant was rebuilt after repairing ill. Name → sound → words uses the app's existing sequential Letter Land audio boundary.

Build tools: tools/build_hi_voice.py, tools/qa_hi_voice.py, tools/repair_hi_ill.py, tools/build_hi_chants.py. Do not rerun a generation script over approved audio without a new review; approval attaches to hashes, not filenames.
