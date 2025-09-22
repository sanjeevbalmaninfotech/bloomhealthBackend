import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Patient = z.infer<typeof PatientSchema>;
export const PatientSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string(),
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
    password: z.string().min(6),
  }),
});

export const LoginPatientSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
