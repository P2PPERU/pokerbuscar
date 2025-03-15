const { getJugadorData } = require("../models/jugadorModel"); // ✅ Importación desde el modelo

const getJugador = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`🔹 Buscando datos para: ${nombre}`);

    const jugador = await getJugadorData(nombre);

    if (!jugador) {
      console.warn(`⚠️ Jugador '${nombre}' no encontrado.`);
      return res.status(404).json({ message: `Jugador '${nombre}' no encontrado.` });
    }

    console.log(`✅ Datos obtenidos para '${nombre}':`, jugador);
    return res.json(jugador); // ✅ Devuelve un solo objeto en vez de un array

  } catch (error) {
    console.error("❌ Error en getJugador:", error.message);
    return res.status(500).json({ error: "Error interno del servidor. Verifica los logs." });
  }
};

module.exports = { getJugador };
