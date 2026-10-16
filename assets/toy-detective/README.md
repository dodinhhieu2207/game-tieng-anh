# Toy Detective discovery room — 2026-10-16

Nine dedicated generated WebP layers, separate preserved Number Studio toy sprites, and seven new Higgs instructions. [Art gallery](catalog.html). Original assets were produced with built-in imagegen, not a CLI/API fallback. No example repo artwork was copied. Words and numerals are live DOM text.

## Generation briefs and selected sources

Matte painted wood and linen, hand-painted storybook room, gentle daylight, ivory/teal/coral/honey/sage. Front-facing furniture, separate movable covers, clean outside alpha, no baked toys/counts/labels/numerals. These are normalized briefs; the submitted prompts are retained in prompt-set.json.

| Source | Output / brief |
| --- | --- |
| exec-9f4ff448-8812-4e3d-bea3-9844fb5a9e06.png | Quiet room with window, wall/floor and three empty furniture areas. |
| exec-c1b06d31-a7bc-423e-b5c7-7dd4b1b1f322.png | Open teal cabinet, separate door, open coral basket and independent lid. Selected cabinet/basket/lid. Original square door rejected for geometry mismatch. |
| exec-b967fe0e-9bdf-4a1b-b5d1-6c2163fac14a.png | Arched open alcove, separate curtain panel, empty tray, magnifier/star reward badge. Curtain mirrored as a left/right pair. |
| exec-a3a1a169-a471-42fd-930d-ace4b18cad8e.png | Revised independent wide teal cabinet door, knob right/hinges left. |

Original PNGs remain under `C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7/`. `asset-manifest.json` records selected source regions, output dimensions, alpha extrema and hashes. Atlas regions were inspected: the second atlas does not use equal cells, so unequal bounds prevent clipping the arch/curtain or mixing neighboring parts. `tools/build_toy_detective_art.py` only crops, proportionally resizes and converts. Alpha threshold selects crop bounds only; per-pixel generated alpha remains unchanged. No background removal or repainting.

Furniture images retain natural proportions. Native cover transforms project the hinged door, lift/tilt lid and compress paired curtain folds. The tray is used as a native nine-slice HTML border image so center/edges can adapt to an accessible collection grid. Counted toys are never stretched. Approved car, balloon, robot, teddy, plane and puppet sprites remain unchanged in `assets/number-studio/toys/` with their existing provenance.

## Voice and sourced sounds

Six full instructions “Find all the cars/balloons/robots/teddies/planes/puppets.” plus “How many toys did you find?” generated offline with existing Higgs V3 and approved Unit 3 Belinda reference. Seven ASR transcript checks passed; texts, hashes, durations, reference digest and `humanReviewed:false` in audio/manifest.json. Initial instructions never state the target quantity. Correct numeral plays the existing number-word MP3 before the word-choice task. No provider change or child-voice/subjective listening claim.

Unchanged Kenney CC0 Interface Sounds `paper`, `place`, `retry`, `reward` from Number Studio are interface cues, not recordings of real fabric or hinges. Original source/license: https://kenney.nl/assets/interface-sounds and `assets/number-studio/sfx/LICENSE.txt`. Owned sounds stop before voice and on mute, background or exit.

## Code references and boundaries

Existing local PixiJS 8.22.0, GSAP 3.15.0 and MotionPath; scoped pinned PixiUI 2.4.1/tweedle 2.1.0 and Pixi Filters 6.1.5 with original MIT texts and provenance under shared/vendor. Creation Web Button.ts informs separated button views/state, not a framework transplant. Official GSAP timeline skill used as a read reference, not installed. No Rive/Rex or new physics runtime in this room. Main UI inherits bundled App Outfit and keeps readable DOM controls.

Technical/browser/video evidence is recorded in the game plan. This is count/word practice, not a claim of general mastery or classroom engagement.
