# Unit 3 speaking play â€” Lessons 1, 2, 3

The same microphone boundary (`unit3-speech.js`) serves word practice and full sentence practice. New word task types are explicit: `toy-word` has the five original toys; `gg-word` has girl/guitar. No standalone phoneme is sent for grading. Other question types retain their full grammar and logic requirements.

## Activities and existing progress keys

| Lesson | Activity | Spoken task | Rounds |
| --- | --- | --- | --- |
| 1 | Say & Play (`3/1/u3learn`) | Listen to the existing Higgs toy word, then say that word to move it | 5 |
| 1 | Mystery Box (`3/1/u3mystery`) | Name the hidden object using its silhouette and two picture choices | 5 |
| 2 | Talk to Toy Buddy (`3/2/talk-to-toy-buddy`) | Say & Play: answer the Buddy with a full yes/no sentence; Mystery Box: ask a full Is it aâ€¦? question until Yes | 6 / 5 |
| 3 | Trace & Say (`3/3/trace-say`) | Trace G/g, then say girl/guitar to animate the object | 2 traces with 2 spoken word turns |
| 3 | Mystery Box (`3/3/final-challenge`) | Name the hidden girl/guitar from the clue | 4 |

Lesson 2 retains both What's this? modes under Teacher: more speaking practice. Its mystery choices are two possible pictures, but all five valid toy questions remain recognized. Each valid wrong guess keeps the box shut. One successful guess earns three stars; two/three earns two; four or more earns one. Uncertain recognition and service failures do not increment guesses or penalize the child.

The three steps of the Gg introduction, approved /g/ recording, supplied mouth photo, chant, and unrelated games/audio are preserved. Lesson 1 still models the word before requesting speech. Listen again is available; accepted answers wait for an explicit Next tap.

## Feedback and privacy

Speech finishes before motion or SFX. The shared sound lanes are blocked during starting/recording/processing for every new word turn, as well as existing sentence speaking. The guitar cue is an original deterministic six-string plucked synthesis, G major, 1.15 seconds; it contains no third-party recording. Existing licensed feedback samples and supplied image assets remain in use.

Capture keeps the existing 8-second maximum and Done button. Teacher review audio is a temporary Blob URL, revoked on replacement/navigation. Teacher confirmation is stored separately from AI confirmation in `LearningProgress.speakingReview`. No child audio or transcript is saved to progress storage. Existing best-star and completion IDs prevent duplicate rewards on replay.

The public Worker retains origin and vocabulary allowlists, bounded uploads, rate limiting and inference timeout. Context gives the complete lesson vocabulary, never only the expected answer. The frontend verifies successful word responses against the same deterministic evaluator. No new service, credential or child-data logging has been introduced.

## Validation

- `tests/toy-speech-worker.spec.mjs`: mocked AI, both word vocabularies, strict full sentences, neutral context and server input/failure boundaries.
- `tests/speaking-play.spec.cjs`: real browser recording with a fake microphone and mocked transcription, all three lessons, SVG traces, media-end gating, boxes, supported evidence, replay, responsive layouts and navigation cleanup.
- Existing speech adapter, child-speaking, Lesson 2/3, navigation and rewards tests cover shared regressions.
- `tests/live-speaking-word-check.py`: uploads only public pre-rendered Higgs samples to the deployed Worker. A passing synthetic sample proves that request path works for that sample; it does not measure real child speech or pronunciation.

Actual classroom acceptance needs permitted child recordings checked against the teacher's judgement. AI recognition is not a pronunciation or mastery score.

## New visual pack

Eight new illustrated elements are saved in `assets/speaking-play/`: six atlas sprites plus studio/garden backgrounds. The transparent 1536Ã—1024 atlas is displayed through CSS at its six 512Ã—512 cells; no destructive extraction or replacement of supplied art. `manifest.json` records dimensions/hashes, `prompts.md` records the built-in imagegen specifications, and `catalog.html` previews each sprite. Both Lesson 1 games, both main Lesson 2 speaking modes, and Lesson 3 oral tracing/Mystery Box consume the new art.

Short-word confidence recovery uses a second inference without a vocabulary prompt only after a vocabulary-valid but uncertain first pass. Agreement plus reliable second-pass token scores is required; no metadata, two uncertain passes or disagreeing words stay UNCLEAR. Both calls share the existing total 18-second timeout. The reliable token override follows the upstream Whisper transcription logic: https://github.com/openai/whisper/blob/main/whisper/transcribe.py .

The additional `wave-atlas.png` contains four identity-preserving girl poses and four teddy poses, derived with imagegen from their approved original pictures. A discrete sprite animation waves the actual hand/paw after accepted speech; it does not rotate the original whole-body image. The temporary overlay is removed and the original picture restored on finish, cancellation or navigation. Reduced motion keeps the original still picture.
