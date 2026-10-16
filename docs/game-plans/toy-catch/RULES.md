# Toy Catch — activity rules

Read root RULES.md and docs/GAME_WORKFLOW.md. User selected Phaser Arcade Physics in the direct reply dated 2026-10-16; do not re-ask.

- Add a separate Unit 3 Lesson 4 activity `toy-catch`, game `u3toycatch`, progress `3/4/toy-catch`. Preserve the existing six activities, their order/IDs/scores and all unrelated lessons.
- Six short practice rounds: 7 cars, 8 balloons, 7 robots, 8 teddies, 5 planes, 6 puppets. Use familiar approved number-studio toy identities. Exact numeral/word/quantity linkage, no wrong toy increment and no duplicate pickup.
- Three lanes, two large left/right controls, arrow keys and pointer drag/tap. Forgiving pace, no lives/countdown or penalty for a missed item; mismatched pickup and wrong number choice give clear retry. Pause the road during spoken guidance, quantity inspection and round-end choices.
- Use actual Phaser Arcade bodies and overlap callbacks for moving collectibles/player. Phaser owns scene tweens, timers, particles and lifecycle. No new home-made physics/particle engine. Code pinned locally with provenance/license. No app framework rewrite.
- New dedicated layered road/vehicle/scene props. Preserve source images, generated alpha, crop provenance and original vocabulary art. HTML text/controls use actual shared App Outfit. No numbers/words baked into generated art.
- Collected objects stay still in an accessible count row; end-of-round numeral/word check precedes awarding round points. Collection is supported practice, not independent cardinality/reading mastery evidence.
- Existing Higgs voice/provider and sourced SFX. One audio at a time, ended before movement/results, mute respected, explicit audio error recovery, stop on exit/background. No AI or microphone added to continuous action; existing number speaking remains in Say & Open.
- Pause/resume and reduced-motion alternative retain all learning tasks. A playable discrete lane mode must work without continual motion and if Phaser cannot load. Arrow/tap controls at least 48px; five viewport checks.
- Cancel timers/input/audio/tweens and destroy owned Phaser game on exit; stale load/results cannot touch the next route. Repeated input cannot duplicate completion/stars.

Visual quality requires a real representative playthrough and motion capture; an installed engine or a passing mock test does not establish engagement or premium quality.
