import React, { useState, useEffect } from "react";
import { apiRequest } from "../../api/client";

export function ResumeManager() {
  const [currentResume, setCurrentResume] = useState(null);
  const [newPdfBase64, setNewPdfBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest("/settings/resume");
      if (data && data.value) {
        setCurrentResume(data.value);
      } else {
        setCurrentResume(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Please upload a valid PDF document (.pdf).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("PDF file size is too large. Please select a resume file under 10MB.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setNewPdfBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!newPdfBase64) return;
    setSaving(true);
    setError(null);
    setSuccessMessage("");
    try {
      await apiRequest("/settings/resume", {
        method: "POST",
        body: JSON.stringify({ value: newPdfBase64 }),
      });
      setCurrentResume(newPdfBase64);
      setNewPdfBase64("");
      setFileName("");
      setSuccessMessage("✅ Resume successfully uploaded and updated!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove your current resume?")) return;
    setDeleting(true);
    setError(null);
    setSuccessMessage("");
    try {
      await apiRequest("/settings/resume", {
        method: "POST",
        body: JSON.stringify({ value: null }),
      });
      setCurrentResume(null);
      setNewPdfBase64("");
      setFileName("");
      setSuccessMessage("🗑️ Resume removed.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to remove resume.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Resume PDF Manager</h2>
          <p style={subtitleStyle}>
            Upload and manage your official Resume PDF. Visitors can download it with 1-click from your portfolio header.
          </p>
        </div>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}
      {successMessage && <div style={successBoxStyle}>{successMessage}</div>}

      {loading ? (
        <div style={loadingStyle}>Loading current resume status...</div>
      ) : (
        <div style={cardStyle}>
          <div style={statusRowStyle}>
            <span style={statusLabelStyle}>Status:</span>
            {currentResume ? (
              <span style={activeBadgeStyle}>✓ Active Resume Uploaded</span>
            ) : (
              <span style={inactiveBadgeStyle}>No Resume Uploaded Yet</span>
            )}
          </div>

          {currentResume && (
            <div style={actionRowStyle}>
              <a
                href={currentResume}
                download="Mohammed_Danish_Resume.pdf"
                style={downloadBtnStyle}
                target="_blank"
                rel="noreferrer"
              >
                📥 Download / Preview Current Resume
              </a>
              <button onClick={handleDelete} style={deleteBtnStyle} disabled={deleting}>
                {deleting ? "Removing..." : "Remove Resume"}
              </button>
            </div>
          )}

          <div style={uploadBoxStyle}>
            <label style={uploadLabelStyle}>
              {fileName ? `Selected: ${fileName}` : "Choose PDF Resume File (.pdf)"}
              <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
            {fileName && (
              <button onClick={handleSave} style={saveBtnStyle} disabled={saving}>
                {saving ? "Uploading PDF..." : "Save Resume PDF"}
              </button>
            )}
          </div>
        </div>
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

const cardStyle = {
  background: "rgba(18, 18, 34, 0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const statusRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const statusLabelStyle = {
  color: "#aaa",
  fontSize: "14px",
  fontWeight: "600",
};

const activeBadgeStyle = {
  background: "rgba(30, 180, 100, 0.15)",
  border: "1px solid rgba(30, 180, 100, 0.3)",
  color: "#4ddb8f",
  fontSize: "12px",
  fontWeight: "700",
  padding: "4px 12px",
  borderRadius: "12px",
};

const inactiveBadgeStyle = {
  background: "rgba(255, 180, 0, 0.15)",
  border: "1px solid rgba(255, 180, 0, 0.3)",
  color: "#FFB400",
  fontSize: "12px",
  fontWeight: "600",
  padding: "4px 12px",
  borderRadius: "12px",
};

const actionRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
};

const downloadBtnStyle = {
  background: "rgba(255, 180, 0, 0.12)",
  border: "1px solid rgba(255, 180, 0, 0.3)",
  color: "#FFB400",
  padding: "10px 18px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const deleteBtnStyle = {
  background: "rgba(220, 50, 50, 0.12)",
  border: "1px solid rgba(220, 50, 50, 0.3)",
  color: "#ff8080",
  padding: "10px 18px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
};

const uploadBoxStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  paddingTop: "20px",
};

const uploadLabelStyle = {
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px dashed rgba(255, 255, 255, 0.2)",
  borderRadius: "8px",
  padding: "12px 20px",
  color: "#fff",
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: "500",
};

const saveBtnStyle = {
  background: "linear-gradient(90deg, #FFB400, #FF8000)",
  border: "none",
  color: "#0a0a14",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
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
