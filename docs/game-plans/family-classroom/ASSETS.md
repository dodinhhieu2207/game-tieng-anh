# Family classroom — asset and validation record

2026-10-28 public stencil checkpoint COMPLETE: runtime a984dafabb2af9454bdf820036e2a251fbb90b95 is on origin/main; matching GitHub Pages deployment succeeded. Served handwriting model, classroom JS and CSS return HTTP200 with SHA256 equal to local. Public family-writing-stencil.cjs PASS (five widths, real offset pointer ink clipped inside mould, partial stroke earns no progress), family-writing-formation.cjs PASS (backtracking rejected, continuous m), and family-writing-demo.cjs PASS (visible ink, lift, no earned progress, reduced motion and cleanup). Full six-word/three-activity and touch edge suites PASS locally as recorded below. Earlier pending stencil notes are superseded. This is technical validation, not a claim of child learning outcomes or human acceptance.

2026-10-28 stencil standard: the visible trace model is now a continuous outlined letter mould with pale interior, following the user's E/F reference. Detached dots are no longer the letter's main shape. Both actual child ink and demonstration ink are masked to the same geometry, while formation rules remain unchanged. Fifteen SVG exports use the shared stencilMarkup helper. This supersedes earlier dotted-model visual records; current evidence is family-writing-stencil-{320,390,768,1024,1366}.png, family-writing-stencil-ink.png and family-writing-stencil-motion.jpg. Future-default requirement is recorded in root RULES.md and docs/GAME_WORKFLOW.md.

2026-10-28 handwriting correction: original multi-piece geometric letter model superseded by coherent continuous print formation. New model is shared/family-handwriting-model.js; print SVG/JSON exports match it. Formation-source.json records human-authored educational process references and independent geometry provenance, not a digitized writer recording. Demo now draws ink with deliberate lift/transit and numbered start cues; validator rejects extra backwards/shortcut/scribble motion rather than accepting broad proximity. Existing pictures, UI font, freewrite and Higgs catalogue unchanged. Local and public validation checkpoint recorded in ../family-trace-write/PLAN.md, including the reproduced old acceptance failure and actual six-word pointer completion with the corrected model.

Approved scope: Switcheroo, Trace & Write, Colour Studio. User accepted all three on2026-10-27. Family Parade remains retired. Existing five active Unit4 Lesson1 activities retain IDs/data; three new keys are u4familyswitch, u4familywrite, u4familycolour. Album art and writing are participation practice, not independently measured mastery.

## Integrated artwork

Twenty original imagegen outputs, source references and exact prompts recorded in assets/family-classroom/sources.json; originals retained at their generated locations. Export tools only resize/contain/convert and extract closed-region labels. Opaque scene pages and alpha foregrounds verified; no placeholder pictures.

| Asset files | Used by / role |
| --- | --- |
| switch-stage.webp | Switcheroo, whole stage background; cover-scaled without stretching |
| curtain.webp | Switcheroo, two independently animated curtain halves, overlapping closed edges |
| missing-spot.webp | Switcheroo, real empty-position clue and drag target |
| word-ribbon.webp | Three activities, word labels and main control surfaces, real App Outfit text |
| writing-desk.webp, paper-frame.webp, pencil.webp | Trace & Write, desk/paper and demo pen; real SVG ink follows pointer |
| colour-desk.webp, palette.webp | Colour Studio, art desk and palette cue |
| bucket.webp, brush.webp, eraser.webp | Colour Studio, interactive mode button tools |
| gallery-frame.webp | Colour Studio, retained coloured thumbnails |
| reward-sticker.webp | Three completion screens, six stars and heart, participation reward |
| line-mum.webp, line-dad.webp, line-brother.webp, line-sister.webp, line-grandpa.webp, line-grandma.webp | Six full-body colouring pages based on supplied textbook portrait identities; black/white large closed shapes |

Six regions-*.png label maps are deterministic derived data, not visible substitutes for artwork. Interior components only; outside and small open/noisy areas excluded. Region audit: mum19/dad26/brother35/sister24/grandpa49/grandma14 regions. Test verifies selected RGB changes, undo restores white, outside page stays white. Brush/eraser are deliberately freehand; they are not constrained to the same regions as Fill.

