const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const manifest=JSON.parse(fs.readFileSync('assets/unit2/audio-higgs/manifest.json'));
const clips=Object.values(manifest.clips);assert(clips.length>=375);
for(const c of clips){assert(fs.existsSync(c.src),'Missing '+c.text);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(c.src)).digest('hex'),c.sha256,c.text);assert(c.transcriptMatch||c.phonicsAcousticCheck,c.text+' requires voice QA');assert(c.duration>.2&&c.duration<20,c.text+' invalid duration');}
for(const word of ['desk','chair','pencil','crayon','notebook']){assert(manifest.clips[word]);assert(manifest.clips['it s a '+word]);}
assert(manifest.clips['what s this']);console.log('PASS Unit 2 audio assets: '+clips.length+' real Higgs recordings, hashes, duration, transcript/phonics checks and school dialogue coverage.');
