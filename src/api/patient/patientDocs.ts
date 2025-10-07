import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
// src/routes/patient/patientDocs.ts
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  GetPatientSchema,
  PatientSchema,
  ResendOtpSchema,
  SendOtpSchema,
  StartLoginSchema,
  VerifyOtpSchema,
} from "./patientModel";

export const patientRegistry = new OpenAPIRegistry();

patientRegistry.register("Patient", PatientSchema);

// GET /patients/getPatients
patientRegistry.registerPath({
  method: "get",
  path: "/patients/getPatients",
  tags: ["Patient"],
  responses: createApiResponse(z.array(PatientSchema), "Fetched patients"),
});

// GET /patients/getPatient/{id}
patientRegistry.registerPath({
  method: "get",
  path: "/patients/getPatient/{id}",
  tags: ["Patient"],
  request: { params: GetPatientSchema.shape.params },
  responses: createApiResponse(PatientSchema, "Fetched patient by ID"),
});

// POST /patients/register
patientRegistry.registerPath({
  method: "post",
  path: "/patients/register",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        // Uncomment and define a schema for registering if needed
        // "application/json": { schema: PatientSchema.omit({ id: true }) },
      },
    },
  },
  responses: createApiResponse(PatientSchema, "Patient registered"),
});

// POST /patients/loginId
patientRegistry.registerPath({
  method: "post",
  path: "/patients/loginId",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: StartLoginSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({
      phoneCountryCode: z.string().optional(),
      phoneNumber: z.string().optional(),
    }),
    "Login ID matched",
  ),
});

// POST /patients/sendOtp
patientRegistry.registerPath({
  method: "post",
  path: "/patients/sendOtp",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: SendOtpSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ message: z.string() }), "OTP sent"),
});

// POST /patients/resendOtp
patientRegistry.registerPath({
  method: "post",
  path: "/patients/resendOtp",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ResendOtpSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ message: z.string() }), "OTP resent"),
});

// POST /patients/verifyOtp
patientRegistry.registerPath({
  method: "post",
  path: "/patients/verifyOtp",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyOtpSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ token: z.string() }), "OTP verified"),
});
