# Ellie Speech Backend — Phase 6B

This backend supports real pronunciation assessment through Azure Speech and automatically falls back to transcript scoring when Azure is not configured or temporarily unavailable.

## What the endpoint returns

- `provider: azure-pronunciation` means the WAV recording received real pronunciation assessment.
- `provider: phase6b-fallback` means the answer was scored from browser transcript alternatives.
- Real assessment includes overall pronunciation, accuracy, fluency, completeness, prosody, and per-word results.
- The endpoint never stores audio or transcript data.

## Local test

```powershell
npm test
npm start
```

The endpoint is `http://127.0.0.1:8787/api/speech-score`.

Without Azure variables, the endpoint runs safely in fallback mode. To enable real assessment, set these server-side environment variables before starting:

```text
AZURE_SPEECH_KEY=your server-side Speech resource key
AZURE_SPEECH_REGION=eastus
ALLOWED_ORIGINS=https://YOUR-GITHUB-NAME.github.io
```

Alternatively, use `AZURE_SPEECH_ENDPOINT` instead of `AZURE_SPEECH_REGION` when the Speech resource provides a custom endpoint.

Never put `AZURE_SPEECH_KEY` in `index.html`, GitHub Pages, a public repository, or Teacher settings.

## Vercel deployment

1. Import this folder as a separate Vercel project.
2. Add `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`, and `ALLOWED_ORIGINS` under Vercel project environment variables.
3. Deploy and copy the HTTPS URL ending in `/api/speech-score`.
4. Paste that URL into the game's Teacher settings and select **Phase 6B pronunciation backend**.
5. Choose **Test backend**. The status must say that real Azure pronunciation scoring is configured.

GitHub Pages hosts only the static frontend. It cannot execute this backend.

## Input and privacy

- The frontend records a short mono PCM WAV clip at 16 kHz.
- Requests larger than the configured safety limit are rejected.
- Requests and responses use `Cache-Control: no-store`.
- The backend processes the clip in memory and does not write it to disk.
- Provider failures return a safe fallback result so a child can continue practising.
