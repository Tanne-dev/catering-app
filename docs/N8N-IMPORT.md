# n8n Workflow Import – Catering Tanne

Có 2 file JSON để import vào n8n:

## 1. `n8n-chat-workflow.json` – Chatbot

- **Webhook path:** `/chat`
- **Biến môi trường app:** `N8N_CHAT_WEBHOOK_URL`
- **Cấu hình cần thiết:**
  - OpenAI credentials trong n8n
  - Chỉnh node OpenAI để nhận đúng `conversation` + `message` (format có thể khác tùy phiên bản n8n)
- **Lưu ý:** Cấu trúc OpenAI node có thể cần điều chỉnh trong n8n UI tùy phiên bản.

## 2. `n8n-tables-workflow.json` – Bordbokningar

- **Webhook path:** `/tables`
- **Biến môi trường app:** `N8N_TABLES_WEBHOOK_URL`
- **Cấu hình cần thiết:**
  - Google Sheets credentials trong n8n
  - Chọn Document ID và Sheet name trong mỗi node Google Sheets
  - Sheet "Bokningar": cho đặt bàn
  - Sheet "Avbokningar": cho hủy bàn

## Cách import

1. Mở n8n → **Workflows** → **Add workflow**
2. Menu (3 chấm) → **Import from File**
3. Chọn file JSON
4. Chỉnh sửa nodes (credentials, document ID, sheet name)
5. Activate workflow
6. Copy webhook URL vào `.env.local`:
   - `N8N_CHAT_WEBHOOK_URL=https://your-n8n.com/webhook/chat`
   - `N8N_TABLES_WEBHOOK_URL=https://your-n8n.com/webhook/tables`
