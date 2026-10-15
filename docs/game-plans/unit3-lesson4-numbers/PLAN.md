# Unit 3 Lesson 4 - Number Play Studio

Updated 2026-10-15. Stage: implemented and locally checked; website delivery pending. User explicitly selected A: GCompris + Sugarizer as educational references, existing PixiJS + GSAP for rendering. Do not re-ask. Lesson placement confirmed.

## Implementation and evidence checkpoint

Six activities registered under Unit 3 Lesson 4 with the stable IDs below; previous routes/progress untouched. Six complete local playthroughs passed (six rounds each, relay eight turns), exact quantities/undo/no reel-like luck score, paired relay targets and best-star updates. All six activities tested at all five widths, not only the representative game. Touch target/overflow checks passed. Separate edge suite passed real browser recording with mocked AI unclear/correct/forged-transcript rejection, drag/undo/count retry, audio failure text continuation with no penalty, blocked Pixi fallback and exit cleanup. Speaking acceptance in the gameplay suite is simulated; it is not ASR accuracy evidence.

34 generated WebP assets, 8 Higgs number clips, 5 new sourced Kenney cues, asset manifest, browser catalog and source build scripts. Applied imagegen, frontend-design, interaction-design, design-critique; backend think-before-coding/error-handling/security/observability/testing skills read for the bounded AI contract extension. No external skills installed, no GCompris/Sugarizer code/art copied. Audio transcript checks passed; subjective timbre/mix review remains a user listening follow-up, not claimed complete.

Visual findings fixed: initial oversized source shelf tiles, box too small/off to the corner, stretched puzzle badge, background URL/repeat, canvas stacking, material-frame padding, persistent pop-up quantity, inactive controls at success. Gift uses independent lid and bow (not an implemented four-panel folding simulation); book uses independent paper tab with a seven-toy tableau. Six scenes and material assets replace old aircraft/train/reel/island motion. Motion source videos and timestamped screens in tests/number-studio-motion-video and tests/number-studio-*-motion-*.png. RAF frame observations are a headless browser sample, not rendered-FPS or classroom-device certification.

AI change: additive number-word contract only; stateless existing endpoint, classroom load remains under existing 90/min limiter; no schema, authorization, origin, upload-size, timeout or logging changes. Inputs validated against one through eight; correct number/digit only, no guessed homophones, phrases or teen numbers. Same response/error contract, no audio/transcript persistence. Repeated requests cannot award twice because game phase/epoch owns acceptance. Existing 419-case Worker, capture adapter and child-friendly speech regressions pass. Worker version 896d9328-0dc4-4713-aa3f-9ed26081279e verified deployed. Live generated-Higgs seven/eight positive and opposite-target negative cases passed; no child-voice accuracy claim. Empty initial prompt chosen after a live test caught number-vocabulary-list priming a whole count sequence. No expected target is supplied to recognition prompt.

User clarified the latest follow-up concerns the Numbers web games, not PowerPoint. No PowerPoint/Zalo action is part of this delivery.

## Goal and scope

Link spoken English, numeral, printed word and exact toy quantity: 7/seven and 8/eight, with 5/five and 6/six review. Initial proposed mix 2 target rounds to 1 review round; design setting, not a research claim. Six distinct activities, short repeatable rounds, practice scaffold separate from independent check. Car/balloon textbook scenes anchor the lesson; other toys only from taught vocabulary.

## Repository research - actual reads

1. GCompris official overview https://gcompris.net/index-en.html and schools page. Enumeration source inspected: src/activities/enumerate/ActivityInfo.qml and enumerate.js in https://github.com/gcompris/GCompris-qt ; latest inspected repo head 1d49ed1b397caca8243bd2b6bbc427a112219bda. Relevant activity is GPL-3.0-or-later per file headers. Concrete reference: organize objects to count, dataset-controlled quantity/type ranges, distinguish entered answer from target. This is an educational design reference; do not import Qt runtime or copy implementation. No copied code/art.
2. Sugarizer https://github.com/llaske/sugarizer ; inspected head 60ccdbcb004de1a706749c7314edfa0d160288b4. Read Abacus.activity/js/abacusbead.js and Memorize.activity/js/memorize-app.js, activity README/licenses. Abacus supports click and drag manipulations; Memorize models linked cards with text/image/sound and differing paired content. Root and these activity licenses Apache-2.0; third-party artwork has separate credits, so not automatically covered. References for dual input and cross-representation matching, not a new app shell. No copied code/art.
3. Phaser https://github.com/phaserjs/phaser inspected as alternative renderer/game framework, MIT. Inspected repo head 02d8931b626d9764c133cbb3fbf99966c03c757c is a research snapshot, NOT a selected stable runtime. Official https://github.com/phaserjs/examples warns code is MIT but example assets are NOT covered and default examples target dev builds. Pin a stable compatible release and verify APIs before adoption; use our own assets, not examples artwork.

## Two implementation approaches for user choice

A (recommended): educational interaction patterns from GCompris + Sugarizer, implemented in existing PixiJS/GSAP scene infrastructure. Actual use of renderer/timeline repositories; original lesson rules integrate via app adapters. Small integration footprint, continuity of audio/progress. Fresh visual direction and choreography, no reuse of old scene/timeline. Education repositories are design references, not installed packages or proof of learning outcomes. Existing Pixi MIT and GSAP vendor licenses retained.

