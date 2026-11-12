# Key Quest — Unit 4 Lesson 5

2026-11-12. Status: implemented, local functional/edge QA complete; delivery pending.

## Approved scope
User approved starting the proposed first game: Key Quest. Route `#/unit/4/lesson/5?mode=practice&activity=key-quest`, progress `u4keyquest`. Four words kangaroo, key, lion, lollipop. Four rounds, first two supported by initial letter, later two listening/word recognition. Both letters appear in both halves. Replay reshuffles rewards and keys.

## Design
Mint #4ba995, honey #efb74c, coral #ed8067, ink #194b60, sky #c9eef2. App Outfit for DOM and Pixi. Large central chest on a quiet workbench; key tray below, collection shelf above. Only one primary instruction. No dashed card borders.

Layer map: background/workbench; separate chest base and hinged lid; glow behind lid; separate lock; separate key sprites with live letter labels; four isolated reward sprites; labelled collection places; owned sparkles and contact shadow. Asset generation via built-in imagegen, alpha kept in project. Raster artwork is not replaced by primitive geometry.

State flow: loading → hear → choose/drag → wrong return OR seat key → turn (drag arc or accessible action) → lift lid (drag or accessible action) → reveal → Higgs word → touch reward → shelf → next → completion. Cancel outside drop, pointercancel, pause/background/leave and asset/audio failure paths explicitly owned. Reduced motion keeps state changes and gestures, removes flourish.

## Repos and skills
Runtime: existing local PixiJS 8.22 (MIT), GSAP 3.15 (existing project licence). Hexi reference for action sequencing, curved travel and sprite ownership, not imported as a second engine. KAPLAY reference for component/game flow, not installed. Pixi Filters/Sound and Howler considered: existing local renderer glow and native app audio suffice initially; do not claim unused libraries installed. New SFX reuse licensed project Foley with per-action envelopes; speech exclusively Higgs local cached model/reference.
Read/applied skills: imagegen, frontend-design, interaction-design, design-critique. Skill responsibilities: asset generation; art/layout; gesture/state/feedback; actual screenshot/video review. Existing E/F tracing is out of this game's scope.

## Checkpoints
- [x] Scope, stack and gesture sequence recorded.
- [x] Generated layered asset inventory, alpha and licence manifest.
- [x] Higgs catalogue generated and actual native media playback checked. Four words and K/L names; no phoneme claim, no human listening certification.
- [x] Direct input, retry, hint progression and replay.
- [x] Responsive five widths, keyboard/emulated touch/reduced motion, cleanup/progress.
- [x] Actual motion recording and design review.
- [ ] Delivery status and limits reported.

## 2026-11-12 implementation evidence
- Own background, base, lid, key, lock and four rewards, cover: 10 raster exports, three original generated sources. Alpha/hash QA passes; small source-sheet spill removed with measured quadrant crops. Font verified App Outfit; mobile keys enlarge their labels independently of the canvas scale.
- Native UI test completes four rounds with real mouse drag, wrong return, rotate gesture, lid pull, real Higgs playback/ended gates, exploration and shelf collection; one completion award. 1000 seeded curriculum plans preserve K/L balance and replay variation.
- Additional emulated touch + keyboard Enter, reduced motion, MP3 abort/retry, pause/resume highlights and route cleanup pass. No live child/classroom evaluation or physical tablet certification.
- Design critique from actual screenshots/video: initial lid was behind the base (looked already open), now closed lid covers opening and rises to rear rim without floating gap. Seated key pivot is at its tip (500,499), behind lock; same point owns turn animation. Initial cropped reward key lost bow: measured crop fixed. Single-word glow targets the word actually spoken; key names do not light an unrelated target word. Collected rewards travel to the scene shelf, with kangaroo hops/lollipop turn/key turn/lion toy tilt.
- Evidence: `tests/key-quest-{ready,320,390,768,1024,1366}.png`, reveal screenshots, actual browser WebM under `tests/key-quest-video/`, sampled motion sheet. These large QA artifacts remain local, not runtime dependencies.
- Regression note: `tests/navigation.spec.cjs` stops at pre-existing Unit 3 title expectation `Listen & Decide`; baseline HEAD already calls it `Toy Machine`. Test not rewritten in this scoped feature.
- References: https://pixijs.com/8.x/guides/components/events and https://gsap.com/docs/v3/GSAP/gsap.timeline()/ checked for native event/timeline ownership; Hexi and KAPLAY are references, not bundled engines.
