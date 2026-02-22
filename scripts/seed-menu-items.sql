-- Run in Supabase SQL Editor.
-- =============================================
-- 1. Tạo bucket menu-images cho ảnh món ăn
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Policy: cho phép upload (INSERT) và đọc (SELECT) cho storage
DROP POLICY IF EXISTS "Allow upload and select menu images" ON storage.objects;
CREATE POLICY "Allow upload and select menu images"
ON storage.objects FOR ALL
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

-- =============================================
-- RLS cho menu_items (tránh lỗi "new row violates row-level security policy")
-- API đã kiểm tra admin qua NextAuth trước khi gọi Supabase
-- =============================================
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read menu_items" ON menu_items;
CREATE POLICY "Allow public read menu_items"
ON menu_items FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow anon insert menu_items" ON menu_items;
CREATE POLICY "Allow anon insert menu_items"
ON menu_items FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update menu_items" ON menu_items;
CREATE POLICY "Allow anon update menu_items"
ON menu_items FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon delete menu_items" ON menu_items;
CREATE POLICY "Allow anon delete menu_items"
ON menu_items FOR DELETE
USING (true);

-- =============================================
-- 2. Seed menu items (optional)
-- =============================================
-- Get menu IDs first (run: SELECT id, slug FROM menus;)
-- Replace MENU_ID_SUSHI, MENU_ID_ASIATISK, MENU_ID_SALLADER below with actual UUIDs.

-- Example for Sushi (replace MENU_ID_SUSHI with actual UUID from menus table):
/*
INSERT INTO menu_items (menu_id, name, price, description, image, sort_order, nigiri, uramaki, maki) VALUES
  ((SELECT id FROM menus WHERE slug = 'sushi'), 'Lax Nigiri', '24 kr / par', 'Klassisk nigiri med färsk lax på sushiris.', '/sushi-lax-nigiri.png', 1, '["Lax"]', '[]', '[]'),
  ((SELECT id FROM menus WHERE slug = 'sushi'), 'Räka Nigiri', '24 kr / par', 'Nigiri med kokta räkor, serveras med färsk gräslök.', '/sushi-raka-nigiri.png', 2, '["Räkor"]', '[]', '[]');
*/

-- To seed all data, run the migration script or add items manually via Admin > Hantera menyer.
