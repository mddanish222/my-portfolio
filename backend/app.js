// app.js
// ─────────────────────────────────────────────────────────────
// All routes now read/write from PostgreSQL via the shared pool.
// Every route has:
//   • Input validation   (returns 400 on bad data)
//   • DB error handling  (returns 500 on query failure)
//   • 404 handling       (PUT/DELETE when id doesn't exist)
// ─────────────────────────────────────────────────────────────

const express = require("express");
const cors    = require("cors");
const pool    = require("./db/pool");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Root ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Mohammed Danish Portfolio API is running." });
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

// POST /projects — add a new project
// Required body fields: title, desc, tech (array), type, status
app.post("/projects", async (req, res) => {
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
app.put("/projects/:id", async (req, res) => {
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
app.delete("/projects/:id", async (req, res) => {
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
app.post("/skills", async (req, res) => {
  try {
    const { name, type, level } = req.body;

    const errors = [];
    if (!name || typeof name !== "string") errors.push("name is required");
    if (!["frontend", "backend", "mobile", "database", "tools"].includes(type))
      errors.push("type must be frontend, backend, mobile, database, or tools");
    if (typeof level !== "number" || level < 0 || level > 100)
      errors.push("level must be a number between 0 and 100");
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

// PUT /skills/:id
app.put("/skills/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { name, type, level } = req.body;

    const errors = [];
    if (!name || typeof name !== "string") errors.push("name is required");
    if (!["frontend", "backend", "mobile", "database", "tools"].includes(type))
      errors.push("type must be frontend, backend, mobile, database, or tools");
    if (typeof level !== "number" || level < 0 || level > 100)
      errors.push("level must be a number between 0 and 100");
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

// DELETE /skills/:id
app.delete("/skills/:id", async (req, res) => {
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

app.post("/experience", async (req, res) => {
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

app.put("/experience/:id", async (req, res) => {
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

app.delete("/experience/:id", async (req, res) => {
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

app.post("/education", async (req, res) => {
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

app.put("/education/:id", async (req, res) => {
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

app.delete("/education/:id", async (req, res) => {
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

app.post("/certifications", async (req, res) => {
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

app.put("/certifications/:id", async (req, res) => {
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

app.delete("/certifications/:id", async (req, res) => {
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

module.exports = app;
