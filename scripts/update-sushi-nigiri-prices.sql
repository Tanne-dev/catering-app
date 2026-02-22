-- Run in Supabase SQL Editor.
-- Update prices for Lax, Räka, Avokado (24 kr/par) and Tonfisk (28 kr/par).

UPDATE menu_items SET price = '24 kr / par' WHERE name IN ('Lax Nigiri', 'Räka Nigiri', 'Avokado Nigiri');
UPDATE menu_items SET price = '28 kr / par' WHERE name = 'Tonfisk Nigiri';
