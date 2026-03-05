const express = require("express");
const router = express.Router();

// La carpeta se llama 'service' (en singular)
const { sendContactEmail } = require("../service/emailService");

// Ruta para enviar mensaje de contacto
router.post("/api/contact", async (req, res) => {
  // 1. Extraemos el 'phone' que viene del formulario de React
  const { name, email, phone, message } = req.body;

  try {
    console.log("📩 Nuevo mensaje de contacto recibido");
    // Mostramos el celular en la consola para confirmar que llega al backend
    console.log(`Nombre: ${name} | Email: ${email} | Celular: ${phone}`);

    // 2. ¡IMPORTANTE!: Pasamos el 'phone' a la función del servicio de email
    // Asegúrate de que en emailService.js la función reciba (name, email, phone, message)
    await sendContactEmail(name, email, phone, message);

    // Respondemos al frontend
    res.json({
      success: true,
      message: "Mensaje enviado correctamente 🎉"
    });
  } catch (error) {
    console.error("ERROR enviando contacto:", error);
    res.status(500).json({
      success: false,
      message: "Ocurrió un error enviando el mensaje"
    });
  }
});

module.exports = router;