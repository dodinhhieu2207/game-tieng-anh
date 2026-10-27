# Family Hide & Seek plan

2026-10-27. Status: implemented and locally validated; public deployment pending. Stack: Phaser 3.90.0 + GSAP already present, accepted by user through request to begin the proposed game.

Scene: sunny family park seen from raised side view, open grass paths. Six separate hiding props sit around an open central picnic gathering place. A friendly puppy guide is controlled by tap-to-walk, arrows or a 48px touch D-pad. Hear “Find mum!” with source portrait cue; reach a hiding place, open it, see a family character emerge. Correct character follows guide; wrong character waves and hides again. All six reunited triggers gathering/photo finish. One target at a time, no countdown.

Art: match existing Unit2/3 bright rounded illustration; family identity/clothes follow textbook references. Six 2x2 sprite sheets (idle, two walking poses, wave), one puppy sheet, park background, bushes/tree/tent hiding props, control panel and reward art. Sheet cells split/exported deterministically; approved source portraits used in HUD. Asset manifest records prompts, source, filenames, role and usage.

Font: App Outfit 700/800 from local fonts; DOM controls and target text through var(--app-font); Phaser waits for document.fonts.ready. Canvas label font is App Outfit. No alternate display font.

Voice: tools/build_family_hide_seek_audio.py reuses existing Higgs V3 local model and Belinda reference. New intro, six find prompts, retry and finale. Exact scripts/hash/transcript QA in audio manifest; no browser TTS. ASR transcript QA does not establish voice quality/child outcomes.

Skills used: imagegen for per-game raster assets; frontend-design and interaction-design already read in this conversation for layout and action/reaction states. Official refs: https://docs.phaser.io/phaser/concepts/physics/arcade and https://gsap.com/docs/v3/GSAP/gsap.timeline()/ . Phaser local runtime (MIT), GSAP existing installed runtime under its bundled license.

Gates: assets produced/integrated; font verified; Higgs generated/playback verified; direct travel/reveal/retry/following/gather; restart/pause/mute/leave; five widths; reduced motion; recorded motion review; stable progress; public served revision. Report any incomplete gate explicitly.

Checkpoint: 13 dedicated raster assets integrated, ten new Higgs clips with transcript-match QA plus six existing word pronunciations. Detailed inventory and exceptions in ASSETS.md. Phaser sprite walking/Arcade velocity and GSAP reveals/finale are live. Activity inserted before existing relay; all prior activity/progress keys unchanged. Initial plan said sixth activity; it is the fifth displayed slot of six, preserving relay as the final slot.

Local validation: tests/family-hide-seek.spec.cjs PASS (actual travel, wrong reveal/retry, all six finds, progress3 stars, restart, five widths, pause, leave). tests/family-hide-seek-audit.cjs PASS (App Outfit, keys, D-pad, paused position freeze, real clip playback, audio failure, mute, reduced-motion sway disabled, cleanup, no missing requests or JS exceptions). Found and fixed repeated Phaser resize events resetting player position after scrolling to controls. Reviewed desktop/mobile renders and browser video contact sheet; no measured FPS or child engagement/learning claim. No human approval assigned to new voice clips.
