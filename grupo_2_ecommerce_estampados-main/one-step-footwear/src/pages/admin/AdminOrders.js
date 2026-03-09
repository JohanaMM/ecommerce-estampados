import { useState, useEffect } from "react";
import { API_ADMIN, getAdminHeaders } from "../../config";
import "./AdminOrders.css";

const ESTADOS_ENVIO = [
  { value: "pendiente", label: "Pendiente" },
  { value: "preparando", label: "Preparando" },
  { value: "enviado", label: "Enviado" },
  { value: "en_camino", label: "En camino" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingOnly, setPendingOnly] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_ADMIN}/orders${pendingOnly ? "?pending=true" : ""}`;
      const res = await fetch(url, { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("No se pudieron cargar los pedidos");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      setError(e.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [pendingOnly]);

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError("");
    try {
      const res = await fetch(`${API_ADMIN}/orders/${orderId}/status`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ shipping_status: newStatus }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, shipping_status: newStatus } : o))
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1>Pedidos</h1>
        <label className="admin-orders-filter">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={(e) => setPendingOnly(e.target.checked)}
          />
          Solo pendientes
        </label>
      </div>
      {error && <div className="admin-products-error">{error}</div>}
      {loading ? (
        <div className="admin-products-loading">Cargando pedidos…</div>
      ) : (
        <div className="admin-orders-table-wrap">
          <table className="admin-products-table admin-orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Total</th>
                <th>Estado de envío</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-orders-empty">
                    No hay pedidos {pendingOnly ? "pendientes" : ""}.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      {o.User
                        ? `${o.User.first_name || ""} ${o.User.last_name || ""}`.trim() || "—"
                        : "—"}
                    </td>
                    <td>{o.User?.email ?? "—"}</td>
                    <td>${o.total}</td>
                    <td>
                      <select
                        className="admin-orders-status-select"
                        value={o.shipping_status || "pendiente"}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                      >
                        {ESTADOS_ENVIO.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {updatingId === o.id && <span className="admin-orders-updating">Guardando…</span>}
                    </td>
                    <td>{formatDate(o.created_date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
