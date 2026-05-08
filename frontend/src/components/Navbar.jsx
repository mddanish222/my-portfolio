import { useState, useEffect } from "react";

function Navbar() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navItems = ["home", "about", "experience", "skills", "projects", "certifications", "contact"];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      for (const id of [...navItems].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav style={navStyle}>
        <span style={logoStyle}>MD</span>

        {!isMobile && (
          <div style={linksStyle}>
            {navItems.map((item) => (
              <button
                key={item}
                style={active === item ? { ...btnStyle, ...activeBtnStyle } : btnStyle}
                onMouseEnter={(e) => {
                  if (active !== item) e.currentTarget.style.color = "#FFB400";
                }}
                onMouseLeave={(e) => {
                  if (active !== item) e.currentTarget.style.color = "#aaa";
                }}
                onClick={() => scrollToSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        )}

        {isMobile && (
          <button
            style={{
              ...hamburgerStyle,
              background: menuOpen ? "rgba(255,180,0,0.1)" : "none",
            }}
            onClick={() => setMenuOpen((prev) => !prev)}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,180,0,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = menuOpen ? "rgba(255,180,0,0.1)" : "none")}
            onFocus={(e) => (e.currentTarget.style.outline = "none")}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#FFB400" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18" />
                <line x1="18" y1="4" x2="4" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#FFB400" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="19" y2="6"  />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
            )}
          </button>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item}
              style={active === item ? { ...mobileBtnStyle, ...activeBtnStyle } : mobileBtnStyle}
              onMouseEnter={(e) => {
                if (active !== item) e.currentTarget.style.color = "#FFB400";
              }}
              onMouseLeave={(e) => {
                if (active !== item) e.currentTarget.style.color = "#aaa";
              }}
              onClick={() => scrollToSection(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

const navStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  background: "rgba(10, 10, 20, 0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  padding: "14px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 1000,
  boxSizing: "border-box",
  borderBottom: "1px solid rgba(255,180,0,0.15)",
};

const logoStyle = {
  color: "#FFB400",
  fontWeight: "800",
  fontSize: "22px",
  letterSpacing: "2px",
  flexShrink: 0,
};

const linksStyle = {
  display: "flex",
  gap: "4px",
  flexWrap: "nowrap",
  alignItems: "center",
};

const btnStyle = {
  background: "transparent",
  border: "1px solid transparent",
  color: "#aaa",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "500",
  textTransform: "capitalize",
  letterSpacing: "0.3px",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
  outline: "none",
};

const activeBtnStyle = {
  color: "#FFB400",
  borderColor: "rgba(255,180,0,0.4)",
  background: "rgba(255,180,0,0.08)",
};

const hamburgerStyle = {
  border: "none",
  cursor: "pointer",
  padding: "6px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  flexShrink: 0,
  transition: "background 0.2s",
  outline: "none",
};

const mobileMenu = {
  position: "fixed",
  top: "57px",
  left: 0,
  right: 0,
  background: "rgba(10,10,20,0.97)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255,180,0,0.15)",
  display: "flex",
  flexDirection: "column",
  padding: "12px 20px 16px",
  gap: "4px",
  zIndex: 999,
};

const mobileBtnStyle = {
  background: "transparent",
  border: "1px solid transparent",
  color: "#aaa",
  padding: "12px 14px",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "15px",
  fontWeight: "500",
  textTransform: "capitalize",
  letterSpacing: "0.3px",
  transition: "all 0.2s",
  textAlign: "left",
  width: "100%",
  outline: "none",
};

export default Navbar;