/**
 * Configuración de la aplicación.
 * En producción, definir REACT_APP_API_URL en el entorno de build.
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000";

export const API_PRODUCTS = `${API_BASE_URL}/api/products`;
export const API_USERS = `${API_BASE_URL}/api/users`;
export const API_PAYMENTS = `${API_BASE_URL}/api/payments`;
export const API_SHIPPING = `${API_BASE_URL}/api/shipping`;
export const API_ORDERS = `${API_BASE_URL}/api/orders`;
export const API_CONTACT = `${API_BASE_URL}/api/contact`;
export const API_ADMIN = `${API_BASE_URL}/api/admin`;
export const IMG_BASE_URL = `${API_BASE_URL}/img`;

/** Clave para API admin (mismo valor que ADMIN_SECRET en el backend). Por defecto la del .env.example para que funcione sin configurar. */
const DEFAULT_ADMIN_SECRET = "clave-admin-prueba-2025";
export const getAdminKey = () => process.env.REACT_APP_ADMIN_SECRET || DEFAULT_ADMIN_SECRET;

/** Headers para llamadas al panel admin (X-Admin-Key = REACT_APP_ADMIN_SECRET) */
export const getAdminHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Admin-Key": getAdminKey(),
});

/** Dominio de Mercado Pago para redirección (ej. com.co, com.ar) */
export const MERCADOPAGO_DOMAIN =
  process.env.REACT_APP_MERCADOPAGO_DOMAIN || "com.co";
