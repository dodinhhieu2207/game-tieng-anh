# Only the new guitar word; existing Letter Land Zira files are preserved.
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
Add-Type -AssemblyName System.Speech
$taskSpeaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$taskWav = Join-Path $env:TEMP 'letter-land-guitar-zira.wav'
try {
    $taskSpeaker.SelectVoice('Microsoft Zira Desktop')
    $taskSpeaker.Rate = 0
    $taskSpeaker.SetOutputToWaveFile($taskWav)
    $taskSpeaker.Speak('Guitar.')
} finally { $taskSpeaker.Dispose() }
& 'D:\VoiceStudioApp\ffmpeg.exe' -v error -y -i $taskWav -ar 44100 -ac 1 -codec:a libmp3lame -b:a 80k (Join-Path $taskRoot 'assets/audio/guitar.mp3')
if ($LASTEXITCODE -ne 0) { throw 'Guitar MP3 encoding failed' }
