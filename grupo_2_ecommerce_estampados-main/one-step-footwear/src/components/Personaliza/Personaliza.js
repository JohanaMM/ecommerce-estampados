import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { FaUpload, FaSync, FaShoppingCart } from "react-icons/fa";
import "./Personaliza.css";

function Personaliza() {
  const [user, setUser] = useState(null);
  
  // Estados del diseño
  const [selectedImage, setSelectedImage] = useState(null);
  const [color, setColor] = useState("#ffffff");
  const [side, setSide] = useState("front");
  const [talle, setTalle] = useState("M");
  const [ubicacion, setUbicacion] = useState("frente");
  const [comentarios, setComentarios] = useState("");
  
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // 1. Verificar usuario logueado
    const userLocal = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userLocal) setUser(JSON.parse(userLocal));

    // 2. Recuperar diseño si venimos de un Login exitoso
    const savedDesign = localStorage.getItem("pending_custom_design");
    if (savedDesign) {
      const data = JSON.parse(savedDesign);
      setSelectedImage(data.img);
      setColor(data.color);
      setTalle(data.talle);
      setUbicacion(data.ubicacion);
      setComentarios(data.comentarios);
      // Limpiamos el temporal una vez recuperado
      localStorage.removeItem("pending_custom_design");
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Guardamos en Base64 para persistencia
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (!selectedImage) {
      alert("Primero debes subir una imagen.");
      return;
    }

    // SI NO ESTÁ LOGUEADO: Guardar diseño y redirigir con "state"
    if (!user) {
      const currentDesign = {
        img: selectedImage,
        color: color,
        talle: talle,
        ubicacion: ubicacion,
        comentarios: comentarios
      };
      localStorage.setItem("pending_custom_design", JSON.stringify(currentDesign));
      
      alert("Debes iniciar sesión para continuar. Tu diseño se guardará automáticamente.");
      
      // Le pasamos al login de dónde venimos
      navigate("/login", { state: { from: "/personaliza" } });
      return;
    }

    const customProduct = {
      id: Date.now(),
      name: "Remera personalizada",
      brand: "Custom",
      price: 5000,
      img: selectedImage,
      color: color,
      talle: talle,
      ubicacion: ubicacion,
      comentarios: comentarios,
      isCustom: true,
      quantity: 1,
    };

    addToCart(customProduct);
    alert("Producto agregado al carrito 🛒");
  };

  return (
    <div className="personaliza-wrapper">
      <div className="personaliza-container">
        
        <div className="mockup-section">
          <div className="mockup-display" style={{ backgroundColor: color }}>
            <img
              src={`/Mockups/remera-blanca-${side}.png`}
              alt="Remera base"
              className="mockup-base"
            />
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Diseño"
                className={`design-overlay ${ubicacion}`}
              />
            )}
          </div>
          <button className="btn-switch" onClick={() => setSide(side === "front" ? "back" : "front")}>
            <FaSync /> Ver {side === "front" ? "Espalda" : "Frente"}
          </button>
        </div>

        <div className="controls-section">
          <h1>Diseñá tu remera</h1>

          <div className="control-group">
            <label>1. Subí tu imagen</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
          </div>

          <div className="control-group">
            <label>2. Elegí el color de la remera</label>
            <div className="color-picker-container">
               <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="color-input" />
               <span className="color-code">{color.toUpperCase()}</span>
            </div>
          </div>

          <div className="control-group">
            <label>3. Seleccioná Talle y Ubicación</label>
            <div className="flex-row">
              <select value={talle} onChange={(e) => setTalle(e.target.value)}>
                <option value="S">Talle S</option><option value="M">Talle M</option>
                <option value="L">Talle L</option><option value="XL">Talle XL</option>
                <option value="XXL">Talle XXL</option>
              </select>
              <select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}>
                <option value="frente">Frente (Centro)</option>
                <option value="atras">Espalda (Centro)</option>
                <option value="pecho-izq">Pecho Izquierdo</option>
                <option value="pecho-der">Pecho Derecho</option>
              </select>
            </div>
          </div>

          <div className="control-group">
            <label>4. Comentarios adicionales</label>
            <textarea 
              placeholder="Ej: Quiero que el logo sea pequeño..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </div>

          <button className="btn-add-cart" onClick={handleAddToCart}>
            <FaShoppingCart /> Agregar al carrito
          </button>
          
          <p className="contact-note">
            * Una vez realizada la compra, esperá mi contacto para corroborar el diseño.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Personaliza;