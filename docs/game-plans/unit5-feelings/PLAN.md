# Unit 5 Lesson 1 — Present and four games

Updated 2026-11-26. Status: existing Worker and frontend are publicly verified. Current visual correction uses six v3 backgrounds restyled against actual older-unit reference images; local 35-layout and lifecycle/navigation checks pass. Student accuracy remains unmeasured.

## Scope / authorization / stack

The user accepted the full outline with “V làm đi”. Proceed with the most recently recommended Phaser + GIF default rather than ask the same stack choice again. Native DOM readable labels/controls and GIF layers pair with existing vendored Phaser 3.90.0 (MIT), Canvas 2D renderer, for delivery paths, camera feedback and particles/tweens. Canvas 2D avoids an incomplete WebGL framebuffer found during renderer-failure/retry QA; this scene needs no shader effects. App shell, native audio ownership, LearningProgress and Unit3Speech remain authoritative. No framework migration. Previously produced assets are in assets/unit5/lesson1; their preparation evidence stays in unit5-feelings-assets.

Official references inspected: https://docs.phaser.io/phaser/concepts/scale-manager and https://docs.phaser.io/phaser/concepts/input . Local runtime/provenance: shared/vendor/phaser/ . Skills read/applied: frontend-design, interaction-design, backend-design:think-before-coding and security-discipline. Design-critique and relevant tests applied at review. No subagents.

## Routes and teaching flow

Unit5 shell registration, Lesson1 only; later lessons planned with no invented curriculum or fake completion.

| Route | Game/progress event key | Task |
| --- | --- | --- |
| feelings-house | u5feelingshouse | Tap and discover six meaningful actor GIFs; hear isolated word and full sentence, complete after visiting all six. |
| feelings-camera | u5feelingscamera | Listen to a full sentence, select correct actor among 2 then 3 shuffled pictures. Capture and retain six photos; reveal words only after correct choice. |
| helping-hands | u5helpinghands | Four states (hungry, thirsty, hot, cold), two passes; choose/drag sandwich/water/fan/blanket to actor. Delivery travels to actual actor contact location. |
| feelings-workshop | u5feelingsworkshop | Six word-picture matches with audio-on-pick, 2 then 3 options. Optional letter assembly with model and next-position validation; no forced unprompted spelling. |
| little-reporter | u5littlereporter | Six scene introductions using He’s/She’s adjective; hide model after early support, allow replay; strict sentence-content recognition via existing Cloudflare Worker. |

All practice targets repeat in shuffled rounds, and replay avoids the same prior order where feasible. Early supported matches and model-assisted spoken responses are not labelled independent reading/pronunciation mastery. First-choice evidence may be displayed descriptively without an academic mastery claim.

## State and safety design

Loading -> ready -> listening -> choosing -> retry or delivery/capture -> response audio -> resolved -> next -> complete. Listening choices unlock on ended only. Audio error exposes retry and blocks success transition. Model text/glow appears on response in Camera to preserve actual listening task. Present/Workshop may show supported labels. Reporter adds permission -> recording (<=8sec/Done) -> processing -> accepted/incomplete/wrong/unclear/error, with cancel and temporary replay.

Renderer boots once per activity and owns only its textures. Resize logical coordinates, DOM actor positions and Phaser objects together. Hidden/mute/navigation cancel speech and capture, clear lights and pointer drag, stop decorative sound and motion. No SFX/music during recording. Reduced motion substitutes stills and immediate placement. Async callbacks have per-owner/round tokens.

Backend delta: only feeling-sentence allowlisted task with 12 pronoun/adjective IDs. Pure evaluator accepts exact contracted/full copula sentences, reports missing copula/word-only incomplete, rejects wrong pronoun/adjective/polarity, leaves unknown transcript unclear. Replays are stateless; rate limiting/upload bounds/CORS/timeouts are retained. Whole six-word context, never target sentence as prompt. No storage/logging changes.

## Checkpoints

