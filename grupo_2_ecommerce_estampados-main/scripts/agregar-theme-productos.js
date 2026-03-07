/**
 * Agrega la columna theme a la tabla products (tema: Bandas, Videojuegos, Series, etc.).
 * Ejecutá: node scripts/agregar-theme-productos.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mysql = require("mysql2/promise");

async function run() {
  const config = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "one_step",
  };
  let connection;
  try {
    connection = await mysql.createConnection(config);
  } catch (err) {
    console.error("No se pudo conectar a MySQL:", err.message);
    process.exit(1);
  }
  try {
    await connection.execute(
      "ALTER TABLE `products` ADD COLUMN `theme` VARCHAR(60) NULL AFTER `genre_id`"
    );
    console.log("Columna theme agregada a products.");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("La columna theme ya existe.");
    } else {
      console.error("Error:", err.message);
    }
  } finally {
    await connection.end();
  }
}

run();
