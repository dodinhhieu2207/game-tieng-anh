# Family Sentence Puzzle assets

Original `desk.png` generated for this activity: quiet ivory craft desk, mint frame, coral album and small corner props. Original `piece.svg`, `slot.svg`, `photo-frame.svg` are scalable game artwork. Live words stay in App Outfit.

## Complete graphic component kit

- Generated raster artwork: activity cover, title plaque, mint secondary button, gold primary button, desktop completion album and portrait phone album.
- Original scalable artwork: four colored word pieces (This / is / my / family word), matching slots and tray, target portrait frame, six action icons, correct/retry seals, progress badge, status plaque and collection card.
- `catalog.html` previews every graphic. `manifest.json` records the role, byte size and SHA-256 of all 26 graphics, including the master puzzle shape. Rebuild with `tools/build_family_puzzle_manifest.py`.
- New UI/album raster assets are served as high quality WebP; original generated PNG files remain in Codex's generated_images directory. App text is live and readable; baked title/words occur only in the decorative activity cover.

Character pictures reuse the approved sharp family portraits. Spoken target sentences reuse `assets/family-album/audio/manifest.json` (Higgs Audio V3, accepted Belinda reference).

Short placement/retry/correct SFX reuse the existing Kenney CC0 sample kit (`assets/playful-foley/README.md`, retained license/source files). No new voice provider or synthesised effects are introduced.
