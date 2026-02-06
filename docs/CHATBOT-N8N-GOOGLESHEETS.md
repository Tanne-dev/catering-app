# Chatbot Catering trên n8n + Google Sheets

Chatbot chạy trên web: trả lời tự động, thu thập thông tin khách hàng, giải thích món ăn (dữ liệu từ Google Sheets), và phân biệt ý định (intent) để trả lời đúng, hạn chế hỏi đi hỏi lại.

---

## 1. Kiến trúc tổng quan

```
[Website] ←→ [Next.js API /chat] ←→ [n8n Webhook]
                                      ↓
                              [Phân tích ý định]
                                      ↓
                              [Google Sheets: FAQ, Món, Thu thập]
                                      ↓
                              [Tạo câu trả lời / Thu thập thông tin]
                                      ↓
                              [Trả JSON về API → hiển thị trong chat]
```

- **Web:** Widget chat gửi tin nhắn (và session/conversation id) tới API Next.js.
- **Next.js:** Route `/api/chat` gọi n8n webhook (tránh lộ URL n8n, xử lý CORS).
- **n8n:** Webhook nhận message → (tuỳ chọn) AI phân tích intent → đọc Google Sheets (FAQ, menu, form thu thập) → trả reply + cờ “đã thu thập xong” nếu cần.
- **Google Sheets:** 2–3 sheet: ý định + câu trả lời, món ăn, và (tuỳ chọn) sheet lưu thông tin khách đã thu thập.

---

## 2. Cấu trúc Google Sheets

### Sheet 1: `Intents` (ý định → câu trả lời / hành động)

| intent_id | keywords_sv | keywords_extra | response_sv | action |
|-----------|-------------|---------------|------------|--------|
| meny | meny, menyer, asiatisk, sushi, vietnamesisk | menu, mat | [Mô tả ngắn + link hoặc gợi ý xem Menyer] | show_meny |
| priser | pris, priser, kostnad, pris | price, cost | Vi kan skicka offert... | send_offer |
| allergi | allergi, allergen | allergy | Vi kan anpassa... Allergener finns i varje rätt. | info |
| bokning | boka, bokning, beställa, datum | book, order | Fyll i formulär eller ring... | collect_contact |
| maträtter | rätter, maträtter, rätter ni serverar | dishes, food | [Mô tả ngắn + “Se Portfolio”] | show_dishes |
| kontakt | kontakt, ringa, mejl, telefon | contact | Ring oss: ... Mejl: ... | info |
| default | - | - | Jag förstod inte. Vill du veta om menyer, priser eller bokning? | ask_clarify |

- **keywords_sv / keywords_extra:** từ khóa (SV + EN) để match intent; n8n hoặc AI dùng để phân loại.
- **response_sv:** câu trả lời mặc định cho intent đó (có thể tham chiếu thêm Sheet 2).
- **action:** `show_meny`, `send_offer`, `collect_contact`, `info`, `show_dishes`, `ask_clarify` – dùng trong n8n để quyết định bước tiếp (ví dụ: đọc sheet Món, hoặc trả form thu thập).

### Sheet 2: `Matratter` (món ăn – giải thích cho khách)

| id | namn_sv | beskrivning_sv | allergener | kategori |
|----|---------|----------------|------------|----------|
| 1 | Sushi | ... | Fisk, gluten... | sushi |
| 2 | Bún chả | ... | Gluten... | asiatisk |

- Bot có thể trả lời theo **kategori** hoặc **namn** khi khách hỏi “món nào có?”, “sushi là gì?”.

### Sheet 3: `Kundinfo` (thu thập thông tin khách – ghi từ n8n)

| timestamp | session_id | namn | epost | telefon | meddelande | intent |
|-----------|------------|------|-------|---------|------------|--------|
| 2025-... | abc123 | Anna | a@... | 07... | Vill boka 20 pers | bokning |

- n8n khi xác định intent = thu thập (ví dụ `bokning`) sẽ trả reply kèm “bạn cho tên, email, số điện thoại” (hoặc form ngắn trong chat). Khi đủ thông tin, node “Google Sheets” trong n8n ghi một dòng vào sheet này.

---

## 3. Workflow n8n (ý tưởng từng node)

1. **Webhook** (POST)  
   - Nhận body: `{ "message": "text từ khách", "sessionId": "...", "conversation": [ { "role": "user"|"assistant", "content": "..." } ] }`.  
   - Method: POST.

2. **Optional: AI (OpenAI/Claude) – Phân tích ý định**  
   - Input: `message` (và có thể vài tin nhắn gần nhất trong `conversation`).  
   - Prompt: “Klassificera användarens avsikt till exakt en av: meny, priser, allergi, bokning, maträtter, kontakt, default. Svara bara med ett ord.”  
   - Output: `intent` (string).

