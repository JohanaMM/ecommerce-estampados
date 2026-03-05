import { useState } from "react";

function Contacto() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Error enviando el mensaje ❌");
      }
    } catch (error) {
      console.error("Error fetch contacto:", error);
      setStatus("Error de conexión con el servidor ❌");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Contacto</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Tu nombre" value={form.name} onChange={handleChange} required />
        <br /><br />
        <input type="email" name="email" placeholder="Tu email" value={form.email} onChange={handleChange} required />
        <br /><br />
        <textarea name="message" placeholder="Escribe tu mensaje" value={form.message} onChange={handleChange} required />
        <br /><br />
        <button type="submit">Enviar mensaje</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default Contacto;