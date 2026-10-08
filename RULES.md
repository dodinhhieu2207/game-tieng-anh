# Quy tắc phát triển web Family and Friends – Letter Land

Ngày tạo: 2026-10-07. Áp dụng cho giao diện, trò chơi, audio, Speaking AI và hệ thống tiến trình của dự án này.

## 1. Cách áp dụng

- Đọc file này trước khi sửa dự án. Chỉ thực hiện phạm vi người dùng yêu cầu; giữ nguyên các phần đã được duyệt.
- Yêu cầu mới, rõ ràng của người dùng được ưu tiên hơn quy tắc trong file này. Nếu có mâu thuẫn thực sự, nêu phần bị ảnh hưởng trước khi thực hiện.
- Đây là tài liệu quy tắc dự án, không phải cơ chế tự động nạp cấu hình của Codex. Khi giao việc cho công cụ AI khác, yêu cầu công cụ đọc `RULES.md`.
- Không tự thay framework, viết lại toàn bộ game, đổi nhà cung cấp giọng đọc hoặc đổi chương trình học chỉ để thuận tiện triển khai.

## 2. Mục tiêu sản phẩm

- Tạo trải nghiệm như một app học tập cho trẻ mầm non: hình ảnh lớn, nhiệm vụ rõ, phản hồi ấm áp và ít chữ.
- Ưu tiên việc trẻ hiểu câu hỏi, nhớ từ và dùng được câu hoàn chỉnh. Hiệu ứng và điểm thưởng phải hỗ trợ mục tiêu học.
- Không khẳng định chơi game hoặc được AI duyệt đồng nghĩa trẻ đã thành thạo. Phân biệt luyện tập có hỗ trợ với thực hiện độc lập.
- Nội dung hiển thị cho trẻ dùng tiếng Anh. Tài liệu kỹ thuật và hướng dẫn giáo viên có thể dùng tiếng Việt.

## 3. Giao diện và điều hướng

- Giữ hệ thống sidebar, Letter Land, các game, hình ảnh và phong cách đã được duyệt khi thay đổi một phần giao diện.
- Luồng học chính: chọn Unit → chọn một trong sáu Lesson → chọn hoạt động → chơi → xem kết quả và tiếp tục.
- Dùng trang Unit 3 Lesson 1 làm nền tảng bố cục Lesson tái sử dụng; thay dữ liệu nội dung thay vì sao chép nhiều giao diện riêng.
- Một màn hình có một hành động chính dễ nhận ra. Nút quay lại, nghe lại và tiếp tục phải nhất quán giữa các game.
- Asset thẻ Lesson/Unit phải là phần chính của thẻ có thể bấm, đủ lớn để đọc; không đặt như thumbnail nhỏ bên cạnh một khung trống.
- Tránh banner lớn chỉ chứa chữ, khoảng trắng quá dài, các bảng số liệu kiểu quản trị và nhiều nút trùng chức năng.
- Chữ dùng font tròn, rõ, hỗ trợ ký tự cần thiết và có giấy phép phù hợp. Giữ một hệ thống font nhất quán; không thay riêng từng game tùy ý.
- Hướng dẫn và câu học phải đọc rõ trên màn hình chơi. Không thu nhỏ chữ để ép nội dung vào khung.
- Vùng bấm chính tối thiểu 48 × 48 CSS px. Chức năng quan trọng không được phụ thuộc vào hover.
- Kiểm tra ở chiều rộng 320, 390, 768, 1024 và 1366 px: không tràn ngang, che nút, cắt câu hoặc chồng hình.
- Hỗ trợ bàn phím, trạng thái focus, nhãn nút phù hợp và `prefers-reduced-motion`. Không chỉ dùng màu để báo đúng/sai.

## 4. Nội dung và phân Lesson

Unit 2 giữ đúng thứ tự người dùng đã cung cấp:

