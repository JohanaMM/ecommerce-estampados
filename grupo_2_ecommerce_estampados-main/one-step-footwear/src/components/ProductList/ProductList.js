import { useState, useEffect, useContext } from "react";
import "./ProductList.css";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import { API_PRODUCTS } from "../../config";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [status, setStatus] = useState("Cargando productos... ⏳");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_PRODUCTS, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include", 
        });

        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo conectar`);
        
        const data = await response.json();
        const finalProducts = data.products || data.data || data;
        
        setProducts(Array.isArray(finalProducts) ? finalProducts : []);
        setStatus(""); 
      } catch (err) {
        console.error("Error fetch productos:", err);
        setStatus("Error cargando productos ❌");
      }
    };

    fetchProducts();
  }, []);

  const categories = ["todos", "remeras", "buzos", "pad-mouse", "tazas", "termos"];

  const filteredProducts = selectedCategory === "todos"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="products-section">
      <h1 className="section-title">Nuestra Colección</h1>

      {/* Filtros de Categoría */}
      <nav className="categories-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </nav>

      {/* Estado de carga */}
      {status && <div className="status-msg">{status}</div>}

      {/* GRILLA DE PRODUCTOS: Aquí ocurre la magia del diseño */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          !status && (
            <div className="empty-state">
              <p>No se encontraron productos en esta categoría.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}

export default ProductList;