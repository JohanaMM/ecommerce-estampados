import { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import "./ProductCard.css";

function ProductCard({ product, addToCart, inCart = false, updateCart, removeFromCart }) {
  const [quantity, setQuantity] = useState(product.quantity || 1);

  const handleQty = (diff) => {
    const newQty = Math.max(1, quantity + diff);
    setQuantity(newQty);
    if (inCart && updateCart) updateCart(product.id, newQty);
  };

  return (
    <div className={`product-card ${inCart ? "is-in-cart" : ""}`}>
      {product.isCustom && <div className="product-badge">Custom</div>}
      
      <div className="product-img-wrapper">
        <img
          src={product.isCustom ? product.img : `http://localhost:3000/img/${product.img}`}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="product-content">
        <div className="text-info">
          <span className="product-brand">{product.brand}</span>
          <h3 className="product-name">{product.name}</h3>
        </div>
        <span className="product-price">${product.price.toLocaleString()}</span>
      </div>

      {/* FILA ÚNICA DE ACCIONES */}
      <div className="product-actions-row">
        <div className="qty-selector-container">
          <button 
            type="button" 
            className="qty-btn" 
            onClick={() => handleQty(-1)}
          >
            <FaMinus size={10}/>
          </button>
          
          <span className="qty-val">{quantity}</span>
          
          <button 
            type="button" 
            className="qty-btn" 
            onClick={() => handleQty(1)}
          >
            <FaPlus size={10}/>
          </button>
        </div>

        {!inCart ? (
          <button className="btn-add-main" onClick={() => addToCart({ ...product, quantity })}>
            Agregar
          </button>
        ) : (
          <button className="btn-remove-icon" onClick={() => removeFromCart(product.id)}>
            <FaTrash size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;