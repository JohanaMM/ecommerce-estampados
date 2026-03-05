const path = require('path');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const urlApi = 'http://localhost:3000/api/users'
const urlAvatars = 'http://localhost:3000/img/usersAvatars'

// Base de datos
const db = require('../../database/models/index.js');
const dbUsers = db.User

const limit = 10

const usersApiController = {

    // =========================
    // LIST
    // =========================
    list: async (req, res) => {

        try {

            let page = req.query.page || 1

            let countUsers = await dbUsers.count()
            let cantPages = countUsers / limit
            cantPages = Number.isInteger(cantPages) ? cantPages : Math.floor(cantPages + 1)

            if (page > 0 && page <= cantPages) {

                let offset = page * limit - limit

                let allUsers = await dbUsers.findAll({
                    attributes: ['id', 'first_name', 'last_name', 'email', 'created_date'],
                    limit: limit,
                    offset: offset
                });

                let users = allUsers.map(element => {

                    let detail = urlApi + '/' + element.dataValues.id

                    return {
                        ...element.dataValues,
                        detail: detail
                    }
                })

                let nextPage = parseInt(page) + 1
                let previousPage = parseInt(page) - 1

                let data = {
                    count: countUsers,
                    next: page < cantPages ? `${urlApi}/?page=${nextPage}` : null,
                    previous: page > 1 ? `${urlApi}/?page=${previousPage}` : null,
                    users: users
                }

                return res.json(data)

            } else {
                return res.status(404).json({
                    message: "404 Not Found",
                    status: 404
                })
            }

        } catch (e) {
            return res.status(500).json({
                message: "Server Error",
                error: e.message
            })
        }
    },

    // =========================
    // DETAIL
    // =========================
    detail: async (req, res) => {

        try {

            let oneUser = await dbUsers.findByPk(req.params.id, {
                attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_img']
            })

            if (!oneUser) {
                return res.status(404).json({
                    message: "404 Not Found",
                    status: 404
                })
            }

            let user = {
                ...oneUser.dataValues,
                avatar_img: urlAvatars + '/' + oneUser.dataValues.avatar_img
            }

            return res.json(user)

        } catch (e) {
            return res.status(500).json({
                message: "Server Error",
                error: e.message
            })
        }
    },

    // =========================
    // LOGIN (NUEVO)
    // =========================
    login: async (req, res) => {

        try {

            let user = await dbUsers.findOne({
                where: {
                    email: { [Op.like]: `%${req.body.email}%` },
                    is_active: 1
                }
            })

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Correo o contraseña incorrectos"
                })
            }

            let passwordOk = bcrypt.compareSync(req.body.password, user.password)

            if (!passwordOk) {
                return res.status(400).json({
                    success: false,
                    message: "Correo o contraseña incorrectos"
                })
            }

            delete user.dataValues.password

            return res.json({
                success: true,
                user: user
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error del servidor"
            })
        }
    }

}

module.exports = usersApiController