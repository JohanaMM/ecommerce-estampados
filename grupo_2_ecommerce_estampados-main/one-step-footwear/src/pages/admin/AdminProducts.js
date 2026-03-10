import { useState, useEffect } from "react";
import { API_ADMIN, getAdminHeaders, getAdminKey } from "../../config";
import "./AdminProducts.css";

// Opciones fijas por si el catálogo no carga (siempre visibles)
const CATEGORIAS_FIJO = ["Remeras", "Buzos", "Pad mouse", "Tazas", "Termos", "Gorras", "Stickers"];
const TALLES_FIJO = ["S", "M", "L", "XL", "XXL"];
const SUBCATEGORIAS_FIJO = [
  { value: "", label: "— Sin subcategoría —" },
  { value: "Música", label: "Música" },
  { value: "Equipos", label: "Equipos" },
  { value: "Videojuegos", label: "Videojuegos" },
  { value: "Series", label: "Series" },
  { value: "Películas", label: "Películas" },
  { value: "Anime", label: "Anime" },
  { value: "Otros", label: "Otros" },
];
const COLORES_FIJO = ["Negro", "Blanco", "Gris", "Azul", "Rojo", "Verde", "Otro"];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [catalog, setCatalog] = useState({ categories: [], sizes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    theme: "",
    color: "",
    category_id: "",
    category_name: "",
    size_id: "",
    size_name: "",
    is_active: true,
    productImages: [],
  });
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_ADMIN}/products`, { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("No se pudieron cargar los productos");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalog = async () => {
    try {
      const res = await fetch(`${API_ADMIN}/catalog`, { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        setCatalog({
          categories: data.categories || [],
          sizes: data.sizes || [],
        });
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadCatalog();
    loadProducts();
  }, []);

  const categories = catalog.categories.length ? catalog.categories : CATEGORIAS_FIJO.map((name, i) => ({ id: i + 1, name }));
  const sizes = catalog.sizes.length ? catalog.sizes : TALLES_FIJO.map((name, i) => ({ id: i + 1, size: name }));
  const useIds = catalog.categories.length > 0 && catalog.sizes.length > 0;

  const openCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      theme: "",
      color: "",
      category_id: categories[0]?.id ?? "",
      category_name: categories[0]?.name ?? "",
      size_id: sizes[0]?.id ?? "",
      size_name: sizes[0]?.size ?? "",
      is_active: true,
      productImages: [],
    });
    setFormOpen(true);
  };

  const openEdit = async (id) => {
    setEditingId(id);
    try {
      const res = await fetch(`${API_ADMIN}/products/${id}`, { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Producto no encontrado");
      const p = await res.json();
      const firstStock = p.Stocks?.[0];
      setForm({
        name: p.name || "",
        description: p.description || "",
        price: p.price ?? "",
        stock: p.totalStock ?? "",
        theme: p.theme || "",
        color: p.color || "",
        category_id: p.category_id ?? "",
        category_name: p.Category?.name ?? "",
        size_id: firstStock?.size_id ?? sizes[0]?.id ?? "",
        size_name: firstStock?.Size?.size ?? sizes[0]?.size ?? "",
        is_active: p.is_active !== 0 && p.is_active !== "0",
        productImages: [],
      });
      setFormOpen(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("theme", form.theme || "");
      formData.append("color", form.color || "");
      formData.append("category_id", form.category_id || "");
      formData.append("category_name", form.category_name || "");
      formData.append("size_id", form.size_id || "");
      formData.append("size_name", form.size_name || "");
      formData.append("is_active", form.is_active ? "1" : "0");
      (form.productImages || []).forEach((file) => formData.append("productImages", file));

      const url = editingId ? `${API_ADMIN}/products/${editingId}/update` : `${API_ADMIN}/products`;
      const method = "POST";
      const res = await fetch(url, {
        method,
        headers: { "X-Admin-Key": getAdminKey() },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.message || data.error || "Error al guardar";
        if (res.status === 403) {
          throw new Error(msg + " Revisá que en one-step-footwear/.env esté REACT_APP_ADMIN_SECRET=clave-admin-prueba-2025 y en la raíz del proyecto .env esté ADMIN_SECRET=clave-admin-prueba-2025. Reiniciá backend y frontend.");
        }
        throw new Error(msg);
      }
      closeForm();
      loadProducts();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Desactivar el producto "${name}"?`)) return;
    try {
      const res = await fetch(`${API_ADMIN}/products/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Error al eliminar");
      loadProducts();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      const res = await fetch(`${API_ADMIN}/products/${id}/activate`, {
        method: "POST",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Error al activar");
      loadProducts();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="admin-products-loading">Cargando productos…</div>;

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h1>Productos</h1>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          Nuevo producto
        </button>
      </div>
      {error && <div className="admin-products-error">{error}</div>}
      <div className="admin-products-table-wrap">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.img ? (
                    <img src={p.img} alt="" className="admin-product-thumb" />
                  ) : (
                    <span className="admin-no-img">—</span>
                  )}
                </td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.totalStock ?? 0}</td>
                <td>{p.is_active ? "Activo" : "Inactivo"}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn-sm" onClick={() => openEdit(p.id)}>
                    Editar
                  </button>
                  {p.is_active ? (
                    <button
                      type="button"
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleDelete(p.id, p.name)}
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="admin-btn admin-btn-sm admin-btn-primary"
                      onClick={() => handleActivate(p.id)}
                    >
                      Activar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="admin-modal-overlay" onClick={closeForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
              <button type="button" className="admin-modal-close" onClick={closeForm} title="Cerrar" aria-label="Cerrar">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>
                Nombre *
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>
              <label>
                Descripción * (podés usar viñetas: • o - al inicio de cada línea)
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={6}
                  placeholder={"Ejemplo:\n• Característica 1\n• Característica 2\n- Otra línea"}
                  required
                />
              </label>
              <label>
                Precio
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                />
              </label>
              <label>
                Talle
                <select
                  value={useIds ? form.size_id : form.size_name}
                  onChange={(e) =>
                    useIds
                      ? setForm((f) => ({ ...f, size_id: e.target.value }))
                      : setForm((f) => ({ ...f, size_name: e.target.value }))
                  }
                >
                  {sizes.map((s) => (
                    <option key={s.id} value={useIds ? s.id : s.size}>
                      {s.size}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Color
                <select
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                >
                  <option value="">— Seleccionar color —</option>
                  {COLORES_FIJO.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Categoría
                <select
                  value={useIds ? form.category_id : form.category_name}
                  onChange={(e) =>
                    useIds
                      ? setForm((f) => ({ ...f, category_id: e.target.value }))
                      : setForm((f) => ({ ...f, category_name: e.target.value }))
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={useIds ? c.id : c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Subcategoría (música, series, etc.)
                <select
                  value={form.theme}
                  onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
                >
                  {SUBCATEGORIAS_FIJO.map((opt) => (
                    <option key={opt.value || "sin"} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
              {editingId && (
                <label className="admin-form-checkbox">
                  <input
                    type="checkbox"
                    checked={!!form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  />
                  Producto activo (visible en la tienda)
                </label>
              )}
              <label>
                Imágenes (hasta 10) {editingId && "(dejar vacío para no cambiar)"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setForm((f) => ({ ...f, productImages: Array.from(e.target.files || []) }))}
                />
                {form.productImages?.length > 0 && (
                  <span className="admin-form-files-count">{form.productImages.length} archivo(s) seleccionado(s)</span>
                )}
              </label>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
