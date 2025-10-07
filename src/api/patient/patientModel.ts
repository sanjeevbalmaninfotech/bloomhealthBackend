import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Patient = z.infer<typeof PatientSchema>;
export const PatientSchema = z.object({
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
    mobileNumber: z.string(),
    countryCode: z.string(),
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
