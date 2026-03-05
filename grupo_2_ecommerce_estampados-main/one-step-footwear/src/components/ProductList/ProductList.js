import { useState, useEffect, useContext } from "react";
import "./ProductList.css";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [status, setStatus] = useState("Cargando productos... ⏳");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include", 
        });

        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo conectar`);
        
        const data = await response.json();

        // Verificamos dónde vienen los productos en tu JSON
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
    <>
      <h1 className="section-title">Productos</h1>

      <div className="categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {status && <p style={{ textAlign: "center", marginTop: "20px" }}>{status}</p>}

      <div className="product_div">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          !status && <p style={{ textAlign: "center", width: "100%" }}>No se encontraron productos.</p>
        )}
      </div>
    </>
  );
}

export default ProductList;