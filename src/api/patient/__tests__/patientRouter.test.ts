import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { myResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Patient API Endpoints", () => {
  const testEmail = `john+${Date.now()}@example.com`;
  describe("GET /patients", () => {
    it("should return a list of patients", async () => {});
  });

  describe("GET /patients/:id", () => {
    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app).get(`/patients/${testId}`);
      const responseBody: myResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      const invalidInput = "abc";
      const response = await request(app).get(`/patients/${invalidInput}`);
      const responseBody: myResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.responseObject).toBeNull();
    });
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

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.responseObject).toBeDefined();
      expect((responseBody.responseObject as any).email).toEqual(payload.email);
    });
  });
});
