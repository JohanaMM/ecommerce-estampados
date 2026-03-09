const express = require("express");
const multer = require("multer");
const path = require("path");
const adminApiMiddleware = require("../../middlewares/adminApiMiddleware");
const adminApiController = require("../../controllers/API/adminApiController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, "../../../public/img");
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg");
    const name = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  },
});
const upload = multer({ storage });

router.use(adminApiMiddleware);

router.get("/catalog", adminApiController.getCatalog);
router.get("/products", adminApiController.listProducts);
router.get("/products/:id", adminApiController.getProductForEdit);
router.post("/products", upload.array("productImages", 10), adminApiController.createProduct);
router.put("/products/:id", upload.array("productImages", 10), adminApiController.updateProduct);
router.post("/products/:id/update", upload.array("productImages", 10), adminApiController.updateProduct);
router.post("/products/:id/activate", adminApiController.activateProduct);
router.delete("/products/:id", adminApiController.deleteProduct);

router.get("/orders", adminApiController.listOrders);
router.post("/orders/:id/status", express.json(), adminApiController.updateOrderStatus);
router.patch("/orders/:id", express.json(), adminApiController.updateOrderStatus);
router.put("/orders/:id", express.json(), adminApiController.updateOrderStatus);

module.exports = router;
