import { createContext, useState } from "react";

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Crear un provider que envuelva toda la app
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Misma línea = mismo producto + misma talla + mismo color
  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(
        p => p.id === item.id && p.size === item.size && p.color === item.color
      );
      if (existing) {
        return prevCart.map(p =>
          p.lineId === existing.lineId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      const lineId = `line-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return [...prevCart, { ...item, lineId }];
    });
  };

  const removeFromCart = (lineIdOrId) => {
    setCart(prevCart =>
      prevCart.filter(
        item => (item.lineId != null ? item.lineId !== lineIdOrId : item.id !== lineIdOrId)
      )
    );
  };

  const updateCart = (lineIdOrId, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item => {
        const match = item.lineId != null
          ? item.lineId === lineIdOrId
          : item.id === lineIdOrId;
        return match ? { ...item, quantity: newQuantity } : item;
      })
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}