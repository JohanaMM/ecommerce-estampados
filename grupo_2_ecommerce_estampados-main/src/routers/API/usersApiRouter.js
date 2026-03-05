const express = require('express');
const router = express.Router();
const usersApiController = require('../../controllers/API/usersApiController')

router.get('/', usersApiController.list);
router.get('/:id', usersApiController.detail);
router.post('/login', usersApiController.login);

module.exports = router;