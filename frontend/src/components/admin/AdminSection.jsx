import React, { useState, useEffect } from "react";
import { apiRequest } from "../../api/client";
import { AdminModal } from "./AdminModal";

export function AdminSection({ sectionKey, config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, item: null });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest(config.endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [sectionKey, config]);

  const handleOpenAdd = () => {
    setModalState({ isOpen: true, item: null });
  };

  const handleOpenEdit = (item) => {
    setModalState({ isOpen: true, item });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, item: null });
  };

  const handleSave = async (formData) => {
    const isEdit = !!modalState.item;
    const url = isEdit ? `${config.endpoint}/${modalState.item.id}` : config.endpoint;
    const method = isEdit ? "PUT" : "POST";

    try {
      await apiRequest(url, {
        method,
        body: JSON.stringify(formData),
      });
      handleCloseModal();
      fetchItems();
    } catch (err) {
      alert(`Error saving item: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await apiRequest(`${config.endpoint}/${id}`, {
        method: "DELETE",
      });
      fetchItems();
    } catch (err) {
      alert(`Error deleting item: ${err.message}`);
    }
  };

  const getItemDetails = (item) => {
    switch (sectionKey) {
      case "projects":
        return { title: item.title, subtitle: `${item.type} · ${item.status}` };
      case "skills":
        return { title: item.name, subtitle: item.type };
      case "experience":
        return { title: item.role, subtitle: `${item.company} · ${item.period}` };
      case "education":
        return { title: item.degree, subtitle: `${item.institution} (${item.year})` };
      case "certifications":
        return { title: item.title, subtitle: `${item.issuer} ${item.note ? `· ${item.note}` : ""}` };
      default:
        return { title: "Item", subtitle: "" };
    }
  };

  if (loading) {
    return (
      <div style={statusWrapper}>
        <div style={spinner} />
        <p style={statusText}>Loading {config.label}...</p>
      </div>
    );
  }

  return (
    <div style={sectionContainer}>
      <div style={sectionHeader}>
        <h2 style={sectionTitle}>{config.label} Manager</h2>
        <button style={addBtn} onClick={handleOpenAdd}>
          + Add {config.label.endsWith("s") ? config.label.slice(0, -1) : config.label}
        </button>
      </div>

      {error && (
        <div style={errorContainer}>
          <p style={{ margin: 0 }}>{error}</p>
          <button style={retryBtn} onClick={fetchItems}>Retry</button>
        </div>
      )}

      {!error && items.length === 0 && (
        <div style={emptyContainer}>
          <p style={{ margin: 0, color: "#888" }}>No {config.label.toLowerCase()} found.</p>
          <p style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>Click the button above to add your first record.</p>
        </div>
      )}

      {!error && items.length > 0 && (
        <div style={itemList}>
          {items.map((item) => {
            const { title, subtitle } = getItemDetails(item);

            return (
              <div key={item.id} style={itemCard}>
                <div style={itemMeta}>
                  <h4 style={itemTitle}>{title}</h4>
                  <p style={itemSubtitle}>{subtitle}</p>
                </div>
                <div style={itemActions}>
                  <button style={editActionBtn} onClick={() => handleOpenEdit(item)}>
                    Edit
                  </button>
                  <button style={deleteActionBtn} onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        item={modalState.item}
        fields={config.fields}
        title={modalState.item ? `Edit ${config.label.endsWith("s") ? config.label.slice(0, -1) : config.label}` : `Add New ${config.label.endsWith("s") ? config.label.slice(0, -1) : config.label}`}
      />
    </div>
  );
}

const sectionContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
  padding: "4px",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const sectionTitle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#fff",
  margin: 0,
};

const addBtn = {
  background: "linear-gradient(90deg, #FFB400, #FF8000)",
  border: "none",
  color: "#0a0a14",
  padding: "10px 20px",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(255,180,0,0.2)",
  transition: "all 0.2s",
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

const emptyContainer = {
  border: "1px dashed rgba(255,255,255,0.08)",
  padding: "60px 20px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const itemList = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const itemCard = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "18px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "24px",
  transition: "all 0.2s",
  textAlign: "left",
};

const itemMeta = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: 1,
};

const itemTitle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#fff",
  margin: 0,
};

const itemSubtitle = {
  fontSize: "12px",
  color: "#888",
  margin: 0,
};

const itemActions = {
  display: "flex",
  gap: "10px",
  flexShrink: 0,
};

const editActionBtn = {
  background: "rgba(255,180,0,0.1)",
  border: "1px solid rgba(255,180,0,0.3)",
  color: "#FFB400",
  padding: "6px 14px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
  outline: "none",
};

const deleteActionBtn = {
  background: "rgba(255,107,107,0.1)",
  border: "1px solid rgba(255,107,107,0.3)",
  color: "#ff8b8b",
  padding: "6px 14px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
  outline: "none",
};
