import { StatusCodes } from "http-status-codes";

import { patientCosmosRepository } from "@/api/patient/patientCosmosRepository";
import type { Patient } from "@/api/patient/patientModel";

import { myResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import { getTokenFromNodeBackend } from "@/utils/getToken/getToken";
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
      const tokenResponse = await getTokenFromNodeBackend();
      const response = await axios.post(`${MAIN_NODE_API_URL}/bloomPatient/register`, patientData, {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
        },
      });

      // Consider any 2xx status as success
      if (!response || response.status < 200 || response.status >= 300) {
        const status = response?.status ?? StatusCodes.CONFLICT;
        logger.error({
          msg: "Unexpected response registering patient",
          status,
          data: response?.data ?? null,
        });
        return myResponse.failure(
          "Error registering patient",
          null,
          status === StatusCodes.CONFLICT ? StatusCodes.CONFLICT : status,
        );
      }

      return myResponse.success<Patient>("Patient registered", response.data);
    } catch (ex) {
      // Handle axios-specific error shapes when possible
      const err = ex as unknown;
      let payload: any = { message: (ex as Error).message };
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

      // axios.isAxiosError is a type guard - use it if available
      if ((axios as any).isAxiosError?.(err)) {
        const aerr = err as any;
        if (aerr.response) {
          // Server responded with a non-2xx status
          payload = {
            message: aerr.message,
            data: aerr.response.data,
            headers: aerr.response.headers,
          };
          statusCode = aerr.response.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
        } else if (aerr.request) {
          // Request made but no response received
          payload = {
            message: "No response received from remote server",
            request: aerr.request,
          };
          statusCode = StatusCodes.BAD_GATEWAY;
        } else {
          // Something happened setting up the request
          payload = { message: aerr.message };
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
      } else {
        // Non-axios error
        payload = {
          message: (ex as Error).message,
          stack: (ex as Error).stack,
        };
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }

      // Log detailed payload for debugging; return generic failure with null responseObject to satisfy typing
      logger.error({ msg: "Error registering patient", error: payload });
      return myResponse.failure("An error occurred while registering patient.", null, statusCode);
    }
  }
}
export const patientService = new PatientService();
