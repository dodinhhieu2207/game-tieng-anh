# Unit 3 Lesson 6 â€” Story Studio first-scene sample
Status: sample implemented; release verification. Date: 2026-10-22. Boundary: one reviewable scene; other three scenes and full AI roleplay remain pending.

Source: user's Class Book 2nd Edition in Desktop/starter, page 27 (PDF index 27), Lesson Six Story, Is it a robot?, track 46. Reference crop created via native PDF rendering; original files untouched. Copy.md is actually a duplicate PDF binary, not usable text. No original track 46 in folder.

Art direction: faithful clean 2D storybook adaptation, warm ivory #fff9ec, coral #e97c72, mint #79bca7, navy #164573, existing Outfit. Landscape 3:2 scene keeps mother/dad/older boy/toddler and closed yellow gift. Thin coral/ivory generated frame over scene; transparent speech artwork, teal speaker, green/coral answer assets. Separate gift object shown in selected-object dock and motion preview. No nautical/bamboo theme reuse.

Stack: existing local Phaser 3.90 scene/particle textures plus GSAP for owned one-shot motion, accessible DOM overlays for scene touch and answers. Source patterns: existing local engines, Phaser scene/input/particle APIs and GSAP owned tween patterns already verified in project. License/provenance in shared/vendor. No dependency upgrades. Skills read/applied: imagegen, frontend-design, interaction-design, design-critique.

States: loading -> explore (touch present/teddy) -> listening (practice question) -> answer -> replying -> resolved; pause/resume, retry art/audio, leave. Task: touch the visible teddy, listen to Is it a teddy?, answer Yes, it is. This is a preview practice exchange based on story context, not original track 46. Wrong No gives gentle retry and no points. Explore present shows the closed gift detail. No robot reveal in scene 1; no made-up extension to story.

Audio: existing assets/unit3/lesson2/audio/questions/is_it_a_teddy.mp3 and answers/yes_it_is.mp3, plus existing teddy name. Exact source hashes recorded in sample manifest. Kenney RPG Audio bookFlip2 CC0 page-turn for mode transition, license copy retained. No new story voice generated until exact original transcript is checked.

Layers: faithful scene image -> Phaser brief attention/success particles -> generated transparent frame -> DOM target rings matching actual rendered present/teddy -> generated speech/control art -> selected present cutout. One owner per Audio/GSAP tween/engine/listener, kill/stop on leave; hide pauses, calm removes flourish.

Gates pending: reference-vs-scene content inspection, alpha/crop/asset hashes; real touch/keyboard choice, audio/mute/pause/failure paths, no progress writes; five widths and real-speed motion review; public asset parity/sample and Desktop sync. Stop at this sample and request visual feedback before expanding remaining scenes.

## Implemented sample checkpoint

- Added isolated Story Studio route `#/unit/3/lesson/6?mode=practice&activity=story-preview`; Lesson 6 visibly labelled Scene 1 preview.
- Seven generated raster assets exported as WebP and connected to the running interface; source identities/outfits and closed yellow/pink present visually reviewed. Dedicated asset catalog and provenance are shipped beside the assets.
- Touch teddy → actual existing practice question → choose Yes/No. No gently retries; Yes plays the answer and shows the familiar teddy detail. The present is a separate closed-gift exploration hotspot. No full-story transcript or speaking score is claimed.
- Phaser attention/short particles and GSAP detail entrance own their lifecycle. Pause/resume, reduced motion, leave cleanup, explicit image retry and audio-unavailable fallback implemented.
- Local `tests/story-sample.spec.cjs` passed actual audio path, answer flow, wrong choice, reveal/reset, five widths (320/390/768/1024/1366), 48px targets, reduced motion, leave cleanup, failed image retry and failed-question audio. Existing I-cue duration/playback regression passed.
- Remaining: public release verification and Desktop mirror, then stop for first-scene review. Remaining three scenes, original track 46 and full games are not delivered by this sample.

Final pedagogy correction: the question points to the visible teddy. Yes is correct; No gently retries. The closed present is an optional exploration hotspot, not a hidden-object guessing test.

Release a5b6fc0 pushed; first-scene files mirrored to Desktop with zero hash mismatches. Public verification pending deployment.

## Public review gate

Public a5b6fc0 Story Studio test passed, including actual successful question and Yes-answer playback, first-scene touch flow, retry/reveal/reset, five widths, reduced motion, leave cleanup, image retry and audio failure. Public scene WebP byte parity checked. Sample boundary reached: stop for user visual feedback, not full Lesson 6 acceptance.

