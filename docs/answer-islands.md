# Answer Islands — Unit 3 Lesson 2

Replaces Match the Answer while retaining route and progress key 3/2/match-answer. Ten shuffled rounds cover all five approved toys, each once with Yes and once with No. Asked and shown toys determine the answer; no guessed answer is injected.

Every turn automatically plays the approved Higgs question before enabling inputs. Children tap a full-answer island or drag the toy ferry to it. A wrong choice keeps the ferry waiting and plays Look again, without sinking or frightening feedback. A correct choice plays the complete Higgs answer, then water/wake and ferry travel begin only after the audio ended event. An animated star pearl flies into the ten-step treasure strip; Next island is manual. Audio failure requires replay and does not count as a wrong choice. Replaying a resolved question cannot award the round twice.

Original art pack: cyan toy ferry, two palm islands with blank signs, water wake, gold star pearl and lighthouse. Alpha-preserving crops from the generated atlas; approved vocabulary artwork is reused. sail.wav is an original locally created soft water/bubble cue. Shared click, retry, success and completion effects are reused. Boat bow faces the direction of travel and docks below the answer label. Passenger imagery is inside the draggable touch area.

Score uses the existing first-try rule: 9–10/10 earns 3 stars, 7–8 earns 2, otherwise 1. App best-score persistence and learner separation remain authoritative. Reduced motion uses a static success state. Audio, pointer capture and animations are canceled on route exit; sound mute and visibility changes stop water playback.

Validation: answer-islands.spec.cjs covers all ten rounds, balance/all toys, wrong retry, real answer ended/paused gating, playback failure recovery, mouse drag, keyboard, treasure collection, old progress key, best-score retention, five widths, mute, reduced motion and leaving during sailing. Existing Lesson 2 integration adds real touch dragging and verifies other five activities; navigation, classroom layout and shared rewards checks remain in scope. These checks validate game behavior, not child learning mastery.

## Motion upgrade

GSAP 3.15.0 core and MotionPathPlugin from the official greensock/GSAP repository are stored under shared/vendor/gsap. The package files are unchanged, with local license/provenance notes. No CDN is needed at runtime.

The shared LearningMotion scene scope owns timelines, promises, visibility pauses and cancellation. Answer Islands now uses a coordinated timeline for gentle launch trim, a curved speed-eased ferry path, finite hull roll/settle, trailing foam that fades at docking, subtle water drift, and a curved pearl collection path. Repeating CSS bob/wake/radial wave loops have been replaced. Audio-ended gating and scoring remain outside the animation layer.

References: https://github.com/greensock/GSAP ; https://gsap.com/docs/v3/GSAP/gsap.timeline()/ ; https://gsap.com/docs/v3/Plugins/MotionPathPlugin/ ; https://gsap.com/docs/v3/Eases/ . License: https://gsap.com/community/standard-license/ . These are API/choreography references; no third-party game artwork was copied.

Additional validation: answer-islands-motion.spec.cjs checks the actual GSAP timeline, background pause/resume, removal of old CSS loops, route cancellation with no remaining tweens, and a reduced-motion preference change during travel.
