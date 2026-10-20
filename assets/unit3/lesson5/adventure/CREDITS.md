# Hh / Ii adventure art, sound and effects

Original raster art: built-in imagegen, dedicated pond/mine/fish/basket/gem plus separate fish body and tail. Source filenames, alpha crops and SHA256 recorded in manifest.json. No textbook vocabulary art replaced: use the approved H/I pack, including the ladybug labelled insect.

New sound selection, all CC0:
- Kenney Interface Sounds: scroll_001 (cast), question_001 (retry). https://kenney.nl/assets/interface-sounds
- Kenney Music Jingles: jingles_PIZZI02 (completion), a new pizzicato jingle. https://kenney.nl/assets/music-jingles
- Kenney Impact Sounds: impactWood_light_001 (snap), impactMining_001 (contact). https://kenney.nl/assets/impact-sounds
- rubberduck, Water/splash/slime SFX: splash_04 (actual water contact). https://opengameart.org/content/40-cc0-water-splash-slime-sfx — CC0 recorded on the author's source page. Download: https://opengameart.org/sites/default/files/water-splash-slime-sfx.zip
- Kenney Particle Pack: transparent spark_01 and dirt_01 textures. https://kenney.nl/assets/particle-pack

Kenney license copies accompany the selected files. The initial interface drop sound was replaced with the water recording. No old oscillator/feedback SFX bank is used. Runtime lowers SFX while voice is playing and respects sound/mute controls. Audio files are new selections; engagement and subjective preference need classroom listening, not source names or metadata alone.

Runtime references: existing local Phaser 3.90.0 (MIT) and GSAP 3.15.0 with provenance/license in shared/vendor. Phaser examples https://phaser.io/examples/v3/ for scene/particle/input patterns; GSAP timeline/tween documentation https://gsap.com/docs/v3/GSAP/ used for interruption and ownership. No third-party example art copied. Hook/rod/ripple geometry is native renderer artwork. Generated hook.svg is retained as source sketch; runtime uses vector Graphics to avoid an SVG texture rendering defect found in QA.

Hash audit found the initially selected confirmation_002 was already used in Number Studio, so it was rejected and replaced by jingles_PIZZI02.
