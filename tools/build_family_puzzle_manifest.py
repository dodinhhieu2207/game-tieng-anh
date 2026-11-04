"""Inventory the complete Family Sentence Puzzle graphic kit without changing artwork."""
from pathlib import Path
import hashlib
import json

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/family-sentence-puzzle'
ROLES={
 'activity-cover.webp':'Activity cover', 'desk.png':'Main puzzle desk',
 'title-plaque.webp':'Game title plaque', 'button-mint.webp':'Secondary button skin',
 'button-gold.webp':'Primary button skin', 'finale-album.webp':'Desktop completion album',
 'finale-album-mobile.webp':'Phone completion album', 'photo-frame.svg':'Target portrait frame',
 'piece.svg':'Master puzzle shape', 'piece-this.svg':'This word piece', 'piece-is.svg':'is word piece',
 'piece-my.svg':'my word piece', 'piece-family.svg':'Family word piece', 'slot.svg':'Sentence position',
 'piece-tray.svg':'Word piece tray', 'icon-listen.svg':'Listen control icon',
 'icon-hint.svg':'Hint control icon', 'icon-check.svg':'Check control icon',
 'icon-next.svg':'Next control icon', 'icon-restart.svg':'Restart control icon',
 'icon-return.svg':'Return piece control icon', 'correct-seal.svg':'Correct position seal',
 'retry-seal.svg':'Retry position seal', 'progress-badge.svg':'Round progress badge',
 'status-plaque.svg':'Instruction and status plaque', 'collection-card.svg':'Collected family photo card',
}

def main():
    graphics=[]
    for path in sorted(OUT.iterdir()):
        if path.suffix not in {'.png','.webp','.svg'}:continue
        if path.name not in ROLES:raise ValueError(f'Missing asset role: {path.name}')
        graphics.append({'file':path.name,'role':ROLES[path.name],
                         'kind':'original-vector' if path.suffix=='.svg' else 'original-generated-raster',
                         'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    missing=set(ROLES)-{x['file'] for x in graphics}
    if missing:raise ValueError(f'Missing asset files: {missing}')
    data={'version':'20261104-full-kit1','game':'u4familypuzzle','graphics':graphics,
          'artDirection':'Mint painted wood/enamel, ivory paper, honey gold and coral; live App Outfit text.',
          'rasterPreparation':'Imagegen originals; FFmpeg WebP quality 95 for new UI and album raster files. Original PNG sources retained under the Codex generated_images directory.',
          'reused':{
              'characters':'assets/family-treehouse-talk/portraits/{mum,dad,brother,sister,grandpa,grandma}.png',
              'voiceManifest':'assets/family-album/audio/manifest.json',
              'voiceProvider':'Higgs Audio V3, approved Belinda reference, six exact target sentences',
              'font':'App Outfit from assets/fonts/Outfit-Bold.ttf and Outfit-ExtraBold.ttf',
              'sfx':['assets/playful-foley/place.wav','assets/playful-foley/retry.wav','assets/playful-foley/correct.wav'],
              'sfxLicense':'Kenney CC0; assets/playful-foley/README.md and retained source licenses'},
          'scope':'Complete graphic component kit for this activity; approved character identities and Higgs recordings are reused.'}
    (OUT/'manifest.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{len(graphics)} graphic assets inventoried; {sum(x["bytes"] for x in graphics)} bytes')

if __name__=='__main__':main()
