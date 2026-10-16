# Say & Open - implementation checkpoint

2026-10-16 visual revision: existing paper asset now uses a bottom-hinged DOM perspective rig; toys fade into the page at unchanged proportions instead of stretching the entire group. Same number recognition, capture silence, model-audio-ended gate and retry policy. Shared actual Outfit type and scene-first layout. Parent plan records delivery/QA and subjective acceptance limits.

2026-10-15. Implemented locally; public delivery tracked in ../unit3-lesson4-numbers/PLAN.md.

Route: /unit/3/lesson/4?mode=practice&activity=say-open. Game u3nsay; progress key 3/4/say-open. Selected runtime: existing PixiJS 8.22.0 + GSAP 3.15.0. Education sources are references, not installed platforms.

AI recognizes one number from numeral, word or counted group; paper pop-up follows recognition and model audio. Six rounds; phrases are not graded in this release.

Dedicated art: assets/number-studio/book/scene.webp, prop.webp, part.webp, accent.webp; shared number-studio toy/UI surfaces. Actual layer/voice/SFX inventory and full provenance: assets/number-studio/README.md and asset-manifest.json.

Local full-round progression and shared progress verified by tests/number-studio.spec.cjs. Input/audio failure, AI contract and capture boundaries: tests/number-studio-edges.spec.cjs and number-speech suites. Five-width artifacts are named tests/number-studio-say-open-<width>.png. Actual motion/review evidence and public verification stay in the parent lesson plan; do not claim a gate until that entry records its result.
