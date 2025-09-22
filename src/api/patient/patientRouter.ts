import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetPatientSchema, LoginPatientSchema, PatientSchema, RegisterPatientSchema } from "@/api/patient/patientModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { patientController } from "./patientController";

export const patientRegistry = new OpenAPIRegistry();
export const patientRouter: Router = express.Router();

patientRegistry.register("Patient", PatientSchema);

patientRegistry.registerPath({
  method: "get",
  path: "/patients",
  tags: ["Patient"],
  responses: createApiResponse(z.array(PatientSchema), "Success"),
});

patientRouter.get("/", patientController.getPatients);

patientRegistry.registerPath({
  method: "get",
  path: "/patients/{id}",
  tags: ["Patient"],
  request: { params: GetPatientSchema.shape.params },
  responses: createApiResponse(PatientSchema, "Success"),
});

patientRouter.get("/:id", validateRequest(GetPatientSchema), patientController.getPatient);

// Register and Login paths
patientRegistry.registerPath({
  method: "post",
  path: "/patients/register",
  tags: ["Patient"],
  request: { body: { content: { "application/json": { schema: RegisterPatientSchema.shape.body } } } },
  responses: createApiResponse(PatientSchema, "Success"),
});

patientRouter.post("/register", validateRequest(RegisterPatientSchema), patientController.register);

patientRegistry.registerPath({
  method: "post",
  path: "/patients/login",
  tags: ["Patient"],
  request: { body: { content: { "application/json": { schema: LoginPatientSchema.shape.body } } } },
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});

patientRouter.post("/login", validateRequest(LoginPatientSchema), patientController.login);
