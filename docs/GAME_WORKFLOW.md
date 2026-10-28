# Quy trình thiết kế và nâng cấp game học tập

Nguồn quy tắc: yêu cầu người dùng 2026-10-14 và RULES.md, mục 13. Mục tiêu là tạo game có chất lượng hình/chuyển động được kiểm chứng, giảm việc người dùng phải giải thích lại.

## 1. Đề xuất ngắn và lựa chọn stack

Xác định một nhiệm vụ học rõ, nơi đặt game, cách trẻ tương tác, nội dung cũ/mới. Kiểm tra game và Letter Land hiện có trước khi đề xuất. Trình bày 2–3 phương án repo/stack; mỗi phương án có vai trò, ví dụ/tài liệu chính thức, giấy phép, mức thay đổi kiến trúc và đánh đổi. Hỏi một câu gọn để người dùng chọn hoặc giao quyền chọn. Ghi lựa chọn trong plan. Tiếp tục cùng game không hỏi lại.

Không mặc định thêm nhiều thư viện là nâng cấp. Ví dụ: GSAP cho timeline/đường đi/nhịp; PixiJS cho cảnh 2D và sprite/rendering; canvas-confetti chỉ phù hợp phản hồi hạt ngắn, không thay thế một scene engine. Chọn theo nhiệm vụ, số lớp và tương tác thực tế.

## 2. Hồ sơ riêng cho game

Tạo docs/game-plans/<game>/RULES.md và PLAN.md theo TEMPLATE. PLAN phải ghi trạng thái thực tế, nội dung, route/progress key, stack được chọn, skills và trách nhiệm, asset/layer map, audio manifest, storyboard/state flow, kiểm tra và bằng chứng. Không đánh dấu xong bằng dự định hoặc lời gọi hàm.

## 3. Thiết kế trước khi tạo asset

Đối với bài tô/đồ chữ mới hoặc nâng cấp: dùng chữ rỗng có viền nằm trong ô; trẻ tô kín lòng chữ như tô màu. Không dùng nét đứt, chấm bắt đầu, mũi tên hoặc bắt thứ tự nét mặc định. Mask mực thực trong lòng chữ, đo diện tích đã tô từ cùng hình học; Undo/Clear/nhấc tay tiếp tục, demo không tiến trình, Next letter do trẻ bấm. Chỉ bật kiểm tra quy trình viết nếu người dùng yêu cầu riêng. Đính chính này thay thế tiêu chuẩn đồ theo nét đã ghi trước đó.

Yêu cầu bắt buộc 2026-10-27: mỗi game có bộ asset tương ứng đã tạo và gắn; font theo App Outfit/`var(--app-font)` của app; mọi voice mới dùng Higgs TTS, dùng lại clip Higgs đã duyệt khi phù hợp. Áp dụng chi tiết RULES.md mục 15. Banner Unit/Lesson không thay bộ asset tương tác bên trong game. Kiểm tra ba hạng mục riêng trước khi đánh dấu hoàn thành.

Art direction phải có bảng màu, chất liệu/độ bóng, kích thước hình/chữ, vị trí nhiệm vụ và phản hồi. Storyboard gồm ít nhất: nghe, chờ chọn, đang chọn, đúng, thử lại, lỗi audio, kết thúc, reduced motion. Một màn hình có một nhiệm vụ chính.

Lập asset inventory: hình từ vựng được duyệt, lớp cảnh, từng bộ phận chuyển động, UI controls, VFX và nguồn/giấy phép. Dùng imagegen cho raster mới; giữ asset trong repo, kiểm tra alpha, tỷ lệ, vùng trống và cắt sprite đúng. Không thay hình từ vựng đã học bằng hình AI mới.

## 4. Dựng bằng stack đã chọn

Giữ shell, routing, progress và audio của app. Nếu dùng PixiJS, scene đặt trong màn chơi hiện có; chữ/controls chính vẫn phải đọc rõ, có bàn phím và nhãn. Chỉ thay renderer/framework của toàn app khi người dùng yêu cầu. Pin phiên bản đã kiểm tra tương thích; ghi provenance/license; ưu tiên local runtime và giải pháp dùng được khi file/CDN không tải.

GSAP timeline phải có owner, điểm kết thúc, pause/cancel và reduced-motion path. PixiJS phải dọn ticker/listener/scene khi rời hoạt động, chỉ hủy texture do game sở hữu. Âm thanh và điểm nằm ngoài quyết định animation; câu đọc kết thúc mới chuyển hành động/lượt.

## 5. Skill map và self-review

- frontend-design: art direction, hierarchy, layout, typography và style app trẻ.
- interaction-design: trigger, state, feedback, pacing, gesture, lỗi và reduced motion.
- imagegen: raster asset mới/tách lớp phù hợp phong cách.
- design-critique: xem scene và video, chỉ ra lỗi thật, sửa trước bàn giao.
- engineering:debug/testing-strategy/deploy-checklist: dùng theo vấn đề và scope, không thêm nghi thức hoặc kiểm tra không liên quan.
- greensock/gsap-skills: tham khảo skill chính thức cho API/timeline khi cần; ghi nguồn và tình trạng cài đặt thực tế.

Đọc skill được dùng theo catalog trong phiên; không chỉ ghi tên. Rules hoặc prompt người dùng mới ưu tiên hơn guideline của skill.

## 6. Các cổng chất lượng

1. Nội dung: âm mục tiêu đúng, hình/từ quen thuộc, không có hai đáp án cùng đúng bị chấm một đáp án sai.
2. Thị giác: nhiệm vụ rõ, hình đủ lớn, chữ không co nhỏ, không bị che, art direction nhất quán.
3. Motion: có lý do cho từng chuyển động; trình tự/bộ phận/phản hồi phù hợp; không rung/phóng sticker liên tục, không hạt che đáp án. Xem đoạn quay ở tốc độ thật.
4. Runtime: audio không chồng, cleanup, lỗi/retry, click nhanh, mute, reduced motion, touch/keyboard, performance kiểm tra ở thiết bị/viewport được nêu rõ.
5. Delivery: giữ route/key, sao tốt nhất/learner, kiểm tra năm độ rộng, kiểm tra public files và chạy game ở bản công khai sau deploy.

Không dùng screenshot hoặc test mock để kết luận animation tốt hay trẻ đã thành thạo. Báo giới hạn và cập nhật plan.

## Nguồn nền tảng

- https://github.com/greensock/GSAP
- https://github.com/greensock/gsap-skills
- https://gsap.com/docs/v3/GSAP/gsap.timeline()/
- https://gsap.com/docs/v3/Plugins/MotionPathPlugin/
- https://github.com/pixijs/pixijs
- https://pixijs.com/
- https://github.com/catdad/canvas-confetti
