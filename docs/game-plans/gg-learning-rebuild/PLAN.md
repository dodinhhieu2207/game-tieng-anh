# Gg lesson rebuild — observed audit and plan

Activity 4 update 2026-10-15: Match G and g is now Gg Maze Relay. Same big-small route/u3ggsort/progress key, with the new two-team gate maze adapter loaded after the workshop. Its current rules, validation and delivery are in ../gg-maze-relay/RULES.md and PLAN.md; older pairing descriptions below are historical.

## Writing-only request - 2026-10-15

Delivery PASS: functional release df7423d, Pages run 38660766602 success. Public source parity passed. Public gg-trace-writing-only.spec.cjs completed all eight trace/copy rounds with actual pointer input, no voice prompts/microphone/ASR requests, eight writing-only task records and three stars. Local six-activity regression/five widths also passed, including the separate speaking routes. Desktop mirror synchronized. This acceptance result supersedes the pending status below.

User requested removing listening/speaking from Trace. Trace & Write keeps the trace-say route/key and eight G/g/girl/guitar trace/copy rounds, numbered formation and pen demo. Removes automatic voice cues, Hear again, microphone and speaking completion gates. All writing rounds, including final review, start without voice; separate speaking activities/rounds remain. Writing completion saves traced/copied evidence and stars without new speaking evidence. This targeted change does not yet replace the freehand input with the older fixed-mould mechanic discussed separately. Validation/public gate pending.

Date 2026-10-14. Status: implemented and verified on GitHub Pages (functional release c9802a1); real-child classroom evaluation remains a follow-up. Selected stack: GSAP + PixiJS + existing SVG writing. User explicitly chose this approach; do not ask again.

## Observations verified

Public UI: Meet Letter Gg displays Capital G / Lowercase g, says Meet capital G and lowercase g. Catch says Catch capital G and lowercase g, asking to find both forms in E/F. Big/Small instructs sorting into homes; Fix the Word supplies uitar/irl and only asks for first g. Source/manifest still reference Capital G and Lowercase g clips. These assess shape match and initial-letter placement, not full-word writing or spontaneous speaking.

Current AI word checking is in shared SpeakingPlay.WordTurn for girl/guitar Mystery Box and Trace & Say after G/g tracing. It uses Cloudflare gg-word contract. Meet/Catch/Sort/Fix currently do not require spoken word recognition. Isolated /g/ is a model/imitation exercise, not STT scoring.

## Learning sequence (preserve activity IDs)

1. meet-gg: Learn Gg. Four short steps: both forms/name G; both forms/short /g/ + existing front-facing mouth; picture/whole word girl and guitar; alternating see/say prompts. Remove uppercase/lowercase voice labels. No AI gate on short sound. Name speaking needs new gg-letter-name adapter/evaluator contract; accept explicit name forms without confusing words.
2. sound-detective: retain Sound Garden. Review A-D and G, unique picture answers. It measures sound discrimination, not speaking.
3. catch-g: Find Gg. Two-stage recognition: model visible, then model hidden; familiar distractors A-D/E/F, no rapid motion during choice. Reveal Gg pair, short sound and familiar word after selection. Rewards depend on recognition; an optional word-speaking turn can follow, recorded separately.
4. big-small: Match G ↔ g. Replace terminology-based houses with pairing the two forms. Start G/g only; add previously learned pairs. Highlight both forms and say G, then /g/, then one word. Do not add repeated mic gates or adult classification labels. Consistent single-storey g.
5. fix-word: Build girl/guitar. Start missing g; progress to full 4/6-letter assembly in correct sequence, model visible → faded → optional hidden. After assembly read whole word; child says it via gg-word AI to animate girl/guitar. Keep assembly correctness and speech evidence separate. This is whole-word matching/spelling practice, not proof children can decode unlearned graphemes.
6. trace-say: Write & Say. Demonstrate G and g, trace → copy on blank ruled space with model alongside → optional without model. Add guided whole-word girl/guitar tracing/copying. Check actual ink coverage, bounds, stroke continuity/order with reasonable motor tolerance, not arbitrary scribble count. Optional independent writing only after exposure to all constituent letter shapes; no automatic claim of handwritten-word recognition from SVG coverage. Speech after writing uses gg-word, separately scored.
7. final-challenge: My Gg Check. A short independent review: choose G/g without model; hear name vs sound tasks explicitly marked; read one printed word without picture/model audio then speak; picture naming separate; assemble full word without model if ready; copy G/g and one word. Keep teacher reports/evidence distinct for tasks, no Teacher Check approval gate. If not independent, offer supported practice and label it accordingly.

