from PIL import Image
from pathlib import Path
import json,hashlib
root=Path(r'C:\Users\Admin\.codex\generated_images\01a10987-4d44-7173-9799-a54fd1ad82c7');out=Path('assets/letter-pond/ui');rows=[]
sources={'mission-board':'exec-e834f4e0-7d3c-407c-8fcb-e1e696988c71.png','picture-frame':'exec-0463857a-eb03-4d54-a0de-36eb3e71681f.png','word-plaque':'exec-3e44d9ab-2109-4804-8945-59dc0ebffb4f.png','listen-button':'exec-ba9e29c3-d41c-4404-923e-796b4f886095.png'}
for name,source in sources.items():
 im=Image.open(root/source).convert('RGBA');box=im.getchannel('A').point(lambda x:255 if x>35 else 0).getbbox();im=im.crop(box);im.thumbnail((1200,700));p=out/(name+'.webp');im.save(p,quality=94);rows.append({'file':p.name,'source':source,'crop':box,'size':im.size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(out/'manifest.json').write_text(json.dumps(rows,indent=2))

