-- Run in Supabase SQL Editor.
-- Thêm cột address (leveransadress) vào bảng orders.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT;
