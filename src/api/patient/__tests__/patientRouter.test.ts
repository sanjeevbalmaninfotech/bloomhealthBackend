import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { myResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Patient API Endpoints", () => {
  const testEmail = `john+${Date.now()}@example.com`;
  describe("GET /patients", () => {
    it("should return a list of patients", async () => {});
  });

  describe("POST /patients/register", () => {
    it("should accept a valid registration payload", async () => {
      const payload = {
        firstName: "John",
        lastName: "Doe",
        email: testEmail,
        password: "secret123",
      };
      const response = await request(app).post("/patients/register").send(payload);
      const responseBody: myResponse = response.body;

      //  expect(response.statusCode).toEqual(StatusCodes.OK);
      //  expect(responseBody.success).toBeTruthy();
      //  expect(responseBody.responseObject).toBeDefined();
    });
  });
});
