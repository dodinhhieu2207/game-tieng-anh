# Toy Machine - proposal and research checkpoint

2026-10-15. Status: implemented and locally validated; public gate pending. User explicitly chose A: PixiJS + GSAP, layered scene and sourced SFX. Approved placement replaces Listen & Decide, preserving route and progress.

## Proposed placement and objective

Unit 3 Lesson 2: replace Listen & Decide (listen-decide/u3decide), keep stable route/progress and existing Talk to Toy Buddy. Three reels with a lever, toy collection and a short grammar decision. Matching reels open the challenge; correct Yes, it is / No, it isn't earns the learning points. Visual-choice evidence is separate from speaking evidence. Start with existing answer controls and approved voice; optional speaking must reuse existing Cloudflare contract without claiming pronunciation scoring.

## Alternatives for user selection

A (recommended): current PixiJS 8.22.0 + current GSAP 3.15.0, sourced SFX through existing app audio/mute. Pixi reel containers/masks/filter facilities, GSAP lever/reel-stop/hatch timelines. Deep layered scene, more asset/render QA. No new audio library necessary unless a concrete limitation is found.

B: GSAP + DOM/SVG reels with same sourced sound pack and art. Less rendering work, more limited depth/filter choreography. Same lesson logic and route, no framework change.

Official references checked: https://pixijs.com/7.x/examples/advanced/slots (legacy reel/mask example, reference only; needs v8 adaptation), https://github.com/pixijs/pixijs (MIT renderer), https://github.com/greensock/gsap-skills (official guidance; not installed/claimed as used yet), https://github.com/goldfire/howler.js (audio alternative inspected, not selected). GSAP uses the existing vendor license, not assumed MIT.

Sound candidate libraries: https://kenney.nl/assets/interface-sounds and https://kenney.nl/assets/casino-audio , both CC0 as listed by publisher. These are candidates, not proof of suitable lever/reel clips. Audition actual files, supplement with a licensed mechanical source if needed, then record exact filename/URL/license and cue map. No audio files selected or downloaded at this checkpoint.

## Asset/motion direction

Toy workshop palette: warm wood, mint enamel, honey accents and quiet cream reel windows; matte crafted materials, restrained highlights. Preserve supplied toys; create dedicated machine front, reel-window surround, lever base/shaft/knob, lamp off/on, dispenser door and collection tray. Keep text/learning answers DOM-readable.

Timeline: lever resistance/pivot -> reel acceleration and masked motion -> staggered deceleration/settling with separate stop cues -> matching-line highlight -> question voice -> child response -> door opens/toy arrives -> finite reward. No decorative motion under speech/recording. Review actual-speed recording, audio mix, both success/retry, five widths and renderer fallback before public delivery.

Skills already read for this proposal: frontend-design and interaction-design. Planned for implementation: imagegen, design-critique, official GSAP references and testing/deployment skills as appropriate. Record actual application at implementation checkpoints.

## Gates

- [x] Concept, user quality constraints and current app/route inventory.
- [x] Primary-source repo/audio research and alternatives.
- [x] User selected A: PixiJS + GSAP, layered scene and sourced SFX. Do not re-ask.
- [x] Final storyboard, layered asset inventory, exact SFX decode/sample/credits. Subjective ear review remains the explicit follow-up below.
- [x] Implement and verify learning/scoring/lifecycle/audio, including final full-scene rerun after pivot/filter cleanup.
- [ ] Visual/motion/audio self-review, five widths, public deployment verification.

## Implementation checkpoint

ToyMachine module overrides only u3decide; data title updated, same 3/2/listen-decide key. Five toys each once, balanced three Yes/two No trials. Spins are bounded teaching reveals: first/third/fifth toy hold two matching reels on first spin, then the third matches on a second pull; other toys match in one spin. No probability claim, no points for reel matching. Sentence choice earns 2 first-try or 1 after wrong. Not speaking evidence, no new AI requests/provider.

Art: new cabinet, independent lever (with runtime silhouette mask), independent clipped sliding hatch; approved toy art unchanged. Lever supports drag/click/keyboard and rotates about the cabinet socket. Pixi masks and vertical BlurFilters; GSAP strips accelerate/decelerate and stop in staggered order with finite settle. Lights softly chase only during rolling. Matching outline -> question ended -> answer -> answer ended -> hatch/physical toy prize -> score. Reduced motion settles state directly without bonus credit. Filters/textures, observers, gestures, audio and timelines are cleaned on exit/restart.

SFX sources/filenames/licenses now recorded in assets/toy-machine/README.md. Five original CC0 OGG sources copied unchanged. Browser decoding/durations and actual playback requests verified. Dice-shake recording repurposed at low volume for the reel rattle; not represented as a real motor recording. Sample excerpt built/emitted, but audio input is unsupported by this model session: subjective timbre/mix approval is an explicit user review follow-up rather than a falsely claimed ear audition.

Skills read/applied: imagegen, frontend-design, interaction-design, design-critique; official gsap-timeline guide read from the repository, not installed. Existing licenses retained. Local tests passed five-toy completion, wrong/correct scoring, balanced questions, no spin score, old best stars, bounded held reels, five widths, reduced motion, audio-ended/error/retry/text-continuation, mute, keyboard, actual lever drag, rapid-click guards, mid-spin exit and static fallback. Other five Lesson 2 scenes still navigate correctly. Final regression rerun follows pivot/filter cleanup changes. Video in tests/toy-machine-video; six timestamped decoded frames reviewed for masked blur, staggered stopping and held reels. Screenshots include ready/question/prize/result and all five widths. Visual findings fixed: lever/socket offset, exterior lever haze, disabled spin control clutter under question.
