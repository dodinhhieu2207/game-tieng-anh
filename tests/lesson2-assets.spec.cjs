const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const baseline=JSON.parse(fs.readFileSync('docs/navigation-preservation.json'));
for(const p of ['unit3.js','unit3.css','toy-buddy-scene.js'])assert.equal(hash(fs.readFileSync(p)),baseline[p],p+' changed');
const html=fs.readFileSync('index.html','utf8'),inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim());
assert.equal(inline.length,baseline.inlineScripts.length);
inline.forEach((s,i)=>assert([hash(s),hash(s.replace(/\r\n/g,'\n'))].includes(baseline.inlineScripts[i]),'Original inline Unit 2 / Letter Land engine changed'));
const manifest=JSON.parse(fs.readFileSync('assets/unit3/lesson2/audio/manifest.json')),qa=JSON.parse(fs.readFileSync('assets/unit3/lesson2/audio/qa.json'));
assert.equal(Object.keys(manifest.clips).length,25);assert.equal(qa.length,25);
for(const [key,c] of Object.entries(manifest.clips)){assert.equal(hash(fs.readFileSync(c.src)),c.sha256,key+' hash mismatch');assert(c.duration>0&&c.duration<12);assert(c.cues.length>=2);assert(qa.find(r=>r.key===key).transcriptMatch);}
for(const r of qa){assert(Math.abs(r.integratedLUFS+18)<1);assert(r.truePeakDB<=-1.5);}
console.log('PASS assets: original Unit 2 / Letter Land inline engine and Unit 3 files unchanged; 25 MP3 hashes, transcripts, timings and loudness verified');
