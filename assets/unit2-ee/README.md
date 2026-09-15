# Unit 2 Ee Adventure asset pack

This folder is intentionally not wired into `index.html` yet. It is the reusable visual and audio source pack for the Letter Ee, Egg/Elephant, Numbers 5–6, listening-counting, and colour-by-number activities.

## Functional conventions

- PNG character and egg illustrations have real alpha transparency.
- The two colour-by-number SVG files expose every clickable area as `.paint-region`.
- Each paint region declares its answer with `data-number` and `data-color`.
- A correct answer may set the region `fill`, add a locked class, and play `audio/correct-chime.wav`.
- A wrong answer must leave the region unpainted and may play `audio/try-again.wav`.
- Browser speech synthesis can pronounce `E`, `/e/`, `egg`, `elephant`, `five`, and `six`; the WAV files in this pack are short sound effects.

## Image generation prompt set

The raster assets were produced with the built-in image generation tool using the `stylized-concept`, `identity-preserve`, and `background-extraction` workflows. The shared specification was: polished 2D children's educational game illustration; soft vector-like shapes; thick smooth dark-navy outline; periwinkle-blue elephant with peach inner ears; cheerful classroom-friendly expression; readable silhouette; no logos or watermarks; genuine transparent background. Each character state changed only its requested pose or teaching prop. Egg states used one cream egg with a navy outline and progressed from whole to cracked to broken.

## Intended activity mapping

- Letter Ee introduction: `elephant-letter-ee.png` and `letter-ee-card.svg`
- Listen and count: `elephant-listening.png`, egg state PNGs, `egg-crack.wav`
- Choose 5 or 6: number cards and egg-nest SVGs
- Reward and completion: `elephant-celebrate.png`, `correct-chime.wav`
- Colour by number: the two interactive colouring SVGs and `elephant-colouring.png`