Fifteen original geometric print SVGs plus print/strokes.json export the exact runtime letter strokes. Single-storey lowercase a/g use a print model (declared exception to UI font); this is a handwriting shape model, not a licensed font file or recognition model. One subpath per pen stroke. Native pen cursor/start-dot/arrow and swatches are code-native state indicators rather than generated images; they must remain crisp and colour/state-dependent. Source-preserving family animation sheets from Hide&Seek supply Switcheroo characters; approved matching portraits provide writing cues.

## Font and speech

UI: local App Outfit700/800, var(--app-font); Pixi apps await document.fonts.ready; dynamic instructional text stays DOM. Exported gallery awaits fonts. New finite twelve-clip Higgs V3 catalogue with the existing Belinda reference: audio/manifest.json records script, reference hash, per-file hash/duration and actual ASR QA transcript. British/American colour/color and practised/practiced spelling are equivalent for the transcript check. All12 pass ASR text QA; humanReviewed=false retained. Existing six Higgs word pronunciations and try-again are reused. No browser speech, recording, or new provider.

Separate music/SFX: not added in this release. Common app click feedback remains; new auditory instruction/reaction is Higgs voice. Character/cartoon motion, curtain closing/reveal, ink following and direct paint changes supply meaningful visual feedback; no disruptive full-screen particle layer. Camera/physics are N/A for these tasks.

## Validation / self-review

family-classroom.spec.cjs PASS: real six Switcheroo rounds with all six unique missing targets, wrong retry and pointer drag; full six-word trace via real pointer paths; demo cannot advance progress; freewrite/export; six fill pages/undo/brush/gallery/export; each activity completion once, common stars3; five widths320/390/768/1024/1366 with48px controls/no overflow; actual Higgs playback, error, mute and disposal.

family-classroom-edges.cjs PASS: CDP real touch tracing/fill/brush; teleport-stroke rejection; static reduced-motion model; replay does not bypass audio-ended gate; exact paint RGB/undo; family-gallery download; eraser/keyboard cursor; restart/leave. family-classroom-smoke.cjs PASS: eight available activity routes and Parade absent, closed curtain/reveal, pen demo, blank-art guard and gallery export; no missing requests or page exceptions.

Design-critique review used visibility/status, error recovery, control size, and actual mounted art. Fixed multi-subpath tracing forcing impossible no-lift jumps; stale aborted-audio error; closed-curtain centre gap; replay advancing pending audio; oversized desktop colouring surface; stale blank-art error after keeping painted work. Desktop/mobile screenshots and actual browser video contact sheet reviewed. No measured FPS, child-ASR, voice listening approval or learning-outcome claim.

Evidence: tests/family-{switch-preview,write,colour}-{320,390,768,1024,1366}.png; family-switch-curtain-closed.png; family-writing-final.png; family-write-free.png; family-colour-final.png; family-classroom-motion.jpg. Videos retained locally under tests/family-classroom-video/ and family-classroom-smoke-video/, not as runtime payload.

Deployment gate: scoped static assets/modules/catalogue only; no backend/migrations/auth change. Rollback new catalogue entries/module links if critical task/asset load fails, preserving old activity progress. Public runtime verification follows push; no source-only deployment claim.

Public gate complete: origin/main runtime895851e0cb64c293652bceed15785d678c773246, matching Pages workflow success. Public index loads trio3 runtime; its HTTP200 SHA256 equals local source. Ran full family-classroom.spec.cjs, family-classroom-edges.cjs and family-classroom-smoke.cjs with CLASSROOM_BASE=https://dodinhhieu2207.github.io/game-tieng-anh/index.html: all PASS. Full six-round/six-word/six-page outcomes, actual served pictures/voices, correct counts/stars, five widths, touch/reduced motion/error/mute/downloads and cleanup verified. No missing resource requests or browser exceptions in these suites. Final public browser video contact sheet includes fully closed curtain and real traced strokes. Subsequent documentation-only commit does not change tested runtime.

Existing broad navigation.spec.cjs is stale outside this change: original assertion expects prior title Listen & Decide instead of the already-published Toy Machine. A diagnostic run with that title expectation updated only in memory then reaches a hidden old Teacher Check control removed by the speaking policy. Neither historical assertion is changed in this release; do not report that broad suite as PASS. Current new-route/catalogue/load/navigation coverage is the three-activity smoke and full actual-route suites above.
