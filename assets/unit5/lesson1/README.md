# Unit 5 · Lesson 1 · Feelings

Bộ tài nguyên đã tạo ngày 2026-11-26 cho sáu từ: **happy, sad, hungry, thirsty, hot, cold**.

Mở trang xem thử: http://127.0.0.1:8775/assets/unit5/lesson1/preview.html . Server local dùng thư mục gốc repo; file vào trực tiếp là `preview.html`.

- `backgrounds/v3/`: sáu nền 1536×1024 đang dùng, đã sửa theo ảnh tham chiếu trực tiếp của Unit 3–4: màu tươi, bề mặt rõ và tạo khối nhẹ. Gồm vườn Unit5, phòng khám phá, góc chụp ảnh, Helping Hands, xưởng ghép từ và Little Reporter. PNG gốc và mã/hash ảnh tham chiếu nằm trong `sources/backgrounds-v3/` và `sources/backgrounds-v3.json`. Các phiên bản trước vẫn được giữ để đối chiếu.
- `actors/`: sáu nhân vật, mỗi nhân vật có still, GIF lặp, GIF một lần và sáu frame căn cùng đường tiếp đất. Bổ sung bốn GIF hành động nhận bánh/ăn, uống nước, dùng quạt và quấn chăn, kèm tư thế cuối.
- `props/`: 12 vật thể riêng, gồm đồ ăn, nước, quạt, chăn, máy ảnh, micro, kẹp, kệ, khay, khung, sao và album.
- `glyphs/`, `letters/`, `words/`: 15 chữ thường cần dùng; thẻ chữ rời, nền mảnh, ô nhận, sáu nhãn từ đầy đủ và hai tiền tố câu. Các vị trí ghép nằm trong `manifest.json` → `buildWords`.
- `ui/`: 16 loại điều khiển × 4 trạng thái, icon rời, nền nút dài, khung ảnh và khay chữ.
- `effects/`: sáu hiệu ứng, bản GIF một lần, frame nguồn và bản tĩnh.
- `audio/`: 28 clip Higgs V3/Belinda, chín SFX có nguồn CC0, nhạc nền tùy chọn. `audio/manifest.json` ghi script, hash và mốc từng từ.
- `covers/`: năm ảnh đại diện hoạt động.
- `book-reference/`: giữ riêng sáu hình từ vựng và tranh nhà từ sách; nhân vật mới là hình minh họa bổ sung, không tự nhận là hình sách.
- `sources/`, `SOURCE.md`: bản nguồn, thông tin tạo, prompt, nguồn sách, giấy phép và giới hạn.

Đã kiểm tra kỹ thuật: hash, GIF có các frame khác nhau, đường chân ổn định, font, audio native, sáng từ, mute, suspend, reduced motion, lỗi file và năm chiều rộng. Bằng chứng nằm tại `docs/game-plans/unit5-feelings-assets/evidence/`.

Đã tích hợp Present và bốn giao diện hoạt động vào Unit5 Lesson1 trong app local: http://127.0.0.1:8765/index.html?dev=u5feelings1#/unit/5/lesson/1?mode=practice . Báo cáo gameplay nằm tại `docs/game-plans/unit5-feelings/evidence/`; bộ ảnh/âm thanh vẫn có thể xem riêng bằng preview.html.

Frontend đã được đưa lên GitHub Pages. Worker `toy-buddy-speech` đã cập nhật hỗ trợ câu cảm xúc; tám kiểm tra đầu bằng mẫu Higgs qua AI thật và tám lượt kiểm tra UI ghi âm với mẫu Higgs đều cho phản hồi dự kiến. UI dùng micro giả trong kiểm tra tự động và gửi mẫu Higgs đã duyệt tới dịch vụ thật; không giả lập phản hồi nhận diện. Bằng chứng: `docs/game-plans/unit5-feelings/evidence/live-worker-model-clips.json`, `live-ui.json`, `worker-deployment.json`. Chưa đo độ chính xác với giọng trẻ hay chấm phát âm. Bản cập nhật sáu nền mới được kiểm tra riêng trong `evidence/backgrounds-v2/`.


## Unit5 covers and synchronized game UI — 2026-11-27

Active world banner: `covers/v2/world.webp` (3:1). Active Lesson1 / game covers: `covers/v2/present.webp`, `camera.webp`, `helping.webp`, `workshop.webp`, `reporter.webp` (2:1). All six are original built-in imagegen outputs referenced to the actual Unit4 banner and existing Unit5 child identities. Exact prompts and source/reference hashes: `sources/covers-v2.json`; original PNGs: `sources/covers-v2/`. The older covers remain archived.

Active vector kit: `ui/v2/`, `words/v2/`, `letters/v2/`. These 176 variants change paint only; every original glyph path, viewBox and dimension remains exact. `sources/ui-v2.json` records the color map and both hashes. Native game controls use blue/white surfaces, golden listening/selection, blue continuation/microphone and explicit green success text. They retain touch/keyboard, audio-ended gates, retry, AI and all existing tasks. Export: `py -3.13 tools/export_unit5_covers_ui_v2.py`. Current manifest: 624 records including archives, source files and variants; this is not 624 distinct illustrations.


## Active in-game interface v3 — 2026-11-27

`ui/v3/` contains five original imagegen tactile raster surfaces with true outer alpha and opaque readable centers, plus 16 project-authored 64px interaction glyphs. `sources/ui-v3.json` records exact prompts, generation IDs and source hashes; original PNGs remain in `sources/ui-v3/`. `tools/export_unit5_ui_v3.py` performs encoding only on raster sources and authors native matching SVG controls. Six `words/v3/*-ink.svg` files expose unchanged approved word paths with a tighter viewport, for larger legible word pieces on the new surfaces. Earlier kits remain archived. Current manifest has 656 records including archives/sources/variants.

The game now inherits the global local Fredoka UI font, rather than forcing Outfit everywhere. Outfit remains the plain learning sentence/model type. A compact task/progress strip replaces the redundant large game title; word choices sit beside the task flow before the toolbar, helpers have individual equal prop cards, and the reporter has real recording/processing/result UI. Touch/keyboard/audio/speech/score rules and GIFs are preserved. See the current game plan for measured font sizes, native state checks and publication.
