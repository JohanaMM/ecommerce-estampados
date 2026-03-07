/**
 * Agrega la columna shipping_status a la tabla orders (seguimiento de envío).
 * Ejecutá: node scripts/agregar-shipping-status.js
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
      "ALTER TABLE `orders` ADD COLUMN `shipping_status` VARCHAR(30) NULL DEFAULT 'pendiente' AFTER `modified_date`"
    );
    console.log("Columna shipping_status agregada a orders.");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("La columna shipping_status ya existe.");
    } else {
      console.error("Error:", err.message);
    }
  } finally {
    await connection.end();
  }
}

run();
