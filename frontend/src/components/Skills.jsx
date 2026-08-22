import React, { useState } from "react";
import useFetch from "../hooks/useFetch";

function Skills() {
  const [filter, setFilter] = useState("all");
  const { data: skills, loading, error } = useFetch("/skills");

  const categories = ["all", "frontend", "backend", "mobile", "database", "tools"];

  const filteredSkills = Array.isArray(skills)
    ? filter === "all"
      ? skills
      : skills.filter((skill) => skill.type === filter)
    : [];

  if (loading) {
    return (
      <div style={container}>
        <style>{skeletonCSS}</style>
        <h2 style={titleStyle}>Skills & Expertise</h2>
        <p style={subtitleStyle}>Technologies and tools I work with</p>
        <div style={skeletonGrid}>
          {Array(8).fill(null).map((_, i) => (
            <div
              key={i}
              style={{
                background: "rgba(18, 18, 34, 0.65)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderLeft: "3px solid rgba(255,180,0,0.4)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                gap: "12px",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <div
                className="skeleton-box"
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "rgba(255,180,0,0.4)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div className="skeleton-box" style={{ width: "70%", height: "14px", marginBottom: "6px" }} />
                <div className="skeleton-box" style={{ width: "40%", height: "10px" }} />
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
        <h2 style={titleStyle}>Skills & Expertise</h2>
        <div style={errorBox}>
          <p style={{ margin: 0, fontWeight: "600" }}>Could not load skills</p>
          <p style={{ margin: "6px 0 0", fontSize: "13px", opacity: 0.8 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={titleStyle}>Skills & Expertise</h2>
      <p style={subtitleStyle}>Technologies and tools I work with</p>

      <div style={filterBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={filter === cat ? { ...filterBtn, ...activeFilter } : filterBtn}
            onMouseEnter={(e) => {
              if (filter !== cat) e.currentTarget.style.borderColor = "rgba(255,180,0,0.4)";
            }}
            onMouseLeave={(e) => {
              if (filter !== cat) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div style={grid}>
        {filteredSkills.map((skill, index) => (
          <div
            key={skill.id || index}
            style={card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(255,180,0,0.4)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4), 0 0 15px rgba(255,180,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={skillName}>{skill.name}</div>
            <div style={typeTag}>{skill.type}</div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
          No skills found for "{filter}"
        </p>
      )}
    </div>
  );
}

const skeletonCSS = `
  @keyframes skillPulse {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.7;  }
  }
  .skeleton-card {
    animation: skillPulse 1.5s ease-in-out infinite;
  }
`;

const container = {
  maxWidth: "1050px",
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
  fontWeight: "500",
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
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "14px",
  textAlign: "left",
};

const card = {
  background: "rgba(18, 18, 34, 0.65)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "16px 18px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "6px",
};

const skillName = {
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  letterSpacing: "0.2px",
};

const typeTag = {
  fontSize: "11px",
  color: "#777",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const skeletonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "14px",
};

const skeletonCard = {
  height: "70px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
};

const errorBox = {
  background: "rgba(220,50,50,0.12)",
  border: "1px solid rgba(220,50,50,0.3)",
  color: "#ff8080",
  padding: "24px",
  borderRadius: "12px",
  textAlign: "center",
};

export default Skills;