| Lesson | Nội dung |
| --- | --- |
| 1 | Words – School things |
| 2 | Grammar – What's this? / It's a… |
| 3 | Sounds and letters – Ee, egg, elephant |
| 4 | Numbers – 5: five, 6: six |
| 5 | Letter Ff – fish, farm |
| 6 | Story |

- Không gom lại Unit 2 thành một thư viện trộn mọi nội dung.
- Ellie’s Classroom Adventure là hoạt động mở rộng trong cấu trúc hiện tại; không tự gán lại vào Lesson theo sách.
- Không tự sáng tác nội dung sách cho Lesson chưa có tài liệu. Hiển thị trạng thái chưa có nội dung một cách rõ ràng.
- Unit 3 dùng dữ liệu và hoạt động hiện có; không suy ra thứ tự bài từ một asset minh họa.
- Ngữ pháp phải đúng: `It's a pencil.`, `It's an egg.`, `Is it a robot?`, `Yes, it is.`, `No, it isn't.`
- Không dùng phiên âm tiếng Việt hoặc IPA trong giao diện trẻ nếu chưa được yêu cầu.

## 5. Asset và tài nguyên

- Ưu tiên asset người dùng cung cấp và hình sách đã được cho phép sử dụng. Không thay bằng ảnh AI ngẫu nhiên.
- Giữ tỷ lệ hình, nền trong suốt, viền và chất lượng của bộ asset. Kiểm tra hình thực tế khi đưa vào giao diện.
- Với sprite sheet, tách hoặc định vị từng phần chính xác; không đưa cả sheet lên một nút hay kéo méo ảnh.
- Asset mới cần phù hợp với bộ hiện có về màu, độ bóng, viền, tỷ lệ và độ thân thiện.
- Tài nguyên từ bên ngoài phải có nguồn và điều kiện sử dụng rõ ràng; lưu ghi chú giấy phép cùng bộ tài nguyên.
- Không xóa asset đang dùng hoặc thay đường dẫn âm thầm. Kiểm tra nơi tham chiếu trước khi sửa.

## 6. Audio và Build a Sentence

- Unit 2 dùng bộ Higgs TTS đã tích hợp. Unit 3 giữ các clip Higgs đã được duyệt. Không tự chuyển sang Qwen, giọng trình duyệt hoặc dịch vụ khác.
- Giọng phải nhất quán, rõ, tự nhiên và phù hợp với trẻ; phân biệt tên chữ, âm chữ, từ và câu.
- Khi trẻ cầm/chọn một thẻ từ trong Build a Sentence, chỉ đọc từ trên thẻ đó. Dùng danh sách token xác định bằng code/dữ liệu, không gọi AI để tách câu mỗi lượt.
- Giữ `What's` và `It's` là token nguyên vẹn; dấu câu không được tạo thành một âm đọc riêng.
- Khi ghép đúng và đủ câu, đọc cả câu. Không đọc câu thành công khi thiếu từ hoặc sai thứ tự.
- Chờ sự kiện kết thúc audio trước khi chuyển lượt; không dùng thời gian chờ cố định để đoán độ dài clip.
- Không phát chồng lời hướng dẫn, từ, câu và feedback. Hủy lượt audio cũ khi người dùng rời hoạt động.
- `AbortError` do hủy/chuyển lượt không phải bằng chứng file hỏng; không đổi giọng fallback vì lỗi hủy này.
- Không phát lời mẫu hoặc SFX trong khi đang thu âm trẻ. Tuân thủ trạng thái bật/tắt âm thanh của app.
- Báo rõ file thiếu hoặc lỗi phát. Không dùng lời gọi hàm thành công để thay cho kiểm tra audio thực tế.

## 7. Speaking AI và công bằng với trẻ

