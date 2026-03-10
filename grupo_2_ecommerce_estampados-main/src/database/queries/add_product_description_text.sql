-- Descripción de productos sin límite de caracteres (permite viñetas y texto largo)
-- Ejecutar una vez si la columna description es VARCHAR(100):
ALTER TABLE products MODIFY COLUMN description TEXT NOT NULL;
