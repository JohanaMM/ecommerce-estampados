-- 
-- CREATE DATABASE
--
CREATE DATABASE  IF NOT EXISTS `one_step`;
USE `one_step`;

-- 
-- TABLES
--

CREATE TABLE `orderStatus` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `is_active` INT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NOT NULL,
  `price` INT NOT NULL,
  `category_id` INT NULL,
  `brand_id` INT NULL,
  `genre_id` INT NULL,
  `img` VARCHAR(45) NOT NULL,
  `is_active` INT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `avatar_img` VARCHAR(45) NOT NULL,
  `role_id` INT NULL,
  `is_active` INT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `carts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `order_id` INT NULL,
  `product_id` INT NULL,
  `product_quantity` INT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `total` INT NOT NULL,
  `status_id` INT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `is_active` INT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `brands` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `is_active` INT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `sizes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `size` VARCHAR(45) NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `genres` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `stock` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NULL,
  `size_id` INT NULL,
  `available_quantity` INT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_date` DATETIME NULL,
  PRIMARY KEY (`id`));

-- 
-- FOREIGN KEYS
--

ALTER TABLE `users` 
ADD CONSTRAINT `FK_users_roles`
  FOREIGN KEY (`role_id`)
  REFERENCES `roles` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL;

ALTER TABLE `orders` 
ADD CONSTRAINT `FK_orders_users`
  FOREIGN KEY (`user_id`)
  REFERENCES `users` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL,
ADD CONSTRAINT `FK_orders_orderStatus`
  FOREIGN KEY (`status_id`)
  REFERENCES `orderStatus` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL;

ALTER TABLE `carts` 
ADD CONSTRAINT `FK_carts_users`
  FOREIGN KEY (`user_id`)
  REFERENCES `users` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL,
ADD CONSTRAINT `FK_carts_products`
  FOREIGN KEY (`product_id`)
  REFERENCES `products` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL,
ADD CONSTRAINT `FK_carts_orders`
  FOREIGN KEY (`order_id`)
  REFERENCES `orders` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL;

ALTER TABLE `stock`
ADD CONSTRAINT `FK_stock_products`
  FOREIGN KEY (`product_id`)
  REFERENCES `products` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL, 
ADD CONSTRAINT `FK_stock_sizes`
  FOREIGN KEY (`size_id`)
  REFERENCES `sizes` (`id`)
  ON DELETE SET NULL
  ON UPDATE SET NULL;
  INSERT INTO `roles` (`id`,`name`,`is_active`)
VALUES
(1,'Admin', 1),
(2,'User', 1);

-- 1 - Activa: items en carrito
-- 2 - Pendiente: cuando se le da en comprar
-- 3 - Cerrada: cuando se le da en pagar

INSERT INTO `orderStatus` (`id`,`name`)
VALUES
(1,'Activa'),
(2,'Pendiente'),
(3,'Finalizada'); 

INSERT INTO `categories` (`id`,`name`,`is_active`)
VALUES
(1,'Running', 1),
(2,'Lifestyle', 1),
(3,'Training', 1),
(4,'Fútbol', 1);

INSERT INTO `brands` (`id`,`name`,`is_active`)
VALUES
(1,'Adidas', 1),
(2,'Nike', 1),
(3,'Vans', 1),
(4,'Puma', 1);

INSERT INTO `genres` (`id`,`name`)
VALUES
(1,'Hombre'),
(2,'Mujer');

INSERT INTO `sizes` (`id`,`size`)
VALUES
(1,'US 5'),
(2,'US 5.5'),
(3,'US 6'),
(4,'US 6.5'),
(5,'US 7'),
(6,'US 7.5'),
(7,'US 8'),
(8,'US 8.5'),
(9,'US 9'),
(10,'US 9.5'),
(11,'US 10'),
(12,'US 10.5'),
(13,'US 11'),
(14,'US 11.5'),
(15,'US 12'),
(16,'US 12.5'),
(17,'US 13');

INSERT INTO `users` (`id`,`first_name`,`last_name`,`email`,`password`,`avatar_img`,`role_id`,`is_active`)
VALUES
(1,'Danna','Holguin','davahodi04@gmail.com','$2a$10$bjTcZaZ8y2AsB2ICFlc1B.O8YpSs4yUuAO.V508suOz3sSUIwu06y','1671036219012.png',1,1),
(2,'Juan','Correa','juansecorrea12@gmail.com','$2a$10$.rUx2Q0VrrSVIb0.8O61kOvr/dM4GhJ.8w3.UBghbPB0ADSokB9z.','1671036234984.png',2,1),
(3,'Jose','Restrepo','josepablorestrepo@gmail.com','$2a$10$TG78g4pwFJXEkRl2cCTo/uzM1uV8SI6NVw1Q3nof6arHnwdVqSN.a','1671036249232.png',1,1),
(4,'Luis','Canales','enrique_canoli@gmail.com','$2a$10$OGHyDtCiriUynb.5MDVnDOyQVpC01k.wPGPzDh/Nd3gOMm1rY7bhK','1671036261585.png',2,1),
(5,'Yeidy','Aguirre','yeidyaguirre@gmail.com','$2a$10$RYlLaZaQudxlsI.dp4js6unXwRWoFUtCT.R1HwArLlU5nLoLQRlW6','1671036305780.png',2,1);

INSERT INTO `products` (`id`,`name`,`description`,`price`,`category_id`,`brand_id`,`genre_id`,`img`,`is_active`)
VALUES
(1,'Air Max 90','Comodidad y estilo',450000,2,2,1,'nike-air-max90.jpeg',1),
(2,'Yeezy','Estilo urbano con el mejor soporte',760000,2,1,1,'adidas-yeezy.jpeg',1),
(3,'Old Skool','Atrévete a usar ese zapato que tanto te gusta',280000,2,3,2,'vans-old-skool.jpeg',1),
(4,'RS-X','Sin prisa pero sin pausa',510000,1,4,1,'puma-rsx.jpeg',1);

INSERT INTO `stock` (`id`,`product_id`,`size_id`,`available_quantity`)
VALUES
(1,1,9,15),
(2,1,5,10),
(3,2,3,5),
(4,2,4,20),
(5,3,8,30),
(6,3,7,2),
(7,3,2,25),
(8,4,10,4),
(9,4,11,12),
(10,4,13,2);
