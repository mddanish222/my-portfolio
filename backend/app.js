// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");

// Import Mongoose Models
const Project = require("./db/models/Project");
const Skill = require("./db/models/Skill");
const Experience = require("./db/models/Experience");
const Education = require("./db/models/Education");
const Certification = require("./db/models/Certification");
const Setting = require("./db/models/Setting");

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" })); // Increased limit for Base64 PDF Resume & Image uploads
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Rate Limiter: Max 5 failed login attempts per 15 minutes
const loginAttempts = new Map();

function loginRateLimiter(req, res, next) {
  if (process.env.NODE_ENV === "test") return next();

  const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const userAttempts = loginAttempts.get(ip) || [];
  const recentAttempts = userAttempts.filter((timestamp) => now - timestamp < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      error: "Too many failed login attempts. Account locked for 15 minutes.",
    });
  }

  req.recordFailedAttempt = () => {
    recentAttempts.push(now);
    loginAttempts.set(ip, recentAttempts);
  };

  next();
}

// Helper to check valid MongoDB ObjectId or ID
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── Root ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Mohammed Danish Portfolio API (MongoDB Atlas) is running." });
});

// ─── Admin Login ──────────────────────────────────────────────
app.post("/admin/login", loginRateLimiter, (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    if (typeof req.recordFailedAttempt === "function") {
      req.recordFailedAttempt();
    }
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
  );

  res.json({ token });
});

// ══════════════════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════════════════

