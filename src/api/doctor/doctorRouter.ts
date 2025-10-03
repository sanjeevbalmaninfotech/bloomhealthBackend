import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { doctorController } from "./doctorController";
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
export const doctorRouter: Router = express.Router();

doctorRegistry.register("Doctor", DoctorSchema);

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors",
  tags: ["Doctor"],
  responses: createApiResponse(z.array(DoctorSchema), "Success"),
});

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/getDoctor/{id}",
  tags: ["Doctor"],
  request: { params: GetDoctorSchema.shape.params },
  responses: createApiResponse(DoctorSchema, "Success"),
});

doctorRegistry.register("Department", DepartmentSchema);
doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/departments",
  tags: ["Doctor"],
  responses: createApiResponse(z.array(DepartmentSchema), "Success"),
});
doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/departments/{id}",
  tags: ["Doctor"],
  request: { params: GetDepartmentSchema.shape.params },
  responses: createApiResponse(DepartmentSchema, "Success"),
});

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/departments/{id}",
  tags: ["Doctor"],
  request: { params: GetDepartmentSchema.shape.params },
  responses: createApiResponse(DepartmentSchema, "Success"),
});

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/getDoctorByDepartmentId/{departmentId}",
  tags: ["Doctor"],
  request: {
    params: GetDoctorByDepartmentSchema.shape.params,
  },
  responses: {
    200: {
      description: "Successfully retrieved doctors",
      content: {
        "application/json": {
          schema: DoctorsListSchema,
        },
      },
    },
    400: {
      description: "Bad Request - Invalid Department ID",
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
      description: "No doctors found for this department",
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
      description: "Internal Server Error",
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
      description: "Appointment booked successfully. ",
      content: {
        "application/json": {
          schema: AppointmentResponseSchema,
        },
      },
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
      description: "Internal Server Error",
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

doctorRouter.get("/getDoctorByDepartmentId/:departmentId", doctorController.getDoctorByDepartmentId);
doctorRouter.get("/", doctorController.getAll);
doctorRouter.get("/getDoctor/:id", validateRequest(GetDoctorSchema), doctorController.getById);

doctorRouter.post("/bookAppointment", validateRequest(BookAppointmentSchema), doctorController.bookAppointment);

doctorRouter.get("/departments/:id", validateRequest(GetDepartmentSchema), doctorController.getDepartmentById);

export default doctorRouter;
