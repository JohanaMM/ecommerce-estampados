const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController')
const { check, validationResult } = require("express-validator");

let adminMiddleware = require("../middlewares/adminMiddleware");

const storage = multer.diskStorage({
	destination: (req, file, callback) =>{
		let folder = path.join(__dirname, "../../public/img/usersAvatars");

		callback(null, folder)
	},
    filename: (req, file, callback) =>{
        let imageName = Date.now() + path.extname(file.originalname);

		callback(null, imageName);
    }
});

const fileUpload = multer({ storage: storage });

//proceso de validación con express validator
const validations = [
	check("email")
		.notEmpty().withMessage("Ingresa tu correo electrónico").bail()
		.isEmail().withMessage("Email inválido"),
	check("password")
		.notEmpty().withMessage("Debes completar la contraseña").bail()
];
//finaliza proceso de validación. se pone como middleware en el .post de login

router.get('/', adminMiddleware, adminController.admin);
//interfaz del CRUD de usuarios
router.get('/userList', adminMiddleware, adminController.list);
//editar usuario desde el admin
router.get('/edit/:id',adminMiddleware, adminController.edit);
router.put('/edit/:id', fileUpload.single('avatarImage'), adminController.update);
//eliminar un usuario desde el admin
router.post('/delete/:id', adminController.destroy); 
//crear usuario desde administrador
router.get('/createUser', adminMiddleware, adminController.createAdminUser);
router.post('/createUser', fileUpload.single('userAvatar'), adminController.store);


module.exports = router;