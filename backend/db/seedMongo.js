require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("./models/Project");
const Skill = require("./models/Skill");
const Experience = require("./models/Experience");
const Education = require("./models/Education");
const Certification = require("./models/Certification");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in process.env");
  process.exit(1);
}

const projectsData = [
  {
    title: "QR-Authenticated Voting System",
    description:
      "Secured a voting platform against fraud and unauthorized access by implementing three independent authentication layers – QR code, facial recognition, and OTP – combined with brute-force lockout and Row-Level Security. Delivered a fully deployed, kiosk-ready application by designing conflict-detection logic and deploying as an installable Progressive Web App.",
    tech: ["HTML", "Node.js", "Express.js", "PostgreSQL (Supabase)", "PWA"],
    type: "Personal",
    status: "Completed",
    github: "https://github.com/mddanish222/QR-Authenticated_Voting_System.git",
    live: "https://voterscan-platform.netlify.app",
  },
  {
    title: "Personal Developer Portfolio",
    description:
      "Enabled zero-redeploy content updates by building a JWT-protected CRUD admin dashboard managing all site content dynamically. Extended platform reach to mobile by powering a companion React Native app from the same REST API, validated with Jest/RTL test coverage and deployed via GitHub Actions CI/CD.",
    tech: ["React", "Node.js", "PostgreSQL", "JWT", "Expo (React Native)"],
    type: "Personal",
    status: "Completed",
    github: "https://github.com/mddanish222/my-portfolio",
    live: "https://mohammeddanish-portfolio.netlify.app",
  },
  {
    title: "VoiceIntel AI – Speech Intelligence & Transcription Platform",
    description:
      "Engineered a full-stack AI transcription platform using Java Spring Boot 3 and Deepgram Nova AI, featuring Dual-Channel OTP authentication and permanent cloud persistence in Supabase PostgreSQL. Implemented instant backend auto-save persistence, client-side PDF export, and a Framer Motion glassmorphic UI; containerized via Docker and deployed live on Netlify and Render.",
    tech: ["React.js", "Java (Spring Boot)", "Docker", "Supabase (PostgreSQL)", "JWT"],
    type: "Personal",
    status: "Completed",
    github: "https://github.com/mddanish222/voiceIntel",
    live: "https://voiceintel.netlify.app",
  },
  {
    title: "Money Manager App",
    description:
      "Delivered a fully offline-capable personal finance app by implementing Room database persistence and Coroutines-based async operations under an MVVM architecture. Improved transaction tracking usability by building categorized transaction views with advanced filtering in Jetpack Compose.",
    tech: ["Kotlin", "Jetpack Compose", "Room", "MVVM", "Coroutines"],
    type: "Personal",
    status: "Completed",
    github: "https://github.com/mddanish222/Money-Manager-app",
    live: null,
  },
  {
    title: "Arsh Infrastructure – Project Tracker & Client Portal (Freelance)",
    description:
      "Delivered a secure client-facing portal by implementing token-based admin authentication with an obscured login route and Supabase-backed image uploads, deployed across decoupled Netlify + Render infrastructure.",
    tech: ["Python", "Flask", "PostgreSQL (Supabase)", "PWA"],
    type: "Freelance",
    status: "Completed",
    github: "https://github.com/mddanish222/arsh-infrastructure",
    live: "https://arsh-infrastructure.netlify.app",
  },
  {
    title: "KR-Timber – Timber Inventory & Finance System (Freelance)",
    description:
      "Built a multi-user timber inventory and finance platform with authentication, stock and expenditure tracking, real-time profit-and-loss monitoring, and monthly financial analytics. Improved inventory management efficiency by implementing bulk edit/delete operations and a responsive Progressive Web App interface for streamlined day-to-day business operations.",
    tech: ["HTML", "Node.js", "Express.js", "MongoDB", "PWA"],
    type: "Freelance",
    status: "Completed",
    github: "https://github.com/mddanish222/KR-Timber.git",
    live: "https://kr-timber.netlify.app",
  },
];

const skillsData = [
  // Languages
  { name: "JavaScript", type: "frontend", level: 90 },
  { name: "Java", type: "backend", level: 85 },
  { name: "Python", type: "backend", level: 85 },
  { name: "Kotlin", type: "mobile", level: 80 },
  { name: "SQL", type: "database", level: 85 },
  { name: "PHP", type: "backend", level: 70 },
  { name: "HTML5", type: "frontend", level: 95 },
  { name: "CSS3", type: "frontend", level: 90 },

  // Frontend
  { name: "React.js", type: "frontend", level: 90 },
  { name: "React Native", type: "mobile", level: 80 },
  { name: "Jetpack Compose", type: "mobile", level: 75 },
  { name: "PWA (Progressive Web Apps)", type: "frontend", level: 85 },

  // Backend
  { name: "Node.js", type: "backend", level: 88 },
  { name: "Express.js", type: "backend", level: 88 },
  { name: "Spring Boot 3", type: "backend", level: 80 },
  { name: "Flask", type: "backend", level: 82 },
  { name: "REST APIs", type: "backend", level: 90 },
  { name: "JWT & OAuth", type: "backend", level: 85 },

  // Databases & Cloud / Tools
  { name: "PostgreSQL", type: "database", level: 85 },
  { name: "Supabase", type: "database", level: 85 },
  { name: "MongoDB", type: "database", level: 85 },
  { name: "Room DB", type: "database", level: 80 },
  { name: "Docker", type: "tools", level: 75 },
  { name: "Git & GitHub Actions (CI/CD)", type: "tools", level: 90 },
  { name: "Netlify & Render", type: "tools", level: 90 },
];

const experienceData = [
  {
    role: "Full Stack Developer",
    company: "Ontum Education Pvt Ltd",
    location: "Bengaluru",
    period: "Feb 2026 – Apr 2026",
    stipend: null,
    points: [
      "Contributed to the MentorAI platform’s core functionality by building and troubleshooting full-stack features across React and Node.js, working end-to-end across frontend and backend layers of a live production system.",
      "Translated business requirements into working application components by collaborating with cross-functional team members through structured technical discussions and agile development cycles.",
      "Improved code reliability by participating in structured code reviews and applying team development best practices consistently across delivered features.",
    ],
  },
];

const educationData = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Seshadripuram College, Tumkur University",
    year: "2026",
    score: "CGPA: 8.52 / 10",
  },
  {
    degree: "PUC (Commerce)",
    institution: "Vidyaniketan PU College, Tumkur",
    year: "2023",
    score: "91.16%",
  },
  {
    degree: "SSLC",
    institution: "Vidyaniketan High School, Tumkur",
    year: "2021",
    score: "79.52%",
  },
];

const certificationsData = [
  {
    title: "Java Full Stack Development",
    issuer: "S Spiders Computer Training Institute (ISO 9001:2015)",
    note: "Grade A (233/250) · Dec 2025",
  },
  {
    title: "Advanced Java",
    issuer: "Alpha Tech Academy",
    note: null,
  },
  {
    title: "Aptitude and Soft Skills Training",
    issuer: "Glisten Education",
    note: null,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" Connected to MongoDB Atlas for Seeding...");

    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Certification.deleteMany({});

    console.log("🧹 Cleared old data.");

    await Project.insertMany(projectsData);
    await Skill.insertMany(skillsData);
    await Experience.insertMany(experienceData);
    await Education.insertMany(educationData);
    await Certification.insertMany(certificationsData);

    console.log("🌱 Database successfully updated with exact LaTeX Resume links & details!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding MongoDB Atlas database:", error);
    process.exit(1);
  }
}

seedDatabase();
