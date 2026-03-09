const express = require("express");
const router = express.Router();

const productoraController = require("../controllers/productoraController");

router.get("/", productoraController.getProductoras);

router.post("/", productoraController.createProductora);

router.put("/:id", productoraController.updateProductora);

router.delete("/:id", productoraController.deleteProductora);

module.exports = router;