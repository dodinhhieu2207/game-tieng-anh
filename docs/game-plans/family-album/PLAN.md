# My Family Album â€” plan

Status: implemented and locally verified. Not committed, pushed or deployed. 2026-11-01.

## Scope and decision
User requested creation of the proposed discovery album for Unit4 Lesson2 and selected DOM + GSAP. Route family-album, activity key u4familyalbum. Six pages: mum, dad, brother, sister, grandpa, grandma; question Who's this?; target This is my â€¦ . This is an original practice supplement, not a reproduction of the textbook song.

## Stack and skills
Existing local GSAP3.15 for perspective page turns, reveals and highlights; DOM for accessible reading/controls. Reference https://gsap.com/docs/v3/GSAP/gsap.timeline()/ . Preserve bundled GSAP license (not described as MIT). Alternative PixiJS MIT was offered and not selected. imagegen, frontend-design, interaction-design and design-critique read/applied. No new app framework or page-turn library. Shared app font variable currently resolves Learning Fredoka with App Outfit fallback in the playful theme; reused that accepted theme rather than changing global fonts. This is a perspective sheet rotation, not a deformable3D paper simulation.

## Direction / storyboard
Warm cream #fff6df pages, teal #177f86 binding, coral #ea8067 details, ink #184e69, gold #f5ce70. Shared App Outfit. The album is the focus; secondary controls sit below, not boxed within boxed panels. Left page: discovery prompt and family keepsakes; right page: portrait frame behind a paper flap. Book cover â†’ page turn â†’ question audio â†’ closed flap â†’ reveal â†’ frame highlight + sentence voice â†’ class repeats â†’ teacher/child chooses Next page. Final contact sheet reopens any explored page. No automatic claim of speech recognition.

## Asset/layer inventory
- New generated open album texture, separate cover, paper pocket/flap and frame/navigation ornaments; all stored under assets/family-album with source/prompt hashes.
- Original12-frame portrait atlas generated from the approved six-person source strip. Open/closed eyes for each person; same identities/clothing. Used square362px cells for portrait and persistent keepsakes. Real alternate-eye blink; no claim of live mouth/hand rig or actual gaze tracking. Teacher/child acknowledges a class repetition turn; no microphone or ASR.
- Higgs local V3 Belinda: question, introduction, six exact target sentences, Your turn, finale. Manifest transcript and durations; no browser TTS.
- SFX existing Kenney CC0 page/reveal/place cues. Music Vaporware by The Cynic Project, CC0; entire164.95s normalized with fades, quiet runtime and speech duck. Source and license in asset manifest and teacher details.

## Verification checkpoints
- [x] Assets generated, alpha inspected and integrated.
- [x] Higgs generated, transcript QA, actual playback. All10 transcript matches; humanReviewed=false.
- [x] Scene, page/reveal/speaking/review states and completion event exactly once in six-page browser test.
- [x] Music/voice priority, mute mid-sentence, errors/retry, duplicate actions, cleanup, reduced motion. family-album-touch.cjs PASS for actual touchscreen taps and a simulated hidden lifecycle: pending speech canceled, music paused, replay recovers, one page confirmed, old owner disposed on library return.
- [x] Five widths, keyboard Enter, actual pointer controls, screenshots and unaccelerated full-session video. Reviewed1fps contact sheet and page-turn detail frames. No physical-device FPS claim.
- [x] Local report and limits prepared; no deployment requested in this turn.

## Review findings corrected
- Disabled flap opacity rule left a rotated flap visible above the book after revealing. Hide flap at owned animation end and reset GSAP transforms on each page.
- Atlas cells are square362px; removed initial4:3 stretch.
- Added generated fabric control face, varied top/side/slide reveal motions, full visible title weight; avoided replacing any prior route/art.
- Global shell mute pauses media without ended, so added toybuddy:enter listener to settle pending audio on mute; shared Listen control receives a scoped owned handler.
- Browser evidence tests/family-album.cjs (actual unaccelerated Higgs full6pages,review,eventonce) and family-album-edges.cjs (five widths,reduced,48px,current font,audio duck,toggle,error,retry,cleanup). Final rerun PASS after edge fixes, including global shell mute during speech and keyboard-triggered Listen. No child learning, pronunciation or physical device FPS measured.
- Dedicated wide activity cover integrated; mobile library route opens it. tests/family-album-library.png; all8 Lesson1 registrations preserved. Runtime route http://127.0.0.1:8770/index.html?dev=album1#/unit/4/lesson/2?mode=practice&activity=family-album . Open-in-Codex requested, UI tool returned queued, not proof the user saw it.
- Music source duration is164.95s, not180s. Export corrected to fade at162.9s rather than beyond the end; provenance updated. Full source kept. No newly created speech/music provider substituted.

## Direct manipulation correction - 2026-11-01
User correctly identified that the initial release was click-driven, not a manipulable book. Scoped upgrade to the same approved DOM/GSAP stack, assets, voice and route. Engineering debug skill read/applied with interaction-design principles already in use.

- Cover: drag left; motion follows distance before release. Flaps: top/up, side/left or right, slide/right, bottom/down by page. Pages: forward corner or right-page surface drags left; back corner/left-page surface drags right.
- Pointer motion scrubs GSAP transforms; completion requires42percent of normalized gesture. Short drag snaps back in280ms; cancel/resize/hidden/leave resets safely. Progress changes only on committed forward turn after speech ended.
- Moving page contains an inert clone of the current page art and text; no duplicate action metadata/listeners or voice. Keyboard/click alternatives retained. Native image/text dragging disabled only in book.
- Touch implicit pointer capture initially sent lostpointercapture from the original child when transferring to album owner; changed handler to cancel only on loss from the owner itself. This is distinct from a real pointercancel, which restores paper.
- Owned root listeners/capture and resize handler removed on disposal. Cache family-album CSS/JS bumped to20261101-drag2.
- Final drag regression PASS after touch correction: real mouse full-six-page drag, short cover/flap/page rollback without progress, exactly one completion event; real Chromium touch input at390px opens cover, reveals photo and turns page with reduced motion. Existing five-width/audio/mute/error/keyboard/reduced/cleanup suite PASS; separate touch/hidden-cancel/replay recovery suite PASS. Actual unaccelerated drag video tests/family-album-drag-video/page@2aea4ae1f0cd4d1f9b291ebb64c35559.webm and held-pointer screenshots reviewed. No physical-device FPS measurement.
