import React, { useState, useEffect } from "react";
import { apiRequest } from "../../api/client";

const defaultAboutData = {
  paragraph1:
    "Full-stack developer who ships production systems end-to-end, from database schema to deployed cloud application, across React, Node.js, Spring Boot, Flask, and PostgreSQL/MongoDB. Built and deployed 6+ live applications including multi-layer authentication and CI/CD-tested admin platforms.",
  paragraph2:
    "Passionate BCA student at Seshadripuram College (CGPA: 8.52) specialising in web and app development. Focus on clean architecture, performance, and user-friendly interfaces. Currently a Full Stack Developer at Ontum Education Pvt Ltd, Bengaluru.",
  statProjects: "6+",
  statCGPA: "8.52",
  statPUC: "91.16%",
  statSince: "2024",
};

export function AboutMeManager() {
  const [formData, setFormData] = useState(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAboutMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest("/settings/about_me");
      if (res && res.value) {
        const parsed = JSON.parse(res.value);
        setFormData({ ...defaultAboutData, ...parsed });
      }
    } catch (err) {
      console.warn("Could not load stored about_me, using defaults");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage("");
    try {
      await apiRequest("/settings/about_me", {
        method: "POST",
        body: JSON.stringify({ value: JSON.stringify(formData) }),
      });
      setSuccessMessage("✅ About Me content successfully updated!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to update About Me.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>About Me Manager</h2>
        <p style={subtitleStyle}>
          Edit your bio paragraphs and key statistics dynamically. Changes update immediately on your live portfolio.
        </p>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}
      {successMessage && <div style={successBoxStyle}>{successMessage}</div>}

      {loading ? (
        <div style={loadingStyle}>Loading About Me settings...</div>
      ) : (
        <form onSubmit={handleSave} style={formCardStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bio Paragraph 1 (Overview & Tech Stack)</label>
            <textarea
              name="paragraph1"
              value={formData.paragraph1}
              onChange={handleChange}
              rows={4}
              style={textareaStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Bio Paragraph 2 (Education & Experience Summary)</label>
            <textarea
              name="paragraph2"
              value={formData.paragraph2}
              onChange={handleChange}
              rows={4}
              style={textareaStyle}
              required
            />
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Stat 1: Live Projects</label>
              <input
                type="text"
                name="statProjects"
                value={formData.statProjects}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g. 6+"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Stat 2: CGPA Score</label>
              <input
                type="text"
                name="statCGPA"
                value={formData.statCGPA}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g. 8.52"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Stat 3: PUC Score</label>
              <input
                type="text"
                name="statPUC"
                value={formData.statPUC}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g. 91.16%"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Stat 4: Coding Since</label>
              <input
                type="text"
                name="statSince"
                value={formData.statSince}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g. 2024"
                required
              />
            </div>
          </div>

          <button type="submit" style={saveBtnStyle} disabled={saving}>
            {saving ? "Saving Changes..." : "Save About Me Content"}
          </button>
        </form>
      )}
    </div>
  );
}

const containerStyle = {
  maxWidth: "750px",
  margin: "0 auto",
};

const headerStyle = {
  marginBottom: "24px",
};

const titleStyle = {
  color: "#fff",
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "6px",
};

const subtitleStyle = {
  color: "#888",
  fontSize: "14px",
};

const loadingStyle = {
  color: "#aaa",
  padding: "40px",
  textAlign: "center",
};

const formCardStyle = {
  background: "rgba(18, 18, 34, 0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  color: "#aaa",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const textareaStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "12px",
  color: "#fff",
  fontSize: "14px",
  lineHeight: "1.6",
  outline: "none",
  fontFamily: "inherit",
  resize: "vertical",
};

const inputStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "12px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "16px",
};

const saveBtnStyle = {
  background: "linear-gradient(90deg, #FFB400, #FF8000)",
  border: "none",
  color: "#0a0a14",
  padding: "14px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px",
};

const errorBoxStyle = {
  background: "rgba(220, 50, 50, 0.12)",
  border: "1px solid rgba(220, 50, 50, 0.3)",
  color: "#ff8080",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "16px",
  fontSize: "13px",
};

const successBoxStyle = {
  background: "rgba(30, 180, 100, 0.15)",
  border: "1px solid rgba(30, 180, 100, 0.3)",
  color: "#4ddb8f",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "16px",
  fontSize: "13px",
};
