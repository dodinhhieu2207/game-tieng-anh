# Local learning UI fonts

- Fredoka variable, unmodified: https://github.com/google/fonts/blob/main/ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf — SIL OFL 1.1, copied in Fredoka-OFL.txt.
- Luckiest Guy, unmodified: https://github.com/google/fonts/blob/main/apache/luckiestguy/LuckiestGuy-Regular.ttf — Apache 2.0, copied in LuckiestGuy-LICENSE.txt.
- Downloaded 2026-10-29. No runtime font CDN. Fredoka is UI text; Luckiest Guy is short activity titles only. Approved tracing paths and word models remain unchanged.
- App Outfit files remain available for existing canvas renderers and fallback; not deleted or renamed.


## Current interface selection — 2026-11-27

User requested a new typography direction for the game website: Baloo 2 (700–800) for interface titles and Nunito (600–900) for controls/menu/instructions. Original variable TTF binaries, METADATA.pb and OFL.txt were downloaded from google/fonts main, folders ofl/baloo2 and ofl/nunito. Both contain Vietnamese/Latin coverage according to upstream metadata. Runtime uses local original TTF files; no font CDN or modified glyph data. Prior Fredoka/LuckiestGuy/Outfit files remain for historical assets and explicit learning models.
