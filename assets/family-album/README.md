# My Family Album â€” Unit4 Lesson2

Six original interactive support assets plus a wide activity card created using the built-in image_gen tool for this game: cover, blank open spread, portrait frame (alpha opening), mystery flap, blank control face and12-frame family portrait atlas. Sources remain alongside WebP exports; manifest.json contains generation job IDs, prompt briefs, roles, dimensions, alpha extrema and SHA256. Portrait reference is the approved user-supplied page32 family strip; this is an original animated extension preserving the six identities/clothing, not a new vocabulary set. It does not reproduce the book's Lesson2 song illustrations.

## Atlas
1448x1086,4columnsÃ—3rows,362px square cells. Rows: mum open/closed + dad open/closed; brother open/closed + sister open/closed; grandpa open/closed + grandma open/closed. No stretching; closed-eye frame is held about116ms per5.8s cycle. Reduced motion removes frame switching. These are alternate portraits, not a mouth/limb rig.

## Audio
`audio/` is10 exact static Higgs Audio V3 clips using the previously accepted Belinda reference. `tools/build_family_album_audio.py` reuses the existing local build pipeline. All10 pass deterministic full-transcript QA (momâ†’mum allowed as in the prior catalogue). Transcript QA and browser playback do not establish pedagogical pronunciation quality; humanReviewed=false. New runtime uses audio ended/error with no browser speech fallback. Audio generation environment recovered by installing isolated Python3.11.16 under the existing learning-higgs cache and loading the existing site-packages; no source model/reference replacement.

## Music and effects
Music: **Vaporware**, The Cynic Project / cynicmusic.com / pixelsphere.org. Source https://opengameart.org/content/calm-piano-1-vaporware ; download https://opengameart.org/sites/default/files/003_Vaporware_2.mp3 . Offered under **CC0** https://creativecommons.org/publicdomain/zero/1.0/ . Retained original `music-source.mp3`. Runtime export is entire164.95seconds, normalized -26LUFS/-6dBTP with2s fades. Runtime volume .13 idle/.025 speech; mute, music toggle, hidden and leave stop it. Credits are also visible in the teacher details. This is background ambience, not the textbook song.

SFX use existing `assets/playful-foley` Kenney CC0 files and the shared `PlayfulAudio` lane. No synthesized placeholder effects. Shared App font variable is used; its current theme resolves Learning Fredoka with App Outfit fallback. All learning text is real DOM text, independent of raster assets.
