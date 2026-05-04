// db/pool.js
// ─────────────────────────────────────────────────────────────
// Exports a single pg.Pool instance shared across all routes.
// Connection pooling means we don't open/close a new DB
// connection on every request — the pool keeps a set of
// connections alive and reuses them.
// ─────────────────────────────────────────────────────────────

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME     || "portfolio_db",
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "",

  // Pool config
  max:             10,   // max connections in pool
  idleTimeoutMillis: 30000,  // close idle connections after 30s
  connectionTimeoutMillis: 2000, // error if no connection in 2s
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database");
    release();
  }
});

module.exports = pool;