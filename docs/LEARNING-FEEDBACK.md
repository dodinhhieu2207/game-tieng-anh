# Toy feedback system

## Sources and license

Eight short sounds from [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) and two transparent textures from [Kenney Particle Pack](https://kenney.nl/assets/particle-pack), both CC0 1.0. Original license files and the per-file source manifest are included in `assets/feedback/`. OGG sound sources were decoded to PCM16 WAV at their original sample rate; lesson voice files were not edited.

[More Mountains FEEL documentation](https://feel-docs.moremountains.com/) was consulted for coordinated, event-driven feedback. Its Unity package/code was not imported. Mixkit's sound catalog and license were also reviewed; no Mixkit files are distributed here.

## Choreography

- Tap: short squash and rebound; quiet click in navigation. Game clicks retain their own audio timing.
- Correct: candy-coloured star and sparkle burst at the selected control, with a short confirmation sound when speech is idle.
- Retry: gentle local sway and soft question sound. No points deducted, no full-screen shake or red flash.
- Reward: larger sparkle burst, three atlas stars fly to the star counter, then the counter bounces. Existing star book, best score rules and reward actions remain authoritative.
- Lesson/badge/book events use distinct short Kenney clips.

## Integration and limits

`shared/learning-feedback.js` exposes `LearningFeedback.play(kind, target)`, `visual(kind, target)`, `clear()` and `stopSounds()`. Future games can dispatch `learning:feedback` with `{kind, target}`. Feedback never awards points. Register genuine completion through `LearningRewards.record`.

Legacy `correctFx`/`retryFx` and known Unit 3/Ff sound requests are adapted by the shared layer. Original Unit 2 inline engines, Unit 3 Lesson 1 engine, pictures and voice files are retained. Lesson 2's retry path explicitly calls feedback after its spoken model. Existing media ended promises continue to govern progression; there is no replacement duration timer.

All clips follow Sound settings. Active speech or recording prevents SFX; a voice start cancels an active effect, and reward presentation waits for speech. Particle count is capped at 40, temporary nodes are removed, and route/visibility changes clear effects. The layer stays inside the game/fullscreen owner, cannot intercept taps, and uses Web Animations API transforms. Reduced Motion replaces bursts and flight with a brief static halo.

Validation: `node tests/learning-feedback.spec.cjs`, reward/navigation/app-world/voice-layout regression checks and original-engine/audio hash checks. Screenshots produced under `tests/` are QA artifacts, not student data.
