import React, { useState, useEffect } from "react";

export function AdminModal({ isOpen, onClose, onSave, item, fields, title }) {
  const [formData, setFormData] = useState({});
  const [tagInputs, setTagInputs] = useState({});
  const [listInputs, setListInputs] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialData = {};
      fields.forEach((field) => {
        if (item && item[field.name] !== undefined) {
          initialData[field.name] = item[field.name];
        } else {
          initialData[field.name] = field.type === "tags" || field.type === "list" ? [] : "";
        }
      });
      setFormData(initialData);
      setTagInputs({});
      setListInputs({});
    }
  }, [isOpen, item, fields]);

  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (name) => {
    const value = (tagInputs[name] || "").trim();
    if (!value) return;
    const currentTags = formData[name] || [];
    if (!currentTags.includes(value)) {
      handleChange(name, [...currentTags, value]);
    }
    setTagInputs((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRemoveTag = (name, index) => {
    const currentTags = formData[name] || [];
    const updated = currentTags.filter((_, idx) => idx !== index);
    handleChange(name, updated);
  };

  const handleAddListItem = (name) => {
    const value = (listInputs[name] || "").trim();
    if (!value) return;
    const currentList = formData[name] || [];
    handleChange(name, [...currentList, value]);
    setListInputs((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRemoveListItem = (name, index) => {
    const currentList = formData[name] || [];
    const updated = currentList.filter((_, idx) => idx !== index);
    handleChange(name, updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.required) {
        const val = formData[f.name];
        if (f.type === "tags" || f.type === "list") {
          if (!val || val.length === 0) {
            alert(`${f.label} is required and cannot be empty.`);
            return;
          }
        } else {
          if (val === undefined || val === null || String(val).trim() === "") {
            alert(`${f.label} is required.`);
            return;
          }
        }
      }
    }
    onSave(formData);
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContainer}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>{title}</h3>
          <button style={closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} style={modalForm}>
          <div style={modalBody}>
            {fields.map((field) => {
              const value = formData[field.name];

              return (
                <div key={field.name} style={formGroup}>
                  <label style={formLabel}>
                    {field.label} {field.required && <span style={requiredStar}>*</span>}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      placeholder={field.placeholder || ""}
                      value={value || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      style={formInput}
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      placeholder={field.placeholder || ""}
                      value={value || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      style={{ ...formInput, ...formTextarea }}
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      value={value || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      style={formSelect}
                    >
                      <option value="" disabled>Select category...</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === "tags" && (
                    <div>
                      <div style={tagInputContainer}>
                        <input
                          type="text"
                          placeholder={field.placeholder || "Type and click Add"}
                          value={tagInputs[field.name] || ""}
                          onChange={(e) =>
                            setTagInputs((prev) => ({ ...prev, [field.name]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              handleAddTag(field.name);
                            }
                          }}
                          style={tagInputField}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag(field.name)}
                          style={addListBtn}
                        >
                          Add
                        </button>
                      </div>
                      <div style={tagsContainer}>
                        {(value || []).map((tag, idx) => (
                          <span key={idx} style={tagBadge}>
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(field.name, idx)}
                              style={removeTagBtn}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {field.type === "list" && (
                    <div>
                      <div style={tagInputContainer}>
                        <input
                          type="text"
                          placeholder={field.placeholder || "Add responsibility bullet..."}
                          value={listInputs[field.name] || ""}
                          onChange={(e) =>
                            setListInputs((prev) => ({ ...prev, [field.name]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddListItem(field.name);
                            }
                          }}
                          style={tagInputField}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddListItem(field.name)}
                          style={addListBtn}
                        >
                          Add
                        </button>
                      </div>
                      <ul style={listContainer}>
                        {(value || []).map((bullet, idx) => (
                          <li key={idx} style={listRowItem}>
                            <span style={listTextSpan}>{bullet}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveListItem(field.name, idx)}
                              style={removeListBtn}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={modalFooter}>
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={saveBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(5, 5, 10, 0.85)",
  backdropFilter: "blur(8px)",
  zIndex: 2000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px",
};

const modalContainer = {
  background: "linear-gradient(135deg, #111122 0%, #0a0a14 100%)",
  border: "1px solid rgba(255, 180, 0, 0.2)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,180,0,0.05)",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "600px",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  color: "#fff",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 24px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const modalTitle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#FFB400",
  margin: 0,
};

const closeBtn = {
  background: "none",
  border: "none",
  color: "#888",
  fontSize: "24px",
  cursor: "pointer",
  outline: "none",
};

const modalForm = {
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const modalBody = {
  padding: "24px",
  overflowY: "auto",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  textAlign: "left",
};

const formLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#aaa",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const requiredStar = {
  color: "#ff6b6b",
  marginLeft: "2px",
};

const formInput = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
};

const formTextarea = {
  minHeight: "100px",
  resize: "vertical",
};

const formSelect = {
  background: "#111122",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  cursor: "pointer",
};

const tagInputContainer = {
  display: "flex",
  gap: "8px",
};

const tagInputField = {
  flex: 1,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
};

const addListBtn = {
  padding: "0 18px",
  background: "rgba(255, 180, 0, 0.15)",
  color: "#FFB400",
  border: "1px solid rgba(255, 180, 0, 0.4)",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  outline: "none",
};

const tagsContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginTop: "10px",
};

const tagBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "rgba(255, 180, 0, 0.1)",
  border: "1px solid rgba(255, 180, 0, 0.3)",
  color: "#FFB400",
  fontSize: "12px",
  padding: "4px 8px 4px 10px",
  borderRadius: "16px",
};

const removeTagBtn = {
  background: "none",
  border: "none",
  color: "#FFB400",
  cursor: "pointer",
  fontSize: "14px",
  padding: 0,
  lineHeight: 1,
};

const listContainer = {
  listStyle: "none",
  padding: 0,
  margin: "12px 0 0",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const listRowItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.04)",
  padding: "8px 12px",
  borderRadius: "8px",
  gap: "12px",
};

const listTextSpan = {
  fontSize: "13px",
  color: "#ccc",
  lineHeight: "1.4",
  flex: 1,
};

const removeListBtn = {
  background: "none",
  border: "none",
  color: "#ff6b6b",
  fontSize: "12px",
  cursor: "pointer",
  padding: "2px 6px",
  flexShrink: 0,
};

const modalFooter = {
  padding: "16px 24px",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
};

const cancelBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#aaa",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  outline: "none",
};

const saveBtn = {
  background: "#FFB400",
  border: "none",
  color: "#0a0a14",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  outline: "none",
};
