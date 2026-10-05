# Unit 3 – Lesson 2: six playable activities

Open `http://127.0.0.1:8765/index.html#/unit/3/lesson/2` while this folder is served. All runtime files are static and can also be opened through `index.html` using `file://`. This implementation is in the existing Desktop workspace; it has not been pushed to GitHub Pages.

## Reused architecture and preservation

The module reuses `data/units.js`, `app/router.js`, `app/app-shell.js`, `app/progress.js`, the host `games` registry, `openGame`, `setStage`, Restart, Full Screen, the existing Audio owner/mute control and localStorage progress. No second router, shell, mascot, progress store or TTS service was added.

The girl is the existing `ToyBuddy` in `toy-buddy.js` / `toy-buddy.css`, using the supplied PNG poses in `assets/toy-buddy/`. `TALKING`, `CORRECT` and `CELEBRATE` map to the existing talking/happy sprites. `SUCCESS` remains compatible with the earlier prototype. One actor persists through all rounds and moves into the completion panel; navigation destroys its audio, timers and animation frame.

All toy pictures use the original `assets/unit3/toys/{plane,puppet,robot,balloon,teddy}.webp`. Supplied separated girl PNGs and shared visual category icons are reused. No replacement toy art was generated. The original inline Unit 2 / Letter Land engine, `unit3.js`, `unit3.css` and `toy-buddy-scene.js` match the earlier preservation hashes. Lesson 1 activities, Unit 2 mapping, selector art, sidebar and old audio files remain intact.

## Routes and activity behavior

Append each route to `index.html`. Replace `mode=practice` with `mode=class` for sequential teaching.

| Game | Route | Content |
| --- | --- | --- |
| Meet the Pattern | `#/unit/3/lesson/2?mode=practice&activity=meet-pattern` | 8 randomized rounds, all five toys, exactly 4 YES and 4 NO trials; full answer is modeled after either choice. |
| Question Detective | `#/unit/3/lesson/2?mode=practice&activity=question-detective` | 8 rounds; NAME, YES / NO, COLOR, NUMBER with visual cards; wrong selection receives “Listen again.” |
| Match the Answer | `#/unit/3/lesson/2?mode=practice&activity=match-answer` | 10 balanced trials; drag or tap answers; wrong return and correct snap. Later trials show two question cards, taking one spoken question at a time. |
| Build the Sentence | `#/unit/3/lesson/2?mode=practice&activity=build-sentence` | 7 constructions: five toy questions, positive and negative answers. Easy model/ghosts, Practice no full model, Challenge distractors. Completed sentence audio plays before Next. |
| Listen & Decide | `#/unit/3/lesson/2?mode=practice&activity=listen-decide` | 10 balanced trials; transcript hidden until the answer, then full answer model. Accuracy counts first attempts; Replay has no penalty. |
| Talk to Toy Buddy | `#/unit/3/lesson/2?mode=practice&activity=talk-to-toy-buddy` | 10 balanced trials, three support levels, MediaRecorder / Workers AI adapter plus Teacher Check. Full/partial/logically wrong/unclear responses have different outcomes. See UNIT3-SPEECH-AI.md for endpoint/deployment status. |

Class Mode and its existing drawer follow exactly the six-game order above. Practice cards remain freely selectable. No Final Mission was added. Completion stores best stars using the existing `LearningProgress`; 3 stars require at least 90% first-try accuracy, 2 at least 65%, otherwise 1 after finishing. Single-round success does not complete a game. Game 6 shows target sentences, total lesson stars and Play Again / Choose Activity / Back to Unit 3.

## Shared controller and audio

`unit3-lesson2.js` contains one `LessonScene` controller for the six activity types. Its state exposes game/round, score, stars, sound, question playback, input readiness, actor state, current/question toy, correct answer and support level through `Unit3Lesson2.current()`.

Inputs remain disabled through task introduction, question playback and feedback. ASKING enters TALKING on actual playback, then LISTENING only after `ended`. Each round/navigation/replay invalidates the previous audio generation and speech callbacks. Sound Off mutes the recording while preserving the actual completion event. Voice and SFX play sequentially. Current/next images and question clips are preloaded.

The old Higgs V2 temporary environment was absent. After the user requested a fresh setup, an isolated build environment was created at `C:/Users/Admin/.cache/learning-higgs/.venv`, using already cached Higgs V3 weights on `D:/AI_Models/HF_Cache`. New recordings use a single reference assembled from the existing accepted Unit 3 Belinda sentence recordings. This is new V3 generation from that reference, not restoration of the old V2 runtime.

`tools/build_unit3_lesson2_audio.py` generates 25 mono 24 kHz MP3s in `assets/unit3/lesson2/audio/`. Browser dialogue never calls SpeechSynthesis or the local model. The build normalizes to -18 LUFS, then extracts mouth cues from the final MP3 waveform with Rhubarb. `manifest.json` records text, duration, hashes, voice provenance and cues; `clips.js` loads the same data without fetch. The actor uses `audio.currentTime`, including pause, seek and playback-rate changes.

