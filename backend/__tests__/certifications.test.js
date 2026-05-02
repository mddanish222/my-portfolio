const request = require("supertest");
const app = require("../app");

jest.mock("../db/pool", () => ({
  query: jest.fn()
}));

const pool = require("../db/pool");

describe("Certifications API", () => {

  test("GET /certifications returns data", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id:1, title:"AWS", issuer:"Amazon", note:"good" }]
    });

    const res = await request(app).get("/certifications");

    expect(res.statusCode).toBe(200);
  });

  test("POST success", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id:1, title:"AWS", issuer:"Amazon", note:"good" }]
    });

    const res = await request(app)
      .post("/certifications")
      .send({
        title:"AWS",
        issuer:"Amazon",
        note:"good"
      });

    expect(res.statusCode).toBe(201);
  });

  test("POST missing field returns 400", async () => {
    const res = await request(app)
      .post("/certifications")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test("PUT not found returns 404", async () => {
    pool.query.mockResolvedValue({ rowCount:0 });

    const res = await request(app)
      .put("/certifications/999")
      .send({
        title:"AWS",
        issuer:"Amazon"
      });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE not found returns 404", async () => {
    pool.query.mockResolvedValue({ rowCount:0 });

    const res = await request(app)
      .delete("/certifications/999");

    expect(res.statusCode).toBe(404);
  });

  test("DB error returns 500", async () => {
    pool.query.mockRejectedValue(new Error("DB fail"));

    const res = await request(app).get("/certifications");

    expect(res.statusCode).toBe(500);
  });

});