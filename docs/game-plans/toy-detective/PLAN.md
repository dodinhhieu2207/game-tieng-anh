# Toy Detective — layered discovery room

Updated 2026-10-16. Status: implemented; local gameplay, recovery, motion review and regressions passed. Public validation pending.

## Approved approach / scope

User accepted the recommended upgrade after discussing PixiJS UI/Create, Filters and GSAP skills. Existing PixiJS + GSAP stays; Creation Web is a reference, not a replacement app. Integrate scoped PixiUI and optional Outline/DropShadow filters compatible with existing v8. Rive/Rex/new physics not part of this room. Same `toy-detective` / `u3ndetective` / `3/4/toy-detective`. Existing six other Numbers activities unchanged. Six rounds remain 7 cars, 8 balloons, 5 robots, 8 teddies, 7 planes, 6 puppets.

## Repo and skill map

- PixiJS UI 2.4.1: MIT; npm peer `pixi.js ^8.6.2`, compatible with existing 8.22.0. FancyButton for scene handle interaction/state; DOM equivalent for keyboard and text. Source https://github.com/pixijs/ui , FancyButton.ts and README read.
- PixiJS Create Creation Web Button.ts: MIT; reference for separate view/state and natural image proportions. https://github.com/pixijs/create-pixi/blob/main/templates/template-creation-web/src/app/ui/Button.ts . No template framework migration or copied example art.
- Pixi Filters 6.1.5: MIT; peer Pixi >=8.0.0. Selective outline feedback, not whole-room filters. Verify pinned distribution/API/license before integration. https://github.com/pixijs/filters .
- Existing GSAP + MotionPath: owned reveal/retrieval timelines. Official gsap-timeline skill read at https://raw.githubusercontent.com/greensock/gsap-skills/main/skills/gsap-timeline/SKILL.md ; documentation reference only, not installed externally.
- Skills read/applied: frontend-design (scene/art direction), interaction-design (discovery/recovery states), design-systems (scoped consistent tokens), imagegen (separate raster parts), design-critique (screens and real motion). No global Tailwind/font/framework changes.

## Art / layout

Soft painted wood and woven fabric, gentle daylight; navy #164573 text, ivory #fff9e9, teal #4c9e9c, coral #df8d79, honey #e5b969, sage #a9c69b. Inherit App Outfit 700/800. Target task 26–32px, controls >=48px. Scene is the focal element; compact mission and stationary collection tray. Three front-facing furniture bays. Wide screens show all; narrow screens show one bay at a time with three picture tabs, preserving sufficiently large toys/handles. Main action changes from explore -> check count -> numeral -> word -> next.

Asset map, all new: quiet room background; open cabinet body + hinged door; open basket body + independent lid; arched alcove + independent curtain used as left/right pair; collection tray; detective completion badge. Countable toys reused unchanged. Body/cover layers must align through measured opening bounds, never stretched whole-image wobble. Store generation brief/source/crops/hashes and gallery; preserve original alpha.

## Learning / state storyboard

Load -> target instruction -> ready/explore. Cabinet door pivots open, basket lid lifts/tilts, paired curtains slide. Toys reveal only as each cover moves. Child selects matching toys; each lifts then settles into its fixed collection slot. Other toys remain and give neutral retry. Collected objects can be returned via tray to inspect again. Check before all found gives “There are more ...”; does not reveal target count. All found -> “How many toys did you find?” ends -> choose numeral -> correct number voice ends -> choose number word -> badge and completed room -> next. Replay follows the current stage, never reads the number before the numeral count. Stars are practice result, not general mastery.

Owned epochs guard all promises. In-flight retrieval disables check and reserves that item; resize/exit cancels safely or settles owned transitions. Audio failure has retry/text; mute stops owned audio/SFX. Pause/background freezes scene and active timeline; explicit resume. Reduced motion settles directly. Renderer failure uses accessible zone/cover/toy HTML fallback with the same rules.

## Gates

