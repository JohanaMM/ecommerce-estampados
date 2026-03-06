import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import CartItemCard from "../CartItemCard/CartItemCard";
import { API_PAYMENTS, MERCADOPAGO_DOMAIN } from "../../config";
import "./Carrito.css";

function Carrito() {
  const { cart, updateCart, removeFromCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);

    try {
      const response = await fetch(`${API_PAYMENTS}/create_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
        credentials: "include"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = [data.error, data.detail].filter(Boolean).join(": ") || `Error ${response.status}`;
        throw new Error(msg);
      }

      if (data.id) {
        window.location.href = `https://www.mercadopago.${MERCADOPAGO_DOMAIN}/checkout/v1/redirect?pref_id=${data.id}`;
      } else {
        throw new Error(data.error || "No se recibió ID de preferencia");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert(error.message || "No se pudo iniciar el pago. Revisa la consola del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Tu Carrito</h1>
        <span className="cart-count">{cart.length} {cart.length === 1 ? "producto" : "productos"}</span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío actualmente.</p>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-list">
            {cart.map((item) => (
              <CartItemCard
                key={item.lineId ?? item.id}
                item={item}
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
            <button 
              className="btn-checkout" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Cargando..." : "FINALIZAR COMPRA"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;