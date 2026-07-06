//exce.jsx
import React from "react";
import useFetch from "../hooks/useFetch";

// ─── Skeleton keyframes ───────────────────────────────────────
const skeletonCSS = `
  @keyframes excePulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.65; }
  }
  .exce-skeleton {
    animation: excePulse 1.5s ease-in-out infinite;
  }
`;


export function Experience() {
  const { data: experience, loading, error } = useFetch("/experience");

  if (loading) {
    return (
      <div style={container}>
        <style>{skeletonCSS}</style>
        <h2 style={titleStyle}>Experience</h2>
        <p style={subtitleStyle}>Professional work history</p>
        {Array(2).fill(null).map((_, i) => (
          <div key={i} style={expSkeletonCard}>
            {/* header row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <div className="exce-skeleton" style={skeletonLine("180px", "16px", "0 0 10px 0")} />
                <div className="exce-skeleton" style={skeletonLine("140px", "12px")} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="exce-skeleton" style={skeletonLine("90px", "12px", "0 0 10px 0")} />
                <div className="exce-skeleton" style={skeletonLine("70px", "11px")} />
              </div>
            </div>
            {/* bullet lines */}
            <div className="exce-skeleton" style={skeletonLine("100%", "11px", "0 0 8px 0")} />
            <div className="exce-skeleton" style={skeletonLine("90%",  "11px", "0 0 8px 0")} />
            <div className="exce-skeleton" style={skeletonLine("75%",  "11px")} />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <SectionError label="Experience" message={error} />;

  return (
    <div style={container}>
      <h2 style={titleStyle}>Experience</h2>
      <p style={subtitleStyle}>Professional work history</p>

      {experience.map((exp) => (
        <div key={exp.id} style={expCard}>
          <div style={expHeader}>
            <div>
              <h3 style={roleStyle}>{exp.role}</h3>
              <p style={companyStyle}>{exp.company} — {exp.location}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={periodBadge}>{exp.period}</span>
              <p style={stipendStyle}>{exp.stipend}</p>
            </div>
          </div>
          <ul style={bulletList}>
            {exp.points.map((point, i) => (
              <li key={i} style={bulletItem}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


export function Certifications() {
  const { data: certs, loading, error } = useFetch("/certifications");

  if (loading) {
    return (
      <div style={container}>
        <style>{skeletonCSS}</style>
        <h2 style={titleStyle}>Certifications</h2>
        <p style={subtitleStyle}>Courses, workshops & achievements</p>
        <div style={certGrid}>
          {Array(6).fill(null).map((_, i) => (
            <div key={i} style={certSkeletonCard}>
              <div className="exce-skeleton" style={skeletonBlock("32px", "32px", "0")} />
              <div style={{ flex: 1 }}>
                <div className="exce-skeleton" style={skeletonLine("80%",  "13px", "0 0 8px 0")} />
                <div className="exce-skeleton" style={skeletonLine("60%",  "11px", "0 0 8px 0")} />
                <div className="exce-skeleton" style={skeletonLine("40%",  "10px")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <SectionError label="Certifications" message={error} />;

  return (
    <div style={container}>
      <h2 style={titleStyle}>Certifications</h2>
      <p style={subtitleStyle}>Courses, workshops & achievements</p>

      <div style={certGrid}>
        {certs.map((cert) => (
          <div key={cert.id} style={certCard}>
            <div style={certIcon}>✦</div>
            <div>
              <p style={certTitle}>{cert.title}</p>
              <p style={certIssuer}>{cert.issuer}</p>
              {cert.note && <span style={noteBadge}>{cert.note}</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={achieveSection}>
        <h3 style={achieveTitle}>Achievements</h3>
        <div style={certGrid}>
          <div style={{ ...certCard, borderColor: "rgba(255,180,0,0.25)" }}>
            <div style={{ ...certIcon, color: "#FFB400" }}>★</div>
            <div>
              <p style={certTitle}>2nd Place — Buildathon 2024</p>
              <p style={certIssuer}>College Web Development Challenge</p>
            </div>
          </div>
          <div style={{ ...certCard, borderColor: "rgba(255,180,0,0.25)" }}>
            <div style={{ ...certIcon, color: "#FFB400" }}>★</div>
            <div>
              <p style={certTitle}>Merit Scholarship</p>
              <p style={certIssuer}>Academic excellence — 91.16% in PUC Board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ERROR COMPONENT
// ═══════════════════════════════════════════════════════════════
function SectionError({ label, message }) {
  return (
    <div style={container}>
      <h2 style={titleStyle}>{label}</h2>
      <div style={errorBox}>
        <p style={{ margin: 0, fontWeight: "600" }}>Failed to load {label.toLowerCase()}</p>
        <p style={{ margin: "6px 0 0", fontSize: "13px", opacity: 0.8 }}>{message}</p>
      </div>
    </div>
  );
}

// ─── Skeleton helpers ─────────────────────────────────────────
const skeletonLine = (width, height, margin = "0") => ({
  width,
  height,
  borderRadius: "6px",
  background: "rgba(255,255,255,0.08)",
  margin,
});

const skeletonBlock = (width, height, margin = "0") => ({
  width,
  height,
  borderRadius: "8px",
  background: "rgba(255,255,255,0.08)",
  margin,
  flexShrink: 0,
});


const container = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "0 20px",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#fff",
  marginBottom: "8px",
  textAlign: "center",
};

const subtitleStyle = {
  color: "#888",
  fontSize: "15px",
  marginBottom: "40px",
  textAlign: "center",
};

// Experience styles
const expCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderLeft: "3px solid #FFB400",
  borderRadius: "0 12px 12px 0",
  padding: "24px",
  marginBottom: "20px",
  textAlign: "left",
};

const expSkeletonCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderLeft: "3px solid rgba(255,180,0,0.3)",
  borderRadius: "0 12px 12px 0",
  padding: "24px",
  marginBottom: "20px",
  textAlign: "left",
};

const expHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "16px",
};

const roleStyle = {
  color: "#fff",
  fontSize: "17px",
  fontWeight: "700",
  margin: "0 0 4px",
};

const companyStyle = {
  color: "#FFB400",
  fontSize: "14px",
  margin: 0,
};

const periodBadge = {
  display: "inline-block",
  fontSize: "12px",
  padding: "4px 10px",
  borderRadius: "10px",
  background: "rgba(255,180,0,0.1)",
  color: "#FFB400",
};

const stipendStyle = {
  color: "#666",
  fontSize: "12px",
  margin: "6px 0 0",
  textAlign: "right",
};

const bulletList = {
  margin: 0,
  paddingLeft: "18px",
};

const bulletItem = {
  color: "#aaa",
  fontSize: "14px",
  lineHeight: "1.7",
  marginBottom: "6px",
};


const certGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "14px",
};

const certCard = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "16px",
  textAlign: "left",
};

const certSkeletonCard = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "16px",
  textAlign: "left",
};

const certIcon = {
  fontSize: "18px",
  color: "#555",
  flexShrink: 0,
  marginTop: "2px",
};

const certTitle = {
  color: "#ddd",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 3px",
  lineHeight: "1.4",
};

const certIssuer = {
  color: "#666",
  fontSize: "12px",
  margin: "0 0 6px",
};

const noteBadge = {
  display: "inline-block",
  fontSize: "11px",
  padding: "2px 8px",
  borderRadius: "8px",
  background: "rgba(255,180,0,0.1)",
  color: "#FFB400",
};

const achieveSection = {
  marginTop: "48px",
};

const achieveTitle = {
  color: "#fff",
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "20px",
  textAlign: "center",
};

const errorBox = {
  background: "rgba(220,50,50,0.1)",
  border: "1px solid rgba(220,50,50,0.3)",
  color: "#ff8080",
  padding: "24px",
  borderRadius: "12px",
  textAlign: "center",
};