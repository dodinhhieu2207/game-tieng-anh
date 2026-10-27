"""Finite Higgs V3 catalogue for three approved family activities."""
import json
import sys
import hashlib
import build_unit4_lesson1_audio as build
build.OUT = build.ROOT / 'assets/family-classroom/audio'
build.TEXTS = {
 'switch-intro': 'Look at the family. Who is missing?',
 'look': 'Look carefully. Remember the family.',
 'missing': 'Who is missing?',
 'curtain': 'Close the curtain!',
 'found': 'There you are! Well done!',
 'trace-intro': 'Listen. Then trace the word.',
 'trace-again': 'Start at the dot. Follow the line.',
 'trace-done': 'Lovely tracing! Say the word.',
 'write-intro': 'Look at the word. Now try writing it.',
 'colour-intro': 'Choose a colour. Make your family picture.',
 'art-done': 'Your picture is ready! What a lovely family!',
 'all-done': 'Wonderful work! You practised all six words.',
}
def checked(key, text):
 def canonical(s):
  return build.norm(s.lower().replace('colour','color').replace('practised','practiced'))
 return canonical(build.TEXTS[key]) == canonical(text)
if __name__ == '__main__':
 build.transcript_ok = checked
 if '--audit-existing' in sys.argv:
  from faster_whisper import WhisperModel
  import soundfile as sf
  qa = WhisperModel('base.en', device='cpu', compute_type='int8', download_root=str(build.CACHE/'whisper'),local_files_only=True)
  clips = {}
  for key, text in build.TEXTS.items():
   target = build.OUT/(key+'.mp3')
   segments, _ = qa.transcribe(str(target), language='en', beam_size=5, condition_on_previous_text=False)
   transcript = ' '.join(s.text.strip() for s in segments)
   assert checked(key, transcript), (key,transcript)
   decoded = build.CACHE/'family-classroom-audit.wav'
   build.run(build.FFMPEG,'-v','error','-y','-i',target,'-ar','24000','-ac','1',decoded)
   audio, rate = sf.read(decoded)
   clips[key] = {'src':target.relative_to(build.ROOT).as_posix(),'text':text,'duration':round(len(audio)/rate,3),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'qaTranscript':transcript,'transcriptMatch':True,'humanReviewed':False}
   print(key, 'PASS', transcript, flush=True)
  data = {'engine':'Higgs Audio V3, cached local weights','voice':'Belinda reference from existing accepted Unit 3 recordings','referenceSha256':hashlib.sha256((build.CACHE/'unit3-belinda-reference.wav').read_bytes()).hexdigest(),'normalization':'FFmpeg loudnorm I=-18, TP=-1.5, LRA=7','clips':clips}
  (build.OUT/'manifest.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
 else:
  build.main()
 path = build.OUT / 'manifest.json'
 data = json.loads(path.read_text(encoding='utf-8'))
 data['version'] = '20261027-family-classroom1'
 data['limits'] = 'ASR text QA only; new clips humanReviewed=false. No voice quality or child learning claim.'
 path.write_text(json.dumps(data, indent=2), encoding='utf-8')
 (build.OUT/'clips.js').write_text('window.FamilyClassroomClips='+json.dumps(data)+';\n', encoding='utf-8')
