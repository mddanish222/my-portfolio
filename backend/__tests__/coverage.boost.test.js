const request = require("supertest");
const app = require("../app");
const Skill = require("../db/models/Skill");
const Experience = require("../db/models/Experience");
const Education = require("../db/models/Education");
const Certification = require("../db/models/Certification");

jest.mock("../db/models/Skill");
jest.mock("../db/models/Experience");
jest.mock("../db/models/Education");
jest.mock("../db/models/Certification");
jest.mock("../db/connect", () => jest.fn());

describe("Coverage Boost Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===== SKILLS =====
  test("POST /skills invalid level returns 400", async () => {
    const res = await request(app).post("/skills").send({
      name: "React",
      type: "frontend",
      level: 200, // invalid
    });

    expect(res.statusCode).toBe(400);
  });

  test("PUT /skills not found returns 404", async () => {
    Skill.findByIdAndUpdate.mockResolvedValueOnce(null);

    const res = await request(app).put("/skills/507f1f77bcf86cd799439011").send({
      name: "React",
      type: "frontend",
      level: 80,
    });

    expect(res.statusCode).toBe(404);
  });

  // ===== EXPERIENCE =====
  test("POST /experience invalid returns 400", async () => {
    const res = await request(app).post("/experience").send({});

    expect(res.statusCode).toBe(400);
  });

  test("DELETE /experience invalid id returns 400", async () => {
    const res = await request(app).delete("/experience/abc");
    expect(res.statusCode).toBe(400);
  });

  // ===== EDUCATION =====
  test("POST /education invalid returns 400", async () => {
    const res = await request(app).post("/education").send({});

    expect(res.statusCode).toBe(400);
  });

  test("PUT /education not found returns 404", async () => {
    Education.findByIdAndUpdate.mockResolvedValueOnce(null);

    const res = await request(app).put("/education/507f1f77bcf86cd799439011").send({
      degree: "BCA",
      institution: "XYZ",
      year: "2025",
      score: "80%",
    });

    expect(res.statusCode).toBe(404);
  });

  // ===== CERTIFICATIONS =====
  test("POST /certifications invalid returns 400", async () => {
    const res = await request(app).post("/certifications").send({});

    expect(res.statusCode).toBe(400);
  });

  test("DELETE /certifications not found returns 404", async () => {
    Certification.findByIdAndDelete.mockResolvedValueOnce(null);

    const res = await request(app).delete("/certifications/507f1f77bcf86cd799439011");

    expect(res.statusCode).toBe(404);
  });

  // ===== GLOBAL =====
  test("unknown route returns 404", async () => {
    const res = await request(app).get("/unknown");
    expect(res.statusCode).toBe(404);
  });

  test("GET /skills DB error returns 500", async () => {
    Skill.find.mockImplementation(() => ({
      sort: jest.fn().mockRejectedValueOnce(new Error("DB fail")),
    }));

    const res = await request(app).get("/skills");

    expect(res.statusCode).toBe(500);
  });
});