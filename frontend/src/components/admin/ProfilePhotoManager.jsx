import React, { useState, useEffect } from "react";
import { apiRequest } from "../../api/client";

export function ProfilePhotoManager() {
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newImageBase64, setNewImageBase64] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);

  const fetchProfilePhoto = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest("/settings/profile_photo");
      if (data && data.value) {
        setCurrentPhoto(data.value);
        setPreviewUrl(data.value);
      } else {
        setCurrentPhoto(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load profile photo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilePhoto();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (png, jpeg, jpg, webp).");
      return;
    }

    // Restrict size to 2MB to keep DB storage optimized
    if (file.size > 2 * 1024 * 1024) {
      alert("File size is too large. Please select an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setNewImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!newImageBase64) return;
    setSaving(true);
    try {
      await apiRequest("/settings/profile_photo", {
        method: "POST",
        body: JSON.stringify({ value: newImageBase64 }),
      });
      setCurrentPhoto(newImageBase64);
      setNewImageBase64("");
      alert("Profile photo saved successfully!");
    } catch (err) {
      alert(`Error saving photo: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile photo?")) return;
    setDeleting(true);
    try {
      await apiRequest("/settings/profile_photo", {
        method: "POST",
        body: JSON.stringify({ value: null }),
      });
      setCurrentPhoto(null);
      setPreviewUrl(null);
      setNewImageBase64("");
      alert("Profile photo deleted successfully.");
    } catch (err) {
      alert(`Error deleting photo: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(currentPhoto);
    setNewImageBase64("");
    // Reset file input if needed
    const fileInput = document.getElementById("profile-file-input");
    if (fileInput) fileInput.value = "";
  };

  if (loading) {
    return (
      <div style={statusWrapper}>
        <div style={spinner} />
        <p style={statusText}>Loading Profile Photo...</p>
      </div>
    );
  }

  return (
    <div style={sectionContainer}>
      <h2 style={sectionTitle}>Profile Photo Manager</h2>
      <p style={subtitleText}>Upload a high-quality passport size picture to display on your home page hero section.</p>

      {error && (
        <div style={errorContainer}>
          <p style={{ margin: 0 }}>{error}</p>
          <button style={retryBtn} onClick={fetchProfilePhoto}>Retry</button>
        </div>
      )}

      <div style={uploadLayout}>
        {/* Left Side: Preview */}
        <div style={previewBox}>
          <h3 style={boxTitle}>Live Preview</h3>
          <div
            style={photoContainer}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
             <div
              style={{
                ...photoFrame,
                transform: hovered ? "translateY(-4px) scale(1.03)" : "translateY(0) scale(1)",
                borderColor: hovered ? "#0066ff" : "#0044ff",
                boxShadow: hovered 
                  ? "0 0 25px rgba(0, 85, 255, 0.7), 0 0 50px rgba(0, 68, 255, 0.4), inset 0 0 15px rgba(0, 85, 255, 0.5)" 
                  : "0 0 15px rgba(0, 68, 255, 0.4), 0 0 30px rgba(0, 68, 255, 0.25), inset 0 0 10px rgba(0, 68, 255, 0.3)",
              }}
            >
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "17px" }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  ...photoImg,
                  transform: hovered ? "scale(1.05)" : "scale(1)",
                }}
              />
            ) : (
              <span style={placeholderText}>No Photo</span>
            )}
            {/* Glass Finish Reflection Overlay */}
            <div
              style={{
                ...photoGlassOverlay,
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          </div>
            </div>
            <div
              style={{
                ...photoOffsetBg,
                transform: hovered ? "scale(1.08) rotate(3deg)" : "scale(1) rotate(0deg)",
                opacity: hovered ? 0.85 : 0.5,
              }}
            />
          </div>
        </div>

        {/* Right Side: Upload Controls */}
        <div style={controlsBox}>
          <h3 style={boxTitle}>Upload Actions</h3>
          
          <div style={fileDropzone}>
            <label htmlFor="profile-file-input" style={uploadLabel}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFB400" strokeWidth="2" style={{ marginBottom: "8px" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span>Choose Image File</span>
              <span style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>Max size 2MB (JPG, PNG, WEBP)</span>
            </label>
            <input
              id="profile-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div style={actionRow}>
            <button
              style={{
                ...saveBtn,
                opacity: newImageBase64 && !saving ? 1 : 0.5,
                cursor: newImageBase64 && !saving ? "pointer" : "default"
              }}
              onClick={handleSave}
              disabled={!newImageBase64 || saving}
            >
              {saving ? "Saving..." : "Save Image"}
            </button>

            {newImageBase64 && (
              <button style={cancelBtn} onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            )}

            {currentPhoto && !newImageBase64 && (
              <button style={deleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete Image"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styling (matches Admin Layout/Section style guidelines)

const sectionContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
  padding: "4px",
  textAlign: "left",
};

const sectionTitle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#fff",
  margin: 0,
};

const subtitleText = {
  fontSize: "14px",
  color: "#888",
  margin: "0 0 20px 0",
};

const uploadLayout = {
  display: "flex",
  flexWrap: "wrap",
  gap: "32px",
  marginTop: "16px",
};

const previewBox = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "24px",
  flex: "1 1 300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
};

const controlsBox = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "24px",
  flex: "2 1 400px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const boxTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#fff",
  margin: 0,
  alignSelf: "flex-start",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  paddingBottom: "10px",
  width: "100%",
};

const photoContainer = {
  position: "relative",
  width: "180px",
  height: "180px",
  padding: "8px",
  boxSizing: "border-box",
};

const photoFrame = {
  width: "100%",
  height: "100%",
  borderRadius: "24px",
  border: "2.5px solid #0044ff",
  background: "#05050c",
  padding: "6px",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};

const photoImg = {
  width: "100%",
  height: "100%",
  borderRadius: "17px",
  objectFit: "cover",
  transition: "transform 0.4s ease",
};

const photoGlassOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: "17px",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(5, 5, 12, 0.2) 30%, rgba(5, 5, 12, 0.75) 100%)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "inset 0 0 12px rgba(0, 0, 0, 0.75), inset 0 0 20px rgba(0, 85, 255, 0.08)",
  pointerEvents: "none",
  zIndex: 2,
  boxSizing: "border-box",
  transition: "all 0.4s ease",
};

