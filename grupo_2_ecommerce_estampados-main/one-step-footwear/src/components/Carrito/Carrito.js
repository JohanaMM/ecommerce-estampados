import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import ProductCard from '../ProductCard/ProductCard';
import './Carrito.css';

function Carrito() {
  const { cart, updateCart, removeFromCart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Tu Carrito</h1>
        <span className="cart-count">{cart.length} productos</span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío actualmente.</p>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-list">
            {cart.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                inCart={true}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Resumen</h3>
            <div className="summary-row">
              <span>Total:</span>
              <span className="summary-total">${total.toLocaleString()}</span>
            </div>
            <button className="btn-checkout">Finalizar Compra</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;