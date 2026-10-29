# Spin & Say / Listen & Catch — sensory pass

2026-10-29: implemented and locally validated. Existing all-old-game upgrade approved; retain DOM + GSAP. Add local Howler core2.2.4 for SFX only, no framework change. No new game proposal or repeated stack question.

Sources consulted: goldfire/howler.js v2.2.4 (MIT: pool, play/end/error/stop and audio unlock); pixijs/sound (reviewed alternative, not installed because these scenes do not require Pixi); greensock/gsap-skills gsap-timeline (MIT reference read online, not installed as a skill); Kenney RPG Audio and Impact Sounds (CC0).

Skills read/used: frontend-design for hierarchy/materials; interaction-design for state/gesture/retry; imagegen for original crank and collection basket. Design critique to review actual scenes.

Assets: independent crank prop attached to Spin action, real vocabulary images in moving reel strips; independent fabric basket for Listen collection and live flying original image. Existing classroom background reused. Live type retains app fonts; no baked vocabulary.

Audio: existing Higgs word/phrase catalogue untouched. New sampled wood contact/book/cloth/glass/coin cues normalized and shortened under assets/playful-foley, with CC0 licenses and sample provenance. One SFX lane, bounded gain/rate, spam throttle, voice/recording suppression, cancellation on mute/hidden/leave, no queued old sound after leaving.

Flow Spin: ready → crank → each reel physically travels and settles → phrase → Higgs ended → ready. Restart cancels pending timeline/voice. Hidden pauses/restarts safely. Reduced motion shows result directly without scrolling strips.

Flow Listen: word → awaiting picture (optional timer begins after speech) → wrong-local-retry OR correct-object-flight → Higgs feedback ended → owned shuffle → next word. Hidden countdown pauses. No fixed audio duration guess.

Validation PASS: school-sensory.cjs and playful-audio-edges.cjs cover actual Higgs ended, real Howler WebAudio end, strip travel/staggered result, random replay, atomic score, wrong/retry/flight/shuffle, keyboard/touch/reduced, five widths with containment/48px targets, result centering on resize, SFX failure/reload, missing optional runtime, prompt error/retry, simulated hidden timer and post-collection anti-double-score, reset/leave/mute/recording/voice priority.

Regression PASS: learning-feedback.spec.cjs, click-sound.spec.cjs, school-missions.cjs, letter-workshop.cjs, family-missions.cjs, navigation-kit.cjs and unit2-higgs-voice.spec.cjs. Click regression now uses a resolved-speaking state fixture because production review has no manual-pass button; it is not ASR/child accuracy. Unit2 voice test covers all27 activity replays and records no browser speech calls. Inventory smoke mounts70 Unit routes with no JS errors/empty stages/overflow; it is not70 full playthroughs.

Self-review: original lever pseudo-art initially covered the new crank, now removed.320px machine was clipped even though document overflow check passed; actual scene-element containment now checked. Three-column mobile reels/result row fit. Centering recalculates after viewport changes. Page-turn source onset was too quiet after naive trimming; production export now trims at source onset before normalization. Measured sample duration/peak/RMS and hashes are in the SFX manifest.

Evidence: tests/sensory-spin/listen-320..1366.png, sensory-reel-moving.png, sensory-object-travel.png, sensory-spin-result.png, school-sensory-motion-review.jpg and normal-speed video under tests/school-sensory-video/. Frame interval sample in docs/design/SENSORY_MOTION_MEASUREMENT.json is headless Edge with video recording, not physical mobile/monitor FPS or child outcome evidence. No public deployment performed. Other pending games remain pending individual redesign.
