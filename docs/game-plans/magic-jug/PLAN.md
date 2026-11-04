# Magic Jug — Jolly Juice Garden
Status: implemented and locally verified; public deployment pending.
## Approved scope
User: “Vậy tiến hành làm” after recommendation to build one complete Magic Jug screen first. PixiJS 8.22.0 + existing GSAP. PixiUI https://github.com/pixijs/ui (MIT) and Pixi Creation https://github.com/pixijs/create-pixi consulted for skinned buttons and distinct pressed/disabled states; reference only, not new runtime dependencies. Skills frontend-design, interaction-design, imagegen.
Route activity=magic-jug; game key u4magicjug. Unit 4 Lesson 3 becomes available with only this activity; preserve other planned lessons.
## Art and layout
Premium children's citrus garden, mint/turquoise/orange palette, large scene. New raster background with empty worktop; independent transparent jug (spout right) and empty transparent cup. Original SVG leaf/wood control skins and icons; dynamic liquid/stream/ripples sit in physical locations, live words remain App Outfit. Cover separate from interactive scene. All project media lives under assets/magic-jug; catalogue/provenance records generated sources.
## Learning/state flow
Start/discovery: touch J, j, jug, juice to hear. Four heard targets show simple collected marks. Pour: drag jug handle right/up to tilt around handle, stream starts only past tilt threshold, fill continues only while held and stream lands inside cup; release returns upright. Full glass reveals juice and completion only after discovery plus fill. Listen/replay remain available; explicit restart resets. Keyboard/hold pour alternative and no renderer fallback with direct DOM controls. No phoneme classification/score claim.
Audio: finite new Higgs V3 Belinda clips letter name, jug, juice, discover instruction, pour instruction, completion. Standalone /dʒ/ not generated/claimed in this first slice; later phonics activity needs separate audition. Real sourced pour foley loop, muted and ducked under voice, no synthesized tones. No background track until licensed suitable source selected.
## QA gates
Actual mouse drag, touch/keyboard equivalent, partial/release/full fill, discovery gate, exactly one completion event, replay/reset, five widths, reduced motion, audio failure, mute, leave cleanup, source catalogue. Visual inspect jug/cup/spout/stream geometry. Child learning outcome NOT_MEASURED.

## Local verification 2026-11-04
`node tests/magic-jug.spec.cjs` PASS: actual ended events for discovery words from the six-file Higgs catalogue, direct mouse drag, partial fill and release stop, keyboard held pour, only one reward, restart, five widths with 48px targets and caption separation, no missing media/page errors, cleanup, real touch held pour with reduced motion, renderer failure fallback, audio abort and retry without false heard marks. Generated artwork visually inspected in desktop and phone screenshots; stream begins at spout and reaches inside glass. Audio clips pass ASR text check 6/6, not a phoneme-quality certification. Fixes included container-width responsive layout and body-safe cup fill. The first activity only is ready; remaining four concepts not implemented.

Existing broad navigation.spec.cjs stops on an outdated expected Unit 3 activity label (Listen & Decide versus current Toy Machine), outside this change; no old game was renamed here. Scoped Unit 4 Lesson 3 navigation and existing lesson counts are checked independently.

Final local QA passed again after proportional sprite geometry, cup touch-to-listen, and container responsive corrections. Scoped navigation/mute/unchanged Unit 2–3 lesson count checks also PASS. 10 graphics, 6 Higgs voice clips and one attributed adapted pouring sound are catalogued.
