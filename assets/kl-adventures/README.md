# Four K/L activity art packs

Created 2026-11-12 for Unit 4 Lesson 5. Each activity owns its background, nine-prop interaction/UI sheet, wide instruction plaque, cover and exported PNG sprites. All new raster art uses the built-in OpenAI image_gen tool; final source PNGs retained under each `sources/` folder. Exact generation output IDs, measured extraction and file hashes are in each `manifest.json`; reproducible extraction in `tools/build_kl_adventures_art.cjs`.

Prompt sets:
- Doors: cozy mint/honey garden tree houses with empty doorways. Transparent kit: hinged door, empty frame, pill and round buttons, plaque, sparkle, arrow, reward star, knob. Cleanup edit removed white exterior and frame interior. Wide instruction bar, simple frame and far-end flower ornaments.
- Express: miniature toy railway garden with two platforms and clear path. Transparent kit: cart, empty station arch, platform, pill and round buttons, plaque, dust puff, arrow, reward badge. Coral/mint wide instruction bar.
- Workshop: conservatory wooden desk, large blank surface, lavender/mint accents. Transparent kit: tracing paper, pencil, blank tile, pill and round buttons, plaque, sparkle, peg, reward badge. Lavender/mint wide instruction bar.
- Spotlight: cozy evening garden theatre with clear central stage. Transparent kit: curtain panel, lamp, light cone, pill and round buttons, plaque, sparkle, ticket, lens. Teal/coral/gold wide instruction bar. Opaque `veil.png` is a measured crop of curtain fabric, used beneath each curtain sprite to prevent accidental answer leakage through transparent edges.

All prompts specify no generated lettering, no numbers, separate objects and clean alpha. Labels use bundled App Outfit. Source sheets are cropped and trimmed, never displayed wholesale on a button. The accepted Key Quest toy art and Higgs words/names are reused consistently in the four contexts; Express also reuses the accepted Hh hat/horse vocabulary pictures and Higgs recordings. This preserves known word images rather than introducing unrelated substitutes. There are no new unverified phoneme recordings or browser TTS fallbacks.

SFX reference the existing Kenney CC0 kits at `assets/playful-foley/` and `assets/feedback/`, with retained source licences/manifests. Cues are separate for tap/door reveal/placement/correct/retry, gain .25, stopped before speech. Runtime uses existing local PixiJS 8.22 + GSAP 3.15; no new competing renderer or sound framework. Hexi/KAPLAY informed interaction references, not bundled dependencies.

The E/F tracing renderer/binder is reused directly. K/L and missing word glyphs supply local stroke data; both guide and ink remain 18 source units, active cards progress in order, and a short scribble does not complete a glyph. Completion stars indicate activity participation, not certified handwriting or phonetic mastery.
