import { useState } from "react";
import "./Contacto.css"; // Asegúrate de que el archivo se llame exactamente así

function Contacto() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando... ⏳");

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Mensaje enviado correctamente 🎉");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("Error enviando el mensaje ❌");
      }
    } catch (error) {
      console.error("Error fetch contacto:", error);
      setStatus("Error de conexión con el servidor ❌");
    }
  };

  return (
    <div className="contact-page"> {/* <-- CAMBIADO: Usamos className */}
      <div className="contact-card"> {/* <-- AGREGADO: La tarjeta oscura */}
        <h2 className="contact-title">Contacto</h2> {/* <-- CAMBIADO: Estilo título */}
        
        <form className="contact-form" onSubmit={handleSubmit}> {/* <-- CAMBIADO: Clase formulario */}
          <input 
            type="text" 
            name="name" 
            placeholder="Tu nombre" 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
          
          <input 
            type="email" 
            name="email" 
            placeholder="Tu email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          
          <input 
            type="tel" 
            name="phone" 
            placeholder="Tu celular / Whatsapp" 
            value={form.phone} 
            onChange={handleChange} 
            required 
          />

          <textarea 
            name="message" 
            placeholder="Escribe tu mensaje" 
            value={form.message} 
            onChange={handleChange} 
            required 
          />

          <button type="submit" className="contact-btn">
            Enviar mensaje
          </button>
        </form>

        {status && <p className="status-msg">{status}</p>}
      </div>
    </div>
  );
}

export default Contacto;