## Audio / scoring

Keep approved sound-g take 1, existing girl/guitar and Letter Land name G where valid. Remove child-facing Capital/Lowercase instructions across introduction/catch/sort, not just headers. Inventory each instruction clip, generate only needed Higgs replacement cues with same approved reference; human review for phoneme changes (none planned).

Cloudflare: add gg-letter-name only if name-G checks included. Validated vocabulary/schema, neutral context, no expected answer prompt, aliases carefully scoped. Existing word checks retain recognition leniency and structure; silence/unclear never scores as error. Do not invent isolated-phoneme pronunciation scores.

Evidence labels: recognized forms; name spoken; sound discrimination; picture named; printed word read; full word assembled; traced; copied; optional independent writing. Keep best stars and old progress data, version task evidence so legacy sorting completion does not automatically prove new writing mastery.

## Visual / repo / skill direction

One coherent garden/workshop setting with same girl/guitar, G/g shapes, speaker/mouth/mic/pencil cues. DOM text large; settings moved out of main child task. Generated assets only for new layered scene/control parts, preserve vocabulary art. PixiJS 8.22.0 MIT scene, GSAP 3.15.0 timelines, existing SVG writing; no new rendering engine. Official sources: https://github.com/pixijs/pixijs , https://github.com/greensock/GSAP . Existing local vendor license/provenance applies.

Skills used for this audit: design-critique, interaction-design. Planned implementation: frontend-design, imagegen, engineering testing/debug/deploy as needed. Skill inclusion is not a visual-quality verdict.

## Delivery order / gates

- [x] Observe four public activities and inspect speech/source/clip metadata.
- [x] Record explicit GSAP + PixiJS + SVG choice.
- [x] Plan the seven linked activities and distinguish independent/supported evidence.
- [x] Fix Meet/name-sound-word model and all obsolete cue vocabulary first.
- [x] Extend speech name contract and test uncertainty/misrecognition/silence.
- [x] Rebuild recognition/pairing, then complete-word assembly/speech.
- [x] Full writing/copy progression and final review.
- [x] New layered art; real motion review; five widths and input/cleanup/audio/score regression.
- [x] Public deployment and source/asset/game verification.

Limits: this implementation has not tested real children or certified pronunciation. App evidence must state what task was performed; cannot guarantee retention or independent full-word writing from one session.

## Implemented acceptance record

Six adapters now replace legacy gameplay while preserving IDs; Sound Garden remains. Learn Gg has 8 stages; Find Gg 4; Match G/g 3; Build & Say 4; Write & Say 8; My Gg Check 7. Recognition/name, picture naming/printed reading, assembly and motor tasks have separate version-2 evidence. Immediate audio models mark subsequent speaking assisted. Legacy stars are preserved without inventing new task evidence.

Writing uses original project SVG print glyphs: G two strokes; single-storey g one continuous anticlockwise bowl, descender and left curl. Ruled baselines and descenders are consistent for G/g/girl/guitar. Demo lifts between strokes; actual ink is checked in order with motor tolerance. Early lift, reversed path and skipped segments do not complete a stroke. Whole words require every stroke including i dot and t cross. Copying with a visible model remains assisted practice, not independent writing mastery.

Approved phoneme take 1, girl/guitar/chant and Letter Land name clip reused. No new TTS was generated for this release. Cloudflare name-G contract accepts G/Gee/Letter G and rejects another letter name; isolated /g/ remains imitation without ASR scoring. Worker version 382e5dc4-cdcb-486d-ad54-4aa1706ca90f deployed to hiei1121. Live adult clips Letter G/Letter E returned CORRECT/WRONG_LOGIC respectively; this does not measure child recognition accuracy.

