const express = require("express");
const router = express.Router();

// CORRECCIÓN: La carpeta se llama 'service' (en singular) según tu estructura
const { sendContactEmail } = require("../service/emailService");

// Ruta para enviar mensaje de contacto
router.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    console.log("📩 Nuevo mensaje de contacto");
    console.log("Nombre:", name, "Email:", email, "Mensaje:", message);

    // Llamamos al servicio que envía el email
    await sendContactEmail(name, email, message);

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