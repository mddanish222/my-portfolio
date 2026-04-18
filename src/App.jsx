import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import { Experience, Certifications } from "./components/Exce";
import useFetch from "./hooks/useFetch";

function App() {
  return (
    <div style={appStyle}>
      <style>{globalCSS}</style>
      <Navbar />

      <section id="home" style={heroSection}>
        <HeroContent />
      </section>

      <section id="about" style={section("#0d0d1a")}>
        <About />
      </section>

      <section id="experience" style={section("#0a0a14")}>
        <Experience />
      </section>

      <section id="skills" style={section("#0d0d1a")}>
        <Skills />
      </section>

      <section id="projects" style={section("#0a0a14")}>
        <Projects />
      </section>

      <section id="certifications" style={section("#0d0d1a")}>
        <Certifications />
      </section>

      <section id="contact" style={section("#0a0a14")}>
        <Contact />
      </section>

      <footer style={footerStyle}>
        <p>Designed & built by Mohammed Danish · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────
function HeroContent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        ...heroContent,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s ease",
      }}
    >
      <div style={heroBadge}>Available for opportunities</div>

      <h1 style={heroTitle}>
        <span style={{ color: "#fff" }}>Mohammed </span>
        <span style={{ color: "#FFB400" }}>Danish</span>
      </h1>

      <p style={heroRole}>Full Stack Developer · BCA Student · Android Developer</p>

      <p style={heroDesc}>
        Building web and mobile applications with clean architecture and modern
        technologies. Currently contributing to the MentorAI platform at Ontum Education.
      </p>

      <div style={heroButtons}>
        <button
          style={primaryBtn}
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
        >
          View Projects
        </button>
        <button
          style={secondaryBtn}
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        >
          Contact Me
        </button>
        <a href="https://github.com/mddanish222" target="_blank" rel="noreferrer" style={ghostBtn}>
          GitHub
        </a>
      </div>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────
