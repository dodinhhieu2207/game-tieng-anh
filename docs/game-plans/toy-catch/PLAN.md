# Toy Catch — plan

Updated 2026-10-16. Status: implementation and local gates passed; public delivery pending.

## Decision and scope

User explicitly selected **Phaser Arcade Physics** in response to the Toy Catch approach question. Alternative PixiJS + GSAP considered but not selected for this activity. Existing app shell/router/progress/audio integrations retained. New seventh activity of Unit 3 Lesson 4, `toy-catch` / `u3toycatch` / `3/4/toy-catch`; no replacement of the six Numbers activities. Classroom one child/team can drive each round; no new unequal random team race.

Rounds: seven cars, eight balloons, seven robots, eight teddies, five planes, six puppets. First two catches use target-only practice opportunities; later target/distractor opportunities are paced and recoverable. Missed target respawns without score penalty. Reaching the requested quantity stops the road; child links it to a numeral/word before next round. Wrong toy never increases count, no auto-given replacement answer.

## Repositories, version and skills

Pin local Phaser 3.90.0, verify published distribution and MIT license against official tag. https://github.com/phaserjs/phaser/tree/v3.90.0 . Physics/overlap/world pause: https://docs.phaser.io/phaser/concepts/physics/arcade . Responsive surface: https://docs.phaser.io/phaser/concepts/scale-manager . Reuse shared GSAP only where app shell already uses it; the arcade scene uses Phaser's own updates/tweens/particles. No external example artwork copied. Education references from the Numbers plan remain design references, not installed platforms or proof of efficacy.

Read/applied: frontend-design (subject-specific scene composition/type), interaction-design (input, pacing, recovery, state ownership), imagegen (dedicated raster layers), design-critique (screens/real-duration capture). No external skill installation. Skills read earlier in this conversation remain the same sources; frontend-design/imagegen refreshed for this implementation.

## Art direction / tokens / layer map

An inviting toy-garden driving course viewed from above, with a broad light path and tactile painted-paper greenery confined to the edges. A teal/coral cargo buggy is the focal point. Quiet sky/ivory surfaces support large readable toy silhouettes; no glossy cabinet, train, aircraft, slot reels or decorative card grid. Base colors: navy #164573, lake #3b8fa8, mint #b9d8bd, cream #fff7dc, coral #e88b78, gold #ffd365. App Outfit 700/800, target phrase 26–34px, controls 20–24px; live count row remains in DOM.

Asset inventory: five dedicated layers — empty road/garden backdrop, vehicle body, independent tire, garden tree and reward badge; native accessible directional controls; approved countable toy sprites reused unchanged; stationary DOM count row and target word/numeral. Draw simple lane marks/contact ellipses as native primitives, not generated bitmap text. Preserve cropped asset/source/brief manifest. The proposed depot was rejected for background contamination; actual reward uses the badge and vehicle departure. See assets/toy-catch/README.md and catalog.html.

## Storyboard and states

Loading -> spoken target ends -> ready card with left/right instructions -> child starts driving. Child changes lane, vehicle leans then settles; independent shadow/tire response; real Arcade overlap owns pickup. Target pickup -> short travel into collection feedback, count row updates exactly once. Wrong toy -> gentle deflection + target reminder; player can immediately continue. Missed collectible -> silent recycle. Target quantity reached -> world stops -> number audio ends -> short number/word choice -> badge/short vehicle departure -> next. After six rounds save best stars once.

Pause freezes active objects and spawning. Replay prompt pauses drive and resumes after ended. Backgrounding stops audio and leaves an explicit resume/recovery; resize recalculates lane geometry without moving collection count. Reduced motion uses the same lane choices as discrete opportunities and no continuous scroll, with “Let it pass” to skip another toy. Renderer-load failure exposes the same playable discrete round task.

## Gates and evidence

- [x] Scope, route and existing content inspected; stack choice recorded.
- [x] Art direction, quantities, input/recovery and ownership specified.
- [x] Dedicated art generated/cropped/alpha inspected; manifest and gallery.
- [x] Local pinned Phaser and original license/provenance.
- [x] App registration and complete playable loop.
- [x] Correct/mismatched/duplicate pickup and round check/progress; missed items recycle by scene bounds, no penalty.
- [x] Input/touch/keyboard, pause/audio/mute/reduced motion/fallback/resize/exit tested.
- [x] All five widths and real-duration motion capture; critique fixes.
- [ ] Public source/asset parity, navigation and playable public checks.

## Local validation checkpoint

- `tests/toy-catch.spec.cjs`: all six rounds through real Arcade overlaps at controlled spawn positions; wrong/duplicate collision, steering, pause, end choices, scores/best progress and cleanup passed. Both driving/calm layouts at 320, 390, 768, 1024 and 1366 px, no horizontal overflow, visible images and controls >=48px. Existing six activity IDs/order preserved.
- `tests/toy-catch-motion.spec.cjs`: natural spawn timing/physics and keyboard steering, no speed-up/count injection; four pickups in representative real-duration run. Source WebM decoded at eight timestamps by `tests/toy-catch-motion-review.cjs` and visually inspected. Scene delta samples are diagnostic only, not measured rendered FPS.
- `tests/toy-catch-edges.spec.cjs`: blocked/replayed voice recovery, text continuation without penalty, shared mute/unmute and blocked new SFX while muted, pause/resume, resize, exit during pickup flight, blocked-renderer calm round passed. All eight objects are inside the collection area without overlapping the counter at 320px; screenshot reviewed.
- `tests/number-studio.spec.cjs`: six existing Numbers games regression passed after integration.
- Critique fixes: preserve art aspect ratio; finish only after final pickup flight; resolve flight cleanup on resize/exit; clear stale shadow state; road accumulator freezes on pause; mobile collection uses two rows of four; native 60-frame cap via `fps.limit` (Phaser v3.90 TimeStep source); calm skip control prevents a forced mismatch.
- Six Higgs instructions passed ASR text check. Browser playback/decode paths tested; subjective human listening approval is still unclaimed.

Do not mark complete until the public game and necessary gates pass. Technical checks do not establish child engagement, learning efficacy or device-wide FPS. No new speech-accuracy claim.
