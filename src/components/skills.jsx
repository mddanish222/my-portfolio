import { useState } from "react";

function Skills() {
  const [filter, setFilter] = useState("all");

  const skills = [
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
  ];

  const filteredSkills =
    filter === "all"
      ? skills
      : skills.filter((skill) => skill.type === filter);

  return (
    <div style={container}>
      <h1 style={title}>Skills</h1>

      <div style={btnContainer}>
        {["all", "frontend", "backend", "database", "tools"].map((item) => (
          <button
            key={item}
            style={filter === item ? activeBtn : btn}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={grid}>
        {filteredSkills.map((skill, index) => (
          <div key={index} style={skillCard}>
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const container = {
  maxWidth: "1000px",
  margin: "auto",
  textAlign: "center",
};

const title = {
  marginBottom: "20px",
};

const btnContainer = {
  marginBottom: "30px",
};

const btn = {
  margin: "5px",
  padding: "8px 15px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  background: "white",
};

const activeBtn = {
  ...btn,
  background: "orange",
  color: "white",
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
};

const skillCard = {
  background: "#1e1e1e",
  padding: "10px 20px",
  borderRadius: "20px",
  fontSize: "14px",
};

export default Skills;