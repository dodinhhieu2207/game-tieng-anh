# Learner star books and rewards

The shared star book covers the configured games in Unit 2 and Unit 3, six lessons per unit. Open **Stars** in the header. On Home, add a learner nickname or select a learner before starting a game. Switching learners is disabled inside a game to avoid crediting the wrong learner.

## Scoring and storage

- Each activity retains its best result of 1–3 stars. Replaying with an equal or lower result does not add stars or points. Improving a result awards only the difference.
- Reward points equal 100 times the learner's collected best stars. Badges unlock at 1, 5, 15, 30 and 60 stars.
- A confirmed completion without an existing star rubric receives one completion star. This is a participation reward, not an invented accuracy score. Games without a completion signal remain marked as played until they implement the completion contract.
- Planned lessons stay visible but earn nothing until playable games are registered.
- Existing records in `learning.navigation.v1` belong to the default **My Stars** book and are preserved. Previously completed records without stars are not retroactively rated.
- Nicknames and results are stored in browser localStorage on this device. Other learners have separate books. There is no account or cross-device synchronization; clearing browser storage removes these local books. Nicknames are not sent to the speaking service.

## Reusable game contract

Register each future activity with a stable ID and a game in `LearningConfig`. It then appears in the appropriate lesson automatically. On genuine completion, either use the shell's existing `learning:activity-completed` event or call:

```js
LearningRewards.record({
  unit: 3,
  lesson: 2,
  activity: 'talk-to-toy-buddy',
  stars: 3
});
```

The public adapter accepts integer stars 1, 2 or 3 and lessons 1–6 (or the legacy `existing` group). Do not call it simply when opening a game. The existing shell also detects supported legacy victory screens. Original inline game engines, voice MP3s and approved art remain intact.

## Asset pack

`assets/rewards/manifest.json` describes the transparent 1536×1024 atlas, a 3-column, 2-row grid. In row order: happy gold star, silver star, trophy, purple medal, reward chest, sparkle. `shared/learning-rewards.css` supplies reusable sprite classes, star bounce, sparkle flight, locked badge treatment and responsive layouts. Reduced-motion settings disable the celebratory motion.

Four original gentle chimes accompany earned stars, lesson completion, badge unlocks and opening the book. They are generated offline by `tools/build_reward_sfx.py`. They respect the app's sound controls. Toy Buddy rewards wait for the current spoken confirmation to finish; reward audio is skipped when detected audio is active. Existing voice audio is not replaced.

## Verification

`tests/learning-rewards.spec.cjs` checks persistence, replay deduplication, score validation, learner isolation, legacy book preservation, 12 lessons, future activity registration, a real Unit 2 victory bridge, learner locking, desktop and 320/390px layouts, reduced motion, and asset/JavaScript errors. Set `REWARDS_TEST_BASE` to verify a deployed site with isolated test data.

The existing navigation, Toy Buddy voice UI, six-game layout and original audio/asset regression checks also pass. Screenshots made by tests contain demonstration results, not real student records.
