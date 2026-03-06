import { useState } from "react";
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleQty = (e, diff) => {
    e.preventDefault(); // Evita que el clic dispare el Link
    const newQty = Math.max(1, quantity + diff);
    setQuantity(newQty);
  };

  const imageSrc = product.isCustom ? product.img : `http://localhost:3000/img/${product.img}`;

  return (
    <div className="product-card">
      {product.isCustom && <div className="product-badge">Custom</div>}
      
      {/* Parte superior: Imagen y Datos (Clickable al detalle) */}
      <Link to={`/product-details/${product.id}`} className="product-link-wrapper">
        <div className="product-img-wrapper">
          <img src={imageSrc} alt={product.name} loading="lazy" />
        </div>

        <div className="product-info-body">
          <span className="product-brand">{product.brand}</span>
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">${product.price.toLocaleString()}</span>
        </div>
      </Link>

      {/* Fila Inferior: Selector de cantidad y Botón Comprar */}
      <div className="product-actions-bar">
        <div className="qty-selector">
          <button type="button" className="qty-btn" onClick={(e) => handleQty(e, -1)}>
            <FaMinus size={10} />
          </button>
          <span className="qty-number">{quantity}</span>
          <button type="button" className="qty-btn" onClick={(e) => handleQty(e, 1)}>
            <FaPlus size={10} />
          </button>
        </div>

        <button 
          className="btn-buy" 
          onClick={() => addToCart({ ...product, quantity })}
        >
          <FaShoppingCart size={14} />
          <span>COMPRAR</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;