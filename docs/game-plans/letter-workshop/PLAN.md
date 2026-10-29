# Build the Word — original workshop scene

Status: implemented and locally validated, 2026-10-29. Public deployment not performed.

Approved scope: continue the all-old-game upgrade. Retain DOM + bundled GSAP (existing MIT repository/runtime), app shell, Letter Land data and route. No framework replacement or new game proposal. Skills read: frontend-design for scene hierarchy, interaction-design for gesture/state/lifecycle, imagegen for original raster art.

Learning task: construct each existing word from real individual letter tiles. Easy contains exactly the letters; Tricky adds two distinct distractors. Repeated letters remain separate draggable instances. Existing filters and queue retained.

Layer map: original workbench background; approved word picture/listen control; live LetterFont word guide; separate live letter slots with subdued ghost glyphs; original blank tile art with live text; compact in-scene completion strip. No baked educational text. No menu dashed containers.

Flow: hear word → select/drag → target hover → reserve tile/slot → smooth travel → settle glyph/check → all placements settled → word audio ended → completion actions. Wrong target returns only that tile and marks the attempted slot with ×. Escape/pointercancel/hidden returns a held tile. Reset/leave abort listeners, timers, tweens and audio. Reduced motion settles directly.

Audio: reuse each current `LETTER_WORDS[].audio` file; no new voice, no browser TTS. Playback uses a scoped HTMLAudioElement with ended/error/cancel resolution. Sound failure offers picture retry. Muting cancels owned voice. Current approved file provenance remains with original audio manifests; this change does not regenerate or recertify recordings.

Validation PASS: tests/letter-workshop.cjs exercises real pointer drag, native keyboard/tap, retry, repeated l, 18 current words, taught-letter filters, two-distractor Tricky, completion after actual ill.mp3 ended, interrupted/replayed audio gate, reset/leave during travel, mobile touch, reduced motion, missing-audio retry and five widths with48px hit areas. tests/navigation-kit.cjs also PASS across old/new menus and Letter Land, no resource/page errors. Images tests/letter-workshop-320..1366.png; normal-speed capture tests/letter-workshop-video/; sampled review tests/letter-workshop-motion-review.jpg.

Self-review: mobile teacher filters initially crowded out the task; replaced them with native disclosure. Long words wrap slots to two ordered rows on narrow screens to retain48px buttons. Completion now replaces the emptied tile tray. Retry changes only the attempted slot; no whole-scene shake. Original E/F renderer/binder not changed.

Limits: capture and functional tests are desktop-browser evidence, not measured device FPS or child outcomes. No new SFX pack/voice generation or public deployment in this checkpoint. Point & Say and other pending inventory rows retain their prior status.
