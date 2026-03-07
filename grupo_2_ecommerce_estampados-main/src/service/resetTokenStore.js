/**
 * Almacén en memoria de tokens de recupero de contraseña.
 * En producción podrías usar Redis o una columna en la tabla users.
 */
const tokens = new Map();
const EXPIRY_MS = 60 * 60 * 1000; // 1 hora

function set(token, userId) {
  tokens.set(token, { userId, expires: Date.now() + EXPIRY_MS });
}

function get(token) {
  const data = tokens.get(token);
  if (!data) return null;
  if (Date.now() > data.expires) {
    tokens.delete(token);
    return null;
  }
  return data.userId;
}

function remove(token) {
  tokens.delete(token);
}

module.exports = { set, get, remove };
