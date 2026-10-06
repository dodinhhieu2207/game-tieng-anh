"""Gentle original game chimes, synthesized offline. No voice or external service."""
from pathlib import Path
import math, struct, wave
ROOT=Path(__file__).resolve().parents[1]/'assets/rewards'
ROOT.mkdir(exist_ok=True)
for name,notes in {'star-earned':[659.25,783.99,1046.5],'lesson-complete':[523.25,659.25,783.99,1046.5],'badge-unlocked':[783.99,1046.5,1318.51],'open-book':[523.25,659.25]}.items():
    samples=[];rate=24000
    for frequency in notes:
        duration=.18
        for i in range(int(rate*duration)):
            t=i/rate; envelope=min(1,t/.015)*math.exp(-t*18)
            samples.append(int(32767*.17*envelope*(math.sin(2*math.pi*frequency*t)+.18*math.sin(4*math.pi*frequency*t))))
    samples.extend([0]*2400)
    with wave.open(str(ROOT/(name+'.wav')),'wb') as out:
        out.setparams((1,2,rate,len(samples),'NONE','not compressed'));out.writeframes(struct.pack('<'+'h'*len(samples),*samples))
print('Built four short original reward chimes at a gentle level.')
