# Story motion layers

Imagegen edits of approved Lesson 6 scenes, based on user-provided textbook panels. Four reconstructed plates and four transparent actor cutouts. Cropping/resizing/WebP export only in tools/export_story_motion.py. Generated sources and prompts in generation.json; asset hashes and registered bounds in manifest.json.

MP4 supplied by user is a motion reference only and remains unchanged in Downloads. reference.json records filename/hash/timestamps inspected with watch-video. Original video frames are not shipped in the game. Supplied MP3 cuts/voices remain unchanged in ../story/.

Motion is 2D cutout translation/rotation, driven by current audio time through existing local GSAP and Phaser. Boy and held object are a connected actor in scenes 1,2,4; Billy is separate from his gift in scene 3. This is not full skeletal/lip animation or a reproduction of every original MP4 action; no claim of independently articulated robot arms or lid-opening reconstruction. Reduced motion displays approved static scenes.

Underlying source textbook/video rights remain with their respective owners; not CC0. Runtime/vendor and existing SFX provenance remain as previously documented.
