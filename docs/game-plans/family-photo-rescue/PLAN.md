# Family Photo Rescue plan

Status: historical. Replaced by Family Show in Unit 4 Lesson 2 Activity 4 on 2026-11-03; see `docs/game-plans/family-show/PLAN.md`. Route and progress key were retained.

## Approved approach

User delegated the choice on 2026-11-02. Selected PixiJS + GSAP: PixiJS (MIT, https://github.com/pixijs/pixijs) provides the scene/effect layer and lifecycle; GSAP (existing project runtime, https://github.com/greensock/GSAP) moves the photo into the persistent album. Skills used: `frontend-design` and `imagegen`.

## Inventory and evidence

| Area | Status | Evidence |
|---|---|---|
| Conveyor/scanner/album background | done | `assets/family-photo-rescue/background.webp` |
| Movable photo pieces | done | six approved `assets/unit4/lesson1/matching/*.webp` portraits |
| Live label cards | done | App Outfit DOM controls, click/tap and drag/drop |
| Correct/retry/collection states | done | scanner glow, local shake, persistent album thumbnails |
| Voice | reused Higgs | family word clips and full sentences already approved |
| Randomization | done | round and label orders reshuffled on restart |
| Progress | done | stable key `u4familyrescue`, best-star event |
| Five-width layout QA | pass | 320, 390, 768, 1024 and 1366; no horizontal overflow, visible controls at least 48px |
| Video/public QA | pending | not yet measured |
