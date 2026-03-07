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
export const IMG_BASE_URL = `${API_BASE_URL}/img`;

/** Dominio de Mercado Pago para redirección (ej. com.co, com.ar) */
export const MERCADOPAGO_DOMAIN =
  process.env.REACT_APP_MERCADOPAGO_DOMAIN || "com.co";
