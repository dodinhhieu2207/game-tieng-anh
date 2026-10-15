# Toy Machine art and SFX

## Dedicated UI surfaces - 2026-10-15

Four additional illustrated WebP assets: mission-frame, answer-yes, answer-no, collection-pocket. Created using built-in imagegen (not CLI), then cropped/resized only using tools/build_toy_machine_ui.py. Final source: exec-4df24e53-cf1d-436e-a38b-cc6dc5247f4e.png in the same generated_images task folder. Original atlas retained there. Alpha is transparent outside the four silhouettes. Mission uses nine-slice borders to preserve corners; full sentences/check/cross remain accessible DOM, rather than image lettering. Asset files are used by shared/toy-machine.css, including the DOM renderer fallback.

Prompt brief: a 2 by 2 preschool toy-workshop UI atlas, mint enamel/honey wood/ivory, separate mission plaque, green answer face, coral answer face, collection pocket, soft matte relief, no text, front view. Final edit prompt: remove all exterior background, preserve the four objects, their positions, colors and silhouettes; genuine transparent alpha. No approved vocabulary artwork or speech was regenerated.

Created for Unit 3 Lesson 2 on 2026-10-15. New illustrated machine parts generated with built-in imagegen; approved toy pictures and Higgs voice clips remain unchanged.

Art direction: mint enamel, honey wood, cream windows, separate pivoting lever and sliding hatch. cabinet.webp source exec-d40008f4-32c1-4a1f-9d17-15c9ab23ec17.png; hatch.webp source exec-36be0d25-2bd1-4532-abc9-671dbb7b4f60.png, in the task's Codex generated_images folder. Conversion script only crops transparent margins, resizes and compresses; no bitmap recoloring/background removal. lever.webp source exec-01a13a4b-4059-480a-97ef-247b761ef9f3.png (blue wooden handle). Red/brass variants with exterior haze were not used. The selected image is rendered through a physical silhouette clip (same circles/shaft in Pixi and static SVG) so no exterior colored haze rotates with it. Original source pixels are preserved; the clip is a runtime rendering mask.

Runtime animation: local PixiJS 8.22.0 (MIT) and GSAP 3.15.0 (existing vendor license). Reel container/mask/blur arrangement informed by https://pixijs.com/7.x/examples/advanced/slots , implemented with v8 APIs and GSAP timelines rather than copying its custom tween engine. Official timeline guide read from https://github.com/greensock/gsap-skills/blob/main/skills/gsap-timeline/SKILL.md ; this was a reference read, not an installation.

All five SFX are unmodified Kenney source OGG files, CC0, licenses included in audio/:

| Runtime cue | Original file | Publisher pack | Playback |
| --- | --- | --- | --- |
| lever.ogg | switch_003.ogg | Interface Sounds | once at pull, volume .40 |
| reel.ogg | dice-shake-1.ogg | Casino Audio | low-volume rattling loop during spin, .13 |
| stop.ogg | chip-lay-1.ogg | Casino Audio | one per reel stop, .32 |
| hatch.ogg | open_001.ogg | Interface Sounds | at hatch opening, .35 |
| reward.ogg | confirmation_004.ogg | Interface Sounds | after correct answer/toy release, .27 |

Sources: https://kenney.nl/assets/interface-sounds and https://kenney.nl/assets/casino-audio . Archive URLs: https://kenney.nl/media/pages/assets/interface-sounds/fa43c1dd4d-1677589452/kenney_interface-sounds.zip and https://kenney.nl/media/pages/assets/casino-audio/2472606a04-1721639069/kenney_casino-audio.zip . Reproducible copy/decode/sample helper: tools/prepare_toy_machine_sfx.cjs. Source duration/decode verified in browser; a source excerpt sample was emitted for listening, but this model session cannot assess subjective audio timbre. Final ear-based preference remains a user review item; no synthesized beeps substituted.

Speech uses approved Unit3Lesson2Clips questions/is_it_a_* and answers/yes_it_is/no_it_isnt. SFX are stopped before speech, on mute/background and exit. The reel rattle is a repurposed source recording, not claimed to be a recording of a real motor.
