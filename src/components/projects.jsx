import { useState, useEffect } from "react";

function Projects() {
  const [showDetails, setShowDetails] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => {
        const updated = data.map((p) => ({
          ...p,
          status: "Completed",
        }));
        setProjects(updated);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading projects...</p>;
  if (error) return <p style={{ textAlign: "center" }}>{error}</p>;

  return (
    <div style={container}>
      <h1 style={title}>Projects</h1>

      <div style={grid}>
        {projects.map((project) => (
          <div key={project.id} style={card}>
            <h3>{project.title}</h3>

            <span style={{ ...status, background: "#4caf50" }}>
              {project.status}
            </span>

            <button
              style={button}
              onClick={() =>
                setShowDetails(
                  showDetails === project.id ? null : project.id
                )
              }
            >
              {showDetails === project.id ? "Hide" : "View"} Details
            </button>

            {showDetails === project.id && (
              <p style={desc}>{project.desc}</p>
            )}
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
  marginBottom: "30px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const card = {
  background: "#1e1e1e",
  padding: "20px",
  borderRadius: "12px",
};

const button = {
  marginTop: "10px",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const desc = {
  marginTop: "10px",
  fontSize: "14px",
};

const status = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "10px",
  fontSize: "12px",
  marginBottom: "10px",
  color: "white",
};

export default Projects;