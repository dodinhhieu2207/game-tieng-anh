# Family Dialogue Studio rules

- Keep the large original room scene and six approved family portraits separate. The arrow points to the selected person before the Higgs “Who’s this?” prompt plays.
- Sentence construction is “This is my <person>.”, with one active slot. Tap and drag are both available; wrong tiles return locally without clearing the sentence.
- Follow the constructed sentence with “Is this your <person>?” where both true and false prompts occur. A spoken full answer is checked by the deployed Cloudflare Worker. Unclear and incomplete speech is retryable without lost progress.
- The teacher fallback must be labeled as teacher practice, never as AI verified speech. Progress and stars describe activity completion only.
- Preserve existing Unit 4 Lesson 2 activities, approved portraits, Higgs voice, routes, and progress.
