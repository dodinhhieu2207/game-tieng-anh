"""Exact standalone letter/word artwork from bundled Outfit outlines, no AI text."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import base64,json,hashlib
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/word-mine';OUT.mkdir(exist_ok=True)
font=TTFont(ROOT/'assets/fonts/Outfit-Bold.ttf');glyphs=font.getGlyphSet();cmap=font.getBestCmap();manifest=[]
for folder in ['glyphs','tiles','words']:(OUT/folder).mkdir(exist_ok=True)
def path(ch):
 name=cmap[ord(ch)];pen=SVGPathPen(glyphs);glyphs[name].draw(pen);return pen.getCommands(),glyphs[name].width
def save(p,svg,**meta):
 p.write_text(svg,encoding='utf8');manifest.append(dict(file=p.relative_to(OUT).as_posix(),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),**meta))
def letter(ch):
 d,width=path(ch);return f'<g transform="translate({(160-width*.18)/2:.3f} 158) scale(.18 -.18)"><path d="{d}" fill="#124a65" stroke="#fff4bc" stroke-width="12" paint-order="stroke"/></g>'
gem=base64.b64encode((ROOT/'assets/unit3/lesson5/adventure/gem.webp').read_bytes()).decode()
for ch in sorted(set('hathorseillinsect')):
 save(OUT/'glyphs'/(ch+'.svg'),f'<svg xmlns="http://www.w3.org/2000/svg" width="160" height="190" viewBox="0 0 160 190" role="img" aria-label="{ch}">{letter(ch)}</svg>',kind='outlined letter',letter=ch,font='bundled Outfit Bold')
 save(OUT/'tiles'/(ch+'.svg'),f'<svg xmlns="http://www.w3.org/2000/svg" width="220" height="240" viewBox="0 0 220 240" role="img" aria-label="{ch}"><image href="data:image/webp;base64,{gem}" width="220" height="240" preserveAspectRatio="xMidYMid meet"/><g transform="translate(30 22)">{letter(ch)}</g></svg>',kind='reusable assembled gem and independent glyph',letter=ch)
for word in ['hat','horse','ill','insect']:
 widths=[path(ch)[1] for ch in word];total=sum(widths)*.18;left=15;parts=[]
 for ch,width in zip(word,widths):
  d,_=path(ch);parts.append(f'<g transform="translate({left:.3f} 158) scale(.18 -.18)"><path d="{d}" fill="#124a65" stroke="#fff4bc" stroke-width="12" paint-order="stroke"/></g>');left+=width*.18
 save(OUT/'words'/(word+'.svg'),f'<svg xmlns="http://www.w3.org/2000/svg" width="{total+30:.3f}" height="190" viewBox="0 0 {total+30:.3f} 190" role="img" aria-label="{word}">{"".join(parts)}</svg>',kind='outlined whole word',word=word)
(OUT/'letter-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8');print('Exported',len(manifest),'standalone glyph, tile and word assets')
