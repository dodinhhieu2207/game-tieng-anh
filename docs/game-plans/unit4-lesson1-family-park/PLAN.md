# Unit 4 Lesson 1 — Family Park plan

Trạng thái: **bản playable thứ hai đã có nền sạch và catalogue Higgs; đang chờ nghe duyệt voice và gate trước deploy**.
Ngày cập nhật: 2026-10-27. Người dùng đã chọn **A + B**: A cho hoạt động học chính, B cho relay/arcade.

## Scope và nội dung

Nguồn bài: Family and Friends Starter 2nd Class Book, Unit 4 Lesson 1, trang 32: `mum`, `dad`, `brother`, `sister`, `grandpa`, `grandma`; nghe–chỉ–nhắc lại, chant, point and say trong cảnh picnic gia đình.

Hoạt động dự kiến:

1. **Meet the Family** — giới thiệu sáu từ trong cảnh Family Picnic Park; voice tự đọc, trẻ chạm để nghe lại.
2. **Family Finder** — nghe một từ rồi chạm đúng nhân vật; vị trí được trộn có kiểm soát.
3. **Pack the Picnic** — kéo dải từ vào đúng nhân vật; mobile có đường chạm từ → nhân vật.
4. **Family Parade Relay** — chế độ lớp/arcade tùy chọn, hai đội luân phiên; dùng Phaser cho đường đi, lượt và huy hiệu.

Route/progress key sẽ được chốt khi đăng ký hoạt động trong app; dự kiến nhóm `unit4/lesson1` với các key ổn định `u4l1-family-finder`, `u4l1-pack-picnic`, `u4l1-family-relay`. Không đổi key sau khi phát hành.

## Repo và skills

- **Rive Web runtime** (MIT runtime): rig/state machine cho sáu nhân vật; cần ghi rõ nguồn file `.riv` và điều kiện của editor/asset nếu dùng.
- **PixiJS 8 hiện có** (MIT): cảnh 2D nhiều lớp, parallax, spotlight và các lớp VFX của Family Park.
- **GSAP hiện có**: choreography, đường bay của word ribbon, snap/settle, camera cue và đồng bộ với audio-ended.
- **Phaser hiện có** (MIT): chỉ dùng cho Family Parade Relay, nơi cần lượt đội, đường đi và va chạm/physics nhẹ; không dùng cho ba hoạt động học chính.
- Tham khảo hoạt động giáo dục của GCompris/Sugarizer để giữ nhiệm vụ ngắn, direct manipulation và phản hồi tức thì; không sao chép code/asset.

Skills đã đọc/dùng để lập kế hoạch: `interaction-design`, `frontend-design`, `imagegen`. Skills dự kiến ở giai đoạn build: `design-critique`, `engineering:testing-strategy`, `engineering:deploy-checklist`.

## Art direction và asset/layer map

- Nền: công viên/picnic mở, xanh cỏ–xanh trời–vàng nắng; ít khung hộp, chữ vẫn dùng hệ font app.
- Lớp cảnh: sky, distant trees, midground lawn, picnic blanket, basket/flags, foreground grass.
- Nhân vật: sáu cutout từ artwork sách, mỗi nhân vật có idle/listen/correct/retry/celebrate; nếu Rive không khả dụng dùng cutout + GSAP.
- UI riêng: six word ribbons, Listen/Replay/Next, target spotlight, retry badge, team pennant, completion badge.
- VFX/SFX: leaf sway, soft light cone, ribbon flight, snap/settle, step dust rất nhẹ, picnic chime; không che chữ/nhân vật.

## Audio manifest

`assets/unit4/lesson1/audio/` có 13 MP3 Higgs Audio V3 dùng lại giọng Belinda đã được chấp nhận ở Unit 3: sáu từ `mum`, `dad`, `brother`, `sister`, `grandpa`, `grandma`; bốn lời hướng dẫn cho Meet/Find/Pack/Relay; ba lời phản hồi nhẹ. Audio chạy theo `ended`, hủy clip cũ khi bấm lại/rời màn hình và không dùng browser TTS làm nguồn thay thế. Transcript QA đã đạt 13/13; `humanReviewed` vẫn là `false` cho tới khi người dùng nghe duyệt.

## Storyboard và state flow

`intro → listening → waiting-for-touch → correct/retry → next-round → complete`.

