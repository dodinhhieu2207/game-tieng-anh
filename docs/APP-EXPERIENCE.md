# Preschool learning app shell

This first shell design is superseded by the complete playground design documented in `APP-WORLD.md`. Resume storage and learner separation described here remain in use.

The October 6 update reshapes Home and the shared navigation without replacing any game engine or voice asset.

## Design

The visual language remains the approved classroom and toy worlds: sky blue (#eaf8ff), ink blue (#194a75), warm yellow (#fff8d8), leaf green (#62bb51), and Letter Land purple (#7950a9). Outfit remains the shared readable typeface. The intended hierarchy is learner greeting, one Continue learning action when available, then illustrated Unit cards and Letter Land. Child actions are short and use familiar supplied images. Reduced motion and keyboard focus remain supported.

Home no longer has a large generic introduction or the incorrect Unit 2 brand. The illustrated Unit cards contain their own progress, star totals and Explore action. Native progress controls now have matching rounded tracks. Mobile navigation retains the existing sidebar destinations as a compact three-item rail. Banners keep their complete artwork and text. No speech recognition model, voices, game rules or answer evaluation are changed.

## Resume and learners

`LearningProgress.remember(hash)` stores the last entered playable activity in `learning.resume.<learner-id>.v1`. `last()` reads it. Opening a page without starting a game does not overwrite it. Home and the relevant Lesson offer Continue learning; the Unit selector highlights the current lesson. Invalid, removed or unavailable activities do not produce a resume button. History is separate for each learner and survives reload. Resume opens the recorded activity; it does not resume an unfinished round inside a game.

Learners can be selected on Home through the learner button or through **Teacher → Learners & star books**. Selection stays locked during a game, including Letter Land. Names, progress and history remain browser-local. Existing star books are preserved.

## In-game hierarchy

The shared game controls keep Home, Back, Activities, Replay, Sound, Full Screen and Next/Finish. Best stars and total Stars stay inside that game strip. Duplicate global Stars and Full screen controls are hidden when their in-game equivalents are present. Original individual game layouts and audio pacing remain unchanged.

## Verification

`tests/app-experience.spec.cjs` covers fresh and returning Home, replay after reload, learner isolation, invalid history, current lesson, integrated progress, Teacher controls, Letter Land, in-game rewards, and 1366, 1024, 768, 390 and 320px layouts. Set `APP_TEST_BASE` to a deployed index URL for live acceptance with isolated test data.

Regression checks cover all 43 game entry points, Unit 2 mapping, six-lesson selectors, Unit 3 Lesson 1 template, Class/Practice, browser Back, file URLs, the six Lesson 2 games at desktop sizes, mobile speaking controls, reduced motion, and original MP3 and engine integrity. Generated screenshots contain demonstration results rather than real pupil data.
