# Letter Land — taught range through Ll

2026-11-26: user requested opening Letter Land through Ll. This is an existing catalogue/data update, not a new game or renderer upgrade. Preserve all previous routes, progress, tracing and independent game mechanics.

Change the default taught range J -> L. Reuse approved K/L uppercase/lowercase art from assets/kl-letters and existing Higgs name/word recordings and pictures from Key Quest. K words: key, kangaroo. L words: lion, lollipop. Remove references to unavailable legacy kite/king/leg images from these two entries. Existing sound-k.mp3 and sound-l.mp3 are retained without regenerating or recertifying isolated phonemes. Jj remains unchanged. M–Z remain outside the default taught range; the existing teacher Show all control and stored preference are preserved.

The inline letter-data block references tools/build_letter_data.mjs and tools/letters_a_z.json, but neither exists in this checkout. The small K/L entries and taught-range constant are updated in the actual current inline source; no missing generator or full alphabet rebuild was invented. Home, Letter Land header and independent-game navigation derive their A–L label from LETTER_TAUGHT_UNTIL instead of stale A–I text.

Local native browser checks pass: twelve default letters, M absent, J/K/L images decode, K/L names/sounds and all four words play through actual audio-ended events, K Build a Word queue contains key/kangaroo, Ll detail fits 390px, and no page/resource errors. Evidence: evidence/local.json and four screenshots. This does not newly certify phonetic correctness or learning outcomes.

Publish only index.html's taught-data/cache changes, app/app-shell.js labels and this record. Preserve unrelated local Unit4 version changes in index.html. Public serving is checked separately after push.

Public verification passed on GitHub Pages for release 8c9d38b: twelve A-L cards, updated header range, decoded K/L images and native Higgs letter-name playback; no page/resource errors. See evidence/public.json and public-K/L.png.
