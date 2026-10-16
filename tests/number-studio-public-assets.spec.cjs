const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
(async()=>{
 const base='https://dodinhhieu2207.github.io/game-tieng-anh/',tag=process.env.NS_RELEASE||'numbers-polish';
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 const files=['index.html','data/units.js','shared/number-studio.js','shared/number-studio.css','shared/number-studio-scene.css','shared/app-typography.css','assets/fonts/Outfit-Bold.ttf','assets/fonts/Outfit-ExtraBold.ttf','shared/speech-evaluator.js','unit3-speech.js'];
 function walk(dir){for(const f of fs.readdirSync(dir)){const file=path.posix.join(dir,f);if(fs.statSync(file).isDirectory())walk(file);else if(/\.(webp|mp3|ogg|js|json|html)$/.test(file))files.push(file);}}
 walk('assets/number-studio');
 for(let i=0;i<files.length;i+=8)await Promise.all(files.slice(i,i+8).map(async f=>{
  const r=await fetch(base+f+'?qa='+tag);assert.equal(r.status,200,f);
  const actual=Buffer.from(await r.arrayBuffer()),expected=fs.readFileSync(f);
  if(/\.(js|html|css|json)$/.test(f))assert.equal(actual.toString().replace(/\r\n/g,'\n'),expected.toString().replace(/\r\n/g,'\n'),f);else assert.equal(hash(actual),hash(expected),f);
 }));
 console.log('PASS public Number Studio: '+files.length+' source/config/art/audio/font assets match delivered repository.');
})().catch(e=>{console.error(e.message);process.exit(1);});
