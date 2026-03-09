const express = require("express");
const router = express.Router();

const generoController = require("../controllers/generoController");

router.get("/", generoController.getGeneros);

router.get("/:id", generoController.getGenero);

router.post("/", generoController.createGenero);

router.put("/:id", generoController.updateGenero);

router.delete("/:id", generoController.deleteGenero);

module.exports = router;