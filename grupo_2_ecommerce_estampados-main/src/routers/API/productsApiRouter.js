const express = require('express');
const router = express.Router();
const producstApiController = require('../../controllers/API/productsApiController')

router.get('/', producstApiController.list);
router.get('/:id', producstApiController.detail);

module.exports = router;