// app.js
const express = require("express");
const cors    = require("cors");
const pool    = require("./db/pool");
const jwt     = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");

// Ensure settings table exists in PostgreSQL
const initSettingsTable = pool.query(
  `CREATE TABLE IF NOT EXISTS settings (
     key   VARCHAR(100) PRIMARY KEY,
     value TEXT
   )`
);
if (initSettingsTable && typeof initSettingsTable.catch === "function") {
  initSettingsTable.catch(err => console.error("❌ Failed to create settings table:", err.message));
}


const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" })); // Increase JSON body limit for Base64 image upload
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// ─── Root ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Mohammed Danish Portfolio API is running." });
});

// ─── Admin Login ──────────────────────────────────────────────
app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
  );

  res.json({ token });
});
// ══════════════════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════════════════

// GET /projects — list all (optionally filter by type)
// Example: GET /projects?type=Freelance
app.get("/projects", async (req, res) => {
  try {
    const { type } = req.query;

    let query  = "SELECT * FROM projects ORDER BY id";
    let params = [];

    if (type && type !== "All") {
      query  = "SELECT * FROM projects WHERE type = $1 ORDER BY id";
      params = [type];
    }

    const result = await pool.query(query, params);

    // Rename db column "description" → "desc" to match frontend
    const rows = result.rows.map((p) => ({
      id:     p.id,
      title:  p.title,
      desc:   p.description,
      tech:   p.tech,
      type:   p.type,
      status: p.status,
      github: p.github,
      live:   p.live,
    }));

    res.json(rows);
  } catch (err) {
    console.error("GET /projects error:", err.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});


app.post("/projects", authMiddleware, async (req, res) => {
  try {
    const { title, desc, tech, type, status, github, live } = req.body;

    // ── Validation ──────────────────────────────────────────
    const errors = [];
    if (!title  || typeof title  !== "string") errors.push("title is required");
    if (!desc   || typeof desc   !== "string") errors.push("desc is required");
    if (!tech   || !Array.isArray(tech) || tech.length === 0) errors.push("tech must be a non-empty array");
    if (!["Personal", "Freelance", "Paid Freelance"].includes(type))
      errors.push("type must be Personal, Freelance, or Paid Freelance");
    if (!["Completed", "Ongoing", "Awaiting Deployment"].includes(status))
      errors.push("status must be Completed, Ongoing, or Awaiting Deployment");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      `INSERT INTO projects (title, description, tech, type, status, github, live)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, desc, tech, type, status, github || null, live || null]
    );

    const p = result.rows[0];
    res.status(201).json({ ...p, desc: p.description });
  } catch (err) {
    console.error("POST /projects error:", err.message);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /projects/:id — update an existing project
app.put("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, desc, tech, type, status, github, live } = req.body;

    // ── Validation ──────────────────────────────────────────
    const errors = [];
    if (!title  || typeof title  !== "string") errors.push("title is required");
    if (!desc   || typeof desc   !== "string") errors.push("desc is required");
    if (!tech   || !Array.isArray(tech) || tech.length === 0) errors.push("tech must be a non-empty array");
    if (!["Personal", "Freelance", "Paid Freelance"].includes(type))
      errors.push("type must be Personal, Freelance, or Paid Freelance");
    if (!["Completed", "Ongoing", "Awaiting Deployment"].includes(status))
      errors.push("status must be Completed, Ongoing, or Awaiting Deployment");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      `UPDATE projects
       SET title=$1, description=$2, tech=$3, type=$4, status=$5, github=$6, live=$7
       WHERE id=$8
       RETURNING *`,
      [title, desc, tech, type, status, github || null, live || null, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Project not found" });

    const p = result.rows[0];
    res.json({ ...p, desc: p.description });
  } catch (err) {
    console.error("PUT /projects error:", err.message);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /projects/:id
app.delete("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const result = await pool.query("DELETE FROM projects WHERE id=$1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("DELETE /projects error:", err.message);
    res.status(500).json({ error: "Failed to delete project" });
  }
});


// ══════════════════════════════════════════════════════════════
// SKILLS
// ══════════════════════════════════════════════════════════════

// GET /skills — list all (optionally filter by type)
app.get("/skills", async (req, res) => {
  try {
    const { type } = req.query;

    let query  = "SELECT * FROM skills ORDER BY id";
    let params = [];

    if (type && type !== "all") {
      query  = "SELECT * FROM skills WHERE type = $1 ORDER BY id";
      params = [type];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /skills error:", err.message);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// POST /skills — add a new skill
app.post("/skills", authMiddleware, async (req, res) => {
  try {
    const { name, type, level } = req.body;

    const errors = [];
    if (!name || typeof name !== "string") errors.push("name is required");
    if (!["frontend", "backend", "mobile", "database", "tools"].includes(type))
      errors.push("type must be frontend, backend, mobile, database, or tools");
    if (level === undefined || typeof level !== "number" || level < 0 || level > 100)
      errors.push("level must be an integer between 0 and 100");
    
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      "INSERT INTO skills (name, type, level) VALUES ($1,$2,$3) RETURNING *",
      [name, type, level]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /skills error:", err.message);
    res.status(500).json({ error: "Failed to create skill" });
  }
});


app.put("/skills/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { name, type, level } = req.body;

    const errors = [];
    if (!name || typeof name !== "string") errors.push("name is required");
    if (!["frontend", "backend", "mobile", "database", "tools"].includes(type))
      errors.push("type must be frontend, backend, mobile, database, or tools");
    if (level === undefined || typeof level !== "number" || level < 0 || level > 100)
      errors.push("level must be an integer between 0 and 100");
    
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      "UPDATE skills SET name=$1, type=$2, level=$3 WHERE id=$4 RETURNING *",
      [name, type, level, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Skill not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /skills error:", err.message);
    res.status(500).json({ error: "Failed to update skill" });
  }
});


app.delete("/skills/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const result = await pool.query("DELETE FROM skills WHERE id=$1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Skill not found" });

    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error("DELETE /skills error:", err.message);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});


// ══════════════════════════════════════════════════════════════
// EXPERIENCE
// ══════════════════════════════════════════════════════════════

app.get("/experience", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM experience ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /experience error:", err.message);
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

app.post("/experience", authMiddleware, async (req, res) => {
  try {
    const { role, company, location, period, stipend, points } = req.body;

    const errors = [];
    if (!role     || typeof role     !== "string") errors.push("role is required");
    if (!company  || typeof company  !== "string") errors.push("company is required");
    if (!location || typeof location !== "string") errors.push("location is required");
    if (!period   || typeof period   !== "string") errors.push("period is required");
    if (!points   || !Array.isArray(points) || points.length === 0)
      errors.push("points must be a non-empty array");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      `INSERT INTO experience (role, company, location, period, stipend, points)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [role, company, location, period, stipend || null, points]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /experience error:", err.message);
    res.status(500).json({ error: "Failed to create experience" });
  }
});

app.put("/experience/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { role, company, location, period, stipend, points } = req.body;

    const errors = [];
    if (!role     || typeof role     !== "string") errors.push("role is required");
    if (!company  || typeof company  !== "string") errors.push("company is required");
    if (!location || typeof location !== "string") errors.push("location is required");
    if (!period   || typeof period   !== "string") errors.push("period is required");
    if (!points   || !Array.isArray(points) || points.length === 0)
      errors.push("points must be a non-empty array");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      `UPDATE experience
       SET role=$1, company=$2, location=$3, period=$4, stipend=$5, points=$6
       WHERE id=$7 RETURNING *`,
      [role, company, location, period, stipend || null, points, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Experience not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /experience error:", err.message);
    res.status(500).json({ error: "Failed to update experience" });
  }
});

app.delete("/experience/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const result = await pool.query("DELETE FROM experience WHERE id=$1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Experience not found" });

    res.json({ message: "Experience deleted" });
  } catch (err) {
    console.error("DELETE /experience error:", err.message);
    res.status(500).json({ error: "Failed to delete experience" });
  }
});


