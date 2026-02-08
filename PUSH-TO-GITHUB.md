# Push lên GitHub repo `catering-app`

Repo đã có git (branch `main`, working tree clean). Chỉ cần trỏ remote đúng rồi push.

## 1. Tạo repo trên GitHub (nếu chưa có)

- Vào [github.com/new](https://github.com/new)
- **Repository name:** `catering-app`
- **Public** (hoặc Private tùy bạn)
- **Không** tích "Add a README" / "Initialize with .gitignore"
- Click **Create repository**

## 2. Trỏ remote và push (trên máy bạn)

Trong terminal, mở thư mục `catering-app` và chạy (thay **USERNAME** bằng username GitHub của bạn):

```bash
cd "/Users/tanne/Tanne Catering Projekt/catering-app"

# Trỏ origin tới repo catering-app của bạn
git remote set-url origin https://github.com/USERNAME/catering-app.git

# Kiểm tra
git remote -v

# Push lên GitHub
git push -u origin main
```

Ví dụ username là `tanne-dev`:

```bash
git remote set-url origin https://github.com/tanne-dev/catering-app.git
git push -u origin main
```

Nếu GitHub bắt đăng nhập: dùng **Personal Access Token** thay mật khẩu, hoặc cấu hình SSH (dùng URL `git@github.com:USERNAME/catering-app.git`).

## 3. Nếu dùng SSH

```bash
git remote set-url origin git@github.com:USERNAME/catering-app.git
git push -u origin main
```

Sau khi push xong, code sẽ nằm tại: `https://github.com/USERNAME/catering-app`
