const nodemailer = require("nodemailer");

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error("EMAIL_USER y EMAIL_PASS deben estar configurados en .env");
  }
  return nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    secure: true,
    auth: { user, pass }
  });
};

const sendContactEmail = async (name, email, phone, message) => {
  const transporter = createTransporter();
  const to = process.env.EMAIL_CONTACT_TO || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Contacto Web" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `Nuevo mensaje de ${name} - One Step Footwear`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; line-height: 1.6;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Consulta desde la Web</h2>
        <p><strong>De:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono / WhatsApp:</strong>
          <a href="https://wa.me/${String(phone).replace(/\D/g, "")}" style="color: #25d366; text-decoration: none; font-weight: bold;">
            ${phone}
          </a>
        </p>
        <p><strong>Mensaje:</strong></p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #333;">
          ${message}
        </div>
        <p style="font-size: 12px; color: #777; margin-top: 20px;">One Step Footwear - Formulario de contacto.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };
