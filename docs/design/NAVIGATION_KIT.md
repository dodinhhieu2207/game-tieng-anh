# Shared navigation alignment —2026-10-29

User requested the header/breadcrumb and bottom navigation match visually, with appropriate new art applied to earlier lessons too. Scope: navigation presentation on Home, Units2–4, all lesson/activity menus, Letter Land and shared game navigation icons. No curriculum/voice/progress or framework change.

Read/used frontend-design and imagegen. Original six-cell transparent atlas: Home, Lessons, Stars / Teacher, blank Unit shield, Back. Provenance in assets/navigation-kit/PROVENANCE.md. Real DOM text preserves live unit number and star count. Original PNG retained, WebP production export; CSS selects one cell per icon. A small left margin of the star cell is clipped to exclude adjacent book bleed discovered in actual render review.

Surfaces: shared cream #fffdf1, teal outline #70b9bd, navy #174d70, gold active #dbaa38/#fff0b7, low teal shadow. Header/dock/breadcrumb use same rounded controls and loaded app font. Header Unit shield retains live U2/U3/U4/ABC. Breadcrumb now has accessible nav label and current-page state with matching icons. Bottom nav labels/actions/routes preserved. Existing game screen hides main header/dock and uses matching Back/Home/Teacher/Star icons.

Local gate tests/navigation-kit.cjs PASS: Home, Unit2/3/4, old lesson screens, LetterLand; five widths320/390/768/1024/1366 without horizontal overflow;48px minimum controls; Teacher panel, Stars dialog, Home/Lessons routes, in-game back and dock hiding, reduced motion; no page/resource errors. Desktop/mobile captures reviewed in tests/navigation-kit-*.png. New artwork not represented as human-approved; no measured child usability/performance claim.

Delivery: local preview navkit3. Public GitHub Pages not updated by this task.

Additional gate: all eight old/new navigation routes checked at all five widths, not only Unit4. Found old Letter Land Sound button overflow at320px; scoped toolbar wrapping/minimum48px fixed it without hiding overflow. Full suite rerun PASS. Real touch Stars/Teacher interactions PASS at390px.