const photoOffsetBg = {
  position: "absolute",
  top: "10px",
  left: "10px",
  right: "10px",
  bottom: "10px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #0055ff 0%, #0011aa 100%)",
  filter: "blur(20px)",
  zIndex: -1,
  transition: "all 0.4s ease",
};

const placeholderText = {
  fontSize: "13px",
  color: "#444",
  fontWeight: "500",
};

const fileDropzone = {
  border: "2px dashed rgba(255, 180, 0, 0.2)",
  background: "rgba(255, 180, 0, 0.02)",
  borderRadius: "12px",
  padding: "40px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s",
};

const uploadLabel = {
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  color: "#ccc",
  fontSize: "14px",
  fontWeight: "500",
};

const actionRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "auto",
};

const saveBtn = {
  background: "linear-gradient(90deg, #FFB400, #FF8000)",
  border: "none",
  color: "#0a0a14",
  padding: "10px 24px",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "13px",
  outline: "none",
  boxShadow: "0 4px 12px rgba(255,180,0,0.15)",
};

const cancelBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#aaa",
  padding: "10px 20px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
  outline: "none",
};

const deleteBtn = {
  background: "rgba(255, 107, 107, 0.1)",
  border: "1px solid rgba(255, 107, 107, 0.3)",
  color: "#ff8b8b",
  padding: "10px 20px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
  outline: "none",
};

const statusWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 20px",
  gap: "16px",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: "3.5px solid rgba(255,180,0,0.1)",
  borderTop: "3.5px solid #FFB400",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const statusText = {
  fontSize: "14px",
  color: "#888",
  margin: 0,
};

const errorContainer = {
  background: "rgba(255,107,107,0.08)",
  border: "1px solid rgba(255,107,107,0.3)",
  color: "#ff8b8b",
  padding: "16px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "left",
  marginBottom: "16px",
};

const retryBtn = {
  background: "rgba(255,107,107,0.15)",
  border: "1px solid rgba(255,107,107,0.4)",
  color: "#ff8b8b",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};
