import hashlib
import json
import subprocess
import wave
from pathlib import Path

dest = Path('assets/unit4-numbers/lift-audio')
cues = [
    ('depart', 'doorClose_000.ogg', 'atrim=duration=0.53,highpass=f=100,lowpass=f=4000,loudnorm=I=-21:TP=-4:LRA=7,afade=t=in:d=0.01,afade=t=out:st=0.45:d=0.08'),
    ('open', 'doorOpen_000.ogg', 'atempo=0.75,highpass=f=100,lowpass=f=3500,loudnorm=I=-21:TP=-4:LRA=7,afade=t=in:d=0.01,afade=t=out:st=0.63:d=0.08'),
    ('motor', 'engineCircular_000.ogg', 'atrim=duration=5,highpass=f=90,lowpass=f=1800,loudnorm=I=-21:TP=-6:LRA=7,afade=t=in:d=0.05,afade=t=out:st=4.94:d=0.06'),
]
manifest = {'source': 'Kenney Sci-fi Sounds', 'sourceURL': 'https://kenney.nl/assets/sci-fi-sounds', 'license': 'CC0-1.0', 'clips': {}}
for name, source, filters in cues:
    output = dest / (name + '.wav')
    subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe', '-y', '-i', str(dest / 'sources' / source), '-af', filters, '-ar', '22050', '-ac', '1', str(output), '-loglevel', 'error'], check=True)
    with wave.open(str(output)) as audio:
        duration = audio.getnframes() / audio.getframerate()
    manifest['clips'][name] = {'sourceFile': source, 'processing': filters, 'duration': duration, 'gain': 0.18 if name == 'motor' else 0.38, 'loop': name == 'motor', 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()}
(dest / 'manifest.json').write_text(json.dumps(manifest, indent=2))
subprocess.run(['D:/VoiceStudioApp/ffmpeg.exe', '-y', '-i', str(dest / 'depart.wav'), '-i', str(dest / 'motor.wav'), '-i', str(dest / 'open.wav'), '-filter_complex', '[0:a]volume=0.38[d];[1:a]atrim=duration=1.7,volume=0.18[m];[2:a]volume=0.38,adelay=1700[o];[d][m][o]amix=inputs=3:duration=longest:normalize=0[out]', '-map', '[out]', '-ac', '1', '-ar', '22050', str(dest / 'preview.wav'), '-loglevel', 'error'], check=True)
