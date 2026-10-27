# Unit 4 Lesson 1 — Family Park rules

Đọc `../../../RULES.md` và `../../GAME_WORKFLOW.md` trước khi triển khai.

- Mục tiêu: trẻ 4–6 tuổi nhận diện, nghe và nói lại `mum`, `dad`, `brother`, `sister`, `grandpa`, `grandma`.
- Phạm vi Lesson 1: `listen, point and repeat`, chant, `point and say` theo trang 32 Class Book. Không dùng `This is my ...` làm đáp án bắt buộc; cấu trúc đó thuộc Lesson 2.
- Giữ tranh sách/nhân vật đã được người dùng cung cấp hoặc cho phép sử dụng. Asset mới chỉ bổ trợ cảnh, UI, VFX và trạng thái; không thay nhân vật sách bằng hình ngẫu nhiên.
- Dùng hai lớp runtime có ranh giới rõ: Rive/PixiJS/GSAP cho Family Park và nhân vật; Phaser/GSAP chỉ cho Family Parade Relay. Không nhúng hai renderer vào cùng một canvas.
- Rive state machine phải có trạng thái `idle`, `listen`, `point`, `correct`, `retry`, `celebrate`; luôn có sprite/cutout tĩnh làm fallback khi runtime không tải.
- PixiJS chỉ sở hữu texture/ticker của cảnh; Phaser phải dừng scene, input, timer và physics khi rời hoạt động. GSAP timeline phải có owner, cancel và reduced-motion path.
- Mỗi lượt chỉ có một nhiệm vụ chính. Vùng chạm tối thiểu 48×48 CSS px; không phụ thuộc hover; hỗ trợ bàn phím/focus.
- Audio mục tiêu phải kết thúc trước khi chuyển lượt. Không chồng voice, chant và SFX; mute/reduced-motion phải có hiệu lực ngay.
- Chọn sai chỉ là cơ hội thử lại: không âm thanh phạt mạnh, không trừ sao, không tuyên bố phát âm sai khi AI không rõ.
- Kiểm tra tại 320, 390, 768, 1024 và 1366 px; dọn listener, audio, texture, ticker, tween và blob khi pause/hidden/leave.
- Ngoài scope: Lesson 2 grammar, thay framework app, thay nhà cung cấp voice, tạo kho điểm riêng hoặc đánh giá phát âm.
