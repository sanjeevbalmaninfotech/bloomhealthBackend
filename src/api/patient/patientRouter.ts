import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  GetPatientSchema,
  LoginPatientSchema,
  LoginRequestSchema,
  LoginWithPhoneSchema,
  PatientSchema,
  RegisterPatientSchema,
  ResendOtpSchema,
  SendOtpSchema,
  StartLoginSchema,
  VerifyOtpSchema,
} from "@/api/patient/patientModel";
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
  path: "/patients/loginId",
  tags: ["Patient"],
  request: { body: { content: { "application/json": { schema: StartLoginSchema.shape.body } } } },
  responses: createApiResponse(
    z.object({ phoneCountryCode: z.string().optional(), phoneNumber: z.string().optional() }),
    "Success",
  ),
});

patientRouter.post("/start-login", validateRequest(StartLoginSchema), patientController.startLogin);

patientRegistry.registerPath({
  method: "post",
  path: "/patients/send-otp",
  tags: ["Patient"],
  request: { body: { content: { "application/json": { schema: SendOtpSchema.shape.body } } } },
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});

patientRouter.post("/send-otp", validateRequest(SendOtpSchema), patientController.sendOtp);

patientRegistry.registerPath({
  method: "post",
  path: "/patients/resend-otp",
  tags: ["Patient"],
  request: { body: { content: { "application/json": { schema: ResendOtpSchema.shape.body } } } },
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});

patientRouter.post("/resend-otp", validateRequest(ResendOtpSchema), patientController.resendOtp);

patientRegistry.registerPath({
  method: "post",
  path: "/patients/verify-otp",
  tags: ["Patient"],
  request: { body: { content: { "application/json": { schema: VerifyOtpSchema.shape.body } } } },
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});

patientRouter.post("/verify-otp", validateRequest(VerifyOtpSchema), patientController.verifyOtp);
