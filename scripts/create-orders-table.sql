-- Run in Supabase SQL Editor.
-- Tạo bảng orders để lưu đơn hàng / offertförfrågningar.

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_date TEXT,
  guests TEXT,
  service TEXT,
  message TEXT,
  cart_summary TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: public read cho admin, allow insert từ API
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read orders" ON orders;
CREATE POLICY "Allow public read orders"
ON orders FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow insert orders" ON orders;
CREATE POLICY "Allow insert orders"
ON orders FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update orders" ON orders;
CREATE POLICY "Allow update orders"
ON orders FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete orders" ON orders;
CREATE POLICY "Allow delete orders"
ON orders FOR DELETE
USING (true);
