// db/pool.js
// Railway PostgreSQL connection (PRODUCTION READY)

const { Pool } = require("pg");

// Create pool using Railway DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Required for Railway / production
  ssl: {
    rejectUnauthorized: false,
  },

  // Pool settings (optional but good)
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection when server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL (Railway)");
    release();
  }
});

module.exports = pool;
