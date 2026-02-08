# Hướng dẫn trỏ domain (cateringtanne.se) sang Vercel

Sau khi thêm domain **cateringtanne.se** trong Vercel (Settings → Domains), bạn cần cấu hình DNS tại **nhà đăng ký tên miền** (nơi bạn mua .se) cho khớp với yêu cầu của Vercel.

---

## Bản ghi cần thêm

Vercel thường yêu cầu:

| Loại | Tên (Name/Host) | Giá trị (Value/Points to) |
|------|------------------|---------------------------|
| **A** | `@` (hoặc để trống) | `76.76.21.21` hoặc IP mới Vercel đưa (vd: `216.198.79.1`) |
| **CNAME** (cho www) | `www` | `cname.vercel-dns.com` |

**Lưu ý:** Trong Vercel, mỗi lần thêm domain sẽ hiển thị đúng **IP** và **CNAME** cần dùng. Hãy lấy số liệu từ màn hình đó (có thể khác với bảng trên nếu Vercel đổi).

---

## Các bước chung (áp dụng mọi nhà đăng ký)

1. **Đăng nhập** vào trang quản lý tên miền (Binero, Loopia, One.com, GoDaddy, Namecheap, …).
2. Tìm mục **DNS**, **DNS Settings**, **Manage DNS**, **Nameservers** hoặc **Advanced DNS**.
3. **Thêm bản ghi A cho domain gốc:**
   - **Type:** A  
   - **Name / Host:** `@` hoặc để trống hoặc `cateringtanne.se` (tùy nhà cung cấp).  
   - **Value / Points to / Answer:** `76.76.21.21` (hoặc IP Vercel hiện tại, xem trong Vercel → Domains).
   - **TTL:** 3600 hoặc Auto.
4. **(Tùy chọn) Thêm CNAME cho www:**
   - **Type:** CNAME  
   - **Name / Host:** `www`  
   - **Value / Points to:** `cname.vercel-dns.com`  
   - **TTL:** 3600 hoặc Auto.
5. **Lưu** (Save). Đợi 5–30 phút (có khi đến 24–48 giờ) để DNS cập nhật.
6. Trong **Vercel** → Settings → Domains: thêm cả `cateringtanne.se` và `www.cateringtanne.se` (nếu dùng www). Trạng thái sẽ chuyển từ "Invalid Configuration" sang "Valid" khi DNS đã trỏ đúng.

---

## Một số nhà đăng ký cụ thể

### Binero (binero.se)
- Vào **Mina sidor** → chọn domain → **DNS-inställningar** / **Hantera DNS**.
- **Lägg till post** (Add record): chọn **A**, Host `@`, Value = IP Vercel.
- Thêm **CNAME**: Host `www`, Value `cname.vercel-dns.com`.

### Loopia (loopia.se)
- Kontrollpanelen → **Domänhantering** → chọn domain → **DNS**.
- Thêm **A-record**: namn `@`, värd = IP Vercel.
- Thêm **CNAME**: namn `www`, värd `cname.vercel-dns.com`.

### One.com
- **Domain** → chọn domain → **DNS records**.
- Add **A**: Host `@`, Point to = IP Vercel.
- Add **CNAME**: Host `www`, Point to `cname.vercel-dns.com`.

### GoDaddy
- **My Products** → domain → **DNS** / **Manage DNS**.
- **Add** → Type **A**, Name `@`, Value = IP Vercel.
- **Add** → Type **CNAME**, Name `www`, Value `cname.vercel-dns.com`.

### Namecheap
- **Domain List** → **Manage** → **Advanced DNS**.
- **Add New Record**: A Record, Host `@`, Value = IP Vercel.
- **Add New Record**: CNAME, Host `www`, Value `cname.vercel-dns.com`.

---

## Kiểm tra sau khi trỏ

- Trên máy: `ping cateringtanne.se` (xem có trỏ đúng IP không).
- Hoặc dùng [https://dnschecker.org](https://dnschecker.org): nhập `cateringtanne.se`, chọn A – xem giá trị có đúng IP Vercel không.
- Trong Vercel, trạng thái domain chuyển **Valid** và có ổ khóa (HTTPS) khi đã đúng.

---

## Lưu ý

- **Luôn lấy IP và CNAME chính xác** từ Vercel (project → Settings → Domains → chọn domain). Vercel có thể đổi IP theo thời gian.
- Nếu trước đó đã có bản ghi **A** hoặc **CNAME** cho `@` hoặc `www`, nên **sửa** hoặc **xóa** bản ghi cũ rồi thêm mới theo đúng bảng trên.
- Sau khi sửa DNS, chỉ cần chờ; không cần build lại project trên Vercel.
