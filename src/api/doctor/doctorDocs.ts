import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
// src/routes/doctor/doctorDocs.ts
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  AppointmentResponseSchema,
  BookAppointmentSchema,
  DepartmentSchema,
  DoctorSchema,
  DoctorsListSchema,
  GetDepartmentSchema,
  GetDoctorByDepartmentSchema,
  GetDoctorSchema,
} from "./doctorModel";

export const doctorRegistry = new OpenAPIRegistry();

doctorRegistry.register("Doctor", DoctorSchema);
doctorRegistry.register("Department", DepartmentSchema);

// /doctors/getAllDoctors
doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/getAllDoctors",
  tags: ["Doctor"],
  responses: createApiResponse(z.array(DoctorSchema), "Fetched all doctors"),
});

// /doctors/getDoctor/{id}
doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/getDoctor/{id}",
  tags: ["Doctor"],
  request: { params: GetDoctorSchema.shape.params },
  responses: createApiResponse(DoctorSchema, "Fetched doctor by ID"),
});

// /doctors/departments
doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/departments",
  tags: ["Doctor"],
  responses: createApiResponse(z.array(DepartmentSchema), "Fetched departments"),
});

// /doctors/departments/{id}
doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/departments/{id}",
  tags: ["Doctor"],
  request: { params: GetDepartmentSchema.shape.params },
  responses: createApiResponse(DepartmentSchema, "Fetched department by ID"),
});

// /doctors/getDoctorByDepartmentId/{departmentId}
doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/getDoctorByDepartmentId/{departmentId}",
  tags: ["Doctor"],
  request: { params: GetDoctorByDepartmentSchema.shape.params },
  responses: {
    200: {
      description: "Doctors by department",
      content: { "application/json": { schema: DoctorsListSchema } },
    },
    400: {
      description: "Invalid department ID",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: "No doctors found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            error: z.string().optional(),
          }),
        },
      },
    },
  },
});

// /doctors/bookAppointment
doctorRegistry.registerPath({
  method: "post",
  path: "/doctors/bookAppointment",
  tags: ["Doctor"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: BookAppointmentSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Appointment booked",
      content: { "application/json": { schema: AppointmentResponseSchema } },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            error: z.string().optional(),
          }),
        },
      },
    },
  },
});
