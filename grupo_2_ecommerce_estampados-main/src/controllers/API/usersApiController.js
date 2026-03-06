const bcrypt = require("bcryptjs");
const db = require("../../database/models");
const { User } = db;

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
      const oneUser = await User.findByPk(req.params.id, {
        attributes: ["id", "first_name", "last_name", "email", "avatar_img"]
      });

      if (!oneUser) {
        return res.status(404).json({
          message: "404 Not Found",
          status: 404
        });
      }

      const user = {
        ...oneUser.dataValues,
        avatar_img: `${urlAvatars}/${oneUser.dataValues.avatar_img}`
      };

      res.json(user);
    } catch (e) {
      console.error("usersApiController.detail:", e.message);
      res.status(500).json({
        message: "Error del servidor",
        status: 500
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
        where: { email: email.trim(), is_active: 1 }
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
  }
};

module.exports = usersApiController;
