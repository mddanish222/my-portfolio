const request = require("supertest");
const app = require("../app");
const Experience = require("../db/models/Experience");

jest.mock("../db/models/Experience");
jest.mock("../db/connect", () => jest.fn());

describe("Experience API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /experience returns data", async () => {
    Experience.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue([
        { id: "507f1f77bcf86cd799439011", role: "Dev", company: "ABC", location: "BLR", period: "2024", points: ["did work"] },
      ]),
    }));

    const res = await request(app).get("/experience");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].role).toBe("Dev");
  });

  test("POST success", async () => {
    Experience.create.mockResolvedValue({
      id: "507f1f77bcf86cd799439011",
      role: "Dev",
      company: "ABC",
      location: "BLR",
      period: "2024",
      points: ["work"],
    });

    const res = await request(app).post("/experience").send({
      role: "Dev",
      company: "ABC",
      location: "BLR",
      period: "2024",
      points: ["work"],
    });

    expect(res.statusCode).toBe(201);
  });

  test("POST missing field returns 400", async () => {
    const res = await request(app).post("/experience").send({
      company: "ABC",
    });

    expect(res.statusCode).toBe(400);
  });

  test("PUT not found returns 404", async () => {
    Experience.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put("/experience/507f1f77bcf86cd799439011").send({
      role: "Dev",
      company: "ABC",
      location: "BLR",
      period: "2024",
      points: ["work"],
    });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE not found returns 404", async () => {
    Experience.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete("/experience/507f1f77bcf86cd799439011");

    expect(res.statusCode).toBe(404);
  });

  test("DB error returns 500", async () => {
    Experience.find.mockImplementation(() => ({
      sort: jest.fn().mockRejectedValue(new Error("DB fail")),
    }));

    const res = await request(app).get("/experience");

    expect(res.statusCode).toBe(500);
  });
});