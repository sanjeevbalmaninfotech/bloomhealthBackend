import { myResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

import { env } from "@/common/utils/envConfig";
import { Endpoints } from "@/utils/constant/endPoints/endpoints";
import { getTokenFromNodeBackend } from "@/utils/getToken/getToken";
import axios from "axios";
import type { Doctor } from "./doctorModel";

const MAIN_NODE_API_URL = env.MAIN_NODE_API_URL;
const NODE_TOKEN_GENERATION_ID = env.NODE_TOKEN_GENERATION_ID;
const NODE_TOKEN_GENERATION_SECRET = env.NODE_TOKEN_GENERATION_SECRET;
const payload = {
  tokenId: NODE_TOKEN_GENERATION_ID,
  tokenKey: NODE_TOKEN_GENERATION_SECRET,
};
export class DoctorService {
  async getAllDoctors(): Promise<myResponse<Doctor[] | null>> {
    try {
      const tokenResponse = await getTokenFromNodeBackend();

      const response = await axios.get(`${MAIN_NODE_API_URL}${Endpoints.getAllDoctorsUrl}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
        },
      });
      if (!response || response.status !== 200) {
        return myResponse.failure("Error finding doctors", null, 500);
      }
      return myResponse.success("Doctors found", response.data);
    } catch (ex) {
      return myResponse.failure("Error finding doctors", null, 500);
    }
  }

  async getDoctorById(id: string | number): Promise<myResponse<Doctor | null>> {
    try {
      const tokenResponse = await getTokenFromNodeBackend();
      const response = await axios.get(`${MAIN_NODE_API_URL}${Endpoints.getSingleDoctorUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
        },
      });
      if (!response || response.status !== 200) {
        return myResponse.failure("Error finding doctor", null, 500);
      }
      return myResponse.success("Doctor found", response.data);
    } catch (ex) {
      return myResponse.failure("Error finding doctor", null, 500);
    }
  }

  async getDepartmentsById(id: string | number): Promise<myResponse<Doctor | null>> {
    try {
      const tokenResponse = await getTokenFromNodeBackend();
      const response = await axios.get(`${MAIN_NODE_API_URL}${Endpoints.getSingleDepartmentUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
        },
      });
      if (!response || response.status !== 200) {
        return myResponse.failure("Error finding department", null, 500);
      }
      return myResponse.success("Department found", response.data);
    } catch (ex) {
      return myResponse.failure("Error finding department", null, 500);
    }
  }

  async getDoctorByDepartmentId(departmentId: string): Promise<myResponse<any>> {
    try {
      const tokenResponse = await getTokenFromNodeBackend();

      const response = await axios.get(`${MAIN_NODE_API_URL}${Endpoints.getDoctorByDepartmentIdUrl}${departmentId}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
        },
      });

      if (!response || response.status !== 200) {
        return myResponse.failure("Error finding doctors", null, 500);
      }
      if (response.data.length === 0) {
        return myResponse.failure("No doctors found for this department", null, StatusCodes.NOT_FOUND);
      }
      return myResponse.success("Doctors found", response.data);
    } catch (ex) {
      console.error("Error in getDoctorByDepartmentId:", ex);
      return myResponse.failure("Error finding doctors", null, 500);
    }
  }

  async bookAppointment(appointmentDetails: any): Promise<myResponse<any>> {
    try {
      const tokenResponse = await getTokenFromNodeBackend();
      const axiosResponse = await axios.post(
        `${MAIN_NODE_API_URL}${Endpoints.bookAppointmentUrl}`,
        appointmentDetails,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse}`,
          },
        },
      );

      const status = axiosResponse?.status ?? 200;
      const data = axiosResponse?.data ?? null;

      if (data && typeof data === "object" && "success" in data && "statusCode" in data) {
        return data as myResponse<any>;
      }

      return myResponse.success("Appointment booked", data, status);
    } catch (ex) {
      console.error("Error in bookAppointment - : -", ex);
      const err = ex as any;
      if (err?.response) {
        const resp = err?.response;
        const status = resp?.status ?? 500;
        const data = resp?.data ?? null;

        if (data && typeof data === "object" && "success" in data && "statusCode" in data) {
          return data as myResponse<any>;
        }

        const message = data?.message || "Error booking appointment";
        return myResponse.failure(message, data, status);
      }

      return myResponse.failure("Error booking appointment", null, 500);
    }
  }
}
export const doctorService = new DoctorService();
