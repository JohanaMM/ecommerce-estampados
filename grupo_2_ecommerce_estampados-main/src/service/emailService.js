const nodemailer = require("nodemailer");

const sendContactEmail = async (name, email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Uso de SSL
      auth: {
        user: "johanamartinez904@gmail.com",
        // PEGA AQUÍ LAS 16 LETRAS (sin espacios)
        pass: "mextrayyululrwmm" 
      }
    });

    const mailOptions = {
      from: `"Contacto Web" <johanamartinez904@gmail.com>`, // Remitente autorizado
      to: "johanamartinez904@gmail.com", // A donde llega
      replyTo: email, // Si respondes el mail, le llega al cliente
      subject: `Nuevo mensaje de ${name} 👟`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Consulta desde la Web</h2>
          <p><strong>De:</strong> ${name} (${email})</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${message}
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado ID:", info.messageId);
    
  } catch (error) {
    console.error("❌ Error real en el envío:", error.message);
  }
};

module.exports = { sendContactEmail };