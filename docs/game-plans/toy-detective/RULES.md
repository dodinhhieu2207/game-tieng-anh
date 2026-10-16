# Toy Detective room upgrade

Read root RULES.md and docs/GAME_WORKFLOW.md. Direct user “vậy giờ tiến hành đi” on 2026-10-16 accepts the recommended layered-room approach, existing PixiJS + GSAP, UI/template references and selective filters. Do not re-ask.

- Replace only `u3ndetective` implementation; preserve activity `toy-detective`, route and `3/4/toy-detective` progress. Other six activities including Toy Catch stay untouched.
- Preserve original six rounds: 7 cars, 8 balloons, 5 robots, 8 teddies, 7 planes, 6 puppets. Two other taught toy identities per room. Unique item IDs, exactly-once collection, no random points.
- Three discoverable locations: hinged cabinet door, lifted basket lid, sliding curtains. One tap/keyboard action opens each. Pointer drag can open but is optional. Give clear handles and large targets. No tiny/fully unmarked secrets.
- All counted objects are separate sprites; found objects remain still on count tray. Opening motions reveal stored toys; motion never scatters the collection during counting. Child explicitly checks, then matches numeral and word. No target quantity shown before counting.
- Dedicated matching room, furniture body and moving cover assets, tray and result illustration. Reuse approved toy identities and bundled Outfit. No baked toy groups, numbers or labels in generated art; preserve alpha/aspect ratio and pivot alignment.
- Existing local PixiJS 8.22.0 and GSAP 3.15.0/MotionPath; new PixiUI 2.x and filters 6.x must be verified compatible/pinned with original MIT texts. Use mature library interactions/timelines, no custom renderer/tween engine. Main words/controls remain accessible DOM.
- One audio at a time; existing Higgs/Belinda, sourced SFX. Number word finishes before answer transition. No microphone/AI added. Audio/network failures never penalize; explicit retry/text path. Stop on hide/exit and respect shared mute.
- A matching item is reserved while moving and cannot be collected twice. Wrong toy stays in room with neutral feedback. Pending transitions cannot survive route/restart. Pause owned timelines and audio on background; explicit resume.
- Reduced motion opens/reveals instantly while retaining tasks. Missing renderer/library exposes a room/zone and toy-button fallback; no blank activity. Five widths, keyboard/touch, undo, scoring, old game regression, real-duration motion review and public validation before completion.
