import { StatusCodes } from "http-status-codes";

import { patientCosmosRepository } from "@/api/patient/patientCosmosRepository";
import type { Patient } from "@/api/patient/patientModel";

import { myResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

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
}

export const patientService = new PatientService();
