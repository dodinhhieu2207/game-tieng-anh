"""Crop generated production atlases; preserve their supplied alpha, no repainting."""
from pathlib import Path
from PIL import Image
import json, shutil
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('C:/Users/Admin/.codex/generated_images/01a10987-4d44-7173-9799-a54fd1ad82c7')
OUT=ROOT/'assets/number-studio'
SHEETS={
 'parade':('exec-8241e74a-5b8a-4d67-b93a-baf986e08521.png',[(0,0,880,545),(900,0,1536,550),(0,560,960,1024),(980,560,1536,1024)]),
 'detective':('exec-19031c12-5730-4695-999c-f62a2a00ab68.png',[(40,10,860,505),(880,80,1536,505),(80,510,760,1024),(1000,530,1510,970)]),
 'gift':('exec-f602e8c6-3a95-40db-8218-8d444273d060.png',[(20,10,810,570),(850,30,1500,575),(40,610,810,1000),(880,590,1490,1024)]),
 'snap':('exec-43677335-7241-40d4-b730-ac4572c2a182.png',[(0,0,770,500),(770,0,1536,500),(0,500,770,1024),(770,500,1536,1024)]),
 'book':('exec-e615cdb5-7305-4918-a180-a91c9e64417e.png',[(0,0,770,500),(770,0,1536,500),(0,500,770,1024),(770,500,1536,1024)]),
 'relay':('exec-9ca1ac7d-7168-4676-9ec6-6d0a3c873405.png',[(0,0,766,508),(770,0,1536,508),(0,516,766,1024),(770,516,1536,1024)])}
manifest=[]
for folder,(source,regions) in SHEETS.items():
    im=Image.open(SOURCE/source).convert('RGBA')
    dest=OUT/folder;dest.mkdir(parents=True,exist_ok=True)
    for name,region in zip(['scene','prop','part','accent'],regions):
        sprite=im.crop(region)
        if name!='scene':
            sprite=sprite.crop(sprite.getchannel('A').getbbox())
        sprite.thumbnail((950,650) if name=='scene' else (650,450),Image.Resampling.LANCZOS)
        sprite.save(dest/(name+'.webp'),quality=91)
        manifest.append({'file':f'{folder}/{name}.webp','source':source,'crop':region,'size':sprite.size,'alphaExtrema':sprite.getchannel('A').getextrema()})
toys=Image.open(SOURCE/'exec-a8f3f4e0-293d-4096-ac6a-6255c26e7ae3.png').convert('RGBA')
(OUT/'toys').mkdir(exist_ok=True)
for name,region in {'car':(0,0,575,510),'balloon':(590,0,1024,510),'robot':(1040,0,1536,510),'teddy':(0,515,510,1024),'plane':(525,515,1035,1024),'puppet':(1040,515,1536,1024)}.items():
    sprite=toys.crop(region);sprite=sprite.crop(sprite.getchannel('A').getbbox());sprite.thumbnail((240,260),Image.Resampling.LANCZOS);sprite.save(OUT/'toys'/(name+'.webp'),quality=93)
    manifest.append({'file':'toys/'+name+'.webp','source':'exec-a8f3f4e0-293d-4096-ac6a-6255c26e7ae3.png','crop':region,'size':sprite.size,'alphaExtrema':sprite.getchannel('A').getextrema()})
ui_source='exec-0ffa7562-1797-4382-8b7d-fadb9f0553ab.png'
ui=Image.open(SOURCE/ui_source).convert('RGBA');(OUT/'ui').mkdir(exist_ok=True)
for name,region in {'primary':(0,100,765,420),'secondary':(775,100,1536,420),'plaque':(50,550,940,930),'medal':(960,420,1520,1024)}.items():
    sprite=ui.crop(region);sprite=sprite.crop(sprite.getchannel('A').getbbox());sprite.thumbnail((700,400),Image.Resampling.LANCZOS);sprite.save(OUT/'ui'/(name+'.webp'),quality=92)
    manifest.append({'file':'ui/'+name+'.webp','source':ui_source,'crop':region,'size':sprite.size,'alphaExtrema':sprite.getchannel('A').getextrema()})
(OUT/'asset-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
audio=Path('C:/Users/Admin/.codex/artifacts/toy-machine-sfx/interface')
(OUT/'sfx').mkdir(exist_ok=True)
for cue,name in {'place':'drop_003.ogg','lock':'select_005.ogg','retry':'back_002.ogg','reward':'confirmation_002.ogg','paper':'scroll_003.ogg'}.items():
    shutil.copy2(audio/'Audio'/name,OUT/'sfx'/(cue+'.ogg'))
for path in audio.glob('*License*'):
    shutil.copy2(path,OUT/'sfx'/'LICENSE.txt')
print('Built',len(manifest),'art sprites and five sourced SFX')
