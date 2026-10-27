// Deterministic standalone SVG/JSON export of the exact runtime print-stroke model.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'shared/family-classroom.js'),'utf8');
const literal=source.match(/const glyphs=(\{[^\n]+\});/)[1];
const glyphs=vm.runInNewContext('('+literal+')'),dir=path.join(root,'assets/family-classroom/print');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'strokes.json'),JSON.stringify({model:'Original geometric lowercase print, single-storey a/g. SVG coordinates match runtime; not a font/recognition model.',glyphs},null,2));
for(const [letter,paths]of Object.entries(glyphs))fs.writeFileSync(path.join(dir,letter+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 210"><title>Trace lowercase ${letter}</title><g fill="none" stroke="#174d70" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">${paths.map(d=>`<path d="${d}"/>`).join('')}</g></svg>`);
console.log('Exported',Object.keys(glyphs).length,'print glyphs');
