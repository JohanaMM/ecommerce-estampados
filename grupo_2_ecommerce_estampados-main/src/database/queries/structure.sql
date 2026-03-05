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