# Number Play Studio - Unit 3 Lesson 4

34 dedicated WebP assets: 6 activity sets with scene/prop/part/accent, 6 countable toy sprites, and 4 shared lesson UI surfaces. Created with built-in imagegen, not CLI. Each countable toy is an independent sprite; no number groups are baked into scenery. Numerals/words remain live text. Source IDs, crop bounds, dimensions and alpha extrema are in asset-manifest.json; original PNG sheets remain in the Codex generated_images task folder. tools/build_number_studio_art.py performs crop/resize/WebP conversion only.

## Prompt set and art direction

Soft matte painted wood, felt and layered paper, sky blue/apricot/teal/coral; front view, clear rounded shapes, restrained highlights, no lettering/digits/logos. Atlas prompts specify separate objects with transparent gutters and alpha. Scene and interaction surfaces planned separately before generation. New toys are recognizable Lesson 4 depictions, not replacements for prior approved lesson assets.

- Parade: small theater scene, empty count pedestal, blank fabric placard, separate reveal flap.
- Detective: empty playroom/rug, inspection tray, magnifier, orange selection ring.
- Gift: wrapping table scene, open box, matching independent lid, coral bow.
- Snap: craft table scene, three-part badge, independent puzzle tile, fabric drawer.
- Book: reading nook, blank open book, independent upright paper tab, mic stand.
- Relay: two-team craft hall, blue pennant, coral pennant, stitched mural tile.
- Toys: one car, balloon, robot, teddy, plane, puppet in separate cells; recognizable single-object silhouettes for exact counting.
- UI: teal primary surface, coral secondary surface, ivory instruction plaque, stitched star medallion; all text separate from bitmap.

Sources and exact crop rectangles are in asset-manifest.json. Some generated sheets did not obey equal cell boundaries; inspected rectangles are used rather than blind equal-cell slicing. Outside alpha is preserved; no Python background removal or repainting. The atlas source directory is C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7.

## Actual repository roles

GCompris enumeration ActivityInfo.qml/enumerate.js: reference for organizing/counting entities and separating target from response, GPL-3.0-or-later per headers; no code/art copied. Sugarizer Abacus/Memorize: reference for tap/drag manipulation and matching text/image/sound, Apache-2.0 activity source; no code/art copied. See docs/game-plans/unit3-lesson4-numbers/PLAN.md for URLs and inspected snapshots. Original app-specific implementation uses existing local PixiJS 8.22.0 (MIT) and GSAP 3.15.0 (existing vendor license). Official examples guide the rendering APIs; educational repositories are not installed packages or evidence of classroom effectiveness.

## Higgs speech

Eight new spoken number clips, one through eight, generated offline using existing Higgs V3 and approved Unit 3 Belinda reference. Texts/durations/reference digest/ASR checks in audio/manifest.json. ASR transcript check passed for all eight. No new voice provider or browser voice. This agent session cannot claim subjective ear approval; transcript and browser decode/playback checks do not prove timbre or child-ASR quality.

## Sourced SFX

All are unchanged Kenney Interface Sounds OGG files, CC0; original license in sfx/LICENSE.txt. Source: https://kenney.nl/assets/interface-sounds . These are interface cues repurposed for toy/paper interactions, not recordings of physical cloth/wrapping materials. Volumes .22; stop before speech, capture, mute/background/exit. No oscillator synthesis.

| Runtime | Original |
| --- | --- |
| place | drop_003.ogg |
| lock | select_005.ogg |
| retry | back_002.ogg |
| reward | confirmation_002.ogg |
| paper | scroll_003.ogg |

## Visual additions — 2026-10-16

Seven additional generated assets and their actual prompt/source/crop information are documented in [v2/README.md](v2/README.md). Gallery now contains 41 images. All original 34 images remain preserved. Actual app typography uses the bundled App Outfit family; the visual revision inherits it. The active scene sheet is shared/number-studio-scene.css. Scope and current validation are in the Lesson 4 plan.

## AI boundary and limits

New number-word task uses existing Cloudflare service, exact recognized word/digit 1-8, balanced allowed targets and an empty neutral initial prompt. Live audit revealed that enumerating number vocabulary in the recognition prompt could prime a whole counting sequence; empty prompt passed seven/eight positive and opposite-target negative generated-Higgs audits. Not child recordings. Teen numbers, multiple numbers, guessed homophones and toy phrases are not silently accepted as one number. Phrase speaking is not included in this release. UNCLEAR/mic/network failures do not consume an error or points. Existing 419-case Worker contract remains passing.
