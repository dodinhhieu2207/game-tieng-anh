# Robot Workshop — dedicated asset set

Built-in imagegen,2026-11-02. Project-bound source PNGs preserved here; source identifiers/hashes in ../manifest.json. Final visual review is the actual game, not the reference artwork.

## Prompt set / production constraints
1. Transparent production toy-parts atlas: nine isolated objects, front-facing coherent mint/ivory/coral/gold satin toy aesthetic, upper-left soft light. Head with navy face/cyan eyes/gold smile; star torso; two arms; two legs; mystery envelope; hat; bow. No text or whole robot. Runtime crop rectangles individually inspected rather than assuming equal grid cells.
2. Matching environment plate, referencing the generated parts: sunlit robot atelier, mint windows, coral trim, gold tool details, shallow empty left tray and empty central-right pedestal, calm space for overlaid robot, no baked-in people/robot/UI/text. Source1536x1024; WebP uses explicit ffmpeg -q:v92, since generic -quality did not produce the intended image quality.
3. Transparent interface atlas referencing parts: blank portrait frame with coral bow, blank mint/ivory/gold word tile, gold-star success medallion, mint glowing socket ring. No letters or labels; real DOM text uses existing app font. Individual runtime crop rectangles in CSS, never a whole atlas on a button.

## Integration constraints
Prerendered independent textured planes, Babylon picking/drag + GSAP. Not freely rotating3D. Keep source-book family identities, approved Higgs clips, route and progress. Six parts remain independent and physical drop errors do not deduct language score. No recolour control that merely tints the entire raster image; finale offers accessories, limited sway and dance instead.

## Shoulder cup correction —2026-11-02
User clarified the circular joint must connect into the arm, not merely make arms symmetric. Built-in imagegen edit referenced robot-parts.png and requested two isolated transparent objects: same ivory/mint/gold-star torso with two solid gold balls on short shoulder axles, no empty shoulder holes or redundant rings; separate ivory/mint/coral arm with a concave U-shaped receiving cup at its top, no gold ball on the arm, matching front view/material/light. Result shoulder-cup-v2.png1774x887. Original atlas retained for head/legs/envelope/accessories.
Current renderer uses source ball centres as seats and source receiving-cup centre as arm pivot. Uniform scales match ball and cup diameters. Torso owns the gold spheres before/after arm attachment, arm plane overlays only the receiving collar. New body/arm from one generated sheet; opposite arm is a reflection. This supersedes the earlier complete-arm-ball mirroring correction.

## Current concealed shoulder correction —2026-11-02
User requested the ORIGINAL slim arms, no bulging/deformation, with connector hidden when seated. Built-in imagegen edit of original atlas produced torso-concealed-v3.png: original ivory/mint/gold-star identity, smooth integrated closed shoulder covers, no external gold balls/circular holes/large cuffs or lower plug, transparent and no arms. Current arms are the original atlas crop [55,465,345,890] uniformly scaled .0031, reflected opposite side; no custom cup mesh or shape warp remains. Torso renders in front and seating anchor places connector behind its opaque shoulder. This supersedes the exposed ball/cup asset and calibration. Source originals retained for history only.


### Visible forearm pose — 2026-11-02
Keep original slim arm shape and scale. Pose each arm 0.30 rad outwards around its hidden shoulder pivot, mirrored opposite side. Do not bury the whole forearm or add enlarged cuffs. Forearm visibility and concealed connector pixel guards accompany actual assembly motion checks.


### Current: original open shoulder socket — 2026-11-02
The sealed-shoulder approach was rejected. Runtime now pairs original robot-parts.png torso (visible receiving socket) with original arm (ball plug); no new generation needed. Explicit source anchors register plug and socket; foreground torso rim supplies insertion occlusion. The arm visibly approaches the socket axis and slides in, rather than being buried arbitrarily beneath the torso. torso-concealed-v3.png and shoulder-cup-v2.png are retained as historical assets, not loaded.


### Current rim/interior registration —2026-11-02
Actual source robot-parts.png size1254x1254; all robot UV crops corrected from1280. Original raster unchanged. Torso has rear dark socket layer, arm ball in middle, and foreground rim with two elliptical apertures via material plugin. The occupied opening shows the real ball instead of opaque black paint. Plug and aperture centres calibrated to source pixels. Reference tests/robot-joint-macro.png and robot-socket-render-result.json.
