# Speaking: AI tự nhận diện và phản hồi

Yêu cầu người dùng 2026-10-14: bỏ Teacher Check khỏi luồng trẻ, dùng Cloudflare tự đánh giá, linh hoạt hơn với phát âm.

Áp dụng chung WordTurn (Say & Play, Mystery Box, Gg words/Trace & Say), Talk to Toy Buddy (từ/câu/hỏi), Ellie school sentences. Teacher review giờ chỉ phát lại bản ghi/transcript, không có nút duyệt đúng và không dùng khi lỗi để chuyển sang manual. Ghi âm 8 giây/Done, mic và retry vẫn giữ. Không nhận diện phoneme đơn bằng Whisper.

Evaluator dùng alias ASR xác định (plain/plane, ro bot/robot, baloon/balloon, guitah/guitar, gurl/girl, pensil/pencil, note book/notebook). Alias được đối chiếu toàn vốn từ nhiệm vụ, không lấy đáp án hiển thị để đoán; không fuzzy-match cat/car và không tự thêm từ ngữ pháp. Transcript gốc giữ nguyên; normalized có canonical word.

Worker giữ model, origin/upload/rate/timeout/privacy. Với câu/từ đã có cấu trúc nhưng token confidence thấp, thêm lượt trung lập. Lượt 2 phải đồng ý normalized, có logprob ít nhất -1.35; thiếu score, mâu thuẫn hoặc quá yếu vẫn UNCLEAR. Không nới polarity/a-an/đồ vật/cấu trúc; một từ không đủ nếu nhiệm vụ cần câu. Không đưa expected answer vào prompt. Lỗi không trừ điểm.

Tests: Worker 419 cases, child-friendly-speech (aliases/medium confidence/agreement/wrong/missing), child-speech-evaluator, speech-adapter, child-speaking (capture/retry Unit 2 + 3), speaking-play (Lessons 1–3). Live test dùng 5 clip Higgs đã có, không phải dữ liệu giọng trẻ thật; không cam kết mọi trẻ được nhận đúng hay điểm phát âm.

Cloudflare deployed: 1d1e9611-82eb-483b-ba80-9badae469549, 2026-10-14, account hiei1121. Website build PASS; run 38588109061 deploy bị GitHub Pages HTTP 500, đang retry. Rollback: revert bounded source commit, deploy previous Worker if valid answers regress; no data migration.
