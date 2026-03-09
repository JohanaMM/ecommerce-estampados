/**
 * Script de uso único: asigna role_id = 1 (admin) al usuario con el email indicado.
 * Uso: node scripts/set-admin-by-email.js
 * Requiere: tener .env con DB_USER, DB_PASSWORD, DB_NAME, etc.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const sequelize = require("sequelize");
const config = require("../src/database/config/config.js")[process.env.NODE_ENV || "development"];

const EMAIL = "johanamartinez904@gmail.com";

async function main() {
  const db = new sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port || 3306,
    dialect: config.dialect || "mysql",
    logging: false,
  });
  const [rows] = await db.query(
    "UPDATE users SET role_id = 1 WHERE email = :email",
    { replacements: { email: EMAIL } }
  );
  const [users] = await db.query(
    "SELECT id, email, first_name, role_id FROM users WHERE email = :email",
    { replacements: { email: EMAIL } }
  );
  if (users.length === 0) {
    console.log("No existe ningún usuario con ese email. Registrate primero en la app y volvé a ejecutar este script.");
    process.exit(1);
  }
  console.log("Usuario actualizado a admin:", users[0]);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
