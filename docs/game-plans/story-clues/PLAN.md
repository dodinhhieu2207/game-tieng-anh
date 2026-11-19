# Story Clues — Unit 4 Lesson 6

Updated: 2026-11-19. Status: local implementation verified; scoped release preparation.

## Scope and learning goal

The user requested a separate new game and its own asset set after the Your Turn speaking upgrade. Practise listening comprehension using the supplied My brother story audio and approved book panels. Preserve all existing activities, audio, character artwork, routes and progress. New route: `story-clues`; new progress key: `u4storyclues`. Registered in the existing Lesson 6 catalogue.

The child hears an introduction and chooses its matching book scene. A second sequence uses longer original scene excerpts. Three targets: grandpa, mum and brother. Shuffle panel positions on every round and shuffle targets within each three-round sequence. Start with two options, then use three. Keep text answers hidden before a correct choice. Do not treat a generic greeting shared across scenes as a uniquely identifying clue. This game complements Your Turn; it does not add another microphone assessment.

## Stack decision

Approved stack: HTML + GSAP. On 2026-11-19 the user replied "Ok tôi đồng ý làm" to the final recommendation of HTML + GSAP. Use native accessible HTML buttons and local GSAP 3.15.0 through the existing LearningMotion scoped lifecycle; https://github.com/greensock/GSAP, Standard License (local license retained). PixiJS + GSAP was the alternative, not selected. No app framework rewrite.

Skills read and applied: imagegen (original supporting raster assets), interaction-design (audio-ended gating, retry and state flow), frontend-design (art direction), design-critique (actual rendered screenshots and temporal motion frames). GSAP is used through the existing local runtime and LearningMotion owner. No claim that an external gsap-skills package was installed.

## Art direction and assets

Warm family-home listening corner, matte hand-painted gouache, ivory paper, honey wood, mint and coral. Font inherits `var(--app-font)` from the current app. Live computed font is Learning Fredoka with App Outfit fallback; headings inherit the app's Learning Display. This is the existing global playful theme, preserved rather than changing global typography for one game. Central story imagery occupies most of the available space. New artwork supports the original book panels; no character redraws or painted numbers over characters.

New files in `assets/unit4/lesson6/story-clues/`:

| Asset | Intended use | Current status |
| --- | --- | --- |
| listening-corner.webp | Quiet room/display background | Integrated and browser reviewed |
| headphones.webp | Primary Listen control | Integrated and browser reviewed |
| button-plaque.webp | Main action button artwork | Integrated; transparent gutter corrected |
| next-arrow.webp | Continue control | Integrated and browser reviewed |
| success-star.webp | Correct choice/reward marker | Integrated and browser reviewed |
| listen-again.webp | Retry/replay control | Integrated and browser reviewed |
| confirmation-halo.webp | Correct card lighting overlay | Integrated and browser reviewed |
| controls-source.png | Transparent UI sheet provenance | Saved |
| activity-cover.webp | Lesson activity catalogue card | Runtime scene capture; integrated |

Original character panels: reuse `../clues/scene-1.webp`, scene-2, scene-4. Character pose motion: N/A, characters are static textbook artwork and must retain identity. Any future frame animation must be separately authored and tested; do not claim a static-image zoom is character motion. GSAP handles brief card entry, correct-picture focus and confirmation-art appearance. Reduced motion uses static feedback. No background music during comprehension cues. Kenney CC0 correct.wav plays only after the original reply ends; source/license remain in assets/playful-foley. No new spoken voice is required.

## Audio manifest

Source: the teacher-supplied `Unit 4 -- This is my mum -- Video hội thoại - YouTube.mp3`, provenance and source intervals already documented in `assets/unit4/lesson6/audio/SOURCE.md`.

| Target | Familiarisation clue | Longer clue | Matching panel |
| --- | --- | --- | --- |
| grandpa | grandpa.mp3 | scene-1.mp3 | scene-1.webp |
| mum | mum.mp3 | scene-2.mp3 | scene-2.webp |
| brother | brother.mp3 | scene-4.mp3 | scene-4.webp |

