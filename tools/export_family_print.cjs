// Deterministic standalone SVG/JSON export of the exact runtime print-stroke model.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),model=require('../shared/family-handwriting-model.js'),glyphs=model.glyphs,dir=path.join(root,'assets/family-classroom/print');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'strokes.json'),JSON.stringify({model:'Original geometric lowercase print, single-storey a/g. SVG coordinates match runtime; not a font/recognition model.',glyphs},null,2));
const css=fs.readFileSync(path.join(root,'shared/family-classroom.css'),'utf8').split(/\r?\n/).find(l=>l.startsWith('.family-classroom .fc-stencil-outline'));
for(const [letter,paths]of Object.entries(glyphs))fs.writeFileSync(path.join(dir,letter+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" class="family-classroom" viewBox="0 0 140 210"><title>Colour lowercase ${letter} inside its outline</title><style>${css}</style>${model.stencilMarkup(paths)}</svg>`);
console.log('Exported',Object.keys(glyphs).length,'print glyphs');
