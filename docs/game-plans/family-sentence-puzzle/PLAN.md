# Family Sentence Puzzle plan

Status: gameplay publicly verified at `f0164d5`; complete 26-graphic kit locally verified and awaiting deployment, 2026-11-04.

## Approved decision

User requested an additional standalone game for “This is my …” and explicitly selected “PixiJS + GSAP — ưu tiên cảnh và các mảnh ghép trong canvas.” DOM + GSAP was offered as the alternative. Use existing local PixiJS 8.22.0 (MIT, https://github.com/pixijs/pixijs) for interactive pieces/slots and existing GSAP (bundled project license, https://github.com/greensock/GSAP) for pickup, return, swap and snap motion. Skills: interaction-design for state/input/feedback; imagegen for the new raster scene; original SVGs for scalable puzzle assets. No framework rewrite.

Route `activity=family-sentence-puzzle`, game/progress key `u4familypuzzle`; new Activity 6 in Unit 4 Lesson 2.

## Learning and interaction

Six randomized portraits. Arrange This / is / my / family word in four slots. Round one gives faint guides; later rounds remove guides and add a family distractor. Pieces can be rearranged and swapped before Check. Correct positions receive a check and lock; incorrect ones receive a local X and remain movable. The finished sentence is read by the approved Higgs clip, and its portrait stays in the collected strip. Next round requires an explicit action. Six sentences complete the family album.

Mouse/touch: drag, or select piece and tap slot. Keyboard: equivalent word/position buttons in “Use word buttons”; same underlying placements/checks. Resize preserves progress. Mobile uses two rows for the sentence and a separate two-column piece tray to keep words readable.

## Inventory

| Layer | Asset |
|---|---|
| Original craft desk | `assets/family-sentence-puzzle/desk.png`, generated empty scene with mint wooden border, ivory play field, coral album/corner decorations |
| Interactive pieces, slots, frame | Original SVGs in the same directory |
| Characters | Approved `assets/family-treehouse-talk/portraits/*.png` |
| Voice | Six exact `FamilyAlbumClips` sentences and its approved question/finale; reuse without regeneration |
| SFX | Bounded Kenney CC0 cues from the existing project sample pack; provenance in asset README |
| Reading font | App Outfit from the project font files |

## State flow

Loading → arrange → dragging/selecting → Check → partial-correct retry or Higgs reading → solved → next portrait → complete. Explicit paths for audio failure, renderer failure/keyboard controls, mute, hidden page, reduced motion, and leaving the activity.

## QA

`tests/family-sentence-puzzle.spec.cjs` passed in local Chromium:

- Real canvas dragging, tap selection/placement and swapping occupied slots; partial Check locks correct pieces while wrong ones remain editable.
- Six complete sentences using actual unaccelerated Higgs clips; later rounds add a family distractor; six portraits collected and exactly one completion event.
- Layout at 320, 390, 768, 1024 and 1366px; touchscreen tapping at 390px, reduced motion, and resize mid-round preserve placement without horizontal overflow.
- Renderer-load failure opens the equivalent word-button path; keyboard focus moves between word and position choices.
- Real audio playback, shell mute, leaving the activity and retryable failed voice request.

The SVG tab/notch curves use the same geometry and slot pitch so adjacent pieces interlock. Feedback marks use a layer above all pieces to remain visible at the joints. Desktop/mobile initial and retry scenes were inspected. No child learning or pronunciation measurement is claimed.

Portrait rendering uses game-owned, smoothly downsampled CanvasSource textures with mipmaps to avoid aliasing the approved high-resolution art at phone size. Source assets stay unchanged; derived textures are destroyed on exit.

GitHub Pages `f0164d5` deployment succeeded. Public Chromium checks at 390 and 1366px loaded the Pixi canvas and puzzle assets, assembled a sentence, played the actual Higgs sentence through its end, reached solved state and collected its portrait; no horizontal overflow or page errors. These public checks used the real hosted assets/audio, not simulated audio completion.

## Complete artwork kit correction

The first release had a new desk, shape and photo frame but generic control and finale styling. User requested complete assets for the whole game. The revised inventory has 26 graphics: dedicated activity cover, title plaque, mint/gold raster button skins, four colored interlocking word pieces, slot/tray, six control icons, correct/retry seals, status/progress plaques, portrait/collection frames and desktop/phone finale albums. Live controls retain real App Outfit text. Approved character portraits, Higgs sentences and sourced Kenney sounds remain the media catalogue.

See `assets/family-sentence-puzzle/catalog.html` and its generated `manifest.json` for per-file roles and hashes. No new scene engine or speech contract was introduced.

Full-kit local QA passed the existing real-canvas drag/tap/swap and six-sentence Higgs flow, correct/retry seals, colored pieces and trays, mute/leave cleanup, audio failure, keyboard fallback and layout at all five widths. Tests additionally confirm the raster title/primary-button skins and desktop/phone album selection; the catalogue loaded all 26 graphics without missing images. Initial, retry and completed album screenshots were inspected on desktop and phone; mobile subtitle was removed from the title plaque to avoid text touching its ornamented border, and finale captions use a consistent two-line sentence.
