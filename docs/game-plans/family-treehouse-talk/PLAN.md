# Family Treehouse Talk plan

Status: implemented locally, public Worker deployment and child-speech quality remain unmeasured.

## Approved approach

User delegated the choice on 2026-11-02. Selected PixiJS + GSAP + the existing Cloudflare speech boundary. PixiJS (MIT, https://github.com/pixijs/pixijs) owns the layered portrait scene; GSAP (existing licensed project runtime, https://github.com/greensock/GSAP) owns paced reveal and feedback; Cloudflare Whisper performs transcription and deterministic semantic checking.

Skills used: `frontend-design` for hierarchy/type/layout; `imagegen` for the two game-specific raster assets. App Outfit remains the live UI font.

## Inventory and evidence

| Area | Status | Evidence |
|---|---|---|
| Background | done | `assets/family-treehouse-talk/background.webp` |
| Transparent frame | done | `assets/family-treehouse-talk/portrait-frame.webp` |
| Character art | reused/approved | six `assets/unit4/lesson1/matching/*.webp` portraits |
| Interaction states | done | orb ready/recording/processing/correct, transcript and retry states |
| Voice | reused Higgs | `assets/family-album/audio/clips.js`, exact six sentences and question |
| Speaking contract | implemented locally | `family-introduction` evaluator + Worker source; public deployment not performed |
| Progress | done | stable key `u4familytalk`, best-star event |
| Five-width layout QA | pass | 320, 390, 768, 1024 and 1366; no horizontal overflow, visible controls at least 48px |
| Video/public QA | pending | not yet measured |

No pronunciation score is displayed. The final count is only the number of complete introductions accepted by the semantic evaluator.
