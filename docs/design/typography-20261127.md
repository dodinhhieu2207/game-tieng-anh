# Game-web typography — 2026-11-27

User requested a new suitable game-interface type direction. Current shared roles:

| Role | Local family | Weight |
| --- | --- | --- |
| Game, unit and lesson titles | Game Baloo 2 | 800 |
| Menu, controls and navigation | Game Nunito | 700–800 |
| Task, feedback and instructions | Game Nunito | 700 |
| Explicit plain learning models | Existing App Outfit / approved glyph paths | Existing approved weights |

`shared/game-fonts.css` registers the original variable TTF files early; `shared/game-typography.css` applies the final interface roles after the existing presentation layers. Root font tokens stay shared; known legacy local Outfit overrides in adventure/pipe UI are corrected by role. Existing tracing paths, canvas learning fonts, word/letter artwork, audio, scoring and routes remain.

Original binaries, upstream METADATA.pb, OFL licenses and hashes are bundled in `assets/fonts/`; see `current-interface.json` and `PROVENANCE.md`. No runtime font CDN or system font installation. Nunito is from google/fonts/ofl/nunito and Baloo 2 from google/fonts/ofl/baloo2. The files are unmodified.

The type change retains existing responsive text sizes, with measured Unit5 tasks >=19px, controls >=19px, feedback >=18px and sentence models >=26px on the narrow layout. Native checks cover the home menu and selected Unit2/3/4 games at 320/390/768/1024/1366, plus all five Unit5 games at those widths. Earlier-unit/home evidence is `evidence/typography-20261127/`; detailed Unit5 evidence lives under its game plan. Public verification is recorded after publication; these are interface/runtime checks, not evidence of child reading or learning outcomes.


Public validation: deployed ee5749e serves the new shared fonts and Unit5 feedback. Both font binaries and shared font/role styles match committed SHA-256 bytes. Unit5 public menus at five widths and 25 game layouts pass with Nunito interface / Outfit learning-model assertions, native focus and reduced motion. Evidence: ../game-plans/unit5-feelings/evidence/type-feedback-v1-public/report.json and hashes.json. Local older-unit checks remain in evidence/typography-20261127/.
