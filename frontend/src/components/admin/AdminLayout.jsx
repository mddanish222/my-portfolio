import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { adminConfig } from "./adminConfig";
import { AdminSection } from "./AdminSection";
import { ProfilePhotoManager } from "./ProfilePhotoManager";

export function AdminLayout() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      const originalWidth = root.style.width;
      const originalMaxWidth = root.style.maxWidth;
      const originalBorderInline = root.style.borderInline;
      const originalTextAlign = root.style.textAlign;
      const originalMargin = root.style.margin;

      root.style.width = "100%";
      root.style.maxWidth = "100%";
      root.style.borderInline = "none";
      root.style.textAlign = "left";
      root.style.margin = "0";

      return () => {
        root.style.width = originalWidth;
        root.style.maxWidth = originalMaxWidth;
        root.style.borderInline = originalBorderInline;
        root.style.textAlign = originalTextAlign;
        root.style.margin = originalMargin;
      };
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={layoutContainer}>
      {!isMobile && (
        <aside style={sidebarStyle}>
          <div style={logoWrapper}>
            <span style={logoText}>MD</span>
            <span style={logoSubText}>Admin Panel</span>
          </div>

          <nav style={navLinksWrapper}>
            {Object.entries(adminConfig).map(([key, value]) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={isActive ? { ...navBtn, ...activeNavBtn } : navBtn}
                >
                  {value.label}
                </button>
              );
            })}
          </nav>

          <div style={sidebarFooter}>
            <Link to="/" style={viewSiteLink}>
              View Live Site
            </Link>
            <button onClick={logout} style={logoutBtn}>
              Logout
            </button>
          </div>
        </aside>
      )}

      <main style={mainContentStyle(isMobile)}>
        {isMobile && (
          <header style={mobileHeader}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ color: "#FFB400", fontWeight: "800", fontSize: "18px" }}>MD</span>
              <span style={{ color: "#888", fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Admin</span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link to="/" style={{ color: "#aaa", fontSize: "13px", textDecoration: "none" }}>
                Site
              </Link>
              <button onClick={logout} style={mobileLogoutBtn}>
                Logout
              </button>
            </div>
          </header>
        )}

        <div style={containerStyle}>
          {activeTab === "profile" ? (
            <ProfilePhotoManager />
          ) : (
            <AdminSection sectionKey={activeTab} config={adminConfig[activeTab]} />
          )}
        </div>
      </main>

      {isMobile && (
        <nav style={mobileTabStyle}>
          {Object.entries(adminConfig).map(([key, value]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={isActive ? { ...mobileTabBtn, ...activeMobileTabBtn } : mobileTabBtn}
              >
                {value.label === "Certifications" ? "Certs" : value.label === "Experience" ? "Exp" : value.label}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

const layoutContainer = {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  background: "#080810",
  color: "#fff",
  boxSizing: "border-box",
};

const sidebarStyle = {
  width: "260px",
  background: "rgba(10, 10, 20, 0.95)",
  borderRight: "1px solid rgba(255, 180, 0, 0.15)",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 100,
  padding: "24px",
  boxSizing: "border-box",
};

const logoWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  marginBottom: "40px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  paddingBottom: "20px",
};

const logoText = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#FFB400",
  letterSpacing: "1.5px",
};

const logoSubText = {
  fontSize: "12px",
  color: "#666",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const navLinksWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: 1,
};

const navBtn = {
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: "8px",
  color: "#888",
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.2s",
  outline: "none",
};

const activeNavBtn = {
  background: "rgba(255, 180, 0, 0.08)",
  color: "#FFB400",
  borderColor: "rgba(255, 180, 0, 0.3)",
};

const sidebarFooter = {
  marginTop: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  paddingTop: "20px",
};

const viewSiteLink = {
  color: "#aaa",
  fontSize: "13px",
  textAlign: "center",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "8px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  fontWeight: "500",
  transition: "all 0.2s",
};

const logoutBtn = {
  background: "rgba(255, 107, 107, 0.15)",
  border: "1px solid rgba(255, 107, 107, 0.4)",
  color: "#ff6b6b",
  padding: "11px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
  outline: "none",
  transition: "all 0.2s",
};

const mainContentStyle = (isMobile) => ({
  marginLeft: isMobile ? 0 : "260px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  boxSizing: "border-box",
  paddingBottom: isMobile ? "76px" : "32px",
});

const containerStyle = {
  padding: "32px 24px",
  maxWidth: "1000px",
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
};

const mobileHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 20px",
  background: "rgba(10, 10, 20, 0.95)",
  borderBottom: "1px solid rgba(255, 180, 0, 0.15)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const mobileLogoutBtn = {
  background: "rgba(255, 107, 107, 0.15)",
  border: "1px solid rgba(255, 107, 107, 0.4)",
  color: "#ff6b6b",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const mobileTabStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60px",
  background: "rgba(10, 10, 20, 0.96)",
  backdropFilter: "blur(12px)",
  borderTop: "1px solid rgba(255, 180, 0, 0.15)",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "0 8px",
  zIndex: 1000,
};

const mobileTabBtn = {
  background: "transparent",
  border: "none",
  color: "#777",
  fontSize: "12px",
  fontWeight: "600",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2px",
  outline: "none",
};

const activeMobileTabBtn = {
  color: "#FFB400",
  background: "rgba(255, 180, 0, 0.08)",
};