Generated inventory:

- `questions/`: `is_it_a_plane`, `is_it_a_puppet`, `is_it_a_robot`, `is_it_a_balloon`, `is_it_a_teddy`, `whats_this`, `what_color`, `how_many`.
- `answers/`: `yes_it_is`, `no_it_isnt`.
- `feedback/`: `your_turn`, `excellent`, `great_job`, `try_again`, `look_again`, `say_the_whole_sentence`, `i_couldnt_hear_you`, `tap_the_microphone`, `listen`, `look`, `choose`, `well_done`, `listen_and_choose`, `build_sentence`, `listen_again`.

`tools/audit_unit3_lesson2_audio.py` performs offline transcript/loudness QA, not student speech recognition. All 25 recognized transcripts match after harmless punctuation normalization. Final measured loudness is -18.03 to -18.70 LUFS; true peaks remain below -1.5 dB. Details are in `assets/unit3/lesson2/audio/qa.json`.

## Speech method and classroom fallback

`unit3-speech.js` now captures MediaRecorder audio and sends it through a standalone Cloudflare Worker. Unit 2's original browser-recognition implementation is preserved. The adapter offers capture, processing, result/error callbacks, stop and cancel; Game 6 can change provider through `Unit3Lesson2.recognitionAdapter`. The static config contains a public endpoint only; no secrets.

The microphone starts only after question audio ends, stops after at most four seconds or a manual Stop, then locks during processing. The Worker normalizes punctuation/case/apostrophes and distinguishes full, incomplete, wrong-logic and unclear answers. Teacher Check is always available and offers CORRECT / TRY AGAIN. Successful Game 6 responses play the existing Excellent audio and celebration before automatic progression. No lives are removed and manual validation never pretends to be recognition.

The Cloudflare integration is deployed to the user-selected hiei1121 account and configured on GitHub Pages. Real Chrome MediaRecorder uploads from the public website passed through the deployed Worker and Whisper for full positive/negative answers and wrong-logic retry. Synthetic isolated Yes/No, silence and noise were also checked against the live model. Actual child/noisy-classroom recognition has not been human-tested. See [UNIT3-SPEECH-AI.md](UNIT3-SPEECH-AI.md) for verification limits and deployment instructions.

## Validation and reproduction

Serve this workspace on port 8765, then run sequentially (the small Python preview server can drop requests under concurrent browser startup):

```text
node tests/lesson2-assets.spec.cjs
node tests/navigation.spec.cjs
node tests/toy-buddy.spec.cjs
node tests/toy-buddy-lipsync.spec.cjs
node tests/unit3-lesson2.spec.cjs
node tests/unit3-speech.spec.cjs
node tests/unit3-lesson2-layout.spec.cjs
node tests/unit3-lesson2-completion-layout.spec.cjs
```

All commands above passed. Browser tests cover all playable rounds, true/false choices, all toys, mouse and real touch dragging, undo, difficulty levels, hidden transcript, actual audio-ended gating, pause, replay, mute, fullscreen, burst restart, cleanup, Class / Practice / drawer / Back, persisted stars and file opening. Actor tests cover blinking, all state mappings, failed audio and teardown. Navigation regression opens all 43 registered games and Letter Land. Layout tests use 1920×1080, 1366×768 and 1024×768, including later matching cards and teacher fallback. A separate completion layout test verifies the same actor remains visible, celebrates, and fits with its controls at these sizes. Screenshots are stored in `tests/`.

## Files changed and release limits

Created: `unit3-lesson2.js`, `unit3-lesson2.css`, `unit3-speech.js`, the 25 MP3s and their manifest/clip/QA files, two build/QA scripts, activity/speech/layout/asset tests and this document.

Modified: `index.html` imports, `data/units.js` Lesson 2 entries, `app/app-shell.js` completion/cancellation/mute compatibility, existing `toy-buddy.js` / `.css` state/audio support, existing actor/lip-sync/navigation tests, and the prototype documentation note.

This folder is the working local deliverable. Its required website files were synchronized to the existing game-tieng-anh Git repository and published in commit d9502fe. GitHub Pages deployment succeeded, and the public Game 6 passed the live browser/Worker/Whisper check. The build runtime, models and QA Whisper cache stay outside the deployable website.

Before public production release, confirm the applicable Higgs V3 license for the intended application and generated audio. The cached model package identifies research/non-commercial licensing; upstream terms now also include a scoped Creator Use Grant. This task does not establish that the user's educational application falls under that grant or that a commercial license is already held. Current upstream terms: https://huggingface.co/bosonai/higgs-tts-3-4b/blob/main/LICENSE . Do not deploy the model/runtime with the site.
