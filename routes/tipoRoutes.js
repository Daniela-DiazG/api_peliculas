const express = require("express");
const router = express.Router();

const tipoController = require("../controllers/tipoController");

router.get("/", tipoController.getTipos);

router.post("/", tipoController.createTipo);

router.put("/:id", tipoController.updateTipo);

router.delete("/:id", tipoController.deleteTipo);

module.exports = router;