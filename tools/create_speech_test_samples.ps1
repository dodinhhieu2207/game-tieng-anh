# Synthetic INPUT test clips only; does not change the website's Higgs output audio.
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$taskTestRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\tests'))
foreach($taskWord in @('Yes','No')){
 $taskSpeaker=New-Object System.Speech.Synthesis.SpeechSynthesizer
 try{$taskSpeaker.SelectVoice('Microsoft Zira Desktop');$taskSpeaker.SetOutputToWaveFile((Join-Path $taskTestRoot ('speech-only-'+$taskWord.ToLower()+'.wav')));$taskSpeaker.Speak($taskWord+'.')}
 finally{$taskSpeaker.Dispose()}
}
