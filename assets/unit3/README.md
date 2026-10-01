# Unit 3 - Toy Town assets

- toys/ - five textbook toy images (webp) + silhouettes (png).
- bg/, ui/ - backgrounds, treasure chest, answer badges, trophy, confetti.
- sfx/ - game sound effects (mp3).
- audio/ - voice clips, one per sentence the games say (31 mp3). Generated locally with
  Higgs Audio v3 TTS 4B, voice-cloned from the "belinda" reference (bright, friendly American female).
  Names: <word>.mp3, touch_<word>, yes_<word>, its_a_<word>, missing_<word>, whats_in_box,
  look_remember, whats_missing, touch_picture_word, great_job, try_again.
  To change the voice, re-render the same file names. If a clip is missing the game falls back
  to the browser voice (and to the older Zira .wav files for the five words).
- Licence note: the Higgs v3 checkpoint is research / non-commercial.


- colour/ and trace/ - colouring pages (outline + region map) and dotted tracing paths, generated from the textbook toy art by script (no AI redraw).