No new TTS used. Existing supplied recording is expressly required by the user. New voice, if subsequently needed, must use approved Higgs. Word highlighting after reveal follows the existing measured model-clip marks and Audio.currentTime. Captions stay hidden during a scored clue. See assets/unit4/lesson6/story-clues/audio-manifest.json for clip hashes and onsets.

## State flow and checks

Ready -> listening (input gated) -> choose after audio ended -> retry or correct -> authentic continuation/reveal -> Continue -> next round -> completion. Retry keeps the same target; replay always available after playback finishes. Audio failure/mute/hidden tab must not unlock an unheard round or award points. Two unsuccessful choices may offer a visible hint, with support recorded separately from independent first-choice success. No speed penalty.

Reduced motion: static highlight, no camera movement. Keyboard: focusable real buttons and visible focus. Leave/hidden tab/mute: cancel audio, transitions and pending callbacks. Replay: reset state and randomize options; preserve the existing app progress contract.

## Checkpoint

- [x] Existing Lesson 6 story controller, speaking controller and supplied-audio manifest inspected.
- [x] Original book panel inspected; existing character art will be retained.
- [x] Background and six UI/VFX assets created and exported into the project.
- [x] Alpha confirmed and individual assets reviewed at rendered scale; crop gutters corrected.
- [x] User stack selection recorded.
- [x] Gameplay, catalogue entry and source integration in shared/story-clues.js, shared/story-clues.css, data/units.js and index.html.
- [x] Audio-ended/retry/mute/error/leave/progress tests: tests/story-clues.cjs passed with actual local MP3 playback. Six rounds cover every target in each sequence. Only simulated network failure is injected; success audio is native playback. Verified persisted 4/6/story-clues completion and stars, single completion event, restart and supported/first-attempt summary.
- [x] Browser visual review at 320, 390, 768, 1024 and 1366 px; no horizontal overflow. Phone <=430px now stacks readable large panels and preserves backdrop proportions. Touch input also exercised in Chrome mobile emulation.
- [x] Motion recording and design critique: tests/story-clues-motion.cjs passed at native playback speed. Frame samples show scale changing from 1.0068 to 1.035; sentence word glow, authentic reply and subsequent CC0 SFX verified. Reduced-motion branch and cancelled owner checked. Seeded restart test produces varied panel permutations.
- [x] Existing tests/unit4-story-release.cjs passed for the four preserved activities, source audio and leave cleanup.
- [ ] Publication: proceeding after the user's continuation request on 2026-11-19. Scope is this new game and its catalogue entry. Verify the clean staged snapshot before push, then the served GitHub Pages source and actual public game. Do not include unrelated Number Repair or other game work.

## Release boundary

Baseline: main at 21b9a3c (published Your Turn). Expected changes: new story-clues controller/style, its artwork/provenance, two focused browser tests, game plan, catalogue entry and two script/style includes plus catalogue cache version. Existing supplied story pictures/audio, app routing and speech backend are reused. No database or backend change. Rollback, if a reproducible critical gameplay failure appears, must revert only this game's release commit; preserve unrelated local work and learner progress. Browser media/API failures require diagnosis, not a silent replacement voice.

Pre-release checkpoint: exported the staged Git index to an isolated local snapshot, retaining the published Number Repair versions in that snapshot. tests/story-clues.cjs passed against port 8769 (six real-media rounds, five widths, input/error/lifecycle/progress checks); tests/unit4-story-release.cjs also passed there for preserved activities. The new tests accept an explicit base URL and evidence output folder so the same checks can run against GitHub Pages. Public build and public runtime remain pending at commit time.

## Local review evidence

Chrome browser artifacts: `%TEMP%/story-clues-review/`. Five-width screenshots, correct/final/complete screenshots, motion-wordglow.png, motion-focus.png, motion-settled.png, motion-evidence.json and story-clues-motion.webm. The video is a silent browser capture; audio playback was verified through native playing/ended events separately. Initial visual review identified thin-looking buttons caused by transparent sheet gutters and small phone panels; both were corrected. Local URL: http://127.0.0.1:8768/index.html?dev=storyclues1#/unit/4/lesson/6?mode=practice&activity=story-clues . The connected in-app browser could not be opened because browser access is unavailable in this chat; Chrome automated runtime tests ran successfully.

Classroom learning outcomes remain unmeasured.
