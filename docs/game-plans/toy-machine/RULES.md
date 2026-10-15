# Toy Machine - rules

Scope: Unit 3 Lesson 2, Is it a ...? User accepted the three-reel lever concept and explicitly requires repository-backed animation/SFX and dedicated layered art. Read root RULES.md and docs/GAME_WORKFLOW.md. User selected PixiJS + GSAP, layered scene and sourced SFX; continue without re-asking.

- Approved placement: replace Listen & Decide (listen-decide/u3decide), preserve progress key, keep Talk to Toy Buddy's separate AI interaction. Confirm any change of this scope before implementation if user steers differently.
- Three matching toys unlock a grammar challenge; score comes from a correct complete Yes, it is / No, it isn't response. Spin results must never be recorded as language mastery. Finite rounds and bounded spins, no endless waiting for a random match.
- Keep approved toy vocabulary art and Higgs question/answer voice. New machine shell, reels, lever pivot/stick/knob, lights, hatch, tray and reward parts are separate assets/layers. No stretching a complete illustration to fake mechanical motion.
- Use mature rendering/timeline repositories and their documented APIs; app-specific choreography/scoring still belongs to the game. Record exact versions, provenance and licenses. Do not treat v7 example code as compatible with the app's v8 renderer without adaptation.
- Use sourced, licensed SFX, audition the actual clips before choosing them; do not substitute synthesized oscillator beeps for requested sound design. Stop reel loops at stops, mix below speech and honor app mute/recording. No claims of having auditioned/downloaded files until done.
- Child controls accessible by keyboard/touch; mobile labels large, reduced motion, cleanup and audio failure paths. No framework rewrite or unrelated game changes.
