# Unit 3 Lesson 2 Game 6 — input speech recognition

Implemented architecture: the existing Higgs question ends → MediaRecorder captures up to 4 seconds → central `Unit3Speech` adapter → standalone Worker `/api/speaking-check` → `AI` binding / `@cf/openai/whisper-large-v3-turbo` → deterministic evaluator → existing ToyBuddy/Higgs feedback. Stop recording is also available immediately after capture starts. Games 1–5 keep their existing checks, audio and progression.

## Deployment status

Worker deployed on 2026-10-05 to the user-selected `hiei1121` Cloudflare account. Endpoint: `https://toy-buddy-speech.hiei1121.workers.dev/api/speaking-check`. Version: `af47df2e-0e49-4d89-adab-4dbbaa92c7a1`. The public URL is configured in `data/speech-config.js`. Live model tests returned correct full answers for all five toys; real Chrome MediaRecorder uploads through the live Worker returned CORRECT for both meanings and WRONG_LOGIC for a mismatched full answer. A standalone Yes clip returned INCOMPLETE; synthetic silence/noise returned UNCLEAR. Production Pages verification is recorded after publication below. Synthetic test audio is not proof of recognition quality for classroom children.

## Deploy the separate Worker

From `cloudflare/toy-buddy-speech`:

```powershell
npm ci
npx wrangler login --scopes account:read user:read workers_scripts:write ai:write
npm run check
npm run deploy
```

`wrangler.jsonc` binds Workers AI as `AI`, sets the model-independent request limiter, and restricts origins to `https://dodinhhieu2207.github.io`, `http://127.0.0.1:8765` and `http://localhost:8765`. This production origin was checked against the existing Git remote. If the Pages site uses a custom domain, add its exact origin and redeploy. The URL printed by deploy, followed by `/api/speaking-check`, is the frontend endpoint. Do not put the Cloudflare token/account credentials in the static site.

For development, `npm run dev` starts Wrangler. Workers AI inference still requires an authenticated Cloudflare account and uses the remote AI service; it is not an offline Whisper engine. Set the development frontend endpoint to `http://127.0.0.1:8787/api/speaking-check` temporarily. The production static config must use the HTTPS Worker URL.

After deploying a replacement Worker, update the public endpoint in `data/speech-config.js`. Publish the current website files to its existing GitHub Pages repository, including `data/speech-config.js`, `shared/speech-evaluator.js`, `unit3-speech.js`, the updated Lesson 2 JS/CSS and updated external script tags in `index.html`. The navigation/Lesson 2 dependencies were published together with the speech integration, preserving original game assets. Bump the script/config version queries for any subsequent URL changes, then inspect the served config and test production in Chrome/Edge.

Run a live smoke test from the website root:

```powershell
node tools/check_live_speech.mjs https://YOUR-WORKER.workers.dev/api/speaking-check
```

This sends only the existing synthetic Higgs answer clips. It checks both full-answer meanings for all five toys through real inference. Then test the production page microphone, retries, silence/noise and the actual classroom voices; synthetic clips alone do not prove recognition quality for children.

## Request and evaluator

Multipart fields: `audio`, `expectedAnswer`, `questionToy`, `displayedToy`. The Worker ignores `expectedAnswer`, validates both toys against plane/puppet/robot/balloon/teddy, and derives the expected meaning from equality. The neutral Whisper context contains only the English classroom topic and all five toy words, identical for every request. It omits model-answer sentences to reduce completion bias on short utterances. It uses `task:transcribe`, `language:en`, `vad_filter:true`, and `condition_on_previous_text:false`.

`shared/speech-evaluator.js` runs exactly the same constrained grammar in backend tests and the compatibility frontend helper. It lowercases, normalizes apostrophes, strips ordinary punctuation and collapses spaces. Full positive `yes it is`; full negative `no it isn't`, `no it isnt` (harmless ASR omission of apostrophe), or `no it is not`. Bare yes/no is always INCOMPLETE. Unrelated words or multiple contradictory answers are UNCLEAR. Full sentences with the wrong meaning are WRONG_LOGIC. The Worker also treats entirely low-confidence/no-speech segments as UNCLEAR. No LLM scores answers and no pronunciation score is invented.

JSON contains only `transcript`, `normalized`, `result`, `answerType`. Successful CORRECT feedback uses the existing Excellent clip and celebration, then advances after audio/SFX end. INCOMPLETE uses the whole-sentence clip and returns to LISTENING. WRONG_LOGIC and UNCLEAR use their respective existing retry clips. No lives are removed. The existing first-attempt star summary is retained. Easy shows both complete answers, Practice shows YES / NO, Challenge shows no answer text; all use the same grammar.

## Failure, concurrency and privacy