- [x] Scope, assets, pinned runtime and existing integration points inspected.
- [x] Five controllers/scenes and Unit5 navigation registered; later lessons locked without invented content.
- [x] Asset/font/voice/read-along and meaningful scene actions integrated. Four new six-pose helping GIFs show eating, drinking, fanning and blanket wrapping; final poses remain visible. Native GIF bytes are prefetched, checked and played from fresh temporary blob URLs, avoiding a cold-network replay race.
- [x] Shared speech grammar/adapter/Worker contract regression checks: 648 new strict cases; existing evaluator/adapter and 419-case Worker regression suite pass. New adapter test rejects forged success and preserves uncertainty.
- [x] Native gameplay: all five controllers completed with real Higgs playback; real pointer and native CDP touch drags, wrong/retry, shuffle, word-on-pick, optional letter pieces/keyboard, audio-ended gates, per-learner best progress and single completion events. Reporter uses actual shared recording adapter with fake hardware and simulated ASR replies; this is not live recognition quality evidence.
- [x] 25 route/width layouts (320/390/768/1024/1366), source-aligned word light, screenshots and motion video; teacher/classroom review remains unmeasured.
- [x] Relevant speech regressions and new Unit5 navigation/touch suite pass. Original navigation.spec.cjs stops at an existing stale Unit3 expected title (Listen & Decide versus Toy Machine); HEAD already contains Toy Machine. No unrelated lesson/test assertion was rewritten.
- [x] Actual in-app browser demo opened at feelings-house and hungry exploration clicked; local games are reviewable.
- [x] Authenticated Worker update and live feeling-sentence recognition validation. Version b4636235 deployed; eight model-clip requests and eight native recording UI requests returned the expected results. Source audio is approved generated Higgs, not student recordings; student accuracy remains unmeasured. Historical unsupported-task preflight is retained.

Publishing frontend is not requested by this turn; do not push unrelated files. Existing speech Worker may be updated only with this bounded task after contract checks, with current authentication; do not claim deployed/live inference if unavailable or untested. Child outcomes/human voice approval remain unmeasured.

## Publication authorization — 2026-11-26

The user subsequently requested “đẩy lên đi, còn chức năng AI thì làm đi”. Frontend publication to the existing origin/main and GitHub Pages is now explicitly authorized, as is completion of the existing Worker feature. Preserve unrelated Unit4 working files and index.html version changes. Include only Unit5 assets/controllers/config, bounded shared speech changes, production utilities/tests and relevant documentation/evidence; local diagnostic videos remain local. Verify actual served source and browser routes after pushing. Authentication is still required for the Worker; the earlier OAuth attempt timed out, not an AI/content failure. No alternate account/provider or temporary Worker is authorized as a workaround.

Publication base: 2e3fa65. Roll back the scoped release if required runtime assets fail publicly, existing routes regress or sentence safeguards fail; do not reset unrelated local work. Frontend push, public serving and live AI recognition are separate evidence gates.

### Published frontend verification — 2026-11-26

Published 8e1db4a to origin/main, followed by 99649e0 fixing the activity-card construction request for a nonexistent shared speaking icon. Reporter now supplies its own approved cover in both the image and coverImage fields, so the existing shell does not briefly request the missing icon. Only the Unit5 configuration/cache tag was changed; unrelated Unit4 index versions remain local.

GitHub Pages serves the updated index and all five routes. A fresh public browser context verified one Phaser canvas per route, no broken game images, no page errors or HTTP resource errors, actual Higgs House exploration, Camera audio-ended selection and capture, and Reporter model playback. See evidence/public-release.json and five public screenshots. This is frontend/media evidence, not live speech recognition.

At this initial frontend-publication checkpoint, Worker deployment was still pending account authentication. That historical unsupported-task response remains in live-worker-preflight.json. The subsequent authenticated deployment and real recognition evidence are recorded below; no simulated success is presented as live AI.

## Evidence / remaining handoff

### Background and live AI continuation — 2026-11-26

The user requested completion of AI and a dedicated background for Unit5 Lesson1 and its activities. Keep the approved Phaser + native GIF stack and all teaching/progress IDs; no stack question is repeated. Create six original matte-gouache scene plates using built-in imagegen: garden activity menu, discovery house, camera corner, kindness room, photo/word workshop and reporter nook. Cream/mint/peach palette, edge furnishings, quiet central actor area, no baked characters/words/buttons. Sources and WebP exports live alongside the approved old versions, with generation IDs and normalized prompt briefs in sources/backgrounds-v2.json. The Camera receives its own scene rather than reusing House. Scope shell scenery to Unit5 and clear it on exit; preserve older units.

Wrangler authentication completed with the account-limited Workers Scripts Write scope on hiei1121. Existing toy-buddy-speech deployed as version b4636235-9d08-4e56-b4ce-af18921c5bd4. All eight first live model-clip checks returned HTTP200 with the expected result: six full He’s sentences CORRECT, wrong-pronoun target WRONG_LOGIC, isolated word INCOMPLETE. See evidence/live-worker-model-clips.json. No student recordings or mocked inference were used for those requests. Actual browser recording/feedback verification and background responsive review follow below when complete.

