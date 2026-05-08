//skills.jsx

import React from "react";
import { useState } from "react";
import useFetch from "../hooks/useFetch";

function Skills() {
  const [filter, setFilter] = useState("all");

  const { data: skills, loading, error } = useFetch("https://my-portfolio-8qxi.onrender.com/skills");

  const categories = ["all", "frontend", "backend", "mobile", "database", "tools"];

  const filteredSkills =
    filter === "all"
      ? skills
      : skills.filter((skill) => skill.type === filter);

  if (loading) {
    return (
      <div style={container}>
        <style>{skeletonCSS}</style>
        <h2 style={titleStyle}>Skills</h2>
        <p style={subtitleStyle}>Technologies I work with</p>
        <div style={skeletonGrid}>
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="skeleton-card" style={skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={container}>
        <h2 style={titleStyle}>Skills</h2>
        <div style={errorBox}>
          <p style={{ margin: 0, fontWeight: "600" }}>Could not load skills</p>
          <p style={{ margin: "6px 0 0", fontSize: "13px", opacity: 0.8 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={titleStyle}>Skills</h2>
      <p style={subtitleStyle}>Technologies I work with</p>

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
          <div key={index} style={card}>
            <div style={skillName}>{skill.name}</div>
            {skill.level && (
              <div style={barTrack}>
                <div style={{ ...barFill, width: `${skill.level}%` }} />
              </div>
            )}
            {skill.level && (
              <span style={levelText}>{skill.level}%</span>
            )}
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
  maxWidth: "1000px",
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
  fontWeight: "500",
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
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "14px",
};

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "18px 16px 14px",
  borderRadius: "12px",
  textAlign: "left",
};

const skillName = {
  color: "#e0e0e0",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "10px",
};

const barTrack = {
  height: "4px",
  background: "rgba(255,255,255,0.08)",
  borderRadius: "2px",
  overflow: "hidden",
  marginBottom: "6px",
};

const barFill = {
  height: "100%",
  background: "linear-gradient(90deg, #FFB400, #FF6B00)",
  borderRadius: "2px",
  transition: "width 0.6s ease",
};

const levelText = {
  fontSize: "11px",
  color: "#666",
};

const skeletonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "14px",
};

const skeletonCard = {
  height: "80px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.06)",
};

const errorBox = {
  background: "rgba(220,50,50,0.12)",
  border: "1px solid rgba(220,50,50,0.3)",
  color: "#ff8080",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
};

export default Skills;