Family Finder chỉ chuyển lượt khi voice kết thúc và trẻ chọn; Pack the Picnic khóa token đang kéo, cho phép retry không mất tiến trình; Relay có `blue-turn/red-turn`, pause và kết quả cuối. Reduced motion bỏ parallax/flight dài nhưng giữ highlight, text và trạng thái logic.

## Các bước và bằng chứng

- [x] Kiểm kê trang sách và artwork nguồn; đã cắt deterministic hai vùng minh họa từ PDF được cung cấp.
- [x] Chốt art direction và storyboard; Rive/Phaser giữ adapter seam, fallback không làm hỏng route.
- [x] Tạo asset hỗ trợ có manifest/README nguồn; không thay tranh sách bằng nhân vật AI.
- [x] Tạo nền `family-picnic-clean-v1` không còn sáu ô sticker/chữ; giữ source crop nguyên vẹn và ghi prompt/hash riêng.
- [x] Bỏ các nhãn trắng phủ trên tranh; vùng chạm nhân vật giờ trong suốt và chỉ hiện vòng sáng khi focus/đúng/sai.
- [x] Tạo và gắn catalogue Higgs V3 13 clip; transcript QA 13/13, còn chờ nghe duyệt cảm nhận giọng.
- [x] Đăng ký route/progress key và dựng Family Park playable bằng DOM/SVG + GSAP-friendly motion.
- [x] Chuẩn bị thẻ điều hướng Unit 4 và sáu thẻ lesson có artwork riêng, đối chiếu đúng mạch trang 32–37; manifest/provenance ở `assets/unit4/navigation/`. Các lesson chưa có game vẫn giữ trạng thái Coming soon, không tạo nội dung học giả định.
- [ ] Dựng adapter Phaser thật cho Family Parade Relay khi runtime arcade được nạp; hiện relay chạy fallback tương đương.
- [x] Kiểm tra local: Meet, Finder (đúng/sai/hoàn tất), Pack (đúng/sai/đếm), Relay (đổi lượt/ghi điểm); còn cần gate viewport/reduced-motion trước deploy.
- [ ] Chụp năm viewport và quay motion ở tốc độ thật; review theo `design-critique`.
- [ ] Chỉ deploy sau khi public source/assets và route được kiểm chứng.

## Nhật ký quyết định

- 2026-10-27: thay bộ navigation tranh minh họa lệch phong cách bằng `assets/unit4/navigation-v2/`: 1 banner Unit, 6 banner lesson có nhãn/chữ/khung đồng bộ trực tiếp mẫu Unit 3 và 6 background theo chủ đề sách. Gắn cardImage/background vào từng lesson; nền dùng trên màn thư viện hoạt động, giữ artwork sách trong gameplay. Prompt/source có trong manifest. Đây là asset navigation/background; bộ asset tương tác của 4 game vẫn là hạng mục riêng.

- 2026-10-27: sửa thiếu affordance của Pack the Picnic: sáu ô thả rõ, pointer drag có thẻ theo tay, hover đích, GSAP bay thẻ, từ đúng giữ trong ô và dấu tick; sai có retry. Đã kiểm tra local tap-place mum và drag-place brother. Meet/Find/Relay có caption tại nhân vật và GSAP phản hồi; rig nhân vật/Rive và Phaser relay thật vẫn còn chưa hoàn thành, không coi đây là motion nhân vật hoàn chỉnh.

- 2026-10-27: người dùng chọn A + B. A là renderer/choreography chính; B chỉ dành cho relay/arcade để tránh tải Phaser cho phần học từ vựng.
- 2026-10-27: theo phản hồi người dùng, ngừng dùng crop sách có ô sticker làm background; chuyển app sang nền imagegen sạch có provenance và giữ bản nguồn không sửa. Voice chính chuyển sang catalogue Higgs V3 tĩnh giọng Belinda; không dùng browser speech fallback.
- 2026-10-27: browser smoke xác nhận nền sạch, 13 clip được nạp, replay phục hồi sau autoplay block, Finder có retry/correct voice, Pack cập nhật tiến trình và Relay chờ hết chuỗi audio trước lượt chọn.
- 2026-10-27: navigation Unit 4 dùng một bộ artwork Family Park độc lập gồm cover + 6 lesson cards; từng card chỉ minh hoạ trọng tâm sách (gia đình, grammar, Jj, 9–10, Kk/Ll, story), không dùng lại ảnh Lesson 1 cho mọi lesson và không thay artwork sách trong game.
