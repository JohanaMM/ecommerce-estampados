const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController')
const { check, validationResult} = require('express-validator');

let authMiddleware = require('../middlewares/authMiddleware');
let guestMiddleware = require('../middlewares/guestMiddleware');

const storage = multer.diskStorage({
	destination: (req, file, callback) =>{
		let folder = path.join(__dirname, '../../public/img/usersAvatars');

		callback(null, folder)
	},
    filename: (req, file, callback) =>{
        let imageName = Date.now() + path.extname(file.originalname);

		callback(null, imageName);
    }
});

const fileUpload = multer({ storage: storage });

//proceso de validación con express validator
const validateLoginForm = [
	check('email')
	.notEmpty().withMessage('Debes ingresar un correo electrónico').bail()
	.isEmail().withMessage('Debes ingresar un correo electrónico válido'),
	check('password').notEmpty().withMessage('Debes ingresar una contraseña')
];

const validateRegisterForm = [
	check('name')
		.notEmpty().withMessage('Debes ingresar un nombre').bail()
		.isLength( { min: 2 }).withMessage('El nombre debe tener mínimo 2 caracteres'),
	check('lastName')
		.notEmpty().withMessage('Debes ingresar un apellido').bail()
		.isLength( { min: 2 }).withMessage('El apellido debe tener mínimo 2 caracteres'),
	check('email')
		.notEmpty().withMessage('Debes ingresar un correo electrónico').bail()
		.isEmail().withMessage('Debes ingresar un correo electrónico válido'),
	check('password')
		.notEmpty().withMessage('Debes ingresar una contraseña').bail()
		.isLength( { min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
	check('userAvatar').custom((value, { req }) => {
		let file = req.file;
		let acceptedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
		
		if (file){
			let fileExtension = path.extname(file.originalname).toLowerCase()
			if(!acceptedExtensions.includes(fileExtension)){
				throw new Error(`Las extensiones del archivo permitidas son ${acceptedExtensions.join(', ')}`)
			}
		}

		return true

	})
];
//finaliza proceso de validación. se pone como middleware

router.get('/login',guestMiddleware, userController.login);
router.post('/login',validateLoginForm, userController.loginProcess);
//formulario de registro
router.get('/register', guestMiddleware, userController.register);
//guardar el nuevo usuario
router.post('/register', fileUpload.single('userAvatar'),validateRegisterForm, userController.create);
router.get('/profile', authMiddleware, userController.profile);
//editar datos de usuario
router.get('/edit',authMiddleware, userController.edit);
router.put('/edit/:id', fileUpload.single('avatarImage'), userController.update);
//eliminar (inactivar) la cuenta
router.post('/deleteAccount/:id', userController.deleteAccount);
router.get('/logout', userController.logout)

module.exports = router;