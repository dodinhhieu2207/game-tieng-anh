# Unit 3 – Lesson 3: Gg

Implemented 2026-10-08 using `RULES.md` and the supplied Lesson 3 request. The seven activities reuse the existing Lesson template, shell, router and game registry. There is no separate app, progress store, runtime TTS model or speech service.

## Content and routes

New content: G/g, the initial sound in girl and guitar, girl, guitar. Review: plane, puppet, robot, balloon, teddy; Is it a…? / Yes, it is. / No, it isn't.

Append these hashes to `index.html`:

| Activity | Route | Experience family |
| --- | --- | --- |
| Meet Gg | `#/unit/3/lesson/3?mode=practice&activity=meet-gg` | Letter and picture recognition |
| Sound Detective | `#/unit/3/lesson/3?mode=practice&activity=sound-detective` | Initial sound decision |
| Catch the G | `#/unit/3/lesson/3?mode=practice&activity=catch-g` | Visual search |
| Big G or small g? | `#/unit/3/lesson/3?mode=practice&activity=big-small` | Case sorting |
| Fix the Word | `#/unit/3/lesson/3?mode=practice&activity=fix-word` | Missing initial letter |
| Trace & Say | `#/unit/3/lesson/3?mode=practice&activity=trace-say` | Guided motor tracing and oral practice |
| Final Challenge | `#/unit/3/lesson/3?mode=practice&activity=final-challenge` | Grammar transfer, letters and sound review |

Use `mode=class` for ordered classroom flow. The shell's Activities menu permits jumping to any game in either mode. The Lesson 3 activity list is registered in `data/units.js`; the lesson is available and unlocked.

## Engines reused

- `app/app-shell.js` and `app/router.js`: existing route, navigation, learner and Class/Practice behavior.
- `ToyBuddy` from `toy-buddy.js`: the supplied animated girl, poses, blink, waveform mouth cues and cancellable audio playback. No new mascot.
- `ActivityDrag` in `shared/activity-drag.js`: pointer lifecycle extracted from Lesson 2. Both Lesson 2 and Lesson 3 now call the same helper. Pointer cancel never drops a tile; the native click after a drag is suppressed without a timer.
- Existing global `traceCardHTML`, `bindTraceCard` and `TRACE_STROKES`: the original SVG tracing engine. Only G and g path data are added by the Lesson 3 module. The engine checks forward movement along each stroke and starts at the guiding dot; scribbling anywhere does not complete the letter.
- `LearningFeedback` and app audio tracking: click, placement, correct/retry and completion feedback. No parallel SFX/VFX engine.
- `LearningProgress` and `learning:activity-completed`: stable `3/3/<activity-id>` keys, 1–3 stars, best-score persistence and replay deduplication. Existing learner isolation stays intact.

## Differentiation and randomization

Every game offers Easy, Practice and Challenge. These change support rather than vocabulary targets. Every game also offers Student or Teacher mode; Class Mode starts in Teacher mode. Changing support or role starts a clean activity run.

- Meet: Easy visual model and labels; Practice less visual support; Challenge audio first with choices revealed after playback.
- Detective: Easy image/word support; higher levels hide image and written target until success, including the character bubble.
- Catch: Easy three items, Practice four, Challenge six mixed-case items with gentle movement. There is no timer. Reduced-motion preferences stop movement.
- Sort: Easy ghost examples and colored homes; Practice removes ghosts; Challenge uses matching monochrome homes. Duplicate letters have separate card IDs. Children can drag with mouse/touch or select a tile then tap its home.
- Fix: only the first letter is missing. Easy has a ghost g and two choices; higher levels add a distractor and Challenge removes the picture until the task is resolved. The full word is spoken on completion.
- Trace: strong path/dot and direction cue in Easy, dotted guide in Practice, lighter guide in Challenge. All levels retain a guide. G precedes g; the girl/guitar follow-up pairing varies on replay.
- Final: eight balanced yes/no rounds, two case recognition rounds and a sound-picture task. Challenge hides the written question and adds an optional reverse-role task. Teacher listens to the full question and selects what the child asked about; the character answers yes/no for the displayed item.

Meet introduces G, then g, then both words before its randomized review; it exposes each of G, g, girl and guitar twice. Detective includes four target and four review words, with both target words twice. A randomized backtracking scheduler avoids adjacent duplicate target items, rather than using an unrestricted shuffle that can leave duplicates at the end. Replay sequence signatures are checked; feasible rotations change a repeated sequence without introducing adjacent duplicate targets. Grammar truth is balanced and alternates; displayed objects do not repeat immediately. Tracing keeps the required G-then-g order, while varying the follow-up word pairing.

