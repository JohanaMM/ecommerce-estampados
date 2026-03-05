import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import ProductCard from '../ProductCard/ProductCard';
import './Carrito.css';

function Carrito() {
  const { cart, updateCart, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-page">
      <h1>Mi Carrito</h1>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div className="product_div">
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
      )}
    </div>
  );
}

export default Carrito;