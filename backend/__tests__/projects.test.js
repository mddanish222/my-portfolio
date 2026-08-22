const request = require("supertest");
const app = require("../app");
const Project = require("../db/models/Project");

jest.mock("../db/models/Project");
jest.mock("../db/connect", () => jest.fn());

describe("Projects API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /projects returns data", async () => {
    const mockProjects = [
      {
        id: "507f1f77bcf86cd799439011",
        title: "Test Project",
        description: "Demo",
        desc: "Demo",
        tech: ["React"],
        type: "Personal",
        status: "Completed",
      },
    ];

    Project.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue(mockProjects),
    }));

    const res = await request(app).get("/projects");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe("Test Project");
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /projects missing title returns 400", async () => {
    const res = await request(app).post("/projects").send({
      desc: "Demo",
      tech: ["React"],
      type: "Personal",
      status: "Completed",
    });

    expect(res.statusCode).toBe(400);
  });

  test("PUT not found returns 404", async () => {
    Project.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put("/projects/507f1f77bcf86cd799439011").send({
      title: "Updated",
      desc: "Demo",
      tech: ["React"],
      type: "Personal",
      status: "Completed",
    });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE not found returns 404", async () => {
    Project.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete("/projects/507f1f77bcf86cd799439011");

    expect(res.statusCode).toBe(404);
  });

  test("GET database error returns 500", async () => {
    Project.find.mockImplementation(() => ({
      sort: jest.fn().mockRejectedValue(new Error("DB failed")),
    }));

    const res = await request(app).get("/projects");

    expect(res.statusCode).toBe(500);
  });

  test("POST success returns 201", async () => {
    const newDoc = {
      id: "507f1f77bcf86cd799439011",
      title: "New Project",
      description: "Demo",
      desc: "Demo",
      tech: ["React"],
      type: "Personal",
      status: "Completed",
    };

    Project.create.mockResolvedValue(newDoc);

    const res = await request(app).post("/projects").send({
      title: "New Project",
      desc: "Demo",
      tech: ["React"],
      type: "Personal",
      status: "Completed",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("New Project");
  });

  test("PUT success returns 200", async () => {
    const updatedDoc = {
      id: "507f1f77bcf86cd799439011",
      title: "Updated Project",
      description: "Updated",
      desc: "Updated",
      tech: ["React"],
      type: "Personal",
      status: "Completed",
    };

    Project.findByIdAndUpdate.mockResolvedValue(updatedDoc);

    const res = await request(app).put("/projects/507f1f77bcf86cd799439011").send({
      title: "Updated Project",
      desc: "Updated",
      tech: ["React"],
      type: "Personal",
      status: "Completed",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Project");
  });

  test("DELETE success returns 200", async () => {
    Project.findByIdAndDelete.mockResolvedValue({ id: "507f1f77bcf86cd799439011" });

    const res = await request(app).delete("/projects/507f1f77bcf86cd799439011");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Project deleted");
  });

  test("GET /projects with filter type", async () => {
    Project.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue([]),
    }));

    const res = await request(app).get("/projects?type=Personal");

    expect(res.statusCode).toBe(200);
  });

  test("PUT /projects invalid id returns 400", async () => {
    const res = await request(app).put("/projects/abc").send({});

    expect(res.statusCode).toBe(400);
  });
});