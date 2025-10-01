import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Doctor = z.infer<typeof DoctorSchema>;
export const DoctorSchema = z.object({
  id: z.union([z.string(), z.number()]),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  specialty: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetDoctorSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetAllDoctorsSchema = z.object({});

// Departments
export type Department = z.infer<typeof DepartmentSchema>;
export const DepartmentSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetDepartmentSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetAllDepartmentsSchema = z.object({});
