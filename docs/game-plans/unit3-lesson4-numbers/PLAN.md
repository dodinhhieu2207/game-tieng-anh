# Unit 3 Lesson 4 - Number Play Studio

## Visual revision implementation — 2026-10-16

User requested skill-based review, correction and added assets/effects across this Numbers group. Existing PixiJS + GSAP choice retained. Read/applied frontend-design, interaction-design, design-critique and imagegen; checked official GSAP timeline/position-parameter documentation. No external skill installation or new engine.

Implemented: one scene-first stylesheet for all six activities, replacing the former stacked cream/plaque treatment; question and choices within the scene; compact progress; app-consistent controls and type hierarchy; scoped ordered entrance sequence. The actual shared runtime font is bundled App Outfit 700/800, verified through computed browser styles. Initial Baloo declarations in index.html are overridden by shared/app-typography.css; the earlier conversational claim of active Baloo was corrected. No global font change.

Gift Workshop: seven added generated assets include the quiet workbench, open box, lid, bow, wrapped gift, magnifier and award. Persistent source/inside slots replace wholesale DOM recreation. The same object moves through lift/travel/settle and undo, with pointer-following drag, tap/keyboard alternatives, front-wall occlusion, in-flight check guard, hinged lid and separate bow; subsequent rounds show completed gifts. Number Snap: chosen numeral/word/quantity visibly seats in its corresponding persistent piece. Say & Open: existing paper asset opens around its bottom hinge with DOM perspective; target toys retain their proportions. Detective: persistent found markers and new magnifier. Parade: stable count shelves and new award. Relay: visible cumulative team markers; original equal turns/scoring retained. The latter three are presentation/feedback refinements, not entirely new game mechanics or a completed room-search/construction redesign.

Assets: 7 additions in assets/number-studio/v2, existing 34 preserved, gallery now 41. Built-in imagegen; source/prompt briefs and rejected atlas variants recorded in v2/README.md. Crop/export only; generated alpha preserved. Existing approved toys, Higgs clips, SFX, speech Worker, routes and progress keys unchanged. The old stylesheet is retained as source history but is not loaded by this release; the new sheet is not an override stack on it.

Local evidence: full six-game playthrough/progress/five-width regression PASS; real capture with mocked AI unclear/forged/correct + audio/fallback/input edges PASS; new persistent-object, pointer journey/exit and all-six × five-width composition/font/image/touch suite PASS. Real-duration gift/book/puzzle capture PASS and browser-decoded frames inspected. Final book paper-surface adjustment and resolved-state spacing are presentation-only refinements; final capture/public verification is recorded in the delivery checkpoint when complete. Mock acceptance is not child-ASR evidence; headless observations do not certify classroom device FPS. User visual/engagement acceptance remains open; do not label this taste-approved merely because tests pass.

Public checkpoint: f2b66b5, GitHub Pages run 38827117983 succeeded. All 68 source/config/art/audio/font files matched public content. Full six-game gameplay/progress/five-width suite PASS on GitHub Pages, and the new persistent object/pointer/exit/all-six composition/font/touch suite PASS there too. Desktop copy synchronized. Subsequent cleanup removes invisible duplicate book sprites; the motion test now checks the actual seven visible DOM images and supports a public base URL. Local motion capture passed after that cleanup; final public parity/capture is recorded below when complete. Subjective user acceptance remains open.

Final delivery: e7ffebd (JS cache polish2), Pages run 38827596340 succeeded. Reverified all 68 public files, including actual bundled fonts and all seven added WebP assets. Real-duration Gift Workshop / Say & Open / Number Snap capture passed against that final public URL; the seven visible DOM toy images are checked directly. Full six-game gameplay/score and all-six × five-width font/layout/interaction checks above ran on f2b66b5; e7ffebd only removes unused hidden duplicate book sprites and changes the associated test/cache key. No visible learning/input rule change. Review captures: tests/number-polish-<activity>-<width>.png, tests/number-studio-*-motion-*.png and tests/number-studio-motion-video. Desktop source mirror synchronized. Public lesson URL: https://dodinhhieu2207.github.io/game-tieng-anh/index.html?release=e7ffebd-polish#/unit/3/lesson/4?mode=practice . Gallery: assets/number-studio/catalog.html. No subjective child engagement, classroom device smoothness, new voice approval or child-ASR certification is asserted.

## Design checkpoint reopened — 2026-10-16

The user reviewed all six games and finds the experience stiff, unfinished and insufficiently engaging. The previous functional delivery evidence below remains valid only for its stated checks; it does not establish visual/motion acceptance. See [the current design review](DESIGN_REVIEW_20261016.md) for screenshot/source findings, per-game revisions and the Gift Workshop reference brief. The existing PixiJS + GSAP choice stands; do not ask again. This review changes documentation only; the redesign is not yet implemented or deployed.

Updated 2026-10-15. Stage: implemented and verified on GitHub Pages, release 186a632. User explicitly selected A: GCompris + Sugarizer as educational references, existing PixiJS + GSAP for rendering. Do not re-ask. Lesson placement confirmed.

## Public delivery

PASS. Functional release 186a632; Pages run 38750946294 succeeded. Public parity verified 57 source/config/art/audio files, including the 34-image catalog. Unit 3 -> Lesson 4 -> Gift Workshop navigation opened correctly with six activity cards. Full six-activity suite passed against actual GitHub Pages: complete rounds/progress, correct numeral-word-quantity logic, equal relay points, all six games at five widths, touch, undo/retry, reduced motion and cleanup. AI acceptance is mocked in that gameplay suite; separate live Cloudflare checks used generated adult Higgs seven/eight clips, accepted correct targets and rejected opposite targets. Worker deployed version 896d9328-0dc4-4713-aa3f-9ed26081279e. Desktop mirror synchronized.

Number Parade's first two rounds additionally model one-to-one counting: independently reveal each toy, wait for the corresponding Higgs count word to finish, then allow the child's numeral/word choice. Subsequent activities practise the same quantities through different representations. No single score is presented as proof of general mastery. Subjective audio timbre review and real-child ASR/classroom effectiveness remain unclaimed.

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

Registered stable activity IDs: number-parade, toy-detective, gift-workshop, number-snap, say-open, toy-relay under /unit/3/lesson/4. No pre-existing Lesson 4 progress IDs were replaced.

Per round: entering -> instruction/audio -> ready -> selecting/manipulating or recording -> checking -> retry/unclear/error OR accepted -> finite outcome motion -> next. Each toy has a unique ID; move/undo updates the exact set, not an accumulated tap counter. Difficulty changes between rounds, not during child input. Colors/positions balanced; answer target separate from prompt display and input. AI errors do not consume a valid attempt. First practice uses position/count supports; later check removes exact target slot count and verifies actual cardinality. Never infer mastery from assist-driven success.

Eight Higgs number words and five sourced SFX are implemented; exact texts, hashes and technical checks in the asset README/manifest. Instructions remain accessible English text; this release does not claim a newly voiced full instruction/quantity-phrase bank. Same Cloudflare provider; no silent browser-voice substitution or reuse of previous reel/train/plane cue bundle. Ear-based acceptance remains a listening follow-up.

## Skills and responsibility

Read/applied: product-brainstorming (concept), frontend-design, interaction-design, imagegen and design-critique; backend contract skills listed in the implementation checkpoint. Native browser decoding reviewed eight timestamped frames from real-duration motion video. No external skill installation performed; do not label planned engineering plugins as used.

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
- [x] Public deployment, 57-file parity, navigation and full public playthrough suite.

Public delivery evidence is recorded above. No general smoothness, child-ASR accuracy or educational effectiveness certification claimed.