function About() {
  const { data: education, loading } = useFetch("http://localhost:5000/education");

  return (
    <div style={aboutGrid}>
      {/* Bio */}
      <div>
        <h2 style={sectionTitle}>About Me</h2>
        <p style={bioText}>
          I'm a passionate BCA student at Seshadripuram College (CGPA: 8.52) specialising
          in web and app development. I've built full-stack applications using React,
          Node.js, Flask, and databases like MongoDB and PostgreSQL.
        </p>
        <p style={bioText}>
          I work on real-world freelance and client projects — focusing on clean design,
          performance, and user-friendly interfaces. Currently a Full Stack Developer
          (Consultant) at Ontum Education Pvt Ltd, Bengaluru.
        </p>

        <div style={statsRow}>
          {[
            { label: "Projects",  value: "5+" },
            { label: "CGPA",      value: "8.52" },
            { label: "PUC Score", value: "91%" },
            { label: "Since",     value: "2024" },
          ].map((s) => (
            <div key={s.label} style={statBox}>
              <span style={statValue}>{s.value}</span>
              <span style={statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Education timeline */}
      <div>
        <h3 style={{ color: "#fff", fontSize: "18px", marginBottom: "20px" }}>Education</h3>
        {loading ? (
          <p style={{ color: "#666", fontSize: "14px" }}>Loading education...</p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} style={eduCard}>
              <div style={eduDot} />
              <div style={{ flex: 1 }}>
                <p style={eduDegree}>{edu.degree}</p>
                <p style={eduInstitution}>{edu.institution}</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={eduScore}>{edu.score}</span>
                  <span style={eduYear}>{edu.year}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────
function Contact() {
  return (
    <div style={contactWrap}>
      <h2 style={{ ...sectionTitle, textAlign: "center" }}>Contact</h2>
      <p style={{ color: "#888", textAlign: "center", marginBottom: "48px" }}>
        Let's build something together
      </p>

      <div style={contactGrid}>
        {[
          { label: "Email",    value: "mdddanish854@gmail.com" },
          { label: "Phone",    value: "9206634786" },
          { label: "GitHub",   value: "github.com/mddanish222" },
          { label: "LinkedIn", value: "linkedin.com/in/mohammeddanish" },
        ].map((c) => (
          <div key={c.label} style={infoCard}>
            <span style={infoLabel}>{c.label}</span>
            <span style={infoValue}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GLOBAL STYLES ────────────────────────────────────────────
const globalCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0a0a14; font-family: 'Segoe UI', system-ui, sans-serif; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
  input::placeholder, textarea::placeholder { color: #444; }
  input:focus, textarea:focus { outline: none; border-color: rgba(255,180,0,0.5) !important; }
  a { transition: opacity 0.2s; }
  a:hover { opacity: 0.8; }
`;

const appStyle = { color: "#fff", minHeight: "100vh" };

const heroSection = {
  minHeight: "100vh",
  background: "radial-gradient(ellipse at 30% 50%, rgba(255,180,0,0.06) 0%, transparent 60%), #0a0a14",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "120px 40px 80px",
  textAlign: "center",
};

const section = (bg) => ({
  minHeight: "100vh",
  background: bg,
  padding: "100px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const heroContent = { maxWidth: "700px" };

const heroBadge = {
  display: "inline-block",
  padding: "6px 16px",
  borderRadius: "20px",
  border: "1px solid rgba(255,180,0,0.3)",
  color: "#FFB400",
  fontSize: "13px",
  marginBottom: "24px",
};

const heroTitle = {
  fontSize: "clamp(36px, 6vw, 64px)",
  fontWeight: "800",
  lineHeight: 1.1,
  marginBottom: "16px",
  letterSpacing: "-1px",
  color: "#fff",
};

const heroRole = {
  fontSize: "16px",
  color: "#888",
  marginBottom: "20px",
  letterSpacing: "0.5px",
};

const heroDesc = {
  fontSize: "15px",
  color: "#aaa",
  lineHeight: "1.7",
  marginBottom: "36px",
  maxWidth: "560px",
  margin: "0 auto 36px",
};

const heroButtons = { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" };

const primaryBtn = {
  padding: "12px 28px",
  background: "#FFB400",
  color: "#0a0a14",
  border: "none",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 28px",
  background: "transparent",
  color: "#FFB400",
  border: "1px solid #FFB400",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
};

const ghostBtn = {
  padding: "12px 28px",
  background: "transparent",
  color: "#aaa",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  fontWeight: "500",
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const sectionTitle = { fontSize: "36px", fontWeight: "700", color: "#fff", marginBottom: "24px" };

const aboutGrid = {
  maxWidth: "1000px",
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "60px",
  alignItems: "start",
};

const bioText   = { color: "#aaa", fontSize: "15px", lineHeight: "1.8", marginBottom: "16px" };
const statsRow  = { display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap" };
const statBox   = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center" };
const statValue = { fontSize: "24px", fontWeight: "700", color: "#FFB400" };
const statLabel = { fontSize: "11px", color: "#666", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" };

const eduCard        = { display: "flex", gap: "16px", marginBottom: "24px", alignItems: "flex-start" };
const eduDot         = { width: "10px", height: "10px", borderRadius: "50%", background: "#FFB400", marginTop: "5px", flexShrink: 0 };
const eduDegree      = { color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "3px" };
const eduInstitution = { color: "#888", fontSize: "13px", marginBottom: "6px" };
const eduScore       = { color: "#FFB400", fontSize: "12px", fontWeight: "600" };
const eduYear        = { color: "#555", fontSize: "12px" };

const contactWrap = { maxWidth: "700px", width: "100%", margin: "0 auto" };

const contactGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const infoCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "24px 18px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  textAlign: "center",
};

const infoLabel = { fontSize: "11px", color: "#FFB400", textTransform: "uppercase", letterSpacing: "0.5px" };
const infoValue = { fontSize: "14px", color: "#ccc" };

const footerStyle = { textAlign: "center", padding: "24px", color: "#444", fontSize: "13px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0a14" };

export default App;