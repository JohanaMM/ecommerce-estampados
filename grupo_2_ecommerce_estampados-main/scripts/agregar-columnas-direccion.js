/**
 * Script para agregar las columnas de dirección y teléfono a la tabla users.
 * Ejecutá desde la raíz del proyecto: node scripts/agregar-columnas-direccion.js
 *
 * Usa las mismas variables de .env que el servidor (DB_USER, DB_PASSWORD, DB_NAME, etc.).
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mysql = require("mysql2/promise");

const alterStatements = [
  "ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(30) NULL AFTER `avatar_img`",
  "ALTER TABLE `users` ADD COLUMN `address_street` VARCHAR(200) NULL AFTER `phone`",
  "ALTER TABLE `users` ADD COLUMN `address_number` VARCHAR(20) NULL AFTER `address_street`",
  "ALTER TABLE `users` ADD COLUMN `address_depto` VARCHAR(50) NULL AFTER `address_number`",
  "ALTER TABLE `users` ADD COLUMN `address_province` VARCHAR(100) NULL AFTER `address_depto`",
  "ALTER TABLE `users` ADD COLUMN `address_city` VARCHAR(100) NULL AFTER `address_province`",
  "ALTER TABLE `users` ADD COLUMN `address_postal_code` VARCHAR(20) NULL AFTER `address_city`",
];

async function run() {
  const config = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "one_step",
  };

  console.log("Conectando a la base de datos", config.database, "en", config.host + ":" + config.port);

  let connection;
  try {
    connection = await mysql.createConnection(config);
  } catch (err) {
    console.error("No se pudo conectar a MySQL. Revisá que:");
    console.error("  1. MySQL esté instalado y corriendo.");
    console.error("  2. En tu archivo .env estén bien DB_USER, DB_PASSWORD, DB_NAME (one_step).");
    console.error("Error:", err.message);
    process.exit(1);
  }

  let ok = 0;
  let skip = 0;
  for (const sql of alterStatements) {
    try {
      await connection.execute(sql);
      console.log("  OK:", sql.substring(0, 60) + "...");
      ok++;
    } catch (err) {
      if (err.code === "ER_DUP_FIELDNAME" || (err.message && err.message.includes("Duplicate column"))) {
        console.log("  (ya existe):", sql.substring(0, 55) + "...");
        skip++;
      } else {
        console.error("  Error:", err.message);
      }
    }
  }

  await connection.end();
  console.log("");
  console.log("Listo. Columnas agregadas:", ok, skip ? ", omitidas (ya existían): " + skip : "");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
