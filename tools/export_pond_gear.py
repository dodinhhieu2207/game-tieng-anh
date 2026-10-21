from PIL import Image
from pathlib import Path
import json,hashlib
src=Path(r'C:\Users\Admin\.codex\generated_images\01a10987-4d44-7173-9799-a54fd1ad82c7\exec-6dc07ece-63a8-4fe7-95bc-a21181def31b.png')
im=Image.open(src).convert('RGBA'); out=Path('assets/letter-pond'); rows=[]
for name,box in [('rod',(0,0,940,724)),('bobber-hook',(940,0,1320,724)),('splash',(1320,0,2172,724))]:
 p=im.crop(box); b=p.getchannel('A').point(lambda v:255 if v>35 else 0).getbbox(); p=p.crop(b); p.thumbnail((700,700)); dest=out/(name+'.webp'); p.save(dest,quality=94); rows.append({'file':dest.name,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'source':src.name,'sheetCrop':box,'alphaCrop':b,'size':p.size})
for f in out.glob('*.ogg'): rows.append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
(out/'manifest.json').write_text(json.dumps(rows,indent=2))
