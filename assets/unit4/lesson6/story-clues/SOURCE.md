# Story Clues artwork

Created 2026-11-19 with built-in imagegen for this game. No external illustration pack or competitor artwork was copied. Original textbook panels and supplied MP3 remain separate, unchanged assets with their existing provenance.

## Listening corner

Generated source: `exec-be92ef7e-e669-4d12-8252-2e87db26c9f3.png`, stored in the session's generated_images directory. Project export: `listening-corner.webp` (1536 x 1024).

Prompt brief: wide hand-painted gouache family-home listening corner; central 85% blank ivory felt display with honey-wood border; small mint headphones and plant restricted to edges; soft peach/mint/butter/coral palette; no text, characters, cards, stage or curtains; matte textures and clear usable center. Intended to host original book panels as separate runtime elements.

## Controls and feedback

Project source: `controls-source.png` (1536 x 1024, RGBA). Generated source identifier: `exec-76cc9969-b191-43f9-a458-5a71944fd9c1.png`.

Prompt brief: coherent 3-column by 2-row transparent illustrated UI sheet, independent cells: mint/gold headphones, blank cream mint-rim button plaque, coral next arrow, gold success star with mint check, listen-again arrow around an ear, and golden confirmation halo with transparent center. Same matte gouache art direction, no text or character replacements.

Production extraction starts with exact 512 x 512 sheet cells, then crops the painted content using alpha >32 bounds with a 10px margin; WebP exports retain RGBA losslessly. This prevents almost-transparent sheet gutters from shrinking the painted controls. UI text remains actual HTML in App Outfit. Do not display the entire source sheet on a control. The halo is a lighting overlay, not a standalone character animation or GIF.

Assets are connected in shared/story-clues.js and shared/story-clues.css using the approved HTML + GSAP approach. Browser visual review found and corrected oversized transparent gutters and small phone panels. Native media and responsive interaction checks are recorded in the game plan.

`activity-cover.webp` is an original local browser capture of this game's display board, composing the generated backdrop/controls with the preserved textbook panels. It contains no learner information. `audio-manifest.json` records the exact reused clips, SHA-256 hashes, measured model-word onsets and CC0 Kenney confirmation SFX. No new synthetic voice was generated.
