import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import { users } from "@/api/user/__tests__/userMockData";
import { UserRepository } from "@/api/user/userRepository";
import { UserService } from "@/api/user/userService";

// beforeAll(async () => {
//   await database.query(
//     "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100))"
//   );
// });

// afterAll(async () => {
//   await database.query("DROP TABLE IF EXISTS users");
//   await database.close();
// });

// describe("userService", () => {
//   it("should create a new user", async () => {
//     const response = await request(app)
//       .post("/api/users")
//       .send({ name: "John Doe" });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.name).toBe("John Doe");
//   });

//   it("should retrieve all users", async () => {
//     const response = await request(app).get("/api/users");

//     expect(response.statusCode).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0);
//   });

//   it("should delete a user", async () => {
//     const response = await request(app)
//       .post("/api/users")
//       .send({ name: "Jane Doe" });

//     const patientId = response.body.id;

//     const deleteResponse = await request(app).delete(`/api/users/${patientId}`);
//     expect(deleteResponse.statusCode).toBe(204);
//   });
// });

vi.mock("@/api/user/userRepository");

describe("userService", () => {
  let userServiceInstance: UserService;
  let userRepositoryInstance: UserRepository;

  beforeEach(() => {
    userRepositoryInstance = new UserRepository();
    userServiceInstance = new UserService(userRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all users", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockReturnValue(users);

      // Act
      const result = await userServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Users found");
      expect(result.responseObject).toEqual(users);
    });

    it("returns a not found error for no users found", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No Users found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await userServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving users.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a user for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockUser = users.find((user) => user.id === testId);
      (userRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockUser);

      // Act
      const result = await userServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("User found");
      expect(result.responseObject).toEqual(mockUser);
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (userRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await userServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding user.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = 1;
      (userRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("User not found");
      expect(result.responseObject).toBeNull();
    });
  });
});
