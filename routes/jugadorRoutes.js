const express = require("express");
const router = express.Router();
const { getJugador } = require("../controllers/jugadorController"); // ✅ Importar correctamente

// Definir ruta para obtener datos de un jugador
router.get("/:nombre", getJugador);

module.exports = router;
