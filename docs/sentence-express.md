# Sentence Express — Unit 3 Lesson 2

Replaces Build the Sentence at the same activity route and progress key `3/2/build-sentence`. Other Lesson 2 activities remain in place.

Children place word tickets in numbered wagons, by drag or tap/keyboard selection. Selecting a ticket plays only that token. Contractions remain single tickets; punctuation travels with the word. Each turn automatically plays its recorded prompt, without counting assistance. Placing the final ticket automatically checks the complete sentence; no Ready action is needed. Wrong orders remain editable, with amber outlines and a spoken-free retry message.

The seven turns cover Is it a robot?, Is it a plane?, What's this?, It's a puppet., It's a balloon., Yes, it is., and No, it isn't. The answer turns show the relevant toy; Yes/No turns also offer the recorded question. Hear a model reveals and speaks the correct sentence, counted as assistance once per turn.

Correct sentences wait for the final token audio to end, then play the existing approved Higgs full-sentence clip. After its ended event, a shared correct cue, real recorded steam-engine/whistle mix, independently turning wheels, steam, suspension motion and a 4.2-second accelerating departure play. Next train is manual. Failed sentence playback requires retry, without penalty or departure. Muted playback and reduced motion remain usable.

New assets are in assets/sentence-express; manifest.json records original generated imagery, lossless object crop rectangles and original whistle. Vocabulary imagery, existing token recordings, full Higgs recordings, shared UI controls and reward system are reused.

Stars: 3 without wrong orders/model assistance; 2 with up to 3 combined attempts/assists; 1 otherwise. A repeated identical wrong order counts once per turn. Playback errors and hearing the Yes/No question do not count. The shared progress system keeps the best result and learner separation.

Validation: tests/sentence-express.spec.cjs exercises all seven turns, pointer drag, displacement/undo, keyboard, wrong order, held-word deduplication, actual audio ended sequencing, paused sentence, audio error/retry, assistance scoring, stable award, five widths, mute, reduced motion and cleanup. Existing navigation, sentence-word-audio, Unit 3 Lesson 2 integration/layout and learning-rewards checks also pass. Browser audio playback is verified; this activity does not assess speech recognition or prove learning mastery.
