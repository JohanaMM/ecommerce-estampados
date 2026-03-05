import { createContext, useState } from "react";

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Crear un provider que envuelva toda la app
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Función para agregar productos al carrito
  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(p => p.id === item.id);
      if (existing) {
        return prevCart.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      } else {
        return [...prevCart, item];
      }
    });
  };

  // ✅ Función para eliminar un producto del carrito
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // ✅ Función para actualizar cantidad directamente desde el carrito
  const updateCart = (id, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
}