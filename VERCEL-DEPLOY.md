# Hướng dẫn deploy lên Vercel

## Bước 1: Chuẩn bị code trên GitHub

1. **Tạo repo trên GitHub** (nếu chưa có):
   - Vào [github.com](https://github.com) → **New repository**
   - Đặt tên (vd: `catering-tanne` hoặc `catering-app`)
   - **Public** hoặc **Private** tùy bạn
   - **Không** tích "Initialize with README" (nếu đã có code)

2. **Đẩy code lên GitHub** (từ máy bạn):
   ```bash
   cd catering-app
   
   # Nếu chưa có git init
   git init
   git add .
   git commit -m "Initial commit"
   
   # Thêm remote và push
   git remote add origin https://github.com/TEN-GITHUB/TEN-REPO.git
   # Thay TEN-GITHUB = username GitHub của bạn
   # Thay TEN-REPO = tên repo bạn vừa tạo
   
   git branch -M main
   git push -u origin main
   ```

---

## Bước 2: Đăng ký / Đăng nhập Vercel

1. Vào [vercel.com](https://vercel.com)
2. Click **Sign Up** → chọn **Continue with GitHub** (hoặc email)
3. Nếu dùng GitHub: cho phép Vercel truy cập repo (có thể chọn chỉ cho phép một số repo)

---

## Bước 3: Import project

1. Trong dashboard Vercel → **Add New Project**
2. Tìm và chọn repo bạn vừa push (vd: `catering-tanne`)
3. **Project Settings:**
   - **Framework Preset:** Next.js (tự động nhận)
   - **Root Directory:** 
     - Nếu repo chỉ chứa `catering-app` → để mặc định (`.`)
     - Nếu repo là cả project (có thư mục cha chứa `catering-app`) → chọn `catering-app`
   - **Build Command:** `npm run build` (mặc định)
   - **Output Directory:** để mặc định (Next.js tự nhận)
   - **Install Command:** `npm ci` (hoặc `npm install`)

4. **Environment Variables** (tùy chọn):
   - Nếu muốn đổi Formspree Form ID: thêm `NEXT_PUBLIC_FORMSPREE_FORM_ID` = `mbdarvlw` (hoặc ID mới)
   - **Không cần** nếu giữ Form ID hiện tại trong code

5. Click **Deploy**

---

## Bước 4: Chờ build và kiểm tra

- Vercel sẽ build trong vài phút
- Khi xong, bạn có link dạng: `https://catering-tanne-xxx.vercel.app`
- Mở link → kiểm tra website chạy đúng

---

## Bước 5: Gắn tên miền riêng (tùy chọn)

1. Trong project Vercel → **Settings → Domains**
2. Nhập tên miền (vd: `cateringtanne.se`)
3. Vercel sẽ hiển thị **DNS records** cần thêm:
   - Thường là **CNAME** record: `www` → `c1.vercel-dns.com`
   - Hoặc **A** record: `@` → IP của Vercel (xem trong dashboard)
4. Vào nhà đăng ký tên miền (Namecheap, GoDaddy, ...) → DNS settings → thêm records theo Vercel
5. Đợi vài phút đến vài giờ để DNS propagate
6. Vercel tự động cấp **SSL miễn phí** (HTTPS)

---

## Sau khi deploy

✅ **Kiểm tra:**
- Form **Begär offert** có gửi email đúng không (Formspree)
- Form **Skicka omdöme** có hoạt động không
- Link **tel:** và **mailto:** (số điện thoại, email)
- Responsive trên mobile
- Tất cả hình ảnh load đúng

---

## Cập nhật code sau này

**Rất đơn giản:**

1. Chỉnh sửa code trên máy
2. Commit và push lên GitHub:
   ```bash
   git add .
   git commit -m "Update: mô tả thay đổi"
   git push origin main
   ```
3. **Vercel tự động deploy** bản mới trong vài phút
4. Bạn sẽ nhận email thông báo deploy xong (nếu bật notification)

**Hoặc** vào dashboard Vercel → tab **Deployments** để xem tiến trình.

---

## Troubleshooting

**Build lỗi:**
- Kiểm tra **Build Logs** trong Vercel dashboard
- Thường do: thiếu dependency, lỗi TypeScript, hoặc lỗi build Next.js
- Sửa lỗi → push lại → Vercel tự rebuild

**Website không load:**
- Kiểm tra domain DNS đã trỏ đúng chưa
- Kiểm tra SSL certificate (Vercel tự cấp, có thể mất vài phút)

**Form không gửi được:**
- Kiểm tra Formspree Form ID đúng chưa
- Kiểm tra Environment Variable `NEXT_PUBLIC_FORMSPREE_FORM_ID` trong Vercel Settings

---

## Tóm tắt nhanh

1. ✅ Code trên GitHub
2. ✅ Vercel → Add New Project → chọn repo
3. ✅ Deploy
4. ✅ Có link website ngay
5. ✅ (Tùy chọn) Gắn tên miền riêng

**Mỗi lần update:** Push lên GitHub → Vercel tự deploy.
