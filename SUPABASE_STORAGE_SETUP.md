# Supabase Storage – Bucket cho ảnh menu

Để upload ảnh món ăn lên Supabase, cần tạo bucket **menu-images**.

## Các bước

1. Vào [Supabase Dashboard](https://supabase.com/dashboard) → chọn project
2. Vào **Storage** (menu bên trái)
3. Bấm **New bucket**
4. **Name:** `menu-images`
5. Bật **Public bucket** (để ảnh có thể hiển thị trên web)
6. Bấm **Create bucket**
7. Vào bucket → **Policies** → thêm policy cho phép upload:
   - **Policy name:** Allow uploads
   - **Allowed operation:** INSERT
   - **Target roles:** authenticated (hoặc để trống nếu dùng anon)
   - **Policy definition:** `true` (cho phép tất cả – API đã kiểm tra admin)

Hoặc dùng policy đơn giản: cho phép **INSERT** và **SELECT** với điều kiện `true` nếu bucket đã public.
