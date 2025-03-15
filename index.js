const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// 🔹 Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Restringe el acceso si se define FRONTEND_URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// 🔹 Rutas
app.use("/jugadores", require("./routes/jugadorRoutes"));

app.get("/", (req, res) => {
  res.send("🚀 API de PokerTracker funcionando...");
});

// 🔹 Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error interno del servidor:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🔹 Iniciar servidor solo si la conexión a la BD es exitosa
db.connect()
  .then(() => {
    console.log("✅ Conectado a PostgreSQL. Iniciando servidor...");
    app.listen(port, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("❌ No se pudo conectar a PostgreSQL:", err.message);
    process.exit(1); // Cierra la app si la BD no está disponible
  });

module.exports = app; // Permite pruebas unitarias
// Compare this snippet from backend/app.js:
// const express = require("express");