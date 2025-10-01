import { StatusCodes } from "http-status-codes";

import { patientCosmosRepository } from "@/api/patient/patientCosmosRepository";
import type { Patient } from "@/api/patient/patientModel";

import { myResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import axios from "axios";

const MAIN_NODE_API_URL = env.MAIN_NODE_API_URL;
export class PatientService {
  private patientRepository = patientCosmosRepository as any;

  async findAll(): Promise<myResponse<Patient[] | null>> {
    try {
      const patients = await this.patientRepository.findAllAsync();
      if (!patients || patients.length === 0) {
        return myResponse.failure("No Patients found", null, StatusCodes.NOT_FOUND);
      }
      return myResponse.success<Patient[]>("Patients found", patients);
    } catch (ex) {
      const errorMessage = `Error finding all patients: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return myResponse.failure(
        "An error occurred while retrieving patients.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<myResponse<Patient | null>> {
    try {
      const patient = await this.patientRepository.findByIdAsync(id);
      if (!patient) {
        return myResponse.failure("Patient not found", null, StatusCodes.NOT_FOUND);
      }
      return myResponse.success<Patient>("Patient found", patient);
    } catch (ex) {
      const errorMessage = `Error finding patient with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return myResponse.failure("An error occurred while finding patient.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async register(patientData: Partial<Patient>): Promise<myResponse<Patient | null>> {
    try {
      const response = await axios.post(`${MAIN_NODE_API_URL}`, patientData);
      return myResponse.success<Patient>("Patient registered", response.data);
    } catch (ex) {
      const errorMessage = `Error registering patient: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return myResponse.failure(
        "An error occurred while registering patient.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
export const patientService = new PatientService();
