# Family Hide & Seek rules

Follow root RULES.md and docs/GAME_WORKFLOW.md. User authorized proposed Phaser + GSAP game on 2026-10-27. Unit 4 Lesson 1 only; use mum, dad, brother, sister, grandpa, grandma. Game key `u4familyhide`, route activity `family-hide-seek`. Add alongside prior five activities.

- Create a dedicated park background, separate hiding props, source-character-preserving sprite sheets, walking guide, UI controls and outcome badge. No substitute lesson banner or bare rectangles for missing assets.
- All dynamic words use loaded App Outfit; all speech is local generated Higgs Audio V3 with the accepted Belinda reference. Existing six Higgs word clips can be reused.
- Player moves to taps, arrow keys and touch direction buttons. Hiding-place check occurs after arriving. Wrong reveal is gentle and retracts; target steps out and joins the following party. Correct finds are never lost.
- Initial target portrait supports recognition; all six words have at least one turn. Shuffling cannot produce two competing valid targets. No punitive timer or dangerous narrative.
- Arcade Physics owns movement/bounds and GSAP owns reveal/celebration. Six hiding places are close enough to explore without a large scrolling maze. Foreground objects cover hidden characters.
- Pause stops physics, tweens and audio; return requires replay before interrupted prompt is treated as heard. Cleanup game, textures, listeners and tweens on leave. Reduced motion skips decorative sway/particles, keeps meaningful travel and static cue.
- Common progress completion event once, 3 participation stars; do not claim mastery or phonetic scoring.

2026-10-28 replay: every new board independently shuffles all6 family characters, all6 target prompts, and two each of bush/tree/tent. Compared with previous board in this browser tab, all6 characters must change hiding-slot, first prompt must differ, prop layout must differ. Keep positions stable during a running board, including wrong retry/pause/resize. Store only one prior board in sessionStorage with in-memory fallback if storage is unavailable. Never alter progress keys.