// ══════════════════════════════════════════════════════════════
// EDUCATION
// ══════════════════════════════════════════════════════════════

app.get("/education", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM education ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /education error:", err.message);
    res.status(500).json({ error: "Failed to fetch education" });
  }
});

app.post("/education", authMiddleware, async (req, res) => {
  try {
    const { degree, institution, year, score } = req.body;

    const errors = [];
    if (!degree      || typeof degree      !== "string") errors.push("degree is required");
    if (!institution || typeof institution !== "string") errors.push("institution is required");
    if (!year        || typeof year        !== "string") errors.push("year is required");
    if (!score       || typeof score       !== "string") errors.push("score is required");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      "INSERT INTO education (degree, institution, year, score) VALUES ($1,$2,$3,$4) RETURNING *",
      [degree, institution, year, score]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /education error:", err.message);
    res.status(500).json({ error: "Failed to create education" });
  }
});

app.put("/education/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { degree, institution, year, score } = req.body;

    const errors = [];
    if (!degree      || typeof degree      !== "string") errors.push("degree is required");
    if (!institution || typeof institution !== "string") errors.push("institution is required");
    if (!year        || typeof year        !== "string") errors.push("year is required");
    if (!score       || typeof score       !== "string") errors.push("score is required");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      "UPDATE education SET degree=$1, institution=$2, year=$3, score=$4 WHERE id=$5 RETURNING *",
      [degree, institution, year, score, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Education not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /education error:", err.message);
    res.status(500).json({ error: "Failed to update education" });
  }
});

