# Integrated asset inventory

2026-10-27 marker correction: search markers now use dedicated imagegen assets marker-search.webp and marker-found.webp, replacing the original CSS circle/text artwork. Exact prompt/source and deterministic two-cell crop recorded in markers-source.json and tools/export_family_hide_markers.py. Both foreground exports preserve alpha (0–255). Search = blue question mark on cream; found = cream check on emerald; both share cyan/gold/leaf frame. DOM labels remain accessible. Desktop hit area64px; mobile56px. Press/hover and found transition added; reduced motion disables transition animation. The original inventory statement about standard search shapes below is superseded by this correction.

All 13 raster assets generated for this activity with imagegen, 2026-10-27. Exact prompts, reference files and original output locations: assets/family-hide-seek/sources.json. Original generated files retained. Export tool performs only resizing/format conversion; 2x2 sprite sheets are 1024 square, four 512-square frames. Alpha range 0–255 verified for all foreground assets; park is opaque.

| Files under assets/family-hide-seek | Runtime role | Review |
| --- | --- | --- |
| family-mum.webp, family-dad.webp | Hidden adults, reveal/wave, walking followers | Full body per quadrant, textbook clothing preserved |
| family-brother.webp, family-sister.webp | Hidden children, reveal/wave, walking followers | Same identities and learning labels |
| family-grandpa.webp, family-grandma.webp | Hidden grandparents, reveal/wave, walking followers | Natural full-body proportions |
| puppy.webp | Arcade Physics player, idle/walk/wave frames | Direct tap/keys/D-pad movement |
| park.webp | Cover-scaled park, picnic gathering place | Mobile uses central crop, no stretched scene |
| bush.webp, tree.webp, tent.webp | Six hiding locations, GSAP reveal sway | Individual transparent objects, no hidden-person answer exposed |
| controls.webp | Target HUD and Listen/Pause/Restart control surfaces | Empty raster center; real App Outfit labels remain readable |
| badge.webp | Completion medallion | Encouragement for participation |

Approved vocabulary portraits reused from assets/unit4/lesson1/matching/ for clue and found album; source vocabulary pronunciation reused from existing Higgs catalogue. Newly generated family sprites supply movement, while the clue retains previously taught source art.

Voice: ten new Higgs V3/Belinda clips with hashes, scripts, duration, ASR transcript QA in audio/manifest.json. Existing six word clips remain unchanged. Browser tests observed real playback and exercised failed playback, mute, pause and disposal. Human listening approval is not inferred from transcript matching.

Font: App Outfit local 700/800 through var(--app-font); document.fonts.ready before scene creation. No canvas instructional text. Search markers and controls keep 48px hit areas. Dynamic label text is English.

VFX: separate sprite poses, GSAP character emergence, prop sway, following formation and picnic gathering. Reduced motion removes prop sway. Separate particles: N/A, discovery focus uses character reveal rather than an overlay particle burst. Separate SFX/music: N/A for this first version; Higgs voice provides auditory feedback without masking vocabulary. Direction/search controls use standard accessible shapes and real symbols; the main control surface is custom generated art.

Evidence: tests/family-hide-seek-{320,390,768,1024,1366}.png; tests/family-hide-seek-reveal.png; tests/family-hide-seek-party.png; recorded browser video in tests/family-hide-seek-video/ and contact sheet tests/family-hide-seek-motion.jpg. Video files remain local evidence rather than website payload.