B: same educational references + an isolated Phaser subscene for Lesson 4. Phaser native input/scene/tween facilities may suit reusable game scenes; requires a new lazy runtime and an audio/progress/accessibility/cleanup bridge. No app framework migration. More integration and delivered-size cost; not inherently better art/motion. Await user's choice before adding dependencies.

## Art direction and complete asset inventory

Toy Town Number Play Studio: illustrated felt, printed card, painted wood, stitched fabric; clear material hierarchy, broad readable shapes, restrained highlights, large open play surfaces. Distinct from Toy Machine mint cabinet/brass and previous aircraft/train/island/garden scenes. Shared fonts/navigation retained. No background motion while counting. No small decorative confetti as the main success feedback.

Every activity needs: layered background/midground/play surface/foreground, independently movable parts with specified pivots, own main action surface, listen/retry/confirm/undo where required, pressed/focused/disabled/pending/accepted states, count/word/numeral mounts, progress representation, end illustration and lesson thumbnail. Shared functional controls may use one new Lesson 4 kit; each game's props and scene are unique. All countable toys are separate transparent sprites; identity based on approved art, not unapproved substitutions. Proposed art assets are not yet generated.

| Activity | Dedicated visual set | Signature motion and learning result |
| --- | --- | --- |
| Number Parade | tabletop stage, eight count pedestals, toy components, numeral/word placards, fabric reveal flap | one-at-a-time toy entry into stationary positions; counted item marked; placard unfolds only after final count. Free exploration first, varied-layout numeral/word choices afterward. |
| Toy Detective | illustrated room layers, non-occluding toy sprites, selection ring, count tags, inspection tray | child taps to mark/unmark; at confirmation selected items slide to a tidy inspection row without changing quantity. No camera shake or moving targets. |
| Pack & Deliver revised as Gift Workshop | packing table, reusable trays, independent box bottom/front/back and four lid panels, ribbon strips/knot, order placard, remove bin | exact quantities packed; after correct confirmation box folds in physical panel order and ribbon wraps. Replaces proposed vehicle/conveyor finale to avoid prior delivery game motion. |
| Number Bridge revised as Number Snap | three-piece puzzle board, numeral/word/quantity mounts, keyed tile art and three matching piece types, drawer parts | three representations seat and lock into a single illustrated badge. No bridge/boat/island animation. Use open matching initially; reduced memory and optional hidden pairs only after learning. Shapes/color must not reveal correct answer. |
| Say & Launch revised as Say & Open | pop-up storybook base, separate page halves and crease layers, toy tableau, mic stand/control states, audio recovery surfaces | recognized number/phrase unlocks a short page-fold/pop-up scene; no aircraft or rocket. Child counts stable tableau before speaking; prize motion starts after acceptance and audio finish. |
| Toy Town Relay | two team work mats, task envelope, cloth pennant sections, emblem and mural tile layers, shared finish picture | equal turns, short learned task types; correct answers stitch/seat one mural piece into team's festival banner. No countdown pressure or racing vehicles; ties supported. |

## Learning and state logic

Provisional stable activity IDs to confirm at integration: number-parade, toy-detective, gift-workshop, number-snap, say-open, toy-relay under /unit/3/lesson/4. No pre-existing Lesson 4 progress IDs were found in data/units.js.

Per round: entering -> instruction/audio -> ready -> selecting/manipulating or recording -> checking -> retry/unclear/error OR accepted -> finite outcome motion -> next. Each toy has a unique ID; move/undo updates the exact set, not an accumulated tap counter. Difficulty changes between rounds, not during child input. Colors/positions balanced; answer target separate from prompt display and input. AI errors do not consume a valid attempt. First practice uses position/count supports; later check removes exact target slot count and verifies actual cardinality. Never infer mastery from assist-driven success.

Audio audit pending. Use approved Higgs identity for count names, number words, quantities, simple instructions and completion, review new takes before final audio acceptance. Keep existing Cloudflare path; no new provider or silent browser-voice substitution. SFX provenance to be selected per physical action; no reusing prior reel/train/plane cue bundle as this lesson's sound design.

## Skills and responsibility

Read/applied to proposal: product-brainstorming (earlier concept), frontend-design and interaction-design (art/input/state constraints). Planned, not yet executed: imagegen for all game-bound raster layers; design-critique for actual scenes and real-time recordings; testing/deploy skills as scope requires. No external skill installation performed. Read applicable full skill and official engine examples before implementation; record exact reference files actually used, not a list of package names alone.

## Delivery checkpoints

- [x] Textbook placement confirmed and current lesson registration checked.
- [x] Read education-specific sources; document reference versus runtime and asset-license boundaries.
- [x] Specify all six game asset sets and different signature motions; update concepts where they repeat prior games.
- [x] User selected A on 2026-10-15: education references + existing PixiJS/GSAP.
- [x] Art direction, reference atlases and representative scene reviewed internally; no separate user art-approval claim.
- [x] Generate game-bound assets, inspect crops/alpha/scale; create manifest/catalog.
- [x] Implement all six activities and registered routes/progress.
- [x] Higgs transcript/decode and sourced SFX technical checks; number-only AI contract and failure cases. Subjective ear approval remains a follow-up; phrase speaking not shipped.
- [x] Gameplay/progress/touch/capture/audio-ended/retry/fallback/cleanup checks.
- [x] All six at five widths; real-duration motion capture, frame observations and visual critique fixes.
- [ ] Public deployment only after implementation and checks; verify served source/assets and a real public playthrough.

Public release is not confirmed until the delivery entry below records served parity and public gameplay checks. No general smoothness, child-ASR accuracy or educational effectiveness certification claimed.