- Dùng ranh giới thu âm chung trong `unit3-speech.js`, cấu hình trong `data/speech-config.js` và Worker trong `cloudflare/toy-buddy-speech/`.
- Hiện tại cho ghi tối đa 8 giây, có nút Done. Nếu đổi thời lượng, cập nhật đồng bộ UI, adapter và kiểm thử.
- Phân biệt: ghi âm → đang nhận diện → câu đầy đủ đúng → câu chưa đủ → nội dung sai → AI chưa nhận diện chắc chắn.
- `UNCLEAR`, lỗi mạng hoặc lỗi nhận diện không được tính là lỗi phát âm của trẻ, không trừ điểm hoặc tăng số lần trả lời sai.
- Không kết luận trẻ nói sai chỉ vì người lớn được nhận diện còn trẻ không được nhận diện.
- Chỉ bỏ từ đệm và từ lặp liền nhau theo quy tắc đã kiểm thử. Không tự thêm từ thiếu, đoán đồ vật hoặc sửa ý nghĩa để cho qua.
- Một từ như `robot`, hoặc chỉ `yes`/`no`, chưa đáp ứng nhiệm vụ yêu cầu câu đầy đủ.
- Đối chiếu cả cấu trúc, a/an, đúng đồ vật và ý nghĩa yes/no. Không cho câu trái nghĩa đạt điểm.
- Context nhận diện chỉ cung cấp vốn từ của bài học; không cung cấp sẵn câu đúng hay gợi ý chỉ có đáp án mục tiêu.
- Giáo viên có thể nghe lại, xem transcript/lý do và xác nhận câu đầy đủ. Ghi `teacher-confirmed` riêng; không tính thành AI tự nhận đúng hoặc thành tích độc lập.
- Chế độ trẻ hỏi AI phải có tín hiệu rõ “Your turn to ask”; khác trực quan với chế độ trẻ trả lời AI.
- Với Mystery Toy, giữ đồ vật ẩn tới khi đoán đúng. Chỉ trao thưởng khi câu hỏi đầy đủ và AI trả lời Yes cho đồ vật thực tế; số lần đoán hợp lệ ảnh hưởng số sao. Lỗi nhận diện không tính là một lần đoán sai.
- Whisper là nhận diện lời nói, không phải điểm đánh giá phát âm. Không hiển thị hoặc tuyên bố điểm phát âm khi chưa có hệ thống đánh giá tương ứng.
- Không tuyên bố độ chính xác với trẻ từ test mock hoặc giọng người lớn. Đánh giá thực tế cần bản ghi được cho phép và đối chiếu nhận xét giáo viên.

## 8. Tiến trình, sao và phản hồi

- Dùng hệ thống chung trong `app/progress.js`; mọi game có tính sao phải có khóa hoạt động ổn định và cập nhật qua API chung.
- Hiển thị tiến trình và sao ngay trong màn hình chơi, đồng thời giữ tổng hợp ở bản đồ học tập.
- Chơi lại không được cộng trùng thành tích cùng một kết quả. Giữ quy tắc điểm tốt nhất và tách dữ liệu từng người học.
- Phân biệt số sao, số hoạt động hoàn thành, AI xác nhận và giáo viên hỗ trợ. Không dùng một con số thay cho mọi loại năng lực.
- Hoạt động mới phải đăng ký với hệ thống tiến trình; không tự lưu thêm một bộ điểm riêng.
- Phản hồi đúng cần rõ, vui và ngắn; phản hồi chưa đúng phải khuyến khích thử lại, không làm trẻ xấu hổ.
- VFX/SFX dùng qua cơ chế chung để nhiều game cùng hưởng. Có phản hồi bấm, đặt thẻ, đúng, thử lại, nhận sao và hoàn thành.
- SFX không lấn lời đọc; không phát lặp dồn khi bấm nhanh. VFX không che câu học/nút và không nhấp nháy mạnh.
- Hiệu ứng phải được dọn khi rời màn hình và giảm chuyển động theo tùy chọn hệ thống.

## 9. Dữ liệu, bảo mật và vòng đời

