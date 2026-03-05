const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')
let authMiddleware = require("../middlewares/authMiddleware");

router.get('/cart', authMiddleware, cartController.cart);
router.get("/cartList", cartController.list)

module.exports = router;