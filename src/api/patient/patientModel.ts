import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Patient = z.infer<typeof PatientSchema>;
export const PatientSchema = z.object({
  // allow id to be string or number because request bodies often send IDs as strings
  id: z.union([z.string(), z.number()]),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),

  phoneCountryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  otp: z.string().optional(),
  otpExpiry: z.date().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetPatientSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Request body schemas for auth endpoints
export const RegisterPatientSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phoneCountryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
});

// For auth flows we accept patientId as either string or number (clients often send strings)
export const VerifyOtpSchema = z.object({
  body: z.union([
    z.object({
      patientId: z.union([z.string(), z.number()]),
      otp: z.string().min(4),
    }),
    z.object({
      phoneCountryCode: z.string().min(1),
      phoneNumber: z.string().min(4),
      otp: z.string().min(4),
    }),
  ]),
});

export const StartLoginSchema = z.object({
  body: z.object({
    patientId: z.union([z.string(), z.number()]),
  }),
});

export const SendOtpSchema = z.object({
  body: z.object({
    patientId: z.union([z.string(), z.number()]),
  }),
});

export const ResendOtpSchema = z.object({
  body: z.object({
    patientId: z.union([z.string(), z.number()]),
  }),
});

export const EmailLoginBody = z.object({ email: z.string().email() }).openapi({ title: "EmailLoginBody" });
export const PhoneLoginBody = z
  .object({
    phoneCountryCode: z.string().min(1),
    phoneNumber: z.string().min(4),
  })
  .openapi({ title: "PhoneLoginBody" });

// Compatibility schema for tests/clients that POST to /patients/login
export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().optional(),
  }),
});