- Token, khóa API và thông tin bí mật không được đặt trong frontend, commit hoặc log. Frontend chỉ chứa endpoint công khai.
- Giữ kiểm tra origin, giới hạn kích thước upload, rate limit, timeout và kiểm tra payload tại Worker.
- Audio nghe lại của trẻ là Blob tạm trong tab; thu hồi URL khi thay clip, đổi lượt hoặc rời hoạt động. Không tự lưu transcript/recording lâu dài.
- Dừng thu âm khi rời hoạt động hoặc chuyển app sang nền; kết quả cũ không được sửa trạng thái vòng chơi mới.
- Không gửi bản ghi hoặc dữ liệu học sinh sang nhà cung cấp mới khi chưa có yêu cầu phù hợp.

## 10. Cấu trúc và sửa code

- Giữ kiến trúc JavaScript hiện có. Điều hướng nằm trong `app/`, tiện ích dùng chung trong `shared/`, cấu hình/nội dung trong `data/`, tài nguyên trong `assets/`.
- Ưu tiên sửa thành phần chung khi vấn đề ảnh hưởng nhiều game; tránh vá một game rồi tuyên bố áp dụng toàn bộ.
- Không sửa các engine inline trong `index.html` ngoài phạm vi cần thiết. Đọc adapter và nơi gọi trước khi thay logic.
- Giữ route, ID hoạt động và khóa tiến trình đang dùng để dữ liệu học cũ còn truy cập được.
- Thay đổi cần dễ review, có xử lý lỗi và dọn event/timer/audio; tránh thêm thư viện lớn cho một hiệu ứng nhỏ.

## 11. Kiểm tra và bàn giao

- Chạy kiểm tra liên quan tới phần thay đổi; không chỉ kiểm tra cú pháp hoặc nhìn source.
- Điều hướng: `tests/navigation.spec.cjs`. Giao diện: các test layout/app hiện có và kiểm tra trực quan ở các kích thước cần thiết.
- Audio: `tests/unit2-higgs-voice.spec.cjs`, `tests/sentence-word-audio.spec.cjs` và kiểm tra file thực tế.
- Speaking: `tests/child-speech-evaluator.spec.cjs`, `tests/speech-adapter.spec.cjs`, `tests/child-speaking.spec.cjs`, `tests/toy-speech-worker.spec.mjs` và test Unit 3 liên quan.
- Tiến trình/hiệu ứng: `tests/learning-rewards.spec.cjs` và các test feedback/click-sound liên quan.
- Test nhận diện mock chứng minh luồng UI và logic; test live chứng minh endpoint xử lý mẫu đó. Hai loại này không tự chứng minh chất lượng nhận diện trẻ.
- Kiểm tra cả trường hợp sai, thiếu câu, im lặng, mạng lỗi, từ chối mic, bấm nhanh, chơi lại và rời màn hình nếu thay đổi có liên quan.
- Khi triển khai đã được yêu cầu, kiểm tra repo/nhánh thực tế, đồng bộ đúng file, cache-bust file thay đổi và xác nhận bản GitHub Pages/Worker được phục vụ.
- Không tuyên bố “đã lên web” chỉ vì có commit hoặc bản local chạy. Không publish thay đổi ngoài phạm vi được yêu cầu.
- Báo cáo bằng tiếng Việt: đã đổi gì, ở đâu, đã kiểm tra gì, link/file mở được và giới hạn còn lại. Không khẳng định kết quả chưa có bằng chứng.

## 12. Những việc không được làm

- Không đổi asset, audio, font hoặc bố cục đã duyệt ngoài phạm vi yêu cầu.
- Không cho qua câu thiếu/sai chỉ để tăng tỷ lệ thành công của AI.
- Không trừ điểm trẻ do lỗi nhận diện, lỗi mạng hoặc lỗi thiết bị.
- Không dùng thời gian chờ cố định thay cho kết thúc audio.
- Không để hiệu ứng/âm thanh trang trí gây cản trở học hoặc thu âm.
- Không nhầm xác nhận của giáo viên với thành tích độc lập.
- Không xóa dữ liệu người học, tài nguyên hay bản phát hành cũ khi chưa được yêu cầu.
