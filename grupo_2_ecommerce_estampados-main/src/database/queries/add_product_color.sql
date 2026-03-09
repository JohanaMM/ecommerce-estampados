-- Añadir columna color a products (para el panel admin).
-- Ejecutá en MySQL una sola vez. Si la columna ya existe, ignorá el error.

USE `one_step`;

ALTER TABLE `products` ADD COLUMN `color` VARCHAR(60) NULL DEFAULT NULL AFTER `theme`;
