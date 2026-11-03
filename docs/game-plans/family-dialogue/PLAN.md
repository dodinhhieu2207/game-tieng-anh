# Family Dialogue Studio plan

Status: implemented and locally tested; GitHub Pages deployment pending.

## Decision and stack

User approved the dialogue concept and then specified the large family picture, pointing arrow, automatic question, sentence assembly, and follow-up spoken answer. DOM + GSAP was the proposed approach and is used for legible interactive words and transitions. Existing Cloudflare Worker and `Unit3Speech` are extended with `family-yes-no`. Skills applied: interaction-design for state and retry sequence; imagegen for original room artwork. Repositories: existing GSAP (motion) and app speech service, with Sugarizer as the educational interaction reference; no new framework.

Route: `activity=family-dialogue`; progress key: `u4familydialogue`. Existing Family Show and other activities remain separate.

## Asset and audio inventory

| Layer | Asset / source |
|---|---|
| Original large room | `assets/family-dialogue/room.png` |
| Original point arrow | `assets/family-dialogue/spotlight-arrow.svg` |
| Characters | Six approved full-body `assets/family-hide-seek/family-*.webp` sheets in the large scene; six approved transparent `assets/family-treehouse-talk/portraits/*.png` in the focused panels |
| UI word tiles, slots, speech cards | App Outfit DOM/CSS in `shared/family-dialogue.css` |
| Opening question, introductions, family words | Approved Higgs Family Album and Unit 4 clips |
| Six “Is this your …?” prompts, two answers | `assets/family-dialogue/audio/manifest.json`, Higgs V3, approved Belinda reference; eight transcript QA PASS, humanReviewed=false |
| Short interaction SFX | Dedicated `audio/arrow-cloth.ogg`, `tile-place.wav`, `tile-retry.wav`, `reveal.wav`, selected from the project's Kenney CC0 pack; provenance in `assets/family-dialogue/SOUND-CREDITS.md` |

## States

Scene → point → automatic question → build sentence → hear sentence → surprise yes/no question → microphone permission → recording → Cloudflare processing → accepted or local retry → next person → family finale. Mute, microphone error, reduced motion, and teacher-guided practice have separate paths. Teacher-guided practice does not claim AI verification.

## QA

- Source syntax, local evaluator and Worker contract tests passed. Existing number, G-name and Story Stage Worker contract tests also passed.
- Local Chromium six-person flow passed with simulated microphone callbacks: three Yes and three No, family finale, no overflow at 390px. Initial scene had no horizontal overflow at 320, 390, 768 and 1366px; desktop and mobile visuals inspected.
- Worker deployment version `5eabdfa8-b108-42d4-82f8-fa9f98349729` completed. Two real Worker calls using the generated Higgs Yes and No clips returned `CORRECT` with matching transcripts. These samples verify transport and grammar logic, not child speech accuracy.
- Public asset/audio and gameplay QA pending GitHub Pages deployment.
- Child speech quality and classroom learning effect are not measured.
