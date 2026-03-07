import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import ProductList from './components/ProductList/ProductList';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Error404 from './pages/Error404';
import Personaliza from './components/Personaliza/Personaliza';
import Contacto from './components/Contacto/Contacto';
import Carrito from './components/Carrito/Carrito';
import Perfil from './components/Perfil/Perfil';
import Login from './pages/Login';
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { PaymentSuccess, PaymentFailure, PaymentPending } from './pages/PaymentResult';
import { CartProvider } from './context/CartContext';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Header />
          <main className="main-content">
            <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/product-list" element={<ProductList/>} />
            {/* RUTA CORREGIDA CON / AL INICIO */}
            <Route path="/product-details/:id" element={<ProductDetails/>} />
            <Route path="/products/:category" element={<ProductList />} />
            <Route path="/personaliza" element={<Personaliza />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/failure" element={<PaymentFailure />} />
            <Route path="/pending" element={<PaymentPending />} />
            <Route path="*" element={<Error404/>} />
          </Routes>
          </main>
          <Footer />
        </div>
        <WhatsAppButton />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;