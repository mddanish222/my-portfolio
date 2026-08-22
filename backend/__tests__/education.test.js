const request = require("supertest");
const app = require("../app");
const Education = require("../db/models/Education");

jest.mock("../db/models/Education");
jest.mock("../db/connect", () => jest.fn());

describe("Education API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /education returns data", async () => {
    Education.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue([
        { id: "507f1f77bcf86cd799439011", degree: "BCA", institution: "College", year: "2024", score: "8.5" },
      ]),
    }));

    const res = await request(app).get("/education");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].degree).toBe("BCA");
  });

  test("POST success", async () => {
    Education.create.mockResolvedValue({
      id: "507f1f77bcf86cd799439011",
      degree: "BCA",
      institution: "College",
      year: "2024",
      score: "8.5",
    });

    const res = await request(app).post("/education").send({
      degree: "BCA",
      institution: "College",
      year: "2024",
      score: "8.5",
    });

    expect(res.statusCode).toBe(201);
  });

  test("POST missing field returns 400", async () => {
    const res = await request(app).post("/education").send({
      institution: "College",
    });

    expect(res.statusCode).toBe(400);
  });

  test("PUT not found returns 404", async () => {
    Education.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put("/education/507f1f77bcf86cd799439011").send({
      degree: "BCA",
      institution: "College",
      year: "2024",
      score: "8.5",
    });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE not found returns 404", async () => {
    Education.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete("/education/507f1f77bcf86cd799439011");

    expect(res.statusCode).toBe(404);
  });

  test("DB error returns 500", async () => {
    Education.find.mockImplementation(() => ({
      sort: jest.fn().mockRejectedValue(new Error("DB fail")),
    }));

    const res = await request(app).get("/education");

    expect(res.statusCode).toBe(500);
  });
});