Local app: http://127.0.0.1:8765/index.html?dev=u5feelings1#/unit/5/lesson/1?mode=practice . App code: shared/unit5-feelings.js/css; config data/units.js; registration and scoped cache tags in index.html. No app/progress rewrite or unrelated Unit4 changes overwritten.

Reports: evidence/gameplay.json (five complete activity flows, simulated-ASR distinction, 25 layouts, video path); evidence/navigation.json (class/back/reload/native touch and three old routes); evidence/edge-cases.json (four exact reaction GIF hashes with visible changing frames, delayed source loading, long-word model/scroll, recording/music cancellation, no remaining blob URLs and renderer retry); evidence/live-worker-preflight.json (current unsupported live task).

Asset additions: sources/reactions.json plus original sheets and 400x520 six-frame GIF/final-pose exports. Production utility tools/export_unit5_feelings_reactions.py; every source/derived file is in the existing asset manifest, now 412 records including source frames/variants. tools/audit_unit5_feelings_assets.py verifies all hashes and the ten actor/state/action GIFs. The SOURCE.md prompt/provenance set is extended. Actual input/route/audio errors are retryable; UNCLEAR never earns a pass or adds a mistake.

Worker deployment and actual inference checks are now complete for the bounded feeling-sentence task. CORS, rate limit, upload bounds, timeout, no persistent child audio/transcript and current provider are preserved. Evidence includes live-worker-model-clips.json, live-ui.json and worker-deployment.json; no temporary account/provider was used. Classroom/student accuracy and pronunciation assessment remain unmeasured.

Background technical review: all six generated sources and runtime files are hash-registered (424 manifest records total). Thirty local layouts across 320/390/768/1024/1366 widths pass, with native image decoding, separate Camera scenery, readable dark lesson title, no horizontal overflow, missing-background retry and no background leakage into Unit4. Four native action GIFs, microphone/music cancellation, renderer recovery and Unit5 navigation/legacy-route checks also pass. See evidence/backgrounds-v2/report.json. Public verification of this new scenery set is recorded after publication below.

### Public scenery and speaking verification — initial release

Runtime release f524b07 is served on the existing GitHub Pages site; its pages-build-and-deployment run 45786975418 completed successfully. All thirty layout checks passed again against the public site, including decoding all new backgrounds, missing-scene retry and leaving Unit5 without affecting Unit4. Evidence: backgrounds-v2-public/report.json and public screenshots.

Little Reporter was also exercised from the actual GitHub Pages origin through native Speak/Done controls and the existing adapter, with approved Higgs recordings substituted for fake microphone bytes at the test transport boundary. All eight actual Cloudflare replies produced the expected UI result: incomplete retry, wrong-pronoun retry and six accepted full sentences with completion/progress. No ASR reply was fabricated. See live-ui-public.json and live-ui-public-*.png. An additional generated two-second silence clip returned UNCLEAR and earned no correct result; its irrelevant hallucinated transcript is retained in live-silence.json as evidence of ASR limitations. This does not measure student accuracy or pronunciation. No student recording was sent or persisted in these checks.

### Whole-page background clarification — 2026-11-26

The user clarified both the Unit5 world background and Lesson1 game backgrounds. The first scenery release applied the garden inside lessonApp while the outer body retained the generic older-unit sky. Correct that scope: headerState now owns a Unit5-only body class and background variable on every Unit5 route, including direct game links, and clears both when leaving. The garden paints the full viewport behind the unit selector, lesson selector and game frame; the inner panel is transparent so it does not repeat the garden. Each activity retains its distinct v2 scene. Game content, voices, speech endpoint and progress are unchanged.

Local verification: 35 layouts include the Unit5 six-lesson selector, Lesson1 activity selector and five game stages at five widths. Confirmed full-page garden during game routes, separate inner scenes, and SPA transitions Unit5 -> Letter Land -> Unit5 -> Unit4 with no scenery leak. Existing Unit5 navigation, native touch and three legacy-route checks pass. Public results are refreshed after publication.

Whole-page publication verified: runtime release 7ba3462 is served and its GitHub Pages deployment completed successfully. The refreshed public 35-layout report confirms the Unit5 body garden on the unit selector, lesson selector and each game, separate inner scenes and SPA cleanup to Letter Land/Unit4. Evidence: evidence/backgrounds-v2-public/report.json and unit5-*.png.

### Match older-unit artwork — latest user correction

