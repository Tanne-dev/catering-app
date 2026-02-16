# n8n Workflow – Quản lý đặt bàn & Google Sheet

Luồng: **App gửi webhook → n8n nhận → Ghi vào Google Sheet**

## 1. URL Webhook trong n8n

Tạo workflow n8n với node **Webhook**:
- **Method:** POST
- **Path:** `/tables` (hoặc tùy chọn)
- **Respond:** Immediately (trả về ngay, không chờ xử lý xong)

Sau khi activate workflow, copy URL webhook (ví dụ: `https://your-n8n.com/webhook/tables`).

Trong `.env.local` của app:

```
N8N_TABLES_WEBHOOK_URL=https://your-n8n.com/webhook/tables
```

## 2. Payload app gửi tới n8n

### Khi đặt bàn (`event: "table_booked"`)

```json
{
  "event": "table_booked",
  "data": {
    "tableId": "1",
    "tableName": "Bàn 1",
    "customerName": "Anna Andersson",
    "phone": "0701234567",
    "email": "anna@example.com",
    "date": "2025-02-20",
    "time": "19:00",
    "note": "Allergi: nötter",
    "bookingId": "b-1739712000-abc123",
    "createdAt": "2025-02-16T10:30:00.000Z"
  }
}
```

### Khi hủy đặt bàn (`event: "table_cancelled"`)

```json
{
  "event": "table_cancelled",
  "data": {
    "tableId": "1",
    "tableName": "Bàn 1",
    "previousBooking": {
      "id": "b-1739712000-abc123",
      "customerName": "Anna Andersson",
      "phone": "0701234567",
      "date": "2025-02-20",
      "time": "19:00",
      "createdAt": "2025-02-16T10:30:00.000Z"
    }
  }
}
```

## 3. Cấu hình workflow n8n

### Node 1: Webhook
- Nhận POST từ app

### Node 2: Switch (hoặc IF)
- Branch theo `{{ $json.event }}`:
  - `table_booked` → ghi vào Sheet "Đặt bàn"
  - `table_cancelled` → cập nhật/xóa trong Sheet (tùy logic)

### Node 3: Google Sheets – Append Row
- Sheet: "Đặt bàn" (hoặc tên bạn đặt)
- Cột: Ngày đặt | Giờ | Bàn | Tên khách | SĐT | Email | Ghi chú | ID đặt | Ngày tạo

Ví dụ mapping:
- Ngày: `{{ $json.data.date }}`
- Giờ: `{{ $json.data.time }}`
- Bàn: `{{ $json.data.tableName }}`
- Tên: `{{ $json.data.customerName }}`
- SĐT: `{{ $json.data.phone }}`
- Email: `{{ $json.data.email }}`
- Ghi chú: `{{ $json.data.note }}`
- ID: `{{ $json.data.bookingId }}`
- Ngày tạo: `{{ $json.data.createdAt }}`

Chỉ chạy node này khi `event === "table_booked"`.

### Node 4 (tùy chọn): Xử lý `table_cancelled`
- Có thể dùng Google Sheets node "Update" hoặc "Delete" để đánh dấu đã hủy
- Hoặc ghi thêm 1 dòng vào Sheet "Lịch sử" với trạng thái = "hủy"

## 4. Cấu trúc Google Sheet đề xuất

**Sheet "Đặt bàn":**
| Ngày đặt | Giờ | Bàn | Tên khách | SĐT | Email | Ghi chú | Booking ID | Ngày tạo | Trạng thái |
|----------|-----|-----|-----------|-----|-------|---------|------------|----------|------------|

Trạng thái: `đặt` / `hủy` (có thể cập nhật khi nhận `table_cancelled`).

## 5. Kiểm tra

1. Chạy app: `npm run dev`
2. Mở: `http://localhost:3000/admin/tables`
3. Đặt một bàn
4. Kiểm tra n8n webhook có nhận payload
5. Kiểm tra Google Sheet có dòng mới
