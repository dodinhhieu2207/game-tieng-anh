"""Native extract/register four original imagegen interaction pose sheets."""
import json,shutil,hashlib
from pathlib import Path
from PIL import Image
import export_unit5_feelings_assets as b

out=b.OUT
manifest=json.loads((out/'manifest.json').read_text())
b.manifest=manifest
sources=json.loads((out/'sources/reactions.json').read_text())
manifest['assets']=[a for a in manifest['assets'] if '/reaction-' not in a['file'] and not a['file'].endswith('/reaction.gif')]
manifest['reactions']={}
for item in sources:
 word=item['word'];src=Path(item['source']);dest=out/f'sources/reaction-{word}.png';shutil.copy2(src,dest)
 b.record(dest,'imagegen original helping action',generation=src.stem,prompt='Preserve referenced actor identity/style; exact transparent 3x2 full-body atlas. Six physically connected poses: '+{'hungry':'holds, raises, bites, chews and lowers a sandwich.','thirsty':'holds, raises, drinks water and lowers an upright glass.','hot':'holds and fans with an open cream flower fan.','cold':'lifts, wraps and tucks a lavender blanket around shoulders.'}[word])
 im=Image.open(dest).convert('RGBA');cells=[]
 for n in range(6):
  tile=im.crop((n%3*im.width//3,n//3*im.height//2,(n%3+1)*im.width//3,(n//3+1)*im.height//2))
  # Registration uses the opaque illustration, not low-alpha antialias haze.
  box=tile.getchannel('A').point(lambda a:255 if a>220 else 0).getbbox();assert box
  cells.append(tile.crop(box))
 scale=min(476/max(c.height for c in cells),366/max(c.width for c in cells));frames=[]
 for i,c in enumerate(cells):
  band=c.getchannel('A').crop((0,round(c.height*.88),c.width,c.height));bb=band.point(lambda a:255 if a>150 else 0).getbbox();cx=(bb[0]+bb[2])/2
  w,h=round(c.width*scale),round(c.height*scale);sprite=c.resize((w,h),Image.Resampling.LANCZOS);frame=Image.new('RGBA',(400,520));frame.alpha_composite(sprite,(round(200-cx*scale),508-h));frames.append(frame)
  b.save_image(frame,f'actors/{word}/reaction-{i+1:02}.png','authored helping action frame',anchor=[200,508])
 b.save_image(frames[-1],f'actors/{word}/reaction-final.webp','helping action final pose',anchor=[200,508])
 durations=[300,260,320,360,260,380];b.encode_gif(frames,out/f'actors/{word}/reaction.gif',durations,False)
 gif=Image.open(out/f'actors/{word}/reaction.gif');hashes=[]
 for n in range(gif.n_frames):gif.seek(n);hashes.append(hashlib.sha256(gif.convert('RGBA').tobytes()).hexdigest())
 assert gif.n_frames==6 and len(set(hashes))==6
 manifest['reactions'][word]={'file':f'actors/{word}/reaction.gif','final':f'actors/{word}/reaction-final.webp','frames':6,'durationMs':sum(durations),'anchor':[200,508],'canvas':[400,520]}
 review=Image.new('RGB',(1200,280),'#fff6e3')
 for n,f in enumerate(frames):c=f.copy();c.thumbnail((200,260));review.paste(c,(n*200,10),c)
 review.save(b.ROOT/f'docs/game-plans/unit5-feelings/evidence/reaction-{word}.jpg',quality=92)
(out/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('PASS four helping action GIFs, six unique full poses each, matched 400x520 anchors')
