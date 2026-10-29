# Letter Land — Build the Word upgrade

- Scope: existing `letterfly` only, under `#/letters/game/letterfly`; no tracing, Point & Say or curriculum changes.
- Existing DOM renderer with locally bundled GSAP. User authorized the older-game upgrade; this continues that approach without a new engine choice.
- Keep LetterFont glyphs, approved vocabulary pictures, audio file paths, filters, Easy/Tricky, route and built-word counter semantics.
- Original raster workbench and blank tile; real text and controls remain separate accessible DOM elements.
- Support direct drag, tap tile then slot, and native keyboard buttons; repeated letters represent distinct tiles.
- Reserve a tile/slot once, settle all placements before completion, no whole-scene shake. Retry never awards progress.
- Completion waits for actual voice end, mute or explicit playback failure; playback failure must be visible. No new generated voice or browser voice fallback.
- Cancel owned motion/audio/listeners on reset, leave; cancel gesture on hidden. Respect reduced motion. Five widths 320/390/768/1024/1366.
