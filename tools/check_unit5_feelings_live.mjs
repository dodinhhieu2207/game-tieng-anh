// Explicit live integration check using generated Higgs model clips only.
// This measures these recordings, never student accuracy or pronunciation.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import '../shared/speech-evaluator.js';

const root = new URL('../', import.meta.url);
const endpoint = 'https://toy-buddy-speech.hiei1121.workers.dev/api/speaking-check';
const samples = ['happy', 'sad', 'hungry', 'thirsty', 'hot', 'cold'].map(word => ({
  clip: `sentences/he-${word}.mp3`, target: `he-${word}`, expected: 'CORRECT'
}));
samples.push(
  {clip: 'sentences/he-happy.mp3', target: 'she-happy', expected: 'WRONG_LOGIC'},
  {clip: 'words/happy.mp3', target: 'he-happy', expected: 'INCOMPLETE'}
);
const results = [];
for (const sample of samples) {
  const bytes = await fs.readFile(new URL(`assets/unit5/lesson1/audio/${sample.clip}`, root));
  const form = new FormData();
  form.append('questionType', 'feeling-sentence');
  form.append('questionToy', sample.target);
  form.append('displayedToy', sample.target);
  form.append('audio', new Blob([bytes], {type: 'audio/mpeg'}), 'generated-model.mp3');
  const start = Date.now();
  let row;
  try {
    const response = await fetch(endpoint, {method: 'POST', headers: {
      Origin: 'https://dodinhhieu2207.github.io'
    }, body: form, signal: AbortSignal.timeout(30000)});
    const body = await response.json();
    row = {...sample, sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      status: response.status, elapsedMs: Date.now() - start, response: body,
      passed: response.ok && body.result === sample.expected};
  } catch (error) {
    row = {...sample, elapsedMs: Date.now() - start, passed: false, error: error.name};
  }
  results.push(row);
  console.log(sample.clip, sample.target, row.status ?? row.error, row.response?.result ?? row.response?.error);
  // An unsupported task means deployment is absent; do not spend more inference calls.
  if (row.response?.error === 'INVALID_QUESTION_TYPE') break;
}
const passed = results.length === samples.length && results.every(row => row.passed);
await fs.writeFile(new URL('docs/game-plans/unit5-feelings/evidence/live-worker-model-clips.json', root),
  JSON.stringify({checkedAt: new Date().toISOString(), endpoint, source: 'Generated approved Higgs model recordings; no student audio',
    scope: 'Sample-level live recognition and strict feedback; student accuracy and pronunciation NOT_MEASURED',
    passed, results}, null, 2) + '\n');
if (!passed) process.exitCode = 1;
