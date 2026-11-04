"""Audition-only /dʒ/ crops from existing Higgs words, never automatic approval."""
from pathlib import Path
import subprocess,json,hashlib,wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/magic-jug/audio/review'
FFMPEG=Path('D:/VoiceStudioApp/ffmpeg.exe')
SR=24000

def wav(path,a):
 with wave.open(str(path),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
def load(path):
 with wave.open(str(path)) as w:return np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768

def main():
 OUT.mkdir(parents=True,exist_ok=True);rows=[]
 for n,(word,start,end) in enumerate([('jug',.040,.205),('juice',.040,.225)],1):
  src=ROOT/f'assets/magic-jug/audio/{word}.mp3';decoded=OUT/f'{word}-source.wav'
  subprocess.run([str(FFMPEG),'-v','error','-y','-i',str(src),'-ar',str(SR),'-ac','1',str(decoded)],check=True)
  audio=load(decoded);part=audio[round(start*SR):round(end*SR)].copy()
  # Preserve stop/voicing/frication. Only a 3ms end fade; no resampling/time stretch/pitch change.
  fade=round(.003*SR);part[-fade:]*=np.linspace(1,0,fade);part*=min(1.5,.88/max(abs(part).max(),1e-6))
  unit=np.r_[np.zeros(round(.12*SR)),part,np.zeros(round(.45*SR))]
  single=OUT/f'sound-j-take-{n}-single.wav';preview=OUT/f'sound-j-take-{n}.wav'
  wav(single,unit);wav(preview,np.tile(unit,3))
  context=OUT/f'sound-j-take-{n}-context.wav'
  wav(context,np.r_[unit,np.zeros(round(.25*SR)),audio,np.zeros(round(.5*SR)),load(OUT/'juice-source.wav') if word=='juice' else audio])
  rows.append({'take':n,'source':src.relative_to(ROOT).as_posix(),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'startSeconds':start,'endSeconds':end,'phoneticTarget':'/dʒ/','preview':preview.relative_to(ROOT).as_posix(),'single':single.relative_to(ROOT).as_posix(),'context':context.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(preview.read_bytes()).hexdigest(),'duration':len(unit)*3/SR,'processing':'native 24kHz crop, max +3.52dB gain, 3ms end fade, silence padding; no time stretch/pitch change','humanReviewed':False,'status':'awaiting-user-phonetics-listening','validation':'Source words Higgs V3, ASR text checked. Closure/voicing and high-frequency frication before vowel transition inspected as a trimming aid only; not a phonetic accuracy certification.'})
 (OUT/'manifest.json').write_text(json.dumps({'engine':'derived from existing Higgs Audio V3 words','letterNameIPA':'/dʒeɪ/','targetSoundIPA':'/dʒ/','notTarget':'/j/ (as in yes)','approved':False,'clips':rows,'references':['https://dictionary.cambridge.org/pronunciation/english/jug','https://downloads.bbc.co.uk/worldservice/learningenglish/pronunciation/pdf/sounds/sounds_chart.pdf']},indent=2),encoding='utf-8')
 print('Created two Higgs-derived consonant auditions. Neither approved or active in child route.')
if __name__=='__main__':main()
