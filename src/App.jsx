import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  return (
    <div>
      <Navbar />

      {/* HOME */}
      <section style={homeStyle} id="home">
        <div>
          <h1 style={homeTitle}>Hi, I'm Mohammed Danish 👋</h1>
          <p style={homeSub}>Full Stack Developer | BCA Student</p>
          <p style={homeDesc}>
            I build web and mobile applications using modern technologies.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section style={sectionStyle("#1e293b")} id="about">
        <div style={contentBox}>
          <h1>About Me</h1>
          <p>
            I am a passionate BCA student specializing in web and app
            development. I have experience building full-stack applications
            using React, Node.js, Flask, and databases like MongoDB and
            PostgreSQL.
          </p>
          <p>
            I have worked on freelance and real-world projects focusing on
            clean design, performance, and user-friendly interfaces.
          </p>
        </div>
      </section>

      {/* SKILLS */}
      <section style={sectionStyle("#334155")} id="skills">
        <Skills />
      </section>

      {/* PROJECTS */}
      <section style={sectionStyle("#475569")} id="projects">
        <Projects />
      </section>

      {/* CONTACT */}
      <section style={sectionStyle("#64748b")} id="contact">
        <div style={contentBox}>
          <h1>Contact</h1>
          <p>Email: mdddanish854@gmail.com</p>
          <p>Phone: 9206634786</p>
          <p>GitHub: github.com/mddanish222</p>
        </div>
      </section>
    </div>
  );
}

/* ---------- STYLES ---------- */

const homeStyle = {
  minHeight: "100vh",
  paddingTop: "100px",
  background: "#0f172a",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const homeTitle = {
  fontSize: "40px",
  marginBottom: "10px",
};

const homeSub = {
  fontSize: "18px",
  marginBottom: "10px",
  color: "#cbd5f5",
};

const homeDesc = {
  fontSize: "16px",
  maxWidth: "500px",
  margin: "auto",
};

const sectionStyle = (bg) => ({
  minHeight: "100vh",
  paddingTop: "100px",
  background: bg,
  color: "white",
});

const contentBox = {
  maxWidth: "800px",
  margin: "auto",
  textAlign: "center",
};

export default App;