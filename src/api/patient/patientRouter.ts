import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  GetPatientSchema,
  PatientSchema,
  ResendOtpSchema,
  SendOtpSchema,
  StartLoginSchema,
  VerifyOtpSchema,
} from "@/api/patient/patientModel";
import { jwtAuth } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
import { patientController } from "./patientController";

export const patientRegistry = new OpenAPIRegistry();
export const patientRouter: Router = express.Router();

patientRegistry.register("Patient", PatientSchema);

patientRegistry.registerPath({
  method: "get",
  path: "/patients/getPatients",
  tags: ["Patient"],
  responses: createApiResponse(z.array(PatientSchema), "Success"),
});

patientRegistry.registerPath({
  method: "get",
  path: "/patients/getPatient/{id}",
  tags: ["Patient"],
  request: { params: GetPatientSchema.shape.params },
  responses: createApiResponse(PatientSchema, "Success"),
});

patientRegistry.registerPath({
  method: "post",
  path: "/patients/register",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        // "application/json": { schema: PatientSchema.omit({ id: true, createdAt: true, updatedAt: true }) },
      },
    },
  },
  responses: createApiResponse(PatientSchema, "Success"),
});

patientRegistry.registerPath({
  method: "post",
  path: "/patients/loginId",
  tags: ["Patient"],
  request: {
    body: {
      content: { "application/json": { schema: StartLoginSchema.shape.body } },
    },
  },
  responses: createApiResponse(
    z.object({
      phoneCountryCode: z.string().optional(),
      phoneNumber: z.string().optional(),
    }),
    "Success",
  ),
});

patientRegistry.registerPath({
  method: "post",
  path: "/patients/sendOtp",
  tags: ["Patient"],
  request: {
    body: {
      content: { "application/json": { schema: SendOtpSchema.shape.body } },
    },
  },
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});

patientRegistry.registerPath({
  method: "post",
  path: "/patients/resendOtp",
  tags: ["Patient"],
  request: {
    body: {
      content: { "application/json": { schema: ResendOtpSchema.shape.body } },
    },
  },
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});

patientRegistry.registerPath({
  method: "post",
  path: "/patients/verifyOtp",
  tags: ["Patient"],
  request: {
    body: {
      content: { "application/json": { schema: VerifyOtpSchema.shape.body } },
    },
  },
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});

// Public routes: register, loginId, sendOtp, verifyOtp, resendOtp
patientRouter.post("/register", patientController.register);
patientRouter.post("/loginId", validateRequest(StartLoginSchema), patientController.matchLoginId);
patientRouter.post("/sendOtp", validateRequest(SendOtpSchema), patientController.sendOtp);
patientRouter.post("/resendOtp", validateRequest(ResendOtpSchema), patientController.sendOtp);
patientRouter.post("/verifyOtp", validateRequest(VerifyOtpSchema), patientController.verifyOtp);

// Protect remaining patient routes
patientRouter.get("/getPatients", jwtAuth(), patientController.getPatients);
patientRouter.get("/getPatient/:id", jwtAuth(), validateRequest(GetPatientSchema), patientController.getPatient);