The user rejected the faded gouache background direction and requested continuity with older units. Inspect actual files before restyling: assets/shared-ui/unit3-select-bg.png, assets/unit4/navigation-v2/lesson1-background.webp and assets/family-dialogue/room.png. Use these as direct imagegen style-reference inputs, with the v2 backgrounds as edit targets; do not merely describe a guessed style. The six v3 scene plates retain each game composition and open interaction area, while using bright blue/green/coral/yellow, clean modeled furniture and coherent daylight. White/blue shell surfaces replace the newly introduced pale-sage/cream panel treatment. Existing actor/GIF, glyph, voice, sound, routes, progress, AI service and game logic are retained.

Active sources: sources/backgrounds-v3 with six native PNGs, runtime backgrounds/v3 with six WebPs; generation IDs, exact edit/style-reference hashes and normalized prompt briefs in sources/backgrounds-v3.json. Asset manifest now contains 436 records including archived versions and source files. Local 35 layouts pass at five widths, including full-page Unit5, lesson activity menu, each game and SPA exit to Letter Land/Unit4. Native four action GIFs, missing-scene/renderer retry, microphone cleanup and three legacy navigation checks pass. Public verification follows publication of this visual-only update.

Public v3 verification: release b838461 is served. All 35 layout/route/retry checks passed on GitHub Pages, and all six served background WebP hashes exactly match the generated v3 exports. See evidence/backgrounds-v3-public/report.json, hashes.json and screenshots. Visual comparison uses the actual older-unit references listed in sources/backgrounds-v3.json; teacher preference acceptance remains for the user to review.

### Cover and UI clarification — 2026-11-27

The user clarified that the missing picture was the Unit5 card in Explore your worlds, then explicitly included all five Lesson1 activity covers and the game UI shown in Photo Workshop. Keep the approved Phaser/native DOM stack, existing five activities, all GIF actors, voices, task rules, AI service, progress and earlier backgrounds. This checkpoint replaces navigation/cover artwork and synchronizes Unit5-only control surfaces, word tiles, letter pieces and feedback.

Design plan (frontend-design + imagegen): take the actual Unit4 navigation banner as a style/layout reference. World banner is 3:1 with Unit5, He's happy!, 6 lessons; activity covers are 2:1 scene illustrations with readable titles, large children and task-specific props. Preserve the original Unit5 hair/clothing identities in these separately rendered promotional covers. Palette: navy #194e76, sky blue #168bd2, white #ffffff, light blue #eef8ff, golden yellow #ffd85b, success green #e8f7e7. App Outfit stays the sole runtime font. Existing world/activity-card layout stays. The scene illustration carries the visual interest; controls use quiet white/blue surfaces, golden listening/selection, blue continuation/microphone, explicit success text/checks. No new decorative motion, no dashed card borders, no recoloring glyphs to encode answers.

Review against the brief: replacing only background images missed the user's actual cover/UI complaint. This pass explicitly changes the source bound to navigationCard, all five coverImage fields and Lesson1 cardImage, then replaces the cream/mint UI kit with versioned paint-only SVG variants retaining every glyph path and viewBox. Original artwork stays archived. Source PNGs, exact prompt set and reference hashes are in assets/unit5/lesson1/sources/covers-v2.json; reproducible vector paint map in sources/ui-v2.json. Runtime is covers/v2, ui/v2, words/v2 and letters/v2. Verification/publication results follow actual checks below.


Local validation completed: six assigned native covers decode at their original 3:1 / 2:1 ratios; world/activity menus pass at five widths, and all five games pass at 320/390/768/1024/1366 (25 game layouts). Actual word selection, model audio, correct placement, next action, optional letter placement, readable completed labels, keyboard focus, reduced motion and >=48px controls pass. The 176 vector variants preserve exact original geometry. Native touch drag/class back-next-reload/three earlier routes pass; four real reaction GIFs/anchors, slow loading, seven-letter model, microphone cancellation, blob cleanup and renderer retry pass. Asset audit verifies all 624 recorded hashes and existing 28 audio timing records. Evidence: evidence/covers-ui-v2/report.json and screenshots, refreshed navigation/edge-case reports. This is visual/runtime validation; no new student outcome or pronunciation claim. Public verification follows the push.