app.delete("/education/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const result = await pool.query("DELETE FROM education WHERE id=$1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Education not found" });

    res.json({ message: "Education deleted" });
  } catch (err) {
    console.error("DELETE /education error:", err.message);
    res.status(500).json({ error: "Failed to delete education" });
  }
});


// ══════════════════════════════════════════════════════════════
// CERTIFICATIONS
// ══════════════════════════════════════════════════════════════

app.get("/certifications", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM certifications ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /certifications error:", err.message);
    res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

app.post("/certifications", authMiddleware, async (req, res) => {
  try {
    const { title, issuer, note } = req.body;

    const errors = [];
    if (!title  || typeof title  !== "string") errors.push("title is required");
    if (!issuer || typeof issuer !== "string") errors.push("issuer is required");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      "INSERT INTO certifications (title, issuer, note) VALUES ($1,$2,$3) RETURNING *",
      [title, issuer, note || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /certifications error:", err.message);
    res.status(500).json({ error: "Failed to create certification" });
  }
});

app.put("/certifications/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, issuer, note } = req.body;

    const errors = [];
    if (!title  || typeof title  !== "string") errors.push("title is required");
    if (!issuer || typeof issuer !== "string") errors.push("issuer is required");
    if (errors.length) return res.status(400).json({ errors });

    const result = await pool.query(
      "UPDATE certifications SET title=$1, issuer=$2, note=$3 WHERE id=$4 RETURNING *",
      [title, issuer, note || null, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Certification not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /certifications error:", err.message);
    res.status(500).json({ error: "Failed to update certification" });
  }
});

app.delete("/certifications/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const result = await pool.query("DELETE FROM certifications WHERE id=$1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Certification not found" });

    res.json({ message: "Certification deleted" });
  } catch (err) {
    console.error("DELETE /certifications error:", err.message);
    res.status(500).json({ error: "Failed to delete certification" });
  }
});

// ══════════════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════════════

// GET /settings/:key — retrieve a setting by key
app.get("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const result = await pool.query("SELECT value FROM settings WHERE key = $1", [key]);
    if (result.rows.length === 0) {
      return res.json({ value: null });
    }
    res.json({ value: result.rows[0].value });
  } catch (err) {
    console.error("GET /settings error:", err.message);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// POST /settings/:key — upsert a setting (admin only)
app.post("/settings/:key", authMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    await pool.query(
      `INSERT INTO settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value`,
      [key, value || null]
    );

    res.json({ success: true, key, value });
  } catch (err) {
    console.error("POST /settings error:", err.message);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

module.exports = app;

