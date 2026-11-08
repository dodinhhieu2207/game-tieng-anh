# number-repair-lab
Status: implemented, locally verified and publicly verified at runtime commit a3a4436.
Approved stack: PixiJS + GSAP; user explicitly chose hybrid Phaser. No re-ask.
Task: Goal numeral/word/audio9 or10 vs actual display8/9/10. Add/remove separate lantern objects, actual count is authority; Test switch lights board only if exact. No automatic answer. Subsequent rounds shuffled target/current with no immediate repeat. Four repair rounds; original interactive lamp/control art.
Sources: Phaser existing bundled MIT, PixiJS8.22 existing MIT, GSAP bundled project license. Skills read/applied: Game Studio web-game-foundations (state outside renderer), phaser-2d-game (thin scenes, real physics/input), game-ui-frontend (readable HUD), sprite-pipeline (shared anchors/scale for native parts, static kit does not require frame strip), game-playtest (actual input/screens/motion), frontend-design, imagegen for original separate backgrounds.
Art: consistent mint/gold/cream preschool mobile theme; twilight fireflies have blue/gold contrast. Generated clean original environment per game; interactive moving/native layers authored separately. Shared original control/ten-frame/feedback kit, individual fly body/wing/glow, lantern, lift cabin/doors/handle, conveyor track/roller/diverter; approved vocab/portraits reused. Sources and inventory in assets/unit4-numbers.
Audio: new finite Higgs V3 catalogue using approved Belinda reference; existing family and jug word clips reused. Numeral9/wordnine,10/ten always tied to actual counts/destination. New word timings included in Unit4 shared read-along.
QA planned: correct/incorrect/correction flow per game, actual engine motion and geometry, recording review, all4games×5widths, touch/keyboard/mute/reduced motion/media failure/leave/progress/public. Human classroom impact/physical hardware FPS NOT_MEASURED.

## Verification checkpoint — 2026-11-08
- Four rounds per activity exercised through UI controls, exact quantities, wrong-answer correction, no automatic count fixing, single completion award. Lift wrong floors keep doors closed; correct floor settles before reveal and family question.
- Real Phaser sprite input and movement, pause/resume, route cleanup; one tap captures exactly one firefly. Real Pixi handle drag and correct cabin arrival.
- All four activities at 320/390/768/1024/1366px: no horizontal overflow or broken images, controls at least 48px. Emulated touch, keyboard, reduced motion, shell mute and interrupted/failed native media retry checked.
- Native audio ended gates checked; count playback highlights actual ten-frame words. Sixteen newly generated Higgs clips have transcript checks and word timings; accepted family/Jj audio preserved.
- Original scenes and interactive layers reviewed in screenshots and sampled actual browser recording. SVG WebGL black rectangles were corrected using transparent normalized PNG texture exports. Mobile lift focuses on the opened cabin without stretching the portrait.
- Tests: tests/unit4-number-state.cjs, unit4-numbers-functional.cjs, unit4-numbers-input-layout.cjs, unit4-numbers-edges.cjs; Jj review also unit4-numbers-review.cjs. Browser suites run serially because concurrent headless runs caused intermittent readiness/audio timeouts.
- Bounded existing Kenney tactile SFX; no continuous background music over counting/voice. Review buttons use accepted Higgs clips.
- Limits: physical touch device/speaker listening, hardware FPS and classroom learning impact NOT_MEASURED. Automated transcription is not a human pronunciation certification.

Public checkpoint: GitHub Pages workflow for a3a4436 completed successfully. Serial Playwright verification completed a correct round in each of the four public routes with native engines/audio, unlocked Next, no JavaScript errors and no failed own media responses. Test: tests/unit4-numbers-public.cjs. Full four-round local loops rerun after Jj review addition: PASS all four.