3. **Google Sheets: Lookup**  
   - Đọc sheet **Intents**, tìm dòng có `intent_id` = `intent` vừa có.  
   - Lấy `response_sv`, `action`.

4. **Switch / IF theo `action`**  
   - Nếu `show_meny` hoặc `show_dishes`: đọc thêm sheet **Matratter** (hoặc filter theo kategori), format thành 1 đoạn text.  
   - Nếu `collect_contact`: kiểm tra trong `conversation` hoặc state (qua sessionId) đã có tên/email/telefon chưa; nếu chưa thì trả câu “Vänligen ange namn, e-post och telefon”; nếu rồi thì ghi vào sheet **Kundinfo** và trả “Tack, vi återkommer”.

5. **Format reply**  
   - Tạo object: `{ "reply": "text trả lời", "action": "...", "collected": { "namn", "epost", "telefon" } }`.

6. **Respond to Webhook**  
   - Trả JSON về cho Next.js (status 200, body là object trên).

Như vậy bot sẽ: (1) phân biệt ý định, (2) lấy nội dung từ Sheets để giải thích món / dịch vụ, (3) thu thập thông tin có chủ đích và ghi vào Sheets, (4) trả lời tối ưu, ít hỏi lại.

---

## 4. Phân biệt ý định (intent) – hai cách trong n8n

### Cách A: Không dùng AI (chỉ Google Sheets + từ khóa)

- Trong n8n: dùng **Code** hoặc **Switch**: tách từ trong `message`, so sánh với cột `keywords_sv` / `keywords_extra` trong sheet **Intents** (có thể load sheet 1 lần rồi loop hoặc dùng biểu thức).  
- Ưu: rẻ, không cần API AI. Nhược: chỉ bắt được câu đơn giản, dễ sai với câu dài.

### Cách B: Dùng AI (OpenAI / Claude) trong n8n

- Node **OpenAI** hoặc **@n8n/n8n-nodes-langchain** với model chat: system prompt = “Du är en bot för Catering Tanne. Klassificera avsikten: meny, priser, allergi, bokning, maträtter, kontakt, default.”  
- User message = tin nhắn khách. Lấy output là 1 từ (intent).  
- Ưu: hiểu câu phức tạp, ít hỏi lại. Nhược: tốn API, cần key.

Bạn có thể bắt đầu với Cách A; khi cần chính xác hơn thì bật Cách B.

---

## 5. Thu thập thông tin khách hàng

- **Trong conversation:** Bot trả “Vänligen ange ditt namn”, “e-post”, “telefon”. Mỗi tin nhắn tiếp theo của user, n8n kiểm tra (regex hoặc AI) xem đã có tên/email/số chưa; lưu vào biến (hoặc state theo sessionId).  
- **Khi đủ:** Ghi 1 dòng vào sheet **Kundinfo**, trả “Tack! Vi återkommer.”  
- **State:** Có thể lưu trong n8n bằng **Set** node (memory tạm) hoặc dùng Redis/Google Sheet một dòng “session_id | namn | epost | telefon” để giữ state giữa các request.

---

## 6. Tích hợp web (Next.js)

- **Frontend:** Widget chat (React) gửi POST tới `/api/chat` với `{ message, sessionId, conversation }`.  
- **Backend:** Route `app/api/chat/route.ts` nhận request, gọi n8n webhook (URL n8n đặt trong biến môi trường `N8N_CHAT_WEBHOOK_URL`), trả lại JSON từ n8n cho frontend.  
- **CORS:** Không cần mở CORS từ n8n vì trình duyệt chỉ gọi cùng domain (Next.js).

---

## 7. Checklist triển khai

- [ ] Tạo Google Sheet với 3 sheet: Intents, Matratter, Kundinfo.  
- [ ] Trong n8n: tạo credentials Google Sheets, tạo workflow Webhook → (Intent) → Sheets → Respond to Webhook.  
- [ ] (Tuỳ chọn) Thêm node AI cho intent; cấu hình OpenAI/Claude.  
- [ ] Trong Next.js: thêm `N8N_CHAT_WEBHOOK_URL`, route `/api/chat`, component Chat widget.  
- [ ] Embed widget vào layout trang chủ (hoặc trang contact).  
- [ ] Test: hỏi menyer, priser, allergi, bokning; kiểm tra câu trả lời và 1 bản ghi xuất hiện trong Kundinfo.

File hướng dẫn này đi kèm với: API route `/api/chat` và component Chat widget trong repo (xem thư mục `src/app/api/chat` và `src/components/ChatWidget`).