## Four-scene story extension — authorized 2026-10-22
User supplied 76.974-second MP3. Keep approved Phaser + GSAP and generated frame/buttons. Generate panels 2–4 using textbook panels plus first-scene style reference. Use native audio cuts with source hash/timestamps; do not replace with TTS. Keep route `story-preview`/key `u3storypreview` stable but rename card Story Studio.
Scene flow: listen to source → listening-comprehension Yes/No in scenes 1,2,4 (answers No,No,Yes); scene 3 touch present → scene-specific focus/feedback → Continue. No hidden-object independent inference or ASR score. Correct reply uses the source answer clip. Complete final scene → replay story. The first 15.8 seconds are excluded from scene playback; complete original remains in user's Downloads.
Transitions: scene crossfade, short focus ring, reward near target, response text, source answer, then explicit Continue. Scene 3 spotlight present; final scene robot spotlight. No claim that static character artwork has skeletal animation.
Lifecycle gates: guarded async tokens, cancel audio/tweens on reset/leave, pause/hide, reduced motion, muted read/continue path, explicit audio retry. Five widths, actual audio success and ended gating, scene progression, final replay, double-tap prevention, image retry, voice failure.

Implementation checkpoint: three generated panels inspected against source, including scene 3 toddler on closed gift and final blue robot/open gift. Four-scene native audio cuts and answer replay attached. Existing preview route/key preserved. First-scene script retained as historical source but no longer loaded; story-reader.js is the active implementation. Real-time playback/progression QA running.

Local release gate: `tests/story-reader.spec.cjs` passed all four scene recordings and three answer clips at natural playback speed, using actual media-ended events before enabling choices/Continue. Recorded real-speed video in tests/story-reader-video. Scene feedback and five-width screenshots visually inspected. Pause held audio time stable; reset stopped owned audio; reduced motion and leave cleanup passed; missing panel retry and audio-error/blocked Continue passed. I-cue regression passed. No ASR or new progress reward introduced.

Public release 470d206: Pages completed successfully. Natural-speed four-scene test passed on public URL, including all actual scene/answer audio-ended gates, Continue/final replay, five widths, pause/reset/reduced/leave and error recovery. Public scene-02/03/04 WebPs and scene-01/04 MP3s matched local SHA256 bytes. Desktop mirror of changed release files had zero hash mismatches. Authorized four-scene image/audio scope delivered; additional standalone games and AI speaking are outside this change.

## Motion extension — user approved 2026-10-22
Use supplied MP4 as motion reference, not a replacement embedded movie. watch-video skill extracted 16 timestamped frames; existing MP3 alignment reused without a second transcript. Observed actual character animation: gift held up near ear, Billy on gift, lid/opening close-up and robot/family response. Keep approved artwork/style and four-scene route/questions/audio.
Imagegen prepares clean background plates and isolated actors for existing Phaser scene. GSAP paused timelines sampled from audio currentTime drive short anticipation/settle, listening sway, Billy bounce and mechanical robot response; no unsynchronized infinite bobbing. Reduced motion fixes actors in place. Pause/hide/mute/reset/leave stop updates; source answer audio remains separate. Do not claim lip sync or full skeletal reconstruction from static cutouts.
Motion source review evidence: C:/Users/Admin/.cache/lesson6-motion-review/meta.json and frames. Native user MP4 left unchanged. Pending art registration/occlusion review, actual movement/pause/replay tests and public deployment.

Motion art registration checkpoint: eight exported WebP layers reviewed in running scene. Connected boy+gift actors in scenes 1/2, Billy-only actor over closed-gift plate in scene 3, connected boy+robot actor in scene 4. This bounded cutout version does not reconstruct lid opening, independent robot joints, blinking or lip sync. Native video provided motion references, not extracted production sprites. All four rigs changed actor transforms while keeping background stationary; actual audio clock/pause/reset/reduced/leave tests passed. Explicit synchronous rig disposal fixes deferred Phaser shutdown cleanup.

Local motion release gate: story-motion.spec passed all four moving actors over stationary plates, actual audio clock progression, pause-held transforms, resume, reset to base pose, reduced static mode and synchronous leave disposal. Natural-speed four-scene story-reader.spec passed with motion enabled, including original answer-ended gating, five widths and failure paths. I-cue regression passed. Real-speed recordings stored under tests/story-motion-video and tests/story-reader-video. Public gate pending.
