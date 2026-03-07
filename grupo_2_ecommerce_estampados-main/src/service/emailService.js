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

const sendPasswordResetEmail = async (toEmail, userName, resetLink) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"Trazzo" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Restablecer tu contraseña - Trazzo",
    html: `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 500px;">
        <h2 style="color: #333;">Recupero de contraseña</h2>
        <p>Hola ${userName || "usuario/a"},</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Hacé clic en el siguiente enlace para elegir una nueva contraseña (válido por 1 hora):</p>
        <p style="margin: 24px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #FF0C0C; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Restablecer contraseña</a>
        </p>
        <p style="font-size: 13px; color: #666;">Si no solicitaste este correo, podés ignorarlo. Tu contraseña no se cambiará.</p>
        <p style="font-size: 12px; color: #999; margin-top: 24px;">Trazzo - Estampados y personalización.</p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail, sendPasswordResetEmail };
