-- Add diet_type column to menu_items for displaying meat/fish/vegetarian
-- Run this in Supabase SQL editor: Table Editor -> menu_items -> or SQL Editor
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS diet_type text;

COMMENT ON COLUMN menu_items.diet_type IS 'Comma-separated: meat, fish, skaldjur, vegetarian (e.g. meat,fish,skaldjur)';
