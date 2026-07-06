export const adminConfig = {
  projects: {
    label: "Projects",
    endpoint: "/projects",
    fields: [
      { name: "title", label: "Project Title", type: "text", required: true },
      { name: "desc", label: "Description", type: "textarea", required: true },
      { name: "tech", label: "Technologies", type: "tags", placeholder: "Press Enter or comma to add tech", required: true },
      { name: "type", label: "Type", type: "select", options: ["Personal", "Freelance", "Paid Freelance"], required: true },
      { name: "status", label: "Status", type: "select", options: ["Completed", "Ongoing", "Awaiting Deployment"], required: true },
      { name: "github", label: "GitHub Link", type: "text", required: false },
      { name: "live", label: "Live Demo Link", type: "text", required: false }
    ]
  },
  skills: {
    label: "Skills",
    endpoint: "/skills",
    fields: [
      { name: "name", label: "Skill Name", type: "text", required: true },
      { name: "type", label: "Category", type: "select", options: ["frontend", "backend", "mobile", "database", "tools"], required: true }
    ]
  },
  experience: {
    label: "Experience",
    endpoint: "/experience",
    fields: [
      { name: "role", label: "Role / Position", type: "text", required: true },
      { name: "company", label: "Company Name", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "period", label: "Period", type: "text", placeholder: "e.g., June 2024 - Present", required: true },
      { name: "stipend", label: "Stipend", type: "text", placeholder: "e.g., Confidential (optional)", required: false },
      { name: "points", label: "Key Responsibilities", type: "list", placeholder: "Add responsibility bullet point", required: true }
    ]
  },
  education: {
    label: "Education",
    endpoint: "/education",
    fields: [
      { name: "degree", label: "Degree / Course", type: "text", required: true },
      { name: "institution", label: "Institution Name", type: "text", required: true },
      { name: "year", label: "Year / Duration", type: "text", placeholder: "e.g., 2021 - 2024", required: true },
      { name: "score", label: "Score / Grade", type: "text", placeholder: "e.g., CGPA: 8.52 or 91%", required: true }
    ]
  },
  certifications: {
    label: "Certifications",
    endpoint: "/certifications",
    fields: [
      { name: "title", label: "Certification Title", type: "text", required: true },
      { name: "issuer", label: "Issuing Organization", type: "text", required: true },
      { name: "note", label: "Note / Grade", type: "text", placeholder: "e.g., Grade: A+ (optional)", required: false }
    ]
  },
  profile: {
    label: "Profile Photo"
  }
};
