const request = require("supertest");
const app = require("../app");
const Certification = require("../db/models/Certification");

jest.mock("../db/models/Certification");
jest.mock("../db/connect", () => jest.fn());

describe("Certifications API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /certifications returns data", async () => {
    Certification.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue([
        { id: "507f1f77bcf86cd799439011", title: "AWS", issuer: "Amazon", note: "good" },
      ]),
    }));

    const res = await request(app).get("/certifications");

    expect(res.statusCode).toBe(200);
  });

  test("POST success", async () => {
    Certification.create.mockResolvedValue({
      id: "507f1f77bcf86cd799439011",
      title: "AWS",
      issuer: "Amazon",
      note: "good",
    });

    const res = await request(app).post("/certifications").send({
      title: "AWS",
      issuer: "Amazon",
      note: "good",
    });

    expect(res.statusCode).toBe(201);
  });

  test("POST missing field returns 400", async () => {
    const res = await request(app).post("/certifications").send({});

    expect(res.statusCode).toBe(400);
  });

  test("PUT not found returns 404", async () => {
    Certification.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put("/certifications/507f1f77bcf86cd799439011").send({
      title: "AWS",
      issuer: "Amazon",
    });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE not found returns 404", async () => {
    Certification.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete("/certifications/507f1f77bcf86cd799439011");

    expect(res.statusCode).toBe(404);
  });

  test("DB error returns 500", async () => {
    Certification.find.mockImplementation(() => ({
      sort: jest.fn().mockRejectedValue(new Error("DB fail")),
    }));

    const res = await request(app).get("/certifications");

    expect(res.statusCode).toBe(500);
  });
});
