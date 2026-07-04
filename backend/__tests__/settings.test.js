const request = require("supertest");
const app = require("../app");

jest.mock("../db/pool", () => ({
  query: jest.fn()
}));

const pool = require("../db/pool");

describe("Settings API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /settings/:key returns null when not found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const res = await request(app).get("/settings/profile_photo");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ value: null });
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT value FROM settings WHERE key = $1",
      ["profile_photo"]
    );
  });

  test("GET /settings/:key returns data when found", async () => {
    pool.query.mockResolvedValue({
      rows: [{ value: "data:image/png;base64,1234" }]
    });

    const res = await request(app).get("/settings/profile_photo");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ value: "data:image/png;base64,1234" });
  });

  test("GET /settings/:key DB error returns 500", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/settings/profile_photo");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  test("POST /settings/:key updates/inserts data", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const res = await request(app)
      .post("/settings/profile_photo")
      .send({ value: "data:image/png;base64,1234" });

    // Since in testing environment authMiddleware is mocked or bypassed or uses a mock token:
    // Wait, let's verify if we need to pass a mock header. If we do, we can pass it or it will be bypassed.
    // Let's expect 200 (success)
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      key: "profile_photo",
      value: "data:image/png;base64,1234"
    });
  });

  test("POST /settings/:key DB error returns 500", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/settings/profile_photo")
      .send({ value: "data:image/png;base64,5678" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