Final public cover/UI verification: release 5fdecd6 is served. All six cover images and representative vector assets match exact source-bound hashes; final public CSS/game script/unit config hashes match the committed exports. Release-specific native browser checks pass for both menus at five widths, all 25 game layouts, actual word success/letter placement, readable completed word bank, native focus and reduced motion, with errors=[] and missing=[]. White text on the final primary blue #1478b9 has 4.75:1 contrast. Earlier scenery ownership/SPA/retry checks also pass in evidence/covers-ui-v2/scenery. All original gameplay/audio/AI routes remain. Evidence: evidence/covers-ui-v2-public/report.json, hashes.json and screenshots; local geometry-audit.json confirms all 176 paint-only variants. One earlier public attempt using a generic cache query timed out waiting for the home card; a diagnostic load and the final release-specific run both rendered it successfully. No child-use effectiveness or new voice approval is claimed.

### Actual in-game UI/UX redesign — latest user correction, 2026-11-27

The user rejects a paint-only kit and explicitly requires the in-game UI/UX, fonts and text sizes to be designed. Root cause: Unit5 overrides the global Fredoka interface font with App Outfit, so its game UI visibly differs from the app. Keep the existing approved Phaser/DOM/GIF stack. Use frontend-design, interaction-design and imagegen for a scoped five-game interface overhaul; no new game/stack question.

Design before implementation: interface Fredoka 600/700, matching the local app; learning sentences and approved glyph models retain plain App Outfit 700/800. Desktop task text 24px, sentence 38–44px, controls 22px, status 20px, word choices ~36px visible glyph height. Mobile task 19–21px, sentence 28–32px, controls 19–20px, status 18px, no control below 52px. Remove the redundant oversized in-game title block (the shell already names the game); use a compact task/progress strip. Make the stage the main surface, with a clear listening control and subordinate music toggle. Organize word/prop choices as equal individual tactile pieces in a dedicated dock, with clear selection/check states. Reporter needs an identifiable recording console and distinct ready/listening/processing/result states; optional spelling keeps a legible model and horizontally scrollable receiver strip without page overflow. Progress uses actual visited/collected counts only.

Palette/material: clean blue #1286c9, navy #173f65, warm gold #ffd65c, white, honey-wood edge accents from the approved cover set. New original imagegen button/prompt/dock artwork has real alpha and quiet native-text centers, with native accessible labels above it. Actor/GIF/voice/background/cover content remains. States: idle clear primary action; audio visibly playing and competing controls gated; choice selectable; correct explicit check/text with native next; retry local return cue; network/audio error retry; recording no model/SFX/music; reduced motion no incidental animation. Review actual mouse/touch/focus and five widths before publication.


Implementation checkpoint: five original alpha plates (gold listen button, blue primary button, icy-blue secondary button, prompt plaque and honey-rimmed prop tray), sixteen authored dual-tone icons and six unchanged-path word-ink assets are integrated. Redundant big title removed from the visual flow; shell title retained. All five modes use compact task/progress; individual helper cards sit in the physical tray, word choices precede the toolbar in Photo Workshop, and Little Reporter prioritizes Speak with a microphone-state console. Music is a subordinate accessible note toggle. Optional spelling has a large legible model and scrollable receivers; no learning gate changed. Actual media events drive voice state and word glow. Existing local fonts are reused: measured desktop UI task 26px, controls 22px, status 20px, learning sentence 44px; mobile task >=19px, controls >=19px, status 18px, sentence 26–28px. Font-family measurements confirm Fredoka UI and Outfit learning models. No global font or older-unit framework changes.

Local checks completed: six covers unchanged; five-width menu and 25 game-layout checks, actual word placement/letter placement, >=48px targets, focus and reduced motion pass with the new font assertions. Native touch/class/back/next/reload/three prior-unit routes pass. Four real GIF reactions and contact anchors, slow-network loading, seven-letter supported build, recording/music cancellation, blob cleanup and renderer retry pass. Full background/SPA/retry suite (35 layouts) passes in evidence/game-ui-v3/scenery. The asset audit verifies all 656 hashes and existing audio/word timing evidence. The full gameplay suite is rerun after updating its obsolete Outfit-for-everything expectation; outcome follows completion below. Native catalogue QA passes at five widths with live Higgs demo and a working link to the actual speaking game.


Full frontend gameplay verification now passes: actual Present audio sequence, six Camera captures, eight helping deliveries, word-on-pick/word placement/supported letter assembly, Reporter correct/incomplete/wrong/UNCLEAR UI paths, completion counts, five-width layout/font checks, mute/leave/reduced motion and failed-audio gates. Reporter replies in this deterministic suite are simulated; the existing deployed AI endpoint is unchanged and no new child speech accuracy is measured. Exact paths for all six word-ink assets are independently confirmed unchanged (glyph-audit.json). Public verification follows the runtime push.
