# Word Mine — dedicated assembled assets

29 visual assets: three generated transparent raster layers (open claw, closed claw, winch), 11 independent lowercase outlined glyph SVGs, 11 reusable assembled gem/glyph SVG tiles and four outlined word SVGs. Runtime assembles the existing approved gem base with a separate glyph; the glyph detaches and flies to its identical ghost-word asset in the scene's word dock. No text baked by an image generator, no font-loading dependency inside glyph images.

Generated raster source IDs, alpha crops, sizes and SHA256: raster-manifest.json. Exact native vector hashes: letter-manifest.json. Glyphs/words derive from existing assets/fonts/Outfit-Bold.ttf using fontTools SVGPathPen; source font copyright: Copyright 2021 The Outfit Project Authors (https://github.com/Outfitio/Outfit-Fonts), SIL Open Font License https://openfontlicense.org/. This is recognition/spelling art, not handwriting stroke-order instruction.

Open/closed claw are matching imagegen edit poses; the winch is separate. Raw source images remain under the generation archive; only cropped/resized WebP exports enter the runtime. Existing cave, gem, Kenney particle textures and the approved voice/SFX are referenced from assets/unit3/lesson5 with their original provenance/licenses; no audio replacements in this revision.

Build vectors: tools/build_word_mine_letters.py (fontTools is a build-time dependency only). Inspect all 29 assets in catalog.html. Engine/animation: existing local Phaser 3.90 and GSAP. Direct pointer aiming uses a ray and the first actual circular intersection; a miss is never snapped to a nearby letter. Wrong letters return to the board. Only accepted letters fly into the corresponding faded word position.
