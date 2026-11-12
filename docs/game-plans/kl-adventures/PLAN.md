# Unit 4 Lesson 5 — remaining four activities

2026-11-12. User explicitly requested all four remaining games, fully authored assets including buttons and VFX. Scope: Knock Knock; Kangaroo & Lion Express; Letter Workshop; Mystery Spotlight. Key Quest preserved.

Approved approach inherited from accepted K/L plan and user's instruction to proceed: local PixiJS 8.22 + GSAP 3.15 for layered scene/effects and DOM gesture controls; exact E/F traceCardHTML/bindTraceCard for tracing. Do not ask again. Hexi/KAPLAY consulted as interaction/component references, not imported as competing engines. Skills read/applied in this conversation: imagegen, frontend-design, interaction-design, design-critique. Own raster scene, props, button shells, plaque and effect sprites per game; accepted Key Quest vocabulary toys remain consistent. App Outfit for text. Only accepted Higgs words/letter names, no unverified isolated phoneme claims.

## Art / interaction contract
Mint, honey oak, coral; workshop lavender and stage deep teal variants. Four original 3:2 scenes and four transparent nine-prop sheets, measured crops and per-file alpha/hashes. Each kit has wide button, round button, plaque and VFX plus activity-specific moving parts. Labels remain live readable text. Own PNG button skins apply to ALL new controls, including reward/next/help/restart/word choices; solid borders only.

- Doors: hear word, choose matching K/L tree-house, knock then drag actual slab around its hinge; character emerges; word/name clips; discovered collection. Wrong house stays closed, retry. Four balanced rounds and shuffled word order, explicit accessible open alternative.
- Express: drag toy parcel onto matching K/L station. First four new words, then review hat/horse into return depot (neither K nor L). Actual parcel/cart travel, dust at contact, retained delivery list. Wrong drop returns without advancing. Tap parcel/station alternative; no time pressure.
- Workshop: assemble letter strokes in correct order, then trace whole target in individual E/F cards. Kk and Ll followed by key and lion (whole words). Start dot, 18-unit matching ink/guide, next card automatically activated, complete audio-ended gate; no free scribble counted as tracing. Extra glyph geometry only where missing; no modification of global E/F renderer.
- Spotlight: each round a hidden word toy under four draggable reveal panels. Hear the word, spend hints by dragging panels aside, choose matching picture or word (late rounds words only), then complete reveal. Wrong option returns for retry, clue use is assistance rather than failure. Four words and shuffled layout, all clues optional and no timer.

## Shared lifecycle
Loading and asset retry; no fake success on failed voice. One owner per Audio/tween/renderer/gesture; pause/hidden/route leave stop, suspend or cancel. Native ended gates for teaching and round transitions. Single-word highlight follows actual playing/ended/pause; no uniform sentence timing. Muted mode provides visible word support. Input min48, keyboard actions, pointercancel, reduced motion; verify 320/390/768/1024/1366.

## Evidence checklist
- [x] Four scene/kit inventories, extracted/provenance checked and integrated: 49 production raster exports, 12 retained final sources, per-game manifests.
- [x] Four distinct complete activity loops and progress keys.
- [x] Native input, retry, audio errors, replay, cleanup.
- [x] Actual E/F reference opened (`tests/kl-ef-reference.png`), matching 18-unit guide/ink measured, and all Kk/Ll/key/lion trace paths driven with real pointer input.
- [x] Pixel/screenshot and sampled motion QA (including no stray mask graphics).
- [ ] Public deployment and native playtest, honest limits.

## Local QA and design corrections
`tests/kl-adventures.cjs`: complete 4/6/4/4 rounds, wrong house/station/stroke/answer retry, actual door/parcel/curtain drag, all actual trace strokes, Higgs playback, single progress award, changed replay order, five widths and route cleanup PASS. Last K/k glyph correction rerun for Workshop PASS. `tests/kl-adventures-edges.cjs`: all four activities PASS audio abort/retry, pause/resume, emulated touch, keyboard, reduced motion and audio cleanup. AbortError caused by intentional pause is not treated as failed recording. `tests/kl-art.cjs`: all 49 hashes, alpha, button/VFX packs, clear doorway center and opaque veil PASS. `tests/kl-occlusion.cjs`: real-pixel comparison proves different hidden characters cannot leak through closed curtains, and opening a clue visibly changes scene.

Design critique: initial plaques stretched, replaced with separately generated wide assets; mobile crops center framing without stretching ornaments. Workshop mobile stage enlarged to prevent model/guide/pieces overlapping. Per-object measured crops remove neighbour fragments on round buttons. Spotlight teal controls use cream labels for contrast; correct option does not glow before the child answers. Backgrounds cover/crop proportionally rather than stretch. Headings, labels and controls use App Outfit. Own door-arrow affordance, parcel cart, pencil, lens and per-game VFX integrated. Source-sheet optional knob/peg/extra plaque remain in the pack rather than adding useless decoration.

Runtime media uses accepted Higgs Key Quest catalogue (four words, K/L names) and accepted Hh hat/horse clips for Express review. No browser speech, new provider, forced phoneme approximation, AI scoring or mastery claim. Native playback tested, no new phonetic certification. Actual browser videos under `tests/kl-video-*/`, screenshots `tests/kl-final-*` and `tests/kl-*-success.png` retained locally. Physical classroom effectiveness, real tablet handling and hardware FPS remain unmeasured.
