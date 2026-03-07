const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../../database/models");
const { User } = db;
const { sendPasswordResetEmail } = require("../../service/emailService");
const resetTokenStore = require("../../service/resetTokenStore");

const API_BASE_URL = process.env.API_URL || "http://localhost:3000";
const urlApi = `${API_BASE_URL}/api/users`;
const urlAvatars = `${API_BASE_URL}/img/usersAvatars`;
const LIMIT = 10;

const usersApiController = {
  list: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const countUsers = await User.count();
      const totalPages = Math.ceil(countUsers / LIMIT);

      if (page < 1 || page > totalPages) {
        return res.status(404).json({
          message: "404 Not Found",
          status: 404
        });
      }

      const offset = (page - 1) * LIMIT;
      const allUsers = await User.findAll({
        attributes: ["id", "first_name", "last_name", "email", "created_date"],
        limit: LIMIT,
        offset
      });

      const users = allUsers.map((element) => ({
        ...element.dataValues,
        detail: `${urlApi}/${element.dataValues.id}`
      }));

      res.json({
        count: countUsers,
        next: page < totalPages ? `${urlApi}/?page=${page + 1}` : null,
        previous: page > 1 ? `${urlApi}/?page=${page - 1}` : null,
        users
      });
    } catch (e) {
      console.error("usersApiController.list:", e.message);
      res.status(500).json({
        message: "Error del servidor",
        status: 500
      });
    }
  },

  detail: async (req, res) => {
    try {
      const oneUser = await User.findByPk(req.params.id);

      if (!oneUser) {
        return res.status(404).json({
          message: "404 Not Found",
          status: 404
        });
      }

      const d = oneUser.dataValues || {};
      const user = {
        id: d.id,
        first_name: d.first_name || "",
        last_name: d.last_name || "",
        email: d.email || "",
        avatar_img: d.avatar_img ? `${urlAvatars}/${d.avatar_img}` : "",
        phone: d.phone ?? "",
        address_street: d.address_street ?? "",
        address_number: d.address_number ?? "",
        address_depto: d.address_depto ?? "",
        address_province: d.address_province ?? "",
        address_city: d.address_city ?? "",
        address_postal_code: d.address_postal_code ?? "",
      };
      const cityStr = String(user.address_city || "");
      const parts = cityStr.split(",").map(s => s.trim()).filter(Boolean);
      user.address_ciudad = parts[0] || "";
      user.address_localidad = parts[1] || parts[0] || "";

      res.json(user);
    } catch (e) {
      console.error("usersApiController.detail:", e.message);
      res.status(500).json({
        message: "Error del servidor",
        status: 500
      });
    }
  },

  register: async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Nombre, apellido, email y contraseña son obligatorios"
        });
      }

      const existing = await User.findOne({
        where: { email: email.trim().toLowerCase() }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una cuenta con ese correo electrónico"
        });
      }

      const hashedPassword = bcrypt.hashSync(password.trim(), 10);
      await User.create({
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        avatar_img: "default.png",
        role_id: 2,
        is_active: 1
      });

      res.status(201).json({
        success: true,
        message: "Cuenta creada. Ya podés iniciar sesión."
      });
    } catch (e) {
      console.error("usersApiController.register:", e.message);
      res.status(500).json({
        success: false,
        message: "Error del servidor"
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !String(email).trim()) {
        return res.status(400).json({
          success: false,
          message: "El correo electrónico es obligatorio"
        });
      }

      const user = await User.findOne({
        where: { email: String(email).trim().toLowerCase(), is_active: 1 }
      });

      const emailCliente = String(email).trim().toLowerCase();
      if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        resetTokenStore.set(token, user.id);
        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3002").replace(/\/$/, "");
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        try {
          await sendPasswordResetEmail(emailCliente, user.first_name, resetLink);
        } catch (err) {
          console.error("Error enviando email de recupero:", err.message);
        }
      }

      res.json({
        success: true,
        message: "Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña. Revisá tu bandeja de entrada y spam."
      });
    } catch (e) {
      console.error("usersApiController.forgotPassword:", e.message);
      res.status(500).json({
        success: false,
        message: "Error del servidor"
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword || String(newPassword).length < 6) {
        return res.status(400).json({
          success: false,
          message: "Token y nueva contraseña (mín. 6 caracteres) son obligatorios"
        });
      }

      const userId = resetTokenStore.get(token);
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "El enlace expiró o no es válido. Solicitá uno nuevo desde recuperar contraseña."
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        resetTokenStore.remove(token);
        return res.status(400).json({ success: false, message: "Usuario no encontrado." });
      }

      const hashedPassword = bcrypt.hashSync(String(newPassword).trim(), 10);
      await user.update({ password: hashedPassword, modified_date: new Date() });
      resetTokenStore.remove(token);

      res.json({
        success: true,
        message: "Contraseña actualizada. Ya podés iniciar sesión."
      });
    } catch (e) {
      console.error("usersApiController.resetPassword:", e.message);
      res.status(500).json({
        success: false,
        message: "Error del servidor"
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son obligatorios"
        });
      }

      const user = await User.findOne({
        where: { email: email.trim(), is_active: 1 },
        attributes: ["id", "first_name", "last_name", "email", "password", "avatar_img", "role_id", "is_active", "created_date", "modified_date"]
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Correo o contraseña incorrectos"
        });
      }

      const passwordOk = bcrypt.compareSync(password, user.password);
      if (!passwordOk) {
        return res.status(400).json({
          success: false,
          message: "Correo o contraseña incorrectos"
        });
      }

      const userData = { ...user.dataValues };
      delete userData.password;

      res.json({
        success: true,
        user: userData
      });
    } catch (e) {
      console.error("usersApiController.login:", e.message);
      res.status(500).json({
        success: false,
        message: "Error del servidor"
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        first_name,
        last_name,
        phone,
        address_street,
        address_number,
        address_depto,
        address_province,
        address_city,
        address_ciudad,
        address_localidad,
        address_postal_code
      } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado", status: 404 });
      }

      const toUpdate = {};
      if (first_name != null) toUpdate.first_name = String(first_name).trim();
      if (last_name != null) toUpdate.last_name = String(last_name).trim();
      if (phone != null) toUpdate.phone = String(phone).trim();
      if (address_street != null) toUpdate.address_street = String(address_street).trim();
      if (address_number != null) toUpdate.address_number = String(address_number).trim();
      if (address_depto != null) toUpdate.address_depto = String(address_depto).trim();
      if (address_province != null) toUpdate.address_province = String(address_province).trim();
      if (address_postal_code != null) toUpdate.address_postal_code = String(address_postal_code).trim();
      if (address_ciudad != null || address_localidad != null) {
        const ciudad = (address_ciudad != null ? String(address_ciudad).trim() : "") || (address_city != null ? String(address_city).trim() : "");
        const loc = (address_localidad != null ? String(address_localidad).trim() : "");
        toUpdate.address_city = [ciudad, loc].filter(Boolean).join(", ") || (address_city != null ? String(address_city).trim() : user.address_city);
      } else if (address_city != null) {
        toUpdate.address_city = String(address_city).trim();
      }

      toUpdate.modified_date = new Date();

      const modelKeys = Object.keys(User.rawAttributes || {});
      const safeUpdate = {};
      for (const key of Object.keys(toUpdate)) {
        if (modelKeys.includes(key)) safeUpdate[key] = toUpdate[key];
      }

      try {
        await user.update(safeUpdate);
      } catch (err) {
        console.error("usersApiController.updateProfile update:", err.message);
        const isColumnError = err.name === "SequelizeDatabaseError" || (err.message && err.message.includes("Unknown column"));
        if (isColumnError && (safeUpdate.first_name != null || safeUpdate.last_name != null)) {
          await user.update({
            first_name: safeUpdate.first_name != null ? safeUpdate.first_name : user.first_name,
            last_name: safeUpdate.last_name != null ? safeUpdate.last_name : user.last_name,
            modified_date: new Date()
          });
        } else {
          throw err;
        }
      }

      const baseAttrs = ["id", "first_name", "last_name", "email", "avatar_img"];
      const updated = await User.findByPk(userId, { attributes: baseAttrs });
      res.json(updated.dataValues);
    } catch (e) {
      console.error("usersApiController.updateProfile:", e.message);
      res.status(500).json({ message: "Error del servidor", status: 500 });
    }
  }
};

module.exports = usersApiController;
