"""Build static Higgs dialogue and waveform-derived mouth cues; never used in the browser."""
from pathlib import Path
import argparse, hashlib, json, os, subprocess, time, urllib.request, zipfile

ROOT=Path(__file__).resolve().parents[1]
CACHE=Path('C:/Users/Admin/.cache/learning-higgs')
OUT=ROOT/'assets/unit3/lesson2/audio'
TEXTS={
    **{f'questions/is_it_a_{w}':f'Is it a {w}?' for w in ['plane','puppet','robot','balloon','teddy']},
    'questions/whats_this':"What's this?",'questions/what_color':'What color is it?',
    'questions/how_many':'How many?',
    'answers/yes_it_is':'Yes, it is.','answers/no_it_isnt':"No, it isn't.",
    'feedback/your_turn':'Your turn!','feedback/excellent':'Excellent!',
    'feedback/great_job':'Great job!','feedback/try_again':'Try again.',
    'feedback/look_again':'Look again. Try again.',
    'feedback/say_the_whole_sentence':'Good! Say the whole sentence.',
    'feedback/i_couldnt_hear_you':"I couldn't hear you. Try again.",
    'feedback/tap_the_microphone':'Tap the microphone.',
    'feedback/listen':'Listen.','feedback/look':'Look.','feedback/choose':'Choose.',
    'feedback/well_done':'Well done!','feedback/listen_and_choose':'Listen and choose.',
    'feedback/build_sentence':'Build the sentence.','feedback/listen_again':'Listen again.'
}
FFMPEG=Path('D:/VoiceStudioApp/ffmpeg.exe')
SHAPES={'A':21,'B':15,'C':4,'D':2,'E':9,'F':7,'G':16,'H':19,'X':0}

def run(*args):
    return subprocess.run([str(x) for x in args],check=True,capture_output=True,text=True).stdout

def rhubarb():
    exe=CACHE/'rhubarb/Rhubarb-Lip-Sync-1.14.0-Windows/rhubarb.exe'
    if not exe.exists():
        url='https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.14.0/Rhubarb-Lip-Sync-1.14.0-Windows.zip'
        archive=CACHE/'rhubarb.zip';urllib.request.urlretrieve(url,archive)
        with zipfile.ZipFile(archive) as z:z.extractall(CACHE/'rhubarb')
    return exe

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--model',default='D:/AI_Models/HF_Cache/hub/models--multimodalart--higgs-audio-v3-tts-4b-transformers/snapshots/30f01593ee6a12efa586c92455afe4b76e45095d')
    parser.add_argument('--rebuild',action='store_true');args=parser.parse_args()
    os.environ['HF_HOME']='D:/AI_Models/HF_Cache';os.environ['HF_HUB_OFFLINE']='1'
    import numpy as np
    import soundfile as sf
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    CACHE.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
    # Clone the already accepted Belinda files, instead of choosing a different voice.
    ref=CACHE/'unit3-belinda-reference.wav'
    parts=[]
    for w in ['plane','puppet','robot','balloon','teddy']:
        raw=run(FFMPEG,'-v','error','-y','-i',ROOT/f'assets/unit3/audio/its_a_{w}.mp3','-ar','24000','-ac','1',CACHE/f'ref-{w}.wav')
        a,sr=sf.read(CACHE/f'ref-{w}.wav');parts.extend([a,np.zeros(2400)])
    sf.write(ref,np.concatenate(parts),24000)
    ref_audio,sr=sf.read(ref);ref_text="It's a plane. It's a puppet. It's a robot. It's a balloon. It's a teddy."
    model=None;tokenizer=None;entries={};mouth_tool=rhubarb()
    for index,(key,text) in enumerate(TEXTS.items()):
        target=OUT/(key+'.mp3');target.parent.mkdir(parents=True,exist_ok=True)
        raw=CACHE/(key.replace('/','_')+'.wav');norm=CACHE/(key.replace('/','_')+'-norm.wav')
        if args.rebuild or not target.exists():
            if model is None:
                print('Loading cached Higgs V3 model and accepted Unit 3 Belinda reference…',flush=True)
                tokenizer=AutoTokenizer.from_pretrained(args.model,local_files_only=True)
                model=AutoModelForCausalLM.from_pretrained(args.model,trust_remote_code=True,dtype=torch.bfloat16,local_files_only=True).to('cuda').eval()
                model.config.audio_tokenizer_id='D:/AI_Models/HF_Cache/hub/models--bosonai--higgs-audio-v2-tokenizer/snapshots/403fbacf2f60caaa102f893fdfabb694619b2417'
                reference_codes=model._encode_reference(torch.tensor(ref_audio,dtype=torch.float32),sr).cpu()
            torch.manual_seed(12345+index)
            started=time.time()
            wav=model.generate_speech(text,tokenizer,reference_codes=reference_codes,reference_text=ref_text,temperature=.65,top_p=.95,top_k=50,max_new_tokens=650)
            if wav.numel()<2400 or wav.numel()>24000*12:raise RuntimeError('Invalid generated length: '+key)
            sf.write(raw,wav.numpy(),24000)
            run(FFMPEG,'-v','error','-y','-i',raw,'-af','loudnorm=I=-18:TP=-1.5:LRA=7','-ar','24000','-ac','1',norm)
            run(FFMPEG,'-v','error','-y','-i',norm,'-codec:a','libmp3lame','-b:a','96k',target)
            print(f'Generated {key} ({time.time()-started:.1f}s)',flush=True)
        # Mouth timings are analysed from the final MP3 waveform, including encoder delay.
        run(FFMPEG,'-v','error','-y','-i',target,'-ar','24000','-ac','1',norm)
        dialog=CACHE/'dialog.txt';dialog.write_text(text,encoding='utf8')
        cues_path=CACHE/'mouth.json'
        run(mouth_tool,'-f','json','-d',dialog,'-o',cues_path,norm)
        cues=json.loads(cues_path.read_text())['mouthCues']
        a,sr=sf.read(norm)
        entries[key]={'src':'assets/unit3/lesson2/audio/'+key+'.mp3','text':text,'duration':round(len(a)/sr,3),
                      'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
                      'cues':[{'id':SHAPES[c['value']],'ms':round(c['start']*1000)} for c in cues]}
        print('Mouth cues: '+key,flush=True)
    manifest={'version':'20261005-l2','engine':'Higgs Audio V3, cached local weights','voice':'Belinda (reference from existing accepted Unit 3 recordings)',
              'referenceText':ref_text,'normalization':'FFmpeg loudnorm I=-18, TP=-1.5, LRA=7','lipSync':'Rhubarb 1.14 waveform + transcript analysis','clips':entries}
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
    (OUT/'clips.js').write_text('window.Unit3Lesson2Clips='+json.dumps(manifest)+';\n',encoding='utf8')
    print(f'DONE: {len(entries)} static Higgs clips; no browser TTS.',flush=True)
    import sys
    run(sys.executable,ROOT/'tools/reuse_toy_name_audio.py')

if __name__=='__main__':main()
