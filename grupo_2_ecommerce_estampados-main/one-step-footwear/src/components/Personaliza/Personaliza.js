import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Personaliza.css";

function Personaliza() {
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    const userSession = sessionStorage.getItem("user");

    if (userLocal) setUser(JSON.parse(userLocal));
    else if (userSession) setUser(JSON.parse(userSession));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleAddToCart = () => {
    if (!selectedImage) {
      alert("Primero debes subir una imagen.");
      return;
    }

    if (!user) {
      alert("Debes iniciar sesión para continuar.");
      navigate("/login");
      return;
    }

    const customProduct = {
      id: Date.now(),
      name: "Remera personalizada",
      brand: "Custom",
      price: 5000,
      img: selectedImage,
      isCustom: true,
      quantity: 1,
    };

    addToCart(customProduct);

    alert("Producto agregado al carrito 🛒");
  };

  return (
    <div className="personaliza-container">

      <div className="mockup-section">
        <div className="mockup-wrapper">
          <img
            src="/mockups/remera-blanca.png"
            alt="Remera base"
            className="mockup-base"
          />

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Diseño"
              className="mockup-design"
            />
          )}
        </div>
      </div>

      <div className="controls-section">
        <h1>Diseñá tu remera</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <button onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>

    </div>
  );
}

export default Personaliza;