const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')
const multer = require('multer');
const path = require('path');
const { check, validationResult} = require('express-validator');

let adminMiddleware = require('../middlewares/adminMiddleware');

/*Multer*/
const storage = multer.diskStorage({
	destination: (req, file, callback) =>{
		let folder = path.join(__dirname, '../../public/img');

		callback(null, folder)
	},
    filename: (req, file, callback) =>{
        let imageName = Date.now() + path.extname(file.originalname);

		callback(null, imageName);
    }
});

const fileUpload = multer({ storage: storage });
/*fin de proceso multer*/

//proceso de validación con express validator

//validación de los formularios de creación y modificación de productos
const validateCreateForm = [
	check('name')
		.notEmpty().withMessage('Debes ingresar un nombre del producto').bail()
		.isLength( { min: 5 }).withMessage('El nombre debe tener mínimo 5 caracteres'),
	check('description')
		.notEmpty().withMessage('Debes ingresar una descripción').bail()
		.isLength( { min: 20 }).withMessage('La descripción debe tener mínimo 20 caracteres'),
	check('price')
		.notEmpty().withMessage('Debes ingresar el precio').bail()
		.isLength( { min: 2, max: 10 }).withMessage('El precio debe tener mínimo 2 caracteres y máximo 10'),
	check('productImage').custom((value, { req }) => {
		let file = req.file;
		let acceptedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
		
		if (file){
			let fileExtension = path.extname(file.originalname).toLowerCase()
			if(!acceptedExtensions.includes(fileExtension)){
				throw new Error(`Las extensiones del archivo permitidas son ${acceptedExtensions.join(', ')}`)
			}
		}
		else{
			throw new Error('Debes subir la imagen del producto')
		}

		return true

	})
];

const validateModifyForm = [
	check('name')
		.notEmpty().withMessage('Debes ingresar un nombre del producto').bail()
		.isLength( { min: 5 }).withMessage('El nombre debe tener mínimo 5 caracteres'),
	check('description')
		.notEmpty().withMessage('Debes ingresar una descripción').bail()
		.isLength( { min: 20 }).withMessage('La descripción debe tener mínimo 20 caracteres'),
	check('price')
		.notEmpty().withMessage('Debes ingresar el precio').bail()
		.isLength( { min: 2, max: 10 }).withMessage('El precio debe tener mínimo 2 caracteres y máximo 10'),
	check('productImage').custom((value, { req }) => {
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
//finaliza proceso de validación

router.get('/list', productController.list)
// router.get('/products', productController.products);
router.get('/productDetails/:id', productController.productDetails);

router.get('/createProduct', adminMiddleware, productController.createProduct);
router.post('/createProduct',fileUpload.single('productImage'), validateCreateForm, productController.storeProduct);

router.get('/editProduct/:id', adminMiddleware, productController.editProduct);
router.put('/editProduct/:id',fileUpload.single('productImage'), validateModifyForm, productController.update);

// router.get('/delete/:id/', moviesController.delete);
router.post('/delete/:id', adminMiddleware, productController.destroy); 

router.get('/inactiveProducts', adminMiddleware, productController.listInactiveProducts);

module.exports = router;