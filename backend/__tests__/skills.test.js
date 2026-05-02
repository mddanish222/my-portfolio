const request = require("supertest");
const app = require("../app");

jest.mock("../db/pool", () => ({
  query: jest.fn()
}));

const pool = require("../db/pool");

describe("Skills API", () => {

  // ✅ GET success
  test("GET /skills returns data", async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id:1, name:"React", type:"frontend", level:80 }
      ]
    });

    const res = await request(app).get("/skills");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe("React");
  });


  // ✅ POST success
  test("POST /skills success", async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id:1, name:"React", type:"frontend", level:80 }
      ]
    });

    const res = await request(app)
      .post("/skills")
      .send({
        name:"React",
        type:"frontend",
        level:80
      });

    expect(res.statusCode).toBe(201);
  });


  // ❌ LEVEL BELOW 0
  test("POST level below 0 returns 400", async () => {
    const res = await request(app)
      .post("/skills")
      .send({
        name:"React",
        type:"frontend",
        level:-1
      });

    expect(res.statusCode).toBe(400);
  });


  // ❌ LEVEL ABOVE 100
  test("POST level above 100 returns 400", async () => {
    const res = await request(app)
      .post("/skills")
      .send({
        name:"React",
        type:"frontend",
        level:101
      });

    expect(res.statusCode).toBe(400);
  });


  // ✅ EDGE VALUE 0
  test("POST level 0 is valid", async () => {
    pool.query.mockResolvedValue({
      rows:[{ id:1, name:"Test", type:"frontend", level:0 }]
    });

    const res = await request(app)
      .post("/skills")
      .send({
        name:"Test",
        type:"frontend",
        level:0
      });

    expect(res.statusCode).toBe(201);
  });


  // ✅ EDGE VALUE 100
  test("POST level 100 is valid", async () => {
    pool.query.mockResolvedValue({
      rows:[{ id:1, name:"Test", type:"frontend", level:100 }]
    });

    const res = await request(app)
      .post("/skills")
      .send({
        name:"Test",
        type:"frontend",
        level:100
      });

    expect(res.statusCode).toBe(201);
  });


  // ❌ 404 update
  test("PUT not found returns 404", async () => {
    pool.query.mockResolvedValue({ rowCount:0 });

    const res = await request(app)
      .put("/skills/999")
      .send({
        name:"Test",
        type:"frontend",
        level:80
      });

    expect(res.statusCode).toBe(404);
  });


  // ❌ DB error
  test("GET DB error returns 500", async () => {
    pool.query.mockRejectedValue(new Error("DB fail"));

    const res = await request(app).get("/skills");

    expect(res.statusCode).toBe(500);
  });
test("GET / returns API message", async () => {
  const res = await request(app).get("/");

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("message");
});

});