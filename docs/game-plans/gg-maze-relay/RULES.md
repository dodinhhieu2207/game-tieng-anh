# Gg Maze Relay - rules

Read root RULES.md and docs/GAME_WORKFLOW.md. User selected Maze Relay, two teams taking turns, on 2026-10-15. Keep approved GSAP + PixiJS, host app and route big-small / game u3ggsort / progress 3/3/big-small. Do not ask for the same stack again.

- Replace Activity 4 pairing only; leave Trace writing-only and separate speaking games unchanged.
- Four turns per team, same ordered task types, matched difficulty and shuffled gate positions. No countdown or speed bonus in the initial release: exact equal scores are a shared win. This refines the proposal's optional time tiebreak to avoid measuring device/reading speed.
- Correct first attempt = 2 points, after any wrong choice or requested hint = 1. Wrong/duplicate choices never earn points. One turn resolves once. No points for audio/network failures. Team match score is temporary and never represented as an individual speaking/reading mastery score.
- Match G/g, recognize Gg among familiar letters, identify initial g from girl/guitar picture, match whole printed word to picture. One unambiguous correct gate each time. No mic or isolated-sound AI scoring.
- Gate choices require recognizing content; route shape, color, animation and positions cannot encode the answer. Both teams use equal-sized controls and equivalent tasks. The same trial is not reused for the second team.
- Keep all supplied girl/guitar artwork, glyph model and approved word clips. New decorative backdrop/gate assets may be generated. DOM buttons carry actual letters/words and keyboard labels; Pixi owns garden/path/avatar/particles and GSAP owns finite motion.
- Retry/hint support is visible, stars are practice accuracy for the shared activity, best prior stars and learner isolation retained. No automatic claim that legacy pairing completion proves maze performance.
- Pause timing/motion when hidden, cancel audio/timelines/listeners/renderer on exit, mute/reduced-motion respected; static fallback must remain playable if Pixi or decorative art fails.
