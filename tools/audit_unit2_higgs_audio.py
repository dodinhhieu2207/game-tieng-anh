"""Audit final catalogue metadata and independently check short phonics waveforms."""
from pathlib import Path
import json,hashlib,re
import numpy as np,soundfile as sf
from scipy.linalg import solve_toeplitz
from scipy.signal import lfilter
from build_unit2_higgs_audio import qa_norm
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/unit2/audio-higgs'
def acceptable(text):return qa_norm(text).replace('practise','practice').replace('note book','notebook')
def main():
 doc=json.loads((OUT/'manifest.json').read_text(encoding='utf8'));clips=doc['clips'];fail=[]
 # This unused phrase is not requested by any current game; do not ship a failed take.
 clips.pop('lowercase f',None)
 for key,c in clips.items():
  if key not in ['eh','fff']:c['transcriptMatch']=acceptable(c.get('qaTranscript',''))==acceptable(c['text'])
  a,sr=sf.read(ROOT/c['src']);c['duration']=round(len(a)/sr,3);c['sha256']=hashlib.sha256((ROOT/c['src']).read_bytes()).hexdigest()
  if key in ['e','eh','fff']:
   rows=[]
   for i in range(0,len(a)-600,240):
    x=a[i:i+600]
    if np.sqrt(np.mean(x*x))<.03:continue
    spec=np.abs(np.fft.rfft(x*np.hanning(len(x))))**2;hf=float(spec[np.fft.rfftfreq(len(x),1/sr)>2500].sum()/spec.sum())
    x=lfilter([1,-.97],[1],x)*np.hanning(len(x));r=np.correlate(x,x,'full')[len(x)-1:]
    roots=np.roots(np.r_[1,-solve_toeplitz(r[:20],r[1:21])]);poles=[(np.angle(z)*sr/(2*np.pi),-sr/np.pi*np.log(abs(z))) for z in roots if np.imag(z)>0]
    f=sorted(freq for freq,bw in poles if 250<freq<4000 and 0<bw<500);rows.append((hf,f[:2]))
   c['acoustics']={'highFrequencyFraction':round(float(np.median([r[0] for r in rows])),3),'formantsMedian':np.median([r[1] for r in rows if len(r[1])==2],axis=0).tolist()}
 for key in ['eh','fff']:
  c=clips[key];c['phonicsAcousticCheck']=c['acoustics']['highFrequencyFraction']>.65 if key=='fff' else c['acoustics']['formantsMedian'][0]>clips['e']['acoustics']['formantsMedian'][0]*1.5
  c['phonicsReviewRequired']=False;c['qaNote']='Acoustic distinction from letter name; not a human listening approval.'
 for key,c in clips.items():
  if not(c.get('transcriptMatch') or c.get('phonicsAcousticCheck')):fail.append((key,c.get('qaTranscript')))
 (OUT/'manifest.json').write_text(json.dumps(doc,indent=2),encoding='utf8');(OUT/'clips.js').write_text('window.Unit2HiggsClips='+json.dumps(doc)+';\n',encoding='utf8')
 (OUT/'qa-summary.json').write_text(json.dumps({'clips':len(clips),'failed':fail,'phonics':{k:clips[k]['acoustics'] for k in ['e','eh','fff']}},indent=2),encoding='utf8')
 print('FINAL QA',len(clips),'clips; failures:',fail,flush=True)
 if fail:raise SystemExit(1)
if __name__=='__main__':main()
