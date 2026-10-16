# Number Studio visual additions — 2026-10-16

Seven added WebP files. Existing 34 images, six toy identities, Higgs clips and SFX remain preserved. Built-in imagegen was used, followed only by crop/resize/WebP conversion with original alpha preserved. Exact source filenames, crop bounds, dimensions and alpha extrema are in ../asset-manifest.json; tools/build_number_studio_polish_art.py reproduces the export when the source images are available.

## Prompt set / selected sources

- `exec-b1fdf740-35b5-477e-a16d-f9847c77bfa4.png`: four isolated sprites in a transparent 2×2 atlas: shallow empty peach/mint gift box, matching detached lid, coral bow, finished wrapped gift. Mild high-angle view, soft matte illustrated shading, matching top-left light, short front wall and large empty interior. No text or numerals. Exports: gift-open, gift-lid, gift-bow, gift-wrapped. The front occlusion layer is the same open-box asset clipped by the renderer/CSS, not a second generated box with mismatched perspective.
- `exec-1a6e4203-acd3-4494-9b80-c60824411989.png`: close-up wide empty light-honey wooden workbench, mint wall, quiet shelves/window confined to upper edges, open center and tabletop, warm daylight, matte storybook illustration, no toys, boxes, text or controls. Export: gift-desk.
- `exec-a83233c2-a570-4eed-b22d-ffa45d36236e.png`: single isolated children's-game magnifying glass, blue lens and rounded honey-wood handle, softly painted cutout, transparent background, no environment/glow/text. Export: magnifier.
- `exec-8a2cf99a-3275-441e-b028-071b7793e473.png`: single isolated golden paper star award with coral ribbon tails, friendly simple illustration and warm shading, transparent background, no scene/glow/text. Export: rosette.

Sources retained under `C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7/`. Three multi-object detail-atlas attempts were rejected because of colored background contamination. They are not exported, counted as deliverables or referenced by the game.

## Runtime integration

Gift uses persistent object controls, source slots, interior slots, rear/front occlusion, hinged lid and a separate bow. Completed-gift thumbnails use gift-wrapped. Detective uses magnifier; Parade uses rosette at success. Other activities retain their approved dedicated art. Book reuses its existing separate paper/hinge asset through a perspective DOM rig. Numerals and words stay accessible HTML text; no generated text is used.

Fonts: actual app runtime uses bundled `App Outfit` 700/800 through shared/app-typography.css. Initial Baloo declarations in index.html are overridden by that shared stylesheet. The revision inherits the actual app family and tunes weight/size/spacing; it does not add another font provider.

Motion remains in the existing local GSAP/PixiJS integration. GSAP timeline sequencing/position parameters were checked against https://gsap.com/docs/v3/GSAP/gsap.timeline()/ . No new library or external skill installation; no new audio synthesis, provider or speech-grading policy.