- [x] Scope/approved stack/route/rounds and skill responsibilities recorded.
- [x] New layered art inspected, cropped, manifested and gallery.
- [x] Pinned compatible UI/filter library and license/provenance.
- [x] Complete playable six-round replacement and preserved progress.
- [x] Actual pointer/touch/keyboard, accessible DOM controls, undo, wrong/duplicate, pause, audio/mute, resize/exit and fallback checks.
- [x] Five widths, source video at actual duration, critique fixes.
- [x] Other Numbers and Toy Catch regressions.
- [ ] Public served parity/gameplay and Desktop mirror.

## Implementation / local evidence

- `shared/toy-detective.js` overrides this single game after original Number Studio registration. Other game code and speech service untouched. Activity image now uses the new badge; route/order/progress key retained.
- Nine generated art layers; original square door rejected/replaced, second atlas unequal crop bounds inspected to preserve full arch/curtain. Original PNGs/prompt set/alpha and source hashes recorded. Cabinet door, basket lid and paired curtains each have their own GSAP track. Tray uses a native nine-slice border, countable sprites keep natural proportions.
- Seven Higgs/Belinda instructions passed ASR text checks; no subjective listening approval claimed. Existing number clips and Kenney CC0 interface SFX reused.
- Actual UI bundle is `PIXI.ui` and requires tweedle UMD; the CJS dependency was rejected during local integration. Pinned UI 2.4.1 / tweedle 2.1.0 / Filters 6.1.5 with exact distributions, hashes and original MIT licenses. New libraries load only in this activity; optional failures do not block the core room.
- `tests/toy-detective.spec.cjs`: six full rooms via actual PixiUI handle drag and canvas sprite hit tests; wrong toy, duplicate, return/recollect, early check, numeral retry, correct numeral/word, word-stage replay, points/best progress and route cleanup. Five widths x normal/reduced motion, no overflow and primary targets >=48px. PASS.
- `tests/toy-detective-edges.spec.cjs`: real touch and keyboard Enter through native controls, optional UI/filter failure keeps Pixi room playable, voice abort/text continuation at initial and word stages, pause mid-open, resize during pickup (one commit), shared mute, hide/show during pickup retains explicit pause, exit during flight, renderer-blocked HTML round, eight opaque objects and >=48px return targets inside tray at 320px. PASS.
- `tests/toy-detective-motion.spec.cjs`: no speed-up or mocked acceptance; real pointer drags on all three covers, seven actual sprite pickups, audio/digit/word/reward loop. 13.048 seconds from interactive start through round result in representative Headless Edge run. Captured source WebM decoded at eight timestamps (1.8–14.3 seconds including initial load/audio) and visually reviewed. Not rendered-FPS or classroom-device evidence.
- Critique fixes: door aspect/pivot match, no toy peeking through a closed cover, basket lid remains behind its body rather than floating, handle glyph centered, one large bay below 780px scene width, mobile undo targets 48px, stationary opaque count objects during choices, current-task replay, return restores sprite interaction, resize settles in-flight object and hidden/show cannot bypass explicit pause.
- `tests/number-studio.spec.cjs`: all five unchanged original Number Studio loops/scores/widths/undo/cleanup PASS (run with the initial `NS_SKIP_DETECTIVE=1` switch, now made the default five-game scope). Replacement Detective is covered by its own suite. Speaking acceptance remains simulated in that regression.
- `tests/toy-catch.spec.cjs`: full arcade six-round/progress/input/touch/five-width/reduced-motion regression PASS after integration.
- `tests/number-studio-polish.spec.cjs`: five unchanged compositions at all five widths, actual inherited font, image decode, touch size, Gift pointer/undo/exit regression PASS. Superseded Detective layout removed from this old layout suite and covered in its dedicated suite. Owned diff whitespace check clean; unmodified third-party distributions retain their original embedded shader/header whitespace and hashes.

Do not mark complete from code/library installation or mock acceptance. No subjective voice approval, child engagement or device-wide FPS claim.
