# Unit 5 Lesson 1 — sources and production

Created 2026-11-26 for the user's complete Feelings lesson asset request.

Latest user style correction: active backgrounds are v3. Built-in imagegen edited each v2 scene with direct older-unit reference images: Unit3 selector and Unit4 garden for the world/menu, Family Dialogue room for the five interiors. `sources/backgrounds-v3.json` binds each output to its exact input hashes and normalized prompt brief. Native PNGs are in `sources/backgrounds-v3/`, runtime WebP encodings in `backgrounds/v3/`. `tools/export_unit5_backgrounds_v3.py` only copies/encodes those imagegen outputs. Previous art, all actors/GIFs and audio are preserved.

Background continuation: six additional original scene plates were generated with built-in imagegen for the activity menu and each playable activity. Native 1536x1024 PNG sources are retained in `sources/backgrounds-v2/`; runtime WebP encodings are in `backgrounds/v2/`. `sources/backgrounds-v2.json` records generation IDs and normalized prompt briefs. These are new original backgrounds, with the old approved files preserved. Export utility: `tools/export_unit5_backgrounds_v2.py`; it only copies and encodes the original images, without repainting or changing actors.

## Original illustration

New backgrounds, supplementary actors and props were generated with the built-in imagegen tool. Original full-resolution files are in `sources/`. `generations.json` and `alpha-cleanup.json` retain the generator execution filenames and local source locations. Production exports are retained here so no app reference depends on the generation cache.

The new actors are original supplementary game characters, not copies or identical restorations of book characters. They do not replace the preserved textbook artwork. Palette: warm cream, muted mint/teal, honey, apricot and lavender. Matte gouache shading, clean dark teal contours, simple forms, large quiet central areas and connected character anatomy.

### Prompt set and invariants

- House: premium preschool storybook living-room scene plate, 1536x1024, arched garden window on left, low sofa and far-right shelf, open pale wall and wooden floor; center 70% quiet; no people, text, letters or UI.
- Workshop: matching cream/mint photo-and-word workbench, empty central desk and wall, six wooden photo clips on string near upper edge, sparse pencil/plant props at edges; no baked words, slots, portraits or UI.
- Helping: matching kitchen island and cream center wall, mint cabinets on edges, daylight, no characters or interactable objects baked into the counter.
- Reporter: matching home interview corner, chair and cabinet at opposite edges, central open stage, no baked camera/microphone/portraits.
- All actor sheets: transparent exact 3x2 equal-cell atlas; six distinct full-body consecutive key poses of one character, consistent scale/camera/outfit, generous gutters, fixed grounded feet, complete heads/hands/shoes, no labels or background. Expressive original preschool children with matte gouache texture and soft dark teal outlines.
- Happy: curly chestnut-haired boy, coral shirt/mint pocket, navy shorts; open smile, arms lift, small joyful pose, wave and return.
- Sad: dark side-swept-haired boy, mustard shirt/teal shorts; gaze lowers, cheek touch, quiet sigh and gentle forward gaze; no distress/tears.
- Hungry: pigtail girl, lavender shirt/peach skirt/teal leggings; palm rubs tummy in consecutive poses, other hand gestures to mouth, hopeful hungry face.
- Thirsty: bob-haired girl, mint blouse/navy shorts/coral shoes; touches throat, gestures toward a drink and cups hand near lips; no eating/actual glass.
- Hot: wavy-haired boy, peach shirt/teal trousers/mustard shoes; visibly fans cheek and wipes forehead, two small sweat beads, feet planted.
- Cold: blonde bob-haired girl, lavender cardigan/teal skirt/peach boots; opposite hands contact upper arms, shoulder/head shiver, no snow background.
- Props: transparent 4x3 atlas, complete separate sandwich, water glass, paper fan, folded blanket, mint instant camera, microphone, wooden photo clip, mint shelf, sorting tray, empty photo frame, honey star and blank photo album. Same matte palette/contours; no text.
- Alpha cleanup edit: preserve exact illustrations, faces, poses and layout; remove gray haze and shadows outside silhouettes, actual transparent corners and gutters; no invented parts. Original sources are retained alongside cleaned variants.

