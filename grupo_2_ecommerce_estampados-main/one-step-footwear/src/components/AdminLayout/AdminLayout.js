import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Panel Admin</h2>
        <nav className="admin-nav">
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}
            end={false}
          >
            Productos
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}
          >
            Pedidos pendientes
          </NavLink>
        </nav>
        <NavLink to="/" className="admin-link admin-link-back">
          ← Volver al sitio
        </NavLink>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
