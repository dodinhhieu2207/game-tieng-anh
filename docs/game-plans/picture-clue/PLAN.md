# Picture Clue Challenge

Listen & Find marker refinement: align the nine markers to character torsos in the original panels. A 34 px visible badge sits inside a 48 px hit area.

Lesson 6 web integration: Picture Clue Challenge now plays the matching introductions from the teacher-supplied MP3. It shares the original scans, native audio controls and playback lifecycle with three separate activities: Listen & Find, Story Order & Tell and Roleplay Stage. The existing DOM/CSS stack, activity catalogue and app progress events are used. Learners can tap picture options, place story cards by drag or tap, and take the introduction role with a line/model on request. Motion uses the existing picture reveal and short highlight states. This integration presents the four original story panels and uses no character GIF. Refer to the audio source and cut manifest for alignment evidence.

Artwork revision: extracted the embedded 1536 × 1936 scan directly from the source PDF. Cropped each panel, resampled with Lanczos, applied mild luminance sharpening, and exported lossless WebP. The character artwork uses the source scan pixels with no generative redraw.

Unit 4 Lesson 6, route picture-clue, activity key u4pictureclue. The initial implementation uses the existing HTML activity shell, CSS and App Outfit. The interaction is based on the observed placement of visual clues next to the active task in Academoo Secret Sentences.

Three speaking turns use all four story panels. Grandpa and mum are revealed by zooming out. The costume panel leads to the brother reveal in the following panel. Learners say a prediction, reveal the scene, and practise the complete sentence.

Artwork comes from Family and Friends Starter Class Book, second edition, printed page 37, PDF page 38, supplied locally. The frame and controls use CSS. Character animation and dedicated roleplay sprites remain outside this release.
