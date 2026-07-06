//projects.jsx

import React from "react";
import { useState } from "react";
import useFetch from "../hooks/useFetch";

function Projects() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter]     = useState("All");

  const { data: projects, loading, error } = useFetch("/projects");

  const filterOptions = ["All", "Personal", "Freelance", "Paid Freelance"];

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.type === filter);

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const statusColor = (status) => {
    if (status === "Completed")           return { bg: "rgba(30,180,100,0.15)",  color: "#4ddb8f" };
    if (status === "Ongoing")             return { bg: "rgba(255,180,0,0.12)",   color: "#FFB400"  };
    if (status === "Awaiting Deployment") return { bg: "rgba(100,100,255,0.12)", color: "#8888ff"  };
    return { bg: "rgba(255,255,255,0.08)", color: "#aaa" };
  };

  if (loading) {
    return (
      <div style={container}>
        <style>{skeletonCSS}</style>
        <h2 style={titleStyle}>Projects</h2>
        <p style={subtitleStyle}>Real-world applications I've built</p>
        <div style={grid}>
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="skeleton-project" style={skeletonCard}>
              {/* shimmer lines inside card */}
              <div className="skeleton-project" style={skeletonLine("60%", "16px", "0 0 16px 0")} />
              <div className="skeleton-project" style={skeletonLine("40%", "12px", "0 0 20px 0")} />
              <div style={{ display: "flex", gap: "8px" }}>
                <div className="skeleton-project" style={skeletonLine("25%", "10px")} />
                <div className="skeleton-project" style={skeletonLine("25%", "10px")} />
                <div className="skeleton-project" style={skeletonLine("25%", "10px")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={container}>
        <h2 style={titleStyle}>Projects</h2>
        <div style={errorBox}>
          <p style={{ margin: 0, fontWeight: "600" }}>Failed to load projects</p>
          <p style={{ margin: "6px 0 0", fontSize: "13px", opacity: 0.8 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={titleStyle}>Projects</h2>
      <p style={subtitleStyle}>Real-world applications I've built</p>

      <div style={filterBar}>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            style={filter === opt ? { ...filterBtn, ...activeFilter } : filterBtn}
            onMouseEnter={(e) => {
              if (filter !== opt) e.currentTarget.style.borderColor = "rgba(255,180,0,0.4)";
            }}
            onMouseLeave={(e) => {
              if (filter !== opt) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
            onClick={() => setFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={grid}>
        {filtered.map((project) => {
          const sc = statusColor(project.status);
          const isOpen = expanded === project.id;

          return (
            <div key={project.id} style={{ ...card, ...(isOpen ? cardOpen : {}) }}>

              <div style={cardHeader}>
                <h3 style={cardTitle}>{project.title}</h3>
                <span style={typeBadge}>{project.type}</span>
              </div>

              <span style={{ ...statusBadge, background: sc.bg, color: sc.color }}>
                {project.status}
              </span>

              <div style={techRow}>
                {project.tech.slice(0, isOpen ? project.tech.length : 3).map((t, i) => (
                  <span key={i} style={techChip}>{t}</span>
                ))}
                {!isOpen && project.tech.length > 3 && (
                  <span style={{ ...techChip, opacity: 0.5 }}>
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>

              {isOpen && (
                <p style={descStyle}>{project.desc}</p>
              )}

              {isOpen && (
                <div style={linkRow}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" style={linkBtn}>
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" style={{ ...linkBtn, ...liveLinkBtn }}>
                      Live Demo
                    </a>
                  )}
                  {!project.github && !project.live && (
                    <span style={{ fontSize: "12px", color: "#666" }}>Private / Pending deployment</span>
                  )}
                </div>
              )}

              <button style={toggleBtn} onClick={() => handleToggle(project.id)}>
                {isOpen ? "Show Less ↑" : "View Details ↓"}
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
          No projects found for "{filter}"
        </p>
      )}
    </div>
  );
}


const skeletonCSS = `
  @keyframes projectPulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.65; }
  }
  .skeleton-project {
    animation: projectPulse 1.5s ease-in-out infinite;
  }
`;

// helper for skeleton lines inside cards
const skeletonLine = (width, height, margin = "0") => ({
  width,
  height,
  borderRadius: "6px",
  background: "rgba(255,255,255,0.08)",
  margin,
  flexShrink: 0,
});


const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0 20px",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#fff",
  marginBottom: "8px",
};

const subtitleStyle = {
  color: "#888",
  fontSize: "15px",
  marginBottom: "32px",
};

const filterBar = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "8px",
  marginBottom: "36px",
};

const filterBtn = {
  padding: "8px 18px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "transparent",
  color: "#aaa",
  cursor: "pointer",
  fontSize: "13px",
  transition: "all 0.2s",
  outline: "none",
};

const activeFilter = {
  background: "#FFB400",
  color: "#0a0a14",
  borderColor: "#FFB400",
  fontWeight: "600",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  textAlign: "left",
};

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "22px",
  transition: "border-color 0.2s",
};

const cardOpen = {
  borderColor: "rgba(255,180,0,0.3)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "10px",
  gap: "10px",
};

const cardTitle = {
  color: "#fff",
  fontSize: "16px",
  fontWeight: "700",
  margin: 0,
  lineHeight: "1.3",
};

const typeBadge = {
  fontSize: "11px",
  padding: "3px 8px",
  borderRadius: "10px",
  background: "rgba(255,180,0,0.12)",
  color: "#FFB400",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const statusBadge = {
  display: "inline-block",
  fontSize: "11px",
  padding: "3px 10px",
  borderRadius: "10px",
  marginBottom: "14px",
  fontWeight: "500",
};

const techRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginBottom: "14px",
};

const techChip = {
  fontSize: "11px",
  padding: "3px 9px",
  borderRadius: "6px",
  background: "rgba(255,255,255,0.07)",
  color: "#ccc",
  border: "1px solid rgba(255,255,255,0.08)",
};

const descStyle = {
  fontSize: "13px",
  color: "#aaa",
  lineHeight: "1.6",
  marginBottom: "14px",
};

const linkRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "14px",
  flexWrap: "wrap",
  alignItems: "center",
};

const linkBtn = {
  fontSize: "12px",
  padding: "6px 14px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#ccc",
  textDecoration: "none",
  background: "rgba(255,255,255,0.05)",
};

const liveLinkBtn = {
  background: "rgba(255,180,0,0.12)",
  borderColor: "rgba(255,180,0,0.3)",
  color: "#FFB400",
};

const toggleBtn = {
  background: "none",
  border: "none",
  color: "#FFB400",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  padding: 0,
  letterSpacing: "0.3px",
  outline: "none",
};

const skeletonCard = {
  borderRadius: "14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "22px",
  height: "160px",
};

const errorBox = {
  background: "rgba(220,50,50,0.12)",
  border: "1px solid rgba(220,50,50,0.3)",
  color: "#ff8080",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
};

export default Projects;