## Audio and phonics boundary

`assets/unit3/lesson3/audio/` contains 16 production Higgs V3 MP3s with the existing accepted Belinda reference: girl, guitar, capital G, lowercase g, six game instructions, oral-practice prompt, final instruction, Is it a girl?, Is it a guitar?, teacher-sound prompt, and the user-approved isolated-sound take 1. The manifest records text, duration, SHA-256, local Whisper transcript checks and Rhubarb waveform mouth cues. `tools/build_unit3_lesson3_audio.py` is an offline build tool, not browser code.

Existing Lesson 2 yes/no, toy-question and feedback clips and Lesson 1 toy-name recordings are reused. Playback is sequential and input waits for the audio promise. Next is manual. Muting permits a visual task to continue; leaving or backgrounding stops playback and invalidates old callbacks. No browser TTS fallback is introduced.

**The user listened to the three new Higgs auditions and explicitly selected take 1 on 2026-10-08.** That take is registered as `sound-g` with `humanReviewed: true`, its hash and review provenance. Transcript matching is used for words/instructions, not as phoneme approval. The isolated sample is used by the sound button, Sound Detective and the final sound task. The Letter · Sound · Words button plays capital G → lowercase g → approved /g/ → girl → guitar in sequence. A checked local teacher sound may replace the default for one activity; its Blob URL is revoked on replacement/exit. If the approved sample is absent, the sequence pauses for teacher modeling before the words. The old `assets/audio/sound-g.mp3` is not substituted. Audition 2 and the continuous audition sequence remain review-only, outside child playback.

Trace & Say and the final oral extension are teacher-guided/self-reported practice, not automatic pronunciation grading. No new child recording is uploaded to Cloudflare by this module. Teacher-supported oral rounds are labeled separately in the completion panel. Stars reward completing the practice activity and are not a claim of independent speech mastery.

## Asset provenance

- `girl` and `guitar`: now use the artwork supplied by the user on 2026-10-08. The embedded textbook girl and earlier generated guitar remain preserved; other lessons retain their existing art.
- Animated friend: existing `assets/toy-buddy/` girl sprites.
- Review toys/backgrounds and rewards: existing supplied assets.
- Earlier `guitar.webp`: preserved from the first implementation, now superseded in this module by the supplied guitar. The original PNG and generation prompt below remain as provenance of that earlier file.

Image prompt:

> Create one educational vocabulary cutout illustration for a preschool English learning app, depicting only a clearly recognizable acoustic guitar standing diagonally upright, full instrument visible, six strings, warm golden wood body, brown neck, soft glossy toy-like 3D cartoon shading, rounded friendly shapes, clean white sticker outline, no face, no character, no hands, no text, no letters, no other props. It will accompany existing colorful children's toy and classroom sticker illustrations. Transparent background. Centered with modest padding. This is new teaching illustration, not reproduction of textbook art.

## Verification

Run from the project root with a static server on port 8765:

```powershell
node tests/unit3-lesson3.spec.cjs
node tests/lesson2-assets.spec.cjs
node tests/navigation.spec.cjs
node tests/sentence-word-audio.spec.cjs
node tests/unit3-speech.spec.cjs
node tests/learning-rewards.spec.cjs
```

The Lesson 3 browser suite uses real MP3 playback at an accelerated rate, real SVG-path pointer movement and mouse dragging, native touch dragging and touch tapping. It checks all seven completions, replay scoring, all support levels, Teacher reverse-role task, balanced exposure, cleanup and viewport layouts. Transcript/hash checks establish clip content and integrity; they do not establish child speech accuracy or approval of an isolated phoneme.

Known boundary: the selected /g/ sample is user-reviewed, not a claim of a laboratory phonetic certification. Oral practice remains teacher-guided/self-reported rather than automatic speech grading. The extra audition files are not used in child playback.

## Supplied asset update – 2026-10-08

All 18 new user attachments are inventoried in `assets/unit3/lesson3/art/manifest.json`, including source SHA-256 and extraction bounds. `tools/build_gg_assets.cjs` makes 75 WebP assets without repainting the supplied illustrations. Duplicate-case filenames are avoided for Windows. Three sprite cuts remove only neighboring, disconnected alpha islands. There is a browsable `catalog.html` covering the entire pack.

