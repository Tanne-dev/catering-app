-- Chạy trong Supabase SQL Editor sau khi đã upload ảnh.
-- 1. Chuyển sushi-*.png sang dishes/ (vì sushi-* đã xóa, dùng dish thay thế)
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-nigiri-trays.png' WHERE image LIKE '%sushi-lax-nigiri%';
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-nigiri-sauce.png' WHERE image LIKE '%sushi-raka-nigiri%';
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-avocado-rolls.png' WHERE image LIKE '%sushi-avokado-nigiri%';
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-salmon-sashimi.png' WHERE image LIKE '%sushi-tonfisk-nigiri%';
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-seaweed-salad.png' WHERE image LIKE '%sushi-inari%';
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-sushi-platter.png' WHERE image LIKE '%sushi-platter-family-1%';
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-sushi-platter-mixed.png' WHERE image LIKE '%sushi-platter-family-2%';
UPDATE menu_items SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images/dishes/dish-salmon-platter.png' WHERE image LIKE '%sushi-platter-deluxe%';
-- 2. Cập nhật các đường dẫn local còn lại sang Supabase URL
UPDATE menu_items
SET image = 'https://tneqkuvuvttjdymvrbiq.supabase.co/storage/v1/object/public/menu-images' || substring(image from 2)
WHERE image IS NOT NULL
  AND image LIKE '/%'
  AND image NOT LIKE 'http%';
