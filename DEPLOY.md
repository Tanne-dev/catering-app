# Triển khai Catering Tanne lên server

## 1. Chuẩn bị trước khi deploy

### Build thử trên máy
```bash
cd catering-app
npm ci
npm run build
npm run start
```
Mở http://localhost:3000 – nếu chạy bình thường thì có thể deploy.

### Biến môi trường (tùy chọn)
- Form ID Formspree đã đặt sẵn trong code. Nếu muốn đổi khi deploy, tạo file `.env.production` hoặc cấu hình trên nền tảng:
  ```bash
  NEXT_PUBLIC_FORMSPREE_FORM_ID=mbdarvlw
  ```
- **Không** cần biến này nếu giữ Form ID hiện tại.

---

## 2. Cách 1: Deploy lên Vercel (khuyến nghị – miễn phí)

1. Đẩy code lên **GitHub** (hoặc GitLab / Bitbucket).
2. Vào [vercel.com](https://vercel.com) → Sign up / Login (có thể dùng tài khoản GitHub).
3. **Add New Project** → Import repo chứa `catering-app`.
4. **Root Directory:** chọn `catering-app` (nếu repo là thư mục gốc chứa cả catering-app).
5. **Build Command:** `npm run build` (mặc định).
6. **Output Directory:** để mặc định (Next.js tự nhận).
7. (Tùy chọn) **Environment Variables:** thêm `NEXT_PUBLIC_FORMSPREE_FORM_ID` nếu dùng khác với code.
8. Bấm **Deploy**. Sau vài phút bạn có link dạng `https://catering-app-xxx.vercel.app`.
9. Có thể gắn tên miền riêng (ví dụ `cateringtanne.se`) trong **Project → Settings → Domains**.

---

## 3. Cách 2: Deploy lên Netlify

1. Đẩy code lên GitHub/GitLab/Bitbucket.
2. Vào [netlify.com](https://netlify.com) → **Add new site → Import an existing project**.
3. Chọn repo; **Base directory:** `catering-app` (nếu cần).
4. Cấu hình build:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` **không** dùng – Netlify cần plugin Next.js.
5. Cài **Next.js runtime:**  
   **Site settings → Build & deploy → Environment →** thêm `NODE_VERSION = 20` (hoặc 18).  
   Netlify tự nhận Next.js nếu detect đúng.
6. (Khuyến nghị) Dùng **Netlify Next.js plugin** hoặc build command: `npx @netlify/plugin-nextjs` (xem tài liệu Netlify Next.js mới nhất).
7. Deploy. Gắn tên miền trong **Domain settings**.

---

## 4. Cách 3: Server riêng (VPS: Ubuntu / Debian)

### Trên server cần: Node.js 18+ (khuyến nghị 20), PM2, Nginx (hoặc Caddy).

**Bước 1 – Cài Node (ví dụ Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Bước 2 – Đưa code lên server**
- Cách A: Clone repo (nếu code trên Git):
  ```bash
  cd /var/www
  sudo git clone https://github.com/DINH-REPO/catering-app.git
  cd catering-app/catering-app
  ```
- Cách B: Upload thư mục `catering-app` bằng SCP/SFTP hoặc rsync.

**Bước 3 – Build và chạy**
```bash
cd /var/www/catering-app/catering-app   # hoặc đường dẫn bạn đặt
npm ci --production=false
npm run build
```

**Bước 4 – Chạy bằng PM2**
```bash
sudo npm install -g pm2
pm2 start npm --name "catering-tanne" -- start
pm2 save
pm2 startup
```
Ứng dụng chạy tại cổng **3000** (mặc định Next.js).

**Bước 5 – Nginx làm reverse proxy**
Tạo file `/etc/nginx/sites-available/catering-tanne`:
```nginx
server {
    listen 80;
    server_name cateringtanne.se www.cateringtanne.se;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Sau đó:
```bash
sudo ln -s /etc/nginx/sites-available/catering-tanne /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**HTTPS (Let’s Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cateringtanne.se -d www.cateringtanne.se
```

### Cập nhật code / tính năng mới khi chạy trên VPS (Vultr, Hetzner, …)

**Không khó** – bạn chỉ cần làm đúng quy trình: sửa code trên máy (hoặc GitHub) → đưa lên server → build lại → restart app.

**Cách 1 – Dùng Git (khuyến nghị)**  
Mỗi lần bạn chỉnh sửa xong và đã push lên GitHub:

1. SSH vào VPS:
   ```bash
   ssh root@IP_CUA_VPS
   ```
2. Vào thư mục project và kéo code mới:
   ```bash
   cd /var/www/catering-app/catering-app   # đúng đường dẫn bạn đã đặt
   git pull
   npm ci --production=false
   npm run build
   pm2 restart catering-tanne
   ```

**Cách 2 – Upload bằng SCP/SFTP**  
Nếu không dùng Git: upload toàn bộ thư mục `catering-app` (hoặc chỉ các file đổi) lên server, rồi trên server chạy:

```bash
cd /var/www/catering-app/catering-app
npm ci --production=false
npm run build
pm2 restart catering-tanne
```

**Tóm tắt:** Chỉnh sửa code hay thêm tính năng mới đều làm trên máy như bình thường. Khi muốn website phản ánh thay đổi: đưa code lên VPS (git pull hoặc upload) → `npm run build` → `pm2 restart catering-tanne`. Vultr chỉ là nơi chạy server; quy trình update giống mọi VPS khác.

---

## 5. Sau khi deploy

- Kiểm tra form **Begär offert** và **Skicka omdöme** (Formspree) có gửi email đúng.
- Kiểm tra link **tel:** và **mailto:** (số +46 709394679, email).
- Nếu dùng tên miền riêng: trỏ DNS (A record hoặc CNAME) tới IP/server hoặc Vercel/Netlify theo hướng dẫn của từng nền tảng.

---

## 6. Tự động hóa deploy (VPS: Vultr, Hetzner, …)

Có hai cách để **không phải SSH vào tay mỗi lần** update:

### Cách A: GitHub Actions – push code là tự deploy

Mỗi khi bạn **push lên branch `main`**, GitHub tự chạy deploy lên VPS (pull → build → restart PM2).

**Chuẩn bị một lần:**

1. Trên VPS: cài Git, Node, PM2, clone repo (như mục 4), chạy `npm ci`, `npm run build`, `pm2 start` xong.
2. Trên GitHub: vào repo → **Settings → Secrets and variables → Actions** → **New repository secret**, thêm 4 secret:
   - `VPS_HOST` – IP hoặc hostname VPS (vd: `123.45.67.89`).
   - `VPS_USER` – user SSH (thường `root`).
   - `VPS_SSH_KEY` – nội dung **private key** SSH (file `~/.ssh/id_rsa` hoặc key bạn dùng để SSH vào VPS). Copy toàn bộ kể cả dòng `-----BEGIN ... KEY-----` và `-----END ... KEY-----`.
   - `VPS_APP_PATH` – đường dẫn thư mục app trên VPS (vd: `/var/www/catering-app/catering-app` hoặc `/var/www/Tanne-Catering-Projekt/catering-app` nếu repo là cả project).
3. Workflow đã có sẵn trong repo: `.github/workflows/deploy-vps.yml`. Nếu repo của bạn là **cả project** (thư mục cha chứa `catering-app`), cần đặt file workflow ở **root repo** (thư mục cha), không nằm trong `catering-app`, và trên VPS `VPS_APP_PATH` phải trỏ đúng vào thư mục có `package.json` (vd: `.../catering-app`).

Sau đó: chỉ cần **push lên `main`** → vài phút sau website trên VPS đã là bản mới.

### Cách B: Script từ máy – một lệnh deploy

Chạy từ máy (trong thư mục `catering-app`), script sẽ SSH vào VPS và chạy pull + build + restart.

**Chuẩn bị một lần:**

1. Cấu hình biến (chọn một trong hai):
   - **Cách 1:** Tạo file `.env.deploy` (không commit):
     ```bash
     cp .env.deploy.example .env.deploy
     # Sửa .env.deploy: điền VPS_HOST, VPS_USER, VPS_APP_PATH
     ```
   - **Cách 2:** Export trước khi chạy:
     ```bash
     export VPS_HOST=123.45.67.89
     export VPS_USER=root
     export VPS_APP_PATH=/var/www/catering-app/catering-app
     ```
2. SSH key đã được thêm vào VPS (đăng nhập không cần mật khẩu).

**Mỗi lần muốn deploy:**

```bash
cd catering-app
chmod +x deploy.sh   # chỉ lần đầu
./deploy.sh
```

Script sẽ: SSH → `cd VPS_APP_PATH` → `git pull origin main` → `npm ci` → `npm run build` → `pm2 restart catering-tanne`.

---

## Tóm tắt nhanh

| Cách        | Độ khó | Chi phí   | Ghi chú                    |
|------------|--------|-----------|----------------------------|
| **Vercel** | Dễ     | Miễn phí* | Tối ưu cho Next.js, SSL sẵn |
| **Netlify**| Dễ     | Miễn phí* | Cần cấu hình Next.js đúng  |
| **VPS**    | Trung bình | Trả phí VPS | Tự quản lý, cần Nginx + PM2 |

\* Có gói miễn phí; tên miền riêng có thể mất phí tùy nhà đăng ký.
