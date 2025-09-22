import type { Request, RequestHandler, Response } from "express";

import { patientService } from "@/api/patient/patientService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class PatientController {
  public getPatients: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await patientService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatient: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await patientService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    // No DB: echo back the provided body as the created object
    const payload = req.body;
    const serviceResponse = (await import("@/common/models/serviceResponse")).ServiceResponse.success(
      "Patient registered",
      payload,
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    // No DB: simply echo back a token-like object
    const { email } = req.body as { email?: string };
    const serviceResponse = (await import("@/common/models/serviceResponse")).ServiceResponse.success(
      "Login successful",
      { token: `fake-jwt-token-for-${email ?? "unknown"}` },
    );
    return handleServiceResponse(serviceResponse, res);
  };
}

export const patientController = new PatientController();
