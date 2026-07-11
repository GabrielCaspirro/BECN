const router = require("express").Router();

const controller = require("../controllers/dadosController");

router.get("/dados", controller.getDados);

router.get("/stream", controller.stream);

router.post("/dados", controller.postDados);

module.exports = router;