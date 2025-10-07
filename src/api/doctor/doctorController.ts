import { myResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { doctorService } from "./doctorService";

class DoctorController {
  public getAll: RequestHandler = async (_req: Request, res: Response) => {
    console.log("getAllDoctors called --- ");
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
  public getDoctorByDepartmentId = async (req: Request, res: Response) => {
    const departmentId = req.params.departmentId;

    const serviceResponse = await doctorService.getDoctorByDepartmentId(departmentId);
    return handleServiceResponse(serviceResponse, res);
  };

  public bookAppointment: RequestHandler = async (req: Request, res: Response) => {
    try {
      const appointmentDetails = req.body;

      const appointmentBookedResponse = await doctorService.bookAppointment(appointmentDetails);

      return handleServiceResponse(appointmentBookedResponse, res);
    } catch (error) {
      console.error("Error booking appointment:", error);
      const failure = myResponse.failure("Error booking appointment", 500);
      return handleServiceResponse(failure, res);
    }
  };
}

export const doctorController = new DoctorController();
