/**
 * Middleware para rutas API de administrador.
 * En desarrollo (NODE_ENV=development) deja pasar sin clave.
 * En producción exige header X-Admin-Key igual a ADMIN_SECRET.
 */
function adminApiMiddleware(req, res, next) {
  if (req.method === "OPTIONS") return next();
  if (process.env.NODE_ENV === "development") return next();
  const secret = process.env.ADMIN_SECRET;
  const key = (req.headers["x-admin-key"] || "").trim();
  if (!secret || key !== secret) {
    return res.status(403).json({
      message: "No autorizado. Revisá ADMIN_SECRET en el .env del backend y X-Admin-Key en el frontend.",
      status: 403
    });
  }
  next();
}

module.exports = adminApiMiddleware;
