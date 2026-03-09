import { Navigate, useLocation } from "react-router-dom";

/**
 * Obtiene el usuario guardado (localStorage o sessionStorage).
 * @returns {object|null}
 */
export function getStoredUser() {
  try {
    const fromStorage = localStorage.getItem("user") || sessionStorage.getItem("user");
    return fromStorage ? JSON.parse(fromStorage) : null;
  } catch {
    return null;
  }
}

/**
 * Comprueba si el usuario actual es administrador (role_id === 1).
 */
export function isAdmin() {
  const user = getStoredUser();
  return user && Number(user.role_id) === 1;
}

/**
 * Protege rutas de admin: solo permite acceso si hay usuario con role_id === 1.
 * Si no está logueado o no es admin, redirige a /login (guardando la ruta en state).
 */
function AdminGuard({ children }) {
  const location = useLocation();
  if (!isAdmin()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default AdminGuard;
