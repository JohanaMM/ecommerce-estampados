const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController')
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const cartRouter = require('./cartRouter')
const adminRouter = require('./adminRouter')
const productsApiRouter = require('./API/productsApiRouter')
const usersApiRouter = require('./API/usersApiRouter')

router.get('/', mainController.home);
router.get('/termsAndConditions', mainController.termsAndConditions);
router.get('/aboutUs', mainController.aboutUs);

router.use('/products',productRouter)
router.use('/users',userRouter)
router.use('/cart',cartRouter)
router.use('/admin',adminRouter)
router.use('/api/products',productsApiRouter)
router.use('/api/users',usersApiRouter)

module.exports = router;