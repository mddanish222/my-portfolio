const request = require("supertest");
const app = require("../app");

jest.mock("../db/pool", () => ({
  query: jest.fn()
}));

const pool = require("../db/pool");

describe("Projects API", () => {

  test("GET /projects returns data", async () => {

    pool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          title: "Test Project",
          description: "Demo",
          tech: ["React"],
          type: "Personal",
          status: "Completed"
        }
      ]
    });

    const res = await request(app).get("/projects");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe("Test Project");
    expect(Array.isArray(res.body)).toBe(true);

  });


  test("POST /projects missing title returns 400", async () => {

    const res = await request(app)
      .post("/projects")
      .send({
        desc: "Demo",
        tech: ["React"],
        type: "Personal",
        status: "Completed"
      });

    expect(res.statusCode).toBe(400);

  });


  test("PUT not found returns 404", async () => {

    pool.query.mockResolvedValue({
      rowCount: 0,
      rows: []
    });

    const res = await request(app)
      .put("/projects/999")
      .send({
        title: "Updated",
        desc: "Demo",
        tech: ["React"],
        type: "Personal",
        status: "Completed"
      });

    expect(res.statusCode).toBe(404);

  });


  test("DELETE not found returns 404", async () => {

    pool.query.mockResolvedValue({
      rowCount: 0
    });

    const res = await request(app)
      .delete("/projects/999");

    expect(res.statusCode).toBe(404);

  });


  test("GET database error returns 500", async () => {

    pool.query.mockRejectedValue(
      new Error("DB failed")
    );

    const res = await request(app)
      .get("/projects");

    expect(res.statusCode).toBe(500);

  });
test("POST success returns 201", async () => {

 pool.query.mockResolvedValue({
   rows: [
    {
      id:10,
      title:"New Project",
      description:"Demo",
      tech:["React"],
      type:"Personal",
      status:"Completed"
    }
   ]
 });

 const res = await request(app)
 .post("/projects")
 .send({
    title:"New Project",
    desc:"Demo",
    tech:["React"],
    type:"Personal",
    status:"Completed"
 });

 expect(res.statusCode).toBe(201);
 expect(res.body.title).toBe("New Project");

});


test("PUT success returns 200", async () => {

 pool.query.mockResolvedValue({
   rowCount:1,
   rows:[
    {
      id:1,
      title:"Updated Project",
      description:"Updated",
      tech:["React"],
      type:"Personal",
      status:"Completed"
    }
   ]
 });

 const res = await request(app)
 .put("/projects/1")
 .send({
    title:"Updated Project",
    desc:"Updated",
    tech:["React"],
    type:"Personal",
    status:"Completed"
 });

 expect(res.statusCode).toBe(200);
 expect(res.body.title).toBe("Updated Project");

});


test("DELETE success returns 200", async () => {

 pool.query.mockResolvedValue({
   rowCount:1
 });

 const res = await request(app)
 .delete("/projects/1");

 expect(res.statusCode).toBe(200);
 expect(res.body.message).toBe("Project deleted");

});

test("GET /projects with filter type", async () => {
  pool.query.mockResolvedValueOnce({ rows: [] });

  const res = await request(app).get("/projects?type=Personal");

  expect(res.statusCode).toBe(200);
});

test("PUT /projects invalid id returns 400", async () => {
  const res = await request(app)
    .put("/projects/abc")
    .send({});

  expect(res.statusCode).toBe(400);
});

});