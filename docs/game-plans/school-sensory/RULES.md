# Old-game sensory upgrade: Spin & Say / Listen & Catch

- Continue approved old-game upgrade; retain DOM and bundled GSAP, routes spin/listen, curriculum, approved Higgs catalogue and existing score semantics.
- New audio capability: pinned local Howler core2.2.4 MIT for a bounded sampled SFX lane. No voice migration; no speech processing or synthesized oscillators.
- Source new SFX from Kenney RPG Audio / Impact Sounds CC0; retain original samples, source licenses and processing manifest. Voice/recording always takes precedence.
- Every tween/timer/audio has an owner; restart/leave must cancel. Hidden tabs must not advance a countdown or resolve a reel spin.
- Buttons remain48px minimum; support touch/keyboard, reduce motion, mute and sound error. Preserve E/F tracing completely.
- Spin retains random number/colour/object phrase, no immediate identical combination. Actual strip travel and staggered stops, no interval-based image flicker.
- Listen retains exact-picture task and score. Correct object travels to original collecting basket; await Higgs before next turn. A wrong choice marks only itself; Next is optional teacher skip, not an earned score.
