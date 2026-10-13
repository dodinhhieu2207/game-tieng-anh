# Compatibility entry point. Guitar must use the original Letter Land bank as a Higgs reference.
$ErrorActionPreference = 'Stop'
& 'C:\Users\Admin\.cache\learning-higgs\.venv\Scripts\python.exe' (Join-Path $PSScriptRoot 'build_letter_guitar_higgs.py')
if ($LASTEXITCODE -ne 0) { throw 'Higgs Letter Land guitar build failed' }
