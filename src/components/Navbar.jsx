import { useState } from "react";

function Navbar() {
  const [active, setActive] = useState("home");

  const scrollToSection = (id) => {
    setActive(id);
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <nav style={navStyle}>
      {["home", "about", "skills", "projects", "contact"].map((item) => (
        <button
          key={item}
          style={active === item ? activeBtn : btnStyle}
          onClick={() => scrollToSection(item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      ))}
    </nav>
  );
}

const navStyle = {
  position: "fixed",
  top: 0,
  width: "100%",
  background: "#000",
  padding: "15px",
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  zIndex: 1000,
  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
};

const btnStyle = {
  background: "white",
  border: "none",
  padding: "8px 15px",
  cursor: "pointer",
  borderRadius: "20px",
  fontWeight: "bold",
};

const activeBtn = {
  ...btnStyle,
  background: "orange",
  color: "white",
};

export default Navbar;