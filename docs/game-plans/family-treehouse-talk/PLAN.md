# Family Treehouse Talk plan

Status: batch speaking feedback deployed; final-transcript word slots implemented. Realtime transcription is not released. Child-speech quality remains unmeasured.

## Approved approach

User delegated the choice on 2026-11-02. Selected PixiJS + GSAP + the existing Cloudflare speech boundary. PixiJS (MIT, https://github.com/pixijs/pixijs) owns the layered portrait scene; GSAP (existing licensed project runtime, https://github.com/greensock/GSAP) owns paced reveal and feedback; Cloudflare Whisper performs transcription and deterministic semantic checking.

Skills used: `frontend-design` for hierarchy/type/layout; `imagegen` for the two game-specific raster assets. App Outfit remains the live UI font.

## Inventory and evidence

| Area | Status | Evidence |
|---|---|---|
| Background | sharpened | `assets/family-treehouse-talk/background-sharp.png`; original `background.webp` preserved |
| Transparent frame | sharpened | `assets/family-treehouse-talk/portrait-frame-sharp.png`; transparent center verified, original preserved |
| Character art | sharpened derived assets | six transparent `assets/family-treehouse-talk/portraits/*.png`, edited from the approved textbook crops; originals remain in `assets/unit4/lesson1/matching/` |
| Interaction states | done | orb ready/recording/processing/correct, transcript and retry states |
| Result assets and choreography | done | dedicated correct/retry SVG badges, scene glow, portrait cheer/nudge, shared SFX/VFX |
| Voice | reused Higgs | `assets/family-album/audio/clips.js`, exact six sentences and question |
| Speaking contract | deployed | `family-introduction` evaluator + Whisper Worker; public batch request verified with approved Higgs clip |
| Word slots | implemented | final Cloudflare transcript fills `This / is / my / family word`; incomplete/wrong remain retry; UNCLEAR stays blank |
| Realtime words | blocked at live transport QA | Nova-3 WebSocket accepted the connection but closed on the first PCM audio frame, including an approved Higgs clip. Worker rolled back to stable batch version `19353ad2-a483-4031-ba48-0fb7c90563ab`. No simulated interim words shipped. |
| Progress | done | stable key `u4familytalk`, best-star event |
| Five-width layout QA | pass | 320, 390, 768, 1024 and 1366; no horizontal overflow, visible controls at least 48px |
| Public QA | partial pass | GitHub Pages `da0a8cb` serves new files; mocked Cloudflare completion in Chromium passed at 320, 390, 768 and 1366 px with no horizontal overflow or page errors. Approved Higgs `grandma.mp3` returned CORRECT from deployed batch Worker. Child microphone speech remains unmeasured. |
| Sharp-art QA | public pass | six dedicated portraits decoded in Pixi at 320, 390, 768 and 1366 px locally; no horizontal overflow or page errors. Scene screenshot reviewed with sharp background, oval mat, frame and grandma portrait. GitHub Pages deployment `3d57e61` succeeded; new background, frame and portraits return HTTP 200, and public scene uses the new background without page errors. |

No pronunciation score is displayed. The final count is only the number of complete introductions accepted by the semantic evaluator.
