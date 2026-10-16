# Toy Catch assets — 2026-10-16

Five dedicated generated WebP layers, six new Higgs guidance clips, and the existing approved six Number Studio toy sprites. Numerals, words and controls are live HTML, not text baked into art. Gallery: [catalog.html](catalog.html).

## Art direction and generation briefs

Built-in imagegen produced the selected original PNGs; no external example artwork was copied. The briefs below summarize the submitted direction, rather than claiming to be an exact prompt transcript.

- Road: inviting top-down children's toy-garden course; broad light sand/cream path with quiet center, layered painted-paper flowers and greenery confined to its edges; no vehicle, toys, labels, digits or embedded interface.
- Rig atlas: separate top-down teal/coral cargo buggy, independent tire, rounded garden tree and small reward star badge, matte painted wood/paper shapes, restrained highlights, readable silhouettes, transparent gutters and background. Body and moving wheel detail are separate layers.

Original sources remain in `C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7/`:

| Selected source | Runtime exports |
| --- | --- |
| exec-774746db-2673-46f2-903b-5c6e7a0f6027.png | road.webp |
| exec-a94b7603-c9d8-4c7f-91d6-82c310ccab37.png | buggy.webp, tire.webp, tree.webp, badge.webp |

The proposed depot source `exec-4867d6af-62bc-4c08-a416-4a3b9bbc4011.png` had unwanted background contamination and was rejected. It is not shipped or displayed. The implemented round reward uses the badge and a short vehicle departure, not depot doors.

`asset-manifest.json` records source IDs, source-region rectangles, output dimensions, alpha extrema and SHA-256. `tools/build_toy_catch_art.py` crops the inspected atlas regions, crops to alpha bounds, proportionally resizes and converts to WebP. The alpha threshold determines crop bounds only; original per-pixel alpha is preserved. No Python repainting or background removal. Four rig exports retain transparency; the road is opaque.

Countable vocabulary identities are reused unchanged from `assets/number-studio/toys/`: car, balloon, robot, teddy, plane and puppet. Existing art provenance is in that folder's README/manifest. The app uses the existing bundled App Outfit family and its existing license. New native buttons, lane marks, shadow ellipse and brief Phaser particles do not introduce third-party art assets.

## Voice and sounds

Six complete guidance clips: “Collect seven cars.”, “Collect eight balloons.”, “Collect seven robots.”, “Collect eight teddies.”, “Collect five planes.” and “Collect six puppets.” Generated offline using the existing Higgs V3 model and approved Unit 3 Belinda reference. No new voice provider. `audio/manifest.json` records text, reference digest, duration, clip hashes and ASR transcript checks; all six transcript checks passed. Human listening approval is not claimed (`humanReviewed: false`). Existing Number Studio five–eight clips supply the number voice after collection.

Interface cues reuse unchanged Number Studio `place.ogg`, `retry.ogg` and `reward.ogg`, sourced from [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds), CC0; original license remains at `assets/number-studio/sfx/LICENSE.txt`. They are interface cues, not newly recorded engine/road sounds. Owned cues stop before speech and on mute/background/exit.

## Runtime attribution and limits

Phaser 3.90.0 is pinned locally under `shared/vendor/phaser/`, with original MIT license and provenance. Arcade Physics owns collision/motion; Phaser owns tweens, particles, timers and scene cleanup. No copied game/example graphics or sounds. A playable calm lane mode also works when the renderer cannot load.

Browser tests and a real-duration captured playthrough verify the specified technical paths. They do not establish classroom engagement, independent number mastery, subjective voice approval or performance on every device.
