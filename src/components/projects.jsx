import { useState } from "react";

function Projects() {
  const [showDetails, setShowDetails] = useState(null);

  const projectList = [
    {
      id: 1,
      title: "Money Manager App",
      desc: "Kotlin, Jetpack Compose, Room DB, MVVM, Coroutines",
      status: "Completed",
    },
    {
      id: 2,
      title: "KR Timber System",
      desc: "Node.js, Express, MongoDB, Full-stack inventory system",
      status: "Completed",
    },
    {
      id: 3,
      title: "Arsh Infrastructure",
      desc: "Flask, PostgreSQL, Admin dashboard, Authentication",
      status: "Completed",
    },
    {
      id: 4,
      title: "Prajayoga E-Paper",
      desc: "Flask, MariaDB, Admin panel, Content management",
      status: "Ongoing",
    },
    {
      id: 5,
      title: "QR Code Generator",
      desc: "JavaScript, QRCode.js, Geolocation API",
      status: "Completed",
    },
  ];

  return (
    <div style={container}>
      <h1 style={title}>Projects</h1>

      <div style={grid}>
        {projectList.map((project) => (
          <div key={project.id} style={card}>
            <h3>{project.title}</h3>

            <span
              style={{
                ...status,
                background:
                  project.status === "Ongoing" ? "#ff9800" : "#4caf50",
              }}
            >
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

/* ---------- STYLES ---------- */

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