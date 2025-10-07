import { jwtAuth } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
// src/routes/patient/patientRoutes.ts
import express from "express";
import { patientController } from "./patientController";
import { GetPatientSchema, ResendOtpSchema, SendOtpSchema, StartLoginSchema, VerifyOtpSchema } from "./patientModel";

const patientRouter = express.Router();

// Public routes
patientRouter.post("/register", patientController.register);
patientRouter.post("/loginId", validateRequest(StartLoginSchema), patientController.matchLoginId);
patientRouter.post("/sendOtp", validateRequest(SendOtpSchema), patientController.sendOtp);
patientRouter.post(
  "/resendOtp",
  validateRequest(ResendOtpSchema),
  patientController.sendOtp, // Assuming resend also uses sendOtp
);
patientRouter.post("/verifyOtp", validateRequest(VerifyOtpSchema), patientController.verifyOtp);

// Protected routes
patientRouter.get("/getPatients", jwtAuth(), patientController.getPatients);
patientRouter.get("/getPatient/:id", jwtAuth(), validateRequest(GetPatientSchema), patientController.getPatient);

export default patientRouter;
