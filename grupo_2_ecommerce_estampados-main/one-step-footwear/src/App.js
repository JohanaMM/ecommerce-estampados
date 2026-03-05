import Header from './components/Header/Header'
import Home from './pages/Home'
import ProductList from './components/ProductList/ProductList'
import ProductDetails from './components/ProductDetails/ProductDetails'
import Error404 from './pages/Error404'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Personaliza from './components/Personaliza/Personaliza';
import Contacto from './components/Contacto/Contacto';
import Carrito from './components/Carrito/Carrito';
import Perfil from './components/Perfil/Perfil';
import Login from './pages/Login';
import Register from "./pages/Register";

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>

        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="product-list" element={<ProductList/>} />
            <Route path="product-details/:id" element={<ProductDetails/>} />
            <Route path="*" element={<Error404/>} />
            <Route path="/products/:category" element={<ProductList />} />
            <Route path="/personaliza" element={<Personaliza />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

      </BrowserRouter>
    </CartProvider>
  );
}

export default App;