import { myResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { doctorService } from "./doctorService";

class DoctorController {
  public getAll: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await doctorService.getAllDoctors();
    return handleServiceResponse(serviceResponse, res);
  };

  public getById: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await doctorService.getDoctorById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public getDepartmentById: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await doctorService.getDepartmentsById(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const doctorController = new DoctorController();
