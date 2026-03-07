/**
 * Agrega la columna images (JSON de rutas) a la tabla products para varias fotos por producto.
 * Ejecutá: node scripts/agregar-product-images.js
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
      "ALTER TABLE `products` ADD COLUMN `images` TEXT NULL AFTER `img`"
    );
    console.log("Columna images agregada a products. Podés guardar un JSON de rutas, ej: [\"foto2.jpg\",\"foto3.jpg\"]");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("La columna images ya existe.");
    } else {
      console.error("Error:", err.message);
    }
  } finally {
    await connection.end();
  }
}

run();
