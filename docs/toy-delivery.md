# Toy Delivery — Unit 3 Lesson 1

Implemented 2026-10-13. Replaces the picture–word matching presentation on the existing `u3match` activity, preserving route and progress key `3/1/u3match`. Other lesson games remain unchanged.

## Concept and interaction

A sunny Toy Town airfield. One approved textbook toy picture, two neutrally colored word labels on parcels, a delivery plane and a puppet recipient. Tap/click or keyboard-select the parcel. The plane automatically transports a correct parcel; there is no motor accuracy score or countdown. Five rounds visit robot, teddy, plane, puppet and balloon exactly once; first round is robot vs teddy, later rounds and choice positions are shuffled.

No automatic target-name playback during picture-to-word selection. “Hear a hint” uses the approved Higgs word audio; assistance is tracked for this run. Wrong selections keep the task open and do not play the wrong word. Each incorrect alternative counts once per round, so repeated taps do not compound the score. After landing, the correct word plays to its actual `ended` event, followed by the existing toy action and common feedback. Next delivery is enabled only afterward. Failed/blocked audio offers an explicit retry instead of browser-voice fallback or advancing silently. Muting resolves the current voice so it cannot block the game.

Final stars: 3 with no wrong choices or listening hints, 2 with 1–3 combined, 1 with 4 or more. All children can complete every delivery. Completion uses `learning:activity-completed`, existing best-score storage and existing learner separation. Five local delivery stars indicate rounds completed; the final 1–3 stars are the activity award.

## Assets and motion

`assets/toy-delivery/atlas.png` is the original generated 1536×1024 transparent delivery-object atlas. Individual lossless WebP sprites are extracted using the rectangles in `manifest.json`, preventing adjacent-object bleed. The airport is a new generated background. Existing vocabulary images and Higgs audio remain in `assets/unit3/`. Existing licensed interface samples provide pickup, reveal, retry and celebration sounds through LearningFeedback; click audio remains global. No background music or audio during recording is introduced.

Plane flight lasts 1.25 seconds, then the existing toy-specific motion plays. Reduced-motion mode skips transport and toy movement. Leaving/restarting cancels voice and animation and invalidates pending results. Tab hiding stops voice; an interrupted reading can be retried.

## Validation

`tests/toy-delivery.spec.cjs`: real Higgs playback, no answer audio before choice, full five-toy run, wrong choice, keyboard activation, 320/390/768/1024/1366 widths, progress best-score updates, assistance, leaving during flight, reduced motion. Screenshots cover initial desktop/mobile and delivered state. These checks validate the interaction and playback, not children's learning outcomes.

Manual follow-up: observe whether children understand the picture-to-word task without teacher explanation. Add steering or extra distractors only after this interaction is easy to use.
