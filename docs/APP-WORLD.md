# Learning playground, lesson journey and focused games

This design replaces the library layout in the October 6 app shell. The original sidebar is retained in the document for compatibility but hidden in the new interface. Navigation is through Home, Lessons and My Stars in the bottom dock; the dock is hidden during games.

## Screens

- Home: learner selector, large Play stage using the existing Toy Town room and approved character art, then Classroom, Toy Town and Letter Land world doors. The initial Play button starts the first available activity. Returning learners see their recorded activity instead. No unavailable game is fabricated.
- Unit: six numbered stops, arranged 1–2–3 then 6–5–4 on desktop, with a connecting trail. On phones they appear in natural order 1–6. Current lesson and collected stars are visible; stops without activities are marked Coming soon and cannot launch a game.
- Lesson: existing lesson content and activities remain available with saved progress and Continue learning. Practice and Class Mode remain intact.
- Game: a compact Back/title/star/More toolbar replaces the library header and long control strip. More contains Activities, Restart, Sound, Full Screen, Teacher and Next/Finish. Letter Land has its own corresponding toolbar including Listen again and My Stars. A confirmed reward offers Play again and Next game without blocking the original victory screen. Audio confirmation still finishes before Toy Buddy rewards appear.

## Implementation

`shared/app-world.css` implements the screen layouts, `shared/app-world.js` implements the dock and menu dismissal, and the existing app shell owns routing and game transitions. Original game engines, toy assets, MP3s, Cloudflare speech evaluation and scoring rules are retained. Names, star books and last activity remain local to each learner in this browser. Continue opens an activity from the beginning rather than restoring a partial round.

## Acceptance

Run `tests/app-world.spec.cjs` (or the compatible `tests/app-experience.spec.cjs` entry point) for first Play, resume, learner isolation, current/planned lessons, bottom navigation, game menu, Teacher, Letter Land controls, and 1366/1024/768/390/320px layouts. `APP_TEST_BASE` can target the published site with isolated demonstration data. Navigation regression still exercises all 43 engines, Class/Practice, back/refresh, audio ownership and file URLs. The six Lesson 2 layouts, voice UI, reward persistence and MP3 integrity have separate regression suites. Screenshots in tests are demonstration records.
