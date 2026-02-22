-- Run in Supabase SQL Editor.
-- Seed menu_items từ dữ liệu tĩnh (vara-tjanster-content, asiatisk-menu, sallader-menu).
-- Yêu cầu: bảng menus phải có các slug: sushi, asiatisk, sallader.
-- Ảnh dùng đường dẫn local – file phải có trong public/ (/sushi-*.png, /dishes/*.png).

-- Xóa dữ liệu cũ (tuỳ chọn – bỏ comment nếu muốn reset trước khi seed)
-- DELETE FROM menu_items;

-- =============================================
-- SUSHI (8 món từ CATERINGMENY_SUSHI.tiers)
-- =============================================
INSERT INTO menu_items (menu_id, name, price, description, image, sort_order, nigiri, uramaki, maki, allergens)
SELECT m.id, t.name, t.price, t.description, t.image, t.sort_order, t.nigiri::jsonb, t.uramaki::jsonb, t.maki::jsonb, NULL
FROM (SELECT id FROM menus WHERE slug = 'sushi' LIMIT 1) m,
(VALUES
  (1, 'Lax Nigiri', '24 kr / par', 'Klassisk nigiri med färsk lax på sushiris.', '/sushi-lax-nigiri.png', '["Lax"]', '[]', '[]'),
  (2, 'Räka Nigiri', '24 kr / par', 'Nigiri med kokta räkor, serveras med färsk gräslök.', '/sushi-raka-nigiri.png', '["Räkor"]', '[]', '[]'),
  (3, 'Avokado Nigiri', '24 kr / par', 'Vegetarisk nigiri med färsk avokado, nori och sesamfrön.', '/sushi-avokado-nigiri.png', '["Avokado"]', '[]', '[]'),
  (4, 'Tonfisk Nigiri', '28 kr / par', 'Nigiri med färsk röd tonfisk (maguro) på sushiris.', '/sushi-tonfisk-nigiri.png', '["Tonfisk"]', '[]', '[]'),
  (5, 'Inari', '11 kr / bit', 'Vegetarisk inari – friterade tofupåsar fyllda med wakamesallad, sesamfrön och sås.', '/sushi-inari.png', '[]', '[]', '[]'),
  (6, 'Familjetallrik 1', 'från 895 kr', 'Blandad sushitallrik med lax-, tonfisk- och avokadonigiri, maki-roller, inari med wakame och ingefära. Perfekt för 4–6 personer.', '/sushi-platter-family-1.png', '["Lax","Tonfisk","Avokado"]', '[]', '["Blandat urval"]'),
  (7, 'Familjetallrik 2', 'från 995 kr', 'Lyxig tallrik med lax- och tonfisknigiri, maki med jordgubbe, avokado och krispig lök, inari med wakame och rom. Serveras för 4–6 personer.', '/sushi-platter-family-2.png', '["Lax","Tonfisk"]', '[]', '["Jordgubbe & lax","Avokado & krispig lök","Tonfisk & krispig lök"]'),
  (8, 'Lyxtallrik', 'från 1 195 kr', 'Imponerande tallrik med lax-tartar i centrum, tonfisksashimi, uramaki med avokado, rom och krispig lök. Serveras för 5–8 personer.', '/sushi-platter-deluxe.png', '["Tonfisk"]', '["Avokado & krispig lök","Lax & sås","Rom"]', '[]')
) AS t(sort_order, name, price, description, image, nigiri, uramaki, maki);

-- =============================================
-- ASIATISK (11 món từ ASIATISK_MENU_ITEMS)
-- =============================================
INSERT INTO menu_items (menu_id, name, price, description, image, sort_order, nigiri, uramaki, maki, allergens)
SELECT m.id, t.name, t.price, t.description, t.image, t.sort_order, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, t.allergens
FROM (SELECT id FROM menus WHERE slug = 'asiatisk' LIMIT 1) m,
(VALUES
  (1, 'GYOZA – STEKTA DUMPLINGS', '135,00 kr', 'Stekta japanska dumplings med krispig botten, fyllda med köttfärs och grönsaker. Serveras med dipsås.', '/dishes/dish-gyoza.png', 'gluten, soja'),
  (2, 'VÅRRULLAR – STEKTA', '125,00 kr', 'Krispiga stekta vårrullar med färska grönsaker. Serveras med sötsur dipsås och färska örter.', '/dishes/dish-spring-rolls.png', 'gluten, ägg'),
  (3, 'FÄRSKA VÅRRULLAR – GỎI CUỐN', '130,00 kr', 'Vietnamesiska färska vårrullar i rispapper med räkor, sallad och risnudlar. Serveras med kryddig nuoc cham-dipsås.', '/dishes/dish-fresh-spring-rolls.png', 'skaldjur'),
  (4, 'BAO BUNS – FLÄSKMAGE', '145,00 kr', 'Mjuka ångade bao-bullar fyllda med glaserad fläskmage, inlagda morötter, grönlök och sesamfrön.', '/dishes/dish-bao-pork.png', 'gluten, soja'),
  (5, 'BÁNH MÌ – VIETNAMESISK SANDWICH', '140,00 kr', 'Krispig baguette med fläsk, inlagda morötter och rättika, färsk koriander, gurka och jalapeño.', '/dishes/dish-banh-mi.png', 'gluten, jordnötter (kan tillagas utan)'),
  (6, 'PAD THAI', '155,00 kr', 'Klassiska thailändska wokade nudlar med ägg, grönsaker och sötsur sås.', '/dishes/dish-pad-thai.png', 'jordnötter, ägg, gluten'),
  (7, 'STEKTA RIS MED KYCKLING', '145,00 kr', 'Asiatiskt wokat ris med kyckling och blandade grönsaker.', '/dishes/dish-stekta-ris-kyckling.png', 'ägg, soja'),
  (8, 'WOK MED RYGGBIFF OCH HARICOTS VERTS', '165,00 kr', 'Wokade nudlar med möra ryggbiffstrimlor, krispiga haricots verts och kryddig sås.', '/dishes/dish-wok-ryggbiff-haricots.png', 'gluten, soja'),
  (9, 'OXGRYTA I RÖDVIN', '159,00 kr', 'Långkokt oxgryta i rödvinssås, serveras med ris eller potatis.', '/dishes/dish-oxgryta-rodvin.png', 'gluten, alkohol (rödvin)'),
  (10, 'TERIYAKI LAX', '175,00 kr', 'Stekt lax med teriyakisås, serveras med grönsaker och ris.', '/dishes/dish-teriyaki-lax.png', 'fisk, soja'),
  (11, 'BARNMENY – STEKT RIS', '95,00 kr', 'Enkelt stekt ris med mild smak, lämplig för barn.', NULL, 'ägg')
) AS t(sort_order, name, price, description, image, allergens);

-- =============================================
-- SALLADER (3 món từ SALLADER_BUFFE_ITEMS)
-- =============================================
INSERT INTO menu_items (menu_id, name, price, description, image, sort_order, nigiri, uramaki, maki, allergens)
SELECT m.id, t.name, t.price, t.description, t.image, t.sort_order, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL
FROM (SELECT id FROM menus WHERE slug = 'sallader' LIMIT 1) m,
(VALUES
  (1, 'Köldelar & Osttallrik', '90 kr / portion', 'Blandad tallrik med prosciutto, ost, körsbärstomater, oliver, kapris, chorizo och druvor. Serveras på salladsblad.', '/dishes/sallad-buffe-1.png'),
  (2, 'Färsk Salladsset', '120 kr / portion', 'Tallrik med physalis, körsbärstomater, skivad kyckling-/kalkonfile, druvor, gurka, sparris och salladsblad. Perfekt till buffé.', '/dishes/sallad-buffe-2.png'),
  (3, 'Rostbiff & Grönsaker', '120 kr / portion', 'Skivad rostbiff med körsbärstomater, gurka, sallad, röd paprika, inlagda grönsaker och ost. Perfekt till buffé.', '/dishes/sallad-rostbiff.png')
) AS t(sort_order, name, price, description, image);
