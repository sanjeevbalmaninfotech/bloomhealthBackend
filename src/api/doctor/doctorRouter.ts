import { jwtAuth } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
// src/routes/doctor/doctorRoutes.ts
import express from "express";
import { doctorController } from "./doctorController";
import {
  BookAppointmentSchema,
  GetDepartmentSchema,
  GetDoctorByDepartmentSchema,
  GetDoctorSchema,
} from "./doctorModel";

const doctorRouter = express.Router();

doctorRouter.use(jwtAuth({ maxAgeSeconds: 60 }));

doctorRouter.get(
  "/getDoctorByDepartmentId/:departmentId",
  validateRequest(GetDoctorByDepartmentSchema),
  doctorController.getDoctorByDepartmentId,
);

doctorRouter.get("/getAllDoctors", doctorController.getAll);

doctorRouter.get("/getDoctor/:id", validateRequest(GetDoctorSchema), doctorController.getById);

doctorRouter.post("/bookAppointment", validateRequest(BookAppointmentSchema), doctorController.bookAppointment);

doctorRouter.get("/departments/:id", validateRequest(GetDepartmentSchema), doctorController.getDepartmentById);

export default doctorRouter;
