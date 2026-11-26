"""Renderer-independent asset production. Native sprite extraction and type export.

Illustrations are made with imagegen; this script crops/aligns those source cells,
encodes authored poses, and builds exact vector letter/control/effect assets.
It does not repaint, upscale or substitute source character artwork.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import hashlib, json, math, shutil, struct, wave, random
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/unit5/lesson1'
WORDS = ['happy','sad','hungry','thirsty','hot','cold']
FONT = ROOT / 'assets/fonts/Outfit-Bold.ttf'
font = TTFont(FONT)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm
manifest = {'version':'20261126-feelings-assets-v1','scope':'Renderer-independent assets, not app integration',
            'words':WORDS, 'font':'App Outfit Bold, local project font', 'assets':[], 'actors':{}, 'buildWords':{}}

def record(p, role, **kw):
    item = {'file':p.relative_to(OUT).as_posix(),'role':role,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(), **kw}
    if p.suffix in ['.png','.webp','.gif']:
        im=Image.open(p);item.update(width=im.width,height=im.height)
    manifest['assets'].append(item)
    return item

def save_image(im, name, role, **kw):
    p=OUT/name;p.parent.mkdir(parents=True,exist_ok=True)
    im.save(p, **({'quality':94,'method':6} if p.suffix=='.webp' else {}))
    record(p,role,**kw)
    return p

def svg(name,w,h,body,role,**kw):
    p=OUT/name;p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>',encoding='utf-8')
    record(p,role,width=w,height=h,**kw)
    return p

def text_path(text,size,cx,baseline,colour='#174e62'):
    scale=size/upm
    advances=[font['hmtx'][cmap[ord(ch)]][0] for ch in text]
    x=cx-sum(advances)*scale/2
    paths=[]
    for ch,advance in zip(text,advances):
        pen=SVGPathPen(glyphs);glyphs[cmap[ord(ch)]].draw(pen)
        paths.append(f'<path d="{pen.getCommands()}" transform="translate({x:.3f},{baseline}) scale({scale:.6f},-{scale:.6f})" fill="{colour}"/>')
        x+=advance*scale
    return ''.join(paths)

def png_text(draw,text,size,cx,baseline,colour):
    f=ImageFont.truetype(str(FONT),size)
    draw.text((cx,baseline),text,font=f,fill=colour,anchor='ms',stroke_width=0)

def cut_alpha(im):
    a=im.getchannel('A');box=a.point(lambda p:255 if p>32 else 0).getbbox()
    if not box:raise ValueError('Empty sprite cell')
    return im.crop(box),box

def encode_gif(frames,path,durations,loop=True):
    # One shared palette across the entire authored cycle, with one transparent index.
    atlas=Image.new('RGB',(frames[0].width*len(frames),frames[0].height),'#fff9ed')
    for i,im in enumerate(frames):atlas.paste(im,(i*im.width,0),im)
    atlas.thumbnail((600,400),Image.Resampling.LANCZOS)
    pal=atlas.quantize(colors=255,method=Image.Quantize.FASTOCTREE)
    palette=pal.getpalette()[:765]+[255,0,255]
    master=Image.new('P',(1,1));master.putpalette(palette)
    converted=[]
    for im in frames:
        rgb=Image.new('RGB',im.size,'#fff9ed');rgb.paste(im,mask=im.getchannel('A'))
        q=rgb.quantize(palette=master,dither=Image.Dither.NONE)
        q.paste(255,mask=im.getchannel('A').point(lambda x:255 if x<128 else 0))
        q.info['transparency']=255;converted.append(q)
    path.parent.mkdir(parents=True,exist_ok=True)
    options={'save_all':True,'append_images':converted[1:],'duration':durations,'disposal':2,'transparency':255,'optimize':False}
    if loop:options['loop']=0
    converted[0].save(path,**options)
    record(path,'authored-pose motion' if 'actors' in path.parts else 'effect animation',frames=len(frames),durationMs=sum(durations),loop=loop)

def extract_sources():
    sources=json.loads((OUT/'sources/generations.json').read_text())
    cleaned={x['key']:x for x in json.loads((OUT/'sources/alpha-cleanup.json').read_text())} if (OUT/'sources/alpha-cleanup.json').exists() else {}
    for item in sources:
        key=item['key'];src=Path(item['source']);dest=OUT/'sources'/f'{key}.png'
        if not dest.exists():shutil.copy2(src,dest)
        record(dest,'imagegen original',generation=src.stem)
        active=dest
        if key in cleaned:
            active=OUT/'sources'/f'{key}-alpha-clean.png'
            if not active.exists():shutil.copy2(cleaned[key]['source'],active)
            record(active,'imagegen alpha-cleaned variant',generation=Path(cleaned[key]['source']).stem)
        im=Image.open(active).convert('RGBA')
        if key.startswith('bg-'):
            save_image(im.convert('RGB'),f'backgrounds/{key[3:]}.webp','empty scene plate')
        elif key in WORDS:
            cells=[];bounds=[]
            for n in range(6):
                x=n%3;y=n//3
                tile=im.crop((round(x*im.width/3),round(y*im.height/2),round((x+1)*im.width/3),round((y+1)*im.height/2)))
                crop,box=cut_alpha(tile);cells.append(crop);bounds.append(box)
            scale=min(476/max(x.height for x in cells),360/max(x.width for x in cells))
            frames=[];anchors=[]
            for i,crop in enumerate(cells):
                # Align the feet, rather than a waving hand or hair silhouette.
                band=crop.getchannel('A').crop((0,round(crop.height*.87),crop.width,crop.height))
                bb=band.point(lambda p:255 if p>64 else 0).getbbox()
                foot_x=(bb[0]+bb[2])/2 if bb else crop.width/2
                w,h=round(crop.width*scale),round(crop.height*scale)
                sprite=crop.resize((w,h),Image.Resampling.LANCZOS)
                x=round(200-foot_x*scale);y=508-h
                canvas=Image.new('RGBA',(400,520));canvas.alpha_composite(sprite,(x,y))
                frames.append(canvas);anchors.append({'sourceCellBounds':bounds[i],'footX':200,'footY':508,'scale':round(scale,5)})
                save_image(canvas,f'actors/{key}/frame-{i+1:02}.png','registered animation frame',anchor=[200,508])
            save_image(frames[0],f'actors/{key}/idle.webp','static actor / reduced motion',anchor=[200,508])
            durations=[220,180,180,220,180,300]
            encode_gif(frames,OUT/f'actors/{key}/{key}.gif',durations)
            encode_gif(frames,OUT/f'actors/{key}/{key}-once.gif',durations,False)
            manifest['actors'][key]={'still':f'actors/{key}/idle.webp','motion':f'actors/{key}/{key}.gif',
              'once':f'actors/{key}/{key}-once.gif','anchor':[200,508],'canvas':[400,520],
              'pronoun':'she' if key in ['hungry','thirsty','cold'] else 'he', 'frames':anchors,
              'timingMs':durations,'source':'Original supplementary actors; not a redraw of textbook characters'}
        elif key=='props':
            names=['sandwich','water','fan','blanket','camera','microphone','photo-clip','shelf','word-tray','photo-frame','reward-star','photo-album']
            boxes=[(2,20,369,355),(400,20,683,355),(692,26,1095,350),(1091,26,1448,355),
                   (4,374,365,711),(400,373,689,712),(704,389,1075,712),(1077,456,1448,654),
                   (0,765,368,1054),(388,730,700,1080),(735,745,1080,1080),(1090,731,1448,1080)]
            for n,name in enumerate(names):
                x=n%4;y=n//4
                tile=im.crop(boxes[n])
                cut,box=cut_alpha(tile)
                cut.thumbnail((480,480),Image.Resampling.LANCZOS)
                save_image(cut,f'props/{name}.webp','interactive prop',sourceCell=n,sourceBounds=box,sourceSheetCrop=boxes[n])

def build_type():
    chars=sorted(set(''.join(WORDS)))
    fills={'base':'#fff6da','selected':'#e2f3ea','correct':'#e6f4db','hint':'#f5f2e9'}
    for ch in chars:
        for state,bg in fills.items():
            body=f'<rect x="4" y="8" width="112" height="116" rx="22" fill="#9dbdb0"/><rect x="4" y="3" width="112" height="116" rx="22" fill="{bg}" stroke="#69a797" stroke-width="3"/><path d="M22 14H96" stroke="white" stroke-width="4" stroke-linecap="round"/>'
            body+=text_path(ch,76,60,91,'#174e62' if state!='hint' else '#a9b9ad')
            svg(f'letters/{ch}-{state}.svg',120,128,body,'individual letter tile',letter=ch,state=state,baseline=91,advance=120)
        # Bare type is an independent layer, so it can be used on any substrate.
        svg(f'glyphs/{ch}.svg',100,112,text_path(ch,76,50,88),'bare letter outline',letter=ch,baseline=88)
    for role in ['start','middle','end']:
        # Same receiver geometry, no answer-encoding sockets.
        body='<rect x="4" y="7" width="112" height="116" rx="22" fill="#b7d0c1"/><rect x="4" y="3" width="112" height="116" rx="22" fill="#fff6da" stroke="#69a797" stroke-width="3"/>'
        svg(f'letters/tile-{role}.svg',120,128,body,'composable tile substrate',advance=120,baseline=91)
    svg('letters/receiver.svg',120,128,'<rect x="5" y="4" width="110" height="116" rx="22" fill="#e8eee3" stroke="#8bb4a5" stroke-width="3"/><path d="M45 63h30M60 48v30" stroke="#a2bfb1" stroke-width="5" stroke-linecap="round"/>','empty letter receiver')
    for word in WORDS:
        w=round(max(230,ImageFont.truetype(str(FONT),64).getlength(word)+76));h=116
        for state,bg in fills.items():
            body=f'<rect x="4" y="10" width="{w-8}" height="100" rx="26" fill="#93b3a5"/><rect x="4" y="4" width="{w-8}" height="100" rx="26" fill="{bg}" stroke="#69a797" stroke-width="3"/>'+text_path(word,64,w/2,77,'#174e62' if state!='hint' else '#a9b9ad')
            svg(f'words/{word}-{state}.svg',w,h,body,'whole word label',word=word,state=state,baseline=77)
        # Complete PNG labels remain usable by engines without SVG texture import.
        im=Image.new('RGBA',(w*2,h*2));d=ImageDraw.Draw(im)
        d.rounded_rectangle((8,20,w*2-8,h*2-12),radius=48,fill='#93b3a5')
        d.rounded_rectangle((8,8,w*2-8,h*2-24),radius=48,fill='#fff6da',outline='#69a797',width=6)
        png_text(d,word,128,w,154,'#174e62')
        save_image(im,f'words/{word}.png','whole word label raster',word=word)
        manifest['buildWords'][word]={'letters':list(word),'tileAdvance':120,'baseline':91,'width':len(word)*120,
              'positions':[{'letter':c,'x':i*120,'y':0,'asset':f'letters/{c}-base.svg'} for i,c in enumerate(word)],
              'initialUse':'Whole-word matching; letter assembly optional with model'}
    for text,key in [("He's",'hes'),("She's",'shes')]:
        svg(f'words/{key}.svg',240,116,text_path(text,64,120,77),'sentence prefix outline')

ICONS={
 'back':'<path d="M66 25L34 50l32 25M36 50h43"/>',
 'play':'<path d="M38 24L77 50 38 76Z" fill="currentColor" stroke-linejoin="round"/>',
 'hear-word':'<path d="M25 42h14l18-16v48L39 58H25Z"/><path d="M67 37q20 13 0 26"/>',
 'hear-sentence':'<path d="M23 31h49v32H47L33 77V63H23Z"/><path d="M34 42h26M34 52h20"/>',
 'pause':'<path d="M39 27v46M62 27v46" stroke-width="12"/>',
 'replay':'<path d="M74 36A28 28 0 1 0 78 60M73 21v22H51"/>',
 'next':'<path d="M34 25l32 25-32 25M23 50h41"/>',
 'undo':'<path d="M33 25L17 42l17 17M20 42h40q28 0 20 28"/>',
 'home':'<path d="M19 44l31-26 31 26M28 39v40h44V39M43 79V57h15v22"/>',
 'camera':'<path d="M20 35h17l8-12h18l8 12h12v43H20Z"/><circle cx="52" cy="55" r="14"/>',
 'microphone':'<rect x="39" y="18" width="24" height="40" rx="12"/><path d="M28 46q0 25 23 25t23-25M51 71v14M39 85h25"/>',
 'done':'<path d="M23 51l18 19 37-40"/>',
 'sound':'<path d="M22 42h17l18-17v50L39 58H22Z"/><path d="M66 35q23 15 0 30M74 24q33 26 0 52"/>',
 'mute':'<path d="M22 42h17l18-17v50L39 58H22Z"/><path d="M68 37l18 26M86 37L68 63"/>',
 'help':'<path d="M36 33q3-18 20-14t11 25q-17 7-16 20"/><circle cx="51" cy="79" r="3" fill="currentColor"/>',
 'close':'<path d="M31 31l38 38M69 31L31 69"/>'}

def build_ui():
    states={'base':('#fff6da','#174e62'),'pressed':('#cce8dc','#174e62'),'disabled':('#e6e8dc','#9caeaa'),'focus':('#fff6da','#174e62')}
    for name,icon in ICONS.items():
        svg(f'ui/icons/{name}.svg',100,100,f'<g fill="none" stroke="#174e62" color="#174e62" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">{icon}</g>','bare control icon',control=name)
        for state,(bg,fg) in states.items():
            body=f'<rect x="5" y="10" width="110" height="110" rx="30" fill="#8bb5a6"/><rect x="5" y="4" width="110" height="110" rx="30" fill="{bg}" stroke="#65a596" stroke-width="3"/>'
            if state=='focus':body+='<rect x="2" y="1" width="116" height="116" rx="32" fill="none" stroke="#195866" stroke-width="3"/>'
            body+=f'<g transform="translate(10 10)" fill="none" stroke="{fg}" color="{fg}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">{icon}</g>'
            svg(f'ui/{name}-{state}.svg',120,124,body,'control asset',control=name,state=state)
    for state,(bg,fg) in states.items():
        svg(f'ui/button-wide-{state}.svg',360,104,f'<rect x="4" y="10" width="352" height="90" rx="28" fill="#8bb5a6"/><rect x="4" y="4" width="352" height="90" rx="28" fill="{bg}" stroke="#65a596" stroke-width="3"/>','text-free button plate',state=state)
    svg('ui/photo-frame.svg',600,640,'<rect x="12" y="18" width="576" height="610" rx="28" fill="#90b6a4"/><path d="M12 36Q12 10 40 10H560Q588 10 588 36V600Q588 620 560 620H40Q12 620 12 600ZM44 42V500H556V42Z" fill="#fff9e9" fill-rule="evenodd"/>','photo surround; center transparent')
    svg('ui/word-tray.svg',1000,170,'<rect x="5" y="14" width="990" height="150" rx="38" fill="#88b3a2"/><rect x="5" y="4" width="990" height="150" rx="38" fill="#e8f0df" stroke="#75a999" stroke-width="5"/><rect x="20" y="20" width="960" height="116" rx="26" fill="#fff8df"/>','letter source tray')

def build_fx():
    def effect(name,paint,count=10,size=(320,240),duration=60):
        frames=[]
        for i in range(count):
            im=Image.new('RGBA',size);paint(ImageDraw.Draw(im),i/(count-1),size)
            save_image(im,f'effects/{name}/frame-{i+1:02}.png','effect frame')
            frames.append(im)
        save_image(frames[count//2],f'effects/{name}/static.png','reduced-motion effect')
        encode_gif(frames,OUT/f'effects/{name}.gif',[duration]*count,False)
    def ring(d,t,s):
        r=20+70*t;a=round(210*(1-t));cx,cy=s[0]/2,s[1]/2
        d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=(234,177,57,a),width=round(7-4*t))
    def light(d,t,s):
        # GIF alpha is binary: use a moving visible sheen, not a <128 alpha fade
        # that would disappear during GIF encoding. The SVG/static PNG keeps soft alpha.
        if 0<t<1:
            d.rounded_rectangle((12,45,s[0]-12,s[1]-45),radius=35,outline=(246,184,51,220),width=4)
            x=18+(s[0]-60)*t
            d.rounded_rectangle((x,52,x+28,s[1]-52),radius=12,fill=(255,226,112,210))
    def spark(d,t,s):
        for n in range(8):
            ang=n*math.tau/8;rad=18+70*t;x=s[0]/2+math.cos(ang)*rad;y=s[1]/2+math.sin(ang)*rad;z=4+5*math.sin(math.pi*t)
            d.polygon([(x,y-z),(x+z*.4,y-z*.3),(x+z,y),(x+z*.3,y+z*.3),(x,y+z),(x-z*.3,y+z*.3),(x-z,y),(x-z*.3,y-z*.3)],fill=(239,181,52,round(255*(1-t))))
    def flash(d,t,s):
        a=round(190*(1-t)**2);d.rounded_rectangle((6,6,s[0]-6,s[1]-6),radius=30,fill=(255,250,220,a))
    def confetti(d,t,s):
        rng=random.Random(426)
        for n in range(18):
            x0=rng.uniform(10,s[0]-10);delay=rng.uniform(0,.3);y=(t-delay)*s[1]*1.2;x=x0+math.sin(t*5+n)*13
            if 0<y<s[1]:d.rounded_rectangle((x,y,x+7,y+12),radius=2,fill=[(241,180,66,220),(111,176,155,220),(230,141,124,220)][n%3])
    def retry(d,t,s):
        x=60+200*(1-t);y=120+18*math.sin(t*math.pi)
        d.line((x-25,y,x+25,y),fill=(96,154,144,round(180*math.sin(math.pi*t))),width=5)
    for n,p in [('snap',ring),('word-light',light),('correct',spark),('photo-flash',flash),('complete',confetti),('return',retry)]:effect(n,p)
    svg('effects/word-light.svg',480,140,'<defs><radialGradient id="g"><stop stop-color="#ffe7a0" stop-opacity=".75"/><stop offset="1" stop-color="#ffe7a0" stop-opacity="0"/></radialGradient></defs><rect width="480" height="140" rx="35" fill="url(#g)"/>','read-along glow overlay; audio-clocked, no baked text')

def build_sounds():
    dst=OUT/'audio/sfx';dst.mkdir(parents=True,exist_ok=True)
    source=ROOT/'assets/playful-foley'
    mapping={'tap':'tap','pick-up':'roll','tile-snap':'place','photo-clip':'latch','retry':'retry','correct':'correct','complete':'complete','photo-turn':'reveal','star':'star'}
    for new,old in mapping.items():
        p=dst/(new+'.wav');shutil.copy2(source/(old+'.wav'),p)
        record(p,'licensed real sampled Foley',source=f'assets/playful-foley/{old}.wav',license='CC0-1.0',creator='Kenney')
    for n in ['README.md','manifest.json','LICENSE-impact-sounds.txt','LICENSE-rpg-audio.txt']:
        shutil.copy2(source/n,dst/('source-'+n))
    # Newly composed quiet pentatonic underscore, no voice; periodic 24s loop.
    sr=24000;seconds=24;t=np.arange(sr*seconds)/sr;buf=np.zeros_like(t)
    notes=[60,64,67,69,67,64,62,67,60,64,67,72,69,67,64,62]
    for i,n in enumerate(notes):
        start=i*1.5;u=t-start;mask=(u>=0)&(u<3);z=u[mask];freq=440*2**((n-69)/12)
        env=(1-np.exp(-z*15))*np.exp(-z*2.2)
        buf[mask]+=.075*env*(np.sin(math.tau*freq*z)+.22*np.sin(math.tau*freq*2*z))
    buf*=np.minimum(1,t/.8)*np.minimum(1,(seconds-t)/.8)
    p=OUT/'audio/music/feelings-room-loop.wav';p.parent.mkdir(parents=True,exist_ok=True)
    with wave.open(str(p),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(buf,-1,1)*32767).astype('<i2').tobytes())
    record(p,'original optional instrumental underscore',duration=seconds,creator='Original procedural composition for this project',license='Project original; no third-party samples',runtimeGain=.2)

def build_book_reference():
    # Preserve source reference without repainting/upscaling or claiming restored detail.
    src=Path('C:/Users/Admin/AppData/Local/Temp/unit5-lesson1-reference.png')
    if not src.exists():return
    shutil.copy2(src,OUT/'sources/book-page38-reference.png')
    im=Image.open(src).convert('RGB')
    xs=[46,173,307,438,575,713];ends=[169,302,435,573,711,851]
    for word,x,e in zip(WORDS,xs,ends):
        save_image(im.crop((x,244,e,361)),f'book-reference/{word}.png','unchanged textbook portrait crop',copyright='Oxford University Press; textbook content, not original asset',source='Family and Friends Starter 2nd ed., page 38')
    save_image(im.crop((45,462,846,1040)),'book-reference/home-panel.webp','unchanged textbook scene crop',copyright='Oxford University Press')

def build_covers():
    bg=Image.open(OUT/'backgrounds/house.webp').convert('RGBA').resize((960,640))
    cards=[('present','Feelings House','happy'),('camera','Feelings Camera','sad'),('helping','Helping Hands','hungry'),('workshop','Photo Workshop','thirsty'),('reporter','Little Reporter','cold')]
    for key,title,actor in cards:
        canvas=bg.copy();d=ImageDraw.Draw(canvas)
        d.rounded_rectangle((35,35,925,605),radius=42,fill=(255,250,230,185),outline='#80b5a0',width=5)
        im=Image.open(OUT/f'actors/{actor}/idle.webp');im.thumbnail((380,440),Image.Resampling.LANCZOS);canvas.alpha_composite(im,(70,150))
        size=51
        while ImageFont.truetype(str(FONT),size).getlength(title)>460:size-=1
        png_text(d,title,size,650,210,'#174e62')
        word=Image.open(OUT/f'words/{actor}.png');word.thumbnail((370,120),Image.Resampling.LANCZOS);canvas.alpha_composite(word,(465,270))
        prop={'camera':'camera','helping':'sandwich','workshop':'word-tray','reporter':'microphone','present':'photo-album'}[key]
        p=Image.open(OUT/f'props/{prop}.webp');p.thumbnail((170,150),Image.Resampling.LANCZOS);canvas.alpha_composite(p,(565,395))
        save_image(canvas.convert('RGB'),f'covers/{key}.webp','activity cover')

def main():
    import sys
    global manifest
    if '--ui-only' in sys.argv:
        manifest=json.loads((OUT/'manifest.json').read_text())
        manifest['assets']=[a for a in manifest['assets'] if not a['file'].startswith('ui/')]
        build_ui()
        (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
        print('RE-EXPORTED control assets')
        return
    if '--fx-only' in sys.argv:
        manifest=json.loads((OUT/'manifest.json').read_text())
        manifest['assets']=[a for a in manifest['assets'] if not a['file'].startswith('effects/')]
        build_fx()
        (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
        print('RE-EXPORTED effect assets')
        return
    extract_sources();build_type();build_ui();build_fx();build_sounds();build_book_reference();build_covers()
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    print('EXPORTED',len(manifest['assets']),'asset records')

if __name__=='__main__':main()
