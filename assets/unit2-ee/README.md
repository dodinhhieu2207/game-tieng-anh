# Unit 2 Ee Adventure asset pack

This folder is intentionally not wired into `index.html` yet. It is the reusable visual and audio source pack for the Letter Ee, Egg/Elephant, Numbers 5–6, listening-counting, and colour-by-number activities.

## Functional conventions

- PNG character and egg illustrations have real alpha transparency.
- The two colour-by-number SVG files expose every clickable area as `.paint-region`.
- Each paint region declares its answer with `data-number` and `data-color`.
- A correct answer may set the region `fill`, add a locked class, and play `audio/correct-chime.wav`.
- A wrong answer must leave the region unpainted and may play `audio/try-again.wav`.
- Browser speech synthesis can pronounce `E`, `/e/`, `egg`, `elephant`, `five`, and `six`; the WAV files in this pack are short sound effects.
- Phonics mouth guides live in `phonics/`. Each sound declares its symbol, image path, and short cue in `manifest.json`, so another sound can reuse the same interface without changing its layout.
- Static letter fallbacks are separated into `letter-e-capital.svg` and `letter-e-lowercase.svg`; the lowercase glyph is optically centered inside its own canvas.
- Rendered motion now lives in real image frames under `letters/motion-e/` and `phonics/motion-short-e/`. Runtime code swaps these frame files in sequence; it does not geometrically distort or morph one still image.
- Copy-ready generation prompts and frame timing are documented in `phonics/ASSET-PROMPTS.md`.
- `letter-e-name.wav` models the letter name /iː/. `short-e-sound.wav` models the short vowel /ɛ/ in “egg”; the lesson may retain `/e/` on screen to match the learner's book notation.

## Image generation prompt set

The raster assets were produced with the built-in image generation tool using the `stylized-concept`, `identity-preserve`, and `background-extraction` workflows. The shared specification was: polished 2D children's educational game illustration; soft vector-like shapes; thick smooth dark-navy outline; periwinkle-blue elephant with peach inner ears; cheerful classroom-friendly expression; readable silhouette; no logos or watermarks; genuine transparent background. Each character state changed only its requested pose or teaching prop. Egg states used one cream egg with a navy outline and progressed from whole to cracked to broken.

## Intended activity mapping

- Letter Ee introduction: `elephant-letter-ee.png` and `letter-ee-card.svg`
- Short /e/ articulation guide: `phonics/mouth-short-e.svg`
- Listen and count: `elephant-listening.png`, egg state PNGs, `egg-crack.wav`
- Choose 5 or 6: number cards and egg-nest SVGs
- Reward and completion: `elephant-celebrate-four-limbs.png`, `correct-chime.wav`
- Colour by number: the two interactive colouring SVGs and `elephant-colouring.png`
