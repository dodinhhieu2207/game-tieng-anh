# Hh / Ii — implementation plan

Approved 2026-10-20: Phaser + GSAP, dedicated layered art, new sourced SFX/VFX, Higgs H/I and words, Letter Land A–I. Status: DELIVERED — local and public gates passed.

Skills read: frontend-design (hierarchy/font/palette), interaction-design (trigger/rules/feedback and timing), design-systems (scoped consistent controls), design-critique (review actual scenes). Bitmap assets via imagegen. Phaser examples https://phaser.io/examples/v3/ and GSAP https://gsap.com/docs/v3/GSAP/Timeline/ used for scene lifecycle, particles, tween ownership. Existing pinned local engines reused.

Palette: pond teal #168994, cream #fffbea, coral #df705d, honey #f3bf55, navy #164573. Existing Outfit only. Scene dominates screen, mission and model visible, 1–3 target controls without decorative admin chrome.

Letter Pond: H/h and I/i recognition then four word pictures, followed by A–G review samples. Tap fish/keyboard choice -> cast -> contact ripple -> retrieve curved path -> basket settle -> read word -> next. No timer or penalty for missed opportunity. Word Mine: model + approved picture -> three candidate gems -> swing/cast -> contact dust -> retrieve weighted gem -> snap next character -> word audio and Next. Four words, exact letter order, duplicates as separate turns.

States: loading, ready, casting, retrieving, reading, resolved, complete, paused, audio-error with retry/text continuation, engine-error with retry. All feedback local, reduced-motion alternative. Voice completion is event-based; no fixed voice-delay guesses.

Gates: generated art/source inspection; file/hash/audio QA; correct + wrong real-input routes, repeated letters, mute/hidden/leave/restart, keyboard/touch, five widths 320/390/768/1024/1366; real-speed motion recording and visual review; public asset parity/playthrough; bounded Desktop sync. Phoneme audition approval remains explicit, never inferred from transcript.


## Local checkpoint 2026-10-21

- Four Lesson 5 entries: Learn Hh/Ii, Letter Pond (12 rounds including approved sound recognition), Word Mine (hat/horse/ill/insect) and existing A–I Word Builder. Letter Land scope expanded G -> I; H/I images, names, sounds, chants and words updated. A–G data and other lessons unchanged.
- User rejected initial H/I sounds, then explicitly approved V3 isolated Higgs segments. Rejected takes archived outside repo, manifest deployed=false. Six names/word transcripts checked; ill take repaired at seed 22603. Chants rebuilt after that repair. No ASR phoneme certification claim.
- Art inspected: dedicated pond/mine/fish/body/tail/basket/gem. Tail crop/attachment corrected after visual review. Hook SVG texture rendered as a black box in QA, so runtime replaced it with native Graphics. LetterFont (bundled Outfit) used in both renderer and DOM after detecting font fallback.
- New CC0 selections: Kenney Interface/Impact/Music Jingles/Particle; rubberduck water recording. Hash audit rejected a completion sound already used in Number Studio; pizzicato replacement has no old byte-identical SFX. No old oscillator feedback bank used.
- PASS tests/hi-assets.spec.cjs: manifest hashes, approved sound hashes, all six word transcripts, A–G data and unrelated lesson metadata preservation, old SFX duplicate audit.
- PASS tests/hi-adventures.spec.cjs: both complete real-time routes, wrong/rapid input, pause during retrieval, all four words and separate repeated l, five widths, Letter Land A–I. Zero page errors or missing resources.
- PASS tests/hi-edges.spec.cjs: reduced motion, failed audio/text continuation/retry, hidden/resume, real canvas touch, leave cleanup, Learn H/I five widths, missing art/retry, mute during paused voice.
- PASS tests/hi-motion-review.cjs: real-duration catch/contact/retrieval/snap, final scene no orphan owned tweens. Video and contact/pull/landed frames inspected. rAF sample is only browser scheduling, not presented GPU FPS or child-device performance certification. No child usability/engagement claim.
- Runtime art/SFX sources/licenses in assets/unit3/lesson5/adventure/CREDITS.md. Audio approval/provenance in audio/README.md. Models, rejected recordings and build cache remain outside deployable source.


## Public delivery checkpoint

Feature commit c104f7d, GitHub Pages run 39515487129 completed success. The full real-time game suite and edge suite both passed against https://dodinhhieu2207.github.io/game-tieng-anh/index.html?release=c104f7d-hi. All 45 selected visual/SFX/voice files matched SHA256 from the local manifests. Public suite includes five widths, both completed routes, approved sound recognition, ill repeated l, Learn H/I and Letter Land A–I, errors/retry/mute/hidden/touch/cleanup. Desktop mirror hash-verified for 57 release files; current QA reports and selected reviewed frames copied separately. No claim of classroom engagement, measured presented FPS, or AI pronunciation assessment.

H sound revision 2026-10-21: teacher requested clear Vietnamese “hờ”, listened to two Higgs takes and approved take 1. Replace H Sound and H chant consistently in Learn, Letter Land and Pond sound tasks. Name H, I, hat/horse and all other clips unchanged. New filenames avoid stale cached audio; this is a teaching cue with a vowel, not a bare English /h/.
