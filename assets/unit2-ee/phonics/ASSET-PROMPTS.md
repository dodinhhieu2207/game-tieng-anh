# Letter E and short-e motion asset prompts

These prompts produce image frames. Runtime code must only swap pre-rendered frames; it must not stretch, rotate, redraw, or morph the artwork.

## Letter E motion sprite

```text
Use case: scientific-educational
Asset type: transparent 6-frame sprite sheet for a preschool phonics web game
Input image: style reference only; match its polished 2D children's educational illustration, glossy soft shading, thick smooth dark-navy outlines, bright royal-blue letter color, peach/yellow accents. Do not include the elephant.
Primary request: Create a production-ready animation sprite sheet for the single uppercase Latin letter E. Arrange exactly six equal square frames in a clean 3 columns by 2 rows grid. In every frame the letter must remain unmistakably the exact same uppercase E glyph, same proportions and identity.
Frame sequence, left to right then top to bottom: 1 resting E; 2 E preparing with a tiny squash; 3 E lifted slightly with one small blue sound ring; 4 E at the energetic peak with three concentric sound rings and one yellow star; 5 E settling with smaller rings and one coral music note; 6 E back at rest with a soft success sparkle.
Style/medium: polished raster game asset, rounded child-friendly capital E, blue gradient fill, navy outline, subtle dimensional highlight.
Composition: each frame centered with identical scale and registration; generous transparent padding; no frame borders, no captions, no labels.
Constraints: genuine transparent background; exact 3x2 grid; no lowercase e; no other letters; no words; no character face; no hands; no watermark; effects must stay inside each cell; all six frames must be separable without overlap.
```

## Lowercase e motion sprite used in the app

```text
Use case: scientific-educational
Asset type: transparent six-frame animation sprite sheet for a preschool phonics web game
Primary request: Create a production-ready animation sprite sheet for the single lowercase Latin letter e. Preserve the rounded royal-blue glyph, dark-navy outline, pale-blue highlight and subtle dimensional shadow of the approved lowercase-e artwork. Arrange exactly six equal square frames in a 3-column by 2-row grid.
Frame sequence: (1) optically centered resting e; (2) tiny preparatory squash; (3) slight lift with one blue sound ring; (4) energetic peak with three sound rings and one yellow star; (5) settling with smaller rings and one coral music note; (6) return to rest with a soft success sparkle.
Composition: optically center the glyph horizontally and vertically in every frame; preserve identical registration and scale; use generous transparent padding; keep effects inside each cell.
Constraints: genuine transparent background; lowercase e only; no uppercase E; no other letters; no words, captions, labels, faces, hands, frame borders or watermark; do not redesign the glyph.
```

## Short-e /ɛ/ mouth motion sprite

```text
Use case: scientific-educational
Asset type: transparent six-frame articulation sprite sheet for a preschool phonics game
Input image: articulation and visual-style reference. Preserve the same simple peach face, dark navy outlines, coral lips, pink tongue, white teeth, and clean classroom-diagram style. Remove all labels and arrows.
Primary request: Create exactly six equal animation frames in a 3 columns by 2 rows grid for producing the English short-e vowel /ɛ/ as in “egg”. Every frame must show the same character and consistent proportions, with a front mouth view plus a small side cutaway that clearly shows tongue position.
Frame sequence, left to right then top to bottom: 1 neutral rest, lips gently together and tongue resting; 2 lips begin to part and jaw lowers slightly; 3 short-e target shape, lips relaxed and slightly spread, jaw moderately open, tongue body low-mid and forward; 4 hold the same accurate /ɛ/ target shape with a tiny sound-wave cue; 5 release, jaw begins to close while tongue relaxes; 6 return to neutral rest.
Articulation accuracy: for /ɛ/, lips are relaxed and slightly spread, mouth moderately open, tongue front is raised to low-mid height, tongue tip rests near the lower front teeth; do not round or protrude the lips; do not curl the tongue.
Composition: identical registration and scale in all six cells; generous transparent padding; effects stay inside their cell; no frame borders.
Style/medium: polished 2D children's educational illustration, simple readable shapes, no realism that could frighten children.
Constraints: genuine transparent background; exact 3x2 grid; no words, letters, phonetic symbols, captions, labels, arrows, watermark, extra faces, or extra mouths outside the six frames.
```

## Photorealistic teacher mouth sprite used in the app

```text
Use case: scientific educational phonics asset for a preschool English learning app.

Create one photorealistic 8-frame sprite sheet showing the same adult female English teacher pronouncing the short English vowel /ɛ/ as in “egg”. Show only the lower half of the face, cropped consistently from just below the nose to the chin, straight-on. Use one original synthetic adult identity, natural skin texture, realistic lips, teeth and tongue, a neutral white studio background and soft even daylight.

Arrange exactly eight equal panels in a 4-column by 2-row grid. Preserve exactly the same identity, camera angle, crop, scale, lighting, head position and background in every panel. Sequence: (1) relaxed closed mouth; (2) lips begin to part; (3) jaw opens; (4) accurate short-e /ɛ/ shape; (5) hold /ɛ/; (6) tiny natural speaking change while holding /ɛ/; (7) mouth begins to close; (8) relaxed closed mouth.

For /ɛ/, keep the lips relaxed and slightly spread, jaw moderately open, tongue front low-mid and forward, tongue tip near the lower front teeth, and lips unrounded. Make the movement look like a real teacher reading “e, e, egg”. No cartoon, illustration, 3D render, labels, arrows, letters, text, panel numbers, watermark, decorative border, extra faces or profile view.
```

## Frame timing

- Letter E name `/iː/`: `01 → 02 → 03 → 04 → 05 → 06`, approximately 180–220 ms per frame.
- Short e `/ɛ/`: `01 → 02 → 03 → 04 → 03 → 04 → 05 → 06`, synchronized to the fixed WAV recording.
- Keep the final neutral frame on screen after playback.
