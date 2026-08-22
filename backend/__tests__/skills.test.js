const request = require("supertest");
const app = require("../app");
const Skill = require("../db/models/Skill");

jest.mock("../db/models/Skill");
jest.mock("../db/connect", () => jest.fn());

describe("Skills API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /skills returns data", async () => {
    Skill.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue([
        { id: "507f1f77bcf86cd799439011", name: "React", type: "frontend", level: 80 },
      ]),
    }));

    const res = await request(app).get("/skills");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe("React");
  });

  test("POST /skills success", async () => {
    Skill.create.mockResolvedValue({ id: "507f1f77bcf86cd799439011", name: "React", type: "frontend", level: 80 });

    const res = await request(app).post("/skills").send({
      name: "React",
      type: "frontend",
      level: 80,
    });

    expect(res.statusCode).toBe(201);
  });

  test("POST level below 0 returns 400", async () => {
    const res = await request(app).post("/skills").send({
      name: "React",
      type: "frontend",
      level: -1,
    });

    expect(res.statusCode).toBe(400);
  });

  test("POST level above 100 returns 400", async () => {
    const res = await request(app).post("/skills").send({
      name: "React",
      type: "frontend",
      level: 101,
    });

    expect(res.statusCode).toBe(400);
  });

  test("POST level 0 is valid", async () => {
    Skill.create.mockResolvedValue({ id: "507f1f77bcf86cd799439011", name: "Test", type: "frontend", level: 0 });

    const res = await request(app).post("/skills").send({
      name: "Test",
      type: "frontend",
      level: 0,
    });

    expect(res.statusCode).toBe(201);
  });

  test("POST level 100 is valid", async () => {
    Skill.create.mockResolvedValue({ id: "507f1f77bcf86cd799439011", name: "Test", type: "frontend", level: 100 });

    const res = await request(app).post("/skills").send({
      name: "Test",
      type: "frontend",
      level: 100,
    });

    expect(res.statusCode).toBe(201);
  });

  test("PUT not found returns 404", async () => {
    Skill.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put("/skills/507f1f77bcf86cd799439011").send({
      name: "Test",
      type: "frontend",
      level: 80,
    });

    expect(res.statusCode).toBe(404);
  });

  test("GET DB error returns 500", async () => {
    Skill.find.mockImplementation(() => ({
      sort: jest.fn().mockRejectedValue(new Error("DB fail")),
    }));

    const res = await request(app).get("/skills");

    expect(res.statusCode).toBe(500);
  });

  test("GET / returns API message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});