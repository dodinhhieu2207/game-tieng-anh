# Toy Town voice controls

The reusable `shared/toy-voice-ui.js` and `.css` presentation component uses the shared, bundled Outfit UI typography, glossy blue microphone, green recording/Stop, purple teacher and replay actions, cream panel, and existing listening/teacher/check/replay art. The microphone is a small inline vector icon; no new generated raster art is used.

`ToyVoiceUI.html({support, adapter, idPrefix})` returns escaped support copy and controls. `ToyVoiceUI.update(host, {phase, manual, feedback})` updates labels, icons and visual states. The lesson continues to own button events, recording, audio-ended gating, cancellation and deterministic scoring. It is not a second recognition adapter.

States: ASKING, LISTENING, STARTING, RECORDING, THINKING, SUCCESS, RETRY. Recording shows Stop and an animated activity indicator; processing disables microphone and replay. The indicator represents activity, not measured sound amplitude. Existing polite status feedback remains available to screen readers. Reduced-motion users receive a static indicator. Teacher validation displays the two existing CORRECT / TRY AGAIN choices, hides duplicate microphone actions and does not record audio.

Integration is scoped to Unit 3 Lesson 2 Game 6. The page loads the two shared presentation files before `unit3-lesson2.js`; cache query is `20261005-voice1`. Other games and their stylesheet rules are untouched. Cloudflare configuration, Worker, evaluator, prerecorded Higgs audio and character assets are unchanged. No OpenAI speech integration is added.

Validation: `tests/unit3-speech.spec.cjs` passed 15 real MediaRecorder uploads through the Worker handler with mocked inference. `tests/unit3-lesson2.spec.cjs` passed all six activities, retries, completion, persisted progress, controls, mobile touch, audio and file opening. `tests/unit3-lesson2-layout.spec.cjs` passed all six games at 1920×1080, 1366×768 and 1024×768, including teacher controls. `tests/toy-voice-ui.spec.cjs` passed presentation states, mic locking, Stop visibility, reduced motion, teacher layout and 390/320px touch targets with no page overflow or JavaScript errors. Generated screenshots are local under `tests/`.

For production presentation checks, set `VOICE_UI_TEST_BASE` to the public index URL with a release query, then run `node tests/toy-voice-ui.spec.cjs`. This test does not claim real microphone or child speech quality; the backend remains unchanged.

The app loads shared/app-typography.css after the shell stylesheet. It uses existing local Outfit Bold and ExtraBold files, with larger preschool controls and copy: desktop question 34px, answer model 27px, microphone 25px and feedback 23px. Mobile sizes and wrapping keep controls within 320px and 390px screens. Letter Land teaching letterforms and tracing artwork retain their existing fonts. The presentation test verifies both font weights load and the microphone uses Outfit at 25px.
