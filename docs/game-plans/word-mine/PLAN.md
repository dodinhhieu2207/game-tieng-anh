# Word Mine — direct hook and letter assembly

Status: implementation. Approved stack inherited Phaser + GSAP; user request 2026-10-21 recorded in RULES.md.

Skills: interaction-design (aim/release, miss vs wrong, no blocking feedback), imagegen (separate open/closed claw and winch), frontend-design (scene-dominant layout, existing Outfit), design-critique (actual-size and motion review). Official Phaser geometry/input/particle and GSAP tween docs consulted; fontTools SVGPathPen for exact glyph outlines, not rasterized AI text.

Layer map: existing approved cave background -> separate winch -> rope -> dedicated claw open/closed -> three large gem bases -> individual glyph sprites. DOM word dock below scene contains exact faded glyphs; selected sprite detaches from stone and flies to that slot's live bounding rectangle, settles, then commits one letter. No answer list below scene. Native aim buttons and Drop remain for keyboard accessibility.

Interaction: tap/drag within scene to aim and release hook, or let it swing and Drop. Fixed-angle ray advances to actual first circular target intersection or cave boundary. No nearest-option lookup/autosnap. Correct -> close jaws / dust / weighted straight retrieval -> detach glyph / curved flight to current ghost slot / settle -> next letter. Wrong -> lift slightly / return stone / amber-red ring / brief specific retry. Miss -> empty return, no error penalty. Board contains target plus two distractors, all big and reachable without obscuring each other. Ill requires i/l/l separately.

States: loading, ready/aiming, casting, retrieving, slotting, reading, resolved, complete, paused; explicit retry for engine/assets/audio. One owner per tween/flight/voice. Resize preserves one commit and live slot target, reduced motion shortens paths without skipping outcome.

Checks: all dedicated assets loaded/hash-verified; correct/wrong/miss actual scene inputs; ghost letters/full word; repeated l and six-letter insect; rapid input; pause/hide/mute/restart/leave; five widths and >=48px targets; keyboard and touch; real-speed motion frames/video; Pond/audio/other lesson preservation; public parity/playthrough; Desktop mirror.

## Checkpoint — 2026-10-21
Local gates PASS: real scene correct/wrong/empty casts; all four words and separate i/l/l catches; glyph flight into ghost slots; five widths 320/390/768/1024/1366 with >=48px targets; touch; keyboard; pause mid-flight, resize/resume with exactly one commit; leave cleanup; Pond correct-catch regression. All 29 dedicated asset hashes and all approved Lesson 5 audio bytes verified. Existing hi-assets preservation gate passed. Mobile control wrapping corrected and final screenshots reviewed.
Evidence: tests/word-mine-direct.spec.cjs, word-mine-edges.spec.cjs, word-mine-assets.spec.cjs. Local Edge automated behavior does not establish classroom engagement or physical-device frame rate. Public deployment verification pending.

## Public release — f40d47b
GitHub Pages deployment succeeded. Public full four-word scene-input playthrough and touch/pause/resize/keyboard/leave/Pond regression passed. Initial deployment probe briefly saw incomplete CSS; repeated public tests after deployment and CDN readiness passed. All 29 published visual files match their manifests. Desktop mirror verified for the 44 release files. Route: index.html?release=f40d47b-mine#/unit/3/lesson/5?mode=practice&activity=word-mine. Status: delivered; classroom feel and physical-device performance remain for user review.


2026-10-29 whole-app upgrade LOCAL checkpoint: Word order now shuffled across all four words; first word differs from prior play in same page. Required glyph order inside each word unchanged, true misses still do not snap or penalize. Direct-cast test updated to assert actual shuffled model, all four distinct words and separate i/l/l catches. Full direct and edge suites PASS.
