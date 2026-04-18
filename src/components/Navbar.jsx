//navbar.jsx
import { useState, useEffect } from "react";

function Navbar() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1400);

  const navItems = ["home", "about", "experience", "skills", "projects", "certifications", "contact"];

  // Track window resize to toggle hamburger
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1400);
      if (window.innerWidth >= 1400) setMenuOpen(false);
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

        {/* Desktop links — hidden on mobile */}
        {!isMobile && (
          <div style={linksStyle}>
            {navItems.map((item) => (
              <button
                key={item}
                style={active === item ? { ...btnStyle, ...activeBtnStyle } : btnStyle}
                onClick={() => scrollToSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Hamburger — shown only on mobile/laptop */}
        {isMobile && (
          <button style={hamburgerStyle} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {/* Mobile dropdown menu — rendered outside nav so it overlays content */}
      {isMobile && menuOpen && (
        <div style={mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item}
              style={active === item ? { ...mobileBtnStyle, ...activeBtnStyle } : mobileBtnStyle}
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

// ─── Styles ───────────────────────────────────────────────────
const navStyle = {
  position: "fixed",
  top: 0,
  width: "100%",
  background: "rgba(10, 10, 20, 0.92)",
  backdropFilter: "blur(12px)",
  padding: "14px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 1000,
  boxSizing: "border-box",
  borderBottom: "1px solid rgba(255,180,0,0.15)",
  left: 0,
  right: 0,
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
  flexWrap: "nowrap",        // never wrap — if it doesn't fit, hamburger takes over
  alignItems: "center",
};

const btnStyle = {
  background: "transparent",
  border: "1px solid transparent",
  color: "#aaa",
  padding: "6px 7px",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "11.5px",
  fontWeight: "500",
  textTransform: "capitalize",
  letterSpacing: "0.3px",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
};

const activeBtnStyle = {
  color: "#FFB400",
  borderColor: "rgba(255,180,0,0.4)",
  background: "rgba(255,180,0,0.08)",
};

const hamburgerStyle = {
  background: "none",
  border: "none",
  color: "#FFB400",
  fontSize: "22px",
  cursor: "pointer",
  padding: "4px 8px",
};

// Full-width dropdown for mobile/laptop
const mobileMenu = {
  position: "fixed",
  top: "57px",               // just below the navbar
  left: 0,
  right: 0,
  background: "rgba(10,10,20,0.97)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255,180,0,0.15)",
  display: "flex",
  flexDirection: "column",
  padding: "12px 20px 16px",
  gap: "4px",
  zIndex: 999,
};

const mobileBtnStyle = {
  ...btnStyle,
  fontSize: "14px",
  padding: "10px 14px",
  textAlign: "left",
  width: "100%",
};

export default Navbar;