| Screen | Artwork used |
| --- | --- |
| Lesson activity selector | Gg sign, headphones, letter bubble, letter home, missing g, pencil, trophy |
| Meet Gg | music-stage background, oversized supplied G/g and girl/guitar, Gg sign, sound and speaker controls |
| Sound Detective | listening-stage background, supplied objects, G SOUND / NOT G SOUND buttons |
| Catch the G | meadow background, supplied G/g/E bubbles, gentle movement |
| Big G or small g? | sorting garden, supplied letter homes and neutral black letter tiles; Challenge removes colored homes |
| Fix the Word | work table, supplied object and blank initial-letter slot; written answers remain hidden when required |
| Trace & Say | desk and paper artwork behind the existing SVG engine; supplied word cards after tracing |
| Final Challenge / results | meadow, supplied objects, reward stage, trophy and star images |
| Correct feedback | supplied check/sparkle pop beside the existing animated friend, outside the task text/buttons |

The extra guided-letter graphics are reference artwork in the catalog. The active tracing task retains its existing validated SVG coordinate paths and pointer checks. No supplied tracing bitmap is treated as an interactive engine.

The shared shell now accepts an optional activity image field, so Lesson 3 cards use the supplied art while older activities keep their original imagery. `data/units.js` is the only lesson registration changed.

Audio audition builder: `tools/build_gg_phonics_review.py`. Selected take registration: `tools/approve_gg_sound.py`. The review page identifies take 1 as selected and the other takes as review-only. Rebuilding the ordinary word/instruction bank preserves an approved sound only while its file hash matches the approval manifest.

Additional verification checks: all 75 asset hashes; 18-source provenance; 16 production clips, with human review metadata for the phoneme; the actual five-clip name/sound/word sequence; fallback teacher pause; no review-only clip in child playback.
## Phonics button visibility fix — 2026-10-08

Meet Gg now puts **Hear it all: G → /g/ → guitar → girl** above the matching cards, followed by **Hear the sound /g/**. The whole model uses four existing approved Higgs clips in that exact order. The isolated phoneme displays `/g/`, rather than the generation spelling. Explicit listen controls remain available after a blocked opening cue and after a correct answer; listening preserves Next and does not award points again. The lowercase name remains in its own matching round. Manual sound approval and teacher fallback are unchanged.

## Full letter introduction — 2026-10-08

Meet Gg opens with three teaching steps before the existing eight matching rounds. Letter Gg shows both supplied capital and lowercase art with individual Higgs name playback. Sound /g/ shows original front-mouth and side-tongue schematic drawings, a new Belinda Higgs mouth-guide instruction, then the approved take 1. Tongue lift/release uses actual sound media progress and resets when playback ends; this is a teaching illustration, not live lip video or pronunciation scoring. Girl and guitar are only shown after the sound step, with matching word clips. Children then choose Start playing. Previous step and Review Gg lesson retain the current game and saved stars.

Articulatory guidance was checked against the content creator's [Sounds American lesson on /g/](https://soundsamerican.net/article/consonant_sound_g_as_in_gift): back of tongue contact followed by a voiced release. SVG artwork in shared/phonics-mouth-g.js is drawn for this project; no third-party artwork was copied. The original Ee/Ff assets and engines are unchanged.

Intro validation: tests/gg-intro.spec.cjs checks actual sound-driven tongue lift/release, rejection of unapproved phoneme playback, and return from review without double-counting a correct round. The main Lesson 3 suite checks all three intro steps at six viewports in addition to all seven playable completions.

## Front-facing photo motion replacement — 2026-10-08

At the user's request, Sound /g/ now shows a generated front-facing photographic adult model instead of the side-tongue and lip diagrams. A four-frame sheet shows one portrait at a time, with preparation/release/neutral poses selected from actual Higgs playback time. The approved isolated take 1 is unchanged. The child view says Listen and copy; the old anatomical cues and mouth-guide speech are no longer in this step. The three-step letter, sound, then girl/guitar progression and all games are retained. This is animated generated photography, not a recorded real teacher video or a view of the hidden tongue contact. Provenance and generation prompt are in assets/unit3/lesson3/phonics/README.md.

Validation checks the delivered photo loads, the correct quadrant moves with real media time, playback resets to neutral, the human-approved sound guard remains enforced, and review retains the completed-round state. Lesson layout checks cover all six viewport sizes.
