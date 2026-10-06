# Toy feedback system

## Sources and license

Eight short sounds from [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) and two transparent textures from [Kenney Particle Pack](https://kenney.nl/assets/particle-pack), both CC0 1.0. Original license files and the per-file source manifest are included in `assets/feedback/`. OGG sound sources were decoded to PCM16 WAV at their original sample rate; lesson voice files were not edited.

[More Mountains FEEL documentation](https://feel-docs.moremountains.com/) was consulted for coordinated, event-driven feedback. Its Unity package/code was not imported. Mixkit's sound catalog and license were also reviewed; no Mixkit files are distributed here.

## Choreography

- Tap: short squash and rebound; quiet click across navigation and ordinary game controls. Dragging tiles retain engine position/transform ownership.
- Correct: candy-coloured star and sparkle burst at the selected control, with a short confirmation sound when speech is idle.
- Retry: gentle local sway and soft question sound. No points deducted, no full-screen shake or red flash.
- Reward: larger sparkle burst, three atlas stars fly to the star counter, then the counter bounces. Existing star book, best score rules and reward actions remain authoritative.
- Lesson/badge/book events use distinct short Kenney clips.

## Integration and limits

`shared/learning-feedback.js` exposes `LearningFeedback.play(kind, target)`, `visual(kind, target)`, `clear()` and `stopSounds()`. Future games can dispatch `learning:feedback` with `{kind, target}`. Feedback never awards points. Register genuine completion through `LearningRewards.record`.

Legacy `correctFx`/`retryFx` and known Unit 3/Ff sound requests are adapted by the shared layer. Original Unit 2 inline engines, Unit 3 Lesson 1 engine, pictures and voice files are retained. Lesson 2's retry path explicitly calls feedback after its spoken model. Existing media ended promises continue to govern progression; there is no replacement duration timer.

All clips follow Sound settings. Active speech or recording prevents SFX; a voice start cancels an active effect, and reward presentation waits for speech. Particle count is capped at 40, temporary nodes are removed, and route/visibility changes clear effects. The layer stays inside the game/fullscreen owner, cannot intercept taps, and uses Web Animations API transforms. Reduced Motion replaces bursts and flight with a brief static halo.

Validation: `node tests/learning-feedback.spec.cjs`, reward/navigation/app-world/voice-layout regression checks and original-engine/audio hash checks. Screenshots produced under `tests/` are QA artifacts, not student data.

## Global presentation coverage (feedback2)

All 43 currently registered games were opened and verified to emit a real scene-arrival event. The presentation adapter observes existing game DOM state rather than adding scoring decisions.

| Scope | Added presentation |
|---|---|
| Unit 2 words, grammar, Ee/Ff, numbers and Ellie | Scene/card arrival, picture reveal, chosen/playing cues, correct/retry state cues, local completion burst |
| Unit 3 Lesson 1 (7 games) | Scene/picture arrival, selection/reveal cues, existing answer/audio adapters, win presentation |
| Unit 3 Lesson 2 (6 games) | Scene and per-round card arrival, question/model transition, target guidance during drag, snap sparkle, result arrival |
| Letter Land | Scene/picture arrival, letter slot snap, correct/wrong/complete audio adapter, finished-word presentation |

The stage marks `data-feedback-arrival` and emits `learning:presentation` only after the arrival is mounted. New game scenes automatically receive the same entrance. Known `correct`, `wrong`, `filled`, `l2-snapped` and completion markers are presentation hooks, never a source of points.

Drop target guidance uses outlines/shadows only; moving tile transforms stay with the original drag engine. Temporary effects use current pointer/drop targets rather than old button positions. Pending correct/retry chimes resume on real voice-ended events when speech owns the sound channel, and are discarded on scene/navigation changes. No duration guess controls progression.

Additional validation: `node tests/feedback-coverage.spec.cjs` covers 43/43 arrivals plus a real Match the Answer pointer drag and Next-round reveal, accepted Letter Land/Ff drops and a Unit 2 number answer.
