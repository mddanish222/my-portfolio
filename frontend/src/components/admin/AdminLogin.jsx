//adminlogin.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const success = await login(password);
      if (success) {
        const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin-portal";
        navigate(ADMIN_PATH);
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginWrapper}>
      <div style={loginCard}>
        <div style={logoWrapper}>
          <span style={logoText}>MD</span>
          <span style={loginSubtitle}>Admin Dashboard Login</span>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroup}>
            <label style={labelStyle}>Enter Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              disabled={loading}
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button type="submit" style={submitBtn} disabled={loading}>
            {loading ? "Authenticating..." : "Login to Console"}
          </button>
        </form>

        <Link to="/" style={backLink}>
          &larr; Back to Portfolio
        </Link>
      </div>
    </div>
  );
}

const loginWrapper = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#080810",
  boxSizing: "border-box",
  padding: "20px",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1500,
};

const loginCard = {
  width: "100%",
  maxWidth: "400px",
  background: "linear-gradient(135deg, #111122 0%, #0a0a14 100%)",
  border: "1px solid rgba(255, 180, 0, 0.2)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,180,0,0.05)",
  borderRadius: "16px",
  padding: "40px 32px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  textAlign: "center",
  color: "#fff",
};

const logoWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const logoText = {
  fontSize: "36px",
  fontWeight: "800",
  color: "#FFB400",
  letterSpacing: "2px",
};

const loginSubtitle = {
  fontSize: "14px",
  color: "#666",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  textAlign: "left",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#aaa",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const inputStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "12px 16px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const errorStyle = {
  color: "#ff6b6b",
  fontSize: "13px",
  margin: 0,
  textAlign: "left",
};

const submitBtn = {
  background: "linear-gradient(90deg, #FFB400, #FF8000)",
  border: "none",
  color: "#0a0a14",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(255,180,0,0.2)",
  outline: "none",
};

const backLink = {
  color: "#777",
  fontSize: "13px",
  textDecoration: "none",
  alignSelf: "center",
};
