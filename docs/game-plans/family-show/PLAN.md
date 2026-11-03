# Family Show plan

Status: implemented and locally smoke tested; public GitHub Pages verification pending.

## Decision

User selected Family Show to replace Activity 4, 2026-11-03. Reuse the previously approved PixiJS + GSAP stack for this Activity 4 and the project's App Outfit UI. PixiJS provides reveal particles; GSAP controls motion timing. DOM buttons keep sentences legible and input accessible. `imagegen` created the new stage and curtain art; interaction-design guidance informed the two-role flow. The old Family Photo Rescue remains historical and is not presented in the lesson.

## Learning flow

1. Director chooses three distinct family portraits by tapping or dragging them onto the stage.
2. Hand the screen to a guesser. The curtain closes and hides the order.
3. Guesser asks “Who’s this?”; the approved Higgs question plays and curtains open to a silhouette.
4. Guesser says and selects a full “This is my …” sentence. A hint partly reveals the face; a wrong choice nudges locally. Correct choice reveals the portrait, plays the approved Higgs sentence and collects a portrait.
5. Three portraits form a group show; children swap roles and replay with a new order.

## Inventory

| Asset or system | Path or source | Role |
|---|---|
| Original garden stage | `assets/family-show/stage.png` | Layered theater setting |
| Original velvet curtain | `assets/family-show/curtain.png` | Two moving curtain halves |
| Six approved transparent portraits | `assets/family-treehouse-talk/portraits/*.png` | Characters and group finale |
| Higgs question | `assets/family-album/audio/question.mp3` | Prompt |
| Higgs family words and sentences | `Unit4FamilyClips`, `FamilyAlbumClips` | Selection and reveal |
| App font | `var(--app-font)` | All live UI text |
| PixiJS + GSAP | Existing project runtimes | Reveal stars and motion |

Route remains `activity=family-photo-rescue`; game/progress key remains `u4familyrescue` to preserve saved progress. No speech recognition is claimed in this game; the peer or teacher hears the child's line.

## QA checkpoint

- Local Chromium: Activity 4 route opens Family Show; select three guests, start, ask, retry one wrong sentence, reveal three correct sentences and see the group finale.
- 390px mobile: no horizontal overflow; controls and finale remain visible. Desktop 1366px initial scene visually inspected.
- `node --check shared/family-show.js` passed. Audio wiring uses approved Higgs files; a real microphone or pronunciation score is intentionally outside this classroom role play.
- Public GitHub Pages verification pending deployment.
