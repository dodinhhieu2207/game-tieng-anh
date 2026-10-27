# Unit 4 Lesson 1 — Family Park plan

Trạng thái: **đề xuất stack đã chọn / chờ kiểm kê asset và triển khai**.
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

## Storyboard và state flow

`intro → listening → waiting-for-touch → correct/retry → next-round → complete`.

Family Finder chỉ chuyển lượt khi voice kết thúc và trẻ chọn; Pack the Picnic khóa token đang kéo, cho phép retry không mất tiến trình; Relay có `blue-turn/red-turn`, pause và kết quả cuối. Reduced motion bỏ parallax/flight dài nhưng giữ highlight, text và trạng thái logic.

## Các bước và bằng chứng

- [ ] Kiểm kê trang sách, audio đã được phép dùng và artwork nguồn.
- [ ] Chốt art direction, Rive state machine và storyboard.
- [ ] Tạo asset hỗ trợ có alpha/manifest/license; không thay tranh sách.
- [ ] Đăng ký route/progress key và dựng Family Park bằng PixiJS/GSAP.
- [ ] Dựng Family Parade Relay bằng Phaser/GSAP, không trộn renderer.
- [ ] Kiểm tra audio-ended, mute, retry, click nhanh, reduced motion và cleanup.
- [ ] Chụp năm viewport và quay motion ở tốc độ thật; review theo `design-critique`.
- [ ] Chỉ deploy sau khi public source/assets và route được kiểm chứng.

## Nhật ký quyết định

- 2026-10-27: người dùng chọn A + B. A là renderer/choreography chính; B chỉ dành cho relay/arcade để tránh tải Phaser cho phần học từ vựng.
