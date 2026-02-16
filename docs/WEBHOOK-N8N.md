# Webhook endpoint – Kết nối với n8n

Endpoint này **nằm trong app của bạn**. Để kết nối với n8n, bạn cấu hình trong n8n gọi tới URL này (n8n gửi request → app của bạn).

## URL

| Môi trường | URL |
|------------|-----|
| Local     | `http://localhost:3000/api/webhook` |
| Production| `https://<domain-của-bạn>/api/webhook` |

## Method

- **GET** – Kiểm tra endpoint hoạt động. Trả về `{ "ok": true, "message": "..." }`.
- **POST** – Gửi dữ liệu từ n8n. Body JSON tùy ý.

## Cách gọi trong n8n

### 1. Dùng node **HTTP Request**

1. Thêm node **HTTP Request**.
2. **Method:** `POST` (hoặc `GET` để test).
3. **URL:** `https://your-domain.com/api/webhook`
4. **Body Content Type:** JSON
5. **Body:** ví dụ:
   ```json
   {
     "event": "order_created",
     "data": { "name": "Anna", "email": "a@b.se" }
   }
   ```
6. (Tùy chọn) **Headers:**  
   - Name: `x-webhook-secret`  
   - Value: giá trị đặt trong `.env.local` biến `N8N_WEBHOOK_SECRET`  
   Nếu không set `N8N_WEBHOOK_SECRET` thì không cần header.

### 2. Response từ webhook

- **200:** `{ "ok": true, "received": true, "message": "Webhook processed" }`
- **401:** Thiếu hoặc sai header `x-webhook-secret` (khi đã set `N8N_WEBHOOK_SECRET`).
- **400:** Body không phải JSON hợp lệ.

## Bảo mật (khuyến nghị)

Trong `.env.local` đặt:

```env
N8N_WEBHOOK_SECRET=your-random-secret-string
```

Trong n8n, ở node HTTP Request → **Headers** thêm:

- **Name:** `x-webhook-secret`
- **Value:** `your-random-secret-string` (cùng giá trị với trên).

Như vậy chỉ request có đúng secret mới được chấp nhận.
