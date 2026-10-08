"""Generate Higgs phonics audition files. Never mark a phoneme approved by ASR."""
from pathlib import Path
import os, json, hashlib
import build_unit3_lesson2_audio as base

def main():
    os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
    import torch, soundfile as sf
    from transformers import AutoTokenizer, AutoModelForCausalLM
    path='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d'
    out=base.ROOT/'assets/unit3/lesson3/audio/review';out.mkdir(parents=True,exist_ok=True)
    tok=AutoTokenizer.from_pretrained(path,local_files_only=True)
    model=AutoModelForCausalLM.from_pretrained(path,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
    model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
    a,sr=sf.read(base.CACHE/'unit3-belinda-reference.wav');codes=model._encode_reference(torch.tensor(a,dtype=torch.float32),sr).cpu()
    files={}
    for i,(key,text) in enumerate([('hard-g-take-1','Guh.'),('hard-g-take-2','Guh. Guh. Guh.'),('phonics-sequence','G. Guh. Girl. Guitar.')]):
        torch.manual_seed(27000+i)
        wav=model.generate_speech(text,tok,reference_codes=codes,reference_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy.",temperature=.55,top_p=.95,top_k=50,max_new_tokens=650)
        raw=out/(key+'.wav');sf.write(raw,wav.numpy(),24000)
        target=out/(key+'.mp3');base.run(base.FFMPEG,'-v','error','-y','-i',raw,'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','96k',target)
        files[key]={'src':target.relative_to(base.ROOT).as_posix(),'input':text,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'status':'pending-human-phonetics-review','note':'Check hard /g/, no letter-name substitution, and no overlong added vowel. ASR is not phoneme approval.'}
        print(key+' generated for listening review',flush=True)
    (out/'manifest.json').write_text(json.dumps({'engine':'Higgs V3','voice':'Existing Belinda reference','clips':files},indent=2),encoding='utf8')

if __name__=='__main__':main()