Only one recording/request can run. Mic is locked until Higgs `ended`, changes to Stop while recording, then locks during processing. Processing uses the existing THINKING actor plus a small waveform indicator. Restart, navigation and hidden-page cleanup abort fetch/capture, stop tracks and discard callbacks. Late permission grants also stop tracks immediately. Permission waits stop after 8 seconds; requests stop after 20 seconds; Worker AI wait stops after 18 seconds. Worker inference may finish remotely after a browser abort, but the page discards the result.

Denied permission, missing mic, unsupported recorder, empty capture, upload or service failure, timeout, bad response and missing endpoint all offer exactly two Teacher Check controls: CORRECT / TRY AGAIN. A failed service response never counts as an incorrect child answer. No recording, transcript or child identifier is placed in localStorage, KV, R2 or a database. Recording bytes exist only in transient browser/Worker memory. No request payloads/transcripts are logged in application code; Worker observability is disabled. Cloudflare's own service processing policies apply separately; this implementation cannot assert that the vendor has no internal processing telemetry.

Uploads are capped at 1 MiB, including a bounded streaming read without Content-Length; multipart overhead is capped too. Accepted audio formats cover browser WebM/Opus, Ogg/Opus, MP4, WAV and synthetic MP3 smoke checks. Unknown methods/content types/toys/origins are rejected before inference. The Cloudflare native limiter allows 90 requests per 60 seconds per transient IP key; its counters are regional and are accidental-load protection, not authentication or a hard cost quota. CORS likewise restricts browser origins, not clients that forge Origin. No child identity is used for limiting.

## Verification

Created files: `cloudflare/toy-buddy-speech/src/index.js`, `wrangler.jsonc`, `package.json`, `package-lock.json`, `.gitignore` in that Worker folder; `shared/speech-evaluator.js`; `data/speech-config.js`; `tests/toy-speech-worker.spec.mjs`; `tests/speech-adapter.spec.cjs`; `tools/check_live_speech.mjs`; this document. Test-generated PNGs stay under `tests/`.

Modified files: `index.html` external imports/version queries, `unit3-speech.js`, Game 6 sections/compatibility evaluator in `unit3-lesson2.js`, scoped waveform/two-button teacher layout in `unit3-lesson2.css`, `tests/unit3-speech.spec.cjs`, `tests/unit3-lesson2.spec.cjs`, `tests/navigation.spec.cjs`, and `docs/UNIT3-LESSON2.md`. Games 1–5 checks are unchanged; original Unit 2/Letter Land inline source and Unit 3 Lesson 1 files retain their preserved hashes. The Higgs files and actor assets/code are unchanged in this speech integration.

- `node tests/toy-speech-worker.spec.mjs`: 225 grammar/logic cases across all five toys and all pairs, neutral model input, multipart/CORS/method/size/stream/AI/rate/no-speech cases. AI mocked.
- `node tests/speech-adapter.spec.cjs`: one session, stop limits, tracks release, permission/no mic/unsupported/empty/network/timeout/error paths and cancellation at each stage.
- `node tests/unit3-speech.spec.cjs`: actual Chrome MediaRecorder bytes through the Worker handler with mocked AI; ended gating, waveform, all outcomes, all five toys and yes/no, teacher fallback, automatic advance.
- Existing `tests/unit3-lesson2.spec.cjs`, layout/navigation/asset checks protect Games 1–5, original Unit 2/Letter Land and the audio files.
- `npm run check`: Wrangler dry-run bundle/binding validation. No live deployment or live inference is implied by this command.

## Production verification — 2026-10-05

Website implementation commit: `d9502fe5db88214a340edb6e17a07d3445c52ee8`. [GitHub Pages deployment](https://github.com/dodinhhieu2207/game-tieng-anh/actions/runs/37332278123) completed successfully. The served config contains the deployed Worker endpoint.

`tests/unit3-speech-live.spec.cjs` passed with `SPEECH_TEST_BASE=https://dodinhhieu2207.github.io/game-tieng-anh/index.html?release=d9502fe`. Actual Chrome MediaRecorder uploads from the production origin reached the deployed Worker and real Whisper: positive CORRECT, negative CORRECT, mismatched full sentence WRONG_LOGIC. The test also checked audio-ended gating, processing locks, feedback, correct-answer automatic advancement, retry staying on the current round, and no JavaScript errors. Input audio was synthetic Higgs answer clips; this does not verify an actual child's microphone or classroom recognition quality.

`tools/check_live_speech.mjs` passed all ten full-answer toy cases against the deployed model. `tests/speech-live-edge.spec.mjs` returned INCOMPLETE for isolated synthetic Yes and No, and UNCLEAR for synthetic silence and noise. No child recordings were used for these tests.

Primary API references: [Whisper model schema](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/), [AI binding](https://developers.cloudflare.com/workers-ai/configuration/bindings/), [native rate limiter](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
