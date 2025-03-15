const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "PT4DB",
  password: process.env.DB_PASSWORD || "",  // Evita errores si está vacío
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  max: 20,  // Máximo de conexiones activas
  idleTimeoutMillis: 30000,  // Cierra conexiones inactivas tras 30s
  connectionTimeoutMillis: 5000,  // Espera máximo 5s para conectar
});

// Verifica conexión antes de exportar
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado a PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ Error al conectar a PostgreSQL:", err.message);
    process.exit(1);
  }
})();

module.exports = pool;
