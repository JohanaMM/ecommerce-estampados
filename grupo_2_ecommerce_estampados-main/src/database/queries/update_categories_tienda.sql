-- Categorías para la tienda (tipo de producto: remeras, termos, etc.)
-- Ejecutá en MySQL. Ajustá según tu base (puedes agregar más o cambiar nombres).

USE `one_step`;

-- Opción A: Si querés reemplazar las categorías existentes (descomentá si aplica)
-- DELETE FROM `products` WHERE 1=1;
-- UPDATE `products` SET category_id = NULL WHERE 1=1;
-- DELETE FROM `categories` WHERE id IN (1,2,3,4);

-- Opción B: Insertar nuevas categorías (tipo de producto) sin borrar las que tenés
INSERT IGNORE INTO `categories` (`name`, `is_active`) VALUES
('Remeras', 1),
('Termos', 1),
('Pad mouse', 1),
('Gorras', 1),
('Tazas', 1),
('Stickers', 1),
('Buzos', 1);

-- Luego asigná category_id y theme a tus productos según corresponda, por ejemplo:
-- UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Remeras' LIMIT 1), theme = 'Videojuegos' WHERE id = 1;
