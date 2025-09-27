import { StatusCodes } from "http-status-codes";

import { patientCosmosRepository } from "@/api/patient/patientCosmosRepository";
import type { Patient } from "@/api/patient/patientModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class PatientService {
  private patientRepository = patientCosmosRepository as any;

  async findAll(): Promise<ServiceResponse<Patient[] | null>> {
    try {
      const patients = await this.patientRepository.findAllAsync();
      if (!patients || patients.length === 0) {
        return ServiceResponse.failure("No Patients found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Patient[]>("Patients found", patients);
    } catch (ex) {
      const errorMessage = `Error finding all patients: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving patients.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Patient | null>> {
    try {
      const patient = await this.patientRepository.findByIdAsync(id);
      if (!patient) {
        return ServiceResponse.failure("Patient not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Patient>("Patient found", patient);
    } catch (ex) {
      const errorMessage = `Error finding patient with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding patient.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const patientService = new PatientService();
