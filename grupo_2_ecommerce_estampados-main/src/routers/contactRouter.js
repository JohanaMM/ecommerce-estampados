const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../service/emailService");

router.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Nombre, email y mensaje son obligatorios."
    });
  }

  try {
    await sendContactEmail(name, email, phone || "", message);
    res.json({
      success: true,
      message: "Mensaje enviado correctamente."
    });
  } catch (error) {
    console.error("Error enviando contacto:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al enviar el mensaje. Intente más tarde."
    });
  }
});

module.exports = router;
