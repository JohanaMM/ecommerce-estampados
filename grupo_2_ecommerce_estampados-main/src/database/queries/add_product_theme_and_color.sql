-- Añadir columnas theme (subcategoría) y color a la tabla products.
-- Ejecutá en MySQL una sola vez. Si alguna columna ya existe, ignorá ese error.

USE `one_step`;

ALTER TABLE `products` ADD COLUMN `theme` VARCHAR(60) NULL DEFAULT NULL;
ALTER TABLE `products` ADD COLUMN `color` VARCHAR(60) NULL DEFAULT NULL;
