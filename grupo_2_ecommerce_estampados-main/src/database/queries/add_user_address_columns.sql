-- Agregar columnas de dirección y teléfono a users (para envío y perfil)
-- Ejecutar en MySQL. Si alguna línea da error "duplicate column", omitila.

USE `one_step`;

ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(30) NULL AFTER `avatar_img`;
ALTER TABLE `users` ADD COLUMN `address_street` VARCHAR(200) NULL AFTER `phone`;
ALTER TABLE `users` ADD COLUMN `address_number` VARCHAR(20) NULL AFTER `address_street`;
ALTER TABLE `users` ADD COLUMN `address_depto` VARCHAR(50) NULL AFTER `address_number`;
ALTER TABLE `users` ADD COLUMN `address_province` VARCHAR(100) NULL AFTER `address_depto`;
ALTER TABLE `users` ADD COLUMN `address_city` VARCHAR(100) NULL AFTER `address_province`;
ALTER TABLE `users` ADD COLUMN `address_postal_code` VARCHAR(20) NULL AFTER `address_city`;
