const express = require("express");
const router = express.Router();
const shippingApiController = require("../../controllers/API/shippingApiController");

router.post("/quote", shippingApiController.quote);

module.exports = router;
