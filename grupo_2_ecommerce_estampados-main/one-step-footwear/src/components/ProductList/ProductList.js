import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import "./ProductList.css";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import { API_PRODUCTS } from "../../config";

const TEMAS = [
  "Todos",
  "Música",
  "Equipos",
  "Videojuegos",
  "Series",
  "Películas",
  "Anime",
  "Otros",
];

const SLUG_TO_CATEGORY = {
  remeras: "Remeras",
  buzos: "Buzos",
  "pad-mouse": "Pad Mouse",
  tazas: "Tazas",
  termos: "Termos",
};

function slugToTitle(slug) {
  if (!slug) return "Tienda";
  return SLUG_TO_CATEGORY[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

function ProductList() {
  const { category: categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedTema, setSelectedTema] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("Cargando productos...");
  const { addToCart } = useContext(CartContext);

  const pageTitle = slugToTitle(categorySlug);
  const categoryForApi = categorySlug ? (SLUG_TO_CATEGORY[categorySlug] || slugToTitle(categorySlug)) : null;

  const fetchProducts = useCallback(async () => {
    setStatus("Cargando productos...");
    try {
      const params = new URLSearchParams();
      if (categoryForApi) params.set("category", categoryForApi);
      if (selectedTema !== "Todos") params.set("theme", selectedTema);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      const url = params.toString() ? `${API_PRODUCTS}?${params.toString()}` : API_PRODUCTS;
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      const finalProducts = data.products || data.data || data;
      setProducts(Array.isArray(finalProducts) ? finalProducts : []);
      setStatus("");
    } catch (err) {
      console.error("Error fetch productos:", err);
      setStatus("Error cargando productos");
    }
  }, [categoryForApi, selectedTema, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <main className="products-section">
      <h1 className="section-title">{pageTitle}</h1>

      {/* Buscador */}
      <form className="products-search" onSubmit={handleSearch}>
        <input
          type="search"
          className="products-search-input"
          placeholder="Buscar por nombre o descripción..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Buscar productos"
        />
        <button type="submit" className="products-search-btn">
          Buscar
        </button>
      </form>

      {/* Filtros por tema (categoría) - botones con nombre */}
      <div className="filters-wrap">
        <div className="filters-row" role="list">
          {TEMAS.map((tema) => (
            <button
              key={tema}
              type="button"
              className={`filter-btn ${selectedTema === tema ? "active" : ""}`}
              onClick={() => setSelectedTema(tema)}
              role="listitem"
            >
              {tema}
            </button>
          ))}
        </div>
      </div>

      {status && <div className="status-msg">{status}</div>}

      <div className="product-grid">
        {!status && products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          !status && (
            <div className="empty-state">
              <p>No se encontraron productos con esos filtros.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}

export default ProductList;
