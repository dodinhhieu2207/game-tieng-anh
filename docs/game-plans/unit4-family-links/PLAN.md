# Family Links plan

2026-10-27. Stack approved: **PixiJS + GSAP**.

Objective: match each written family word to the source-book character portrait. New route `unit/4/lesson/1?mode=practice&activity=family-links`; game/progress key `u4familylinks`. Existing four activities remain.

## Art and interaction

Bright Family Park background, cream word ribbons left, gold-rimmed portrait cards right. All six pairs visible. Center space reserved for colored connecting lines. Shared app font, 48px minimum targets. DOM words and portraits sit above Pixi lines; correct endpoints acquire checkmarks. No written answers on unmatched pictures.

State flow: loading → choose word → connecting → correct/retry → six matched → result. Restart reshuffles both columns. Repeat taps and pointer cancellation preserve state. Success lines grow with GSAP then keep their endpoints on resize. Retry line fades and disappears. A short Pixi particle bloom appears at matched endpoint; reduced motion skips bloom.

Skills used: frontend-design (layout/art alignment), interaction-design (previously read in this conversation, gesture and states), imagegen (precise grandma proportion edit). Source docs: https://pixijs.com/8.x/guides/components/scene-objects/graphics and https://gsap.com/docs/v3/GSAP/gsap.to()/ . Existing local PixiJS 8.22.0 and GSAP runtime reused.

Assets: six deterministic crops from supplied textbook `family-portraits.webp`, excluding labels; existing navigation-v2 lesson1 background. Corrected picnic scene in `family-picnic-balanced-v2.webp`, preserving characters and scene, used by existing family games.

Status: implemented and local browser test passed. `tests/unit4-family-links.spec.cjs` confirms real Pixi renderer, six portraits, wrong retry, actual pointer drag, tap/keyboard, six matches, exactly one completion event, best-score persistence, restart, 320/390/768/1024/1366px, reduced motion, mute without voice starts, audio failure without lost matches, cleanup on leave and balanced-v2 scene. Screenshots and a browser video saved in tests. No classroom learning-outcome claim.


2026-10-29 whole-app upgrade LOCAL checkpoint: Added original full-character reunion row using exact existing sprite-sheet cells, quiet word ribbons, explicit retry cross, anti-repeat replay first word, and pointer listener cleanup. Existing full Family Links suite PASS incl real Pixi, wrong/correct drag/tap/keyboard, six pairs/stars once, five widths, mute/errors/reduced/leave.

## 2026-10-29 cumulative picnic trial

User approved three-activity Unit4 Lesson1 pilot. Details and scoped validation in ../unit4-lesson1-family-park/PILOT_20261029.md. Local implementation only; existing routes, approved character art/Higgs and progress preserved.
