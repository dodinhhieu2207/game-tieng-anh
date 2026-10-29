# Academoo reference direction — 2026-10-29

Status 2026-10-29: user approved the direction for ALL existing games. Shared font/control/feedback foundation and Switcheroo pilot implemented locally; per-game redesign remains in progress. See PLAYFUL_UPGRADE_PLAN.md and PLAYFUL_SMOKE_RESULT.json. User asked to study Academoo for similar effects, games and typography. Existing game-specific stacks remain approved; no framework migration or new game scope inferred.

## Evidence inspected

- https://www.academoo.com/ — rendered homepage. Computed heading family luckiestGuy; body family fredoka. Rounded heavy outlines, offset shadows, cyan/purple/orange accents, readable large primary action.
- https://www.academoo.com/classroom-games/ice-cream-counting — selected6–10 and actually dragged one mint scoop onto cone6. Accessible count changed0 to1 and scoop visibly stacked on cone. Wide board, minimal top controls, large objects, persistent right source tray. Did not complete all40 scoops or measure audio/animation performance.
- https://www.academoo.com/classroom-games/guess-it/animals — clicked first card, saw Cat with target Cow, coloured card outline. Observed flip state; did not claim a complete-game or timing audit.
- Public homepage advertises reusable question sets and a catalogue including Wheel Spin, Crane Game, Magic Potions, Alien Spelling and Ocean Quest. These catalogue listings are not evidence of having played those games.

## Proposed visual system for this app

- Wide stage as main surface: desktop target70–80% of available game viewport, compact top HUD, one short instruction, only essential controls. Keep responsive layout and48px minimum controls. Avoid a game panel nested inside several more card frames.
- Typography: propose Fredoka for app labels/instructions/answers; Luckiest Guy for short English game headings only. Display type must not become the reading or handwriting model. Existing original tracing shapes stay unchanged. Current app still uses approved local App Outfit; font migration has not been performed. When implementing, self-host the selected licensed font files with license records and a scoped migration, not ad-hoc per-game replacements.
- Proposed palette: navy #142438, sky #87D7F1, cream #FFF9E7, teal #1697A6, purple #AA79E8, warm orange #FF9D3A. Prefer strong navy silhouettes over thick black framing everywhere; use a single3px outline and4px offset shadow for main controls.
- Original assets: dedicated background, foreground props, controls and state art for each activity; use the Family Park identities and accepted textbook vocabulary pictures. Do not extract Academoo images, code, SFX or mascot.

## Proposed interaction specification (design targets, not measured site timings)

- Press: immediate visual depression within80–120ms; release160–220ms.
- Drag: lifted object grows to1.04x with a soft shadow; valid target highlights while hovering; snap to target180–260ms with gentle settle; rejected drop returns220–320ms. Text remains crisp DOM text where suitable.
- Correct: mark at the actual answer, short settle, purposeful6–10 particles, one brief licensed/new SFX, then Higgs speech. Avoid repeated full-screen reward overlays after every ordinary action.
- Retry: preserve task and successful work, indicate the specific incorrect object; no punitive tone or loss of stars.
- Scene transition:350–600ms except existing story/voice-led actions; all delays derive from state/audio events rather than guessed speech durations.
- Reduced motion: static confirmation, no particles/bounce; keep observation time and game logic intact.
- Pause, mute, tab hide, replay and leave must stop/clean owned media, timers and animation.

## First pilot recommendation

Upgrade existing Family Switcheroo with the approved PixiJS + GSAP stack: larger stage and characters, compact HUD, five-second observation preserved, clean curtain silhouettes, answer pieces integrated below the stage, correct/try-again feedback anchored to the interaction. Keep six target rounds, Higgs, route and progress. Use design-critique + interaction-design + frontend-design; imagegen for any newly required raster assets. After real desktop/touch/reduced-motion/audio tests and rendered review, propagate the same tokens and control behaviour to Family Links and Hide & Seek. Do not redesign all activities at once or introduce a new game without the existing proposal/selection workflow.

## Acceptance before any redesign release

Five widths320/390/768/1024/1366, meaningful real mouse/touch play, clear font rendering, independent artwork/voice provenance, audio-error/mute/replay, reduced motion and lifecycle cleanup; verify the served public revision. Technical tests do not prove child engagement or learning outcomes.
