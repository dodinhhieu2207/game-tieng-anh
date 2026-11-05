"""Original engineered SVG pipe kit. Every tile is 200x200 with port anchors at edge midpoints."""
from pathlib import Path
import json
OUT=Path(__file__).resolve().parents[1]/'assets/juice-pipe-lab';OUT.mkdir(exist_ok=True)
DEFS='''<defs><linearGradient id="mint" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c0f3db"/><stop offset=".45" stop-color="#67bca9"/><stop offset="1" stop-color="#358b83"/></linearGradient><linearGradient id="gold" x2="1" y2="1"><stop stop-color="#fff0b0"/><stop offset=".45" stop-color="#efc165"/><stop offset="1" stop-color="#b98536"/></linearGradient><filter id="shadow" filterUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240"><feDropShadow dx="0" dy="5" stdDeviation="2" flood-color="#235d60" flood-opacity=".24"/></filter></defs>'''
for name,d,ports in [('straight','M0 100H200',['W','E']),('elbow','M100 0V60Q100 100 140 100H200',['N','E'])]:
 collars=''
 for port in ports:
  rot={'N':0,'E':90,'S':180,'W':270}[port]
  collars+=f'<g transform="rotate({rot} 100 100)"><rect x="48" y="0" width="104" height="20" rx="5" fill="url(#gold)" stroke="#9d763f" stroke-width="3"/><path d="M57 6H142" stroke="#fff5c8" stroke-width="3" stroke-linecap="round"/></g>'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">{DEFS}<g filter="url(#shadow)"><path d="{d}" fill="none" stroke="#286d70" stroke-width="96"/><path d="{d}" fill="none" stroke="url(#mint)" stroke-width="86"/><path d="{d}" fill="none" stroke="#326d71" stroke-width="58"/><path d="{d}" fill="none" stroke="#c1e8de" stroke-width="48"/><path d="{d}" fill="none" stroke="#6ab6af" stroke-width="38"/></g>{collars}</svg>'
 (OUT/('pipe-'+name+'.svg')).write_text(svg,encoding='utf-8')
# One contiguous fitted board; no isolated randomly positioned sockets.
cells=''
for r in range(3):
 for c in range(3):
  x=c*200;y=r*200;cells+=f'<rect x="{x+3}" y="{y+3}" width="194" height="194" rx="15" fill="#edf7e9" stroke="#a5c8b2" stroke-width="3"/><path d="M{x+23} {y+9}H{x+175}" stroke="#fffdf2" stroke-width="5" stroke-linecap="round"/>'
(OUT/'board.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -22 644 644">{DEFS}<rect x="-19" y="-16" width="638" height="636" rx="30" fill="url(#mint)" stroke="#428d84" stroke-width="6"/>{cells}</svg>',encoding='utf-8')
(OUT/'valve.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">{DEFS}<circle cx="50" cy="50" r="42" fill="url(#gold)" stroke="#a47635" stroke-width="5"/><circle cx="50" cy="50" r="30" fill="#6dbba6" stroke="#3d8277" stroke-width="3"/><path d="M50 21V79M21 50H79" stroke="#fff0ba" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="50" r="13" fill="url(#gold)"/></svg>',encoding='utf-8')
(OUT/'rack-tile.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">{DEFS}<rect x="4" y="9" width="192" height="187" rx="28" fill="#679f90"/><rect x="4" y="3" width="192" height="185" rx="28" fill="#fff8de" stroke="#a4c8b4" stroke-width="4"/><path d="M26 12H174" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>',encoding='utf-8')
patterns=[[[0,1],[1,1],[2,1],[2,2]],[[0,1],[0,2],[1,2],[2,2]],[[0,1],[1,1],[1,2],[2,2]],[[0,1],[0,0],[1,0],[2,0],[2,1],[2,2]],[[0,1],[1,1],[1,0],[2,0],[2,1],[2,2]],[[0,1],[0,0],[1,0],[1,1],[1,2],[2,2]],[[0,1],[0,0],[1,0],[2,0],[2,1],[1,1],[1,2],[2,2]],[[0,1],[0,2],[1,2],[1,1],[1,0],[2,0],[2,1],[2,2]]]
(OUT/'patterns.json').write_text(json.dumps({'cols':3,'rows':3,'inlet':[0,1,'W'],'outlet':[2,2,'E'],'patterns':[{'id':i,'level':0 if i<3 else 1 if i<6 else 2,'cells':p} for i,p in enumerate(patterns)]},indent=2),encoding='utf-8')
(OUT/'CREDITS.md').write_text('Original engineered pipe/board/valve/rack SVG kit generated reproducibly by tools/build_pipe_kit.py. Tile 200x200; ports N=(100,0), E=(200,100), S=(100,200), W=(0,100). Same profile, joint width and centreline for all orientations. Water centreline derives from the same anchors/40-unit elbow radius. Original raster scene/cover/pump/jug built-in image_gen sources recorded in sources.json. Font App Outfit, existing local PixiJS and GSAP licenses. Existing approved Higgs lab-intro and jug clips reused. Running water Arthur, https://opengameart.org/content/running-water CC BY-SA 3.0 (existing excerpt assets/magic-jug/pour.ogg); Kenney CC0 tactile SFX retained. No new voice or student data.\n',encoding='utf-8')
