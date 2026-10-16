"""Toy Catch guidance with the existing offline Higgs/Belinda voice, no provider change."""
from pathlib import Path
import os,json,hashlib,subprocess,re
ROOT=Path(__file__).resolve().parents[1]
CACHE=Path('C:/Users/Admin/.cache/learning-higgs')
OUT=ROOT/'assets/toy-catch/audio'
SCRIPTS={'cars':'Collect seven cars.','balloons':'Collect eight balloons.','robots':'Collect seven robots.','teddies':'Collect eight teddies.','planes':'Collect five planes.','puppets':'Collect six puppets.'}
def main():
    os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
    import torch,soundfile as sf
    from transformers import AutoTokenizer,AutoModelForCausalLM
    from faster_whisper import WhisperModel
    OUT.mkdir(parents=True,exist_ok=True)
    ref=CACHE/'unit3-belinda-reference.wav'
    qa=WhisperModel('base.en',device='cpu',compute_type='int8',download_root=str(CACHE/'whisper'),local_files_only=True)
    model_path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
    tok=AutoTokenizer.from_pretrained(model_path,local_files_only=True)
    model=AutoModelForCausalLM.from_pretrained(model_path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
    model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
    audio,sr=sf.read(ref);codes=model._encode_reference(torch.tensor(audio,dtype=torch.float32),sr).cpu()
    mf=OUT/'manifest.json';clips=json.loads(mf.read_text())['clips'] if mf.exists() else {}
    for i,(key,text) in enumerate(SCRIPTS.items()):
        target=OUT/(key+'.mp3')
        if clips.get(key,{}).get('transcriptMatch') and target.exists():continue
        for attempt in range(3):
            torch.manual_seed(106160+i+100*attempt)
            wav=model.generate_speech(text,tok,reference_codes=codes,reference_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy.",temperature=.5,top_p=.95,top_k=50,max_new_tokens=600)
            raw=CACHE/('toy-catch-'+key+'.wav');sf.write(raw,wav.numpy(),24000)
            subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',str(target)],check=True)
            segments,_=qa.transcribe(str(target),language='en',beam_size=5,condition_on_previous_text=False)
            transcript=' '.join(s.text.strip() for s in segments)
            normalize=lambda v:re.sub('[^a-z]','',v.lower().replace('7','seven').replace('8','eight').replace('5','five').replace('6','six'))
            match=normalize(transcript)==normalize(text)
            if match:break
        clips[key]={'src':target.relative_to(ROOT).as_posix(),'text':text,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'qaTranscript':transcript,'transcriptMatch':match,'duration':round(len(wav)/24000,3),'humanReviewed':False}
        doc={'engine':'Higgs V3 offline','voice':'Existing Unit 3 Belinda reference','referenceSha256':hashlib.sha256(ref.read_bytes()).hexdigest(),'clips':clips,'limits':'Transcript check only; subjective timbre and suitability require listening.'}
        mf.write_text(json.dumps(doc,indent=2),encoding='utf8');(OUT/'clips.js').write_text('window.ToyCatchClips='+json.dumps(doc)+';\n',encoding='utf8')
        print(key+': '+('PASS ' if match else 'REVIEW ')+transcript,flush=True)
        if not match:raise RuntimeError('Guidance transcript mismatch: '+key)
if __name__=='__main__':main()
