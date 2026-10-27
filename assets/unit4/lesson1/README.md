# Unit 4 Lesson 1 · Family Park source art

These two WebP files are crops from the user-supplied Family and Friends Starter 2nd Class Book PDF, Unit 4 Lesson 1, page 32 (PDF page 33):

- `family-picnic.webp`: the untouched source crop retained as evidence.
- `family-portraits.webp`: the six vocabulary portraits used for the introduction strip.
- `family-picnic-clean-v1.png`: non-destructive imagegen edit that removes the six vocabulary/sticker boxes and reconstructs the covered scenery while retaining the six family roles and picnic composition.
- `family-picnic-clean-v1.webp`: compressed game background used by the four Unit 4 Lesson 1 activities.

The original PNG renders remain as source evidence. The clean scene is intentionally versioned and does not overwrite the source crop. Its final prompt and hashes are recorded in `manifest.json`.

`audio/` contains 13 static Higgs Audio V3 MP3 clips using the existing accepted Belinda reference: six family words, four instructions and three feedback lines. `audio/manifest.json` records the source reference hash, duration, transcript QA and the unresolved teacher-listening flag. The browser does not run TTS and does not fall back to browser speech for these clips.
