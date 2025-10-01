import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { doctorController } from "./doctorController";
import { DepartmentSchema, DoctorSchema, GetDepartmentSchema, GetDoctorSchema } from "./doctorModel";

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
  path: "/doctors/{id}",
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

doctorRouter.get("/", doctorController.getAll);
doctorRouter.get("/:id", validateRequest(GetDoctorSchema), doctorController.getById);

doctorRouter.get("/departments/:id", validateRequest(GetDepartmentSchema), doctorController.getDepartmentById);

export default doctorRouter;
