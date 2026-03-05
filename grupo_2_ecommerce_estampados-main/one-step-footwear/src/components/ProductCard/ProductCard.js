import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./ProductCard.css";

function ProductCard({ product, addToCart, inCart = false, updateCart, removeFromCart }) {
  const [quantity, setQuantity] = useState(product.quantity || 1);

  const increase = () => {
    setQuantity(q => q + 1);
    if (inCart && updateCart) updateCart(product.id, quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
      if (inCart && updateCart) updateCart(product.id, quantity - 1);
    }
  };

  const remove = () => {
    if (inCart && removeFromCart) removeFromCart(product.id);
  };

  return (
    <div className="product-card">
      <img
        src={
         product.isCustom
           ? product.img
           : `http://localhost:3000/img/${product.img}`
        }
        alt={product.name}
    />
      <h3>{product.brand} {product.name}</h3>
      <p>${product.price}</p>

      {inCart ? (
        <div className="quantity">
          <button onClick={decrease}>-</button>
          <span>{quantity}</span>
          <button onClick={increase}>+</button>
          <button className="remove-btn no-bg" onClick={remove}>
            <FaTrash size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="quantity">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button className="add-btn" onClick={() => addToCart({ ...product, quantity })}>
            Agregar al carrito
          </button>
        </>
      )}
    </div>
  );
}

export default ProductCard;