Local checks passed: gg-writing.spec.cjs (real pointer, all five texts in trace/copy, negative stroke cases); gg-workshop.spec.cjs (all six complete routes, captured audio with mocked ASR, five widths, audio/evidence/stars/cleanup); gg-workshop-edges.spec.cjs (demo, reduced motion, failed audio/retry, complete guitar, legacy progress); gg-name-worker.spec.mjs; child-friendly-speech.spec.mjs; toy-speech-worker.spec.mjs (419 cases); sound-garden.spec.cjs regression. Visual review covered mobile paper/model and full-word ink.

Skills applied: frontend-design, interaction-design, design-critique, imagegen, testing-strategy and deploy-checklist. Existing GSAP/Pixi vendor builds drive motion; original SVG implements the handwriting task rather than replacing the animation libraries.

Formation references, consulted as guidance only; no publisher illustrations or mnemonics copied:
- Oxford handwriting guidance: https://cdn.oxfordowl.co.uk/2016/11/11/13/43/27/153/rwi_RPhO_HW_guidance.pdf
- Oxford Nelson formation: https://cdn.oxfordowl.co.uk/2016/03/18/16/30/27/611/NH_TB_letter_form_techniques_FM.pdf
- Learning Without Tears: https://www.lwtears.com/letter-number-formation-charts
The chosen print model is consistent within the app; it is not claimed to be the sole universal handwriting method.

## Public delivery gate — 2026-10-15

PASS functional release c9802a1, Pages run 38600915033 completed successfully. Public source parity passed for index and all changed client modules; all three WebP asset hashes match. The full gg-workshop suite also passed against the actual GitHub Pages URL: six complete activities, real pointer input, microphone capture with mocked ASR, uncertainty retry, whole-word slots, saved task evidence/stars, five widths, lifecycle cleanup, no page errors or missing resources. A prior public run encountered a transient failed response for unchanged toy-delivery.js; direct recheck returned 200 and the final full run passed without exclusions.

Live Cloudflare adult name clips were tested separately (G correct, E rejected); full child ASR accuracy remains unmeasured. The public browser suite mocks transcription and does not establish real-child pronunciation acceptance. Writing checks validate ordered guided paths and copying, not unrestricted handwritten-text recognition. Desktop mirror synchronized with the release.


## Supplied formation correction - 2026-10-15

Delivery gate PASS: functional release d61f284; GitHub Pages run 38659069264 succeeded. Public source parity passed; gg-formation.spec.cjs ran on the live Pages URL with numbered GSAP demo and actual pointer completion for G/g, correct up/right directions, separate g strokes, no demo credit, no page errors and mobile width check. Local gg-writing, gg-workshop (six routes/five widths) and gg-workshop-edges passed. Desktop mirror synchronized. This gate supersedes the pending status in the implementation note below.

User supplied two formation images. This supersedes the initial model: G movement 1 around, movement 2 up in the same physical stroke, lift, then movement 3 from inside to right. Reference 1 numbers three movements; reference 2 groups around/up as one stroke. App follows three numbered movements and two physical strokes. g uses 1 closed anticlockwise bowl, lift, 2 top-down descender curling left. Applies to all G/g and g in girl/guitar. Original SVG redrawn; watermarked images are not redistributed. Approved GSAP + PixiJS + SVG retained; interaction-design skill used for numbered arrows, active steps and lift cues. Status: local pointer writing tests, six linked activities and live numbered GSAP demo checks passed. Visual review covered mobile G-up, G-across and g guides; actual-speed demo recorded in tests/gg-formation-video. Public gate pending.

2026-10-29 load recovery: broad route smoke exposed GgWriting undefined at render once. Added on-demand retry of original Gg writing module, accessible error/retry and boot-token leave protection; no glyph or curriculum change. gg-model-recovery.cjs PASS with initial module blocked then real successful reload. Writing-only regression running.

Recovery follow-up final local: gg-model-recovery.cjs PASS; gg-trace-writing-only.spec.cjs PASS all eight actual trace/copy rounds with original glyphs and saved stars, zero voice/mic/ASR writing gates. Broad70route/five-width smoke re-run PASS after guard.
