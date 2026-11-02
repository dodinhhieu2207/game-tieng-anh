# Family Robot Workshop · original asset set

Unit4 Lesson2 practice, approved Babylon.js stack. The runtime imports `models/workshop.glb`; it does not render a generated screenshot as the scene. All6 robot parts, props, letter and accessory groups have named independent transforms. The other10 GLBs are centered reusable exports of the corresponding groups.

## Art direction and provenance
- Original mesh authoring: `tools/robot-asset-author.js`. Rounded solid surfaces use authored ring/bevel vertex data; spheres/cylinders/tubes use Babylon mesh builders. Export: official Babylon GLTF2Export, driven by `tools/export_robot_assets.cjs` and `tools/robot-author.html`. This is authored procedural geometry, not an externally generated/sculpted AI mesh. No claim of skeletal deformation or a rigid-body physics solver.
- `concept-source.png` / `concept.webp`: original built-in image_gen art reference for mint/ivory/coral toy shapes, dark screen eyes, warm workshop. This illustration is NOT an in-game screenshot.
- `activity-source.png` / `activity.webp`: original generated navigation cover, same palette and robot theme.
- `control-source.png` / `control.webp`: original generated transparent raised cream/mint/amber button face, used for word tiles and toolbar. Real DOM text stays separate and uses the shared app font variable.
- `manifest.json` records job IDs, prompt briefs, dimensions, hashes, GLB inventory and reused sources. Individual models use origin0; workshop stores assembly positions.
- Original procedural studio cube lighting is made in the runtime, with ACES tone mapping, warm key/fill, shader shadows and satin PBR materials. No external environment downloads.

## Models
`workshop`, `workstation`, `part-torso`, `part-left-leg`, `part-right-leg`, `part-left-arm`, `part-right-arm`, `part-head`, `envelope`, `accessory-hat`, `accessory-bow`. GLB is glTF2.0. Runtime pointers use transparent proxy hit volumes and Babylon PointerDragBehavior; final robot drag rotates the assembled hierarchy. These input proxies are not visible artwork.

## Voice and effects
New10 static clips in `audio/` are Higgs Audio V3 with the previously accepted Belinda reference. Transcript QA matched10/10; humanReviewed=false. The game also reuses exact family album questions/sentences and Unit4 Lesson1 noun clips. Script/provenance/hashes in audio/manifest.json and `tools/build_robot_workshop_audio.py`. No browser/OS voice fallback. Only actual audio ended or explicit mute bypass releases speech gates.

Existing music: Vaporware by The Cynic Project / cynicmusic.com / pixelsphere.org, CC0, source/license preserved in `assets/family-album/manifest.json`; credited in teacher details. Shared sampled tactile SFX: Kenney CC0 via `assets/playful-foley`. Music ducks for voice and stops on mute/hidden/leave.

## Review / limitations
Play: `#/unit/4/lesson/2?mode=practice&activity=robot-workshop`. Asset review: `catalog.html` (actual GLB viewer and downloads). Geometry has been visually iterated separately from the concept: clamped thin-object bevel radii, duplicated cap vertices, satin PBR export, camera/framing and bounded48px projected controls. The game is a stylized original3D implementation; it is not pixel-identical to its concept or another mobile app. Technical browser checks do not measure child learning, pronunciation or physical-device FPS.

## Current layered art correction2026-11-02
User rejected the primitive GLB rendering. The live game now uses art/workshop.webp, art/robot-parts.png and art/interface.png, generated with built-in imagegen as a cohesive set. Babylon texture planes retain real pointer picking/dragging. This is prerendered artwork, not a freely orbiting3D model. Original GLBs retained for provenance, not loaded in gameplay. Atlas crops and transitions are scoped to shared/robot-workshop.js/css. Existing source-book family identities and Higgs audio unchanged.
