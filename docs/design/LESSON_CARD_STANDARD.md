# Lesson card standard —2026-10-29

User explicitly selected the Unit3 six-Lesson menu as the visual reference for Unit4 and future design. No dashed outlines around Unit/Lesson/Activity menu cards or page containers, including unavailable/Coming soon entries.

Implementation: shared app-lesson-stop cards use solid3px blue outline, same light surface, radius and soft shadow. Grid rows stretch to equal card heights; image/content start from the same top alignment. Coming soon retains its label, disabled navigation and existing art; no fake progress for unimplemented lessons. Disabled cards do not lift on hover. Empty-lesson notice also uses solid outline. Approved drop targets/tracing inside games unaffected.

Scope: shared Unit2–4 menus; no asset regeneration needed because the existing approved card images are retained and only their surrounding containers were inconsistent. RULES.md section3 records the user's future design constraint. Five-width layout/navigation verification required before local handoff.

Local gate PASS: Unit2/3/4 each render six solid cards with visible shadow; card images align across desktop rows; no overflow at320/390/768/1024/1366; Coming soon remains disabled, existing Lesson1 opens correctly; no page errors. Unit4 desktop/mobile captures reviewed. Preview solidcards1, not published to Pages.
