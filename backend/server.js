
const express = require("express");
const cors = require("cors");

const app = express();

// ─── Middleware ───────────────────────────────────────────────
// CONCEPT 3 — CORS: Allows the React frontend (different origin)
// to talk to this backend. Without this, the browser blocks requests.
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// ─── Root ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Mohammed Danish Portfolio API is running." });
});

// ─── Projects ─────────────────────────────────────────────────
// CONCEPT 2 — Backend route: GET /projects
// Returns full project details: title, description, tech stack,
// links, status, and type (freelance/personal)
app.get("/projects", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Money Manager App",
      desc: "A personal finance management app to track income and expenses with advanced filtering, categorized transactions, and a clean Material 3 UI. Offline data persistence using Room and async tasks using Coroutines.",
      tech: ["Kotlin", "Jetpack Compose", "Room", "MVVM", "Coroutines", "Material 3"],
      type: "Personal",
      status: "Completed",
      github: "https://github.com/mddanish222/Money-Manager-app",
      live: null,
    },
    {
      id: 2,
      title: "KR Timber System",
      desc: "Full-stack timber inventory and financial management system with secure authentication, stock tracking, expenditure management, and real-time profit/loss calculation. Deployed on Render with responsive UI.",
      tech: ["Node.js", "Express", "MongoDB", "HTML", "CSS", "JavaScript"],
      type: "Freelance",
      status: "Completed",
      github: "https://github.com/mddanish222/KR-Timber",
      live: "https://kr-timber.netlify.app",
    },
    {
      id: 3,
      title: "Arsh Infrastructure",
      desc: "Responsive project management system for a construction company featuring an admin dashboard, secure authentication, and project tracking. Fully completed, awaiting client-side deployment.",
      tech: ["Flask", "Python", "PostgreSQL", "HTML", "CSS", "JavaScript"],
      type: "Freelance",
      status: "Awaiting Deployment",
      github: null,
      live: null,
    },
    {
      id: 4,
      title: "Prajayoga E-Paper",
      desc: "Digital newspaper platform with admin controls, secure login, and automated content uploads. Paid freelance project currently in active development.",
      tech: ["Flask", "Python", "MariaDB", "HTML", "CSS", "JavaScript"],
      type: "Paid Freelance",
      status: "Ongoing",
      github: null,
      live: null,
    },
    {
      id: 5,
      title: "QR Code Generator",
      desc: "QR generator supporting text, URLs, and live location using qrcode.js and the browser Geolocation API.",
      tech: ["JavaScript", "QRCode.js", "Geolocation API", "HTML", "CSS"],
      type: "Personal",
      status: "Completed",
      github: "https://github.com/mddanish222/QR-code-generator",
      live: "https://mddanish222.github.io/QR-code-generator",
    },
  ]);
});

// ─── Skills ───────────────────────────────────────────────────
// CONCEPT 2 — Backend route: GET /skills
// Each skill has a name, type (for filtering), and level
app.get("/skills", (req, res) => {
  res.json([
    { name: "HTML",           type: "frontend",  level: 90 },
    { name: "CSS",            type: "frontend",  level: 85 },
    { name: "JavaScript",     type: "frontend",  level: 80 },
    { name: "React",          type: "frontend",  level: 70 },
    { name: "Bootstrap",      type: "frontend",  level: 75 },
    { name: "SvelteKit",      type: "frontend",  level: 55 },

    { name: "Java",           type: "backend",   level: 75 },
    { name: "Python",         type: "backend",   level: 80 },
    { name: "Flask",          type: "backend",   level: 70 },
    { name: "Node.js",        type: "backend",   level: 72 },
    { name: "PHP",            type: "backend",   level: 55 },

    { name: "Kotlin",         type: "mobile",    level: 75 },
    { name: "Jetpack Compose",type: "mobile",    level: 70 },
    { name: "MVVM",           type: "mobile",    level: 68 },

    { name: "MySQL",          type: "database",  level: 80 },
    { name: "PostgreSQL",     type: "database",  level: 72 },
    { name: "MongoDB",        type: "database",  level: 70 },
    { name: "MariaDB",        type: "database",  level: 65 },
    { name: "SQLite",         type: "database",  level: 68 },

    { name: "GitHub",         type: "tools",     level: 85 },
    { name: "VS Code",        type: "tools",     level: 90 },
    { name: "Android Studio", type: "tools",     level: 72 },
    { name: "Netlify",        type: "tools",     level: 70 },
    { name: "Canva",          type: "tools",     level: 75 },
  ]);
});

// ─── Experience ───────────────────────────────────────────────
// CONCEPT 2 — New route: GET /experience
app.get("/experience", (req, res) => {
  res.json([
    {
      id: 1,
      role: "Full Stack Developer (Consultant)",
      company: "Ontum Education Pvt Ltd",
      location: "Bengaluru",
      period: "Feb 2026 – Present",
      stipend: "₹5,000/month",
      points: [
        "Working on MentorAI platform with hands-on real-world software development.",
        "Contributing to web and application development using modern technologies.",
        "Gaining exposure to development lifecycle and team collaboration.",
      ],
    },
  ]);
});

// ─── Education ────────────────────────────────────────────────
// CONCEPT 2 — New route: GET /education
app.get("/education", (req, res) => {
  res.json([
    {
      id: 1,
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Seshadripuram College, Tumkur University",
      year: "Pursuing",
      score: "CGPA: 8.52 / 10",
    },
    {
      id: 2,
      degree: "PUC (Commerce)",
      institution: "Vidyaniketan Pre-University College, Tumkur",
      year: "2023",
      score: "91.16%",
    },
    {
      id: 3,
      degree: "SSLC",
      institution: "Vidyaniketan High School, Tumkur",
      year: "2021",
      score: "79.52%",
    },
  ]);
});

// ─── Certifications ───────────────────────────────────────────
// CONCEPT 2 — New route: GET /certifications
app.get("/certifications", (req, res) => {
  res.json([
    { id: 1, title: "Java Full Stack Development", issuer: "S Spider Institute", note: "ISO Certified" },
    { id: 2, title: "R Programming for Beginners",  issuer: "Simplilearn", note: null },
    { id: 3, title: "Introduction to Digital Marketing Fundamentals", issuer: "Simplilearn", note: null },
    { id: 4, title: "Buildathon Certificate", issuer: "College Event", note: "2nd Place — Web Dev Challenge" },
    { id: 5, title: "CODE VITA Workshop", issuer: "College", note: "C Programming" },
    { id: 6, title: "Database Connectivity Workshop", issuer: "College", note: "C# and MSSQL" },
    { id: 7, title: "Warehouse Associate", issuer: "Atos Prayas Foundation", note: null },
  ]);
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});