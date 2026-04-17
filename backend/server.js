const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// projects API
app.get("/projects", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Money Manager App",
      desc: "Kotlin, Jetpack Compose, MVVM",
    },
    {
      id: 2,
      title: "KR Timber System",
      desc: "Node.js, MongoDB, Express",
    },
    {
      id: 3,
      title: "Arsh Infrastructure",
      desc: "Flask, PostgreSQL",
    },
    {
      id: 4,
      title: "Prajayoga E-Paper",
      desc: "Flask, MariaDB",
    },
    {
      id: 5,
      title: "QR Code Generator",
      desc: "JavaScript, QRCode.js",
    },
  ]);
});

// skills API (WITH TYPES ✅)
app.get("/skills", (req, res) => {
  res.json([
    { name: "HTML", type: "frontend" },
    { name: "CSS", type: "frontend" },
    { name: "JavaScript", type: "frontend" },
    { name: "React", type: "frontend" },
    { name: "Bootstrap", type: "frontend" },

    { name: "Java", type: "backend" },
    { name: "Python", type: "backend" },
    { name: "Flask", type: "backend" },
    { name: "Node.js", type: "backend" },

    { name: "MySQL", type: "database" },
    { name: "PostgreSQL", type: "database" },
    { name: "MongoDB", type: "database" },

    { name: "GitHub", type: "tools" },
    { name: "VS Code", type: "tools" },
  ]);
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});