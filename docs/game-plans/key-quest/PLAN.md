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

## 2026-11-12 user screenshot correction — chest depth
User correctly identified open lid/reward composition still looked wrong. Earlier geometric placement QA did not verify depth/occlusion. Root causes: open lid shrank to .36 height, and entire opaque chest interior was rendered above the reward (cutting off the key). New native UI regression `tests/key-quest-depth.cjs` went RED on old source: lid proportion .415 of source, interior above reward, no separate front wall.

Fix: derive a front-wall texture from the approved base PNG at source y=130 (no replacement artwork); order interior → open lid → reward → front rim/wall → lock. Open lid retains height (.92) and narrows by .2 toward the rear, bottom contacting rear rim within 8 virtual pixels; no floating flattened board. Closed lid still covers opening. Reward hit area extends over its whole silhouette. Derived texture is activity-owned and disposed without destroying the shared source. No audio, lesson sequence, route or progress change.

Targeted regression GREEN: open lid proportions, rear-rim contact, depth ordering and whole key bounds above front edge. Screenshot `tests/key-quest-depth-key.png` reviewed. Full-loop and input edge checks rerun before delivery.

## Public delivery checkpoint
2026-11-12: commit e8919073f8d86dffb578bf7bdc24b17e90d2a2f3 pushed to origin/main. GitHub Pages run 43139057335 completed SUCCESS. Served source verified Key Quest registration, exact-tip key pivot and per-word highlight. `KQ_URL=https://dodinhhieu2207.github.io/game-tieng-anh/index.html?release=e891907#/unit/4/lesson/5?mode=practice&activity=key-quest node tests/key-quest-browser.cjs` PASS: four native rounds, wrong retry, mouse key/turn/lid gestures, Higgs native playback, collection/progress once, replay, five widths and leave cleanup. Separate local edge test passes keyboard, emulated touch, reduced motion and audio failure/retry/pause. Public source/runtime feature committed; this post-deploy QA note stays local until a future scoped commit to avoid triggering another Pages build solely for notes.

Public fix verified: commit 7dff4af8c6bd40532f47474d5ffd65e9f31028ad, Pages run 43140343017 SUCCESS. Native public `tests/key-quest-depth.cjs` PASS with release=7dff4af: lid proportions/rear contact, depth order, entire key above front rim. Local full four-round/five-width and input/audio edge suites PASS. Post-deploy evidence note retained locally for next scoped commit.

## 2026-11-12 key insertion/rotation correction
User screenshot correctly shows an unrealistic side-on key orbiting the lock. Test `tests/key-quest-key-turn.cjs` reproduced RED (no front-view handle). Keep original key art in tray/drag; after its tip reaches the socket, fade the shaft into the lock and expose a front-view handle derived from the approved key texture (first 300 source pixels). Raised-handle shadow, fixed (500,499) axis, live matching letter. Angular drag rotates only the handle, not the long shaft; both directions supported, incomplete turn returns to rest. Keyboard/tap action performs the same quarter turn. Unlock click plays after reaching the stop. Before lid opens, handle returns to withdrawal angle and fades out as key is removed. This is stylized 2D projection, not a physical 3D simulation.

Local targeted test GREEN: side-key angle stays zero, inserted front handle fixed at socket, quarter-turn angle correct, complete insertion. Own cropped bow texture disposed without releasing shared key source. Existing voice, curriculum, chest depth correction and progress retained.

Insertion refinement: side-view shaft and bow slide toward the fixed hole behind a world-space mouth mask; the front-view handle replaces the side projection progressively. Mask is removed from each tray key on the next round/reset. Front handle shadow adds separation from the escutcheon. No long-key rotation or orbit. Native full four-round/five-width test and input/audio edge test pass; actual turn screenshot `tests/key-quest-axis.png` reviewed.

## White-mask regression correction
2026-11-12 user screenshot exposed an actual rendering regression introduced by the insertion mask: the unbound white Graphics mask was added to the scene and rendered as a rectangle. Earlier state/angle tests did not inspect rendered pixels. `tests/key-quest-mask.cjs` reproduced RED (99.5% of left scene pure white). The mask now stays detached except while actively bound during insertion; on completion, unbind first and remove it from the scene; next/reset also detach, disposal explicitly destroys a detached owned mask. No global renderer workaround or art changes.

Pixel-level native UI regression GREEN: initial frame, after insertion, two next-round transitions and restart have no white overlay. Fixed-axis key-turn regression also passes. Screenshot evidence `tests/key-quest-mask-{initial,inserted-0,next-0,next-1,restart}.png` remains local. Public verification pending.

Public key-axis fix verified: commit 4de7459c50ad8f16e5a97f0abdbfecd87a3636fb, Pages run 43141252037 SUCCESS. Targeted native public key-turn regression PASS with release=4de7459. Local video of insert/turn reviewed via sampled frames (`tests/key-quest-axis-video/`, `tests/key-quest-axis-motion.png`); no whole-key orbital rotation. Input/audio edge suite passes after insertion mask refinement. Post-deploy QA note remains local for next scoped commit.
