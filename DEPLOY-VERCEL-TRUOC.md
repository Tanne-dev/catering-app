# Deploy lên Vercel trước (không cần VPS)

Làm lần lượt 3 bước sau.

---

## Bước 1: Push code lên GitHub

1. Tạo repo trên GitHub: [github.com/new](https://github.com/new) → tên repo: **catering-app** → Create (không thêm README).
2. Trong terminal (thay **USERNAME** bằng username GitHub của bạn):

```bash
cd "/Users/tanne/Tanne Catering Projekt/catering-app"
git remote set-url origin https://github.com/USERNAME/catering-app.git
git push -u origin main
```

---

## Bước 2: Kết nối Vercel với GitHub

1. Vào [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub**.
2. **Add New Project** → chọn repo **catering-app**.
3. Cấu hình:
   - **Root Directory:** để mặc định (`.`)
   - **Framework:** Next.js (tự động)
   - **Build Command:** `npm run build`
   - Environment Variables: không cần thêm (Formspree đã cấu hình trong code).
4. Bấm **Deploy**.

---

## Bước 3: Kiểm tra

- Chờ vài phút → có link dạng `https://catering-app-xxx.vercel.app`.
- Mở link, kiểm tra form và responsive.

Sau này mỗi lần **push lên `main`**, Vercel tự deploy bản mới. Khi nào cần VPS (Vultr, …) thì làm theo **DEPLOY.md** mục 4 và 6.
