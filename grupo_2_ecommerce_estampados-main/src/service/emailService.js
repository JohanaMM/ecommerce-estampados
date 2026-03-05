const nodemailer = require("nodemailer");

// 1. Agregamos 'phone' a los parámetros de la función
const sendContactEmail = async (name, email, phone, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Uso de SSL
      auth: {
        user: "johanamartinez904@gmail.com",
        pass: "mextrayyululrwmm" 
      }
    });

    const mailOptions = {
      from: `"Contacto Web" <johanamartinez904@gmail.com>`, // Remitente autorizado
      to: "johanamartinez904@gmail.com", // A donde llega
      replyTo: email, // Si respondes el mail, le llega al cliente
      subject: `Nuevo mensaje de ${name} 👟`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; line-height: 1.6;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Consulta desde la Web</h2>
          <p><strong>De:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          
          <p><strong>WhatsApp / Celular:</strong> 
            <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color: #25d366; text-decoration: none; font-weight: bold;">
              ${phone} (Click para chatear)
            </a>
          </p>

          <p><strong>Mensaje:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #333;">
            ${message}
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 20px;">Este mensaje fue enviado desde el formulario de contacto de One Step Footwear.</p>
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