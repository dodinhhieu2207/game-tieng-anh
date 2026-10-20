# Unit 3 Lesson 5 — Letters and Sounds: Hh and Ii

Updated 2026-10-20. Status: ASSETS READY — STOP before game implementation.

## User scope and stop boundary

Today taught: Hh — hat, horse; Ii — ill, insect. The previous Unit 3 Lesson 5 Review card is inaccurate for this user's lesson. Update that presentation first and create the art pack, then stop. No game logic/audio/speaking/trace implementation in this phase. This is not approval of a new game stack; no stack selection question is needed for static presentation.

## Design

Cheerful soft painted-paper/wood phonics studio, sky/teal/lavender/honey/ivory; gentle shapes, restrained highlights. Existing bundled Outfit for labels. Clear grouping Hh and Ii with four large images. No new audio or IPA in child UI. Capital I has top/bottom bars, lowercase i is dotted; word ill remains lowercase and exact.

Inventory: one dedicated empty game backdrop; one navigation card illustration replacing Review; independent transparent hat, horse, ill-child and insect sprites; four separate native vector letter recognition shapes plus four outline variants; two Hh/Ii group badges; a static word-card preview/gallery with exact HTML text and metadata. The empty backdrop has free middle space for later game controls. All vocabulary images remain separate and reusable.

Skills: imagegen (six bitmap outputs, alpha), frontend-design (card/preview hierarchy), design-critique (image/content/composition checks); existing app design-system/font retained. No new animation engine or external skill installation. Later games require their own approved plan and motion specification.

## Phases

- [x] Inspect current Review card and metadata; record new content.
- [x] Generate/inspect background, navigation illustration and four vocabulary sprites.
- [x] Native vector H/h/I/i and recognition outlines, exact word metadata, source/prompt/hash manifest and gallery.
- [x] Update Lesson 5 title/card and static preview only; no playable activities.
- [x] Verify all images and content at 320/390/768/1024/1366, preservation of other lessons/progress, public presentation and Desktop mirror.
- [x] STOP at assets-ready; propose/build games only in a later user-authorized phase.

No child engagement, speech accuracy, audio approval, or handwriting stroke-order claim at this checkpoint.

## Verification checkpoint

`node tests/lesson5-hi-assets.cjs` PASS: 20 manifest hashes, unchanged other lesson metadata, six-card navigation, exact four vocabulary words, five widths, loaded images, minimum 48px footer links, no preview progress writes or game controls, complete catalog. All selected raster outputs and desktop/mobile/catalog screenshots inspected. Footer spacing corrected for the fixed app dock. No game, audio or handwriting logic added.

Public checkpoint: release 81e10e0, GitHub Pages run 39454557708 completed success. The same five-width browser suite passed against the public URL, with all 20 served visual SHA256 values matching the manifest. Desktop mirror copied and hash-verified for all 34 release files plus three review screenshots. No gameplay, voice, speaking AI or trace work started.

Art revision 2026-10-20: replace insect with child-friendly cartoon beetle at user request; update vocabulary sprite, embedded word card, manifest, prompt provenance and cache versions. Asset-only stop remains in force.
