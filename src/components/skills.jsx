import { useState, useEffect } from "react";

function Skills() {
  const [filter, setFilter] = useState("all");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load skills");
        setLoading(false);
      });
  }, []);

  const filteredSkills =
    filter === "all"
      ? skills
      : skills.filter((skill) => skill.type === filter);

  if (loading) return <p>Loading skills...</p>;
  if (error) return <p>{error}</p>;

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

/* styles same */
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