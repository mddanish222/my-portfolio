const request = require("supertest");
const app = require("../app");
const pool = require("../db/pool");

jest.mock("../db/pool", () => ({
  query: jest.fn()
}));

describe("Coverage Boost Tests", () => {

  // ===== SKILLS =====
  test("POST /skills invalid level returns 400", async () => {
    const res = await request(app)
      .post("/skills")
      .send({
        name: "React",
        type: "frontend",
        level: 200 // invalid
      });

    expect(res.statusCode).toBe(400);
  });

  test("PUT /skills not found returns 404", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app)
      .put("/skills/1")
      .send({
        name: "React",
        type: "frontend",
        level: 80
      });

    expect(res.statusCode).toBe(404);
  });

  // ===== EXPERIENCE =====
  test("POST /experience invalid returns 400", async () => {
    const res = await request(app)
      .post("/experience")
      .send({}); // missing fields

    expect(res.statusCode).toBe(400);
  });

  test("DELETE /experience invalid id returns 400", async () => {
    const res = await request(app).delete("/experience/abc");
    expect(res.statusCode).toBe(400);
  });

  // ===== EDUCATION =====
  test("POST /education invalid returns 400", async () => {
    const res = await request(app)
      .post("/education")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test("PUT /education not found returns 404", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app)
      .put("/education/1")
      .send({
        degree: "BCA",
        institution: "XYZ",
        year: "2025",
        score: "80%"
      });

    expect(res.statusCode).toBe(404);
  });

  // ===== CERTIFICATIONS =====
  test("POST /certifications invalid returns 400", async () => {
    const res = await request(app)
      .post("/certifications")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test("DELETE /certifications not found returns 404", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).delete("/certifications/1");

    expect(res.statusCode).toBe(404);
  });

  // ===== GLOBAL =====
  test("unknown route returns 404", async () => {
    const res = await request(app).get("/unknown");
    expect(res.statusCode).toBe(404);
  });

  test("GET /skills DB error returns 500", async () => {
    pool.query.mockRejectedValueOnce(new Error("DB fail"));

    const res = await request(app).get("/skills");

    expect(res.statusCode).toBe(500);
  });

});