const nodemailer = require("nodemailer");

const sendContactEmail = async (req, res) => {

  const { name, email, message } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "johanamartinez904@gmail.com",
        pass: "TU_APP_PASSWORD"
      }
    });

    const mailOptions = {
      from: email,
      to: "johanamartinez904@gmail.com",
      subject: "Nuevo mensaje desde tu Ecommerce",
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Mensaje enviado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error enviando el mensaje"
    });

  }
};

module.exports = { sendContactEmail };