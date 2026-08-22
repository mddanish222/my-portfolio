const request = require("supertest");
const app = require("../app");
const Setting = require("../db/models/Setting");

jest.mock("../db/models/Setting");
jest.mock("../db/connect", () => jest.fn());

describe("Settings API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /settings/:key returns null when not found", async () => {
    Setting.findOne.mockResolvedValue(null);

    const res = await request(app).get("/settings/profile_photo");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ value: null });
  });

  test("GET /settings/:key returns data when found", async () => {
    Setting.findOne.mockResolvedValue({ key: "profile_photo", value: "data:image/png;base64,1234" });

    const res = await request(app).get("/settings/profile_photo");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ value: "data:image/png;base64,1234" });
  });

  test("GET /settings/:key DB error returns 500", async () => {
    Setting.findOne.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/settings/profile_photo");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  test("POST /settings/:key updates/inserts data", async () => {
    Setting.findOneAndUpdate.mockResolvedValue({ key: "profile_photo", value: "data:image/png;base64,1234" });

    const res = await request(app)
      .post("/settings/profile_photo")
      .send({ value: "data:image/png;base64,1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      key: "profile_photo",
      value: "data:image/png;base64,1234",
    });
  });

  test("POST /settings/:key DB error returns 500", async () => {
    Setting.findOneAndUpdate.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/settings/profile_photo")
      .send({ value: "data:image/png;base64,5678" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