Offline native export crops the source cells, aligns actors by their feet, preserves a fixed 400x520 canvas, and encodes six authored poses into GIF. No optical-flow or full-character scaling is represented as newly drawn limb animation. Matching stills and source frames are included. Pose-sheet sources are not designed for direct display in the learner UI.

## Text, buttons and effects

Glyph outlines are deterministically derived from the existing local `assets/fonts/Outfit-Bold.ttf`. This is the current App Outfit learning font; no AI-rendered spelling. Bare glyphs, individual tiles, complete words and button bases are distinct assets. SVG paths remain sharp at different sizes. Repeated letters and identical receiver geometry prevent colour/socket answer cues. UI symbols and VFX are original project-native vector/raster artwork from the export script.

Effect GIFs are bounded single-play overlays; matching static versions support reduced motion. Read-along uses `audio.currentTime` and acoustic word timings. The generic glow animation is not a substitute for word alignment. It must not flash continuously behind text.

## Book reference

Family and Friends Starter, 2nd edition, Oxford University Press, printed page 38. The verified source page is preserved unchanged in `sources/book-page38-reference.png`; portrait crops and the home panel are under `book-reference/`. These retain textbook copyright and are not claimed as project-original artwork or a new open license. No repainting or invented restoration of character detail was performed.

Source inspected: https://medialib.qlgd.edu.vn/Uploads/THU_VIEN/shn/1/1917/UserFiles/Family-and-Friends-Starter-Class-Book-2nd-05088795-ae16-43b0-b58d-570d06ea48d2.pdf (PDF page 39, printed page 38).

## Speech

28 complete local Higgs Audio V3 recordings. Existing approved Unit 3 Belinda reference (`unit3-belinda-reference.wav`), not a new provider or voice. No pitch shift. Audio manifest records exact scripts, reference and output SHA256, measured duration, seed, ASR transcript and measured alignment. Sentence clips are complete recordings, not concatenated word files. Automatic content verification is separate from human listening approval; `humanReviewed` stays false until reviewed. Model weights/reference audio are not shipped in this pack.

## SFX and music

Real sampled Kenney Foley, CC0-1.0, from RPG Audio and Impact Sounds: https://kenney.nl/assets/rpg-audio and https://kenney.nl/assets/impact-sounds . Exact existing source files, hashes and license copies are under `audio/sfx/source-*`; cue aliases have their original sources in the asset manifest. Credits are preserved despite CC0 allowing reuse without attribution.

The optional 24-second quiet music bed is an original procedural pentatonic composition made by the export script, with no third-party recording or voice. Preview music starts only on request, ducks under speech and stops on mute/hidden/leave. Classroom loudness/voice character still needs the teacher's listening review.

## Rebuild and integration boundary

### Helping action extension, 2026-11-26

After approval to implement the games, four additional original imagegen pose sheets preserve the accepted actor identities and show receiving/eating a sandwich, drinking water, fanning, and wrapping a blanket. `sources/reactions.json` records the four generation files; `sources/reaction-*.png` retains original sheets. Prompts require exact 3x2 six-pose grids, full connected anatomy, visible hand/prop contacts, invariant costume/face, grounded feet and actual transparent background. The per-source asset records include the action-specific prompt. No textbook character was silently replaced.

`tools/export_unit5_feelings_reactions.py` performs native cropping/registration/encoding only: 400x520 canvas, ground anchor 200,508, six distinct poses, 1880ms single play and a final still. Source and derived hashes are in manifest.json. In-game the native GIF plays from prefetched bytes via a fresh short-lived blob URL and waits for its measured authored duration after image load; final pose persists. Speech gates still use audio-ended, never the GIF duration. No real-time student transcription or pronunciation score is claimed.

`tools/export_unit5_feelings_assets.py` exports the original artwork/type/UI kit; run `tools/export_unit5_feelings_reactions.py` afterwards to retain the subsequent helping-action extension in the manifest. `tools/build_unit5_feelings_audio.py` generates/resumes only the finite Higgs catalogue with the approved cached model/reference. `preview.html` remains an independent asset inspector. The later authorized app integration is documented separately in docs/game-plans/unit5-feelings; existing lesson routes and progress are preserved. No public frontend release has been made at this checkpoint.
