# Sound Garden — plan triển khai

Trạng thái: đã chốt stack; chưa tạo asset hoặc triển khai gameplay mới.
Ngày: 2026-10-14.
Lựa chọn trực tiếp của người dùng: "GSAP + PixiJS — cảnh 2D nhiều lớp và hiệu ứng sâu hơn". Tiếp tục theo lựa chọn này, không hỏi lại stack.

## Scope

Nâng Unit 3 Lesson 3 Sound Detective thành Sound Garden. Giữ u3ggsound / sound-detective / 3/3/sound-detective. Meet Letter Gg giữ trình tự tên G → âm /g/ → girl/guitar; không thay các hoạt động Gg còn lại.

Tám lượt: hai warm-up nghe từ/chọn đúng hình girl rồi guitar; sáu lượt phân biệt âm mục tiêu A, B, C, D, G, G. Cặp minh họa: apple–girl, boy–guitar, cat–girl, duck–guitar, girl–car, guitar–dog. Luân phiên Annie/bat/car/dog và vị trí qua lượt chơi lại. Không đặt hai từ cùng âm mục tiêu rồi chấm một từ sai.

## Repo và trách nhiệm

- GSAP chính thức: https://github.com/greensock/GSAP . Bản 3.15.0 đã có local trong shared/vendor/gsap; xác minh tương thích khi gắn Pixi scene. Timeline dùng lớp LearningMotion hiện có, bổ sung adapter cho object properties nếu cần, giữ cleanup. License/provenance đã ở thư mục vendor.
- PixiJS chính thức: https://github.com/pixijs/pixijs ; https://pixijs.com/ . Dự kiến scene 2D/sprites/ticker/texture. Chưa chọn phiên bản và chưa cài: đọc tài liệu/release/license, kiểm tra với GSAP và browser mục tiêu trước khi pin local runtime.
- GSAP skills chính thức: https://github.com/greensock/gsap-skills . Tham khảo API/timeline; đây là nguồn tham khảo ngoài, chưa cài vào catalog.
- Canvas-confetti không thuộc stack người dùng chọn; chỉ xem lại nếu có nhu cầu khác được thống nhất, không tự thêm.

## Skill map

- frontend-design: art direction mềm, màu/typography/layout/hierarchy phù hợp trẻ.
- interaction-design: state nghe/chọn/đúng/thử lại/lỗi; nhịp mở từng cánh; GSAP/Pixi lifecycle.
- imagegen: asset raster mới có các phần/lớp; giữ hình từ vựng đã học.
- design-critique: đánh giá scene và video, sửa nhựa/thô/lặp/che nội dung.
- engineering:debug/testing-strategy/deploy-checklist: dùng theo lỗi và kiểm tra thực tế.
- engineering:documentation: đã dùng để viết hồ sơ/quy trình trong bước này.

Các skill tạo game phía trên là dự kiến cho giai đoạn triển khai; phải đọc theo catalog và ghi checkpoint khi dùng thực sự. Việc thêm skill/repo không thay thế review sản phẩm.

## Storyboard / layer map

Cảnh vườn: background nhẹ; lớp đất tám ô; hai nụ hoa lớn chứa ảnh; ong hướng nghe; DOM câu nhiệm vụ/nút nghe/tiếp tục; vườn tiến trình trong scene. Ưu tiên sprite/layer ít nhưng có vai trò.

Asset mới: nền, ô đất, stem/leaves, bud, cánh trước/sau, nhụy, ong/thân/cánh/pose, hạt và giỏ. Ảnh vocabulary lấy data Letter Land. Khi đúng: từ được đọc xong → ong tới → từng cánh mở → hạt trồng vào một ô → cây mọc. Khi thử lại: ong về nút nghe, nụ giữ nguyên; không âm báo nặng hoặc rung cả scene. Kết thúc: vườn đủ tám ô và sao trên cùng màn hình.

## Bước thực hiện

- [x] Ghi mục tiêu A–D/G và lựa chọn GSAP + PixiJS.
- [x] Tạo rules/plan riêng và quy trình chung.
- [ ] Đọc engine Sound Detective cũ, chốt điểm/assistance/key trước khi đổi.
- [ ] Audit audio tên/âm/từ A–D/G; ghi rõ clip đã có, clip đúng/chưa xác nhận, không tự đổi giọng.
- [ ] Kiểm tra PixiJS version/license và tích hợp nhỏ với GSAP; pin local runtime.
- [ ] Art direction + storyboard; tạo/inventory asset tách lớp và kiểm tra alpha/tỷ lệ.
- [ ] Dựng scene Pixi trong shell; DOM controls có focus/keyboard.
- [ ] Timeline nghe/nở/trồng + VFX/SFX + mute/reduced motion/cleanup.
- [ ] Tám lượt, shuffle, no ambiguous answers, retry/errors và progress.
- [ ] Test thực tế năm độ rộng; audio-ended, input nhanh/touch/keyboard, lifecycle, performance được đo rõ.
- [ ] Quay tốc độ thật; self-review theo design-critique và sửa trước bàn giao.
- [ ] Deploy và xác nhận bản công khai trong scope người dùng đã yêu cầu.

## Giới hạn hiện tại

Chưa có asset mới, chưa audit audio, chưa chọn bản PixiJS, chưa thay gameplay. Chưa có bằng chứng scene/motion/performance. Đây là plan đã chốt hướng, không phải báo cáo game hoàn thành.
