import React, { useState, useEffect } from "react";
import { API_USERS, API_ORDERS } from "../../config";
import { PROVINCIAS, CIUDADES, LOCALIDADES_POR_CIUDAD } from "../../data/ubicaciones";
import "./Perfil.css";

const emptyForm = () => ({
  first_name: "",
  last_name: "",
  phone: "",
  address_street: "",
  address_number: "",
  address_depto: "",
  address_province: "",
  address_ciudad: "",
  address_localidad: "",
  address_postal_code: "",
});

const localidadesForCiudad = (ciudad) => LOCALIDADES_POR_CIUDAD[ciudad] || [];

const SHIPPING_LABELS = {
  pendiente: "Pendiente de envío",
  enviado: "Enviado",
  en_camino: "En camino",
  entregado: "Entregado",
};

function Perfil() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch(`${API_USERS}/${user.id}`).then((r) => r.json()),
      fetch(`${API_ORDERS}?userId=${user.id}`).then((r) => r.json()).catch(() => []),
    ])
      .then(([profileData, ordersList]) => {
        setProfile(profileData);
        setOrders(Array.isArray(ordersList) ? ordersList : []);
        const cityStr = profileData?.address_city || "";
        const parts = cityStr.split(",").map((s) => s?.trim() || "");
        setForm({
          first_name: profileData?.first_name || "",
          last_name: profileData?.last_name || "",
          phone: profileData?.phone || "",
          address_street: profileData?.address_street || "",
          address_number: profileData?.address_number || "",
          address_depto: profileData?.address_depto || "",
          address_province: profileData?.address_province || "",
          address_ciudad: profileData?.address_ciudad || parts[0] || "",
          address_localidad: profileData?.address_localidad || parts[1] || parts[0] || "",
          address_postal_code: profileData?.address_postal_code || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const updateForm = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "address_ciudad") next.address_localidad = "";
      return next;
    });
  };

  const handleSave = () => {
    if (!user?.id) return;
    setSaving(true);
    setSavedOk(false);
    fetch(`${API_USERS}/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (r.ok) {
          setProfile({ ...profile, ...form });
          setSavedOk(true);
          setEditing(false);
          setTimeout(() => setSavedOk(false), 3000);
        }
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="perfil-page">
        <div className="perfil-hero">
          <h1>Tu perfil</h1>
        </div>
        <p className="perfil-loading">Cargando tu perfil…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="perfil-page">
        <div className="perfil-hero">
          <h1>Tu perfil</h1>
        </div>
        <p className="perfil-hint">Iniciá sesión para ver tu información y mis compras.</p>
      </div>
    );
  }

  const cityStr = profile?.address_city || "";
  const [ciudad, localidad] = cityStr.split(",").map((s) => s?.trim() || "");
  const addressCiudad = profile?.address_ciudad || ciudad;
  const addressLocalidad = profile?.address_localidad || localidad || ciudad;

  return (
    <div className="perfil-page">
      <div className="perfil-hero">
        <h1>Tu perfil</h1>
        <p className="perfil-hero-email">{profile?.email}</p>
      </div>

      <section className="perfil-card">
        <div className="perfil-card-head">
          <h2>Datos personales y dirección</h2>
          {!editing ? (
            <button type="button" className="perfil-btn perfil-btn-edit" onClick={() => setEditing(true)}>
              Editar
            </button>
          ) : (
            <div className="perfil-card-actions">
              <button type="button" className="perfil-btn perfil-btn-cancel" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              <button type="button" className="perfil-btn perfil-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          )}
        </div>
        {savedOk && <p className="perfil-saved-ok">Se guardaron tus datos correctamente.</p>}

        {!editing ? (
          <div className="perfil-datos">
            <div className="perfil-block">
              <h3>Datos personales</h3>
              <dl className="perfil-dl">
                <dt>Nombre</dt>
                <dd>{profile?.first_name || "—"}</dd>
                <dt>Apellido</dt>
                <dd>{profile?.last_name || "—"}</dd>
                <dt>Teléfono</dt>
                <dd>{profile?.phone || "—"}</dd>
              </dl>
            </div>
            <div className="perfil-block">
              <h3>Dirección de envío</h3>
              <dl className="perfil-dl">
                <dt>Calle y número</dt>
                <dd>
                  {profile?.address_street || "—"}
                  {profile?.address_number ? ` ${profile.address_number}` : ""}
                  {profile?.address_depto ? `, ${profile.address_depto}` : ""}
                </dd>
                <dt>Provincia</dt>
                <dd>{profile?.address_province || "—"}</dd>
                <dt>Ciudad</dt>
                <dd>{addressCiudad || "—"}</dd>
                <dt>Localidad</dt>
                <dd>{addressLocalidad || "—"}</dd>
                <dt>Código postal</dt>
                <dd>{profile?.address_postal_code || "—"}</dd>
              </dl>
            </div>
          </div>
        ) : (
          <div className="perfil-form">
            <div className="perfil-form-grid">
              <div className="perfil-field">
                <label>Nombre</label>
                <input value={form.first_name} onChange={(e) => updateForm("first_name", e.target.value)} />
              </div>
              <div className="perfil-field">
                <label>Apellido</label>
                <input value={form.last_name} onChange={(e) => updateForm("last_name", e.target.value)} />
              </div>
              <div className="perfil-field perfil-field--full">
                <label>Teléfono</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="perfil-field perfil-field--full">
                <label>Calle</label>
                <input value={form.address_street} onChange={(e) => updateForm("address_street", e.target.value)} />
              </div>
              <div className="perfil-field">
                <label>Número</label>
                <input value={form.address_number} onChange={(e) => updateForm("address_number", e.target.value)} />
              </div>
              <div className="perfil-field">
                <label>Depto / Casa</label>
                <input value={form.address_depto} onChange={(e) => updateForm("address_depto", e.target.value)} />
              </div>
              <div className="perfil-field">
                <label>Provincia</label>
                <select value={form.address_province} onChange={(e) => updateForm("address_province", e.target.value)}>
                  <option value="">Seleccionar</option>
                  {PROVINCIAS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="perfil-field">
                <label>Ciudad</label>
                <select value={form.address_ciudad} onChange={(e) => updateForm("address_ciudad", e.target.value)}>
                  <option value="">Seleccionar</option>
                  {CIUDADES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="perfil-field">
                <label>Localidad</label>
                <select
                  value={form.address_localidad}
                  onChange={(e) => updateForm("address_localidad", e.target.value)}
                  disabled={!form.address_ciudad}
                >
                  <option value="">Seleccionar</option>
                  {localidadesForCiudad(form.address_ciudad).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="perfil-field">
                <label>Código postal</label>
                <input value={form.address_postal_code} onChange={(e) => updateForm("address_postal_code", e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="perfil-card perfil-orders-card">
        <h2>Mis compras</h2>
        {orders.length === 0 ? (
          <p className="perfil-no-orders">Aún no tenés compras registradas.</p>
        ) : (
          <ul className="perfil-orders-list">
            {orders.map((order) => (
              <li key={order.id} className="perfil-order-item">
                <div className="perfil-order-main">
                  <span className="perfil-order-id">Compra #{order.id}</span>
                  <span className="perfil-order-date">
                    {order.created_date
                      ? new Date(order.created_date).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="perfil-order-meta">
                  <span className="perfil-order-total">${(order.total || 0).toLocaleString()}</span>
                  <span className={`perfil-shipping-badge perfil-shipping--${order.shipping_status || "pendiente"}`}>
                    {SHIPPING_LABELS[order.shipping_status] || SHIPPING_LABELS.pendiente}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Perfil;
