import React, { useState } from "react";
import useFetch from "../hooks/useFetch";

function Projects() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");

  const { data: projects, loading, error } = useFetch("/projects");

  const filterOptions = ["All", "Personal", "Freelance", "Paid Freelance"];

  const filtered = Array.isArray(projects)
    ? filter === "All"
      ? projects
      : projects.filter((p) => p.type === filter)
    : [];

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const statusColor = (status) => {
    if (status === "Completed")
      return { bg: "rgba(30,180,100,0.15)", border: "rgba(30,180,100,0.3)", color: "#4ddb8f" };
    if (status === "Ongoing")
      return { bg: "rgba(255,180,0,0.15)", border: "rgba(255,180,0,0.3)", color: "#FFB400" };
    if (status === "Awaiting Deployment")
      return { bg: "rgba(120,120,255,0.15)", border: "rgba(120,120,255,0.3)", color: "#9999ff" };
    return { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.15)", color: "#aaa" };
  };

  if (loading) {
    return (
      <div style={container}>
        <style>{skeletonCSS}</style>
        <h2 style={titleStyle}>Featured Projects</h2>
        <p style={subtitleStyle}>Real-world software and applications I've engineered</p>
        <div style={grid}>
          {Array(4).fill(null).map((_, i) => (
            <div
              key={i}
              style={{
                background: "rgba(18, 18, 34, 0.65)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderLeft: "3px solid rgba(255,180,0,0.4)",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <div className="skeleton-box" style={{ width: "60%", height: "16px" }} />
                <div className="skeleton-box" style={{ width: "25%", height: "12px" }} />
              </div>
              <div className="skeleton-box" style={{ width: "95%", height: "12px", marginBottom: "8px" }} />
              <div className="skeleton-box" style={{ width: "80%", height: "12px", marginBottom: "16px" }} />
              <div style={{ display: "flex", gap: "8px" }}>
                <div className="skeleton-box" style={{ width: "55px", height: "12px" }} />
                <div className="skeleton-box" style={{ width: "65px", height: "12px" }} />
                <div className="skeleton-box" style={{ width: "50px", height: "12px" }} />
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
        <h2 style={titleStyle}>Featured Projects</h2>
        <div style={errorBox}>
          <p style={{ margin: 0, fontWeight: "600" }}>Failed to load projects</p>
          <p style={{ margin: "6px 0 0", fontSize: "13px", opacity: 0.8 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={titleStyle}>Featured Projects</h2>
      <p style={subtitleStyle}>Real-world software and applications I've engineered</p>

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
        {filtered?.map((project) => {
          const sc = statusColor(project.status);
          const isOpen = expanded === project.id;

          return (
            <div
              key={project.id}
              style={{ ...card, ...(isOpen ? cardOpen : {}) }}
              onMouseEnter={(e) => {
                if (!isOpen) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(255,180,0,0.35)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,180,0,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isOpen) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <div style={cardHeader}>
                <h3 style={cardTitle}>{project.title}</h3>
                <span style={typeBadge}>{project.type}</span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <span
                  style={{
                    ...statusBadge,
                    background: sc.bg,
                    color: sc.color,
                    border: `1px solid ${sc.border}`,
                  }}
                >
                  {project.status}
                </span>
              </div>

              <p className="project-desc" style={{ ...descStyle, lineClamp: isOpen ? "none" : "3", WebkitLineClamp: isOpen ? "none" : "3" }}>
                {project.desc}
              </p>

              <div style={techRow}>
                {project.tech.map((t, i) => (
                  <span key={i} style={techChip}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={actionFooter}>
                <div style={linkRow}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" style={linkBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Code
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" style={{ ...linkBtn, ...liveLinkBtn }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>

                <button style={toggleBtn} onClick={() => handleToggle(project.id)}>
                  {isOpen ? "Less ↑" : "Details ↓"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered?.length === 0 && (
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
  marginBottom: "36px",
};

const filterBar = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "40px",
};

const filterBtn = {
  padding: "9px 20px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.02)",
  color: "#aaa",
  cursor: "pointer",
  fontSize: "13px",
  transition: "all 0.25s ease",
  outline: "none",
};

const activeFilter = {
  background: "linear-gradient(135deg, #FFB400 0%, #FF8000 100%)",
  color: "#0a0a14",
  borderColor: "#FFB400",
  fontWeight: "700",
  boxShadow: "0 4px 14px rgba(255, 180, 0, 0.3)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px",
  textAlign: "left",
};

const card = {
  background: "rgba(18, 18, 34, 0.65)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const cardOpen = {
  borderColor: "rgba(255,180,0,0.4)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.5), 0 0 25px rgba(255,180,0,0.15)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
  gap: "12px",
};

const cardTitle = {
  color: "#fff",
  fontSize: "18px",
  fontWeight: "700",
  margin: 0,
  lineHeight: "1.3",
};

const typeBadge = {
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "12px",
  background: "rgba(255,180,0,0.12)",
  border: "1px solid rgba(255,180,0,0.25)",
  color: "#FFB400",
  fontWeight: "600",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const statusBadge = {
  display: "inline-block",
  fontSize: "11px",
  padding: "3px 10px",
  borderRadius: "10px",
  fontWeight: "600",
};

const techRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginTop: "auto",
  marginBottom: "20px",
};

const techChip = {
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "6px",
  background: "rgba(255,255,255,0.05)",
  color: "#d0d0e0",
  border: "1px solid rgba(255,255,255,0.08)",
  fontWeight: "500",
};

const descStyle = {
  fontSize: "14px",
  color: "#aaa",
  lineHeight: "1.65",
  marginBottom: "18px",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const actionFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  paddingTop: "16px",
};

const linkRow = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const linkBtn = {
  fontSize: "12px",
  padding: "6px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  textDecoration: "none",
  background: "rgba(255,255,255,0.05)",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: "600",
  transition: "all 0.2s",
};

const liveLinkBtn = {
  background: "linear-gradient(90deg, rgba(255,180,0,0.2) 0%, rgba(255,128,0,0.2) 100%)",
  borderColor: "rgba(255,180,0,0.4)",
  color: "#FFB400",
};

const toggleBtn = {
  background: "none",
  border: "none",
  color: "#FFB400",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "700",
  padding: 0,
  letterSpacing: "0.3px",
  outline: "none",
};

const skeletonCard = {
  borderRadius: "16px",
  background: "rgba(18, 18, 34, 0.5)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "24px",
  height: "180px",
};

const errorBox = {
  background: "rgba(220,50,50,0.12)",
  border: "1px solid rgba(220,50,50,0.3)",
  color: "#ff8080",
  padding: "24px",
  borderRadius: "12px",
  textAlign: "center",
};

export default Projects;