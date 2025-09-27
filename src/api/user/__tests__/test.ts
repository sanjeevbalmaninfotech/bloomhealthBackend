// app.test.js
const request = require("supertest");
const app = require("./app");
const pool = require("./db");

beforeAll(async () => {
  await pool.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100))");
});

afterAll(async () => {
  await pool.query("DROP TABLE IF EXISTS users");
  await pool.end();
});

describe("User  API", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/api/users").send({ name: "John Doe" });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("John Doe");
  });

  it("should retrieve all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should delete a user", async () => {
    const response = await request(app).post("/api/users").send({ name: "Jane Doe" });
    const patientId = response.body.id;

    const deleteResponse = await request(app).delete(`/api/users/${patientId}`);
    expect(deleteResponse.statusCode).toBe(204);
  });
});
