const request = require("supertest");
const app = require("../app");

jest.mock("../db/pool", () => ({
  query: jest.fn()
}));

const pool = require("../db/pool");

describe("Experience API", () => {

  test("GET /experience returns data", async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id:1, role:"Dev", company:"ABC", location:"BLR", period:"2024", points:["did work"] }
      ]
    });

    const res = await request(app).get("/experience");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].role).toBe("Dev");
  });

  test("POST success", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id:1, role:"Dev", company:"ABC", location:"BLR", period:"2024", points:["work"] }]
    });

    const res = await request(app)
      .post("/experience")
      .send({
        role:"Dev",
        company:"ABC",
        location:"BLR",
        period:"2024",
        points:["work"]
      });

    expect(res.statusCode).toBe(201);
  });

  test("POST missing field returns 400", async () => {
    const res = await request(app)
      .post("/experience")
      .send({
        company:"ABC"
      });

    expect(res.statusCode).toBe(400);
  });

  test("PUT not found returns 404", async () => {
    pool.query.mockResolvedValue({ rowCount:0 });

    const res = await request(app)
      .put("/experience/999")
      .send({
        role:"Dev",
        company:"ABC",
        location:"BLR",
        period:"2024",
        points:["work"]
      });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE not found returns 404", async () => {
    pool.query.mockResolvedValue({ rowCount:0 });

    const res = await request(app)
      .delete("/experience/999");

    expect(res.statusCode).toBe(404);
  });

  test("DB error returns 500", async () => {
    pool.query.mockRejectedValue(new Error("DB fail"));

    const res = await request(app).get("/experience");

    expect(res.statusCode).toBe(500);
  });

});