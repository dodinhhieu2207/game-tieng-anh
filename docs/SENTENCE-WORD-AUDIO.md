# Sentence word playback

Unit 2 Lesson 2 Build the Sentence now retains the original book characters, school pictures, dialogue voice and balanced word cycle while presenting five individual word tiles: What's / this? / It's / a / object. A shared extension replaces only this game's presentation/picking methods; original inline engines remain byte-identical.

Unit 3 Lesson 2 Build the Sentence uses Is / it / a / toy?, Yes, / it / is. and No, / it / isn't. Punctuation stays attached to a word and is not spoken separately. The nine grammar word MP3 files were generated offline with the cached Higgs V3 setup and the existing Belinda reference. Toy names reuse the existing approved Higgs recordings; school object names retain the application's existing speech voice. No AI request is made during dragging.

`SentenceWordAudio.play(word, owner, target)` reads a word on pointer pickup or keyboard/tap selection. A pointer click following pickup does not repeat it. Rapid pickup replaces the previous word, with one active word audio owner. Mute, route removal, replay and visibility cleanup stop it. Punctuation is stripped only for audio lookup, preserving the visible text. The article a has a short schwa recording, not the alphabet letter name.

Completion locks the round and awaits `SentenceWordAudio.finished()` before starting the separate natural full-sentence recording (Unit 3) or existing full-dialogue voice sequence (Unit 2). Actual ended events govern the wait. Incorrect arrangements do not play a completed model. Unit 2 provides manual Next after dialogue completion, replacing its former 1.7-second advance timer, and dispatches the shared activity completion event with 3 stars for no wrong placements or 2 with retries.

The build script is `tools/build_sentence_token_audio.py`; audio source/hash metadata is `assets/sentence-words/manifest.json`. Short-clip offline transcript checks returned Is, it, Yes, No, isn't, What's, this and It's; a transcribed as Uh, consistent with schwa. This is technical QA, not student pronunciation evaluation or a classroom voice-quality study.

`tests/sentence-word-audio.spec.cjs` checks a held Unit 3 tile only once, exact word events, punctuation, ended ordering before full sentence, mute, real Unit 2 drag and keyboard assembly, dialogue completion, reward recording, manual Next and mobile overflow. Original engine and full-sentence audio preservation remain covered by `tests/lesson2-assets.spec.cjs`.
