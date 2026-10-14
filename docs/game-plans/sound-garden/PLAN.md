# Sound Garden — plan triển khai

Trạng thái: gameplay/asset hoàn thành; local QA PASS, chờ xác nhận bản công khai.
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
- [x] Đọc engine Sound Detective cũ, chốt điểm/assistance/key trước khi đổi.
- [x] Audit audio tên/âm/từ A–D/G; ghi rõ clip đã có, clip đúng/chưa xác nhận, không tự đổi giọng.
- [x] Kiểm tra PixiJS version/license và tích hợp nhỏ với GSAP; pin local runtime.
- [x] Art direction + storyboard; tạo/inventory asset tách lớp và kiểm tra alpha/tỷ lệ.
- [x] Dựng scene Pixi trong shell; DOM controls có focus/keyboard.
- [x] Timeline nghe/nở/trồng + VFX/SFX + mute/reduced motion/cleanup.
- [x] Tám lượt, shuffle, no ambiguous answers, retry/errors và progress.
- [x] Test thực tế năm độ rộng; audio-ended, input nhanh/touch/keyboard, lifecycle, performance được đo rõ.
- [x] Quay tốc độ thật; self-review theo design-critique và sửa trước bàn giao.
- [ ] Deploy và xác nhận bản công khai trong scope người dùng đã yêu cầu.

## Kết quả triển khai / giới hạn

PixiJS 8.22.0 (MIT) tải theo game; GSAP 3.15.0 điều khiển sprite points/scales/rotations và đường bay. Chín sprite WebP mới từ imagegen; background/vocabulary giữ asset đã duyệt. Art direction: cream #F9F5DF, teal #234E50, leaf #367648, petal pink, honey #EAA51B; font app hiện có; hai hình lớn cân đối, phản hồi lời/hoa và vườn tám ô.

Rubric giữ game cũ: 0 lần sai → 3 sao; 1–3 lần → 2 sao; nhiều hơn → 1 sao. Lỗi audio/scene không tính sai. Dùng event chung và key cũ; best score không giảm. Không có chấm phát âm trong Sound Garden.

Audio audit: file/hash trong assets/sound-garden/audio-manifest.json. A–D và word clips giữ Letter Land. G sound dùng Higgs take 1 đã human-reviewed ở Lesson 3. File name không phải bằng chứng chất lượng âm; chưa đánh giá lại phát âm A–D bằng học sinh thật.

Local QA: sound-garden.spec.cjs; sound-garden-failures.cjs; sound-garden-motion.cjs. Tám lượt, ended gate thật, lỗi/retry, keyboard/touch, bấm nhanh, đổi kích thước giữa bloom, mute/reduced-motion, cleanup, 320/390/768/1024/1366. gg-intro và gg-chant PASS. Video screencast Edge bị giữ frame cũ; dùng screenshot capture có timestamp ở tốc độ thật và GIF tests/sound-garden-motion.gif để review. Không tuyên bố độ mượt trên thiết bị trẻ từ đo headless; metrics giới hạn trong tests/sound-garden-performance.json.

Self-review: hoa mở cánh rõ quanh hình; ong/seed chuyển bên ngoài hình để không bị DOM che; căn ô đất/nhãn; hủy GSAP trước khi destroy Pixi; toast thành tích cũ đóng khi restart. Kiểm tra frame tại 1.2s/2.1s/3.1s và năm độ rộng.

Public deploy: đang kiểm tra; chưa đánh dấu xong.
