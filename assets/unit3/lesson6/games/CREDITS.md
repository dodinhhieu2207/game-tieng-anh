# Lesson 6 companion game assets

Dedicated imagegen mic, role badge, transparent picture-card frame and check badge. Exact prompts and generated source paths in generation.json; WebP sizes/hashes in manifest.json. These are integrated runtime assets, not a UI mockup. The sequence frame central alpha was checked transparent.

Audio: native cuts from the user-supplied story MP3. Times/source hash in audio-manifest.json. Separate short Yes-only and robot-name clips avoid prompting two sentences for a one-sentence turn. Other answer clips and story recordings remain in ../story/. Existing approved story images/cutout motion are reused.

Your Turn uses the existing Unit3Speech/Cloudflare endpoint and deterministic sentence evaluator; no new backend/provider. Audio captured only after Speak; maximum 8 seconds, Done/cancel; no recording retention by this game. Full-sentence recognition is not a pronunciation score.

All underlying textbook/audio rights remain with their respective owner; no CC0 claim for supplied source media. Existing local Phaser/GSAP provenance applies.

Your Turn listening-control follow-up: dedicated storybook/speaker and speech-bubble/speaker button artwork, generated with imagegen. Exact prompts/sources in listen-generation.json; WebP hashes in manifest.json. Runtime live labels and existing audio actions retained.
