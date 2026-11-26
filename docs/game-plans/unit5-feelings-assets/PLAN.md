# Unit 5 Lesson 1 — complete asset pack

Updated: 2026-11-26. Status: asset production and standalone technical QA complete locally; teacher voice approval pending. Game integration is not part of this checkpoint.

## Authorization and scope

User: “tạo asset toàn bộ cho phần unit 5 lesson 1 ... kể cả các nút bấm và hiệu ứng, background, âm thanh”. Prepare reusable artwork/audio for Present (Feelings House), Feelings Camera, Helping Hands, Feelings Photo Workshop and Little Reporter. Assets and a standalone interactive catalogue are authorized now. Actual game implementation and publication are outside this checkpoint.

Prior stack options (Phaser + GIF recommended; PixiJS + GIF alternative) are still unchosen. Do not re-ask while preparing renderer-independent assets. No renderer decision is needed to produce this pack.

## Curriculum and visual direction

Six words from verified book page 38: happy, sad, hungry, thirsty, hot, cold. Keep whole-word labels as the main match input. Optional letter tiles can snap into supported example words; do not require unprompted spelling of thirsty in initial learning.

Soft matte illustrated family home and photo workbench, warm cream, mint, honey and peach. Large calm central stage; decorations on edges. Main actors: happy boy, sad boy, hungry girl, thirsty girl, hot boy, cold girl. The 12 He’s/She’s sentence recordings support future alternative pictures; bind the correct pronoun to each actual actor. Book references are separately credited and are not overwritten.

## Skill and library map

Read/applied: imagegen (illustrated backgrounds and original motion-pose sheets); interaction-design (states, snap feedback, hint fading); frontend-design (coherent scene composition and typography); design-critique (actual scene/prop/type screenshots and interaction review). Prior motion direction from Scene Director: replayable authored-pose GIF, visible contact, SFX attached to contact cues. No game engine imported. Pillow/fontTools are offline production utilities; original local App Outfit glyphs provide precise reusable type, not AI-drawn lettering. Existing Kenney CC0 Foley is reused with attribution.

## Inventory and state map

- Backgrounds: empty home, photo workbench, helping counter, reporter corner.
- Characters: six source pose sheets, six stills, six GIFs, original decoded frame sequences and contact-sheet review.
- Book references: six source portraits and full home panel, original source retained separately.
- Props: sandwich, drink, fan, blanket, camera, microphone, photo clip, shelf, word tray and photo frame.
- Text: six complete word labels; lowercase letter assets needed by those words; tile start/middle/end; empty receivers; word glow, selected and supported-hint states; build geometry per word.
- UI: back, play, hear word, hear sentence, pause, replay, next, undo, home, camera, microphone, done, mute/sound, help; base/pressed/disabled/focus variants.
- VFX: snap ring, word light, correct sparkle, retry return cue, photo flash, completion confetti; static equivalents for reduced motion.
- Audio: six isolated words, twelve complete He’s/She’s sentences, bounded instructions and feedback, word alignment metadata, original quiet optional music bed and licensed contact/click/feedback Foley.

## Gates and checkpoints

- [x] Book vocabulary and existing project voice/provenance inspected.
- [x] Asset-specific rules and map written before integration.
- [x] Generated artwork saved in project with prompt set and provenance; alpha-cleaned variants preserve original sources.
- [x] Glyph / UI / VFX kit exported with exact geometry. 15 lowercase glyphs, six word labels, four tile states, sixteen controls with four states and separate bare icons.
- [x] Six authored-pose GIFs encoded and decoded: six distinct frames per actor, fixed 400x520 canvas, matching still and single-play version. Contact sheets reviewed; native browser screenshots confirm changing GIF frames. This does not measure frame-rate performance or establish animation quality with children.
- [x] 28 new complete Higgs clips: six words, twelve full sentences, seven instructions, three feedback clips. All pass exact normalized transcript and measured acoustic alignment checks; humanReviewed=false.
- [x] Standalone browser catalogue verifies actual asset/audio playback and read-along, including all six main model sentences. Actual in-app browser opened and hungry/GIF/Hear sentence clicked.
- [x] Five viewport checks (320/390/768/1024/1366), App Outfit loaded, no horizontal overflow or broken assigned images. Mute/suspend stop speech and clear lights; reduced-motion uses stills; unavailable audio reports retry. Last full browser run: errors=[], missing=[].
- [x] Final manifest, evidence and limitations updated. 376 asset records include sources, variants and frames; this is not a claim of 376 independent illustrations.

## Evidence and review notes

Local catalogue: http://127.0.0.1:8775/assets/unit5/lesson1/preview.html . Source files and production assets: assets/unit5/lesson1/ . Native browser report/video and five screenshots: evidence/browser-qa.json, evidence/video/, evidence/preview-*.png. Decoded frame/ground-anchor audit: evidence/media-audit.json and evidence/motion-*.jpg. Scene, prop and word composition reviewed in evidence/scene-hungry.png, evidence/props.png, evidence/letters-hungry.png.

Issues found and corrected: source haze on hungry/hot sheets made actors appear smaller; imagegen alpha-cleaned variants and fixed foot anchors corrected it. Props use individual calibrated crops so fan/clip contours are retained. A low-alpha light animation vanished in binary-alpha GIF; a visible bounded sheen replaced that GIF, while SVG/static glow keeps soft transparency. Missing-audio promise rejection previously overwrote the visible error state; token gating now preserves the error and prevents stale status updates. The last full QA run includes those fixes.

Preview is an asset inspector, with scene selector, actual native media playback, letter separation/joining demonstration and effect/SFX controls. It is not the child's final game UI. Engine choice, activity implementation, progress/speech-AI integration and publication remain separate future work.

Human voice approval, child learning outcomes, app integration and public deployment are not measured by this pack.

Subsequent checkpoint: the user then authorized game implementation. See ../unit5-feelings/PLAN.md for the five local activity flows and the outstanding authenticated Worker deployment. Four additional helping-action GIFs are now part of the asset pack; current manifest has 412 records. Original 376-record asset-preparation evidence above is retained as historical evidence, not rewritten as a test of the later games.


2026-11-26 background continuation: six additional original imagegen scene plates are now in sources/backgrounds-v2 and backgrounds/v2, with generation provenance and normalized prompt briefs. The current manifest has 424 hash-bound records. Old sources/artwork remain. All six are integrated in Unit5 menus and the five games; 30 responsive layouts and missing-background retry are verified by tests/unit5-backgrounds.spec.cjs. Actual Worker deployment and native UI live-model checks are documented in ../unit5-feelings/PLAN.md; these do not establish child accuracy.
