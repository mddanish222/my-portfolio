//projects.jsx
// ─── CONCEPTS DEMONSTRATED ────────────────────────────────────
// 1. React component + useState + useEffect
// 4. API integration — fetch from /projects
// 5. Event handling — expand/collapse, filter by type
// 6. Loading state — skeleton cards
// 7. Error handling — response.ok check + fallback UI

import { useState } from "react";
import useFetch from "../hooks/useFetch";

function Projects() {
  // CONCEPT 1: useState — multiple state variables
  const [expanded, setExpanded] = useState(null);  // which card is open
  const [filter, setFilter]     = useState("All"); // project type filter

  // useFetch replaces useState(projects/loading/error) + useEffect fetch block
  const { data: projects, loading, error } = useFetch("http://localhost:5000/projects");

  const filterOptions = ["All", "Personal", "Freelance", "Paid Freelance"];

  // CONCEPT 4: Dynamic rendering — filter projects array
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.type === filter);

  // CONCEPT 5: Event handling — toggle expanded card
  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // status badge color logic
  const statusColor = (status) => {
    if (status === "Completed")          return { bg: "rgba(30,180,100,0.15)", color: "#4ddb8f" };
    if (status === "Ongoing")            return { bg: "rgba(255,180,0,0.12)",  color: "#FFB400"  };
    if (status === "Awaiting Deployment")return { bg: "rgba(100,100,255,0.12)",color: "#8888ff"  };
    return { bg: "rgba(255,255,255,0.08)", color: "#aaa" };
  };

  // CONCEPT 6: Loading state — skeleton UI so screen isn't blank
  if (loading) {
    return (
      <div style={container}>
        <h2 style={titleStyle}>Projects</h2>
        <div style={grid}>
          {Array(5).fill(null).map((_, i) => (
            <div key={i} style={skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  // CONCEPT 5: Error handling — friendly error UI
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

      {/* CONCEPT 5: Event handling — filter by project type */}
      {/* CONCEPT 4: Dynamic rendering — .map() over filterOptions */}
      <div style={filterBar}>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            style={filter === opt ? { ...filterBtn, ...activeFilter } : filterBtn}
            onClick={() => setFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* CONCEPT 4: Dynamic rendering — .map() over filtered projects */}
      <div style={grid}>
        {filtered.map((project) => {
          const sc = statusColor(project.status);
          const isOpen = expanded === project.id;

          return (
            <div key={project.id} style={{ ...card, ...(isOpen ? cardOpen : {}) }}>

              {/* Header row: title + type badge */}
              <div style={cardHeader}>
                <h3 style={cardTitle}>{project.title}</h3>
                <span style={{ ...typeBadge }}>
                  {project.type}
                </span>
              </div>

              {/* Status badge */}
              <span style={{ ...statusBadge, background: sc.bg, color: sc.color }}>
                {project.status}
              </span>

              {/* Tech stack chips — CONCEPT 4: nested .map() */}
              <div style={techRow}>
                {project.tech.slice(0, isOpen ? project.tech.length : 3).map((t, i) => (
                  <span key={i} style={techChip}>{t}</span>
                ))}
                {/* CONCEPT 4: Conditional UI — show "+N more" when collapsed */}
                {!isOpen && project.tech.length > 3 && (
                  <span style={{ ...techChip, opacity: 0.5 }}>
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>

              {/* CONCEPT 4: Conditional UI — show details only when expanded */}
              {isOpen && (
                <p style={descStyle}>{project.desc}</p>
              )}

              {/* Links — CONCEPT 4: conditional rendering based on data */}
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

              {/* CONCEPT 5: Event handling — toggle expand/collapse */}
              <button style={toggleBtn} onClick={() => handleToggle(project.id)}>
                {isOpen ? "Show Less ↑" : "View Details ↓"}
              </button>
            </div>
          );
        })}
      </div>

      {/* CONCEPT 4: Conditional UI — empty state */}
      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
          No projects found for "{filter}"
        </p>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
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
};

const skeletonCard = {
  height: "180px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.05)",
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