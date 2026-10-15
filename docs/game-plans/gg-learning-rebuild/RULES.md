# Gg learning rebuild — rules

Scope: Unit 3 Lesson 3. User chose GSAP + PixiJS + existing SVG for writing on 2026-10-14. Read root RULES.md / docs/GAME_WORKFLOW.md. This dossier governs the implemented rebuild; see PLAN.md for validation and release status.

- Preserve seven activity routes/IDs/progress keys and Sound Garden. Preserve approved girl/guitar art, Higgs voices and /g/ take 1. No framework rewrite.
- Child-facing speech must not say Capital/Uppercase/Lowercase as the main learning response. Use the letter name G, the short sound, and whole-word girl/guitar. Both G and g are forms of the same letter; upper/lower case is not a rule assigning name vs sound.
- Teacher's familiar G → name, g → sound chant can remain as a presentation cue, but demonstrate both forms together for sound/name association.
- Speech AI checks recognized name/word content, not a numerical pronunciation score. Existing gg-word supports girl/guitar. A distinct letter-name contract is required before scoring G; do not send G to gg-word. No Whisper correctness gate for isolated /g/.
- No teacher pass button; unclear/silence/device failure retry with no penalty. Do not auto-pass missing/wrong content.
- Recognition, letter name, initial-sound discrimination, picture naming, printed-word reading, full-word assembly, assisted copying, and independent writing are distinct evidence. Do not infer the others from one success.
- Single-storey g consistently across teaching/tracing/letterbank. Introduce font variation only after familiarity; do not silently switch g shape.
- Full girl/guitar writing starts with trace/copy, gradually remove models. Do not treat these full words as decodable solely from knowing Gg, or label traced/copying as independent spelling.
- Pixi scenes + GSAP owned timelines; SVG paths/checking with touch/keyboard alternative. Meaningful finite feedback, one task per screen, no racing while writing.


- Formation update 2026-10-15: user-supplied references supersede initial paths. G: continuous around/up (steps 1/2), lift, rightward bar (step 3). g: bowl, lift, down/left curl (steps 1/2). Demo, numbered arrows and actual validation use the same paths, including girl/guitar.
