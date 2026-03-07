const express = require('express');
const router = express.Router();
const usersApiController = require('../../controllers/API/usersApiController')

router.get("/", usersApiController.list);
router.get("/:id", usersApiController.detail);
router.post("/register", usersApiController.register);
router.post("/login", usersApiController.login);
router.post("/forgot-password", usersApiController.forgotPassword);
router.post("/reset-password", usersApiController.resetPassword);
router.put("/:id", usersApiController.updateProfile);

module.exports = router;