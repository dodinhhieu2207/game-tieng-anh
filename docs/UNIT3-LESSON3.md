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

Meet exposes each of G, g, girl and guitar twice. Detective includes four target and four review words, with both target words twice. A randomized backtracking scheduler avoids adjacent duplicate target items, rather than using an unrestricted shuffle that can leave duplicates at the end. Replay sequence signatures are checked; feasible rotations change a repeated sequence without introducing adjacent duplicate targets. Grammar truth is balanced and alternates; displayed objects do not repeat immediately. Tracing keeps the required G-then-g order, while varying the follow-up word pairing.

## Audio and phonics boundary

`assets/unit3/lesson3/audio/` contains 15 new static Higgs V3 MP3s with the existing accepted Belinda reference: girl, guitar, capital G, lowercase g, six game instructions, oral-practice prompt, final instruction, Is it a girl?, Is it a guitar?, and teacher-sound prompt. The manifest records text, duration, SHA-256, local Whisper transcript checks and Rhubarb waveform mouth cues. `tools/build_unit3_lesson3_audio.py` is an offline build tool, not browser code.

Existing Lesson 2 yes/no, toy-question and feedback clips and Lesson 1 toy-name recordings are reused. Playback is sequential and input waits for the audio promise. Next is manual. Muting permits a visual task to continue; leaving or backgrounding stops playback and invalidates old callbacks. No browser TTS fallback is introduced.

**An isolated /g/ recording is not approved in this implementation.** The old `assets/audio/sound-g.mp3` is deliberately not silently substituted, and Higgs does not generate the isolated phoneme. The sound-model action tells children to listen to their teacher. In Teacher mode, a teacher may supply a short, already checked local audio file; its Blob URL lasts only for the activity and is revoked on replacement or exit. This avoids claiming a letter-name recording is a phoneme. The sound-detection games use the full-word Higgs recordings and teacher modeling.

Trace & Say and the final oral extension are teacher-guided/self-reported practice, not automatic pronunciation grading. No new child recording is uploaded to Cloudflare by this module. Teacher-supported oral rounds are labeled separately in the completion panel. Stars reward completing the practice activity and are not a claim of independent speech mastery.

## Asset provenance

- `girl`: reuses the original embedded textbook image `DATA.book.girlClose` from `index.html` unchanged.
- Animated friend: existing `assets/toy-buddy/` girl sprites.
- Review toys/backgrounds and rewards: existing supplied assets.
- `guitar.webp`: new teaching illustration because no guitar artwork was present in the project inventory. It is not described as textbook artwork. Generated through the built-in image tool, with the original PNG preserved in `assets/unit3/lesson3/guitar.png`; WebP is a resized delivery copy.

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

The Lesson 3 browser suite uses real MP3 playback at an accelerated rate, real SVG-path pointer movement and mouse dragging/touch tapping. It checks all seven completions, replay scoring, all support levels, Teacher reverse-role task, balanced exposure, cleanup and viewport layouts. Transcript/hash checks establish clip content and integrity; they do not establish child speech accuracy or approval of an isolated phoneme.

Known boundary: replace the generated guitar illustration only if a permitted original textbook guitar image is later supplied; a checked /g/ sample is still needed for autonomous isolated-sound playback. Teacher modeling is the implemented phonics fallback.
