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

export const GetDoctorByDepartmentSchema = z.object({
  params: z.object({
    departmentId: z.string().regex(/^\d+$/, "Department ID must be a valid number"),
  }),
});

// 2. Schema for single doctor response
export const GetDoctorByDepartmentIdSchema = z.object({
  EmployeeId: z.number(),
  FullName: z.string(),
  DateOfBirth: z.string().nullable(),
  DateOfJoining: z.string().nullable(),
  Age: z.number().nullable(),
  Gender: z.string().nullable(),
  DepartmentId: z.number(),
  OfficeHour: z.string().nullable(),
  ImageFullPath: z.string().nullable(),
});

// 3. Schema for array of doctors response
export const DoctorsListSchema = z.object({
  success: z.boolean(),
  data: z.array(DoctorSchema),
  count: z.number(),
});

export const GetAllDepartmentsSchema = z.object({});

export const BookAppointmentSchema = z.object({
  body: z.object({
    PatientId: z.number(),
    FirstName: z.string(),
    LastName: z.string(),
    MiddleName: z.string().optional().nullable(), // Optional
    Gender: z.enum(["Male", "Female", "Other"]),
    ContactNumber: z.string(),
    PerformerName: z.string(),
    AppointmentType: z.string(),
    AppointmentDate: z.string(),
    AppointmentTime: z.string(),
    PerformerId: z.number(),
    AppointmentStatus: z.string(),
    CreatedOn: z.string(),
    CreatedBy: z.number(),
    Reason: z.string(),
    CancelledBy: z.number().optional().nullable(),
    CancelledOn: z.string().optional().nullable(),
    CancelledRemarks: z.string().optional().nullable(),
    DepartmentId: z.number(),
    Age: z.string(),
    AgeUnit: z.string(),
    ModifiedBy: z.number().optional().nullable(),
    ModifiedOn: z.string().optional().nullable(),
    DateOfBirth: z.string(),
    AppointmentStartDateTime: z.string(),
    AppointmentEndDateTime: z.string(),
    PreBuffer: z.number(),
    PostBuffer: z.number(),
  }),
});

export const AppointmentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
