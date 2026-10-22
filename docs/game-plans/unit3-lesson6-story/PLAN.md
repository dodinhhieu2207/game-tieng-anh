# Unit 3 Lesson 6 â€” Story Studio first-scene sample
Status: art / implementation. Date: 2026-10-22. Boundary: one reviewable scene; other three scenes and full AI roleplay remain pending.

Source: user's Class Book 2nd Edition in Desktop/starter, page 27 (PDF index 27), Lesson Six Story, Is it a robot?, track 46. Reference crop created via native PDF rendering; original files untouched. Copy.md is actually a duplicate PDF binary, not usable text. No original track 46 in folder.

Art direction: faithful clean 2D storybook adaptation, warm ivory #fff9ec, coral #e97c72, mint #79bca7, navy #164573, existing Outfit. Landscape 3:2 scene keeps mother/dad/older boy/toddler and closed yellow gift. Thin coral/ivory generated frame over scene; transparent speech artwork, teal speaker, green/coral answer assets. Separate gift object shown in selected-object dock and motion preview. No nautical/bamboo theme reuse.

Stack: existing local Phaser 3.90 scene/particle textures plus GSAP for owned one-shot motion, accessible DOM overlays for scene touch and answers. Source patterns: existing local engines, Phaser scene/input/particle APIs and GSAP owned tween patterns already verified in project. License/provenance in shared/vendor. No dependency upgrades. Skills read/applied: imagegen, frontend-design, interaction-design, design-critique.

States: loading -> explore (touch present/teddy) -> listening (practice question) -> answer -> replying -> resolved; pause/resume, retry art/audio, leave. Task: explore gift/teddy, listen to Is it a teddy? about the present, answer No, it isn't. This is a preview practice exchange based on story context, not original track 46. Wrong Yes gives gentle retry and no points. Explore teddy can name teddy. No robot reveal in scene 1; no made-up extension to story.

Audio: existing assets/unit3/lesson2/audio/questions/is_it_a_teddy.mp3 and answers/yes_it_is.mp3, plus existing teddy name. Exact source hashes recorded in sample manifest. Kenney RPG Audio bookFlip2 CC0 page-turn for mode transition, license copy retained. No new story voice generated until exact original transcript is checked.

Layers: faithful scene image -> Phaser brief attention/success particles -> generated transparent frame -> DOM target rings matching actual rendered present/teddy -> generated speech/control art -> selected present cutout. One owner per Audio/GSAP tween/engine/listener, kill/stop on leave; hide pauses, calm removes flourish.

Gates pending: reference-vs-scene content inspection, alpha/crop/asset hashes; real touch/keyboard choice, audio/mute/pause/failure paths, no progress writes; five widths and real-speed motion review; public asset parity/sample and Desktop sync. Stop at this sample and request visual feedback before expanding remaining scenes.

## Implemented sample checkpoint

- Added isolated Story Studio route `#/unit/3/lesson/6?mode=practice&activity=story-preview`; Lesson 6 visibly labelled Scene 1 preview.
- Seven generated raster assets exported as WebP and connected to the running interface; source identities/outfits and closed yellow/pink present visually reviewed. Dedicated asset catalog and provenance are shipped beside the assets.
- Touch present → actual existing practice question → choose Yes/No. Yes gently retries; No plays the answer, then reveals the closed-present detail. Teddy is a separate naming hotspot. No full-story transcript or speaking score is claimed.
- Phaser attention/short particles and GSAP detail entrance own their lifecycle. Pause/resume, reduced motion, leave cleanup, explicit image retry and audio-unavailable fallback implemented.
- Local `tests/story-sample.spec.cjs` passed actual audio path, answer flow, wrong choice, reveal/reset, five widths (320/390/768/1024/1366), 48px targets, reduced motion, leave cleanup, failed image retry and failed-question audio. Existing I-cue duration/playback regression passed.
- Remaining: public release verification and Desktop mirror, then stop for first-scene review. Remaining three scenes, original track 46 and full games are not delivered by this sample.

Final pedagogy correction: the question points to the visible teddy. Yes is correct; No gently retries. The closed present is an optional exploration hotspot, not a hidden-object guessing test.
