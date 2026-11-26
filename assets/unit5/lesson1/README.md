# Unit 5 · Lesson 1 · Feelings

Bộ tài nguyên đã tạo ngày 2026-11-26 cho sáu từ: **happy, sad, hungry, thirsty, hot, cold**.

Mở trang xem thử: http://127.0.0.1:8775/assets/unit5/lesson1/preview.html . Server local dùng thư mục gốc repo; file vào trực tiếp là `preview.html`.

- `backgrounds/`: bốn cảnh trống đồng bộ cho Present, xưởng ảnh, Helping Hands và góc luyện nói.
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

Giới hạn: phần chấm nội dung nói cho bài mới cần đăng nhập Cloudflare để cập nhật Worker; kiểm tra UI nói dùng phản hồi ASR mô phỏng, không tự nhận là chấm live. Chưa triển khai frontend lên GitHub Pages; nghe duyệt sắc thái giọng và hiệu quả học tập thực tế chưa được xác nhận.
