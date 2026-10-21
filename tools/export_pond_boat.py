from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(r'C:\Users\Admin\.codex\generated_images\01a10987-4d44-7173-9799-a54fd1ad82c7'); out=Path('assets/letter-pond')
frames={'boat-open':'exec-7ac70552-3005-4bd7-ac1f-22f6a886c10a.png','boat-blink':'exec-2d2fe179-20d2-4aec-9346-c74b1bc6f6ea.png'}
rows=[r for r in json.loads((out/'manifest.json').read_text()) if r['file'] not in ['boat-open.webp','boat-blink.webp','eye-patch.webp']]
for name,source in frames.items():
 im=Image.open(root/source).convert('RGBA'); im.thumbnail((900,600)); p=out/(name+'.webp'); im.save(p,quality=94); rows.append({'file':p.name,'source':source,'size':im.size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
im=Image.open(root/frames['boat-blink']).convert('RGBA').crop((860,235,1060,325));p=out/'eye-patch.webp';im.save(p,quality=96);rows.append({'file':p.name,'source':frames['boat-blink'],'crop':[860,235,1060,325],'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(out/'manifest.json').write_text(json.dumps(rows,indent=2))