// GET /projects — list all (optionally filter by type)
app.get("/projects", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type && type !== "All") {
      filter.type = type;
    }

    const projects = await Project.find(filter).sort({ createdAt: 1 });
    res.json(projects);
  } catch (err) {
    console.error("GET /projects error:", err.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// POST /projects
app.post("/projects", authMiddleware, async (req, res) => {
  try {
    const { title, desc, tech, type, status, github, live } = req.body;

    const errors = [];
    if (!title || typeof title !== "string") errors.push("title is required");
    if (!desc || typeof desc !== "string") errors.push("desc is required");
    if (!tech || !Array.isArray(tech) || tech.length === 0) errors.push("tech must be a non-empty array");
    if (!["Personal", "Freelance", "Paid Freelance"].includes(type))
      errors.push("type must be Personal, Freelance, or Paid Freelance");
    if (!["Completed", "Ongoing", "Awaiting Deployment"].includes(status))
      errors.push("status must be Completed, Ongoing, or Awaiting Deployment");
    if (errors.length) return res.status(400).json({ errors });

    const newProject = await Project.create({
      title,
      description: desc,
      tech,
      type,
      status,
      github: github || null,
      live: live || null,
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error("POST /projects error:", err.message);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /projects/:id
app.put("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, desc, tech, type, status, github, live } = req.body;

    const errors = [];
    if (!title || typeof title !== "string") errors.push("title is required");
    if (!desc || typeof desc !== "string") errors.push("desc is required");
    if (!tech || !Array.isArray(tech) || tech.length === 0) errors.push("tech must be a non-empty array");
    if (!["Personal", "Freelance", "Paid Freelance"].includes(type))
      errors.push("type must be Personal, Freelance, or Paid Freelance");
    if (!["Completed", "Ongoing", "Awaiting Deployment"].includes(status))
      errors.push("status must be Completed, Ongoing, or Awaiting Deployment");
    if (errors.length) return res.status(400).json({ errors });

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description: desc,
        tech,
        type,
        status,
        github: github || null,
        live: live || null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error("PUT /projects error:", err.message);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /projects/:id
app.delete("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("DELETE /projects error:", err.message);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// ══════════════════════════════════════════════════════════════
// SKILLS
// ══════════════════════════════════════════════════════════════

// GET /skills
app.get("/skills", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type && type !== "all") {
      filter.type = type;
    }

    const skills = await Skill.find(filter).sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) {
    console.error("GET /skills error:", err.message);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// POST /skills
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

    const newSkill = await Skill.create({ name, type, level });
    res.status(201).json(newSkill);
  } catch (err) {
    console.error("POST /skills error:", err.message);
    res.status(500).json({ error: "Failed to create skill" });
  }
});

// PUT /skills/:id
app.put("/skills/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const { name, type, level } = req.body;

    const errors = [];
    if (!name || typeof name !== "string") errors.push("name is required");
    if (!["frontend", "backend", "mobile", "database", "tools"].includes(type))
      errors.push("type must be frontend, backend, mobile, database, or tools");
    if (level === undefined || typeof level !== "number" || level < 0 || level > 100)
      errors.push("level must be an integer between 0 and 100");

    if (errors.length) return res.status(400).json({ errors });

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { name, type, level },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json(updatedSkill);
  } catch (err) {
    console.error("PUT /skills error:", err.message);
    res.status(500).json({ error: "Failed to update skill" });
  }
});

// DELETE /skills/:id
app.delete("/skills/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Skill.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error("DELETE /skills error:", err.message);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

// ══════════════════════════════════════════════════════════════
// EXPERIENCE
// ══════════════════════════════════════════════════════════════

// GET /experience
app.get("/experience", async (req, res) => {
  try {
    const exp = await Experience.find().sort({ createdAt: 1 });
    res.json(exp);
  } catch (err) {
    console.error("GET /experience error:", err.message);
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

// POST /experience
app.post("/experience", authMiddleware, async (req, res) => {
  try {
    const { role, company, location, period, stipend, points } = req.body;

    const errors = [];
    if (!role || typeof role !== "string") errors.push("role is required");
    if (!company || typeof company !== "string") errors.push("company is required");
    if (!location || typeof location !== "string") errors.push("location is required");
    if (!period || typeof period !== "string") errors.push("period is required");
    if (!points || !Array.isArray(points) || points.length === 0)
      errors.push("points must be a non-empty array");
    if (errors.length) return res.status(400).json({ errors });

    const newExp = await Experience.create({
      role,
      company,
      location,
      period,
      stipend: stipend || null,
      points,
    });

    res.status(201).json(newExp);
  } catch (err) {
    console.error("POST /experience error:", err.message);
    res.status(500).json({ error: "Failed to create experience" });
  }
});

// PUT /experience/:id
app.put("/experience/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const { role, company, location, period, stipend, points } = req.body;

    const errors = [];
    if (!role || typeof role !== "string") errors.push("role is required");
    if (!company || typeof company !== "string") errors.push("company is required");
    if (!location || typeof location !== "string") errors.push("location is required");
    if (!period || typeof period !== "string") errors.push("period is required");
    if (!points || !Array.isArray(points) || points.length === 0)
      errors.push("points must be a non-empty array");
    if (errors.length) return res.status(400).json({ errors });

    const updated = await Experience.findByIdAndUpdate(
      id,
      { role, company, location, period, stipend: stipend || null, points },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /experience error:", err.message);
    res.status(500).json({ error: "Failed to update experience" });
  }
});

// DELETE /experience/:id
app.delete("/experience/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Experience.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.json({ message: "Experience deleted" });
  } catch (err) {
    console.error("DELETE /experience error:", err.message);
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

// ══════════════════════════════════════════════════════════════
// EDUCATION
// ══════════════════════════════════════════════════════════════

// GET /education
app.get("/education", async (req, res) => {
  try {
    const edu = await Education.find().sort({ createdAt: 1 });
    res.json(edu);
  } catch (err) {
    console.error("GET /education error:", err.message);
    res.status(500).json({ error: "Failed to fetch education" });
  }
});

// POST /education
app.post("/education", authMiddleware, async (req, res) => {
  try {
    const { degree, institution, year, score } = req.body;

    const errors = [];
    if (!degree || typeof degree !== "string") errors.push("degree is required");
    if (!institution || typeof institution !== "string") errors.push("institution is required");
    if (!year || typeof year !== "string") errors.push("year is required");
    if (!score || typeof score !== "string") errors.push("score is required");
    if (errors.length) return res.status(400).json({ errors });

    const newEdu = await Education.create({ degree, institution, year, score });
    res.status(201).json(newEdu);
  } catch (err) {
    console.error("POST /education error:", err.message);
    res.status(500).json({ error: "Failed to create education" });
  }
});

// PUT /education/:id
app.put("/education/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const { degree, institution, year, score } = req.body;

    const errors = [];
    if (!degree || typeof degree !== "string") errors.push("degree is required");
    if (!institution || typeof institution !== "string") errors.push("institution is required");
    if (!year || typeof year !== "string") errors.push("year is required");
    if (!score || typeof score !== "string") errors.push("score is required");
    if (errors.length) return res.status(400).json({ errors });

    const updated = await Education.findByIdAndUpdate(
      id,
      { degree, institution, year, score },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Education not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /education error:", err.message);
    res.status(500).json({ error: "Failed to update education" });
  }
});

// DELETE /education/:id
app.delete("/education/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Education.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Education not found" });
    }

    res.json({ message: "Education deleted" });
  } catch (err) {
    console.error("DELETE /education error:", err.message);
    res.status(500).json({ error: "Failed to delete education" });
  }
});

// ══════════════════════════════════════════════════════════════
// CERTIFICATIONS
// ══════════════════════════════════════════════════════════════

// GET /certifications
app.get("/certifications", async (req, res) => {
  try {
    const certs = await Certification.find().sort({ createdAt: 1 });
    res.json(certs);
  } catch (err) {
    console.error("GET /certifications error:", err.message);
    res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

// POST /certifications
app.post("/certifications", authMiddleware, async (req, res) => {
  try {
    const { title, issuer, note } = req.body;

    const errors = [];
    if (!title || typeof title !== "string") errors.push("title is required");
    if (!issuer || typeof issuer !== "string") errors.push("issuer is required");
    if (errors.length) return res.status(400).json({ errors });

    const newCert = await Certification.create({ title, issuer, note: note || null });
    res.status(201).json(newCert);
  } catch (err) {
    console.error("POST /certifications error:", err.message);
    res.status(500).json({ error: "Failed to create certification" });
  }
});

// PUT /certifications/:id
app.put("/certifications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, issuer, note } = req.body;

    const errors = [];
    if (!title || typeof title !== "string") errors.push("title is required");
    if (!issuer || typeof issuer !== "string") errors.push("issuer is required");
    if (errors.length) return res.status(400).json({ errors });

    const updated = await Certification.findByIdAndUpdate(
      id,
      { title, issuer, note: note || null },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Certification not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /certifications error:", err.message);
    res.status(500).json({ error: "Failed to update certification" });
  }
});

// DELETE /certifications/:id
app.delete("/certifications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Certification.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Certification not found" });
    }

    res.json({ message: "Certification deleted" });
  } catch (err) {
    console.error("DELETE /certifications error:", err.message);
    res.status(500).json({ error: "Failed to delete certification" });
  }
});

// ══════════════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════════════

// GET /settings/:key
app.get("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    if (!setting) {
      return res.json({ value: null });
    }
    res.json({ value: setting.value });
  } catch (err) {
    console.error("GET /settings error:", err.message);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// POST /settings/:key
app.post("/settings/:key", authMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    await Setting.findOneAndUpdate(
      { key },
      { key, value: value || null },
      { upsert: true, new: true }
    );

    res.json({ success: true, key, value });
  } catch (err) {
    console.error("POST /settings error:", err.message);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

module.exports = app;
