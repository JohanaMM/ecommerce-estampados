const express = require("express");
const router = express.Router();
const ordersApiController = require("../../controllers/API/ordersApiController");

router.get("/", ordersApiController.listByUser);
router.post("/", ordersApiController.create);

module.exports = router;
